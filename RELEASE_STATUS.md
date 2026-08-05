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
| Smart Party Night | 95 % | Planung, lokaler Fortschritt und automatische Erkennung abgeschlossener Spiele vorhanden; reale Ablaufprüfung fehlt |
| 18 spielbare Spiele | 91 % | technisch umgesetzt, reale Balance- und Verständlichkeitstests fehlen |
| Vier komplexe Spiele | 88 % | vollständige lokale Abläufe und sichere Wiederaufnahme vorhanden |
| Eigene Hub-Packs | 96 % | Editor, Normalisierung, transaktionssicheres Speichern/Löschen, Backup und Spielintegration vorhanden |
| Speicherung und Datenschutz | 98 % | byte-sichere Gesamtsicherung, Import-/Lösch-Rollback und transaktionssicherer Sessionabschluss |
| PWA und Offline | 97 % | vollständiger Core `secret-circle-v25`, echter Geräte-Update-Test fehlt |
| Accessibility und Mobile | 92 % | Party-Night-Tastatur-, Touch-, Overflow- und Reduced-Motion-Tests ergänzt |
| Automatisierte Testabdeckung | 98 % | 9 Unit-Dateien, mindestens 21 E2E-Suiten und 5 Browser-/Geräteprojekte vorbereitet |
| Langfristige Wartbarkeit | 94 % | versionierte Module, Architekturvertrag, Performancebudgets und Rollbackregeln vorhanden |
| Reale Geräte- und Partytests | 20 % | noch nicht erfolgreich dokumentiert |
| Rechtliche Produktionsfreigabe | 45 % | Betreiber-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben fehlen |

## Gewichteter Gesamtstand

- **Word-Imposter-Modul:** etwa **98 %**
- **Party-Hub-Grundlage:** etwa **98 %**
- **Smart Party Night:** etwa **95 %**
- **18 Spiele als technische Beta:** etwa **91 %**
- **Gesamte gewünschte Party-Hub-Vision:** etwa **89 %**
- **Bereit für den vollständigen automatisierten Testlauf:** etwa **99 %**
- **Bereit für reale Android-/iOS- und Partytests:** etwa **94 %**
- **Bereit für öffentlichen Produktionsrelease:** etwa **82 %**

Die Prozentwerte bewerten Implementierung und Vorbereitung. Sie sind kein Nachweis für erfolgreich ausgeführte Tests.

## Neu abgeschlossen

### Smart Party Night

- lokaler Planer Version 1
- Zeitbudget mit 15, 30, 45, 60 oder 90 Minuten
- Stimmungen: gemischt, lustig, Wettkampf, tiefer, Chaos, clever und locker
- Gruppengröße und Altersstufe werden berücksichtigt
- Favoriten erhalten einen Empfehlungsbonus
- zuletzt gespielte Titel werden nach Möglichkeit vermieden
- verschiedene Spielgruppen werden bevorzugt kombiniert
- 15 Minuten erzeugt einen fokussierten Ein-Spiel-Plan
- längere Abende enthalten bis zu sechs eindeutige Hauptspiele
- stabile, vorab berechnete Zufallsgewichtung vermeidet widersprüchliche Sortierung
- jede Station besitzt Begründung, Dauer, Öffnen-, Erledigt- und Überspringen-Aktion
- Fortschritt bleibt über Neuladen und App-Neustart erhalten
- abgeschlossene Hub-Spiele werden anhand des Verlaufs automatisch als erledigt markiert
- abgeschlossene Word-Imposter-Runden können den Imposter-Schritt automatisch erfüllen
- Plan kann fortgesetzt, neu erstellt oder nach Bestätigung gelöscht werden
- Party-Night-Daten werden automatisch gesichert und vollständig gelöscht

### Design und Accessibility

- sechs Navigationspunkte werden auf großen Bildschirmen korrekt als sechs Spalten dargestellt
- responsive Party-Night-Timeline
- klarer aktueller Schritt mit `aria-current="step"`
- sichtbare erledigte und übersprungene Zustände
- Fortschrittsbalken
- mobile Einspaltensteuerung
- mindestens 44 × 44 Pixel große Planner-Touchziele
- Tastatur-, Mobile-, Overflow- und Reduced-Motion-E2E-Suite
- stärkere Fokuszustände für Karten und interaktive Zeilen

### Langfristige Architektur

- neues `ARCHITECTURE.md` als Zehn-Jahres-Vertrag
- stabile Spiel- und Speicher-IDs
- versionierte Datenschemata und Migrationsregeln
- reine Logik getrennt von DOM-Orchestrierung
- lokale Transaktions- und Rollbackregeln
- Offline-, Accessibility-, Datenschutz- und Performanceverträge
- klare Erweiterungspunkte für Lokalisierung, Sounds, strukturierte Editoren, Teams und optionalen Online-Modus

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
- Unit-Test für Planung, Filterung, stabile Rangfolge, automatische Verlaufssynchronisierung und Speicherfehler
- E2E-Suiten für Planerstellung, Spielöffnung, Familienfilter, Abschluss, Löschung, Wiederaufnahme und automatische Fortschrittsübernahme
- Offline-Test erstellt einen Party-Night-Plan ohne Netzwerk
- Runtime-Test prüft Planner-JavaScript und Planner-CSS im Cache
- Cross-Browser-Smoke-Test erzeugt einen Party-Night-Plan
- Validator, Release-Audit und Performancebudget prüfen die neuen Module

## Aktuelle Blocker

1. `npm run ci` wurde auf dem endgültigen Stand noch nicht erfolgreich protokolliert.
2. `npm run test:cross-browser` wurde noch nicht erfolgreich protokolliert.
3. GitHub Actions endet weiterhin vor `actions/checkout` mit leerer Schrittliste.
4. Android- und iPhone-/iPad-Installation fehlen als reale Tests.
5. Update einer älteren PWA auf `secret-circle-v25` fehlt.
6. Smart Party Night muss mit 15, 30, 45, 60 und 90 Minuten real geprüft werden.
7. automatische Fortschrittsübernahme muss mit einfachen, komplexen und Word-Imposter-Spielen real geprüft werden.
8. kleiner Partytest mit 3–4 Personen fehlt.
9. großer Partytest mit mindestens 8 Personen fehlt.
10. alle 18 Spiele und mindestens ein eigenes Pack müssen real geprüft werden.
11. redaktionelle Inhalts- und Altersprüfung fehlt.
12. öffentliche rechtliche Angaben fehlen.

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
6. automatische Fortschrittsübernahme real funktioniert,
7. ein kleiner und ein großer Partytest bestanden sind,
8. alle 18 Spiele real geprüft wurden,
9. ein eigenes Pack auf Android und iOS erstellt, gespielt, exportiert und importiert wurde,
10. keine kritischen oder hohen Fehler offen sind,
11. Inhaltsprüfung und rechtliche Angaben abgeschlossen sind.
