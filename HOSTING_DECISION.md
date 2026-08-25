# Secret Circle – Hosting-Entscheidungsvertrag

Stand: 25. August 2026  
Status: **PREPARED – Provider und Domains offen**  
Aktueller Smoke-/Offline-Vertrag: **`secret-circle-v51`**

Secret Circle ist eine statische offline-first PWA ohne eigenes Backend. Der Hostinganbieter verarbeitet dennoch HTTP-Verbindungen und kann technische Access-/Securitylogs erzeugen. Hosting bleibt deshalb ein eigenes Release-Gate.

## 1. Mindestanforderungen

Der Production-Host muss mindestens bieten:

- HTTPS
- eigene Production-Origin
- getrennte HTTPS-Staging-Origin
- statische Dateien ohne notwendige Runtime-Injektion fremder Skripte
- kontrollierbare Cache-/Headerkonfiguration
- nachvollziehbare Logs/Retention
- dokumentierte Region beziehungsweise Datenroute, soweit relevant
- klare Abuse-/Security-Kontaktmöglichkeit
- verlässlichen Rollback/Deploymentweg

Staging und Production dürfen nicht dieselbe Origin sein.

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

Vor Production anhand des real ausgewählten Providers prüfen:

- welche Request-/IP-/User-Agent-/Securitydaten technisch anfallen
- zu welchem Zweck Logs verarbeitet werden
- Aufbewahrungsdauer beziehungsweise Löschkriterien
- ob Auftragsverarbeitung einschlägig ist
- ob ein AVV/DPA erforderlich und verfügbar ist
- Unterauftragnehmer
- Drittlandbezug und gegebenenfalls Transfermechanismus
- technische/organisatorische Sicherheitsangaben
- öffentlich erreichbarer Datenschutz-/Securitykontakt

Das Ergebnis fließt in `operator-release.json`, `privacy.html` und `OPERATOR_EVIDENCE_LOG.md` ein.

## 4. Staging-Vertrag

Staging ist der erste echte Deploymentraum des RC. Für den aktuellen Quellstand:

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v51
```

Danach folgen manueller Browser-/PWA-Smoke, Installation, Offline-Neustart, Updatepfade, Daten-/Resume-Checks und Accessibility-/Gerätetests. Zusätzlich muss v51 mit neutralen Backups real bestätigen, dass unbekannte/future Namespaces einen Restore überleben, ungültige managed JSON-Werte vor Mutation blockiert werden und ein simulierter Schreibfehler die verwalteten Daten zurückrollt.

## 5. Production-Vertrag

Production erhält denselben freigegebenen RC:

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v51 --production
```

Der Production-Smoke ersetzt keine finale manuelle PWA-/Legal-/Support-Abnahme.

## 6. Cache-/Rollback-Regel

- aktuell: `secret-circle-v51`
- Staging: `secret-circle-v51-staging`
- keine Wiederverwendung einer Cachegeneration nach Änderung einer Offline-Core-Datei
- Rollback/Hotfix erhält eine neue Generation
- lokale Daten und aktive Sessions müssen soweit vorgesehen erhalten bleiben

Historie: v49 zentralisierte die Hub-Resume-Validierung; v50 ergänzte die fail-closed Resume-UI-Quarantäne; **v51 härtet Complete-Backup-Restore und Forward-Compatibility gegen lokalen Datenverlust.**

Der Rollback-Drill wird mit realen Staging-Deployments und neutralen Testdaten durchgeführt und in `OPERATOR_EVIDENCE_LOG.md` dokumentiert.

## 7. Öffentliche Legal-/Privacy-Flächen

Vor `operatorGate = READY` müssen die realen Hostingangaben in der öffentlichen Privacy-/Legal-Darstellung konsistent sein. `scripts/operator_release_contract_audit.py` erzwingt bei READY unter anderem:

- existierende Privacy- und Legal-Seite
- finalen Betreiber-/Kontaktbezug
- finalen Hostingprovider in der Privacy-Seite
- getrennte HTTPS-Staging-/Production-Origins
- veröffentlichte Legal-/Support-Verknüpfung

## 8. Release-Gate

Vor `HOSTING PASS`:

- [ ] Provider und Produkt real ausgewählt
- [ ] Region/Datenroute dokumentiert
- [ ] Accesslogs dokumentiert
- [ ] Retention/Löschung dokumentiert
- [ ] Processor-/AVV-Rolle geprüft
- [ ] Drittlandbezug geprüft
- [ ] Abuse-/Security-Kontakt geprüft
- [ ] getrennte HTTPS-Staging- und Production-Origin
- [ ] v51/RC Staging-Smoke grün
- [ ] Hub-Resume-v2/v50-Ladequarantäne real bestätigt
- [ ] Complete-Backup-v51 Restore-/Rollback-/Future-Key-Vertrag real bestätigt
- [ ] manueller PWA-Smoke grün
- [ ] Rollbackweg real getestet
- [ ] Privacy-Text auf reales Hosting angepasst
- [ ] reale Evidence in `OPERATOR_EVIDENCE_LOG.md`

Bis dahin bleibt Hosting **PREPARED / NO_GO**.