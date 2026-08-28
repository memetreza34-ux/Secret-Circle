# Secret Circle – Hosting-Entscheidungsvertrag

Stand: 28. August 2026  
Status: **PREPARED – Provider und Domains offen**  
Aktueller Smoke-/Offline-Vertrag: **`secret-circle-v60`**

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
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v60
```

Danach folgen Browser-/PWA-Smoke, Installation, Offline-Neustart, Updatepfade, Daten-/Resume-/Privacy-Checks und Accessibility-/Gerätetests.

Zusätzlich real prüfen:

- **BK51:** Future-Daten überleben Restore; ungültige managed Werte blockiert; Write-Fail rollt managed Daten zurück.
- **HR52:** sichere Hub-Karten bleiben nach Reload identisch; Wahrheit/Pflicht-Pools unabhängig.
- **PR53:** Paranoia same-question/same-result ohne Auto-Reveal.
- **PT54:** Hot-Potato-Aufgabe und Wortketten-Startbuchstabe bleiben vor Timerstart stabil und wechseln korrekt in den Timer-Snapshot.
- **AD55:** Advanced-Guard v4 verwirft unmögliche Location-/Mafia-Zustände; bestehende Advanced-Session nur nach expliziter Bestätigung ersetzen.
- **QR56:** Quick-Family-Session-Ersatz verlangt Bestätigung; Cancel erhält den Alt-Snapshot; Write-Fail bleibt fail-closed.
- **QT57:** laufender Quick-Family-Timer behält Restzeit über Reload; stale Snapshot wird verworfen; Timer-Store bleibt promptfrei.
- **BF58:** BFCache-Rückkehr mit passendem Timer-Snapshot führt kontrolliert in den normalen Resume-Pfad; stale Snapshot wird ohne Reload entfernt.
- **BG59:** App-/Tabwechsel oder Screen-Lock pausiert einen laufenden Quick-Family-Timer automatisch; nach Rückkehr bleibt er pausiert, bis `Fortsetzen` bewusst gewählt wird.
- **HS60:** `visibilitychange(hidden)` schreibt die Restzeit sofort in den bestehenden Timer-Store; Cold Resume ohne vorausgesetztes `pagehide` nimmt diese Restzeit einmalig wieder auf; normaler Same-Page-Stop entfernt den Zwischenstand.

## 5. Production-Vertrag

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v60 --production
```

## 6. Cache-/Rollback-Regel

- aktuell: `secret-circle-v60`
- Staging: `secret-circle-v60-staging`
- Cachegeneration nach Offline-Core-Änderung nicht wiederverwenden
- Rollback/Hotfix erhält eine neue Generation
- lokale Daten und aktive Sessions soweit vorgesehen erhalten

Historie: v49 Hub Resume Guard → v50 fail-closed Resume-UI → v51 Complete Backup → v52 sichere Hub Current-Runden → v53 Paranoia Resume/Privacy → v54 Pre-Timer Resume → v55 Advanced Integrity → v56 Quick Session Replacement → v57 Quick Timer Resume → v58 BFCache Timer Resume → v59 Background Timer Pause → **v60 Hidden Snapshot Durability**.

## 7. Release-Gate

Vor `HOSTING PASS`:

- [ ] Provider/Produkt real ausgewählt
- [ ] Region/Datenroute, Logs, Retention, Processor-/AVV- und Drittlandrolle dokumentiert
- [ ] Abuse-/Security-Kontakt geprüft
- [ ] getrennte HTTPS-Staging-/Production-Origin
- [ ] v60/RC Staging-Smoke grün
- [ ] HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57 / BF58 / BG59 / **HS60** real bestätigt
- [ ] manueller PWA-Smoke grün
- [ ] Rollback real getestet
- [ ] Privacy-Text auf reales Hosting angepasst
- [ ] reale Evidence im Operator-Log

Bis dahin bleibt Hosting **PREPARED / NO_GO**.