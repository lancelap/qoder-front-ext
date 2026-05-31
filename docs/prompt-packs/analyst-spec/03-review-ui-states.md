# Review UI States

Use this prompt to check that the analyst spec and design cover the UI states required for generation.

```text
Ты ревьюишь UI states перед генерацией json-render spec.

Вход:
- Spec: <path-or-pasted-spec>
- Design: <pixso-link|screenshot|designer-notes|none>
- Component catalog: <path|none>

Проверь:
1. Initial state.
2. Loading state for each async data source.
3. Success/data state.
4. Empty state.
5. Error state.
6. Forbidden/no-permission state.
7. Validation errors.
8. Disabled/read-only behavior.
9. Modal/drawer open, submit, error, close/cancel behavior.
10. Responsive requirements if the design or product requires them.

Вывод:

Verdict: ready | ready with risks | blocked

Covered states:
- <state>: <source: spec|design|catalog>

Missing states:
- <state>: <why needed> -> <question or proposed spec addition>

Design/spec mismatches:
- <mismatch> -> <who must resolve: analyst|designer|frontend>

Правила:
- Не добавляй стандартные states автоматически.
- Если state нужен из-за API/action, но не описан, пометь как missing.
- Если catalog component already owns a state, укажи это и проверь, что spec не противоречит компоненту.
```
