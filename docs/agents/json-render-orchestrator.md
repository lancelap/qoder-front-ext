# json-render Orchestrator Agent

Use `agents/json-render-orchestrator.md` to coordinate the A2UI/json-render workflow before generating or reviewing artifacts.

The agent is needed because prompt order alone is not enough. A model can read existing hooks or partially generated files and treat them as UI contracts. The orchestrator prevents that by checking readiness gates before the next prompt is used.

## Agent vs Skill vs Prompt

| Layer | Purpose | Use when |
| --- | --- | --- |
| Agent | Chooses the next workflow step and blocks unsafe generation | You have requirements, existing hooks, source docs, or a set of generated files and need to know what to do next |
| Skill | Defines architectural rules and guardrails | You need the model to follow the qoder json-render contract across the whole task |
| Prompt | Generates or reviews one concrete artifact | You already know which file must be produced now |

Short rule:

```text
Agent answers: what is the next safe step?
Skill answers: what rules must the model follow?
Prompt answers: generate/review this exact artifact.
```

## When To Use The Agent

Use the agent at the start of a real task:

```text
Use agent json-render-orchestrator.
Here are analyst requirements.
Decide which artifacts are needed and which prompt should be used next.
Do not generate schema yet.
```

Use the agent when artifacts already exist:

```text
Use agent json-render-orchestrator.
Here are spec.md, data-contracts.md, and payment-change-purpose.schema.ts.
Check workflow readiness and tell me whether this is blocked, review-required, or ready for the next prompt.
```

Use the agent when old hooks are involved:

```text
Use agent json-render-orchestrator.
Inspect the existing hooks and generated artifacts.
If hooks are used as UI contracts or Screen Inputs, return BLOCKED and tell me which artifact must be fixed.
```

## When Not To Use The Agent

Do not use the agent when the next artifact is already clear and prerequisites are ready.

Examples:

```text
Use docs/prompt-packs/json-render/00-inventory-data-sources.md.
Generate source-inventory.md from these hooks/services/XML examples.
```

```text
Use docs/prompt-packs/json-render/02-review-generated-spec.md.
Review this generated screen.render.json.
```

## Required Order

The agent enforces this order:

```text
analyst requirements / design
  -> spec.md
  -> component-catalog.md
  -> source-inventory.md
  -> catalog mapping
  -> data-contracts.md
  -> source-adapters.md or explicit-not-needed
  -> catalog coverage review
  -> screen.render.json / <screen>.schema.ts
  -> generated artifact review
  -> tests / test plan
  -> runtime spike or implementation plan
```

## Expected Verdicts

| Verdict | Meaning |
| --- | --- |
| `NEXT_STEP` | One prompt should be used next |
| `BLOCKED` | A required contract/source/review is missing or unsafe |
| `REVIEW_REQUIRED` | Generated artifact exists but must be reviewed before continuing |
| `READY_FOR_GENERATION` | Schema generation prerequisites are ready |
| `READY_FOR_RUNTIME_SPIKE` | Schema and review/tests are ready enough to plan runtime wiring |

## Common Blockers

The agent should block when:

- `component-catalog.md` is missing before Data Contracts or schema;
- `source-inventory.md` is missing before Data Contracts;
- a hook is listed only by name without params/output/loading/error/cache behavior;
- generated `Screen Inputs` contain hook outputs, XML paths, `enrichedXml` fields, confo params, or API response fields;
- schema is attempted from only `spec.md + data-contracts.md`;
- `source-adapters.md` is missing while XML/GraphQL/REST/context/hook sources must be normalized;
- tests are requested before schema and generated artifact review.

## Recommended Daily Flow

1. Start with the agent.
2. Let the agent choose the next prompt.
3. Run that prompt to create or review one artifact.
4. Return to the agent for readiness check.
5. Continue only when the agent returns `NEXT_STEP`, `READY_FOR_GENERATION`, or `READY_FOR_RUNTIME_SPIKE`.

Do not ask the model to "try anyway" after `BLOCKED`. Fix the smallest missing artifact first.
