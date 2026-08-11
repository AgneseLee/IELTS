# Raycast IELTS Vocab MCP

本地 Streamable HTTP MCP。Raycast AI Chat 从当前 session 选出 IELTS 可复用词汇及用户明确询问的词，再由本服务写入仓库根目录的 `words-collected.md`。

## 边界

- 唯一工具：`collect_words(words)`。
- 只接收紧凑词表，不接收完整 transcript。
- 规范化并全局去重；按上海日期追加为未处理 checkbox。
- 不调用任何模型或外部 API。
- 不读取或修改 `writing/task2/views-v2.md`。

## 启动

```bash
cd tools/raycast-ielts-vocab
docker compose up -d --build
curl http://127.0.0.1:11436/healthz
```

## Raycast

MCP URL：`http://127.0.0.1:11436/mcp`

Custom Instructions：

```text
当我要求收集本次会话词汇时，检查当前可见 session 的全部消息，只调用一次 collect_words。传入紧凑词表：包括所有适用于 IELTS 的可复用英文词汇或短语，以及我明确询问过的每个英文词或短语。排除仅由助手引入且我未关注的词。不要传完整 transcript，不要自行修改文件。
```

使用：

```text
@ielts-vocab 收集本次会话全部 IELTS 词汇和我特别询问过的词。
```

## 每日 Codex 任务

将 `DAILY_TASK.md` 的内容作为 Codex Desktop Scheduled Task 提示词；本地项目模式、Asia/Shanghai 每天 23:00。任务整体考虑当日全部新词，更新逻辑链、勾选成功词汇，并只提交 `words-collected.md` 与 `writing/task2/views-v2.md`。

Codex CLI/IDE 无 Scheduled 管理界面；任务需在 Codex Desktop 或 ChatGPT Desktop 的 **Scheduled** 中创建。运行时电脑须开机且应用保持运行。

## 本地开发

```bash
npm test
npm run typecheck
npm run build
```
