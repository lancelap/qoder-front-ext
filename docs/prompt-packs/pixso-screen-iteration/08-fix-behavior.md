# Prompt: fix behavior mismatches only

```md
Исправь только расхождения в поведении уже реализованного экрана.

Контекст:
- Экран: <screen-name>
- Спека: <path-to-spec.md>
- DSL: <path-to-layout-dsl.ts|md>
- Pixso: <pixso-link>
- Реализация уже существует.

Current result:
- Trigger: <что делает пользователь>
- Current: <что происходит сейчас>
- Expected: <что должно происходить>

Повтори этот формат для каждого mismatch.

Scope:
- Исправить только event handling, state transitions и expected user behavior.

Out of scope:
- Не менять layout.
- Не менять mapping полей, если это не требуется для конкретного behavior fix.
- Не менять стили, кроме случаев, когда они отражают состояние.
- Не делать новые фичи.

Acceptance:
- Каждый перечисленный trigger даёт ожидаемый результат.
- Поведение соседних элементов не меняется.
- Изменения локальны и не расширяют scope задачи.
- Если нужен mock behavior, он остаётся простым и предсказуемым.

После правок:
- Коротко перечисли, какие behavior fixes были внесены.
```
