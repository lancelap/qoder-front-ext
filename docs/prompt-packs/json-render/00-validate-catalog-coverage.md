# Validate A2UI Catalog Coverage

Use this prompt before generating A2UI/json-render schema or related LLM artifacts.

```text
Ты проверяешь готовность аналитической спеки, catalog contracts и rules/data contracts к генерации A2UI/json-render artifacts.

Вход:
- Analyst spec: <path-or-pasted-spec>
- Component catalog: <path-or-pasted-catalog>
- Source adapters/resolvers: <path-or-pasted-source-adapters|none>
- Action registry: <path-or-pasted-action-registry|none>
- Data contracts: <path-or-pasted-data-contracts|none>
- Rules format: <path-or-pasted-rules-format|none>
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
10. Rules/conditions можно выразить декларативным rules format без arbitrary JS.
11. Для missing normalizer/fixture/test явно указан artifact request.

Вывод:

Verdict: ready | ready with risks | blocked

Coverage:
| UI block | Component | Registry status | Store/resolver/data contract | Actions | Rules/states | Verdict |
| --- | --- | --- | --- | --- | --- | --- |

Blockers:
- <specific missing contract/component/action/store-binding/resolver/rule/normalizer/fixture/test/state>

Allowed assumptions:
- <only assumptions explicitly supported by spec/catalog>

Правила:
- Если хотя бы один visible block не имеет catalog mapping, verdict blocked.
- Если action не имеет API/local behavior, verdict blocked.
- Если store binding или resolver reference ссылается на XML/GraphQL/raw endpoint без resolver/app-level contract, verdict blocked.
- Если condition требует произвольный JS, verdict blocked.
- Если missing state не влияет на generation, можно ready with risks, но укажи residual risk.
```
