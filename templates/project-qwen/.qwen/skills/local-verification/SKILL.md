---
name: local-verification
description: Use before claiming frontend work is complete. Defines project-specific verification commands.
---

# Local Verification

Use Russian by default.

Replace commands with the real project commands.

## Required Checks

Run tests as the minimum verification:

```bash
pnpm test
```

If available and reasonably fast, run:

```bash
pnpm typecheck
pnpm lint
```

## Build Check

Run build when routing, public exports, build-time configuration, generated types, or bundling behavior changed:

```bash
pnpm build
```

## Visual Check

If layout, responsive behavior, or UI states changed:

1. Start the local dev server using the project command.
2. Open affected pages.
3. Check desktop width.
4. Check narrow/mobile width if the project supports responsive layouts.
5. Check loading, empty, error, disabled, and success states when possible.

If visual verification was not performed, state that explicitly in the final response.

## Expensive Checks

Do not run full e2e, visual regression suites, or long-running checks unless the user explicitly approves them.
