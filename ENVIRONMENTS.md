# Secret Circle – Umgebungen und Staging-Vertrag

Stand: 29. August 2026  
Status: **BLOCKED – Provider und konkrete HTTPS-Staging-/Production-Origins offen**  
Offline-Core: **`secret-circle-v64` / `secret-circle-v64-staging`**

## 1. Ziel

Secret Circle besitzt kein klassisches Backend, benötigt aber getrennte Umgebungen. `localStorage`, Service Worker, Cache Storage und installierte PWAs sind originabhängig.

**Local → CI/Test → HTTPS-Staging → Release Candidate → Production**

## 2. Local / CI

Local ist kein Releasebeweis. CI benötigt sichtbare Runner-Steps, Checkout, Online-`npm ci`, `npm run ci` und Cross-Browser auf demselben RC. `steps: []` bleibt kein Code-Test.

Aktuell ist CI durch fehlende Hosted-Runner-Zuteilung vor Step 1 **BLOCKED**.

Lokaler Quellvertrag für die PWA-Head-Metadaten: `tests/pwa-head-metadata.test.js`. Der echte HTTPS-Smoke ergänzt diesen Source-Test um die tatsächlich ausgelieferten Response-/Security-Header.

## 3. HTTPS-Staging

Staging ist der erste echte Hosting-/Service-Worker-/Installationsraum und muss eine getrennte HTTPS-Origin besitzen.

Aktuell fehlen realer Provider und reale Origin; deshalb ist `stagingHttpSmoke` in `release-evidence.json` korrekt **BLOCKED**, nicht PASS und nicht ausführbar.

Der gewählte Host muss Response-Security- und Cache-Header kontrollierbar ausliefern können. Details: `HOSTING_DECISION.md`.

## 4. Aktueller Cachevertrag

- aktiv: `secret-circle-v64`
- staging: `secret-circle-v64-staging`

Historie: v49 Hub Resume Guard → v50 fail-closed Loader → v51 Complete Backup → v52 sichere Current-Runden → v53 Paranoia → v54 Pre-Timer → v55 Advanced Integrity → v56 Quick Replacement → v57 Timer-Restzeit → v58 BFCache → v59 Background Pause → v60 Hidden Snapshot → v61 Quiz → v62 Imposter → v63 Writing → **v64 Wave 1 Complete**.

## 5. Automatisierter HTTPS-Smoke

Staging:

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v64
```

Production:

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v64 --production
```

Der echte Netzwerk-Smoke verlangt auf öffentlichen HTML-Antworten mindestens:

- Response-CSP mit `default-src 'self'`, `script-src 'self'`, `object-src 'none'`, `base-uri 'none'` und `frame-ancestors 'none'`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer`
- `X-Frame-Options: DENY`
- in Production zusätzlich `Strict-Transport-Security` mit `max-age >= 31536000`
- für `sw.js`: kein `immutable`; falls `max-age` gesetzt ist, höchstens 3600 Sekunden

Eine Meta-CSP im HTML ersetzt diesen Response-Header-Vertrag nicht.

## 6. Manueller Staging-Smoke

Mindestens:

- Service Worker / Installation / Offline-Neustart
- Hub/Word Imposter/Advanced/Quick/Creator/Privacy + Query-Routen offline
- bestehende Spezialgates DWI bis HS60
- **alle 10 Wave-1-Modi erscheinen als Labs**
- jeder neue Modus startet in höchstens 2–3 Entscheidungen
- Quiz/Fake-Fakt Ergebnis-Resume stabil
- Undercover/No-Word private Handoffs und Votes verdeckt
- Writing-Eingaben bei Blur/Hidden verdeckt und anonyme Phasen ohne Autorennamen
- Prozent schätzen Score deterministisch aus Zielwert
- Party Bracket gleicher Sieger aus denselben sieben Picks
- Bluff Trivia private Fakes/Votes, keine eigene Fake-Stimme, Score exact-once
- Ein-Wort-Hinweis Zielwort nur nach bewusstem Reveal; Blur/Reload kein Auto-Reveal
- Cross-Game-Wechsel nutzt Quick-Family-Replacement-Schutz
- Updatebanner + aktive Session
- Accessibility-/Fokuspfade

## 7. Release Candidate / Production

Ein RC wird durch unveränderten Commit, Tag, App-Version, Cachegeneration, Staging-Origin und Freeze-Zeitpunkt definiert. Labs erweitern den Core nicht automatisch.

Production erhält exakt denselben freigegebenen RC. Änderung an Code, Asset, Service Worker oder Hosting-Headern nach Staging erzeugt neue Evidence-Anforderungen.

## 8. Datenisolation

Local/Staging verwenden neutrale Testdaten. Future-Daten-Erhalt, Spezialgates und neue Labs werden getrennt geprüft.

## 9. Rollbackprobe

Version A installieren → neutrale Daten/aktive Session → RC B aktivieren → Rollback/Hotfix C mit neuer Cachegeneration → Daten erhalten → Offline-Neustart + HTTP-Smoke → Evidence dokumentieren.

Der Rollback-/Hotfix-Stand muss erneut die Security-/Cache-Header-Prüfung bestehen.

## 10. Environment-Nachweis

```text
CI run URL/id:
Staging URL/commit/cache:
Staging smoke result:
Staging response-header smoke result:
Staging PWA smoke result:
RC commit/cache:
Production URL/commit/cache:
Production smoke result:
Production response-header/HSTS smoke result:
Production PWA smoke result:
Wave 1 10/10 evidence:
Rollback tested from/to:
Evidence reference:
```

## 11. Release-Gate

Vor `ENVIRONMENT / STAGING PASS`:

- [ ] realer Hostingprovider/Produkt ausgewählt
- [ ] getrennte HTTPS-Staging-/Production-Origin
- [ ] Provider-/Log-/Datenschutzentscheidung dokumentiert
- [ ] `tests/pwa-head-metadata.test.js` auf unverändertem Kandidaten grün
- [ ] Response-Security-Header auf Staging grün
- [ ] `sw.js` Cache-Control auf Staging grün
- [ ] Staging-Smoke grün
- [ ] manueller PWA-Smoke
- [ ] bestehende Spezialgates real bestätigt
- [ ] Wave-1-Labs nur bei eigener Evidence als releasefähig markieren
- [ ] Upgrade aus mindestens zwei real installierten Altständen
- [ ] Rollbackprobe
- [ ] derselbe freigegebene RC für Production
- [ ] Production-Smoke inklusive HSTS grün

Bis zu realer Provider-/Origin-Evidence bleibt Staging **BLOCKED / NO_GO**.
