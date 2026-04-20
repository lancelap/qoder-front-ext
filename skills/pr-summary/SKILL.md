---
name: pr-summary
description: Use after frontend implementation and verification to produce a concise PR-ready summary without creating commits or pull requests.
---

# PR Summary

Use Russian by default.

Do not create commits or pull requests.

## Required Output

Return:

1. Summary of the change.
2. Files changed.
3. Specification and design coverage.
4. Existing components reused.
5. Tests and checks run.
6. Review findings fixed.
7. Docs updated or skipped.
8. Residual risks.
9. Suggested PR description.

## Suggested Format

```md
## Что изменено
- ...

## Проверки
- ...

## Переиспользование компонентов
- ...

## Документация
- ...

## Риски
- ...

## PR description
...
```

If verification or visual checks were not performed, state that explicitly.
