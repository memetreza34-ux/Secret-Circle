# Secret Circle – A-bis-Z Entwicklungsstatus

Stand: 19. August 2026

Operativer Fortschrittstracker zu `APP_ENTWICKLUNG_VON_A_BIS_Z.md`.

## Gesamtstatus

**Öffentliche Releasefreigabe: NO_GO**  
**Offline-Core: `secret-circle-v43`**  
**Classic Content: v4**

Technisch weit fortgeschritten: 15 priorisierte Core-Games, quantitative Contentziele, 15/15 Core-Quellreview, Exact-once-Sessions, sichere Resume-/Timerpfade, Registry-v2-Backups, Accessibility-Basis, Legal-/Support-/Incident-/Maintenance-/Environment-Verträge sowie jetzt ein reproduzierbarer npm-Lockfile-Vertrag.

Neu:

- v41: physischer Reference-Source-Pass
- v42: PWA-Iconvertrag repariert
- v43: Private-Device-Prompts physisch aus Basiskatalog entfernt + globaler Privacy-Source-Audit
- Branch-Protection-Vertrag + statischer Audit
- reproduzierbarer HTTPS-Staging-/Production-Smoke + Contract-Audit
- **`package-lock.json` v3 + `npm ci` in beiden Workflows**
- `scripts/lockfile_contract_audit.py`
- Foundation-Audit auf Registry v2 / aktuelle Releasearchitektur erneuert
- `scripts/release_readiness_contract_audit.py` als Querschnittsgate

## A-bis-Z-Tracker

| # | Bereich | Status | Hauptnachweis | Nächste Aktion |
|---|---|---|---|---|
| 0 | Produktziel / Releasegrenze | DONE | Product Brief, Release Scope | bei Scopeänderung aktualisieren |
| A | Querschnittsverträge | PREPARED | Master, Foundation v2, Readiness Meta-Audit | reale Gates schließen |
| 1 | Discovery / Nutzer / Markt | DONE | Product Brief, Scenarios, Market Research | bei Produktänderung aktualisieren |
| 2 | Produktstrategie / Scope | PREPARED | Scope, Roadmap | reale Nutzer validieren |
| 3 | Plattformstrategie | PREPARED | `PLATFORM_STRATEGY.md` | reale Zielgeräte |
| 4 | Requirements / Akzeptanz | PREPARED | Requirements, Core Contracts | Traceability real schließen |
| 5 | UX / IA / Design | PREPARED | UX Flow, Design System | reale UX-Tests |
| 6 | Architektur / ADR | PREPARED | `ARCHITECTURE.md` | ADRs bei Grundsatzentscheidungen |
| 7 | Security / Threat Model | PREPARED | Security, Threat Model, Registry v2 | Runner + echter Browser |
| 8 | Repo / Git / Build | BLOCKED | Lockfile v3, npm-ci-Workflows, Branch Contract | Online-`npm ci`, Runner, GitHub-Schutz real |
| 9 | Feature-Entwicklungsloop | PREPARED | Tests/Contracts/PR #13 | Restarbeit nach Guide |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Backup-/Session-/PWA-Verträge | Quota-/Updateabnahme real |
| 11 | Tests / CI | BLOCKED | Testmatrix/Workflows | funktionierender Actions-Runner |
| 12 | Offline / PWA / Resume | PREPARED | Service Worker v43 | echte Geräte + alte→neue Updates |
| 13 | Content / Alter / Privacy | IN PROGRESS | Content-Wellen, 15/15 Review, Privacy-Audit | Runner + reale Gruppen + manueller Sign-off |
| 14 | Beta / reale Gruppen | PREPARED | `BETA_TEST_PLAN.md` | G1–G5 + PN1–PN3 real |
| 15 | Datenschutz / Recht / Support | PREPARED | Privacy, Legal, Support | echte Betreiber-/Hostingangaben |
| 16 | Release Management / RC | PREPARED | Roadmap/Checklist/Readiness-Audit | nach realen Gates |
| 17 | Deployment / Environments | PREPARED | Deployment, Environments, Staging-Smoke | echte HTTPS-Origin + Smoke + Rollback real |
| 18 | Operations / Incident | PREPARED | Support + Incident Response | Verantwortliche + Probeincident |
| 19 | Wartung / Migration | PREPARED | Maintenance, Backups, Changelog | operative Routine real |
| 20 | Risk Management | IN PROGRESS | `RISK_REGISTER.md` | laufend aktualisieren |
| 21 | Accessibility | PREPARED | Contract + E2E-Suite | 200 %, VoiceOver, TalkBack, Geräte |
| 22 | Third Party / Assetrechte | IN PROGRESS | Lockfile-Inventar + Asset-Provenienz | Online-Install, Root-SVG-Rechte |
| 23 | Fan-/Referenzcontent | IN PROGRESS | Fan Review + Reference-Audit | Runner + manuelle Visual/Legal-Abnahme |

## Reproduzierbarer Build

Im Repository vorhanden:

- `package-lock.json` v3
- `@playwright/test` / `playwright` / `playwright-core` exakt 1.54.2
- optional `fsevents` 2.3.2
- feste Registry-URLs + `sha512`-Integrities
- beide Workflows verwenden `npm ci`
- Dependencygraph/Lizenzen gegen offizielle Upstream-Tags geprüft
- `scripts/lockfile_contract_audit.py` in `npm run validate`

Ein Offline-`npm ci`-Strukturcheck akzeptierte Package-/Lock-Synchronität und scheiterte erst an `ENOTCACHED` für fehlende Tarballs.

Status: **CLOSED IN CODE / ONLINE RUNNER VERIFICATION OPEN**.

## Foundation / Audit-Drift

Der alte Foundation-Audit verlangte historisch Registry v1 und duplizierte Backup-Limits. Er wurde durch einen aktuellen Foundation-v2-Vertrag ersetzt:

- Registry v2 als zentrale Complete-Backup-Policy
- keine hardcodierte Complete-Policy in `party-data-tools.js`
- Session/Resume/Timer/PWA/Filter/Search-Basis
- Lockfile-/Branch-/Staging-/Privacy-/Reference-Gates

`release_readiness_contract_audit.py` verbindet die wichtigsten Querschnittsgates und hält reale Nachweise ausdrücklich offen.

## HTTPS-Staging / Production-Smoke

Vorbereitet: `scripts/staging_smoke.py`, Contract-Audit und `npm run staging:smoke`.

Status: **PREPARED / reale URL und Netzwerkausführung offen**. Browser-only PWA-/Offline-/Update-/Geräteverhalten bleibt separat real zu testen.

## CI

`CI_TROUBLESHOOTING.md` führt den jeweils neuesten Actions-Befund. Bisher erreichen Jobs wiederholt keine Repository-Steps (`steps: []`). Der neue Lockfile-/`npm ci`-Stand ist deshalb noch nicht auf Actions gelaufen.

## Höchste Prioritäten

1. GitHub-Actions-Runner / echter Checkout + sichtbare Steps
2. Online-`npm ci` + `npm run ci` auf unverändertem Commit
3. Branch Protection / Required Checks tatsächlich bestätigen
4. alle neuen Querschnittsaudits tatsächlich grün ausführen
5. konkrete HTTPS-Staging-Origin + echter Netzwerk-Smoke
6. finale Rechtebasis für `icon.svg`
7. manueller Extended/Labs-/Marketing-/Visual-Rechtepass
8. reale PWA-Upgrade-/Rollback-/Gerätetests
9. reale Accessibilitytests
10. reale Gruppentests
11. Betreiber-/Support-/Hostingangaben
12. Incident-Drill
13. finaler RC

## Nicht als bestanden behaupten

- Online-`npm ci` / `npm run ci` / Cross-Browser
- Branch-Protection-Konfiguration
- neue Audits auf GitHub Actions
- echter HTTPS-Staging-Smoke
- v43-Update auf real installierter PWA
- reales Installationsicon auf Zielplattformen
- Registry-v2-Import im echten Browser
- VoiceOver/TalkBack/200-%-Zoom
- Beta-/Gruppentests
- Root-SVG-/Third-Party-/Assetrechte final
- Legal/Support final
