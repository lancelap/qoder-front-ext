# Payment MT NACK Security Data Contracts

## Screen Inputs

| Input | Type | Required | Source | Notes |
| --- | --- | --- | --- | --- |
| `taskHostContext` | `PaymentMtNackHostContext` | yes | host runtime | Contains task/confo payloads. UI schema must not bind to raw fields inside it. |

```ts
type PaymentMtNackHostContext = unknown;
```

## Data Contract: `paymentMtNack.context`

Purpose:
Provide the normalized page context required by the trade side page and finish action.

Owner:
resolver/source adapter

Params:

```ts
type PaymentMtNackContextParams = {
  taskHostContext: PaymentMtNackHostContext;
};
```

Normalized output:

```ts
type PaymentMtNackContext = {
  taskId: string;
  step: string;
  tradeId: string;
};
```

Transport source:
- kind: context
- source: host task/confo payload
- notes: raw paths are mapped in `source-adapters.md`, not in `screen.render.json`

Query/cache:
- query key: not applicable; host context is already available
- enabled when: `taskHostContext` is present
- stale/cache policy: host runtime owned
- loading state: not applicable
- empty state: missing `taskId` or `tradeId` blocks related actions
- error state: malformed or incomplete host payload

Invalidation/refetch:
- after: not applicable
- reason: host runtime owns task context refresh

Used by:
- resolver: `getPaymentMtNackContext`
- component: `TradeSidePageTrigger`
- component: `TradeSidePage`
- action: `paymentMtNack.finish`
- scenarios: `open-trade-side-page`, finish scenarios

Required artifacts:
- normalizer: `getPaymentMtNackContext`
- fixture: host payload fixture with task/confo data
- unit test: maps `taskId`, `step`, and `tradeId`
- integration/store test: blocks finish when required context is missing

## Data Contract: `paymentMtNack.validationErrors`

Purpose:
Provide normalized MT validation errors for `ValidationErrorsBlock`.

Owner:
resolver/source adapter

Params:

```ts
type PaymentMtNackValidationErrorsParams = {
  context: PaymentMtNackContext;
  taskHostContext: PaymentMtNackHostContext;
};
```

Normalized output:

```ts
type ValidationError = {
  id: string;
  title: string;
  description?: string;
  source?: "channel" | "document" | "unknown";
};

type PaymentMtNackValidationErrors = ValidationError[];
```

Transport source:
- kind: context
- source: host task/confo payload
- notes: raw rejection fields are mapped in `source-adapters.md`

Query/cache:
- query key: not applicable; parsing is local to host context
- enabled when: `paymentMtNack.context` is resolved
- stale/cache policy: recompute when host context changes
- loading state: not applicable
- empty state: empty array with empty text `Ошибки валидации не найдены`
- error state: malformed rejection document

Invalidation/refetch:
- after: host context change
- reason: validation errors are derived from host context

Used by:
- resolver: `getMtValidationErrors`
- component: `ValidationErrorsBlock`

Required artifacts:
- normalizer: `getMtValidationErrors`
- fixture: host payload fixture with channel and document validation errors
- unit test: maps channel/document rejection fields to normalized errors

## Action Contract: `paymentMtNack.finish`

Purpose:
Finish the NACK task with the selected resolution.

Payload:

```ts
type FinishPaymentMtNackSecurityInput = {
  taskId: string;
  tradeId: string;
  decision: "fixStaticData" | "fixSigners" | "sendToReprocess" | "allCorrect";
};
```

Response:

```ts
type FinishPaymentMtNackSecurityResult = {
  status: "completed";
};
```

Success behavior:
- host task is completed
- host runtime navigates to the next task or closes the current page

Error behavior:
- keep selected radio value
- keep page open
- write error to `state.finishError`

Invalidation/refetch:
- contract/query key: host task list or host task context, if project runtime exposes it
- reason: task status changed

Required artifacts:
- API/action adapter: `finishPaymentMtNackSecurity`
- fixture: selected decision payload
- unit test: builds action payload from normalized context and selected decision
- store/action test: preserves selection and exposes error on action failure

## Resolver Contract: `getPaymentMtNackContext`

Purpose:
Implement `paymentMtNack.context` by normalizing host task/confo payloads.

Params:

```ts
type GetPaymentMtNackContextParams = {
  taskHostContext: PaymentMtNackHostContext;
};
```

Output:

```ts
type GetPaymentMtNackContextOutput = PaymentMtNackContext;
```

Dependencies:
- data contract: `paymentMtNack.context`

States:
- loading: not applicable
- empty: missing required context
- error: malformed payload

## Resolver Contract: `getMtValidationErrors`

Purpose:
Implement `paymentMtNack.validationErrors` by normalizing MT channel rejection and document validation payloads.

Params:

```ts
type GetMtValidationErrorsParams = {
  context: PaymentMtNackContext;
  taskHostContext: PaymentMtNackHostContext;
};
```

Output:

```ts
type GetMtValidationErrorsOutput = ValidationError[];
```

Dependencies:
- data contract: `paymentMtNack.context`
- data contract: `paymentMtNack.validationErrors`

States:
- loading: not applicable
- empty: empty array
- error: malformed rejection document

## Blocking Questions

| Gap | Why it blocks | Owner | Needed answer |
| --- | --- | --- | --- |
| Exact host task/confo payload type | Needed for production normalizer typings | backend/frontend integration | Confirm runtime payload contract and fixture source |
