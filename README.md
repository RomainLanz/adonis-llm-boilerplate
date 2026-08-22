# AdonisJS agent-first boilerplate

An opinionated full-stack foundation for building AdonisJS applications with humans and coding agents.

This repository is meant to be used as both a starter and an architectural reference. It gives an agent enough project-specific guidance, examples, and boundaries to add features without inventing a new structure on every task. The defaults come from production patterns used in Tenkai and Boring Money: a thin Adonis BFF, a capability-oriented application core, explicit command and read models, and a reusable design system.

## What is included

- AdonisJS 7 as the HTTP server and Backend for Frontend;
- Inertia 3 and React 19 for server-driven pages;
- Postgres 18, Kysely, and generated database types instead of Lucid;
- pragmatic DDD building blocks for entities, identifiers, value objects, and repositories;
- Actions for command-side use cases and Queries for read-side projections;
- typed `Result` values for expected business outcomes;
- Yarn 4 workspaces and a shared dependency catalog;
- a design-system workspace using Tailwind CSS 4, Tailwind Variants, Ark UI, and Storybook;
- Oxlint and Oxfmt as the only linting and formatting tools;
- Docker Compose for the local Postgres service;
- architecture documentation and `AGENTS.md` instructions designed to guide coding agents.

## Repository structure

```text
.
├── apps/
│   └── web/
│       ├── app/             Adonis delivery layer and Inertia BFF
│       ├── src/             application and business capabilities
│       ├── inertia/         React pages, layouts, and browser concerns
│       ├── database/        Postgres migrations
│       ├── config/          Adonis configuration
│       ├── providers/       framework-to-application bindings
│       ├── start/           routes and application bootstrapping
│       └── tests/           web application tests
├── packages/
│   └── design-system/       shared UI primitives, styles, and stories
├── docs/
│   ├── architecture/        application architecture rules
│   ├── agents/              task-specific guidance for coding agents
│   └── adr/                 architectural decision records
├── compose.yml              local Postgres service
├── oxfmt.config.ts          repository-wide formatting rules
├── oxlint.config.ts         repository-wide linting rules
└── AGENTS.md                entry point for coding agents
```

### `apps/web/app`: delivery and BFF

`app` contains framework-facing code: controllers, middleware, validators, policies, transformers, and capability routes. It composes Actions and Queries into HTTP or Inertia responses. It may depend on `src`, but it must not contain business rules or persistence logic.

Inertia controllers expose at most two public methods:

- `render` composes read data and renders a page;
- `execute` validates transport input, runs an Action, and maps its outcome.

When a form and its submission represent the same use case, both methods belong to the same controller. A read-only page can expose only `render`, and an endpoint without a page can expose only `execute`.

```text
GET  /login -> LoginController.render  -> Inertia login page
POST /login -> LoginController.execute -> VerifyUserCredentials Action
```

Controllers are grouped by use case, not merely by page. A composite Settings page has one controller responsible for `render`, while each independently submitted module uses its own focused `execute` controller:

```text
GET   /settings          -> SettingsController.render
PATCH /settings/profile  -> UpdateProfileController.execute
PUT   /settings/password -> ChangePasswordController.execute
```

This prevents one page controller from accumulating unrelated validation, authorization, and mutation flows.

### `apps/web/src`: application core

`src` is organized by business capability. It owns Actions, Queries, domain objects, repositories, jobs, and application services. It may use AdonisJS when useful, but it never imports from `app` or `inertia`.

Command paths load domain objects when behavior or invariants justify them. Read paths return purpose-built projections without forcing them through command-side entities. Kysely access and row mapping stay behind repositories or explicit Queries.

```text
app/<capability>  ──┐
                    ├──> src/<capability>
inertia/          ──┘
```

### `packages/design-system`: reusable UI

The design system owns shared visual primitives and their variants. Components are built with Ark UI, styled with Tailwind CSS and Tailwind Variants, and documented in Storybook. Inertia pages consume the package rather than maintaining private copies of reusable UI.

## Getting started

### Requirements

- Node.js 24 or newer;
- Corepack with Yarn 4;
- Docker with Docker Compose.

### Installation

```bash
corepack enable
yarn install
cp apps/web/.env.example apps/web/.env
yarn workspace @boilerplate/web exec node ace generate:key
yarn docker:up
yarn workspace @boilerplate/web db:migrate
yarn dev
```

The web application is available at [http://localhost:3333](http://localhost:3333). Start Storybook separately with `yarn storybook`; it is served at [http://localhost:6006](http://localhost:6006).

Stop the database with:

```bash
yarn docker:down
```

## Common commands

| Command            | Purpose                                     |
| ------------------ | ------------------------------------------- |
| `yarn dev`         | Start AdonisJS with HMR                     |
| `yarn build`       | Build every workspace                       |
| `yarn storybook`   | Run the design-system workshop              |
| `yarn test`        | Run the web test suite                      |
| `yarn typecheck`   | Type-check every workspace                  |
| `yarn lint`        | Check the repository with Oxlint            |
| `yarn lint:fix`    | Apply safe Oxlint fixes                     |
| `yarn format`      | Check formatting with Oxfmt                 |
| `yarn format:fix`  | Format the repository with Oxfmt            |
| `yarn docker:up`   | Start local infrastructure                  |
| `yarn docker:down` | Stop local infrastructure                   |
| `yarn taze`        | Review dependency updates across workspaces |

Create a user interactively with the `create:user` Ace command:

```bash
yarn workspace @boilerplate/web exec node ace create:user
```

For provisioning and local automation, pass any available values as flags. The command asks only for values that were omitted:

```bash
yarn workspace @boilerplate/web exec node ace create:user \
	--name='Ada Lovelace' \
	--email='ada@example.com' \
	--password='a-secure-password'
```

The command is a thin adapter over the same `RegisterUser` Action used by the HTTP registration flow. `RegisterUser` constructs the `EmailAddress` Value Object and owns input normalization, password policy, password hashing, transactions, and duplicate-email handling.

After changing migrations, regenerate the Kysely database types while Postgres is running:

```bash
yarn workspace @boilerplate/web db:codegen
```

Do not edit `apps/web/types/db.ts` or `apps/web/.adonisjs/` manually; both are generated artifacts.

Reset the local database by dropping every table in the `public` schema and rerunning all migrations:

```bash
yarn workspace @boilerplate/web db:fresh
```

This command is destructive. It refuses to run in production unless `--force` is passed explicitly.

## Adding a capability

Use a vertical slice and create only the folders the capability needs:

```text
apps/web/
├── app/billing/
│   ├── controllers/
│   ├── transformers/
│   └── routes.ts
└── src/billing/
    ├── actions/
    ├── domain/
    ├── queries/
    └── repositories/
```

For a mutation, define the Action contract and its expected outcomes, put persistence mapping in a repository, then adapt it in a controller's `execute` method. For a non-trivial read, define an explicit Query and compose its projection in `render`. Database constraints remain the final defense for persistent invariants.

Before opening a pull request, run:

```bash
yarn lint
yarn format
yarn typecheck
yarn test
```

## Documentation

- [Domain glossary](CONTEXT.md): canonical language used by the example capabilities.
- [Agent instructions](AGENTS.md): repository-wide rules and verification commands.
- [Application architecture](docs/architecture/application.md): dependency direction, controllers, Actions, Queries, domain modeling, Results, and transactions.
- [Design-system guide](docs/agents/design-system.md): component ownership, variants, accessibility, and Storybook expectations.
- [ADR 0001](docs/adr/0001-monorepo-with-adonis-bff-and-modular-core.md): monorepo, Adonis BFF, and modular core.
- [ADR 0002](docs/adr/0002-use-postgres-through-kysely.md): Postgres and Kysely persistence.
- [ADR 0003](docs/adr/0003-use-command-models-and-read-model-projections.md): command models and read projections.
- [ADR 0004](docs/adr/0004-use-result-for-expected-business-outcomes.md): typed Results for expected failures.

## License

This project is available under the [MIT License](LICENSE).
