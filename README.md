# Secret Circle

Secret Circle ist ein lokales Imposter-Partyspiel für drei bis zwanzig Personen. Eine oder mehrere Personen kennen den geheimen Begriff nicht und müssen anhand der Hinweise unauffällig bleiben.

## Start

```bash
python -m http.server 8080
```

Danach `http://localhost:8080` öffnen. Nach dem ersten vollständigen Laden kann die App offline verwendet und auf unterstützten Geräten installiert werden.

## Funktionen

- drei bis zwanzig eindeutige Spielernamen
- ein bis mehrere Imposter
- fünf integrierte Kategorien und gemischter Modus
- eigene Kategorien im Format `Begriff | Hilfswort`
- ein, drei, fünf oder zehn Runden pro Match
- geheime Kartenübergabe
- konfigurierbarer Diskussionstimer
- geheime Einzelabstimmung am selben Gerät
- Schutz vor Selbststimmen
- automatische Auswertung von Mehrheit und Stimmengleichstand
- Punktesystem für Zivilpersonen und Imposter
- Rangliste nach jeder Runde
- Matchgewinner nach der letzten Runde
- Wiederaufnahme während Kartenverteilung, Diskussion oder Abstimmung
- lokaler Verlauf der letzten zwanzig Runden
- installierbare PWA mit Offline-Cache
- keine Anmeldung und keine Serverübertragung

## Punktelogik

- Wird ein Imposter eindeutig gewählt, erhalten alle Zivilpersonen einen Punkt.
- Weitere nicht gewählte Imposter erhalten ebenfalls einen Punkt.
- Wird kein Imposter eindeutig gewählt, erhalten alle Imposter zwei Punkte.
- Bei Gleichstand wird niemand eindeutig beschuldigt.

## Getestete Spielengine

`game-engine.js` übernimmt:

- validierte Spieler-, Runden- und Imposter-Konfiguration
- deterministische Rollen- und Begriffsverteilung
- Match-ID, Rundennummer und fortlaufende Punktestände
- Diskussion, Abstimmung und Auswertung
- Mehrheits- und Gleichstandsberechnung
- Rangliste und nächste Runde
- sichere Wiederherstellung gespeicherter Spielstände
- Manipulationsprüfung von Stimmen und Punkten

Test:

```bash
node --check app.js
node --check game-engine.js
node --check sw.js
node tests/engine.test.js
python scripts/validate_project.py
```

## Status

- Mehr-Runden-, Abstimmungs- und Punkteengine: `GO`
- installierbare lokale Offline-PWA: `GO_WITH_CONDITIONS`
- kontrollierter Party-Beta-Test: `GO_WITH_CONDITIONS`
- öffentliche Store- oder Produktveröffentlichung: `NO_GO`

Vor einer öffentlichen Veröffentlichung fehlen reale Tests auf mehreren iOS-/Android-Geräten, Browser- und PWA-Installationsprüfungen, Accessibility- und Usability-Tests, redaktionelle Prüfung aller Begriffe, Alters- und Datenschutzbewertung sowie ein dokumentierter Releaseprozess.

Das frühere Archiv im Projekt-Hub bleibt als historische Backfill-Quelle erhalten. Dieses öffentliche Repository enthält keine Secrets, Konten oder `.env`-Dateien.
