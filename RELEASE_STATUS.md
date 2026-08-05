# Secret Circle Party Hub – Entwicklungs- und Release-Status

Stand: 5. August 2026  
Version: `1.0.0-beta.3`  
Branch: `codex/party-hub-foundation`  
Draft-PR: `#11`  
Planung: Issue `#10`

## Gesamtbewertung

| Bereich | Stand | Bewertung |
|---|---:|---|
| Word Imposter | 98 % | vollständiger Kernablauf mit Rollen, Timer, Abstimmung, Punkten, Speicherung und Offline-PWA |
| Party-Hub-Struktur | 98 % | Start, Katalog, Suche, Filter, Details, Spieler, Presets, Favoriten, Verlauf, Daten und Installation vorhanden |
| Spielbarer Katalog | 93 % | 28 Spiele technisch spielbar; reale Balance-, Verständlichkeits- und Langzeittests fehlen |
| Quick-Mode-Engine | 92 % | zehn wiederaufnehmbare Modi mit Punkten, Verlauf, Offline-Betrieb und eigenen Inhalten |
| Advanced-Spiele | 88 % | Zwei Wahrheiten, Question Imposter, Location Spy und Mafia vollständig als lokale Abläufe implementiert |
| Inhalte und Kategorien | 87 % | bestehende Hub-Inhalte, neue Quick-Packs, 168 Imposter-Begriffe und Nutzerpacks; redaktionelle Prüfung nötig |
| Eigene Hub-Packs | 96 % | Editor, Validierung, Katalogintegration, Export, Import und Löschung vorhanden |
| Speicherung und Datensicherung | 98 % | Hub, Party Night, Quick- und Advanced-Sessions, Backup, Rollback und Löschung vorhanden |
| PWA und Offline | 97 % | vollständiger Offline-Core `secret-circle-v26`; echter Update-Test fehlt |
| Accessibility und Mobile | 93 % | Safe Areas, Tastatur, Touch-, Overflow- und Reduced-Motion-Gates; reale Assistive-Technik-Tests fehlen |
| Automatisierte Vorbereitung | 99 % | mindestens zehn Unit-Dateien, mindestens 23 E2E-Suiten und fünf Browser-/Geräteprojekte vorbereitet |
| Langfristige Architektur | 96 % | Architekturvertrag, Größenbudgets und 122-Modi-Universum vorhanden |
| Reale Geräte- und Gruppentests | 20 % | noch nicht dokumentiert auf echten Geräten und mit echten Gruppen durchgeführt |
| Öffentliche rechtliche Freigabe | 45 % | Betreiber-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben fehlen |

## Gewichteter Fortschritt

- **Word-Imposter-Modul:** etwa **98 %**
- **Party-Hub-Grundlage:** etwa **98 %**
- **28 spielbare Spiele als technische Beta:** etwa **93 %**
- **Gesamte 122-Modi-Vision:** etwa **34 % funktional umgesetzt**
- **Bereit für den vollständigen lokalen automatisierten Testlauf:** etwa **99 %**
- **Bereit für reale Android-/iOS- und Partytests:** etwa **94 %**
- **Bereit für einen öffentlichen Produktionsrelease:** etwa **83 %**

Die Prozentwerte bewerten Implementierung und Vorbereitung. Sie sind kein Nachweis für Fehlerfreiheit und ersetzen keine tatsächlich bestandenen Tests.

## Neu abgeschlossen

- Katalog von 22 auf **28 technisch spielbare Spiele** erweitert
- Wellenlänge, Zeichnen & Raten, Schnellfeuer und Geräusche erraten freigeschaltet
- Stirn-Raten, Buchstaben-Kategorien, Nicht lachen!, Melodie summen, Gegenstandsjagd und Caption Battle ergänzt
- gemeinsame Quick-Mode-Seite und wiederaufnehmbare Quick-Session-Engine
- 3, 5, 10 oder 20 Runden
- Spieler-Snapshot, Punkte, Rangliste, Verlauf und Statistik
- ursprüngliche Inhalte für alle zehn Quick Modes
- korrupte Quick-Sessions werden verworfen
- Sicherheitsprüfung für manipulierte Spielernamen
- Tastatur-, Touch-, Overflow- und Reduced-Motion-Tests
- Offline-Core auf `secret-circle-v26` aktualisiert
- 122-Modi-Universum auf 28 spielbare und 94 zukünftige Modi synchronisiert
- genaue Schaltflächen für Quick-, Advanced- und Imposter-Spiele
- Architektur-, Struktur-, Release- und Performance-Gates erweitert

## Aktuelle Blocker

1. `npm run ci` wurde auf dem endgültigen v26-Stand noch nicht erfolgreich protokolliert.
2. `npm run test:cross-browser` wurde noch nicht erfolgreich protokolliert.
3. GitHub Actions muss echte Schritte ausführen und grün enden; Issue #7 verfolgt den externen Runner-Blocker.
4. reale Android-, iPhone-/iPad- und PWA-Update-Tests fehlen.
5. kleiner und großer Partytest fehlen.
6. alle 28 Spiele müssen mindestens einmal real geprüft werden.
7. Quick Modes müssen mit 3, 5, 10 und 20 Runden praktisch geprüft werden.
8. redaktionelle Inhalts- und Altersprüfung fehlt.
9. öffentliche Betreiber-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben fehlen.

## Erforderliche Testbefehle

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci

npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

## Freigabestatus

- **Weiterentwicklung:** `GO`
- **Vollständiger lokaler automatisierter Testlauf:** `GO`
- **Kontrollierter Entwickler-Browsertest:** `GO_WITH_CONDITIONS`
- **Realer Geräte- und Party-Betatest:** `NO_GO`, bis der automatisierte Gesamtlauf erfolgreich ist
- **Merge von Draft-PR #11:** `NO_GO`, bis Unit-, Validator- und Chromium-E2E-Lauf grün dokumentiert sind
- **Öffentlicher Produktionsrelease:** `NO_GO`

## Release-Candidate-Schwelle

Der Party Hub wird erst als Release Candidate bezeichnet, wenn:

1. `npm run ci` vollständig erfolgreich ist,
2. `npm run test:cross-browser` erfolgreich ist,
3. GitHub Actions auf dem endgültigen Commit grün ist,
4. Android- und iOS-Installation sowie Offline-Update auf v26 bestanden sind,
5. ein kleiner und ein großer Partytest bestanden sind,
6. alle 28 Spiele mindestens einmal real getestet wurden,
7. ein eigenes Pack und eine wiederaufgenommene Quick-Session auf Android und iOS geprüft wurden,
8. keine kritischen oder hohen Fehler offen sind,
9. erforderliche öffentliche Betreiberinformationen vorhanden sind.
