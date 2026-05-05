# Навигатор по prompt packs

Это стартовая точка для пользователя.

Если непонятно, какой prompt брать, начинайте отсюда.

## Быстрый выбор

| Ситуация | Что использовать |
| --- | --- |
| Нужно собрать экран по Pixso маленькими итерациями | `pixso-screen-iteration/README.md` |
| Нужно сначала сделать frontend handoff без кода | `pixso-screen-iteration/00-handoff.md` |
| Нужно понять, какие компоненты проекта переиспользовать | `pixso-screen-iteration/01-component-map.md` |
| Нужно сделать только skeleton страницы | `pixso-screen-iteration/02-skeleton.md` |
| Нужно сделать только фильтры | `pixso-screen-iteration/03-filters.md` |
| Нужно сделать table, tabs и selection | `pixso-screen-iteration/04-table-selection.md` |
| Нужно закрыть states и responsive QA | `pixso-screen-iteration/05-states-responsive-qa.md` |
| Реализация почти верная, но поломан mapping | `pixso-screen-iteration/07-fix-mapping.md` |
| Реализация почти верная, но поведение неверное | `pixso-screen-iteration/08-fix-behavior.md` |
| Реализация почти верная, но визуал не совпадает | `pixso-screen-iteration/09-fix-visual-alignment.md` |

## Рекомендуемый пользовательский путь

Для нового большого экрана:

1. Откройте `docs/usage-scenarios.md`.
2. Найдите подходящий сценарий.
3. Начните с `pixso-screen-iteration/00-handoff.md`.
4. После handoff сделайте `pixso-screen-iteration/01-component-map.md`.
5. Только потом переходите к implementation prompts.

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
