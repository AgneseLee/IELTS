import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod/v4";

import type { PreviewStore } from "./previews.js";

const previewInputSchema = z.object({
  conversation: z
    .string()
    .min(1)
    .max(500_000)
    .describe(
      "The complete current Raycast AI Chat transcript visible to you, including every user and assistant message in chronological order. Do not summarise or omit earlier messages.",
    ),
});

const commitInputSchema = z.object({
  preview_id: z
    .string()
    .uuid()
    .describe("The preview_id returned by preview_session after the user has explicitly confirmed that preview."),
});

export function createIeltsVocabServer(previews: PreviewStore): McpServer {
  const server = new McpServer(
    { name: "ielts-vocab", version: "0.1.0" },
    {
      instructions:
        "When the user asks to organise vocabulary from the current chat, call preview_session with the complete visible transcript. Show its preview and preview_id. Never call commit_preview until the user explicitly confirms the preview. This server only updates logic chains in writing/task2/views-v2.md.",
    },
  );

  server.registerTool(
    "preview_session",
    {
      title: "Preview IELTS vocabulary",
      description:
        "Analyse the complete current chat, collect vocabulary explicitly mentioned by the user, group it into topic-specific IELTS argument chains, and preview extensions or additions to the existing logic chains in views-v2.md. Existing English nodes are retained. Pass the full transcript verbatim; this tool cannot read Raycast chat history itself. This tool does not modify the file.",
      inputSchema: previewInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ conversation }) => {
      try {
        const result = await previews.create(conversation);
        const text = result.additionCount
          ? [
              `预览 ID：${result.previewId}`,
              `计划应用 ${result.additionCount} 项逻辑链变更，跳过 ${result.skippedCount} 项重复或无变化内容。`,
              `预览将在 ${result.expiresAt} 失效。`,
              "",
              result.preview,
              "",
              "请向用户展示以上内容。只有用户明确确认后，才能使用该 preview_id 调用 commit_preview。",
            ].join("\n")
          : [
              `预览 ID：${result.previewId}`,
              "没有发现需要调整的逻辑链。",
              result.skippedCount ? `已跳过 ${result.skippedCount} 条重复项。` : "",
            ]
              .filter(Boolean)
              .join("\n");

        return {
          content: [{ type: "text", text }],
          structuredContent: result,
        };
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "commit_preview",
    {
      title: "Commit IELTS vocabulary preview",
      description:
        "Apply the exact previously generated logic-chain preview to views-v2.md. Call only after the user explicitly confirms the preview. Rejects expired previews and any file changed since preview; it never accepts a path and preserves every English node in an extended chain.",
      inputSchema: commitInputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ preview_id }) => {
      try {
        const result = await previews.commit(preview_id);
        return {
          content: [{ type: "text", text: result.summary }],
          structuredContent: result,
        };
      } catch (error) {
        return toolError(error);
      }
    },
  );

  return server;
}

function toolError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return {
    content: [{ type: "text" as const, text: `操作失败：${message}` }],
    isError: true,
  };
}
