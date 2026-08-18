# Secret Circle – Release-Checkliste Januar 2027

Stand: 18. August 2026

Diese Checkliste muss für den unveränderlichen Release-Commit vollständig ausgefüllt werden. „Technisch spielbar“, „Test vorhanden“ oder „Dokument vorhanden“ ersetzt keine Freigabe.

## 1. Repository und CI

- [ ] Release-Commit und Tag festgelegt
- [ ] `npm run ci` vollständig grün
- [ ] Chromium, Firefox und WebKit vollständig grün
- [ ] sichtbare GitHub-Actions-Schritte inklusive Checkout vorhanden
- [ ] Actions-Runner, Minutenbudget und Richtlinien funktionieren
- [ ] reproduzierbares `package-lock.json` vorhanden
- [ ] CI verwendet `npm ci`
- [ ] Branch Protection und verpflichtende Checks aktiv
- [ ] keine generierten Logs, temporären Dateien oder großen unbekannten Assets committed
- [ ] `scripts/reference_content_audit.py` auf exakt dem Release-Commit tatsächlich grün
- [ ] `scripts/asset_provenance_audit.py` auf exakt dem Release-Commit tatsächlich grün
- [ ] `scripts/public_release_placeholder_audit.py` auf exakt dem Release-Commit tatsächlich grün

## 2. Engine- und Sitzungsintegrität

- [ ] Word-Imposter-Rollen sind unabhängig von der Aufdeckreihenfolge
- [ ] Creator, Quick, Mega und Viral verwenden direkt `session-ledger.js`
- [ ] direkte Hub-Abschlüsse verwenden `session-ledger.js`
- [ ] jede neue Ledger-Session besitzt genau eine stabile Session-ID
- [ ] ältere schnelle aktive Sessions ohne ID werden deterministisch migriert
- [ ] Verlauf, `plays`, Runden und Bestwert werden pro Session höchstens einmal aktualisiert
- [ ] Reload zwischen Hub-Speicherung und Sessionbereinigung erzeugt keine Doppelzählung
- [ ] fehlgeschlagene Sessionbereinigung stellt den letzten aktiven Zustand wieder her
- [ ] direkte Hub-Sessions verwenden `secret-circle-party-hub-active-v1`
- [ ] direkte Hub-Session speichert einen stabilen Spieler-Snapshot
- [ ] beschädigter direkter Hub-Spielstand wird sicher verworfen
- [ ] direkte Hub-Wiederaufnahme erfolgt explizit und öffnet keine privaten Inhalte automatisch
- [ ] verworfener Hub-Spielstand erzeugt keinen Verlauf und keine Statistik
- [ ] **Beenden & speichern** und **Abbrechen & verwerfen** sind im direkten Hub eindeutig getrennt
- [ ] bestätigter Hub-Abbruch und Escape schreiben weder Verlauf noch Statistik
- [ ] globales Hub-Überspringen vergibt keinen Punkt und wechselt sauber zur nächsten Runde/Person
- [ ] ein bewusst gespeicherter bereits gestarteter Timerdurchgang verliert keine erzielten Treffer
- [ ] Advanced Runner und PWA-Update-Schutz verwenden beide `secret-circle-party-active-v1`
- [ ] Advanced-Abschluss mit derselben Session-ID kann Verlauf und Statistik nicht doppelt erhöhen
- [ ] private Advanced-Reveal-Zustände werden nach Reload wieder verdeckt
- [ ] Mafia-Moderatorübersicht erfordert nach Reload erneut bewusste Bestätigung
- [ ] kein globales `Storage.prototype`- oder Engine-Monkey-Patching vorhanden
- [ ] alle Resume-, Unterbrechungs- und Abschlusswege geprüft

## 3. 15 Kernspiele

Für jedes Kernspiel separat dokumentieren:

- [ ] Start und Spielerlobby funktionieren
- [ ] Regeln werden in höchstens vier klaren Schritten erklärt
- [ ] Packauswahl ist gültig und verständlich
- [ ] Überspringen funktioniert, wo Inhalte unangenehm oder unpassend sein können
- [ ] persönliche Inhalte kommunizieren Freiwilligkeit vor der Antwort
- [ ] Pause beziehungsweise sichere Unterbrechung funktioniert
- [ ] Abbruch/Verlassen ist eindeutig und löscht nicht versehentlich andere Daten
- [ ] Wiederholen und nächstes Spiel sind verständlich, wo vorgesehen
- [ ] Timer über App-Wechsel, Hintergrund und Reload geprüft
- [ ] Punkte- und Siegerlogik dokumentiert
- [ ] Statistik und Verlauf korrekt
- [ ] Tastatur, sichtbarer Fokus, Zoom und Reduced Motion geprüft
- [ ] reale Gruppe hat das Spiel ohne Entwicklerhilfe abgeschlossen

Zusätzliche Kernspielverträge:

- [ ] Scharade friert ihren 60-Sekunden-Timer während Pause ein
- [ ] Scharade stellt Restzeit, Rundentreffer und aktuelle Karte nach Reload pausiert wieder her
- [ ] Tabu läuft als 60-Sekunden-Runde mit Trefferzählung
- [ ] Tabu pausiert und stellt Restzeit, Rundentreffer, Begriff und verbotene Wörter nach Reload wieder her
- [ ] Tabu-Begriff überspringen verändert den Punktestand nicht
- [ ] Heiße Kartoffel pausiert den Zufallstimer ohne Offenlegung der Restzeit
- [ ] Heiße Kartoffel stellt dieselbe interne Zufallsrestzeit nach Reload pausiert wieder her
- [ ] Wortkette friert ihren 30-Sekunden-Timer während Pause ein
- [ ] Wortkette stellt Buchstabe und Restzeit nach Reload pausiert wieder her
- [ ] Paranoia öffnet eine private Frage nach Reload nicht automatisch erneut
- [ ] Zwei Wahrheiten: private Eingabe, Mischung, Abstimmung und Reload geprüft
- [ ] Question Imposter: private Reveal-Kette bleibt über Reload geschützt
- [ ] Location Spy: Ort und Spion bleiben über Reload geschützt
- [ ] Mafia: skalierte Mafiaanzahl für 6–20 Personen geprüft
- [ ] Mafia-Packs Schnell/Klassisch/Erweitert erzeugen die vorgesehenen Rollen
- [ ] Mafia-Erweitert: Arzt, Detektiv und Beschützer-Nachtaktionen geprüft
- [ ] Beschützer kann dieselbe Person nicht zwei Nächte hintereinander schützen

## 4. Party Hub und Suche

- [ ] 15 Kernspiele, 13 Erweiterungen und 17 Labs korrekt gekennzeichnet
- [ ] Startseite kommuniziert Party-Hub-Tiefe statt nur „offline/ein Gerät“
- [ ] Alters- und Reifestufenfilter arbeiten gemeinsam
- [ ] Suche, Filter und letzte Ansicht werden korrekt gespeichert
- [ ] direkte URL-Ansicht hat Vorrang vor gespeichertem Zustand
- [ ] Filterreset stellt sichere Standards wieder her
- [ ] blockierter und voller lokaler Speicher werden verständlich gemeldet
- [ ] Synonyme und bekannte alternative Spielnamen geprüft
- [ ] typische Tippfehler liefern sinnvolle, begrenzte Vorschläge
- [ ] Suchvorschläge funktionieren mit Maus, Touch, Pfeiltasten, Enter und Escape
- [ ] Screenreader erkennt Listbox und aktiven Vorschlag
- [ ] leere Ergebnisse erklären die nächste Aktion
- [ ] direkte Hub-Session über vollständigen Reload besitzt den dokumentierten sicheren Resume-Vertrag
- [ ] Spielsteuerung besitzt auf kleinen Smartphones mindestens 44-Pixel-Touchziele
- [ ] Fokus landet nach Runden-/Reveal-Wechseln auf einer sinnvollen nächsten Aktion

## 5. Backup und lokale Daten

- [ ] `backup-schema-registry.js` steht auf dem freigegebenen dokumentierten Vertrag
- [ ] `backup-schema-registry.js` wird im Hub vor `party-data-tools.js` geladen
- [ ] Word-Imposter-, Gesamt- und Creator-Backup entsprechen `BACKUP_SCHEMAS.md`
- [ ] Complete-Runtime dupliziert Format-/Größenlimits nicht außerhalb der Registry
- [ ] UTF-8-Dateigrenze von 1.500.000 Bytes wird überall eingehalten
- [ ] beschädigte, falsche und neuere unbekannte Formate werden sicher abgelehnt
- [ ] unbekannte `secret-circle-*`-Storage-Key-Familien werden beim Complete-Import abgelehnt
- [ ] gültige versionierte Word-Imposter-Keys werden akzeptiert
- [ ] gültige versionierte `secret-circle-party-*`-Keys werden akzeptiert
- [ ] Import validiert vollständig vor dem ersten Schreibvorgang
- [ ] Quota-Fehler lösen einen Rollback aus
- [ ] Export lässt sich wieder erfolgreich importieren
- [ ] Gesamtsicherung enthält relevante aktive Hub- und Advanced-Sessions
- [ ] vollständiges Löschen entfernt auch alte/verwaiste Secret-Circle-Keys
- [ ] Löschung und Wiederherstellung auf mindestens zwei Browsern geprüft

## 6. PWA und Offline – v41

- [ ] finaler Cache ist **`secret-circle-v41`** und Staging-Cache **`secret-circle-v41-staging`**
- [ ] Cache-/Stagingname stimmt in Service Worker, Test, Architektur, Deployment, Privacy und Environment überein
- [ ] normaler Browserstart online
- [ ] installierte PWA online
- [ ] Offline-Neustart nach vorheriger Installation
- [ ] alle Kernseiten offline erreichbar
- [ ] Backup-Registry offline verfügbar
- [ ] `party-expansion.js`, `party-mega-catalog.js` und `party-viral-catalog.js` offline verfügbar
- [ ] beide Core-Contentmodule offline verfügbar
- [ ] alle vier schnellen Enginefamilien offline startbar
- [ ] direkte Hub- und Advanced-Kernspiele offline startbar und wiederaufnehmbar
- [ ] Release-Tiers, Filterzustand und Suchhilfe offline verfügbar
- [ ] Query-Routen wie `quick-play.html?game=...` offline korrekt
- [ ] neue Version wird zuerst vollständig im Staging-Cache vorbereitet
- [ ] keine automatische Aktivierung mitten in einer laufenden Session
- [ ] direkte Hub-Session wird vom Update-Schutz erkannt
- [ ] Advanced-Session wird vom Update-Schutz erkannt
- [ ] sichtbarer Hinweis „Jetzt aktualisieren“ / „Später“
- [ ] aktiver Offline-Core bleibt bei fehlgeschlagener Promotion erhalten
- [ ] Update von mindestens zwei älteren Cacheversionen auf v41 getestet
- [ ] Rollbackdeployment mit neuer Cachegeneration getestet

## 7. Accessibility und Geräte

- [ ] `tests/accessibility-contract.test.js` tatsächlich grün
- [ ] `tests/e2e/accessibility-core.spec.js` tatsächlich grün
- [ ] Chromium-/Cross-Browser-A11y-relevante E2E-Flows grün
- [ ] aktuelles Android mit Chrome
- [ ] aktuelles iPhone mit Safari
- [ ] Tablet beziehungsweise iPad
- [ ] Smartphone Hoch- und Querformat
- [ ] kleine Displaybreite / Reflow bei 320 CSS px
- [ ] 200-Prozent-Zoom
- [ ] vollständige Tastaturbedienung
- [ ] sichtbarer Fokus
- [ ] VoiceOver-Smoke-Test
- [ ] TalkBack-Smoke-Test
- [ ] private Reveal-Flows mit Screenreader bewusst geprüft
- [ ] Touchziele mindestens 44 × 44 Pixel
- [ ] Safe Areas und Bildschirmtastatur auf iOS
- [ ] Reduced Motion
- [ ] Kontrast und Status nicht nur durch Farbe
- [ ] Timerverhalten bei realem App-Wechsel und Sperrbildschirm dokumentiert

## 8. Inhalte, Referenzen und Recht

### Core-/Altersqualität

- [ ] `CORE_CONTENT_REVIEW.md`: 15/15 erster Core-Quellpass abgeschlossen
- [ ] jedes Kernspiel in realer Gruppe redaktionell beobachtet
- [ ] semantisch doppelte, schwache und missverständliche Karten entfernt
- [ ] Altersstufen konsistent
- [ ] sensible Fragen können übersprungen werden
- [ ] familienfreundliche Standardauswahl geprüft

### Physischer Source-/Referenzvertrag

- [ ] `party-core-classic-content.js` ist auf **Version 4**
- [ ] `party-mega-catalog.js` enthält keine der früheren 40 konkreten Anime-Figuren
- [ ] `anime-guess` erscheint als **Anime-Archetypen erraten** mit vier generischen 10er-Packs
- [ ] stabile technische ID `wavelength` bleibt erhalten, sichtbarer Titel ist upstream **Spektrum-Tipp**
- [ ] ausgelieferter sichtbarer Content enthält den alten Namen `Wellenlänge` nicht
- [ ] Browser-Tabu enthält upstream `Tab` und nicht `Chrome`
- [ ] Emoji-Quiz enthält `🦁🌾 → Löwe` und nicht `Löwenkönig`
- [ ] drei entfernte olympisch/Grand-Slam-spezifische Viral-Texte sind nicht zurückgekehrt
- [ ] `scripts/reference_content_audit.py` tatsächlich grün
- [ ] finaler manueller Extended-/Labs-Semantikpass abgeschlossen
- [ ] Marketingtexte suggerieren keine offizielle Partnerschaft/Verbindung zu Fremdmarken
- [ ] keine fremden Logos, Screenshots, Charakterbilder, Audios oder Videos ohne belegte Rechte
- [ ] keine fremden Slogans oder längeren geschützten Zitate im Releasebuild

### Assets / Legal

- [ ] `assets/manifests/asset-provenance.json` deckt alle gebündelten Releaseassets ab
- [ ] kein Releaseasset steht auf `unresolved`
- [ ] `icon.svg` Herkunft/Rechtebasis belegt
- [ ] `icon-192.png` Herkunft/Ableitung belegt
- [ ] `icon-512.png` Herkunft/Ableitung belegt
- [ ] `LEGAL_CHECKLIST.md` mit echtem Betreiber-/Release-Modell abgearbeitet
- [ ] Datenschutzerklärung auf tatsächliches Hosting angepasst
- [ ] Impressum beziehungsweise notwendige Betreiberangaben final, falls erforderlich
- [ ] TDDDG-/lokale-Speicher-Bewertung final
- [ ] Verbraucherstreitbeilegung aktuell bewertet
- [ ] kein veralteter Link zur eingestellten EU-OS-Plattform verwendet
- [ ] Support- und Sicherheitskontakt final
- [ ] Lizenz und Drittanbieterhinweise final
- [ ] Projekt-/Quellcodelizenz bewusst entschieden, falls Quellcode öffentlich verteilt wird

## 9. Reale Gruppentests

- [ ] mindestens ein Test mit 3–4 Personen
- [ ] mindestens ein Test mit 5–8 Personen
- [ ] mindestens ein Test mit 9–12 Personen
- [ ] großer Word-Imposter-Test mit mehreren Impostern
- [ ] Mafia-Test mit mindestens 8 Personen und mehreren Mafia-Rollen
- [ ] mindestens drei vollständige Smart-Party-Night-Abende
- [ ] Creator-Spiel von unerfahrenen Nutzern erstellt und gespielt
- [ ] beobachtete Fehler nach Schweregrad dokumentiert
- [ ] keine offenen kritischen oder hohen Fehler

## 10. Support, Incident und Wartung

- [ ] `SUPPORT.md`: echter erreichbarer Kontakt statt `TBD`
- [ ] Probe-Supportfall vollständig durchgespielt
- [ ] Security-/Privacy-Meldeweg festgelegt
- [ ] `INCIDENT_RESPONSE.md`: Incident Lead/Owner real festgelegt
- [ ] Probe-SEV-1 durchgespielt
- [ ] Nutzerkommunikationsweg im Incidentfall festgelegt
- [ ] `MAINTENANCE.md`: Verantwortliche für Updates bekannt
- [ ] Changelog-/Hotfix-/Dependencyroutine festgelegt
- [ ] Rollbackprobe auf HTTPS-Staging durchgeführt

## 11. Veröffentlichung

- [ ] Produktionsdeployment über HTTPS
- [ ] konkrete getrennte Staging- und Production-Origin dokumentiert
- [ ] finale Versionsnummer und Cacheversion **v41 oder bewusst neuer**
- [ ] finale Icons und Screenshots samt Herkunft/Nutzungsrechten
- [ ] öffentlicher Placeholder-Audit grün; keine Dummy-/Beispieldaten in öffentlicher Runtime
- [ ] Release Notes und Changelog vollständig
- [ ] unveränderlicher Release-Tag
- [ ] Installation und Offlinebetrieb nach Deployment erneut geprüft
- [ ] Supportkanal und Hotfixprozess aktiv

## Freigabe

- Release-Commit: ____________________
- Release-Tag: ____________________
- Datum: ____________________
- getestete Geräte: ____________________
- offene mittlere/niedrige Risiken: ____________________
- technische Freigabe: ____________________
- Produkt-/Inhaltsfreigabe: ____________________
- Accessibility-Freigabe: ____________________
- Legal-/Betriebsfreigabe: ____________________

**Keine Veröffentlichung**, solange GitHub Actions keine belastbaren Repository-Schritte ausführt, Kern-CI/Cross-Browser-/Reference-Source-Gates nicht tatsächlich grün sind, kritische beziehungsweise hohe Fehler offen sind, Asset-/Rechte-/Accessibility-/Legal-/Betriebs-Gates nicht finalisiert sind oder Kernspiele nicht mit realen Gruppen getestet wurden.
