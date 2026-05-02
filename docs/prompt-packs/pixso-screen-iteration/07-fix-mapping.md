# Prompt: fix field mapping mismatches only

```md
Исправь только ошибки маппинга в уже реализованном экране.

Контекст:
- Экран: <screen-name>
- Спека: <path-to-spec.md>
- DSL: <path-to-layout-dsl.ts|md>
- Pixso: <pixso-link>
- Реализация уже существует.

Current result:
- <что сейчас сматчено неверно>
- <какие поля пишут не в тот state/prop>

Expected result:
- <как должен выглядеть корректный mapping>
- <какое поле должно управлять каким значением>

Scope:
- Исправить только mapping полей, пропсов, state keys или data bindings.

Out of scope:
- Не менять layout.
- Не менять стили.
- Не менять поведение, которое не связано напрямую с mapping.
- Не делать рефакторинг архитектуры.

Acceptance:
- Все перечисленные поля мапятся в правильные state keys / props.
- Placeholder, labels и visual structure не меняются.
- Никакие соседние элементы не меняют поведение без необходимости.
- Изменения минимальны и ограничены correction pass.

После правок:
- Коротко перечисли, какие mapping fixes были внесены.
```
