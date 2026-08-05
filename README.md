# Secret Circle Party Hub

Secret Circle ist eine offline nutzbare Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät. Der installierte PWA-Einstieg öffnet den Party Hub; Word Imposter bleibt als separates stabiles Modul erhalten.

**Aktueller Stand:** `1.0.0-beta.3` auf `codex/party-hub-foundation` – **28 sichtbare und technisch spielbare Spiele**, Smart Party Night, eigene Packs, wiederaufnehmbare Sessions und ein langfristiges Universum aus 122 Modi.

## Lokal starten

```bash
python -m http.server 8080
```

- Party Hub: `http://localhost:8080/party.html`
- Word Imposter: `http://localhost:8080/index.html`
- Advanced-Beispiel: `http://localhost:8080/advanced.html?game=question-imposter`
- Quick-Mode-Beispiel: `http://localhost:8080/quick-play.html?game=wavelength`

Nach dem ersten vollständigen Laden stehen alle Kernbereiche über den Offline-Cache `secret-circle-v26` ohne Internet zur Verfügung.

## 28 spielbare Spiele

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

### Darstellen, Erklären und Audio

13. Scharade
14. Nicht sagen! / Tabu
15. Zeichnen & Raten
16. Geräusche erraten
17. Stirn-Raten
18. Melodie summen

### Tempo, Kreativität und Bewegung

19. Heiße Kartoffel
20. Wortkette
21. Schnellfeuer
22. Buchstaben-Kategorien
23. Nicht lachen!
24. Gegenstandsjagd
25. Caption Battle
26. Wellenlänge

### Zufall und Werkzeuge

27. Flaschendrehen
28. Würfel & Münze

## Quick-Mode-Engine

Zehn besonders starke Partymechaniken laufen über eine gemeinsame, wartbare Engine:

- Wellenlänge
- Zeichnen & Raten
- Schnellfeuer
- Geräusche erraten
- Stirn-Raten
- Buchstaben-Kategorien
- Nicht lachen!
- Melodie summen
- Gegenstandsjagd
- Caption Battle

Gemeinsame Eigenschaften:

- 3, 5, 10 oder 20 Runden
- unveränderlicher Spieler-Snapshot
- lokale Punkte und Rangliste
- Wiederaufnahme nach Neuladen
- keine sofortige Kartenwiederholung
- lokaler Verlauf und Statistik
- Offline-Betrieb
- sichere Textausgabe
- Smartphone-, Tastatur- und Reduced-Motion-Unterstützung

## Smart Party Night

- 15, 30, 45, 60 oder 90 Minuten
- Auswahl nach Stimmung, Gruppengröße und Altersstufe
- Favoritenbonus und Vermeidung kürzlich gespielter Titel
- Mischung verschiedener Spielarten
- höchstens sechs eindeutige Hauptspiele
- lokaler Fortschritt und Wiederaufnahme
- automatische Synchronisierung aus Hub-, Quick-, Advanced- und Word-Imposter-Abschlüssen
- Bestandteil von Export, Import und Löschung

## Party-Hub-Funktionen

- Empfehlungen, Quick Picks und zuletzt gespielt
- Suche und kombinierbare Filter
- Spielerzahl, Dauer, Altersstufe, Kategorien und Inhaltsmenge vor dem Start
- gemeinsame lokale Spielerliste
- Host-Presets und Favoriten
- Verlauf, Statistik und Erfolge
- genaue Aktionsbeschriftungen für Hub-, Quick-, Advanced- und Imposter-Spiele
- installierbare Offline-PWA
- vollständiger lokaler Export, Import und Datenlöschung

## Eigene Hub-Kategorien

- maximal 20 Packs
- maximal 100 eindeutige Karten pro Pack
- mindestens drei Karten erforderlich
- Unicode-Normalisierung und Duplikaterkennung
- sichere Textausgabe
- direkte Katalog- und Packintegration
- transaktionssicheres Speichern und Löschen
- Bestandteil der Gesamtsicherung

Strukturierte Inhalte wie Mafia-Rollen, Question-Imposter-Paare, Wellenlängen-Spektren oder Schnellfeuer-Karten benötigen eigene validierte Spezialeditoren.

## Sessions und Datensicherung

- Word-Imposter-Schema 7
- Advanced-Session-Schema 2
- Quick-Session `secret-circle-party-quick-active-v1`
- Spieler-Snapshot während gestarteter Sessions
- beschädigte Daten werden verworfen
- eindeutige Historien-IDs
- Gesamtsicherung maximal 1,5 MB nach UTF-8-Byte-Größe
- Import und vollständige Löschung mit Rollback
- sämtliche Daten bleiben lokal

## 122-Modi-Universum

`MODE_UNIVERSE.md` dokumentiert:

- 28 aktuell spielbare Spiele
- 94 zusätzliche eindeutige Roadmap-Modi
- 122 Modi insgesamt

Neue Spiele verwenden gemeinsame Engine-Familien für Karten, Abstimmung, Rollen, Bluff, Zeichnen, Audio, Teams, Quiz, Creator-Packs und optionale Mehrgerätefunktionen.

## Architektur

- `party.html`: Party Hub
- `advanced.html`: komplexe Rollen- und Täuschungsspiele
- `quick-play.html`: zehn Quick Modes
- `party-catalog.js`: Basiskatalog
- `party-expansion.js`: Advanced-Erweiterung
- `party-trending-catalog.js`: 28-Spiel-Katalog und Quick-Inhalte
- `party-routing.js`: Advanced- und Quick-Routing
- `party-quick-modes.js`: wiederaufnehmbare Quick-Engine
- `party-hub-polish.js`: kontextabhängige Aktionsbeschriftungen
- `party-night.js`: Spieleabend-Planer
- `party-custom-packs.js`: eigene Packs
- `party-data-tools.js`: byte-sichere Gesamtsicherung
- `game-engine.js`, `role-assignment.js`: Word-Imposter-Regeln
- `sw.js`: Offline-Core `secret-circle-v26`
- `ARCHITECTURE.md`: langfristiger Architekturvertrag
- `MODE_UNIVERSE.md`: Produkt- und Moduslandkarte

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

Abgedeckt werden Engine, Speicherung, Fuzz-Szenarien, 28-Spiel-Katalog, Quick Modes, Advanced-Spiele, Party Night, eigene Packs, Rollback, Offline-Core v26, CSP, Accessibility sowie Chromium, Firefox, WebKit, Android und iPhone.

## Freigabestatus

- Word-Imposter-Kern: `GO` für den vollständigen Testlauf
- Party Hub mit 28 Spielen: `GO` für den vollständigen Testlauf
- reale Geräte- und Party-Beta: `NO_GO`, bis die automatisierten Läufe grün sind
- öffentlicher Produktionsrelease: `NO_GO`, bis CI, echte Geräte, Gruppen-Betatests, Inhaltsprüfung und rechtliche Angaben abgeschlossen sind

Die Expansion wird in Issue #10 und Draft-PR #11 verfolgt.
