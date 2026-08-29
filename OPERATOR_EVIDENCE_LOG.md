# Secret Circle – Operator Evidence Log

Stand: 25. August 2026  
Status: **PREPARED – keine reale Evidence eingetragen**

Dieses Dokument ist die operative Beweisakte für die realen Betreiber-, Hosting-, Support-, Security- und Incident-Tests. Es ergänzt `operator-release.json` und `OPERATOR_RELEASE_SIGNOFF.md`.

**Regel:** Keine erfundenen Namen, URLs, E-Mail-Adressen, Zeitpunkte oder Testergebnisse. Jeder Eintrag muss einem konkreten Release-/RC-Commit und der tatsächlich getesteten Cachegeneration zugeordnet sein.

## A. Identität des Teststands

```text
Test-ID:
Datum/Uhrzeit:
RC-Commit (40-stellig):
App-Version:
Cachegeneration:
Staging-Origin:
Production-Origin, falls bereits freigegeben:
Tester/Reviewer:
```

## B. Hosting-Evidence

```text
Provider:
Produkt/Tarif:
Region/Standort:
HTTPS geprüft: ja/nein
Staging und Production getrennte Origins: ja/nein
Access-/Serverlogs dokumentiert: ja/nein
Aufbewahrung/Löschkriterien dokumentiert: ja/nein
Processor-/AVV-Rolle geprüft: ja/nein/nicht einschlägig
Drittlandbezug geprüft: ja/nein
Abuse-/Security-Kontakt geprüft: ja/nein
Staging-Smoke Kommando:
Staging-Smoke Ergebnis:
Production-Smoke Kommando:
Production-Smoke Ergebnis:
Beleg/Referenz:
Offene Punkte:
```

## C. Supportkontakt-Test

Ziel: nachweisen, dass der veröffentlichte Supportweg real erreichbar und überwacht ist.

```text
Öffentliche Supportadresse:
Test gesendet am:
Test empfangen am:
Zugriff durch verantwortliche Person bestätigt: ja/nein
Antwortweg funktioniert: ja/nein
Keine sensiblen Daten für Standarddiagnose verlangt: ja/nein
Beleg/Referenz:
Ergebnis: PASS / FAIL / BLOCKED
```

## D. Security-/Privacy-Meldeweg-Test

Keine echte Schwachstelle für den Test verwenden. Eine neutrale Testmeldung genügt.

```text
Security-/Privacy-Meldeweg:
Testmeldung gesendet am:
Testmeldung empfangen am:
Nicht öffentlich sichtbar: ja/nein
Eskalation an Incident-Verantwortliche funktioniert: ja/nein
Beleg/Referenz:
Ergebnis: PASS / FAIL / BLOCKED
```

## E. Probe-Supportfall

Beispielszenario: Ein Nutzer meldet, dass eine gespeicherte Session nach einem App-Update nicht fortgesetzt werden kann. Keine echten personenbezogenen Backups verwenden.

```text
Fall-ID:
Ausgangslage:
Version/Commit/Cache:
Gerät/Browser:
Supportklassifikation:
Angeforderte Diagnosedaten:
Wurden unnötige private Daten vermieden: ja/nein
Engineering-Übergabe erforderlich: ja/nein
Reproduktionsschritte vollständig: ja/nein
Abschluss dokumentiert: ja/nein
Ergebnis: PASS / FAIL / BLOCKED
```

## F. Probe-SEV-1

Empfohlenes Test-Szenario: Ein privater Reveal-Zustand würde nach Resume unerwartet sichtbar. Der Drill darf rein simuliert werden; Productiondaten werden nicht verändert.

```text
Drill-ID:
Szenario:
Startzeit:
Incident Lead:
Engineering Owner:
Support-/Kommunikationsowner:
Legal-/Privacy-Owner:
Release auf NO_GO gesetzt: ja/nein
Eindämmung definiert: ja/nein
Reproduktionspfad dokumentiert: ja/nein
Fix-/Rollbackentscheidung dokumentiert: ja/nein
Nutzerkommunikation vorbereitet: ja/nein
Postmortem/Praevention dokumentiert: ja/nein
Endzeit:
Ergebnis: PASS / FAIL / BLOCKED
```

## G. HTTPS-Staging-Rollback-Drill

Der Rollback wird mit echten Staging-Deployments und **neuer Cachegeneration** durchgeführt. Eine bereits veröffentlichte Cachegeneration wird nicht wiederverwendet.

```text
Drill-ID:
Ausgangs-Commit/Cache A:
RC-/Test-Commit/Cache B:
Rollback-/Hotfix-Commit/Cache C:
Staging-Origin:
Lokale Testdaten vor Update vorhanden: ja/nein
Aktive Session vor Update vorhanden: ja/nein
A → B erfolgreich: ja/nein
B → C erfolgreich: ja/nein
Lokale Daten erhalten: ja/nein
Offline-Neustart nach C: ja/nein
Staging-Smoke auf C grün: ja/nein
Beleg/Referenz:
Ergebnis: PASS / FAIL / BLOCKED
```

## H. Finale Legal-/Privacy-Plausibilisierung

Dieses Feld dokumentiert nur, **dass** die finale Prüfung anhand des realen Modells stattgefunden hat. Es ersetzt keine Rechtsberatung.

```text
Betreiber-/Anbieterkennzeichnung geprüft: ja/nein
Hosting-/DSGVO-Text final geprüft: ja/nein
Lokaler Speicher/TDDDG geprüft: ja/nein
VSBG-Position geprüft: ja/nein
Keine veraltete EU-OS-Plattform verlinkt: ja/nein
Content-/Assetrechte final geprüft: ja/nein
Altersposition final geprüft: ja/nein
Monetarisierung N/A V1 oder neu geprüft: ja/nein
Prüfdatum:
Reviewer:
Offene Punkte:
Ergebnis: PASS / FAIL / BLOCKED
```

## I. Operator-Gate-Abschluss

`operator-release.json` darf erst auf `FINAL / READY` gestellt werden, wenn die dafür relevanten realen Werte und Tests aus dieser Akte abgeschlossen sind und die veröffentlichten Seiten tatsächlich dieselben Betreiber-/Kontakt-/Hostingangaben enthalten.

```text
Alle Pflichtangaben vorhanden: ja/nein
Hosting Evidence PASS: ja/nein
Supportkontakt PASS: ja/nein
Securityroute PASS: ja/nein
Probe-Supportfall PASS: ja/nein
Probe-SEV-1 PASS: ja/nein
Rollback-Drill PASS: ja/nein
Finale Legal-/Privacy-Prüfung PASS: ja/nein
Öffentliche Seiten geprüft: ja/nein
Operator Gate: BLOCKED / READY
```

Bis zur realen Durchführung bleibt dieses Dokument **PREPARED** und der öffentliche Release **NO_GO**.
