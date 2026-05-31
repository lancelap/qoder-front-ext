# Generate Tests From Given/When/Then

Use this prompt to turn analyst scenarios into test cases for a `json-render` screen.

```text
Ты генерируешь тестовый план или тесты из Given/When/Then сценариев для json-render screen.

Вход:
- Analyst spec: <path-or-pasted-spec>
- screen.render.json: <path-or-pasted-json>
- Registry/action/data adapter notes: <path-or-pasted-notes>
- Test framework: <vitest|jest|playwright|manual-checklist>

Нужно:
1. Для каждого scenario создать проверяемый test case.
2. Связать Given с initial state/mocks/permissions.
3. Связать When с user action или action handler.
4. Связать Then с visible UI/assertions/API calls.
5. Пометить gaps, если JSON или adapters не дают проверить сценарий.

Вывод:
- Если framework задан, сгенерируй тестовый файл или test plan в стиле проекта.
- Если framework unknown, сгенерируй manual checklist + suggested automation mapping.

Правила:
- Не выдумывай selectors, если registry не задает test ids.
- Не выдумывай API mocks вне spec.
- Если scenario cannot be tested, пометь blocked и объясни missing contract.
```
