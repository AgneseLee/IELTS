import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { appendToDate, collectExistingWords, WordCollector } from "../src/collector.js";

test("appends unchecked words to the requested date", () => {
  const source = "# Words Collected\n";
  assert.equal(
    appendToDate(source, "2026-08-11", ["blight", "be contingent on"]),
    "# Words Collected\n\n## 2026-08-11\n\n- [ ] blight\n- [ ] be contingent on\n",
  );
});

test("adds to an existing date before the next date", () => {
  const source = [
    "# Words Collected",
    "",
    "## 2026-08-10",
    "",
    "- [ ] deter",
    "",
    "## 2026-08-11",
    "",
    "- [ ] blight",
    "",
  ].join("\n");
  const updated = appendToDate(source, "2026-08-10", ["concur"]);
  assert.match(updated, /- \[ \] deter\n- \[ \] concur\n\n## 2026-08-11/);
});

test("deduplicates pending and processed words globally", async () => {
  const directory = await mkdtemp(join(tmpdir(), "ielts-words-test-"));
  const file = join(directory, "words-collected.md");
  try {
    await writeFile(
      file,
      "# Words Collected\n\n## 2026-08-10\n\n- [ ] blight\n- [x] deter sb from doing sth → 犯罪/负向 1\n",
      "utf8",
    );
    const collector = new WordCollector(file, () => "2026-08-11");
    const result = await collector.collect([
      "Blight.",
      "deter sb from doing sth",
      "be contingent on",
      "be contingent on",
    ]);

    assert.deepEqual(result.added, ["be contingent on"]);
    assert.deepEqual(result.skipped, ["Blight", "deter sb from doing sth"]);
    assert.match(await readFile(file, "utf8"), /## 2026-08-11\n\n- \[ \] be contingent on/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("recognises annotations after completed entries", () => {
  const existing = collectExistingWords("- [x] blight → 环境/负向 1\n- [ ] concur\n");
  assert.deepEqual([...existing], ["blight", "concur"]);
});
