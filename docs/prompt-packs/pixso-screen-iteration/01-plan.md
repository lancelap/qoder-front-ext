# Prompt: build an iterative plan, not implementation

```md
/work:plan

Нужно сделать план поэтапной реализации экрана, без кода.

Контекст:
- Спека: <path-to-spec.md>
- Дизайн DSL: <path-to-layout-dsl.ts|md>
- Pixso: <pixso-link>
- Технологии: React + TypeScript

Требование к формату:
- Разбей задачу на 5-7 маленьких итераций.
- Каждая итерация должна быть изолированной и проверяемой.
- Не объединяй в один этап layout, data wiring и сложное поведение.

Верни:
1. Итерации по порядку.
2. Для каждой итерации:
   - scope
   - out of scope
   - likely files to change
   - reuse candidates
   - acceptance criteria
   - verification command
3. Риски и открытые вопросы.

Важно:
- Не предлагать full-cycle orchestration.
- Не писать код.
- Не предлагать новые абстракции без необходимости.
```
