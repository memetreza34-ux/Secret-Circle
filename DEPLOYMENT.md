# Secret Circle Party Hub – Deployment und Rollback

Stand: 27. August 2026

Secret Circle wird für Januar 2027 als statische **offline-first PWA** veröffentlicht. Production darf nicht der erste echte HTTPS-/Service-Worker-Test eines Release Candidates sein.

## Aktueller Releaseumfang

- 45 Built-ins · 15 Core / 13 Extended / 17 Labs
- 27 Quick-/Trend-/Viral-Modi · 4 Advanced-Core-Games
- Word Imposter + Smart Party Night + lokaler Creator
- aktueller Offline-Core: **`secret-circle-v58` / `secret-circle-v58-staging`**
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
- DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57 / **BF58** real bestätigt
- keine offenen Critical/High Bugs

Ein Job mit `steps: []` ist kein Code-/Testnachweis.

## PWA / Offline – v58

Offline enthalten sind `party-session-controls.js` Version 3, `quick-session-replacement-guard.js` Version 1, `quick-loader.js` Version 7, Backup Registry v2 und alle bisherigen Resume-/Privacy-/A11y-/Advanced-Schutzmodule.

**BF58:** Wird eine laufende Quick-Family-Timerseite aus dem Back-Forward-Cache wiederhergestellt, darf kein eingefrorener Running-Timer bedienbar bleiben. Ein passender Timer-Snapshot erzwingt einen kontrollierten Reload in den normalen Resume-Pfad; ein stale Snapshot wird ohne Reload gelöscht.

## HTTPS-Staging

Der Netzwerk-Smoke wird durch **`scripts/staging_smoke.py`** ausgeführt. Die PWA-Head-Metadaten werden zusätzlich durch **`tests/pwa-head-metadata.test.js`** geschützt.

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v58
```

Manuell zusätzlich: Installation, Offline-Neustart, Update/Rollback, QT57 und **BF58 auf Safari/Chrome mobil**.

## Update-Regel

Bei Offline-Core-Änderung: CORE prüfen → Cachegeneration erhöhen → SW-Test → Architektur/Deployment/Privacy/Environment/Hosting synchronisieren → Upgrade/Rollback real testen.

Historie: v56 Quick Replacement → v57 Timer-Restzeit → **v58 BFCache Timer Restore**.

## Rollback

Promotion stoppen → Commit/Cache dokumentieren → Revert/Hotfix → neue Cachegeneration → Datenkompatibilität prüfen → HTTPS-Staging + PWA-Rollback erneut testen.

## Production-Smoke-Test

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v58 --production
```

Production muss exakt dem freigegebenen RC entsprechen.

## Release Evidence

`release-evidence.json` bleibt finale Quelle. Aktuell: **NO_GO**.