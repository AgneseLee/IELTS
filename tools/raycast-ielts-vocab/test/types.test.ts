import assert from "node:assert/strict";
import test from "node:test";

import { extractionSchema } from "../src/types.js";

const validChange = {
  topic: "科技",
  action: "append",
  target: null,
  polarity: "负向",
  vocabulary: ["digital exclusion"],
  chinese_chain: ["原因", "机制", "结果", "深层影响"],
  english_chain: ["cause", "mechanism", "result", "deeper effect"],
};

test("allows at most two chain changes per topic", () => {
  const result = extractionSchema.safeParse({ changes: [validChange, validChange, validChange] });
  assert.equal(result.success, false);
});

test("requires matching bilingual chain lengths", () => {
  const result = extractionSchema.safeParse({
    changes: [{ ...validChange, english_chain: ["one", "two", "three", "four", "five"] }],
  });
  assert.equal(result.success, false);
});

test("requires a target only when extending a chain", () => {
  assert.equal(extractionSchema.safeParse({ changes: [{ ...validChange, target: 1 }] }).success, false);
  assert.equal(
    extractionSchema.safeParse({ changes: [{ ...validChange, action: "extend", target: null }] }).success,
    false,
  );
});

test("allows each vocabulary item in at most three topics", () => {
  const topics = ["教育", "科技", "社会", "政府"] as const;
  const result = extractionSchema.safeParse({
    changes: topics.map((topic) => ({ ...validChange, topic, vocabulary: ["regulation"] })),
  });
  assert.equal(result.success, false);
});
