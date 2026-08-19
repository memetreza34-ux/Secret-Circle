# Secret Circle – A-bis-Z Entwicklungsstatus

Stand: 19. August 2026

Operativer Fortschrittstracker zu `APP_ENTWICKLUNG_VON_A_BIS_Z.md`.

## Gesamtstatus

**Öffentliche Releasefreigabe: NO_GO**  
**Offline-Core: `secret-circle-v44`**  
**Classic Content: v4**

Technisch weit fortgeschritten: 15 priorisierte Core-Games, quantitative Contentziele, 15/15 Core-Quellreview, Exact-once-Sessions, sichere Resume-/Timerpfade, Registry-v2-Backups, Lockfile/npm-ci-Vertrag, source-level Privacy-/Reference-Schutz, PWA-Head-Vertrag, HTTPS-Smoke, Accessibility-/Legal-/Betriebsgrundlage und maschinenlesbarer Release-Evidence-Vertrag.

## A-bis-Z-Tracker

| # | Bereich | Status | Hauptnachweis | Nächste Aktion |
|---|---|---|---|---|
| 0 | Produktziel / Releasegrenze | DONE | Product Brief, Release Scope | bei Scopeänderung aktualisieren |
| A | Querschnittsverträge | PREPARED | Foundation + Readiness + Evidence | reale Gates schließen |
| 1 | Discovery / Nutzer / Markt | DONE | Brief, Scenarios, Market Research | reale Nutzer weiter validieren |
| 2 | Produktstrategie / Scope | PREPARED | Scope, Roadmap | reale Gruppen/Nutzer |
| 3 | Plattformstrategie | PREPARED | Platform Strategy | reale Zielgeräte |
| 4 | Requirements / Akzeptanz | PREPARED | Requirements, Core Contracts | Evidence auf RC binden |
| 5 | UX / IA / Design | PREPARED | UX Flow, Design System | reale UX-Tests |
| 6 | Architektur / ADR | PREPARED | `ARCHITECTURE.md` | bei Grundsatzänderung ADR |
| 7 | Security / Threat Model | PREPARED | Security, Threat Model, Registry v2 | Runner + echter Browser |
| 8 | Repo / Git / Build | BLOCKED | Lockfile v3, npm-ci-Workflows, Branch Contract | echter Runner + Branch Protection |
| 9 | Feature-Entwicklungsloop | PREPARED | Tests/Contracts/PR #13 | Restarbeit nach Guide |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Backup-/Session-/PWA-Verträge | reale Quota-/Updatepfade |
| 11 | Tests / CI | BLOCKED | Workflows/Testmatrix | funktionierender Actions-Runner |
| 12 | Offline / PWA / Resume | PREPARED | Service Worker v44 + PWA-Head-Test | echte Install-/Upgrade-/Rollbacktests |
| 13 | Content / Alter / Privacy | IN PROGRESS | Content-Wellen + Privacy-/Reference-Audits | reale Gruppen + finaler Sign-off |
| 14 | Beta / reale Gruppen | PREPARED | `BETA_TEST_PLAN.md` | G1–G5 + PN1–PN3 real |
| 15 | Datenschutz / Recht / Support | PREPARED | Privacy, Legal, Support | echte Betreiber-/Hostingangaben |
| 16 | Release Management / RC | PREPARED | Checklist + Release Evidence | unveränderlichen RC einfrieren |
| 17 | Deployment / Environments | PREPARED | Environment + HTTPS-Smoke | echte HTTPS-Origin + Browser/PWA-Smoke |
| 18 | Operations / Incident | PREPARED | Support + Incident Response | Verantwortliche + Drill |
| 19 | Wartung / Migration | PREPARED | Maintenance, Backups, Changelog | operative Routine real |
| 20 | Risk Management | IN PROGRESS | Risk Register | laufend aktualisieren |
| 21 | Accessibility | PREPARED | Contract + E2E + PWA-Head | 200 %, VoiceOver, TalkBack, Geräte |
| 22 | Third Party / Assetrechte | IN PROGRESS | Lockfile-Inventar + Provenienz | Root-SVG-Rechte + RC-Review |
| 23 | Fan-/Referenzcontent | IN PROGRESS | Fan Review + Source-Audit | Runner + manuelle Visual/Legal-Abnahme |
| 24 | Release Evidence | PREPARED | `release-evidence.json` + Audit | reale Belege auf einen RC sammeln |

## Build / Supply Chain

- `package-lock.json` v3
- gelockte Playwright-Testkette 1.54.2; optional `fsevents` 2.3.2
- feste Registry-URLs + `sha512`
- CI und Cross-Browser verwenden `npm ci`
- `scripts/lockfile_contract_audit.py`

Status: **CLOSED IN CODE / ONLINE RUNNER VERIFICATION OPEN**.

## PWA v44

Die fünf interaktiven Einstiegseiten Hub, Word Imposter, Creator, Advanced und Quick besitzen denselben Manifest-/iOS-/Icon-Vertrag. `tests/pwa-head-metadata.test.js` schützt lokal; `scripts/staging_smoke.py` prüft dieselben Metadaten später gegen ausgelieferte HTTPS-Seiten.

Cache: `secret-circle-v44` / `secret-circle-v44-staging`.

## Release Evidence

`release-evidence.json` steht aktuell auf **PREPARED / NO_GO**. `scripts/release_evidence_audit.py` verlangt für ein späteres GO:

- vollständigen RC-SHA/Tag/Cache/URLs
- 15 Pflichtgates PASS
- echten Beleg pro PASS
- exakt denselben RC-Commit pro Gate
- keine verbleibenden bekannten Blocker

## CI

Aktuellster vollständig geprüfter Lauf: **#2363** auf Head `81d26c7acc85c8ad6c4a20dcb1ea04128316291f`.

- `validate` failure
- `steps: []`
- kein Checkout / Online-`npm ci` / Repository-Code

Deshalb nichts Neues als runner-grün behaupten.

## Höchste Prioritäten

1. Actions-Runner / echter Checkout + Online-`npm ci`
2. vollständiges CI + Cross-Browser
3. Branch Protection tatsächlich bestätigen
4. konkrete HTTPS-Staging-Origin + echter Smoke
5. PWA Upgrade/Rollback + Installationsmetadaten auf realen Geräten
6. Android / iPhone / Tablet + Accessibility
7. reale Gruppentests
8. Root-SVG-Rechte + finaler Visual-/Third-Party-Pass
9. Betreiber-/Hosting-/Privacy-/Support-/Legalangaben
10. Incident-Drill
11. unveränderter RC
12. `release-evidence.json` auf FINAL/GO erst nach vollständiger Evidence

## Nicht als bestanden behaupten

Online-`npm ci`, CI/Cross-Browser, Branch Protection, HTTPS-Staging, reale PWA-/Geräte-/Accessibility-/Gruppentests, Root-SVG-/Legal-/Support-Sign-off und finaler Release Evidence GO sind weiterhin offen.