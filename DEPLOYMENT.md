# Secret Circle Party Hub – Deployment und Rollback

Stand: 29. August 2026

Secret Circle wird für Januar 2027 als statische **offline-first PWA** veröffentlicht. Production darf nicht der erste echte HTTPS-/Service-Worker-Test eines Release Candidates sein.

## Aktueller Releaseumfang

- **55 Built-ins · 15 Core / 13 Extended / 27 Labs**
- **Wave 1 = 10/10 geplante Labs quellsseitig implementiert**
- Word Imposter + Smart Party Night + lokaler Creator
- aktueller Offline-Core: **`secret-circle-v64` / `secret-circle-v64-staging`**
- Quick Loader v11
- Draft-PR #13 auf `agent/release-foundation-2027`
- öffentliche Freigabe: **NO_GO**

Wave 1: Party Quiz, Fake oder Fakt, Undercover – ähnliches Wort, Imposter ohne Wort, Satzduell, Wer hat das geschrieben?, Prozent schätzen, Party Bracket, Bluff Trivia und Ein-Wort-Hinweis. Alle bleiben Labs.

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

## PWA / Offline – v64

Offline enthalten sind alle Wave-1-Kataloge und Runner, `party-session-controls.js` Version 5, Quick Replacement Guard v2, Quick Loader v11 und Backup Registry v2.

- **QT57:** Restzeit über normalen Reload.
- **BF58:** BFCache-Rückkehr sicher.
- **BG59:** Hidden pausiert.
- **HS60:** Hidden persistiert Restzeit.
- **v61:** Quiz.
- **v62:** Imposter.
- **v63:** Writing.
- **v64:** Prozent/Bracket/Bluff/Clue und Wave 1 vollständig 10/10.

## HTTPS-Staging

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v64
```

Manuell zusätzlich: Installation, Offline-Neustart, Update/Rollback, bestehende Spezialgates und alle zehn Wave-1-Labs online/offline.

Für v64 besonders prüfen:

- Prozent schätzen: Ergebnis/Score nach Reload identisch;
- Party Bracket: sieben Picks ergeben nach Reload denselben Sieger;
- Bluff Trivia: Fake-Eingaben und Votes bleiben privat, richtige Antwort erst im Ergebnis, Scoring exact-once;
- Ein-Wort-Hinweis: Zielwort nach Blur/Reload nicht automatisch sichtbar, Ergebnis stabil;
- Cross-Game-Wechsel nutzt Quick-Family-Replacement-Schutz;
- Labs bleiben vom 15-Core-Release getrennt.

## Update-Regel

Bei Offline-Core-Änderung: CORE prüfen → Cachegeneration erhöhen → SW-Test → Architektur/Deployment/Privacy/Environment/Hosting synchronisieren → Upgrade/Rollback real testen.

Historie: v56 Quick Replacement → v57 Timer-Restzeit → v58 BFCache → v59 Background Pause → v60 Hidden Snapshot → v61 Quiz → v62 Imposter → v63 Writing → **v64 Wave 1 Complete**.

## Rollback

Promotion stoppen → Commit/Cache dokumentieren → Revert/Hotfix → neue Cachegeneration → Datenkompatibilität prüfen → HTTPS-Staging + PWA-Rollback erneut testen.

## Production-Smoke-Test

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v64 --production
```

## Release Evidence

`release-evidence.json` bleibt finale Quelle. Aktuell: **NO_GO**.
