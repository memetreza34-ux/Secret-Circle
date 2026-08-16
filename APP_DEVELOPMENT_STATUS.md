# Secret Circle – A-bis-Z Entwicklungsstatus

Stand: 16. August 2026

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

Die technische Releasegrundlage ist weit fortgeschritten. Quantitative Core-Content-Ziele sind implementiert, der erste Core-Quellpass steht bei 15/15, Security-/Backup-Hardening, Accessibility, Legal, Support, Incident Response, Maintenance, Beta/Realgeräte und Environment-Verträge sind vorbereitet.

Aktueller Offline-Core: **`secret-circle-v38`**.

Rechte-/Referenzfortschritt:

- Word Imposter: drei unnötig konkrete Referenzen generisch ersetzt
- `anime-guess`: final als **Anime-Archetypen erraten** mit 40 generischen Archetypen
- Viral `higher-lower`: drei unnötig konkrete olympisch/Grand-Slam-bezogene Sporttexte durch generische Fragen ersetzt
- Classic-Content-v2 liegt mit **12.954 Bytes** deutlich unter dem 45-KB-Budget

Offen bleiben vor allem echter CI-Nachweis, Lockfile/`npm ci`, Branch Protection, Assetherkunft, restlicher Extended/Labs-Referenzscan, reale Accessibility-/Geräte-/PWA-/Gruppentests, Betreiber-/Supportangaben und HTTPS-Staging.

## A-bis-Z-Tracker

| # | Bereich | Status | Hauptnachweis | Nächste Aktion |
|---|---|---|---|---|
| 0 | Produktziel / Releasegrenze | DONE | Product Brief, Release Scope | bei Scopeänderung aktualisieren |
| A | Querschnittsverträge | PREPARED | Master, Architektur, Security, Requirements | reale Gates schließen |
| 1 | Discovery / Nutzer / Markt | DONE | Product Brief, Scenarios, Market Research | bei Produktänderung aktualisieren |
| 2 | Produktstrategie / Scope | PREPARED | Scope, Roadmap, Positionierung | reale Nutzer validieren |
| 3 | Plattformstrategie | PREPARED | `PLATFORM_STRATEGY.md` | reale Zielgeräte |
| 4 | Requirements / Akzeptanz | PREPARED | `REQUIREMENTS.md`, Core Contracts | Traceability real schließen |
| 5 | UX / IA / Design | PREPARED | `UX_FLOW.md`, `DESIGN_SYSTEM.md` | reale UX-Tests |
| 6 | Architektur / ADR | PREPARED | `ARCHITECTURE.md` | ADRs bei Grundsatzentscheidungen |
| 7 | Security / Threat Model | PREPARED | Security, Threat Model, Registry v2 | Runner + echter Browser |
| 8 | Repo / Git / Build | BLOCKED | Workflows | Runner, Lockfile, `npm ci`, Branch Protection |
| 9 | Feature-Entwicklungsloop | PREPARED | Tests/Contracts/PR #13 | Restarbeit nach Guide |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Backup-/Session-/PWA-Verträge | Quota-/Updateabnahme real |
| 11 | Tests / CI | BLOCKED | Testmatrix/Workflows | funktionierender Actions-Runner |
| 12 | Offline / PWA / Resume | PREPARED | Service Worker **v38** | echte Geräte + alte→neue Updates |
| 13 | Content / Alter | IN PROGRESS | drei Content-Wellen + 15/15 Review | reale Gruppen + finaler Sign-off |
| 14 | Beta / reale Gruppen | PREPARED | `BETA_TEST_PLAN.md` | G1–G5 + PN1–PN3 real |
| 15 | Datenschutz / Recht / Support | PREPARED | Privacy, Legal, Support | echte Betreiber-/Hostingangaben |
| 16 | Release Management / RC | PREPARED | Roadmap/Checklist | nach Gates |
| 17 | Deployment / Environments | PREPARED | Deployment + Environments | HTTPS-Staging + Rollback real |
| 18 | Operations / Incident | PREPARED | Support + Incident Response | Verantwortliche + Probeincident |
| 19 | Wartung / Migration | PREPARED | Maintenance, Backups, Changelog | operative Routine real |
| 20 | Risk Management | IN PROGRESS | `RISK_REGISTER.md` | laufend aktualisieren |
| 21 | Accessibility | PREPARED | Contract + E2E-Suite | 200 %, VoiceOver, TalkBack, Geräte |
| 22 | Third Party / Assetrechte | IN PROGRESS | `THIRD_PARTY_NOTICES.md` | Icon-Provenienz + Lockfile-Inventar |
| 23 | Fan-/Referenzcontent | IN PROGRESS | `FAN_CONTENT_REVIEW.md` | restlichen Extended/Labs-Pass abschließen |

## Core- und Privacy-Content

Alle definierten quantitativen Core-Ziele sind erreicht. `CORE_CONTENT_REVIEW.md` enthält 15/15 Core-Spiele als ersten Quellpass.

Geschlossener Privacy-Fund:

- keine letzte private Nachricht als Pflicht
- keine Kamerarolle als Fragequelle
- harmlose Alternativen
- Regression geschützt

Persönliche Inhalte sind im Hub und Advanced sichtbar freiwillig und ohne Begründung überspringbar.

## Reference-Safe-Pass

### v36 – Word Imposter

- `Bluetooth` → `Funkverbindung`
- `Oscar` → `Filmpreis`
- `Formel 1` → `Motorsport`

### v37 – Anime-Quiz

- stabile ID `anime-guess`
- finaler Titel `Anime-Archetypen erraten`
- vier generische Packs
- 40 eigenständige Archetypen
- 40 frühere konkrete Figuren im finalen Runtime-Katalog ausgeschlossen
- `party-core-classic-content.js` Version 2

### v38 – Viral Sport

Im `higher-lower`-Sportpack wurden drei unnötig konkrete Referenzformulierungen ersetzt:

- olympisches Ringsymbol → Ecken eines Fünfecks
- olympisches 400-m-Stadion → typische 400-m-Leichtathletikanlage
- Herren-Grand-Slam-Tennis → Best-of-five-Tennismatch

Die Zahlenwerte 5 / 8 / 3 bleiben erhalten. `tests/party-viral-catalog.test.js` regressionssichert die Änderungen.

## Performance

Classic Content v2: **12.954 Bytes** laut GitHub-Tree bei unverändertem **45.000-Byte-Budget**. Kein Split und keine Budgetlockerung nötig. R-031 ist geschlossen.

## Security / Backup

- Registry v2 als zentrale Complete-Backup-Quelle
- keine duplizierten Complete-Grenzen in Datentools
- nur registrierte Word-/Party-Key-Familien importierbar
- unbekannte Namespaces abgelehnt
- Registry lädt vor Datentools

SEC-F01/F02: **CLOSED IN CODE / RUNNER + REAL BROWSER VERIFICATION OPEN**.

## Accessibility

Vorbereitet: `ACCESSIBILITY.md`, statischer Contract, Playwright-E2E-Basis, 320-CSS-px-Reflow, Fokus, Reduced Motion, ARIA und Touchzielverträge.

Offen: reales 200-%-Zoom, VoiceOver, TalkBack, Touchbedienung, komplette Tastaturrunden und private Reveals mit Screenreader.

## Third Party / Assets

- keine npm-Runtime-Dependencies
- `@playwright/test` 1.54.2 upstream als Apache-2.0 verifiziert
- transitive Inventur wartet auf echtes Lockfile
- Herkunft/Lizenz von `icon.svg`, `icon-192.png`, `icon-512.png` noch nicht belegt
- keine Root-`LICENSE`; Projektlizenz wird nicht geraten

## Environments / PWA

- Cache: **`secret-circle-v38`**
- Staging-Cache: **`secret-circle-v38-staging`**
- Privacy, Architektur, Deployment, Environment und Service-Worker-Test auf v38 synchronisiert
- konkrete Staging-/Production-Origin, Smoke, reale Upgrades und Rollback weiter offen

## CI / Lockfile

Neuester belastbar geprüfter Actions-Lauf: **Run #1905** – `validate`, failure, `steps: []`, kein Checkout, kein Repository-Code ausgeführt.

`package-lock.json` fehlt. Lokale Erzeugung scheiterte am externen Paketnetzwerk/Timeout; keine Integritätswerte wurden erfunden. CI wird erst mit echtem Lockfile auf `npm ci` umgestellt.

## Aktuell höchste Prioritäten

### P0

1. GitHub-Actions-Runner / echter Checkout + sichtbare Steps

### P1/P2 parallel

2. echtes `package-lock.json` + `npm ci`
3. Branch Protection / Required Checks
4. restlicher Extended/Labs-Referenzscan
5. Asset-Provenienz / Icon-Herkunft
6. konkrete HTTPS-Staging-Origin
7. Staging-Smoke + PWA-Upgrade-/Rollbacktests
8. reale Accessibility-/Gerätetests
9. reale Gruppentests
10. Betreiber-/Support-/Hostingangaben
11. Probeincident + Wartungsroutine
12. finaler Content-/Rechte-Sign-off
13. Release Candidate

## Nicht als bestanden behaupten

- `npm run ci` / Cross-Browser
- neue Unit-/Audit-/E2E-Verträge
- v38-Update auf real installierter PWA
- Registry-v2-Import im echten Browser
- VoiceOver/TalkBack/200-%-Zoom
- Beta-/Gruppentests
- Third-Party-/Assetrechte final
- Legal/Support final
- HTTPS-Staging

## Arbeitsregel

Wir arbeiten die A-bis-Z-Anleitung weiter nach unten. Neue P0/P1-Funde dürfen die Reihenfolge vorziehen. Erkenntnisse dürfen Produkt-, Architektur-, Test-, Risiko- und Releaseverträge ändern.
