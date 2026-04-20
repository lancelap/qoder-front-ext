---
name: component-inventory
description: Use before creating or modifying frontend UI. Lists core UI and project-specific reusable components, when to use them, and where to find examples.
---

# Component Inventory

Use Russian by default.

Before creating a new component:
1. Check the core UI library.
2. Check this inventory.
3. Search the project with `rg`.
4. Reuse existing project-specific components when they match the use case.
5. Create a new component only if no existing component fits.

## Core UI Components

Replace these examples with the real project imports.

### Button

Path: `@company/ui/Button`

Use when:
- rendering standard actions;
- rendering submit, cancel, save, delete, or secondary actions.

Do not use when:
- rendering route navigation that should be a link;
- a project-specific action component already wraps button behavior.

Examples:
- `src/pages/example/ExamplePage.tsx`

### Modal

Path: `@company/ui/Modal`

Use when:
- rendering blocking dialogs;
- rendering confirmations;
- rendering short forms.

Do not use when:
- the flow has multiple complex steps;
- a project-specific drawer or wizard component is already used for the same pattern.

Examples:
- `src/features/example/components/ExampleModal.tsx`

## Project Components

Add real project-specific components below.

### ExampleProjectTable

Path: `src/features/example/components/ExampleProjectTable.tsx`

Use when:
- implementing example list screens;
- the page needs server-side pagination;
- filters match the standard example filter model.

Do not use when:
- rendering a small static list;
- backend response does not match the component assumptions.

Examples:
- `src/pages/example/ExampleListPage.tsx`

Notes:
- Handles loading, empty, and error states.
- Reuse existing row actions unless the specification requires different behavior.
