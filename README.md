# Secret Circle

Secret Circle ist ein lokales Imposter-Partyspiel für drei bis zwanzig Personen. Eine oder mehrere Personen kennen den geheimen Begriff nicht und müssen anhand der Hinweise unauffällig bleiben.

**Aktueller Stand:** `1.0.0-beta.3` – umfangreiche Produktionsbeta, noch ohne öffentliche Release-Freigabe.

## Start

```bash
python -m http.server 8080
```

Danach `http://localhost:8080` öffnen. Nach dem ersten vollständigen Laden kann die App über den Service Worker offline verwendet und auf unterstützten Geräten installiert werden.

## Funktionen

- drei bis zwanzig eindeutige Spielernamen
- Live-Anzeige der erkannten Personen und des gültigen Imposter-Bereichs
- ein bis mehrere Imposter
- vierzehn integrierte Kategorien mit 168 Begriffen
- gemischter Modus und eigene Kategorien im Format `Begriff | Hilfswort`
- optionales neutrales Hilfswort
- keine Begriffswiederholung, bis der gewählte Pool aufgebraucht ist
- geheime Kartenübergabe
- automatische Verdeckung einer sichtbaren geheimen Karte bei App-Wechsel oder Fokusverlust
- blockierte Weitergabe, bis eine automatisch verdeckte Karte erneut geöffnet wurde
- optionaler Bildschirm-Wake-Lock während der Diskussionsrunde
- deadline-basierter Timer von einer bis zehn Minuten, der Pause, Hintergrund und Neuladen korrekt übersteht
- geheime Abstimmung durch alle Personen
- Schutz vor Selbstwahl und doppelten Stimmen
- begrenzte Stichwahl bei Gleichstand
- Imposter-Raterunde nach erfolgreicher Entdeckung
- Punktesystem, Rangliste und Matches mit 1, 3, 5 oder 10 Runden
- lokaler Verlauf jeder abgeschlossenen Runde
- Wiederaufnahme einer unterbrochenen Runde
- automatische Migration älterer lokaler Daten und Spielstände
- sichere Wiederherstellung nach beschädigten lokalen Daten
- Export und Import einer vollständigen JSON-Sicherung
- vollständiges Löschen aller lokalen Daten
- installierbare PWA mit 192- und 512-Pixel-PNG-Icons
- vollständiger Offline-Cache `secret-circle-v16` für App, Datenschutz, Inhalte, Setup-, Privatsphäre- und Wake-Lock-Schutz sowie Icons
- globaler Laufzeit-Fehlerschutz und kontrollierter PWA-Update-Neustart
- Datenschutzseite und restriktive Content Security Policy
- keine Anmeldung, kein Tracking und keine Serverübertragung von Spieldaten

## Architektur

- `game-engine.js`: deterministische Spielregeln, Timer, Rollen, Abstimmung, Punkte und Matches
- `word-packs.js`: integrierte Kategorien und Begriffe
- `data-store.js`: versionierte Speicherung, Migration, Backup und Wiederherstellung
- `setup-ux.js`: Live-Validierung von Gruppengröße und Imposter-Limit
- `privacy-guard.js`: automatische Verdeckung geheimer Karten und Schutz vor versehentlicher Weitergabe
- `wake-lock.js`: optionaler Bildschirmschutz gegen Einschlafen während der Diskussion
- `runtime-guard.js`: globale Fehleranzeige und sicherer Wechsel auf aktualisierte PWA-Dateien
- `app.js`: Benutzeroberfläche, Timer-Synchronisierung und Ablaufsteuerung
- `sw.js`: Offline-Cache und PWA-Betrieb

## Automatisierte Prüfung

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npm run check
npm test
npm run validate
npm run test:e2e
```

Oder vollständig:

```bash
npm run ci
```

Zusätzlicher Browser-Smoke-Test mit Chromium, Firefox und WebKit:

```bash
npx playwright install chromium firefox webkit
npm run test:cross-browser
```

Die Prüfungen umfassen:

- Syntaxprüfung aller Laufzeitdateien
- deterministische Engine-, Timer- und Punktetests
- echte Migration älterer Spielstände
- Datenkorruption, Backup-Import und Rollback
- Repository-Hygiene und Offline-Core-Performancebudget
- strukturelle Prüfung von HTML, lokalen Assets, Manifest und Service Worker
- vollständige Desktop- und Mobilspielabläufe
- Grenzwerte mit 3 und 20 Personen sowie mehreren Impostern
- Live-Setup-Hinweise und dynamische Imposter-Grenzen
- automatische Kartenverdeckung, blockierte Weitergabe und sicheres erneutes Öffnen
- Wake-Lock-Anforderung während der Diskussion, Freigabe vor der Abstimmung und sicherer Fallback ohne API
- Mehr-Runden-Matches und nicht wiederholte Begriffe
- Timer-Pause, Hintergrund, Ablauf und Wiederaufnahme nach Neuladen
- Verlauf abgeschlossener Runden
- Offline-Start und vollständigen Service-Worker-Cache
- PWA-Manifest, Installationsmetadaten und reale PNG-Abmessungen
- Tastatur, Fokus, Touchflächen, reduzierte Bewegung und Laufzeitfehler
- Schutz vor HTML-/Skript-Injektion und unsicheren CSP-Einstellungen
- fokussierte Smoke-Tests in Chromium, Firefox, WebKit, Android- und iPhone-Simulation

## Dokumentation

- `CHANGELOG.md` – Änderungen des aktuellen Beta-Stands
- `KNOWN_LIMITATIONS.md` – bewusst dokumentierte Grenzen
- `RELEASE_CHECKLIST.md` – verbindliche Freigabekriterien
- `RELEASE_STATUS.md` – objektiver Fortschritt und offene Blocker
- `MANUAL_TEST_PLAN.md` – reale Geräte- und Partytests
- `DEPLOYMENT.md` – GitHub Pages, Update und Rollback
- `SECURITY.md` – Sicherheitsmodell und Meldeweg
- `CI_TROUBLESHOOTING.md` – Diagnose des aktuellen GitHub-Actions-Problems
- `privacy.html` – Datenschutzinformationen für Nutzerinnen und Nutzer

## Release-Gate

Ein öffentlicher Release ist nur vorgesehen, wenn:

1. `npm run ci` vollständig erfolgreich läuft,
2. GitHub Actions auf dem endgültigen Release-Commit grün ist,
3. die PWA auf aktuellen Android- und iOS-Geräten getestet wurde,
4. Offline-Start, Installation, Update, Wiederaufnahme, Backup und vollständiges Datenlöschen geprüft wurden,
5. automatische Kartenverdeckung und blockierte Weitergabe bei App-Wechsel auf realen Geräten geprüft wurden,
6. Wake Lock und Fallback auf mindestens einem unterstützten und einem nicht unterstützten Gerät geprüft wurden,
7. Accessibility und Spielablauf mit echten Testpersonen validiert wurden,
8. alle Begriffe redaktionell geprüft wurden,
9. erforderliche Anbieter-, Kontakt- und Impressumsangaben ergänzt wurden.

## Status

- Funktionsumfang und interne Produktionsstruktur: `GO`
- automatisierter Testumfang: `GO_WITH_EXTERNAL_CI_BLOCKER`
- kontrollierter lokaler Browser-Betatest: `GO_WITH_CONDITIONS`
- reale Android-/iOS- und Partytests: `AUSSTEHEND`
- öffentliche produktive Veröffentlichung: `NO_GO`, bis CI, reale Geräteprüfungen und rechtliche Angaben dokumentiert erfolgreich sind
