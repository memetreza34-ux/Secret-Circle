# Secret Circle – Operator-, Legal-, Support- und Incident-Sign-off

Stand: 25. August 2026  
Status: **PREPARED – reale Betreiber-/Kontakt-/Hostingangaben offen**

Dieses Dokument bündelt die menschliche Freigabe für die Bereiche Betreiber, Hosting, Datenschutz, Support und Incident Response. Die maschinenlesbare Spiegelakte ist `operator-release.json`.

**Wichtig:** Keine erfundenen Namen, Adressen, E-Mail-Adressen, Hostingangaben oder Testnachweise eintragen. Falls das Repository später öffentlich wird, nur Daten committen, die bewusst veröffentlicht werden sollen.

## 1. Betreiberidentität

Vor Production vollständig festlegen:

- verantwortliche natürliche oder juristische Person
- Rechtsform, soweit vorhanden
- Vertretungsberechtigte, soweit relevant
- ladungsfähige Anschrift
- funktionsfähige öffentliche E-Mail-Adresse
- Register/Registernummer, soweit vorhanden und erforderlich
- USt-IdNr./Wirtschafts-IdNr., soweit vorhanden und anzugeben

Die öffentliche Anbieterkennzeichnung muss anhand des tatsächlichen Geschäfts-/Veröffentlichungsmodells final geprüft werden. `LEGAL_CHECKLIST.md` bleibt der Detailvertrag.

## 2. Hostingentscheidung

Vor Production dokumentieren:

- Anbieter und Produkt
- Region/Standort, soweit relevant
- getrennte HTTPS-Staging- und Production-Origin
- technisch anfallende Access-/Serverlogs
- Aufbewahrung beziehungsweise Löschkriterien
- datenschutzrechtliche Rolle des Hosters / Auftragsverarbeitung, soweit einschlägig
- Drittlandbezug, falls vorhanden
- Abuse-/Security-Kontakt des Hosters
- bestätigtes HTTPS

Details: `HOSTING_DECISION.md` und `ENVIRONMENTS.md`.

## 3. Öffentliche Legal-Flächen

Vor Production:

- `privacy.html` auf reales Hosting und realen Verantwortlichen anpassen
- Legal-/Anbieterkennzeichnungsseite veröffentlichen, soweit erforderlich
- Datenschutz und Legal von den zentralen öffentlichen Seiten leicht erreichbar machen
- öffentlichen Supportweg konsistent verlinken
- Verbraucherstreitbeilegung anhand des realen Unternehmensmodells bewerten
- keine veraltete EU-OS-Plattform verlinken

Keine Platzhalter dürfen auf einer öffentlichen Releasefläche verbleiben.

## 4. Support

Vor `SUPPORT PASS`:

- reale Supportadresse festlegen
- Postfach praktisch testen
- Security-/Privacy-Meldeweg festlegen
- Securityweg praktisch testen
- mindestens einen Probe-Supportfall vollständig durchspielen
- sicherstellen, dass Support keine unnötigen privaten Chats, Passwörter, Fotos oder persönlichen Backups anfordert

## 5. Incident Response

Vor `INCIDENT RESPONSE PASS`:

- Incident Lead benennen
- Engineering Owner benennen
- Support-/Kommunikationsverantwortung benennen
- Legal-/Privacy-Eskalationsverantwortung benennen
- Probe-SEV-1 durchspielen
- HTTPS-Staging-Rollback praktisch durchspielen
- Nutzerkommunikationsweg bestätigen

Eine Person darf in V1 mehrere Rollen übernehmen; die Zuordnung muss trotzdem eindeutig dokumentiert sein.

## 6. Finale Rechtsprüfung

Vor Production anhand des dann tatsächlichen Modells erneut prüfen:

- Anbieterkennzeichnung / DDG
- Datenschutzhinweise / DSGVO und tatsächliche Hostingverarbeitung
- lokaler Browser-/Endgeräte-Speicher / TDDDG
- Verbraucherstreitbeilegung / VSBG
- Alters-/Contentposition
- Asset-/Marken-/Urheberrechte
- Monetarisierung: für V1 entweder bewusst `N/A` oder bei Scopeänderung vollständige Neubewertung

Dieses Dokument ist ein Releaseprüfvertrag und keine individuelle Rechtsberatung.

## 7. Maschinenlesbare Freigabe

`operator-release.json` startet absichtlich mit:

- `evidenceStatus = PREPARED`
- `operatorGate = BLOCKED`
- nicht belegte reale Werte = `null` beziehungsweise `false`

`operatorGate = READY` ist erst zulässig, wenn alle für das reale Modell erforderlichen Felder wahrheitsgemäß ausgefüllt, Support-/Securitykontakte getestet, Hosting/Privacy final geprüft und die Incident-/Rollback-Drills durchgeführt wurden.

## 8. Sign-off-Protokoll

```text
Datum:
Release-/RC-Commit:
Operator/Verantwortlicher final geprüft: ja/nein
Hosting final geprüft: ja/nein
Privacy final geprüft: ja/nein
Legal-/Anbieterkennzeichnung final geprüft: ja/nein
Supportkontakt getestet: ja/nein
Security-Meldeweg getestet: ja/nein
SEV-1-Drill: ja/nein
Rollback-Drill: ja/nein
Reviewer/Verantwortlicher:
Offene Punkte:
Operator Gate: BLOCKED / READY
```

## Release-Regel

Solange `operator-release.json` nicht wahrheitsgemäß `FINAL / READY` ist, bleiben die Release-Evidence-Gates `legalPrivacy` und/oder `supportIncident` offen beziehungsweise blockiert. Der öffentliche Release bleibt **NO_GO**.
