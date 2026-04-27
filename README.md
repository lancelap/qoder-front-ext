# Qoder Frontend Workflow

Qwen Code CLI extension for frontend teams.

It standardizes the cycle from analyst specification and Pixso design to implemented, tested, reviewed frontend code:

1. Validate analyst specification.
2. Validate design input.
3. Inspect project context.
4. Find reusable core UI and project-specific components.
5. Produce an implementation plan.
6. Ask for approval before editing.
7. Implement the approved scope.
8. Run verification.
9. Review the diff.
10. Update docs only when useful.
11. Produce a PR-ready summary.

The extension answers in Russian by default.

## Usage

Step-by-step instruction for using this extension inside a frontend project:

- `docs/usage.md`

## Installation

Install from the private repository:

```bash
qwen extensions install <private-git-repo>
```

Recommended branches:

- `dev`: extension development.
- `stable`: team-approved version.

Update:

```bash
qwen extensions update qoder-frontend-workflow
```

## Local Development

Link the local extension:

```bash
qwen extensions link /Users/danilel/dev/qoder-front-ext
```

Check installed or linked extensions:

```bash
qwen extensions list
```

## Commands

### `/work:orchestrate`

Full frontend workflow:

```text
/work:orchestrate Реализовать задачу по спеке GB-123 и дизайну Pixso ...
```

The command:

1. Reads project context.
2. Checks dirty git state.
3. Validates the analyst specification.
4. Validates design input.
5. Finds reusable components.
6. Creates a plan.
7. Stops for approval before editing.
8. Implements, verifies, reviews, updates docs if needed, and returns PR summary.

### `/work:validate-spec`

Validates an analyst specification before implementation.

### `/work:plan`

Creates an implementation plan from a validated spec and design.

### `/work:review`

Reviews the current frontend diff.

### `/work:pr-summary`

Creates a PR-ready summary without creating a commit or pull request.

## Agents

### `project-analyst`

Finds relevant files, project rules, reusable components, similar pages, package scripts, and verification commands.

### `frontend-specialist`

Implements approved frontend changes with UI, state, forms, API integration, component reuse, and tests.

### `test-runner`

Runs frontend verification commands, analyzes failures, and proposes or applies fixes inside the approved scope.

### `code-reviewer`

Reviews frontend diffs for specification compliance, design compliance, component reuse, tests, and regressions.

### `docs-writer`

Updates documentation only when implementation changes reusable components, patterns, verification commands, or API assumptions.

## Skills

### `frontend-orchestration`

Defines the full workflow and approval gates.

### `spec-validation`

Checks whether analyst specifications are ready for implementation.

### `design-validation`

Checks design input from Pixso links, screenshots, exports, designer notes, or existing-page references.

### `component-reuse`

Forces disciplined discovery of core UI and project-specific components before creating new UI.

### `pr-summary`

Defines the final PR-ready summary format.

## Project Setup

This extension intentionally does not store project-specific architecture or component inventories.

Each frontend project should add project context:

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

Templates are available in:

```text
templates/project-qwen/
```

Copy them into a frontend project and replace examples with real project facts.

## GitBucket MCP

GitBucket MCP is optional and configured by each developer outside this extension.

If GitBucket MCP is available, `/work:orchestrate` can use it to read analyst specifications. If not, provide the specification as a local file or pasted text.

The extension does not require GitBucket credentials or API keys.

## Pixso MCP

Pixso MCP is planned but not required for the MVP.

Until Pixso MCP is available, provide design input through:

1. Pixso link plus description.
2. Screenshots.
3. Exported text.
4. Designer comments.
5. Existing page reference.

## Dirty Git Policy

If the working tree is dirty, the orchestrator must:

1. Show changed files.
2. Ask whether to continue, stash, or stop.
3. Run `git stash push` only after explicit approval.
4. Never silently stash, revert, or overwrite user changes.

## MVP Limitations

The MVP does not:

1. Build a RAG service.
2. Require Pixso MCP.
3. Implement GitBucket MCP.
4. Create commits.
5. Create pull requests.
6. Store project-specific component inventories inside the extension.
