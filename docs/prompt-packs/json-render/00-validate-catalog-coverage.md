# Validate Catalog Coverage

Use this prompt before generating `screen.render.json`.

```text
Ты проверяешь готовность аналитической спеки и каталога компонентов к генерации json-render spec.

Вход:
- Analyst spec: <path-or-pasted-spec>
- Component catalog: <path-or-pasted-catalog>
- Source adapters/resolvers: <path-or-pasted-source-adapters|none>
- Design: <pixso-link|screenshot|designer-notes|none>

Проверь:
1. Все UI blocks из spec/design сопоставлены catalog components.
2. Все component types есть в registry или явно proposed.
3. Все props, которые нужны spec, разрешены props schema компонента.
4. Все actions из spec имеют action id и owner.
5. Все store bindings, resolver references и async actions имеют state/API/resolver contract.
6. Все permissions/read-only/forbidden rules описаны.
7. Все required states покрыты spec или catalog component.
8. XML/GraphQL/разные ручки нормализуются через source adapters/resolvers.
9. UI components получают app-level contract, а не raw XML/GraphQL/source-specific поля.

Вывод:

Verdict: ready | ready with risks | blocked

Coverage:
| UI block | Component | Registry status | Store/resolver | Actions | States | Verdict |
| --- | --- | --- | --- | --- | --- | --- |

Blockers:
- <specific missing contract/component/action/store-binding/resolver/state>

Allowed assumptions:
- <only assumptions explicitly supported by spec/catalog>

Правила:
- Если хотя бы один visible block не имеет catalog mapping, verdict blocked.
- Если action не имеет API/local behavior, verdict blocked.
- Если store binding или resolver reference ссылается на XML/GraphQL/raw endpoint без resolver/app-level contract, verdict blocked.
- Если missing state не влияет на generation, можно ready with risks, но укажи residual risk.
```
