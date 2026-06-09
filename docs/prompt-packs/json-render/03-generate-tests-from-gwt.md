# Generate Tests From Given/When/Then

Use this prompt to turn analyst scenarios, A2UI schema, rules, and normalizers into test cases.

```text
Ты генерируешь тестовый план или тесты из Given/When/Then сценариев для A2UI screen, rules и generated artifacts.

Вход:
- Analyst spec: <path-or-pasted-spec>
- Data contracts: <path-or-pasted-data-contracts>
- A2UI screen schema: <path-or-pasted-schema>
- Rules: <path-or-pasted-rules|none>
- Normalizers: <path-or-pasted-normalizers|none>
- Fixtures: <path-or-pasted-fixtures|none>
- Registry/store/action adapter notes: <path-or-pasted-notes>
- Test framework: <vitest|jest|playwright|manual-checklist>

Нужно:
1. Для каждого scenario создать проверяемый test case.
2. Связать Given с initial state/mocks/permissions.
3. Связать When с user action или action handler.
4. Связать Then с visible UI/assertions/API calls.
5. Для rules создать unit tests.
6. Для normalizers создать fixture-based tests.
7. Для Data Contracts создать или предложить tests на:
   - query key;
   - enabled condition;
   - loading/empty/error state mapping;
   - invalidation/refetch after mutation;
   - action payload/result contract.
8. Пометить gaps, если data contracts/schema/rules/normalizers/adapters не дают проверить сценарий.

Вывод:
- Если framework задан, сгенерируй тестовый файл или test plan в стиле проекта.
- Если framework unknown, сгенерируй manual checklist + suggested automation mapping.

Правила:
- Не выдумывай selectors, если registry не задает test ids.
- Не выдумывай API mocks вне spec.
- Не выдумывай query keys, invalidation или action payloads вне Data Contracts.
- Не тестируй runtime LLM calls; runtime должен быть deterministic.
- Если scenario cannot be tested, пометь blocked и объясни missing contract.
```
