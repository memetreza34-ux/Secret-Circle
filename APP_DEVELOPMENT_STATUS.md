# Secret Circle – A-bis-Z Entwicklungsstatus

Stand: 27. August 2026

Operativer Fortschrittstracker zu `APP_ENTWICKLUNG_VON_A_BIS_Z.md`.

## Gesamtstatus

**Öffentliche Releasefreigabe: NO_GO**  
**Offline-Core: `secret-circle-v58` / `secret-circle-v58-staging`**  
**Classic Content: v4**  
**Core Source Review/Hardening: 15/15 PREPARED**  
**Accessibility: PREPARED**  
**DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57 / BF58: source PREPARED, real evidence OPEN**  
**Operator / Hosting / Legal: PREPARED / BLOCKED**

Arbeitsstand: Draft-PR #13 auf `agent/release-foundation-2027`.

## Versionslinie

v45 Core → v46 Hub-A11y → v47 Secondary-A11y → v48 Word-Imposter → v49 Hub Resume Guard → v50 fail-closed Loader → v51 Complete Backup → v52 sichere Hub-Current-Runden → v53 Paranoia Resume/Privacy → v54 Pre-Timer Resume → v55 Advanced Integrity → v56 Quick Session Replacement → v57 Quick Timer Resume → **v58 BFCache Timer Resume**.

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
| 6 | Architektur / ADR | PREPARED | v58-PWA-/QT57-/BF58-Evidence |
| 7 | Security / Threat Model | PREPARED | echter Browser/Runner |
| 8 | Repo / Git / Build | BLOCKED | Issue #7 + Branch Protection |
| 9 | Feature-Entwicklungsloop | PREPARED | gezielte Hardening-Funde, kein Scope-Bloat |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Quota/Update/Resume/Restore/Replacement/Timer/BFCache real |
| 11 | Tests / CI | BLOCKED | funktionierender Hosted Runner |
| 12 | Offline / PWA / Resume | PREPARED | v58 Install/Upgrade/Rollback + Spezialgates |
| 13 | Content / Alter / Privacy | IN PROGRESS | reale Gruppen + finaler Sign-off |
| 14 | Beta / reale Gruppen | PREPARED | G1–G5 + DWI/HR2/BK51/HR52/PR53/PT54/AD55/QR56/QT57/BF58 + PN1–PN3 |
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

## v58 – BFCache Timer Resume

- `party-session-controls.js` Version **3** behandelt `pageshow.persisted` als eigenen Browser-Lifecycle.
- passender Timer-Snapshot zur aktuellen Quick-Family-Session führt kontrolliert in den normalen v57-Resume-Pfad.
- der passende Snapshot bleibt bis zum Reload/Resume erhalten.
- stale/fremder Snapshot wird entfernt, ohne unnötigen Reload.
- verhindert eingefrorene Timer nach Safari-/Chrome-Back-Forward-Cache-Rückkehr.
- `tests/party-session-controls.test.js`, `scripts/quick_bfcache_resume_audit.py`, `scripts/quick_timer_resume_audit.py` und `scripts/architecture_audit.py` schützen den Vertrag.

Realer Nachweis: **BF58**.

## v57 – Quick Timer Resume

Der promptfreie Store `secret-circle-party-quick-timers-v1` hält Restzeit-Metadaten für Quick/Trending, Mega, Viral und Creator. Resume erfolgt nur bei exakt passender Game-ID + Session-ID + Runde + Phase + Ausgangsdauer. Complete Backup verwaltet 17 exakte aktuelle Keys. Realer Nachweis: **QT57**.

## v56 – Quick Session Replacement

`quick-session-replacement-guard.js` v1 + `quick-loader.js` v7 schützen Same-/Cross-Game-Ersatz in Quick/Trending, Mega, Viral und Creator. Cancel erhält den Alt-Snapshot; Write-Fail bleibt fail-closed. Realer Nachweis: **QR56**.

## Offline / PWA v58

- `secret-circle-v58`
- `secret-circle-v58-staging`
- SessionControls v3 + QT57 + BF58 offline
- Quick Replacement Guard v1 + Quick Loader v7 offline
- alle früheren Resume-/Privacy-/A11y-/Backup-/Advanced-Verträge bleiben enthalten

## Build / CI

- `package-lock.json` v3
- Playwright 1.54.2
- keine npm-Runtime-Dependencies
- QT57-, BF58-, QR56-, AD55-, PT54- und Backup-Audits im Validate-Gate
- QT57-Browser-Spec im Syntax-Preflight
- letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**, `steps: null` / `steps: []`; kein Repositorycode ausgeführt
- **v50–v58 besitzen keinen echten Runner-PASS**

Status: **CLOSED IN CODE / ONLINE RUNNER VERIFICATION OPEN**.

## Zentrale offene Issues

- **#7:** GitHub Actions endet vor Step 1
- **#8:** reale Geräte, v58 Offline-PWA, Accessibility, DWI, HR2, BK51, HR52, PR53, PT54, AD55, QR56, QT57, BF58 und Partytests
- **#14:** Operator, Hosting, Legal, Support und Incident Evidence

Zusätzlich bleibt die Icon-Rechtebasis offen.

## Höchste Prioritäten

1. Hosted Runner / Online-`npm ci` / CI / Cross-Browser
2. Branch Protection
3. Provider + HTTPS-Staging/Production
4. v58 PWA-Smoke / Upgrade / Rollback
5. DWI + HR2 + BK51 + HR52 + PR53 + PT54 + AD55 + QR56 + QT57 + BF58 real
6. Android / iPhone / Tablet / VoiceOver / TalkBack / Tastatur / Zoom
7. reale Gruppentests für alle 15 Core-Spiele
8. Asset-/Operator-/Legal-/Support-/Incident-Sign-off
9. unveränderter RC + `release-evidence.json = FINAL / GO`

## Nicht als bestanden behaupten

Online-`npm ci`, CI/Cross-Browser, Branch Protection, HTTPS-Staging, reale PWA-/Geräte-/Accessibility-/Spezialgate-/Gruppentests, Asset-/Operator-/Legal-/Support-Sign-off und finaler Release Evidence GO sind weiterhin offen.