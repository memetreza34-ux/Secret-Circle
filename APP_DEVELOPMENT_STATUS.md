# Secret Circle – A-bis-Z Entwicklungsstatus

Stand: 16. August 2026

Dieses Dokument ist der operative Fortschrittstracker zu `APP_ENTWICKLUNG_VON_A_BIS_Z.md`. Es sagt nicht nur, ob eine Datei existiert, sondern ob der jeweilige Bereich wirklich releaseabgenommen ist.

## Statuswerte

- **DONE** – dokumentiert und für den aktuellen Entwicklungsstand ausreichend abgeschlossen
- **IN PROGRESS** – aktiv in Bearbeitung
- **PREPARED** – technische/dokumentarische Grundlage vorhanden, reale/finale Abnahme fehlt
- **OPEN** – noch nicht systematisch bearbeitet
- **BLOCKED** – kann wegen eines bekannten Blockers nicht abgeschlossen werden
- **N/A V1** – bewusst nicht Teil des Januar-2027-Releases

## Gesamtstatus

**Öffentliche Releasefreigabe: NO_GO**

Die quantitativen Core-Content-Ziele sind implementiert. Offen bleiben insbesondere: belastbarer CI-Nachweis, Lockfile/`npm ci`, manuelles Content-/Alters-/Privacy-Review, Accessibility, reale Geräte/PWA-Updates, reale Gruppentests sowie finale Rechts-/Supportangaben.

## A-bis-Z-Tracker

| # | Bereich | Status | Hauptnachweis | Nächste Aktion |
|---|---|---|---|---|
| 0 | Produktziel / Releasegrenze | DONE | `PRODUCT_BRIEF.md`, `RELEASE_SCOPE_2027.md` | bei Scopeänderung aktualisieren |
| A | Querschnittsverträge | PREPARED | Master-Anleitung, `ARCHITECTURE.md`, `SECURITY.md`, `REQUIREMENTS.md` | reale A11y/Security/Performance-Abnahme |
| 1 | Discovery / Problem / Nutzer / Markt | DONE | `PRODUCT_BRIEF.md`, `USER_SCENARIOS.md`, `MARKET_RESEARCH.md` | bei Produktänderung aktualisieren |
| 2 | Produktstrategie / Scope | PREPARED | Release-Scope, Roadmap, Product Brief | mit realen Nutzern validieren |
| 3 | Plattformstrategie | PREPARED | `PLATFORM_STRATEGY.md` | reale Zielgeräte abnehmen |
| 4 | Requirements / Akzeptanz | PREPARED | `REQUIREMENTS.md`, Core-Contracts | Traceability mit realen Nachweisen schließen |
| 5 | UX / IA / Design | PREPARED | `UX_FLOW.md`, `DESIGN_SYSTEM.md` | Hero/Startseite + reale Erstnutzer-/Mobile-/Zoom-Tests |
| 6 | Architektur / ADR | PREPARED | `ARCHITECTURE.md` | Datenmodell konsolidieren; ADRs bei Grundsatzentscheidungen |
| 7 | Security / Threat Model | PREPARED | `SECURITY.md`, `THREAT_MODEL.md` | SEC-F01/SEC-F02 schließen |
| 8 | Repo / Environments / Git | BLOCKED | Workflows vorhanden | Runner, Lockfile, `npm ci`, Branch Protection |
| 9 | Feature-Entwicklungsloop | PREPARED | Tests/Contracts/PR #13 | weiter auf Restarbeit anwenden |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Backup-/Session-/PWA-Verträge | reale Browser-/Quota-/Updateabnahme |
| 11 | Tests / CI | BLOCKED | `package.json`, Workflows, Content-Gates | funktionierenden Actions-Runner nachweisen |
| 12 | Offline / PWA / Resume | PREPARED | Service Worker **v32**, Resume-Contracts | echte Geräte + alte→neue Updates |
| 13 | Content / Alter / Rechte | IN PROGRESS | drei Content-Wellen + `CONTENT_AGE_POLICY.md` + Tests/Audit | manuelles semantisches/Alters-/Privacy-Review |
| 14 | Beta / reale Gruppen | OPEN | Szenarien/Releasecheckliste | 3–4 / 5–8 / 9–12 Personen testen |
| 15 | Datenschutz / Recht / Support | OPEN | Privacy-/Security-Grundlage | Legal-/Support-/Third-Party-Dokumente finalisieren |
| 16 | Release Management / RC | PREPARED | Roadmap/Checklist | erst nach Gates finalisieren |
| 17 | Deployment / Veröffentlichung | PREPARED | `DEPLOYMENT.md`, Plattformstrategie | HTTPS-Staging + reale Update-/Rollbacktests |
| 18 | Operations / Incident | OPEN | Security-Meldeweg + Rollbackgrundlage | `SUPPORT.md`, `INCIDENT_RESPONSE.md` |
| 19 | Wartung / Migration | PREPARED | Architektur, Backup-Schemas, Changelog | `MAINTENANCE.md` |
| 20 | Risk Management | IN PROGRESS | `RISK_REGISTER.md` | bei jedem neuen Fund aktualisieren |

## Content-Arbeit abgeschlossen: quantitative Wellen

### Welle 1 – strukturierte/kleine Pools

- Taboo: 8 → 16
- Hot Potato: 8 → 16
- Word Chain: 5 → 10
- Two Truths: 8 → 16
- Question Imposter: 8 → 16
- Location Spy: 8 → 16

### Welle 2 – soziale Prompt-/Choice-Spiele

`party-core-release-catalog.js`:

- Never Have: 8 → 24
- Most Likely: 8 → 24
- Would Rather: 8 → 24
- Paranoia: 8 → 20
- Wrong Answers: 8 → 24

### Welle 3 – klassische Core-Spiele

`party-core-classic-content.js`:

- Truth/Dare: 16 → **24 je Pack**
- Charades: 12 → **30 je Pack**
- Taboo: 16 → **24 je Pack**
- Hot Potato: 16 → **20 je Pack**

Damit besitzt kein Kernspiel mehr einen bekannten quantitativen Shortfall gegenüber `CONTENT_AGE_POLICY.md`.

## Technische Integration der Content-Wellen

- finaler Node-Katalog: `party-core-classic-content.js → party-routing.js`
- Browserfolge: Base → Expansion → Trending → Mega → Viral → Release Content → Classic Content → Routing
- beide Contentmodule liegen im Offline-Core
- Service Worker steht wegen Welle 3 auf **`secret-circle-v32`**
- `tests/service-worker.test.js` erwartet v32
- `tests/core-content-quality.test.js` verlangt alle finalen Mengen und `editorialShortfalls = []`
- Truth/Dare muss technisch mindestens 12 Truth + 12 Dare je Pack besitzen
- `scripts/core_content_audit.py` schützt beide Contentmodule
- beide Module besitzen Syntax- und Performance-Gates

## Content ist trotzdem noch nicht PASS

Quantität ist nur ein Teil der Abnahme. Noch offen:

1. alle Core-Packs vollständig manuell lesen
2. semantische Wiederholungen entfernen
3. Ton/Verständlichkeit prüfen
4. Altersstufen redaktionell bestätigen
5. sensible Inhalte und Skip-Flows prüfen
6. bekannten Truth/Dare-Privacy-Fund schließen
7. Fan-/Marken-/Urheberrechtsreview
8. reale Gruppentests und Wiederholungsrate
9. automatischen Contentvertrag auf einem funktionierenden Runner tatsächlich ausführen

## Bereits umgesetzte A-bis-Z-Foundation

- produktbezogene Master-Anleitung
- Product Brief, Nutzer-Szenarien, Marktanalyse, Risk Register, Plattformstrategie
- zentrale Requirements
- UX Flow und Designsystem
- Security Policy + Threat Model
- Touchziel-Korrekturen
- Scoring-/Winner-Verträge
- Session-/Resume-/Backup-/PWA-Grundlage
- Content-/Altersvertrag und drei Content-Wellen
- Deploymentdokument auf PR #13, Stagingprozess und aktuellen PWA-Stand korrigiert

## Aktuell höchste Prioritäten

### P0

1. GitHub-Actions-Runner: echte Jobs mit Checkout/Steps ermöglichen

### Nächste Arbeitsreihenfolge

2. manuelles Core-Content-/Alters-/Privacy-Review und konkrete Funde beheben
3. Hero-/Startseitenpositionierung auf den echten USP umstellen
4. SEC-F01/SEC-F02 härten
5. `package-lock.json` + `npm ci`
6. Branch Protection
7. Accessibility-Abnahme
8. reale Android-/iPhone-/Tablet-/PWA-Tests
9. reale Gruppentests
10. Recht/Support/Lizenz
11. Operations/Incident/Maintenance
12. RC/Production

## Was weiterhin NICHT als bestanden gilt

Wegen des externen Runnerproblems nicht behaupten:

- `npm run ci` grün
- Cross-Browser grün
- Content-Test grün
- Cache-v32-Update auf realen PWAs bestätigt
- Accessibility/Touchziele auf Zielgeräten bestätigt

## Arbeitsregel

Wir arbeiten grundsätzlich die A-bis-Z-Anleitung weiter nach unten. Ein neues P0/P1-Risiko darf die Reihenfolge vorziehen. Jede Erkenntnis darf Product Brief, Requirements, UX, Architektur, Tests, Risk Register, Roadmap und Release-Gates verändern.
