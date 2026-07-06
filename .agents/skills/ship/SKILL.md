---
name: ship
description: |
  Ship code changes with semantic commits and changelog updates.
  Use this skill whenever the user wants to commit changes, save work,
  or finalize code edits. Triggers on: "ship", "ship it", "commit",
  "commit changes", "save changes", or when finishing any coding task.
---

# Ship Skill

Ship code changes with conventional commits and automatic changelog updates.

## Workflow

1. **Check status** — Run `git status` to see what changed
2. **Stage changes** — Stage all modified files (or specific files if user provided)
3. **Generate commit message** — Analyze changes and write a semantic commit message in **Chinese**
4. **Update CHANGELOG.md** — Prepend entry under `## [Unreleased]` in **Chinese**
5. **Commit** — Create the commit, including commit message and changelog update(if needed)
6. **Handle conflicts** — Auto-resolve any merge conflicts by taking incoming changes
7. **Push (optional)** — Only push if user explicitly asked (e.g., "ship and push")

## Commit Message Format

Use conventional commits with **Chinese descriptions**:
- `feat(scope): 描述` — 新功能
- `fix(scope): 描述` — Bug修复
- `docs(scope): 描述` — 文档更新
- `refactor(scope): 描述` — 代码重构
- `test(scope): 描述` — 测试变更
- `chore(scope): 描述` — 维护任务

## Arguments

- Default: commit all changes
- `--push` or "and push" / "并推送" — Push to remote after commit
- File list — Commit only specified files (e.g., "ship src/index.ts config.json")

## Examples

**User:** "ship"
→ Commit all changes, update changelog (Chinese), no push

**User:** "ship it and push"
→ Commit all changes, update changelog, push to remote

**User:** "ship src/main.ts"
→ Commit only src/main.ts, update changelog

## Conflict Resolution

If merge conflicts occur during commit or changelog update:
1. Accept incoming changes for the conflicted file
2. Re-apply your changelog entry if needed
3. Complete the commit
