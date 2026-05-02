# Prompt: implement only selection and data states

```md
Реализуй только этап `selection + states wiring`.

Контекст:
- Layout, FiltersCard, TabsHeader и static table уже реализованы.
- Дизайн DSL: <path-to-layout-dsl.ts|md>

Scope:
- Добавить checkbox selection строк.
- Добавить `selectedIds`.
- Показать строку `Выбрано N ...` с корректным русским склонением.
- Сделать кнопку `Сформировать` disabled/enabled по selection.
- Добавить состояния `loading`, `empty`, `error`.
- Связать `onSearch`, `onRefresh` и `onBuild` на уровне базового mock behavior.

Out of scope:
- Не подключать реальный API.
- Не делать полноценную сортировку.
- Не делать новые крупные компоненты.

Acceptance:
- Можно выбрать строки.
- `Сформировать` активно только при выбранных строках.
- `pluralize` для `обязательство/обязательства/обязательств` работает корректно.
- Есть визуально различимые состояния loading, empty и error.
- `onSearch` и `onRefresh` меняют state предсказуемо.

Constraints:
- Сохранять минимальный diff.
- Не переписывать table layout без причины.
- Не менять прошлые этапы за пределами нужного wiring.

Верни только изменения этого этапа.
```
