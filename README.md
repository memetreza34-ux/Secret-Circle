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
- vierzehn integrierte Kategorien mit 168 Begriffen
- gemischter Modus und eigene Kategorien im Format `Begriff | Hilfswort`
- optionales neutrales Hilfswort
- keine Begriffswiederholung, bis der gewählte Pool aufgebraucht ist
- geheime Kartenübergabe
- konfigurierbarer Timer von einer bis zehn Minuten
- geheime Abstimmung durch alle Personen
- begrenzte Stichwahl bei Gleichstand
- Imposter-Raterunde nach erfolgreicher Entdeckung
- Punktesystem für Gruppe und Imposter
- Matches mit 1, 3, 5 oder 10 Runden
- Rangliste nach jeder Runde
- Wiederaufnahme einer unterbrochenen Runde
- lokale Speicherung von Einstellungen und zwanzig abgeschlossenen Runden
- automatische Migration älterer lokaler Daten
- sichere Wiederherstellung nach beschädigten lokalen Daten
- Export und Import einer vollständigen JSON-Sicherung
- vollständiges Löschen aller lokalen Daten
- Online-/Offline-Anzeige
- installierbare PWA mit Offline-Cache
- Datenschutzseite und restriktive Content Security Policy
- keine Anmeldung, kein Tracking und keine Serverübertragung

## Architektur

- `game-engine.js`: deterministische Spielregeln, Rollen, Abstimmung, Punkte und Matches
- `word-packs.js`: integrierte Kategorien und Begriffe
- `data-store.js`: versionierte Speicherung, Migration, Backup und Wiederherstellung
- `app.js`: Benutzeroberfläche und Ablaufsteuerung
- `sw.js`: Offline-Cache und PWA-Betrieb

## Automatisierte Prüfung

```bash
npm install
npm run check
npm test
npm run validate
npm run test:e2e
```

`npm test` prüft sowohl die Spielengine als auch Migration, Datenkorruption, Backup-Import und Rollback. Die Playwright-Tests decken Desktop- und Mobilabläufe, Accessibility, Wiederaufnahme, Mehr-Runden-Matches, Datenlöschung und Sicherungswiederherstellung ab.

## Release-Gate

Ein öffentlicher Release ist nur vorgesehen, wenn:

1. `npm run ci` vollständig erfolgreich läuft,
2. GitHub Actions auf dem Release-Commit grün ist,
3. die PWA auf aktuellen Android- und iOS-Geräten getestet wurde,
4. Offline-Start, Installation, Update, Wiederaufnahme, Backup und vollständiges Datenlöschen geprüft wurden,
5. Accessibility und Spielablauf mit echten Testpersonen validiert wurden,
6. alle Begriffe redaktionell geprüft wurden.

Siehe außerdem `RELEASE_CHECKLIST.md` und `privacy.html`.

## Status

- deterministische Engine, Speicher- und Strukturtests: `GO`
- lokale Offline-PWA: `GO_WITH_CONDITIONS`
- kontrollierter Party-Beta-Test: `GO_WITH_CONDITIONS`
- öffentliche produktive Veröffentlichung: `NO_GO`, bis CI und reale Geräteprüfungen dokumentiert erfolgreich sind
