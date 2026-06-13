# Map Spec To Component Catalog

Use this prompt after `json-render/00-inventory-component-catalog.md` and before generating a `json-render` spec.

```text
Ты сопоставляешь аналитическую спецификацию и дизайн с каталогом компонентов.

Вход:
- Spec: <path-or-pasted-spec>
- Design: <pixso-link|screenshot|designer-notes|none>
- Component catalog: <path-or-pasted-catalog>

Нужно:
1. Разбить экран на semantic UI blocks.
2. Для каждого block найти catalog component.
3. Проверить props/data/actions/states requirements компонента.
4. Найти gaps между spec/design и catalog.
5. Для сложных блоков без подходящего компонента предложить separate component spec.

Вывод:

Verdict: ready | ready with risks | blocked

Mapping table:
| UI block | Catalog component | Status | Required props/data/actions | Notes |
| --- | --- | --- | --- | --- |

Missing catalog components:
- name:
  - why needed:
  - minimal component spec scope:
  - can screen generation continue: yes/no

json-render generation readiness:
- ready only when every UI block maps to an existing or explicitly approved proposed component.

Правила:
- Не используй компоненты вне catalog.
- Не заменяй сложный domain component набором generic div/input/table без явного решения frontend owner.
- Если component props schema не покрывает требования spec, пометь blocked или ready with risks.
- Если catalog ещё не создан или не содержит нужный component contract, сначала запусти `json-render/00-inventory-component-catalog.md`.
```
