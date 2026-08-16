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

Die technische Releasegrundlage ist weit fortgeschritten. Quantitative Core-Content-Ziele sind implementiert, der erste Core-Quellpass steht bei 15/15, Security-/Backup-Hardening und Accessibility sind vorbereitet. Es existieren konkrete Verträge für Legal, Support, Incident Response, Maintenance, Beta/Realgeräte, Third Party/Assets, Fan-Content sowie getrennte Staging-/Production-Umgebungen.

Offen bleiben insbesondere echter CI-Nachweis, Lockfile/`npm ci`, Branch Protection, konkrete Assetherkunft, finale Fan-/Markenentscheidung, reale Accessibility-/Geräte-/PWA-/Gruppentests, echte Betreiber-/Supportangaben und eine konkrete HTTPS-Staging-Origin.

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
| 7 | Security / Threat Model | PREPARED | `SECURITY.md`, `THREAT_MODEL.md`, Registry v2 | runner-/browserverifizieren |
| 8 | Repo / Git / Build | BLOCKED | Workflows | Runner, Lockfile, `npm ci`, Branch Protection |
| 9 | Feature-Entwicklungsloop | PREPARED | Tests/Contracts/PR #13 | Restarbeit so fortführen |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Backup-/Session-/PWA-Verträge | reale Quota-/Updateabnahme |
| 11 | Tests / CI | BLOCKED | Testmatrix/Workflows | funktionierenden Actions-Runner |
| 12 | Offline / PWA / Resume | PREPARED | Service Worker **v36** | echte Geräte + alte→neue Updates |
| 13 | Content / Alter | IN PROGRESS | drei Content-Wellen + 15/15 `CORE_CONTENT_REVIEW.md` | reale Gruppen + finaler Sign-off |
| 14 | Beta / reale Gruppen | PREPARED | `BETA_TEST_PLAN.md` | G1–G5 + PN1–PN3 real durchführen |
| 15 | Datenschutz / Recht / Support | PREPARED | `privacy.html`, `LEGAL_CHECKLIST.md`, `SUPPORT.md` | echte Betreiber-/Kontakt-/Hostingangaben |
| 16 | Release Management / RC | PREPARED | Roadmap/Checklist | nach Gates |
| 17 | Deployment / Environments | PREPARED | `DEPLOYMENT.md`, `ENVIRONMENTS.md` | HTTPS-Staging + Rollback real |
| 18 | Operations / Incident | PREPARED | `SUPPORT.md`, `INCIDENT_RESPONSE.md` | reale Verantwortliche + Probeincident |
| 19 | Wartung / Migration | PREPARED | `MAINTENANCE.md`, Backups, Changelog | Lockfile/operative Routine nachziehen |
| 20 | Risk Management | IN PROGRESS | `RISK_REGISTER.md` | laufend aktualisieren |
| 21 | Accessibility | PREPARED | `ACCESSIBILITY.md`, Contract + E2E-Suite | 200 %, VoiceOver, TalkBack, reale Geräte |
| 22 | Third Party / Assetrechte | IN PROGRESS | `THIRD_PARTY_NOTICES.md`, `ASSET_PLAN.md` | Icon-Herkunft + transitive Dependencyprüfung |
| 23 | Fan-/Marken-/Franchise-Rechte | IN PROGRESS | `FAN_CONTENT_REVIEW.md` | Anime-Quiz vor Production freigeben, generisch ersetzen oder entfernen |

## Core-Content

Drei Ausbauwellen haben alle definierten quantitativen Core-Ziele erreicht. `CORE_CONTENT_REVIEW.md` enthält den ersten vollständigen **15/15-Core-Quellpass**.

Geschlossener Privacy-Fund:

- keine Aufforderung mehr, die letzte private Handy-Nachricht vorzulesen
- keine Frage mehr nach dem seltsamsten Inhalt der Kamerarolle
- beide durch harmlose selbstbestimmte Alternativen ersetzt
- Regression im Core-Content-Test geschützt

Freiwilligkeit ist in Hub und Advanced sichtbar: persönliche Inhalte dürfen übersprungen werden, ohne Begründung.

## Core-Rechtepass / v36

Im Word-Imposter-Core wurden drei vermeidbare konkrete Begriffe generisch ersetzt:

- `Bluetooth` → `Funkverbindung`
- `Oscar` → `Filmpreis`
- `Formel 1` → `Motorsport`

`tests/core-content-quality.test.js` und `scripts/core_content_audit.py` schützen diese Entscheidung als Regression.

Der Offline-Core wurde deshalb korrekt auf **`secret-circle-v36`** erhöht.

## Fan-Content

`FAN_CONTENT_REVIEW.md` inventarisiert das Labs-Spiel `anime-guess` mit **40 konkreten bekannten Figuren-/Franchisereferenzen**.

Vor Production ist eine bewusste Entscheidung erforderlich:

A. rechtlich freigeben,
B. durch generische Archetypen ersetzen,
C. aus dem öffentlichen Build entfernen/deaktivieren.

Ein „inoffiziell“-Hinweis allein gilt nicht als Rechtefreigabe.

## Security / Backup

- Registry v2 ist zentrale Quelle für Complete-Backup-Format und Limits.
- `party-data-tools.js` dupliziert diese Werte nicht mehr.
- Complete-Import akzeptiert nur registrierte versionierte Word-Imposter- und `secret-circle-party-*`-Key-Familien.
- unbekannte `secret-circle-*`-Namespaces werden abgelehnt.
- `party.html` lädt die Registry vor den Datentools.

Status: **CLOSED IN CODE / RUNNER + REAL BROWSER VERIFICATION OPEN**.

## Accessibility

Vorhanden:

- `ACCESSIBILITY.md`
- `tests/accessibility-contract.test.js`
- `tests/e2e/accessibility-core.spec.js`
- Contract in `npm test` und `npm run check`
- Reflow-Testbasis bei 320 CSS px
- Skip-Link-/Tastatur-/Autocomplete-Gates

Noch nicht als PASS: 200-%-Zoom real, VoiceOver, TalkBack, reale Touchziele, komplette Tastaturrunden und private Reveals mit Screenreader.

## Beta / Realgeräte

`BETA_TEST_PLAN.md` definiert G1–G5, PN1–PN3, Android, iPhone, Tablet, VoiceOver/TalkBack, zwei reale PWA-Upgrades und HTTPS-Rollbackprobe.

Status: **PREPARED – reale Durchführung offen**.

## Third Party / Assets

`THIRD_PARTY_NOTICES.md` hält fest:

- keine npm-Runtime-Dependencies
- `@playwright/test` 1.54.2 ist upstream als **Apache-2.0** verifiziert; NOTICE-Vertrag dokumentiert
- Herkunft/Lizenz der drei App-Icons ist im Repo noch nicht belegt
- keine Root-`LICENSE`-Datei; Projektlizenz wird nicht geraten

## Environments / Staging

`ENVIRONMENTS.md` definiert **Local → CI/Test → HTTPS-Staging → Release Candidate → Production**. Staging und Production benötigen getrennte Origins.

Aktuelle Cachegeneration: **`secret-circle-v36`**.

Noch offen: konkrete Staging-/Production-Origin, Staging-Smoke, echte Upgradepfade und Rollbackprobe.

## CI / Lockfile

Neuester belastbar geprüfter Actions-Lauf: **Run #1905**.

- Job `validate`
- Ergebnis failure
- `steps: []`
- kein Checkout
- kein Repository-Code ausgeführt

`package-lock.json` fehlt weiterhin. Lokale Erzeugung scheiterte am externen Paketnetzwerk/Timeout; kein Lockfile oder Integritätswert wurde erfunden. CI wird erst mit echtem geprüftem Lockfile auf `npm ci` umgestellt.

## Aktuell höchste Prioritäten

### P0

1. GitHub-Actions-Runner / echter Checkout + sichtbare Steps

### P1/P2 parallel ohne Runner

2. echtes `package-lock.json` + `npm ci`
3. Branch Protection / Required Checks
4. Icon-/Asset-Herkunft finalisieren
5. Fan-Content-Entscheidung für `anime-guess`
6. konkrete HTTPS-Staging-Origin
7. Staging-Smoke + PWA-Upgrade-/Rollbacktests
8. reale Accessibility-/Gerätetests
9. reale Gruppentests
10. echte Betreiber-/Support-/Hostingangaben
11. Probeincident + Wartungsroutine
12. finaler Content-/Rechte-Sign-off
13. Release Candidate

## Was weiterhin NICHT als bestanden gilt

Nicht behaupten:

- `npm run ci` grün
- Cross-Browser grün
- Accessibility-Contract/E2E tatsächlich grün
- Content-Test tatsächlich grün
- v36-Update auf real installierten PWAs bestätigt
- Registry-v2-Import im echten Browser vollständig bestätigt
- VoiceOver/TalkBack/200-%-Zoom bestanden
- Beta-/Gruppentest bestanden
- Fan-/Assetrechte final
- Legal/Support final
- HTTPS-Staging bestanden

## Arbeitsregel

Wir arbeiten die A-bis-Z-Anleitung weiter nach unten. Neue P0/P1-Funde dürfen die Reihenfolge vorziehen. Jede Erkenntnis darf Produkt-, Architektur-, Test-, Risiko- und Releaseverträge ändern.
