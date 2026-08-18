# Secret Circle – A-bis-Z Entwicklungsstatus

Stand: 18. August 2026

Operativer Fortschrittstracker zu `APP_ENTWICKLUNG_VON_A_BIS_Z.md`.

## Statuswerte

- **DONE** – für den aktuellen Entwicklungsstand abgeschlossen
- **IN PROGRESS** – aktiv in Bearbeitung
- **PREPARED** – Grundlage vorhanden, reale/finale Abnahme fehlt
- **OPEN** – noch nicht systematisch bearbeitet
- **BLOCKED** – externer oder technischer Blocker
- **N/A V1** – bewusst nicht Teil Januar 2027

## Gesamtstatus

**Öffentliche Releasefreigabe: NO_GO**  
**Offline-Core: `secret-circle-v41`**  
**Classic Content: v4**

Technisch weit fortgeschritten: 15 priorisierte Core-Games, quantitative Core-Contentziele, 15/15 Core-Quellreview, Exact-once-Sessions, sichere Resume-/Timerpfade, Registry-v2-Backups, Accessibility-Basis sowie Legal-/Support-/Incident-/Maintenance-/Environment-Verträge.

Neu im v41-Rechteblock:

- 40 konkrete Anime-Figuren physisch aus `party-mega-catalog.js` entfernt
- `wavelength` bleibt stabile ID, sichtbarer Titel upstream **Spektrum-Tipp**
- Browser-Tabu upstream `Tab` statt `Chrome`
- Emoji-Quiz `Löwe` statt `Löwenkönig`
- `party-core-classic-content.js` auf v4 vereinfacht
- `scripts/reference_content_audit.py` scannt acht ausgelieferte Contentquellen
- Source-Audit ist Teil von `npm run validate`
- Core-, Architektur- und Release-Audits verlangen den Source-Level-Vertrag

Diese neuen Verträge sind **implementiert, aber wegen des Actions-Runnerproblems noch nicht runner-verifiziert**.

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
| 8 | Repo / Git / Build | BLOCKED | Workflows | Runner, Lockfile, `npm ci`, Branch Protection |
| 9 | Feature-Entwicklungsloop | PREPARED | Tests/Contracts/PR #13 | Restarbeit nach Guide |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Backup-/Session-/PWA-Verträge | Quota-/Updateabnahme real |
| 11 | Tests / CI | BLOCKED | Testmatrix/Workflows | funktionierender Actions-Runner |
| 12 | Offline / PWA / Resume | PREPARED | Service Worker v41 | echte Geräte + alte→neue Updates |
| 13 | Content / Alter | IN PROGRESS | Content-Wellen + 15/15 Review | reale Gruppen + finaler Sign-off |
| 14 | Beta / reale Gruppen | PREPARED | `BETA_TEST_PLAN.md` | G1–G5 + PN1–PN3 real |
| 15 | Datenschutz / Recht / Support | PREPARED | Privacy, Legal, Support | echte Betreiber-/Hostingangaben |
| 16 | Release Management / RC | PREPARED | Roadmap/Checklist | nach Gates |
| 17 | Deployment / Environments | PREPARED | Deployment + Environments | HTTPS-Staging + Rollback real |
| 18 | Operations / Incident | PREPARED | Support + Incident Response | Verantwortliche + Probeincident |
| 19 | Wartung / Migration | PREPARED | Maintenance, Backups, Changelog | operative Routine real |
| 20 | Risk Management | IN PROGRESS | `RISK_REGISTER.md` | laufend aktualisieren |
| 21 | Accessibility | PREPARED | Contract + E2E-Suite | 200 %, VoiceOver, TalkBack, Geräte |
| 22 | Third Party / Assetrechte | IN PROGRESS | Third Party + Asset-Provenienz | Icon-Provenienz + Lockfile-Inventar |
| 23 | Fan-/Referenzcontent | IN PROGRESS | Fan Review + Source-Audit | Runner + manuelle Visual/Legal-Abnahme |

## Reference-Safe-Verlauf

- **v36:** Bluetooth → Funkverbindung, Oscar → Filmpreis, Formel 1 → Motorsport
- **v37:** Anime-Quiz final auf 40 generische Archetypen
- **v38:** drei konkrete Viral-Sportformulierungen generisch ersetzt
- **v40:** 40 konkrete Anime-Namen physisch aus Mega-Quelle entfernt
- **v41:** Spektrum-Tipp/Tab upstream, Löwenhinweis generisch, Classic v4, zentraler Source-Audit

## Security / Backup

Registry v2 ist zentrale Complete-Backup-Quelle. Nur registrierte Word-/Party-Key-Familien werden importiert; unbekannte Namespaces werden abgelehnt. SEC-F01/F02 sind **CLOSED IN CODE / RUNNER + REAL BROWSER VERIFICATION OPEN**.

## Accessibility

Vorbereitet: statischer Contract, Playwright-E2E-Basis, Reflow, Fokus, Reduced Motion, ARIA und Touchzielverträge. Offen: reales 200-%-Zoom, VoiceOver, TalkBack, Touchbedienung und private Reveal-Flows mit Screenreader.

## Third Party / Assets

- keine npm-Runtime-Dependencies
- `@playwright/test` 1.54.2 upstream als Apache-2.0 verifiziert
- transitive Inventur wartet auf echtes Lockfile
- `icon.svg`, `icon-192.png`, `icon-512.png` bleiben `unresolved`
- keine Root-`LICENSE`; Projektlizenz wird nicht geraten

## Environments / PWA

- Cache: `secret-circle-v41`
- Staging-Cache: `secret-circle-v41-staging`
- Privacy, Architektur, Deployment, Environment und Service-Worker-Test auf v41 synchronisiert
- konkrete Staging-/Production-Origin, reale Upgrades und Rollback offen

## CI / Lockfile

Die zuletzt geprüften Actions-Läufe enden vor verwertbaren Repository-Schritten. Deshalb dürfen neue Unit-/Audit-/E2E-Verträge nicht als grün behauptet werden.

`package-lock.json` fehlt. Keine Integrity-Werte werden erfunden; CI wird erst mit echtem Lockfile auf `npm ci` umgestellt.

## Höchste Prioritäten

1. GitHub-Actions-Runner / echter Checkout + sichtbare Steps
2. echtes `package-lock.json` + `npm ci`
3. Branch Protection / Required Checks
4. Reference-Source-Audit tatsächlich grün ausführen
5. Asset-Provenienz / Icon-Herkunft
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
- Reference-Source-Audit und neue Unit-/Audit-/E2E-Verträge
- v41-Update auf real installierter PWA
- Registry-v2-Import im echten Browser
- VoiceOver/TalkBack/200-%-Zoom
- Beta-/Gruppentests
- Third-Party-/Assetrechte final
- Legal/Support final
- HTTPS-Staging
