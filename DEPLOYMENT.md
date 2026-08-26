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
- aktueller Offline-Core: **`secret-circle-v53` / `secret-circle-v53-staging`**
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
- Hub-Resume-v2-Ladequarantäne real geprüft
- v52 sichere Direkt-Hub-Rundenkontinuität real geprüft
- **v53 Paranoia real geprüft: gleiche geheime Frage nach Reload erst auf explizite Reveal-Aktion, gleiches bereits feststehendes Münzwurf-Ergebnis und erneutes Verdecken auch nach Auflösung**
- Complete Backup v51 real geprüft: managed-only Restore, Future-Key-Erhalt, key-spezifische Vorvalidierung und Rollback
- keine offenen Critical/High Bugs
- finale Content-/Privacy-/Reference-Abnahme

### PWA / Offline

Der aktuelle RC-Source-Vertrag ist **v53**. Der Offline-Core enthält unter anderem:

- Hub, Word Imposter, Advanced, Quick, Creator, Privacy
- Katalog-/Contentmodule
- Session-/Timercontroller
- `word-imposter-resume-guard.js`
- `party-hub-resume-guard.js`
- `party-hub-round-state.js` Version 2 für sichere und verdeckte Current-Referenzen
- `party-hub-polish.js` Version 17 mit fail-closed Resume-Ladequarantäne und Paranoia-Concealment auch nach Auflösung
- `backup-schema-registry.js`
- `party-data-tools.js` Version 6 mit v51-Complete-Backup-Hardening
- Advanced-Resume-/Privacy- und Accessibility-Schichten
- Manifest und PWA-Icons

`tests/service-worker.test.js` schützt die CORE-/Cachequelle. `tests/hub-resume-contract.test.js` schützt die Rundenstatuslogik. `tests/e2e/core-hub-resume.spec.js` schützt Reload-/Resume-Verhalten; `tests/e2e/core-hub-controls.spec.js` schützt unter anderem Blur-Concealment nach Paranoia-Auflösung.

Reale Installation, Offline-Neustart, Update und Rollback bleiben separate Browser-/Geräte-Gates.

## HTTPS-Staging

Staging muss eine eigene HTTPS-Origin besitzen, getrennt von Production. Vor manueller PWA-Abnahme:

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v53
```

Der HTTP-Smoke ersetzt keine Service-Worker-Installation, keinen Offline-Neustart und keine Realgeräteprüfung.

## Manueller Staging-/PWA-Smoke

Mindestens:

- Service Worker registriert und PWA installierbar
- Hub + Kernunterseiten online/offline
- Query-Routen offline
- aktive Session während Update geschützt
- Word-Imposter-v48-Datengrenzen
- Hub-Resume-v2 inklusive v50-Ladequarantäne
- v52 Wahrheit/Pflicht/Prompt/Choice sichere Current-Kontinuität
- **v53 Paranoia-Frage: nach Reload gedeckt, nach explizitem Reveal exakt dieselbe Frage**
- **v53 Paranoia-Ergebnis: nach Reload gedeckt, nach explizitem Anzeigen exakt dasselbe Münzwurf-Ergebnis**
- **v53 Paranoia nach Münzwurf: Blur/Appwechsel verdeckt den Zustand erneut**
- Complete Backup v51 Future-Key/Future-Version/Vorvalidierung/Rollback
- Accessibility-Pfade
- Update aus mindestens zwei real installierten Altständen

## Update-Regel

Bei jeder Änderung einer offline benötigten Datei:

1. CORE-Liste prüfen
2. Cachegeneration erhöhen
3. `tests/service-worker.test.js` aktualisieren
4. Architektur/Deployment/Privacy/Environment/Hosting synchronisieren
5. Alt→Neu real testen

Historie: v49 zentralisierte den Hub-Resume-Guard; v50 sperrte Resume-Aktionen bis zur Guard-Validierung; v51 härtete Complete Backup; v52 erhielt sichere laufende Direkt-Hub-Karten über Reload; **v53 erhält verdeckte Paranoia-Rundenreferenzen und ein unveränderliches bereits gefälltes Münzwurf-Ergebnis, ohne Auto-Reveal.**

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
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v53 --production
```

Danach manuellen Browser-/PWA-Smoke wiederholen. Production muss exakt dem freigegebenen RC entsprechen.

## Hosting / Legal / Support

Vor Production müssen außerdem wahrheitsgemäß abgeschlossen sein: `HOSTING_DECISION.md`, `operator-release.json = FINAL / READY`, `OPERATOR_RELEASE_SIGNOFF.md`, `OPERATOR_EVIDENCE_LOG.md`, finale Privacy-/Legal-Flächen, real getestete Support-/Security-Kontakte, Probe-SEV-1, HTTPS-Rollback-Drill und Asset-/Rechte-Sign-off.

## Release Evidence

`release-evidence.json` ist die finale Quelle. Alle 15 Pflichtgates müssen `PASS` sein und denselben unveränderten RC-Commit referenzieren.

Aktuell: **NO_GO**.