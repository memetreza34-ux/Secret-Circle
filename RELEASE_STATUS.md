# Release-Status – Secret Circle

Stand: 27. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13

## Gesamtstatus

**Phase:** Release-Härtung  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v58` / `secret-circle-v58-staging`**  
**Classic Content:** **v4**  
**Core Source Review/Hardening:** **15/15 PREPARED**  
**Accessibility:** **PREPARED**  
**DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57 / BF58:** **source PREPARED, real evidence OPEN**  
**Operator / Hosting / Legal:** **PREPARED / BLOCKED**

## Versionslinie

v45 Core → v46 Hub A11y → v47 Secondary A11y → v48 Word-Imposter → v49 Hub Resume Guard → v50 fail-closed Loader → v51 Complete Backup → v52 Safe Hub Current → v53 Paranoia Resume/Privacy → v54 Pre-Timer Resume → v55 Advanced Integrity → v56 Quick Session Replacement → v57 Quick Timer Resume → **v58 BFCache Timer Resume**.

## v58 – BFCache Timer Resume

Behoben/gehärtet:

- `party-session-controls.js` Version **3**
- `pageshow.persisted` wird als eigener Browser-Lifecycle verarbeitet
- passender gespeicherter Quick-Family-Timer-Snapshot → kontrollierter Reload in den normalen v57-Restzeit-Resume
- Snapshot bleibt bis zum Resume erhalten
- stale/fremder Snapshot → entfernen, ohne Reload
- verhindert eingefrorene Timer nach Safari-/Chrome-BFCache-Rückkehr

Automatische Verträge:

- `tests/party-session-controls.test.js`
- `scripts/quick_bfcache_resume_audit.py`
- `scripts/quick_timer_resume_audit.py`
- Architecture Audit erzwingt SessionControls v3 + BF58

Realer RC-Nachweis: **BF58**.

## v57 – Quick Timer Resume

Quick/Trending, Mega, Viral und Creator übernehmen Restzeit nur bei exakt passender Game-ID, Session-ID, Runde, Phase und Ausgangsdauer. Der promptfreie Timer-Store ist Teil des 17-Key-Backupvertrags. Realer RC-Nachweis: **QT57**.

## v56 – Quick Session Replacement

Quick Replacement Guard v1 + Quick Loader v7 schützen Quick/Trending, Mega, Viral und Creator vor stillem Same-/Cross-Game-Überschreiben. Cancel erhält den Alt-Snapshot; Replacement-Write-Fail bleibt fail-closed. Realer Nachweis: **QR56**.

## PWA v58

- `secret-circle-v58`
- `secret-circle-v58-staging`
- SessionControls v3 + BFCache-Restore-Schutz offline
- v57 Quick-Timer-Resume, Quick Replacement Guard v1 + Quick Loader v7 offline
- alle bisherigen Resume-/Privacy-/A11y-/Backup-/Advanced-Verträge bleiben enthalten

Reale Installation, Upgrade, Rollback und alle Spezialgates bleiben offen.

## CI – P0

Letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`; kein Repositorycode ausgeführt.

**v50–v58 besitzen keinen echten Runner-PASS.**

## Release Evidence / Assets

- `release-evidence.json`: **PREPARED / NO_GO**
- `operator-release.json`: **PREPARED / BLOCKED**
- Root-`icon.svg`: Rechtebasis `unresolved`

## Zentrale offene Blocker

1. **#7** Hosted Runner vor Step 1
2. **#8** reale Geräte, v58 Offline-PWA, DWI, HR2, BK51, HR52, PR53, PT54, AD55, QR56, QT57, BF58, Accessibility und Partytests
3. **#14** Operator, Hosting, Legal, Support und Incident Evidence

## Real offene Releasegates

1. Actions-Runner / Online-`npm ci` / CI / Cross-Browser
2. Branch Protection
3. Hostingprovider + getrennte HTTPS-Origins
4. v58 Staging-/Production-/PWA-Smokes + Upgrade/Rollback
5. DWI + HR2 + BK51 + HR52 + PR53 + PT54 + AD55 + QR56 + QT57 + **BF58**
6. Android / iPhone / Tablet
7. VoiceOver / TalkBack / Tastatur / 200-%-Zoom
8. reale Gruppen/Beta für alle 15 Core-Spiele
9. Asset-/Operator-/Privacy-/Support-/Legal-Sign-off
10. unveränderter RC + Release Evidence FINAL/GO

## Releaseentscheidung

- öffentlicher Release: **NO_GO**
- PR #13 mergen: **Nein**
- PR #13 bleibt Draft: **Ja**