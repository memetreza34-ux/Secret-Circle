# Secret Circle Party Hub

Secret Circle ist eine offline nutzbare Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät. Der installierte PWA-Einstieg öffnet den Party Hub; Word Imposter bleibt als separates stabiles Modul erhalten.

**Aktueller Stand:** `1.0.0-beta.3` auf `codex/party-hub-foundation` – **28 sichtbare und technisch spielbare Spiele**, Smart Party Night, eigene Packs, wiederaufnehmbare Sessions und ein langfristiges Universum aus 122 geplanten Modi.

## Lokal starten

```bash
python -m http.server 8080
```

- Party Hub: `http://localhost:8080/party.html`
- Word Imposter: `http://localhost:8080/index.html`
- erweitertes Beispiel: `http://localhost:8080/advanced.html?game=question-imposter`
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

### Schnelligkeit, Kreativität und Bewegung

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

## Neue Quick-Mode-Engine

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

### Wellenlänge

Eine Person sieht einen geheimen Zielwert zwischen zwei Gegensätzen. Nach einem Hinweis positioniert die Gruppe einen Regler. Je kleiner der Abstand, desto mehr Punkte.

### Schnellfeuer

Drei oder mehr Begriffe müssen in fünf bis fünfzehn Sekunden genannt werden. Unterschiedliche Packs verändern Anzahl, Schwierigkeit und Zeitlimit.

### Buchstaben-Kategorien

Ein zufälliger Buchstabe wird mit mehreren Kategorien kombiniert. Nach 60 Sekunden werden gültige und möglichst einzigartige Antworten gewertet.

### Stirn-Raten und Darstellungsmodi

Begriffe werden erklärt, gezeichnet, nur mit Geräuschen oder durch Summen vermittelt. Die ratende Person sieht die Karte nicht.

### Nicht lachen, Gegenstandsjagd und Caption Battle

Kurze soziale Challenges ergänzen die klassischen Karten- und Quizmechaniken um Bewegung, Improvisation und Gruppenabstimmung.

## Smart Party Night

Der Party Hub kann einen vollständigen Spieleabend automatisch zusammenstellen.

- Zeitbudget mit 15, 30, 45, 60 oder 90 Minuten
- Auswahl nach Stimmung
- Berücksichtigung von Gruppengröße und Altersstufe
- Bonus für Favoriten
- zuletzt gespielte Titel werden nach Möglichkeit vermieden
- Mischung unterschiedlicher Spielarten
- schneller Einstieg und stärkerer Abschluss
- höchstens sechs eindeutige Hauptspiele
- Fortschritt bleibt lokal gespeichert
- Hub-, Quick-, Advanced- und Word-Imposter-Abschlüsse können den Plan automatisch fortschreiben
- Party-Night-Daten sind Bestandteil von Export, Import und Löschung

## Party-Hub-Funktionen

- Startseite mit Empfehlungen, Quick Picks und zuletzt gespielt
- Suche und kombinierbare Filter
- Spielerzahl, Dauer, Altersstufe, Kategorien und Inhaltsmenge vor dem Start
- gemeinsame lokale Spielerliste
- Host-Presets und Favoriten
- Verlauf, Statistiken und acht Erfolge
- Alterspräferenz und Standard-Sessionlänge
- genaue Aktionsbeschriftungen für Hub-, Quick-, Advanced- und Imposter-Spiele
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
- Speichern und Löschen sind transaktionssicher
- Packs sind Bestandteil von Gesamtexport, Import und vollständiger Löschung

Strukturierte Inhalte wie Mafia-Rollen, Question-Imposter-Fragenpaare, Wellenlängen-Spektren oder Schnellfeuer-Karten benötigen eigene Editoren und werden später über validierte Spezialeditoren ergänzt.

## Sichere Sessions und Datensicherung

- aktive Advanced-Sessions: Schema Version 2
- aktive Quick-Sessions: `secret-circle-party-quick-active-v1`
- Spieler-Snapshot bleibt während einer gestarteten Session unverändert
- beschädigte aktive Daten werden verworfen
- abgeschlossene Sessions verwenden eindeutige Historien-IDs
- Speicherfehler löschen aktive Sessions nicht
- Gesamtsicherung maximal 1,5 MB nach tatsächlicher UTF-8-Byte-Größe
- Import und vollständige Löschung verwenden Rollback
- sämtliche Daten bleiben lokal und können vollständig entfernt werden

## Inhalte

- mindestens 384 vorhandene Hub-Inhalte vor den neuen Quick-Mode-Packs
- zusätzliche originale Inhalte für zehn Quick Modes
- 168 Word-Imposter-Begriffe in 14 Kategorien
- keine unmittelbare Kartenwiederholung, solange ungenutzte Karten vorhanden sind
- familienfreundliche und ab 12 empfohlene Inhalte getrennt filterbar
- keine kopierten proprietären Karten, Namen, Designs oder Mediendateien anderer Apps

## 122-Modi-Universum

`MODE_UNIVERSE.md` dokumentiert 122 historische, aktuelle und mögliche zukünftige Partyspiel-Modi. Die Plattform erstellt dafür nicht 122 getrennte Codebasen, sondern wiederverwendbare Engine-Familien für:

- Karten und Prompts
- Abstimmung und Spektren
- verdeckte Rollen
- Bluff-Antworten
- Zeichnen und Stille Post
- Wort- und Buchstabenspiele
- Timer und Reaktion
- Audio
- Teams und Turniere
- kooperative Aufgaben
- Creator-Packs
- optionale Kamera-, KI- und Mehrgerätefunktionen

## Architektur

- `party.html`: Party Hub
- `advanced.html`: komplexe Rollen- und Täuschungsspiele
- `quick-play.html`: zehn schnelle Trend- und Klassiker-Modi
- `party-catalog.js`: Basiskatalog
- `party-expansion.js`: Advanced-Spiele und erste Roadmap
- `party-trending-catalog.js`: 28-Spiel-Katalog und Quick-Mode-Inhalte
- `party-routing.js`: Advanced- und Quick-Routing
- `party-quick-modes.js`: wiederaufnehmbare Quick-Mode-Engine
- `party-hub-polish.js`: korrekte kontextabhängige Aktionsbeschriftungen
- `party-night.js`: Empfehlungs- und Ablaufplaner
- `party-custom-packs.js`: eigene Packs mit Transaktionsschutz
- `party-data-tools.js`: byte-sichere Gesamtsicherung
- `game-engine.js`, `role-assignment.js`: Word-Imposter-Regeln
- `sw.js`: Offline-Core `secret-circle-v26`
- `ARCHITECTURE.md`: langfristiger Architekturvertrag
- `scripts/architecture_audit.py`: automatisch erzwungene Architekturgrenzen

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

- Engine, Speicherung, Rollenverteilung und Fuzz-Szenarien
- 28-Spiel-Katalog und zehn Quick Modes
- Wellenlänge, Schnellfeuer, Buchstaben-Kategorien und Wiederaufnahme
- alle vier Advanced-Spiele
- Smart Party Night
- eigene Hub-Packs
- Import-, Lösch- und Speicher-Rollback
- Statistikreparatur
- vollständiger Offline-Core v26
- CSP, Accessibility und mobile Layouts
- Chromium, Firefox, WebKit, Android- und iPhone-Simulation

## Freigabestatus

- Word-Imposter-Kern: `GO` für den vollständigen Testlauf
- Party Hub mit 28 Spielen: `GO` für den vollständigen Testlauf
- reale Geräte- und Party-Beta: `NO_GO`, bis die automatisierten Läufe grün sind
- öffentlicher Produktionsrelease: `NO_GO`, bis CI, echte Geräte, Gruppen-Betatests, Inhaltsprüfung und rechtliche Angaben abgeschlossen sind

Die Expansion wird in Issue #10 und Draft-PR #11 verfolgt.
