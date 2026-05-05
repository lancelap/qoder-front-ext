# Prompt: implement skeleton only

```md
Реализуй только skeleton экрана по handoff и component map.

Контекст:
- Handoff: <path-to-handoff.md|pasted-handoff>
- Component map: <path-to-component-map.md|pasted-map>
- Дизайн/DSL: <pixso-link|path-to-layout-dsl.ts|md>
- Стек: React + TypeScript

Scope:
- Создать контейнер страницы/секции.
- Отрисовать header: title + subtitle.
- Добавить surface под FiltersCard.
- Добавить место под tabs/table toolbar.
- Добавить пустой shell таблицы без строк и без selection.
- Настроить базовый layout, spacing и responsive shell.

Out of scope:
- Не реализовывать поля фильтров.
- Не реализовывать контролируемую форму.
- Не реализовывать реальные табы.
- Не реализовывать строки таблицы.
- Не делать API, mock fetch, loading/empty/error.
- Не добавлять selection.

Constraints:
- Использовать component map.
- Не создавать новую дизайн-систему.
- Не добавлять зависимости.
- Не менять роутинг/API без необходимости.
- Если требуется подключение страницы к роуту, сделай минимальный wiring и объясни его.

Acceptance:
- Есть структура экрана в правильном порядке.
- Header copy совпадает с handoff.
- Секции под filters, tabs и table визуально отделены.
- Layout не ломается на desktop/tablet/mobile.
- Код компилируется.

Output:
- Список изменённых файлов.
- Что сделано.
- Как проверить.
- Что осталось на следующие итерации.
```
