# Raycast IELTS Vocab MCP

一个本地 Streamable HTTP MCP。它让 Raycast AI Chat 在你输入 `@ielts-vocab` 后，将当前可见会话交给现有 DeepSeek proxy 分析，并把用户明确提到的 vocabulary 分类到 `writing/task2/views-v2.md` 的 12 个已有主题中。

服务只提供两个工具：

- `preview_session`：提取词汇并返回逻辑链预览，不修改文件。
- `commit_preview`：用户明确确认后，提交指定预览。

## 写入规则

- 候选词只能来自用户消息；助手消息只作为语境。
- 每个 vocabulary 最多进入 3 个已有主题。
- 将会话词汇按论点合并到完整的 `原因 → 机制 → 结果 → 深层影响` 逻辑链，不生成零散例句。
- 每个主题最多扩写或新增 1–2 条逻辑链；正负方向按论证适配度决定。
- 优先扩写已有链；渲染校验会强制原英文节点原样、同序保留。
- 无自然匹配时才在对应 `### 逻辑链` 末尾新增一条。
- 对完整英文逻辑链做归一化去重。
- 不删除、不排序已有内容；扩写时只替换目标逻辑链，并保留其全部英文节点。
- 预览后若文件发生变化，提交会被拒绝，必须重新预览。
- 服务端固定写入容器内的 `/data/task2/views-v2.md`，工具参数不能指定其他路径。

## 启动

先确认已有 `raycast-ai-proxy` 容器正在运行：

```bash
docker ps --filter name=raycast-ai-proxy
```

然后启动 MCP：

```bash
cd tools/raycast-ielts-vocab
docker compose up -d --build
curl http://127.0.0.1:11436/healthz
```

默认配置会：

- 加入外部 Docker 网络 `raycast-ai-openrouter-proxy_default`；
- 在容器内调用 `http://raycast-ai-proxy:3000/api/chat`；
- 仅将宿主机 `127.0.0.1:11436` 映射到 MCP；
- 只挂载 `writing/task2/` 作为可写目录。

需要覆盖网络、端口、模型或预览有效期时，复制 `.env.example` 为 `.env` 后修改。MCP 不读取或复制上游 API key。

## 安装到 Raycast

1. 在 Raycast 运行 **Install MCP Server**，或从 **Manage MCP Servers** 选择 **Install New Server**。
2. Name 填写 `ielts-vocab`。
3. Transport 选择 **HTTP**。
4. URL 填写 `http://127.0.0.1:11436/mcp`。
5. 不启用 OAuth，不添加 HTTP headers。
6. Custom Instructions 填写：

```text
当我要求整理本次会话词汇时，先调用 preview_session。把当前可见会话按时间顺序完整放入 conversation 参数，包括全部 user 和 assistant 消息，不要先总结或省略。向我展示预览；只有我明确确认后才调用 commit_preview。
```

安装后可在 AI Chat 输入：

```text
@ielts-vocab 整理本次会话中我提到的 vocabulary，先给我预览。
```

检查预览后回复“确认写入”。Raycast 默认会在执行 MCP 工具前显示权限确认。

## 平台限制

Raycast 不会在协议层自动把聊天历史附加给 MCP；当前 AI 模型必须将可见会话写入 `conversation` 工具参数。很长的聊天可能已被 Raycast 压缩，因此早期内容属于 best-effort，无法保证逐字完整。

## 本地开发

```bash
npm install
npm test
npm run typecheck
npm run build
```

本地直接运行服务时，默认使用 `http://127.0.0.1:11435/api/chat`，并从当前工具目录以 `../../writing/task2/views-v2.md` 定位笔记。测试只读取真实笔记结构，写入测试使用内存或临时 fixture，不修改真实文件。
