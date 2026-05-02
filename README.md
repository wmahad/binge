# binge

TV dashboard (Vue 3 + TypeScript) over the [TVMaze API](https://www.tvmaze.com/api): genre-grouped catalog, show detail, and search.

## Requirements

| Prerequisite | Notes |
| --- | --- |
| **Node** | 22 or newer (`package.json` → `engines`) |
| **pnpm** | 10.x, locked by `pnpm-lock.yaml` and `packageManager` in `package.json` |

### Why pnpm (not npm or Yarn for installs)

Dependency versions in this repo are **frozen in `pnpm-lock.yaml`**. The `packageManager` field pins which **pnpm** binary Corepack should use. That is the source of truth for local installs and CI.

**npm** and **Yarn do not read `pnpm-lock.yaml`.** If you run `npm install` or `yarn install` here, the tool resolves from `package.json` alone, writes its own lockfile, and you can end up with **different transitive packages** than the pnpm lockfile. Use **pnpm for installing dependencies** so the tree matches the lockfile and the same graph `pnpm test` and `pnpm build` were run against.

### Install pnpm

**1. Corepack (recommended)**  
[Corepack](https://nodejs.org/api/corepack.html) comes with Node and aligns to the `packageManager` field.

```bash
corepack enable
pnpm install
```

On first run, Corepack may download the pnpm version declared in `package.json` (check the `packageManager` value).

If the `pnpm` command is still missing, activate the version explicitly (replace the version if `package.json` changes):

```bash
corepack prepare pnpm@10.33.2 --activate
pnpm install
```

**2. Other options**

| Approach | Command / note |
| --- | --- |
| Global binary | `npm install -g pnpm@10`, then `pnpm install` in the repo |
| Version managers | Volta, asdf, mise, etc.: install **pnpm 10.x** and run `pnpm install` |

### After install: running scripts

Scripts do not care which manager installed `node_modules`. These are equivalent:

- `pnpm build` and `npm run build`
- `pnpm test` and `npm run test`

Use **pnpm only when you need to install or add packages**, not for every command.

## Run

| Command | Description |
| --- | --- |
| `pnpm install` | Install deps |
| `pnpm dev` | Dev server |
| `pnpm build` | Typecheck + production bundle |
| `pnpm preview` | Preview production build |
| `pnpm test` | Vitest (unit + browser integration tests) |
| `pnpm run test:install-browsers` | One-time Playwright browser binaries (needed for tests on a fresh machine) |
| `pnpm typecheck` | Typecheck only |
| `pnpm check` | Biome lint + format |

Regenerate API typings/clients/mocks from the OpenAPI spec: `pnpm generate` (after editing `openapi/`).

---

## Architecture & decisions

### Goals

The assignment allows a small setup. This repo still aims to be **easy to change later**:

| Goal | How it shows up here |
| --- | --- |
| One place that defines HTTP shapes | Hand-written OpenAPI → Kubb codegen (`openapi/tvmaze.yaml`) |
| Clear loading and errors | TanStack Query for server-backed data |
| Tests that match real usage | Vitest in a browser + MSW for HTTP in tests |

It is **not** a contest for the longest `package.json`. The idea is to avoid many copy-pasted `fetch` URLs and JSON shapes that quietly drift when TVMaze or the UI changes.

---

### 1. API contract and codegen (Kubb)

**Situation:** TVMaze does not ship OpenAPI.

**Approach:** This project keeps its own spec in `openapi/tvmaze.yaml`. The public TVMaze docs describe behavior; that file is what **this codebase** compiles against.

**Generated from the spec (via Kubb):** TypeScript types, fetch clients, TanStack Vue Query hooks, Faker-based fixtures, and MSW handlers for tests.

**Workflow:** Change the spec → run `pnpm generate` → app code and mocks stay aligned.

**Cost:** The YAML must stay truthful to the live API. Small ongoing edits in return for one shared definition and fewer typos in paths and bodies.

---

### 2. Loading data (TanStack Query)

Server-backed lists (dashboard catalog, genre grids), search, and the detail page’s follow-up calls all run through **TanStack Vue Query**. Query tracks **loading, errors, cached data, and retries** so that logic lives in one layer instead of being copied into every route.

The **Kubb-generated hooks** are wired into Query. Screen components then mainly **consume** `data` / `isPending` / `error` and render UI instead of repeating fetch setup and parsing in every route.

---

### 3. Genres and sorting (assignment constraint)

TVMaze does not offer a URL that returns “only Drama” or “only Comedy.” The public API does offer a **paginated list of all shows** (`/shows?page=…`).

This app **downloads one or more pages** of that list when a screen needs enough rows, then **keeps the shows that match the selected genre** (using each show’s `genres` field) and **sorts** them, for example by rating. All of that **runs in the browser**, which matches the assignment note that the show index is the data source, not a dedicated genre endpoint.

---

### 4. Source layout and styling

| Path | Role |
| --- | --- |
| `src/features/shows/` | Screens: dashboard, detail, genre hub, search |
| `src/components/` | Shared UI used in more than one screen |
| `src/composables/` | Shared Vue composition (e.g. queries, theme) |
| `src/utils/` | Small pure helpers |

**Tailwind** handles layout and **responsive** behavior without building a private CSS framework for a short project.

---

### 5. Tests and linting

| Layer | What it covers |
| --- | --- |
| **Unit** | Pure logic: sort order, pagination helpers, formatting |
| **Browser (Vitest + Playwright)** | Real DOM; **MSW** returns fixed HTTP so flows are stable without hitting TVMaze in CI |

So you get **a real browser and stable fake HTTP**, without maintaining a separate giant suite that drives multiple browsers against a live environment. It is **more realistic than tests that never open a browser**, and **lighter than full production-style E2E**.

**Biome** combines lint and format in one command (`pnpm check`). **Lefthook** defines **pre-commit** hooks (see `lefthook.yml`: Biome on staged files + `pnpm typecheck`). They install when you run `pnpm install` via the `prepare` script. Skip that step or uninstall if you do not want hooks locally.

---

### 6. Stack size (honest trade-off)

You could stop at Vite, Vue, and `fetch`. Here you also get Kubb codegen, TanStack Query, and browser tests (Vitest, Playwright, MSW) so API shapes stay tied to `openapi/`, server state and loading stay in one layer, and tests exercise real DOM. That means more packages and config up front, and less churn when the spec or routes change.
