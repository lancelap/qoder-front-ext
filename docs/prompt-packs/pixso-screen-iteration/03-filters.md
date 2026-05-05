# Prompt: implement filters only

```md
Реализуй только FiltersCard.

Контекст:
- Handoff: <path-to-handoff.md|pasted-handoff>
- Component map: <path-to-component-map.md|pasted-map>
- Дизайн/DSL: <pixso-link|path-to-layout-dsl.ts|md>
- Skeleton уже реализован.

Scope:
- Реализовать все поля фильтра из handoff/DSL.
- Сделать контролируемое состояние формы.
- Добавить labels и placeholders строго как в handoff.
- Реализовать кнопку поиска.
- Реализовать `Сбросить`.
- Подключить фильтр к родителю через callbacks (`onSearch`, `onReset` или локальный эквивалент).

Out of scope:
- Не делать таблицу.
- Не делать selection.
- Не подключать реальный API.
- Не делать tabs behavior, кроме required placeholder wiring.
- Не добавлять loading/empty/error.

Constraints:
- Использовать component map.
- Не добавлять зависимости.
- Не создавать новый generic form framework.
- Не менять внешний layout за пределами нужного места под FiltersCard.

Acceptance:
- Все поля присутствуют.
- Все labels/placeholders совпадают.
- Desktop: 4 колонки.
- Tablet: 2 колонки.
- Mobile: 1 колонка.
- `Сбросить` очищает форму.
- Search вызывает handler с текущими фильтрами.
- Код типизирован.

Output:
- Список изменённых файлов.
- Что сделано.
- Как проверить filters вручную.
- Что осталось на следующие итерации.
```
