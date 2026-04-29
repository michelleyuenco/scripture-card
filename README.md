# Scripture Card

React + TypeScript + Vite, structured as Clean Architecture and wired to Firebase (Firestore + Hosting).

## Layers

```
src/
├── domain/          Enterprise rules: entities, value objects, repository interfaces, domain errors.
├── application/     Use cases, input/output ports, DTOs. Depends only on domain + shared.
├── infrastructure/  Firebase, repository implementations, env config, DI composition root.
├── presentation/    React components, pages, hooks, providers, routing.
└── shared/          Layer-agnostic primitives: Result type, branded types, utils.
```

Dependency rule (enforced by ESLint via `no-restricted-imports`):

- `domain` — no inward imports
- `application` — may import `@domain`, `@shared`
- `infrastructure` — may import `@domain`, `@application`, `@shared`
- `presentation` — may import `@application`, `@domain`, `@shared`; `@infrastructure` only at the composition root (`main.tsx`)
- `shared` — no layer imports

Path aliases: `@domain/*`, `@application/*`, `@infrastructure/*`, `@presentation/*`, `@shared/*`.

## Scripts

```
npm run dev            # Vite dev server
npm run build          # type-check + production build to dist/
npm run preview        # serve the built dist/
npm run typecheck      # tsc --noEmit
npm run lint           # ESLint
npm run lint:fix       # ESLint with --fix
npm run format         # Prettier write
npm run format:check   # Prettier check
npm run test           # Vitest run
npm run test:watch     # Vitest watch
npm run test:coverage  # Vitest with v8 coverage
npm run deploy         # build + firebase deploy (hosting + firestore)
```

## Firebase

1. Copy `.env.example` to `.env.local` and fill in the Firebase web app config.
2. Enable **Email/Password** and **Google** sign-in providers in the Firebase console (Authentication → Sign-in method).
3. Install the Firebase CLI: `npm i -g firebase-tools`, then `firebase login`.
4. Deploy:
   ```
   npm run deploy
   ```

### Granting the first admin

`firestore.rules` lets readers create their own `users/{uid}` document with role `reader`,
but only an existing admin can change a role. To bootstrap the first admin:

1. Sign up through the app (e.g. via `/sign-in`).
2. In the Firebase console, open **Firestore → users → {your uid}** and set `role` to `"admin"`.
3. Reload the app — the **管理 / Admin** link will appear in the header and `/admin` will become accessible.

## Routes

| Path                      | Description                                        |
| ------------------------- | -------------------------------------------------- |
| `/`                       | Landing — pick a month and day                    |
| `/read/:month/:day`       | Reading view for the selected day                  |
| `/sign-in`                | Email + Google sign-in / sign-up                   |
| `/admin`                  | Admin (gated) — month selector + day grid          |
| `/admin/:month/:day`      | Admin editor for one day's devotional              |
