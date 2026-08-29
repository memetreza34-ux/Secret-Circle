# Secret Circle – A-bis-Z Entwicklungsstatus

Stand: 29. August 2026

Operativer Fortschrittstracker zu `APP_ENTWICKLUNG_VON_A_BIS_Z.md`.

## Gesamtstatus

**Öffentliche Releasefreigabe: NO_GO**  
**Built-ins: 55 · 15 Core / 13 Extended / 27 Labs**  
**Expansion Wave 1: 10/10 quellsseitig implementiert**  
**Offline-Core: `secret-circle-v64` / `secret-circle-v64-staging`**  
**Package: `1.0.0-beta.3`**  
**Core Source Review/Hardening: 15/15 PREPARED**  
**Accessibility: PREPARED**  
**Spezialgates DWI bis HS60: source PREPARED, real evidence OPEN**  
**Wave-1-Labs: source PREPARED, real Browser/PWA/Group evidence OPEN**  
**Operator / Hosting / Legal / Support: PREPARED / BLOCKED**  
**Icon-Provenienz: SOURCE RESOLVED**  
**Asset-/Third-Party-Gesamtgate: BLOCKED bis reale Final-Evidence vorliegt**

Arbeitsstand: Draft-PR #13 auf `agent/release-foundation-2027`; Main/Reconciliation-Kandidat Draft-PR #15.

## Versionslinie

v45 Core → v46 Hub-A11y → v47 Secondary-A11y → v48 Word-Imposter → v49 Hub Resume Guard → v50 fail-closed Loader → v51 Complete Backup → v52 sichere Hub-Current-Runden → v53 Paranoia Resume/Privacy → v54 Pre-Timer Resume → v55 Advanced Integrity → v56 Quick Session Replacement → v57 Quick Timer Resume → v58 BFCache Timer Resume → v59 Background Timer Fairness → v60 Hidden Snapshot Durability → v61 Quiz → v62 Imposter → v63 Writing → **v64 Wave 1 Complete**.

## A-bis-Z-Tracker

| # | Bereich | Status | Nächste reale Aktion |
|---|---|---|---|
| 0 | Produktziel / Releasegrenze | DONE | Januar-Core nicht weiter aufblasen |
| A | Querschnittsverträge | PREPARED | reale Gates schließen |
| 1 | Discovery / Nutzer / Markt | DONE | reale Nutzer weiter validieren |
| 2 | Produktstrategie / Scope | PREPARED | reale Gruppen; Labs nicht automatisch in Core übernehmen |
| 3 | Plattformstrategie | PREPARED | reale Zielgeräte |
| 4 | Requirements / Akzeptanz | PREPARED | Runner + reale Core-/Advanced-/Quick-/Wave-1-Abnahme |
| 5 | UX / IA / Design | PREPARED | reale UX-/Tastaturtests |
| 6 | Architektur / ADR | PREPARED | v64-PWA-/Lifecycle-Evidence |
| 7 | Security / Threat Model | PREPARED | echter Browser/Runner |
| 8 | Repo / Git / Build | BLOCKED | Issue #7 + PR #15 + Branch Protection |
| 9 | Feature-Entwicklungsloop | PREPARED | nur gezielte Hardening-Funde; kein Scope-Bloat |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Quota/Update/Resume/Restore/Replacement/Timer/BFCache/Background/Cold Resume real |
| 11 | Tests / CI | BLOCKED | Hosted-Runner-Zuteilung/Actions-Gate lösen |
| 12 | Offline / PWA / Resume | PREPARED | v64 Install/Upgrade/Rollback + Spezialgates |
| 13 | Content / Alter / Privacy | IN PROGRESS | reale Gruppen + finaler Sign-off |
| 14 | Beta / reale Gruppen | PREPARED | Core + Spezialgates + Wave-1-Labs real |
| 15 | Datenschutz / Recht / Support | BLOCKED | reale Betreiber-/Hosting-/Kontaktangaben |
| 16 | Release Management / RC | PREPARED | unveränderlichen RC einfrieren |
| 17 | Deployment / Environments | BLOCKED | Provider + echte HTTPS-Origins |
| 18 | Operations / Incident | BLOCKED | Verantwortliche + reale Drills |
| 19 | Wartung / Migration | PREPARED | operative Routine real |
| 20 | Risk Management | IN PROGRESS | laufend aktualisieren |
| 21 | Accessibility | PREPARED | VoiceOver/TalkBack/Zoom/Tastatur/Geräte |
| 22 | Third Party / Assetrechte | PARTIAL | Icon-Provenienz gelöst; Runner-/Integrity-/Finalreview-Evidence offen |
| 23 | Fan-/Referenzcontent | IN PROGRESS | Runner + manuelle Visual/Legal-Abnahme |
| 24 | Release Evidence | PREPARED | reale Belege auf einen unveränderten RC sammeln |

## v60 – Hidden Snapshot Durability

- `party-session-controls.js` Version 5 persistiert die Quick-Family-Restzeit bereits bei `visibilitychange(hidden)`.
- Cold Resume bleibt dadurch auch ohne zuverlässiges späteres `pagehide` möglich.
- normaler Same-Page-Stop räumt den Visibility-Snapshot auf.
- Cold Resume konsumiert den Snapshot genau einmal.

Realer Nachweis bleibt: **HS60**.

## v61–v64 – Expansion Wave 1

Wave 1 ist quellsseitig mit **10/10 geplanten Labs** implementiert:

1. `bluff-trivia`
2. `party-quiz`
3. `fact-or-fake`
4. `percent-guess`
5. `fill-blank-battle`
6. `who-wrote-it`
7. `party-bracket`
8. `undercover-similar-word`
9. `no-word-imposter`
10. `password-one-word`

Die Implementierung verwendet sechs wiederverwendbare Enginefamilien: Quiz, Imposter, Writing, Estimation/Voting, Bluff und Clue. `quick-loader.js` v11 routet sie explizit; `party-release-structure.js` v5 hält alle zehn Modi in Labs.

**Source-Implementierung ist kein Release-PASS.** Browser-, PWA-, Accessibility- und reale Gruppenevidence bleiben offen.

## Offline / PWA v64

- `secret-circle-v64`
- `secret-circle-v64-staging`
- SessionControls v5 + QT57 + BF58 + BG59 + HS60 offline
- Quick Replacement Guard + Wave-1-Routing offline
- alle früheren Resume-/Privacy-/A11y-/Backup-/Advanced-Verträge enthalten
- alle zehn Wave-1-Labs im Offline-Core

## Build / CI

- `package-lock.json` v3
- Playwright 1.54.2
- keine npm-Runtime-Dependencies
- Syntax-, Unit-, Contract-, Audit- und Playwright-Gates vorbereitet
- GitHub Actions reproduziert vor Step 1 `steps: []`, `runner_id: 0`, leeren Runner-Namen
- kein Checkout, npm, Playwright, Python-Audit oder Repositorycode wird in diesen Jobs ausgeführt
- kein aktueller Hosted-Runner-PASS

Status: **CLOSED IN CODE / HOSTED-RUNNER VERIFICATION BLOCKED**.

## Asset-Hardening

Das frühere ungeklärte Root-App-Icon wurde vollständig ersetzt.

- `icon.svg`: `verified-own`
- `icon-192.png`: `verified-own`
- `icon-512.png`: `verified-own`
- neue Hashes im Provenienzmanifest
- Erstellungsweg in `ASSET_RIGHTS_SIGNOFF.md` und `assets/manifests/ORIGINAL_ICON_SOURCE.md`
- Media-Vertrag weiterhin exakt drei Release-Mediendateien

Der alte Icon-Rechteblocker ist damit **source-seitig geschlossen**. Offen bleiben für `assetsThirdParty`:

- echter Online-`npm ci`-/Integrity-Nachweis
- tatsächlicher PASS von Asset-/Media-Audits auf funktionierendem Runner/Checkout
- kompletter `npm run validate`
- finaler manueller Visual-/Marken-/Third-Party-Plausibilitätsreview auf dem RC

## Zentrale offene Issues

- **#7:** GitHub Actions endet vor Step 1
- **#8:** reale Geräte, v64 Offline-PWA, Accessibility, Spezialgates, Wave-1-Labs und Partytests
- **#14:** Operator, Hosting, Legal, Support und Incident Evidence
- **PR #15:** nach dem aktuellen Hardening wieder live gegen Releasebranch synchronisieren und 9-Pfade-Scope bestätigen

## Höchste Prioritäten

1. Hosted Runner / Actions-Account-, Billing- und Policy-Gate lösen
2. PR #15 live synchronisieren + Scope bestätigen
3. Online-`npm ci` / CI / Cross-Browser auf demselben Commit
4. Branch Protection
5. Provider + HTTPS-Staging/Production
6. v64 PWA-Smoke / Upgrade / Rollback
7. Spezialgates bis HS60 real
8. Android / iPhone / Tablet + Accessibility
9. reale Gruppentests für alle 15 Core-Spiele
10. Operator-/Legal-/Support-/Incident-Sign-off
11. Asset-/Third-Party-Finalreview auf dem unveränderten RC
12. unveränderter RC + `release-evidence.json = FINAL / GO`

## Entwicklungsregel ab v64

Bis die zentralen Release-Gates geschlossen sind:

- keine neuen Core-Spielmodi
- keine große Architekturmigration
- keine künstliche Freigabe offener Gates
- Feature-Freeze bevorzugen
- reale Fehler aus CI, Browser-, Geräte-, Accessibility- und Gruppentests vor neuen Features
- keine App-Codeänderung auf Verdacht für `runner_id: 0` / `steps: []`

## Nicht als bestanden behaupten

Online-`npm ci`, CI/Cross-Browser, Branch Protection, HTTPS-Staging, reale PWA-/Geräte-/Accessibility-/Spezialgate-/Wave-1-/Gruppentests, Gesamt-Asset-/Third-Party-, Operator-/Legal-/Support-Sign-off und finaler Release Evidence GO sind weiterhin offen.
