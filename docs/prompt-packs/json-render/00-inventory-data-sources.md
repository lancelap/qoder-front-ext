# Inventory Data Sources

Use this prompt before Data Contracts. It inventories existing APIs, hooks, query keys, mutations, XML/GraphQL/REST endpoints, and host/context payloads so Data Contracts are grounded in real sources.

````text
Ты инвентаризируешь source inventory для A2UI/json-render workflow.

Цель:
Создать `source-inventory.md`, который описывает реальные доступные источники данных и actions перед созданием app-level Data Contracts.

Важно:
- Source Inventory не является UI contract.
- Source Inventory не является A2UI schema.
- Source Inventory не должен создавать JSON-owned fetch/query layer.
- Не пиши raw fetch, queryFn, useQuery или transport parsing logic в A2UI schema.
- Existing React hooks являются source facts, а не UI contract.
- Не рекомендуй импортировать или вызывать hooks из A2UI schema/generated screen.
- Не превращай hook output fields в Screen Inputs.
- Не нормализуй данные в этом шаге; только опиши существующие sources, fields, behavior и gaps.
- Не выдумывай backend fields/endpoints/query keys/mutations.

Input:
- Analyst spec: <path-or-pasted-spec>
- Existing API services/hooks: <path-or-pasted-api-code|none>
- Existing TanStack Query hooks/query keys: <path-or-pasted-query-code|none>
- Existing mutations/actions: <path-or-pasted-mutation-code|none>
- XML/GraphQL/REST docs or payload examples: <path-or-pasted-source-docs|none>
- Host/context payload examples: <path-or-pasted-context-payloads|none>
- Existing stores/hooks: <path-or-pasted-store-hooks|none>

Нужно:
1. Найти все источники данных, которые могут понадобиться экрану:
   - REST endpoints;
   - GraphQL queries/mutations;
   - XML APIs;
   - TanStack Query hooks/query keys;
   - service methods;
   - host/context payloads;
   - existing stores/hooks;
   - external host actions.
2. Для каждого source описать raw params and raw output fields.
3. Описать loading/empty/error semantics, если они известны.
4. Описать cache/refetch/invalidation behavior, если он уже есть в проекте.
5. Описать existing normalizers/mappers, если они есть.
6. Отметить какие fields/actions нужны analyst spec.
7. Отметить unknowns/blockers.
8. Не принимать решение о финальной UI model; это сделает `00-define-data-contracts.md`.
9. Для существующих hooks описать их как legacy source:
   - hook name;
   - params;
   - raw output;
   - loading/empty/error behavior;
   - query key/cache/refetch/invalidation, если есть;
   - mutations/actions, если hook их скрывает.
10. Если hook смешивает fetch, parsing, business rules, UI state, modal/navigation или mutation, пометить `migrationNeeded: true` и указать, что должно переехать в store/resolver/action/Data Contract.

Output:

source-inventory.md:

## Source: <source.id>

Kind:
- <rest|graphql|xml|tanstack-query|query-hook|legacy-hook|service-hook|store-hook|host-context|external-action|unknown>

Owner:
- <backend|frontend|host-runtime|unknown>

Purpose:
- <why source exists>

Used by scenarios:
- <scenario id/name>

Raw params:

```ts
type <SourceParams> = {
  // raw/source-level params only
};
```

Raw output:

```ts
type <SourceOutput> = {
  // raw/source-level shape only
};
```

Known raw fields needed by spec:
| Raw field/path | Meaning | Required | Notes |
| --- | --- | --- | --- |
| <field> | <meaning> | <yes/no> | <notes> |

Existing query/cache behavior:
- query key:
- enabled condition:
- stale/cache policy:
- refetch:
- invalidation:

States:
- loading:
- empty:
- error:

Existing normalizers/mappers:
- <path-or-name|none>

Existing hook details:
- hook name:
- hook params:
- hook output:
- wraps useQuery:
- wraps mutation/action:
- migrationNeeded:
- migration notes:

Risks:
- <risk>

## Action/Mutation Source: <action.source.id>

Kind:
- <rest|graphql|service|host-action|store-action|unknown>

Raw payload:

```ts
type <ActionPayload> = {
  // raw/source-level payload only
};
```

Raw response:

```ts
type <ActionResponse> = {
  // raw/source-level response only
};
```

Success behavior:
- <known behavior>

Error behavior:
- <known behavior>

Invalidation/refetch:
- <known behavior>

## Source Gaps

| Gap | Why it matters | Owner | Needed answer |
| --- | --- | --- | --- |
| <gap> | <reason> | <backend|frontend|host-runtime|analyst> | <specific answer> |

Handoff to Data Contracts:
| Spec need | Candidate source(s) | Needs normalizer/resolver | Notes |
| --- | --- | --- | --- |
| <need> | <source ids> | <yes/no> | <notes> |

Rules:
- `source-inventory.md` describes raw/source-level facts only.
- `data-contracts.md` converts source facts into app-level UI/store/resolver contracts.
- A2UI schema must not bind directly to raw source paths from `source-inventory.md`.
- If a source is missing or ambiguous, do not invent it; add a Source Gap.
- Hook names alone are insufficient. If hook params/output/loading/error/cache behavior are unknown, add a Source Gap.
- Existing hooks may be used as evidence for source inventory only; do not suggest direct hook usage in Data Contracts or A2UI schema.
````
