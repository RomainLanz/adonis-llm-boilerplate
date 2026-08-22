# Separate the Adonis BFF from the modular application core

This boilerplate uses a Yarn workspaces monorepo with the Adonis application in `apps/web` and reusable UI in `packages/design-system`. Inside the web application, `app` owns Adonis-facing delivery code and Inertia page composition, while `src` owns business capabilities, actions, queries, domain objects, and repositories; `src` never imports from `app`. This keeps controllers thin without preventing business modules from using framework facilities when they add value.
