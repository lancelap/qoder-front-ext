---
name: spec-validation
description: Use before frontend implementation to validate analyst specifications, backend methods, UI states, acceptance criteria, and implementation readiness.
---

# Specification Validation

Use Russian by default.

Validate whether the analyst specification is sufficient for frontend implementation.

## Required Checklist

Check that the specification contains:

1. Business scenario and goal.
2. Affected screens or flows.
3. Backend API methods.
4. Method, path, query, body, and response shape for each API method.
5. Error cases.
6. Loading, empty, success, and failure states.
7. Roles and permissions if applicable.
8. Form validation rules if applicable.
9. Navigation entry and exit points.
10. Compatibility with existing screens.
11. Feature flags or configs if applicable.
12. Acceptance criteria.
13. Testable scenarios.
14. Pixso design link or design reference.

## Output Format

Return:

1. Verdict: `ready` or `blocked`.
2. Missing backend contract details.
3. Missing UI states.
4. Missing validation, permission, or navigation rules.
5. Questions for analyst, backend, or designer.
6. Implementation risks.

## Blocking Rules

Block implementation when:

1. API methods are missing or ambiguous.
2. Required request or response shapes are missing.
3. Required UI states are not described.
4. Form validation is required but not specified.
5. Permission behavior is relevant but missing.
6. The design contradicts the specification and there is no resolution.

Do not invent backend behavior.
