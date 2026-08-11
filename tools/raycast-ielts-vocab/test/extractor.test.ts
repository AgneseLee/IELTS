import assert from "node:assert/strict";
import test from "node:test";

import { DeepSeekExtractor, parseModelJson, parseOllamaContent } from "../src/extractor.js";

test("parseOllamaContent reads a non-streaming Ollama chat response", () => {
  const body = JSON.stringify({ message: { role: "assistant", content: '{"changes":[]}' }, done: true });
  assert.equal(parseOllamaContent(body), '{"changes":[]}');
});

test("parseOllamaContent joins newline-delimited streaming chunks", () => {
  const body = [
    JSON.stringify({ message: { content: '{"changes":' } }),
    JSON.stringify({ message: { content: "[]}" }, done: true }),
  ].join("\n");
  assert.equal(parseOllamaContent(body), '{"changes":[]}');
});

test("parseModelJson tolerates a JSON Markdown fence", () => {
  assert.deepEqual(parseModelJson('```json\n{"changes":[]}\n```'), { changes: [] });
});

test("resolves an Ollama model id to the proxy display name", async () => {
  const requestedModels: string[] = [];
  const fetchImpl: typeof fetch = async (input, init) => {
    const url = String(input);
    if (url.endsWith("/api/tags")) {
      return Response.json({
        models: [{ name: "DeepSeek V4 Flash", model: "deepseek-v4-flash" }],
      });
    }

    const request = JSON.parse(String(init?.body)) as { model: string };
    requestedModels.push(request.model);
    if (request.model === "deepseek-v4-flash") {
      return Response.json({ status: 400, error: "Model deepseek-v4-flash not found" }, { status: 400 });
    }
    return new Response(
      `${JSON.stringify({ message: { content: '{"changes":' } })}\n${JSON.stringify({ message: { content: "[]}" }, done: true })}\n`,
    );
  };

  const extractor = new DeepSeekExtractor({
    endpoint: "http://proxy:3000/api/chat",
    model: "deepseek-v4-flash",
    fetchImpl,
  });

  assert.deepEqual(await extractor.extract("User: hello", "### 科技\n1. 正向: example"), { changes: [] });
  assert.deepEqual(requestedModels, ["deepseek-v4-flash", "DeepSeek V4 Flash"]);
});
