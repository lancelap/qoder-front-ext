# Generate json-render Spec

Use this prompt to generate `screen.render.json` from validated inputs.

```text
Ты генерируешь screen.render.json для @json-render/react.

Вход:
- Analyst spec: <path-or-pasted-spec>
- Design reference: <pixso-link|screenshot|designer-notes|none>
- Component catalog: <path-or-pasted-catalog>
- Registry contract: <path-or-pasted-registry-contract>
- Catalog coverage review: <path-or-pasted-review>

Output file:
- screen.render.json

Требования:
1. Используй только component types из catalog/registry.
2. Каждый component должен иметь stable id.
3. Props должны соответствовать props schema компонента.
4. Data bindings должны ссылаться только на data sources из spec.
5. Actions должны ссылаться только на action ids из spec/catalog.
6. Permissions/read-only/visibility должны соответствовать spec.
7. States должны быть только из spec или из documented catalog behavior.
8. Для proposed components используй только если coverage review явно разрешает.
9. Не добавляй произвольный HTML, JS, inline functions, CSS hacks.

Output format:
- Только валидный JSON.
- Без markdown fences.
- Top-level shape:
  {
    "schemaVersion": "qoder-json-render-screen/v1",
    "screen": { ... },
    "dataSources": { ... },
    "actions": { ... },
    "tree": { ... },
    "metadata": { ... }
  }

Если generation blocked:
- Не генерируй частичный JSON.
- Верни BLOCKED и список точных missing inputs.
```
