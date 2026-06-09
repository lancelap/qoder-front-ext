# Payment MT NACK Security Spec

## 1. Goal

The user reviews an MT NACK security validation result, checks the related trade when needed, selects the correct resolution action, and finishes the task.

## 2. Actors And Permissions

- Actor: operations user responsible for MT NACK handling.
- Required permission: `paymentMtNackSecurity.review`.
- If the user does not have permission, the page must show a forbidden state and must not allow finishing the task.

## 3. Screen

- Screen id: `PaymentMtNackSecurity`.
- Main page content:
  - page title;
  - validation errors block;
  - `Просмотр сделки` button;
  - NACK resolution radio group;
  - bottom-right `Закончить` button.
- Side page:
  - opens from `Просмотр сделки`;
  - receives normalized `tradeId`;
  - loads and displays trade details through the trade side page component.

## 4. Data And API Contracts

These are source/backend contracts for analyst review. A2UI schema must consume app-level contracts from `data-contracts.md`, not raw paths from this section.

### Source Payloads

The page receives task/confo payloads from the host runtime.

Required source values:

| Value | Source path | Required |
| --- | --- | --- |
| `taskId` | `data.task.id` | yes |
| `step` | `data.task.parameters.STEP` | yes |
| `tradeId` | `data.confo.params.TRADE_ID` | yes |
| `rejectionReason` | `data.confo.params.MT_CHANNEL_REJECTION_REASON` | no |
| `rejectionDocument` | `data.confo.params.MT_DOCUMENT_VALIDATION_ERRORS` | no |

Exact source paths must be verified against the host task payload before production use.

### Resolver: `getPaymentMtNackContext`

Purpose: normalize host payload into page context.

Input:

- `taskId`
- `step`
- `tradeId`

Output:

```ts
type PaymentMtNackContext = {
  taskId: string;
  step: string;
  tradeId: string;
};
```

Error behavior:

- If `tradeId` is missing, disable `Просмотр сделки` and show a page-level data error.
- If `taskId` is missing, disable `Закончить` and show a page-level data error.

### Resolver: `getMtValidationErrors`

Purpose: normalize MT rejection data into validation errors for UI.

Input:

- `step`
- `rejectionReason`
- `rejectionDocument`

Output:

```ts
type ValidationError = {
  id: string;
  title: string;
  description?: string;
  source?: "channel" | "document" | "unknown";
};
```

Empty behavior:

- If there are no parsed validation errors, show empty text: `Ошибки валидации не найдены`.

### Action: `finishPaymentMtNackSecurity`

Purpose: finish the NACK task with the selected resolution.

Input:

```ts
type FinishPaymentMtNackSecurityInput = {
  taskId: string;
  tradeId: string;
  decision:
    | "fixStaticData"
    | "fixSigners"
    | "sendToReprocess"
    | "allCorrect";
};
```

Success behavior:

- The task is completed.
- The host runtime navigates to the next task or closes the current task page.

Error behavior:

- Keep the selected radio value.
- Keep the user on the page.
- Show error text near the footer action or in the page error area.

## 5. Decisions

The user must select exactly one decision before finishing:

| Decision id | Label | Meaning |
| --- | --- | --- |
| `fixStaticData` | `Исправить статик дату` | Send task to static data correction flow. |
| `fixSigners` | `Исправить подписантов` | Send task to signers correction flow. |
| `sendToReprocess` | `Отправить на репроцесс` | Send task to MT reprocess flow. |
| `allCorrect` | `Все верно` | Finish as confirmed with no correction needed. |

## 6. UI States

- Initial: validation errors and radio group are visible; no decision selected.
- Trade side page closed: default state.
- Trade side page open: opens after clicking `Просмотр сделки`.
- Finish disabled: no radio decision selected or required context is missing.
- Finish loading: after clicking `Закончить`.
- Finish error: action failed.
- Forbidden: user has no `paymentMtNackSecurity.review` permission.

## 7. Given/When/Then Scenarios

### Scenario: Open Trade Side Page

Given the page has a normalized `tradeId`
And the user has `paymentMtNackSecurity.review`
When the user clicks `Просмотр сделки`
Then the trade side page opens
And the side page receives the same normalized `tradeId`.

### Scenario: Finish With Static Data Correction

Given the page has `taskId` and `tradeId`
And the user selected `Исправить статик дату`
When the user clicks `Закончить`
Then action `finishPaymentMtNackSecurity` is called
And the action input contains decision `fixStaticData`.

### Scenario: Finish With Signers Correction

Given the page has `taskId` and `tradeId`
And the user selected `Исправить подписантов`
When the user clicks `Закончить`
Then action `finishPaymentMtNackSecurity` is called
And the action input contains decision `fixSigners`.

### Scenario: Send To Reprocess

Given the page has `taskId` and `tradeId`
And the user selected `Отправить на репроцесс`
When the user clicks `Закончить`
Then action `finishPaymentMtNackSecurity` is called
And the action input contains decision `sendToReprocess`.

### Scenario: Finish As All Correct

Given the page has `taskId` and `tradeId`
And the user selected `Все верно`
When the user clicks `Закончить`
Then action `finishPaymentMtNackSecurity` is called
And the action input contains decision `allCorrect`.

### Scenario: Finish Button Is Disabled Without Decision

Given no radio decision is selected
When the page is rendered
Then the `Закончить` button is disabled.

### Scenario: Finish Action Fails

Given the user selected any radio decision
And action `finishPaymentMtNackSecurity` returns an error
When the user clicks `Закончить`
Then the page remains open
And the selected radio decision remains selected
And the error is shown to the user.

## 8. Acceptance Criteria

- `Просмотр сделки` opens a side page with normalized `tradeId`.
- Radio group contains exactly four options.
- Only one radio option can be selected.
- `Закончить` is disabled until one radio option is selected.
- `Закончить` sends the selected decision through `finishPaymentMtNackSecurity`.
- UI components do not consume raw confo paths directly.
- Missing `taskId` or `tradeId` blocks the relevant action and shows a data error.
