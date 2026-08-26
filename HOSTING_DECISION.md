# Secret Circle – Hosting-Entscheidungsvertrag

Stand: 26. August 2026  
Status: **PREPARED – Provider und Domains offen**  
Aktueller Smoke-/Offline-Vertrag: **`secret-circle-v53`**

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
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v53
```

Danach folgen manueller Browser-/PWA-Smoke, Installation, Offline-Neustart, Updatepfade, Daten-/Resume-/Privacy-Checks und Accessibility-/Gerätetests.

Zusätzlich real prüfen:

- **BK51:** unbekannte/future Namespaces überleben Restore; ungültige managed Werte werden vor Mutation blockiert; Write-Fail rollt managed Daten zurück.
- **HR52:** sichere Hub-Karten bleiben nach Reload/Resume identisch und Wahrheit/Pflicht-Pools bleiben unabhängig.
- **PR53:** Paranoia bleibt nach Reload gedeckt, zeigt nach bewusster Aktion exakt dieselbe geheime Frage beziehungsweise dasselbe bereits entschiedene Münzwurf-Ergebnis und wird auch nach Auflösung bei Fokusverlust erneut verdeckt.

## 5. Production-Vertrag

Production erhält denselben freigegebenen RC:

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v53 --production
```

Der Production-Smoke ersetzt keine finale manuelle PWA-/Legal-/Support-Abnahme.

## 6. Cache-/Rollback-Regel

- aktuell: `secret-circle-v53`
- Staging: `secret-circle-v53-staging`
- keine Wiederverwendung einer Cachegeneration nach Änderung einer Offline-Core-Datei
- Rollback/Hotfix erhält eine neue Generation
- lokale Daten und aktive Sessions müssen soweit vorgesehen erhalten bleiben

Historie:

- v49: zentraler Hub-Resume-Guard
- v50: fail-closed Resume-UI-Quarantäne
- v51: Complete-Backup-Restore/Forward-Compatibility
- v52: sicherer direkter Hub-Rundenstatus und getrennte Truth/Dare-Usage-Pools
- **v53: verdeckte Paranoia-Rundenreferenz/Phase + stabiles Münzwurf-Ergebnis + Concealment nach Auflösung**

Der Rollback-Drill wird mit realen Staging-Deployments und neutralen Testdaten durchgeführt und in `OPERATOR_EVIDENCE_LOG.md` dokumentiert.

## 7. Öffentliche Legal-/Privacy-Flächen

Vor `operatorGate = READY` müssen die realen Hostingangaben in der öffentlichen Privacy-/Legal-Darstellung konsistent sein. `scripts/operator_release_contract_audit.py` erzwingt bei READY unter anderem finale Betreiber-/Kontakt-/Hostingangaben, getrennte HTTPS-Origins und veröffentlichte Legal-/Support-Verknüpfung.

## 8. Release-Gate

Vor `HOSTING PASS`:

- [ ] Provider und Produkt real ausgewählt
- [ ] Region/Datenroute dokumentiert
- [ ] Accesslogs / Retention / Löschung dokumentiert
- [ ] Processor-/AVV- und Drittlandrolle geprüft
- [ ] Abuse-/Security-Kontakt geprüft
- [ ] getrennte HTTPS-Staging- und Production-Origin
- [ ] v53/RC Staging-Smoke grün
- [ ] Hub-Resume-v2/v50-Ladequarantäne real bestätigt
- [ ] BK51 real bestätigt
- [ ] HR52 real bestätigt
- [ ] PR53 real bestätigt
- [ ] manueller PWA-Smoke grün
- [ ] Rollbackweg real getestet
- [ ] Privacy-Text auf reales Hosting angepasst
- [ ] reale Evidence in `OPERATOR_EVIDENCE_LOG.md`

Bis dahin bleibt Hosting **PREPARED / NO_GO**.