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

Grund: belastbarer CI-Nachweis, Lockfile/`npm ci`, reale Geräte/PWA-Tests, vollständiger Content-Ausbau und redaktionelle Abnahme, Accessibility, reale Gruppentests sowie finale Rechts-/Supportangaben sind noch offen.

## A-bis-Z-Tracker

| # | Bereich | Status | Hauptnachweis | Nächste Aktion |
|---|---|---|---|---|
| 0 | Produktziel / Releasegrenze | DONE | `PRODUCT_BRIEF.md`, `RELEASE_SCOPE_2027.md` | bei Scopeänderung aktualisieren |
| A | Querschnittsverträge | PREPARED | Master-Anleitung, `ARCHITECTURE.md`, `SECURITY.md`, `REQUIREMENTS.md` | reale A11y/Security/Performance-Abnahme später |
| 1 | Discovery / Problem / Nutzer / Markt | DONE | `PRODUCT_BRIEF.md`, `USER_SCENARIOS.md`, `MARKET_RESEARCH.md` | vor Monetarisierung/Storeentscheidung erneut aktualisieren |
| 2 | Produktstrategie / Scope | PREPARED | `RELEASE_SCOPE_2027.md`, `ROADMAP_2027.md`, marktvalidierter Product Brief | mit realen Nutzern validieren |
| 3 | Plattformstrategie | PREPARED | `PLATFORM_STRATEGY.md` | reale Zielgeräte abnehmen |
| 4 | Requirements / Akzeptanz | PREPARED | `REQUIREMENTS.md`, Contracts, `CORE_GAME_ACCEPTANCE.md`, `CORE_SCORING_RULES.md` | Traceability später mit realen Nachweisen schließen |
| 5 | UX / IA / Design | PREPARED | `UX_FLOW.md`, `DESIGN_SYSTEM.md` | reale Erstnutzer-/Mobile-/Zoom-Tests; weitere UI-Korrekturen |
| 6 | Architektur / ADR | PREPARED | `ARCHITECTURE.md` | Datenmodell konsolidieren; ADRs bei neuen Grundsatzentscheidungen |
| 7 | Security / Threat Model | PREPARED | `SECURITY.md`, `THREAT_MODEL.md` | SEC-F01/SEC-F02 + echte Privacy-/PWA-Tests schließen |
| 8 | Repo / Environments / Git | BLOCKED | Workflows vorhanden | Runner, Lockfile, `npm ci`, Branch Protection |
| 9 | Feature-Entwicklungsloop | PREPARED | Tests/Contracts/PR #13 | pro Restfeature weiter anwenden |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Backup-/Session-/PWA-Verträge | reale Browser-/Quota-/Updateabnahme |
| 11 | Tests / CI | BLOCKED | `package.json`, `.github/workflows`, Content-Gates | funktionierenden Actions-Runner nachweisen |
| 12 | Offline / PWA / Resume | PREPARED | Service Worker, Resume-Contracts | echte Geräte + alte→neue Updates |
| 13 | Content / Alter / Rechte | IN PROGRESS | `CONTENT_AGE_POLICY.md`, `tests/core-content-quality.test.js`, `scripts/core_content_audit.py`, Content-Welle 1 | verbleibende Core-Packs auf Zielniveau ausbauen + manuell abnehmen |
| 14 | Beta / reale Gruppen | OPEN | `USER_SCENARIOS.md`, Releasecheckliste | 3–4 / 5–8 / 9–12 Personen testen |
| 15 | Datenschutz / Recht / Support | OPEN | Privacy-/Security-Grundlage vorhanden | Legal-/Support-/Third-Party-Dokumente finalisieren |
| 16 | Release Management / RC | PREPARED | Roadmap/Checklist | erst nach Gates finalisieren |
| 17 | Deployment / Veröffentlichung | PREPARED | `DEPLOYMENT.md`, `PLATFORM_STRATEGY.md` | veraltete Angaben synchronisieren; HTTPS-Staging |
| 18 | Operations / Incident | OPEN | Security-Meldeweg + Rollbackgrundlage | `SUPPORT.md`, `INCIDENT_RESPONSE.md` |
| 19 | Wartung / Migration | PREPARED | Architektur, Backup-Schemas, Changelog | `MAINTENANCE.md` in Releasephase |
| 20 | Risk Management | IN PROGRESS | `RISK_REGISTER.md` | bei jedem Fund aktualisieren |

## Seit Start der A-bis-Z-Arbeit umgesetzt

### Produkt und Strategie

- Master-Anleitung vollständig auf Secret Circle zugeschnitten
- Security, Privacy, Accessibility, Testing, Performance und Datenintegrität als Querschnittsverträge definiert
- `PRODUCT_BRIEF.md`
- `USER_SCENARIOS.md` mit 20 realen Nutzungsszenarien
- `MARKET_RESEARCH.md`
- `RISK_REGISTER.md`
- `PLATFORM_STRATEGY.md`
- Marktpositionierung korrigiert: Offline/kein Account/ein Gerät ist Baseline; Differenzierung liegt in Party-Hub-Tiefe, sicheren privaten Zuständen/Resume, Creator und lokaler Datenkontrolle

### Anforderungen, UX und Design

- `REQUIREMENTS.md` mit ID-basierten MUST-/SHOULD-Verträgen
- `UX_FLOW.md` für Erststart, Wiederkehrer, Spieler, Suche/Filter, private Reveals, Timer, Abschluss, Next Game, Creator, Daten und PWA-Update
- `DESIGN_SYSTEM.md`
- erste echte Designkorrektur: wichtige Hub-/Creator-Controls, die bisher 36–42px hoch waren, auf mindestens 44px angehoben
- Hero-USP als zu generisch identifiziert; Copy-/Startseitenpass bleibt offen

### Security

- vorhandenes `SECURITY.md` auf aktuellen Produktstand erweitert
- `THREAT_MODEL.md` ergänzt
- SEC-F01: möglicher Drift zwischen `backup-schema-registry.js` und duplizierten Complete-Backup-Konstanten in `party-data-tools.js`
- SEC-F02: bewusste Entscheidung zur generischen `secret-circle-*`-Importfläche noch offen

### Content und Contracts

- `CONTENT_AGE_POLICY.md`
- `tests/core-content-quality.test.js`
- `scripts/core_content_audit.py`
- Content-Test in `npm test`, Syntaxgate und `npm run validate` integriert
- Truth/Dare-Testdrift `Tief` → tatsächliches `Tiefer` korrigiert
- Word Imposter im Core-Contract auf seine echte separate `word-packs.js`-Quelle umgestellt
- Advanced-Packdrift korrigiert:
  - Two Truths: `Locker`, `Reise`, `Schule & Arbeit`
  - Question Imposter: `Alltag`, `Meinungen`, `Schätzfragen`
  - Location Spy: `Reise`, `Alltag`, `Fantasieorte`
  - Mafia: `Schnell`, `Klassisch`, `Erweitert`
- veraltete Expansion-/Routing-Testversionen synchronisiert

### Content-Welle 1

Erste reale Inhaltsvergrößerung ist in `party-expansion.js` umgesetzt und durch neue Regression-Gates geschützt:

- Taboo: **8 → 16** Karten je Pack
- Hot Potato: **8 → 16** Einträge je Pack
- Word Chain: **5 → 10** Startbuchstaben je Pack
- Two Truths: **8 → 16** Prompts je Pack
- Question Imposter: **8 → 16** Fragepaare je Pack
- Location Spy: **8 → 16** Orte je Pack

`party-expansion.js` steht dafür jetzt auf Version 4. `tests/party-expansion.test.js` verlangt die neuen Mengen explizit. `tests/core-content-quality.test.js` hebt die harten Mindestwerte für diese Mechaniken entsprechend an.

## Aktueller Core-Content-Befund

### Auf aktuellem Zielniveau

- Word Imposter: 14 Kategorien × 12 Begriffe = 168
- Word Chain: 4 × 10 Starts
- Two Truths: 3 × 16 Prompts
- Question Imposter: 3 × 16 Fragepaare
- Location Spy: 3 × 16 Orte

### Solide, aber noch auszubauen

- Truth/Dare: 4 × 16; Ziel 20–24
- Charades: 4 × 12; Ziel 30
- Taboo: 3 × 16; Ziel 24
- Hot Potato: 3 × 16; Ziel 20

### Noch deutlich zu dünn

- Never Have: 4 × 8
- Most Likely: 4 × 8
- Would Rather: 4 × 8
- Paranoia: 3 × 8
- Wrong Answers: 3 × 8

Diese Mengen gelten **nicht** als finale Inhaltsfreigabe. `CONTENT_AGE_POLICY.md` definiert die höheren redaktionellen Zielwerte.

## Aktuell höchste Prioritäten

### P0

1. GitHub-Actions-Runner / sichtbare echte CI-Ausführung

### P1/P2 in sinnvoller Arbeitsreihenfolge

2. Content-Welle 2: Never Have / Most Likely / Would Rather / Paranoia / Wrong Answers ausbauen
3. Content-Welle 3: Truth/Dare / Charades / Taboo / Hot Potato auf Endziel bringen
4. semantische/manuelle Content-/Altersprüfung
5. Hero-/Startseitenpositionierung und restliche UX-Korrekturen
6. SEC-F01/SEC-F02 entscheiden/härten
7. `package-lock.json` + `npm ci`
8. Branch Protection
9. Accessibility-Abnahme
10. reale Android-/iPhone-/Tablet-/PWA-Tests
11. reale Gruppentests
12. Recht/Support/Lizenz
13. Deployment/Staging synchronisieren

## Wichtig: Was NICHT als bestanden gilt

Die neuen/angepassten Tests und Audits sind im Repository verdrahtet, aber wegen des externen Runnerproblems **noch nicht als ausgeführt oder grün dokumentiert**.

Insbesondere nicht behaupten:

- `npm run ci` grün
- Cross-Browser grün
- Content-Test grün
- neue Content-Welle durch CI bestätigt
- neue Touchziele visuell auf Zielgeräten bestätigt

## Nächster Arbeitsblock

1. Content-Welle 2: fünf verbliebene 8-Karten-Core-Gruppen ausbauen
2. Content-Welle 3: restliche Packs auf Endziel bringen
3. manuelle redaktionelle Alters-/Privacy-Prüfung
4. Hero-/Startseitencopy an neue Marktpositionierung anpassen
5. SEC-F01/SEC-F02 hardenen
6. danach CI-/Lockfile-/Branch-Protection-Blocker
7. anschließend reale Geräte/A11y/Gruppen/Legal

## Arbeitsregel

Wir arbeiten grundsätzlich von oben nach unten. Ein neues P0/P1-Risiko darf die Reihenfolge vorziehen. Jede neue Erkenntnis kann Master-Anleitung, Risikoregister, Product Brief, Requirements, UX, Architektur, Tests, Roadmap oder Release-Gates verändern.
