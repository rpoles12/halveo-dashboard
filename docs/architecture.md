# Architecture

Halveo is a client-rendered, single-page React application compiled by Vite into static assets. It has no server-side application, database or external data API.

## Source organization

| File | Responsibility |
| --- | --- |
| `src/main.tsx` | React root and stylesheet import |
| `src/App.tsx` | Application state, view switching, shell, view components, chart wrappers, drawer and guided demo |
| `src/data.ts` | Domain types, deterministic fixtures and demand-series generator |
| `src/styles.css` | CSS variables, layouts, components, responsive rules and successive visual refinements |
| `src/assets/` | Original wordmark and symbol SVGs imported by the app |
| `public/favicon.svg` | Standalone symbol served as a favicon |
| `vite.config.ts` | React plugin, development port and relative build paths |
| `scripts/browser.mjs` | Preview-server and Playwright lifecycle shared by validation and capture scripts |

The current views are functions within `App.tsx`, not separate files. This organization preserves the existing implementation while providing a clean repository boundary. Splitting the application module is a future refactor, not a completed feature.

## State and data

| State | Owner / lifetime | Effect |
| --- | --- | --- |
| Current view | App / session | Switches among eight views without URL routing |
| Site and resource | App / session | Drives Overview and Operations |
| Selected anomaly | App / session | Opens the evidence drawer |
| Guided-demo step | App / session | Routes through the five-step portfolio narrative |
| Compact density | App / localStorage | Changes table and action spacing |
| Offer guided demo | App / localStorage | Shows or hides the demo entry point |
| Actions | App / localStorage | Persists new investigation actions and status changes |
| Period, query and severity | Individual view / mounted lifetime | Changes the local visualization or filtering |

The storage keys are `halveo-actions`, `halveo-compact` and `halveo-tour`. Views reset on reload; persisted preferences and actions do not. There is no URL router or deep-link state. There is no storage migration or server synchronization.

`buildSeries(site, resource)` creates a repeatable 24-point curve using deterministic trigonometric functions and scaling factors. Overview's longer periods use separate generated series. These are illustrative visual fixtures, not an ingestion or forecasting system. Other views use static arrays. Reporting generates a CSV Blob in memory and triggers a local download.

## Rendering and motion

- ECharts is loaded dynamically by chart components; effects initialize, update, resize and dispose chart instances.
- Motion controls navigation indicators, page transitions, menus and the anomaly drawer.
- GSAP controls the initial editorial entrance and reverts its context on cleanup.
- Anime.js animates the brand entrance.
- Three.js is loaded dynamically for the optional ambient field. Small screens and reduced-motion preferences skip it.

Reduced motion disables or shortens several animations, but the app still uses short state transitions. The CSS contains earlier visual layers followed by overrides; the final `.top-layout` rules govern the current design.

## Build and hosting

`pnpm build` performs type checks without emitting compiler artifacts, then creates `dist/`. `base: './'` gives production HTML relative asset URLs, suitable for static hosts and repository subdirectories. Serve the build over HTTP; opening `index.html` directly from the filesystem is not the supported workflow. The Google Fonts stylesheet remains an external request; the app falls back to system fonts when unavailable.

There are no secrets or required environment variables. Browser scripts accept the optional `PLAYWRIGHT_CHANNEL` setting to select an installed browser. Documentation and media are outside the app's import graph and do not enter the production bundle.

## Quality boundary

CI runs type checks, the production build and a Playwright smoke script. The script exercises filters, search, investigation, action creation and persistence, CSV download, preferences, guided demo and viewport overflow. It is not a unit suite, full accessibility audit or industrial domain-model verification. See [delivery](delivery.md) for the actual local validation outcome.
