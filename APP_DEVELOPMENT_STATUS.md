# Secret Circle – A-bis-Z Entwicklungsstatus

Stand: 23. August 2026

Operativer Fortschrittstracker zu `APP_ENTWICKLUNG_VON_A_BIS_Z.md`.

## Gesamtstatus

**Öffentliche Releasefreigabe: NO_GO**  
**Offline-Core: `secret-circle-v44`**  
**Classic Content: v4**  
**Core Source Hardening: 15/15 PREPARED**

Arbeitsstand: Draft-PR #13 auf `agent/release-foundation-2027`.

Technisch weit fortgeschritten: 15 priorisierte Core-Games, quantitative Contentziele, 15/15 Core-Quellreview, 15/15 Core-Hardening-Pass, Exact-once-Sessions, sichere Resume-/Timerpfade, Live-Privacy-Guards, Registry-v2-Backups, Lockfile/npm-ci-Vertrag, source-level Privacy-/Reference-Schutz, PWA-Head-Vertrag, HTTPS-Smoke, Accessibility-/Legal-/Betriebsgrundlage und maschinenlesbarer Release-Evidence-Vertrag.

Wichtig: **PREPARED bedeutet nicht RELEASE PASS.** Automatisierte Runner-Evidence, reale Geräte, Accessibility und Gruppentests sind weiterhin offen.

## Neu seit dem letzten Status

### 15/15 Core-Hardening-Pass

- Word Imposter: Setup-Grenzen, Rollenfairness, geheime Karten, Voting-/Resume-Integrität.
- persönliche Hub-Spiele: sichtbare Freiwilligkeit/Skip-Regeln und Live-Rundenhilfe.
- Paranoia: offene Geheimfrage wird bei App-/Tab-Wechsel verdeckt.
- Scharade/Tabu: Geheimkarten-Sichtschutz + klare Display-Handoff-Regel.
- Heiße Kartoffel: Zufallstimer exakt 10–25 Sekunden.
- Wortkette: sichtbarer manueller Erfolgsvertrag.
- Nur falsche Antworten: sichtbare manuelle Verlustregel; bewusst scorelos.
- Hub-Resume: Timerzustand muss zur Spielart passen.
- Advanced Core: `advanced-privacy-guard.js` + `advanced-resume-guard.js`.
- Advanced-Resume prüft Two-Truths-Ergebnis, Question-Imposter-Rolle/Vote, Location-Spy-Zustand sowie Mafia-Rollenanzahl, Alive-Menge und Siegerintegrität.
- neue Unit-/E2E-Verträge dokumentieren diese Grenzen.

Details: `CORE_GAME_ACCEPTANCE.md`.

## A-bis-Z-Tracker

| # | Bereich | Status | Hauptnachweis | Nächste Aktion |
|---|---|---|---|---|
| 0 | Produktziel / Releasegrenze | DONE | Product Brief, Release Scope | bei Scopeänderung aktualisieren |
| A | Querschnittsverträge | PREPARED | Foundation + Readiness + Evidence | reale Gates schließen |
| 1 | Discovery / Nutzer / Markt | DONE | Brief, Scenarios, Market Research | reale Nutzer weiter validieren |
| 2 | Produktstrategie / Scope | PREPARED | Scope, Roadmap | reale Gruppen/Nutzer |
| 3 | Plattformstrategie | PREPARED | Platform Strategy | reale Zielgeräte |
| 4 | Requirements / Akzeptanz | PREPARED | Requirements, Core Contracts, 15/15 Hardening | Runner + reale Core-Abnahme |
| 5 | UX / IA / Design | PREPARED | UX Flow, Design System, Live-Core-Guidance | reale UX-Tests |
| 6 | Architektur / ADR | PREPARED | `ARCHITECTURE.md` | bei Grundsatzänderung ADR |
| 7 | Security / Threat Model | PREPARED | Security, Threat Model, Resume-/Privacy-Guards | Runner + echter Browser |
| 8 | Repo / Git / Build | BLOCKED | Lockfile v3, npm-ci-Workflows, Branch Contract | echter Runner + Branch Protection |
| 9 | Feature-Entwicklungsloop | PREPARED | Tests/Contracts/PR #13, Core Hardening | keine neue Scope-Welle; Evidenz schließen |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Backup-/Session-/PWA-/Resume-Verträge | reale Quota-/Updatepfade |
| 11 | Tests / CI | BLOCKED | Workflows/Testmatrix + Runner Probe | funktionierender Hosted Runner |
| 12 | Offline / PWA / Resume | PREPARED | Service Worker v44 + PWA-/Resume-Verträge | echte Install-/Upgrade-/Rollbacktests |
| 13 | Content / Alter / Privacy | IN PROGRESS | 15/15 Quellreview + Privacy-/Reference-Audits | reale Gruppen + finaler Sign-off |
| 14 | Beta / reale Gruppen | PREPARED | `BETA_TEST_PLAN.md` | G1–G5 + PN1–PN3 real |
| 15 | Datenschutz / Recht / Support | PREPARED | Privacy, Legal, Support | echte Betreiber-/Hostingangaben |
| 16 | Release Management / RC | PREPARED | Checklist + Release Evidence | unveränderlichen RC einfrieren |
| 17 | Deployment / Environments | PREPARED | Environment + HTTPS-Smoke | echte HTTPS-Origin + Browser/PWA-Smoke |
| 18 | Operations / Incident | PREPARED | Support + Incident Response | Verantwortliche + Drill |
| 19 | Wartung / Migration | PREPARED | Maintenance, Backups, Changelog | operative Routine real |
| 20 | Risk Management | IN PROGRESS | Risk Register | laufend aktualisieren |
| 21 | Accessibility | PREPARED | Contract + E2E + PWA-Head | 200 %, VoiceOver, TalkBack, Geräte |
| 22 | Third Party / Assetrechte | IN PROGRESS | Lockfile-Inventar + Provenienz | Root-SVG-Rechte + RC-Review |
| 23 | Fan-/Referenzcontent | IN PROGRESS | Fan Review + Source-Audit | Runner + manuelle Visual/Legal-Abnahme |
| 24 | Release Evidence | PREPARED | `release-evidence.json` + Audit | reale Belege auf einen RC sammeln |

## Build / Supply Chain

- `package-lock.json` v3
- gelockte Playwright-Testkette 1.54.2; optional `fsevents` 2.3.2
- feste Registry-URLs + `sha512`
- CI und Cross-Browser verwenden `npm ci`
- `scripts/lockfile_contract_audit.py`

Status: **CLOSED IN CODE / ONLINE RUNNER VERIFICATION OPEN**.

## PWA v44

Die fünf interaktiven Einstiegseiten Hub, Word Imposter, Creator, Advanced und Quick besitzen denselben Manifest-/iOS-/Icon-Vertrag. `tests/pwa-head-metadata.test.js` schützt lokal; `scripts/staging_smoke.py` prüft dieselben Metadaten später gegen ausgelieferte HTTPS-Seiten.

Cache: `secret-circle-v44` / `secret-circle-v44-staging`.

Neu im Offline-Core sind auch die zusätzlichen Core-Hardening-Guards, darunter Word-Imposter-Resume sowie Advanced-Privacy-/Resume-Schutz.

## Release Evidence

`release-evidence.json` steht aktuell auf **PREPARED / NO_GO**. `scripts/release_evidence_audit.py` verlangt für ein späteres GO:

- vollständigen RC-SHA/Tag/Cache/URLs
- 15 Pflichtgates PASS
- echten Beleg pro PASS
- exakt denselben RC-Commit pro Gate
- keine verbleibenden bekannten Blocker

## CI

Aktuellster vollständig geprüfter App-CI-Befund: **Run #2401** auf Head `a9f2591a5280ec67b9042df8ff636019c7c6149a`.

- Run ID `32650097844`
- Job ID `97220210755`
- `failure`
- `steps: []`
- kein Checkout
- kein Node-/Python-Setup
- kein Online-`npm ci`
- keine Unit-/Audit-/Playwright-Ausführung
- kein Repository-Code ausgeführt

Zusätzlich wurde ein temporärer **Runner Probe** ohne Checkout, Setup-Action, npm oder Repository-Code ausgeführt. Selbst der einzige lokale Bash-Schritt (`echo` + `uname -a`) endete vor Step 1 mit `steps: []`.

Damit liegt der verbleibende Untersuchungsbereich vor der Step-Ausführung: Hosted-Runner-Zuteilung, Account-/Billing-/Budgetzustand oder GitHub-/Policy-Sperren. Der reguläre Workflow selbst bleibt unverändert, weil ein Code-/Workflow-Patch diesen externen Pre-Step-Blocker nicht sinnvoll behebt.

Neuere Hardening-Commits besitzen weiterhin keine erfolgreiche Runner-Evidence.

## Höchste Prioritäten ab jetzt

1. Actions-Runner / echter Step-Start reparieren.
2. vollständiges `npm run ci` auf exakt demselben Commit.
3. Cross-Browser auf demselben RC-Kandidaten.
4. Branch Protection tatsächlich aktivieren/bestätigen.
5. konkrete HTTPS-Staging-Origin + echter Smoke.
6. PWA Upgrade/Rollback + Offline-Neustart auf installierter App.
7. Android / iPhone / Tablet.
8. VoiceOver / TalkBack / Tastatur / 200-%-Zoom.
9. reale Gruppentests für alle 15 Core-Spiele; große Gruppen besonders für Word Imposter, Paranoia und Mafia.
10. Root-SVG-Rechte + finaler Visual-/Third-Party-Pass.
11. Betreiber-/Hosting-/Privacy-/Support-/Legalangaben.
12. Incident-Drill.
13. unveränderter RC + `release-evidence.json = FINAL / GO` erst nach vollständiger Evidence.

## Was jetzt **nicht** sinnvoll ist

- keine neue 122-Mode-Scope-Welle,
- keine großen neuen Backends/Accounts,
- keine Monetarisierungsarchitektur vor den Release-Gates,
- keine weitere Featuremenge, solange CI, Geräte, Gruppen und Legal nicht geschlossen sind.

## Nicht als bestanden behaupten

Online-`npm ci`, CI/Cross-Browser, Branch Protection, HTTPS-Staging, reale PWA-/Geräte-/Accessibility-/Gruppentests, Root-SVG-/Legal-/Support-Sign-off und finaler Release Evidence GO sind weiterhin offen.
