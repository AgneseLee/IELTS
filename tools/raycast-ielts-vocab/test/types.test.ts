import assert from "node:assert/strict";
import test from "node:test";

import { extractionSchema } from "../src/types.js";

test("allows at most one placement per topic for each vocabulary item", () => {
  const result = extractionSchema.safeParse({
    items: [
      {
        vocabulary: "regulation",
        placements: [
          {
            topic: "科技",
            collocation: "Introduce technology regulations",
            examples: ["Governments should introduce technology regulations."],
          },
          {
            topic: "科技",
            collocation: "Enforce digital regulations",
            examples: ["Authorities should enforce digital regulations."],
          },
        ],
      },
    ],
  });

  assert.equal(result.success, false);
});
