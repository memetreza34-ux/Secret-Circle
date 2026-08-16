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

Die technische Releasegrundlage ist weit fortgeschritten. Alle quantitativen Core-Content-Ziele sind implementiert, der erste Core-Quellpass steht bei 15/15, Security-/Backup-Hardening, Accessibility, Legal, Support, Incident Response, Maintenance, Beta/Realgeräte und Environment-Verträge sind vorbereitet.

Seit dem Rechtepass gilt zusätzlich:

- Word-Imposter-Core ohne die drei unnötigen konkreten Referenzbegriffe
- `anime-guess` im **finalen Runtime-Katalog vollständig reference-safe**
- Classic-Content-Schicht Version 2
- aktueller Offline-Core **`secret-circle-v37`**

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
| 7 | Security / Threat Model | PREPARED | `SECURITY.md`, `THREAT_MODEL.md`, Registry v2 | Runner + echter Browser |
| 8 | Repo / Git / Build | BLOCKED | Workflows | Runner, Lockfile, `npm ci`, Branch Protection |
| 9 | Feature-Entwicklungsloop | PREPARED | Tests/Contracts/PR #13 | Restarbeit nach Guide |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Backup-/Session-/PWA-Verträge | Quota-/Updateabnahme real |
| 11 | Tests / CI | BLOCKED | Testmatrix/Workflows | funktionierender Actions-Runner |
| 12 | Offline / PWA / Resume | PREPARED | Service Worker **v37** | echte Geräte + alte→neue Updates |
| 13 | Content / Alter | IN PROGRESS | drei Content-Wellen + 15/15 Review | reale Gruppen + finaler Sign-off |
| 14 | Beta / reale Gruppen | PREPARED | `BETA_TEST_PLAN.md` | G1–G5 + PN1–PN3 real |
| 15 | Datenschutz / Recht / Support | PREPARED | Privacy, Legal, Support | echte Betreiber-/Hostingangaben |
| 16 | Release Management / RC | PREPARED | Roadmap/Checklist | nach Gates |
| 17 | Deployment / Environments | PREPARED | Deployment + Environments | HTTPS-Staging + Rollback real |
| 18 | Operations / Incident | PREPARED | Support + Incident Response | Verantwortliche + Probeincident |
| 19 | Wartung / Migration | PREPARED | Maintenance, Backups, Changelog | operative Routine real |
| 20 | Risk Management | IN PROGRESS | `RISK_REGISTER.md` | laufend aktualisieren |
| 21 | Accessibility | PREPARED | Contract + E2E-Suite | 200 %, VoiceOver, TalkBack, Geräte |
| 22 | Third Party / Assetrechte | IN PROGRESS | `THIRD_PARTY_NOTICES.md` | Icon-Herkunft + Lockfile-Inventar |
| 23 | Fan-/Referenzcontent | IN PROGRESS | `FAN_CONTENT_REVIEW.md` | restlichen Extended/Labs-Pass abschließen |

## Core-Content

Drei Ausbauwellen haben alle definierten quantitativen Core-Ziele erreicht. `CORE_CONTENT_REVIEW.md` enthält den ersten vollständigen **15/15-Core-Quellpass**.

Geschlossener Privacy-Fund:

- keine Aufforderung mehr, letzte private Handy-Nachricht vorzulesen
- keine Frage mehr nach Kamerarolleninhalt
- harmlose Alternativen
- Regression im Contenttest

Persönliche Inhalte sind im Hub und Advanced sichtbar freiwillig und ohne Begründung überspringbar.

## Rechtepass: v36 → v37

### v36 – Word Imposter

- `Bluetooth` → `Funkverbindung`
- `Oscar` → `Filmpreis`
- `Formel 1` → `Motorsport`

### v37 – Anime-Quiz

Für `anime-guess` wurde **Option B** umgesetzt:

- stabile technische ID bleibt `anime-guess`
- sichtbarer Titel: **Anime-Archetypen erraten**
- vier generische Packs
- 10 Archetypen je Pack / 40 gesamt
- die 40 zuvor inventarisierten konkreten Figuren werden im finalen Runtime-Katalog nicht mehr ausgeliefert
- `party-core-classic-content.js` steht auf **Version 2**
- `tests/core-content-quality.test.js` regressionssichert die Entfernung
- `scripts/core_content_audit.py` und Release-/Architektur-Audits kennen den Vertrag

Status: **IMPLEMENTED / RUNNER VERIFICATION OPEN**.

## Security / Backup

- Registry v2 ist zentrale Quelle für Complete-Backup-Format und Limits
- `party-data-tools.js` dupliziert diese Werte nicht
- nur registrierte Word-/Party-Key-Familien importierbar
- unbekannte Secret-Circle-Namespaces werden abgelehnt
- Registry lädt vor Datentools

SEC-F01/F02: **CLOSED IN CODE / RUNNER + REAL BROWSER VERIFICATION OPEN**.

## Accessibility

Vorhanden:

- `ACCESSIBILITY.md`
- `tests/accessibility-contract.test.js`
- `tests/e2e/accessibility-core.spec.js`
- Contract in `npm test` und `npm run check`
- 320-CSS-px-Reflowbasis
- Skip-Link-/Tastatur-/Autocomplete-Gates

Offen: reales 200-%-Zoom, VoiceOver, TalkBack, Touchziele, komplette Tastaturrunden und private Reveals mit Screenreader.

## Beta / Realgeräte

`BETA_TEST_PLAN.md`: G1–G5, PN1–PN3, Android, iPhone, Tablet, VoiceOver/TalkBack, zwei PWA-Upgrades und HTTPS-Rollbackprobe.

Status: **PREPARED – reale Durchführung offen**.

## Third Party / Assets

- keine npm-Runtime-Dependencies
- `@playwright/test` 1.54.2 upstream als Apache-2.0 verifiziert
- transitive Dependencyinventur wartet auf echtes Lockfile
- Herkunft/Lizenz der drei App-Icons ist im Repo nicht belegt
- keine Root-`LICENSE`; Projektlizenz wird nicht geraten

## Environments / PWA

`ENVIRONMENTS.md`: **Local → CI/Test → HTTPS-Staging → RC → Production** mit getrennten Origins für Staging und Production.

Aktuell:

- Cache: **`secret-circle-v37`**
- Staging-Cache: **`secret-circle-v37-staging`**
- Privacy, Architektur, Deployment, Environment und Service-Worker-Test sind darauf synchronisiert

Offen: konkrete Origins, Staging-Smoke, reale Upgradepfade und Rollbackprobe.

## CI / Lockfile

Neuester belastbar geprüfter Actions-Lauf: **Run #1905**.

- Job `validate`
- failure
- `steps: []`
- kein Checkout
- kein Repository-Code ausgeführt

`package-lock.json` fehlt. Lokale Erzeugung scheiterte am externen Paketnetzwerk/Timeout; nichts wurde erfunden. CI wird erst mit echtem geprüftem Lockfile auf `npm ci` umgestellt.

## Aktuell höchste Prioritäten

### P0

1. GitHub-Actions-Runner / echter Checkout + sichtbare Steps

### P1/P2 parallel

2. echtes `package-lock.json` + `npm ci`
3. Branch Protection / Required Checks
4. Classic-Content-v2-Performancebudget bestätigen
5. restlicher Extended/Labs-Referenzscan
6. Icon-/Asset-Herkunft finalisieren
7. konkrete HTTPS-Staging-Origin
8. Staging-Smoke + PWA-Upgrade-/Rollbacktests
9. reale Accessibility-/Gerätetests
10. reale Gruppentests
11. Betreiber-/Support-/Hostingangaben
12. Probeincident + Wartungsroutine
13. finaler Content-/Rechte-Sign-off
14. Release Candidate

## Nicht als bestanden behaupten

- `npm run ci` / Cross-Browser
- neue Unit-/Audit-/E2E-Verträge
- v37-Update auf real installierter PWA
- Registry-v2-Import im echten Browser
- VoiceOver/TalkBack/200-%-Zoom
- Beta-/Gruppentests
- Third-Party-/Assetrechte final
- Legal/Support final
- HTTPS-Staging

## Arbeitsregel

Wir arbeiten die A-bis-Z-Anleitung weiter nach unten. Neue P0/P1-Funde dürfen die Reihenfolge vorziehen. Erkenntnisse dürfen Produkt-, Architektur-, Test-, Risiko- und Releaseverträge ändern.
