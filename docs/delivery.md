# Repository delivery record

Prepared on **November 24, 2026 (America/São_Paulo)**. This record describes the local handoff; it is not a production certification or a remote CI result.

## What changed

| Area | Delivered |
| --- | --- |
| Source organization | App at repository root; identity under `src/assets/`; static favicon under `public/`; documentation and media under `docs/` |
| Build configuration | Relative production asset paths; type checks without compiler output; production sourcemaps disabled |
| Repository hygiene | `.gitignore`, `.gitattributes`, `.editorconfig`, Node version, package-manager version and CI workflow |
| Portfolio README | Main English README and Portuguese companion; positioning, flows, gallery, stack, setup and explicit prototype scope |
| Documentation | Current product, architecture, design system, development, demo, credits and recovered project context |
| Historical material | Initial product/implementation plans and audio notes retained under `docs/archive/` |
| Screenshots | Eleven fresh desktop/mobile captures from the production build, including the evidence drawer and full overview |
| Motion | Existing compact GIF and 20-second Full HD MP4 reused with provenance and sound credits |
| Cover | New abstract brand background composed with original SVG identity and a real app capture; 1920 × 1080 cover and 1280 × 640 social preview |
| Reproducibility | Playwright smoke checks, screenshot script and cover compositor |

The existing application behaviour was preserved. Source SVG imports and the CSS symbol reference were updated for the asset move. The original branding workspace, including editable identity files and redundant export versions, remains separate and unchanged.

## Local validation

| Check | Result / boundary |
| --- | --- |
| App and Vite configuration type checks | Passed with Node 24.22.3 and the existing locally installed dependency versions |
| Production build | Passed; Vite retains its warning about chunks over 500 kB |
| Overview filters | Passed: site, resource and period changes |
| Operations | Passed: asset search, no-results state and methodology disclosure |
| Anomaly / action flow | Passed: severity filter, drawer, new action, all status transitions, terminal state and persistence after reload |
| Performance / Reports | Passed: rendering and CSV download with the expected header and two fixture rows |
| Sources / preferences / demo | Passed: five source rows, persisted compact mode and full guided-demo traversal |
| Responsive overflow | Passed for all eight views at widths of 390, 768 and 1440 pixels |
| Uncaught browser errors | None in the successful reduced-motion smoke run |
| Normal motion | Opening, optional ambient rendering and navigation also completed without uncaught errors |
| Screenshots | Captured and visually reviewed; source dimensions recorded in `media/captures.json` |
| Original identity | Original SVG paths retained; cover uses the original wordmark |
| Transfer script | Tested against a separate temporary destination: hash verification, `.git` preservation and refusal of unexpected files passed |

The browser tests used installed Google Chrome. This session disallowed loopback networking, so the local production files were rendered through Playwright request interception at a virtual origin (`HALVEO_FILE_PREVIEW=1`). These checks validate the local build and UI interactions, not an actual HTTP deployment. External Google Fonts requests were blocked in that mode, so fresh screenshots use the app's system fallback.

A clean online dependency installation could not be completed because the package registry was unreachable. Local validation used the existing project's resolved dependencies. Playwright and its lockfile entries were copied from the already installed toolchain; no package version or integrity was invented. A clean installation and the included GitHub Actions workflow must still run in a network-enabled environment. The workflow has not been executed remotely in this task.

## Scope of the package

The delivery contains the dashboard source and curated portfolio material. It excludes `node_modules`, `dist`, generated TypeScript files, temporary review sheets, package caches and design-editor originals. The largest included file is the approximately 16.4 MB dashboard MP4; the GIF is approximately 9.7 MB. Git LFS is not required for these individual file sizes.

The source is a portfolio prototype. Static Performance totals, a fixed CSV export, illustrative comparison curves and simulated verification remain documented limitations. No backend or production integration was added as part of repository preparation.

## Destination handoff

The requested final destination is `C:\Users\Rafael Poles\Documents\GitHub\halveo-dashboard`. It was outside this session's permitted filesystem access. A top-level listing showed an existing `.git` directory, but Git status, history and remote inspection were denied. No repository metadata or remote was modified.

The validated delivery is staged under `release/halveo-dashboard` in the original workspace. The adjacent delivery archive and installation script provide a transfer path if destination access remains unavailable. The script verifies file hashes, preserves `.git`, and refuses to overwrite different existing files. A direct transfer should be performed only after the destination is accessible.

No commit, push, hosted demo, repository URL or remote CI success is claimed by this handoff.
