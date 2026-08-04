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
| Vier komplexe Spiele | 88 % | vollständige lokale Abläufe und sichere Wiederaufnahme vorhanden |
| Eigene Hub-Packs | 96 % | Editor, Normalisierung, transaktionssicheres Speichern/Löschen, Backup und Spielintegration vorhanden |
| Speicherung und Datenschutz | 98 % | byte-sichere Gesamtsicherung, Import-/Lösch-Rollback und transaktionssicherer Sessionabschluss |
| PWA und Offline | 97 % | vollständiger Core `secret-circle-v24`, echter Geräte-Update-Test fehlt |
| Accessibility und Mobile | 87 % | automatische Fokus-, Touch-, Overflow- und Reduced-Motion-Gates vorbereitet |
| Automatisierte Testabdeckung | 96 % | 8 Unit-Dateien, mindestens 19 E2E-Suiten und 5 Browser-/Geräteprojekte vorbereitet |
| Reale Geräte- und Partytests | 20 % | noch nicht erfolgreich dokumentiert |
| Rechtliche Produktionsfreigabe | 45 % | Betreiber-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben fehlen |

## Gewichteter Gesamtstand

- **Word-Imposter-Modul:** etwa **98 %**
- **Party-Hub-Grundlage:** etwa **97 %**
- **18 Spiele als technische Beta:** etwa **91 %**
- **Gesamte gewünschte Party-Hub-Vision:** etwa **86 %**
- **Bereit für den vollständigen automatisierten Testlauf:** etwa **99 %**
- **Bereit für reale Android-/iOS- und Partytests:** etwa **92 %**
- **Bereit für öffentlichen Produktionsrelease:** etwa **79 %**

Die Prozentwerte bewerten Implementierung und Vorbereitung. Sie sind kein Nachweis für erfolgreich ausgeführte Tests.

## Neu abgeschlossen

### Transaktionssichere Datensicherung

- Datenwerkzeug Version 2
- tatsächliche UTF-8-Byte-Grenze von 1,5 MB
- Mehrbyte-Dateien können das Größenlimit nicht über die Zeichenanzahl umgehen
- frühe Prüfung von `File.size` vor dem vollständigen Einlesen
- einzelne Werte besitzen ebenfalls eine Byte-Grenze
- Import ersetzt lokale Daten vollständig oder stellt den vorherigen Zustand wieder her
- fehlgeschlagener Rollback wird gesondert und deutlich gemeldet
- vollständige Löschung verwendet dieselbe Transaktions- und Rollback-Logik
- Teilzustände nach einem simulierten Löschfehler werden vermieden

### Eigene Hub-Packs

- NFKC-Normalisierung für Unicode-Texte
- doppelte Karten, Packnamen und gespeicherte Pack-IDs werden bereinigt
- Speichern und Löschen verändern den Katalog erst nach erfolgreichem Browser-Speichervorgang
- fehlgeschlagene Schreib- oder Löschvorgänge stellen Speicher und Katalog wieder her
- injizierbarer Manager ermöglicht gezielte Unit-Tests mit simuliertem Speicherfehler

### Sichere erweiterte Sessions

- aktives Session-Schema Version 2
- unveränderlicher Spieler-Snapshot
- eindeutige Session- und Historien-IDs
- transaktionssicherer Sessionabschluss
- bei einem Speicherfehler bleibt die Session aktiv und wiederherstellbar

### Einstellungen und Statistiken

- Hub-Plus Version 5
- Einstellungsfehler werden abgefangen und sichtbar gemeldet
- aktuelle Auswahl bleibt nutzbar, auch wenn sie nicht dauerhaft gespeichert werden konnte
- Statistikreparatur normalisiert negative und ungültige Werte
- unbekannte Spiele werden ignoriert
- fehlgeschlagene Statistik-Speicherung blockiert den Hub nicht
- CSS-Selektor-Fallback für Browser ohne `CSS.escape`

### Qualität und Offline

- Offline-Core `secret-circle-v24`
- Unit-Tests für Custom-Pack-Rollback und Unicode-Duplikate
- E2E-Tests für Mehrbyte-Größenlimit, Import-Rollback und Lösch-Rollback
- E2E-Tests für Einstellungs- und Statistik-Speicherfehler
- Validator und Release-Audit prüfen alle neuen Schutzmechanismen

## Aktuelle Blocker

1. `npm run ci` wurde auf dem endgültigen Stand noch nicht erfolgreich protokolliert.
2. `npm run test:cross-browser` wurde noch nicht erfolgreich protokolliert.
3. GitHub Actions endet weiterhin vor `actions/checkout` mit leerer Schrittliste.
4. Android- und iPhone-/iPad-Installation fehlen als reale Tests.
5. Update einer älteren PWA auf `secret-circle-v24` fehlt.
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
- Merge von Draft-PR #11: `NO_GO`, bis Syntax, Unit, Validator und Chromium-E2E erfolgreich sind
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
