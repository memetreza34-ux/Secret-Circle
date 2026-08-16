# Secret Circle – A-bis-Z Entwicklungsstatus

Stand: 16. August 2026

Dieses Dokument ist der operative Fortschrittstracker zu `APP_ENTWICKLUNG_VON_A_BIS_Z.md`.

## Statuswerte

- **DONE** – für aktuellen Entwicklungsstand abgeschlossen
- **IN PROGRESS** – aktiv in Bearbeitung
- **PREPARED** – Grundlage vorhanden, reale/finale Abnahme fehlt
- **OPEN** – noch nicht systematisch bearbeitet
- **BLOCKED** – externer oder technischer Blocker
- **N/A V1** – bewusst nicht Teil Januar 2027

## Gesamtstatus

**Öffentliche Releasefreigabe: NO_GO**

Die technische Releasegrundlage ist weit fortgeschritten. Quantitative Core-Content-Ziele sind implementiert, der erste Core-Quellpass steht bei 15/15, Security-/Backup-Hardening und Accessibility sind vorbereitet, und inzwischen existieren konkrete Verträge für Legal, Support, Incident Response, Maintenance, Beta/Realgeräte, Third-Party/Assets und getrennte Staging-/Production-Umgebungen.

Offen bleiben insbesondere echter CI-Nachweis, Lockfile/`npm ci`, Branch Protection, finale Rechte-/Assetherkunft, reale Accessibility-/Geräte-/PWA-/Gruppentests, echte Betreiber-/Supportangaben und eine konkrete HTTPS-Staging-Origin.

## A-bis-Z-Tracker

| # | Bereich | Status | Hauptnachweis | Nächste Aktion |
|---|---|---|---|---|
| 0 | Produktziel / Releasegrenze | DONE | Product Brief, Release Scope | bei Scopeänderung aktualisieren |
| A | Querschnittsverträge | PREPARED | Master-Anleitung, Architektur, Security, Requirements | reale Gates schließen |
| 1 | Discovery / Nutzer / Markt | DONE | Product Brief, Scenarios, Market Research | bei Produktänderung aktualisieren |
| 2 | Produktstrategie / Scope | PREPARED | Scope, Roadmap, Positionierung | reale Nutzer validieren |
| 3 | Plattformstrategie | PREPARED | `PLATFORM_STRATEGY.md` | reale Zielgeräte |
| 4 | Requirements / Akzeptanz | PREPARED | `REQUIREMENTS.md`, Core Contracts | Traceability real schließen |
| 5 | UX / IA / Design | PREPARED | `UX_FLOW.md`, `DESIGN_SYSTEM.md`, neuer Hub-Hero | reale UX-Tests |
| 6 | Architektur / ADR | PREPARED | `ARCHITECTURE.md` | ADRs bei neuen Grundsatzentscheidungen |
| 7 | Security / Threat Model | PREPARED | `SECURITY.md`, `THREAT_MODEL.md`, Registry v2 | SEC-F01/F02 runner-/browserverifizieren |
| 8 | Repo / Git / Build | BLOCKED | Workflows | Runner, Lockfile, `npm ci`, Branch Protection |
| 9 | Feature-Entwicklungsloop | PREPARED | Tests/Contracts/PR #13 | Restarbeit so fortführen |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Backup-/Session-/PWA-Verträge | reale Quota-/Updateabnahme |
| 11 | Tests / CI | BLOCKED | Testmatrix/Workflows | funktionierenden Actions-Runner |
| 12 | Offline / PWA / Resume | PREPARED | Service Worker **v35** | echte Geräte + alte→neue Updates |
| 13 | Content / Alter | IN PROGRESS | drei Content-Wellen + 15/15 `CORE_CONTENT_REVIEW.md` | reale Gruppen + finaler Sign-off |
| 14 | Beta / reale Gruppen | PREPARED | `BETA_TEST_PLAN.md` | G1–G5 + PN1–PN3 real durchführen |
| 15 | Datenschutz / Recht / Support | PREPARED | `privacy.html`, `LEGAL_CHECKLIST.md`, `SUPPORT.md` | echte Betreiber-/Kontakt-/Hostingangaben |
| 16 | Release Management / RC | PREPARED | Roadmap/Checklist | nach Gates |
| 17 | Deployment / Environments | PREPARED | `DEPLOYMENT.md`, `ENVIRONMENTS.md` | konkrete getrennte HTTPS-Staging-Origin + Rollback real |
| 18 | Operations / Incident | PREPARED | `SUPPORT.md`, `INCIDENT_RESPONSE.md` | reale Verantwortliche + Probeincident |
| 19 | Wartung / Migration | PREPARED | `MAINTENANCE.md`, Backups, Changelog | Lockfile/operative Routine nachziehen |
| 20 | Risk Management | IN PROGRESS | `RISK_REGISTER.md` | laufend aktualisieren |
| 21 | Accessibility | PREPARED | `ACCESSIBILITY.md`, Contract + E2E-Suite | 200 %, VoiceOver, TalkBack, reale Geräte |
| 22 | Third Party / Assetrechte | IN PROGRESS | `THIRD_PARTY_NOTICES.md`, `ASSET_PLAN.md` | Icon-Herkunft + Dependency-/Lizenznachweis finalisieren |

## Content – quantitative Arbeit abgeschlossen

### Welle 1

- Taboo 8 → 16
- Hot Potato 8 → 16
- Word Chain 5 → 10
- Two Truths 8 → 16
- Question Imposter 8 → 16
- Location Spy 8 → 16

### Welle 2

- Never Have 8 → 24
- Most Likely 8 → 24
- Would Rather 8 → 24
- Paranoia 8 → 20
- Wrong Answers 8 → 24

### Welle 3

- Truth/Dare 16 → 24 je Pack
- Charades 12 → 30 je Pack
- Taboo 16 → 24 je Pack
- Hot Potato 16 → 20 je Pack

Kein Core-Pack besitzt nach unserem Vertrag noch einen bekannten quantitativen Shortfall.

## Manuelles Core-Content-/Privacy-Review

`CORE_CONTENT_REVIEW.md` enthält den ersten vollständigen **15/15-Core-Quellpass**.

Geschlossener konkreter Fund:

- keine Aufforderung mehr, die letzte private Handy-Nachricht vorzulesen
- keine Frage mehr nach dem seltsamsten Inhalt der Kamerarolle
- beide durch harmlose selbstbestimmte Alternativen ersetzt
- Regression im Core-Content-Test geschützt

Freiwilligkeit ist in Hub und Advanced sichtbar: persönliche Inhalte dürfen übersprungen werden, ohne Begründung.

Das Gesamtgate bleibt trotzdem **IN PROGRESS**, bis reale Gruppen, Fan-/Marken-/Rechteprüfung und finaler Content-Sign-off abgeschlossen sind.

## Security / Backup

### SEC-F01

Doppelte Complete-Backup-Konstanten beseitigt. `party-data-tools.js` liest Format und Limits aus `backup-schema-registry.js`.

### SEC-F02

Complete-Import akzeptiert nur registrierte versionierte Word-Imposter- und `secret-circle-party-*`-Key-Familien. Unbekannte `secret-circle-*`-Namespaces werden abgelehnt.

Registry steht auf Version 2. `BACKUP_SCHEMAS.md` dokumentiert den zentralen Vertrag. `party.html` lädt die Registry vor den Datentools.

Status beider Funde: **CLOSED IN CODE / RUNNER + REAL BROWSER VERIFICATION OPEN**.

## Accessibility

Vorhanden:

- `ACCESSIBILITY.md`
- `tests/accessibility-contract.test.js`
- `tests/e2e/accessibility-core.spec.js`
- Contract in `npm test` und `npm run check`
- Reflow-Testbasis bei 320 CSS px
- Skip-Link-/Tastatur-/Autocomplete-Gates
- sichtbare Freiwilligkeitsregel

Noch nicht als PASS:

- 200-%-Zoom real
- VoiceOver
- TalkBack
- reale Touchziele
- komplette Tastaturrunden
- Screenreader bei privaten Reveals

## Beta / Realgeräte

`BETA_TEST_PLAN.md` übersetzt die Releasecheckliste in konkrete Sessions:

- G1: 3–4 Personen
- G2: 5–8 Personen
- G3: 9–12 Personen
- G4: Mafia ab 8 Personen
- G5: Creator mit unerfahrener Person
- PN1–PN3: drei komplette Smart-Party-Night-Abende
- Android, iPhone, Tablet, Desktop/Zoom
- VoiceOver/TalkBack
- zwei reale PWA-Upgrades
- HTTPS-Rollbackprobe

Status: **PREPARED – reale Durchführung offen**.

## Third Party / Assets

`THIRD_PARTY_NOTICES.md` hält aktuell fest:

- keine npm-Runtime-Dependencies
- Dev-Dependency `@playwright/test` 1.54.2
- Herkunft/Lizenz der drei App-Icons ist im Repo noch nicht belegt
- keine Root-`LICENSE`-Datei gefunden; Projektlizenz wird nicht geraten
- Fan-/Marken-/Franchise-Inhalte benötigen finale Rechteprüfung

R-029 bleibt daher P1 bis zur Herkunfts-/Lizenzfreigabe offen.

## Recht / Support / Operations

Vorbereitet:

- `LEGAL_CHECKLIST.md`
- `SUPPORT.md`
- `INCIDENT_RESPONSE.md`
- `MAINTENANCE.md`

Keine Betreiberadresse, Support-Mail oder Rechtsform wurde erfunden. Diese Daten bleiben Releaseblocker, bis sie real feststehen.

## Environments / Staging

`ENVIRONMENTS.md` definiert:

**Local → CI/Test → HTTPS-Staging → Release Candidate → Production**

Staging und Production sollen getrennte Origins besitzen, damit `localStorage`, Service Worker und installierte PWA-Zustände isoliert bleiben.

Noch offen:

- konkrete Staging-Origin
- konkrete Production-Origin
- Staging-Smoke
- echte Upgradepfade
- HTTPS-Rollbackprobe

## PWA / Audit-Synchronität

Aktuell: **`secret-circle-v35`**.

v35 bündelt:

- neue Hub-Positionierung
- sichtbare Freiwilligkeitsregel
- Registry-v2-Ladereihenfolge
- aktualisierte Privacy-Seite
- Backup-Allowlist-Dokumentation

Service-Worker-Test erwartet v35. Architektur, Deployment und Privacy sind auf v35 synchronisiert. Release-Audits leiten die Cachegeneration aus `sw.js` ab und verlangen inzwischen Beta-, Third-Party- und Environment-Verträge.

## CI / Lockfile

Neuester geprüfter Actions-Lauf: **Run #1905**.

- Job `validate`
- Ergebnis failure
- `steps: []`
- kein Checkout
- kein Repository-Code ausgeführt

`package-lock.json` fehlt weiterhin. Eine lokale `npm install --package-lock-only`-Erzeugung konnte wegen externem Paketnetzwerk/Timeout nicht abgeschlossen werden. Es wurde kein Lockfile erfunden und CI wird noch nicht verfrüht auf `npm ci` umgestellt.

## Aktuell höchste Prioritäten

### P0

1. GitHub-Actions-Runner / echter Checkout + sichtbare Steps

### P1/P2 danach beziehungsweise parallel ohne Runner

2. echtes `package-lock.json` + `npm ci`
3. Branch Protection / Required Checks
4. Icon-/Asset-Herkunft und Third-Party-Lizenzen finalisieren
5. konkrete HTTPS-Staging-Origin festlegen
6. Staging-Smoke + PWA-Upgrade-/Rollbacktests
7. reale Accessibility-/Gerätetests
8. reale Gruppentests nach `BETA_TEST_PLAN.md`
9. echte Betreiber-/Support-/Hostingangaben
10. Probeincident + Wartungsroutine
11. finaler Rechte-/Content-Sign-off
12. Release Candidate

## Was weiterhin NICHT als bestanden gilt

Wegen Runnerblocker und fehlender Realtests nicht behaupten:

- `npm run ci` grün
- Cross-Browser grün
- Accessibility-Contract tatsächlich grün
- Accessibility-E2E tatsächlich grün
- Content-Test tatsächlich grün
- v35-Update auf real installierten PWAs bestätigt
- Registry-v2-Import im echten Browser vollständig bestätigt
- VoiceOver/TalkBack/200-%-Zoom bestanden
- Beta-/Gruppentest bestanden
- Third-Party-/Assetrechte final
- Legal/Support final
- HTTPS-Staging bestanden

## Arbeitsregel

Wir arbeiten die A-bis-Z-Anleitung weiter nach unten. Neue P0/P1-Funde dürfen die Reihenfolge vorziehen. Jede Erkenntnis darf Produkt-, Architektur-, Test-, Risiko- und Releaseverträge ändern.
