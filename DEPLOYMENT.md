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
- aktueller Offline-Core: **`secret-circle-v55` / `secret-circle-v55-staging`**
- Release-PR: Draft-PR #13 auf `agent/release-foundation-2027`

Öffentliche Freigabe: **NO_GO**.

## Deployment-Reihenfolge

**Local → CI/Test → HTTPS-Staging → Release Candidate → Production**

Production erhält denselben unveränderten RC, der auf Staging freigegeben wurde.

## Voraussetzungen vor Production

### Repository / CI

- finaler 40-stelliger RC-Commit und Tag
- `package-lock.json` v3
- echter Online-`npm ci`
- `npm run ci` grün
- Chromium/Firefox/WebKit auf demselben Commit grün
- Required Check + Branch Protection real bestätigt

Ein Job mit `steps: []` zählt nicht als Code-/Testnachweis.

### Produkt / Core

Real zu prüfen:

- 15/15 Core
- DWI / HR2 / BK51 / HR52 / PR53 / PT54
- **AD55 Advanced Integrity:** unmögliche Location-Spy-Hybridresultate verworfen; Mafia-Terminalzustände konsistent; fertige Mafia-Runde exact-once; bestehende Advanced-Session nur nach Bestätigung ersetzt; Löschfehler bleibt fail-closed
- Advanced Secret Resume/Privacy
- keine offenen Critical/High Bugs

### PWA / Offline

Der aktuelle RC-Source-Vertrag ist **v55**. Offline enthalten sind unter anderem:

- `advanced-resume-guard.js` Version 4
- `party-advanced-runner.js` mit bestätigtem Session-Ersatz
- `advanced-privacy-guard.js`
- `scripts/advanced_integrity_audit.py` als Buildvertrag
- alle bisherigen Hub-/Word-/Backup-/A11y-/Timer-Schutzmodule

Reale Installation, Offline-Neustart, Update und Rollback bleiben separate Gates.

## HTTPS-Staging

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v55
```

Der HTTP-Smoke ersetzt keine Service-Worker-Installation oder Realgeräteprüfung.

## Manueller Staging-/PWA-Smoke

Mindestens:

- Service Worker registriert und PWA installierbar
- Kernseiten + Query-Routen offline
- aktive Session während Update geschützt
- DWI / HR2 / BK51 / HR52 / PR53 / PT54
- **AD55:** Location Spy Hybrid-State blockiert; Mafia non-finished winner-State blockiert; bestehende Advanced-Session bei „Neue Session beginnen“ erst nach Bestätigung ersetzt; Cancel erhält alte Session; Storage-Remove-Fehler startet keine neue Session
- Advanced Secret Resume/Blur-Concealment
- Accessibility-Pfade
- Update aus mindestens zwei älteren Installationen

## Update-Regel

Bei Änderung einer Offline-Core-Datei: CORE prüfen → Cachegeneration erhöhen → SW-Test aktualisieren → Architektur/Deployment/Privacy/Environment/Hosting synchronisieren → Alt→Neu real testen.

Historie: v49 Hub Resume Guard; v50 fail-closed Loader; v51 Complete Backup; v52 sichere Hub Current-Runden; v53 Paranoia Resume/Privacy; v54 Pre-Timer Resume; **v55 Advanced Integrity + bestätigter Session-Ersatz**.

## Rollback

1. Promotion stoppen
2. Commit/Cache dokumentieren
3. Revert/Hotfix erstellen
4. neue Cachegeneration verwenden
5. Daten kompatibel halten oder migrieren
6. HTTPS-Staging neu testen
7. Upgrade-/Rollbackpfad real prüfen
8. erst danach Production aktualisieren

## Production-Smoke

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v55 --production
```

Production muss exakt dem freigegebenen RC entsprechen.

## Release Evidence

`release-evidence.json` ist die finale Quelle. Pflichtgates müssen `PASS` sein und denselben unveränderten RC referenzieren.

Aktuell: **NO_GO**.