---
name: daily-ielts-vocab
description: Integrate the current batch of unchecked vocabulary from words-collected.md into IELTS Task 2 logic chains in writing/task2/views-v2.md, mark successfully integrated items, and create the narrowly scoped daily commit. Use when the user asks to run the daily IELTS vocabulary task, process today's collected words, update Task 2 logic chains from the vocabulary list, or invokes $daily-ielts-vocab.
---

# Daily IELTS vocabulary integration

在当前本地项目执行；时区 `Asia/Shanghai`。

1. 若 `writing/task2/views-v2.md` 在任务开始前已有未提交改动，停止并报告，避免把用户编辑混入自动提交。
2. 读取 `words-collected.md` 截至今天的全部未勾选词作为一个批次。若为空，停止且不提交。
3. 必须先整体分析整个批次，再按主题、立场与因果关系聚类；禁止逐词独立生成内容。先合并同一词根的派生词、变形、搭配及含义高度重叠的近义表达，将其视为一个词汇单位；相关清单项共用一个最自然的代表性用法，不得为了逐项命中而重复堆砌。
4. 只修改 `writing/task2/views-v2.md` 的 `### 逻辑链`：优先扩写已有链，无法自然容纳才新增。每个主题最多扩写或新增 1–2 条；正负方向按论证适配度决定，不强制均衡；一个词最多进入 3 个真正相关主题。
5. 扩写时保留原英文链的每个节点，文字完全不变、顺序不变。中文链同步表达完整因果关系。每条链保持清晰的 `原因 → 机制 → 结果 → 深层影响`，新增节点应尽量短；同一英文实词或词根在一条链中原则上只出现一次，除非语法或语义不可避免。
6. 全部修改完成并复核后，在 `words-collected.md` 将成功整合的词改为 `[x]`，并追加 `→ 主题/方向 链编号`。同一词族或近义组的多个清单项可以指向同一个代表性用法，无需让每个词形、搭配或近义词都在链中逐字出现。无法自然整合的词保持 `[ ]`，在任务结果中说明原因。
7. 只暂存 `words-collected.md` 与 `writing/task2/views-v2.md`。检查 staged diff；若有实际变更，提交：`docs(task2): 整合 YYYY-MM-DD 每日词汇逻辑链`。不得暂存或提交其他文件，不得推送。
