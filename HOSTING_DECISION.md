# Secret Circle – Hosting-Entscheidungsvertrag

Stand: 26. August 2026  
Status: **PREPARED – Provider und Domains offen**  
Aktueller Smoke-/Offline-Vertrag: **`secret-circle-v54`**

Secret Circle ist eine statische offline-first PWA ohne eigenes Backend. Der Hostinganbieter verarbeitet dennoch HTTP-Verbindungen und kann technische Access-/Securitylogs erzeugen. Hosting bleibt deshalb ein eigenes Release-Gate.

## 1. Mindestanforderungen

Der Production-Host muss mindestens HTTPS, getrennte Staging-/Production-Origins, statische Dateien ohne notwendige fremde Runtime-Injektion, kontrollierbare Cache-/Headerkonfiguration, nachvollziehbare Logs/Retention, dokumentierte Region/Datenroute, Abuse-/Security-Kontakt und einen belastbaren Rollback-/Deploymentweg bieten.

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

Vor Production anhand des real ausgewählten Providers Request-/IP-/User-Agent-/Securitydaten, Zwecke, Retention/Löschung, AVV/DPA-Rolle, Unterauftragnehmer, Drittlandbezug, Sicherheitsangaben und öffentliche Kontakte prüfen. Das Ergebnis fließt in `operator-release.json`, `privacy.html` und `OPERATOR_EVIDENCE_LOG.md` ein.

## 4. Staging-Vertrag

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v54
```

Danach folgen Browser-/PWA-Smoke, Installation, Offline-Neustart, Updatepfade, Daten-/Resume-/Privacy-Checks und Accessibility-/Gerätetests.

Zusätzlich real prüfen:

- **BK51:** Future-Daten überleben Restore; ungültige managed Werte blockiert; Write-Fail rollt managed Daten zurück.
- **HR52:** sichere Hub-Karten bleiben nach Reload identisch; Wahrheit/Pflicht-Pools unabhängig.
- **PR53:** Paranoia same-question/same-result ohne Auto-Reveal und mit Concealment auch nach Auflösung.
- **PT54:** Hot-Potato-Aufgabe und Wortketten-Startbuchstabe bleiben vor Timerstart über Reload identisch; beim Start wird `current` gelöscht und `timer.prompt`/`timer.letter` übernimmt denselben Wert.

## 5. Production-Vertrag

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v54 --production
```

Der Production-Smoke ersetzt keine finale manuelle PWA-/Legal-/Support-Abnahme.

## 6. Cache-/Rollback-Regel

- aktuell: `secret-circle-v54`
- Staging: `secret-circle-v54-staging`
- keine Wiederverwendung einer Cachegeneration nach Änderung einer Offline-Core-Datei
- Rollback/Hotfix erhält eine neue Generation
- lokale Daten und aktive Sessions müssen soweit vorgesehen erhalten bleiben

Historie:

- v49: zentraler Hub-Resume-Guard
- v50: fail-closed Resume-UI-Quarantäne
- v51: Complete Backup / Forward Compatibility
- v52: sichere direkte Hub-Current-Runden + Truth/Dare-Pools
- v53: gedeckte Paranoia-Rundenreferenz + stabiles Münzwurf-Ergebnis
- **v54: sichere Pre-Timer-Kontinuität für Hot Potato und Wortkette mit Übergang in den Timer-Snapshot**

Der Rollback-Drill wird mit realen Staging-Deployments und neutralen Testdaten durchgeführt und in `OPERATOR_EVIDENCE_LOG.md` dokumentiert.

## 7. Öffentliche Legal-/Privacy-Flächen

Vor `operatorGate = READY` müssen reale Hostingangaben in öffentlichen Privacy-/Legal-Flächen konsistent sein. `scripts/operator_release_contract_audit.py` erzwingt bei READY unter anderem finale Betreiber-/Kontakt-/Hostingangaben, getrennte HTTPS-Origins und veröffentlichte Legal-/Support-Verknüpfung.

## 8. Release-Gate

Vor `HOSTING PASS`:

- [ ] Provider und Produkt real ausgewählt
- [ ] Region/Datenroute, Logs, Retention, Processor-/AVV- und Drittlandrolle dokumentiert
- [ ] Abuse-/Security-Kontakt geprüft
- [ ] getrennte HTTPS-Staging- und Production-Origin
- [ ] v54/RC Staging-Smoke grün
- [ ] HR2 / BK51 / HR52 / PR53 / PT54 real bestätigt
- [ ] manueller PWA-Smoke grün
- [ ] Rollbackweg real getestet
- [ ] Privacy-Text auf reales Hosting angepasst
- [ ] reale Evidence in `OPERATOR_EVIDENCE_LOG.md`

Bis dahin bleibt Hosting **PREPARED / NO_GO**.