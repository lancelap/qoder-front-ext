---
name: frontend-orchestration
description: Use for frontend tasks that must go through specification validation, design validation, project analysis, planning, implementation, verification, review, docs, and PR summary.
---

# Frontend Orchestration

Use Russian by default.

## Mandatory Flow

1. Read the user task.
2. Read project `QWEN.md` and `.qwen/` context if present.
3. Check `git status --short`.
4. If the working tree is dirty, show changed files and ask whether to continue, stash, or stop.
5. Locate the analyst specification from GitBucket MCP, a local file, or pasted text.
6. Validate the specification with `spec-validation`.
7. Locate design input from Pixso link, screenshot, export, local file, pasted text, or existing page reference.
8. Validate design input with `design-validation`.
9. Use project discovery to find similar pages, reusable components, package scripts, and verification commands.
10. Apply `component-reuse` before proposing new components.
11. Produce an implementation plan.
12. Stop and ask for user approval before editing files.
13. After approval, implement only the approved scope.
14. Run verification.
15. Review the diff.
16. Update docs only when needed.
17. Return a final summary with PR-ready text.

## Approval Gate

Do not edit files before the implementation plan is approved.

If implementation reveals a scope change, stop and ask for approval again.

## Missing Information Gate

Stop before implementation when critical specification or design information is missing.

Do not invent backend behavior, request or response shapes, permissions, validation rules, or destructive user flows.

## Dirty Tree Policy

When the working tree is dirty:

1. Show changed files.
2. Ask whether to continue, stash, or stop.
3. Run `git stash push` only after explicit user approval.
4. Never silently stash, revert, or overwrite user changes.

## Final Output

Return:

1. What changed.
2. Files changed.
3. Checks run.
4. Review findings fixed.
5. Docs updated or skipped.
6. Residual risks.
7. PR summary text.
