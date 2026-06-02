# Payment MT NACK Security Component Catalog

## `PaymentMtNackSecurityPage`

Use when rendering the MT NACK security review page.

Props:

```ts
type PaymentMtNackSecurityPageProps = {
  title: string;
  forbidden?: boolean;
  children: React.ReactNode;
  footer: React.ReactNode;
};
```

States:

- forbidden
- normal

## `ValidationErrorsBlock`

Use when showing normalized MT validation errors.

Props:

```ts
type ValidationErrorsBlockProps = {
  data: Array<{
    id: string;
    title: string;
    description?: string;
    source?: "channel" | "document" | "unknown";
  }>;
  emptyText: string;
};
```

Do not pass raw rejection document payloads to this component.

## `TradeSidePageTrigger`

Use when a page needs a button that opens a trade side page.

Props:

```ts
type TradeSidePageTriggerProps = {
  label: string;
  tradeId: string;
  disabled?: boolean;
  sidePageId: string;
};
```

Behavior:

- opens the side page identified by `sidePageId`;
- passes `tradeId` to the side page.

## `TradeSidePage`

Use when displaying trade details in a side page.

Props:

```ts
type TradeSidePageProps = {
  id: string;
  title: string;
  tradeId: string;
  open: boolean;
};
```

Behavior:

- fetches trade details by normalized `tradeId`;
- owns trade details loading, empty, and error states.

Do not use when the screen needs to render raw XML/GraphQL trade payloads directly.

## `NackResolutionRadioGroup`

Use when the user must select one MT NACK resolution before finishing.

Props:

```ts
type NackResolutionRadioGroupProps = {
  name: string;
  value?: "fixStaticData" | "fixSigners" | "sendToReprocess" | "allCorrect";
  options: Array<{
    value: "fixStaticData" | "fixSigners" | "sendToReprocess" | "allCorrect";
    label: string;
  }>;
  onChangeAction: string;
};
```

Rules:

- exactly one option can be selected;
- the component does not submit the decision;
- submission belongs to the footer `Закончить` action.

## `PageFooterActions`

Use when rendering bottom-right page actions.

Props:

```ts
type PageFooterActionsProps = {
  align: "right";
  children: React.ReactNode;
};
```

## `FinishTaskButton`

Use when finishing a task with the selected page decision.

Props:

```ts
type FinishTaskButtonProps = {
  label: string;
  disabled: boolean;
  loading?: boolean;
  actionId: string;
  params: {
    taskId: string;
    tradeId: string;
    decision: "fixStaticData" | "fixSigners" | "sendToReprocess" | "allCorrect";
  };
};
```

Behavior:

- calls `actionId` with `params`;
- keeps page state unchanged on error;
- shows action error through the page action error channel.
