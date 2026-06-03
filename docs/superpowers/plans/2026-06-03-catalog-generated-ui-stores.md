# План имплементации сторов для Generated UI в `catalog`

> **Для агентных исполнителей:** ОБЯЗАТЕЛЬНЫЙ ПОДНАВЫК: используйте `superpowers:subagent-driven-development` (рекомендуется) или `superpowers:executing-plans`, чтобы выполнять этот план по задачам. Шаги используют синтаксис чекбоксов (`- [ ]`) для отслеживания прогресса.

**Цель:** Перевести `catalog` на `json-render` в controlled mode: JSON описывает UI, а бизнес-логика из хуков переносится в TypeScript store, resolvers, mappers и слой API.

**Архитектура:** `json-render` остается слоем рендера. `Zustand` store становится единым источником истины для `form`, `ui`, `data`, `loading`, `errors`, зависимых фильтров, табличных view models, состояния modal/side page и бизнес-действий. Старые React hooks должны стать тонкими adapters/selectors либо быть удалены после миграции потребителей.

**Технологии:** React, TypeScript, `@json-render/react`, Zustand vanilla store, Vitest или текущий test runner проекта `catalog`, project-owned component registry/action registry.

---

## Область и допущения

Текущий checkout `qoder-front-ext` содержит workflow-документацию и пример `Payment MT NACK Security`, но не содержит исходники целевого приложения `catalog`. Поэтому план фиксирует целевую структуру и порядок миграции. Перед исполнением в реальном `catalog` нужно выполнить Задачу 1 и заменить предложенные пути на фактические пути проекта, если они отличаются.

Ограничения из `QWEN.md`:

- не редактировать исходники до утверждения плана;
- не создавать commits или pull requests в MVP;
- не выдумывать backend behavior, endpoints, поля response или actions, которых нет в спецификации;
- если working tree dirty, сначала показать измененные файлы и согласовать продолжение.

Главное архитектурное правило:

```text
JSON описывает UI.
TypeScript владеет логикой.
```

---

## Целевая структура файлов

### Shared runtime для `generated-ui`

- Создать: `src/shared/generated-ui/store/generatedUi.types.ts`
  - Общие типы `Option`, `DateRange`, `GeneratedUiLoading`, `GeneratedUiErrors`.
- Создать: `src/shared/generated-ui/store/createGeneratedUiStateBridge.ts`
  - Adapter между feature store и `StateProvider`.
- Создать: `src/shared/generated-ui/renderer/GeneratedScreen.tsx`
  - Runtime renderer, который принимает schema, component registry, action registry и state bridge.
- Создать: `src/shared/generated-ui/renderer/componentRegistry.ts`
  - Base registry для разрешенных layout/control components, если в проекте еще нет такого registry.
- Создать: `src/shared/generated-ui/renderer/actionRegistry.types.ts`
  - Типизированный контракт action registry.
- Создать: `src/shared/generated-ui/table/table.types.ts`
  - `CellType`, `TableColumn`, `TableRow`, `TableViewModel`.
- Создать: `src/shared/generated-ui/table/getValueByAccessor.ts`
  - Доступ к значениям строк по `accessor`, без бизнес-логики.
- Создать: `src/shared/generated-ui/table/cellRenderers.tsx`
  - Отображение `text`, `amount`, `date`, `status`, `badge`, `link`, `errorList`.
- Создать или изменить: `src/shared/generated-ui/table/TableRenderer.tsx`
  - Табличный catalog component, который получает готовые `columns` и `rows`.

### Feature `catalog`

- Создать: `src/features/catalog/model/catalogGeneratedUiStore.ts`
  - Zustand vanilla store для screen state и actions.
- Создать: `src/features/catalog/model/catalogGeneratedUi.types.ts`
  - Типы состояния `CatalogGeneratedUiState`, `CatalogFilters`, actions, store dependencies.
- Создать: `src/features/catalog/model/catalogGeneratedUi.actions.ts`
  - Action registry, который вызывает методы store по именам из JSON.
- Создать: `src/features/catalog/model/catalogGeneratedUi.selectors.ts`
  - Селекторы для старых React consumers и тестов.
- Создать: `src/features/catalog/model/filters/catalogFilter.types.ts`
  - Типы фильтров catalog.
- Создать: `src/features/catalog/model/filters/mapCatalogFilterOptions.ts`
  - Mapping raw API options в `Option`.
- Создать: `src/features/catalog/model/table/catalogTable.types.ts`
  - Raw/view model типы строк catalog table.
- Создать: `src/features/catalog/model/table/getCatalogTableViewModel.ts`
  - Resolver, который вызывает API и возвращает `TableViewModel`.
- Создать: `src/features/catalog/model/table/buildCatalogColumns.ts`
  - Динамические колонки на основе meta/permissions/spec.
- Создать: `src/features/catalog/model/table/buildCatalogRows.ts`
  - Mapping raw API rows в normalized rows.
- Изменить или создать: `src/features/catalog/api/catalogApi.ts`
  - API facade, если текущие хуки ходят в API напрямую.
- Изменить: `src/features/catalog/hooks/*.ts`
  - Удалить бизнес-логику из хуков. Оставить thin adapters только если есть legacy consumers.
- Создать или изменить: `src/pages/catalog/catalog.schema.json`
  - JSON bindings к store state и action names.
- Создать или изменить: `src/pages/catalog/CatalogGeneratedPage.tsx`
  - Page wrapper, который вызывает `store.init()` и подключает `StateProvider`.

### Тесты

- Создать: `src/features/catalog/model/catalogGeneratedUiStore.test.ts`
- Создать: `src/features/catalog/model/table/getCatalogTableViewModel.test.ts`
- Создать: `src/features/catalog/model/table/buildCatalogColumns.test.ts`
- Создать: `src/features/catalog/model/table/buildCatalogRows.test.ts`
- Создать или изменить: `src/pages/catalog/CatalogGeneratedPage.test.tsx`

---

## Контракт store

Целевая форма state:

```ts
export type CatalogGeneratedUiState = {
  form: {
    filters: CatalogFilters;
  };
  appliedFilters: CatalogFilters | null;
  ui: {
    openedModal: null | string;
    openedSidePage: null | string;
  };
  data: {
    catalogTable: TableViewModel | null;
    [dataKey: string]: unknown;
  };
  loading: Record<string, boolean | undefined>;
  errors: Record<string, unknown>;
};
```

Целевая форма store:

```ts
export type CatalogGeneratedUiStore = {
  ui: CatalogGeneratedUiState;
  init: () => Promise<void>;
  applyFilters: () => Promise<void>;
  resetFilters: () => void;
  loadCatalogTable: () => Promise<void>;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  openSidePage: (sidePageId: string) => void;
  closeSidePage: () => void;
};
```

Фильтры добавляются явно после инвентаризации. Для каждого зависимого фильтра нужен action вида:

```ts
setParentFilter: (value: Option | null) => Promise<void>;
setChildFilter: (value: Option | null) => Promise<void>;
```

Правило для зависимых фильтров:

```text
изменение родительского фильтра
  -> записать значение родителя
  -> сбросить downstream значения формы
  -> очистить downstream options
  -> загрузить options прямого дочернего фильтра
```

Правило для таблицы:

```text
изменение input не перезагружает таблицу
applyFilters копирует form.filters в appliedFilters
loadCatalogTable читает только appliedFilters
```

---

## Задача 1: Инвентаризировать существующие catalog hooks

**Файлы:**

- Прочитать: `src/features/catalog/hooks/*.ts`
- Прочитать: `src/features/catalog/**/*.tsx`
- Прочитать: `src/pages/catalog/**/*`
- Прочитать: текущий API layer, который используют catalog hooks
- Создать: `docs/catalog-store-migration-inventory.md`

- [ ] **Шаг 1: Проверить состояние репозитория**

Выполнить:

```bash
git status --short --branch
```

Ожидаемо: список измененных файлов до любых правок исходников. Если working tree dirty, спросить, продолжать ли, stash или остановиться.

- [ ] **Шаг 2: Найти бизнес-логику в hooks**

Выполнить:

```bash
rg -n "use[A-Z].*(Catalog|catalog)|fetch|axios|query|mutation|useEffect|useMemo|columns|rows|filter|modal|sidePage" src/features/catalog src/pages/catalog
```

Ожидаемо: все catalog hooks/components, которые сейчас владеют API calls, transforms, dependent filters, dynamic columns, modal/side page routing, validation или submit behavior.

- [ ] **Шаг 3: Создать инвентаризацию миграции**

Записать `docs/catalog-store-migration-inventory.md` с такой таблицей:

```md
# Инвентаризация миграции Catalog на store

| Текущий файл | Найденная логика | Целевой владелец | Новый файл | Тест |
| --- | --- | --- | --- | --- |
| `src/features/catalog/hooks/useCatalogFilters.ts` | зависимые фильтры | store action | `src/features/catalog/model/catalogGeneratedUiStore.ts` | `catalogGeneratedUiStore.test.ts` |
| `src/features/catalog/hooks/useCatalogTable.ts` | загрузка таблицы и mapping строк | table resolver | `src/features/catalog/model/table/getCatalogTableViewModel.ts` | `getCatalogTableViewModel.test.ts` |
| `src/features/catalog/hooks/useCatalogColumns.ts` | динамические колонки | table mapper | `src/features/catalog/model/table/buildCatalogColumns.ts` | `buildCatalogColumns.test.ts` |
```

Использовать только строки, подтвержденные файлами из Шага 2. Не добавлять пустые строки инвентаризации.

- [ ] **Шаг 4: Точка согласования**

Остановиться после инвентаризации и подтвердить, что mapping корректный, до написания кода store.

---

## Задача 2: Добавить shared типы Generated UI и таблиц

**Файлы:**

- Создать: `src/shared/generated-ui/store/generatedUi.types.ts`
- Создать: `src/shared/generated-ui/table/table.types.ts`

- [ ] **Шаг 1: Добавить общие типы generated UI**

Создать `src/shared/generated-ui/store/generatedUi.types.ts`:

```ts
export type Option = {
  label: string;
  value: string;
  disabled?: boolean;
  [key: string]: unknown;
};

export type DateRange = {
  from: string | null;
  to: string | null;
};

export type GeneratedUiLoading = Record<string, boolean | undefined>;

export type GeneratedUiErrors = Record<string, unknown>;
```

- [ ] **Шаг 2: Добавить типы table view model**

Создать `src/shared/generated-ui/table/table.types.ts`:

```ts
export type CellType =
  | "text"
  | "amount"
  | "date"
  | "status"
  | "badge"
  | "link"
  | "errorList";

export type TableColumn = {
  id: string;
  title: string;
  accessor: string;
  cellType?: CellType;
  sortable?: boolean;
  width?: number;
  align?: "left" | "right" | "center";
};

export type TableRow = Record<string, unknown>;

export type TableViewModel = {
  columns: TableColumn[];
  rows: TableRow[];
};
```

- [ ] **Шаг 3: Запустить typecheck**

Выполнить команду typecheck проекта из `package.json`.

Ожидаемо: команда проходит успешно.

---

## Задача 3: Создать skeleton store для Catalog с тестируемыми зависимостями

**Файлы:**

- Создать: `src/features/catalog/model/catalogGeneratedUi.types.ts`
- Создать: `src/features/catalog/model/catalogGeneratedUiStore.ts`
- Создать: `src/features/catalog/model/catalogGeneratedUiStore.test.ts`

- [ ] **Шаг 1: Написать тест initial state**

Создать тест, который проверяет:

- `form.filters` начинается с пустых значений;
- `appliedFilters` равен `null`;
- `data.catalogTable` равен `null`;
- `loading` и `errors` пустые;
- modals и side pages закрыты.

- [ ] **Шаг 2: Реализовать типы**

Создать `src/features/catalog/model/catalogGeneratedUi.types.ts`:

```ts
import type {
  DateRange,
  GeneratedUiErrors,
  GeneratedUiLoading,
  Option,
} from "@/shared/generated-ui/store/generatedUi.types";
import type { TableViewModel } from "@/shared/generated-ui/table/table.types";

export type CatalogFilters = {
  search: string;
  type: Option | null;
  status: Option | null;
  owner: Option | null;
  dateRange: DateRange | null;
};

export type CatalogGeneratedUiState = {
  form: {
    filters: CatalogFilters;
  };
  appliedFilters: CatalogFilters | null;
  ui: {
    openedModal: null | string;
    openedSidePage: null | string;
  };
  data: {
    typeOptions: Option[];
    statusOptions: Option[];
    ownerOptions: Option[];
    catalogTable: TableViewModel | null;
  };
  loading: GeneratedUiLoading;
  errors: GeneratedUiErrors;
};

export type CatalogGeneratedUiDependencies = {
  loadTypeOptions: () => Promise<Option[]>;
  loadStatusOptions: () => Promise<Option[]>;
  loadOwnerOptions: (input: { type?: string }) => Promise<Option[]>;
  getCatalogTableViewModel: (input: {
    filters: CatalogFilters;
  }) => Promise<TableViewModel>;
};
```

Корректировать поля фильтров только после того, как инвентаризация из Задачи 1 подтвердит реальные catalog filters.

- [ ] **Шаг 3: Реализовать store factory**

Создать `src/features/catalog/model/catalogGeneratedUiStore.ts` с `createCatalogGeneratedUiStore(dependencies)`, а не hard-coded singleton. Это сохраняет тесты независимыми и исключает прямые API calls в store tests.

- [ ] **Шаг 4: Запустить store test**

Выполнить:

```bash
pnpm test src/features/catalog/model/catalogGeneratedUiStore.test.ts
```

Ожидаемо: команда проходит успешно; если в репозитории используется не `pnpm test`, взять фактическую команду запуска тестов проекта.

---

## Задача 4: Перенести логику dependent filters из hooks в store actions

**Файлы:**

- Изменить: `src/features/catalog/model/catalogGeneratedUi.types.ts`
- Изменить: `src/features/catalog/model/catalogGeneratedUiStore.ts`
- Изменить: `src/features/catalog/model/catalogGeneratedUiStore.test.ts`
- Изменить позже: legacy hook files из инвентаризации Задачи 1

- [ ] **Шаг 1: Написать тесты для изменений родительского фильтра**

Покрыть фактический dependency graph из Задачи 1. Минимальные проверки:

- установка родительского фильтра сбрасывает downstream значения фильтров;
- downstream options очищаются сразу;
- options прямого дочернего фильтра загружаются после выбора родителя;
- очистка родителя не вызывает loader дочерних options.

- [ ] **Шаг 2: Реализовать store actions**

Добавить actions, соответствующие реальным catalog filters. Пример паттерна:

```ts
setType: async (type) => {
  set((state) => ({
    ui: {
      ...state.ui,
      form: {
        ...state.ui.form,
        filters: {
          ...state.ui.form.filters,
          type,
          owner: null,
        },
      },
      data: {
        ...state.ui.data,
        ownerOptions: [],
      },
    },
  }));

  if (type) {
    await get().loadOwnerOptions();
  }
}
```

- [ ] **Шаг 3: Удалить дублирующуюся hook logic**

Для каждого hook из инвентаризации:

- удалить API calls для dependent options;
- удалить цепочки `useEffect`, которые сбрасывают дочерние фильтры;
- оставить только selector/adaptor code, пока старые components все еще импортируют hook.

- [ ] **Шаг 4: Запустить тесты**

Запустить store tests и typecheck.

Ожидаемо: команда проходит успешно.

---

## Задача 5: Перенести загрузку таблицы и dynamic columns в resolver

**Файлы:**

- Создать: `src/features/catalog/model/table/catalogTable.types.ts`
- Создать: `src/features/catalog/model/table/getCatalogTableViewModel.ts`
- Создать: `src/features/catalog/model/table/buildCatalogColumns.ts`
- Создать: `src/features/catalog/model/table/buildCatalogRows.ts`
- Создать: `src/features/catalog/model/table/getCatalogTableViewModel.test.ts`
- Создать: `src/features/catalog/model/table/buildCatalogColumns.test.ts`
- Создать: `src/features/catalog/model/table/buildCatalogRows.test.ts`
- Изменить: table-related hooks из инвентаризации Задачи 1

- [ ] **Шаг 1: Написать mapper tests**

Тесты должны проверять:

- raw API fields мапятся в app-level row fields;
- dynamic columns появляются только из документированных meta/permissions;
- отсутствующие optional raw fields дают стабильные empty values;
- JSON никогда не получает raw API response.

- [ ] **Шаг 2: Реализовать `buildCatalogColumns`**

Columns должны возвращать `TableColumn[]`, а не JSX и не raw component config.

- [ ] **Шаг 3: Реализовать `buildCatalogRows`**

Rows должны возвращать `TableRow[]` со стабильными keys и app-level names.

- [ ] **Шаг 4: Реализовать `getCatalogTableViewModel`**

Поток resolver:

```text
filters
  -> api.getCatalogItems(normalized params)
  -> buildCatalogColumns(response.meta)
  -> buildCatalogRows(response.items)
  -> TableViewModel
```

- [ ] **Шаг 5: Подключить `loadCatalogTable` в store**

`loadCatalogTable` должен читать `get().ui.appliedFilters`, а не черновой `form.filters`.

- [ ] **Шаг 6: Удалить table business logic из hooks**

Hooks больше не должны строить columns, rows или загружать table data.

- [ ] **Шаг 7: Запустить тесты**

Запустить table tests, store tests и typecheck.

Ожидаемо: команда проходит успешно.

---

## Задача 6: Перенести modal, side page и submit logic в store

**Файлы:**

- Изменить: `src/features/catalog/model/catalogGeneratedUi.types.ts`
- Изменить: `src/features/catalog/model/catalogGeneratedUiStore.ts`
- Изменить: `src/features/catalog/model/catalogGeneratedUiStore.test.ts`
- Изменить: hooks/components из инвентаризации Задачи 1, которые владеют modal/side page state

- [ ] **Шаг 1: Написать UI state tests**

Покрыть:

- `openModal(id)` сохраняет id открытой modal;
- `closeModal()` очищает его;
- `openSidePage(id)` сохраняет id открытой side page;
- `closeSidePage()` очищает его;
- submit success закрывает surface и обновляет нужные data;
- submit error оставляет surface открытой и записывает error channel.

- [ ] **Шаг 2: Реализовать UI actions**

Держать modal routing logic внутри store actions. JSON должен только связывать `openedWhenEquals`, `onCloseAction` и имена submit actions.

- [ ] **Шаг 3: Перенести mutation logic**

Для каждой mutation, которая сейчас находится внутри hooks:

```text
hook mutation
  -> store submit action
  -> api facade
  -> закрыть modal или side page при успехе
  -> обновить затронутые data
  -> loading/errors в store
```

- [ ] **Шаг 4: Запустить тесты**

Ожидаемо: команда проходит успешно.

---

## Задача 7: Добавить StateProvider bridge и action registry

**Файлы:**

- Создать: `src/shared/generated-ui/store/createGeneratedUiStateBridge.ts`
- Создать: `src/shared/generated-ui/renderer/actionRegistry.types.ts`
- Создать: `src/features/catalog/model/catalogGeneratedUi.actions.ts`
- Изменить или создать: `src/pages/catalog/CatalogGeneratedPage.tsx`

- [ ] **Шаг 1: Создать state bridge**

Ответственность bridge:

- отдавать `state.ui` в `StateProvider`;
- обновлять только UI state, которым владеет store;
- не давать components прямой доступ к Zustand internals.

- [ ] **Шаг 2: Создать action registry**

Каждый JSON action id мапится на один store action:

```ts
export function createCatalogGeneratedUiActions(store: CatalogGeneratedUiStoreApi) {
  return {
    setType: (value: Option | null) => store.getState().setType(value),
    setStatus: (value: Option | null) => store.getState().setStatus(value),
    applyFilters: () => store.getState().applyFilters(),
    resetFilters: () => store.getState().resetFilters(),
    closeModal: () => store.getState().closeModal(),
    closeSidePage: () => store.getState().closeSidePage(),
  };
}
```

Использовать реальные action names из `catalog.schema.json` после Задачи 9.

- [ ] **Шаг 3: Подключить page wrapper**

Ответственность `CatalogGeneratedPage`:

- создать или импортировать catalog store;
- один раз вызвать `store.getState().init()` для screen init;
- передать state bridge в `StateProvider`;
- передать schema и registries в `GeneratedScreen`.

- [ ] **Шаг 4: Запустить smoke test**

Ожидаемо:

- page рендерится с initial loading state;
- ни один component не импортирует feature API напрямую;
- ни один JSON action id не отсутствует в registry.

---

## Задача 8: Перевести Catalog JSON на controlled store bindings

**Файлы:**

- Изменить или создать: `src/pages/catalog/catalog.schema.json`
- Изменить: документацию catalog component catalog, если она есть

- [ ] **Шаг 1: Заменить inline logic на state bindings**

Разрешено:

```json
{
  "value": { "$state": "/form/filters/type" },
  "options": { "$state": "/data/typeOptions" },
  "loading": { "$state": "/loading/typeOptions" },
  "onChangeAction": "setType"
}
```

Заблокировано:

```json
{
  "fetch": "/api/catalog/types",
  "onChange": "if type then reset owner",
  "columns": "buildColumns(response.meta)"
}
```

- [ ] **Шаг 2: Привязать таблицу только к view model**

Catalog table JSON должен читать:

```json
{
  "columns": { "$state": "/data/catalogTable/columns" },
  "rows": { "$state": "/data/catalogTable/rows" },
  "loading": { "$state": "/loading/catalogTable" }
}
```

- [ ] **Шаг 3: Привязать open state modal и side page**

JSON должен читать store state и вызывать action ids:

```json
{
  "openedWhenEquals": {
    "state": "/ui/openedModal",
    "value": "editCatalogItemModal"
  },
  "onCloseAction": "closeModal"
}
```

- [ ] **Шаг 4: Проверить registry coverage**

Выполнить или вручную применить `docs/prompt-packs/json-render/00-validate-catalog-coverage.md`.

Ожидаемо: каждый component type, action id, state path, store binding и resolver задокументирован и зарегистрирован.

---

## Задача 9: Упростить или удалить legacy hooks

**Файлы:**

- Изменить: `src/features/catalog/hooks/*.ts`
- Изменить: текущие consumers, найденные в Задаче 1

- [ ] **Шаг 1: Заменить internals hooks**

Разрешенный hook после миграции:

```ts
export function useCatalogFilters() {
  return useStore(catalogGeneratedUiStore, (state) => ({
    filters: state.ui.form.filters,
    typeOptions: state.ui.data.typeOptions,
    statusOptions: state.ui.data.statusOptions,
    setType: state.setType,
    setStatus: state.setStatus,
    applyFilters: state.applyFilters,
    resetFilters: state.resetFilters,
  }));
}
```

Не разрешено:

```ts
export function useCatalogFilters() {
  useEffect(() => {
    fetch("/api/catalog/types");
  }, []);
}
```

- [ ] **Шаг 2: Удалить неиспользуемые hooks**

После того как все consumers используют store/selectors/generated page, удалить hooks, которые только оборачивают удаленную логику.

- [ ] **Шаг 3: Найти остатки старой логики**

Выполнить:

```bash
rg -n "fetch|axios|useEffect|useMemo|columns|rows|reset.*filter|open.*Modal|open.*SidePage" src/features/catalog src/pages/catalog
```

Ожидаемо: оставшиеся совпадения относятся только к presentation-only логике или явно обоснованы.

---

## Задача 10: End-to-end проверка

**Файлы:**

- Изменить или создать: `src/pages/catalog/CatalogGeneratedPage.test.tsx`
- Изменить или создать: generated-ui runtime tests, если они есть в проекте

- [ ] **Шаг 1: Unit tests**

Выполнить:

```bash
pnpm test src/features/catalog/model
```

Ожидаемо:

- dependent filters проходят;
- table resolver проходит;
- modal/side page action tests проходят;
- submit action tests проходят.

- [ ] **Шаг 2: Typecheck**

Выполнить:

```bash
pnpm typecheck
```

Ожидаемо: команда проходит успешно.

- [ ] **Шаг 3: Lint**

Выполнить:

```bash
pnpm lint
```

Ожидаемо: команда проходит успешно.

- [ ] **Шаг 4: Runtime smoke**

Запустить приложение командой проекта из `package.json`, открыть catalog page и проверить:

- initial filter options загружаются на init;
- изменение родительского фильтра очищает downstream filters и options;
- таблица не перезагружается при каждом input change;
- клик по apply загружает таблицу;
- reset очищает draft filters и table state согласно spec;
- modal/side page открываются и закрываются из store state;
- submit success закрывает surface и обновляет затронутые data;
- submit error видим и не закрывает surface молча.

---

## Чеклист миграции

- [ ] Каждый API call вынесен из visual components и JSON.
- [ ] Каждый старый hook с business logic либо удален, либо сведен к thin selector adapter.
- [ ] Каждый reset зависимого фильтра покрыт store tests.
- [ ] Table rows и columns строятся TypeScript resolver/mappers.
- [ ] JSON читает только state `/form`, `/data`, `/loading`, `/errors`, `/ui`.
- [ ] JSON вызывает только action names, без raw functions или inline business logic.
- [ ] Component registry блокирует неизвестные component types.
- [ ] Action registry блокирует неизвестные action ids.
- [ ] Source adapters/resolvers скрывают XML/GraphQL/raw endpoint specifics от components.
- [ ] Store tests могут выполняться без React rendering.

---

## Порядок выполнения

1. Задача 1: инвентаризация и согласование.
2. Задача 2: shared types.
3. Задача 3: store skeleton.
4. Задача 4: dependent filters.
5. Задача 5: table resolver и mappers.
6. Задача 6: modal, side page и submit actions.
7. Задача 7: StateProvider bridge и action registry.
8. Задача 8: JSON controlled bindings.
9. Задача 9: cleanup legacy hooks.
10. Задача 10: verification.

Не начинать имплементацию до того, как инвентаризация подтвердит реальные catalog filters, actions, API contracts и UI states.
