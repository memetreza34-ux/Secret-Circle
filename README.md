# Secret Circle Party Hub

Secret Circle ist eine offline nutzbare Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät. Der installierte PWA-Einstieg öffnet den Party Hub; Word Imposter bleibt als separates stabiles Modul erhalten.

**Aktueller Stand:** `1.0.0-beta.3` auf `codex/party-hub-foundation` – 22 sichtbare Spiele, davon **18 spielbar** und 4 eindeutig gesperrte Roadmap-Spiele.

## Lokal starten

```bash
python -m http.server 8080
```

- Party Hub: `http://localhost:8080/party.html`
- Word Imposter: `http://localhost:8080/index.html`
- erweitertes Beispiel: `http://localhost:8080/advanced.html?game=question-imposter`

Nach dem ersten vollständigen Laden stehen alle Kernbereiche über den Offline-Cache `secret-circle-v25` ohne Internet zur Verfügung.

## Smart Party Night

Der Party Hub kann jetzt einen vollständigen Spieleabend automatisch zusammenstellen.

- Zeitbudget mit 15, 30, 45, 60 oder 90 Minuten
- Auswahl nach Stimmung: gemischt, lustig, Wettkampf, tiefer, Chaos, clever oder locker
- Berücksichtigung der gespeicherten Gruppengröße
- Berücksichtigung der Altersstufe
- Favoriten werden bevorzugt
- zuletzt gespielte Titel werden nach Möglichkeit nicht sofort wiederholt
- unterschiedliche Spielarten werden für mehr Abwechslung kombiniert
- schnelle Spiele werden als Einstieg bevorzugt
- wettkampforientierte oder chaotische Spiele eignen sich als Abschluss
- Fortschritt, erledigte und übersprungene Stationen bleiben lokal gespeichert
- der Plan kann nach einem Neuladen oder App-Neustart fortgesetzt werden
- der Party-Night-Plan ist Bestandteil von Export, Import und vollständiger Datenlöschung

Der Planer kopiert keine Inhalte oder Designs anderer Apps. Er übernimmt nur allgemeine, bewährte Produktprinzipien wie schneller Einstieg, anpassbare Rundendauer, eigene Packs, Haptik und ein klarer Ablauf.

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

Geplant, sichtbar und technisch nicht startbar: Wellenlänge, Zeichnen & Raten, Schnellfeuer und Geräusche erraten.

## Party-Hub-Funktionen

- Startseite mit Empfehlungen, Quick Picks und zuletzt gespielt
- Smart Party Night für komplette, gespeicherte Spielabläufe
- Suche und kombinierbare Filter
- Spielerzahl, Dauer, Altersstufe, Kategorien und Inhaltsmenge vor dem Start
- gemeinsame lokale Spielerliste
- Host-Presets und Favoriten
- Verlauf, Statistiken und acht Erfolge
- Alterspräferenz und Standard-Sessionlänge
- installierbare Offline-PWA
- vollständiger lokaler Export, Import und Datenlöschung

## Eigene Hub-Kategorien

Im Datenbereich können eigene Packs für kompatible Frage-, Darstellungs- und Schnellspiele erstellt werden.

- maximal 20 Packs
- maximal 100 eindeutige Karten pro Pack
- mindestens drei Karten erforderlich
- Unicode-Normalisierung und Duplikaterkennung
- Nutzertexte werden als Text und nicht als HTML ausgegeben
- Packs erscheinen direkt in Spieldetails und Pack-Auswahl
- Speichern und Löschen sind transaktionssicher: Schlägt der Browser-Speicher fehl, bleiben vorherige Packs und Katalogzustand erhalten
- Packs sind Bestandteil von Gesamtexport, Import und vollständiger Löschung

Strukturierte Inhalte wie Mafia-Rollen, Question-Imposter-Fragenpaare, Entweder-oder-Paare und Tabu-Karten benötigen spezielle Datenformen und sind deshalb nicht im allgemeinen Editor freigeschaltet.

## Sichere erweiterte Sessions

Zwei Wahrheiten, Question Imposter, Location Spy und Mafia verwenden wiederaufnehmbare Sessions.

- aktives Schema Version 2
- 3, 5, 10 oder 20 Runden
- maximal 20 Runden
- eindeutige Session-ID
- Spieler-Snapshot: Eine gestartete Session behält ihre ursprüngliche Spielergruppe, auch wenn die gemeinsame Lobby später verändert wird
- beschädigte oder widersprüchliche aktive Daten werden verworfen
- abgeschlossene Sessions verwenden eindeutige Historien-IDs
- ein Speicherfehler löscht die aktive Session nicht
- ein erneuter Abschluss erzeugt keinen doppelten Verlaufseintrag

## Transaktionssichere Datensicherung

Der Gesamtexport umfasst Hub, Party Night, eigene Hub-Kategorien, aktive Sessions und Word Imposter.

- maximale Sicherungsgröße: 1,5 MB
- **Byte-Grenze** wird über die tatsächliche UTF-8-Größe geprüft, nicht nur über die Zeichenanzahl
- Mehrbyte-Texte können das Limit deshalb nicht umgehen
- maximal 100 lokale Datensätze
- einzelne Werte werden ebenfalls nach Byte-Größe begrenzt
- Import ersetzt alle Secret-Circle-Daten nur als vollständige Transaktion
- bei einem Schreibfehler wird der vorherige Zustand wiederhergestellt
- schlägt auch der Rollback fehl, erscheint eine eindeutige Warnung
- vollständige Löschung verwendet dieselbe Rollback-Logik und hinterlässt keinen bewusst akzeptierten Teilzustand

## Robuste Einstellungen und Statistiken

- Altersfilter und Sessionlänge bleiben bei erfolgreichem Speichern erhalten
- bei einem Speicherfehler bleibt die aktuelle Auswahl nutzbar und wird als nur vorübergehend gekennzeichnet
- Statistikreparatur normalisiert negative oder ungültige Werte
- unbekannte Spiele werden nicht in Erfolge und Reparatur einbezogen
- fehlgeschlagene Statistik-Speicherung wird sichtbar gemeldet, ohne den Hub zu blockieren

## Inhalte

- mindestens 384 eigenständig erstellte Hub-Inhalte vor Nutzerpacks
- 168 Word-Imposter-Begriffe in 14 Kategorien
- keine unmittelbare Wiederholung innerhalb einer Session, solange ungenutzte Karten vorhanden sind
- Altersfilter für familienfreundliche und ab 12 empfohlene Inhalte
- keine kopierten proprietären Karten oder Designs anderer Partyspiel-Apps

## Lokale Daten und Datenschutz

Secret Circle benötigt kein Konto und sendet Spieldaten nicht an einen eigenen Server. Alle Spiel-, Pack-, Party-Night-, Einstellungs- und Verlaufsdaten liegen im lokalen Browser-Speicher.

Der Gesamtsicherungsimport besitzt Format-, JSON-, Schlüssel-, Anzahl- und Byte-Prüfung sowie Rollback. „Alle lokalen Daten löschen“ entfernt alle Schlüssel mit dem Präfix `secret-circle-`.

## Word Imposter

- 3–20 eindeutige Personen
- maximal sechs Imposter
- Rollenverteilung unabhängig von der Aufdeckreihenfolge
- Karten-Sichtschutz bei App-Wechsel
- deadline-basierter Timer mit Wiederherstellung
- geheime Abstimmung, begrenzte Stichwahl und Ratechance
- Punkte, Rangliste und Mehr-Runden-Matches
- versionierte Speicherung und Migration

## Architektur

- `party.html`, `party.css`, `party-extra.css`: Hub-Oberfläche
- `party-night.css`: responsive Ablauf- und Timeline-Darstellung
- `party-catalog.js`, `party-expansion.js`: Katalog und Inhalte
- `party-routing.js`: Routing komplexer Spiele
- `party-custom-packs.js`: eigene Hub-Packs mit Transaktionsschutz
- `party-hub.js`, `party-hub-plus.js`: Hub, Statistik, Einstellungen und Installation
- `party-night.js`: lokaler Empfehlungs-, Ablauf- und Fortschrittsplaner
- `advanced.html`, `party-advanced.js`, `party-advanced-runner.js`: komplexe Spielabläufe und Wiederaufnahme
- `party-data-tools.js`: byte-sichere Gesamtsicherung und Löschung
- `game-engine.js`, `role-assignment.js`: Word-Imposter-Regeln
- `data-store.js`: versionierter Imposter-Speicher
- `sw.js`: Offline-Core `secret-circle-v25`

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

Abgedeckt werden unter anderem:

- Engine, Speicherung, Inhalte, Rollenverteilung und Fuzz-Szenarien
- Katalog und eigene Hub-Kategorien
- Smart Party Night: Filter, Planvielfalt, Fortschritt, Speicherung und Neuladen
- Rollback bei fehlgeschlagenem Pack-Speichern und -Löschen
- alle vier komplexen Spiele und Spieler-Snapshot
- sichere Reaktion auf fehlgeschlagene Verlaufsspeicherung
- Mehrbyte-Dateien über der Byte-Grenze
- Import- und Lösch-Rollback
- Einstellungs- und Statistik-Speicherfehler
- Offline-Start, CSP, Accessibility und mobile Layouts
- Chromium, Firefox, WebKit, Android- und iPhone-Simulation

## Freigabestatus

- Word-Imposter-Kern: `GO` für den vollständigen Testlauf
- Party-Hub-Code einschließlich Party Night: `GO` für den vollständigen Testlauf
- realer Geräte- und Party-Betatest: `NO_GO`, bis die automatisierten Läufe grün sind
- öffentlicher Produktionsrelease: `NO_GO`, bis CI, echte Geräte, Gruppen-Betatests, Inhaltsprüfung und rechtliche Angaben abgeschlossen sind

Die Expansion wird in Issue #10 und Draft-PR #11 verfolgt.
