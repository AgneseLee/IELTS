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
            changes: [
              {
                topic: "科技",
                action: "append",
                target: null,
                polarity: "负向",
                vocabulary: ["regulatory vacuum"],
                chinese_chain: [
                  "技术发展过快",
                  "监管形成真空",
                  "企业滥用个人数据",
                  "公众信任下降",
                ],
                english_chain: [
                  "rapid technological change",
                  "create a regulatory vacuum",
                  "corporate misuse of personal data",
                  "erode public trust",
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
    assert.doesNotMatch(await readFile(temporaryViews, "utf8"), /create a regulatory vacuum/);

    const committed = await previews.commit(preview.previewId);
    assert.equal(committed.additionCount, 1);
    assert.match(await readFile(temporaryViews, "utf8"), /create a regulatory vacuum/);
    await assert.rejects(previews.commit(preview.previewId), /not found or expired/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
