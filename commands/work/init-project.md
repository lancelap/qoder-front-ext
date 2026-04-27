---
description: Initialize project-level Qwen context (QWEN.md + .qwen/) for this frontend repo using safe, non-destructive defaults.
---

Initialize Qwen project context in the current repository.

Input (optional):

{{args}}

Use Russian.
Use the `init-project` skill.

Hard rules:
1. Do not overwrite existing `QWEN.md` or `.qwen/` files without explicit approval.
2. If files already exist, propose a minimal diff instead of reinitializing.
3. After initialization, print a short checklist of what the developer must customize (component inventory, verification commands, architecture facts).

Output:
1. Files created and why.
2. Files skipped and why.
3. Next steps for the developer to fill in.
