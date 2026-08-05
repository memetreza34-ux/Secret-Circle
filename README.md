# Secret Circle Party Hub

Offline nutzbare Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät.

**Stand:** `1.0.0-beta.3` · 28 Spiele · Smart Party Night · Offline-Core `secret-circle-v26` · 122-Modi-Roadmap.

## Start

```bash
python -m http.server 8080
```

- `/party.html` – Hub
- `/index.html` – Word Imposter
- `/advanced.html?game=question-imposter` – Advanced
- `/quick-play.html?game=wavelength` – Quick Mode

## Funktionen

- 28 technisch spielbare Spiele
- zehn wiederaufnehmbare Quick Modes
- vier Advanced-Spiele
- Smart Party Night für 15–90 Minuten
- Spieler, Presets, Favoriten, Verlauf, Statistik und Erfolge
- eigene Packs
- vollständiger Export, Import und Löschung
- versionierte Sessions und Rollback
- Offline-PWA ohne Trackingdienste

## Zentrale Dateien

`party-trending-catalog.js`, `party-quick-modes.js`, `party-night.js`, `party-custom-packs.js`, `party-data-tools.js`, `game-engine.js`, `sw.js`, `ARCHITECTURE.md` und `MODE_UNIVERSE.md`.

## Tests

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

## Freigabe

Automatisierter Gesamttest: `GO`. Realer Betatest und öffentlicher Release bleiben bis zu grünen automatisierten, Geräte-, Gruppen-, Inhalts- und Rechtsprüfungen `NO_GO`.
