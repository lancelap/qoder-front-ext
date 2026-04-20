---
name: design-validation
description: Use before frontend implementation to validate Pixso links, screenshots, design exports, designer notes, or existing-page references against the specification.
---

# Design Validation

Use Russian by default.

The MVP does not require Pixso MCP. Accept design input from:

1. Pixso link plus user-provided description.
2. Screenshots.
3. Exported text description.
4. Designer comments.
5. Existing page reference.

## Checklist

Check:

1. Affected screens.
2. Required UI states.
3. Desktop, tablet, and mobile requirements.
4. Hover, focus, disabled, and error states.
5. Empty states.
6. Button labels, error text, placeholders, and helper text.
7. Differences between analyst specification and design.
8. Core UI components that should be used.
9. Existing project components that may fit.
10. Accessibility risks such as missing labels, unclear focus states, or inaccessible controls.

## Output Format

Return:

1. Verdict: `ready`, `ready with risks`, or `blocked`.
2. Screens and states covered by the design.
3. Missing states or layout variants.
4. Spec/design mismatches.
5. Components likely to reuse.
6. Questions for designer or analyst.

## Blocking Rules

Block implementation when:

1. The target screen or flow is unclear.
2. Required states are missing and cannot be inferred from existing project patterns.
3. Spec and design conflict on user-visible behavior.
4. The design requires components or behavior outside the approved scope.
