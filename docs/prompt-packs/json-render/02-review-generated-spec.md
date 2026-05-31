# Review Generated json-render Spec

Use this prompt after `screen.render.json` is generated.

```text
Ты ревьюишь screen.render.json перед runtime render.

Вход:
- Analyst spec: <path-or-pasted-spec>
- Component catalog: <path-or-pasted-catalog>
- Source adapters/resolvers: <path-or-pasted-source-adapters|none>
- Registry contract: <path-or-pasted-registry-contract>
- Generated screen.render.json: <path-or-pasted-json>

Проверь:
1. JSON валиден.
2. schemaVersion корректный.
3. Все component types есть в registry.
4. Все props разрешены props schema.
5. Все dataSources имеют API contracts или resolver contracts.
6. Все actions имеют handler contract.
7. Given/When/Then scenarios покрыты tree/actions/states.
8. Нет invented fields/states/actions/components.
9. XML/GraphQL/source-specific mappings не протекают в UI components напрямую.
10. Missing/opaque/proposed parts явно отмечены, если разрешены.
11. JSON reviewable: ids stable, names semantic, no duplicated hidden behavior.

Вывод:

Verdict: ready | ready with risks | blocked

Findings:
- <severity>: <path in JSON> -> <problem> -> <fix>

Scenario coverage:
| Scenario | Covered by JSON | Gaps |
| --- | --- | --- |

Runtime readiness:
- registry:
- data adapter:
- resolver/source adapter:
- action adapter:
- permissions:
- tests:
```
