import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { atomicWriteIfUnchanged, hashContent, renderAppendOnly } from "../src/markdown.js";

const viewsPath = new URL("../../../writing/task2/views-v2.md", import.meta.url);

test("appends a collocation suffix and labelled examples inside the matching subject", async () => {
  const source = await readFile(viewsPath, "utf8");
  const result = renderAppendOnly(source, {
    科技: [
      {
        vocabulary: "regulation",
        topic: "科技",
        collocation: "Introduce stricter technology regulations",
        examples: [
          "Governments should introduce stricter technology regulations to protect personal data.",
          "Clear rules can prevent companies from misusing sensitive information.",
        ],
      },
    ],
  });

  assert.equal(result.applied.科技?.length, 1);
  assert.match(
    result.content,
    /Promote educational equality \/ Introduce stricter technology regulations`\n\n- \*\*Introduce stricter technology regulations\*\*\n  - Governments should introduce stricter technology regulations to protect personal data\.\n  - Clear rules can prevent companies from misusing sensitive information\.\n\n### 逻辑链/,
  );
  assert.equal(
    result.content.replace(" / Introduce stricter technology regulations", "").replace(
      "\n\n- **Introduce stricter technology regulations**\n  - Governments should introduce stricter technology regulations to protect personal data.\n  - Clear rules can prevent companies from misusing sensitive information.",
      "",
    ),
    source,
  );
});

test("skips duplicates without changing the document", async () => {
  const source = await readFile(viewsPath, "utf8");
  const result = renderAppendOnly(source, {
    科技: [
      {
        vocabulary: "efficiency",
        topic: "科技",
        collocation: "enhance work efficiency.",
        examples: ["Technology can enhance work efficiency."],
      },
    ],
  });

  assert.equal(result.content, source);
  assert.equal(result.applied.科技, undefined);
  assert.equal(result.skipped.科技?.length, 1);
});

test("rejects a document whose expected topic structure is missing", () => {
  assert.throws(
    () =>
      renderAppendOnly("## Day 1 教育类\n\n### 语料\n\n`Example`\n", {
        科技: [
          {
            vocabulary: "privacy",
            topic: "科技",
            collocation: "Protect individual privacy",
            examples: ["Technology companies should protect individual privacy."],
          },
        ],
      }),
    /Missing expected topic heading/,
  );
});

test("refuses to commit when the source changed after preview", async () => {
  const directory = await mkdtemp(join(tmpdir(), "ielts-vocab-test-"));
  const path = join(directory, "views-v2.md");
  try {
    await writeFile(path, "original", "utf8");
    const expectedHash = hashContent("original");
    await writeFile(path, "user edit", "utf8");

    await assert.rejects(
      atomicWriteIfUnchanged(path, expectedHash, "generated edit"),
      /changed after preview/,
    );
    assert.equal(await readFile(path, "utf8"), "user edit");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
