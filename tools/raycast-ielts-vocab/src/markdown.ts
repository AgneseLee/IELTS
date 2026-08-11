import { createHash, randomUUID } from "node:crypto";
import { chmod, readFile, rename, stat, unlink, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";

import {
  TOPICS,
  type ChangesByTopic,
  type LogicChainChange,
  type Polarity,
  type Topic,
} from "./types.js";

const DAY_HEADINGS: Record<Topic, string> = {
  教育: "## Day 1 教育类",
  科技: "## Day 2 科技类",
  社会: "## Day 3 社会类",
  政府: "## Day 4 政府类",
  媒体: "## Day 5 媒体类",
  国际: "## Day 6 国际类",
  犯罪: "## Day 7 犯罪类",
  文化: "## Day 8 文化类",
  旅游: "## Day 9 旅游类",
  环境: "## Day 10 环境类",
  健康: "## Day 11 健康类",
  工作: "## Day 12 工作类",
};

export interface RenderResult {
  content: string;
  applied: ChangesByTopic;
  skipped: ChangesByTopic;
}

interface LogicRegion {
  end: number;
  chains: ExistingChain[];
}

interface ExistingChain {
  ordinal: number;
  polarity: Polarity;
  polarityIndex: number;
  chinese: string[];
  english: string[];
  start: number;
  end: number;
}

export function hashContent(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

export function extractLogicChainCatalog(source: string): string {
  const lines: string[] = [];
  for (const topic of TOPICS) {
    const region = locateLogicRegion(source, topic);
    lines.push(`### ${topic}`);
    for (const chain of region.chains) {
      lines.push(
        `${chain.ordinal}. ${chain.polarity}: ${chain.chinese.join(" → ")}`,
        `   ${chain.english.join(" → ")}`,
      );
    }
    lines.push("");
  }
  return lines.join("\n").trim();
}

export function renderLogicChainChanges(source: string, requested: ChangesByTopic): RenderResult {
  const edits: Array<{ at: number; end: number; text: string }> = [];
  const applied: ChangesByTopic = {};
  const skipped: ChangesByTopic = {};

  for (const topic of TOPICS) {
    const changes = requested[topic] ?? [];
    if (changes.length === 0) continue;

    const region = locateLogicRegion(source, topic);
    const accepted: LogicChainChange[] = [];
    const rejected: LogicChainChange[] = [];
    const seenChains = new Set(region.chains.map((chain) => normaliseChain(chain.english)));
    let nextOrdinal = Math.max(...region.chains.map((chain) => chain.ordinal), 0) + 1;
    const nextPolarityIndex: Record<Polarity, number> = {
      正向: Math.max(...region.chains.filter((chain) => chain.polarity === "正向").map((chain) => chain.polarityIndex), 0) + 1,
      负向: Math.max(...region.chains.filter((chain) => chain.polarity === "负向").map((chain) => chain.polarityIndex), 0) + 1,
    };
    const appended: string[] = [];

    for (const change of changes) {
      const chinese = change.chinese_chain.map(cleanNode);
      const english = change.english_chain.map(cleanNode);
      const normalised = normaliseChain(english);

      if (change.action === "extend") {
        const target = region.chains.find((chain) => chain.ordinal === change.target);
        if (!target) throw new Error(`${topic} logic chain ${change.target} does not exist`);
        if (change.polarity !== target.polarity) {
          throw new Error(`${topic} logic chain ${change.target} must retain its ${target.polarity} polarity`);
        }
        if (!isOrderedSubset(target.english, english)) {
          throw new Error(`${topic} logic chain ${change.target} would remove, reorder, or paraphrase existing collocations`);
        }
        if (normalised === normaliseChain(target.english)) {
          rejected.push(change);
          continue;
        }
        edits.push({
          at: target.start,
          end: target.end,
          text: renderChain(target.ordinal, target.polarity, target.polarityIndex, chinese, english),
        });
      } else {
        if (seenChains.has(normalised)) {
          rejected.push(change);
          continue;
        }
        seenChains.add(normalised);
        appended.push(
          renderChain(nextOrdinal, change.polarity, nextPolarityIndex[change.polarity], chinese, english),
        );
        nextOrdinal += 1;
        nextPolarityIndex[change.polarity] += 1;
      }
      accepted.push(change);
    }

    if (appended.length > 0) {
      edits.push({ at: region.end, end: region.end, text: `\n\n${appended.join("\n\n")}` });
    }
    if (accepted.length > 0) applied[topic] = accepted;
    if (rejected.length > 0) skipped[topic] = rejected;
  }

  let content = source;
  for (const edit of edits.sort((a, b) => b.at - a.at)) {
    content = `${content.slice(0, edit.at)}${edit.text}${content.slice(edit.end)}`;
  }
  return { content, applied, skipped };
}

export async function atomicWriteIfUnchanged(path: string, expectedHash: string, content: string): Promise<void> {
  const current = await readFile(path, "utf8");
  if (hashContent(current) !== expectedHash) {
    throw new Error("views-v2.md changed after preview; run preview_session again");
  }

  const fileStat = await stat(path);
  const temporary = join(dirname(path), `.${basename(path)}.${randomUUID()}.tmp`);
  try {
    await writeFile(temporary, content, { encoding: "utf8", flag: "wx", mode: fileStat.mode });
    await chmod(temporary, fileStat.mode);
    await rename(temporary, path);
  } catch (error) {
    await unlink(temporary).catch(() => undefined);
    throw error;
  }
}

export function countChanges(changes: ChangesByTopic): number {
  return Object.values(changes).reduce((sum, items) => sum + (items?.length ?? 0), 0);
}

export function formatPreview(applied: ChangesByTopic, skipped: ChangesByTopic): string {
  const lines: string[] = [];
  for (const topic of TOPICS) {
    const changes = applied[topic];
    if (!changes?.length) continue;
    lines.push(`### ${topic}`);
    for (const change of changes) {
      const operation = change.action === "extend" ? `扩写链 #${change.target}` : `新增${change.polarity}链`;
      lines.push(
        `- **${operation}**（词汇：${change.vocabulary.join("、")}）`,
        `  - ${change.chinese_chain.join(" → ")}`,
        `  - \`${change.english_chain.join(" → ")}\``,
      );
    }
    lines.push("");
  }

  const skippedCount = countChanges(skipped);
  if (skippedCount > 0) lines.push(`已跳过 ${skippedCount} 条重复或无变化逻辑链。`);
  return lines.join("\n").trim();
}

function locateLogicRegion(source: string, topic: Topic): LogicRegion {
  const heading = DAY_HEADINGS[topic];
  const dayStart = lineStartIndex(source, heading);
  if (dayStart < 0) throw new Error(`Missing expected topic heading: ${heading}`);

  const nextDay = source.indexOf("\n## Day ", dayStart + heading.length);
  const dayEnd = nextDay < 0 ? source.length : nextDay + 1;
  const sectionHeading = "### 逻辑链";
  const sectionStart = lineStartIndex(source, sectionHeading, dayStart, dayEnd);
  if (sectionStart < 0) throw new Error(`Missing 逻辑链 section under ${heading}`);

  const nextSection = source.indexOf("\n### ", sectionStart + sectionHeading.length);
  const sectionEndRaw = nextSection < 0 || nextSection >= dayEnd ? dayEnd : nextSection + 1;
  const regionEnd = trimTrailingBlankLinesStart(source, sectionEndRaw, sectionStart + sectionHeading.length);
  const bodyStart = source.indexOf("\n", sectionStart) + 1;
  const body = source.slice(bodyStart, regionEnd);
  const pattern = /^(\d+)\. \*\*(正向|负向) (\d+)：\*\*[ \t]*(.*?)\r?\n[ \t]+`([^`\r\n]+)`/gm;
  const chains: ExistingChain[] = [];

  for (const match of body.matchAll(pattern)) {
    if (match.index === undefined) continue;
    chains.push({
      ordinal: Number(match[1]),
      polarity: match[2] as Polarity,
      polarityIndex: Number(match[3]),
      chinese: splitChain(match[4] ?? ""),
      english: splitChain(match[5] ?? ""),
      start: bodyStart + match.index,
      end: bodyStart + match.index + match[0].length,
    });
  }
  if (chains.length === 0) throw new Error(`Missing numbered logic chains under ${heading}`);
  return { end: regionEnd, chains };
}

function renderChain(
  ordinal: number,
  polarity: Polarity,
  polarityIndex: number,
  chinese: string[],
  english: string[],
): string {
  return `${ordinal}. **${polarity} ${polarityIndex}：** ${chinese.join(" → ")}\n    \`${english.join(" → ")}\``;
}

function splitChain(value: string): string[] {
  return value.split(/\s*→\s*/).map((node) => node.trim()).filter(Boolean);
}

function isOrderedSubset(existing: string[], proposed: string[]): boolean {
  let cursor = 0;
  for (const node of proposed) {
    if (normaliseNode(node) === normaliseNode(existing[cursor] ?? "")) cursor += 1;
  }
  return cursor === existing.length;
}

function normaliseChain(nodes: string[]): string {
  return nodes.map(normaliseNode).join("→");
}

function normaliseNode(value: string): string {
  return value.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("en-GB");
}

function cleanNode(value: string): string {
  return value.trim().replace(/[`\r\n|<>#]+/g, " ").replace(/\s+/g, " ");
}

function lineStartIndex(source: string, exactLine: string, from = 0, to = source.length): number {
  const pattern = new RegExp(`^${escapeRegExp(exactLine)}\\s*$`, "gm");
  pattern.lastIndex = from;
  const match = pattern.exec(source);
  return match && match.index < to ? match.index : -1;
}

function trimTrailingBlankLinesStart(source: string, end: number, minimum: number): number {
  let cursor = end;
  while (cursor > minimum && /[\r\n]/.test(source[cursor - 1] ?? "")) cursor -= 1;
  return cursor;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
