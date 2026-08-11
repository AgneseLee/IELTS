import { createServer } from "node:http";

import { toNodeHandler } from "@modelcontextprotocol/node";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { z } from "zod/v4";

import { WordCollector } from "./collector.js";
import { createIeltsVocabServer } from "./server.js";

const envSchema = z.object({
  HOST: z.string().default("127.0.0.1"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3001),
  WORDS_FILE: z.string().min(1).default("../../words-collected.md"),
});

const config = envSchema.parse(process.env);
const collector = new WordCollector(config.WORDS_FILE);

const mcpHandler = createMcpHandler(() => createIeltsVocabServer(collector), {
  legacy: "stateless",
  responseMode: "json",
  onerror: (error) => console.error("MCP error", error),
});
const nodeMcpHandler = toNodeHandler(mcpHandler, {
  onerror: (error) => console.error("HTTP adapter error", error),
});

const httpServer = createServer(async (request, response) => {
  if (!isAllowedHost(request.headers.host)) {
    response.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
    response.end("Forbidden host");
    return;
  }

  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  if (pathname === "/healthz") {
    response.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ ok: true }));
    return;
  }
  if (pathname !== "/mcp") {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  await nodeMcpHandler(request, response);
});

httpServer.listen(config.PORT, config.HOST, () => {
  console.log(`ielts-vocab MCP listening on http://${config.HOST}:${config.PORT}/mcp`);
});

async function shutdown(signal: string): Promise<void> {
  console.log(`Received ${signal}; shutting down`);
  httpServer.close();
  await mcpHandler.close();
}

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));

function isAllowedHost(hostHeader: string | undefined): boolean {
  if (!hostHeader) return false;
  const hostname = hostHeader.startsWith("[")
    ? hostHeader.slice(1, hostHeader.indexOf("]"))
    : hostHeader.split(":", 1)[0];
  return hostname === "127.0.0.1" || hostname === "localhost" || hostname === "::1";
}
