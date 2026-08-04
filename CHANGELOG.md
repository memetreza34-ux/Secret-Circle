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
- Eigene Hub-Kategorien für kompatible Frage-, Darstellungs- und Schnellspiele
- Gesamtexport für Hub, eigene Packs, aktive Sessions und Word Imposter
- Offline-Core `secret-circle-v24`
- Regressionstests für Spieler-Snapshot, Speicherfehler, Mehrbyte-Dateien und Rollback

### Verbesserte Session-Sicherheit

- aktives erweitertes Session-Schema auf Version 2 gehärtet
- jede gestartete komplexe Session speichert ihre eigene Spielergruppe
- Änderungen an der gemeinsamen Lobby verändern keine laufende Session
- alte aktive Sessions werden kontrolliert migriert
- ungültige Spielerzahl, Packzuordnung oder Rundenzahl wird abgelehnt
- eindeutige Session- und Historien-ID verhindert doppelte Abschlüsse
- Verlauf und Statistik werden vor dem Schließen transaktionssicher gespeichert
- ein Speicherfehler lässt die Session aktiv und erneut speicherbar

### Verbesserte Eigene Hub-Kategorien

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
- Objekt für exportierte Einträge besitzt keinen geerbten Prototyp
- Objekt-URL eines Exports wird verzögert freigegeben, damit Downloads zuverlässig beginnen

### Verbesserte Einstellungen und Statistiken

- Hub-Plus auf Version 5 erhöht
- fehlgeschlagene Präferenz-Speicherung wird abgefangen und sichtbar gemeldet
- aktuelle Altersauswahl bleibt trotz Speicherfehler nutzbar
- negative, ungültige und unbekannte Statistikwerte werden sicher normalisiert
- fehlgeschlagene Statistikreparatur blockiert die App nicht
- Fallback für Browser ohne `CSS.escape`

### Behoben

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

- 8 Unit-Testdateien
- mindestens 19 Playwright-E2E-Suiten
- Chromium-, Firefox-, WebKit-, Android- und iPhone-Projekte
- Strukturvalidator prüft HTML, CSP, Assets, Scriptreihenfolge, Manifest, Icons, Cache, Katalog und Speichertransaktionen
- Release-Audit prüft Player-Snapshot, Pack-Rollback, byte-sicheren Import und Dokumentation
- GitHub Actions bleibt durch einen externen Fehler vor dem ersten Schritt blockiert

### Noch offen

- vollständig erfolgreicher lokaler Testlauf
- grüner GitHub-Actions-Lauf
- reale Android-, iPhone-/iPad- und PWA-Update-Prüfung
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
