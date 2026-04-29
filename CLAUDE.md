# Scripture Card — coding standards for Claude

This file is loaded into every Claude Code session in this repo. Read README.md first for the
high-level architecture; this file documents the rules and gotchas that aren't obvious from
reading the code.

## Stack

React 19 · TypeScript (strict, `erasableSyntaxOnly`, `verbatimModuleSyntax`) · Vite 8 ·
React Router 7 · Firebase Auth + Firestore · Vitest + React Testing Library.

UI language is **Traditional Chinese (zh-Hant)**. New copy should match — don't translate
existing Chinese strings to English.

## Architecture (Clean Architecture, four layers)

```
domain         pure types, entities, value objects, repository interfaces, errors
application    use cases, ports (e.g. AuthService), DTOs, mappers
infrastructure Firebase implementations of repositories + ports, DI container
presentation   React components, pages, hooks, providers, routing
shared         layer-agnostic primitives (Result type, branded types)
```

**Import direction is enforced by ESLint** (`eslint.config.js` → `layerRule`). Violations
fail lint, not just review:

- `domain` imports nothing from outer layers.
- `application` may import `@domain`, `@shared` — never `@infrastructure` or `@presentation`.
- `infrastructure` may import `@domain`, `@application`, `@shared` — never `@presentation`.
- `presentation` may import `@application`, `@domain`, `@shared`. The only `@infrastructure`
  import allowed is the `Container` type at the seam (`useContainer`, `AppProvider`, `main.tsx`).
- `shared` imports nothing from any layer.

Path aliases: `@domain/*`, `@application/*`, `@infrastructure/*`, `@presentation/*`, `@shared/*`.

## TypeScript gotchas this codebase will trip you on

`tsconfig.app.json` enables several strict flags whose error messages aren't obvious:

- **`erasableSyntaxOnly`** — no constructor parameter properties (`constructor(private x: X)`)
  and no enums. Declare fields explicitly:
  ```ts
  class Foo {
    private readonly bar: Bar;
    constructor(bar: Bar) { this.bar = bar; }
  }
  ```
  Use string union types instead of enums (`type Role = 'admin' | 'reader'`).
- **`verbatimModuleSyntax`** — every type-only import must use `import type`. ESLint's
  `@typescript-eslint/consistent-type-imports` will flag missing ones.
- **`noUncheckedIndexedAccess`** — `arr[i]` is `T | undefined`. Always handle the undefined case
  (`?? fallback`, narrowing, or assertion with a comment explaining why it's safe).
- **`exactOptionalPropertyTypes`** — `{ x?: string }` and `{ x?: string | undefined }` are
  different types; assigning `undefined` to the former is an error.

## Error handling

Use cases return `Result<T, DomainError>` from `@shared/result`. **Never throw across a
use-case boundary** — branch on `result.ok`. Helpers: `ok(value)`, `err(error)`, `isOk`, `isErr`.

Domain errors extend `DomainError` and have a discriminator `kind` field
(`NotFound | Validation | Unauthorized | Authentication | Unexpected`). Add new kinds in
`@domain/errors` rather than throwing generic `Error`s.

Map Firebase errors to domain errors at the infrastructure boundary
(`@infrastructure/firebase/errors.ts`). The presentation layer should never see Firebase
error codes.

## React patterns the linter enforces

- **`react-hooks/set-state-in-effect`** — never call `setState` *synchronously* in an effect
  body. setState inside an async `.then()` callback is fine. For "reset state on input
  change" patterns, derive at render time or store the input key alongside the data
  (see `useDevotional`, `useDevotionalList` for the pattern). For form hydration on async
  load, split the component into a loader + an inner with `key={loadedId}` and lazy
  `useState(() => initialFromProps())`.
- **`@typescript-eslint/no-misused-promises`** + **`no-floating-promises`** — JSX event
  handlers expect `void`-returning functions. Wrap async work as `() => void asyncFn()` or
  use the synchronous handler that calls `.then(onResolve, onReject)`.
- **React Router 7** — `useNavigate()`'s `navigate(...)` returns a `Promise`. Prefix with
  `void`: `void navigate('/admin')`.

## Component / file organization

- React Context lives in its own `*Context.ts` file separate from its provider. The provider
  goes in `*Provider.tsx`. This keeps `react-refresh/only-export-components` happy and
  preserves HMR for consumers when the provider changes.
- Pages go in `presentation/pages/`, reusable UI in `presentation/components/`, side-effect
  hooks in `presentation/hooks/`. Page-specific helpers stay in the page file.
- Index files are explicit re-exports (`export { Foo } from './Foo'`), not `export *`.

## Design system

Visual language is defined in `src/presentation/styles/global.css` as CSS custom properties.
Use the tokens — don't hardcode colors:

| Token              | Use                                           |
| ------------------ | --------------------------------------------- |
| `--paper`          | Page background                               |
| `--paper-2`        | Card / surface background                     |
| `--ink`, `--ink-2` | Primary / secondary body text                 |
| `--ink-3`          | Tertiary text, labels                         |
| `--ink-mute`       | Hints, placeholders                           |
| `--gold`, `--gold-deep`, `--gold-soft` | Accents, links, tag chips |
| `--rule`           | Hairlines, dividers, input borders            |
| `--shadow`         | Elevated surfaces                             |

Fonts: **Noto Serif TC** (zh body) and **Cormorant Garamond** (`.serif-en` for Latin display).
Don't introduce new fonts.

Dark mode is real — set via `data-theme="dark"` on `<html>`, controlled by `ThemeProvider`.
Test new screens in both modes.

Reusable utility classes already exist for buttons (`btn-solid`, `btn-outline`, `btn-ghost`,
`pill`), surfaces (`surface`), forms (`field`, `field-control`, `field-label`, `field-grid`),
banners (`banner`, `banner-error`, `banner-info`), and layout (`page`, `top-bar`, `page-footer`).
Reach for these before writing inline styles for layout. Inline styles are fine for one-off
token application (e.g. `color: 'var(--ink-3)'`).

Responsive: mobile-first breakpoints live in `global.css`. The reading body uses CSS
multi-column that collapses to single column under 720px — keep that pattern for any
long-form content.

## Firebase + Firestore rules

Schema:
- `devotionals/{MM-DD}` — public read, admin write.
- `users/{uid}` — readers can read/create their own profile (with role `'reader'`); only
  admins can change roles.

`firestore.rules` is the source of truth. Update it whenever you add a collection or change
the access model.

The first admin must be promoted manually in the Firebase console (set `users/{uid}.role`
to `"admin"`); see README.

## Verification before saying "done"

Run all four when you finish a feature touching code, in order — they cover different layers:

```
npm run typecheck   # catches strict-TS issues the editor missed
npm run lint        # layer boundaries + react-hooks + prettier
npm run build       # production tsc + Vite — catches things typecheck alone misses
npm test            # Vitest
```

For UI-affecting changes, also `npm run dev` and click through the feature in a browser.
Type-checking and tests don't catch visual regressions or broken interactions.

## Things to avoid

- Adding new dependencies without checking — Firebase + React Router cover most needs.
- Mixing English and Chinese in user-facing copy unless the design intentionally pairs them
  (e.g. `kicker` Latin label above a Chinese heading).
- `console.log` — `eslint` allows only `console.warn` and `console.error`.
- Reaching into `@infrastructure` from a presentation component. If you need a side effect,
  add a use case in `@application`, wire it through the container, and call it from a hook.
