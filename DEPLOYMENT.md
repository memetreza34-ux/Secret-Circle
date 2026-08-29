# Secret Circle Party Hub – Deployment und Rollback

Stand: 29. August 2026

Secret Circle wird für Januar 2027 als statische **offline-first PWA** veröffentlicht. Production darf nicht der erste echte HTTPS-/Service-Worker-Test eines Release Candidates sein.

## Aktueller Releaseumfang

- **49 Built-ins · 15 Core / 13 Extended / 21 Labs**
- Wave 1 besitzt aktuell vier spielbare Labs: `Party Quiz`, `Fake oder Fakt`, `Undercover – ähnliches Wort`, `Imposter ohne Wort`
- diese Labs erweitern den Januar-Core nicht automatisch
- Word Imposter + Smart Party Night + lokaler Creator
- aktueller Offline-Core: **`secret-circle-v62` / `secret-circle-v62-staging`**
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
- bestehende Spezialgates real bestätigt
- Wave-1-Labs nur bei eigener Browser-/Offline-/Accessibility-/Gruppen-Evidence als releasefähig behandeln
- keine offenen Critical/High Bugs

Ein Job mit `steps: []` ist kein Code-/Testnachweis.

## PWA / Offline – v62

Offline enthalten sind `party-session-controls.js` Version 5, Quick Replacement Guard v2, Quick Loader v9, Backup Registry v2 sowie die Wave-1-Katalog-/Runnerdateien.

- **QT57:** Restzeit über normalen Reload.
- **BF58:** BFCache-Rückkehr führt sicher in QT57 oder verwirft stale Zustand.
- **BG59:** Hidden pausiert; Visible benötigt explizites Resume.
- **HS60:** Hidden persistiert Restzeit sofort für möglichen OS-Kill.
- **Wave 1 / v61:** Party Quiz und Fake oder Fakt über gemeinsamen Quiz-Runner.
- **Wave 1 Imposter / v62:** Undercover – ähnliches Wort und Imposter ohne Wort über gemeinsamen Secret-Reveal-/Vote-Runner.

Der konsolidierte `party-wave-one-catalog.js` v3 liefert alle vier Labs. Der kleine `party-wave-one-imposter-catalog.js`-Adapter darf keine Spiele doppelt hinzufügen.

## HTTPS-Staging

Der Netzwerk-Smoke wird durch **`scripts/staging_smoke.py`** ausgeführt. Die PWA-Head-Metadaten werden zusätzlich durch **`tests/pwa-head-metadata.test.js`** geschützt.

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v62
```

Manuell zusätzlich: Installation, Offline-Neustart, Update/Rollback, bestehende Spezialgates sowie alle vier Wave-1-Labs online und offline.

Für v62 besonders prüfen:

- Undercover/No-Word werden vom Loader zur Imposter-Engine geroutet, nicht zur Quiz-Engine;
- private Karten werden nach Blur/App-Wechsel wieder verdeckt;
- geheime Abstimmung bleibt privat;
- No-Word erhält nach korrekter Enttarnung exakt einen letzten Guess;
- Reload/Resume verdoppelt Rundenscore oder History nicht;
- Cross-Game-Wechsel schützt den vorhandenen Quick-Family-Snapshot.

## Update-Regel

Bei Offline-Core-Änderung: CORE prüfen → Cachegeneration erhöhen → SW-Test → Architektur/Deployment/Privacy/Environment/Hosting synchronisieren → Upgrade/Rollback real testen.

Historie: v56 Quick Replacement → v57 Timer-Restzeit → v58 BFCache Restore → v59 Background Pause → v60 Hidden Snapshot → v61 Wave-1-Quiz → **v62 Wave-1-Imposter**.

## Rollback

Promotion stoppen → Commit/Cache dokumentieren → Revert/Hotfix → neue Cachegeneration → Datenkompatibilität prüfen → HTTPS-Staging + PWA-Rollback erneut testen.

## Production-Smoke-Test

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v62 --production
```

Production muss exakt dem freigegebenen RC entsprechen.

## Release Evidence

`release-evidence.json` bleibt finale Quelle. Aktuell: **NO_GO**.
