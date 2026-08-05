# Secret Circle Party Hub

Offline nutzbare Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät. Word Imposter bleibt als eigenes stabiles Modul erhalten.

**Stand:** `1.0.0-beta.3` · 28 technisch spielbare Spiele · Smart Party Night · Offline-Core `secret-circle-v26` · 122-Modi-Universum.

## Start

```bash
python -m http.server 8080
```

- Hub: `/party.html`
- Imposter: `/index.html`
- Advanced: `/advanced.html?game=question-imposter`
- Quick: `/quick-play.html?game=wavelength`

## Spiele

- **Täuschung:** Word Imposter, Zwei Wahrheiten, Question Imposter, Location Spy, Mafia
- **Fragen:** Wahrheit oder Pflicht, Ich habe noch nie, Wer würde eher?, Entweder oder, Hot Takes, Nur falsche Antworten, Paranoia
- **Darstellen und Audio:** Scharade, Nicht sagen!, Zeichnen & Raten, Geräusche erraten, Stirn-Raten, Melodie summen
- **Tempo und Kreativität:** Heiße Kartoffel, Wortkette, Schnellfeuer, Buchstaben-Kategorien, Nicht lachen!, Gegenstandsjagd, Caption Battle, Wellenlänge
- **Werkzeuge:** Flaschendrehen, Würfel & Münze

## Quick Modes

Zehn Modi teilen eine wiederaufnehmbare Engine mit 3, 5, 10 oder 20 Runden, Spieler-Snapshot, Punkten, Verlauf, Statistik, Offline-Betrieb und mobiler Bedienung.

## Smart Party Night

Automatische Pläne für 15–90 Minuten nach Stimmung, Gruppengröße, Alter, Favoriten und Verlauf. Hub-, Quick-, Advanced- und Word-Imposter-Abschlüsse können den Plan fortschreiben.

## Plattform

Suche, Filter, Spieler, Presets, Favoriten, Verlauf, Statistik, Erfolge, eigene Packs, Gesamtexport, Import, Löschung, versionierte Sessions, Rollback, strikte CSP und keine Trackingdienste.

## 122-Modi-Universum

`MODE_UNIVERSE.md` enthält 28 aktuelle und 94 zukünftige Modi. Neue Spiele verwenden gemeinsame Engine-Familien.

## Dateien

- `party.html` – Hub
- `advanced.html` – komplexe Spiele
- `quick-play.html` – Quick Modes
- `party-trending-catalog.js` – 28-Spiel-Katalog
- `party-quick-modes.js` – Quick-Engine
- `party-night.js` – Spieleabend-Planer
- `party-custom-packs.js` – eigene Packs
- `party-data-tools.js` – Sicherung
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

## Freigabe

- automatisierter Gesamttest: `GO`
- reale Geräte-/Party-Beta: `NO_GO` bis grüne Läufe
- öffentlicher Release: `NO_GO` bis CI, Geräte-, Gruppen-, Inhalts- und Rechtsprüfung abgeschlossen sind
