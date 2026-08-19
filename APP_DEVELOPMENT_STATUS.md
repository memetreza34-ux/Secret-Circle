# Secret Circle – A-bis-Z Entwicklungsstatus

Stand: 19. August 2026

Operativer Fortschrittstracker zu `APP_ENTWICKLUNG_VON_A_BIS_Z.md`.

## Gesamtstatus

**Öffentliche Releasefreigabe: NO_GO**  
**Offline-Core: `secret-circle-v43`**  
**Classic Content: v4**

Technisch weit fortgeschritten: 15 priorisierte Core-Games, quantitative Contentziele, 15/15 Core-Quellreview, Exact-once-Sessions, sichere Resume-/Timerpfade, Registry-v2-Backups, Accessibility-Basis sowie Legal-/Support-/Incident-/Maintenance-/Environment-Verträge.

Neu:

- v41: physischer Reference-Source-Pass
- v42: PWA-Iconvertrag repariert
- v43: zwei Private-Device-Truth/Dare-Prompts physisch aus dem Basiskatalog entfernt und globaler Privacy-Content-Source-Audit ergänzt
- `BRANCH_PROTECTION.md` plus Contract-Audit definiert den zukünftigen Required-Check-Vertrag

## A-bis-Z-Tracker

| # | Bereich | Status | Hauptnachweis | Nächste Aktion |
|---|---|---|---|---|
| 0 | Produktziel / Releasegrenze | DONE | Product Brief, Release Scope | bei Scopeänderung aktualisieren |
| A | Querschnittsverträge | PREPARED | Master, Architektur, Security, Requirements | reale Gates schließen |
| 1 | Discovery / Nutzer / Markt | DONE | Product Brief, Scenarios, Market Research | bei Produktänderung aktualisieren |
| 2 | Produktstrategie / Scope | PREPARED | Scope, Roadmap | reale Nutzer validieren |
| 3 | Plattformstrategie | PREPARED | `PLATFORM_STRATEGY.md` | reale Zielgeräte |
| 4 | Requirements / Akzeptanz | PREPARED | Requirements, Core Contracts | Traceability real schließen |
| 5 | UX / IA / Design | PREPARED | UX Flow, Design System | reale UX-Tests |
| 6 | Architektur / ADR | PREPARED | `ARCHITECTURE.md` | ADRs bei Grundsatzentscheidungen |
| 7 | Security / Threat Model | PREPARED | Security, Threat Model, Registry v2 | Runner + echter Browser |
| 8 | Repo / Git / Build | BLOCKED | Workflows, `BRANCH_PROTECTION.md` | Runner, Lockfile, `npm ci`, GitHub-Schutz aktivieren |
| 9 | Feature-Entwicklungsloop | PREPARED | Tests/Contracts/PR #13 | Restarbeit nach Guide |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Backup-/Session-/PWA-Verträge | Quota-/Updateabnahme real |
| 11 | Tests / CI | BLOCKED | Testmatrix/Workflows | funktionierender Actions-Runner |
| 12 | Offline / PWA / Resume | PREPARED | Service Worker v43 | echte Geräte + alte→neue Updates |
| 13 | Content / Alter / Privacy | IN PROGRESS | Content-Wellen, 15/15 Review, Privacy-Audit | Runner + reale Gruppen + manueller Sign-off |
| 14 | Beta / reale Gruppen | PREPARED | `BETA_TEST_PLAN.md` | G1–G5 + PN1–PN3 real |
| 15 | Datenschutz / Recht / Support | PREPARED | Privacy, Legal, Support | echte Betreiber-/Hostingangaben |
| 16 | Release Management / RC | PREPARED | Roadmap/Checklist | nach Gates |
| 17 | Deployment / Environments | PREPARED | Deployment + Environments | HTTPS-Staging + Rollback real |
| 18 | Operations / Incident | PREPARED | Support + Incident Response | Verantwortliche + Probeincident |
| 19 | Wartung / Migration | PREPARED | Maintenance, Backups, Changelog | operative Routine real |
| 20 | Risk Management | IN PROGRESS | `RISK_REGISTER.md` | laufend aktualisieren |
| 21 | Accessibility | PREPARED | Contract + E2E-Suite | 200 %, VoiceOver, TalkBack, Geräte |
| 22 | Third Party / Assetrechte | IN PROGRESS | Third Party + Asset-Provenienz | Root-SVG-Rechte + Lockfile-Inventar |
| 23 | Fan-/Referenzcontent | IN PROGRESS | Fan Review + Reference-Audit | Runner + manuelle Visual/Legal-Abnahme |

## v43 – Privacy Source Hardening

Die beiden früheren Privacy-Funde stehen nicht mehr im spielbaren Basiskatalog:

- Kamerarollen-Frage entfernt
- Pflicht zum Vorlesen der letzten Handy-Nachricht entfernt
- harmlose Ersatztexte direkt in `party-catalog.js`
- `scripts/privacy_content_audit.py` scannt acht ausgelieferte Contentquellen
- private Chats/Nachrichten, Fotos/Kamerarolle, Passwörter, Adresse, Telefonnummer, Standort und Kontodaten sind als verpflichtendes Built-in-Spielmaterial source-level geschützt

Der Audit ist in `npm run validate`, aber wegen des externen Runnerblockers noch nicht als ausgeführter PASS dokumentiert.

## Branch Protection

Vorbereitet:

- `BRANCH_PROTECTION.md`
- `scripts/branch_protection_contract_audit.py`
- gewünschter Required Check: `Secret Circle CI / validate`
- Cross-Browser bleibt bei aktuellem manuellen Trigger separater RC-Gate

Tatsächliche GitHub-Konfiguration: **noch nicht belastbar bestätigt**.

## PWA / Assets

- Cache: `secret-circle-v43`
- Staging-Cache: `secret-circle-v43-staging`
- v42-PNGs technisch korrekt 192×192 / 512×512
- Root-SVG-Rechtebasis bleibt `unresolved`
- reale Installations-/Update-/Rollbacktests offen

## CI / Lockfile

`CI_TROUBLESHOOTING.md` führt den jeweils neuesten Actions-Befund. Wiederholt erreichen Jobs keine Repository-Steps (`steps: []`). Dadurch dürfen neue Audits/Tests weder als grün noch als negativ getestet bezeichnet werden.

`package-lock.json` fehlt weiterhin. Keine Integrity-Werte werden erfunden; final muss CI auf `npm ci` umgestellt werden.

## Höchste Prioritäten

1. GitHub-Actions-Runner / echter Checkout + sichtbare Steps
2. echtes `package-lock.json` + `npm ci`
3. Branch Protection / Required Checks tatsächlich bestätigen
4. Branch-/Privacy-/Reference-/Asset-Audits tatsächlich grün ausführen
5. finale Rechtebasis für `icon.svg`
6. manueller Extended/Labs-/Marketing-/Visual-Rechtepass
7. HTTPS-Staging
8. reale PWA-Upgrade-/Rollback-/Gerätetests
9. reale Accessibilitytests
10. reale Gruppentests
11. Betreiber-/Support-/Hostingangaben
12. Incident-Drill
13. finaler RC

## Nicht als bestanden behaupten

- `npm run ci` / Cross-Browser
- Branch-Protection-Konfiguration
- Privacy-/Reference-/Asset-Audits auf GitHub Actions
- v43-Update auf real installierter PWA
- korrektes Installationsicon auf realen Zielplattformen
- Registry-v2-Import im echten Browser
- VoiceOver/TalkBack/200-%-Zoom
- Beta-/Gruppentests
- Root-SVG-/Third-Party-/Assetrechte final
- Legal/Support final
- HTTPS-Staging
