# Define Data Contracts

Use this prompt after analyst requirements are validated and before source adapters/resolvers or A2UI schema are generated.

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
- Runtime должен быть deterministic.
- LLM помогает создать artifacts на этапе разработки, но не принимает runtime UI decisions.

Input:
- Analyst spec: <path-or-pasted-spec>
- Existing components/catalog: <path-or-pasted-catalog|none>
- Existing API hooks/services: <path-or-pasted-api|none>
- Existing TanStack Query hooks/query keys: <path-or-pasted-query-code|none>
- Existing stores/hooks: <path-or-pasted-store-hooks|none>
- Source payload examples: <path-or-pasted-xml-graphql-rest-examples|none>
- Existing rules: <path-or-pasted-rules|none>

Нужно:
1. Определить screen inputs.
2. Определить все data contracts, нужные экрану.
3. Для каждого contract описать normalized output model.
4. Для каждого async contract описать TanStack Query ownership:
   - query key;
   - params;
   - enabled condition;
   - stale/cache policy if known;
   - loading/empty/error states;
   - invalidation triggers.
5. Описать mutation/action contracts:
   - payload;
   - response;
   - success behavior;
   - error behavior;
   - refetch/invalidation behavior.
6. Описать resolver contracts, если screen/schema должны ссылаться на derived data.
7. Отдельно перечислить required normalizers, fixtures и tests.
8. Пометить blockers, если аналитика/API/source payload не дают описать contract безопасно.

Output:

data-contracts.md:

## Screen Inputs

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
- Data Contract может ссылаться на TanStack Query dependency, но не должен описывать raw useQuery implementation inside schema.
- A2UI/schema может ссылаться на contract id или resolver id, но не должна владеть fetch/query/business logic.
- UI components consume normalized props only.
- Если один UI параметр может прийти из нескольких sources, опиши resolver/normalizer priority and fallback.
- Если missing API/source details мешают безопасному contract, не выдумывай backend behavior; добавь blocking question.
````
