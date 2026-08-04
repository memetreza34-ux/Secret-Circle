# Secret Circle Party Hub – Entwicklungs- und Release-Status

Stand: 4. August 2026  
Version: `1.0.0-beta.3`  
Expansionsbranch: `codex/party-hub-foundation`  
Draft-PR: `#11`  
Planung: Issue `#10`

## Gesamtbewertung

| Bereich | Stand | Bewertung |
|---|---:|---|
| Word Imposter | 98 % | vollständiger Kernablauf mit fairer Rollenverteilung, Timer, Wahl, Punkten, Speicherung und Offline-PWA |
| Party-Hub-Struktur | 96 % | Start, Katalog, Suche, Filter, Details, Spieler, Presets, Favoriten, Verlauf, Daten und Installation vorhanden |
| Spielbarer Katalog | 88 % | 18 Spiele technisch umgesetzt; reale Balance-, Verständlichkeits- und Langzeittests fehlen |
| Komplexe Spiele | 82 % | Zwei Wahrheiten, Question Imposter, Location Spy und Mafia vollständig als lokale Abläufe implementiert |
| Inhalte und Kategorien | 80 % | mehr als 390 Hub-Inhalte plus 168 Imposter-Begriffe; mehr Tiefe und redaktionelle Prüfung nötig |
| Speicherung und Datensicherung | 94 % | Hub-Daten, aktive Sessions, vollständiger Export/Import, Rollback und komplette Löschung vorhanden |
| PWA und Offline | 94 % | Party Hub als Installationsstart und vollständiger Cache `secret-circle-v21`; echter Update-Test fehlt |
| Accessibility und Mobile | 84 % | responsive Struktur, Fokusgrundlagen und automatische Tests; reale Screenreader- und Gerätetests fehlen |
| Automatisierte Abdeckung | 90 % | sieben Unit-Dateien, mindestens 17 E2E-Suiten und fünf Cross-Browser-Projekte vorbereitet; Gesamtlauf nicht protokolliert |
| Reale Geräte- und Gruppentests | 20 % | noch nicht dokumentiert mit echten Android-/iOS-Geräten und Gruppen durchgeführt |
| Öffentliche rechtliche Freigabe | 45 % | Anbieter-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben fehlen |

## Gewichteter Fortschritt

- **Word-Imposter-Modul:** etwa **98 %**
- **Party-Hub-Grundlage:** etwa **96 %**
- **18 spielbare Spiele als technische Beta:** etwa **88 %**
- **Gesamte gewünschte Party-Hub-Vision:** etwa **80 %**
- **Bereit für den vollständigen lokalen automatisierten Testlauf:** etwa **96 %**
- **Bereit für reale Android-/iOS- und Partytests:** etwa **86 %**
- **Bereit für einen öffentlichen Produktionsrelease:** etwa **73 %**

Die Prozentwerte bewerten den implementierten Projektstand. Sie sind kein Nachweis für Fehlerfreiheit und ersetzen keine ausgeführten Tests.

## Neu abgeschlossen

### Katalog und Navigation

- 22 sichtbare Spiele
- 18 spielbare Spiele
- 4 eindeutig gesperrte Roadmap-Spiele
- Suche und Filter nach Art, Stimmung, Gruppengröße, Altersstufe und Status
- klare Spielerzahl, Dauer, Kategorien und Inhaltsmenge
- Party Hub ist der neue installierte PWA-Startpunkt

### Vier neue komplexe Spiele

- Zwei Wahrheiten, eine Lüge
- Question Imposter
- Location Spy
- Mafia mit Moderatoransicht, Nachtaktionen, Tageswahl und Siegprüfung

### Plattformfunktionen

- gemeinsame lokale Spielerliste
- Host-Presets
- Favoriten und zuletzt gespielt
- Verlauf und Statistik
- acht Erfolge
- Standard-Sessionlänge
- Alterspräferenzen
- installierbare PWA
- Wiederaufnahme aktiver komplexer Sessions

### Daten und Datenschutz

- gemeinsame Gesamtsicherung für Hub und Word Imposter
- Importformat- und Größenprüfung
- Rollback bei fehlgeschlagenem Import
- vollständige Löschung aller `secret-circle-*`-Daten
- keine Anmeldung, kein Tracking und keine appgesteuerte Serverübertragung

### Qualität

- Offline-Core `secret-circle-v21`
- 22-Spiele-Katalogtest
- E2E-Suiten für alle vier komplexen Spiele
- E2E-Suiten für Backup, Import, ungültige Dateien und Datenlöschung
- Offline-Test für Question Imposter
- Cross-Browser-Smoke-Test für Hub und komplexe Spiele
- aktualisierte Struktur-, Release- und Performance-Gates

## Aktuelle Blocker

### 1. Vollständiger Testlauf fehlt

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci

npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

Bis beide Befehle erfolgreich protokolliert sind, ist der Hub nicht als getestet bestätigt.

### 2. GitHub Actions

Der bekannte externe Runner-Blocker aus Issue #7 muss erneut geprüft werden. Ein öffentlicher Release benötigt sichtbare Workflow-Schritte und einen grünen Lauf auf dem endgültigen Commit.

### 3. Reale Geräte

Erforderlich:

- aktuelles Android-Gerät mit Chrome
- aktuelles iPhone oder iPad mit Safari
- Installation und Start über `party.html`
- Offline-Start aller Spielarten
- Update von einer älteren Cache-Version auf `secret-circle-v21`
- Hintergrund, Sperrbildschirm, Safe Areas, Tastatur und Rotation

### 4. Reale Partytests

Mindestens:

- Gruppe mit 3–4 Personen
- Gruppe mit mindestens 8 Personen
- vollständige Sessions in Word Imposter, Question Imposter, Location Spy, Mafia, Scharade und Heiße Kartoffel
- Prüfung der Regelverständlichkeit ohne Entwicklerhilfe

### 5. Inhalte

Vor öffentlicher Veröffentlichung:

- mehr Karten pro besonders häufigem Spiel
- redaktionelle Prüfung auf Dopplungen und unklare Formulierungen
- systematische Altersprüfung
- reale Bewertung von Schwierigkeit, Länge und Gruppengröße

### 6. Rechtliche Angaben

Verantwortliche Person, Kontakt, Hosting-Anbieter und gegebenenfalls Impressum müssen für das konkrete öffentliche Angebot ergänzt werden.

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
4. Android- und iOS-Installation sowie Offline-Update bestanden sind,
5. ein kleiner und ein großer Partytest bestanden sind,
6. alle 18 Spiele mindestens einmal real getestet wurden,
7. keine kritischen oder hohen Fehler offen sind,
8. erforderliche öffentliche Anbieterinformationen vorhanden sind.
