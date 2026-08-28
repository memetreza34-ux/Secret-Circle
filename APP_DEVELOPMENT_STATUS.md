# Secret Circle – A-bis-Z Entwicklungsstatus

Stand: 28. August 2026

Operativer Fortschrittstracker zu `APP_ENTWICKLUNG_VON_A_BIS_Z.md`.

## Gesamtstatus

**Öffentliche Releasefreigabe: NO_GO**  
**Offline-Core: `secret-circle-v60` / `secret-circle-v60-staging`**  
**Classic Content: v4**  
**Core Source Review/Hardening: 15/15 PREPARED**  
**Accessibility: PREPARED**  
**Spezialgates DWI bis HS60: source PREPARED, real evidence OPEN**  
**Operator / Hosting / Legal: PREPARED / BLOCKED**

Arbeitsstand: Draft-PR #13 auf `agent/release-foundation-2027`.

## Versionslinie

v45 Core → v46 Hub-A11y → v47 Secondary-A11y → v48 Word-Imposter → v49 Hub Resume Guard → v50 fail-closed Loader → v51 Complete Backup → v52 sichere Hub-Current-Runden → v53 Paranoia Resume/Privacy → v54 Pre-Timer Resume → v55 Advanced Integrity → v56 Quick Session Replacement → v57 Quick Timer Resume → v58 BFCache Timer Resume → v59 Background Timer Fairness → **v60 Hidden Snapshot Durability**.

## A-bis-Z-Tracker

| # | Bereich | Status | Nächste reale Aktion |
|---|---|---|---|
| 0 | Produktziel / Releasegrenze | DONE | bei Scopeänderung aktualisieren |
| A | Querschnittsverträge | PREPARED | reale Gates schließen |
| 1 | Discovery / Nutzer / Markt | DONE | reale Nutzer weiter validieren |
| 2 | Produktstrategie / Scope | PREPARED | reale Gruppen/Nutzer |
| 3 | Plattformstrategie | PREPARED | reale Zielgeräte |
| 4 | Requirements / Akzeptanz | PREPARED | Runner + reale Core-/Advanced-/Quick-Abnahme |
| 5 | UX / IA / Design | PREPARED | reale UX-/Tastaturtests |
| 6 | Architektur / ADR | PREPARED | v60-PWA-/Lifecycle-Evidence |
| 7 | Security / Threat Model | PREPARED | echter Browser/Runner |
| 8 | Repo / Git / Build | BLOCKED | Issue #7 + Branch Protection |
| 9 | Feature-Entwicklungsloop | PREPARED | gezielte Hardening-Funde, kein Scope-Bloat |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Quota/Update/Resume/Restore/Replacement/Timer/BFCache/Background/Cold Resume real |
| 11 | Tests / CI | BLOCKED | funktionierender Hosted Runner |
| 12 | Offline / PWA / Resume | PREPARED | v60 Install/Upgrade/Rollback + Spezialgates |
| 13 | Content / Alter / Privacy | IN PROGRESS | reale Gruppen + finaler Sign-off |
| 14 | Beta / reale Gruppen | PREPARED | G1–G5 + Spezialgates bis HS60 + PN1–PN3 |
| 15 | Datenschutz / Recht / Support | BLOCKED | reale Betreiber-/Hosting-/Kontaktangaben |
| 16 | Release Management / RC | PREPARED | unveränderlichen RC einfrieren |
| 17 | Deployment / Environments | BLOCKED | Provider + echte HTTPS-Origins |
| 18 | Operations / Incident | BLOCKED | Verantwortliche + reale Drills |
| 19 | Wartung / Migration | PREPARED | operative Routine real |
| 20 | Risk Management | IN PROGRESS | laufend aktualisieren |
| 21 | Accessibility | PREPARED | VoiceOver/TalkBack/Zoom/Tastatur/Geräte |
| 22 | Third Party / Assetrechte | BLOCKED | Icon-Rechte menschlich bestätigen |
| 23 | Fan-/Referenzcontent | IN PROGRESS | Runner + manuelle Visual/Legal-Abnahme |
| 24 | Release Evidence | PREPARED | reale Belege auf einen RC sammeln |

## v60 – Hidden Snapshot Durability

- `party-session-controls.js` Version **5** persistiert die Quick-Family-Restzeit bereits bei `visibilitychange(hidden)`.
- dadurch bleibt ein Timer nach mobilem Prozess-Kill auch dann resumierbar, wenn `pagehide` nicht mehr zuverlässig ausgeführt wird.
- nur der Pagehide-Pfad setzt Preserve-on-next-stop; Hidden allein tut das nicht.
- normaler Same-Page-Stop räumt den Visibility-Snapshot wieder auf.
- Cold Resume konsumiert den Hidden-Snapshot genau einmal über den bestehenden QT57-Vertrag.
- Backupformat und 17-Key-Allowlist bleiben unverändert.
- Unit-, Browser-, HS60- und Architecture-Audits schützen den Vertrag.

Realer Nachweis: **HS60**.

## Offline / PWA v60

- `secret-circle-v60`
- `secret-circle-v60-staging`
- SessionControls v5 + QT57 + BF58 + BG59 + HS60 offline
- Quick Replacement Guard v1 + Quick Loader v7 offline
- alle früheren Resume-/Privacy-/A11y-/Backup-/Advanced-Verträge bleiben enthalten

## Build / CI

- `package-lock.json` v3
- Playwright 1.54.2
- keine npm-Runtime-Dependencies
- Timer-Lifecycle-Audits QT57/BF58/BG59/HS60 im Validate-Gate
- Quick-Timer- und Background-Pause-Browser-Specs im Syntax-Preflight
- letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**, `steps: null` / `steps: []`; kein Repositorycode ausgeführt
- **v50–v60 besitzen keinen echten Runner-PASS**

Status: **CLOSED IN CODE / ONLINE RUNNER VERIFICATION OPEN**.

## Zentrale offene Issues

- **#7:** GitHub Actions endet vor Step 1
- **#8:** reale Geräte, v60 Offline-PWA, Accessibility, Spezialgates bis HS60 und Partytests
- **#14:** Operator, Hosting, Legal, Support und Incident Evidence

Zusätzlich bleibt die Icon-Rechtebasis offen.

## Höchste Prioritäten

1. Hosted Runner / Online-`npm ci` / CI / Cross-Browser
2. Branch Protection
3. Provider + HTTPS-Staging/Production
4. v60 PWA-Smoke / Upgrade / Rollback
5. Spezialgates bis HS60 real
6. Android / iPhone / Tablet inkl. App-Wechsel/Screen-Lock/Prozess-Kill
7. VoiceOver / TalkBack / Tastatur / Zoom
8. reale Gruppentests für alle 15 Core-Spiele
9. Asset-/Operator-/Legal-/Support-/Incident-Sign-off
10. unveränderter RC + `release-evidence.json = FINAL / GO`

## Nicht als bestanden behaupten

Online-`npm ci`, CI/Cross-Browser, Branch Protection, HTTPS-Staging, reale PWA-/Geräte-/Accessibility-/Spezialgate-/Gruppentests, Asset-/Operator-/Legal-/Support-Sign-off und finaler Release Evidence GO sind weiterhin offen.