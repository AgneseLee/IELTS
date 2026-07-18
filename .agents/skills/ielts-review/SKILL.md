---
name: ielts-review
description: Assess and critique an IELTS Writing Task 1 or Task 2 essay, then produce a revised 7.5 band version using vocabulary and phrases from myWeaknesses.md where appropriate. Finally, update myWeaknesses.md with new errors and patterns found. Use when the user shares an essay and asks for feedback, correction, band score improvement, or critique.
---

# IELTS Essay Review

## Quick start

User shares an essay (inline or via @file). Run all three phases in order.

## Workflow

### Phase 1 — Assessment

Read the essay and `myWeaknesses.md`. Score across four IELTS criteria:

| Criterion | What to check |
|---|---|
| Task Achievement | Does it answer the task? Is the overview accurate? Are data descriptions precise? |
| Coherence & Cohesion | Paragraph structure, logical grouping, connectives used correctly |
| Lexical Resource | Vocabulary range, collocation accuracy, repetition, register |
| Grammatical Range & Accuracy | Tense consistency, subject-verb agreement, word order, articles |

Output: table of estimated band per criterion + bullet list of errors, each tagged `[TA]` `[CC]` `[LR]` `[GR]`.

Cross-check errors against `myWeaknesses.md` — flag recurring mistakes with `⚠ recurring`.

### Phase 2 — Revised Versions

Produce five full versions:
- `Task Achievement-only Version`
- `Coherence and Cohesion-only Version`
- `Lexical Resource-only Version`
- `Grammatical Range and Accuracy-only Version`
- `Final Integrated Version (7.0–7.5)`

Rules:
- In each single-criterion version, change only that criterion as much as possible.
- Add the estimated criterion-specific band gain to the right of each single-criterion version title.
- Bold every changed phrase/sentence in the four single-criterion versions.
- Do not bold text in the final integrated version.
- Substitute vocabulary/phrases from `myWeaknesses.md` where a better option exists.
- Do not add new content the original essay did not attempt to cover.
- Show each full version, not a diff.

### Phase 3 — Update myWeaknesses.md

After the revision, append new patterns to `myWeaknesses.md` that are **not already recorded**:
- New error types with example (wrong → correct)
- New useful phrases or collocations used in the revision
- Update any existing entry if a better example is now available

Do not duplicate existing entries. Add only what is genuinely new.

### Phase 4 — Update the essay document

If the user's essay came from a named file (e.g. `IELTS-18-test-4-writing-task-1.md`), rewrite that file in this exact format (see `IELTS-18-test-2-writing-task-1.md` as the canonical example):

```
# <filename>
*<today's date>*

## Original Draft
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
### Coherence and Cohesion
### Lexical Resource
### Grammatical Range and Accuracy

---

## Task Achievement-only Version (+<estimated gain> in Task Achievement)
<full essay; bold only changed text>

---

## Coherence and Cohesion-only Version (+<estimated gain> in Coherence and Cohesion)
<full essay; bold only changed text>

---

## Lexical Resource-only Version (+<estimated gain> in Lexical Resource)
<full essay; bold only changed text>

---

## Grammatical Range and Accuracy-only Version (+<estimated gain> in Grammatical Range and Accuracy)
<full essay; bold only changed text>

---

## Final Integrated Version (7.0–7.5)
<full essay combining all four dimensions; no bold>

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
```

Rules:
- Preserve the original draft exactly — no silent fixes
- Only include sections that have entries
- Date format: YYYY-MM-DD
