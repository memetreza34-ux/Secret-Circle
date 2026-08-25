# Secret Circle Party Hub – Deployment und Rollback

Stand: 25. August 2026

Secret Circle wird für Januar 2027 als statische **offline-first PWA** veröffentlicht. Production darf nicht der erste echte HTTPS-/Service-Worker-Test eines Release Candidates sein.

## Aktueller Releaseumfang

- 45 technisch spielbare Built-ins
- 15 Core / 13 Extended / 17 Labs
- 27 Quick-/Trend-/Viral-Modi
- 4 Advanced-Core-Games
- Word Imposter + Smart Party Night
- lokaler No-Code-Game-Creator
- aktueller Offline-Core: **`secret-circle-v49` / `secret-circle-v49-staging`**
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
- Branch Protection nach `BRANCH_PROTECTION.md` real bestätigt

Ein Job mit `steps: []` zählt nicht als Code-/Testnachweis.

### Produkt / Core

- 15/15 Core nach `CORE_GAME_ACCEPTANCE.md`
- Punkte-/Siegervertrag nach `CORE_SCORING_RULES.md`
- Word-Imposter Voting-/Resume- und Custom-/Backup-Grenzen real geprüft
- Hub-/Advanced-Resume- und Privacy-Guards real geprüft
- keine offenen Critical/High Bugs
- finale Content-/Privacy-/Reference-Abnahme

### PWA / Offline

Der aktuelle RC-Source-Vertrag ist **v49**. Der Offline-Core enthält unter anderem:

- Hub, Word Imposter, Advanced, Quick, Creator, Privacy
- Katalog-/Contentmodule
- Session-/Timercontroller
- `word-imposter-resume-guard.js`
- `party-hub-resume-guard.js`
- `advanced-resume-guard.js`
- `advanced-privacy-guard.js`
- `party-hub-a11y.js`
- `secondary-surface-a11y.js`
- Manifest und PWA-Icons

`tests/service-worker.test.js` schützt die CORE-/Cachequelle. `tests/pwa-head-metadata.test.js` schützt Manifest-/iOS-/Icon-Metadaten der interaktiven Einstiegseiten.

Reale Installation, Offline-Neustart, Update und Rollback bleiben separate Browser-/Geräte-Gates.

## HTTPS-Staging

Staging muss eine eigene HTTPS-Origin besitzen, getrennt von Production. Vor manueller PWA-Abnahme:

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v49
```

`scripts/staging_smoke.py` prüft unter anderem:

- HTTPS
- Same-Origin-Redirects
- Kernseiten und Query-Routen
- Manifest-/Standalone-Vertrag
- PNG-Dimensionen
- Service-Worker-Cachegeneration
- PWA-Head-Metadaten
- Privacy-/Reference-Safe-Source

Der HTTP-Smoke ersetzt keine Service-Worker-Installation, keinen Offline-Neustart und keine Realgeräteprüfung.

## Manueller Staging-/PWA-Smoke

Mindestens:

- Service Worker registriert
- PWA installierbar
- Hub + mindestens eine Unterseite mit korrektem Titel/Icon
- Offline-Neustart
- Hub, Word Imposter, Advanced, Quick, Creator und Privacy offline
- Query-Routen offline
- aktive Session während Update geschützt
- „Später“ und bewusste Aktivierung funktionieren
- Word-Imposter-v48/v49-Datengrenzen bleiben korrekt
- Hub-/Advanced-/Quick-/Creator-A11y-Pfade real
- Export/Import mit neutralen Daten
- Update aus mindestens zwei real installierten Altständen

## Update-Regel

Bei jeder Änderung einer offline benötigten Datei:

1. CORE-Liste prüfen
2. Cachegeneration erhöhen
3. `tests/service-worker.test.js` aktualisieren
4. Architektur/Deployment/Privacy/Environment/Hosting synchronisieren
5. Alt→Neu real testen

v49 wurde eingeführt, weil der eigenständige Hub-Resume-Guard in den expliziten Offline-Core-Vertrag aufgenommen wurde und die Release-/Projektvalidatoren auf die aktuelle Runtime synchronisiert wurden.

## Rollback

Bei einem kritischen Releasefehler:

1. Promotion/Veröffentlichung stoppen
2. betroffenen Commit/Cache dokumentieren
3. gezielten Revert/Hotfix erstellen
4. **neue Cachegeneration** verwenden
5. persistierte Daten kompatibel halten oder migrieren
6. HTTPS-Staging neu testen
7. Upgrade-/Rollbackpfad real prüfen
8. erst danach Production aktualisieren

Kein Force-Push auf eine stabile Releasebasis.

## Production-Smoke-Test

Nach vollständiger Staging-Freigabe:

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v49 --production
```

Danach manuellen Browser-/PWA-Smoke wiederholen. Production muss exakt dem freigegebenen RC entsprechen.

## Hosting / Legal / Support

Vor Production müssen außerdem wahrheitsgemäß abgeschlossen sein:

- `HOSTING_DECISION.md`
- `operator-release.json = FINAL / READY`
- `OPERATOR_RELEASE_SIGNOFF.md`
- `OPERATOR_EVIDENCE_LOG.md`
- finale `privacy.html` und Legal-/Anbieterkennzeichnungsseite, soweit erforderlich
- Support-/Security-Kontakte real getestet
- Probe-SEV-1 und HTTPS-Rollback-Drill
- Asset-/Rechte-Sign-off

## Release Evidence

`release-evidence.json` ist die finale Quelle. Alle 15 Pflichtgates müssen `PASS` sein und denselben unveränderten RC-Commit referenzieren.

Aktuell: **NO_GO**.
