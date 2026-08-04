# Secret Circle Party Hub

Secret Circle entwickelt sich von einem einzelnen Imposter-Spiel zu einem übersichtlichen, offline nutzbaren Party-Game-Hub für gemeinsame Spiele auf einem Gerät.

**Aktueller Stand:** `1.0.0-beta.3` auf dem Expansionsbranch – Word Imposter bleibt vollständig spielbar, zusätzlich ist die erste Party-Hub-Version mit vierzehn spielbaren Spielen und vier klar markierten zukünftigen Spielen vorhanden.

## Start

```bash
python -m http.server 8080
```

- Party Hub: `http://localhost:8080/party.html`
- Word Imposter: `http://localhost:8080/index.html`

Nach dem ersten vollständigen Laden stehen beide Bereiche über den Offline-Cache `secret-circle-v19` ohne Internet zur Verfügung.

## Party Hub

### Vierzehn spielbare Spiele

1. Word Imposter
2. Wahrheit oder Pflicht
3. Ich habe noch nie
4. Wer würde eher?
5. Entweder oder
6. Hot Takes
7. Nur falsche Antworten
8. Paranoia
9. Scharade
10. Nicht sagen!
11. Heiße Kartoffel
12. Wortkette
13. Flaschendrehen
14. Würfel & Münze

### Klar markierte nächste Spiele

- Zwei Wahrheiten, eine Lüge
- Question Imposter
- Location Spy
- Mafia

Diese Spiele sind sichtbar, aber technisch eindeutig als `In Arbeit` markiert und können nicht versehentlich gestartet werden.

### Hub-Funktionen

- Startseite mit Empfehlungen, Quick Picks und zuletzt gestarteten Spielen
- vollständiger Spielekatalog mit Suche
- Filter nach Spielart, Stimmung, Gruppengröße und Status
- klare Anzeige von Spielerzahl, geschätzter Dauer, Kartenanzahl und Kategorien
- gemeinsame lokale Spielerliste für alle Hub-Spiele
- Host-Presets für häufige Gruppen
- Favoriten und zuletzt gespielt
- lokaler Verlauf und Spielstatistik
- zufälliger Schnellstart passend zur gespeicherten Gruppengröße
- eigene Vollbild-Spielabläufe für Karten-, Wahl-, Timer- und Zufallsspiele
- zufällige Karten ohne unmittelbare Wiederholung innerhalb einer Session
- Vibration auf unterstützten Geräten bei Timern und Zufallsergebnissen
- keine Anmeldung, kein Tracking und keine Serverübertragung

Der Party Hub enthält mehr als 300 eigenständig erstellte Karten, Fragen, Begriffe, Entscheidungen und Aufgaben. Der Katalog ist modular aufgebaut, damit weitere Spiele und Packs ergänzt werden können, ohne die bestehende Imposter-Engine zu gefährden.

## Word Imposter

Der bestehende Imposter-Bereich bleibt als separates, stabiles Spielmodul erhalten:

- 3–20 eindeutige Personen
- maximal sechs Imposter, auch bei wiederhergestellten Spielständen
- unabhängige Rollenverteilung ohne Kopplung an die Aufdeckreihenfolge
- 14 Kategorien und 168 Begriffe
- eigene Kategorien
- Karten-Sichtschutz bei App-Wechsel
- deadline-basierter Timer
- geheime Abstimmung, Stichwahl und Imposter-Ratechance
- Punkte, Rangliste und Mehr-Runden-Matches
- Verlauf, Wiederaufnahme, Backup und vollständige Datenlöschung

## Aufbau

- `party.html`: übersichtliche Party-Hub-Oberfläche
- `party.css`: responsives Hub-Design für Desktop, Smartphone und installierte PWA
- `party-catalog.js`: Spielekatalog, Kategorien und eigene Inhalte
- `party-hub.js`: Navigation, Filter, Spieler, Presets, Favoriten, Verlauf und Spielabläufe
- `index.html` + `app.js`: bestehender Word-Imposter-Ablauf
- `game-engine.js`: deterministische Imposter-Regeln
- `role-assignment.js`: unabhängige Rollenverteilung und Grenze von sechs Impostern
- `word-packs.js`: Imposter-Begriffe
- `data-store.js`: versionierte Imposter-Speicherung und Sicherung
- `sw.js`: Offline-Core für Party Hub und Word Imposter

## Automatisierte Prüfung

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci
```

Zusätzlicher Browser-Smoke-Test:

```bash
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

Die Prüfungen umfassen jetzt zusätzlich:

- Integrität aller 18 Katalogeinträge
- genau 14 spielbare und 4 geplante Spiele
- mindestens 300 sichere Party-Karten
- Paarstruktur für Entweder-oder-Karten
- verbotene Wörter für Nicht-sagen-Karten
- Party-Hub-Suche und Filter
- spielbaren Wahrheit-oder-Pflicht-Ablauf
- gemeinsame Spieler, Host-Presets und Favoriten
- lokalen Hub-Verlauf
- eindeutige Sperre geplanter Spiele
- Navigation zwischen Party Hub und Word Imposter
- vollständigen Offline-Core `secret-circle-v19`

## Datenschutz

Hub-Spieler, Presets, Favoriten, Verlauf und Statistik liegen ausschließlich im lokalen Browser-Speicher unter einem eigenen Hub-Schlüssel. Word-Imposter-Daten bleiben weiterhin im versionierten Imposter-Speicher. Es werden keine Analyse-, Werbe- oder Tracking-Dienste verwendet.

## Status

- Word-Imposter-Kernspiel: `GO` für automatisierte und kontrollierte Tests
- Party-Hub-Grundlage: `IMPLEMENTIERT`, automatischer Gesamttest noch ausstehend
- vierzehn Hub-Spiele: `IMPLEMENTIERT`, realer Bedien- und Gruppentest ausstehend
- vier zukünftige Spiele: `GEPLANT`
- öffentlicher Produktionsrelease: `NO_GO`, bis CI, echte Geräte, Partytests und rechtliche Angaben vollständig bestätigt sind

Die weitere Expansion wird in Issue #10 verfolgt.
