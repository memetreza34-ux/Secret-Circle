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
- Stichwahl bei Gleichstand
- Imposter-Raterunde nach erfolgreicher Entdeckung
- Punktesystem für Gruppe und Imposter
- Matches mit 1, 3, 5 oder 10 Runden
- Rangliste nach jeder Runde
- Wiederaufnahme einer unterbrochenen Runde
- lokale Speicherung von Einstellungen und zwanzig abgeschlossenen Runden
- vollständiges Löschen aller lokalen Daten
- Online-/Offline-Anzeige
- installierbare PWA mit Offline-Cache
- Datenschutzseite
- keine Anmeldung, kein Tracking und keine Serverübertragung

## Getestete Spielengine

Die unabhängige Engine in `game-engine.js` übernimmt:

- Normalisierung und Prüfung der Spielernamen
- Sperre doppelter Namen
- deterministische Zufallsverteilung über einen Seed
- Imposter- und Begriffsverteilung
- Rollenanzeige
- Phasenwechsel und Restzeit
- geheime Abstimmung und Stichwahl
- Auflösung und Imposter-Rateschritt
- Punktestand und Match-Fortschritt
- sichere Wiederherstellung gespeicherter Spielstände
- Rundenverlauf

## Lokale Prüfung

```bash
node --check app.js
node --check game-engine.js
node --check sw.js
node tests/engine.test.js
python scripts/validate_project.py
python scripts/release_audit.py
```

## Release-Gate

Ein öffentlicher Release ist nur vorgesehen, wenn:

1. alle Befehle oben erfolgreich laufen,
2. GitHub Actions auf dem Release-Commit grün ist,
3. die PWA auf aktuellen Android- und iOS-Geräten getestet wurde,
4. Offline-Start, Installation, Wiederaufnahme und vollständiges Datenlöschen geprüft wurden,
5. Accessibility und Spielablauf mit echten Testpersonen validiert wurden,
6. alle Begriffe redaktionell geprüft wurden.

Siehe außerdem `RELEASE_CHECKLIST.md` und `privacy.html`.

## Status

- deterministische Engine und Strukturtests: `GO`
- lokale Offline-PWA: `GO_WITH_CONDITIONS`
- kontrollierter Party-Beta-Test: `GO_WITH_CONDITIONS`
- öffentliche produktive Veröffentlichung: `NO_GO`, bis CI und reale Geräteprüfungen dokumentiert erfolgreich sind
