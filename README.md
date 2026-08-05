# Secret Circle Party Hub

Offline nutzbare Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät.

**Stand:** `1.0.0-beta.3` · 28 technisch spielbare Spiele · Smart Party Night · Offline-Core `secret-circle-v26` · 122-Modi-Universum.

## Start

```bash
python -m http.server 8080
```

- Hub: `/party.html`
- Imposter: `/index.html`
- Advanced: `/advanced.html?game=question-imposter`
- Quick: `/quick-play.html?game=wavelength`

## 28 Spiele

Täuschung und Rollen, Fragen und Abstimmen, Darstellen und Audio, Tempo und Kreativität sowie Zufallswerkzeuge. Die vollständige Liste steht in `MODE_UNIVERSE.md`.

## Quick Modes

Wellenlänge, Zeichnen & Raten, Schnellfeuer, Geräusche erraten, Stirn-Raten, Buchstaben-Kategorien, Nicht lachen!, Melodie summen, Gegenstandsjagd und Caption Battle teilen eine wiederaufnehmbare Engine mit 3–20 Runden, Spieler-Snapshot, Punkten, Verlauf, Statistik und Offline-Betrieb.

## Smart Party Night

Automatische 15–90-Minuten-Pläne nach Stimmung, Gruppe, Alter, Favoriten und Verlauf. Abschlüsse aus Hub, Quick, Advanced und Word Imposter können den Plan fortschreiben.

## Plattform

Suche, Filter, Spieler, Presets, Favoriten, Verlauf, Statistik, Erfolge, eigene Packs, Export, Import, Löschung, versionierte Sessions, Rollback, strikte CSP und keine Trackingdienste.

## Architektur

- `party.html` – Hub
- `advanced.html` – komplexe Spiele
- `quick-play.html` – Quick Modes
- `party-trending-catalog.js` – 28-Spiel-Katalog
- `party-quick-modes.js` – Quick-Engine
- `party-night.js` – Planer
- `party-custom-packs.js` – eigene Packs
- `party-data-tools.js` – Sicherung
- `game-engine.js` – Word Imposter
- `sw.js` – Offline-Core v26
- `ARCHITECTURE.md` – Architekturvertrag
- `MODE_UNIVERSE.md` – 122-Modi-Landkarte

## Tests

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

## Freigabe

Automatisierter Gesamttest: `GO`. Reale Geräte-/Party-Beta und öffentlicher Release: `NO_GO`, bis alle automatisierten, Geräte-, Gruppen-, Inhalts- und Rechtsprüfungen abgeschlossen sind.
