# Design Source Adapters

Use this prompt when UI needs the same app-level parameters or data from XML APIs, GraphQL queries, or multiple backend endpoints.

```text
Ты проектируешь source adapters/resolvers для json-render screen.

Вход:
- Analyst spec: <path-or-pasted-spec>
- Backend/API notes: <xml-api|graphql-query|endpoint-docs|pasted-examples>
- Component catalog: <path-or-pasted-catalog>
- Target UI data needs: <tradeId|validationErrors|other-normalized-contracts>

Нужно:
1. Найти transport-specific источники данных:
   - XML APIs;
   - GraphQL queries;
   - REST endpoints;
   - task/context payloads;
   - confo/trade/payment-specific params.
2. Определить app-level contract, который нужен UI.
3. Для каждого resolver описать:
   - resolverId;
   - input params;
   - source paths;
   - normalized output shape;
   - error/empty/loading behavior;
   - cache/refetch behavior if needed.
4. Проверить, что catalog components получают normalized props, а не raw source payload.
5. Пометить blockers, если source path или output shape неизвестны.

Output:

source-adapters.md:

## Resolver: <resolverId>

Purpose:

Sources:
- <source-name>: <xml|graphql|rest|context>

Input params:
| Param | Source path | Required | Notes |
| --- | --- | --- | --- |

Output contract:

type <ResolverOutput> = {
  // normalized app-level shape
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
- Не прокидывай raw XML/GraphQL/source-specific payload напрямую в UI component.
- Если один параметр может прийти из нескольких sources, resolver должен нормализовать приоритет и fallback.
- Если component сам делает fetch по normalized id, resolver должен вернуть только этот id и documented metadata.
```
