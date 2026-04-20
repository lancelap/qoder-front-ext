---
name: component-reuse
description: Use before creating or modifying frontend UI to find and reuse core UI and project-specific components.
---

# Component Reuse

Use Russian by default.

Before creating a new UI component, always inspect existing options.

## Required Discovery Order

1. Read project `QWEN.md`.
2. Read `.qwen/skills/component-inventory/SKILL.md` if present.
3. Read `.qwen/skills/project-architecture/SKILL.md` if present.
4. Search the project for similar screens and flows.
5. Search imports from the core UI library.
6. Search for project-specific large components.
7. Search by domain terms, route names, page titles, API methods, labels, and component names.

## Reuse Rules

Prefer core UI components for standard UI primitives:

1. Buttons.
2. Inputs.
3. Selects.
4. Modals.
5. Tables.
6. Tabs.
7. Tooltips.
8. Notifications.

Prefer project-specific components when:

1. They already implement the same domain flow.
2. They already handle required loading, empty, error, or permission states.
3. They are used on multiple existing pages.
4. Their data assumptions match the backend contract.

Create a new component only when:

1. No core UI component fits.
2. No project-specific component fits.
3. Extending an existing component would make it less coherent.
4. The new behavior is genuinely reusable or the page needs a local component.

## Required Explanation

When creating a new component, explain:

1. Which existing components were considered.
2. Why they do not fit.
3. Whether the new component is local to the page or reusable.
4. Where it should be documented if reusable.
