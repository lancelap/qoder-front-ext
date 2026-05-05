---
description: Run a small-iteration Pixso-to-React flow: handoff, component map, skeleton, filters, table + selection, states + responsive QA.
---

You are guiding a Pixso-to-React implementation through small controlled iterations.

User task:

{{args}}

Work in Russian by default.

Use this command when the user has a Pixso link, screenshot, export, DSL, or pasted design description and wants to avoid a single large implementation prompt.

Mandatory flow:
1. Start with handoff. Do not write code. Produce a frontend contract using `docs/prompt-packs/pixso-screen-iteration/00-handoff.md` as the workflow shape.
2. Build the component map. Inspect the project and map design elements to existing React components using `docs/prompt-packs/pixso-screen-iteration/01-component-map.md`.
3. Stop and ask the user to approve the handoff and component map before editing files.
4. After approval, implement only one iteration at a time:
   - skeleton
   - filters
   - table + selection
   - states + responsive QA
5. Before each implementation iteration, restate scope and out-of-scope in 3-6 bullets.
6. After each iteration, return changed files, verification result, and the next suggested prompt.

Rules:
- One iteration must have one responsibility.
- Do not add dependencies without explicit approval.
- Do not create new UI primitives when project components exist.
- Do not connect real APIs unless the user explicitly includes that in the iteration scope.
- If the design/spec is insufficient, stop with a missing-information report instead of guessing.
