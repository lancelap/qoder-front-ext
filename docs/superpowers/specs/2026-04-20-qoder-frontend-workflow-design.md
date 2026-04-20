# Qoder Frontend Workflow Extension Design

Date: 2026-04-20

## Goal

Build a Qwen Code CLI extension for frontend teams. The extension provides a standard workflow for turning an analyst specification and Pixso design into implemented, tested, reviewed frontend code.

The extension must support several frontend projects. Shared workflow rules live in the extension. Project-specific context lives in each project repository under `QWEN.md` and `.qwen/`.

## Non-Goals

- Do not build a separate RAG service for the MVP.
- Do not build a separate orchestrator backend service.
- Do not auto-create commits or pull requests.
- Do not require API keys or extension-level secrets.
- Do not make Pixso MCP mandatory for the MVP.
- Do not encode project-specific component inventories inside the shared extension.

## Distribution

The extension is installed from a private Git repository:

```bash
qwen extensions install <private-git-repo>
```

The repository uses two long-lived branches:

- `dev`: extension development and experiments.
- `stable`: approved version for the team.

Developers update with:

```bash
qwen extensions update <extension-name>
```

## Extension Structure

The MVP extension should use this structure:

```text
qoder-front-ext/
├── qwen-extension.json
├── QWEN.md
├── commands/
│   └── work/
│       ├── orchestrate.md
│       ├── validate-spec.md
│       ├── plan.md
│       ├── review.md
│       └── pr-summary.md
├── agents/
│   ├── project-analyst.md
│   ├── frontend-specialist.md
│   ├── test-runner.md
│   ├── code-reviewer.md
│   └── docs-writer.md
├── skills/
│   ├── frontend-orchestration/
│   │   └── SKILL.md
│   ├── spec-validation/
│   │   └── SKILL.md
│   ├── design-validation/
│   │   └── SKILL.md
│   ├── component-reuse/
│   │   └── SKILL.md
│   └── pr-summary/
│       └── SKILL.md
└── README.md
```

Initial `qwen-extension.json`:

```json
{
  "name": "qoder-frontend-workflow",
  "version": "0.1.0",
  "contextFileName": "QWEN.md",
  "commands": "commands",
  "skills": "skills",
  "agents": "agents"
}
```

## Project Context Structure

Each frontend project should keep its own Qwen context in the project repository:

```text
project/
├── QWEN.md
└── .qwen/
    ├── skills/
    │   ├── project-architecture/
    │   │   └── SKILL.md
    │   ├── component-inventory/
    │   │   └── SKILL.md
    │   ├── local-verification/
    │   │   └── SKILL.md
    │   └── frontend-rules/
    │       └── SKILL.md
    └── agents/
        └── domain-expert.md
```

The project `QWEN.md` should stay short. It should point Qwen Code to the detailed project skills and state the project-level rules:

```md
# Project Context

This is a frontend project.

Before implementation:
1. Read `.qwen/skills/project-architecture/SKILL.md`.
2. Read `.qwen/skills/component-inventory/SKILL.md`.
3. Read `.qwen/skills/local-verification/SKILL.md`.
4. Prefer core UI and existing project components.
5. Do not edit files before the implementation plan is approved.

Use Russian for explanations and summaries.
```

## Component Reuse Strategy

The MVP does not use RAG. Instead, each project provides a `component-inventory` skill. This skill describes core UI components and large project-specific reusable components.

The inventory should describe:

- Component name.
- Source path or import path.
- Purpose.
- When to use it.
- When not to use it.
- Required props or data assumptions.
- Existing usage examples.
- Known limitations.

Example:

```md
## ContractListWidget

Path: `src/features/contracts/components/ContractListWidget.tsx`

Use when:
- implementing contract list screens;
- the page needs server-side pagination;
- filters match the standard contract filter model;
- row actions use project-standard permissions.

Do not use when:
- rendering a small static list;
- the page needs custom grouping;
- backend response does not match `ContractListResponse`.

Examples:
- `src/pages/contracts/ContractsPage.tsx`
- `src/pages/client-card/ClientContractsTab.tsx`

Notes:
- Uses project permissions internally.
- Already handles loading, empty and error states.
- Do not duplicate its table columns unless the spec requires a different layout.
```

Before creating UI, the orchestrator and frontend agent must:

1. Read the project `QWEN.md`.
2. Read `.qwen/skills/component-inventory/SKILL.md`.
3. Search the project for similar pages, forms, tables, filters, dialogs, routes and API methods.
4. Prefer core UI components.
5. Prefer existing project-specific components when they match the use case.
6. Create a new component only after explaining why existing components do not fit.

## Main Workflow

The main command is `/work:orchestrate`.

It performs this flow:

1. Read the user task.
2. Read the analyst specification from GitBucket MCP, a local file, or pasted text.
3. Read the design input from Pixso link, screenshot, export, local file, or pasted description.
4. Read project context from `QWEN.md` and `.qwen/`.
5. Validate the analyst specification.
6. Validate the design input.
7. Delegate repository discovery to `project-analyst`.
8. Produce an implementation plan.
9. Stop and ask the user to approve the plan before editing files.
10. After approval, implement the approved scope.
11. Run verification through `test-runner`.
12. Fix valid verification failures.
13. Run `code-reviewer` on the diff.
14. Fix valid review findings.
15. Ask `docs-writer` whether docs need updates.
16. Return a PR summary, checks run, changed files and residual risks.

The extension must not edit files before the implementation plan is approved. If the scope changes during implementation, it must stop and request approval again.

## Analyst Specification Validation

The `spec-validation` skill checks whether the analyst specification is sufficient for frontend implementation.

The checklist:

- Business scenario and goal are present.
- Affected screens or flows are listed.
- Backend API methods are described.
- Each API method has method, path, query, body and response shape.
- Error cases are described.
- Loading, empty, success and failure states are described.
- Roles and permissions are described if applicable.
- Form validation rules are described if applicable.
- Navigation entry and exit points are described.
- Compatibility with existing screens is described.
- Feature flags or configs are described if applicable.
- Acceptance criteria are present.
- Testable scenarios are present.
- Pixso design link or design reference is present.

If required information is missing, the orchestrator must stop before implementation and return a missing-information report. It must not invent backend behavior.

## Design Validation

The MVP treats Pixso as optional input because Pixso MCP is not available yet.

Accepted design inputs:

- Pixso link plus user-provided description.
- Screenshots.
- Exported text description.
- Designer comments.
- Existing page reference.

The `design-validation` skill checks:

- Affected screens.
- Required UI states.
- Mobile, tablet and desktop requirements.
- Hover, focus, disabled and error states.
- Empty states.
- Button labels, error text and placeholders.
- Differences between analyst specification and design.
- Core UI components that should be used.
- Existing project components that may fit.

When Pixso MCP becomes available, it should be added as an optional source. The orchestration flow should remain the same.

## Subagents

### project-analyst

Purpose: inspect the project and return implementation context.

Responsibilities:

- Find relevant files.
- Find existing pages with similar flows.
- Find reusable core UI and project-specific components.
- Find package scripts and verification commands.
- Read project `.qwen/` context.
- Return a concise project map.

This agent should not edit files.

### frontend-specialist

Purpose: implement the approved frontend change.

Responsibilities:

- Follow the approved plan.
- Reuse core UI and project-specific components.
- Implement UI, state, forms and API integration.
- Handle loading, empty, success and error states.
- Add or update tests according to project conventions.
- Stay within the approved scope.

### test-runner

Purpose: run verification and analyze failures.

Responsibilities:

- Read project verification rules.
- Prefer `.qwen/skills/local-verification/SKILL.md`.
- Fall back to `package.json` scripts when project rules are missing.
- Run tests as the minimum required verification.
- Propose or apply fixes for valid failures within the approved scope.
- Avoid heavy e2e or long-running checks unless the user approves them.

### code-reviewer

Purpose: review the final diff.

Responsibilities:

- Check spec compliance.
- Check design compliance.
- Check component reuse.
- Check API integration.
- Check loading, empty and error states.
- Check tests.
- Check unnecessary changes.
- Identify regression risks.

### docs-writer

Purpose: update docs and runbooks only when needed.

Docs should be updated when:

- A new reusable component is added.
- A project frontend pattern changes.
- Verification commands change.
- API contract assumptions are documented.
- A decision should be preserved for the team.

Docs should not be updated just to create noise.

## Dirty Git Tree Policy

If the working tree is dirty, the orchestrator must:

1. Show changed files.
2. Ask whether to continue, stash or stop.
3. Never overwrite or revert user changes.
4. Run `git stash push` only after explicit user approval.

The extension should not silently stash user work.

## Verification Policy

Project-level verification rules have priority. The orchestrator and `test-runner` should first read:

```text
.qwen/skills/local-verification/SKILL.md
```

If it is missing, they should inspect `package.json`.

Minimum verification is tests. If quick `typecheck` or `lint` commands exist, the agent should propose or run them according to project rules. Full e2e and expensive visual checks require explicit approval.

If layout or responsive behavior changed, the final response must state whether visual verification was performed. If it was not performed, state that clearly.

## Language and Output

The extension should answer in Russian by default.

Final output after implementation should include:

- What changed.
- Files changed.
- Checks run.
- Review findings fixed.
- Docs updated or skipped.
- Residual risks.
- PR summary text.

The extension should not create commits or PRs in the MVP.

## External Integrations

### GitBucket MCP

GitBucket MCP is optional and configured by each developer outside the extension.

If GitBucket MCP is available, the orchestrator can read the analyst specification from it. If it is unavailable, the user can provide a local file or paste the specification.

The extension must not require GitBucket credentials in its own settings.

### Pixso MCP

Pixso MCP is planned but not required for the MVP.

Until Pixso MCP is available, design input is provided through links, screenshots, exports, descriptions or references to existing pages.

## Acceptance Criteria

- A developer can install the extension from a private Git repository.
- `/work:orchestrate` is available in Qwen Code.
- The orchestrator answers in Russian.
- The orchestrator always creates a plan before edits.
- The orchestrator does not edit files before plan approval.
- The orchestrator validates analyst specifications and stops on missing critical information.
- The orchestrator validates design input and reports spec/design mismatches.
- The orchestrator reads project `.qwen/` skills.
- The orchestrator requires reuse of core UI and project components.
- `project-analyst` finds similar pages and reusable components.
- `frontend-specialist` implements approved frontend changes.
- `test-runner` runs project verification or reports that verification rules are missing.
- `code-reviewer` reviews the diff for real frontend regressions.
- `docs-writer` updates docs only when needed.
- The final response contains a PR summary, checks and risks.
- Updating the extension does not overwrite project `.qwen/` context.
