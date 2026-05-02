# Навигатор по prompt packs

Это стартовая точка для пользователя.

Если непонятно, какой prompt брать, начинайте отсюда.

## Быстрый выбор

| Ситуация | Что использовать |
| --- | --- |
| Есть сырая спека, нужно понять, можно ли начинать | `pixso-screen-iteration/00-validate-spec.md` |
| Нужен только план без правок | `pixso-screen-iteration/01-plan.md` |
| Нужно собрать экран по Pixso по шагам | `pixso-screen-iteration/README.md` |
| Нужно сделать только layout страницы | `pixso-screen-iteration/02-layout.md` |
| Нужно сделать только фильтры | `pixso-screen-iteration/03-filters.md` |
| Нужно сделать только tabs и static table | `pixso-screen-iteration/04-tabs-table.md` |
| Нужно добавить selection и states | `pixso-screen-iteration/05-selection-states.md` |
| Нужна только финальная полировка | `pixso-screen-iteration/06-polish-review.md` |
| Реализация почти верная, но поломан mapping | `pixso-screen-iteration/07-fix-mapping.md` |
| Реализация почти верная, но поведение неверное | `pixso-screen-iteration/08-fix-behavior.md` |
| Реализация почти верная, но визуал не совпадает | `pixso-screen-iteration/09-fix-visual-alignment.md` |

## Рекомендуемый пользовательский путь

Для нового большого экрана:

1. Откройте `docs/usage-scenarios.md`.
2. Найдите подходящий сценарий.
3. Перейдите в этот индекс или сразу в нужный prompt.
4. Скопируйте markdown-шаблон в Qwen.

Для correction pass:

1. Не перезапускайте весь flow.
2. Сначала определите тип mismatch:
   - mapping
   - behavior
   - visual
3. Возьмите соответствующий correction prompt.

## Что не делать

- Не просить “сделай всё” для большого Pixso-экрана.
- Не запускать `/work:orchestrate` как default для любой визуальной задачи.
- Не смешивать в одном prompt initial implementation и correction pass.
