---
name: init-project
description: Initialize a frontend repo for Qwen workflow by creating QWEN.md and .qwen templates (skills + domain agent) without overwriting existing files.
---

# Init Project (.qwen + QWEN.md)

Use Russian by default.

Goal: set up project-level context for a frontend repository so the orchestrator can reuse core UI and project components, and run the correct verification commands.

## Safety Rules

1. Never overwrite existing files without explicit approval.
2. If `QWEN.md` exists, do not replace it. Propose a minimal patch to append missing rules only if needed.
3. If `.qwen/` exists, only add missing files. Do not delete or reorganize existing structure.
4. Keep templates short and replaceable: the team will customize them per project.

## What To Create

Target files (project root):

- `QWEN.md`
- `.qwen/skills/project-architecture/SKILL.md`
- `.qwen/skills/component-inventory/SKILL.md`
- `.qwen/skills/local-verification/SKILL.md`
- `.qwen/skills/frontend-rules/SKILL.md`
- `.qwen/agents/domain-expert.md`

If any file already exists, skip it and report that it was skipped.

## Template Contents

### `QWEN.md`

Create `QWEN.md` with:

```md
# Project Context

This is a frontend project.

Default language: Russian.

Before implementation:
1. Read `.qwen/skills/project-architecture/SKILL.md`.
2. Read `.qwen/skills/component-inventory/SKILL.md`.
3. Read `.qwen/skills/local-verification/SKILL.md`.
4. Read `.qwen/skills/frontend-rules/SKILL.md`.
5. Prefer core UI and existing project components.
6. Do not edit files before the implementation plan is approved.

If the working tree is dirty, show changed files and ask whether to continue, stash, or stop. Do not silently stash or overwrite user changes.
```

### `.qwen/skills/project-architecture/SKILL.md`

Create with sections:

- Stack
- Folders
- Routing
- API Client
- State Management
- Testing Conventions
- Architecture Rules

The file must include placeholders in plain text ("replace these examples") but no TODO/TBD markers.

### `.qwen/skills/component-inventory/SKILL.md`

Create with:

1. A strict rule: read this before creating components.
2. Core UI examples (Button, Modal) and how to document more.
3. Project components section with 1 example card format.

### `.qwen/skills/local-verification/SKILL.md`

Create with:

- Minimum: tests.
- Optional: typecheck, lint.
- Build check conditions.
- Visual check instructions.
- Rule: do not run expensive checks without explicit approval.

### `.qwen/skills/frontend-rules/SKILL.md`

Create with:

- API integration rules.
- Forms rules.
- Permissions rules.
- UI states checklist.
- Accessibility rules.
- Component creation rules.

### `.qwen/agents/domain-expert.md`

Create a read-only domain agent that:

1. Reads project context.
2. Finds existing flows.
3. Identifies domain terminology, permissions, statuses, edge cases.
4. Returns relevant pointers.

## Final Output

Return:

1. Files created.
2. Files skipped.
3. Required next steps for developer customization:
   - Update core UI import paths.
   - Fill project-specific reusable components in `component-inventory`.
   - Set real verification commands in `local-verification`.
   - Document actual stack and architecture in `project-architecture`.

## Recommended Next Command

After initialization, recommend running:

```text
/work:plan Спека: <path-to-spec>. Дизайн: <path-to-design>.
```
