# Release-Status – Secret Circle

Stand: 28. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13

## Gesamtstatus

**Phase:** Release-Härtung  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v59` / `secret-circle-v59-staging`**  
**Classic Content:** **v4**  
**Core Source Review/Hardening:** **15/15 PREPARED**  
**Accessibility:** **PREPARED**  
**DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57 / BF58 / BG59:** **source PREPARED, real evidence OPEN**  
**Operator / Hosting / Legal:** **PREPARED / BLOCKED**

## Versionslinie

v45 Core → v46 Hub A11y → v47 Secondary A11y → v48 Word-Imposter → v49 Hub Resume Guard → v50 fail-closed Loader → v51 Complete Backup → v52 Safe Hub Current → v53 Paranoia Resume/Privacy → v54 Pre-Timer Resume → v55 Advanced Integrity → v56 Quick Session Replacement → v57 Quick Timer Resume → v58 BFCache Timer Resume → **v59 Background Timer Fairness**.

## v59 – Background Timer Fairness

Behoben/gehärtet:

- `party-session-controls.js` Version **4**
- laufende Quick-/Trending-/Mega-/Viral-/Creator-Timer reagieren auf `visibilitychange`
- `document.hidden === true` pausiert eine aktive laufende Timer-Runde automatisch
- Hintergrundzeit bei App-/Tabwechsel oder Screen-Lock wird nicht als Spielzeit abgezogen
- Rückkehr auf `visible` startet den Timer **nicht automatisch**
- Pause-Overlay und `Fortsetzen` bleiben aktiv, bis der Nutzer bewusst weiterspielt
- ohne laufende Timer-Runde ändert ein Visibility-Wechsel keinen Spielzustand

Automatische Verträge:

- `tests/party-session-controls.test.js`
- `tests/e2e/quick-background-pause.spec.js`
- `scripts/quick_background_pause_audit.py`
- QT57/BF58-Audits akzeptieren SessionControls v4 ohne ihre ursprünglichen Verträge abzuschwächen
- Architecture Audit erzwingt SessionControls v4 + BG59

Realer RC-Nachweis: **BG59**.

## v58 / v57 / v56

- **BF58:** passender BFCache-Snapshot → kontrollierter Reload in QT57; stale Snapshot → löschen ohne Reload.
- **QT57:** Restzeit über normalen Reload, promptfreier Timer-Store, 17-Key-Backupvertrag.
- **QR56:** Same-/Cross-Game-Session-Ersatz nur bestätigt und fail-closed.

## PWA v59

- `secret-circle-v59`
- `secret-circle-v59-staging`
- SessionControls v4 + QT57/BF58/BG59 offline
- Quick Replacement Guard v1 + Quick Loader v7 offline
- alle bisherigen Resume-/Privacy-/A11y-/Backup-/Advanced-Verträge bleiben enthalten

Reale Installation, Upgrade, Rollback und alle Spezialgates bleiben offen.

## CI – P0

Letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`; kein Repositorycode ausgeführt.

**v50–v59 besitzen keinen echten Runner-PASS.**

## Release Evidence / Assets

- `release-evidence.json`: **PREPARED / NO_GO**
- `operator-release.json`: **PREPARED / BLOCKED**
- Root-`icon.svg`: Rechtebasis `unresolved`

## Zentrale offene Blocker

1. **#7** Hosted Runner vor Step 1
2. **#8** reale Geräte, v59 Offline-PWA, DWI, HR2, BK51, HR52, PR53, PT54, AD55, QR56, QT57, BF58, BG59, Accessibility und Partytests
3. **#14** Operator, Hosting, Legal, Support und Incident Evidence

## Real offene Releasegates

1. Actions-Runner / Online-`npm ci` / CI / Cross-Browser
2. Branch Protection
3. Hostingprovider + getrennte HTTPS-Origins
4. v59 Staging-/Production-/PWA-Smokes + Upgrade/Rollback
5. DWI + HR2 + BK51 + HR52 + PR53 + PT54 + AD55 + QR56 + QT57 + BF58 + **BG59**
6. Android / iPhone / Tablet einschließlich App-Wechsel/Screen-Lock
7. VoiceOver / TalkBack / Tastatur / 200-%-Zoom
8. reale Gruppen/Beta für alle 15 Core-Spiele
9. Asset-/Operator-/Privacy-/Support-/Legal-Sign-off
10. unveränderter RC + Release Evidence FINAL/GO

## Releaseentscheidung

- öffentlicher Release: **NO_GO**
- PR #13 mergen: **Nein**
- PR #13 bleibt Draft: **Ja**