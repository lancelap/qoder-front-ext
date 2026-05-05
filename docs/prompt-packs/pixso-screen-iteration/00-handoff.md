# Prompt: prepare design handoff, no code

```md
Подготовь frontend handoff для поэтапной реализации экрана по дизайну.

Контекст:
- Репозиторий: <repo-root>
- Экран: <screen-name>
- Спека: <path-to-spec.md|pasted-text>
- Дизайн: <pixso-link|screenshot|export>
- Дизайн DSL: <path-to-layout-dsl.ts|md|none>
- Стек: React + TypeScript

Scope:
- Разобрать дизайн и спеку в frontend contract.
- Зафиксировать структуру экрана.
- Зафиксировать видимые тексты, состояния, данные и ограничения.
- Подготовить вопросы по всем неоднозначностям.

Out of scope:
- Не писать код.
- Не менять файлы проекта.
- Не предлагать новую дизайн-систему.
- Не придумывать backend behavior, которого нет в спеке.

Верни handoff в формате:
1. Verdict: ready / partially-ready / blocked.
2. Screen structure: секции сверху вниз.
3. Components: design element -> expected frontend component.
4. Data contract: нужные поля, источники данных, null/empty behavior.
5. UI states: default, loading, empty, error, disabled, hover/focus.
6. Responsive rules: desktop/tablet/mobile.
7. Acceptance criteria.
8. Open questions.
9. Iteration plan: ровно 5 следующих шагов:
   - component map
   - skeleton
   - filters
   - table + selection
   - states + responsive QA

Важно:
- Если данных хватает только на визуальную реализацию, явно напиши это в Verdict.
- Если есть Pixso/DSL расхождение со спекой, вынеси его отдельным пунктом.
- Handoff должен быть пригоден для копирования в следующие prompts.
```
