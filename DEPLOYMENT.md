# Secret Circle Party Hub – Deployment und Rollback

Stand: 28. August 2026

Secret Circle wird für Januar 2027 als statische **offline-first PWA** veröffentlicht. Production darf nicht der erste echte HTTPS-/Service-Worker-Test eines Release Candidates sein.

## Aktueller Releaseumfang

- 45 Built-ins · 15 Core / 13 Extended / 17 Labs
- 27 Quick-/Trend-/Viral-Modi · 4 Advanced-Core-Games
- Word Imposter + Smart Party Night + lokaler Creator
- aktueller Offline-Core: **`secret-circle-v60` / `secret-circle-v60-staging`**
- Draft-PR #13 auf `agent/release-foundation-2027`
- öffentliche Freigabe: **NO_GO**

## Deployment-Reihenfolge

**Local → CI/Test → HTTPS-Staging → Release Candidate → Production**

Production erhält denselben unveränderten RC, der auf Staging freigegeben wurde.

## Voraussetzungen vor Production

- finaler RC-Commit + Tag
- Online-`npm ci` und `npm run ci` grün
- Chromium/Firefox/WebKit auf demselben Commit grün
- Required Check + Branch Protection real aktiv
- DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57 / BF58 / BG59 / **HS60** real bestätigt
- keine offenen Critical/High Bugs

Ein Job mit `steps: []` ist kein Code-/Testnachweis.

## PWA / Offline – v60

Offline enthalten sind `party-session-controls.js` Version 5, Quick Replacement Guard v1, Quick Loader v7, Backup Registry v2 und alle bisherigen Resume-/Privacy-/A11y-/Advanced-Schutzmodule.

- **QT57:** Restzeit über normalen Reload.
- **BF58:** BFCache-Rückkehr führt sicher in QT57 oder verwirft stale Zustand.
- **BG59:** Hidden pausiert; Visible benötigt explizites Resume.
- **HS60:** `visibilitychange(hidden)` persistiert die Restzeit sofort, auch wenn danach kein `pagehide` mehr folgt. Nur `pagehide` setzt den Preserve-on-next-stop-Pfad; normaler Same-Page-Round-Stop löscht den Visibility-Snapshot wieder.

## HTTPS-Staging

Der Netzwerk-Smoke wird durch **`scripts/staging_smoke.py`** ausgeführt. Die PWA-Head-Metadaten werden zusätzlich durch **`tests/pwa-head-metadata.test.js`** geschützt.

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v60
```

Manuell zusätzlich: Installation, Offline-Neustart, Update/Rollback, QT57, BF58, BG59 und **HS60 auf Safari/Chrome mobil**.

## Update-Regel

Bei Offline-Core-Änderung: CORE prüfen → Cachegeneration erhöhen → SW-Test → Architektur/Deployment/Privacy/Environment/Hosting synchronisieren → Upgrade/Rollback real testen.

Historie: v56 Quick Replacement → v57 Timer-Restzeit → v58 BFCache Restore → v59 Background Pause → **v60 Hidden Snapshot Durability**.

## Rollback

Promotion stoppen → Commit/Cache dokumentieren → Revert/Hotfix → neue Cachegeneration → Datenkompatibilität prüfen → HTTPS-Staging + PWA-Rollback erneut testen.

## Production-Smoke-Test

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v60 --production
```

Production muss exakt dem freigegebenen RC entsprechen.

## Release Evidence

`release-evidence.json` bleibt finale Quelle. Aktuell: **NO_GO**.