# Secret Circle

Secret Circle ist ein lokales Imposter-Partyspiel für drei bis zwanzig Personen. Eine oder mehrere Personen kennen den geheimen Begriff nicht und müssen anhand der Hinweise unauffällig bleiben.

## Start

```bash
python -m http.server 8080
```

Danach `http://localhost:8080` öffnen. Nach dem ersten vollständigen Laden kann die App über den Service Worker offline verwendet und auf unterstützten Geräten installiert werden.

## Funktionen

- drei bis zwanzig eindeutige Spielernamen
- ein bis mehrere Imposter
- sechs integrierte Kategorien und gemischter Modus
- eigene Kategorien im Format `Begriff | Hilfswort`
- optionales neutrales Hilfswort
- geheime Kartenübergabe
- konfigurierbarer Timer von einer bis zehn Minuten
- geheime Abstimmung durch alle Personen
- Imposter-Raterunde nach erfolgreicher Entdeckung
- Punktesystem für Gruppe und Imposter
- Matches mit 1, 3, 5 oder 10 Runden
- Rangliste nach jeder Runde
- Wiederaufnahme einer unterbrochenen Runde
- lokale Speicherung von Einstellungen und zwanzig abgeschlossenen Runden
- Online-/Offline-Anzeige
- installierbare PWA mit Offline-Cache
- keine Anmeldung und keine Serverübertragung

## Getestete Spielengine

Die unabhängige Engine in `game-engine.js` übernimmt:

- Normalisierung und Prüfung der Spielernamen
- Sperre doppelter Namen
- deterministische Zufallsverteilung über einen Seed
- Imposter- und Begriffsverteilung
- Rollenanzeige
- Phasenwechsel und Restzeit
- geheime Abstimmung
- Auflösung und Imposter-Rateschritt
- Punktestand und Match-Fortschritt
- sichere Wiederherstellung gespeicherter Spielstände
- Rundenverlauf

Test:

```bash
node --check app.js
node --check game-engine.js
node --check sw.js
node tests/engine.test.js
python scripts/validate_project.py
```

## Status

- deterministische Engine und Strukturtest: `GO`
- installierbare lokale Offline-PWA: `GO_WITH_CONDITIONS`
- kontrollierter Party-Beta-Test: `GO_WITH_CONDITIONS`
- öffentliche Store- oder Produktveröffentlichung: `NO_GO`

Vor einer öffentlichen Veröffentlichung fehlen reale Tests auf mehreren iOS-/Android-Geräten, Browser- und PWA-Installationsprüfungen, Accessibility- und Usability-Tests, redaktionelle Prüfung aller Begriffe, Alters- und Datenschutzbewertung sowie ein dokumentierter Releaseprozess.
