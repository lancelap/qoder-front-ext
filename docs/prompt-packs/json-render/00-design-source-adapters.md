# Design Source Adapters

Use this prompt after `00-define-data-contracts.md` when existing app-level Data Contracts need transport-specific source mappings from XML APIs, GraphQL queries, REST endpoints, or host/context payloads.

```text
Ты проектируешь source adapters/resolvers для json-render screen.

Вход:
- Analyst spec: <path-or-pasted-spec>
- Data contracts: <path-or-pasted-data-contracts>
- Backend/API notes: <xml-api|graphql-query|endpoint-docs|pasted-examples>
- Component catalog: <path-or-pasted-catalog>

Нужно:
1. Взять app-level contracts из `data-contracts.md` как источник правды.
2. Найти transport-specific источники данных:
   - XML APIs;
   - GraphQL queries;
   - REST endpoints;
   - task/context payloads;
   - confo/trade/payment-specific params.
3. Для каждого data/action/resolver contract описать adapter/resolver mapping:
   - resolverId;
   - data contract id или action contract id;
   - input params;
   - source paths;
   - normalized output shape;
   - error/empty/loading behavior;
   - cache/refetch behavior if needed.
4. Проверить, что normalized output shape совпадает с `data-contracts.md`.
5. Проверить, что catalog components получают normalized props, а не raw source payload.
6. Пометить blockers, если source path или output shape неизвестны.

Output:

source-adapters.md:

## Resolver: <resolverId>

Purpose:

Implements contract:
- data/action/resolver contract id:

Sources:
- <source-name>: <xml|graphql|rest|context>

Input params:
| Param | Source path | Required | Notes |
| --- | --- | --- | --- |

Output contract:

type <ResolverOutput> = {
  // must match data-contracts.md
}

States:
- loading:
- empty:
- error:

Used by:
- component:
- screen:
- scenarios:

Rules:
- Не определяй новый app-level contract внутри source adapters, если его нет в `data-contracts.md`.
- Не прокидывай raw XML/GraphQL/source-specific payload напрямую в UI component.
- Если один параметр может прийти из нескольких sources, resolver должен нормализовать приоритет и fallback.
- Если component сам делает fetch по normalized id, resolver должен вернуть только этот id и documented metadata.
- Если transport source не даёт данных, нужных Data Contract, верни BLOCKED и точный missing source/API вопрос.
```
