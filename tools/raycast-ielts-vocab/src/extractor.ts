import { extractionSchema, type Extraction } from "./types.js";

const SYSTEM_PROMPT = `You extract IELTS Writing Task 2 vocabulary from a Raycast AI Chat transcript.

Return valid JSON only, with this exact shape:
{"items":[{"vocabulary":"regulation","placements":[{"topic":"科技","collocation":"Introduce stricter technology regulations","examples":["Sentence one.","Sentence two."]}]}]}

Rules:
1. Candidate vocabulary MUST come from USER messages. Assistant messages are context only.
2. Always include words or phrases that the user explicitly asks about, marks for learning, or discusses as vocabulary. Do not collect ordinary function words.
3. Create IELTS Task 2-ready collocations rather than isolated words.
4. Assign each vocabulary item to at most three genuinely relevant topics, choosing only from: 教育, 科技, 社会, 政府, 媒体, 国际, 犯罪, 文化, 旅游, 环境, 健康, 工作.
5. For each chosen topic, provide exactly one topic-specific collocation and one or two natural IELTS-style example sentences.
6. Start each new collocation with a capital letter. Use British English in newly generated text.
7. Do not invent a vocabulary item that the user did not mention.
8. If there are no learning-target vocabulary items, return {"items":[]}.
9. Do not use Markdown fences or add commentary.`;

export interface ExtractorOptions {
  endpoint: string;
  model: string;
  fetchImpl?: typeof fetch;
  maxAttempts?: number;
}

interface OllamaChunk {
  message?: { content?: string };
  response?: string;
  error?: string;
}

export class DeepSeekExtractor {
  readonly #endpoint: string;
  readonly #model: string;
  readonly #fetch: typeof fetch;
  readonly #maxAttempts: number;
  #resolvedModel: string | undefined;

  constructor(options: ExtractorOptions) {
    this.#endpoint = options.endpoint;
    this.#model = options.model;
    this.#fetch = options.fetchImpl ?? fetch;
    this.#maxAttempts = options.maxAttempts ?? 3;
  }

  async extract(conversation: string): Promise<Extraction> {
    let repair = "";
    let lastError: unknown;

    for (let attempt = 1; attempt <= this.#maxAttempts; attempt += 1) {
      try {
        const content = await this.#complete(conversation, repair);
        const json = parseModelJson(content);
        return extractionSchema.parse(json);
      } catch (error) {
        lastError = error;
        repair = `\nYour previous response failed validation: ${errorMessage(error)}. Return corrected JSON only.`;
      }
    }

    throw new Error(`DeepSeek extraction failed after ${this.#maxAttempts} attempts: ${errorMessage(lastError)}`);
  }

  async #complete(conversation: string, repair: string): Promise<string> {
    const model = this.#resolvedModel ?? this.#model;
    let response = await this.#request(model, conversation, repair);
    let body = await response.text();

    if (!response.ok && response.status === 400 && /model.+not found/i.test(body)) {
      const resolved = await this.#resolveModelName(model);
      if (resolved && resolved !== model) {
        this.#resolvedModel = resolved;
        response = await this.#request(resolved, conversation, repair);
        body = await response.text();
      }
    }

    if (!response.ok) {
      throw new Error(`DeepSeek proxy returned HTTP ${response.status}: ${body.slice(0, 500)}`);
    }

    return parseOllamaContent(body);
  }

  async #request(model: string, conversation: string, repair: string): Promise<Response> {
    return this.#fetch(this.#endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        format: "json",
        messages: [
          { role: "system", content: `${SYSTEM_PROMPT}${repair}` },
          { role: "user", content: `Full chat transcript:\n\n${conversation}` },
        ],
      }),
      signal: AbortSignal.timeout(120_000),
    });
  }

  async #resolveModelName(configuredModel: string): Promise<string | undefined> {
    const tagsUrl = new URL(this.#endpoint);
    tagsUrl.pathname = tagsUrl.pathname.replace(/\/chat$/, "/tags");
    const response = await this.#fetch(tagsUrl, { signal: AbortSignal.timeout(10_000) });
    if (!response.ok) return undefined;

    const payload = (await response.json()) as {
      models?: Array<{ name?: string; model?: string }>;
    };
    const match = payload.models?.find(
      ({ name, model }) => name === configuredModel || model === configuredModel,
    );
    if (match?.name) return match.name;

    if (payload.models?.length === 1) {
      return payload.models[0]?.name;
    }
    return undefined;
  }
}

export function parseOllamaContent(body: string): string {
  const trimmed = body.trim();
  if (!trimmed) throw new Error("DeepSeek proxy returned an empty response");

  const chunks: OllamaChunk[] = [];
  try {
    chunks.push(JSON.parse(trimmed) as OllamaChunk);
  } catch {
    for (const line of trimmed.split(/\r?\n/).filter(Boolean)) {
      chunks.push(JSON.parse(line) as OllamaChunk);
    }
  }

  const proxyError = chunks.find((chunk) => chunk.error)?.error;
  if (proxyError) throw new Error(`DeepSeek proxy error: ${proxyError}`);

  const content = chunks
    .map((chunk) => chunk.message?.content ?? chunk.response ?? "")
    .join("")
    .trim();
  if (!content) throw new Error("DeepSeek proxy response did not contain model text");
  return content;
}

export function parseModelJson(content: string): unknown {
  const unfenced = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  return JSON.parse(unfenced);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
