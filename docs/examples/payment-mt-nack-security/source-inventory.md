# Payment MT NACK Security Source Inventory

This file documents raw/source-level facts for the Payment MT NACK Security pilot. It is not a UI contract and not an A2UI schema.

## Source: `paymentMtNack.hostContext`

Kind:
- host-context

Owner:
- host runtime

Purpose:
- Provides task and confo payloads for the MT NACK Security page.

Used by scenarios:
- `open-trade-side-page`
- `finish-static-data`
- `finish-signers`
- `send-to-reprocess`
- `finish-all-correct`
- `finish-disabled-without-decision`
- `finish-action-fails`

Raw params:

```ts
type PaymentMtNackHostContextParams = {};
```

Raw output:

```ts
type PaymentMtNackHostContext = unknown;
```

Known raw fields needed by spec:

| Raw field/path | Meaning | Required | Notes |
| --- | --- | --- | --- |
| `data.task.id` | Task id | yes | Required to finish the task. |
| `data.task.parameters.STEP` | Task step | yes | Used by validation error normalization. |
| `data.confo.params.TRADE_ID` | Trade id | yes | Passed to the trade side page after normalization. |
| `data.confo.params.MT_CHANNEL_REJECTION_REASON` | Channel rejection text | no | One source for validation errors. |
| `data.confo.params.MT_DOCUMENT_VALIDATION_ERRORS` | Document validation payload | no | One source for validation errors. |

Existing query/cache behavior:
- query key: not applicable
- enabled condition: host context is present
- stale/cache policy: host runtime owned
- refetch: host runtime owned
- invalidation: host runtime owned

States:
- loading: not applicable when host context is already injected
- empty: missing required fields
- error: malformed payload

Existing normalizers/mappers:
- `getPaymentMtNackContext`
- `getMtValidationErrors`

Risks:
- Exact host payload type is not defined in this example and must be confirmed before production use.

## Action/Mutation Source: `paymentMtNack.hostFinishAction`

Kind:
- host-action

Owner:
- host runtime

Raw payload:

```ts
type FinishPaymentMtNackSecurityInput = {
  taskId: string;
  tradeId: string;
  decision: "fixStaticData" | "fixSigners" | "sendToReprocess" | "allCorrect";
};
```

Raw response:

```ts
type FinishPaymentMtNackSecurityResult = {
  status: "completed";
};
```

Success behavior:
- host task is completed
- host runtime navigates to the next task or closes the current task page

Error behavior:
- action rejects or returns an error
- page must keep selected radio value
- page must expose a user-visible error

Invalidation/refetch:
- host task list or task context may need refresh if the project runtime exposes such behavior

## Source Gaps

| Gap | Why it matters | Owner | Needed answer |
| --- | --- | --- | --- |
| Exact host task/confo payload type | Needed for production normalizer typings and fixtures | backend/frontend integration | Confirm runtime payload contract and fixture source |
| Host invalidation/refetch API after finish | Needed for deterministic post-finish behavior | host runtime | Confirm whether host task list/context must be invalidated or navigation is enough |

## Handoff To Data Contracts

| Spec need | Candidate source(s) | Needs normalizer/resolver | Notes |
| --- | --- | --- | --- |
| Normalized page context with `taskId`, `step`, `tradeId` | `paymentMtNack.hostContext` | yes | Implemented by `paymentMtNack.context`. |
| Normalized validation errors | `paymentMtNack.hostContext` | yes | Implemented by `paymentMtNack.validationErrors`. |
| Finish selected decision | `paymentMtNack.hostFinishAction` | no for payload shape, yes for action adapter | Implemented by `paymentMtNack.finish`. |
