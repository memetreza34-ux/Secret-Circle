# Secret Circle Party Hub – Deployment und Rollback

Stand: 26. August 2026

Secret Circle wird für Januar 2027 als statische **offline-first PWA** veröffentlicht. Production darf nicht der erste echte HTTPS-/Service-Worker-Test eines Release Candidates sein.

## Aktueller Releaseumfang

- 45 technisch spielbare Built-ins
- 15 Core / 13 Extended / 17 Labs
- 27 Quick-/Trend-/Viral-Modi
- 4 Advanced-Core-Games
- Word Imposter + Smart Party Night
- lokaler No-Code-Game-Creator
- aktueller Offline-Core: **`secret-circle-v54` / `secret-circle-v54-staging`**
- Release-PR: Draft-PR #13 auf `agent/release-foundation-2027`

Öffentliche Freigabe: **NO_GO**, bis reale Release-Evidence vorliegt.

## Deployment-Reihenfolge

**Local → CI/Test → HTTPS-Staging → Release Candidate → Production**

Production erhält denselben unveränderten statischen RC, der auf Staging freigegeben wurde.

## Voraussetzungen vor Production

### Repository / CI

- finaler 40-stelliger RC-Commit und Tag
- `package-lock.json` v3 synchron
- echter Online-`npm ci`
- `npm run ci` grün
- Chromium/Firefox/WebKit auf demselben Commit grün
- `Secret Circle CI / validate` als real funktionierender Required Check
- Branch Protection real bestätigt

Ein Job mit `steps: []` zählt nicht als Code-/Testnachweis.

### Produkt / Core

- 15/15 Core nach `CORE_GAME_ACCEPTANCE.md`
- Punkte-/Siegervertrag nach `CORE_SCORING_RULES.md`
- Word-Imposter Voting-/Resume-/Datengrenzen real geprüft
- Hub-/Advanced-Resume- und Privacy-Guards real geprüft
- v50 Hub-Resume-Ladequarantäne real geprüft
- v51 Complete Backup real geprüft
- v52 sichere Direkt-Hub-Rundenkontinuität real geprüft
- v53 Paranoia same-question/same-result + Privacy real geprüft
- **v54 Pre-Timer-Resume real geprüft: Hot-Potato-Aufgabe und Word-Chain-Startbuchstabe bleiben vor Timerstart über Reload identisch; beim Timerstart wird `current` gelöscht und der Timer-Snapshot übernimmt**
- keine offenen Critical/High Bugs

### PWA / Offline

Der aktuelle RC-Source-Vertrag ist **v54**. Der Offline-Core enthält unter anderem:

- Hub, Word Imposter, Advanced, Quick, Creator, Privacy
- Session-/Timercontroller
- `party-hub-round-state.js` Version 3
- `party-hub-timers.js` mit v54-Pre-Start-Übergang
- `party-hub-resume-guard.js`
- `party-hub-polish.js` Version 17
- Word-Imposter-/Advanced-Resume-/Privacy-Guards
- Backup-Registry + `party-data-tools.js` Version 6
- Hub-/Secondary-A11y
- Manifest und PWA-Icons

Source-Verträge: `tests/hub-resume-contract.test.js`, `tests/hub-timer-contract.test.js`, `tests/e2e/core-hub-resume.spec.js`, `tests/e2e/core-hub-controls.spec.js`, `tests/e2e/core-hub-prestart-resume.spec.js`, `tests/service-worker.test.js`.

Reale Installation, Offline-Neustart, Update und Rollback bleiben separate Browser-/Geräte-Gates.

## HTTPS-Staging

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v54
```

Der HTTP-Smoke ersetzt keine Service-Worker-Installation, keinen Offline-Neustart und keine Realgeräteprüfung.

## Manueller Staging-/PWA-Smoke

Mindestens:

- Service Worker registriert und PWA installierbar
- Kernseiten + Query-Routen offline
- aktive Session während Update geschützt
- DWI / HR2 / BK51 / HR52 / PR53
- **PT54 Hot Potato vor Timerstart: Aufgabe notieren → Reload/Resume → exakt dieselbe Aufgabe → Timer starten → `current=null`, `timer.prompt` entspricht Aufgabe**
- **PT54 Word Chain vor Timerstart: Startbuchstabe notieren → Reload/Resume → exakt derselbe Buchstabe → Timer starten → `current=null`, `timer.letter` entspricht Buchstabe**
- Scharade/Tabu bleiben ohne sichtbaren Pre-Start-Current
- Accessibility-Pfade
- Update aus mindestens zwei real installierten Altständen

## Update-Regel

Bei jeder Änderung einer offline benötigten Datei:

1. CORE-Liste prüfen
2. Cachegeneration erhöhen
3. `tests/service-worker.test.js` aktualisieren
4. Architektur/Deployment/Privacy/Environment/Hosting synchronisieren
5. Alt→Neu real testen

Historie: v49 zentraler Hub-Resume-Guard; v50 fail-closed Loader; v51 Complete Backup; v52 sichere sichtbare Current-Runden; v53 gedecktes Paranoia-Resume; **v54 stabile sichere Pre-Timer-Werte für Hot Potato und Word Chain mit atomarem Übergang in den Timer-Snapshot**.

## Rollback

1. Promotion stoppen
2. betroffenen Commit/Cache dokumentieren
3. gezielten Revert/Hotfix erstellen
4. neue Cachegeneration verwenden
5. persistierte Daten kompatibel halten oder migrieren
6. HTTPS-Staging neu testen
7. Upgrade-/Rollbackpfad real prüfen
8. erst danach Production aktualisieren

Kein Force-Push auf eine stabile Releasebasis.

## Production-Smoke-Test

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v54 --production
```

Production muss exakt dem freigegebenen RC entsprechen.

## Hosting / Legal / Support

Vor Production müssen `HOSTING_DECISION.md`, `operator-release.json = FINAL / READY`, Operator Evidence, finale Privacy-/Legal-Flächen, Support-/Securitytests, Probe-SEV-1, HTTPS-Rollback-Drill und Asset-/Rechte-Sign-off wahrheitsgemäß abgeschlossen sein.

## Release Evidence

`release-evidence.json` ist die finale Quelle. Alle Pflichtgates müssen `PASS` sein und denselben unveränderten RC-Commit referenzieren.

Aktuell: **NO_GO**.