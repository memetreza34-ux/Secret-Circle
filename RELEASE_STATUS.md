# Release-Status – Secret Circle

Stand: 26. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13

## Gesamtstatus

**Phase:** Release-Härtung  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v56` / `secret-circle-v56-staging`**  
**Classic Content:** **v4**  
**Core Source Review/Hardening:** **15/15 PREPARED**  
**Accessibility:** **PREPARED**  
**DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56:** **source PREPARED, real evidence OPEN**  
**Operator / Hosting / Legal:** **PREPARED / BLOCKED**

## Versionslinie

v45 Core → v46 Hub A11y → v47 Secondary A11y → v48 Word-Imposter → v49 Hub Resume Guard → v50 fail-closed Loader → v51 Complete Backup → v52 Safe Hub Current → v53 Paranoia Resume/Privacy → v54 Pre-Timer Resume → v55 Advanced Integrity → **v56 Quick Session Replacement**.

## v56 – Quick Session Replacement

Behoben/gehärtet:

- `quick-session-replacement-guard.js` Version 1
- `quick-loader.js` Version 7 lädt Ledger → Controls → Replacement Guard → Engine
- Schutz gilt für Quick/Trending, Mega, Viral und Creator mit den jeweiligen Family-Storage-Keys
- Same-Game-Neustart über „Spiel starten“ verlangt eine ausdrückliche Verwerfbestätigung
- Cross-Game-Wechsel innerhalb derselben Enginefamilie verlangt ebenfalls eine Bestätigung
- Cancel lässt den alten Game-ID-/Session-ID-Snapshot unverändert
- der Alt-Snapshot wird vor einem bestätigten Neustart nicht gelöscht
- erst ein erfolgreicher Engine-Write ersetzt den Snapshot
- bei Replacement-Write-Fehler verhindert der Guard einen späteren `pagehide`-Retry des fehlerhaften In-Memory-Zustands und lädt kontrolliert neu
- der zuvor gespeicherte Snapshot bleibt dadurch erhalten

Automatische Verträge:

- `tests/quick-session-replacement-guard.test.js`
- `tests/e2e/quick-session-replacement.spec.js`
- `tests/e2e/party-session-controls.spec.js` prüft Controls → Guard → Engine für Quick/Mega/Viral
- `tests/quick-loader.test.js` prüft Loader v7 inklusive Creator-Familie
- `scripts/quick_session_replacement_audit.py` in `npm run validate`
- Architecture Audit erzwingt Guard, Loader, Offline-Core und Audit

Realer RC-Nachweis: **QR56**.

## PWA v56

- `secret-circle-v56`
- `secret-circle-v56-staging`
- Quick Replacement Guard v1 + Quick Loader v7 offline
- Advanced Guard v4 + alle bisherigen Resume-/Privacy-/A11y-/Backup-/Timer-Verträge bleiben enthalten

Reale Installation, Upgrade, Rollback und alle Spezialgates bleiben offen.

## CI – P0

Letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`; kein Repositorycode ausgeführt.

**v50–v56 besitzen keinen echten Runner-PASS.**

## Release Evidence / Assets

- `release-evidence.json`: **PREPARED / NO_GO**
- `operator-release.json`: **PREPARED / BLOCKED**
- Root-`icon.svg`: Rechtebasis `unresolved`

## Zentrale offene Blocker

1. **#7** Hosted Runner vor Step 1
2. **#8** reale Geräte, v56 Offline-PWA, DWI, HR2, BK51, HR52, PR53, PT54, AD55, QR56, Accessibility und Partytests
3. **#14** Operator, Hosting, Legal, Support und Incident Evidence

## Real offene Releasegates

1. Actions-Runner / Online-`npm ci` / CI / Cross-Browser
2. Branch Protection
3. Hostingprovider + getrennte HTTPS-Origins
4. v56 Staging-/Production-/PWA-Smokes + Upgrade/Rollback
5. DWI + HR2 + BK51 + HR52 + PR53 + PT54 + AD55 + **QR56**
6. Android / iPhone / Tablet
7. VoiceOver / TalkBack / Tastatur / 200-%-Zoom
8. reale Gruppen/Beta für alle 15 Core-Spiele
9. Asset-/Operator-/Privacy-/Support-/Legal-Sign-off
10. unveränderter RC + Release Evidence FINAL/GO

## Releaseentscheidung

- öffentlicher Release: **NO_GO**
- PR #13 mergen: **Nein**
- PR #13 bleibt Draft: **Ja**