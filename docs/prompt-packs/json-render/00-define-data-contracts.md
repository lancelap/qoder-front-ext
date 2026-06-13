# Define Data Contracts

Use this prompt after analyst requirements, component catalog, and source inventory are validated, and before source adapters/resolvers or A2UI schema are generated.

````text
Ты проектируешь Data Contracts для A2UI/json-render screen.

Цель:
Преобразовать требования аналитика в явные app-level контракты данных, которые потом смогут использовать:
- screen store;
- TanStack Query dependencies;
- source adapters / resolvers;
- normalizers;
- rules;
- A2UI schema;
- tests.

Важно:
- Не генерируй React components.
- Не генерируй A2UI screen schema.
- Не пиши raw fetch, raw URL, queryFn, useQuery или query lifecycle внутри JSON/schema.
- Не используй raw XML / GraphQL / backend paths как UI contract.
- XML, GraphQL, REST и context payload details должны быть спрятаны за adapter/resolver/normalizer.
- Не определяй Data Contracts без `component-catalog.md` и `source-inventory.md`.
- Screen Inputs должны быть только внешними входами экрана: route params, host context, explicit props, user/permissions.
- Не добавляй в Screen Inputs normalized fields, hook outputs, XML paths, `enrichedXml` fields, confo params или API response fields.
- Runtime должен быть deterministic.
- LLM помогает создать artifacts на этапе разработки, но не принимает runtime UI decisions.

Input:
- Analyst spec: <path-or-pasted-spec>
- Component catalog: <path-or-pasted-component-catalog>
- Source inventory: <path-or-pasted-source-inventory>
- Existing rules: <path-or-pasted-rules|none>

Нужно:
1. Проверить, что `component-catalog.md` покрывает UI blocks из spec.
2. Проверить, что `source-inventory.md` покрывает API/hooks/query/context sources, нужные spec.
3. Проверить, что hooks из `source-inventory.md` описаны не только именем, но и params/output/loading/error/cache behavior. Если есть только hook names, вернуть BLOCKED.
4. Определить screen inputs.
5. Определить все data contracts, нужные экрану.
6. Для каждого contract описать normalized output model.
7. Для каждого async contract описать TanStack Query ownership:
   - query key;
   - params;
   - enabled condition;
   - stale/cache policy if known;
   - loading/empty/error states;
   - invalidation triggers.
8. Описать mutation/action contracts:
   - payload;
   - response;
   - success behavior;
   - error behavior;
   - refetch/invalidation behavior.
9. Описать resolver contracts, если screen/schema должны ссылаться на derived data.
10. Отдельно перечислить required normalizers, fixtures и tests.
11. Пометить blockers, если catalog/source inventory/аналитика не дают описать contract безопасно.

Output:

data-contracts.md:

## Screen Inputs

Allowed sources:
- route params;
- host context;
- explicit props;
- authenticated user/permissions.

Disallowed sources:
- normalized contract fields;
- hook outputs;
- XML paths;
- `enrichedXml` fields;
- confo params;
- API response fields.

| Input | Type | Required | Source | Notes |
| --- | --- | --- | --- | --- |
| <input> | <type> | <yes/no> | <route/context/store> | <notes> |

## Data Contract: <contract.id>

Purpose:
<why this data is needed by the screen>

Owner:
<store|query dependency|resolver|component-owned adapter>

Params:

```ts
type <ContractParams> = {
  // app-level params only
};
```

Normalized output:

```ts
type <ContractOutput> = {
  // normalized app-level shape consumed by store/rules/UI
};
```

Transport source:
- kind: <xml|graphql|rest|context|existing-hook|unknown>
- source: <endpoint/query/hook/source-name>
- notes: <transport-specific notes, not UI bindings>

Query/cache:
- query key:
- enabled when:
- stale/cache policy:
- loading state:
- empty state:
- error state:

Invalidation/refetch:
- after:
- reason:

Used by:
- store path:
- resolver:
- rule:
- component:
- scenario:

Source inventory mapping:
- source id:
- raw fields/actions used:
- normalizer/resolver needed:

Required artifacts:
- normalizer:
- fixture:
- unit test:
- integration/store test:

## Action Contract: <action.id>

Purpose:
<why this mutation/action exists>

Payload:

```ts
type <ActionPayload> = {
  // app-level payload only
};
```

Response:

```ts
type <ActionResponse> = {
  // normalized response shape, if used by UI/store
};
```

Success behavior:
- <state update / notification / close modal / navigation / refetch>

Error behavior:
- <field error / global error / rollback / keep previous value>

Invalidation/refetch:
- <contract/query key/action to refresh>

Source inventory mapping:
- source id:
- raw fields/actions used:
- normalizer/resolver needed:

Required artifacts:
- API adapter:
- fixture:
- unit test:
- store/action test:

## Resolver Contract: <resolver.id>

Purpose:
<why derived data is needed>

Params:

```ts
type <ResolverParams> = {
  // app-level params only
};
```

Output:

```ts
type <ResolverOutput> = {
  // normalized derived data
};
```

Dependencies:
- data contract:
- action contract:
- rule:

States:
- loading:
- empty:
- error:

## Blocking Questions

| Gap | Why it blocks | Owner | Needed answer |
| --- | --- | --- | --- |
| <gap> | <reason> | <analyst|backend|frontend> | <specific answer> |

Rules:
- Data Contract = app-level контракт данных для screen/store/resolver/query.
- Data Contract должен опираться на `source-inventory.md`; не выдумывай source fields, API, query keys или actions.
- Data Contract должен учитывать `component-catalog.md`; не добавляй fields/actions/states, которые не нужны spec/catalog.
- Data Contract может ссылаться на TanStack Query dependency, но не должен описывать raw useQuery implementation inside schema.
- Existing hooks могут появляться только в Source inventory mapping или Transport source, но не как Screen Input и не как прямой runtime dependency schema.
- Если hook содержит business logic, UI state, modal/navigation или mutation orchestration, добавь blocking/migration question вместо прямого использования hook.
- A2UI/schema может ссылаться на contract id или resolver id, но не должна владеть fetch/query/business logic.
- UI components consume normalized props only.
- Если один UI параметр может прийти из нескольких sources, опиши resolver/normalizer priority and fallback.
- Если missing catalog/source/API details мешают безопасному contract, не выдумывай behavior; добавь blocking question.
````
