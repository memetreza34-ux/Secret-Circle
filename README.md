# Secret Circle Party Hub

Secret Circle ist eine offline nutzbare Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät. Der installierte PWA-Einstieg öffnet den übersichtlichen Party Hub; das vollständige Word-Imposter-Spiel bleibt als eigenes stabiles Modul erhalten.

**Aktueller Stand:** `1.0.0-beta.3` auf dem Expansionsbranch – 22 sichtbare Spiele, davon 18 spielbar und 4 eindeutig als zukünftige Spiele gesperrt.

## Start

```bash
python -m http.server 8080
```

- Party Hub: `http://localhost:8080/party.html`
- Word Imposter: `http://localhost:8080/index.html`
- erweiterte Spiele: `http://localhost:8080/advanced.html?game=question-imposter`

Nach dem ersten vollständigen Laden stehen alle spielbaren Bereiche über den Offline-Cache `secret-circle-v21` ohne Internet zur Verfügung.

## 18 spielbare Spiele

### Täuschung und Rollen

1. Word Imposter
2. Zwei Wahrheiten, eine Lüge
3. Question Imposter
4. Location Spy
5. Mafia

### Fragen und Abstimmen

6. Wahrheit oder Pflicht
7. Ich habe noch nie
8. Wer würde eher?
9. Entweder oder
10. Hot Takes
11. Nur falsche Antworten
12. Paranoia

### Darstellen und Zeitdruck

13. Scharade
14. Nicht sagen! / Tabu
15. Heiße Kartoffel
16. Wortkette

### Zufall und Werkzeuge

17. Flaschendrehen
18. Würfel & Münze

## Sichtbare Roadmap

Vier weitere Spiele werden bereits transparent im Katalog gezeigt, bleiben aber technisch gesperrt:

- Wellenlänge
- Zeichnen & Raten
- Schnellfeuer
- Geräusche erraten

Ein geplantes Spiel kann nicht versehentlich wie ein fertiges Spiel gestartet werden.

## Übersichtlicher Aufbau

- Startseite mit Empfehlungen, Quick Picks, Schnellstart und zuletzt gespielt
- vollständiger Katalog mit Suche
- Filter nach Spielart, Stimmung, Gruppengröße, Altersstufe und Entwicklungsstatus
- klare Spielkarten mit Spielerzahl, Dauer, Kartenanzahl und Status
- Detailansicht mit Regeln, Kategorien und Inhaltsmenge
- gemeinsame lokale Spielerliste
- wiederverwendbare Host-Presets
- Favoriten
- Verlauf und lokale Statistiken
- acht lokale Erfolge
- installierbare PWA
- eigener Bereich für Daten, Einstellungen und Datenschutz

## Erweiterte Spielabläufe

- **Zwei Wahrheiten, eine Lüge:** private Eingabe, zufällige Mischung, Gruppenabstimmung und Auflösung
- **Question Imposter:** geheime ähnliche Fragen, zufälliger Imposter, Diskussion und Abstimmung
- **Location Spy:** geheimer Ort, zufälliger Spion, Verdächtigenwahl oder Ortsraten
- **Mafia:** private Rollen, geschützte Moderatoransicht, Nachtaktionen, Tageswahl und Siegprüfung
- aktive erweiterte Sessions werden nach Neuladen fortgesetzt
- Sessionlängen mit 3, 5, 10 oder 20 Runden
- abgeschlossene Sessions fließen in Verlauf, Statistik und Erfolge ein

## Inhalte

- mehr als 390 eigene Hub-Inhalte
- zusätzlich 168 geprüfte Word-Imposter-Begriffe in 14 Kategorien
- Kategorien und Inhaltsmengen vor dem Start sichtbar
- keine unmittelbare Kartenwiederholung innerhalb einer Session
- Altersfilter für familienfreundliche und ab 12 empfohlene Spiele
- keine kopierten proprietären Karten oder Designs anderer Partyspiel-Apps

## Lokale Daten

Secret Circle benötigt kein Konto und überträgt Spieldaten nicht an einen eigenen Server.

Gemeinsam gesichert werden können:

- Hub-Spieler und Presets
- Favoriten und zuletzt gespielt
- Verlauf, Statistik und Erfolge
- aktive erweiterte Sessions
- Word-Imposter-Spielstände und Einstellungen
- eigene Imposter-Kategorien

Der vollständige JSON-Import besitzt Größenlimit, Formatprüfung und Rollback. „Alle lokalen Daten löschen“ entfernt sämtliche `secret-circle-*`-Datensätze.

## Word Imposter

- 3–20 eindeutige Personen
- maximal sechs Imposter
- Rollenverteilung unabhängig von der Aufdeckreihenfolge
- Karten-Sichtschutz bei App-Wechsel
- deadline-basierter Timer mit Wiederherstellung
- geheime Abstimmung, Stichwahl und Ratechance
- Punkte, Rangliste und Mehr-Runden-Matches
- Verlauf, Migration, Backup und Datenlöschung

## Architektur

- `party.html`, `party.css`: Hub, Navigation und Katalog
- `party-catalog.js`: bestehende 18 Katalogeinträge und Basisinhalte
- `party-expansion.js`: erweiterter 22-Spiele-Katalog und neue Inhalte
- `party-routing.js`: sichere Weiterleitung komplexer Spiele
- `party-hub.js`, `party-hub-plus.js`: Hub-Abläufe, Filter, Erfolge und Installation
- `advanced.html`, `party-advanced.js`, `party-advanced-runner.js`: komplexe Spielabläufe und Wiederaufnahme
- `party-data-tools.js`: vollständiger lokaler Export, Import und Löschung
- `game-engine.js`, `role-assignment.js`: Word-Imposter-Regeln und faire Rollen
- `data-store.js`: versionierte Imposter-Speicherung
- `sw.js`: vollständiger Offline-Core `secret-circle-v21`

## Automatisierte Prüfung

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci
```

Zusätzliche Browsermatrix:

```bash
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

Die Gates umfassen:

- Engine, Speicherung, Inhalte, Rollenverteilung und Fuzz-Szenarien
- Basis- und Expansionskatalog
- alle vier erweiterten Spiele
- Wiederaufnahme aktiver Sessions
- Altersfilter, Favoriten, Presets, Verlauf und Erfolge
- vollständigen Backup-Export, Import, ungültige Dateien und Datenlöschung
- Offline-Start von Hub, Word Imposter und Question Imposter
- Manifest, Icons, CSP, Accessibility und Laufzeitfehler
- Chromium, Firefox, WebKit, Android- und iPhone-Simulation

## Freigabestatus

- Word-Imposter-Kernspiel: `GO` für den vollständigen Testlauf
- Party-Hub-Code und 18 Spiele: `GO` für den vollständigen automatisierten Testlauf
- reale Geräte- und Party-Beta: `NO_GO`, bis die automatisierten Tests erfolgreich protokolliert sind
- öffentlicher Produktionsrelease: `NO_GO`, bis CI, echte Android-/iOS-Tests, Gruppen-Betatests, Inhaltsprüfung und rechtliche Angaben abgeschlossen sind

Die Expansion wird in Issue #10 und Draft-PR #11 verfolgt.
