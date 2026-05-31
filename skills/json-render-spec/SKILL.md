---
name: json-render-spec
description: Use when converting validated analyst specs, approved designs, and component catalogs into json-render screen specs or reviewing json-render specs for catalog, API, action, state, and scenario coverage.
---

# json-render Spec

Use Russian by default.

## Purpose

Create or review `json-render` screen specs for `@json-render/react` using project-owned component registries. This skill does not require Vercel infrastructure.

## Inputs

Require:

1. Analyst spec with Given/When/Then scenarios.
2. API contracts for every async data source and action.
3. Design reference or designer-approved UI structure.
4. Component catalog with allowed component types and props contracts.
5. Registry/action/data adapter notes when available.

If any required input is missing, block generation and ask for the smallest missing contract.

## Generation Rules

- Use only components present in the catalog/registry.
- Do not create arbitrary HTML, CSS, JavaScript, inline functions, or unregistered component types.
- Do not invent API endpoints, response fields, actions, states, permissions, filters, table columns, or validation rules.
- Map every user action to an action id from the analyst spec or component catalog.
- Map every data binding to a documented data source.
- Keep complex behavior inside catalog components, action handlers, or data adapters, not inside JSON.
- If a complex UI block is missing from the catalog, request a separate component spec before generating the screen.
- Prefer `blocked` over plausible but unsupported JSON.

## Output Shape

Use this top-level shape unless the project defines a stricter one:

```json
{
  "schemaVersion": "qoder-json-render-screen/v1",
  "screen": {
    "id": "",
    "title": "",
    "route": ""
  },
  "dataSources": {},
  "actions": {},
  "tree": {},
  "metadata": {
    "sourceSpec": "",
    "design": "",
    "catalogVersion": "",
    "generatedBy": "qoder"
  }
}
```

## Review Checklist

Return `ready`, `ready with risks`, or `blocked`.

Check:

1. JSON is valid and uses the expected schema version.
2. Every component type exists in registry.
3. Every prop is allowed by the component contract.
4. Every data source has an API contract.
5. Every action has a handler contract.
6. Permissions/read-only/visibility behavior matches the analyst spec.
7. Given/When/Then scenarios are covered by tree, actions, states, and adapters.
8. Missing states or opaque parts are explicit.
9. There are no invented components, fields, actions, states, or hidden behavior.

## Blocking Conditions

Block when:

- a visible UI block has no catalog component;
- an action has no behavior contract;
- a data source has no API contract;
- required UI state is absent from spec/catalog;
- JSON requires a component prop not supported by its contract;
- the spec and design conflict on user-visible behavior;
- the generated JSON contains arbitrary runtime logic.

## Recommended Prompt Packs

- `docs/prompt-packs/analyst-spec/` for preparing and reviewing analyst specs.
- `docs/prompt-packs/json-render/` for catalog coverage, generation, review, and test planning.
