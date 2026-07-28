# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

_Einakter_ is a database of German one-act plays, presented as a React SPA. The authoritative data lives in YAML files at the repo root; the React app is a viewer over derived JSON.

## Commands

- `pnpm start` — dev server on port 5173. Regenerates `data.csv` and `data.json` from YAML before starting Vite.
- `pnpm run build` — production build into `build/`. Also regenerates the beacon and mix-n-match files.
- `pnpm run test` — Vitest (compiles locales and regenerates JSON/CSV first). Run a single test with `pnpm exec vitest src/utils.test.ts` (or `-t "name"` to filter).
- `pnpm run lint` — ESLint over `src/`.
- `pnpm run compile` — compile Lingui `.po` files to TS. Required at least once before `start`/`build`/`test` succeed (they invoke it, but if you edit locales without restarting, run this).
- `pnpm run extract` — extract translatable strings from source into `.po` files.
- `pnpm run json` / `pnpm run csv` — regenerate `data.json` / `data.csv` from `data.yaml` on demand. `json` also copies into `src/` (imported by the app) and `public/`.
- `pnpm run authors [Q123 …]` — fetches Wikidata author data into `src/authors.json`. With no args, fetches only new IDs from `data.yaml`; with IDs, refreshes those. Also regenerates `translators-network.gexf`.
- `pnpm run locations` — fetches Wikidata coordinates into `src/locations.json` for new location IDs.
- `pnpm run beacon` / `pnpm run mixnmatch` — generate BEACON and Wikidata Mix-n-match exports (run automatically by `build`).

Package manager is pnpm (version pinned via the `packageManager` field in `package.json`, which `pnpm/action-setup` reads in CI). Install locally with e.g. `npm install -g pnpm`.

## Architecture

**Data pipeline (YAML → JSON → React).** The source of truth is `data.yaml` (translated German one-acts) and `originals.yaml` (foreign-language originals they are based on). The `yml2json.ts` / `yml2csv.ts` / `yml2beacon.ts` / `yml2mixnmatch.ts` scripts at the repo root transform these into consumer formats. `data.json` is imported directly by the React app (`src/data.json`), so editing YAML without re-running `pnpm run json` will not update the UI. `src/authors.json`, `src/locations.json`, and `src/originals.json` are Wikidata-derived caches produced by the fetch scripts.

**React app.** Vite + React 19 + TypeScript + Tailwind + SCSS. Entry at `src/index.tsx`; routing is defined in [src/App.tsx](src/App.tsx) (`/`, `/plays`, `/:slug`, `/id/:id`, `/originals`, `/originals/:slug`, `/about`, `/locations`). Table views use `@tanstack/react-table`; the map uses `react-leaflet`. Global app state (settings, selected columns, etc.) is provided via `src/context.ts`.

**Types.** [src/types.ts](src/types.ts) is the canonical shape of a `Play` / `OriginalPlay` / `Author` / `Setting`. New YAML fields must be added there and, if user-visible, threaded through the relevant table/detail components.

**i18n.** LinguiJS with `.po` files under `src/locales/{de,en,es,fa,fr,ja,jbo-tok,ko,ku,ru,uk,zh}`. Wrap user-facing strings in Lingui macros and re-run `pnpm run extract` to populate the `.po` files, then `pnpm run compile` to generate the JS catalogs consumed at runtime. Locale detection lives in `src/i18n.ts` / `src/languages.ts`; the config is [lingui.config.ts](lingui.config.ts).

**MDX content.** `src/about.mdx` is imported as a component via `@mdx-js/rollup` (see [vite.config.mts](vite.config.mts)).

**External data enrichment.** Author metadata (name, dates, GND, image, birth/death places) is pulled from Wikidata via SPARQL in [fetch-authors.ts](fetch-authors.ts); location coordinates via [fetch-locations.ts](fetch-locations.ts). These write to `src/authors.json` / `src/locations.json` respectively — do not hand-edit those files; re-run the fetch scripts.

## Data conventions

- Play IDs use the prefix `ein` (e.g. `ein000001`) for translated one-acts and `eorig` for originals. `slug` is the URL-safe identifier used in routes.
- Year resolution: [src/utils.ts](src/utils.ts) `normalizeYear` picks a single year from `yearWritten` / `yearPrinted` / `premiered`, preferring `yearWritten` when the printed/premiered year is more than 10 years later. `getEarliestYear` returns the minimum. Prefer these helpers over ad-hoc year logic.
- `basedOn` in `data.yaml` is a list of `eorig…` IDs (or inline strings for originals not in `originals.yaml`); the JSON generator resolves them to `OriginalPlay` objects.

## Licensing

Code is MIT; the YAML data files (`data.yaml`, `originals.yaml`) are CC BY 4.0. Keep that split in mind when adding files.
