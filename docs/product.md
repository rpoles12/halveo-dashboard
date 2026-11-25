# Halveo product guide

This document describes the shipped portfolio prototype. Early strategic proposals are retained in `archive/`; they are not implementation specifications.

## Positioning

Halveo is operational resource intelligence for industrial teams. The fictional brand evolves EcoSense's periodic consulting model into recurring visibility over resource use. Environmental improvement is an outcome of operational precision. The interface puts measured quantities and comparison context before interpretation.

The decision model is **Measure → Compare → Explain → Act → Verify**. Verification extends the original strategic model to close the loop between a recommendation and an outcome.

## Audiences and demonstration scenario

| Audience | Decision supported |
| --- | --- |
| Operations lead | Locate demand drift, inspect evidence and organize a next action |
| Executive | Understand estimated opportunity, implemented work and measured outcomes |
| Reporting team | Inspect sources, boundaries, quality and evidence readiness |

North Basin Manufacturing is a fictional Canadian industrial group. Hamilton Works (ON), Trois-Rivières Mill (QC) and Calgary Assembly (AB) provide different resource profiles. All operators and owners are fictional. The interface uses `en-CA`, Canadian currency, metric units and illustrative EDT/MDT timestamps. Dates and “updated” labels belong to a fixed demonstration scenario; no telemetry is polled.

## Current modules

| Module | Implemented | Data boundary |
| --- | --- | --- |
| Overview | Site/resource selection, period toggle, demand, variance, anomaly count, expected range, opportunity mix and savings chart | Deterministic generated series; scaled fixture values |
| Operations | Site/resource series, asset search, empty state, methodology disclosure and quality labels | Asset tables change by resource, not by site; methodology is illustrative copy |
| Anomalies | All / High / Medium / Low filters; detail drawer; create action | Five static anomalies, confidence and hypotheses |
| Actions | Six-state workflow, reuse of linked actions, new investigation action, local persistence | Browser-only status changes; owner/due fields are display values |
| Performance | Twelve-month chart, savings, target and value classification | Static demonstration totals; not derived from edited actions |
| Reports | Boundary, mappings, fixture audit events and downloadable CSV | Two fixed CSV rows; no obligation assessment or certification |
| Data Sources | Source list, cadence, coverage and quality | Five fixture sources; no connectors or health checks |
| Settings | Compact density, guided-demo offer, motion and locale information | First two preferences persist; motion follows OS; locale is informational |

The global site/resource filters are present only in Overview and Operations. Primary navigation holds five views; Reports, Data Sources and Settings sit in the More menu. Notifications route to Anomalies or Data Sources. A guided five-step narrative routes through Overview, Anomalies, Actions, Performance and Reports.

## Action workflow

`Proposed → Under review → Approved → Scheduled → Implemented → Verified`

Creating an action from an anomaly checks for a matching `anomalyId`. If one already exists, the application opens Actions without duplicating it. Otherwise it prepends an unassigned investigation with a zero estimated value and pending validation. Each button advances one state; Verified disables further advancement. Browser storage retains the array.

“Verify result” is a simulated state transition. The displayed verification rule is explanatory content, not an algorithm that analyzes an observation window. The static Performance panel does not change with action status.

## Evidence language

| Classification | Meaning in the experience |
| --- | --- |
| Observed fact | A demand deviation shown as a fixture observation |
| Possible cause / hypothesis | An explanation that still requires investigation |
| Estimated opportunity | A potential reduction or annual value |
| Implemented / measuring | An intervention awaiting an observation window |
| Verified savings | A separately displayed, fictional measured-outcome category |

The wording intentionally avoids presenting an estimated opportunity as an achieved result. All classifications are simulated in this prototype.

## Implementation boundaries

No backend, account system, role-based access, live IoT/SCADA/ERP integration, anomaly-detection service or compliance engine is shipped. The source metadata, comparison confidence and audit trail are fixtures. Charts illustrate interaction and visual hierarchy, rather than an audited analytical model. Hourly, daily and annual values are not a reconciled financial dataset. For example, resource curves use simplified scaling factors, and monthly savings are rounded.

Local storage has no migration, cross-device synchronization or concurrency model. A malformed saved action JSON value can prevent startup; reset the three documented keys to return to a clean demonstration. Accessibility support includes a skip link, visible focus, labelled filters and reduced-motion handling, but modal focus management and a complete assistive-technology audit remain future work.

## Roadmap

1. Extract views, charts, domain types and storage into dedicated modules; consolidate layered CSS overrides.
2. Replace illustrative scaling and static totals with one consistent domain model and tested units, periods and aggregation rules.
3. Add validated storage, schema migrations and a real service/API boundary.
4. Implement accounts, permissions, industrial connectors and server-side audit records.
5. Make verification depend on measured post-intervention observations.
6. Finish keyboard/focus management, chart alternatives and assistive-technology testing.
7. Optimize chart imports and large lazy-loaded chunks; add broader automated coverage.

The early MVP sequencing and commercial/reporting-framework questions in the archived documents remain historical product proposals, not promises of functionality.
