import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { DeepSeekExtractor } from "../src/extractor.js";
import { PreviewStore } from "../src/previews.js";

const viewsPath = new URL("../../../writing/task2/views-v2.md", import.meta.url);

test("commits only the content captured by a confirmed preview", async () => {
  const directory = await mkdtemp(join(tmpdir(), "ielts-preview-test-"));
  const temporaryViews = join(directory, "views-v2.md");
  try {
    await writeFile(temporaryViews, await readFile(viewsPath, "utf8"), "utf8");
    const fetchImpl: typeof fetch = async () =>
      Response.json({
        message: {
          content: JSON.stringify({
            items: [
              {
                vocabulary: "regulation",
                placements: [
                  {
                    topic: "科技",
                    collocation: "Introduce stricter technology regulations",
                    examples: ["Governments should regulate emerging technologies carefully."],
                  },
                ],
              },
            ],
          }),
        },
      });
    const extractor = new DeepSeekExtractor({
      endpoint: "http://proxy:3000/api/chat",
      model: "DeepSeek V4 Flash",
      fetchImpl,
    });
    const previews = new PreviewStore(temporaryViews, extractor);

    const preview = await previews.create("User: Teach me the word regulation.");
    assert.equal(preview.additionCount, 1);
    assert.doesNotMatch(await readFile(temporaryViews, "utf8"), /Introduce stricter technology regulations/);

    const committed = await previews.commit(preview.previewId);
    assert.equal(committed.additionCount, 1);
    assert.match(await readFile(temporaryViews, "utf8"), /Introduce stricter technology regulations/);
    await assert.rejects(previews.commit(preview.previewId), /not found or expired/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
