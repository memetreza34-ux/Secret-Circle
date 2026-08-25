# Secret Circle – A-bis-Z Entwicklungsstatus

Stand: 25. August 2026

Operativer Fortschrittstracker zu `APP_ENTWICKLUNG_VON_A_BIS_Z.md`.

## Gesamtstatus

**Öffentliche Releasefreigabe: NO_GO**  
**Offline-Core: `secret-circle-v45` / `secret-circle-v45-staging`**  
**Classic Content: v4**  
**Core Source Review: 15/15 PREPARED**  
**Core Source Hardening: 15/15 PREPARED**  
**Operator / Hosting / Legal: PREPARED / BLOCKED**

Arbeitsstand: Draft-PR #13 auf `agent/release-foundation-2027`.

v45 ist die korrekte Cachegeneration nach dem 15/15-Core-Hardening. Die neuen Resume-/Privacy-Guard-Dateien sind explizit Teil des Offline-Core.

## A-bis-Z-Tracker

| # | Bereich | Status | Hauptnachweis | Nächste Aktion |
|---|---|---|---|---|
| 0 | Produktziel / Releasegrenze | DONE | Product Brief, Release Scope | bei Scopeänderung aktualisieren |
| A | Querschnittsverträge | PREPARED | Foundation + Readiness + Release/Operator Evidence | reale Gates schließen |
| 1 | Discovery / Nutzer / Markt | DONE | Brief, Scenarios, Market Research | reale Nutzer weiter validieren |
| 2 | Produktstrategie / Scope | PREPARED | Scope, Roadmap | reale Gruppen/Nutzer |
| 3 | Plattformstrategie | PREPARED | Platform Strategy | reale Zielgeräte |
| 4 | Requirements / Akzeptanz | PREPARED | Requirements, Core Contracts, 15/15 Hardening | Runner + reale Core-Abnahme |
| 5 | UX / IA / Design | PREPARED | UX Flow, Design System, Live-Core-Guidance | reale UX-Tests |
| 6 | Architektur / ADR | PREPARED | `ARCHITECTURE.md` | bei Grundsatzänderung ADR |
| 7 | Security / Threat Model | PREPARED | Security, Threat Model, Resume-/Privacy-Guards | Runner + echter Browser |
| 8 | Repo / Git / Build | BLOCKED | Lockfile v3, npm-ci-Workflows, Branch Contract | Issue #7 / echter Runner + Branch Protection |
| 9 | Feature-Entwicklungsloop | PREPARED | Tests/Contracts/PR #13, Core Hardening | keine neue Scope-Welle; Evidence schließen |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Backup-/Session-/PWA-/Resume-Verträge | reale Quota-/Updatepfade |
| 11 | Tests / CI | BLOCKED | Run #2565 + Runner Probe | funktionierender Hosted Runner |
| 12 | Offline / PWA / Resume | PREPARED | Service Worker v45 + PWA-/Resume-Verträge | Issue #8 / Install-/Upgrade-/Rollbacktests |
| 13 | Content / Alter / Privacy | IN PROGRESS | 15/15 Quellreview + Privacy-/Reference-Audits | reale Gruppen + finaler Sign-off |
| 14 | Beta / reale Gruppen | PREPARED | `BETA_TEST_PLAN.md`, Issue #8 | reale Sessions durchführen |
| 15 | Datenschutz / Recht / Support | BLOCKED | `operator-release.json`, Legal, Support, Issue #14 | reale Betreiber-/Hosting-/Kontaktangaben |
| 16 | Release Management / RC | PREPARED | Checklist + Release Evidence | unveränderlichen RC einfrieren |
| 17 | Deployment / Environments | BLOCKED | v45 Environment + `HOSTING_DECISION.md` | Provider + echte HTTPS-Origins |
| 18 | Operations / Incident | BLOCKED | Support + Incident + Operator Evidence | Verantwortliche + Support/SEV-1/Rollback-Drills |
| 19 | Wartung / Migration | PREPARED | Maintenance, Backups, Changelog | operative Routine real |
| 20 | Risk Management | IN PROGRESS | Risk Register | laufend aktualisieren |
| 21 | Accessibility | PREPARED | Contract + E2E + PWA-Head | 200 %, VoiceOver, TalkBack, Geräte |
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

## Operator-/Hosting-/Legal-Block

Neu vorbereitet:

- `operator-release.json` – aktuell `PREPARED / BLOCKED`
- `OPERATOR_RELEASE_SIGNOFF.md`
- `HOSTING_DECISION.md`
- `scripts/operator_release_contract_audit.py` in `npm run validate`
- `LEGAL_CHECKLIST.md` auf Stand 25. August 2026
- `SUPPORT.md` mit Probe-Supportfall
- `INCIDENT_RESPONSE.md` mit verbindlichem SEV-1-/Rollback-Drill
- Issue #14 als operative externe Checkliste

Release-Evidence `legalPrivacy` und `supportIncident` dürfen erst PASS werden, wenn die Operator-Akte `FINAL / READY` ist.

## Offline / PWA v45

Der Service Worker verwendet:

- `secret-circle-v45`
- `secret-circle-v45-staging`

Synchronisiert sind Service Worker, Test, Architektur, Deployment, Environment, Privacy und operative Release-Dokumente.

Reale Upgrade-/Rollback-/Geräte-Evidence bleibt offen.

## Build / Supply Chain

- `package-lock.json` v3
- gelockte Playwright-Testkette 1.54.2
- keine npm-Runtime-Dependencies
- feste Registry-URLs + `sha512`
- CI/Cross-Browser verwenden `npm ci`
- Lockfile-, Operator- und Readiness-Audits integriert

Status: **CLOSED IN CODE / ONLINE RUNNER VERIFICATION OPEN**.

## CI

Aktuellster bestätigter App-CI-Befund:

- Run **#2565**
- Run ID `32808084307`
- Job ID `97681972379`
- Head `668c65fce0233553fb2013631be2abe6cfd2f2a4`
- `failure`
- Jobliste `steps: null`
- separate Step-Abfrage `steps: []`
- Joblogs nicht vorhanden
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
6. konkrete HTTPS-Staging-Origin + echter v45-Smoke
7. PWA v45 Upgrade/Rollback + Offline-Neustart
8. Issue #8: Android / iPhone / Tablet
9. VoiceOver / TalkBack / Tastatur / 200-%-Zoom
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
