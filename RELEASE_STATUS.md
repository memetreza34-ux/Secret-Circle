# Release-Status – Secret Circle

Stand: 28. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13

## Gesamtstatus

**Phase:** Release-Härtung  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v60` / `secret-circle-v60-staging`**  
**Classic Content:** **v4**  
**Core Source Review/Hardening:** **15/15 PREPARED**  
**Accessibility:** **PREPARED**  
**DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57 / BF58 / BG59 / HS60:** **source PREPARED, real evidence OPEN**  
**Operator / Hosting / Legal:** **PREPARED / BLOCKED**

## Versionslinie

v45 Core → v46 Hub A11y → v47 Secondary A11y → v48 Word-Imposter → v49 Hub Resume Guard → v50 fail-closed Loader → v51 Complete Backup → v52 Safe Hub Current → v53 Paranoia Resume/Privacy → v54 Pre-Timer Resume → v55 Advanced Integrity → v56 Quick Session Replacement → v57 Quick Timer Resume → v58 BFCache Timer Resume → v59 Background Timer Fairness → **v60 Hidden Snapshot Durability**.

## v60 – Hidden Snapshot Durability

- `party-session-controls.js` Version **5**
- laufende Quick-Family-Timer schreiben bei `visibilitychange(hidden)` sofort ihre technische Restzeit
- Hidden-Persistenz setzt nicht `preservePersistedOnNextStop`; normaler Same-Page-Stop löscht den Snapshot wieder
- nur `pagehide` setzt den Preserve-on-next-stop-Pfad für den unmittelbar folgenden Engine-Stop
- Cold Resume nach OS-Kill ohne zuverlässiges `pagehide` kann dieselbe Restzeit einmalig über QT57 übernehmen
- Store bleibt promptfrei; Backupformat und 17-Key-Allowlist bleiben unverändert

Automatische Verträge:

- `tests/party-session-controls.test.js`
- `tests/e2e/quick-background-pause.spec.js`
- `scripts/quick_hidden_snapshot_audit.py`
- QT57/BF58/BG59-Audits auf SessionControls v5
- Architecture Audit erzwingt HS60

Realer RC-Nachweis: **HS60**.

## PWA v60

- `secret-circle-v60`
- `secret-circle-v60-staging`
- SessionControls v5 + QT57/BF58/BG59/HS60 offline
- Quick Replacement Guard v1 + Quick Loader v7 offline
- alle bisherigen Resume-/Privacy-/A11y-/Backup-/Advanced-Verträge bleiben enthalten

Reale Installation, Upgrade, Rollback und alle Spezialgates bleiben offen.

## CI – P0

Letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`; kein Repositorycode ausgeführt.

**v50–v60 besitzen keinen echten Runner-PASS.**

## Release Evidence / Assets

- `release-evidence.json`: **PREPARED / NO_GO**
- `operator-release.json`: **PREPARED / BLOCKED**
- Root-`icon.svg`: Rechtebasis `unresolved`

## Zentrale offene Blocker

1. **#7** Hosted Runner vor Step 1
2. **#8** reale Geräte, v60 Offline-PWA, Spezialgates bis HS60, Accessibility und Partytests
3. **#14** Operator, Hosting, Legal, Support und Incident Evidence

## Real offene Releasegates

1. Actions-Runner / Online-`npm ci` / CI / Cross-Browser
2. Branch Protection
3. Hostingprovider + getrennte HTTPS-Origins
4. v60 Staging-/Production-/PWA-Smokes + Upgrade/Rollback
5. Spezialgates bis **HS60**
6. Android / iPhone / Tablet inkl. App-Wechsel/Screen-Lock/Prozess-Kill
7. VoiceOver / TalkBack / Tastatur / 200-%-Zoom
8. reale Gruppen/Beta für alle 15 Core-Spiele
9. Asset-/Operator-/Privacy-/Support-/Legal-Sign-off
10. unveränderter RC + Release Evidence FINAL/GO

## Releaseentscheidung

- öffentlicher Release: **NO_GO**
- PR #13 mergen: **Nein**
- PR #13 bleibt Draft: **Ja**