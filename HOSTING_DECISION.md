# Secret Circle – Hosting-Entscheidungsvertrag

Stand: 29. August 2026  
Status: **PREPARED – Provider und Domains offen**  
Aktueller Smoke-/Offline-Vertrag: **`secret-circle-v64` / `secret-circle-v64-staging`**

Secret Circle ist eine statische offline-first PWA ohne eigenes Backend. Der Hostinganbieter verarbeitet dennoch HTTP-Verbindungen und kann technische Access-/Securitylogs erzeugen. Hosting bleibt deshalb ein eigenes Release-Gate.

Aktueller Produktstand laut `release-meta.json`: **v64 · 55 Built-ins · 15 Core / 13 Extended / 27 Labs · Wave 1 10/10 source-implemented · NO_GO**.

## 1. Mindestanforderungen

Der Production-Host muss mindestens bieten:

- HTTPS
- getrennte Staging-/Production-Origins
- statische Dateien ohne notwendige fremde Runtime-Injektion
- kontrollierbare Response-/Security-/Cache-Header
- nachvollziehbare Logs/Retention
- dokumentierte Region/Datenroute
- Abuse-/Security-Kontakt
- belastbaren Deploymentweg
- belastbaren Rollbackweg
- Möglichkeit, exakt denselben unveränderten RC von Staging nach Production zu promoten

## 2. Vor Auswahl dokumentieren

```text
Provider:
Produkt/Tarif:
Region/Standort:
Staging-Origin:
Production-Origin:
HTTPS bestätigt:
Response-Security-Header konfigurierbar:
Service-Worker Cache-Control konfigurierbar:
Accesslogs:
Securitylogs:
Aufbewahrung/Löschkriterien:
Processor-/AVV-Rolle:
Drittlandbezug:
Abuse-/Security-Kontakt:
Deploymentweg:
Rollbackweg:
Reviewer:
Datum:
```

Keine Felder aus Vermutung ausfüllen.

## 3. Datenschutzprüfung

Vor Production Request-/IP-/User-Agent-/Securitydaten, Zwecke, Retention/Löschung, AVV/DPA-Rolle, Unterauftragnehmer, Drittlandbezug, Sicherheitsangaben und Kontakte des real ausgewählten Providers prüfen. Das Ergebnis fließt in `operator-release.json`, `privacy.html` und `OPERATOR_EVIDENCE_LOG.md` ein.

Providerwahl oder Hostingkomfort dürfen die V1-Datenschutzposition nicht still verändern: kein Pflichtkonto, kein Tracking, keine Werbung und kein Cloudzwang für den lokalen Spielbetrieb.

## 4. Verbindlicher Response-Security-Header-Vertrag

Die HTML-Meta-CSP bleibt als lokale/fallback-nahe Quellschutzschicht bestehen. Für echtes HTTPS-Staging und Production ist zusätzlich eine **HTTP-Response-CSP** Pflicht, weil insbesondere `frame-ancestors` nur als Response-Header wirksam ist.

Für öffentliche HTML-Seiten verlangt `scripts/staging_smoke.py` mindestens:

```text
Content-Security-Policy: default-src 'self'; script-src 'self'; ...; object-src 'none'; base-uri 'none'; frame-ancestors 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
X-Frame-Options: DENY
```

Die Response-CSP darf weitere restriktive Direktiven enthalten, muss aber mindestens folgende Verträge bewahren:

- `default-src 'self'`
- `script-src 'self'`
- `object-src 'none'`
- `base-uri 'none'`
- `frame-ancestors 'none'`

`frame-ancestors 'none'` + `X-Frame-Options: DENY` bilden absichtlich Defense-in-Depth gegen Clickjacking.

### Production zusätzlich

Im `--production`-Smoke ist zusätzlich erforderlich:

```text
Strict-Transport-Security: max-age=31536000
```

Ein höherer `max-age` und zusätzliche sichere HSTS-Parameter sind zulässig. `includeSubDomains` oder `preload` dürfen aber erst aktiviert werden, wenn die reale Domainstruktur bewusst dafür geeignet ist; der Test erzwingt diese beiden Parameter deshalb nicht.

### Service-Worker Cache-Control

`sw.js` darf nicht so aggressiv gecacht werden, dass eine neue Service-Worker-Version lange unsichtbar bleibt.

Verbindlich:

- kein `Cache-Control: immutable` für `sw.js`
- wenn `max-age` gesetzt wird: **höchstens 3600 Sekunden**
- kürzer, `no-cache` oder äquivalente revalidierende Strategie ist zulässig
- statische versionierte Assets dürfen separat sinnvoll stärker gecacht werden

Der Smoke prüft diese Regeln gegen die tatsächlich ausgelieferten Response-Header; eine reine Hosting-Dokumentation zählt nicht als PASS.

## 5. Staging-Vertrag – v64

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v64
```

Der Netzwerk-Smoke prüft unter anderem:

- HTTPS
- keine Cross-Origin-Redirects
- begrenzte Responsegrößen
- Manifest-/Icon-Verträge
- PWA-Head-Metadaten
- Response-CSP inklusive `frame-ancestors 'none'`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer`
- `X-Frame-Options: DENY`
- sichere `sw.js`-Cache-Policy
- aktuellen v64-Service-Worker-Cache
- definierte Privacy-/Reference-Content-Verträge

Danach folgen Browser-/PWA-Smoke, Installation, Offline-Neustart, Updatepfade, Daten-/Resume-/Privacy-Checks und Accessibility-/Gerätetests.

Zusätzlich real prüfen:

- bestehende Spezialgates DWI bis HS60
- alle zehn Wave-1-Labs erscheinen weiterhin als Labs
- Quiz-Familie: Result-Resume/Score exact-once
- Imposter-Familie: private Handoff-/Vote-UI nach Fokus-/Appwechsel wieder verdeckt
- Writing-Familie: private Eingaben/Anonymität über Reload/Resume korrekt
- Prozent schätzen: deterministischer Score
- Party Bracket: identische Picks → identischer Sieger
- Bluff Trivia: Fake-Eingaben/Votes privat; richtige Antwort erst im Ergebnis
- Ein-Wort-Hinweis: Zielwort nur nach bewusstem Reveal; kein Auto-Reveal nach Blur/Reload
- Cross-Game-Wechsel nutzt Quick-Family-Replacement-Schutz
- `quick-loader.js` v11 routet die Wave-1-Enginefamilien
- `party-release-structure.js` v5 hält die zehn Wave-1-Modi in Labs
- benötigte Wave-1-Kataloge/Runner liegen im Offline-Core

## 6. Production-Vertrag – v64

Production erhält **denselben unveränderten RC**, der auf Staging vollständig freigegeben wurde.

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v64 --production
```

Production muss zusätzlich den HSTS-Vertrag erfüllen. Wenn nach Staging ein Code-/Asset-/Service-Worker-/Header-Fix nötig wird, ist der frühere Kandidat nicht mehr dieselbe RC-Evidence. Betroffene Gates müssen auf dem neuen Stand erneut ausgeführt werden.

## 7. Cache-/Rollback-Regel

- aktuell: `secret-circle-v64`
- Staging: `secret-circle-v64-staging`
- Cachegeneration nach Offline-Core-Änderung nicht wiederverwenden
- Rollback/Hotfix erhält eine **neue** Generation
- kompatible lokale Daten und aktive Sessions soweit vorgesehen erhalten
- Rollback anschließend erneut auf HTTPS-Staging, Offline-Neustart und Datenkompatibilität prüfen
- `sw.js` selbst nicht mit `immutable` oder `max-age > 3600` ausliefern

Historie: v56 Quick Session Replacement → v57 Quick Timer Resume → v58 BFCache → v59 Background Pause → v60 Hidden Snapshot → v61 Quiz → v62 Imposter → v63 Writing → **v64 Wave 1 Complete**.

## 8. CI-Abhängigkeit

Hosting kann vorbereitet und ein Provider ausgewählt werden, aber ein Production-Release darf den aktuellen CI-Blocker nicht umgehen.

Der aktuelle Hosted-Runner-Fehler endet vor Step 1 mit `steps: []` / `runner_id: 0`; kein Repositorycode wird ausgeführt. Vor RC-Freigabe müssen Online-`npm ci`, `npm run ci` und Cross-Browser auf dem unveränderten Kandidaten real laufen.

## 9. Release-Gate

Vor `HOSTING PASS`:

- [ ] Provider/Produkt real ausgewählt
- [ ] Region/Datenroute, Logs, Retention, Processor-/AVV- und Drittlandrolle dokumentiert
- [ ] Abuse-/Security-Kontakt geprüft
- [ ] getrennte HTTPS-Staging-/Production-Origin
- [ ] Response-Security-Header auf realem Staging grün
- [ ] `sw.js` Cache-Control auf realem Staging grün
- [ ] v64/RC Staging-Smoke grün
- [ ] bestehende Spezialgates real bestätigt
- [ ] Wave-1-Labs nur bei eigener Evidence als releasefähig markieren
- [ ] manueller PWA-Smoke grün
- [ ] Update aus mindestens zwei älteren realen Installationen geprüft
- [ ] Rollback real getestet
- [ ] Privacy-Text auf reales Hosting angepasst
- [ ] reale Evidence im Operator-Log
- [ ] Production-Smoke auf exakt demselben freigegebenen RC grün
- [ ] Production-HSTS mit `max-age >= 31536000` bestätigt

Bis dahin bleibt Hosting **PREPARED / NO_GO**.
