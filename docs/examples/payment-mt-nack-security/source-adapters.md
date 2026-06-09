# Payment MT NACK Security Source Adapters

## Boundary

```text
task/confo payload
        |
source adapters / resolvers
        |
data contracts / app-level contract
        |
json-render / React catalog components
```

UI components must consume normalized app-level props. They must not read raw `data.confo.params.*` paths directly.

## Resolver: `getPaymentMtNackContext`

Purpose: normalize task/confo payload values required by page actions and the trade side page.

Implements contract:

- `paymentMtNack.context`

Sources:

- `task-context`: host task payload.
- `confo-context`: host confo payload.

Input params:

| Param | Source | Required | Notes |
| --- | --- | --- | --- |
| `taskHostContext` | screen input | yes | Host task/confo context passed to source adapter. |

Source mappings:

| Output field | Source path | Required | Notes |
| --- | --- | --- | --- |
| `taskId` | `data.task.id` | yes | Required to finish the task. |
| `step` | `data.task.parameters.STEP` | yes | Used by validation error normalization. |
| `tradeId` | `data.confo.params.TRADE_ID` | yes | Passed to the trade side page. |

Output contract:

```ts
type PaymentMtNackContext = {
  taskId: string;
  step: string;
  tradeId: string;
};
```

States:

- loading: not applicable when host payload is already available.
- empty: blocked when `taskId` or `tradeId` is missing.
- error: source payload is malformed or required field is absent.

Used by:

- `PaymentMtNackSecurityPage`
- `TradeSidePage`
- `finishPaymentMtNackSecurity`

## Resolver: `getMtValidationErrors`

Purpose: normalize MT channel rejection and document validation payloads into a common validation error list.

Implements contract:

- `paymentMtNack.validationErrors`

Sources:

- `task-context`: task step.
- `confo-context`: MT rejection fields.

Input params:

| Param | Source | Required | Notes |
| --- | --- | --- | --- |
| `context` | `paymentMtNack.context` | yes | Provides normalized task step. |
| `taskHostContext` | screen input | yes | Host task/confo context passed to source adapter. |

Source mappings:

| Output field | Source path | Required | Notes |
| --- | --- | --- | --- |
| `step` | `data.task.parameters.STEP` | yes | Used to choose parsing rules. |
| `rejectionReason` | `data.confo.params.MT_CHANNEL_REJECTION_REASON` | no | Channel-level rejection text. |
| `rejectionDocument` | `data.confo.params.MT_DOCUMENT_VALIDATION_ERRORS` | no | Document-level validation payload. |

Output contract:

```ts
type ValidationError = {
  id: string;
  title: string;
  description?: string;
  source?: "channel" | "document" | "unknown";
};

type MtValidationErrors = ValidationError[];
```

States:

- loading: not applicable when source payload is already available.
- empty: return an empty array when no validation errors can be parsed.
- error: malformed rejection document.

Used by:

- `ValidationErrorsBlock`

## Action Resolver: `finishPaymentMtNackSecurity`

Purpose: submit the selected NACK decision to the task host.

Implements contract:

- `paymentMtNack.finish`

Input params:

| Param | Source | Required | Notes |
| --- | --- | --- | --- |
| `taskId` | `data.nackContext.taskId` | yes | Normalized by `getPaymentMtNackContext`. |
| `tradeId` | `data.nackContext.tradeId` | yes | Normalized by `getPaymentMtNackContext`. |
| `decision` | `state.selectedDecision` | yes | Selected radio option. |

Input contract:

```ts
type FinishPaymentMtNackSecurityInput = {
  taskId: string;
  tradeId: string;
  decision: "fixStaticData" | "fixSigners" | "sendToReprocess" | "allCorrect";
};
```

Result:

- success: host task is completed.
- error: return a user-visible error and keep page state unchanged.
