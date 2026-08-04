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
- maximal 20 eigene Packs mit maximal 100 eindeutigen Karten
- Gesamtexport für Hub, eigene Packs und Word Imposter
- Import mit Formatprüfung, Größenlimit und Rollback
- vollständige Löschung aller `secret-circle-*`-Daten
- Offline-Core `secret-circle-v23`
- Regressionstests für unveränderliche Spielergruppen und fehlgeschlagene Verlaufsspeicherung

### Verbessert

- aktives erweitertes Session-Schema auf Version 2 gehärtet
- jede gestartete komplexe Session speichert ihre eigene Spielergruppe als Snapshot
- Änderungen an der gemeinsamen Lobby verändern keine bereits laufende Session mehr
- alte aktive Sessions werden kontrolliert migriert
- aktive Daten mit ungültiger Spielerzahl, Packzuordnung oder Rundenzahl werden sicher verworfen
- abgeschlossene Sessions verwenden eindeutige, idempotente Historien-IDs
- Verlauf und Statistik werden vor dem Schließen transaktionssicher gespeichert
- ein lokaler Speicherfehler lässt die Session aktiv und erneut speicherbar
- Statistikwerte älterer Sessions werden aus dem Verlauf repariert, ohne höhere neuere Werte zu reduzieren
- mobile Navigation, Filter, Touchflächen, Safe Areas und reduzierte Bewegung werden automatisch geprüft
- PR-Beschreibung, Validator und Release-Audit spiegeln den tatsächlichen Stand wider

### Behoben

- laufende Question-Imposter-, Location-Spy-, Mafia- und Zwei-Wahrheiten-Sessions wechseln nach einer Lobbyänderung nicht mehr unbemerkt die Personen
- Rollen, Fragen und aktive Person bleiben an die ursprüngliche Spielergruppe gebunden
- fehlgeschlagene Hub-Speicherung löscht keinen abgeschlossenen Sessionfortschritt mehr
- wiederholter Abschluss erzeugt keinen doppelten Verlaufseintrag
- beschädigte aktive Sessions bleiben nicht dauerhaft als unsichtbarer Fehler gespeichert
- eigene Hub-Packs werden vor dem Katalogrendern geladen
- doppelte Karten und doppelte Packnamen werden zuverlässig abgelehnt
- vollständige Datenlöschung umfasst eigene Packs und aktive Sessions

### Qualität

- 8 Unit-Testdateien
- mindestens 19 Playwright-E2E-Suiten
- Chromium-, Firefox-, WebKit-, Android- und iPhone-Projekte
- Strukturvalidator prüft HTML, CSP, Assets, Scriptreihenfolge, Manifest, Icons, Cache, Katalog und Session-Sicherheit
- Release-Audit prüft Player-Snapshot, transaktionssicheren Abschluss, Backup und Dokumentation
- GitHub-Actions-Wiederholung erneut angestoßen; der externe Runner-Blocker endet weiterhin vor dem ersten Schritt

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
