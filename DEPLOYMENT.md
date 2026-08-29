# Secret Circle Party Hub – Deployment und Rollback

Stand: 29. August 2026

Secret Circle wird für Januar 2027 als statische **offline-first PWA** veröffentlicht. Production darf nicht der erste echte HTTPS-/Service-Worker-Test eines Release Candidates sein.

## Aktueller Releaseumfang

- **47 Built-ins · 15 Core / 13 Extended / 19 Labs**
- die neuen Wave-1-Spiele `Party Quiz` und `Fake oder Fakt` bleiben Labs und erweitern den Januar-Core nicht automatisch
- Word Imposter + Smart Party Night + lokaler Creator
- aktueller Offline-Core: **`secret-circle-v61` / `secret-circle-v61-staging`**
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
- bestehende Spezialgates bis HS60 real bestätigt
- Wave-1-Labs nur bei eigener Browser-/Offline-/Accessibility-/Gruppen-Evidence als releasefähig behandeln
- keine offenen Critical/High Bugs

Ein Job mit `steps: []` ist kein Code-/Testnachweis.

## PWA / Offline – v61

Offline enthalten sind `party-session-controls.js` Version 5, Quick Replacement Guard v2, Quick Loader v8, Backup Registry v2 sowie die neuen Dateien `party-wave-one-catalog.js` und `party-wave-one-modes.js`.

- **QT57:** Restzeit über normalen Reload.
- **BF58:** BFCache-Rückkehr führt sicher in QT57 oder verwirft stale Zustand.
- **BG59:** Hidden pausiert; Visible benötigt explizites Resume.
- **HS60:** Hidden persistiert Restzeit sofort für möglichen OS-Kill.
- **Wave 1 / v61:** Party Quiz und Fake oder Fakt nutzen einen gemeinsamen Runner, denselben Quick-Family-Session-Schutz und bleiben Labs.

## HTTPS-Staging

Der Netzwerk-Smoke wird durch **`scripts/staging_smoke.py`** ausgeführt. Die PWA-Head-Metadaten werden zusätzlich durch **`tests/pwa-head-metadata.test.js`** geschützt.

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v61
```

Manuell zusätzlich: Installation, Offline-Neustart, Update/Rollback, bestehende Spezialgates sowie Party Quiz/Fake oder Fakt online und offline.

## Update-Regel

Bei Offline-Core-Änderung: CORE prüfen → Cachegeneration erhöhen → SW-Test → Architektur/Deployment/Privacy/Environment/Hosting synchronisieren → Upgrade/Rollback real testen.

Historie: v56 Quick Replacement → v57 Timer-Restzeit → v58 BFCache Restore → v59 Background Pause → v60 Hidden Snapshot → **v61 Expansion Wave 1**.

## Rollback

Promotion stoppen → Commit/Cache dokumentieren → Revert/Hotfix → neue Cachegeneration → Datenkompatibilität prüfen → HTTPS-Staging + PWA-Rollback erneut testen.

## Production-Smoke-Test

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v61 --production
```

Production muss exakt dem freigegebenen RC entsprechen.

## Release Evidence

`release-evidence.json` bleibt finale Quelle. Aktuell: **NO_GO**.
