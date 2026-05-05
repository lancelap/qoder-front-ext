# Prompt: implement table, tabs, and selection

```md
Реализуй только table + selection слой.

Контекст:
- Handoff: <path-to-handoff.md|pasted-handoff>
- Component map: <path-to-component-map.md|pasted-map>
- Дизайн/DSL: <pixso-link|path-to-layout-dsl.ts|md>
- Skeleton и FiltersCard уже реализованы.

Scope:
- Реализовать TabsHeader с активным табом и бейджами.
- Реализовать таблицу с колонками из handoff.
- Добавить mock rows или адаптер к уже существующим mock data, если они есть.
- Добавить checkbox selection строк.
- Добавить selected toolbar: `Выбрано N ...`.
- Добавить кнопку `Сформировать`, disabled если ничего не выбрано.
- Добавить helper для русского склонения, если нужен.

Out of scope:
- Не подключать реальный API.
- Не делать loading/empty/error.
- Не делать полноценную сортировку, если её нет в текущем scope.
- Не менять FiltersCard, кроме минимального wiring.
- Не делать visual polish за пределами table/tabs.

Constraints:
- Использовать component map.
- Не создавать новую таблицу, если в проекте есть DataTable/Table.
- Не добавлять зависимости.
- Selection хранить предсказуемо (`Set<string>` или `string[]`) и не смешивать с row data.

Acceptance:
- Табы отображаются и визуально переключаются.
- Таблица показывает строки в правильной структуре.
- Колонка даты поддерживает вторую строку с planned date.
- Можно выбирать и снимать выбор со строк.
- `Выбрано N ...` появляется только при выборе.
- `Сформировать` disabled при `N=0` и enabled при `N>0`.
- Layout не прыгает при появлении selection toolbar.

Output:
- Список изменённых файлов.
- Что сделано.
- Как проверить tabs/table/selection вручную.
- Что осталось на финальную итерацию.
```
