# Design system and brand translation

## Identity

Halveo's consolidated SVG identity is the source of truth. Two complementary forms reveal a lightning bolt in negative space. Preserve the paths and proportions: the mark must not be substituted with a plus sign or a generic lightning icon.

The app imports `src/assets/logo-white.svg` and `src/assets/symbol.svg`. Documentation references are in `docs/brand/`, including the earlier symbol-with-nodes artwork. The favicon uses the original symbol.

## Palette and typography

| Token / family | Value or treatment | Use |
| --- | --- | --- |
| Carbon | `#0A0A0A` | Brand foundation |
| Slate | `#536977` | Data and technical emphasis |
| Mineral | `#E5E4E2` | Brand typography and contrast |
| Derived interface surfaces | Near-black and blue-grey variants | Depth, panels and navigation |
| Positive state | Muted green | Measured-outcome and health labels |
| Warning state | Muted amber | Review, estimate or intermediate state |
| Critical state | Muted red | High-priority anomaly |
| Schibsted Grotesk | 400 / 500 / 600 / 700 | App headings, labels, tables and numbers |
| Fallback | Helvetica Neue, Arial, sans-serif | Offline or blocked font delivery |

The app currently obtains Schibsted Grotesk through Google Fonts. A separate font self-hosting step would require retaining the corresponding licence. No font binaries are bundled here.

## Information hierarchy

The section titles ask operational questions: “What is happening?”, “Where is demand drifting?” and “What should we do next?”. Large tabular values, quiet labels, thin boundaries and rounded connected panels establish a consistent reading order. Blue-grey marks data emphasis; semantic status colours are reserved for operational meaning.

The product distinguishes facts, hypotheses, estimates and verified outcomes through copy and classification. This is a content design principle as well as a visual one.

## Responsive behaviour

Desktop uses a top navigation capsule, an organization/resource filter row and broad data panels. Narrow layouts reflow panels vertically and make navigation horizontally scrollable. Table containers can scroll locally. Compact density is a persisted user preference rather than a viewport mode.

The source retains multiple breakpoint layers from earlier refinements. The current smoke script checks all eight views at 390, 768 and 1440 pixels for document-level horizontal overflow. That does not prove full device or browser coverage.

## Motion and access

Motion communicates continuity across views and filter selections. The app respects the system reduced-motion preference in chart entry, ambient rendering and several transitions. Visible focus, a skip link and labelled site/resource filters are implemented. A full modal-focus, keyboard, screen-reader and chart-alternative audit remains outstanding; no conformance certification is claimed.

## Portfolio cover

`scripts/cover.mjs` composes an editorial 1920 × 1080 cover from the retained AI-generated abstract background, original wordmark SVG and a production-build screenshot. It also exports a 1280 × 640 social-preview crop. The background uses carbon, slate and mineral tones with fine resource-network filaments. Typography and interface imagery are composed directly, preserving the approved identity and real app content.
