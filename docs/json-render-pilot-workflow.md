# json-render Pilot Workflow

This workflow validates spec-driven UI generation before connecting runtime libraries or adding platform infrastructure.

The goal is to prove that an analyst spec, data contracts, source adapters, component catalog, generated `screen.render.json`, and project `registry.tsx` can describe one real screen without inventing behavior.

## Artifacts

### `spec.md`

Owned by the analyst.

Must include:

- goal and affected users;
- roles and permissions;
- screens, entry points, and exit points;
- Given/When/Then scenarios;
- API contracts;
- UI blocks;
- UI states;
- business rules;
- acceptance criteria;
- design references;
- open questions.

Use `docs/prompt-packs/analyst-spec/`.

### `component-catalog.md`

Owned by frontend/catalog maintainers.

Must include for each component:

- component type name used by `json-render`;
- React component/import path;
- when to use and when not to use;
- props schema or props contract;
- required store bindings, resolver outputs, or component-owned async behavior;
- supported actions;
- supported states;
- permissions/read-only behavior;
- examples;
- known limitations.

If the screen needs a complex component that is not in the catalog, create a separate component spec before generating the screen.

### `data-contracts.md`

Owned by frontend and backend integration maintainers.

Use this before source adapters/resolvers or A2UI schema generation.

Must include:

- screen inputs, such as route params, host task context, or store context;
- app-level data contracts used by the screen, store, rules, resolvers, and components;
- normalized output models;
- action/mutation contracts;
- TanStack Query ownership when data is server-backed:
  - query key;
  - params;
  - enabled condition;
  - loading/empty/error behavior;
  - invalidation/refetch triggers;
- required normalizers, fixtures, and tests;
- blocking questions for missing backend/source details.

Data contracts are app-level contracts. They may reference a TanStack Query dependency or resolver id, but they must not encode raw `fetch`, raw URL, `queryFn`, `useQuery`, or transport parsing logic inside JSON/schema.

### `source-adapters.md`

Owned by frontend/backend integration maintainers.

Use this after `data-contracts.md` when the same UI needs normalized parameters or data from different transports such as XML APIs, GraphQL queries, or multiple backend endpoints.

Must include for each adapter/resolver:

- resolver id used by `screen.render.json`;
- data contract id or action contract id implemented by the resolver/adapter;
- supported sources, such as `xml-trade-api`, `xml-confo-api`, or `graphql-trade-list`;
- input params and transport source mappings;
- normalized output contract consumed by UI;
- error/empty/loading behavior;
- caching/refetch rules if relevant;
- examples.

Boundary:

```text
XML / GraphQL / multiple endpoints
        |
source adapters / resolvers / mappers
        |
data contracts / app-level contract
        |
UI / json-render / React components
```

Example: one card component receives a normalized `tradeId`. The `tradeId` may come from `xml-trade-api`, `xml-confo-api`, or `graphql-trade-list`, but the card does not know that. It receives `tradeId` and owns or triggers its own data fetch according to its component contract.

### `screen.render.json`

Generated from validated inputs.

Must include:

- schema version;
- screen metadata;
- screen inputs, app-level data references, and local state;
- store state paths, API/action references, and resolver references;
- action ids and handler references;
- component tree using only catalog component types;
- explicit metadata linking back to spec, design, data contracts, source adapters, and catalog version.

Generation is blocked when required components, data contracts, resolver contracts, actions, states, or permissions are missing.

Use `docs/prompt-packs/json-render/`.

### `registry.tsx`

Owned by frontend.

Must map allowed JSON component types to React components and adapters:

```tsx
export const registry = {
  Screen: ScreenShell,
  PageHeader,
  FilterPanel,
  DataTable,
  EmptyState,
  ErrorState,
  UserPickerModal,
};
```

The registry is the allowlist. If a component type is not registered, generation or runtime render must fail.

## Pilot Steps

1. Choose one representative screen.
2. Write `spec.md` using `analyst-spec/00-create-spec.md`.
3. Review scenarios with `analyst-spec/01-review-gwt.md`.
4. Review API contracts with `analyst-spec/02-review-api.md`.
5. Review UI states with `analyst-spec/03-review-ui-states.md`.
6. Map UI blocks to components with `analyst-spec/04-catalog-mapping.md`.
7. Define `data-contracts.md` with `json-render/00-define-data-contracts.md`.
8. Create or update `source-adapters.md` for XML/GraphQL/multiple-endpoint mappings.
9. Design source adapters with `json-render/00-design-source-adapters.md`.
10. Create or update `component-catalog.md`.
11. Validate catalog and resolver coverage with `json-render/00-validate-catalog-coverage.md`.
12. Generate `screen.render.json` with `json-render/01-generate-json-render-spec.md`.
13. Review generated JSON with `json-render/02-review-generated-spec.md`.
14. Draft tests from Given/When/Then with `json-render/03-generate-tests-from-gwt.md`.
15. Only after the pilot JSON passes review, connect `@json-render/react` in a project branch.

## Acceptance Criteria

- The spec has no blocking Given/When/Then, API, state, or permission gaps.
- `data-contracts.md` defines every app-level data, action, resolver, query/cache, invalidation, and state contract used by the screen.
- Every UI block maps to an existing or explicitly approved proposed catalog component.
- `screen.render.json` contains no unregistered component types.
- Every action, store binding, data reference, and resolver reference in JSON is traceable to `spec.md` and `data-contracts.md`.
- Transport-specific XML/GraphQL/endpoint mappings are isolated in source adapters.
- UI components consume app-level contracts, not raw source payloads.
- Complex behavior remains in catalog components, store actions, action handlers, or adapters.
- The pilot identifies whether runtime rendering is viable before wider adoption.

## Non-Goals

- Do not use Vercel hosting or Vercel infrastructure.
- Do not generate arbitrary React code from raw design JSON.
- Do not let JSON become a second programming language for business logic.
- Do not bypass project component ownership or frontend review.
