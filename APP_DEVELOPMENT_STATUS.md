# Secret Circle – A-bis-Z Entwicklungsstatus

Stand: 28. August 2026

Operativer Fortschrittstracker zu `APP_ENTWICKLUNG_VON_A_BIS_Z.md`.

## Gesamtstatus

**Öffentliche Releasefreigabe: NO_GO**  
**Offline-Core: `secret-circle-v59` / `secret-circle-v59-staging`**  
**Classic Content: v4**  
**Core Source Review/Hardening: 15/15 PREPARED**  
**Accessibility: PREPARED**  
**DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57 / BF58 / BG59: source PREPARED, real evidence OPEN**  
**Operator / Hosting / Legal: PREPARED / BLOCKED**

Arbeitsstand: Draft-PR #13 auf `agent/release-foundation-2027`.

## Versionslinie

v45 Core → v46 Hub-A11y → v47 Secondary-A11y → v48 Word-Imposter → v49 Hub Resume Guard → v50 fail-closed Loader → v51 Complete Backup → v52 sichere Hub-Current-Runden → v53 Paranoia Resume/Privacy → v54 Pre-Timer Resume → v55 Advanced Integrity → v56 Quick Session Replacement → v57 Quick Timer Resume → v58 BFCache Timer Resume → **v59 Background Timer Fairness**.

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
| 6 | Architektur / ADR | PREPARED | v59-PWA-/QT57-/BF58-/BG59-Evidence |
| 7 | Security / Threat Model | PREPARED | echter Browser/Runner |
| 8 | Repo / Git / Build | BLOCKED | Issue #7 + Branch Protection |
| 9 | Feature-Entwicklungsloop | PREPARED | gezielte Hardening-Funde, kein Scope-Bloat |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Quota/Update/Resume/Restore/Replacement/Timer/BFCache/Background real |
| 11 | Tests / CI | BLOCKED | funktionierender Hosted Runner |
| 12 | Offline / PWA / Resume | PREPARED | v59 Install/Upgrade/Rollback + Spezialgates |
| 13 | Content / Alter / Privacy | IN PROGRESS | reale Gruppen + finaler Sign-off |
| 14 | Beta / reale Gruppen | PREPARED | G1–G5 + Spezialgates inkl. BG59 + PN1–PN3 |
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

## v59 – Background Timer Fairness

- `party-session-controls.js` Version **4** behandelt `visibilitychange` für laufende Quick-Family-Timer.
- `document.hidden` pausiert automatisch; Hintergrundzeit wird nicht als Spielzeit abgezogen.
- Rückkehr auf `visible` startet nicht automatisch weiter.
- Pause-Overlay und `Fortsetzen` bleiben aktiv bis zum bewussten Resume.
- ohne laufenden Timer verändert der Visibility-Wechsel keinen Rundenzustand.
- `tests/party-session-controls.test.js`, `tests/e2e/quick-background-pause.spec.js`, `scripts/quick_background_pause_audit.py` und `scripts/architecture_audit.py` schützen den Vertrag.
- QT57/BF58 bleiben als eigene Reload-/BFCache-Verträge erhalten.

Realer Nachweis: **BG59**.

## v58 / v57 / v56

- BF58: sicherer BFCache-Restore.
- QT57: Restzeit über normalen Reload, promptfreier Timer-Store, 17-Key-Backupvertrag.
- QR56: bestätigter/fail-closed Quick-Family-Session-Ersatz.

## Offline / PWA v59

- `secret-circle-v59`
- `secret-circle-v59-staging`
- SessionControls v4 + QT57 + BF58 + BG59 offline
- Quick Replacement Guard v1 + Quick Loader v7 offline
- alle früheren Resume-/Privacy-/A11y-/Backup-/Advanced-Verträge bleiben enthalten

## Build / CI

- `package-lock.json` v3
- Playwright 1.54.2
- keine npm-Runtime-Dependencies
- QT57-, BF58-, BG59-, QR56-, AD55-, PT54- und Backup-Audits im Validate-Gate
- Quick-Timer- und Background-Pause-Browser-Specs im Syntax-Preflight
- letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**, `steps: null` / `steps: []`; kein Repositorycode ausgeführt
- **v50–v59 besitzen keinen echten Runner-PASS**

Status: **CLOSED IN CODE / ONLINE RUNNER VERIFICATION OPEN**.

## Zentrale offene Issues

- **#7:** GitHub Actions endet vor Step 1
- **#8:** reale Geräte, v59 Offline-PWA, Accessibility, DWI, HR2, BK51, HR52, PR53, PT54, AD55, QR56, QT57, BF58, BG59 und Partytests
- **#14:** Operator, Hosting, Legal, Support und Incident Evidence

Zusätzlich bleibt die Icon-Rechtebasis offen.

## Höchste Prioritäten

1. Hosted Runner / Online-`npm ci` / CI / Cross-Browser
2. Branch Protection
3. Provider + HTTPS-Staging/Production
4. v59 PWA-Smoke / Upgrade / Rollback
5. Spezialgates inkl. QT57/BF58/BG59 real
6. Android / iPhone / Tablet / VoiceOver / TalkBack / Tastatur / Zoom
7. reale Gruppentests für alle 15 Core-Spiele
8. Asset-/Operator-/Legal-/Support-/Incident-Sign-off
9. unveränderter RC + `release-evidence.json = FINAL / GO`

## Nicht als bestanden behaupten

Online-`npm ci`, CI/Cross-Browser, Branch Protection, HTTPS-Staging, reale PWA-/Geräte-/Accessibility-/Spezialgate-/Gruppentests, Asset-/Operator-/Legal-/Support-Sign-off und finaler Release Evidence GO sind weiterhin offen.