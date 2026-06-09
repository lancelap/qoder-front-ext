# Generate A2UI / json-render Spec

Use this prompt to generate a deterministic A2UI/json-render screen schema from validated inputs.

```text
Ты генерируешь A2UI/json-render screen schema как строгий контракт для runtime и developer review.

Вход:
- Analyst spec: <path-or-pasted-spec>
- Design reference: <pixso-link|screenshot|designer-notes|none>
- Component catalog: <path-or-pasted-catalog>
- Source adapters/resolvers: <path-or-pasted-source-adapters|none>
- Registry contract: <path-or-pasted-registry-contract>
- Action registry: <path-or-pasted-action-registry>
- Data contracts: <path-or-pasted-data-contracts|none>
- Rules format: <path-or-pasted-rules-format|none>
- Catalog coverage review: <path-or-pasted-review>

Output file:
- <screen-name>.schema.ts или screen.render.json согласно проектному стандарту

Требования:
1. Используй только component types из catalog/registry.
2. Каждый component должен иметь stable id.
3. Props должны соответствовать props schema компонента.
4. Data bindings должны ссылаться только на documented store state paths, resolver outputs или component prop contracts из spec/source adapters.
5. Actions должны ссылаться только на action ids из spec/catalog.
6. Permissions/read-only/visibility должны соответствовать spec.
7. States должны быть только из spec или из documented catalog behavior.
8. Для proposed components используй только если coverage review явно разрешает.
9. Не добавляй произвольный HTML, JS, inline functions, CSS hacks.
10. Не прокидывай raw XML/GraphQL/source-specific payload fields напрямую в UI components, если они не являются явно documented app-level contract.
11. Если один UI parameter может прийти из разных sources, используй resolverId и normalized output contract.
12. Не генерируй React components.
13. Не генерируй runtime LLM calls.
14. Conditions/rules должны быть декларативными объектами, не строками JS.
15. Если нужны normalizer, fixture или tests, верни их как separate artifact requests, а не встраивай business logic в schema.

Output format:
- Только валидный JSON или TypeScript object, если это явно задано output file.
- Без markdown fences.
- Top-level shape:
  {
    "schemaVersion": "qoder-json-render-screen/v1",
    "screen": { ... },
    "inputs": { ... },
    "data": { ... },
    "resolvers": { ... },
    "actions": { ... },
    "rules": { ... },
    "tree": { ... },
    "metadata": { ... }
  }

Если generation blocked:
- Не генерируй частичный JSON.
- Верни BLOCKED и список точных missing inputs.
```
