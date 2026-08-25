# Secret Circle – A-bis-Z Entwicklungsstatus

Stand: 25. August 2026

Operativer Fortschrittstracker zu `APP_ENTWICKLUNG_VON_A_BIS_Z.md`.

## Gesamtstatus

**Öffentliche Releasefreigabe: NO_GO**  
**Offline-Core: `secret-circle-v46` / `secret-circle-v46-staging`**  
**Classic Content: v4**  
**Core Source Review: 15/15 PREPARED**  
**Core Source Hardening: 15/15 PREPARED**  
**Accessibility Source Hardening: PREPARED**  
**Operator / Hosting / Legal: PREPARED / BLOCKED**

Arbeitsstand: Draft-PR #13 auf `agent/release-foundation-2027`.

v45 war die Cachegeneration nach dem 15/15-Core-Hardening. **v46** ist die neue Generation für das zusätzliche Hub-Accessibility-Hardening und enthält `party-hub-a11y.js` offline.

## A-bis-Z-Tracker

| # | Bereich | Status | Hauptnachweis | Nächste Aktion |
|---|---|---|---|---|
| 0 | Produktziel / Releasegrenze | DONE | Product Brief, Release Scope | bei Scopeänderung aktualisieren |
| A | Querschnittsverträge | PREPARED | Foundation + Readiness + Release/Operator Evidence | reale Gates schließen |
| 1 | Discovery / Nutzer / Markt | DONE | Brief, Scenarios, Market Research | reale Nutzer weiter validieren |
| 2 | Produktstrategie / Scope | PREPARED | Scope, Roadmap | reale Gruppen/Nutzer |
| 3 | Plattformstrategie | PREPARED | Platform Strategy | reale Zielgeräte |
| 4 | Requirements / Akzeptanz | PREPARED | Requirements, Core Contracts, 15/15 Hardening | Runner + reale Core-Abnahme |
| 5 | UX / IA / Design | PREPARED | UX Flow, Live-Core-Guidance, v46 Fokus-/Modalvertrag | reale UX-/Tastaturtests |
| 6 | Architektur / ADR | PREPARED | `ARCHITECTURE.md`, Architecture Audit v46 | bei Grundsatzänderung ADR |
| 7 | Security / Threat Model | PREPARED | Security, Threat Model, Resume-/Privacy-Guards | Runner + echter Browser |
| 8 | Repo / Git / Build | BLOCKED | Lockfile v3, npm-ci-Workflows, Branch Contract | Issue #7 / echter Runner + Branch Protection |
| 9 | Feature-Entwicklungsloop | PREPARED | Tests/Contracts/PR #13, Core + A11y Hardening | keine neue Scope-Welle; Evidence schließen |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Backup-/Session-/PWA-/Resume-Verträge | reale Quota-/Updatepfade |
| 11 | Tests / CI | BLOCKED | Run #2627 + Runner Probe | funktionierender Hosted Runner |
| 12 | Offline / PWA / Resume | PREPARED | Service Worker v46 + Guards/A11y offline | Issue #8 / Install-/Upgrade-/Rollbacktests |
| 13 | Content / Alter / Privacy | IN PROGRESS | 15/15 Quellreview + Privacy-/Reference-Audits | reale Gruppen + finaler Sign-off |
| 14 | Beta / reale Gruppen | PREPARED | `BETA_TEST_PLAN.md`, Issue #8 | reale Sessions durchführen |
| 15 | Datenschutz / Recht / Support | BLOCKED | `operator-release.json`, Legal, Support, Issue #14 | reale Betreiber-/Hosting-/Kontaktangaben |
| 16 | Release Management / RC | PREPARED | Checklist + Release Evidence | unveränderlichen RC einfrieren |
| 17 | Deployment / Environments | BLOCKED | v46 Environment + `HOSTING_DECISION.md` | Provider + echte HTTPS-Origins |
| 18 | Operations / Incident | BLOCKED | Support + Incident + Operator Evidence | Verantwortliche + Support/SEV-1/Rollback-Drills |
| 19 | Wartung / Migration | PREPARED | Maintenance, Backups, Changelog | operative Routine real |
| 20 | Risk Management | IN PROGRESS | Risk Register | laufend aktualisieren |
| 21 | Accessibility | PREPARED | v46 A11y-Layer + Unit/E2E/Audit | VoiceOver/TalkBack/Zoom/Tastatur/Geräte real |
| 22 | Third Party / Assetrechte | BLOCKED | Provenienzmanifest + Rights Sign-off | Icon-Rechte menschlich bestätigen |
| 23 | Fan-/Referenzcontent | IN PROGRESS | Fan Review + Source-Audit | Runner + manuelle Visual/Legal-Abnahme |
| 24 | Release Evidence | PREPARED | `release-evidence.json` + `operator-release.json` + Audits | reale Belege auf einen RC sammeln |

## 15/15 Core-Hardening

- Word Imposter: Setup-Grenzen, Rollenfairness, geheime Karten, Voting-/Resume-Integrität
- persönliche Hub-Spiele: sichtbare Freiwilligkeit/Skip-Regeln und Live-Rundenhilfe
- Paranoia: offene Geheimfrage bei App-/Tab-Wechsel verdeckt
- Scharade/Tabu: Geheimkarten-Sichtschutz + klare Display-Handoff-Regel
- Heiße Kartoffel: Zufallstimer exakt 10–25 Sekunden
- Wortkette: sichtbarer manueller Erfolgsvertrag
- Nur falsche Antworten: manuelle Verlustregel; bewusst scorelos
- Hub-Resume: Timerzustand muss zur Spielart passen
- Advanced: Privacy-Guard + Resume-Guard
- Mafia-Resume: Rollenanzahl, Alive-Menge und Siegerintegrität geprüft

Details: `CORE_GAME_ACCEPTANCE.md`.

## Accessibility-Hardening – v46

Quellseitig neu vorbereitet:

- `party-hub-a11y.js` Version 2
- programmatischer Fokus auf die neue sichtbare Hub-Hauptüberschrift nach Bereichswechsel
- aktive Hub-Spielrunde als modaler Dialog
- Hintergrund-Isolation mit `inert` bei Spieldetail/Spielrunde
- Fokus-Trap für Tab/Shift+Tab
- neue Accessibility-Unit- und E2E-Verträge
- `scripts/hub_a11y_contract_audit.py` in `npm run validate`
- globaler `scripts/architecture_audit.py` kennt jetzt alle Resume-/Privacy-/A11y-Guards als Production-/Offline-Module
- `party-hub-a11y.js` im v46-Offline-Core

Real offen: VoiceOver, TalkBack, 200-%-Zoom, reale Tastatur-/Touch-/Browserprüfung. Deshalb **PREPARED**, nicht PASS.

## Operator-/Hosting-/Legal-Block

Vorbereitet:

- `operator-release.json` – aktuell `PREPARED / BLOCKED`
- `OPERATOR_RELEASE_SIGNOFF.md`
- `HOSTING_DECISION.md`
- `scripts/operator_release_contract_audit.py` in `npm run validate`
- `LEGAL_CHECKLIST.md` Stand 25. August 2026
- `SUPPORT.md` mit Probe-Supportfall
- `INCIDENT_RESPONSE.md` mit verbindlichem SEV-1-/Rollback-Drill
- Issue #14 als operative externe Checkliste

Release-Evidence `legalPrivacy` und `supportIncident` dürfen erst PASS werden, wenn die Operator-Akte `FINAL / READY` ist.

## Offline / PWA v46

Der Service Worker verwendet:

- `secret-circle-v46`
- `secret-circle-v46-staging`

Offline enthalten sind Word-Imposter-/Hub-/Advanced-Resume-/Privacy-Guards sowie die neue Hub-A11y-Schicht. Architektur, Deployment, Environment, Privacy, Service-Worker-Test und reale Testpläne sind auf v46 synchronisiert.

Reale Upgrade-/Rollback-/Geräte-Evidence bleibt offen.

## Build / Supply Chain

- `package-lock.json` v3
- gelockte Playwright-Testkette 1.54.2
- keine npm-Runtime-Dependencies
- feste Registry-URLs + `sha512`
- CI/Cross-Browser verwenden `npm ci`
- Lockfile-, A11y-, Operator- und Readiness-Audits integriert
- aktuelle Cachegeneration wird in Operator-/Readiness-Audits dynamisch aus `sw.js` abgeleitet

Status: **CLOSED IN CODE / ONLINE RUNNER VERIFICATION OPEN**.

## CI

Aktuellster ausdrücklich untersuchter v46-Lauf: **Run #2627**.

- Run ID `32809352564`
- Job `validate`, Job ID `97685596269`
- Head `30ef13f84d34f7fa95c46d441463bb58f0cb09c1`
- `failure`
- Jobliste `steps: null`
- separate Step-Abfrage `steps: []`
- kein Checkout / kein npm / keine Tests / kein Repository-Code ausgeführt

Ein action-/repo-freier Bash-Runner-Probe endete ebenfalls vor Step 1 mit `steps: []`.

Damit liegt der verbleibende Prüfbereich vor der Step-Ausführung: Hosted-Runner-Zuteilung, Account-/Billing-/Budget-/Policyzustand oder GitHub-seitige Runner-Störung.

## Zentrale offene Issues

- **#7:** GitHub Actions endet vor Step 1
- **#8:** reale Geräte, Offline-PWA, Accessibility und Gruppentests
- **#14:** Operator, Hosting, Legal, Support und Incident Evidence

Zusätzlich bleibt die Icon-Rechtebasis offen.

## Höchste Prioritäten ab jetzt

1. Issue #7: Actions-Runner bis zum ersten echten Step reparieren
2. Online-`npm ci` + vollständiges `npm run ci`
3. Cross-Browser auf demselben RC-Kandidaten
4. Branch Protection real bestätigen
5. Issue #14: Provider + Betreiber-/Kontakt-/Privacy-/Supportangaben finalisieren
6. konkrete HTTPS-Staging-Origin + echter v46-Smoke
7. PWA v46 Upgrade/Rollback + Offline-Neustart
8. Issue #8: Android / iPhone / Tablet
9. VoiceOver / TalkBack / reale Tastatur-/Modalfokus-/200-%-Zoom-Abnahme
10. reale Gruppentests für alle 15 Core-Spiele
11. Icon-Rechte + finaler Visual-/Third-Party-Pass
12. Support-/Securitytest + SEV-1-/Rollback-Drill
13. unveränderter RC + `release-evidence.json = FINAL / GO`

## Was jetzt nicht sinnvoll ist

- keine neue 122-Mode-Scope-Welle
- keine großen neuen Backends/Accounts
- keine Monetarisierungsarchitektur vor den Release-Gates
- keine weitere Featuremenge, solange CI, Geräte, Gruppen, Hosting und Legal nicht geschlossen sind

## Nicht als bestanden behaupten

Online-`npm ci`, CI/Cross-Browser, Branch Protection, HTTPS-Staging, reale PWA-/Geräte-/Accessibility-/Gruppentests, Asset-/Operator-/Legal-/Support-Sign-off und finaler Release Evidence GO sind weiterhin offen.
