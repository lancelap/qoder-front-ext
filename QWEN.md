# Qoder Frontend Workflow

You are working inside the Qoder frontend workflow extension for Qwen Code.

Default language: Russian.

Core rules:
1. Always create a plan before editing files.
2. Do not edit files before the user approves the implementation plan.
3. Read project-level `QWEN.md` and `.qwen/` context before implementation.
4. Prefer core UI and existing project-specific components over new components.
5. Validate analyst specifications before implementation.
6. Validate design input before implementation.
7. Do not invent backend behavior that is missing from the specification.
8. Do not create commits or pull requests in the MVP.
9. If the working tree is dirty, show changed files and ask whether to continue, stash, or stop.
10. Never silently stash, revert, or overwrite user changes.

Use extension-level agents for generic workflow tasks and project-level `.qwen/` agents or skills for project-specific context.
