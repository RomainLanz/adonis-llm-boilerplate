# Custom OXLint rules

All custom rules come from Tenkai and live under the `tenkai/` namespace. They
are enabled as errors in `oxlint.config.ts`. The source is FIVB/app.fivb.com,
branch `main`, commit `cdb2a0ba`, where they are split across the `anti-slop`,
`project-style` and `tenkai` plugins. This repository exposes them through one
plugin, `tools/oxlint/tenkai/index.ts`.

- 15 contract rules reject low-evidence patterns such as `unknown` parameters,
  widened values, unsafe dictionaries, module mocking and unexplained type
  assertions.
- `tenkai/no-typescript-private` requires ECMAScript private members, except
  private constructors and readonly constructor parameter properties. Private
  constructors enforce factory-only construction; JavaScript has no
  `#constructor`. Mutable private parameter properties are still rejected.
- `tenkai/statement-padding`, `tenkai/max-params`,
  `tenkai/no-await-in-call-arguments` and `tenkai/no-await-in-conditions` are
  readability rules.

Tenkai's opt-in Effect rules are not imported because this repository does not
use Effect.

Oxlint's native `import/newline-after-import` rule requires a blank line after
imports and provides automatic fixes.

`tenkai/statement-padding` separates control-flow statements from their siblings
and keeps leading comments attached. It does not separate every statement.

`tenkai/max-params` limits functions and methods to four parameters. A named
argument object counts as one parameter. Optional, default, and rest parameters
each count as one; TypeScript's explicit `this` parameter does not count.
Constructors on classes decorated with `@inject()` are exempt because Adonis DI
needs positional dependencies. Other methods on those classes are still checked.

`tenkai/no-await-in-call-arguments` requires named results before passing them
into calls or constructors. Non-computed object property values may await inline
because the property names the result. Nested calls are still checked.

`tenkai/no-await-in-conditions` requires named results before testing them in
`if`, `while`, `do...while`, `for`, and ternary conditions. Awaiting in branches,
loop bodies, and async callbacks remains allowed.

The readability rules other than `statement-padding` have no automatic fix.
Extraction must preserve evaluation order, short-circuiting, and loop
re-evaluation, including `continue` paths.

The vendored `rules/` and `shared/` directories are excluded from linting to
preserve upstream behavior; keep them identical to Tenkai when syncing.
Generated Adonis files and database types are also excluded. Handwritten code
and tests are not excluded. Genuine boundary exceptions need a local, explained
disable. Type assertions need a nearby `SAFETY:` comment naming the checked
invariant.

Run `yarn test:lint` for positive and negative fixtures for all imported rules,
including statement-padding fixes and TypeScript signatures.
