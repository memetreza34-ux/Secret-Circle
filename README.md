# Secret Circle Party Hub

Offline nutzbare Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät. Word Imposter bleibt als eigenes stabiles Modul erhalten.

**Stand:** `1.0.0-beta.3` · Branch `codex/party-hub-foundation` · 28 technisch spielbare Spiele · Smart Party Night · Offline-Core `secret-circle-v26` · 122-Modi-Universum.

## Start

```bash
python -m http.server 8080
```

- Hub: `http://localhost:8080/party.html`
- Imposter: `http://localhost:8080/index.html`
- Advanced: `http://localhost:8080/advanced.html?game=question-imposter`
- Quick: `http://localhost:8080/quick-play.html?game=wavelength`

## Spiele

**Täuschung:** Word Imposter, Zwei Wahrheiten, Question Imposter, Location Spy, Mafia.

**Fragen:** Wahrheit oder Pflicht, Ich habe noch nie, Wer würde eher?, Entweder oder, Hot Takes, Nur falsche Antworten, Paranoia.

**Darstellen und Audio:** Scharade, Nicht sagen!, Zeichnen & Raten, Geräusche erraten, Stirn-Raten, Melodie summen.

**Tempo und Kreativität:** Heiße Kartoffel, Wortkette, Schnellfeuer, Buchstaben-Kategorien, Nicht lachen!, Gegenstandsjagd, Caption Battle, Wellenlänge.

**Werkzeuge:** Flaschendrehen, Würfel & Münze.

## Quick-Mode-Engine

Zehn Modi unterstützen 3, 5, 10 oder 20 Runden, Spieler-Snapshot, Punkte, Verlauf, Statistik, Neulade-Wiederaufnahme, Offline-Betrieb und mobile Bedienung.

## Smart Party Night

Automatische Pläne für 15, 30, 45, 60 oder 90 Minuten nach Stimmung, Gruppengröße, Alter, Favoriten und Verlauf. Abschlüsse aus Hub, Quick, Advanced und Word Imposter können den Plan automatisch fortschreiben.

## Plattform

- Suche und kombinierbare Filter
- gemeinsame Spieler und Presets
- Favoriten, Verlauf, Statistik und Erfolge
- eigene Hub-Packs
- vollständiger Export, Import und Löschung
- versionierte Sessions und Rollback
- strikte CSP und keine Trackingdienste
- installierbare Offline-PWA

## 122-Modi-Universum

`MODE_UNIVERSE.md` enthält 28 aktuelle Spiele und 94 zusätzliche Roadmap-Modi. Neue Spiele verwenden gemeinsame Engine-Familien statt isolierter Codebasen.

## Zentrale Dateien

- `party.html` – Hub
- `advanced.html` – komplexe Spiele
- `quick-play.html` – Quick Modes
- `party-trending-catalog.js` – 28-Spiel-Katalog
- `party-quick-modes.js` – Quick-Engine
- `party-night.js` – Spieleabend-Planer
- `party-custom-packs.js` – eigene Packs
- `party-data-tools.js` – Gesamtsicherung
- `game-engine.js` – Word Imposter
- `sw.js` – Offline-Core v26
- `ARCHITECTURE.md` – Architekturvertrag
- `MODE_UNIVERSE.md` – Produktlandkarte

## Tests

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

Vorbereitet sind Unit-, Fuzz-, E2E-, Offline-, Sicherheits-, Accessibility- und Cross-Browser-Prüfungen für Chromium, Firefox, WebKit, Android und iPhone.

## Freigabe

- automatisierter Gesamttest: `GO`
- reale Geräte-/Party-Beta: `NO_GO` bis grüne Läufe
- öffentlicher Release: `NO_GO` bis CI, echte Geräte, Gruppen-, Inhalts- und Rechtsprüfung abgeschlossen sind

Issue #10 und Draft-PR #11 verfolgen die Expansion.
