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
- eigene wiederaufnehmbare Creator-Spielengine
- Offline-Core `secret-circle-v30`

„Technisch spielbar“ bedeutet noch nicht automatisch releasefertig. Für Januar 2027 werden Kernspiele, Erweiterungen und experimentelle Modi nach klaren Qualitätskriterien getrennt.

## Releaseziel

- funktionsfertig bis spätestens **30. November 2026**
- Code Freeze am **5. Dezember 2026**
- Release Candidate bis spätestens **15. Dezember 2026**
- öffentlicher Release zwischen **4. und 15. Januar 2027**

Verbindliche Dokumente:

- `ROADMAP_2027.md`: Zeitplan, Arbeitsphasen und Releaseverbote
- `RELEASE_SCOPE_2027.md`: Kernspiele, Erweiterungen und Labs
- `RELEASE_CHECKLIST.md`: abschließende technische und organisatorische Freigabe
- `RELEASE_STATUS.md`: aktueller Entwicklungs- und Blockerstatus

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

Die dedizierte Creator-Spielengine unterstützt 3, 5, 10 oder 20 Runden, lokale Wiederaufnahme, Spieler-Snapshots, Punkte, Verlauf und Statistik. Erratenspiele besitzen eine geschützte Begriffsansicht vor der gemeinsamen Runde.

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
- eigenes Spiel: `/quick-play.html?game=<custom-game-id>`

## Produkt- und Designpläne

- `MODE_UNIVERSE.md`: langfristiges 122-Modi-Universum
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

Der aktuelle Branch ist für automatisierte Tests vorbereitet. Ein endgültiger grüner Lauf ist noch nicht dokumentiert, weil GitHub Actions derzeit vor dem ersten sichtbaren Workflow-Schritt endet. Realer Geräte-/Party-Betatest, Merge und öffentlicher Release bleiben deshalb `NO_GO`.

## Aktuelle technische Verbesserung

Offline-Navigationen mit Query-Parametern, beispielsweise `quick-play.html?game=...`, verwenden nun den richtigen gecachten Seiteneinstieg statt auf eine unpassende Startseite zurückzufallen. Ein eigener Regressionstest schützt dieses Verhalten innerhalb des bestehenden Cachevertrags `secret-circle-v30`.
