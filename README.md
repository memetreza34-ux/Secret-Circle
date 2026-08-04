# Secret Circle Party Hub

Secret Circle ist eine offline nutzbare Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät. Der installierte PWA-Einstieg öffnet den Party Hub; das vollständige Word-Imposter-Spiel bleibt als separates stabiles Modul erhalten.

**Aktueller Stand:** `1.0.0-beta.3` auf `codex/party-hub-foundation` – 22 sichtbare Spiele, davon **18 spielbare Spiele** und 4 eindeutig gesperrte Roadmap-Spiele.

## Lokal starten

```bash
python -m http.server 8080
```

- Party Hub: `http://localhost:8080/party.html`
- Word Imposter: `http://localhost:8080/index.html`
- erweitertes Beispiel: `http://localhost:8080/advanced.html?game=question-imposter`

Nach dem ersten vollständigen Laden stehen alle Kernbereiche über den Offline-Cache `secret-circle-v23` ohne Internet zur Verfügung.

## Spielbarer Katalog

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
- Suche und kombinierbare Filter
- Spielerzahl, Dauer, Altersstufe, Kategorien und Inhaltsmenge vor dem Start
- gemeinsame lokale Spielerliste
- Host-Presets
- Favoriten
- Verlauf und Statistiken
- acht lokale Erfolge
- Alterspräferenz und Standard-Sessionlänge
- installierbare Offline-PWA
- vollständiger lokaler Export, Import und Datenlöschung

## Eigene Hub-Kategorien

Im Datenbereich können eigene Packs für kompatible Frage-, Darstellungs- und Schnellspiele erstellt werden.

- maximal 20 Packs
- maximal 100 eindeutige Karten pro Pack
- mindestens drei Karten erforderlich
- Duplikate werden unabhängig von Groß- und Kleinschreibung entfernt
- Nutzertexte werden als Text ausgegeben und nicht als HTML ausgeführt
- Packs erscheinen direkt in Spieldetails und Pack-Auswahl
- Packs sind Bestandteil von Gesamtexport, Import und vollständiger Löschung

Strukturierte Inhalte wie Mafia-Rollen, Question-Imposter-Fragenpaare, Entweder-oder-Paare und Tabu-Karten benötigen spezielle Datenformen und sind deshalb bewusst nicht im allgemeinen Editor freigeschaltet.

## Sichere erweiterte Sessions

Zwei Wahrheiten, Question Imposter, Location Spy und Mafia verwenden wiederaufnehmbare Sessions.

- aktives Schema Version 2
- 3, 5, 10 oder 20 Runden
- maximal 20 Runden
- eindeutige Session-ID
- **Spieler-Snapshot:** Eine gestartete Session behält ihre ursprüngliche Spielergruppe, selbst wenn die gemeinsame Lobby später verändert wird
- beschädigte aktive Daten werden verworfen
- abgeschlossene Sessions werden mit einer eindeutigen Historien-ID gespeichert
- ein Speicherfehler löscht die aktive Session nicht
- ein erneuter Abschluss erzeugt keinen doppelten Verlaufseintrag

## Inhalte

- mindestens 384 eigenständig erstellte Hub-Inhalte vor Nutzerpacks
- 168 Word-Imposter-Begriffe in 14 Kategorien
- keine unmittelbare Wiederholung innerhalb einer Session, solange ungenutzte Karten vorhanden sind
- Altersfilter für familienfreundliche und ab 12 empfohlene Inhalte
- keine kopierten proprietären Karten oder Designs anderer Partyspiel-Apps

## Lokale Daten und Datenschutz

Secret Circle benötigt kein Konto und sendet Spieldaten nicht an einen eigenen Server.

Gesichert werden können:

- Hub-Spieler und Presets
- Favoriten und zuletzt gespielt
- Verlauf, Statistik und Erfolge
- eigene Hub-Packs
- aktive erweiterte Sessions
- Word-Imposter-Spielstände, Einstellungen und eigene Kategorien

Der Gesamtsicherungsimport besitzt Format-, JSON-, Schlüssel- und Größenprüfung sowie Rollback. „Alle lokalen Daten löschen“ entfernt alle Schlüssel mit dem Präfix `secret-circle-`.

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
- `party-catalog.js`: Basiskatalog und Inhalte
- `party-expansion.js`: erweiterter 22-Spiele-Katalog
- `party-routing.js`: Routing komplexer Spiele
- `party-custom-packs.js`: eigene Hub-Packs
- `party-hub.js`, `party-hub-plus.js`: Katalog, Spieler, Statistik, Erfolge und Installation
- `advanced.html`, `party-advanced.js`, `party-advanced-runner.js`: komplexe Spielabläufe und Wiederaufnahme
- `party-data-tools.js`: Gesamtsicherung und Löschung
- `game-engine.js`, `role-assignment.js`: Word-Imposter-Regeln
- `data-store.js`: versionierter Imposter-Speicher
- `sw.js`: Offline-Core `secret-circle-v23`

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
- Katalog und eigene Packs
- alle vier komplexen Spiele
- Player-Snapshot nach Lobbyänderung
- sichere Reaktion auf fehlgeschlagene Verlaufsspeicherung
- Export, Import, Rollback und vollständige Löschung
- Offline-Start und PWA-Cache
- CSP, Eingabesicherheit, Accessibility und mobile Layouts
- Chromium, Firefox, WebKit, Android- und iPhone-Simulation

## Freigabestatus

- Word-Imposter-Kern: `GO` für den vollständigen Testlauf
- Party-Hub-Code: `GO` für den vollständigen Testlauf
- realer Geräte- und Party-Betatest: `NO_GO`, bis die automatisierten Läufe grün sind
- öffentlicher Produktionsrelease: `NO_GO`, bis CI, echte Geräte, Gruppen-Betatests, Inhaltsprüfung und rechtliche Angaben abgeschlossen sind

Die Expansion wird in Issue #10 und Draft-PR #11 verfolgt.
