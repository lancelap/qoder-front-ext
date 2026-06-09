# Review Generated A2UI / json-render Artifacts

Use this prompt after A2UI/json-render schema or related LLM artifacts are generated.

```text
Ты ревьюишь A2UI/json-render schema, rules, normalizers и test artifacts перед runtime render.

Вход:
- Analyst spec: <path-or-pasted-spec>
- Component catalog: <path-or-pasted-catalog>
- Source adapters/resolvers: <path-or-pasted-source-adapters|none>
- Registry contract: <path-or-pasted-registry-contract>
- Action registry: <path-or-pasted-action-registry|none>
- Data contracts: <path-or-pasted-data-contracts|none>
- Rules: <path-or-pasted-rules|none>
- Normalizers: <path-or-pasted-normalizers|none>
- Fixtures/tests: <path-or-pasted-tests|none>
- Generated A2UI schema: <path-or-pasted-schema>

Проверь:
1. JSON валиден.
2. schemaVersion корректный.
3. Все component types есть в registry.
4. Все props разрешены props schema.
5. Все store bindings, resolver references и async actions имеют state/API/resolver contracts.
6. Все actions имеют handler contract.
7. Given/When/Then scenarios покрыты tree/actions/states.
8. Нет invented fields/states/actions/components.
9. XML/GraphQL/source-specific mappings не протекают в UI components напрямую.
10. Missing/opaque/proposed parts явно отмечены, если разрешены.
11. Conditions/rules декларативные, без arbitrary JS.
12. Normalizers имеют fixtures/tests или явный artifact request.
13. Runtime не зависит от LLM для выбора UI.
14. Schema reviewable: ids stable, names semantic, no duplicated hidden behavior.

Вывод:

Verdict: ready | ready with risks | blocked

Findings:
- <severity>: <path in artifact> -> <problem> -> <fix>

Scenario coverage:
| Scenario | Covered by schema/rules/tests | Gaps |
| --- | --- | --- |

Runtime readiness:
- registry:
- store adapter:
- resolver/source adapter:
- action adapter:
- rules:
- normalizers:
- permissions:
- tests:
```
