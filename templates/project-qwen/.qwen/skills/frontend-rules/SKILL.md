---
name: frontend-rules
description: Use during frontend implementation to follow project rules for API integration, forms, permissions, errors, loading states, accessibility, and component creation.
---

# Frontend Rules

Use Russian by default.

Replace these rules with project-specific rules.

## API Integration

1. Use the standard project API client.
2. Do not call `fetch` or `axios` directly unless the project standard allows it.
3. Use existing request and response types where available.
4. Do not invent backend response fields.
5. Surface backend errors through the project-standard error handling path.

## Forms

1. Use the project-standard form library and validation approach.
2. Implement validation rules from the analyst specification.
3. Show field-level errors when the design or project pattern requires it.
4. Disable submit while the request is pending when the project pattern does this.

## Permissions

1. Reuse existing permission helpers.
2. Hide or disable actions according to existing project behavior.
3. Do not invent permission rules not described in the specification or existing code.

## UI States

Implement states required by the specification and design:

1. Loading.
2. Empty.
3. Success.
4. Error.
5. Disabled.
6. Pending mutation.

## Accessibility

1. Preserve semantic buttons, links, headings, labels, and form associations.
2. Keep keyboard access for dialogs, menus, and forms.
3. Do not remove visible focus states.
4. Use accessible names for icon-only controls.

## Component Creation

1. Prefer core UI components.
2. Prefer project-specific reusable components.
3. Keep page-only components near the page.
4. Document reusable components in `.qwen/skills/component-inventory/SKILL.md`.
