# Änderungsverlauf

## In Entwicklung – Party-Hub-Erweiterung

### Hinzugefügt

- neue Party-Hub-Seite `party.html` mit klarer Hauptnavigation
- Startseite mit Empfehlungen, Quick Picks, Schnellstart und zuletzt gestarteten Spielen
- vollständiger Katalog mit Suche und Filtern nach Art, Stimmung, Gruppengröße und Status
- Spieldetails mit Regeln, Spielerzahl, Dauer, Kategorien und Kartenanzahl
- gemeinsame lokale Spielerliste
- Host-Presets für wiederkehrende Gruppen
- Favoriten, zuletzt gespielt, Verlauf und lokale Statistik
- vierzehn spielbare Spiele:
  - Word Imposter
  - Wahrheit oder Pflicht
  - Ich habe noch nie
  - Wer würde eher?
  - Entweder oder
  - Hot Takes
  - Nur falsche Antworten
  - Paranoia
  - Scharade
  - Nicht sagen!
  - Heiße Kartoffel
  - Wortkette
  - Flaschendrehen
  - Würfel & Münze
- vier sichtbar geplante und technisch gesperrte Spiele:
  - Zwei Wahrheiten, eine Lüge
  - Question Imposter
  - Location Spy
  - Mafia
- mehr als 300 neue eigenständige Fragen, Entscheidungen, Begriffe und Aufgaben
- Vollbild-Spielabläufe für Karten-, Wahl-, Timer-, Erklär- und Zufallsspiele
- zufällige Kartenauswahl ohne unmittelbare Wiederholung innerhalb einer Session
- rotierende aktive Person
- 60-Sekunden-Scharade mit Trefferzählung
- Tabu-Karten mit jeweils drei verbotenen Wörtern
- zufälliger Hot-Potato-Timer
- Wortketten-Timer
- digitale Zufallsauswahl, Münze, W6, W20 und Zufallszahl
- Katalog-Unit-Test und Party-Hub-End-to-End-Suite
- eigener Party-Hub-Performancebereich
- vollständiger Offline-Core `secret-circle-v19`

### Verbessert

- Word Imposter verlinkt direkt zum Party Hub
- Inhalte und Entwicklungsstatus sind vor dem Start sichtbar
- geplante Spiele können nicht versehentlich als fertige Funktionen gestartet werden
- responsive Darstellung für Desktop, Smartphone, Safe Areas und installierte PWA
- Party-Hub-Daten bleiben in einem getrennten lokalen Speicherbereich
- Syntax-, Struktur-, Offline- und Performanceprüfungen berücksichtigen die neuen Hub-Dateien

### Noch offen

- gemeinsames Backup und vollständige gemeinsame Datenlöschung für Hub und Word Imposter
- mehr Packs und deutlich mehr Karten pro Hub-Spiel
- redaktionelle Alters- und Inhaltsprüfung
- echte Android-, iOS- und Gruppenprüfungen
- vollständige Implementierung von Two Truths, Question Imposter, Location Spy und Mafia
- erfolgreicher protokollierter Gesamt-Testlauf

## 1.0.0-beta.3 – 2026-08-04

### Hinzugefügt

- vollständiger Karten-, Diskussions-, Abstimmungs-, Rate- und Ergebnisablauf
- Punkte, Rangliste, Mehr-Runden-Matches und begrenzte Stichwahl
- maximal sechs Imposter
- unabhängige deterministische Rollenverteilung in `role-assignment.js`
- 14 Kategorien mit 168 Begriff-Hinweis-Paaren
- deadline-basierter Timer mit Hintergrund- und Neulade-Wiederherstellung
- Live-Gruppengröße und dynamische Imposter-Grenzen
- automatische Kartenverdeckung mit blockierter Weitergabe
- optionaler Wake Lock während der Diskussion
- Verlauf, Datenmigration, Backup-Export/-Import und vollständige lokale Löschung
- Datenschutzseite, Content Security Policy und Laufzeit-Fehlerschutz
- 192- und 512-Pixel-PNG-Icons
- vollständiger Offline-Core der ursprünglichen Imposter-Beta
- Unit-, Fuzz-, E2E- und Cross-Browser-Struktur
- Repository-Hygiene, Performancebudget, Strukturvalidator und Release-Audit

### Behoben

- kritische Kopplung der Imposter an die ersten Positionen der Aufdeckreihenfolge
- mehr als sechs Imposter werden zuverlässig abgelehnt
- endlose Stichwahlen
- doppelte Stimmen und Selbstwahl
- Begriffswiederholungen innerhalb eines noch nicht erschöpften Pools
- Timerabweichungen nach Hintergrundbetrieb oder Neuladen
- fehlende Verlaufseinträge bei direkt beendeten Runden
- unvollständige Migration älterer Spielstände
- versehentliche Weitergabe automatisch verdeckter Karten

### Sicherheit und Datenschutz

- keine Anmeldung, Analyse-, Werbe- oder Tracking-Dienste
- keine appgesteuerte Übertragung von Spieldaten
- restriktive Ressourcen- und Skriptrichtlinie
- escaped Namen und Kategorien
- Größenbegrenzung und Rollback für Sicherungsimporte
- automatischer Sichtschutz geheimer Rollen und Begriffe
