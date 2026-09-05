# Secret Circle Party Hub – Deployment und Rollback

Stand: 29. August 2026

Secret Circle wird für Januar 2027 als statische **offline-first PWA** veröffentlicht. Production darf nicht der erste echte HTTPS-/Service-Worker-/Security-Header-Test eines Release Candidates sein.

## Aktueller Releaseumfang

- **55 Built-ins · 15 Core / 13 Extended / 27 Labs**
- **Wave 1 = 10/10 geplante Labs quellsseitig implementiert**
- Word Imposter + Smart Party Night + lokaler Creator
- aktueller Offline-Core: **`secret-circle-v64` / `secret-circle-v64-staging`**
- Package: **`1.0.0-beta.3`**
- Quick Loader v11
- Draft-PR #13 auf `agent/release-foundation-2027`
- Main-Reconciliation-Kandidat: Draft-PR #15
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
- realer Hostingprovider und getrennte HTTPS-Staging-/Production-Origins
- `tests/pwa-head-metadata.test.js` auf demselben Kandidaten grün
- `scripts/staging_smoke.py` gegen reale HTTPS-Origins grün
- Staging Response-Security-/Cache-Header grün
- bestehende Spezialgates real bestätigt
- Wave-1-Labs nur bei eigener Browser-/Offline-/Accessibility-/Gruppen-Evidence als releasefähig behandeln
- keine offenen Critical/High Bugs

Ein Job mit `steps: []` ist kein Code-/Testnachweis.

## PWA / Offline – v64

Offline enthalten sind alle Wave-1-Kataloge und Runner, `party-session-controls.js` Version 5, Quick Replacement Guard v2, Quick Loader v11 und Backup Registry v2.

- **PT54:** Hot-Potato-/Word-Chain-Pre-Timer-Resume.
- **QT57:** Restzeit über normalen Reload.
- **BF58:** BFCache-Rückkehr sicher.
- **BG59:** Hidden pausiert.
- **HS60:** Hidden persistiert Restzeit.
- **v61:** Quiz.
- **v62:** Imposter.
- **v63:** Writing.
- **v64:** Prozent/Bracket/Bluff/Clue und Wave 1 vollständig 10/10.

`tests/pwa-head-metadata.test.js` bleibt der lokale Source-Vertrag für PWA-Head-/Icon-/Manifest-Metadaten. `scripts/staging_smoke.py` prüft zusätzlich die tatsächlich ausgelieferte HTTPS-Origin und deren Response-Header.

## HTTPS-Staging

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v64
```

Der automatisierte Netzwerk-Smoke prüft die ausgelieferte Origin, nicht nur Repositorydateien. Er verlangt für HTML mindestens:

- Response-CSP inklusive `frame-ancestors 'none'`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer`
- `X-Frame-Options: DENY`

Für `sw.js` gilt:

- kein `Cache-Control: immutable`
- bei vorhandenem `max-age`: höchstens 3600 Sekunden

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

Bei Hosting-/Header-Änderung: Staging neu deployen → kompletten Netzwerk-Smoke erneut ausführen → PWA-/Updatewirkung prüfen → Evidence an denselben Kandidaten binden.

Historie: v56 Quick Replacement → v57 Timer-Restzeit → v58 BFCache → v59 Background Pause → v60 Hidden Snapshot → v61 Quiz → v62 Imposter → v63 Writing → **v64 Wave 1 Complete**.

## Rollback

Promotion stoppen → Commit/Cache dokumentieren → Revert/Hotfix → neue Cachegeneration → Datenkompatibilität prüfen → HTTPS-Staging + Security-/Cache-Header + PWA-Rollback erneut testen.

Ein alter Cache-Name darf nicht für einen veränderten Offline-Core wiederverwendet werden.

## Production-Smoke-Test

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v64 --production
```

Production muss zusätzlich liefern:

- `Strict-Transport-Security` mit `max-age >= 31536000`
- dieselben CSP-/Clickjacking-/MIME-/Referrer-Verträge wie Staging
- dieselbe sichere `sw.js`-Cache-Policy

`includeSubDomains`/`preload` werden nicht automatisch erzwungen, da sie eine bewusste reale Domainentscheidung benötigen.

## Deployment Evidence

Für jeden freigegebenen RC festhalten:

```text
RC commit:
App version:
Cache generation:
Staging origin:
Staging response-header smoke:
Staging PWA smoke:
Production origin:
Production response-header/HSTS smoke:
Production PWA smoke:
Rollback drill:
Evidence reference:
```

## Release Evidence

`release-evidence.json` bleibt finale Quelle. Aktuell sind Staging-/Production-Smokes wegen fehlendem realen Provider/Origins **BLOCKED** und der Gesamtstatus bleibt **NO_GO**.
