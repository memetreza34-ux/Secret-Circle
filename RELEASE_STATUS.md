# Secret Circle Party Hub – Entwicklungs- und Release-Status

Stand: 4. August 2026  
Version: `1.0.0-beta.3`  
Branch: `codex/party-hub-foundation`  
Draft-PR: `#11`

## Bewertung

| Bereich | Fortschritt | Status |
|---|---:|---|
| Word Imposter | 98 % | Kernspiel vollständig für den Testlauf vorbereitet |
| Party-Hub-Struktur | 97 % | Navigation, Katalog, Filter, Spieler, Presets, Favoriten, Verlauf und Daten vorhanden |
| 18 spielbare Spiele | 90 % | technisch umgesetzt, reale Balance- und Verständlichkeitstests fehlen |
| Vier komplexe Spiele | 87 % | vollständige lokale Abläufe und sichere Wiederaufnahme vorhanden |
| Eigene Hub-Packs | 93 % | Editor, Validierung, Spielintegration, Backup und Löschung vorhanden |
| Speicherung und Datenschutz | 96 % | Gesamtsicherung, Rollback, lokale Löschung und transaktionssicherer Sessionabschluss |
| PWA und Offline | 96 % | vollständiger Core `secret-circle-v23`, echter Geräte-Update-Test fehlt |
| Accessibility und Mobile | 87 % | automatische Fokus-, Touch-, Overflow- und Reduced-Motion-Gates vorbereitet |
| Automatisierte Testabdeckung | 94 % | 8 Unit-Dateien, mindestens 19 E2E-Suiten und 5 Browser-/Geräteprojekte vorbereitet |
| Reale Geräte- und Partytests | 20 % | noch nicht erfolgreich dokumentiert |
| Rechtliche Produktionsfreigabe | 45 % | Betreiber-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben fehlen |

## Gewichteter Gesamtstand

- **Word-Imposter-Modul:** etwa **98 %**
- **Party-Hub-Grundlage:** etwa **97 %**
- **18 Spiele als technische Beta:** etwa **90 %**
- **Gesamte gewünschte Party-Hub-Vision:** etwa **84 %**
- **Bereit für den vollständigen automatisierten Testlauf:** etwa **98 %**
- **Bereit für reale Android-/iOS- und Partytests:** etwa **90 %**
- **Bereit für öffentlichen Produktionsrelease:** etwa **77 %**

Die Prozentwerte bewerten Implementierung und Vorbereitung. Sie sind kein Nachweis für erfolgreich ausgeführte Tests.

## Neu abgeschlossen

### Sichere erweiterte Sessions

- aktives Session-Schema Version 2
- unveränderlicher Spieler-Snapshot pro gestarteter Session
- eine spätere Änderung der gemeinsamen Lobby verändert keine laufende Runde
- alte Sessions ohne Snapshot werden kontrolliert migriert oder verworfen
- ungültige Rundenzahl, Spielergruppe oder Packzuordnung wird abgelehnt
- eindeutige Session-ID und idempotente Historien-ID
- der Sessionabschluss schreibt Verlauf und Statistik als gemeinsamen lokalen Datensatz
- bei einem Speicherfehler bleibt die abgeschlossene Session aktiv und wiederherstellbar
- kein stiller Fortschrittsverlust beim Speichern

### Party Hub

- 22 sichtbare Spiele
- 18 spielbare Spiele
- 4 technisch gesperrte Roadmap-Spiele
- Suche und Filter nach Art, Stimmung, Gruppengröße, Altersstufe und Status
- gemeinsame Spieler, Presets, Favoriten und zuletzt gespielt
- Verlauf, Statistik und acht Erfolge
- Reparatur älterer unvollständiger Statistikwerte

### Eigene Hub-Packs

- lokaler Editor für kompatible Spiele
- maximal 20 Packs
- maximal 100 eindeutige Karten pro Pack
- sichere Textausgabe
- Integration in Spieldetail und Pack-Auswahl
- Bestandteil von Export, Import und vollständiger Löschung

### Qualität und Offline

- Offline-Core `secret-circle-v23`
- Regressionstests für Spieler-Snapshot und fehlgeschlagene Verlaufsspeicherung
- Validator und Release-Audit prüfen die neuen Sicherheitsmerkmale
- PR-Beschreibung auf den tatsächlichen Produktstand aktualisiert
- erneuter GitHub-Actions-Versuch durchgeführt; der Job endete weiterhin vor dem ersten Schritt

## Aktuelle Blocker

1. `npm run ci` wurde auf dem endgültigen Commit noch nicht erfolgreich protokolliert.
2. `npm run test:cross-browser` wurde noch nicht erfolgreich protokolliert.
3. GitHub Actions endet weiterhin vor `actions/checkout` mit leerer Schrittliste.
4. Android- und iPhone-/iPad-Installation fehlen als reale Tests.
5. Update einer älteren PWA auf `secret-circle-v23` fehlt.
6. kleiner Partytest mit 3–4 Personen fehlt.
7. großer Partytest mit mindestens 8 Personen fehlt.
8. alle 18 Spiele und mindestens ein eigenes Pack müssen real geprüft werden.
9. redaktionelle Inhalts- und Altersprüfung fehlt.
10. öffentliche rechtliche Angaben fehlen.

## Erforderliche Testbefehle

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci

npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

## Freigabeentscheidung

- Weiterentwicklung: `GO`
- vollständiger lokaler automatisierter Testlauf: `GO`
- kontrollierter Entwickler-Browsertest: `GO_WITH_CONDITIONS`
- realer Geräte- und Party-Betatest: `NO_GO`, bis der automatische Gesamtlauf grün ist
- Merge von Draft-PR #11: `NO_GO`, bis mindestens Syntax, Unit, Validator und Chromium-E2E erfolgreich sind
- öffentlicher Produktionsrelease: `NO_GO`

## Release-Candidate-Schwelle

Ein Release Candidate ist erst erreicht, wenn:

1. alle lokalen CI-Befehle erfolgreich sind,
2. die Browsermatrix erfolgreich ist,
3. GitHub Actions sichtbare Schritte ausführt und grün endet,
4. Android- und iOS-PWA-Tests bestanden sind,
5. ein kleiner und ein großer Partytest bestanden sind,
6. alle 18 Spiele real geprüft wurden,
7. ein eigenes Pack auf Android und iOS erstellt, gespielt, exportiert und importiert wurde,
8. keine kritischen oder hohen Fehler offen sind,
9. Inhaltsprüfung und rechtliche Angaben abgeschlossen sind.
