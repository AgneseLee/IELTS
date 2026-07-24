---
name: ielts-task2-generator
description: Generate one IELTS Writing Task 2 question and two logically identical Band 7–7.5 model essays. Use when the user supplies one of the 12 themes in writing/task2-views.md and asks for a 观点型、讨论型、利弊型 or 原因与解决方案型 essay.
---

# IELTS Task 2 Generator

## Input

Require one theme and one question type.

- Themes: 环境、旅游、文化、犯罪、国际、媒体、政府、社会、科技、教育、健康、工作
- Types: 观点型、讨论型、利弊型、原因与解决方案型
- Accept names with or without `类` / `型`. Ask only for a missing or invalid field.

## Sources

Read these files before generating:

1. `writing/task2-views.md` — sole source for core arguments, causes and effects
2. `writing/task2/task2-templates.md` — structure and phrasing for the template version
3. `writing/task2-note.md` — language and reasoning safeguards

Do not modify source files.

## Workflow

1. Read only the selected theme section from `task2-views.md`.
2. Create one realistic IELTS-style question matching the selected type.
3. Build and lock one shared logic contract:
   - thesis and position
   - Body 1 claim → reason → effect → optional concrete illustration
   - Body 2 claim → reason → effect → optional concrete illustration
   - conclusion
4. Route the contract:
   - 观点型: explicit degree of agreement; two supporting reasons
   - 讨论型: explain both views; state and maintain one opinion
   - 利弊型: cover both sides; give an explicit overall verdict
   - 原因与解决方案型: explain causes; propose directly matched solutions
5. Render two essays from the locked contract:
   - Template Version: adapt suitable structures from `task2-templates.md`
   - Natural Version: use natural cohesion and minimal visible templating
6. Count each essay and revise until each is 280–320 English words.

## Logic Lock

Both versions must preserve the same:

- position, scope and conclusion
- paragraph order and main claims
- cause-and-effect chains
- solutions and their matched causes
- illustrations and factual detail

Only wording, syntax and transitions may differ. Do not introduce, remove or strengthen an argument in either version.

## Quality Rules

- Target Band 7–7.5: complete task response, clear progression, precise vocabulary and varied accurate grammar.
- Keep every core idea traceable to the selected `task2-views.md` section.
- A concrete illustration may clarify a listed idea, but must appear in both versions.
- Do not invent statistics, studies, quotations or named evidence.
- Avoid memorised-template awkwardness, absolute claims and unsupported causal jumps.
- Validate the two essays paragraph by paragraph against the logic contract before output.

## Output

```md
## 题目

> <question>

## 共用逻辑提纲

- 立场：...
- Body 1：claim → reason → effect → illustration
- Body 2：claim → reason → effect → illustration
- 结论：...

## 模板版（<word count> words）

<essay>

## 自然版（<word count> words）

<essay>
```
