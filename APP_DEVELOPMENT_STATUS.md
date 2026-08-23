# Secret Circle – A-bis-Z Entwicklungsstatus

Stand: 23. August 2026

Operativer Fortschrittstracker zu `APP_ENTWICKLUNG_VON_A_BIS_Z.md`.

## Gesamtstatus

**Öffentliche Releasefreigabe: NO_GO**  
**Offline-Core: `secret-circle-v45` / `secret-circle-v45-staging`**  
**Classic Content: v4**  
**Core Source Review: 15/15 PREPARED**  
**Core Source Hardening: 15/15 PREPARED**

Arbeitsstand: Draft-PR #13 auf `agent/release-foundation-2027`.

v45 ist die korrekte Cachegeneration nach dem 15/15-Core-Hardening. Die neuen Resume-/Privacy-Guard-Dateien sind damit explizit Teil des Offline-Core; v44 wird nicht für veränderte Offline-Inhalte wiederverwendet.

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
| 9 | Feature-Entwicklungsloop | PREPARED | Tests/Contracts/PR #13, Core Hardening | keine neue Scope-Welle; Evidence schließen |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Backup-/Session-/PWA-/Resume-Verträge | reale Quota-/Updatepfade |
| 11 | Tests / CI | BLOCKED | Workflows/Testmatrix + Runner Probe | funktionierender Hosted Runner |
| 12 | Offline / PWA / Resume | PREPARED | Service Worker v45 + PWA-/Resume-Verträge | echte Install-/Upgrade-/Rollbacktests |
| 13 | Content / Alter / Privacy | IN PROGRESS | 15/15 Quellreview + Privacy-/Reference-Audits | reale Gruppen + finaler Sign-off |
| 14 | Beta / reale Gruppen | PREPARED | `BETA_TEST_PLAN.md`, Issue #8 | reale Sessions durchführen |
| 15 | Datenschutz / Recht / Support | PREPARED | Privacy, Legal, Support | echte Betreiber-/Hostingangaben |
| 16 | Release Management / RC | PREPARED | Checklist + Release Evidence | unveränderlichen RC einfrieren |
| 17 | Deployment / Environments | PREPARED | v45 Environment + HTTPS-Smoke | echte HTTPS-Origin + Browser/PWA-Smoke |
| 18 | Operations / Incident | PREPARED | Support + Incident Response | Verantwortliche + Drill |
| 19 | Wartung / Migration | PREPARED | Maintenance, Backups, Changelog | operative Routine real |
| 20 | Risk Management | IN PROGRESS | Risk Register | laufend aktualisieren |
| 21 | Accessibility | PREPARED | Contract + E2E + PWA-Head | 200 %, VoiceOver, TalkBack, Geräte |
| 22 | Third Party / Assetrechte | BLOCKED | Provenienzmanifest + Rights Sign-off | Icon-Rechte menschlich bestätigen |
| 23 | Fan-/Referenzcontent | IN PROGRESS | Fan Review + Source-Audit | Runner + manuelle Visual/Legal-Abnahme |
| 24 | Release Evidence | PREPARED | `release-evidence.json` + Audit | reale Belege auf einen RC sammeln |

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

## Offline / PWA v45

Der Service Worker verwendet:

- `secret-circle-v45`
- `secret-circle-v45-staging`

Neu gegenüber v44 ist die korrekte neue Cachegeneration nach den Core-Hardening-Änderungen. Insbesondere sind die zusätzlichen Resume-/Privacy-Guards offline inventarisiert.

Synchronisiert wurden:

- `sw.js`
- `tests/service-worker.test.js`
- `ARCHITECTURE.md`
- `DEPLOYMENT.md`
- `ENVIRONMENTS.md`
- `privacy.html`
- README / Release-Status / operative Testdokumente

Reale Upgrade-/Rollback-/Geräte-Evidence bleibt offen.

## Build / Supply Chain

- `package-lock.json` v3
- gelockte Playwright-Testkette 1.54.2
- keine npm-Runtime-Dependencies
- feste Registry-URLs + `sha512`
- CI/Cross-Browser verwenden `npm ci`
- Lockfile-Audit integriert

Status: **CLOSED IN CODE / ONLINE RUNNER VERIFICATION OPEN**.

## CI

Aktuellster vollständig geprüfter App-CI-Befund:

- Run #2401
- Run ID `32650097844`
- Job ID `97220210755`
- Head `a9f2591a5280ec67b9042df8ff636019c7c6149a`
- `failure`
- `steps: []`
- kein Checkout / kein npm / keine Tests / kein Repository-Code ausgeführt

Ein action-/repo-freier Bash-Runner-Probe endete ebenfalls vor Step 1 mit `steps: []`.

Damit liegt der verbleibende Prüfbereich vor der Step-Ausführung: Hosted-Runner-Zuteilung, Account-/Billing-/Budget-/Policyzustand oder GitHub-seitige Runner-Störung.

## Assets / Rechte

- technisches Provenienzmanifest vorhanden
- `ASSET_RIGHTS_SIGNOFF.md` vorhanden
- `icon.svg`, `icon-192.png`, `icon-512.png` bleiben bis menschlicher Rechtebestätigung `unresolved`

Kein künstlicher Asset-PASS.

## Höchste Prioritäten ab jetzt

1. Actions-Runner bis zum ersten echten Step reparieren
2. Online-`npm ci` + vollständiges `npm run ci`
3. Cross-Browser auf demselben RC-Kandidaten
4. Branch Protection real bestätigen
5. konkrete HTTPS-Staging-Origin + echter v45-Smoke
6. PWA v45 Upgrade/Rollback + Offline-Neustart
7. Android / iPhone / Tablet
8. VoiceOver / TalkBack / Tastatur / 200-%-Zoom
9. reale Gruppentests für alle 15 Core-Spiele
10. Icon-Rechte + finaler Visual-/Third-Party-Pass
11. Betreiber-/Hosting-/Privacy-/Support-/Legalangaben
12. Incident-Drill
13. unveränderter RC + `release-evidence.json = FINAL / GO`

## Was jetzt nicht sinnvoll ist

- keine neue 122-Mode-Scope-Welle
- keine großen neuen Backends/Accounts
- keine Monetarisierungsarchitektur vor den Release-Gates
- keine weitere Featuremenge, solange CI, Geräte, Gruppen und Legal nicht geschlossen sind

## Nicht als bestanden behaupten

Online-`npm ci`, CI/Cross-Browser, Branch Protection, HTTPS-Staging, reale PWA-/Geräte-/Accessibility-/Gruppentests, Asset-/Legal-/Support-Sign-off und finaler Release Evidence GO sind weiterhin offen.
