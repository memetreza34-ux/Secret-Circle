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

Die quantitativen Core-Content-Ziele sind implementiert. Security-/Backup-Hardening, manuelle Core-Review-Matrix, Accessibility-Grundlage sowie Legal/Support/Incident/Maintenance sind vorbereitet. Offen bleiben insbesondere echter CI-Nachweis, Lockfile/`npm ci`, finale Content-/Rechteabnahme, reale Accessibility-/Geräte-/PWA-Tests, Gruppentests, echte Betreiber-/Supportangaben und HTTPS-Staging.

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
| 8 | Repo / Environments / Git | BLOCKED | Workflows | Runner, Lockfile, `npm ci`, Branch Protection |
| 9 | Feature-Entwicklungsloop | PREPARED | Tests/Contracts/PR #13 | Restarbeit so fortführen |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Backup-/Session-/PWA-Verträge | reale Quota-/Updateabnahme |
| 11 | Tests / CI | BLOCKED | Testmatrix/Workflows | funktionierenden Actions-Runner |
| 12 | Offline / PWA / Resume | PREPARED | Service Worker **v35** | echte Geräte + alte→neue Updates |
| 13 | Content / Alter / Rechte | IN PROGRESS | drei Content-Wellen + `CORE_CONTENT_REVIEW.md` | reale Gruppen + finale Rechte-/Semantikabnahme |
| 14 | Beta / reale Gruppen | OPEN | Scenarios/Checklist | 3–4 / 5–8 / 9–12 |
| 15 | Datenschutz / Recht / Support | PREPARED | `privacy.html`, `LEGAL_CHECKLIST.md`, `SUPPORT.md` | echte Betreiber-/Kontakt-/Hostingangaben |
| 16 | Release Management / RC | PREPARED | Roadmap/Checklist | nach Gates |
| 17 | Deployment | PREPARED | `DEPLOYMENT.md` | HTTPS-Staging + Update/Rollback real |
| 18 | Operations / Incident | PREPARED | `SUPPORT.md`, `INCIDENT_RESPONSE.md` | reale Verantwortliche + Probeincident |
| 19 | Wartung / Migration | PREPARED | `MAINTENANCE.md`, Backups, Changelog | Lockfile/operative Routine nachziehen |
| 20 | Risk Management | IN PROGRESS | `RISK_REGISTER.md` | laufend aktualisieren |
| 21 | Accessibility | PREPARED | `ACCESSIBILITY.md`, Contract + E2E-Suite | 200 %, VoiceOver, TalkBack, reale Geräte |

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

`CORE_CONTENT_REVIEW.md` enthält jetzt die 15-Spiel-Matrix.

Geschlossener konkreter Fund:

- keine Aufforderung mehr, die letzte private Handy-Nachricht vorzulesen
- keine Frage mehr nach dem seltsamsten Inhalt der Kamerarolle
- beide durch harmlose selbstbestimmte Alternativen ersetzt
- Regression im Core-Content-Test geschützt

Zusätzlich ist Freiwilligkeit jetzt in Hub und Advanced sichtbar: persönliche Inhalte dürfen übersprungen werden, ohne Begründung.

Das gesamte Content-Gate bleibt trotzdem **IN PROGRESS**, bis reale Gruppen-, Rechte- und finale Semantikabnahme abgeschlossen sind.

## Security / Backup

### SEC-F01

Doppelte Complete-Backup-Konstanten beseitigt. `party-data-tools.js` liest Format und Limits aus `backup-schema-registry.js`.

### SEC-F02

Complete-Import akzeptiert nur registrierte versionierte Word-Imposter- und `secret-circle-party-*`-Key-Familien. Unbekannte `secret-circle-*`-Namespaces werden abgelehnt.

Registry steht auf Version 2. `BACKUP_SCHEMAS.md` dokumentiert den zentralen Vertrag.

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

## Recht / Support / Operations

Neu vorbereitet:

- `LEGAL_CHECKLIST.md`
- `SUPPORT.md`
- `INCIDENT_RESPONSE.md`
- `MAINTENANCE.md`

Legal-Check berücksichtigt Stand August 2026 unter anderem DDG, TDDDG, DSGVO, VSBG und dass die frühere EU-OS-Plattform seit 20. Juli 2025 eingestellt ist.

Keine Betreiberadresse, Support-Mail oder Rechtsform wurde erfunden. Diese Daten bleiben Releaseblocker bis sie real feststehen.

## PWA / Audit-Synchronität

Aktuell: **`secret-circle-v35`**.

v35 bündelt:

- tatsächlich neue Hub-Positionierung
- sichtbare Freiwilligkeitsregel im Hub
- korrekte Registry-v2-Ladereihenfolge vor `party-data-tools.js`
- aktualisierte Privacy-Seite
- Backup-Allowlist-Dokumentation

Service-Worker-Test erwartet v35. Architektur und Deployment sind auf v35 synchronisiert. Dynamische Audits leiten die Cachegeneration aus `sw.js` ab und sollen nicht an alten hart codierten Generationen hängen.

## Aktuell höchste Prioritäten

### P0

1. GitHub-Actions-Runner / echter Checkout + sichtbare Steps

### P1/P2 danach beziehungsweise parallel ohne Runner

2. `package-lock.json` + `npm ci`
3. Branch Protection / Required Checks
4. finale Content-/Marken-/Rechteabnahme
5. HTTPS-Staging
6. reale Accessibility-/Gerätetests
7. reale PWA-Update-/Rollbacktests
8. reale Gruppentests
9. echte Betreiber-/Support-/Hostingangaben
10. Third-Party-/Lizenzinventar
11. Probeincident + Wartungsroutine
12. Release Candidate

## Was weiterhin NICHT als bestanden gilt

Wegen des externen Runnerproblems und fehlender Realtests nicht behaupten:

- `npm run ci` grün
- Cross-Browser grün
- Accessibility-Contract tatsächlich grün
- neue Accessibility-E2E-Suite tatsächlich grün
- Content-Test tatsächlich grün
- v35-Update auf real installierten PWAs bestätigt
- Registry-v2-Import im echten Browser vollständig bestätigt
- VoiceOver/TalkBack/200-%-Zoom bestanden
- Legal/Support final

## Arbeitsregel

Wir arbeiten die A-bis-Z-Anleitung weiter nach unten. Neue P0/P1-Funde dürfen die Reihenfolge vorziehen. Jede Erkenntnis darf Produkt-, Architektur-, Test-, Risiko- und Releaseverträge ändern.
