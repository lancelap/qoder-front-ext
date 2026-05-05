# Prompt: map design elements to project components

```md
Составь component map для реализации экрана. Код пока не пиши.

Контекст:
- Handoff: <path-to-handoff.md|pasted-handoff>
- Спека: <path-to-spec.md|pasted-text>
- Дизайн/DSL: <pixso-link|path-to-layout-dsl.ts|md>
- Стек: React + TypeScript

Scope:
- Найти существующие UI primitives и проектные компоненты.
- Сопоставить каждый design element с компонентом проекта.
- Определить, какие props/events/state нужны.
- Найти похожие страницы или таблицы, которые нужно переиспользовать как пример.

Out of scope:
- Не реализовывать экран.
- Не создавать новые компоненты.
- Не менять файлы.
- Не добавлять зависимости.

Что искать:
- Button / IconButton
- Input / DateInput / DatePicker
- Select / Combobox
- Tabs
- Table / DataTable
- Checkbox
- Skeleton / EmptyState / ErrorState
- Toast / notification, если нужен результат действия

Верни:
1. Existing files inspected.
2. Component map table:
   - design element
   - project component
   - import path
   - props/events
   - example usage file
   - confidence: high/medium/low
3. Missing components and minimal fallback.
4. Rules for implementation prompts:
   - what must be reused
   - what may be local
   - what must not be created
5. Open questions/blockers.

Важно:
- Если проектный компонент найден, дальнейшая реализация обязана использовать его.
- Если компонента нет, предложи минимальный локальный fallback только для текущего экрана.
- Не делай архитектурных выводов без ссылок на реальные файлы проекта.
```
