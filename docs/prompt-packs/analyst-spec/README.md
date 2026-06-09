# Prompt Pack: Analyst Spec

Use this pack when an analyst needs to write or review a frontend-ready feature specification before any `json-render` spec or implementation work starts.

Recommended order:

1. `00-create-spec.md`
2. `01-review-gwt.md`
3. `02-review-api.md`
4. `03-review-ui-states.md`
5. `04-catalog-mapping.md`
6. Handoff to `json-render/00-define-data-contracts.md`

Goal:

- make business behavior explicit through Given/When/Then scenarios;
- describe API contracts before UI generation;
- hand off API contracts into app-level Data Contracts before A2UI/json-render schema generation;
- define UI states, errors, permissions, and acceptance criteria;
- identify which catalog components can be used;
- block generation when required behavior or data is missing.

Rule:

- the analyst spec is the source for business behavior;
- API contracts are backend/source inputs, not UI binding contracts;
- Pixso/design is the source for visual structure and visual states;
- the component catalog is the source for allowed UI building blocks;
- do not invent API behavior, hidden fields, states, or components that are not in the approved inputs.
