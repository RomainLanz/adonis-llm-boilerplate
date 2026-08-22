# Application architecture

This boilerplate is a pragmatic modular monolith. It uses business capability slices, separates framework-facing delivery from application code, and separates command models from read models.

## Dependency direction

```text
app/<capability>  ──┐
                    ├──> src/<capability>
inertia/          ──┘
```

- `app/**` owns HTTP and Inertia delivery: routes, controllers, request validators, middleware, policies, response mapping, and transformers.
- `inertia/**` owns pages, layouts, browser state, and page-specific composition.
- `src/**` owns Actions, Queries, domain objects, repositories, jobs, and application services.
- `src/**` never imports from `app/**` or `inertia/**`.
- `app/shared` contains shared delivery concerns. `src/shared` contains application foundations needed by multiple capabilities.
- `providers`, `config`, `start`, `commands`, and `database` retain their AdonisJS roles.

Organize by business capability before technical layer:

```text
app/
  identity/
    controllers/
    transformers/
    routes.ts
src/
  identity/
    actions/
    domain/
    queries/
    repositories/
```

Create only the folders a capability needs. Introduce a shared abstraction once two capabilities need the same concept for the same reason.

## Inertia controllers

Controllers are delivery adapters with at most two public methods. Register the method explicitly in the route:

- `render` composes Queries and renders the Inertia page;
- `execute` validates input, invokes an Action, and maps its outcome to a delivery response.

Use the same controller when a page and its mutation belong to the same use case. For example, `LoginController.render` displays the login form and `LoginController.execute` submits it. A read-only page may expose only `render`; an endpoint without a page may expose only `execute`. Do not introduce other public controller methods. Use `@inject()` and constructor injection for Actions and Queries.

Controller ownership follows the use case, not the URL or the React page. A composite page does not make all of its mutations one use case. For example, a Settings page may have:

```text
GET   /settings          -> SettingsController.render
PATCH /settings/profile  -> UpdateProfileController.execute
PUT   /settings/password -> ChangePasswordController.execute
POST  /settings/members  -> InviteMemberController.execute
```

`SettingsController.render` owns the complete page composition and may compose several Queries. Each independently submitted settings module has a focused controller with only `execute`, delegating its mutation to the owning Action. This keeps unrelated validators, authorization rules, expected outcomes, and redirects out of one broad controller.

Use these rules to choose the shape:

- keep `render` and `execute` together when the rendered page exists primarily for that one command, such as login, registration, or password reset;
- use one page controller with `render` plus separate command controllers with `execute` when a page hosts several independently submitted modules, such as Settings or an administration dashboard;
- use only `render` for a page with no associated command;
- use only `execute` for a command or endpoint with no dedicated page.

A controller may:

- validate transport input with VineJS;
- read session and request context;
- adapt authorization through Bouncer;
- invoke Actions and compose Queries;
- map application outcomes to Inertia responses, redirects, flashes, or HTTP responses.

A controller does not own business calculations or persistence. Private helpers are acceptable when they only support delivery mapping.

## Actions and commands

An Action is the executable command-side use case. Use one whenever a use case changes application state.

- Name it with an imperative business operation such as `RegisterUser`.
- Expose `execute` with an explicit parameter and result type.
- Enforce reusable business invariants in the Action or its domain objects.
- Construct Value Objects from adapter input before persistence. A Value Object owns its validation and canonical representation.
- Load complete entities or aggregates before asking them to make a decision.
- Keep HTTP responses, statuses, redirects, flashes, and translated text out of the Action.
- Let the Action own the transaction when atomicity is required. Controllers never open application transactions.

An Action may call another Action when both are independently valid commands. Use a private method or command-side application service when the shared behavior is only an implementation detail.

```text
controller or adapter -> Action -> repository -> entity or aggregate -> repository
```

The `commands/` directory at the Adonis root is reserved for thin Ace adapters. An Ace command invokes Actions or Queries; it does not become a second home for business commands.

For example, the `create:user` command resolves each missing flag through an interactive question and invokes `RegisterUser`, the same Action used by the registration controller. `RegisterUser` constructs the `EmailAddress` Value Object and enforces the password policy; the command does not duplicate validation, normalize values, hash passwords, or write to Postgres itself.

## Queries and read models

A Query is the public read side. Use a named Query when a read has business intent, joins or aggregates data, is reused, or feeds a non-trivial screen.

- Queries perform reads only and do not open transactions by default.
- Select columns explicitly; avoid `selectAll()` as the default.
- Return projections or read models shaped for the use case.
- Keep filtering, visibility, aggregation, and read-side calculations inside the Query.
- Hydrate a domain entity only when the caller needs its behavior or will continue into a command.

A controller may use Kysely directly for a genuinely trivial delivery lookup. Move the read into a Query as soon as it carries application meaning.

```text
controller or adapter -> Query -> projection or read model
```

## Domain model

Use DDD patterns where they protect meaning and invariants:

- Entities have stable typed identifiers and identity-based equality.
- Value objects represent immutable concepts whose equality is based on value.
- Aggregates protect consistency rules on command paths.
- Repositories load and persist complete aggregates; they do not expose lazy-loaded domain objects.
- Read models remain independent from aggregates and may be optimized for their caller.

This is pragmatic DDD, not ceremony. A simple write without domain behavior may remain in an Action and repository. A simple read may remain a direct Kysely query. Add a module only when its interface hides meaningful complexity.

## Results and exceptions

Expected business outcomes use the local `Result<TValue, TError>` type. Error variants are discriminated unions local to an Action or capability.

```ts
type RegisterUserError = { type: 'email_already_taken' };
```

Expected errors contain stable application facts, not HTTP statuses, form field names, redirects, or translated messages. The controller maps every variant to its delivery behavior.

Throw for unexpected infrastructure failures, invalid persisted data, broken configuration, and impossible states. Code in `src/**` does not throw Adonis or HTTP-aware exceptions.

## Transactions and persistence

Kysely repositories map Postgres rows to command-side domain objects. Queries map rows directly to read models.

- A public Action starts a transaction when its use case needs atomic writes.
- Nested application work reuses the active transaction through `TransactionManager`.
- Database constraints remain the final defense for uniqueness and relational invariants.
- Persistence errors that represent expected business outcomes are translated into typed `Result` errors.
- Unexpected database failures propagate.

## Example paths

Identity demonstrates both sides:

```text
POST /signup
  -> RegisterUserController.execute
  -> RegisterUser.execute
  -> UserRepository.createUser
  -> User

GET /account
  -> AccountController.render
  -> AccountDetailsQuery.execute
  -> AccountDetails projection

Settings demonstrates a composite page:

GET /settings
  -> SettingsController.render
  -> ProfileSettingsQuery.execute + TeamMembersQuery.execute
  -> one Settings page

PATCH /settings/profile
  -> UpdateProfileController.execute
  -> UpdateProfile.execute
```

## Completion checklist

For a mutation:

1. Put the use case in an Action under the owning capability.
2. Define explicit parameters, result types, invariants, and transaction ownership.
3. Keep persistence mapping in a repository and behavior in domain objects where behavior exists.
4. Add an `execute` method to the use-case controller that validates input and maps every expected result. Do not place it on a composite page controller merely because its form appears on that page.
5. Test the Action interface, then add only essential delivery coverage.

For a read:

1. Create a Query when filtering, visibility, aggregation, reuse, or business meaning justifies it.
2. Select explicit columns and return a purpose-built projection.
3. Compose Query results in the page controller's `render` method without recreating calculations. A composite page may compose several Queries.
4. Test the Query result, then the essential page props or response behavior.
