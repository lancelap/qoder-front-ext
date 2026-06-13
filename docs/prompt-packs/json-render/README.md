# Prompt Pack: A2UI / json-render

Use this pack when converting a validated analyst spec, approved design, and component catalog into deterministic A2UI/json-render artifacts for developer review.

Recommended order:

1. `00-inventory-component-catalog.md` to create an explicit allowlist from existing project components.
2. `00-inventory-data-sources.md` to inventory existing APIs, hooks, query keys, actions, and payloads.
3. `00-define-data-contracts.md` to turn analyst requirements, catalog, and source inventory into app-level screen data contracts.
4. `00-design-source-adapters.md` when XML, GraphQL, multiple endpoints, or context payloads must be normalized.
5. `00-validate-catalog-coverage.md`
6. `01-generate-json-render-spec.md`
7. `02-review-generated-spec.md`
8. `03-generate-tests-from-gwt.md`

Scope:

- treat json-render as a strict LLM contract, not a universal UI runtime;
- target deterministic runtime rendering with a project registry;
- do not require Vercel hosting or Vercel infrastructure;
- generate structured artifacts such as screen schema, rules, normalizers, fixtures, tests, and docs, not arbitrary React code;
- inventory component catalog and source facts before defining app-level data contracts;
- define app-level data contracts before generating source adapters or screen schema;
- normalize XML, GraphQL, and endpoint-specific payloads through source adapters/resolvers;
- complex UI behavior belongs in catalog components, store actions, action adapters, or source adapters.
- LLM-generated artifacts must be validated before use and reviewed by a developer.

Rule:

- generation is blocked if required components, actions, store bindings, resolver contracts, permissions, or states are missing.
- Data Contracts generation is blocked until component catalog and source inventory are available.
- runtime must not call LLM to decide what UI to show.
