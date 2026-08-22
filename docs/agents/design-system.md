# Design system agent guide

Read this guide before changing `packages/design-system` or extracting reusable UI from an Inertia page. It adapts Brad Frost's Atomic Design model to this repository's React, Ark UI, Tailwind CSS, Tailwind Variants, and Storybook stack.

## Purpose

The design system is a living product, not a folder of convenient components. It gives applications a shared visual language, accessible behavior, stable composition interfaces, and one place to verify reusable patterns.

Atomic Design is the classification model:

- atoms, molecules, and organisms describe reusable interface patterns at increasing composition levels;
- templates describe content structure without route-specific data;
- pages apply real content and expose pressure cases in the system;
- Storybook is the living pattern library where public patterns are named, documented, and tested;
- interface inventories reveal duplicate patterns, naming drift, and missing shared components before extraction.

Classification describes responsibility and composition, not visual size or line count. Choose the smallest level that preserves the pattern's meaning.

## Repository shape

```text
packages/design-system/
├── src/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── css/
├── .storybook/
└── package.json

apps/web/inertia/
├── layouts/
└── pages/
```

Create `molecules` and `organisms` only when the first real pattern needs them. Keep templates, route layouts, and pages in the Inertia application by default.

Dependencies flow toward the smallest reusable patterns:

```text
Inertia pages and layouts -> organisms -> molecules -> atoms
```

- atoms never import molecules or organisms;
- molecules may compose atoms but never organisms;
- organisms may compose atoms, molecules, and private children from their own folder;
- design-system modules never import from `apps/web`;
- Inertia pages consume public package exports and never import `packages/design-system/src` internals.

## Classification rules

### Atoms

Atoms are foundational UI primitives that cannot be divided further without losing their interface purpose.

Good atom signals:

- standardizes a native or Ark UI primitive such as a button, input, checkbox, icon, badge, or text treatment;
- establishes tokens, focus behavior, sizes, states, or variants used throughout the product;
- has broad applicability and no knowledge of an application workflow;
- receives content and state through props or composition;
- remains useful without a page-specific data shape.

An atom may have a rich implementation. Accessibility behavior, keyboard interaction, and several Ark UI parts do not automatically make it a molecule. Classification follows the public responsibility exposed to consumers.

When a primitive begins coordinating several independently meaningful atoms for one small task, classify that composition as a molecule.

### Molecules

Molecules are small, portable groups of atoms that work together as one pattern.

Good molecule signals:

- performs one focused interface task such as a field, search input, pagination control, alert, card, or dialog;
- makes atoms useful in context while remaining reusable across several screens;
- owns local interaction and presentation state, not application data loading;
- exposes events, content slots, or controlled state instead of invoking application Actions;
- does not own a complete page section.

When a molecule needs several named regions, repeated child patterns, or section-level layout, classify it as an organism.

### Organisms

Organisms are distinct, reusable interface sections.

Good organism signals:

- represents a recognizable section such as a top bar, navigation rail, onboarding form, settings section, or table toolbar;
- composes atoms and molecules into a larger pattern;
- may repeat molecule instances and coordinate their presentation state;
- defines section-level layout and interaction while remaining independent from a route;
- accepts application data and callbacks through an explicit interface instead of fetching them directly.

An organism may contain private child modules inside its folder. Export the organism as the public pattern and keep implementation-specific children private.

## Templates and pages

Use Atomic Design's templates and pages as thinking and verification tools, not design-system folders by default.

- A template is a structural skeleton that shows layout constraints and relationships between patterns.
- A page is a concrete route instance using real data or representative content.

In this monorepo, templates map to reusable Inertia layouts or page-local composition. Pages live in `apps/web/inertia/pages` and receive their data from the Adonis BFF.

Use pages to pressure-test the design system with long headings, empty collections, validation errors, missing media, loading states, authorization differences, narrow screens, and realistic repeated content. When a page exposes a reusable pattern, extract only the smallest stable interface. Keep one-off route composition in the app.

## Design-system-first workflow

Before creating or changing UI:

1. Search `packages/design-system/src` for an existing pattern that can support the use case through composition or a meaningful variant.
2. Search `apps/web/inertia` for similar markup and record the real differences between usages.
3. Decide whether the change is a page composition, an extension of an existing pattern, or a new atom, molecule, or organism.
4. Define the reusable interface from content structure and behavior, not from one page's current data object.
5. Implement accessible behavior, variants, and responsive constraints in the owning design-system module.
6. Add representative Storybook stories and export the public module.
7. Replace the app markup with the package import and verify every affected page.

The extraction is complete when the design-system interface contains no route-specific dependency, consumers no longer duplicate the pattern, and Storybook demonstrates the states the applications rely on.

### Interface inventory

When several pages contain similar markup with small differences, inventory before extracting:

1. list every current occurrence;
2. name the shared responsibility;
3. separate real variants from accidental drift;
4. identify content slots, controlled state, and events;
5. choose the Atomic Design level from responsibility;
6. extract only after the stable interface is visible.

If two similar public patterns already exist with unclear names, compare and merge them or document why their responsibilities differ before adding another.

## Component folder

Keep each public pattern and its evidence together:

```text
src/atoms/button/
├── button.tsx
└── button.stories.tsx
```

Use one folder per public pattern. Private child modules and focused tests may live in the same folder. Avoid barrel files unless they make the package export clearer without hiding ownership.

## Behavior, styling, and variants

- Use Ark UI for accessible state machines, focus management, keyboard interaction, and semantic behavior.
- Use Tailwind CSS utilities and theme tokens for presentation.
- Use `tailwind-variants` for named variants, compound variants, slots, defaults, and consumer `className` composition.
- Put shared colors, spacing, typography, radii, and other design tokens in the design-system CSS theme rather than repeating arbitrary values.
- Keep variants semantic. Prefer `intent="danger"` or `size="compact"` over props that expose implementation details.
- Preserve native element props and refs when wrapping native or Ark UI primitives.
- Keep application requests, Inertia navigation, domain decisions, and server data loading outside the design system.

Accessibility is part of the pattern interface. A consumer should not have to rebuild labeling, keyboard behavior, focus states, disabled behavior, or ARIA relationships for every use.

## Storybook expectations

Storybook is the living pattern library. Every public atom, molecule, and organism has a colocated `*.stories.ts` or `*.stories.tsx` file.

Stories cover the behavior consumers rely on:

- default usage;
- meaningful semantic variants;
- loading, disabled, selected, open, error, and empty states when applicable;
- realistic short and long content;
- constrained-width or responsive cases when layout can break;
- composition through slots or children;
- a stressful content case for every organism.

Prefer a small set of representative stories over a mechanical permutation of every prop. Use play interactions when keyboard or state transitions are part of the public behavior.

## Public interface

Treat `packages/design-system/package.json` exports as the package's public interface.

- Add an export for every pattern intended for application use.
- Import public patterns through paths such as `@boilerplate/design-system/button`.
- Keep helpers and private children inside the owning folder.
- Search every consumer before changing an exported interface.
- Prefer composition and semantic variants over page-specific boolean props.

## Naming

Name a pattern after its reusable interface role. Use product language when the responsibility is genuinely product-specific, and general interface language when the pattern is broadly reusable.

- Prefer `Button`, `Field`, and `Pagination` for general patterns.
- Prefer `DeploymentCard` when deployment semantics are intrinsic to the organism.
- Prefer `OnboardingForm` when the organism owns that complete reusable interaction.
- Avoid names copied from the first page location, such as `SettingsLeftBox`.

The name, folder, Storybook title, and package export describe the same pattern.

## Completion checklist

Before completing a design-system change, verify every applicable item:

- the pattern is classified by responsibility as an atom, molecule, or organism;
- dependency direction follows `organisms -> molecules -> atoms`;
- Ark UI owns available accessible behavior;
- variants are semantic and implemented with Tailwind Variants;
- tokens and utilities follow the shared theme;
- props contain no route-specific data contract;
- public patterns have representative colocated stories;
- public exports and all consumers are updated;
- keyboard, focus, responsive, empty, error, loading, and stressful-content states affected by the change are verified.

Run the design-system checks:

```bash
yarn workspace @boilerplate/design-system typecheck
yarn workspace @boilerplate/design-system build:storybook
```

When an application consumer changes, also run:

```bash
yarn workspace @boilerplate/web typecheck
```

Finish with the repository checks required by the root `AGENTS.md`. Use Storybook for visual verification whenever layout, responsive behavior, accessibility, or interaction changes.
