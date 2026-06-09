---
name: json-render-spec
description: Use when converting validated analyst specs, approved designs, and component catalogs into deterministic A2UI/json-render artifacts or reviewing schema, rules, normalizers, tests, catalog, API, action, state, and scenario coverage.
---

# A2UI / json-render Spec

Use Russian by default.

## Purpose

Create or review deterministic A2UI/json-render artifacts using project-owned component, action, data contract, and rules registries. Treat json-render as a strict LLM contract, not as a universal UI runtime. LLM may generate schema, rules, normalizers, fixtures, tests, and docs for developer review; production runtime must remain deterministic.

## Inputs

Require:

1. Analyst spec with Given/When/Then scenarios.
2. Data contracts for every screen input, app-level data object, async query dependency, resolver, and business action.
3. API contracts for every async store action, resolver, and business action.
4. Design reference or designer-approved UI structure.
5. Component catalog with allowed component types and props contracts.
6. Source adapter/resolver contracts for transport-specific data such as XML APIs, GraphQL queries, or multiple backend endpoints.
7. Action registry and payload contracts.
8. Rules format when schema uses conditions, visibility, disabled, or options logic.
9. Registry/action/store adapter notes when available.

If any required input is missing, block generation and ask for the smallest missing contract.

## Data Contracts

Before generating source adapters or screen schema, require app-level Data Contracts.

Each screen data contract should define:

- screen inputs and params;
- normalized output model;
- owner layer: store, query dependency, resolver, or component-owned adapter;
- TanStack Query ownership for server-backed data: query key, enabled condition, loading/empty/error behavior, and invalidation/refetch triggers;
- action/mutation payload, response, success behavior, error behavior, and invalidation/refetch behavior;
- required normalizers, fixtures, and tests.

Data Contracts may reference existing API hooks, TanStack Query dependencies, or source adapter ids, but they must not put raw `fetch`, raw URLs, `queryFn`, `useQuery`, or transport parsing into schema.

## Generation Rules

- Use only components present in the catalog/registry.
- Do not create arbitrary HTML, CSS, JavaScript, inline functions, or unregistered component types.
- Do not invent API endpoints, response fields, actions, states, permissions, filters, table columns, or validation rules.
- Map every user action to an action id from the analyst spec or component catalog.
- Map every data binding to a Data Contract, documented store state path, resolver output, or component prop contract.
- Keep XML, GraphQL, endpoint-specific field names, and response shapes inside source adapters or resolvers.
- Components should receive normalized app-level props such as `tradeId`, not transport-specific paths from XML or GraphQL payloads.
- Do not place raw XML/GraphQL/backend paths in UI component props or resolver params inside schema.
- Keep complex behavior inside catalog components, store actions, action handlers, or adapters, not inside JSON.
- Generate rules as declarative objects, never executable JS strings.
- Generate normalizers only with fixture-based tests or an explicit artifact request for missing fixtures/tests.
- Do not generate React components unless the user explicitly asks for a proposed component spec.
- Do not generate runtime LLM calls.
- If a complex UI block is missing from the catalog, request a separate component spec before generating the screen.
- Prefer `blocked` over plausible but unsupported JSON.

## Data Normalization

Use this boundary:

```text
XML / GraphQL / REST / host context
        |
source adapters / resolvers / mappers
        |
Data Contracts / app-level contract
        |
A2UI schema / React components
```

A2UI schema may reference a data contract or resolver by id and pass explicit app-level params, but it should not encode transport parsing logic. The source adapter/resolver owns mapping from source-specific fields to the normalized contract used by UI components.

Example:

```json
{
  "inputs": {
    "taskId": {
      "type": "string",
      "required": true
    }
  },
  "data": {
    "nackContext": {
      "contractId": "paymentMtNack.context",
      "params": {
        "taskId": "{{inputs.taskId}}"
      }
    },
    "validationErrors": "{{resolvers.validationErrors}}"
  },
  "resolvers": {
    "validationErrors": {
      "resolverId": "getMtValidationErrors",
      "params": {
        "context": "{{data.nackContext}}"
      }
    }
  },
  "tree": {
    "type": "ValidationErrorsBlock",
    "props": {
      "data": "{{data.validationErrors}}"
    }
  }
}
```

The resolver contract must define output shape. The component contract must consume that output shape, not the original XML/GraphQL payload.

## LLM Artifact Contract

Prefer structured artifacts over React code:

- screen schema;
- rules config;
- normalizers;
- fixtures;
- unit tests and e2e-like test cases;
- docs;
- component requests when the catalog lacks a needed component.

Generated artifacts must pass validation before runtime use:

```text
LLM output
  -> schema/Zod validation
  -> TypeScript checks
  -> tests
  -> developer review
  -> deterministic runtime render
```

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
  "inputs": {},
  "data": {},
  "state": {},
  "resolvers": {},
  "actions": {},
  "rules": {},
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
4. Every data reference, store binding, and resolver reference has a Data Contract, state contract, API contract, or resolver contract.
5. Every action has a handler contract.
6. Permissions/read-only/visibility behavior matches the analyst spec.
7. Given/When/Then scenarios are covered by tree, actions, states, and adapters.
8. Missing states or opaque parts are explicit.
9. Transport-specific mappings are isolated in source adapters/resolvers.
10. Rules and conditions are declarative and contain no executable JS.
11. Normalizers have fixtures/tests or are explicit artifact requests.
12. There are no invented components, fields, actions, states, or hidden behavior.

## Blocking Conditions

Block when:

- a visible UI block has no catalog component;
- an action has no behavior contract;
- a data reference, store binding, or resolver reference has no Data Contract, state, API, or resolver contract;
- a component depends directly on XML/GraphQL/source-specific payload fields instead of app-level props;
- required UI state is absent from spec/catalog;
- JSON requires a component prop not supported by its contract;
- the spec and design conflict on user-visible behavior;
- the generated JSON contains arbitrary runtime logic;
- conditions require arbitrary JavaScript;
- normalizers are generated without fixtures/tests and no artifact request is declared;
- runtime depends on LLM to decide UI behavior.

## Recommended Prompt Packs

- `docs/prompt-packs/analyst-spec/` for preparing and reviewing analyst specs.
- `docs/prompt-packs/json-render/` for catalog coverage, generation, review, and test planning.
