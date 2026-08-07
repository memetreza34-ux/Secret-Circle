# Secret Circle – Release-Checkliste Januar 2027

Diese Checkliste muss für den unveränderlichen Release-Commit vollständig ausgefüllt werden. „Technisch spielbar“ ersetzt keine Freigabe.

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

## 5. Backup und lokale Daten

- [ ] Word-Imposter-, Gesamt- und Creator-Backup entsprechen `BACKUP_SCHEMAS.md`
- [ ] UTF-8-Dateigrenze von 1.500.000 Bytes wird überall eingehalten
- [ ] beschädigte, falsche und neuere unbekannte Formate werden sicher abgelehnt
- [ ] Import validiert vollständig vor dem ersten Schreibvorgang
- [ ] Quota-Fehler lösen einen Rollback aus
- [ ] Export lässt sich wieder erfolgreich importieren
- [ ] Gesamtsicherung enthält aktive Hub- und Advanced-Sessions
- [ ] Löschen nennt exakt die betroffenen lokalen Daten
- [ ] Löschung und Wiederherstellung auf mindestens zwei Browsern geprüft

## 6. PWA und Offline

- [ ] normaler Browserstart online
- [ ] installierte PWA online
- [ ] Offline-Neustart nach vorheriger Installation
- [ ] alle Kernseiten offline erreichbar
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
- [ ] Update von mindestens zwei älteren Cacheversionen getestet
- [ ] Rollbackdeployment getestet

## 7. Accessibility und Geräte

- [ ] aktuelles Android mit Chrome
- [ ] aktuelles iPhone mit Safari
- [ ] Tablet beziehungsweise iPad
- [ ] Smartphone Hoch- und Querformat
- [ ] kleine Displaybreite
- [ ] 200-Prozent-Zoom
- [ ] vollständige Tastaturbedienung
- [ ] sichtbarer Fokus
- [ ] Screenreader-Smoke-Test
- [ ] Touchziele mindestens 44 × 44 Pixel
- [ ] Safe Areas und Bildschirmtastatur auf iOS
- [ ] Reduced Motion
- [ ] Kontrast und Status nicht nur durch Farbe
- [ ] Timerverhalten bei realem App-Wechsel und Sperrbildschirm dokumentiert

## 8. Inhalte und Recht

- [ ] jedes Kernspiel redaktionell geprüft
- [ ] doppelte, schwache und missverständliche Karten entfernt
- [ ] Altersstufen konsistent
- [ ] sensible Fragen können übersprungen werden
- [ ] familienfreundliche Standardauswahl geprüft
- [ ] Fan-, Marken- und urheberrechtlich sensible Inhalte separat bewertet
- [ ] keine unzulässigen Bilder, Logos, langen Zitate oder Audios enthalten
- [ ] Datenschutzerklärung final
- [ ] Impressum beziehungsweise notwendige Betreiberangaben final
- [ ] Support- und Sicherheitskontakt final
- [ ] Lizenz und Drittanbieterhinweise final

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

## 10. Veröffentlichung

- [ ] Produktionsdeployment über HTTPS
- [ ] finale Versionsnummer und Cacheversion
- [ ] finale Icons und Screenshots
- [ ] Release Notes und Changelog vollständig
- [ ] unveränderlicher Release-Tag
- [ ] Installation und Offlinebetrieb nach Deployment erneut geprüft
- [ ] Supportkanal und Hotfixprozess vorbereitet

## Freigabe

- Release-Commit: ____________________
- Release-Tag: ____________________
- Datum: ____________________
- getestete Geräte: ____________________
- offene mittlere/niedrige Risiken: ____________________
- technische Freigabe: ____________________
- Produkt-/Inhaltsfreigabe: ____________________

**Keine Veröffentlichung**, solange GitHub Actions keine sichtbaren Schritte ausführt, Kern-CI oder Cross-Browser-Tests rot sind, kritische beziehungsweise hohe Fehler offen sind oder Kernspiele nicht mit realen Gruppen getestet wurden.
