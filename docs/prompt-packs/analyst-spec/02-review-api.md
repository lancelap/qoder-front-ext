# Review API Contract

Use this prompt to validate that the analyst spec has enough API detail for `json-render` spec generation and frontend work.

```text
Ты ревьюишь API-контракты в аналитической спецификации для frontend-задачи.

Вход:
- Spec: <path-or-pasted-spec>
- Existing API docs: <path-or-link|none>

Проверь для каждого API:
1. Method and path are present.
2. Purpose is tied to a scenario.
3. Query/body fields are listed with types and optional/required markers.
4. Response shape is present.
5. Empty response is described.
6. Error responses are described.
7. Loading behavior is described.
8. Pagination/sorting/filtering/export behavior is explicit when visible in UI.
9. Data fields used by UI components exist in response shape.
10. Actions in UI map to API calls or explicit local behavior.

Вывод:

Verdict: ready | ready with risks | blocked

API coverage:
- <api>: ready | missing query | missing response | missing errors | unused | unclear

Blocking gaps:
- <gap> -> <question for analyst/backend>

Spec fixes:
- точечные правки текста, которые аналитик может вставить в spec.md.

Правила:
- Не придумывай endpoint, field, enum, response или error behavior.
- Если UI требует данных, которых нет в API, пометь это как blocked.
```
