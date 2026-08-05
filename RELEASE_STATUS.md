# Secret Circle Party Hub – Entwicklungs- und Release-Status

Stand: 5. August 2026  
Version: `1.0.0-beta.3`  
Branch: `codex/party-hub-foundation`  
Draft-PR: `#11`

## Bewertung

| Bereich | Fortschritt | Status |
|---|---:|---|
| Word Imposter | 98 % | Kernspiel vollständig für den Testlauf vorbereitet |
| Party-Hub-Struktur | 98 % | Navigation, Katalog, Filter, Spieler, Presets, Favoriten, Verlauf und Daten vorhanden |
| Smart Party Night | 93 % | Zeit-, Stimmungs-, Alters- und Gruppenplanung mit lokalem Fortschritt vorhanden; reale Ablaufprüfung fehlt |
| 18 spielbare Spiele | 91 % | technisch umgesetzt, reale Balance- und Verständlichkeitstests fehlen |
| Vier komplexe Spiele | 88 % | vollständige lokale Abläufe und sichere Wiederaufnahme vorhanden |
| Eigene Hub-Packs | 96 % | Editor, Normalisierung, transaktionssicheres Speichern/Löschen, Backup und Spielintegration vorhanden |
| Speicherung und Datenschutz | 98 % | byte-sichere Gesamtsicherung, Import-/Lösch-Rollback und transaktionssicherer Sessionabschluss |
| PWA und Offline | 97 % | vollständiger Core `secret-circle-v25`, echter Geräte-Update-Test fehlt |
| Accessibility und Mobile | 90 % | responsive Timeline, sechsfach Navigation, Fokus-, Touch-, Overflow- und Reduced-Motion-Gates vorbereitet |
| Automatisierte Testabdeckung | 97 % | 9 Unit-Dateien, mindestens 20 E2E-Suiten und 5 Browser-/Geräteprojekte vorbereitet |
| Reale Geräte- und Partytests | 20 % | noch nicht erfolgreich dokumentiert |
| Rechtliche Produktionsfreigabe | 45 % | Betreiber-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben fehlen |

## Gewichteter Gesamtstand

- **Word-Imposter-Modul:** etwa **98 %**
- **Party-Hub-Grundlage:** etwa **98 %**
- **Smart Party Night:** etwa **93 %**
- **18 Spiele als technische Beta:** etwa **91 %**
- **Gesamte gewünschte Party-Hub-Vision:** etwa **88 %**
- **Bereit für den vollständigen automatisierten Testlauf:** etwa **99 %**
- **Bereit für reale Android-/iOS- und Partytests:** etwa **93 %**
- **Bereit für öffentlichen Produktionsrelease:** etwa **81 %**

Die Prozentwerte bewerten Implementierung und Vorbereitung. Sie sind kein Nachweis für erfolgreich ausgeführte Tests.

## Neu abgeschlossen

### Smart Party Night

- eigener lokaler Planer Version 1
- Zeitbudget mit 15, 30, 45, 60 oder 90 Minuten
- Stimmungen: gemischt, lustig, Wettkampf, tiefer, Chaos, clever und locker
- Gruppengröße und Altersstufe werden berücksichtigt
- Favoriten erhalten einen Empfehlungsbonus
- zuletzt gespielte Titel werden nach Möglichkeit vermieden
- verschiedene Spielgruppen werden bevorzugt kombiniert
- schnelle Spiele werden als Einstieg bevorzugt
- Wettkampf- oder Chaosspiele können als Abschluss priorisiert werden
- jede Station besitzt Begründung, Dauer, Öffnen-, Erledigt- und Überspringen-Aktion
- Fortschritt bleibt über Neuladen und App-Neustart erhalten
- Plan kann fortgesetzt, neu erstellt oder vollständig gelöscht werden
- Party-Night-Daten liegen unter `secret-circle-party-night-v1` und werden automatisch gesichert oder gelöscht

### Design und Struktur

- sechs Navigationspunkte werden auf großen Bildschirmen korrekt als sechs Spalten dargestellt
- neue responsive Party-Night-Timeline
- klarer aktueller Schritt, erledigte und übersprungene Zustände
- sichtbarer Fortschrittsbalken
- mobile Einspaltensteuerung
- stärkere Fokuszustände für Karten und interaktive Zeilen
- Reduced-Motion-Unterstützung
- neues separates, langfristig wartbares Modul `party-night.js`
- neues separates Designmodul `party-night.css`

### Transaktionssichere Datensicherung

- Datenwerkzeug Version 2
- tatsächliche UTF-8-Byte-Grenze von 1,5 MB
- Mehrbyte-Dateien können das Größenlimit nicht über die Zeichenanzahl umgehen
- Import und vollständige Löschung besitzen Rollback
- fehlgeschlagener Rollback wird deutlich gemeldet

### Eigene Hub-Packs

- NFKC-Normalisierung für Unicode-Texte
- doppelte Karten, Packnamen und Pack-IDs werden bereinigt
- Speichern und Löschen verändern den Katalog erst nach erfolgreichem Speichervorgang
- fehlgeschlagene Vorgänge stellen Speicher und Katalog wieder her

### Sichere erweiterte Sessions

- aktives Session-Schema Version 2
- unveränderlicher Spieler-Snapshot
- eindeutige Session- und Historien-IDs
- transaktionssicherer Sessionabschluss
- bei einem Speicherfehler bleibt die Session wiederherstellbar

### Qualität und Offline

- Offline-Core `secret-circle-v25`
- neuer Unit-Test für Planung, Filterung, Fortschritt und Speicherfehler
- neue E2E-Suite für Planerstellung, Spielöffnung, Familienfilter, Abschluss, Löschung und Wiederaufnahme
- Offline-Test erstellt einen Party-Night-Plan ohne Netzwerk
- Runtime-Test prüft Planner-JavaScript und Planner-CSS im Cache
- Validator, Release-Audit und Performancebudget prüfen alle neuen Module

## Aktuelle Blocker

1. `npm run ci` wurde auf dem endgültigen Stand noch nicht erfolgreich protokolliert.
2. `npm run test:cross-browser` wurde noch nicht erfolgreich protokolliert.
3. GitHub Actions endet weiterhin vor `actions/checkout` mit leerer Schrittliste.
4. Android- und iPhone-/iPad-Installation fehlen als reale Tests.
5. Update einer älteren PWA auf `secret-circle-v25` fehlt.
6. Smart Party Night muss mit 15, 30, 45, 60 und 90 Minuten real geprüft werden.
7. kleiner Partytest mit 3–4 Personen fehlt.
8. großer Partytest mit mindestens 8 Personen fehlt.
9. alle 18 Spiele und mindestens ein eigenes Pack müssen real geprüft werden.
10. redaktionelle Inhalts- und Altersprüfung fehlt.
11. öffentliche rechtliche Angaben fehlen.

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
5. Smart Party Night auf beiden Plattformen gespeichert und fortgesetzt wurde,
6. ein kleiner und ein großer Partytest bestanden sind,
7. alle 18 Spiele real geprüft wurden,
8. ein eigenes Pack auf Android und iOS erstellt, gespielt, exportiert und importiert wurde,
9. keine kritischen oder hohen Fehler offen sind,
10. Inhaltsprüfung und rechtliche Angaben abgeschlossen sind.
