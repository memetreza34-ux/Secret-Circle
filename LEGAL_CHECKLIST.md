# Secret Circle – Legal- und Veröffentlichungscheckliste

Stand: 16. August 2026  
Status: **PREPARED – Betreiberangaben und finale Rechtsprüfung offen**

> Dieses Dokument ist ein technischer Release- und Prüfkatalog, keine individuelle Rechtsberatung. Vor öffentlicher oder kommerzieller Veröffentlichung müssen die tatsächliche Betreiberform, Hostingroute, Monetarisierung und Zielgruppe anhand des dann aktuellen Rechts geprüft werden.

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

### Vor Release zwingend klären

- [ ] tatsächliche verantwortliche natürliche/juristische Person festlegen
- [ ] ladungsfähige Anschrift festlegen
- [ ] funktionsfähige E-Mail-/Kontaktmöglichkeit festlegen
- [ ] Rechtsform und Vertretungsberechtigte angeben, falls juristische Person
- [ ] Register und Registernummer angeben, falls vorhanden/relevant
- [ ] USt-IdNr./Wirtschafts-IdNr. angeben, falls vorhanden und gesetzlich erforderlich
- [ ] prüfen, ob weitere berufs-/aufsichtsrechtliche Angaben erforderlich sind

§ 5 DDG verlangt für geschäftsmäßige, in der Regel gegen Entgelt angebotene digitale Dienste leicht erkennbare, unmittelbar erreichbare und ständig verfügbare Anbieterinformationen. Ob und in welchem Umfang Secret Circle im konkreten Betreiber-/Veröffentlichungsmodell darunter fällt, wird vor Production final geprüft.

**Release-Regel:** Kein öffentliches GO mit Platzhaltern wie `TBD`, Fantasieadressen oder nicht überwachten E-Mail-Adressen.

## 3. Datenschutz / DSGVO

`privacy.html` bildet derzeit die technische Datenrealität ab: kein Konto, kein Tracking, kein eigener Spielserver, lokale Speicherung.

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

- [ ] Legal-/Impressumsseite mit finalen Betreiberangaben erstellen, falls erforderlich
- [ ] Link von jeder zentralen öffentlichen Seite leicht erreichbar machen
- [ ] Datenschutz ebenso leicht erreichbar halten
- [ ] Supportkontakt konsistent zu `SUPPORT.md` halten
- [ ] keine Legal-Seite nur im installierten/offline Zustand verstecken

## 6. Verbraucherrecht / Monetarisierung

V1 ist aktuell ohne Bezahlfunktion geplant. Falls später Abos, Einmalkauf, In-App-Käufe, Werbung oder kostenpflichtige Premiumfunktionen hinzukommen, vor Implementierung separat prüfen:

- Preise und Gesamtpreis
- Vertragslaufzeit/Kündigung
- Widerrufsrecht und Ausnahmen bei digitalen Inhalten/Dienstleistungen
- Bestellbutton-/Informationspflichten
- App-Store-Zahlungs-/Erstattungsregeln
- Minderjährige und Einwilligungs-/Geschäftsfähigkeitsfragen
- Steuer-/Rechnungsanforderungen
- Plattformbedingungen

Monetarisierung gilt daher als **Architecture/Legal Change**, nicht als reine UI-Änderung.

## 7. Verbraucherstreitbeilegung

Das VSBG enthält je nach Unternehmenssituation Informationspflichten zur Bereitschaft/Verpflichtung zur Teilnahme an Verbraucherschlichtung. § 36 VSBG enthält zudem eine Ausnahme von einer bestimmten allgemeinen Informationspflicht für Unternehmer, die am 31. Dezember des Vorjahres zehn oder weniger Personen beschäftigt haben; andere Pflichten können trotzdem relevant sein.

Vor Release/Monetarisierung:

- [ ] tatsächliche Unternehmereigenschaft und Beschäftigtenzahl prüfen
- [ ] Teilnahmebereitschaft/-pflicht an Verbraucherschlichtung bewerten
- [ ] falls erforderlich korrekten Hinweis auf zuständige Stelle aufnehmen
- [ ] § 37 VSBG für Streitigkeiten nach Entstehen einer Verbrauchervertragsstreitigkeit berücksichtigen

### Wichtig: keine veraltete EU-OS-Plattform verlinken

Die frühere europäische Online-Streitbeilegungsplattform wurde eingestellt; die zugrunde liegende ODR-Verordnung wurde mit Wirkung zum **20. Juli 2025** aufgehoben. Secret Circle darf daher keinen alten Standardtext mit Link zur früheren EU-OS-Plattform übernehmen.

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

`privacy.html` stellt Fan-Inhalte bereits als inoffiziell dar; das ersetzt keine finale Rechteprüfung.

## 9. Open-Source-/Third-Party-Lizenzen

Vor RC:

- [ ] `package-lock.json` erzeugen und Dependency-Inventar erstellen
- [ ] Lizenz von `@playwright/test` und jeder weiteren Dependency dokumentieren
- [ ] Produktionsassets auf Herkunft/Lizenz prüfen
- [ ] Icons/Illustrationen/Fonts dokumentieren
- [ ] keine Assets ohne nachvollziehbare Nutzungsrechte veröffentlichen
- [ ] falls erforderlich `THIRD_PARTY_NOTICES.md` erstellen

## 10. Minderjährige / Altersdarstellung

Die internen Stufen `all` und `teen` sind Produktfilter und **keine gesetzliche oder Store-Altersfreigabe**.

Vor Veröffentlichung:

- [ ] Store-/Plattform-Altersfragebogen anhand finaler Inhalte ausfüllen
- [ ] `CONTENT_AGE_POLICY.md` gegen finalen Content prüfen
- [ ] persönliche/soziale Mechaniken mit Skip/Freiwilligkeit bestätigen
- [ ] keine Werbung/Tracking für Minderjährige hinzufügen ohne neue Rechts-/Privacyprüfung

## 11. Hosting

Vor Production dokumentieren:

- [ ] Anbieter
- [ ] Region/Standort soweit relevant
- [ ] Server-/Access-Logs
- [ ] Aufbewahrung
- [ ] Datenschutz-/Auftragsverarbeitungsrolle
- [ ] HTTPS
- [ ] Abuse-/Security-Kontakt
- [ ] Domaininhaber/Impressumszuordnung

GitHub Pages ist technisch möglich, aber erst nach finaler Hosting-/Datenschutzbewertung freizugeben.

## 12. Support und Security Reporting

Vor Release:

- [ ] `SUPPORT.md` mit echtem Kontakt finalisieren
- [ ] Security-Meldeweg finalisieren
- [ ] keine private Schwachstelle öffentlich in Issue-Templates erzwingen
- [ ] Incident-Verantwortung nach `INCIDENT_RESPONSE.md` festlegen

## 13. Release-Sign-off

### Muss vor Production `PASS` sein

- [ ] Betreiberangaben final
- [ ] Datenschutzerklärung final auf tatsächliches Hosting angepasst
- [ ] TDDDG-/lokale-Speicher-Bewertung dokumentiert
- [ ] Impressum/Anbieterkennzeichnung final, soweit erforderlich
- [ ] Supportkontakt real und getestet
- [ ] Rechte-/Lizenzinventar abgeschlossen
- [ ] Fan-/Markenreview abgeschlossen
- [ ] Verbraucherstreitbeilegung aktuell bewertet
- [ ] keine veraltete EU-OS-Plattform verlinkt
- [ ] Monetarisierungsprüfung durchgeführt oder `N/A V1` bestätigt
- [ ] finaler juristischer Plausibilitätscheck anhand des echten Betreiber-/Release-Modells

Bis dahin: **LEGAL NO_GO**.

## 14. Geprüfte Rechtsquellen – Stand 16. August 2026

Für diesen Prüfkatalog wurden insbesondere aktuelle amtliche/primäre Quellen herangezogen:

- Digitale-Dienste-Gesetz (DDG), insbesondere § 5
- Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz (TDDDG), insbesondere § 25
- Datenschutz-Grundverordnung (EU) 2016/679, insbesondere Art. 13
- Verbraucherstreitbeilegungsgesetz (VSBG), insbesondere §§ 36–37
- Verordnung (EU) 2024/3228 zur Einstellung der europäischen Online-Streitbeilegungsplattform

Vor dem Januar-2027-Release werden diese Punkte erneut auf Rechtsänderungen geprüft.
