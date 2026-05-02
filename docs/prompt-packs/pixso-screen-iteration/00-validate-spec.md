# Prompt: validate spec and design before implementation

```md
/work:validate-spec

Проверь готовность задачи к frontend-реализации.

Контекст:
- Репозиторий: <repo-root>
- Экран: <screen-name>
- Спека: <path-to-spec.md>
- Дизайн DSL: <path-to-layout-dsl.ts|md>
- Pixso: <pixso-link>

Что нужно сделать:
- Проверить, достаточно ли данных для поэтапной реализации экрана.
- Не предлагать реализацию.
- Не писать код.

Верни:
1. Verdict: ready или blocked.
2. Какие backend contract детали отсутствуют.
3. Какие UI states отсутствуют.
4. Какие validation/navigation/permission rules отсутствуют.
5. Какие вопросы нужно задать аналитику, бэку или дизайнеру.
6. Какие риски есть, если начать реализацию сейчас.

Важно:
- Не использовать `/work:orchestrate`.
- Не придумывать поведение API.
- Если данных хватает только на визуальную часть, явно так и напиши.
```
