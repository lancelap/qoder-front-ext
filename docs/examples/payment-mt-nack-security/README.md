# Payment MT NACK Security Example

This example shows one pilot page built through the `json-render` workflow.

Artifacts:

- `spec.md` - analyst-facing behavior, API/action contracts, and Given/When/Then scenarios.
- `source-inventory.md` - raw host context and host action inventory used before Data Contracts.
- `data-contracts.md` - app-level screen data, resolver, action, query/cache, and test contracts.
- `source-adapters.md` - resolver contracts that normalize confo/task payloads into app-level data.
- `component-catalog.md` - page-specific catalog components used by the JSON screen.
- `screen.render.json` - example `json-render` screen spec.
- `registry.tsx` - example registry allowlist for the screen.

Scenario summary:

- The NACK page shows MT validation errors and a decision radio group.
- The user can click `Просмотр сделки` to open a side page.
- The side page receives normalized `tradeId` from confo through a resolver.
- The user selects one of four radio decisions:
  - `Исправить статик дату`
  - `Исправить подписантов`
  - `Отправить на репроцесс`
  - `Все верно`
- The bottom-right `Закончить` button sends the selected decision.

Important boundary:

```text
confo/task payload
        |
source inventory
        |
data contracts
        |
source adapters / resolvers
        |
app-level contract: nackContext, tradeId, validationErrors, selectedDecision
        |
json-render / React catalog components
```
