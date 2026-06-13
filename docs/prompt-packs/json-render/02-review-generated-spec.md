# Review Generated A2UI / json-render Artifacts

Use this prompt after A2UI/json-render schema or related LLM artifacts are generated.

```text
Ты ревьюишь A2UI/json-render schema, rules, normalizers и test artifacts перед runtime render.

Вход:
- Analyst spec: <path-or-pasted-spec>
- Component catalog: <path-or-pasted-catalog>
- Source inventory: <path-or-pasted-source-inventory>
- Data contracts: <path-or-pasted-data-contracts>
- Source adapters/resolvers: <path-or-pasted-source-adapters|none>
- Registry contract: <path-or-pasted-registry-contract>
- Action registry: <path-or-pasted-action-registry|none>
- Rules: <path-or-pasted-rules|none>
- Normalizers: <path-or-pasted-normalizers|none>
- Fixtures/tests: <path-or-pasted-tests|none>
- Generated A2UI schema: <path-or-pasted-schema>

Проверь:
1. JSON валиден.
2. schemaVersion корректный.
3. Top-level shape содержит canonical keys: schemaVersion, screen, inputs, data, state, resolvers, actions, rules, tree, metadata.
4. Все component types есть в registry.
5. Все props разрешены props schema.
6. Все data references, store bindings, resolver references и async actions имеют Source Inventory/Data Contract/state/API/resolver contract.
7. Все actions имеют handler/action contract.
8. Given/When/Then scenarios покрыты tree/actions/states/tests.
9. Нет invented fields/states/actions/components.
10. XML/GraphQL/source-specific mappings не протекают в UI components или resolver params напрямую.
11. Screen Inputs содержат только внешние входы экрана: route params, host context, explicit props, user/permissions.
12. Screen Inputs не содержат hook outputs, XML paths, `enrichedXml` fields, confo params или API response fields.
13. Schema не импортирует, не вызывает и не использует React hooks как runtime dependency.
14. Missing/opaque/proposed parts явно отмечены, если разрешены.
15. Conditions/rules декларативные, без arbitrary JS.
16. Normalizers имеют fixtures/tests или явный artifact request.
17. Runtime не зависит от LLM для выбора UI.
18. Schema reviewable: ids stable, names semantic, no duplicated hidden behavior.

Вывод:

Verdict: ready | ready with risks | blocked

Findings:
- <severity>: <path in artifact> -> <problem> -> <fix>

Scenario coverage:
| Scenario | Covered by schema/rules/tests | Gaps |
| --- | --- | --- |

Runtime readiness:
- source inventory:
- data contracts:
- registry:
- store adapter:
- resolver/source adapter:
- action adapter:
- rules:
- normalizers:
- permissions:
- tests:
```
