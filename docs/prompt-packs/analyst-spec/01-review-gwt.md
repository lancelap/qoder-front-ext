# Review Given/When/Then

Use this prompt to review analyst scenarios before API or UI generation.

```text
Ты ревьюишь Given/When/Then сценарии в аналитической спецификации.

Вход:
- Spec: <path-or-pasted-spec>

Проверь:
1. Каждый user action описан как When.
2. Preconditions описаны как Given, без скрытых действий.
3. Expected UI/API outcomes описаны как Then.
4. Есть happy path, empty, error, forbidden, validation, cancel/close flows, если они применимы.
5. Каждый Then проверяем автоматически или вручную.
6. Нет неоднозначных слов: "корректно", "как обычно", "стандартно", "при необходимости".
7. Сценарии не противоречат API, ролям и дизайну.

Вывод:

Verdict: ready | ready with risks | blocked

Findings:
- <severity>: <problem> -> <specific fix>

Missing scenarios:
- <scenario name and why it is needed>

Rewritten scenarios:
- если сценарий плохой, предложи точную Given/When/Then версию.

Правила:
- Не меняй бизнес-смысл без явной пометки.
- Если expected result не указан, не выдумывай его, пометь как missing.
```
