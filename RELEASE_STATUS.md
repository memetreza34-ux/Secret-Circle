# Secret Circle Party Hub – Entwicklungs- und Release-Status

Stand: 4. August 2026  
Version: `1.0.0-beta.3`  
Expansionsbranch: `codex/party-hub-foundation`  
Planung: Issue #10

## Neue Produktdefinition

Der Umfang wurde bewusst erweitert. Secret Circle ist nicht mehr nur ein Word-Imposter-Spiel, sondern soll ein klar strukturierter Party-Game-Hub mit vielen lokalen Gruppenspielen werden. Dadurch sinkt der prozentuale Gesamtfortschritt gegenüber der früheren reinen Imposter-Bewertung, obwohl das bestehende Kernspiel fast vollständig ist.

## Gesamtbewertung

| Bereich | Stand | Bewertung |
|---|---:|---|
| Word Imposter | 98 % | stabiles Kernspiel mit Rollen, Timer, Wahl, Punkten, Speicherung und Offline-PWA |
| Party-Hub-Grundstruktur | 90 % | Start, Katalog, Filter, Details, Spieler, Presets, Favoriten, Verlauf und Vollbild-Spielmodus vorhanden |
| Spielbarer Hub-Katalog | 78 % | 14 Spiele technisch spielbar; weitere Inhaltstiefe, Balancing und reale Tests fehlen |
| Geplante komplexe Spiele | 15 % | Two Truths, Question Imposter, Location Spy und Mafia sind transparent geplant, aber noch gesperrt |
| Inhalte und Kategorien | 72 % | mehr als 300 neue Karten plus 168 Imposter-Begriffe; deutlich mehr Packs und redaktionelle Prüfung nötig |
| Speicherung | 82 % | Hub-Spieler, Presets, Favoriten, Verlauf und Statistik lokal; gemeinsames Backup noch nicht integriert |
| PWA und Offline | 90 % | Cache-Version 19 enthält Party Hub und Word Imposter; echter Update-Test fehlt |
| Accessibility und Mobile | 75 % | responsive Struktur und Fokusgrundlagen vorhanden; reale Screenreader- und Gerätetests fehlen |
| Automatisierte Abdeckung | 78 % | Katalog-Unit-Test und Party-Hub-E2E ergänzt; vollständiger erfolgreicher Lauf noch nicht protokolliert |
| Reale Geräte- und Gruppentests | 20 % | neue Hub-Spiele noch nicht mit echten Gruppen dokumentiert getestet |
| Öffentliche rechtliche Freigabe | 45 % | Anbieter-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben fehlen |

## Gewichteter Fortschritt

- **Bestehendes Word-Imposter-Spiel:** etwa **98 %**
- **Party-Hub-Phase 1:** etwa **90 %**
- **Gesamte gewünschte Party-Hub-Vision:** etwa **68 %**
- **Bereit für einen kontrollierten lokalen Browser-Test:** etwa **82 %**
- **Bereit für einen öffentlichen Produktionsrelease:** etwa **65 %**

Diese Werte sind technische Schätzungen. Sie ersetzen keine erfolgreich ausgeführten Tests.

## Neu umgesetzt

### Übersichtlicher Aufbau

- eigene Party-Hub-Seite `party.html`
- Startseite mit Empfehlungen, Schnellstart, Quick Picks und zuletzt gespielt
- Spielekatalog mit Suche
- Filter nach Art, Stimmung, Gruppengröße und Status
- klare Karten mit Spielerzahl, Dauer, Inhalt und Entwicklungsstatus
- Detailansicht mit Regeln und Kategorien
- geplante Spiele sind sichtbar, aber eindeutig gesperrt

### Gemeinsame Funktionen

- lokale Spielerliste
- Host-Presets
- Favoriten
- zuletzt gestartet
- lokaler Verlauf
- Spielstatistik
- zufälliger Schnellstart passend zur Gruppe
- keine Anmeldung oder Serverübertragung

### Vierzehn spielbare Spiele

- Word Imposter
- Wahrheit oder Pflicht
- Ich habe noch nie
- Wer würde eher?
- Entweder oder
- Hot Takes
- Nur falsche Antworten
- Paranoia
- Scharade
- Nicht sagen!
- Heiße Kartoffel
- Wortkette
- Flaschendrehen
- Würfel & Münze

### Spielmechaniken

- Karten ohne unmittelbare Wiederholung
- rotierende aktive Person
- Wahrheit-/Pflicht-Auswahl
- Zwei-Optionen-Entscheidungen
- geheime Paranoia-Fragen mit Zufallsauflösung
- 60-Sekunden-Scharade mit Punkten
- Tabu-Karten mit verbotenen Wörtern
- zufälliger Hot-Potato-Timer
- Wortketten-Timer
- Zufallsauswahl, Münze und Würfel
- Vibration auf unterstützten Geräten

### Qualität

- neuer Katalog-Integritätstest
- neuer Party-Hub-End-to-End-Test
- Syntaxprüfung für Hub-Dateien
- Performancebudget für den erweiterten Offline-Core
- Service-Worker-Cache `secret-circle-v19`
- Word Imposter verlinkt sichtbar zum Party Hub

## Aktuelle Blocker

### 1. Vollständiger Testlauf fehlt

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci

npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

Bis diese Befehle erfolgreich protokolliert sind, kann der neue Hub nicht als vollständig getestet gelten.

### 2. GitHub Actions

Der bekannte externe Runner-Blocker aus Issue #7 muss erneut geprüft werden. Workflows müssen sichtbare Schritte ausführen und auf dem endgültigen Commit grün sein.

### 3. Reale Hub-Tests

Erforderlich sind mindestens:

- Smartphone-Test für Navigation, Filter und Vollbildmodus
- kleine Gruppe mit 3–4 Personen
- große Gruppe mit mindestens 8 Personen
- je eine vollständige Session mit Wahrheit oder Pflicht, Scharade, Nicht sagen!, Heiße Kartoffel und Word Imposter
- Hintergrund-, Sperrbildschirm- und Offline-Test
- Verständlichkeit der Kennzeichnung `Spielbar` und `In Arbeit`

### 4. Inhaltstiefe

Die vorhandenen Karten reichen für den ersten Test. Vor einem öffentlichen Release werden mehr Packs, mehr Karten pro Pack, redaktionelle Prüfung und Altersfilter benötigt.

### 5. Gemeinsame Datensicherung

Das bestehende Word-Imposter-Backup umfasst noch nicht automatisch Hub-Spieler, Presets, Favoriten, Verlauf und Statistik.

### 6. Komplexe Spiele

Noch zu entwickeln:

- Zwei Wahrheiten, eine Lüge
- Question Imposter
- Location Spy
- Mafia
- später optional Wavelength, Draw & Guess und Multi-Device-Räume

## Freigabestatus

- **Weiterentwicklung des Party Hubs:** `GO`
- **Lokaler technischer Test:** `GO_WITH_CONDITIONS`
- **Realer Party-Betatest:** `NO_GO`, bis der komplette automatisierte Testlauf erfolgreich ist
- **Merge in `main`:** `NO_GO`, da der neue Umfang noch nicht vollständig getestet ist
- **Öffentlicher Produktionsrelease:** `NO_GO`

## Nächste Schwelle

Der Party Hub erreicht einen echten Beta-Kandidaten, sobald:

1. alle Unit-, Validator- und E2E-Tests grün sind,
2. Cache-Version 19 offline und beim Update geprüft wurde,
3. mindestens fünf unterschiedliche Hub-Spiele mit echten Gruppen getestet wurden,
4. gemeinsame Hub-Daten in Export, Import und vollständige Löschung integriert sind,
5. mindestens zwei zusätzliche komplexe Spiele vollständig implementiert sind,
6. keine kritischen oder hohen Fehler offen sind.
