# Halveo Dashboard — Refined Action Plan

## 1. Project frame

Halveo is a fictional portfolio case developed by Ruptive® for an international audience. The dashboard must therefore work on two levels at the same time:

1. as a credible front-end product prototype for industrial operators, executives, and reporting teams;
2. as evidence that the Halveo brand strategy can become a coherent, differentiated digital product.

All product-facing information will be written in **Canadian English**. Interface labels, sample organizations, locations, dates, currency, units, operational scenarios, alerts, recommendations, and reporting references must follow that setting.

The product remains what the original brief defines: **operational data infrastructure for measurable resource efficiency**. It is not positioned as generic sustainability software.

## 2. Portfolio objective

The finished prototype should allow an international viewer to understand, within a few minutes, that the case covers:

- strategic repositioning from EcoSense to Halveo;
- brand identity translated into a working interface;
- information architecture for three distinct audiences;
- industrial data visualization;
- interaction and motion design;
- responsive and accessible front-end engineering;
- a plausible path from prototype to enterprise software.

The strongest portfolio narrative is:

> EcoSense identified waste through periodic consulting. Halveo turns the same expertise into continuous operational visibility — measure, compare, explain, and act.

## 3. Brand foundation

The consolidated references in `dashboard/id base/` and the original SVG files in `dashboard/assets/` are the primary visual source of truth for the product. The initial deck in `docs/inicial deck halveo.html` may inform strategic context and positioning, but its exploratory visual choices must not override the consolidated identity.

### Brand positioning

- Previous perception: point-in-time environmental consulting.
- New perception: recurring operational data infrastructure for enterprise organizations.
- Core idea: environmental improvement is an outcome of operational precision, not the headline promise.
- Archetype: **Sage with a Creator inflection**.
- Personality: precise, technical, sober, reliable, and quietly confident.
- Verbal restraint is essential because the name already implies reduction.

### Brand principles translated into product behaviour

| Brand principle | Product expression |
|---|---|
| Precision before promise | Show the measured value, period, method, and baseline before interpretation |
| Data before opinion | Separate observed facts from hypotheses and recommendations |
| Clarity operates better than decoration | Keep charts, tables, and filters legible under real information density |
| Quiet reliability | Use calm motion, explicit data quality, and predictable interaction states |
| Measurable outcomes, always | Separate estimated opportunity from verified savings |

### English voice examples

Use:

- “Water use is 18% below baseline after six weeks.”
- “The data shows where waste is — not where we assume it is.”
- “Lower consumption. Same output.”
- “Observed demand exceeded the expected range for 47 minutes.”
- “Estimated opportunity — verification required.”

Avoid:

- “Building a greener future.”
- “Empowering conscious businesses.”
- “Eco-friendly operations made simple.”
- claims of guaranteed savings or compliance;
- emotive environmental language without measured evidence.

## 4. Canadian demonstration scenario

### Fictional client

**North Basin Manufacturing** — a fictional Canadian multi-site industrial group used only for the portfolio prototype.

### Sites

| Site | Province | Time zone | Demonstration focus |
|---|---|---|---|
| Hamilton Works | Ontario | Eastern Time | Process water and cooling loops |
| Trois-Rivières Mill | Quebec | Eastern Time | Steam, electricity, and water recirculation |
| Calgary Assembly | Alberta | Mountain Time | Electricity, compressed air, and natural gas |

This spread creates a credible multi-site context and demonstrates that timestamps, energy profiles, and reporting metadata may differ by jurisdiction and site.

### Localization rules

- locale: `en-CA`;
- currency: Canadian dollars, displayed as `CAD` where ambiguity exists;
- water: `m³`, `m³/h`, and `m³/unit produced`;
- electricity: `kWh`, `MWh`, and `kWh/unit produced`;
- natural gas: `GJ` where included;
- emissions: `tCO₂e`, always with methodology metadata;
- dates: `Sep 20, 2026` for interface display and ISO 8601 in exports;
- time: site-local time with abbreviation when an event crosses locations;
- temperatures: Celsius;
- province abbreviations: ON, QC, and AB;
- Canadian spelling in copy where applicable;
- architecture ready for a future `fr-CA` locale, but French translation is not part of the first build.

### Real-world grounding

Canadian manufacturing is a credible scenario because water is used in processing, cooling, condensing, and steam systems. Public Canadian data also reports industrial water volumes in cubic metres. These references inform the type and scale of the fictional data, but no real company data will be represented as Halveo customer data.

## 5. Product model

The interface should make the product model visible in this order:

1. **Measure** — live or recent consumption and source quality.
2. **Compare** — operational baseline, normalized production baseline, target, or peer site.
3. **Explain** — location, duration, likely cause, and confidence level.
4. **Act** — recommended next step, expected impact, owner, and status.
5. **Verify** — measured result after implementation.

“Verify” is added to the interface narrative because it closes the portfolio story and prevents recommendations from looking like unsupported promises.

## 6. Information architecture

All labels below are the intended English product labels.

### Primary navigation

1. **Overview**
2. **Operations**
3. **Anomalies**
4. **Actions**
5. **Performance**
6. **Reporting**
7. **Data Sources**
8. **Settings**

“Actions” is preferred over “Recommendations” in primary navigation. It feels more operational and allows the module to include inspections, maintenance, verification, and approved interventions — not only algorithmic suggestions.

### Global header

- organization and site selector;
- resource selector;
- date range and granularity;
- “Last synced” status;
- overall data confidence;
- alerts;
- user profile.

### Desktop overview structure

```text
┌────────────────┬──────────────────────────────────────────────────────────┐
│ Halveo         │ North Basin / All sites | Water | Last 7 days | Profile│
│ Overview       ├──────────────────────────────────────────────────────────┤
│ Operations     │ Current demand │ vs baseline │ data coverage │ alerts   │
│ Anomalies      ├─────────────────────────────────────┬────────────────────┤
│ Actions        │ Observed vs expected                │ Active anomalies   │
│ Performance    │ Main operational time series       │ Ranked by impact   │
│ Reporting      ├───────────────────────┬─────────────┴────────────────────┤
│ Data Sources   │ Site comparison       │ Open actions / opportunity      │
│ Settings       │                       │                                  │
└────────────────┴───────────────────────┴──────────────────────────────────┘
```

### Responsive hierarchy

- Desktop: fixed sidebar, 12-column analytical grid.
- Tablet: collapsed icon rail and an 8-column grid.
- Mobile: navigation drawer, single-column content, sticky context controls.
- On narrow screens, priority order is active anomaly → current demand → baseline comparison → data confidence → trend.
- Complex comparison tables become stacked summaries rather than horizontally scrolling miniature tables.

## 7. View specifications

### 7.1 Overview

Purpose: let a user identify current operational risk within seconds.

Primary modules:

- **Current water demand** — measured value, unit, timestamp, and source.
- **Variance from baseline** — absolute and percentage difference.
- **Data coverage** — percentage of expected readings received.
- **Active anomalies** — count by severity.
- **Observed vs expected** — primary time-series chart.
- **Sites at a glance** — normalized comparison among Hamilton, Trois-Rivières, and Calgary.
- **Open actions** — estimated opportunity and next owner.

Example headline data:

- `112.4 m³/h` current demand;
- `+8.6%` against the normalized baseline;
- `96.8%` data coverage;
- `7` active anomalies, `2` high priority.

### 7.2 Operations

Purpose: inspect consumption by resource, site, process line, and equipment.

Capabilities:

- switch among water, electricity, and natural gas;
- change granularity from 15 minutes to monthly;
- compare observed, historical baseline, normalized baseline, and target;
- drill down from organization → site → line → equipment;
- inspect data quality and source provenance;
- overlay production output to avoid misleading absolute comparisons;
- show stale, missing, manual, estimated, and calibrated data states.

### 7.3 Anomalies

Purpose: move from a detected deviation to a documented operational response.

List fields:

- severity;
- resource;
- site and exact asset;
- detected time and duration;
- observed deviation;
- confidence;
- current status;
- estimated exposure.

Example anomalies:

- **Hamilton Works · Cooling Loop 02** — overnight flow `31%` above expected range; possible return valve issue.
- **Calgary Assembly · Compressed Air Main** — off-shift base load `18%` above baseline.
- **Trois-Rivières Mill · Boiler House** — energy intensity `9%` above production-normalized baseline.

The detail drawer must distinguish:

- **Observed fact** — what the sensor measured;
- **Detection logic** — why it was flagged;
- **Possible cause** — explicitly labelled as a hypothesis;
- **Next action** — inspect, assign, monitor, or dismiss;
- **Verification** — what data will confirm resolution.

### 7.4 Actions

Purpose: translate evidence into accountable work without pretending that the prototype contains a real recommendation engine.

Each action includes:

- title and site;
- evidence source;
- expected reduction in operational units;
- estimated annual value in CAD;
- effort and disruption level;
- assigned owner;
- due date and maintenance window;
- state: Proposed, Under review, Approved, Scheduled, Implemented, Verified;
- confidence and calculation method.

Example:

> Inspect Cooling Loop 02 return valve  
> Estimated opportunity: 14,800 m³/year · CAD 38,400/year  
> Evidence confidence: High · Result not yet verified

### 7.5 Performance

Purpose: give leadership a twelve-month view of verified operational outcomes.

Modules:

- verified savings year to date in resource units and CAD;
- progress against an internal or contractual target;
- twelve-month trend;
- site comparison normalized by production;
- verified savings versus unverified opportunity;
- implementation rate and time-to-verification.

Avoid a generic “ESG score”. Show measurable operational results instead.

### 7.6 Reporting

Purpose: prepare traceable data for external reporting without claiming that Halveo itself certifies compliance.

Modules:

- reporting period and organizational boundary;
- consolidated water, energy, and optional emissions totals;
- year-over-year comparison;
- data coverage and methodology;
- audit trail;
- export preview;
- disclosure mapping.

Initial mapping options:

- GRI 303 — Water and Effluents;
- GRI energy disclosures where appropriate;
- CDP Water Security;
- CSDS 1 and CSDS 2 readiness references;
- federal GHGRP readiness only if the emissions module is enabled.

Every mapping must be labelled **“Reporting readiness”** or **“Disclosure mapping”**, never “Compliant” or “Certified”. Canadian CSDS standards are voluntary unless adopted by regulators, and federal GHGRP applicability depends on facility-specific criteria.

### 7.7 Data Sources

Purpose: turn “quiet reliability” into a visible product feature.

Modules:

- connected meters and systems;
- last reading and expected interval;
- calibration status;
- completeness;
- method: sensor, imported, manual, or estimated;
- data lineage;
- synchronization history;
- issue log.

## 8. Demonstration data model

Use deterministic TypeScript fixtures, never random values that change on reload.

Core entities:

- `Organization`
- `Site`
- `Resource`
- `Asset`
- `Meter`
- `Measurement`
- `Baseline`
- `ProductionOutput`
- `Anomaly`
- `Action`
- `SavingsRecord`
- `Target`
- `DataQualityRecord`
- `AuditEvent`
- `DisclosureMapping`

Important modelling rules:

- every measurement includes site-local timestamp, unit, method, and quality status;
- baselines are site-specific and explain their comparison window;
- production-normalized metrics are separate from absolute totals;
- monetary impact includes currency and assumption source;
- estimated opportunity and verified savings use different data types and visual treatments;
- disclosure mappings include framework version and “informational only” metadata.

A `DataProvider` interface will isolate the UI from its source. The prototype uses `MockDataProvider`; a future implementation could replace it with REST, GraphQL, or streaming endpoints without rewriting the views.

## 9. Visual system

### Colour tokens

The consolidated identity establishes the principal product palette:

| Token | Value | Use |
|---|---|---|
| Carbon Black | `#0A0A0A` | Main application background and high-contrast marks |
| Halveo Slate | `#536977` | Brand accent, selected data, focus, and active states |
| Mineral White | `#E5E4E2` | Primary text and light-mode surfaces |

Secondary surfaces, borders, muted text, and chart series should be derived from these three core colours through controlled opacity and tonal variation. The system must not import the exploratory blue, copper, graphite, or paper colours from the initial deck.

Semantic status colours should be introduced separately and checked for contrast. Green is used only for verified positive outcomes; amber for attention; red for critical conditions. None becomes a dominant brand colour.

### Typography

- **Schibsted Grotesk** — the single primary typeface for interface, data, navigation, controls, tables, headings, and portfolio presentation moments.
- Load it through Google Fonts with resilient local sans-serif fallbacks.
- Use weight, size, spacing, case, and alignment — rather than a second font family — to separate editorial and operational voices.
- Use tabular numerals for measurements, currency, timestamps, and deltas.
- Reserve stronger weights for decisions and alerts; regular and medium weights should carry most of the interface.

### Layout language

- precise modular grid with occasional asymmetric spans;
- one dominant analytical chart per view;
- thin dividers rather than card shadows;
- low-radius or nearly square containers, echoing technical equipment;
- generous outer margins with controlled internal density;
- flow lines used as data-bearing motifs, never decorative waves;
- charts use Signal Blue for observed/current values and quieter neutrals for context.

### Signature visual idea

The memorable product element should be a **measured aperture** derived from the negative space between the two halves of the Halveo symbol. It can frame comparisons, reveal selected data, or mark the passage from observed condition to verified outcome without altering the original logo geometry.

## 10. Motion system

### Personality

**Corporate with a premium material quality.** The interface should feel like rigid, calibrated equipment rather than a playful consumer app.

Motion constants:

- signature easing: `cubic-bezier(0.2, 0, 0, 1)`;
- quick: `120ms`;
- standard: `240ms`;
- slow: `480ms`;
- standard entrance: `12px` vertical offset + opacity, no bounce;
- stagger: `30–45ms`, capped below `300ms` for dashboard groups.

### Library responsibilities

| Tool | Responsibility |
|---|---|
| CSS | Focus, colour, simple hover, skeleton, and non-spatial feedback |
| Motion | React state transitions, drawers, filters, presence, layout changes, and accessible gesture feedback |
| GSAP | One-time opening choreography and optional guided portfolio tour |
| Anime.js | Controlled movement of the symbol halves and telemetry traces using granular imports |
| Three.js | Optional, lazy-loaded ambient data field in the opening or header only |

Rules:

- no two libraries animate the same component;
- no scroll-jacking;
- no perpetual animation behind dense data;
- no elastic overshoot for operational controls;
- animate `transform` and `opacity` whenever possible;
- respect `prefers-reduced-motion` across every tool;
- disable the Three.js layer on small screens, coarse pointers, reduced motion, or weak rendering capability;
- the static fallback must preserve the complete message;
- motion should communicate measurement, comparison, correction, and verification.

### Opening sequence

The first load may use a 700–900 ms sequence:

1. the two halves of the Halveo symbol form the central aperture;
2. the primary operational value is revealed through that aperture;
3. the expected range and observed series appear;
4. the main value settles;
5. supporting cards enter in a short cascade.

This sequence runs once per session and is skipped for reduced motion.

## 11. Technical architecture

| Layer | Choice | Reason |
|---|---|---|
| Document | Semantic HTML5 | Accessible landmarks and durable information structure |
| Application | React + TypeScript | Component states, reusable views, and typed contracts |
| Build | Vite | Fast local development and optimized static output |
| Styling | CSS Modules + CSS custom properties | Brand-specific system without generic utility styling |
| Charts | Apache ECharts with HTML summaries | Dense industrial visualization and interactive comparison |
| Icons | Small curated Lucide subset | Consistency without visual noise |
| State | React Context + local reducers | Sufficient for the front-end prototype |
| Localization | `Intl` APIs + structured copy dictionaries | Correct `en-CA` formatting and future `fr-CA` path |
| Data | TypeScript fixtures + mock service | Deterministic portfolio scenario |
| Persistence | `localStorage` | Demo preferences and action states only |
| Quality | Vitest, Testing Library, Playwright | Logic, interactions, accessibility, and visual verification |

Suggested structure:

```text
dashboard/
├─ assets/                  # Original Halveo SVG assets
├─ id base/                 # Original visual references
├─ src/
│  ├─ app/                  # Shell, routes, providers
│  ├─ components/           # Shared product components
│  ├─ features/             # Overview, Operations, Anomalies, Actions...
│  ├─ charts/               # Chart wrappers and accessible summaries
│  ├─ data/                 # Canadian demo fixtures and MockDataProvider
│  ├─ i18n/                 # en-CA copy and locale infrastructure
│  ├─ motion/               # Motion tokens and library boundaries
│  ├─ styles/               # Brand tokens, reset, layout, themes
│  ├─ types/                # Domain contracts
│  └─ main.tsx
├─ tests/
├─ index.html
├─ package.json
└─ vite.config.ts
```

## 12. Step-by-step development plan

### Phase 0 — Lock the case narrative

1. Confirm North Basin Manufacturing as the fictional client name or replace it.
2. Confirm the three Canadian sites and primary industry.
3. Approve English-only v1 with `fr-CA` architecture but no French copy.
4. Decide whether Actions appears as a full module or “Preview”.
5. Freeze the primary portfolio walkthrough.

**Output:** one-page product scenario and approved demo assumptions.

### Phase 1 — Establish the project

1. Initialize Vite, React, and TypeScript inside `dashboard/`.
2. Preserve all original identity and briefing files.
3. Add lint, build, unit-test, and browser-test scripts.
4. Install dependencies with fixed lockfile versions.
5. Add routing and the initial `en-CA` locale provider.

**Acceptance:** development server and production build run without errors.

### Phase 2 — Build the brand-to-product design system

1. Translate the consolidated identity colours into semantic design tokens.
2. Load Schibsted Grotesk through Google Fonts with resilient fallbacks.
3. Define type, spacing, radius, border, elevation, and chart scales.
4. Create states for focus, selected, loading, stale, empty, missing, warning, and error.
5. Build an internal reference page for components and data states.

**Acceptance:** all tokens and states are visible, reusable, and pass initial contrast checks.

### Phase 3 — Create the responsive application shell

1. Build sidebar, header, context selectors, and mobile navigation.
2. Implement the 12/8/1-column responsive system.
3. Add keyboard navigation, skip link, and focus management.
4. Integrate the correct logo variant for each surface.
5. Establish loading and route-transition patterns.

**Acceptance:** stable layouts at 360, 768, 1024, and 1440 px.

### Phase 4 — Create the Canadian demo dataset

1. Implement domain types and deterministic fixtures.
2. Model the three sites, resources, meters, baselines, and production output.
3. Create anomaly, action, savings, and audit histories.
4. Add local timestamps, CAD values, and metric units.
5. Add incomplete, stale, manual, and estimated readings.
6. Implement `MockDataProvider` with controlled latency and error scenarios.

**Acceptance:** every visible number can be traced to one fixture and calculation.

### Phase 5 — Build Overview and shared filters

1. Implement organization, site, resource, period, and granularity filters.
2. Build the four primary operational metrics.
3. Build observed-vs-expected time series.
4. Add site comparison and active-anomaly ranking.
5. Ensure all dependent modules update together.
6. Add accessible HTML summaries for visualizations.

**Acceptance:** the viewer can identify the most important operational deviation in under three interactions.

### Phase 6 — Build Operations and Data Sources

1. Add organization-to-equipment drill-down.
2. Add baseline and production normalization controls.
3. Create meter detail, provenance, and calibration panels.
4. Implement quality-state filtering.
5. Add responsive chart and table alternatives.

**Acceptance:** a measurement’s value, origin, quality, and comparison method are discoverable from the same flow.

### Phase 7 — Build Anomalies and Actions

1. Create ranked anomaly list and filters.
2. Build the anomaly investigation drawer.
3. Add front-end status changes and assignment.
4. Link each action to its source evidence.
5. Separate estimated opportunity from verified outcome.
6. Persist demo workflow changes locally.

**Acceptance:** a user can review, assign, schedule, and verify a simulated issue without reloading.

### Phase 8 — Build Performance and Reporting

1. Add twelve-month verified savings and target progress.
2. Build production-normalized site comparison.
3. Create the reporting boundary and methodology summary.
4. Add disclosure mapping and audit trail.
5. Export client-side CSV/JSON with ISO timestamps and explicit units.
6. Add “demo data” and “informational mapping” notices.

**Acceptance:** leadership and reporting users receive distinct views derived from the same source of truth.

### Phase 9 — Apply the motion language

1. Implement shared motion tokens.
2. Apply Motion to React state and presence transitions.
3. Build the single GSAP opening timeline.
4. Use Anime.js for the correcting flow-line signature.
5. Add the isolated Three.js layer with static fallback.
6. Implement reduced-motion, cleanup, and device fallbacks.

**Acceptance:** the full product remains usable with all non-essential animation disabled.

### Phase 10 — Portfolio walkthrough

1. Add an optional **Guided demo** entry point.
2. Script a 90–120 second product story:
   - detect Hamilton’s overnight water deviation;
   - inspect the evidence and data confidence;
   - assign the valve inspection action;
   - compare estimated opportunity with later verified savings;
   - show how the same data supports reporting readiness.
3. Keep the guided layer separate from normal product navigation.
4. Add discreet “Fictional case study · Demo data” labelling.

**Acceptance:** an international reviewer can understand the product strategy without verbal explanation.

### Phase 11 — Accessibility, testing, and performance

1. Test calculations and formatters.
2. Test filter propagation and workflow states.
3. Test the three audience flows end to end.
4. Capture visual regressions at key breakpoints.
5. Audit keyboard, focus, contrast, zoom, and reduced motion.
6. Lazy-load charts, Three.js, and non-critical routes.
7. Check memory cleanup for every motion engine.
8. Verify current Chrome, Edge, Firefox, and Safari behaviour where available.

**Acceptance:** zero build errors, zero horizontal overflow, complete keyboard access, and no critical action encoded by colour alone.

### Phase 12 — Package the case

1. Write an English README with setup and architecture.
2. Document the fictional dataset and calculation assumptions.
3. Document the brand-to-interface decisions.
4. Explain how `MockDataProvider` would be replaced by a real API.
5. Generate the static production build in `dist/`.
6. Capture final desktop, tablet, mobile, and motion stills for the portfolio.

**Acceptance:** another person can run, assess, and present the prototype without additional explanation.

## 13. Priority component list

- `AppShell`, `Sidebar`, `GlobalHeader`, `MobileNav`
- `OrganizationSelector`, `SiteSelector`, `ResourceSelector`, `PeriodSelector`
- `OperationalMetric`, `DeltaIndicator`, `DataConfidenceBadge`
- `ObservedExpectedChart`, `SiteComparisonChart`, `ProductionOverlay`
- `AnomalyList`, `SeverityLabel`, `AnomalyInvestigationDrawer`
- `ActionCard`, `ImpactEstimate`, `VerificationStatus`
- `SavingsSummary`, `TargetProgress`, `OpportunityBreakdown`
- `DataSourceTable`, `ProvenancePanel`, `CalibrationStatus`
- `ReportingBoundary`, `DisclosureMapping`, `AuditTrail`, `ExportPanel`
- `LoadingState`, `EmptyState`, `StaleState`, `MissingDataState`, `ErrorState`
- `GuidedDemoController`

## 14. Success criteria

- The interface communicates Measure → Compare → Explain → Act → Verify without relying on marketing copy.
- Raw data and variance appear before interpretation.
- Facts, hypotheses, estimates, and verified results are visually distinct.
- The Canadian scenario feels specific rather than cosmetically localized.
- The brand is recognizable without the logo because colour, typography, language, and motion behave consistently.
- The three audiences use one data model without feeling like the same dashboard duplicated three times.
- The measured aperture becomes a memorable link between the Halveo symbol and the product experience.
- The guided demo tells a complete portfolio story in no more than two minutes.
- The interface works without WebGL and with reduced motion enabled.
- No screen implies real customers, real savings, certification, or regulatory compliance.

## 15. Out of scope

- real authentication and authorization;
- real industrial integrations, sensors, SCADA, or ERP connections;
- database or streaming infrastructure;
- actual anomaly detection or recommendation models;
- certified ESG or regulatory submissions;
- official financial, tariff, emissions, or compliance calculations;
- full French Canadian localization;
- production hosting unless requested separately.

## 16. Decisions to confirm

Recommended defaults are included so development can proceed without blocking:

1. **Fictional client:** North Basin Manufacturing — recommended default.
2. **Industry:** diversified industrial manufacturing — recommended default; food processing is a stronger alternative if water should dominate the story.
3. **Sites:** Hamilton ON, Trois-Rivières QC, and Calgary AB — recommended default.
4. **Language:** English-only v1 with future `fr-CA` structure — recommended default.
5. **Actions module:** full simulated workflow, clearly identified as prototype logic — recommended default.
6. **Reporting:** GRI 303, CDP Water Security, and CSDS readiness mapping; GHGRP only as optional emissions readiness — recommended default.
7. **Default landing view:** Overview with operational priority — recommended default.

## 17. Suggested delivery milestones

- **Milestone 1 — Product foundation:** scenario, design system, shell, and fixtures.
- **Milestone 2 — Operational core:** Overview, Operations, Data Sources, and Anomalies.
- **Milestone 3 — Decision workflow:** Actions, verification, and local persistence.
- **Milestone 4 — Enterprise views:** Performance and Reporting.
- **Milestone 5 — Portfolio finish:** signature motion, guided demo, responsive refinement, and QA.

Indicative effort for one careful implementation pass: **7–10 focused working days**, with the largest variability in chart refinement, motion, and browser QA.

## 18. Verified context references

- [Statistics Canada — water use parameters in manufacturing industries](https://www150.statcan.gc.ca/n1/en/catalogue/3810003801)
- [Government of Canada — water use in Canada](https://www.canada.ca/en/environment-climate-change/services/environmental-indicators/water-use.html)
- [Government of Canada — facility greenhouse gas reporting](https://www.canada.ca/en/environment-climate-change/services/climate-change/greenhouse-gas-emissions/facility-reporting/reporting.html)
- [CPA Ontario — Canadian Sustainability Disclosure Standards](https://www.cpaontario.ca/sustainability/sustainability-reporting-standards/csds-sustainability-reporting-standards)
- [GRI — Water and Effluents 303](https://www.globalreporting.org/standards/standards-development/topic-standard-for-water-and-effluents-gri-303/)
- [CDP — disclosure guidance](https://www.cdp.net/en/disclose/how-to-disclose)
- [Motion — React installation](https://motion.dev/docs/react-installation)
- [Motion — reduced motion](https://motion.dev/docs/react-use-reduced-motion)
- [GSAP — installation](https://gsap.com/docs/v3/Installation/)
- [GSAP — responsive and reduced-motion animation](https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/)
- [Three.js — npm and Vite installation](https://threejs.org/manual/pages/installation.html)
- [Anime.js — ES module installation](https://animejs.com/documentation/getting-started/installation/)
