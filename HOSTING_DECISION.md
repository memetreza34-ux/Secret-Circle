# Secret Circle – Hosting-Entscheidungsvertrag

Stand: 29. August 2026  
Status: **PREPARED – Provider und Domains offen**  
Aktueller Smoke-/Offline-Vertrag: **`secret-circle-v61`**

Secret Circle ist eine statische offline-first PWA ohne eigenes Backend. Der Hostinganbieter verarbeitet dennoch HTTP-Verbindungen und kann technische Access-/Securitylogs erzeugen. Hosting bleibt deshalb ein eigenes Release-Gate.

## 1. Mindestanforderungen

Der Production-Host muss mindestens HTTPS, getrennte Staging-/Production-Origins, statische Dateien ohne notwendige fremde Runtime-Injektion, kontrollierbare Cache-/Headerkonfiguration, nachvollziehbare Logs/Retention, dokumentierte Region/Datenroute, Abuse-/Security-Kontakt und einen belastbaren Rollback-/Deploymentweg bieten.

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

## 4. Staging-Vertrag

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v61
```

Danach folgen Browser-/PWA-Smoke, Installation, Offline-Neustart, Updatepfade, Daten-/Resume-/Privacy-Checks und Accessibility-/Gerätetests.

Zusätzlich real prüfen:

- bestehende Spezialgates BK51 bis HS60;
- **Wave 1 / v61:** Party Quiz + Fake oder Fakt werden als Labs geladen und funktionieren online/offline;
- Party Quiz Result-Reload verändert Score nicht erneut;
- Cross-Game-Wechsel zwischen beiden Labs nutzt den Quick-Family-Replacement-Schutz;
- Wave-1-Katalog und Shared Runner sind im Offline-Core vorhanden.

## 5. Production-Vertrag

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v61 --production
```

## 6. Cache-/Rollback-Regel

- aktuell: `secret-circle-v61`
- Staging: `secret-circle-v61-staging`
- Cachegeneration nach Offline-Core-Änderung nicht wiederverwenden
- Rollback/Hotfix erhält eine neue Generation
- lokale Daten und aktive Sessions soweit vorgesehen erhalten

Historie: v56 Quick Session Replacement → v57 Quick Timer Resume → v58 BFCache → v59 Background Pause → v60 Hidden Snapshot → **v61 Expansion Wave 1**.

## 7. Release-Gate

Vor `HOSTING PASS`:

- [ ] Provider/Produkt real ausgewählt
- [ ] Region/Datenroute, Logs, Retention, Processor-/AVV- und Drittlandrolle dokumentiert
- [ ] Abuse-/Security-Kontakt geprüft
- [ ] getrennte HTTPS-Staging-/Production-Origin
- [ ] v61/RC Staging-Smoke grün
- [ ] bestehende Spezialgates real bestätigt
- [ ] Wave-1-Labs nur bei eigener Evidence als releasefähig markieren
- [ ] manueller PWA-Smoke grün
- [ ] Rollback real getestet
- [ ] Privacy-Text auf reales Hosting angepasst
- [ ] reale Evidence im Operator-Log

Bis dahin bleibt Hosting **PREPARED / NO_GO**.
