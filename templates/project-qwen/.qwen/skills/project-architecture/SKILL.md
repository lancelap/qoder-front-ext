---
name: project-architecture
description: Use before frontend implementation to understand this project's stack, folders, routing, API client, state management, and testing conventions.
---

# Project Architecture

Use Russian by default.

Replace the examples in this template with project-specific facts.

## Stack

- Framework: describe the frontend framework and version.
- Package manager: describe the package manager and lockfile.
- UI library: describe the core UI library import path.
- State management: describe the state management approach.
- Data fetching: describe the API/data fetching approach.
- Tests: describe unit, component, integration, and e2e tools.

## Folders

Document the main folders and their responsibilities:

- `src/pages`: route-level pages.
- `src/features`: feature modules.
- `src/shared`: shared project utilities and components.
- `src/entities`: domain entities if the project uses this layer.
- `src/app`: app bootstrap, providers, routing, and global setup.

Adjust this list to match the real project.

## Routing

Describe:

1. Where routes are declared.
2. How protected routes work.
3. How route params are parsed.
4. How navigation should be performed.

## API Client

Describe:

1. Where API clients live.
2. How request and response types are defined.
3. How errors are represented.
4. How auth and headers are handled.
5. Whether generated clients are used.

## State Management

Describe:

1. Where local state is acceptable.
2. Where shared state is stored.
3. How server state is cached.
4. Which patterns should not be introduced.

## Testing Conventions

Describe:

1. Where tests live.
2. How test files are named.
3. What to test for pages, components, forms, and API integration.
4. Which test helpers should be reused.

## Architecture Rules

Add project-specific rules here:

1. Do not bypass the standard API client.
2. Do not duplicate core UI components.
3. Do not introduce new global state without explicit justification.
4. Keep page-local components near the page unless they are reused.
