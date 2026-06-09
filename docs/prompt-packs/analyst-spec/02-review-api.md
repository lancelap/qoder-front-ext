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
11. API response fields that UI needs can be promoted into Stage 2 app-level Data Contracts.
12. Raw XML/GraphQL/backend paths are not treated as final UI binding paths.

Вывод:

Verdict: ready | ready with risks | blocked

API coverage:
- <api>: ready | missing query | missing response | missing errors | unused | unclear

Blocking gaps:
- <gap> -> <question for analyst/backend>

Data Contract handoff:
- <api/source field> -> <needed app-level field/contract> -> <normalizer/resolver needed yes/no>

Spec fixes:
- точечные правки текста, которые аналитик может вставить в spec.md.

Правила:
- Не придумывай endpoint, field, enum, response или error behavior.
- Если UI требует данных, которых нет в API, пометь это как blocked.
- Если API details есть, но app-level contract неясен, verdict ready with risks или blocked и отправь в `json-render/00-define-data-contracts.md`.
```
