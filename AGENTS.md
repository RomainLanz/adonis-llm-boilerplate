<critical>
- Use Yarn workspaces and keep `yarn.lock` synchronized with dependency changes.
- Use Oxlint and Oxfmt as the only linting and formatting tools; their root config files own code style.
- Treat `apps/web/.adonisjs/` and `apps/web/types/db.ts` as generated code. Regenerate them through Adonis or `yarn workspace @boilerplate/web db:codegen`.
- Keep delivery dependencies pointing from `apps/web/app` to `apps/web/src`; application modules never import from `app`.
</critical>

## Architecture

Architecture: read [the application architecture](docs/architecture/application.md) before adding or refactoring controllers, Actions, Queries, repositories, domain objects, jobs, or capability boundaries.

Domain language: read [the glossary](CONTEXT.md) before naming or changing domain concepts.

Use Kysely with Postgres for persistence. Keep database invariants in migrations and persistence mapping inside repositories. Prefer explicit read models for non-trivial reads and domain objects for command paths that enforce business rules.

## Design system

Read [the design system guide](docs/agents/design-system.md) before changing `packages/design-system` or extracting UI from an Inertia page.

## Verification

Run `yarn lint`, `yarn format`, `yarn typecheck`, and `yarn test` before committing. Use Conventional Commits.
