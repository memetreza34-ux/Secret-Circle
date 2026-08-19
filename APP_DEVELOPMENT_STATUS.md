# Secret Circle – A-bis-Z Entwicklungsstatus

Stand: 19. August 2026

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
**Offline-Core: `secret-circle-v42`**  
**Classic Content: v4**

Technisch weit fortgeschritten: 15 priorisierte Core-Games, quantitative Core-Contentziele, 15/15 Core-Quellreview, Exact-once-Sessions, sichere Resume-/Timerpfade, Registry-v2-Backups, Accessibility-Basis sowie Legal-/Support-/Incident-/Maintenance-/Environment-Verträge.

v41 schloss den physischen Reference-Source-Pass weitgehend. v42 hat zusätzlich den PWA-Iconvertrag gehärtet:

- fehlendes `icon-192.png` durch echtes 192×192-Raster ergänzt
- falsch benanntes 192×192-`icon-512.png` durch echtes 512×512-Raster ersetzt
- beide Raster aus `icon.svg` erzeugt
- SHA-256 und Ableitung dokumentiert
- `asset_provenance_audit.py` prüft Datei, Hash, PNG-IHDR und Webmanifest-Größen
- Git-Historie des SVG bis zum Repository-Commit vom 2. August 2026 dokumentiert
- finale Rechtebasis des SVG bleibt bewusst offen

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
| 12 | Offline / PWA / Resume | PREPARED | Service Worker v42 | echte Geräte + alte→neue Updates |
| 13 | Content / Alter | IN PROGRESS | Content-Wellen + 15/15 Review | reale Gruppen + finaler Sign-off |
| 14 | Beta / reale Gruppen | PREPARED | `BETA_TEST_PLAN.md` | G1–G5 + PN1–PN3 real |
| 15 | Datenschutz / Recht / Support | PREPARED | Privacy, Legal, Support | echte Betreiber-/Hostingangaben |
| 16 | Release Management / RC | PREPARED | Roadmap/Checklist | nach Gates |
| 17 | Deployment / Environments | PREPARED | Deployment + Environments | HTTPS-Staging + Rollback real |
| 18 | Operations / Incident | PREPARED | Support + Incident Response | Verantwortliche + Probeincident |
| 19 | Wartung / Migration | PREPARED | Maintenance, Backups, Changelog | operative Routine real |
| 20 | Risk Management | IN PROGRESS | `RISK_REGISTER.md` | laufend aktualisieren |
| 21 | Accessibility | PREPARED | Contract + E2E-Suite | 200 %, VoiceOver, TalkBack, Geräte |
| 22 | Third Party / Assetrechte | IN PROGRESS | Third Party + Asset-Provenienz | Root-SVG-Rechte + Lockfile-Inventar |
| 23 | Fan-/Referenzcontent | IN PROGRESS | Fan Review + Source-Audit | Runner + manuelle Visual/Legal-Abnahme |

## Reference-Safe-Verlauf

- **v36:** Bluetooth → Funkverbindung, Oscar → Filmpreis, Formel 1 → Motorsport
- **v37:** Anime-Quiz final auf 40 generische Archetypen
- **v38:** drei konkrete Viral-Sportformulierungen generisch ersetzt
- **v40:** 40 konkrete Anime-Namen physisch aus Mega-Quelle entfernt
- **v41:** Spektrum-Tipp/Tab upstream, Löwenhinweis generisch, Classic v4, zentraler Source-Audit

## PWA-/Asset-Hardening – v42

Vorher:

- `icon-192.png` fehlte
- `icon-512.png` war tatsächlich nur 192×192

Jetzt:

- 192×192 und 512×512 physisch korrekt
- `manifest.webmanifest` und Dateigrößenvertrag werden statisch gegengeprüft
- SHA-256-Drift wird erkannt
- Rasterherkunft ist technisch als Ableitung aus `icon.svg` belegt
- `icon.svg` bleibt `unresolved`, weil Git-Historie allein keine kommerzielle Rechtebasis beweist

## Security / Backup

Registry v2 ist zentrale Complete-Backup-Quelle. Nur registrierte Word-/Party-Key-Familien werden importiert; unbekannte Namespaces werden abgelehnt. SEC-F01/F02 sind **CLOSED IN CODE / RUNNER + REAL BROWSER VERIFICATION OPEN**.

## Accessibility

Vorbereitet: statischer Contract, Playwright-E2E-Basis, Reflow, Fokus, Reduced Motion, ARIA und Touchzielverträge. Offen: reales 200-%-Zoom, VoiceOver, TalkBack, Touchbedienung und private Reveal-Flows mit Screenreader.

## Third Party / Assets

- keine npm-Runtime-Dependencies
- `@playwright/test` 1.54.2 upstream als Apache-2.0 verifiziert
- transitive Inventur wartet auf echtes Lockfile
- `icon-192.png` und `icon-512.png`: technische Ableitung/Dimension seit v42 belegt
- `icon.svg`: Repository-Herkunft dokumentiert, finale Rechtebasis noch `unresolved`
- keine Root-`LICENSE`; Projektlizenz wird nicht geraten

## Environments / PWA

- Cache: `secret-circle-v42`
- Staging-Cache: `secret-circle-v42-staging`
- Privacy, Architektur, Deployment, Environment und Service-Worker-Test auf v42 synchronisiert
- konkrete Staging-/Production-Origin, reale Upgrades, Installationsicon und Rollback offen

## CI / Lockfile

Der **aktuelle technische CI-Nachweis wird zentral in `CI_TROUBLESHOOTING.md` gepflegt**, damit wechselnde Actions-Runnummern diesen A-bis-Z-Tracker nicht ständig veralten lassen.

Aktuell bestätigt:

- der aktuelle v42-Head erreicht im Actions-Job keine Repository-Steps (`steps: []`)
- ein gezielter Re-Run der fehlgeschlagenen Jobs zeigte dasselbe Muster
- kein Checkout / kein Repositorycode ausgeführt
- kein verwertbarer Job-Log vorhanden

Deshalb dürfen neue Unit-/Audit-/E2E-Verträge nicht als grün behauptet werden. Das Muster ist zugleich kein negativer Code-Test, weil der Code nie ausgeführt wird.

`package-lock.json` fehlt. Keine Integrity-Werte werden erfunden; CI wird erst mit echtem Lockfile auf `npm ci` umgestellt.

## Höchste Prioritäten

1. GitHub-Actions-Runner / echter Checkout + sichtbare Steps
2. echtes `package-lock.json` + `npm ci`
3. Branch Protection / Required Checks
4. Reference- und Asset-Audits tatsächlich grün ausführen
5. finale Rechtebasis für `icon.svg`
6. manueller Extended/Labs-/Marketing-/Visual-Rechtepass
7. HTTPS-Staging
8. reale PWA-Upgrade-/Rollback-/Geräte-/Installationsicon-Tests
9. reale Accessibilitytests
10. reale Gruppentests
11. Betreiber-/Support-/Hostingangaben
12. Incident-Drill
13. finaler RC

## Nicht als bestanden behaupten

- `npm run ci` / Cross-Browser
- Reference-Source-/Asset-Provenienz-Audit auf GitHub Actions
- v42-Update auf real installierter PWA
- korrektes Installationsicon auf realem Android/iPhone/Desktop
- Registry-v2-Import im echten Browser
- VoiceOver/TalkBack/200-%-Zoom
- Beta-/Gruppentests
- Root-SVG-/Third-Party-/Assetrechte final
- Legal/Support final
- HTTPS-Staging
