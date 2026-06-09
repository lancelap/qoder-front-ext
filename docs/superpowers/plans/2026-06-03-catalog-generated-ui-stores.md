# План A2UI/catalog, сторов и LLM-контрактов

> **Позиционирование:** A2UI/json render не должен быть универсальным UI-runtime, который пытается заменить React. Это строгий контракт между бизнес-описанием, данными, rules, UI-компонентами, тестами и LLM. Runtime должен оставаться детерминированным, а LLM должна генерировать проверяемые артефакты на этапе разработки.

Сейчас отдельного `catalog` в проекте нет. Проект работает по старой схеме через `components/`, hooks и локальную бизнес-логику внутри React-слоя. Поэтому работа начинается не с `src/features/catalog`, а с выделения A2UI/catalog-слоя поверх существующих `components/`.

---

## Цель

Построить систему, где LLM не пишет хаотичный React-код, а генерирует структурированные артефакты:

- screen schema;
- rules config;
- normalizers;
- fixtures;
- test cases;
- docs;
- component requests, если нужного компонента нет в catalog.

Дальше эти артефакты проходят:

```text
LLM output
  -> schema/Zod validation
  -> TypeScript checks
  -> unit tests
  -> developer review
  -> deterministic runtime render
```

В production runtime не должен каждый раз спрашивать LLM, что показать пользователю. LLM помогает сгенерировать schema/rules/tests на этапе разработки, schema коммитится в git, runtime работает предсказуемо.

---

## Ключевая граница

```text
spec / screenshot / аналитическое описание
  -> LLM
  -> A2UI schema + rules + normalizers + fixtures + tests
  -> validation
  -> developer review
  -> runtime render
```

Runtime-граница:

```text
A2UI schema
  -> renderNode
  -> component registry из текущих components/
  -> Zustand screen store
  -> actions/resolvers/use-cases
  -> TanStack Query queryClient
  -> API layer
```

---

## Почему это нужно

LLM плохо работает, когда контекст размазан:

```text
component делает fetch
component парсит XML
component вычисляет rules
component открывает modal
component обновляет task
component инвалидирует query
component строит columns/rows
```

LLM работает заметно лучше, когда есть компактный контракт:

```text
available components
available actions
available data contracts
rules format
schema format
normalizer examples
fixtures
tests
validators
```

Поэтому задача не “сделать магический UI”, а создать ограниченный declarative layer, который LLM может безопасно заполнять.

---

## Что входит в A2UI-контракт

MVP-слои:

- `Layout Schema` - дерево UI-компонентов и bindings;
- `Component Registry` - allowlist существующих компонентов;
- `Action Registry` - allowlist действий;
- `Data Contracts` - какие данные нужны экрану и кто их поставляет;
- `Normalizers` - mapping XML/GraphQL/REST/raw API в app-level models;
- `Rules` - декларативные условия видимости/disabled/options/actions;
- `Validation` - Zod/JSON Schema validation generated artifacts;
- `Tests` - unit/e2e-like сценарии из Given/When/Then.

Важно: **не добавлять произвольный JavaScript в config**.

Плохо:

```json
{
  "visibleWhen": "return task.type === 'CASH' && user.role === 'ADMIN'"
}
```

Хорошо:

```json
{
  "visibleWhen": {
    "all": [
      { "field": "$data.task.transferType", "equals": "CASH" },
      { "field": "$user.role", "equals": "ADMIN" }
    ]
  }
}
```

---

## TanStack Query, store и Data Contracts

От TanStack Query не отказываемся.

TanStack Query отвечает за server-state:

- query keys;
- cache;
- dedupe;
- stale/refetch behavior;
- placeholderData;
- invalidation после mutations.

Zustand screen store отвечает за screen-state:

- form/draft state;
- applied filters;
- pagination/sort state;
- modal/side page state;
- selected action/radio state;
- loading/errors для A2UI;
- готовые UI view models.

A2UI schema не должна содержать raw `fetch`, raw URL, `useQuery`, query lifecycle или произвольный JS. Но schema/spec может ссылаться на **Data Contract** или **resolver id**, который реализован в TypeScript.

Правильная граница:

```text
Table UI
  -> onPageChange action
Zustand store
  -> setPagination
  -> loadTable
resolver/dependency
  -> queryClient.ensureQueryData
  -> API request
  -> normalize response
store.data.table
  -> rows/columns/total/page/pageSize
```

То есть `DataSource` допустим как **контракт в spec/schema**, но не как место, где JSON начинает сам владеть fetch/query/business logic.

---

## Целевая структура проекта

Пути адаптировать под реальный проект после inventory. Базовый вариант:

```text
src/
  components/
    ...текущие UI components...

  a2ui/
    core/
      renderNode.tsx
      resolveBinding.ts
      resolveCondition.ts
      executeAction.ts

    schema/
      screen.schema.ts
      component.schema.ts
      action.schema.ts
      data-contract.schema.ts
      rules.schema.ts

    registry/
      componentRegistry.ts
      actionRegistry.ts
      dataContractRegistry.ts

    catalog/
      component-catalog.md
      action-catalog.md
      data-contracts.md

    store/
      createA2UIStateBridge.ts
      a2ui.types.ts

    table/
      TableRenderer.tsx
      table.types.ts
      getValueByAccessor.ts
      cellRenderers.tsx

    llm/
      prompts/
        generate-screen.prompt.md
        generate-rules.prompt.md
        generate-normalizer.prompt.md
        generate-tests.prompt.md
      examples/
        task-card.example.ts
        table-with-pagination.example.ts
        radio-with-modal.example.ts
      validators/
        validateGeneratedSchema.ts
        validateGeneratedRules.ts
        validateGeneratedTests.ts

  entities/
    task/
      api/
      model/
      rules/
      normalizers/
      fixtures/

  screens/
    task-details/
      taskDetails.schema.ts
      TaskDetailsGeneratedPage.tsx

      spec/
        spec.md
        data-contracts.md
        catalog-coverage.md
        test-plan.md

      model/
        taskDetailsStore.ts
        taskDetails.types.ts
        taskDetails.actions.ts
        taskDetails.selectors.ts

        queries/
          taskDetailsQueryKeys.ts
          taskDetailsDependencies.ts

        rules/
          taskDetailsRules.ts
          resolveTaskDetailsRules.ts

        normalizers/
          normalizeTaskFromXml.ts
          normalizeTaskFromGraphql.ts

        fixtures/
          taskDetails.fixture.ts

      __tests__/
        taskDetailsStore.test.ts
        taskDetailsRules.test.ts
        normalizeTaskFromXml.test.ts
        taskDetails.schema.test.ts
```

Если в реальном проекте нет `entities/`, не вводить его насильно. Можно держать `rules/normalizers/fixtures` внутри `screens/<screen>/model/`, пока не появится повторное использование.

---

## Stage 0: Inventory текущего `components/` и hooks

**Цель:** понять, что уже есть и где размазана бизнес-логика.

Проверить:

- `src/components/**/*`;
- hooks рядом с components/screens;
- `useQuery`, `useMutation`, `useEffect`, `useMemo`;
- API/services;
- XML/GraphQL/REST normalizers, если они уже есть;
- tables, filters, pagination, modal/side page flows;
- task parameter cards/radio groups/rules.

Команды:

```bash
rg -n "useQuery|useMutation|useEffect|useMemo|fetch|axios|columns|rows|filter|pagination|pageSize|modal|drawer|sidePage|SidePage|rules|normalize|XML|GraphQL" src
```

```bash
rg -n "export function|export const|React.FC|forwardRef" src/components
```

Результат: `docs/a2ui-components-inventory.md`.

Формат:

```md
# A2UI Components Inventory

| Component | Path | Current owner | Props source | Has business logic | Candidate A2UI type | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `Button` | `src/components/Button/Button.tsx` | shared UI | props | no | `Button` | ready |
| `DataTable` | `src/components/DataTable/DataTable.tsx` | shared UI | props + hook | pagination/sort in hook | `DataTable` | needs adapter |
| `TaskParamsCard` | `src/components/TaskParamsCard/index.tsx` | task screen | hook | rules/modal/update | proposed | split logic |
```

---

## Stage 1: Component Registry и Component Catalog

**Цель:** дать LLM компактный список разрешённых UI-компонентов, а runtime - allowlist.

Файлы:

- `src/a2ui/registry/componentRegistry.ts`;
- `src/a2ui/catalog/component-catalog.md`;
- adapters рядом с `a2ui/registry/adapters/` или `components/`.

Пример registry:

```ts
export const componentRegistry = {
  DataTable: {
    component: DataTableAdapter,
    propsSchema: dataTablePropsSchema,
  },
  RadioParamGroup: {
    component: RadioParamGroupAdapter,
    propsSchema: radioParamGroupPropsSchema,
  },
  ModalParamEditor: {
    component: ModalParamEditorAdapter,
    propsSchema: modalParamEditorPropsSchema,
  },
  SidePageLauncher: {
    component: SidePageLauncherAdapter,
    propsSchema: sidePageLauncherPropsSchema,
  },
};
```

Пример `component-catalog.md`:

````md
## `RadioParamGroup`

Use for task parameter radio choices controlled by rules.

Props:

```ts
type RadioParamGroupProps = {
  param: string;
  value: string | null;
  options: Array<{ label: string; value: string; disabled?: boolean }>;
  disabled?: boolean;
  onChangeAction: string;
};
```

Rules:

- does not fetch task;
- does not compute options;
- options come from rules output;
- emits `onChangeAction` only.
````

---

## Stage 2: Action Registry

**Цель:** LLM не должна придумывать действия. Она выбирает только из разрешённых action contracts.

Файлы:

- `src/a2ui/registry/actionRegistry.ts`;
- `src/a2ui/catalog/action-catalog.md`;
- `src/a2ui/schema/action.schema.ts`.

Пример:

```ts
export const actionRegistry = {
  "task.updateParam": {
    payloadSchema: z.object({
      taskId: z.string(),
      param: z.string(),
      value: z.unknown(),
    }),
  },
  "modal.open": {
    payloadSchema: z.object({
      modalId: z.string(),
      params: z.record(z.string(), z.unknown()).optional(),
    }),
  },
  "sidePage.open": {
    payloadSchema: z.object({
      sidePageId: z.string(),
      params: z.record(z.string(), z.unknown()).optional(),
    }),
  },
  "state.set": {
    payloadSchema: z.object({
      path: z.string(),
      value: z.unknown(),
    }),
  },
};
```

Runtime может исполнять эти actions через screen store/action handlers. JSON не содержит inline functions.

---

## Stage 3: Data Contracts вместо хаотичных fetch в компонентах

**Цель:** описывать данные как контракт, но реализацию держать в TypeScript.

Файлы:

- `src/a2ui/registry/dataContractRegistry.ts`;
- `src/a2ui/catalog/data-contracts.md`;
- screen-level `spec/data-contracts.md`;
- screen/entity normalizers and dependencies.

Пример data contract:

```ts
export const dataContractRegistry = {
  "task.getById": {
    inputSchema: z.object({ taskId: z.string() }),
    outputSchema: taskModelSchema,
  },
  "task.getRules": {
    inputSchema: z.object({ taskId: z.string() }),
    outputSchema: taskRulesModelSchema,
  },
};
```

Screen dependency использует TanStack Query:

```ts
export function createTaskDetailsDependencies(queryClient: QueryClient) {
  return {
    getTask: async ({ taskId }: { taskId: string }) => {
      const raw = await queryClient.ensureQueryData({
        queryKey: taskDetailsQueryKeys.task(taskId),
        queryFn: () => taskApi.getById({ taskId }),
      });

      return normalizeTaskFromXml(raw);
    },
  };
}
```

Важно: schema может ссылаться на `"task.getById"`, но fetch/queryFn/normalization остаются в TypeScript.

---

## Stage 4: Rules format

**Цель:** вынести условия из компонентов в декларативный rules format, который LLM может генерировать и который можно тестировать.

Файлы:

- `src/a2ui/schema/rules.schema.ts`;
- `src/entities/task/rules/taskRules.ts` или `src/screens/<screen>/model/rules/*`;
- `resolveRules.ts`;
- tests.

Пример:

```ts
export const taskRules = [
  {
    id: "cash-counterparty-pay-party-role",
    when: {
      all: [
        { field: "TRANSFER_TYPE", equals: "CASH" },
        { field: "PAY_PARTY_ROLE", equals: "COUNTERPARTY" },
      ],
    },
    then: {
      fields: {
        PAY_PARTY_ROLE: {
          visible: true,
          disabled: false,
          options: ["COUNTERPARTY", "OUR_SIDE"],
        },
      },
    },
  },
];
```

Тест:

```ts
it("shows PAY_PARTY_ROLE field for CASH and COUNTERPARTY", () => {
  const result = resolveRules({
    TRANSFER_TYPE: "CASH",
    PAY_PARTY_ROLE: "COUNTERPARTY",
  });

  expect(result.fields.PAY_PARTY_ROLE.visible).toBe(true);
  expect(result.fields.PAY_PARTY_ROLE.disabled).toBe(false);
});
```

---

## Stage 5: Normalizers и fixtures

**Цель:** LLM может помогать генерировать normalizers из XML/GraphQL/REST, но каждый normalizer должен иметь fixtures и tests.

Файлы:

- `src/entities/task/normalizers/normalizeTaskFromXml.ts`;
- `src/entities/task/fixtures/taskXml.fixture.ts`;
- `src/entities/task/normalizers/normalizeTaskFromXml.test.ts`.

Пример:

```ts
export function normalizeTaskFromXml(raw: XmlTaskResponse): TaskModel {
  return {
    id: raw.Task.Id,
    transferType: raw.Task.Parameters.TRANSFER_TYPE,
    payPartyRole: raw.Task.Parameters.PAY_PARTY_ROLE,
    status: raw.Task.Status,
    counterpartyName: raw.Task.Counterparty.Name,
  };
}
```

Тест обязателен:

```ts
it("maps TRANSFER_TYPE and PAY_PARTY_ROLE", () => {
  const result = normalizeTaskFromXml(xmlFixture);

  expect(result.transferType).toBe("CASH");
  expect(result.payPartyRole).toBe("COUNTERPARTY");
});
```

---

## Stage 6: Screen schema и store

**Цель:** screen schema описывает UI, а store владеет screen-state и orchestration.

Файлы:

- `src/screens/task-details/taskDetails.schema.ts`;
- `src/screens/task-details/TaskDetailsGeneratedPage.tsx`;
- `src/screens/task-details/model/taskDetailsStore.ts`;
- `src/screens/task-details/model/taskDetails.actions.ts`;
- `src/screens/task-details/model/taskDetails.types.ts`.

Пример schema:

```ts
export const taskDetailsSchema = {
  id: "task-details",
  inputs: {
    taskId: "string",
  },
  data: {
    task: {
      contract: "task.getById",
      params: {
        taskId: "$inputs.taskId",
      },
    },
    rules: {
      contract: "task.getRules",
      params: {
        taskId: "$inputs.taskId",
      },
    },
  },
  sections: [
    {
      id: "payment-params",
      title: "Payment parameters",
      visibleWhen: {
        field: "$data.task.transferType",
        equals: "CASH",
      },
      children: [
        {
          component: "RadioParamGroup",
          param: "PAY_PARTY_ROLE",
          value: "$data.task.payPartyRole",
          options: "$data.rules.fields.PAY_PARTY_ROLE.options",
          disabled: "$data.rules.fields.PAY_PARTY_ROLE.disabled",
          onChange: {
            action: "task.updateParam",
            payload: {
              taskId: "$inputs.taskId",
              param: "PAY_PARTY_ROLE",
              value: "$event.value",
            },
          },
        },
      ],
    },
  ],
};
```

Если screen должен работать строго через Zustand store, `data` можно компилировать в store dependencies. Важно, чтобы runtime не исполнял произвольный JS и не ходил в raw API из компонента.

---

## Stage 7: LLM prompts/examples/validators

**Цель:** дать LLM маленький, строгий контекст вместо всего проекта.

Файлы:

```text
src/a2ui/llm/
  prompts/
    generate-screen.prompt.md
    generate-rules.prompt.md
    generate-normalizer.prompt.md
    generate-tests.prompt.md
  examples/
    task-card.example.ts
    table-with-pagination.example.ts
    radio-with-modal.example.ts
  validators/
    validateGeneratedSchema.ts
    validateGeneratedRules.ts
    validateGeneratedTests.ts
```

Prompt должен включать:

- available components;
- available actions;
- available data contracts;
- allowed condition format;
- examples;
- запрет arbitrary JavaScript;
- output format;
- validation expectations.

Пример prompt-фрагмента:

```md
You are generating A2UI screen schema.

Available components:
- DataTable
- RadioParamGroup
- ModalParamEditor
- SidePageLauncher

Available actions:
- task.updateParam
- modal.open
- sidePage.open
- state.set

Available data:
- $inputs.taskId
- $data.task.transferType
- $data.task.payPartyRole
- $data.rules.fields

Rules:
- Do not generate arbitrary JavaScript.
- Use declarative conditions only.
- Return only TypeScript object.
```

---

## Stage 8: Перенос бизнес-логики из hooks

Переносить по категориям.

### 8.1 Components inventory

Из `components/` и hooks вынести:

- `fetch`/`useQuery` orchestration;
- XML/GraphQL parsing;
- rules calculation;
- modal/side page routing;
- task update flow;
- query invalidation;
- table columns/rows mapping.

### 8.2 Store/use-case layer

Перенести в:

- screen store actions;
- entity/screen use-cases;
- normalizers;
- rules resolver;
- mappers;
- query dependencies.

### 8.3 Legacy hooks

Legacy hooks могут остаться временно только как adapters:

```ts
export function useTaskDetailsScreen() {
  return useStore(taskDetailsStore, (state) => ({
    task: state.ui.data.task,
    rules: state.ui.data.rules,
    updateParam: state.updateParam,
  }));
}
```

Не оставлять:

```ts
useQuery(...);
useEffect(() => resolveRules(...), [...]);
useMemo(() => buildColumns(...), [...]);
```

если это уже перенесено в A2UI/store/use-case слой.

---

## Stage 9: MVP

Начать с одного сценария:

```text
Task parameters card
  -> radio buttons
  -> modal
  -> side page
  -> update param
  -> refetch rules/task
```

Для MVP сделать:

1. Component registry для нужных компонентов.
2. Action registry: `task.updateParam`, `modal.open`, `sidePage.open`, `state.set`.
3. Data contracts: `task.getById`, `task.getRules`.
4. Rules format + resolver.
5. Normalizer для одного реального XML/GraphQL/REST ответа.
6. Screen schema.
7. Fixtures.
8. Unit tests для rules/normalizer/store.
9. Prompt examples для LLM.
10. Validator generated schema.

---

## Stage 10: Проверка

Проверить:

- generated schema проходит Zod/JSON Schema validation;
- schema использует только registered components;
- actions есть в action registry;
- data contracts есть в data contract registry;
- conditions декларативные, без JS;
- normalizers покрыты fixtures/tests;
- rules покрыты unit tests;
- screen store покрывает modal/side page/update/refetch flow;
- runtime не вызывает LLM;
- components не делают business fetch/parse/rules/update/invalidation.

Поиск остатков:

```bash
rg -n "useQuery|useMutation|useEffect|useMemo|fetch\\(|axios|columns|rows|resolveRules|normalize|invalidateQueries|open.*Modal|open.*SidePage" src
```

Каждое совпадение классифицировать:

- legacy временно оставлено;
- presentation-only;
- перенесено в A2UI/use-case слой;
- требует переноса;
- false positive.

---

## Итоговая стратегия

Не просить LLM писать React-компоненты с нуля.

Просить LLM генерировать:

- schema;
- rules;
- normalizers;
- fixtures;
- tests;
- docs;
- component requests.

`catalog` здесь - это не feature module, а registry/contract layer для существующих UI components и LLM. A2UI/json render оправдан именно потому, что он задаёт строгий формат, который можно валидировать, тестировать и ревьюить.
