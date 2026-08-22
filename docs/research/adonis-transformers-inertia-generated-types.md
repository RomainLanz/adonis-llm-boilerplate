# AdonisJS transformers and Inertia generated types

Date: 2026-08-22

## Scope

This note records the implementation requirements from the official AdonisJS documentation for HTTP transformers and Inertia generated types, then compares them with this repository. The repository had no existing research-note convention, so this note lives under `docs/research/`.

Primary sources:

- [AdonisJS — Transformers](https://docs.adonisjs.com/guides/frontend/transformers)
- [AdonisJS — Inertia: Generated types](https://docs.adonisjs.com/guides/frontend/inertia#generated-types)

## Implementation requirements

1. Treat transformers as the HTTP output contract. A transformer must extend `BaseTransformer<Resource>` and expose its default serialized shape from `toObject()`. Explicit selection with `pick()` prevents accidental exposure of fields and lets the inferred frontend type follow the actual wire shape, including conversion of rich values such as `Date`/`DateTime` to JSON-compatible values. Transformers are for response serialization, not request validation. [Source](https://docs.adonisjs.com/guides/frontend/transformers#creating-your-first-transformer) · [Distinction from DTOs](https://docs.adonisjs.com/guides/frontend/transformers#important-distinctions)

2. Pass transformer resources directly to `inertia.render()`. The Inertia adapter resolves `ResourceItem` and `ResourceCollection`; controllers do not call the HTTP `serialize()` helper for an Inertia page. [Source](https://docs.adonisjs.com/guides/frontend/transformers#using-transformers-with-inertia)

3. Enable both entity and page indexing in `adonisrc.ts`. The documented setup is `indexEntities({ transformers: { enabled: true, withSharedProps: true } })`, `indexPages({ framework: 'react' })`, and `generateRegistry()` for typed routes/forms. When files use non-default locations, `source`, glob, import alias, and middleware import path must point at the real files. [Source](https://docs.adonisjs.com/guides/frontend/inertia#generated-types)

4. Consume the generated transformer namespace on the frontend rather than copying object shapes. The generated file exposes `Data.<Transformer>` through `InferData`, and variant output through `Data.<Transformer>.Variants['variantName']`. In an Inertia React page, compose page-specific props with the shared-props helper (the documentation uses `InertiaProps<{ ... }>`). [Transformer type generation](https://docs.adonisjs.com/guides/frontend/transformers#understanding-the-generated-types) · [Variant types](https://docs.adonisjs.com/guides/frontend/transformers#variant-types-in-the-frontend) · [Shared data](https://docs.adonisjs.com/guides/frontend/inertia#accessing-shared-data)

5. Bridge shared props on both sides. The middleware augments `@adonisjs/inertia/types` with `InferSharedProps<InertiaMiddleware>`, while client code augments `@inertiajs/core` with `sharedPageProps: Data.SharedProps`. This makes `usePage().props`, layouts, and page props agree with the middleware's transformed output. [Source](https://docs.adonisjs.com/guides/frontend/inertia#typing-shared-data)

6. For relationships, compose transformers and eager-load the underlying relationship first. Transformers do not perform database queries; optional relationships must be guarded, for example with `whenLoaded()`. [Source](https://docs.adonisjs.com/guides/frontend/transformers#working-with-relationships)

7. Collections and paginators have distinct shapes. Use `Transformer.transform(collection)` for collections and `Transformer.paginate(rows, metadata)` for paginated data; frontend props must model the resulting `data` and `metadata` shape where pagination is used. [Collections](https://docs.adonisjs.com/guides/frontend/transformers#resource-items-and-collections) · [Pagination](https://docs.adonisjs.com/guides/frontend/transformers#paginating-data)

## Repository assessment

### Already correct

- [`apps/web/adonisrc.ts`](../../apps/web/adonisrc.ts) enables transformer indexing with shared props, scans both transformer locations under `app`, points at the Inertia middleware, and indexes React pages.
- [`apps/web/app/identity/controllers/account_controller.ts`](../../apps/web/app/identity/controllers/account_controller.ts) passes `AccountDetailsTransformer.transform(account)` directly to `inertia.render()`, matching the documented Inertia integration.
- [`apps/web/app/middleware/inertia_middleware.ts`](../../apps/web/app/middleware/inertia_middleware.ts) transforms the shared authenticated user and declares the server-side shared-props augmentation.
- [`apps/web/inertia/types.ts`](../../apps/web/inertia/types.ts) consumes `Data.SharedProps`, augments `@inertiajs/core`, and exposes an `InertiaProps` helper. The generated [`apps/web/.adonisjs/client/data.d.ts`](../../apps/web/.adonisjs/client/data.d.ts) already contains `Data.Identity.AccountDetails`, `Data.User`, `Data.SharedProps`, and `Data.FlashMessages`.
- [`apps/web/inertia/layouts/default.tsx`](../../apps/web/inertia/layouts/default.tsx) already consumes the generated `Data.SharedProps`; `home`, authentication, and error pages currently have no page-specific backend resource payload to replace with a transformer type.

### Concrete gap addressed

The audit found that [`apps/web/inertia/pages/account/show.tsx`](../../apps/web/inertia/pages/account/show.tsx) manually duplicated the transformed account shape. It now consumes the generated contract:

```ts
type PageProps = InertiaProps<{
	account: Data.Identity.AccountDetails;
}>;
```

This makes `AccountDetailsTransformer` the single source of truth, preserves the generated conversion of backend `Date` values to frontend strings, and includes shared props through the repository's `InertiaProps` helper.

### Generated registry corrected

The audit found that `adonisrc.ts` did not register the documented `generateRegistry()` hook. As a result, the checked registry under [`apps/web/.adonisjs/client/registry/`](../../apps/web/.adonisjs/client/registry/) omitted the `account.show` route and referenced controllers from an earlier application shape. The hook has now been added and the registry regenerated through the Adonis development server; it contains `account.show` and the current capability controller import paths. This route/form registry is separate from transformer payload typing, but belongs to the same documented generated-types pipeline. [Source](https://docs.adonisjs.com/guides/frontend/inertia#generated-types)

## Pitfalls to avoid

- Do not import backend resource/domain types directly into the client as a substitute for `Data.*`; backend dates, classes, branded values, and transformer omissions do not necessarily match their JSON representation.
- Do not edit `.adonisjs/client/data.d.ts`, `.adonisjs/server/pages.d.ts`, or registry files manually. They are generated artifacts and should be refreshed through the Adonis generation hooks/dev server.
- Do not spread raw domain objects or query rows into Inertia props when a transformer defines the boundary; doing so bypasses field filtering and breaks the generated contract.
- Do not annotate a page with a generated transformer variant unless the controller also calls `.useVariant()` with the corresponding name.
- Do not confuse a transformed collection with paginated output: pagination adds a wrapper containing `data` and `metadata`.

## Recommended verification

After changing page props, transformers, controllers, or routes:

1. Regenerate Adonis artifacts through the normal Adonis command/dev-server lifecycle.
2. Confirm `Data.Identity.AccountDetails` and the `account.show` route appear in generated output.
3. Run the repository-required `yarn lint`, `yarn format`, `yarn typecheck`, and `yarn test`.
4. As a drift test, temporarily change a transformer field locally and confirm TypeScript flags stale frontend usage; then revert that temporary test.
