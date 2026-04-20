---
description: Validate an analyst specification before frontend implementation.
---

Validate the analyst specification for frontend implementation.

Input:

{{args}}

Use Russian.
Use the `spec-validation` skill.

Return:
1. Verdict: ready or blocked.
2. Missing backend contract details.
3. Missing UI states.
4. Missing validation, permission, or navigation rules.
5. Questions for analyst, backend, or designer.
6. Implementation risks.

Do not propose implementation until the spec is ready or the user explicitly accepts the risks.
