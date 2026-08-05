# Secret Circle Party Hub

Secret Circle ist eine offline nutzbare Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät. Der installierte PWA-Einstieg öffnet den Party Hub; Word Imposter bleibt als separates stabiles Modul erhalten.

**Stand:** `1.0.0-beta.3` auf `codex/party-hub-foundation` – **28 technisch spielbare Spiele**, Smart Party Night, eigene Packs, wiederaufnehmbare Sessions und ein 122-Modi-Universum.

## Start

```bash
python -m http.server 8080
```

- Party Hub: `http://localhost:8080/party.html`
- Word Imposter: `http://localhost:8080/index.html`
- Advanced: `http://localhost:8080/advanced.html?game=question-imposter`
- Quick Mode: `http://localhost:8080/quick-play.html?game=wavelength`

Offline-Core: `secret-circle-v26`.

## 28 Spiele

- **Täuschung:** Word Imposter, Zwei Wahrheiten, Question Imposter, Location Spy, Mafia
- **Fragen:** Wahrheit oder Pflicht, Ich habe noch nie, Wer würde eher?, Entweder oder, Hot Takes, Nur falsche Antworten, Paranoia
- **Darstellen und Audio:** Scharade, Nicht sagen!, Zeichnen & Raten, Geräusche erraten, Stirn-Raten, Melodie summen
- **Tempo und Kreativität:** Heiße Kartoffel, Wortkette, Schnellfeuer, Buchstaben-Kategorien, Nicht lachen!, Gegenstandsjagd, Caption Battle, Wellenlänge
- **Werkzeuge:** Flaschendrehen, Würfel & Münze

## Quick Modes

Zehn Modi teilen eine wiederaufnehmbare Engine:

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

Sie unterstützen 3, 5, 10 oder 20 Runden, Spieler-Snapshot, Punkte, Verlauf, Statistik, Neulade-Wiederaufnahme, Offline-Betrieb und mobile Bedienung.

## Smart Party Night

- 15, 30, 45, 60 oder 90 Minuten
- Stimmung, Gruppengröße und Altersstufe
- Favoritenbonus und weniger unmittelbare Wiederholungen
- gemischte Spielarten
- lokaler Fortschritt
- automatische Synchronisierung aus Hub-, Quick-, Advanced- und Word-Imposter-Abschlüssen

## Plattform

- Suche und kombinierbare Filter
- gemeinsame Spieler und Host-Presets
- Favoriten, Verlauf, Statistik und Erfolge
- eigene Hub-Packs
- vollständiger Export, Import und Löschung
- versionierte Sessions und Rollback
- strikte CSP, keine Analyse-, Werbe- oder Tracking-Dienste
- installierbare Offline-PWA

## 122-Modi-Universum

`MODE_UNIVERSE.md` enthält 28 aktuelle Spiele und 94 zusätzliche eindeutige Roadmap-Modi. Neue Spiele verwenden gemeinsame Engine-Familien statt 122 getrennten Codebasen.

## Architektur

- `party.html`: Hub
- `advanced.html`: komplexe Spiele
- `quick-play.html`: Quick Modes
- `party-trending-catalog.js`: 28-Spiel-Katalog und Quick-Inhalte
- `party-quick-modes.js`: Quick-Engine
- `party-night.js`: Spieleabend-Planer
- `party-custom-packs.js`: eigene Packs
- `party-data-tools.js`: Gesamtsicherung
- `game-engine.js`: Word Imposter
- `sw.js`: Offline-Core v26
- `ARCHITECTURE.md`: Architekturvertrag
- `MODE_UNIVERSE.md`: Produktlandkarte

## Tests

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci
```

```bash
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

Vorbereitet sind Unit-, Fuzz-, E2E-, Offline-, Sicherheits-, Accessibility- und Cross-Browser-Prüfungen für Chromium, Firefox, WebKit, Android und iPhone.

## Freigabe

- vollständiger automatisierter Testlauf: `GO`
- reale Geräte-/Party-Beta: `NO_GO` bis grüne automatisierte Läufe
- öffentlicher Release: `NO_GO` bis CI, echte Geräte, Gruppen-, Inhalts- und Rechtsprüfung abgeschlossen sind

Issue #10 und Draft-PR #11 verfolgen die Expansion.
