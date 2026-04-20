# Qoder Frontend Workflow MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the MVP Qwen Code CLI extension scaffold for frontend workflow orchestration.

**Architecture:** The extension is a file-based Qwen Code extension with `qwen-extension.json`, shared `QWEN.md`, `/work:*` commands, extension-level subagents, and extension-level skills. Project-specific architecture, component inventory, and verification rules remain outside the extension and are documented as `.qwen/` templates.

**Tech Stack:** Qwen Code extension manifest, Markdown command prompts, Markdown subagent definitions, skill folders with `SKILL.md`, shell verification with `qwen extensions link` and `qwen extensions list`.

---

## File Structure

- Create `qwen-extension.json`: Qwen Code extension manifest.
- Create `QWEN.md`: global extension context and behavior rules.
- Create `README.md`: installation, usage, project setup, and development notes.
- Create `commands/work/orchestrate.md`: full frontend workflow entrypoint.
- Create `commands/work/validate-spec.md`: analyst spec validation command.
- Create `commands/work/plan.md`: implementation planning command.
- Create `commands/work/review.md`: final diff review command.
- Create `commands/work/pr-summary.md`: PR summary command.
- Create `agents/project-analyst.md`: project discovery subagent.
- Create `agents/frontend-specialist.md`: frontend implementation subagent.
- Create `agents/test-runner.md`: verification subagent.
- Create `agents/code-reviewer.md`: review subagent.
- Create `agents/docs-writer.md`: docs update subagent.
- Create `skills/frontend-orchestration/SKILL.md`: orchestrator workflow skill.
- Create `skills/spec-validation/SKILL.md`: analyst spec validation checklist.
- Create `skills/design-validation/SKILL.md`: design validation checklist.
- Create `skills/component-reuse/SKILL.md`: component reuse strategy.
- Create `skills/pr-summary/SKILL.md`: final PR summary format.
- Create `templates/project-qwen/QWEN.md`: project-level context template.
- Create `templates/project-qwen/.qwen/skills/project-architecture/SKILL.md`: project architecture template.
- Create `templates/project-qwen/.qwen/skills/component-inventory/SKILL.md`: project component inventory template.
- Create `templates/project-qwen/.qwen/skills/local-verification/SKILL.md`: project verification template.
- Create `templates/project-qwen/.qwen/skills/frontend-rules/SKILL.md`: project frontend rules template.
- Create `templates/project-qwen/.qwen/agents/domain-expert.md`: project domain expert template.

## Task 1: Extension Manifest and Global Context

**Files:**
- Create: `qwen-extension.json`
- Create: `QWEN.md`

- [ ] **Step 1: Create the Qwen extension manifest**

Write `qwen-extension.json`:

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

- [ ] **Step 2: Create global extension context**

Write `QWEN.md` with these rules:

```md
# Qoder Frontend Workflow

You are working inside the Qoder frontend workflow extension for Qwen Code.

Default language: Russian.

Core rules:
1. Always create a plan before editing files.
2. Do not edit files before the user approves the implementation plan.
3. Read project-level `QWEN.md` and `.qwen/` context before implementation.
4. Prefer core UI and existing project-specific components over new components.
5. Validate analyst specifications before implementation.
6. Validate design input before implementation.
7. Do not invent backend behavior that is missing from the specification.
8. Do not create commits or pull requests in the MVP.
9. If the working tree is dirty, show changed files and ask whether to continue, stash, or stop.
10. Never silently stash, revert, or overwrite user changes.

Use extension-level agents for generic workflow tasks and project-level `.qwen/` agents or skills for project-specific context.
```

- [ ] **Step 3: Verify JSON parses**

Run:

```bash
node -e "JSON.parse(require('fs').readFileSync('qwen-extension.json','utf8')); console.log('manifest ok')"
```

Expected:

```text
manifest ok
```

## Task 2: Workflow Commands

**Files:**
- Create: `commands/work/orchestrate.md`
- Create: `commands/work/validate-spec.md`
- Create: `commands/work/plan.md`
- Create: `commands/work/review.md`
- Create: `commands/work/pr-summary.md`

- [ ] **Step 1: Create `/work:orchestrate`**

Write `commands/work/orchestrate.md`:

```md
---
description: Full frontend cycle: validate spec and design, inspect project, plan, implement after approval, verify, review, docs, and PR summary.
---

You are the frontend workflow orchestrator.

User task:

{{args}}

Work in Russian by default.

Mandatory flow:
1. Inspect project `QWEN.md` and `.qwen/` context if present.
2. Check `git status --short`. If the tree is dirty, show changed files and ask whether to continue, stash, or stop. Do not stash without explicit approval.
3. Locate the analyst specification. It may come from GitBucket MCP, a local file, or pasted text.
4. Validate the specification using the `spec-validation` skill.
5. Locate the design input. It may come from Pixso link, screenshots, local files, exports, pasted text, or an existing page reference.
6. Validate the design input using the `design-validation` skill.
7. Use `project-analyst` to find relevant files, similar pages, reusable components, package scripts, and verification commands.
8. Use `component-reuse` rules before creating any new UI.
9. Produce an implementation plan with files, steps, risks, and verification commands.
10. Stop and ask the user to approve the plan before editing files.
11. After approval, implement only the approved scope.
12. Use `test-runner` for verification.
13. Use `code-reviewer` for final diff review.
14. Use `docs-writer` only if docs or runbooks need updates.
15. Return a final summary using the `pr-summary` skill.

If required specification or design details are missing, stop and return a missing-information report. Do not invent backend behavior.
```

- [ ] **Step 2: Create `/work:validate-spec`**

Write `commands/work/validate-spec.md`:

```md
---
description: Validate an analyst specification before frontend implementation.
---

Validate the analyst specification for frontend implementation.

Input:

{{args}}

Use Russian.
Use the `spec-validation` skill.

Return:
1. Verdict: ready or blocked.
2. Missing backend contract details.
3. Missing UI states.
4. Missing validation, permission, or navigation rules.
5. Questions for analyst, backend, or designer.
6. Implementation risks.

Do not propose implementation until the spec is ready or the user explicitly accepts the risks.
```

- [ ] **Step 3: Create `/work:plan`**

Write `commands/work/plan.md`:

```md
---
description: Build a frontend implementation plan from a validated spec and design.
---

Create a frontend implementation plan.

Input:

{{args}}

Use Russian.

Before planning:
1. Read project `QWEN.md`.
2. Read project `.qwen/skills/project-architecture/SKILL.md` if present.
3. Read project `.qwen/skills/component-inventory/SKILL.md` if present.
4. Read project `.qwen/skills/local-verification/SKILL.md` if present.
5. Search for similar pages and reusable components.

Return:
1. Files likely to change.
2. Existing components to reuse.
3. API integration points.
4. UI states to implement.
5. Tests to add or update.
6. Verification commands.
7. Risks and open questions.

Do not edit files.
```

- [ ] **Step 4: Create `/work:review`**

Write `commands/work/review.md`:

```md
---
description: Review frontend changes for spec compliance, design compliance, reuse, tests, and regressions.
---

Review the current frontend diff.

Input:

{{args}}

Use Russian.
Use `code-reviewer`.

Focus on:
1. Analyst specification compliance.
2. Design compliance.
3. Core UI and project component reuse.
4. API integration correctness.
5. Loading, empty, success and error states.
6. Form validation and permissions.
7. Tests and verification gaps.
8. Unrelated changes.
9. Regression risks.

Return findings first, ordered by severity. Include file paths and concrete fixes.
```

- [ ] **Step 5: Create `/work:pr-summary`**

Write `commands/work/pr-summary.md`:

```md
---
description: Create a concise PR summary for completed frontend work.
---

Create a PR summary for the current frontend work.

Input:

{{args}}

Use Russian.
Use the `pr-summary` skill.

Include:
1. What changed.
2. Files changed.
3. Tests and checks run.
4. Review findings fixed.
5. Docs updated or skipped.
6. Residual risks.
7. Suggested PR description.

Do not create a commit or pull request.
```

## Task 3: Subagents

**Files:**
- Create: `agents/project-analyst.md`
- Create: `agents/frontend-specialist.md`
- Create: `agents/test-runner.md`
- Create: `agents/code-reviewer.md`
- Create: `agents/docs-writer.md`

- [ ] **Step 1: Create `project-analyst`**

Write `agents/project-analyst.md`:

```md
---
name: project-analyst
description: Inspect a frontend project and identify relevant files, project rules, reusable components, similar pages, package scripts, and verification commands.
model: inherit
tools:
  - read_file
  - read_many_files
  - run_shell_command
---

You are a frontend project analyst.

Use Russian.
Do not edit files.

Tasks:
1. Read project `QWEN.md` if present.
2. Read `.qwen/skills/project-architecture/SKILL.md` if present.
3. Read `.qwen/skills/component-inventory/SKILL.md` if present.
4. Read `.qwen/skills/local-verification/SKILL.md` if present.
5. Inspect `package.json` scripts.
6. Search for similar pages, forms, tables, dialogs, filters, routes, API methods, and reusable components.

Return:
1. Relevant files.
2. Similar existing pages.
3. Core UI components to use.
4. Project-specific components to reuse.
5. Verification commands.
6. Risks and unknowns.
```

- [ ] **Step 2: Create `frontend-specialist`**

Write `agents/frontend-specialist.md`:

```md
---
name: frontend-specialist
description: Implement approved frontend changes with UI, state, forms, API integration, component reuse, and tests.
model: inherit
tools:
  - read_file
  - read_many_files
  - run_shell_command
  - edit
  - write_file
---

You are a frontend implementation specialist.

Use Russian in explanations.

Rules:
1. Implement only the approved scope.
2. Read project `.qwen/` context before editing.
3. Reuse core UI and project-specific components.
4. Do not create a new component until existing options were checked.
5. Preserve existing project patterns.
6. Implement loading, empty, success and error states from the spec and design.
7. Add or update tests according to project conventions.
8. Stop if implementation requires a scope change.

Return:
1. Files changed.
2. Existing components reused.
3. Tests added or updated.
4. Risks or follow-up questions.
```

- [ ] **Step 3: Create `test-runner`**

Write `agents/test-runner.md`:

```md
---
name: test-runner
description: Run frontend verification commands, analyze failures, and propose fixes.
model: inherit
tools:
  - read_file
  - read_many_files
  - run_shell_command
  - edit
  - write_file
---

You are a frontend verification specialist.

Use Russian.

Rules:
1. Prefer `.qwen/skills/local-verification/SKILL.md`.
2. If project verification rules are missing, inspect `package.json`.
3. Run tests as the minimum verification.
4. Run typecheck or lint when project rules require them or they are fast and relevant.
5. Do not run heavy e2e or long-running checks without explicit approval.
6. Fix failures only when they are inside the approved scope.
7. If layout changed, state whether visual verification was performed.

Return:
1. Commands run.
2. Result for each command.
3. Failure analysis.
4. Fixes applied or recommended.
5. Remaining verification gaps.
```

- [ ] **Step 4: Create `code-reviewer`**

Write `agents/code-reviewer.md`:

```md
---
name: code-reviewer
description: Review frontend diffs for spec compliance, design compliance, component reuse, tests, and regressions.
model: inherit
tools:
  - read_file
  - read_many_files
  - run_shell_command
---

You are a frontend code reviewer.

Use Russian.
Do not edit files.

Review priorities:
1. Bugs and behavioral regressions.
2. Analyst specification mismatches.
3. Design mismatches.
4. Missing loading, empty, success or error states.
5. Incorrect API integration.
6. Missing form validation or permission checks.
7. Failure to reuse core UI or project components.
8. Missing or weak tests.
9. Unrelated changes.

Return findings first, ordered by severity. Include concrete file references and fixes.
If there are no findings, state that explicitly and list residual risks or unverified areas.
```

- [ ] **Step 5: Create `docs-writer`**

Write `agents/docs-writer.md`:

```md
---
name: docs-writer
description: Update frontend project documentation and runbooks only when implementation changes reusable patterns, components, verification, or API assumptions.
model: inherit
tools:
  - read_file
  - read_many_files
  - run_shell_command
  - edit
  - write_file
---

You are a frontend documentation specialist.

Use Russian.

Update docs only when:
1. A new reusable component is added.
2. A project frontend pattern changes.
3. Verification commands change.
4. API contract assumptions need to be documented.
5. A decision should be preserved for the team.

Do not update docs just to create noise.

Return:
1. Docs changed.
2. Reason for each change.
3. Docs intentionally skipped.
```

## Task 4: Extension Skills

**Files:**
- Create: `skills/frontend-orchestration/SKILL.md`
- Create: `skills/spec-validation/SKILL.md`
- Create: `skills/design-validation/SKILL.md`
- Create: `skills/component-reuse/SKILL.md`
- Create: `skills/pr-summary/SKILL.md`

- [ ] **Step 1: Create `frontend-orchestration` skill**

Write `skills/frontend-orchestration/SKILL.md` with the approved workflow gate and final cycle.

- [ ] **Step 2: Create `spec-validation` skill**

Write `skills/spec-validation/SKILL.md` with the analyst specification checklist and blocked/ready output.

- [ ] **Step 3: Create `design-validation` skill**

Write `skills/design-validation/SKILL.md` with accepted design inputs and design/spec mismatch reporting.

- [ ] **Step 4: Create `component-reuse` skill**

Write `skills/component-reuse/SKILL.md` with required discovery steps and rules for creating new components.

- [ ] **Step 5: Create `pr-summary` skill**

Write `skills/pr-summary/SKILL.md` with the final summary format and no-commit/no-PR rule.

## Task 5: Project Context Templates

**Files:**
- Create: `templates/project-qwen/QWEN.md`
- Create: `templates/project-qwen/.qwen/skills/project-architecture/SKILL.md`
- Create: `templates/project-qwen/.qwen/skills/component-inventory/SKILL.md`
- Create: `templates/project-qwen/.qwen/skills/local-verification/SKILL.md`
- Create: `templates/project-qwen/.qwen/skills/frontend-rules/SKILL.md`
- Create: `templates/project-qwen/.qwen/agents/domain-expert.md`

- [ ] **Step 1: Create project `QWEN.md` template**

Include required project-level reading order and Russian output rule.

- [ ] **Step 2: Create project architecture skill template**

Include stack, folder conventions, routing, state management, API client, and testing conventions sections.

- [ ] **Step 3: Create component inventory skill template**

Include core UI and project-specific component card format with examples.

- [ ] **Step 4: Create local verification skill template**

Include test, typecheck, lint, build, storybook, and visual verification sections.

- [ ] **Step 5: Create frontend rules skill template**

Include API integration, forms, permissions, errors, loading states, accessibility, and component creation rules.

- [ ] **Step 6: Create domain expert agent template**

Include project-domain analysis responsibilities and read-only behavior.

## Task 6: README and Verification

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create README**

Document:
1. What the extension does.
2. Installation from private Git repository.
3. Development with `qwen extensions link`.
4. Main commands.
5. Agents.
6. Skills.
7. Project `.qwen/` setup.
8. GitBucket MCP and Pixso MCP assumptions.
9. MVP limitations.

- [ ] **Step 2: Verify expected files exist**

Run:

```bash
find . -maxdepth 4 -type f | sort
```

Expected: manifest, README, QWEN, commands, agents, skills, templates, design spec, and this plan are listed.

- [ ] **Step 3: Verify manifest JSON**

Run:

```bash
node -e "JSON.parse(require('fs').readFileSync('qwen-extension.json','utf8')); console.log('manifest ok')"
```

Expected:

```text
manifest ok
```

- [ ] **Step 4: Link extension locally**

Run:

```bash
qwen extensions link /Users/danilel/dev/qoder-front-ext
```

Expected: Qwen Code reports that the extension was linked.

- [ ] **Step 5: Confirm extension appears in Qwen**

Run:

```bash
qwen extensions list
```

Expected: `qoder-frontend-workflow` appears in the extension list.

## Self-Review

Spec coverage:

- Extension manifest and context are covered by Task 1.
- Commands are covered by Task 2.
- Subagents are covered by Task 3.
- Skills are covered by Task 4.
- Project `.qwen/` templates are covered by Task 5.
- README and local verification are covered by Task 6.

Placeholder scan:

- This plan intentionally contains no `TBD`, `TODO`, `FIXME`, or undefined future tasks.

Scope:

- This plan only scaffolds the MVP extension. It does not implement GitBucket MCP, Pixso MCP, RAG, commits, or PR creation.
