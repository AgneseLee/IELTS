import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";

import type { DeepSeekExtractor } from "./extractor.js";
import {
  atomicWriteIfUnchanged,
  countChanges,
  extractLogicChainCatalog,
  formatPreview,
  hashContent,
  renderLogicChainChanges,
} from "./markdown.js";
import type { ChangesByTopic, Extraction } from "./types.js";

interface StoredPreview {
  id: string;
  expectedHash: string;
  updatedContent: string;
  applied: ChangesByTopic;
  skipped: ChangesByTopic;
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
    const original = await readFile(this.#filePath, "utf8");
    const extraction = await this.#extractor.extract(conversation, extractLogicChainCatalog(original));
    const requested = groupByTopic(extraction);
    const rendered = renderLogicChainChanges(original, requested);
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
      additionCount: countChanges(rendered.applied),
      skippedCount: countChanges(rendered.skipped),
      preview: formatPreview(rendered.applied, rendered.skipped),
      expiresAt: new Date(expiresAt).toISOString(),
    };
  }

  async commit(previewId: string): Promise<{ additionCount: number; summary: string }> {
    this.#purgeExpired();
    const preview = this.#previews.get(previewId);
    if (!preview) throw new Error("Preview not found or expired; run preview_session again");

    const additionCount = countChanges(preview.applied);
    if (additionCount === 0) {
      this.#previews.delete(previewId);
      return { additionCount: 0, summary: "没有新的逻辑链需要写入。" };
    }

    await atomicWriteIfUnchanged(this.#filePath, preview.expectedHash, preview.updatedContent);
    this.#previews.delete(previewId);
    return {
      additionCount,
      summary: `已在 views-v2.md 应用 ${additionCount} 项逻辑链变更；扩写时保留了原有英文节点。`,
    };
  }

  #purgeExpired(): void {
    const now = Date.now();
    for (const [id, preview] of this.#previews) {
      if (preview.expiresAt <= now) this.#previews.delete(id);
    }
  }
}

export function groupByTopic(extraction: Extraction): ChangesByTopic {
  const grouped: ChangesByTopic = {};
  for (const change of extraction.changes) {
    const bucket = grouped[change.topic] ?? [];
    bucket.push(change);
    grouped[change.topic] = bucket;
  }
  return grouped;
}
