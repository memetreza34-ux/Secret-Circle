# Secret Circle – Legal- und Veröffentlichungscheckliste

Stand: 25. August 2026  
Status: **PREPARED – Betreiberangaben, Hosting und finale Rechtsprüfung offen**

> Dieses Dokument ist ein technischer Release- und Prüfkatalog, keine individuelle Rechtsberatung. Vor öffentlicher oder kommerzieller Veröffentlichung müssen tatsächliche Betreiberform, Hostingroute, Monetarisierung und Zielgruppe anhand des dann aktuellen Rechts final geprüft werden.

Zentrale operative Akten:

- `operator-release.json` – maschinenlesbarer Status
- `OPERATOR_RELEASE_SIGNOFF.md` – menschlicher Freigabevertrag
- `HOSTING_DECISION.md` – Provider-/Hostingentscheidung
- `SUPPORT.md` – öffentlicher Supportvertrag
- `INCIDENT_RESPONSE.md` – Incident-/Eskalationsvertrag

## 1. Aktueller Produktstand

Für den Januar-2027-Release ist Secret Circle derzeit geplant als:

- statische installierbare PWA
- ohne verpflichtendes Konto
- ohne eigenen Spielserver
- ohne Analyse-, Werbe- oder Trackingdienste
- lokale Spiel-/Creator-/Sessiondaten im Browser
- statische Dateien werden vom Hostinganbieter ausgeliefert
- keine Zahlungen oder In-App-Käufe im aktuellen V1-Scope
- keine externen Schriftarten/CDN-Runtime-Abhängigkeiten
- Nutzer können eigene lokale Inhalte erstellen und als JSON exportieren/importieren

Wenn sich einer dieser Punkte ändert, muss diese Checkliste vor Implementierung neu bewertet werden.

## 2. Betreiber- und Anbieterkennzeichnung

Vor Release zwingend klären:

- [ ] tatsächliche verantwortliche natürliche/juristische Person festlegen
- [ ] ladungsfähige Anschrift festlegen
- [ ] funktionsfähige E-Mail-/Kontaktmöglichkeit festlegen
- [ ] Rechtsform und Vertretungsberechtigte angeben, falls juristische Person
- [ ] Register und Registernummer angeben, falls vorhanden/relevant
- [ ] USt-IdNr./Wirtschafts-IdNr. angeben, falls vorhanden und gesetzlich erforderlich
- [ ] prüfen, ob weitere berufs-/aufsichtsrechtliche Angaben erforderlich sind

§ 5 DDG verlangt für geschäftsmäßige, in der Regel gegen Entgelt angebotene digitale Dienste leicht erkennbare, unmittelbar erreichbare und ständig verfügbare Anbieterinformationen. Ob und in welchem Umfang Secret Circle im konkreten Betreiber-/Veröffentlichungsmodell darunter fällt, wird vor Production final geprüft.

**Release-Regel:** Kein öffentliches GO mit Platzhaltern, Fantasieadressen oder nicht überwachten E-Mail-Adressen.

## 3. Datenschutz / DSGVO

`privacy.html` bildet derzeit die technische Produktrealität ab: kein Konto, kein Tracking, kein eigener Spielserver, lokale Speicherung. Das endgültige Hosting ist jedoch noch nicht festgelegt.

Vor Release prüfen:

- [ ] Verantwortlichen und Kontakt in der Datenschutzerklärung nennen, soweit erforderlich
- [ ] tatsächlichen Hostinganbieter und dessen technisch unvermeidbare Server-/Logdaten beschreiben
- [ ] tatsächliche Zwecke und Rechtsgrundlagen je Verarbeitung prüfen
- [ ] Empfänger/Auftragsverarbeiter inventarisieren, falls vorhanden
- [ ] Speicherdauern beziehungsweise Kriterien dafür nennen
- [ ] Betroffenenrechte und zuständige Aufsichtsbehörde korrekt abbilden, soweit DSGVO anwendbar
- [ ] Drittlandtransfers prüfen, falls Hosting oder Dienste außerhalb EU/EWR betroffen sind
- [ ] keine behauptete „0 Datenverarbeitung“, wenn Hosting technisch IP-/Logdaten verarbeitet
- [ ] Datenschutzerklärung nach finaler Hostingentscheidung erneut prüfen

Art. 13 DSGVO enthält Informationspflichten, wenn personenbezogene Daten bei betroffenen Personen erhoben werden. Secret Circles lokales Offline-Design reduziert serverseitige Datenverarbeitung stark, ersetzt aber nicht die Prüfung der tatsächlich durch Hosting und Betrieb entstehenden Verarbeitung.

## 4. Lokaler Browser-Speicher / TDDDG

Secret Circle nutzt Browser-Speicher für ausdrücklich gewünschte Funktionen wie:

- Spieler/Presets/Favoriten
- aktive Sessions und Wiederaufnahme
- Einstellungen/Filter
- Creator-Inhalte
- Verlauf/Statistik
- Backups/Importzustände

§ 25 TDDDG regelt Speicherung beziehungsweise Zugriff auf Informationen in Endeinrichtungen. Eine Einwilligung ist nach § 25 Abs. 2 Nr. 2 unter anderem dann nicht erforderlich, wenn die Speicherung oder der Zugriff unbedingt erforderlich ist, um einen ausdrücklich gewünschten digitalen Dienst bereitzustellen.

Vor Production wird deshalb je Storage-Zweck dokumentiert:

- [ ] technisch/funktional erforderlich?
- [ ] vom Nutzer ausdrücklich gewünschte Funktion?
- [ ] nur Komfort oder optionale Messung/Marketing?
- [ ] falls nicht sicher unter Ausnahme: Einwilligungsanforderung prüfen

**Aktueller V1-Vertrag:** Keine Analytics-, Werbe- oder Tracking-Speicher hinzufügen, ohne diesen Bereich und `THREAT_MODEL.md` neu zu bewerten.

## 5. Impressum-/Legal-Navigation

Vor Release:

- [ ] Legal-/Anbieterkennzeichnungsseite mit finalen Betreiberangaben erstellen, soweit erforderlich
- [ ] Link von jeder zentralen öffentlichen Seite leicht erreichbar machen
- [ ] Datenschutz ebenso leicht erreichbar halten
- [ ] Supportkontakt konsistent zu `SUPPORT.md` und `operator-release.json` halten
- [ ] keine Legal-Seite nur im installierten/offline Zustand verstecken
- [ ] `scripts/public_release_placeholder_audit.py` grün

Eine öffentliche Placeholder-Legal-Seite wird bewusst **nicht** vorab angelegt. Erst reale, freigegebene Angaben werden veröffentlicht.

## 6. Verbraucherrecht / Monetarisierung

V1 ist aktuell ohne Bezahlfunktion geplant. `operator-release.json` führt deshalb derzeit `monetizationPosition = N/A_V1`.

Falls später Abos, Einmalkauf, In-App-Käufe, Werbung oder kostenpflichtige Premiumfunktionen hinzukommen, vor Implementierung separat prüfen:

- Preise und Gesamtpreis
- Vertragslaufzeit/Kündigung
- Widerrufsrecht und Ausnahmen bei digitalen Inhalten/Dienstleistungen
- Bestellbutton-/Informationspflichten
- App-Store-Zahlungs-/Erstattungsregeln
- Minderjährige und Einwilligungs-/Geschäftsfähigkeitsfragen
- Steuer-/Rechnungsanforderungen
- Plattformbedingungen

Monetarisierung gilt als **Architecture/Legal Change**, nicht als reine UI-Änderung.

## 7. Verbraucherstreitbeilegung

§ 36 VSBG enthält Informationspflichten zur Bereitschaft/Verpflichtung zur Teilnahme an Verbraucherschlichtung. Für die allgemeine Information nach § 36 Abs. 1 Nr. 1 besteht die gesetzliche Ausnahme für Unternehmer, die am 31. Dezember des Vorjahres zehn oder weniger Personen beschäftigt haben. § 37 VSBG kann nach Entstehen einer nicht beigelegten Verbrauchervertragsstreitigkeit trotzdem relevant sein.

Vor Release/Monetarisierung:

- [ ] tatsächliche Unternehmereigenschaft und Beschäftigtenzahl prüfen
- [ ] Teilnahmebereitschaft/-pflicht an Verbraucherschlichtung bewerten
- [ ] falls erforderlich korrekten Hinweis auf zuständige Stelle aufnehmen
- [ ] § 37 VSBG für konkrete nicht beigelegte Streitigkeiten berücksichtigen
- [ ] Ergebnis in `operator-release.json` dokumentieren

### Keine veraltete EU-OS-Plattform verlinken

Die frühere europäische Online-Streitbeilegungsplattform wurde eingestellt. Verordnung (EU) 2024/3228 hob die ODR-Verordnung mit Wirkung zum **20. Juli 2025** auf; neue Beschwerden waren bereits ab **20. März 2025** nicht mehr möglich.

Secret Circle darf daher keinen alten Standardtext mit Link zur früheren EU-OS-Plattform übernehmen. `operator-release.json` verlangt hierfür ausdrücklich `noObsoleteEuOdrLink = true`.

## 8. Urheberrecht, Marken und Drittinhalte

### Built-in Content

- [ ] alle 15 Core-Games redaktionell eigenständig
- [ ] keine kopierten Karten konkurrierender Partyapps
- [ ] keine fremden Logos/Bilder/Audios/Videos
- [ ] keine langen fremden Zitate
- [ ] allgemeine Begriffe nicht als offizielle Partnerschaft darstellen
- [ ] Fan-/Anime-/Popkultur-Inhalte separat inventarisieren

### Extended / Labs

Besonders prüfen:

- Anime-/Fan-Quiz
- bekannte Figuren-/Franchise-Namen
- Musik-/Film-/Serienbezug
- mögliche Marken-/Titelnutzung

`ASSET_RIGHTS_SIGNOFF.md`, `THIRD_PARTY_NOTICES.md` und `FAN_CONTENT_REVIEW.md` bilden den Rechte-Nachweis. Ungeklärte Rechte bleiben Releaseblocker.

## 9. Open-Source-/Third-Party-Lizenzen

Quellseitig bereits vorbereitet:

- [x] `package-lock.json` v3
- [x] Dependency-Inventar für Playwright-Testkette
- [x] `THIRD_PARTY_NOTICES.md`
- [x] Asset-Provenienzmanifest und Audits

Vor RC real:

- [ ] Online-`npm ci` / Integrities auf unverändertem Commit bestätigt
- [ ] finale Produktionsassets auf Herkunft/Lizenz geprüft
- [ ] Icons/Illustrationen/Fonts final dokumentiert
- [ ] keine Assets ohne nachvollziehbare Nutzungsrechte veröffentlicht

## 10. Minderjährige / Altersdarstellung

Die internen Stufen `all` und `teen` sind Produktfilter und **keine gesetzliche oder Store-Altersfreigabe**.

Vor Veröffentlichung:

- [ ] Store-/Plattform-Altersfragebogen anhand finaler Inhalte ausfüllen, falls relevant
- [ ] `CONTENT_AGE_POLICY.md` gegen finalen Content prüfen
- [ ] persönliche/soziale Mechaniken mit Skip/Freiwilligkeit bestätigen
- [ ] keine Werbung/Tracking für Minderjährige hinzufügen ohne neue Rechts-/Privacyprüfung

## 11. Hosting

`HOSTING_DECISION.md` ist der verbindliche Entscheidungsvertrag.

Vor Production dokumentieren:

- [ ] Anbieter und Produkt
- [ ] Region/Standort soweit relevant
- [ ] getrennte HTTPS-Staging-/Production-Origin
- [ ] Server-/Access-Logs
- [ ] Aufbewahrung/Löschkriterien
- [ ] Datenschutz-/Auftragsverarbeitungsrolle
- [ ] Drittlandbezug
- [ ] HTTPS
- [ ] Abuse-/Security-Kontakt
- [ ] Domaininhaber/Anbieterkennzeichnungszuordnung

Ein technisch möglicher Hostingdienst wird nicht allein deshalb rechtlich freigegeben. Erst die reale Provider-/Log-/Privacyprüfung schließt diesen Gate.

## 12. Support und Security Reporting

Vor Release:

- [ ] `SUPPORT.md` mit echtem Kontakt finalisieren
- [ ] Supportpostfach praktisch testen
- [ ] Security-/Privacy-Meldeweg finalisieren
- [ ] Securityroute praktisch testen
- [ ] keine private Schwachstelle öffentlich in Issue-Templates erzwingen
- [ ] Incident-Verantwortung nach `INCIDENT_RESPONSE.md` festlegen
- [ ] Probe-Supportfall durchführen

Die tatsächlichen Werte und Tests werden in `operator-release.json` dokumentiert.

## 13. Incident / Betrieb

Vor Production:

- [ ] Incident Lead festgelegt
- [ ] Engineering Owner festgelegt
- [ ] Support-/Kommunikationsowner festgelegt
- [ ] Legal-/Privacy-Eskalation festgelegt
- [ ] Probe-SEV-1 durchgeführt
- [ ] HTTPS-Staging-Rollback praktisch durchgeführt
- [ ] Nutzerkommunikationsweg bestätigt

Eine Person darf in V1 mehrere Rollen übernehmen; die Verantwortlichkeiten müssen trotzdem eindeutig sein.

## 14. Zentrale Operator-Freigabe

`operator-release.json` startet bewusst mit `PREPARED / BLOCKED`.

`FINAL / READY` ist nur zulässig, wenn:

- reale Betreiber-/Kontaktangaben vorhanden sind
- Hosting und Datenschutz final geprüft sind
- Staging und Production getrennte HTTPS-Origins besitzen
- öffentliche Legal-/Supportflächen final sind
- Support- und Securitywege praktisch getestet wurden
- reale Incident-Verantwortliche feststehen
- Probe-SEV-1 und Rollback-Drill abgeschlossen sind
- DDG/DSGVO/TDDDG/VSBG/Content-/Altersposition final plausibilisiert wurden

`scripts/operator_release_contract_audit.py` schützt diesen Vertrag. Die Release-Evidence-Gates `legalPrivacy` und `supportIncident` dürfen nicht `PASS` sein, solange der Operator-Gate nicht `READY` ist.

## 15. Release-Sign-off

### Muss vor Production `PASS` sein

- [ ] `operator-release.json = FINAL / READY`
- [ ] `scripts/operator_release_contract_audit.py` grün
- [ ] Betreiberangaben final
- [ ] Datenschutzerklärung final auf tatsächliches Hosting angepasst
- [ ] TDDDG-/lokale-Speicher-Bewertung dokumentiert
- [ ] Anbieterkennzeichnung final, soweit erforderlich
- [ ] Supportkontakt real und getestet
- [ ] Rechte-/Lizenzinventar abgeschlossen
- [ ] Fan-/Markenreview abgeschlossen
- [ ] Verbraucherstreitbeilegung aktuell bewertet
- [ ] keine veraltete EU-OS-Plattform verlinkt
- [ ] Monetarisierungsprüfung durchgeführt oder `N/A_V1` bestätigt
- [ ] finaler juristischer Plausibilitätscheck anhand des echten Betreiber-/Release-Modells

Bis dahin: **LEGAL NO_GO**.

## 16. Geprüfte Rechtsquellen – Stand 25. August 2026

Für diesen Prüfkatalog wurden insbesondere aktuelle amtliche/primäre Quellen erneut geprüft:

- Digitale-Dienste-Gesetz (DDG), insbesondere § 5
- Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz (TDDDG), insbesondere § 25
- Datenschutz-Grundverordnung (EU) 2016/679, insbesondere Art. 13
- Verbraucherstreitbeilegungsgesetz (VSBG), insbesondere §§ 36–37
- Verordnung (EU) 2024/3228 zur Einstellung der europäischen Online-Streitbeilegungsplattform

Vor dem Januar-2027-Release werden diese Punkte erneut auf Rechtsänderungen und auf das dann tatsächliche Betreiber-/Hostingmodell geprüft.
