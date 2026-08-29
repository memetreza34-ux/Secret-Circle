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
- kontrollierbare Cache-/Headerkonfiguration
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

## 4. Staging-Vertrag – v64

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v64
```

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

## 5. Production-Vertrag – v64

Production erhält **denselben unveränderten RC**, der auf Staging vollständig freigegeben wurde.

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v64 --production
```

Wenn nach Staging ein Code-/Asset-/Service-Worker-Fix nötig wird, ist der frühere Kandidat nicht mehr dieselbe RC-Evidence. Betroffene Gates müssen auf dem neuen Commit erneut ausgeführt werden.

## 6. Cache-/Rollback-Regel

- aktuell: `secret-circle-v64`
- Staging: `secret-circle-v64-staging`
- Cachegeneration nach Offline-Core-Änderung nicht wiederverwenden
- Rollback/Hotfix erhält eine **neue** Generation
- kompatible lokale Daten und aktive Sessions soweit vorgesehen erhalten
- Rollback anschließend erneut auf HTTPS-Staging, Offline-Neustart und Datenkompatibilität prüfen

Historie: v56 Quick Session Replacement → v57 Quick Timer Resume → v58 BFCache → v59 Background Pause → v60 Hidden Snapshot → v61 Quiz → v62 Imposter → v63 Writing → **v64 Wave 1 Complete**.

## 7. CI-Abhängigkeit

Hosting kann vorbereitet und ein Provider ausgewählt werden, aber ein Production-Release darf den aktuellen CI-Blocker nicht umgehen.

Der frische v64-Actions-Lauf #3608 endete mit `steps: []`, `runner_id: 0` und ohne Repositorycode. Vor RC-Freigabe müssen Online-`npm ci`, `npm run ci` und Cross-Browser auf dem unveränderten Kandidaten real laufen.

## 8. Release-Gate

Vor `HOSTING PASS`:

- [ ] Provider/Produkt real ausgewählt
- [ ] Region/Datenroute, Logs, Retention, Processor-/AVV- und Drittlandrolle dokumentiert
- [ ] Abuse-/Security-Kontakt geprüft
- [ ] getrennte HTTPS-Staging-/Production-Origin
- [ ] v64/RC Staging-Smoke grün
- [ ] bestehende Spezialgates real bestätigt
- [ ] Wave-1-Labs nur bei eigener Evidence als releasefähig markieren
- [ ] manueller PWA-Smoke grün
- [ ] Update aus mindestens zwei älteren realen Installationen geprüft
- [ ] Rollback real getestet
- [ ] Privacy-Text auf reales Hosting angepasst
- [ ] reale Evidence im Operator-Log
- [ ] Production-Smoke auf exakt demselben freigegebenen RC grün

Bis dahin bleibt Hosting **PREPARED / NO_GO**.
