---
name: ielts-review
description: Assess and critique an IELTS Writing Task 1 or Task 2 essay, then produce a revised 7.5 band version using vocabulary and phrases from the corresponding writing note where appropriate. Finally, update that note with new errors and patterns found. Use when the user shares an essay and asks for feedback, correction, band score improvement, or critique.
---

# IELTS Essay Review

## Quick start

User shares an essay (inline or via @file). Run all three phases in order.

## Workflow

### Phase 1 — Assessment

Read the essay and its corresponding note:
- Task 1: `writing/task1-note.md`
- Task 2: `writing/task2-note.md`

Score across four IELTS criteria:

| Criterion | What to check |
|---|---|
| Task Achievement | Does it answer the task? Is the overview accurate? Are data descriptions precise? |
| Coherence & Cohesion | Paragraph structure, logical grouping, connectives used correctly |
| Lexical Resource | Vocabulary range, collocation accuracy, repetition, register |
| Grammatical Range & Accuracy | Tense consistency, subject-verb agreement, word order, articles |

Output: table of estimated band per criterion + bullet list of errors, each tagged `[TA]` `[CC]` `[LR]` `[GR]`.

Cross-check errors against the corresponding note — flag recurring mistakes with `⚠ recurring`.

### Phase 2 — Revised 7.5 Version

Rewrite the essay to band 7.5 standard:
- Apply fixes from Phase 1
- Substitute vocabulary/phrases from the corresponding note where a better option exists
- Do not add new content the original essay didn't attempt to cover
- Show the full revised essay, not a diff

### Phase 3 — Update the corresponding note

After the revision, append new patterns to the corresponding note that are **not already recorded**:
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

## Final Version (7.0–7.5)
<the revised essay from Phase 2>

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
