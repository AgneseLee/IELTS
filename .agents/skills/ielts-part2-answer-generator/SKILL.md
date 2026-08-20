---
name: ielts-part2-answer-generator
description: Generate and automatically save natural, reusable, Band 7-targeted IELTS Speaking Part 2 answers from speaking/answers/part2/topic-bank.md. Use when the user asks to create, cover, batch-generate, regenerate, or save Part 2 cue-card answers, especially when answers must reuse the eight story banks and six transferable abilities with a validated 3:7 narrative-to-reflection ratio.
---

# IELTS Part 2 Answer Generator

在当前 IELTS 项目中生成可直接口述、可跨题迁移的 Part 2 答案，并自动写入 `speaking/answers/part2/`。

## Sources

每次生成前按顺序读取：

1. `speaking/p2&p3 prompt.md` 的 Part 2 rules：最高语言与输出规范；忽略 Part 3 rules。下方经用户确认的精确比例和篇幅是对其宽泛数值范围的收紧。
2. `speaking/answers/part2/topic-bank.md`：默认 55 题的唯一当前题源；只解析目标记录的 Part 2 cue 和 bullets，在 `#### Part 3` 前停止。
3. `speaking/plans/20-day-band7.md`：八个 Story Banks、modules、固定搭配与迁移规则。
4. `speaking/answers/part2/6skills.md`：六项 transferable abilities 的唯一能力框架。
5. `speaking/answers/README.md` 与 `speaking/answers/part2-{people,events,places,things}.md`：只用于补全统一人设、module 的固定事实和已有表达；忽略其中冲突的篇幅、语速、模板与维护规则。
6. `speaking/answers/part2/Describe a time when you sent a message or an email to someone but received no reply for a long time.md`：只参考自然口语风格、3:7 展开和能力改写方式；不得复制其 Part 3 或冲突格式。

不得使用 `speaking/plans/12-day-part2-template-plan.md` 覆盖以上规则。用户本次提供的真实事实优先于仓库统一人设；发生冲突时保留用户事实，不静默创建第二条故事线。

## Input and topic resolution

- 接受一道或多道完整 cue cards、英文题名、中文标题或主题。
- 优先精确匹配完整英文 cue，其次匹配中文标题。唯一匹配时直接生成；多个近似匹配时列出候选并等待确认。
- 默认只处理当前 55 题。只有用户明确要求旧题或 full bank 时才读取旧题库。
- `❤️` 只表示新题；仅当用户要求新题或本季题时优先。

## Story and ability gate

每题生成前必须全部通过：

1. 提取所有 cue bullets，为每个 bullet 锁定明确事实落点。
2. 选择一个最自然的 Bank 和其中 2–3 个直接相关 modules；只有单一 Bank 无法覆盖时才跨 Bank。
3. 保持已选 module 的人物、时间、地点、事件和结果一致；未选 module 不得出现。
4. 多题优先复用同一故事，但改变 cue-specific 入口、焦点和必要细节；不得只换标题或复制整篇。
5. 在故事锁定后选择最少且最自然的 abilities：必须有 1 项，最多 2 项；每项都要由具体行动证明并自然导向成长。
6. 复用 `6skills.md` 的能力逻辑、自然搭配和熟练句型，但必须结合故事改写。不得整段照抄，不得为凑能力硬塞 Secondary Ability。

无法自然覆盖全部 bullets 时停止生成，说明缺少的事实或候选题，不编造夸张经历、专业知识、统计或第二故事线。

## Answer contract

正文使用 `Experience → Ability → Personal Growth`，目标 180–210 个英文词和 1:40–2:00。使用短句、受控复句、自然搭配和清楚的口语路标；避免学术长句、生僻词与背诵感。

按正文英文词数精确校验：

- `NARRATIVE`：27–33%，直接覆盖 Who/What、background、main event 和必要细节。
- `REFLECTION`：67–73%，解释重要性、所学、观点变化及 1–2 项能力。
- 四个分析区块、HTML markers 与 collocations 不计入比例。

答案必须使用以下结构；markers 只用于校验，不属于口述内容：

```md
# <exact English cue-card title>

> Bank: <B1-B8> | Modules: <module-a / module-b [/ module-c]>

## 1. Core Ability Mapping

- Primary Ability: <one exact ability name>
- Reason: <specific action and why it proves the ability>
- Secondary Ability: <optional exact ability name; omit both secondary lines if unused>
- Reason: <specific action and distinct role>

## 2. Story Bank

- Who/What:
- Background:
- Main event:
- Ability shown:
- Reflection:

## 3. Band 7 Answer (1:40–2:00)

<!-- NARRATIVE_START -->
<direct cue-card response>
<!-- NARRATIVE_END -->

<!-- REFLECTION_START -->
<ability and personal-growth reflection>
<!-- REFLECTION_END -->

## 4. Useful Collocations

- <8–10 reusable phrases>
```

## Save and validate

1. 以完整英文 cue title 命名 `.md` 文件；移除末尾标点，并把 `/` 替换为 ` or `。
2. 自动写入 `speaking/answers/part2/<title>.md`。批量生成时每题单独保存。
3. 新文件可直接创建。若目标已存在，只有用户明确要求 regenerate、update 或 overwrite 时才替换；否则保留并报告冲突。
4. 对每个新建或更新文件运行：

   `python3 .agents/skills/ielts-part2-answer-generator/scripts/validate_part2_answer.py <file>`

5. 校验失败时修改答案并重跑，直至通过。再人工反查 cue coverage、事实一致性、能力证据、自然口述感和跨题复用价值。
6. 向用户报告保存路径、Bank/modules、abilities、正文词数、精确比例及按 105 WPM 估算的时长。把结果描述为 Band 7-targeted，不保证真实考试分数。

只生成 Part 2；不得追加 Part 3、修改题库、修改 prompt、修改 `6skills.md`，也不得创建额外 manifest 或 practice log。
