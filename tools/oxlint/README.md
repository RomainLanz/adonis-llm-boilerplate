# Custom OXLint rules

All custom rules are enabled as errors in `oxlint.config.ts`.

- `project-style` requires a blank line after imports and ECMAScript private
  members, except private constructors and readonly constructor parameter
  properties. Private constructors enforce factory-only construction;
  JavaScript has no `#constructor`. Mutable private parameter properties
  are still rejected.
- `anti-slop` contains 15 contract rules and `statement-padding`, imported from
  Tenkai. The original source is FIVB/app.fivb.com, branch `feat/support-v1`,
  commit `30e3a9e5b63ceb626a6407ed72b73a95e17b8a8b`.
- `tenkai` retains its upstream namespace and adds three readability rules.

`statement-padding` replaces `project-style/blank-line-before-if`. It separates
control-flow statements from their siblings and keeps leading comments attached.
It does not separate every statement.

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

The readability rules have no automatic fix. Extraction must preserve evaluation
order, short-circuiting, and loop re-evaluation, including `continue` paths.

The vendored `anti-slop` plugin is excluded from linting to preserve upstream
behavior. Generated Adonis files and database types are also excluded.
Handwritten code and tests are not excluded. Genuine boundary exceptions need a
local, explained disable. Type assertions need a nearby `SAFETY:` comment naming
the checked invariant.

Run `yarn test:lint` for positive and negative fixtures for all imported rules,
including statement-padding fixes and TypeScript signatures.
