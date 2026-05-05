# Prompt: implement states and responsive QA

```md
Закрой состояния данных и responsive QA для уже собранного экрана.

Контекст:
- Handoff: <path-to-handoff.md|pasted-handoff>
- Component map: <path-to-component-map.md|pasted-map>
- Дизайн/DSL: <pixso-link|path-to-layout-dsl.ts|md>
- Skeleton, FiltersCard, TabsHeader, table и selection уже реализованы.

Scope:
- Добавить/проверить loading state.
- Добавить/проверить empty state.
- Добавить/проверить error state.
- Связать search/refresh с mock loading behavior, если реального API ещё нет.
- Проверить responsive:
  - desktop: filters 4 колонки
  - tablet: filters 2 колонки
  - mobile: filters 1 колонка
  - table не ломает страницу и имеет понятный overflow/scroll
- Проверить keyboard/accessibility basics для интерактивных элементов.
- Подправить только локальные spacing/alignment/overflow проблемы.

Out of scope:
- Не подключать реальный API.
- Не добавлять новый функционал.
- Не менять архитектуру страницы.
- Не делать глобальный refactor.
- Не менять component map.

Constraints:
- Diff должен быть polish/state-level.
- Не переписывать уже работающие filters/table/selection без конкретной причины.
- Если проблема требует большого refactor, сначала опиши её как follow-up.

Acceptance:
- Loading/empty/error видны и не ломают layout.
- Search/refresh предсказуемо переводят экран между состояниями.
- Filters адаптируются на desktop/tablet/mobile.
- Table не вызывает горизонтальный overflow всей страницы, кроме контролируемого table scroll.
- Тексты не налезают на controls.
- Selection и кнопка `Сформировать` не сломаны.

Output:
- Список изменённых файлов.
- Что сделано.
- Как проверить responsive и states.
- Visual QA checklist с результатами.
- Остаточные риски/follow-ups.
```
