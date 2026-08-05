---
name: ielts-review
description: Assess and critique an IELTS Writing Task 1 or Task 2 essay, produce a revised 7.5 band version using the corresponding writing note, update that note with new patterns, and maintain a review document. Use when the user shares an essay inline, in a file, or with an image and asks for feedback, correction, band improvement, or critique.
---

# IELTS Essay Review

## Quick start

User shares an essay inline, via a named file, or alongside an image of the task. Run all four phases in order.

## Workflow

### Phase 1 — Assessment

Read the essay and its corresponding note:
- Task 1: `writing/task1/guides/core-note.md`
- Task 2: `writing/task2/guides/core-note.md`

Score across four IELTS criteria:

| Criterion | What to check |
|---|---|
| Task Achievement | Does it answer the task? Is the overview accurate? Are data descriptions precise? |
| Coherence & Cohesion | Paragraph structure, logical grouping, connectives used correctly |
| Lexical Resource | Vocabulary range, collocation accuracy, repetition, register |
| Grammatical Range & Accuracy | Tense consistency, subject-verb agreement, word order, articles |

Output: table of estimated band per criterion + bullet list of errors, each tagged `[TA]` `[CC]` `[LR]` `[GR]`.

Cross-check errors against the corresponding note — flag recurring mistakes with `⚠ recurring`.

### Phase 2 — Revised Versions

Produce seven full versions:
- `Task Achievement-only Version`
- `Coherence and Cohesion-only Version`
- `Lexical Resource-only Version`
- `Grammatical Range and Accuracy-only Version`
- `Final Integrated Version (7.0–7.5)`
- `Original Logic and Order — Expression-only Version`
- `Minimally Adjusted Version (Target Band 7.0–7.5)`

Rules:
- In each single-criterion version, change only that criterion as much as possible.
- Bold every changed phrase or sentence in the four single-criterion versions, the expression-only version and the minimally adjusted version. In all six versions, compare against the `Original Draft` rather than against another revision.
- Do not bold text in the final integrated version.
- Substitute vocabulary/phrases from the corresponding note where a better option exists.
- Do not add new content the original essay did not attempt to cover.
- Show each full version, not a diff.
- In the expression-only version, preserve the original paragraph structure, narrative logic, grouping and information order. Change only grammar, vocabulary, collocations and sentence construction. Make only indispensable factual-precision corrections and disclose them below the version.
- Estimate the realistic ceiling of the expression-only version. Below it, add `结论与卡点` and identify the remaining `[TA]`, `[CC]`, `[LR]` or `[GR]` constraints. Do not claim Band 7.5 when the retained structure or coverage cannot support it.
- After the bottleneck analysis, add `解决卡点问题`. Map each bottleneck to the smallest necessary adjustment, then produce the minimally adjusted version. Preserve the original information order where possible while improving the overview, paragraph grouping, key comparisons and data precision needed for Band 7.0–7.5.
- Implement every adjustment listed in `解决卡点问题` visibly in the minimally adjusted version. Before saving, verify each bottleneck against the resulting essay; do not claim it is resolved merely because a linker or an isolated data point was added.
- For Task 1, use exactly four paragraphs in the `Final Integrated Version` and `Minimally Adjusted Version`: introduction, overview, first grouped body paragraph and second grouped body paragraph. Keep overview sentences together, group related data within the two body paragraphs and never create a standalone paragraph for a single supporting sentence. The expression-only version is exempt because it must preserve the original paragraph structure.
- For Task 1, keep the `Final Integrated Version`, expression-only version and minimally adjusted version between 160 and 185 words. Task 2 is not subject to this range.

### Phase 3 — Update the corresponding note

After the revision, append new patterns to the corresponding note that are **not already recorded**:
- New error types with example (wrong → correct)
- New useful phrases or collocations used in the revision
- Update any existing entry if a better example is now available

Do not duplicate existing entries. Add only what is genuinely new.

### Phase 4 — Create or update the essay document

Always maintain a review document after completing the revision:

- If the essay came from a named file, rewrite that file.
- If the user pasted an image of the task and an original essay inline in the terminal/chat without naming a file, create a new Markdown document in `writing/task1/reviews/` or `writing/task2/reviews/` as appropriate.
- Determine the task number from the prompt or image. Do not ask when it is visually clear.
- Before naming a new document, inspect existing files in the target folder and follow their conventions.
- For Task 1, prefer `<visualType>-<short-topic>-ielts<book>-test<test>.md` when the source is visible, for example `lineChart-social-centre-activities-ielts19-test1.md`. Use the established visual-type spelling, such as `lineChart`, `barChart`, `tableAndPieChart`, `map`, or `processDiagram`.
- For Task 2, prefer `ielts<book>-test<test>.md` when the source is visible; otherwise use a concise kebab-case topic name.
- If the source book or test cannot be established from the submission, omit that portion rather than inventing it.
- Never overwrite an unrelated document. If a filename already exists, confirm from its prompt that it represents the same task before updating it; otherwise choose a more specific filename.

Use this exact format (see `writing/task1/reviews/barChart-household-income-ielts18-test2.md` as the canonical Task 1 example):

```
# <filename>
*<today's date>*

## Original Draft(<word count>)
<user's original essay, unmodified>

---

## Band Scores

| Criterion | Band | Notes |
|---|---:|---|
| Task Achievement |  |  |
| Coherence and Cohesion |  |  |
| Lexical Resource |  |  |
| Grammatical Range and Accuracy |  |  |
| Overall |  |  |

---

## Revision Advice

### Task Achievement
<write the advice in Chinese; retain criterion tags and quoted English examples>
### Coherence and Cohesion
<write the advice in Chinese; retain criterion tags and quoted English examples>
### Lexical Resource
<write the advice in Chinese; retain criterion tags, recurring-error markers and quoted English examples>
### Grammatical Range and Accuracy
<write the advice in Chinese; retain criterion tags and quoted English examples>

---

## Summary of Corrections

### 审题错误        ← omit section if empty
| 错误 | 修正 | 原因 |

### 语法 & 拼写
| 错误 | 修正 |

### 词汇误用
| 错误 | 修正 | 原因 |

### 结构改进        ← omit section if no structural changes
<prose description>

---

## Task Achievement-only Version(<word count>)
<full essay; bold only changed text>

---

## Coherence and Cohesion-only Version(<word count>)
<full essay; bold only changed text>

---

## Lexical Resource-only Version(<word count>)
<full essay; bold only changed text>

---

## Grammatical Range and Accuracy-only Version(<word count>)
<full essay; bold only changed text>

---

## Final Integrated Version(<word count>) (7.0–7.5)
<full essay combining all four dimensions; no bold; for Task 1 use exactly four paragraphs: introduction, overview and two grouped body paragraphs>

---

## Original Logic and Order — Expression-only Version(<word count>) (Estimated Band <score>)
<full essay preserving the original structure, logic, grouping and order; bold only text changed from the Original Draft>

### 结论与卡点
<state whether the retained logic can reach Band 7.0–7.5; list the remaining criterion-specific constraints>

## 解决卡点问题

| 卡点 | 最小幅度的调整 |
|---|---|
|  |  |

### Minimally Adjusted Version(<word count>) (Target Band 7.0–7.5)
<full essay visibly resolving every listed bottleneck; bold only text changed from the Original Draft; for Task 1 use exactly four paragraphs: introduction, overview and two grouped body paragraphs>
```

Rules:
- Preserve the original draft exactly — no silent fixes
- Write all explanatory content under `Revision Advice` in Chinese. Keep the four criterion headings, `[TA]` `[CC]` `[LR]` `[GR]` tags, `⚠ recurring` markers and quoted English corrections or example phrases in English.
- Place `Summary of Corrections` immediately after `Revision Advice` and before all revised versions.
- Calculate each essay's prose word count, excluding its heading, Markdown markers and surrounding review content; put the integer directly in parentheses in that version's heading
- Verify Task 1 target-version word counts after drafting; revise any count outside 160–185 before saving the document
- When the task statement is available and existing documents for that task type include a `Prompt` section, preserve the prompt in the document
- Only include sections that have entries
- Date format: YYYY-MM-DD
