import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod/v4";

import type { WordCollector } from "./collector.js";

const collectInputSchema = z.object({
  words: z
    .array(z.string().trim().min(1).max(160))
    .min(1)
    .max(500)
    .describe(
      "A compact list of every reusable IELTS word or phrase in the visible session, plus every term the user explicitly asked about. Exclude vocabulary introduced only by the assistant.",
    ),
});

export function createIeltsVocabServer(collector: WordCollector): McpServer {
  const server = new McpServer(
    { name: "ielts-vocab", version: "0.2.0" },
    {
      instructions:
        "When the user asks to collect vocabulary, inspect the complete visible chat and call collect_words once with a compact list. Include reusable IELTS words and phrases plus every term explicitly queried by the user. Do not pass the transcript. The tool only updates words-collected.md.",
    },
  );

  server.registerTool(
    "collect_words",
    {
      title: "Collect session vocabulary",
      description:
        "Save a compact vocabulary list from the current Raycast session to today's section in words-collected.md. Normalises and globally deduplicates entries. This tool does not analyse or modify views-v2.md.",
      inputSchema: collectInputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ words }) => {
      try {
        const result = await collector.collect(words);
        const text = result.added.length
          ? `已写入 ${result.date}：${result.added.length} 个词汇；跳过 ${result.skipped.length} 个已有词汇。`
          : `没有新词汇需要写入；已跳过 ${result.skipped.length} 个已有词汇。`;
        return { content: [{ type: "text", text }], structuredContent: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: "text" as const, text: `操作失败：${message}` }],
          isError: true,
        };
      }
    },
  );

  return server;
}
