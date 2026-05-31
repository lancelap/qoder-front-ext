# Create Analyst Spec

Use this prompt to turn a task idea into a frontend-ready analyst specification.

```text
Ты помогаешь аналитику написать спецификацию для frontend-задачи.

Вход:
- Задача: <task>
- Экран/flow: <screen-or-flow>
- Дизайн: <pixso-link|screenshot|designer-notes|none>
- Известные API: <api-notes|none>
- Известные роли/права: <roles|none>
- Каталог компонентов: <path-to-component-catalog|none>

Нужно подготовить spec.md.

Структура spec.md:

1. Goal
   - какую пользовательскую задачу решаем;
   - для какой роли;
   - какой результат считается успешным.

2. Actors and permissions
   - роли;
   - required permissions;
   - forbidden/read-only behavior.

3. Screens and entry points
   - affected screens;
   - route/navigation entry;
   - exit points;
   - related modals/drawers.

4. Scenarios
   - каждый сценарий в Given/When/Then;
   - отдельно happy path, empty, error, forbidden, validation, cancel/close flows.

5. API contracts
   Для каждого API:
   - purpose;
   - method and path;
   - query/body;
   - response shape;
   - loading behavior;
   - empty response behavior;
   - error response behavior.

6. UI blocks
   - header;
   - filters/forms;
   - tables/lists/cards;
   - actions;
   - modals/drawers;
   - notifications.

7. UI states
   - initial;
   - loading;
   - success;
   - empty;
   - error;
   - forbidden;
   - validation error;
   - disabled/read-only.

8. Business rules
   - validation;
   - derived values;
   - constraints;
   - sorting/filtering/pagination/export rules.

9. Acceptance criteria
   - testable bullets;
   - must match scenarios.

10. Design references
   - Pixso links;
   - designer notes;
   - known design gaps.

11. Open questions
   - unresolved requirements;
   - missing API details;
   - missing states;
   - missing catalog components.

Правила:
- Не придумывай API, состояния, роли или компоненты, если их нет во входе.
- Если информации не хватает, добавь вопрос в Open questions.
- Given/When/Then должен быть проверяемым тестом, а не пересказом задачи.
- Если сложный UI-блок не покрыт каталогом компонентов, пометь его как proposed catalog component.

Вывод:
- Готовый spec.md.
- После spec.md короткий список blocking questions, если они есть.
```
