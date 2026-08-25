# Secret Circle – Incident Response

Stand: 25. August 2026  
Status: **PREPARED – reale Verantwortliche/Kommunikationswege vor RC festlegen**

## 1. Ziel

Dieses Runbook definiert den Ablauf bei Security-, Privacy-, Daten-, PWA- oder Releasevorfällen. Es gilt für Production und für Release Candidates, sobald reale Nutzer oder wichtige lokale Daten betroffen sein können.

Grundsatz:

**Erst Schaden begrenzen und Daten schützen, dann Ursachenanalyse und neue Features.**

Verbindliche zentrale Quelle für reale Rollen und Drill-Nachweise: `operator-release.json`.

## 2. Incident-Auslöser

Ein Incident liegt insbesondere vor, wenn:

- private Rollen/Fragen unerwartet sichtbar werden
- lokale Daten verloren oder beschädigt werden
- ein Update den Offline-Core oder aktive Sessions beschädigt
- ein Import unerlaubte Schlüssel/Werte schreiben kann
- die App entgegen Produktversprechen Daten an Dritte überträgt
- Production nicht mehr zuverlässig startet
- ein kritischer Core-Game-Vertrag falsch ist
- ein eingebauter Inhalt ein erhebliches Safety-/Privacy-/Rechtsproblem besitzt
- eine veröffentlichte Dependency/Asset-Schwachstelle reale Auswirkungen auf Secret Circle hat

## 3. Severity

### SEV-0 – kritisch

Beispiele:

- weitreichender Datenverlust
- unerlaubte Übertragung persönlicher Daten
- ausnutzbare Schwachstelle mit hoher Auswirkung
- Production-Update zerstört installierte Appzustände in großem Umfang

Aktion:

- Veröffentlichung/Update sofort stoppen
- keine weiteren normalen Releases
- Rollback/Hotfix priorisieren
- Betreiber/Incident-Verantwortlichen sofort einbeziehen

### SEV-1 – hoch

Beispiele:

- Core-App startet für relevante Zielgruppe nicht
- private Spielinhalte werden durch Resume/Reload sichtbar
- Complete-Backup-Import beschädigt lokale Daten
- Timer/Scoringfehler verändert Kernmechanik systematisch

Aktion:

- Hotfixkandidat
- betroffenen Pfad isolieren
- Releasegate wieder auf NO_GO setzen

### SEV-2 – mittel

Beispiele:

- einzelner Core-Flow beeinträchtigt, Workaround vorhanden
- Accessibilityblocker für einen wichtigen Flow
- Built-in-Content mit deutlichem Qualitäts-/Safetyproblem ohne unmittelbare kritische Gefahr

### SEV-3 – niedrig

Beispiele:

- kosmetischer Fehler
- kleine Copy-/Layoutabweichung
- nicht-kritischer Labs-/Extended-Bug

## 4. Rollen

Vor RC mit echten Personen festlegen und in `operator-release.json.incident` spiegeln:

- Incident Lead: **noch nicht festgelegt**
- Engineering Owner: **noch nicht festgelegt**
- Nutzerkommunikation/Support: **noch nicht festgelegt**
- Legal/Privacy-Eskalation: **noch nicht festgelegt**

Eine einzelne Person kann in V1 mehrere Rollen übernehmen, aber die Verantwortlichkeit muss vor Production eindeutig sein.

## 5. Standardablauf

### Schritt 1 – Erkennen und dokumentieren

Festhalten:

- Zeitpunkt
- Version/Commit/Cachegeneration
- Meldequelle
- betroffener Flow
- Nutzer-/Daten-/Privacy-Auswirkung
- Reproduzierbarkeit
- Severity vorläufig

### Schritt 2 – Eindämmen

Je nach Vorfall:

- Deployment stoppen
- Draft/Release-PR nicht mergen
- fehlerhafte Version nicht weiter bewerben
- betroffene Funktion temporär aus Releasepfad nehmen
- bei Datenrisiko keine pauschalen Löschschritte empfehlen

### Schritt 3 – Zustand sichern

Vor Änderungen:

- betroffenen Commit/Tag notieren
- reproduzierbare Testdaten sichern, ohne unnötige persönliche Inhalte
- bei lokalen Daten vorhandene Sicherung ermöglichen, falls technisch sicher
- Fehlerpfad dokumentieren

### Schritt 4 – Ursache eingrenzen

Prüfen:

- Regression oder Altfehler?
- nur Browser/OS oder allgemein?
- Cache-/Service-Worker-Zustand?
- Migration/Storage?
- privater Reveal-/Resume-Pfad?
- Content oder Engine?
- Dependency/Hosting?

### Schritt 5 – Fix oder Rollback

Fix muss:

- klein und nachvollziehbar sein
- Regressionstest besitzen, wo automatisierbar
- Daten rückwärtsverträglich behandeln
- bei Offline-Core-Änderung **immer eine neue Cachegeneration** erhalten
- Dokumentation/Gates synchronisieren

Rollback muss den Vertrag aus `DEPLOYMENT.md` und `HOSTING_DECISION.md` befolgen.

### Schritt 6 – Verifizieren

Mindestens:

- betroffenen Reproduktionsfall
- relevante Unit-/Contracttests
- relevante E2E-Suite
- bei PWA: Alt→Neu/Rollbackzustand
- bei Daten: Import/Migration/Rollback
- bei Privacy: verdeckter Zustand + Reload/Appwechsel

Ein externer CI-Blocker darf nicht als grüner Nachweis interpretiert werden.

### Schritt 7 – Kommunizieren

Nutzerkommunikation enthält nur bestätigte Fakten:

- was betroffen ist
- welche Version/Zeitraum betroffen sein kann
- was Nutzer tun beziehungsweise vermeiden sollen
- ob Daten gefährdet/verloren sein können
- wann ein Fix verfügbar ist, erst wenn tatsächlich veröffentlicht

Keine Spekulationen als Fakten darstellen.

### Schritt 8 – Abschluss/Postmortem

Nach SEV-0/SEV-1 festhalten:

- Ursache
- warum bestehende Gates nicht griffen
- Auswirkung
- Fix
- neue Regression-Gates
- Dokumentations-/Prozessänderungen
- offene Restmaßnahmen

## 6. PWA-/Cache-Incidents

Bei fehlerhaftem Offline-Core:

1. keine vorhandene Cachegeneration wiederverwenden
2. korrigierten Stand mit neuer Generation veröffentlichen
3. Staging-Cache vollständig vorbereiten
4. aktive Session schützen
5. Promotion nicht destruktiv durchführen
6. mindestens zwei Upgradepfade testen, sobald reale Geräte verfügbar sind
7. HTTPS-Staging-Smoke erneut ausführen
8. Production erst nach erneutem PASS promoten

## 7. Daten-/Backup-Incidents

- Originalbackup nicht überschreiben
- Format/Registry-Version notieren
- unbekannte Storage-Key-Familien nicht manuell freischalten
- Rollbackpfad zuerst mit Testdaten prüfen
- keine automatische Migration unbekannter zukünftiger Versionen

## 8. Privacy-/Security-Incidents

- keine sensiblen Details in öffentliche Issues kopieren
- nur minimale Reproduktionsdaten sammeln
- betroffene Datenarten und mögliche Empfänger klären
- Rechts-/Meldepflichten bei realer personenbezogener Datenverletzung separat anhand des konkreten Falls prüfen
- Security-/Privacy-Meldeweg aus `operator-release.json.support.securityReportingRoute` verwenden

## 9. Content-Incidents

Bei problematischem Built-in-Content:

- Spiel + Pack + exakte Karte identifizieren
- Safety/Privacy/Alter/Rechte klassifizieren
- bei P1/P0 Karte im finalen Runtimekatalog ersetzen oder entfernen
- Regressionregel ergänzen, wenn maschinell formulierbar
- `CORE_CONTENT_REVIEW.md` und `CONTENT_AGE_POLICY.md` aktualisieren

## 10. Incident-Log-Vorlage

```text
ID:
Datum/Uhrzeit:
Severity:
Version/Commit/Cache:
Meldequelle:
Betroffener Flow:
Auswirkung:
Reproduktion:
Eindämmung:
Ursache:
Fix/Rollback:
Verifikation:
Nutzerkommunikation:
Neue Prävention:
Status:
```

## 11. Verbindlicher Probe-SEV-1 vor Production

Der Drill muss einen realistischen, aber kontrollierten Fall simulieren, z. B.:

> Eine neue PWA-Version zeigt nach einem Update bei einer wiederaufgenommenen privaten Session einen geheimen Inhalt zu früh.

Drill-Schritte:

1. Incident erfassen und als SEV-1 klassifizieren
2. Deployment/Promotion stoppen
3. betroffenen Commit/Cache dokumentieren
4. Nutzerkommunikation entwerfen
5. Reproduktionsfall und Regressionstest festlegen
6. Fix- oder Rollbackentscheidung dokumentieren
7. korrigierte Version mit **neuer Cachegeneration** auf HTTPS-Staging bereitstellen
8. Staging-Smoke + betroffenen PWA-/Privacy-Flow testen
9. Rollback-/Recovery-Ergebnis dokumentieren
10. Postmortem mit neuer Präventionsmaßnahme erstellen

Erst nach realer Durchführung dürfen gesetzt werden:

- `operator-release.json.incident.sev1DrillCompleted = true`
- `operator-release.json.incident.rollbackDrillCompleted = true`
- `operator-release.json.incident.userCommunicationRouteConfirmed = true`

## 12. Release-Gates

Vor `INCIDENT RESPONSE PASS`:

- [ ] reale Verantwortliche eingetragen
- [ ] Support→Incident-Eskalation getestet
- [ ] Rollbackpfad auf HTTPS-Staging praktisch getestet
- [ ] Probe-SEV-1 vollständig durchgespielt
- [ ] Nutzerkommunikationsweg festgelegt und getestet
- [ ] Security/Privacy-Meldeweg festgelegt
- [ ] `operator-release.json` enthält dieselben realen Rollen/Nachweise

Bis dahin: **PREPARED / PRODUCTION NO_GO**.
