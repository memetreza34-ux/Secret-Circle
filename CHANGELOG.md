# Änderungsverlauf

## In Entwicklung – Party-Hub-Erweiterung

### Hinzugefügt

- installierter PWA-Einstieg öffnet den Party Hub
- 22 sichtbare Spiele, davon 18 spielbar und 4 gesperrt geplant
- Suche und Filter nach Art, Stimmung, Gruppengröße, Altersstufe und Status
- gemeinsame lokale Spieler, Host-Presets, Favoriten und zuletzt gespielt
- Verlauf, Statistik und acht Erfolge
- komplexe Spielabläufe für Zwei Wahrheiten, Question Imposter, Location Spy und Mafia
- wiederaufnehmbare Sessions mit 3, 5, 10 oder 20 Runden
- eigene Hub-Kategorien für kompatible Frage-, Darstellungs- und Schnellspiele
- Gesamtexport für Hub, Party Night, eigene Packs, aktive Sessions und Word Imposter
- Offline-Core `secret-circle-v25`
- Regressionstests für Spieler-Snapshot, Speicherfehler, Mehrbyte-Dateien, Party Night und Rollback

### Smart Party Night

- neuer lokaler Partyabend-Planer Version 1
- Zeitbudgets mit 15, 30, 45, 60 und 90 Minuten
- Stimmungen: gemischt, lustig, Wettkampf, tiefer, Chaos, clever und locker
- automatische Filterung nach gespeicherter Gruppengröße und Altersstufe
- Favoriten werden bevorzugt
- zuletzt gespielte Titel werden nach Möglichkeit vermieden
- unterschiedliche Spielarten werden für mehr Abwechslung kombiniert
- kurze Spiele werden als Einstieg priorisiert
- Wettkampf- und Chaosspiele können als Abschluss priorisiert werden
- jede Station zeigt Grund, Spielart und ungefähre Dauer
- Stationen können geöffnet, erledigt oder übersprungen werden
- Ablauf und Fortschritt bleiben nach Neuladen erhalten
- Plan kann fortgesetzt, neu erzeugt oder gelöscht werden
- Party-Night-Daten verwenden den lokalen Schlüssel `secret-circle-party-night-v1`

### Design und Informationsarchitektur

- Party-Night-Bereich direkt unter dem Startseiten-Hero
- Hero erhält eine kontextabhängige Aktion zum Planen oder Fortsetzen
- sechs Navigationspunkte werden auf Desktop korrekt als sechs Spalten dargestellt
- neue responsive Timeline mit aktuellem, erledigtem und übersprungenem Zustand
- sichtbarer Fortschrittsbalken
- mobil optimierte Einspaltensteuerung
- stärkere Fokuszustände für Spielkarten und kompakte Zeilen
- Reduced-Motion-Unterstützung
- Design und Logik bleiben in `party-night.css` und `party-night.js` getrennt wartbar

### Verbesserte Session-Sicherheit

- aktives erweitertes Session-Schema auf Version 2 gehärtet
- jede gestartete komplexe Session speichert ihre eigene Spielergruppe
- Änderungen an der gemeinsamen Lobby verändern keine laufende Session
- alte aktive Sessions werden kontrolliert migriert
- ungültige Spielerzahl, Packzuordnung oder Rundenzahl wird abgelehnt
- eindeutige Session- und Historien-ID verhindert doppelte Abschlüsse
- Verlauf und Statistik werden vor dem Schließen transaktionssicher gespeichert
- ein Speicherfehler lässt die Session aktiv und erneut speicherbar

### Verbesserte eigene Hub-Kategorien

- Unicode-Normalisierung verhindert visuell gleiche Duplikate
- doppelte Karten, Packnamen und gespeicherte IDs werden bereinigt
- Speichern und Löschen verwenden eine lokale Transaktion
- In-Memory-Katalog und lokaler Speicher bleiben bei Fehlern synchron
- simulierbare Speicheradapter ermöglichen Unit-Tests für Rollback
- maximal 20 Packs und 100 Karten bleiben erzwungen

### Verbesserte Datensicherung

- Datenwerkzeug auf Version 2 erhöht
- Sicherungsgröße wird als tatsächliche UTF-8-Byte-Größe geprüft
- Mehrbyte-Zeichen können die 1,5-MB-Grenze nicht umgehen
- `File.size` wird vor dem vollständigen Einlesen geprüft
- einzelne Werte besitzen eine eigene Byte-Grenze
- Import schreibt alle Datensätze vollständig oder stellt den vorherigen Zustand wieder her
- ein fehlgeschlagener Rollback wird gesondert gemeldet
- vollständige Löschung nutzt dieselbe Transaktions- und Rollback-Logik
- Party-Night-Fortschritt wird automatisch mitgesichert und gelöscht

### Verbesserte Einstellungen und Statistiken

- Hub-Plus auf Version 5 erhöht
- fehlgeschlagene Präferenz-Speicherung wird abgefangen und sichtbar gemeldet
- aktuelle Altersauswahl bleibt trotz Speicherfehler nutzbar
- negative, ungültige und unbekannte Statistikwerte werden sicher normalisiert
- fehlgeschlagene Statistikreparatur blockiert die App nicht
- Fallback für Browser ohne `CSS.escape`

### Behoben

- Desktop-Navigation verwendete fünf Spalten für sechs Navigationspunkte
- laufende komplexe Sessions wechseln nach einer Lobbyänderung nicht mehr unbemerkt die Personen
- Rollen, Fragen und aktive Person bleiben an die ursprüngliche Spielergruppe gebunden
- fehlgeschlagene Hub-Speicherung löscht keinen abgeschlossenen Sessionfortschritt
- wiederholter Abschluss erzeugt keinen doppelten Verlaufseintrag
- ein fehlgeschlagenes eigenes Pack verändert den Katalog nicht mehr teilweise
- ein fehlgeschlagenes Löschen eines Packs entfernt es nicht mehr nur aus dem Arbeitsspeicher
- Importfehler hinterlassen keine absichtlich akzeptierten gemischten alten und neuen Daten
- Löschfehler stellen vorherige lokale Daten wieder her
- falsche Zeichenzählung bei Sicherungen mit Umlauten oder anderen Mehrbyte-Zeichen
- Präferenz- und Statistik-Speicherfehler erzeugen keinen unbehandelten Laufzeitfehler

### Qualität

- 9 Unit-Testdateien
- mindestens 20 Playwright-E2E-Suiten
- eigener Unit-Test für Planung, Filterung, Fortschritt und Speicherfehler
- eigene E2E-Suite für Party-Night-Erstellung, Filter, Spielöffnung, Abschluss, Löschung und Neuladen
- Offline- und Runtime-Tests prüfen `party-night.js` und `party-night.css`
- Chromium-, Firefox-, WebKit-, Android- und iPhone-Projekte
- Strukturvalidator prüft HTML, CSP, Assets, Scriptreihenfolge, Manifest, Icons, Cache, Party Night, Katalog und Speichertransaktionen
- Release-Audit prüft Player-Snapshot, Party Night, Pack-Rollback, byte-sicheren Import und Dokumentation
- GitHub Actions bleibt durch einen externen Fehler vor dem ersten Schritt blockiert

### Noch offen

- vollständig erfolgreicher lokaler Testlauf
- grüner GitHub-Actions-Lauf
- reale Android-, iPhone-/iPad- und PWA-Update-Prüfung
- reale Party-Night-Tests mit allen Zeitbudgets
- reale Partytests mit kleinen und großen Gruppen
- Test aller 18 Spiele und eines eigenen Packs
- redaktionelle Alters-, Schwierigkeits- und Inhaltsprüfung
- öffentliche Betreiber-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben

## 1.0.0-beta.3 – 2026-08-04

### Hinzugefügt

- vollständiger Word-Imposter-Karten-, Diskussions-, Abstimmungs-, Rate- und Ergebnisablauf
- Punkte, Rangliste, Mehr-Runden-Matches und begrenzte Stichwahl
- maximal sechs Imposter
- unabhängige deterministische Rollenverteilung
- 14 Kategorien mit 168 Begriff-Hinweis-Paaren
- deadline-basierter Timer mit Hintergrund- und Neulade-Wiederherstellung
- automatische Kartenverdeckung und Wake Lock
- versionierte Speicherung, Migration, Sicherung und lokale Löschung
- Content Security Policy, Laufzeit-Fehlerschutz und PWA-Icons

### Behoben

- Kopplung der Imposter an die ersten Positionen der Aufdeckreihenfolge
- mehr als sechs Imposter
- endlose Stichwahlen
- doppelte Stimmen und Selbstwahl
- Timerabweichungen nach Hintergrundbetrieb oder Neuladen
- fehlende Verlaufseinträge bei direkt beendeten Runden
- unvollständige Migration älterer Spielstände

### Sicherheit und Datenschutz

- keine Anmeldung, Analyse-, Werbe- oder Tracking-Dienste
- keine appgesteuerte Übertragung von Spieldaten
- restriktive Ressourcen- und Skriptrichtlinie
- sichere Textausgabe dynamischer Inhalte
- Größenbegrenzung und Rollback für Sicherungsimporte
- automatischer Sichtschutz geheimer Rollen und Begriffe
