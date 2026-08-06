# Secret Circle Party Hub

Secret Circle ist eine offline nutzbare Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät.

## Aktueller Umfang

- **45 eingebaute, technisch spielbare Spiele**
- **27 Quick-, Trend- und Viral-Modi**
- **4 Advanced-Spiele**
- Word Imposter
- Smart Party Night für 15–90 Minuten
- eigene Text-Packs
- lokaler No-Code-Game-Creator
- bis zu **40 selbst erstellte Spiele**
- Offline-Core `secret-circle-v29`

## Einfacher Einstieg

Der Party Hub erklärt den Ablauf in drei Schritten:

1. Spieler festlegen
2. Spiel auswählen
3. kurze Regeln lesen und starten

Jeder Hauptbereich besitzt kurze kontextabhängige Hilfen. Spielkarten zeigen Name, Kurzbeschreibung, Spielerzahl, Dauer, Inhaltsmenge und eine klare Aktion.

## Eigenes Spiel erstellen

`creator.html` führt ohne Programmieren durch vier Schritte:

1. Vorlage wählen
2. Name, Icon, Akzent und Gruppe festlegen
3. Kategorien und Karten eintragen
4. prüfen, speichern und direkt testen

Vorlagen:

- Fragen & Aussagen
- Entweder oder
- Erraten & Darstellen
- Challenges
- Story & Kreativität
- Meinung & Debatte

Eigene Spiele lassen sich bearbeiten, kopieren, löschen, exportieren, importieren und direkt im Party Hub spielen. Pro Spiel sind bis zu acht Kategorien und bis zu 200 Karten je Kategorie vorgesehen.

## Start

```bash
python -m http.server 8080
```

- Hub: `/party.html`
- Creator: `/creator.html`
- Word Imposter: `/index.html`
- Advanced: `/advanced.html?game=question-imposter`
- Trend: `/quick-play.html?game=anime-guess`
- Viral: `/quick-play.html?game=guess-the-price`

## Produkt- und Designpläne

- `MODE_UNIVERSE.md`: 122-Modi-Universum
- `TREND_FORMATS.md`: frühere, aktuelle und zukünftige Trendformate
- `ASSET_PLAN.md`: Icons, Illustrationen, Animationen und Produktionsbudgets
- `ARCHITECTURE.md`: Speicher-, Offline-, Datenschutz- und Qualitätsverträge

## Tests

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

Der Stand ist für den vollständigen automatisierten Testlauf vorbereitet. Ein grüner endgültiger Lauf ist noch nicht dokumentiert. Realer Geräte-/Party-Betatest, Merge und öffentlicher Release bleiben deshalb `NO_GO`.
