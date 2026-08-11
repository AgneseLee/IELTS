import { createHash, randomUUID } from "node:crypto";
import { chmod, readFile, rename, stat, unlink, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";

import { TOPICS, type AdditionsByTopic, type Topic, type TopicAddition } from "./types.js";

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
  applied: AdditionsByTopic;
  skipped: AdditionsByTopic;
}

interface CorpusRegion {
  codeContentEnd: number;
  regionEnd: number;
  existingCollocations: Set<string>;
}

export function hashContent(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

export function renderAppendOnly(source: string, requested: AdditionsByTopic): RenderResult {
  const edits: Array<{ at: number; text: string; order: number }> = [];
  const applied: AdditionsByTopic = {};
  const skipped: AdditionsByTopic = {};

  for (const topic of TOPICS) {
    const additions = requested[topic] ?? [];
    if (additions.length === 0) continue;

    const region = locateCorpusRegion(source, topic);
    const seen = new Set(region.existingCollocations);
    const accepted: TopicAddition[] = [];
    const rejected: TopicAddition[] = [];

    for (const addition of additions) {
      const normalised = normaliseCollocation(addition.collocation);
      if (seen.has(normalised)) {
        rejected.push(addition);
        continue;
      }
      seen.add(normalised);
      accepted.push(addition);
    }

    if (rejected.length > 0) skipped[topic] = rejected;
    if (accepted.length === 0) continue;
    applied[topic] = accepted;

    const suffix = accepted.map(({ collocation }) => ` / ${cleanInline(collocation)}`).join("");
    edits.push({ at: region.codeContentEnd, text: suffix, order: 0 });
    edits.push({ at: region.regionEnd, text: renderExamples(accepted, source, region.regionEnd), order: 1 });
  }

  let content = source;
  for (const edit of edits.sort((a, b) => b.at - a.at || b.order - a.order)) {
    content = `${content.slice(0, edit.at)}${edit.text}${content.slice(edit.at)}`;
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

export function countAdditions(additions: AdditionsByTopic): number {
  return Object.values(additions).reduce((sum, items) => sum + (items?.length ?? 0), 0);
}

export function formatPreview(applied: AdditionsByTopic, skipped: AdditionsByTopic): string {
  const lines: string[] = [];
  for (const topic of TOPICS) {
    const items = applied[topic];
    if (!items?.length) continue;
    lines.push(`### ${topic}`);
    for (const item of items) {
      lines.push(`- \`${item.collocation}\`（来自：${item.vocabulary}）`);
      for (const example of item.examples) lines.push(`  - ${example}`);
    }
    lines.push("");
  }

  const skippedCount = countAdditions(skipped);
  if (skippedCount > 0) lines.push(`已跳过 ${skippedCount} 条与现有语料重复的搭配。`);
  return lines.join("\n").trim();
}

function locateCorpusRegion(source: string, topic: Topic): CorpusRegion {
  const heading = DAY_HEADINGS[topic];
  const dayStart = lineStartIndex(source, heading);
  if (dayStart < 0) throw new Error(`Missing expected topic heading: ${heading}`);

  const nextDay = source.indexOf("\n## Day ", dayStart + heading.length);
  const dayEnd = nextDay < 0 ? source.length : nextDay + 1;
  const sectionHeading = "### 语料";
  const sectionStart = lineStartIndex(source, sectionHeading, dayStart, dayEnd);
  if (sectionStart < 0) throw new Error(`Missing 语料 section under ${heading}`);

  const nextSection = source.indexOf("\n### ", sectionStart + sectionHeading.length);
  const regionEndRaw = nextSection < 0 || nextSection >= dayEnd ? dayEnd : nextSection + 1;
  const regionText = source.slice(sectionStart + sectionHeading.length, regionEndRaw);
  const codeMatch = /\n\s*`([^`\r\n]*)`/.exec(regionText);
  if (!codeMatch || codeMatch.index === undefined) {
    throw new Error(`Missing inline collocation bank under ${heading}`);
  }

  const codeText = codeMatch[1] ?? "";
  const fullMatch = codeMatch[0];
  const codeOpen = sectionStart + sectionHeading.length + codeMatch.index + fullMatch.indexOf("`");
  const codeContentEnd = codeOpen + 1 + codeText.length;
  const regionEnd = trimTrailingBlankLinesStart(source, regionEndRaw, codeContentEnd + 1);

  const existingCollocations = new Set(
    codeText.split("/").map(normaliseCollocation).filter(Boolean),
  );
  const corpusBody = source.slice(codeContentEnd + 1, regionEndRaw);
  for (const match of corpusBody.matchAll(/^- \*\*([^*]+)\*\*/gm)) {
    if (match[1]) existingCollocations.add(normaliseCollocation(match[1]));
  }

  return { codeContentEnd, regionEnd, existingCollocations };
}

function renderExamples(additions: TopicAddition[], source: string, at: number): string {
  const prefix = source.slice(Math.max(0, at - 2), at).endsWith("\n\n") ? "" : "\n";
  const entries = additions.map((addition) => {
    const sentences = addition.examples.map((example) => `  - ${cleanSentence(example)}`).join("\n");
    return `- **${cleanInline(addition.collocation)}**\n${sentences}`;
  });
  return `${prefix}\n${entries.join("\n\n")}`;
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

function normaliseCollocation(value: string): string {
  return value
    .normalize("NFKC")
    .trim()
    .replace(/[.!?;:,]+$/g, "")
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("en-GB");
}

function cleanInline(value: string): string {
  return value
    .trim()
    .replace(/[`\r\n/*_[\]<>#]+/g, " ")
    .replace(/\s+/g, " ");
}

function cleanSentence(value: string): string {
  return value.trim().replace(/[\r\n]+/g, " ").replace(/\s+/g, " ");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
