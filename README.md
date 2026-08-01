# Secret Circle

Lokales Partyspiel für drei oder mehr Personen. Eine oder mehrere Personen sind Imposter und müssen den geheimen Begriff anhand der Hinweise der anderen erraten.

## Start

```bash
python -m http.server 8080
```

Danach `http://localhost:8080` öffnen.

## Enthalten

- frei eingebbare Spielernamen
- vier Kategorien und gemischter Modus
- ein bis drei Imposter
- optionales neutrales Hilfswort
- geheime Kartenübergabe
- Diskussions-Timer
- Rollen- und Begriffsauflösung
- keine Anmeldung und keine Serverübertragung

## Status

- lokaler Funktionstest: `GO`
- kontrollierter Party-Beta-Test: `GO_WITH_CONDITIONS`
- öffentliche produktive Veröffentlichung: `NO_GO`

Das frühere Archiv im Projekt-Hub bleibt vorerst als historische Quelle erhalten. Dieses Repository enthält einen sauberen, API-freien und eigenständig testbaren Produktkern ohne Secrets oder `.env`-Dateien.
