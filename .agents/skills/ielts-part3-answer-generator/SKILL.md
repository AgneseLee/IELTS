---
name: ielts-part3-answer-generator
description: Generate or lightly polish concise IELTS Speaking Part 3 answers strictly from the reusable viewpoint-card logic chains in speaking/answers/part3-topic-bank.md, optionally updating the practice log. Use when the user asks to create, cover, expand, save, check, or make Part 3 answers more natural and conversational with 观点卡, topic cards, modules, or logic chains.
---

# IELTS Part 3 Answer Generator

在当前 IELTS 项目中生成或微调可直接口述的 Part 3 短答案。

## Sources

每次生成或润色前按顺序读取：

1. `speaking/answers/part3-topic-bank.md`：唯一核心论点来源。
2. `speaking/answers/part3-question-map.md`：题库原题的候选模块路由。
3. `speaking/answers/part3-practice-log.md`：仅在追加答案或排重时读取。

不得把 question map 的模块映射视为已通过覆盖验收。它只用于缩小候选范围。

## Input

- 接受一道或多道 Part 3 题目、题目主题，或“找出某些观点卡能覆盖的题目”。
- 接受对已有 Part 3 答案的口语化检查与微调；只替换不自然的表达，不改变立场、逻辑链、例子或答案结构。
- 未指定观点卡时，从全部 22 张卡中选择最少且最自然的组合。
- 指定“今天练过的卡”时，只使用用户明确标记或确认过的模块；不要自行猜测 emoji、日期或未提交改动的含义。
- 只有用户要求保存、更新或追加时才修改 practice log；否则直接返回答案。

## Coverage gate

每道题生成前必须全部通过：

1. **直接性**：观点卡的“适用”范围与题目主体一致。
2. **完整性**：卡片现有正向链或反向链能够从原因走到结果，不需要新增核心前提。
3. **问法匹配**：逻辑链能回答该 Q 类型，而不只是与题目共享关键词。
4. **最小组合**：优先一张卡，必要时最多两张；两张卡各自承担清楚的逻辑环节。

以下情况必须拒绝生成，并说明“当前观点卡不能自然覆盖”：

- Q7 所需类别、地点、人物或活动无法用常识性例子自然说明，必须依赖地区数据、实时事实或专业知识。
- 回答必须先假设题目未给出的条件，例如“如果新工作提供培训”。
- 卡片只能解释一个相关概念，不能回答题目的评价、比较、原因或解决办法。
- 为贴合模块而引入卡片外的新原因、事实、统计或社会判断。

## Answer contract

普通答案使用 3–5 句，不得超过 5 句，并按问法控制结构：

- **Q5 默认 5 句：**立场 → 主链机制 → `For example` / `For instance` 贴题短例 → `However` + 反向链或必要限制 → `Overall` + 直接总结。
- **Q2 默认 4 句：**先给明确差异，再解释 A、B 特征及差异来源，补贴题短例，最后总结。A、B 已构成两面，不额外添加反方。
- **Q1/Q3/Q4/Q6/Q7 默认 4 句：**直接回答 → 主链机制 → 贴题短例 → 直接总结。只有反向链与题目直接相关时，才在总结前加第五句。

每道普通题都必须用 `For example` 或 `For instance` 引出短例，将已选逻辑链具体化。可自动生成常识性的具体人物、场景、物品、地点、活动或类别；Q7 也可用这些例子直接完成列举，但选择依据和解释机制必须来自观点卡。例子不得承担新的核心原因、事实判断、统计结论或第三张观点卡。任何反方或限制都必须回指已选卡片的现有反向链或限制；没有可回指内容时不得临时编写。最后一句必须简单、直接扣题，且不得加入新理由、例子或转折。

缺少贴题例子的普通答案视为不合格，不得输出或写入练习日志。

语言目标为自然、易口述的 Band 7 表达。优先使用常用词、直接动词和简单短句；少写长难句。观点卡只限定逻辑方向，不要照搬其抽象词组；在不改变含义的前提下用自然口语转述。将偏书面、过度抽象、名词化或难口述的表达换成更自然的口语表达。Band 7 不等于故意使用复杂词。不得为了凑够句数重复观点。

## Workflow

1. 提取问题的核心对象、Q 类型和必须回答的信息。
2. 从 topic bank 选择候选卡，并写出准备使用的原始链条。
3. 执行 Coverage gate；不通过的题停止生成，不用相邻模块硬套。
4. 按 Q 类型套用 Answer contract，再逐句反查：直接回答、主链、贴题例子、必要反向链、总结。
5. 执行口语化检查：试着自然口述每句，将偏书面或难以顺口说出的词组换成常用口语表达；拆分不必要的长难句；确认末句是简单总结并直接扣题。
6. 确认每个核心论点都能回指所选卡片；删除无法回指的内容。
7. 若追加到 practice log：排重、标明题库原题或拓展、添加复练框并更新三项统计。
8. 运行 `ruby .agents/skills/ielts-part3-answer-generator/scripts/validate_part3_log.rb`。

## Output

未写文件时，每题输出：

```md
### <question>
观点卡：<module id> <name>
逻辑链：<exact selected chain>
答案：<Q-type structure in 3–5 sentences, including one concrete example and ending with a direct summary>
```

无法覆盖时只输出题目、最接近的卡及缺失的逻辑环节，不生成勉强答案。
