import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";

import type { DeepSeekExtractor } from "./extractor.js";
import {
  atomicWriteIfUnchanged,
  countAdditions,
  formatPreview,
  hashContent,
  renderAppendOnly,
} from "./markdown.js";
import type { AdditionsByTopic, Extraction } from "./types.js";

interface StoredPreview {
  id: string;
  expectedHash: string;
  updatedContent: string;
  applied: AdditionsByTopic;
  skipped: AdditionsByTopic;
  expiresAt: number;
}

export interface PreviewResult {
  previewId: string;
  additionCount: number;
  skippedCount: number;
  preview: string;
  expiresAt: string;
}

export class PreviewStore {
  readonly #filePath: string;
  readonly #extractor: DeepSeekExtractor;
  readonly #ttlMs: number;
  readonly #previews = new Map<string, StoredPreview>();

  constructor(filePath: string, extractor: DeepSeekExtractor, ttlMs = 30 * 60 * 1000) {
    this.#filePath = filePath;
    this.#extractor = extractor;
    this.#ttlMs = ttlMs;
  }

  async create(conversation: string): Promise<PreviewResult> {
    this.#purgeExpired();
    const extraction = await this.#extractor.extract(conversation);
    const requested = groupByTopic(extraction);
    const original = await readFile(this.#filePath, "utf8");
    const rendered = renderAppendOnly(original, requested);
    const previewId = randomUUID();
    const expiresAt = Date.now() + this.#ttlMs;

    this.#previews.set(previewId, {
      id: previewId,
      expectedHash: hashContent(original),
      updatedContent: rendered.content,
      applied: rendered.applied,
      skipped: rendered.skipped,
      expiresAt,
    });

    return {
      previewId,
      additionCount: countAdditions(rendered.applied),
      skippedCount: countAdditions(rendered.skipped),
      preview: formatPreview(rendered.applied, rendered.skipped),
      expiresAt: new Date(expiresAt).toISOString(),
    };
  }

  async commit(previewId: string): Promise<{ additionCount: number; summary: string }> {
    this.#purgeExpired();
    const preview = this.#previews.get(previewId);
    if (!preview) throw new Error("Preview not found or expired; run preview_session again");

    const additionCount = countAdditions(preview.applied);
    if (additionCount === 0) {
      this.#previews.delete(previewId);
      return { additionCount: 0, summary: "没有新的语料需要写入。" };
    }

    await atomicWriteIfUnchanged(this.#filePath, preview.expectedHash, preview.updatedContent);
    this.#previews.delete(previewId);
    return {
      additionCount,
      summary: `已向 views-v2.md 追加 ${additionCount} 条主题语料；未删除或替换已有内容。`,
    };
  }

  #purgeExpired(): void {
    const now = Date.now();
    for (const [id, preview] of this.#previews) {
      if (preview.expiresAt <= now) this.#previews.delete(id);
    }
  }
}

export function groupByTopic(extraction: Extraction): AdditionsByTopic {
  const grouped: AdditionsByTopic = {};
  for (const item of extraction.items) {
    for (const placement of item.placements) {
      const bucket = grouped[placement.topic] ?? [];
      bucket.push({ vocabulary: item.vocabulary, ...placement });
      grouped[placement.topic] = bucket;
    }
  }
  return grouped;
}
