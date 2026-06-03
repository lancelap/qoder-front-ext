# Catalog Generated UI Stores Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перевести `catalog` на `json-render` Controlled Mode: JSON описывает UI, а бизнес-логика из хуков переносится в TypeScript store, resolvers, mappers и api layer.

**Architecture:** `json-render` остается renderer-слоем. `Zustand` store становится single source of truth для form/ui/data/loading/errors, dependent filters, table view models, modal/side page state и business actions. Старые React hooks должны стать тонкими adapters/selectors либо быть удалены после миграции потребителей.

**Tech Stack:** React, TypeScript, `@json-render/react`, Zustand vanilla store, Vitest или текущий test runner проекта `catalog`, project-owned component registry/action registry.

---

## Scope And Assumptions

Текущий checkout `qoder-front-ext` содержит workflow-документацию и пример `Payment MT NACK Security`, но не содержит исходники целевого приложения `catalog`. Поэтому план фиксирует целевую структуру и порядок миграции. Перед исполнением в реальном `catalog` нужно выполнить Task 1 и заменить предложенные пути на фактические пути проекта, если они отличаются.

Ограничения из `QWEN.md`:

- не редактировать исходники до утверждения плана;
- не создавать commits или pull requests в MVP;
- не выдумывать backend behavior, endpoints, поля response или actions, которых нет в спецификации;
- если working tree dirty, сначала показать измененные файлы и согласовать продолжение.

Главное архитектурное правило:

```text
JSON describes UI.
TypeScript owns logic.
```

---

## Target File Structure

### Shared generated-ui runtime

- Create: `src/shared/generated-ui/store/generatedUi.types.ts`
  - Общие типы `Option`, `DateRange`, `GeneratedUiLoading`, `GeneratedUiErrors`.
- Create: `src/shared/generated-ui/store/createGeneratedUiStateBridge.ts`
  - Adapter между feature store и `StateProvider`.
- Create: `src/shared/generated-ui/renderer/GeneratedScreen.tsx`
  - Runtime renderer, который принимает schema, component registry, action registry и state bridge.
- Create: `src/shared/generated-ui/renderer/componentRegistry.ts`
  - Base registry для разрешенных layout/control components, если в проекте еще нет такого registry.
- Create: `src/shared/generated-ui/renderer/actionRegistry.types.ts`
  - Типизированный контракт action registry.
- Create: `src/shared/generated-ui/table/table.types.ts`
  - `CellType`, `TableColumn`, `TableRow`, `TableViewModel`.
- Create: `src/shared/generated-ui/table/getValueByAccessor.ts`
  - Доступ к значениям строк по `accessor`, без бизнес-логики.
- Create: `src/shared/generated-ui/table/cellRenderers.tsx`
  - Отображение `text`, `amount`, `date`, `status`, `badge`, `link`, `errorList`.
- Create or modify: `src/shared/generated-ui/table/TableRenderer.tsx`
  - Табличный catalog component, который получает готовые `columns` и `rows`.

### Catalog feature

- Create: `src/features/catalog/model/catalogGeneratedUiStore.ts`
  - Zustand vanilla store для screen state и actions.
- Create: `src/features/catalog/model/catalogGeneratedUi.types.ts`
  - Типы состояния `CatalogGeneratedUiState`, `CatalogFilters`, actions, store dependencies.
- Create: `src/features/catalog/model/catalogGeneratedUi.actions.ts`
  - Action registry, который вызывает методы store по именам из JSON.
- Create: `src/features/catalog/model/catalogGeneratedUi.selectors.ts`
  - Селекторы для старых React consumers и тестов.
- Create: `src/features/catalog/model/filters/catalogFilter.types.ts`
  - Типы фильтров catalog.
- Create: `src/features/catalog/model/filters/mapCatalogFilterOptions.ts`
  - Mapping raw API options to `Option`.
- Create: `src/features/catalog/model/table/catalogTable.types.ts`
  - Raw/view model типы строк catalog table.
- Create: `src/features/catalog/model/table/getCatalogTableViewModel.ts`
  - Resolver, который вызывает API и возвращает `TableViewModel`.
- Create: `src/features/catalog/model/table/buildCatalogColumns.ts`
  - Динамические колонки на основе meta/permissions/spec.
- Create: `src/features/catalog/model/table/buildCatalogRows.ts`
  - Mapping raw API rows to normalized rows.
- Modify or create: `src/features/catalog/api/catalogApi.ts`
  - API facade, если текущие хуки ходят в API напрямую.
- Modify: `src/features/catalog/hooks/*.ts`
  - Удалить бизнес-логику из хуков. Оставить thin adapters только если есть legacy consumers.
- Create or modify: `src/pages/catalog/catalog.schema.json`
  - JSON bindings to store state and action names.
- Create or modify: `src/pages/catalog/CatalogGeneratedPage.tsx`
  - Page wrapper, который вызывает `store.init()` и подключает `StateProvider`.

### Tests

- Create: `src/features/catalog/model/catalogGeneratedUiStore.test.ts`
- Create: `src/features/catalog/model/table/getCatalogTableViewModel.test.ts`
- Create: `src/features/catalog/model/table/buildCatalogColumns.test.ts`
- Create: `src/features/catalog/model/table/buildCatalogRows.test.ts`
- Create or modify: `src/pages/catalog/CatalogGeneratedPage.test.tsx`

---

## Store Contract

Целевой state shape:

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

Целевой store shape:

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

Фильтры добавляются явно после inventory. Для каждого dependent filter нужен action вида:

```ts
setParentFilter: (value: Option | null) => Promise<void>;
setChildFilter: (value: Option | null) => Promise<void>;
```

Правило для dependent filters:

```text
parent change
  -> set parent value
  -> reset downstream form values
  -> clear downstream options
  -> load direct child options
```

Правило для таблицы:

```text
input change does not reload table
applyFilters copies form.filters to appliedFilters
loadCatalogTable reads only appliedFilters
```

---

## Task 1: Inventory Existing Catalog Hooks

**Files:**

- Read: `src/features/catalog/hooks/*.ts`
- Read: `src/features/catalog/**/*.tsx`
- Read: `src/pages/catalog/**/*`
- Read: current API layer used by catalog hooks
- Create: `docs/catalog-store-migration-inventory.md`

- [ ] **Step 1: Check repository state**

Run:

```bash
git status --short --branch
```

Expected: list changed files before any source edits. If dirty, ask whether to continue, stash, or stop.

- [ ] **Step 2: Locate hook business logic**

Run:

```bash
rg -n "use[A-Z].*(Catalog|catalog)|fetch|axios|query|mutation|useEffect|useMemo|columns|rows|filter|modal|sidePage" src/features/catalog src/pages/catalog
```

Expected: all catalog hooks/components that currently own API calls, transforms, dependent filters, dynamic columns, modal/side page routing, validation, or submit behavior.

- [ ] **Step 3: Create migration inventory**

Write `docs/catalog-store-migration-inventory.md` with this table:

```md
# Catalog Store Migration Inventory

| Current file | Logic found | Target owner | New file | Test |
| --- | --- | --- | --- | --- |
| `src/features/catalog/hooks/useCatalogFilters.ts` | dependent filters | store action | `src/features/catalog/model/catalogGeneratedUiStore.ts` | `catalogGeneratedUiStore.test.ts` |
| `src/features/catalog/hooks/useCatalogTable.ts` | table fetch and row mapping | table resolver | `src/features/catalog/model/table/getCatalogTableViewModel.ts` | `getCatalogTableViewModel.test.ts` |
| `src/features/catalog/hooks/useCatalogColumns.ts` | dynamic columns | table mapper | `src/features/catalog/model/table/buildCatalogColumns.ts` | `buildCatalogColumns.test.ts` |
```

Use only rows backed by files found in Step 2. Do not include empty inventory rows.

- [ ] **Step 4: Approval gate**

Stop after inventory and confirm that the mapping is correct before writing store code.

---

## Task 2: Add Shared Generated UI Types And Table Types

**Files:**

- Create: `src/shared/generated-ui/store/generatedUi.types.ts`
- Create: `src/shared/generated-ui/table/table.types.ts`

- [ ] **Step 1: Add generated UI common types**

Create `src/shared/generated-ui/store/generatedUi.types.ts`:

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

- [ ] **Step 2: Add table view model types**

Create `src/shared/generated-ui/table/table.types.ts`:

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

- [ ] **Step 3: Run typecheck**

Run the project typecheck command from `package.json`.

Expected: PASS.

---

## Task 3: Create Catalog Store Skeleton With Testable Dependencies

**Files:**

- Create: `src/features/catalog/model/catalogGeneratedUi.types.ts`
- Create: `src/features/catalog/model/catalogGeneratedUiStore.ts`
- Create: `src/features/catalog/model/catalogGeneratedUiStore.test.ts`

- [ ] **Step 1: Write initial state test**

Create a test that asserts:

- `form.filters` starts with empty values;
- `appliedFilters` is `null`;
- `data.catalogTable` is `null`;
- `loading` and `errors` are empty;
- modals and side pages are closed.

- [ ] **Step 2: Implement types**

Create `src/features/catalog/model/catalogGeneratedUi.types.ts`:

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

Adjust filter fields only after Task 1 inventory confirms actual catalog filters.

- [ ] **Step 3: Implement store factory**

Create `src/features/catalog/model/catalogGeneratedUiStore.ts` with `createCatalogGeneratedUiStore(dependencies)`, not a hard-coded singleton. This keeps tests independent and avoids direct API calls in store tests.

- [ ] **Step 4: Run store test**

Run:

```bash
pnpm test src/features/catalog/model/catalogGeneratedUiStore.test.ts
```

Expected: PASS, or use the repo's actual test command if not `pnpm test`.

---

## Task 4: Move Dependent Filter Logic From Hooks Into Store Actions

**Files:**

- Modify: `src/features/catalog/model/catalogGeneratedUi.types.ts`
- Modify: `src/features/catalog/model/catalogGeneratedUiStore.ts`
- Modify: `src/features/catalog/model/catalogGeneratedUiStore.test.ts`
- Modify later: legacy hook files from Task 1 inventory

- [ ] **Step 1: Write tests for parent filter changes**

Cover the actual dependency graph found in Task 1. Minimum assertions:

- setting a parent filter resets downstream filter values;
- downstream options are cleared immediately;
- direct child options load after parent is selected;
- clearing parent does not call child option loader.

- [ ] **Step 2: Implement store actions**

Add actions matching actual catalog filters. Example pattern:

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

- [ ] **Step 3: Delete duplicated hook logic**

For every hook in inventory:

- remove API calls for dependent options;
- remove `useEffect` chains that reset child filters;
- keep only selector/adaptor code while old components still import the hook.

- [ ] **Step 4: Run tests**

Run store tests and typecheck.

Expected: PASS.

---

## Task 5: Move Table Fetching And Dynamic Columns Into Resolver

**Files:**

- Create: `src/features/catalog/model/table/catalogTable.types.ts`
- Create: `src/features/catalog/model/table/getCatalogTableViewModel.ts`
- Create: `src/features/catalog/model/table/buildCatalogColumns.ts`
- Create: `src/features/catalog/model/table/buildCatalogRows.ts`
- Create: `src/features/catalog/model/table/getCatalogTableViewModel.test.ts`
- Create: `src/features/catalog/model/table/buildCatalogColumns.test.ts`
- Create: `src/features/catalog/model/table/buildCatalogRows.test.ts`
- Modify: table-related hooks from Task 1 inventory

- [ ] **Step 1: Write mapper tests**

Tests must assert:

- raw API fields map to app-level row fields;
- dynamic columns appear only from documented meta/permissions;
- missing optional raw fields produce stable empty values;
- JSON never receives raw API response.

- [ ] **Step 2: Implement `buildCatalogColumns`**

Columns must return `TableColumn[]`, not JSX and not raw component config.

- [ ] **Step 3: Implement `buildCatalogRows`**

Rows must return `TableRow[]` with stable keys and app-level names.

- [ ] **Step 4: Implement `getCatalogTableViewModel`**

Resolver flow:

```text
filters
  -> api.getCatalogItems(normalized params)
  -> buildCatalogColumns(response.meta)
  -> buildCatalogRows(response.items)
  -> TableViewModel
```

- [ ] **Step 5: Wire `loadCatalogTable` in store**

`loadCatalogTable` must read `get().ui.appliedFilters`, not draft `form.filters`.

- [ ] **Step 6: Remove table business logic from hooks**

Hooks should no longer build columns, rows, or fetch table data.

- [ ] **Step 7: Run tests**

Run table tests, store tests, and typecheck.

Expected: PASS.

---

## Task 6: Move Modal, Side Page, And Submit Logic Into Store

**Files:**

- Modify: `src/features/catalog/model/catalogGeneratedUi.types.ts`
- Modify: `src/features/catalog/model/catalogGeneratedUiStore.ts`
- Modify: `src/features/catalog/model/catalogGeneratedUiStore.test.ts`
- Modify: hooks/components from Task 1 inventory that own modal/side page state

- [ ] **Step 1: Write UI state tests**

Cover:

- `openModal(id)` stores the opened modal id;
- `closeModal()` clears it;
- `openSidePage(id)` stores the opened side page id;
- `closeSidePage()` clears it;
- submit success closes the surface and refreshes required data;
- submit error keeps the surface open and writes an error channel.

- [ ] **Step 2: Implement UI actions**

Keep modal routing logic inside store actions. JSON should only bind `openedWhenEquals`, `onCloseAction`, and submit action names.

- [ ] **Step 3: Move mutation logic**

For each mutation currently inside hooks:

```text
hook mutation
  -> store submit action
  -> api facade
  -> close modal or side page on success
  -> refresh affected data
  -> loading/errors in store
```

- [ ] **Step 4: Run tests**

Expected: PASS.

---

## Task 7: Add StateProvider Bridge And Action Registry

**Files:**

- Create: `src/shared/generated-ui/store/createGeneratedUiStateBridge.ts`
- Create: `src/shared/generated-ui/renderer/actionRegistry.types.ts`
- Create: `src/features/catalog/model/catalogGeneratedUi.actions.ts`
- Modify or create: `src/pages/catalog/CatalogGeneratedPage.tsx`

- [ ] **Step 1: Create state bridge**

Bridge responsibilities:

- expose `state.ui` to `StateProvider`;
- update only store-owned UI state;
- avoid direct component access to Zustand internals.

- [ ] **Step 2: Create action registry**

Each JSON action id maps to one store action:

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

Use actual action names from `catalog.schema.json` after Task 9.

- [ ] **Step 3: Wire page wrapper**

`CatalogGeneratedPage` responsibilities:

- create or import the catalog store;
- call `store.getState().init()` once for screen init;
- pass state bridge to `StateProvider`;
- pass schema and registries to `GeneratedScreen`.

- [ ] **Step 4: Run smoke test**

Expected:

- page renders with initial loading state;
- no component imports feature API directly;
- no JSON action id is missing from registry.

---

## Task 8: Convert Catalog JSON To Controlled Store Bindings

**Files:**

- Modify or create: `src/pages/catalog/catalog.schema.json`
- Modify: catalog component catalog docs, if present

- [ ] **Step 1: Replace inline logic with state bindings**

Allowed:

```json
{
  "value": { "$state": "/form/filters/type" },
  "options": { "$state": "/data/typeOptions" },
  "loading": { "$state": "/loading/typeOptions" },
  "onChangeAction": "setType"
}
```

Blocked:

```json
{
  "fetch": "/api/catalog/types",
  "onChange": "if type then reset owner",
  "columns": "buildColumns(response.meta)"
}
```

- [ ] **Step 2: Bind table to view model only**

Catalog table JSON must read:

```json
{
  "columns": { "$state": "/data/catalogTable/columns" },
  "rows": { "$state": "/data/catalogTable/rows" },
  "loading": { "$state": "/loading/catalogTable" }
}
```

- [ ] **Step 3: Bind modal and side page open state**

JSON must read store state and call action ids:

```json
{
  "openedWhenEquals": {
    "state": "/ui/openedModal",
    "value": "editCatalogItemModal"
  },
  "onCloseAction": "closeModal"
}
```

- [ ] **Step 4: Validate registry coverage**

Run or manually apply `docs/prompt-packs/json-render/00-validate-catalog-coverage.md`.

Expected: every component type, action id, state path, data source and resolver is documented and registered.

---

## Task 9: Slim Or Remove Legacy Hooks

**Files:**

- Modify: `src/features/catalog/hooks/*.ts`
- Modify: current consumers found in Task 1

- [ ] **Step 1: Replace hook internals**

Allowed hook after migration:

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

Not allowed:

```ts
export function useCatalogFilters() {
  useEffect(() => {
    fetch("/api/catalog/types");
  }, []);
}
```

- [ ] **Step 2: Remove unused hooks**

After all consumers use store/selectors/generated page, delete hooks that only wrap removed logic.

- [ ] **Step 3: Search for leftovers**

Run:

```bash
rg -n "fetch|axios|useEffect|useMemo|columns|rows|reset.*filter|open.*Modal|open.*SidePage" src/features/catalog src/pages/catalog
```

Expected: remaining matches are either presentation-only or explicitly justified.

---

## Task 10: End-To-End Verification

**Files:**

- Modify or create: `src/pages/catalog/CatalogGeneratedPage.test.tsx`
- Modify or create: generated-ui runtime tests if the project has them

- [ ] **Step 1: Unit tests**

Run:

```bash
pnpm test src/features/catalog/model
```

Expected:

- dependent filters pass;
- table resolver pass;
- modal/side page action tests pass;
- submit action tests pass.

- [ ] **Step 2: Typecheck**

Run:

```bash
pnpm typecheck
```

Expected: PASS.

- [ ] **Step 3: Lint**

Run:

```bash
pnpm lint
```

Expected: PASS.

- [ ] **Step 4: Runtime smoke**

Run the app using the project command from `package.json`, open the catalog page, and verify:

- initial filter options load on init;
- changing a parent filter clears downstream filters and options;
- table does not reload on every input change;
- clicking apply loads table;
- reset clears draft filters and table state according to spec;
- modal/side page open and close from store state;
- submit success closes surface and refreshes affected data;
- submit error is visible and does not silently close the surface.

---

## Migration Checklist

- [ ] Every API call moved out of visual components and JSON.
- [ ] Every old hook with business logic is either removed or reduced to a thin selector adapter.
- [ ] Every dependent filter reset is tested in store tests.
- [ ] Table rows and columns are built by TypeScript resolver/mappers.
- [ ] JSON reads `/form`, `/data`, `/loading`, `/errors`, `/ui` state only.
- [ ] JSON calls action names only, with no raw functions or inline business logic.
- [ ] Component registry blocks unknown component types.
- [ ] Action registry blocks unknown action ids.
- [ ] Source adapters/resolvers hide XML/GraphQL/raw endpoint specifics from components.
- [ ] Store tests can run without React rendering.

---

## Execution Order

1. Task 1 inventory and approval.
2. Task 2 shared types.
3. Task 3 store skeleton.
4. Task 4 dependent filters.
5. Task 5 table resolver and mappers.
6. Task 6 modal, side page and submit actions.
7. Task 7 StateProvider bridge and action registry.
8. Task 8 JSON controlled bindings.
9. Task 9 legacy hook cleanup.
10. Task 10 verification.

Do not start implementation before the inventory confirms the actual catalog filters, actions, API contracts and UI states.
