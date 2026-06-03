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
2. API contracts for every async store action, resolver, and business action.
3. Design reference or designer-approved UI structure.
4. Component catalog with allowed component types and props contracts.
5. Source adapter/resolver contracts for transport-specific data such as XML APIs, GraphQL queries, or multiple backend endpoints.
6. Registry/action/store adapter notes when available.

If any required input is missing, block generation and ask for the smallest missing contract.

## Generation Rules

- Use only components present in the catalog/registry.
- Do not create arbitrary HTML, CSS, JavaScript, inline functions, or unregistered component types.
- Do not invent API endpoints, response fields, actions, states, permissions, filters, table columns, or validation rules.
- Map every user action to an action id from the analyst spec or component catalog.
- Map every data binding to a documented store state path, resolver output, or component prop contract.
- Keep XML, GraphQL, endpoint-specific field names, and response shapes inside source adapters or resolvers.
- Components should receive normalized app-level props such as `tradeId`, not transport-specific paths from XML or GraphQL payloads.
- Keep complex behavior inside catalog components, store actions, action handlers, or adapters, not inside JSON.
- If a complex UI block is missing from the catalog, request a separate component spec before generating the screen.
- Prefer `blocked` over plausible but unsupported JSON.

## Data Normalization

Use this boundary:

```text
XML / GraphQL / multiple endpoints
        |
source adapters / resolvers / mappers
        |
app-level contract
        |
json-render spec / React components
```

`screen.render.json` may call a resolver by id and pass explicit params, but it should not encode transport parsing logic. The resolver owns mapping from source-specific fields to the normalized contract used by UI components.

Example:

```json
{
  "resolvers": {
    "validationErrors": {
      "resolverId": "getMtValidationErrors",
      "params": {
        "step": "{{data.task.parameters.STEP}}",
        "rejectionReason": "{{data.confo.params.MT_CHANNEL_REJECTION_REASON}}",
        "rejectionDocument": "{{data.confo.params.MT_DOCUMENT_VALIDATION_ERRORS}}"
      }
    }
  },
  "tree": {
    "type": "ValidationErrorsBlock",
    "props": {
      "data": "{{resolvers.validationErrors}}"
    }
  }
}
```

The resolver contract must define output shape. The component contract must consume that output shape, not the original XML/GraphQL payload.

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
  "resolvers": {},
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
4. Every store binding and resolver reference has a state, API, or resolver contract.
5. Every action has a handler contract.
6. Permissions/read-only/visibility behavior matches the analyst spec.
7. Given/When/Then scenarios are covered by tree, actions, states, and adapters.
8. Missing states or opaque parts are explicit.
9. Transport-specific mappings are isolated in source adapters/resolvers.
10. There are no invented components, fields, actions, states, or hidden behavior.

## Blocking Conditions

Block when:

- a visible UI block has no catalog component;
- an action has no behavior contract;
- a store binding or resolver reference has no state, API, or resolver contract;
- a component depends directly on XML/GraphQL/source-specific payload fields instead of app-level props;
- required UI state is absent from spec/catalog;
- JSON requires a component prop not supported by its contract;
- the spec and design conflict on user-visible behavior;
- the generated JSON contains arbitrary runtime logic.

## Recommended Prompt Packs

- `docs/prompt-packs/analyst-spec/` for preparing and reviewing analyst specs.
- `docs/prompt-packs/json-render/` for catalog coverage, generation, review, and test planning.
