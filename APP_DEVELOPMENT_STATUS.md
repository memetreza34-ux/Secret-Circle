# Secret Circle – A-bis-Z Entwicklungsstatus

Stand: 29. August 2026

Operativer Fortschrittstracker zu `APP_ENTWICKLUNG_VON_A_BIS_Z.md`.

## Gesamtstatus

**Öffentliche Releasefreigabe: NO_GO**  
**Built-ins: 55 · 15 Core / 13 Extended / 27 Labs**  
**Expansion Wave 1: 10/10 quellsseitig implementiert**  
**Offline-Core: `secret-circle-v64` / `secret-circle-v64-staging`**  
**Classic Content: v4**  
**Core Source Review/Hardening: 15/15 PREPARED**  
**Accessibility: PREPARED**  
**Spezialgates DWI bis HS60: source PREPARED, real evidence OPEN**  
**Wave-1-Labs: source PREPARED, real Browser/PWA/Group evidence OPEN**  
**Operator / Hosting / Legal: PREPARED / BLOCKED**

Arbeitsstand: Draft-PR #13 auf `agent/release-foundation-2027`.

## Versionslinie

v45 Core → v46 Hub-A11y → v47 Secondary-A11y → v48 Word-Imposter → v49 Hub Resume Guard → v50 fail-closed Loader → v51 Complete Backup → v52 sichere Hub-Current-Runden → v53 Paranoia Resume/Privacy → v54 Pre-Timer Resume → v55 Advanced Integrity → v56 Quick Session Replacement → v57 Quick Timer Resume → v58 BFCache Timer Resume → v59 Background Timer Fairness → v60 Hidden Snapshot Durability → v61 Quiz → v62 Imposter → v63 Writing → **v64 Wave 1 Complete**.

## A-bis-Z-Tracker

| # | Bereich | Status | Nächste reale Aktion |
|---|---|---|---|
| 0 | Produktziel / Releasegrenze | DONE | Januar-Core nicht weiter aufblasen |
| A | Querschnittsverträge | PREPARED | reale Gates schließen |
| 1 | Discovery / Nutzer / Markt | DONE | reale Nutzer weiter validieren |
| 2 | Produktstrategie / Scope | PREPARED | reale Gruppen/Nutzer; Labs nicht automatisch in Core übernehmen |
| 3 | Plattformstrategie | PREPARED | reale Zielgeräte |
| 4 | Requirements / Akzeptanz | PREPARED | Runner + reale Core-/Advanced-/Quick-/Wave-1-Abnahme |
| 5 | UX / IA / Design | PREPARED | reale UX-/Tastaturtests |
| 6 | Architektur / ADR | PREPARED | v64-PWA-/Lifecycle-Evidence |
| 7 | Security / Threat Model | PREPARED | echter Browser/Runner |
| 8 | Repo / Git / Build | BLOCKED | Issue #7 + Branch Protection |
| 9 | Feature-Entwicklungsloop | PREPARED | nur gezielte Hardening-Funde; kein Scope-Bloat |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Quota/Update/Resume/Restore/Replacement/Timer/BFCache/Background/Cold Resume real |
| 11 | Tests / CI | BLOCKED | funktionierender Hosted Runner |
| 12 | Offline / PWA / Resume | PREPARED | v64 Install/Upgrade/Rollback + Spezialgates |
| 13 | Content / Alter / Privacy | IN PROGRESS | reale Gruppen + finaler Sign-off |
| 14 | Beta / reale Gruppen | PREPARED | G1–G5 + Spezialgates bis HS60 + PN1–PN3 + Wave-1-Labs |
| 15 | Datenschutz / Recht / Support | BLOCKED | reale Betreiber-/Hosting-/Kontaktangaben |
| 16 | Release Management / RC | PREPARED | unveränderlichen RC einfrieren |
| 17 | Deployment / Environments | BLOCKED | Provider + echte HTTPS-Origins |
| 18 | Operations / Incident | BLOCKED | Verantwortliche + reale Drills |
| 19 | Wartung / Migration | PREPARED | operative Routine real |
| 20 | Risk Management | IN PROGRESS | laufend aktualisieren |
| 21 | Accessibility | PREPARED | VoiceOver/TalkBack/Zoom/Tastatur/Geräte |
| 22 | Third Party / Assetrechte | BLOCKED | Root-`icon.svg`-Rechte klären oder Asset ersetzen |
| 23 | Fan-/Referenzcontent | IN PROGRESS | Runner + manuelle Visual/Legal-Abnahme |
| 24 | Release Evidence | PREPARED | reale Belege auf einen unveränderten RC sammeln |

## v60 – Hidden Snapshot Durability

- `party-session-controls.js` Version **5** persistiert die Quick-Family-Restzeit bereits bei `visibilitychange(hidden)`.
- dadurch bleibt ein Timer nach mobilem Prozess-Kill auch dann resumierbar, wenn `pagehide` nicht mehr zuverlässig ausgeführt wird.
- nur der Pagehide-Pfad setzt Preserve-on-next-stop; Hidden allein tut das nicht.
- normaler Same-Page-Stop räumt den Visibility-Snapshot wieder auf.
- Cold Resume konsumiert den Hidden-Snapshot genau einmal über den bestehenden QT57-Vertrag.
- Backupformat und 17-Key-Allowlist bleiben unverändert.

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

Die Implementierung verwendet sechs wiederverwendbare Enginefamilien: Quiz, Imposter, Writing, Estimation/Voting, Bluff und Clue. `quick-loader.js` v11 routet die Wave-1-Familien explizit; `party-release-structure.js` v5 hält alle zehn Modi in Labs.

**Wichtig:** Source-Implementierung ist kein Release-PASS. Browser-, PWA-, Accessibility- und reale Gruppenevidence für Wave 1 bleiben offen.

## Offline / PWA v64

- `secret-circle-v64`
- `secret-circle-v64-staging`
- SessionControls v5 + QT57 + BF58 + BG59 + HS60 offline
- Quick Replacement Guard + Wave-1-Routing offline
- alle früheren Resume-/Privacy-/A11y-/Backup-/Advanced-Verträge bleiben enthalten
- alle zehn Wave-1-Labs sind Teil des Offline-Core

## Build / CI

- `package-lock.json` v3
- Playwright 1.54.2
- keine npm-Runtime-Dependencies
- Syntax-, Unit-, Contract-, Audit- und Playwright-Gates sind vorbereitet
- Wave-1-Audits für Quiz, Imposter, Writing und Remaining-Block sind Bestandteil der Validierung
- letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**, `steps: null` / `steps: []`; kein Repositorycode ausgeführt
- **v50–v64 besitzen keinen echten Hosted-Runner-PASS**

Status: **CLOSED IN CODE / ONLINE RUNNER VERIFICATION OPEN**.

## Zentrale offene Issues

- **#7:** GitHub Actions endet vor Step 1
- **#8:** reale Geräte, v64 Offline-PWA, Accessibility, Spezialgates bis HS60, Wave-1-Labs und Partytests
- **#14:** Operator, Hosting, Legal, Support und Incident Evidence

Zusätzlich bleibt die Root-`icon.svg`-Rechtebasis offen.

## Höchste Prioritäten

1. Hosted Runner / Online-`npm ci` / CI / Cross-Browser
2. Branch Protection
3. Provider + HTTPS-Staging/Production
4. v64 PWA-Smoke / Upgrade / Rollback
5. Spezialgates bis HS60 real
6. Wave-1-Labs real in Browser/PWA/Accessibility/Gruppe prüfen
7. Android / iPhone / Tablet inkl. App-Wechsel/Screen-Lock/Prozess-Kill
8. VoiceOver / TalkBack / Tastatur / Zoom
9. reale Gruppentests für alle 15 Core-Spiele
10. Asset-/Operator-/Legal-/Support-/Incident-Sign-off
11. unveränderter RC + `release-evidence.json = FINAL / GO`

## Entwicklungsregel ab v64

Bis die zentralen Release-Gates geschlossen sind:

- keine neuen Core-Spielmodi
- keine große Architekturmigration
- keine künstliche Freigabe offener Gates
- neue Labs nur, wenn sie keinen Releasepfad destabilisieren; bevorzugt Feature-Freeze
- reale Fehler aus CI, Browser-, Geräte-, Accessibility- und Gruppentests haben Vorrang vor neuen Features

## Nicht als bestanden behaupten

Online-`npm ci`, CI/Cross-Browser, Branch Protection, HTTPS-Staging, reale PWA-/Geräte-/Accessibility-/Spezialgate-/Wave-1-/Gruppentests, Asset-/Operator-/Legal-/Support-Sign-off und finaler Release Evidence GO sind weiterhin offen.
