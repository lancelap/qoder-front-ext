# Inventory Component Catalog

Use this prompt before Data Contracts, source adapters, or A2UI schema generation. It turns existing project components into an explicit allowlist for LLM-generated artifacts.

````text
Ты инвентаризируешь component catalog для A2UI/json-render workflow.

Цель:
Создать или обновить `component-catalog.md`, чтобы следующие prompts могли выбирать только разрешенные UI building blocks и не придумывали компоненты, props, actions или states.

Важно:
- Не генерируй A2UI schema.
- Не генерируй React components.
- Не предлагай generic div/input/table вместо domain component без явной пометки frontend owner.
- Не придумывай props/actions/states, если их нет в коде, типах, Storybook, README или design notes.
- Если component отсутствует, создай `Proposed Component Request`, а не используй его как готовый catalog component.

Input:
- Project components paths: <path-or-pasted-components-list>
- Existing component catalog: <path-or-pasted-catalog|none>
- TypeScript props/types: <path-or-pasted-types|none>
- Storybook/examples/tests: <path-or-pasted-examples|none>
- Analyst spec/design context: <path-or-pasted-spec-design|none>

Нужно:
1. Найти компоненты, которые можно использовать в A2UI/json-render.
2. Для каждого компонента определить stable component type.
3. Зафиксировать import path.
4. Описать props contract.
5. Описать data requirements:
   - какие normalized props нужны;
   - какие store bindings допустимы;
   - какие resolver outputs допустимы;
   - делает ли компонент собственный fetch/query.
6. Описать actions/events:
   - event name;
   - action payload;
   - owner: component | screen action | store action | external host.
7. Описать states:
   - loading;
   - empty;
   - error;
   - disabled/read-only;
   - forbidden/no-permission;
   - validation.
8. Описать limitations и when-not-to-use.
9. Сформировать missing/proposed component requests.

Output:

component-catalog.md:

## Component: <ComponentType>

Import:
- `<import-path>`

Use when:
- <case>

Do not use when:
- <case>

Props contract:

```ts
type <ComponentType>Props = {
  // documented props only
};
```

Data requirements:
- normalized props:
- allowed data contracts:
- allowed resolver outputs:
- component-owned async behavior:

Actions/events:
| Event | Action id/payload | Owner | Notes |
| --- | --- | --- | --- |
| <event> | <payload> | <owner> | <notes> |

States:
| State | Owned by component | Required input | Notes |
| --- | --- | --- | --- |
| <state> | <yes/no> | <prop/data/action> | <notes> |

Permissions/read-only:
- <behavior>

Examples:
- <example usage or path>

Known limitations:
- <limitation>

## Proposed Component Requests

| Proposed component | Needed for | Minimal props/actions/states | Can generation continue |
| --- | --- | --- | --- |
| <name> | <reason> | <scope> | <yes/no> |

Rules:
- `component-catalog.md` is the allowlist for generated A2UI schema.
- If a component type is not in catalog or explicitly approved as proposed, schema generation must be blocked.
- Catalog components consume app-level Data Contracts or resolver outputs, not raw XML/GraphQL/REST/context payload paths.
- If component behavior is hidden in hooks, document the behavior and mark whether it must be moved to store/action/data contract before generation.
````
