import { randomUUID } from "node:crypto";
import { chmod, readFile, rename, stat, unlink, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";

export interface CollectionResult {
  date: string;
  added: string[];
  skipped: string[];
}

export class WordCollector {
  readonly #filePath: string;
  readonly #dateProvider: () => string;
  #queue: Promise<void> = Promise.resolve();

  constructor(filePath: string, dateProvider = shanghaiDate) {
    this.#filePath = filePath;
    this.#dateProvider = dateProvider;
  }

  collect(words: string[]): Promise<CollectionResult> {
    const result = this.#queue.then(() => this.#collect(words));
    this.#queue = result.then(() => undefined, () => undefined);
    return result;
  }

  async #collect(words: string[]): Promise<CollectionResult> {
    const original = await readFile(this.#filePath, "utf8");
    const existing = collectExistingWords(original);
    const requested = new Map<string, string>();

    for (const word of words) {
      const display = cleanWord(word);
      if (!display) continue;
      requested.set(normaliseWord(display), display);
    }

    const added: string[] = [];
    const skipped: string[] = [];
    for (const [key, display] of requested) {
      if (existing.has(key)) skipped.push(display);
      else added.push(display);
    }

    const date = this.#dateProvider();
    if (added.length > 0) {
      const updated = appendToDate(original, date, added);
      await atomicWrite(this.#filePath, updated);
    }
    return { date, added, skipped };
  }
}

export function collectExistingWords(source: string): Set<string> {
  const words = new Set<string>();
  for (const match of source.matchAll(/^- \[[ xX]\] (.+)$/gm)) {
    const entry = (match[1] ?? "").split(/\s+→\s+/, 1)[0] ?? "";
    const normalised = normaliseWord(entry);
    if (normalised) words.add(normalised);
  }
  return words;
}

export function appendToDate(source: string, date: string, words: string[]): string {
  const entries = words.map((word) => `- [ ] ${word}`).join("\n");
  const heading = `## ${date}`;
  const headingPattern = new RegExp(`^${escapeRegExp(heading)}\\s*$`, "m");
  const match = headingPattern.exec(source);

  if (!match) return `${source.trimEnd()}\n\n${heading}\n\n${entries}\n`;

  const sectionStart = match.index + match[0].length;
  const nextHeading = source.indexOf("\n## ", sectionStart);
  const sectionEnd = nextHeading < 0 ? source.length : nextHeading;
  const insertionPoint = trimWhitespaceStart(source, sectionEnd, sectionStart);
  return `${source.slice(0, insertionPoint)}\n${entries}${source.slice(insertionPoint)}`;
}

function cleanWord(value: string): string {
  return value
    .normalize("NFKC")
    .trim()
    .replace(/^[-*+]\s+/, "")
    .replace(/^\[[ xX]\]\s*/, "")
    .replace(/[`\r\n|<>#]+/g, " ")
    .replace(/[.!?;:,]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normaliseWord(value: string): string {
  return cleanWord(value).toLocaleLowerCase("en-GB");
}

function shanghaiDate(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

async function atomicWrite(path: string, content: string): Promise<void> {
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

function trimWhitespaceStart(source: string, end: number, minimum: number): number {
  let cursor = end;
  while (cursor > minimum && /\s/.test(source[cursor - 1] ?? "")) cursor -= 1;
  return cursor;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
