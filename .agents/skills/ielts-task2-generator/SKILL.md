---
name: ielts-task2-generator
description: Generate one IELTS Writing Task 2 question and logically aligned strict-template and minimal-repair essays. Use when the user supplies one of the 12 themes in writing/task2/views.md and asks for a 观点型、讨论型、利弊型 or 原因与解决方案型 essay.
---

# IELTS Task 2 Generator

## Input

Require one theme and one question type.

- Themes: 环境、旅游、文化、犯罪、国际、媒体、政府、社会、科技、教育、健康、工作
- Types: 观点型、讨论型、利弊型、原因与解决方案型
- Accept names with or without `类` / `型`. Ask only for a missing or invalid field.

## Sources

Read before generating:

1. `writing/task2/views.md` — sole source for core arguments, causes and effects
2. `writing/task2/guides/templates.md` — exact wording for the strict template version
3. `writing/task2/guides/core-note.md` — language and reasoning safeguards

Do not modify source files.

## Workflow

1. Read only the selected theme section from `writing/task2/views.md`.
2. Create one realistic IELTS-style question matching the selected type.
3. Lock one logic contract: position; paragraph claims; cause-effect chains; solutions; conclusion.
4. Route it:
   - 观点型: select one subtype and use its exact body-paragraph structure in both
     essay versions:
     - 同意态度: Body 1 contains two positive template groups; Body 2 contains one
       negative template group followed by one solution template group.
     - 否定态度: Body 1 contains two negative template groups; Body 2 contains one
       positive template group followed by one concession-refutation template group.
     - 特殊双观点题: use when the prompt is formally an opinion question but requires
       discussion of two stated viewpoints. Body 1 contains two positive template groups;
       Body 2 contains one positive template group followed by one concession-refutation
       template group.
     Keep this paragraph order and group sequence unchanged.
   - 讨论型: both views + maintained opinion
   - 利弊型: both sides + explicit verdict. Select one verdict and use the corresponding
     body-paragraph structure from `task2-templates.md` in both essay versions:
     - 利大于弊: Body 1 = two positive template groups; Body 2 = one negative template
       group followed by one solution template group.
     - 弊大于利: Body 1 = two negative template groups; Body 2 = one positive template
       group followed by one concession-refutation template group.
     Keep this paragraph order and group sequence unchanged.
   - 原因与解决方案型: causes + directly matched solutions

In every route above, `Body 1: two ... groups` means that Body 1 is one paragraph
containing both template groups. Treat the colon as punctuation, never as a ratio or as
an instruction to create additional body paragraphs.

For 观点型 and 讨论型, replace the first sentence of the first template group in Body 2
with the applicable Body 2 opening from `task2-templates.md`. Use `opponents` for 观点型
and `advocates of [观点 B]` for 讨论型. Do not retain the replaced template sentence.
5. Produce the Strict Template Version from applicable template sentences.
6. Assess it against TR, CC, LR and GRA.
7. If below Band 7, list only the score blockers and produce a Minimal Repair Version.
8. Save under `writing/task2/practice/`; return the path.

Use `<theme>-<type>-<topic>.md` with concise English kebab-case terms.
Never overwrite; append `-2`, `-3`, and so on.

## Template Fidelity

- Copy applicable complete sentences from `task2-templates.md` verbatim.
- Replace bracketed placeholders only; do not reorder, paraphrase, add or delete.
- Treat the required 观点型/讨论型 Body 2 opening replacement as the sole exception to the
  preceding rule.
- Bold every placeholder replacement so substituted content is immediately visible.
- Report its actual word count. Do not alter it merely to reach 280–320 words.
- If it misses Band 7, preserve it as evidence; do not silently improve it.

For the Minimal Repair Version:

- Fix only the listed blockers; retain maximum template wording.
- Bold every added or replaced expression.
- Keep 280–320 English words and target Band 7–7.5.
- Deletions needed for concision are allowed.

## Logic Lock

When both versions are present, they must preserve the same position, paragraph order,
claims, causal links, solutions, examples, scope and conclusion. Wording quality may
differ; reasoning may not.

## Quality Rules

- Keep every core idea traceable to the selected `writing/task2/views.md` section.
- Do not invent statistics, studies, quotations or named evidence.
- Avoid unsupported causal jumps and absolute claims.
- Count words and, when both versions are present, compare them paragraph by paragraph before saving.

## Output

```md
# <English title>
## 题目
## 共用逻辑提纲
## 模板直替版（<words>，Estimated Band <score>）
## 卡点                       <!-- omit if already Band 7–7.5 -->
## 模板最小修改版（<words>，Target Band 7.0–7.5） <!-- omit if unnecessary -->
```
