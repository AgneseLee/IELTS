import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  atomicWriteIfUnchanged,
  extractLogicChainCatalog,
  hashContent,
  renderLogicChainChanges,
} from "../src/markdown.js";

const viewsPath = new URL("../../../writing/task2/views-v2.md", import.meta.url);

test("extends a chain while preserving every existing English node", async () => {
  const source = await readFile(viewsPath, "utf8");
  const result = renderLogicChainChanges(source, {
    科技: [
      {
        topic: "科技",
        action: "extend",
        target: 1,
        polarity: "正向",
        vocabulary: ["streamline"],
        chinese_chain: ["AI 与自动化", "精简常规流程", "减少重复工作", "提高生产率", "促进经济增长"],
        english_chain: [
          "AI and automation",
          "streamline routine processes",
          "reduce repetitive work",
          "raise productivity",
          "boost economic growth",
        ],
      },
    ],
  });

  assert.equal(result.applied.科技?.length, 1);
  assert.match(
    result.content,
    /`AI and automation → streamline routine processes → reduce repetitive work → raise productivity → boost economic growth`/,
  );
  assert.doesNotMatch(source, /streamline routine processes/);
});

test("appends one numbered chain when no existing chain fits", async () => {
  const source = await readFile(viewsPath, "utf8");
  const result = renderLogicChainChanges(source, {
    科技: [
      {
        topic: "科技",
        action: "append",
        target: null,
        polarity: "负向",
        vocabulary: ["digital exclusion"],
        chinese_chain: ["数字服务快速普及", "弱势群体缺乏设备", "公共服务获取受阻", "社会不平等加剧"],
        english_chain: [
          "rapid digitisation of public services",
          "limited access to devices",
          "digital exclusion",
          "deepen social inequality",
        ],
      },
    ],
  });

  assert.equal(result.applied.科技?.length, 1);
  assert.match(result.content, /\*\*负向 3：\*\* 数字服务快速普及/);
  assert.match(result.content, /`rapid digitisation of public services → limited access to devices → digital exclusion → deepen social inequality`/);
});

test("rejects an extension that removes or paraphrases an existing node", async () => {
  const source = await readFile(viewsPath, "utf8");
  assert.throws(
    () =>
      renderLogicChainChanges(source, {
        科技: [
          {
            topic: "科技",
            action: "extend",
            target: 1,
            polarity: "正向",
            vocabulary: ["streamline"],
            chinese_chain: ["自动化", "精简流程", "提高效率", "促进增长"],
            english_chain: ["automation", "streamline processes", "improve efficiency", "promote growth"],
          },
        ],
      }),
    /remove, reorder, or paraphrase existing collocations/,
  );
});

test("extracts a compact catalogue of existing chains", async () => {
  const catalogue = extractLogicChainCatalog(await readFile(viewsPath, "utf8"));
  assert.match(catalogue, /### 科技/);
  assert.match(catalogue, /1\. 正向: AI 与自动化承担重复任务/);
  assert.match(catalogue, /AI and automation → reduce repetitive work → raise productivity → boost economic growth/);
});

test("refuses to commit when the source changed after preview", async () => {
  const directory = await mkdtemp(join(tmpdir(), "ielts-vocab-test-"));
  const path = join(directory, "views-v2.md");
  try {
    await writeFile(path, "original", "utf8");
    const expectedHash = hashContent("original");
    await writeFile(path, "user edit", "utf8");

    await assert.rejects(atomicWriteIfUnchanged(path, expectedHash, "generated edit"), /changed after preview/);
    assert.equal(await readFile(path, "utf8"), "user edit");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
