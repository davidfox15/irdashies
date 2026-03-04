# AGENTS.md - iRDashies Agent Guide

Guide for autonomous coding agents in this repository.
Use this together with repo configs (`eslint.config.mjs`, `tsconfig.json`, `.prettierrc`, Husky).

## 1) Project context

- Stack: Electron + React 19 + TypeScript 5 + Zustand + Tailwind CSS 4 + Vite.
- Tests: Vitest (`jsdom`) + Testing Library.
- Lint: TypeScript compiler checks + ESLint flat config.
- Format: Prettier.

## 2) Main commands

```bash
npm install
npm start
npm run lint
npm run test
npm run storybook
npm run build-storybook
npm run package
npm run make
```

## 3) Build/lint/test notes

- `npm start`: starts Electron with logging.
- `npm run lint`: `tsc --project ./tsconfig.json --noEmit && eslint . --max-warnings 0`.
- `npm run test`: `vitest --coverage`.
- `npm run package`: build app package.
- `npm run make`: build installer artifacts.

## 4) Single-test workflows (important)

Use these during local iteration:

```bash
# All tests, no coverage
npm run test -- --no-coverage

# Single test file
npm run test -- src/frontend/components/Weather/WeatherTrackWetness/WeatherTrackWetness.spec.tsx --run --no-coverage

# By test name
npm run test -- -t "renders humidity" --run --no-coverage

# Single file + test name
npm run test -- src/frontend/components/TrackMap/FlatTrackMap.spec.tsx -t "shows player marker" --run --no-coverage

# Direct vitest equivalent
npx vitest run src/path/to/file.spec.tsx --no-coverage
```

## 5) Pre-commit behavior

- Husky pre-commit runs:
  - `npx lint-staged`
  - `npx tsc --noEmit`
- `lint-staged` rules:
  - `*.{js,jsx,ts,tsx}` -> `prettier --write`, `eslint --fix --max-warnings 0`
  - `*.{css,md}` -> `prettier --write`

Recommended before finishing:

- `npm run lint`
- `npm run test -- --no-coverage`

## 6) Architecture constraints (strict)

- Keep boundary: frontend (React) <-> IPC bridge <-> app (Electron/main).
- Frontend must not import from `src/app`.
- App code must not import from `src/frontend`.
- App code must not import frontend aliases (`@irdashies/utils/*`, `@irdashies/context`).
- Share contracts through `src/types` and bridge interfaces.
- ESLint enforces restricted imports; do not disable these checks.

## 7) Imports and module usage

- Prefer aliases from `tsconfig.json`:
  - `@irdashies/context`
  - `@irdashies/utils/*`
  - `@irdashies/types`
- Use `import type` for type-only imports when practical.
- Keep imports minimal and remove unused symbols.
- Avoid deep cross-feature imports when an index export exists.

## 8) Formatting and style

Prettier in repo:

- `printWidth: 80`
- `singleQuote: true`
- `trailingComma: es5`

Code style:

- Prefer small, clear functions and explicit control flow.
- Keep JSX readable; avoid large inline expressions.
- Add comments only for non-obvious behavior.
- Keep behavior changes separate from pure refactors when possible.

## 9) TypeScript conventions

- `strict` is enabled; keep code strict-safe.
- Avoid `any`; if unavoidable, isolate scope and document reason.
- Use optional chaining and `??` for volatile runtime/telemetry data.
- Use type guards at boundaries (IPC, storage, parsed external data).
- Reuse shared types from `src/types` for contracts.

## 10) Naming conventions

- Components: PascalCase files and exports.
- Hooks: `useXxx` prefix.
- Tests: `*.spec.ts` / `*.spec.tsx`.
- Stories: `*.stories.tsx`.
- Common type names:
  - `ComponentNameProps`
  - `WidgetNameSettings`

## 11) Error handling guidance

- Fail soft in UI when telemetry/session data is missing.
- Use defensive defaults before indexing or array ops.
- Avoid throwing in render paths.
- Keep bridge/storage errors explicit and observable.
- Prefer predictable fallbacks over silent crashes.

## 12) React/Zustand performance patterns

- Telemetry updates are high-frequency; reduce rerenders.
- Use narrow Zustand selectors.
- Memoize expensive derived data with `useMemo`.
- Use `memo` for hot-path components when props are stable.
- Keep dependency arrays complete and accurate.

## 13) UI and component rules

- Tailwind-first; avoid custom CSS unless necessary.
- Follow existing theme variable patterns.
- Do not use emojis in user-visible UI text.
- Use Phosphor icons (`@phosphor-icons/react`) for iconography.
- New reusable components should include Storybook stories.

## 14) Git workflow expectations

- Do not commit directly to `main`; use feature branches.
- Commit message style used in repo docs:
  - `feat: ...`
  - `fix: ...`
  - `chore: ...`
- Keep commits/PRs focused; avoid unrelated cleanup.

## 15) Cursor/Copilot instructions status

Checked paths:

- `.cursor/rules/`
- `.cursorrules`
- `.github/copilot-instructions.md`

No Cursor/Copilot instruction files were found in this repository at this time.
If added later, update this guide and treat those files as higher-priority instructions.
