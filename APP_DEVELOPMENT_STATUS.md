# Secret Circle – A-bis-Z Entwicklungsstatus

Stand: 16. August 2026

Dieses Dokument ist der operative Fortschrittstracker zu `APP_ENTWICKLUNG_VON_A_BIS_Z.md`. Es sagt nicht nur, ob eine Datei existiert, sondern ob der jeweilige Bereich wirklich releaseabgenommen ist.

## Statuswerte

- **DONE** – dokumentiert und für den aktuellen Entwicklungsstand ausreichend abgeschlossen
- **IN PROGRESS** – aktiv in Bearbeitung
- **PREPARED** – technische Grundlage vorhanden, reale/finale Abnahme fehlt
- **OPEN** – noch nicht systematisch bearbeitet
- **BLOCKED** – kann wegen eines bekannten Blockers nicht abgeschlossen werden
- **N/A V1** – bewusst nicht Teil des Januar-2027-Releases

## Gesamtstatus

**Öffentliche Releasefreigabe: NO_GO**

Grund: CI-Nachweis, reale Geräte/PWA-Tests, Content-/Altersprüfung, Accessibility, reale Gruppentests sowie finale Rechts-/Supportangaben sind noch offen.

## A-bis-Z-Tracker

| # | Bereich | Status | Hauptnachweis | Nächste Aktion |
|---|---|---|---|---|
| 0 | Produktziel / Releasegrenze | DONE | `PRODUCT_BRIEF.md`, `RELEASE_SCOPE_2027.md` | bei Scopeänderung aktualisieren |
| A | Querschnittsverträge | PREPARED | Master-Anleitung, `ARCHITECTURE.md` | Security/A11y/Testdetail konsolidieren |
| 1 | Discovery / Problem / Nutzer | IN PROGRESS | `PRODUCT_BRIEF.md`, `USER_SCENARIOS.md` | aktuelle Marktanalyse |
| 2 | Produktstrategie / Scope | PREPARED | `RELEASE_SCOPE_2027.md`, `ROADMAP_2027.md` | Erfolgskriterien später mit realen Tests validieren |
| 3 | Plattformstrategie | PREPARED | `PLATFORM_STRATEGY.md` | reale Zielgeräte später abnehmen |
| 4 | Requirements / Akzeptanz | PREPARED | Contracts, `CORE_GAME_ACCEPTANCE.md`, `CORE_SCORING_RULES.md` | `REQUIREMENTS.md` konsolidieren |
| 5 | UX / IA / Design | OPEN | verteilt | `UX_FLOW.md`, danach `DESIGN_SYSTEM.md` |
| 6 | Architektur / ADR | PREPARED | `ARCHITECTURE.md` | Datenmodell konsolidieren; ADRs nur bei Bedarf |
| 7 | Security / Threat Model | OPEN | Teile in Architektur/Guards | `SECURITY.md` + `THREAT_MODEL.md` |
| 8 | Repo / Environments / Git | BLOCKED | Workflows vorhanden | Runner, Lockfile, `npm ci`, Branch Protection |
| 9 | Feature-Entwicklungsloop | PREPARED | Tests/Contracts/PR #13 | pro Restfeature weiter anwenden |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Backup-/Session-/PWA-Verträge | reale Browser-/Quota-/Updateabnahme |
| 11 | Tests / CI | BLOCKED | `package.json`, `.github/workflows` | funktionierenden Actions-Runner nachweisen |
| 12 | Offline / PWA / Resume | PREPARED | Service Worker, Resume-Contracts | echte Geräte + alte→neue Updates |
| 13 | Content / Alter / Rechte | IN PROGRESS | `RELEASE_CHECKLIST.md` | automatischer + manueller Core-Content-Audit |
| 14 | Beta / reale Gruppen | OPEN | Testanforderungen definiert | 3–4 / 5–8 / 9–12 Personen testen |
| 15 | Datenschutz / Recht / Support | OPEN | Privacy-Grundlage vorhanden | Legal-/Support-/Third-Party-Dokumente |
| 16 | Release Management / RC | PREPARED | Roadmap/Checklist | erst nach Gates finalisieren |
| 17 | Deployment / Veröffentlichung | PREPARED | `DEPLOYMENT.md` | veraltete Angaben synchronisieren; Staging |
| 18 | Operations / Incident | OPEN | Rollbackgrundlage | `SUPPORT.md`, `INCIDENT_RESPONSE.md` |
| 19 | Wartung / Migration | PREPARED | Architektur, Backup-Schemas, Changelog | `MAINTENANCE.md` bei Releasephase |
| 20 | Risk Management | IN PROGRESS | `RISK_REGISTER.md` | bei jedem großen Fund aktualisieren |

## Aktuell höchste Prioritäten

### P0

1. GitHub-Actions-Runner / sichtbare echte CI-Ausführung

### P1

2. `package-lock.json` und `npm ci`
3. Markt-/Positionierungsanalyse abschließen
4. Requirements konsolidieren
5. UX-Flow der Kernaufgaben
6. Security/Threat Model
7. Inhalts-/Altersaudit der 15 Kernspiele
8. Accessibility-Abnahme
9. reale Android-/iPhone-/Tablet-/PWA-Tests
10. reale Gruppentests
11. Recht/Support/Lizenz

## Arbeitsregel

Wir arbeiten grundsätzlich von oben nach unten. Ein P0/P1-Risiko darf die Reihenfolge vorziehen. Jede neue Erkenntnis kann Master-Anleitung, Risikoregister, Architektur, Roadmap oder Release-Gates verändern.

## Nächster geplanter Block

1. `MARKET_RESEARCH.md`
2. `REQUIREMENTS.md`
3. `UX_FLOW.md`
4. `DESIGN_SYSTEM.md`
5. `SECURITY.md` + `THREAT_MODEL.md`
6. Core-Content-/Altersaudit

Danach werden die technischen Releaseblocker und realen Abnahmen systematisch geschlossen.
