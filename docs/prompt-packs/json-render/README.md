# Prompt Pack: json-render

Use this pack when converting a validated analyst spec, approved design, and component catalog into a `json-render` screen spec.

Recommended order:

1. `00-design-source-adapters.md` when XML, GraphQL, multiple endpoints, or context payloads must be normalized.
2. `00-validate-catalog-coverage.md`
3. `01-generate-json-render-spec.md`
4. `02-review-generated-spec.md`
5. `03-generate-tests-from-gwt.md`

Scope:

- target `@json-render/react` style runtime rendering with a project registry;
- do not require Vercel hosting or Vercel infrastructure;
- generate JSON composition, not arbitrary React code;
- normalize XML, GraphQL, and endpoint-specific payloads through source adapters/resolvers;
- complex UI behavior belongs in catalog components and action/data adapters.

Rule:

- generation is blocked if required components, actions, data sources, permissions, or states are missing.
