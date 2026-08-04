# Secret Circle

Secret Circle ist ein lokales Imposter-Partyspiel für drei bis zwanzig Personen. Eine oder mehrere Personen kennen den geheimen Begriff nicht und müssen anhand der Hinweise unauffällig bleiben.

**Aktueller Stand:** `1.0.0-beta.3` – umfangreiche Produktionsbeta, noch ohne öffentliche Release-Freigabe.

## Start

```bash
python -m http.server 8080
```

Danach `http://localhost:8080` öffnen. Nach dem ersten vollständigen Laden kann die App offline verwendet und auf unterstützten Geräten installiert werden.

## Funktionen

- drei bis zwanzig eindeutige Spielernamen
- Live-Anzeige der erkannten Personen und des gültigen Imposter-Bereichs
- ein bis maximal sechs Imposter
- unabhängige Rollenverteilung: Die Imposter werden getrennt von der Aufdeckreihenfolge ausgelost
- vierzehn integrierte Kategorien mit 168 Begriffen
- gemischter Modus und eigene Kategorien im Format `Begriff | Hilfswort`
- optionales neutrales Hilfswort
- keine Begriffswiederholung, bis der gewählte Pool aufgebraucht ist
- geheime Kartenübergabe
- automatische Verdeckung einer sichtbaren geheimen Karte bei App-Wechsel oder Fokusverlust
- blockierte Weitergabe, bis eine automatisch verdeckte Karte erneut geöffnet wurde
- optionaler Bildschirm-Wake-Lock während der Diskussionsrunde
- deadline-basierter Timer von einer bis zehn Minuten mit Pause, Hintergrund- und Neulade-Wiederherstellung
- geheime Abstimmung, Schutz vor Selbstwahl und doppelten Stimmen
- begrenzte Stichwahl, Imposter-Ratechance, Punkte, Rangliste und Mehr-Runden-Matches
- lokaler Verlauf jeder abgeschlossenen Runde
- Wiederaufnahme unterbrochener Spiele
- versionierte Migration, beschädigte-Daten-Wiederherstellung und vollständige JSON-Sicherung
- vollständiges Löschen aller lokalen Daten
- installierbare PWA mit 192- und 512-Pixel-PNG-Icons
- vollständiger Offline-Cache `secret-circle-v17` für App, Rollenverteilung, Datenschutz, Inhalte und Schutzmodule
- restriktive Content Security Policy, keine Anmeldung, kein Tracking und keine Serverübertragung von Spieldaten

## Architektur

- `game-engine.js`: deterministische Spielregeln, Timer, Abstimmung, Punkte und Matches
- `role-assignment.js`: unabhängige deterministische Rollenverteilung mit maximal sechs Impostern
- `word-packs.js`: integrierte Kategorien und Begriffe
- `data-store.js`: versionierte Speicherung, Migration, Backup und Wiederherstellung
- `setup-ux.js`: Live-Validierung von Gruppengröße und Imposter-Limit
- `privacy-guard.js`: automatische Verdeckung geheimer Karten und Schutz vor versehentlicher Weitergabe
- `wake-lock.js`: optionaler Bildschirmschutz während der Diskussion
- `runtime-guard.js`: globale Fehleranzeige und sicherer Wechsel auf aktualisierte PWA-Dateien
- `app.js`: Benutzeroberfläche und Ablaufsteuerung
- `sw.js`: Offline-Cache und PWA-Betrieb

## Automatisierte Prüfung

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci
```

Zusätzlicher Browser-Smoke-Test:

```bash
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

Die Prüfungen umfassen unter anderem:

- Engine-, Speicher-, Inhalts-, Rollenverteilungs- und Fuzz-Tests
- unabhängige Rollenverteilung ohne Kopplung an die Aufdeckreihenfolge
- Grenzwerte mit 3–20 Personen und maximal sechs Impostern
- vollständige Desktop- und Mobilspielabläufe
- Timer, Verlauf, Backup, Migration und beschädigte Daten
- Karten-Sichtschutz, Wake Lock, Accessibility und Eingabesicherheit
- Offline-Core, Manifest, Installationsicons und Service-Worker-Aktualisierung
- Chromium-, Firefox-, WebKit-, Android- und iPhone-Smoke-Konfiguration

## Dokumentation

- `RELEASE_STATUS.md` – Fortschritt und offene Blocker
- `RELEASE_CHECKLIST.md` – verbindliche Freigabekriterien
- `MANUAL_TEST_PLAN.md` – reale Geräte- und Partytests
- `DEPLOYMENT.md` – GitHub Pages, Update und Rollback
- `CHANGELOG.md` – Änderungen des Beta-Stands
- `KNOWN_LIMITATIONS.md` – bekannte Grenzen
- `SECURITY.md` – Sicherheitsmodell und Meldeweg
- `CI_TROUBLESHOOTING.md` – Diagnose des GitHub-Actions-Problems
- `privacy.html` – Datenschutzinformationen

## Release-Gate

Ein öffentlicher Release ist erst vorgesehen, wenn:

1. `npm run ci` vollständig erfolgreich läuft,
2. GitHub Actions auf dem endgültigen Commit grün ist,
3. die Rollenverteilung über mehrere reale Runden keine Verbindung zur Aufdeckreihenfolge zeigt,
4. Android- und iOS-Installation, Offline-Start und Update getestet wurden,
5. Karten-Sichtschutz, Timer und Wake Lock auf realen Geräten geprüft wurden,
6. mindestens ein kleiner und ein großer Partytest bestanden sind,
7. keine kritischen oder hohen Fehler offen sind,
8. erforderliche Anbieter-, Kontakt- und Impressumsangaben ergänzt wurden.

## Status

- Funktionsumfang und interne Produktionsstruktur: `GO`
- automatisierter Testumfang: `GO_WITH_EXTERNAL_CI_BLOCKER`
- kontrollierter lokaler Browser-Betatest: `GO_WITH_CONDITIONS`
- reale Android-/iOS- und Partytests: `AUSSTEHEND`
- öffentliche produktive Veröffentlichung: `NO_GO`
