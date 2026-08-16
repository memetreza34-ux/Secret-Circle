# Secret Circle Party Hub

Secret Circle ist eine offline nutzbare Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät.

## Aktueller Funktionsumfang

- 45 eingebaute technisch spielbare Spiele
- 15 priorisierte Kernspiele für Januar 2027
- 13 spielbare Erweiterungen
- 17 klar gekennzeichnete Labs-Modi
- 27 Quick-, Trend- und Viral-Modi
- 4 Advanced-Spiele
- Smart Party Night
- gemeinsamer lokaler Spielerpool
- Favoriten, Presets, Verlauf, Statistiken und Erfolge
- lokaler No-Code-Game-Creator mit 6 Vorlagen
- bis zu 40 selbst erstellte Spiele
- eigene wiederaufnehmbare Creator-Spielengine
- gespeicherte Katalogfilter und letzte Hub-Ansicht
- Synonym- und Tippfehlersuche mit barrierearmen Vorschlägen
- gemeinsame Steuerung für Pause, Skip, Abbruch, Wiederholen und nächstes Spiel in den schnellen Modi
- pausierbare Timer für Quick-, Mega-, Viral- und Creator-Spiele
- installierbare Offline-PWA
- kontrollierte, sichtbare PWA-Aktualisierungen

„Technisch spielbar“ bedeutet noch nicht automatisch releasefertig. Für Januar 2027 werden Kernspiele, Erweiterungen und experimentelle Modi nach klaren Qualitätskriterien getrennt.

## Zentrale Entwicklungsanleitung

`APP_ENTWICKLUNG_VON_A_BIS_Z.md` beschreibt den vollständigen App-Lifecycle von der ersten Idee bis zur Veröffentlichung und Wartung. Die Anleitung ist als wiederverwendbarer Master-Prozess für Secret Circle und zukünftige App-Projekte gedacht und enthält Produkt-, UX-, Architektur-, Daten-, Sicherheits-, Test-, Accessibility-, Release-, Store-, Rollback- und Wartungsphasen sowie eine aktuelle Secret-Circle-Gap-Liste.

## Releaseziel

- funktionsfertig bis spätestens **30. November 2026**
- Code Freeze am **5. Dezember 2026**
- Release Candidate bis spätestens **15. Dezember 2026**
- öffentlicher Release zwischen **4. und 15. Januar 2027**

Verbindliche Dokumente:

- `APP_ENTWICKLUNG_VON_A_BIS_Z.md`: übergeordneter Prozess von Idee bis Veröffentlichung und Wartung
- `ROADMAP_2027.md`: Zeitplan, Arbeitsphasen und Releaseverbote
- `RELEASE_SCOPE_2027.md`: Kernspiele, Erweiterungen und Labs
- `RELEASE_CHECKLIST.md`: technische, organisatorische, Geräte-, Inhalts- und Gruppentest-Freigabe
- `RELEASE_STATUS.md`: aktueller Entwicklungs- und Blockerstatus
- `BACKUP_SCHEMAS.md`: Sicherungsformate, Versionen, Migrationen und Rollbackregeln

## Übersichtlicher Spielekatalog

Der Party Hub zeigt drei klar getrennte Reifestufen:

- **Kernspiele:** höchste Priorität für Inhalt, Regeln, Offlinebetrieb, Accessibility und reale Gruppentests
- **Erweiterungen:** spielbare zusätzliche Funktionen, die nach den Kernspielen priorisiert werden
- **Labs:** experimentelle Modi in Prüfung, die nicht automatisch als releasefertig gelten

Ein eigener Filter, Schnellwahlkarten und Badges machen diese Stufen im Katalog sichtbar. Selbst erstellte Creator-Spiele werden als Erweiterungen eingeordnet.

Der Hub speichert Suche, Gruppe, Stimmung, Spielerzahl, Alter, Status, Reifestufe und letzte Ansicht lokal. Direkte Links wie `party.html?view=stats` haben Vorrang vor der gespeicherten Ansicht. Über **Filter zurücksetzen** lassen sich alle Katalogeinstellungen gemeinsam löschen.

## Verbesserte Suche

Die Suchhilfe normalisiert Groß- und Kleinschreibung, Umlaute, `ß`, Sonderzeichen und zusätzliche Leerzeichen. Sie kennt außerdem häufige alternative Namen und kleine Tippfehler, zum Beispiel:

- `Werwolf` → Mafia
- `Montagsmaler` → Zeichnen & Raten
- `Stadt Land Fluss` → Buchstaben-Kategorien
- `Tabu` → Nicht sagen!
- `Maifa` → Mafia
- `Impsoter` → Word Imposter

Die Vorschlagsliste ist mit Maus, Touch, Pfeiltasten, Enter und Escape bedienbar und verwendet eine ARIA-Listbox. Suche, Filter und Reifestufen funktionieren auch offline.

## Einheitliche Spielsteuerung

Quick-, Mega-, Viral- und Creator-Modi verwenden denselben Steuerungsruntime `party-session-controls.js`.

Während einer aktiven Session stehen an derselben Stelle bereit:

- **Pause / Fortsetzen**
- **Runde überspringen**
- **Session beenden** mit Bestätigung

Nach einem vollständigen Abschluss stehen bereit:

- **Wiederholen**
- **Nächstes Spiel**
- **Zum Verlauf**

Eine Pause ist nicht nur optisch: Ein gerade laufender Timer friert mit seiner Restzeit ein. Die Rundenaktionen werden währenddessen aus der Bedienung genommen und nach dem Fortsetzen wieder freigegeben. Der gemeinsame Runtime-Layer ist Teil des Offline-Cores.

## Einfacher Einstieg

Der Party Hub erklärt den Ablauf in drei Schritten:

1. Spieler speichern.
2. Spiel oder Reifestufe auswählen.
3. Pack und Rundenzahl festlegen und starten.

Die App benötigt kein Konto und verwendet keine Analyse-, Werbe- oder Tracking-Dienste.

## Eigenes Spiel erstellen

`creator.html` führt ohne Programmieren durch vier Schritte:

1. Vorlage wählen
2. Name, Icon, Akzent und Gruppe festlegen
3. Kategorien und Karten eintragen
4. prüfen, speichern und direkt testen

Vorlagen:

- Fragen & Aussagen
- Entweder oder
- Erraten & Darstellen
- Challenges
- Story & Kreativität
- Meinung & Debatte

Eigene Spiele lassen sich bearbeiten, kopieren, löschen, exportieren, importieren und direkt im Party Hub spielen. Pro Spiel sind bis zu acht Kategorien und bis zu 200 Karten je Kategorie vorgesehen.

## Stabilitätsgrundlage

- Imposterrollen werden unabhängig von der Kartenreihenfolge bestimmt.
- Creator, Quick, Mega und Viral verwenden dasselbe direkte Session-Ledger.
- Jede neue Session besitzt eine stabile ID; ältere aktive Sessions erhalten eine deterministische kompatible ID.
- Verlauf, Spielanzahl, Rundenzahl und Bestwert werden pro Session höchstens einmal aktualisiert.
- Creator, Quick, Mega und Viral verwenden dieselbe Sessionsteuerung und keinen privaten Intervalltimer.
- Ein fehlgeschlagener Sessionabbruch stellt den letzten aktiven Zustand wieder her, statt ihn still zu verlieren.
- Der frühere Mega-/Viral-Kompatibilitätsguard und sein globales Storage-Patching wurden vollständig entfernt.
- Sicherungsdateien werden als UTF-8-Bytes geprüft und sind auf 1,5 MB begrenzt.
- Drei Sicherungsformate sind zentral versioniert.
- Neue PWA-Versionen werden vorbereitet, aber erst nach einem sichtbaren Nutzerklick aktiviert.
- Der bestehende Offline-Cache wird vor erfolgreicher Übernahme der neuen Dateien nicht gelöscht.

## Lokal starten

Die App muss über HTTP statt direkt über `file://` geöffnet werden:

```bash
python -m http.server 8080
```

Danach:

- Party Hub: `http://localhost:8080/party.html`
- Word Imposter: `http://localhost:8080/index.html`
- Game Creator: `http://localhost:8080/creator.html`
- Advanced-Spiel: `http://localhost:8080/advanced.html?game=question-imposter`
- Trend- oder Viral-Spiel: `http://localhost:8080/quick-play.html?game=guess-the-price`

## Qualitätsprüfungen

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci
```

Cross-Browser-Prüfung:

```bash
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

`npm run validate` umfasst Repository-Hygiene, Architektur, Foundation-Verträge, Struktur, Performance und Release-Gates. Die Gates verlangen direkte Genau-einmal-Integration und die gemeinsame Sessionsteuerung für alle vier schnellen Enginefamilien. Sie verhindern sowohl eine erneute Einführung des entfernten Legacy-Guards als auch private nicht pausierbare Engine-Timer.

Die vollständige Freigabe erfolgt anhand von `RELEASE_CHECKLIST.md`; dort werden CI, Engines, 15 Kernspiele, Hub, Backups, PWA, Accessibility, Geräte, Inhalte, Recht und reale Gruppentests einzeln bestätigt.

## Produkt- und Designpläne

- `MODE_UNIVERSE.md`: langfristiges 122-Modi-Universum
- `TREND_FORMATS.md`: frühere, aktuelle und zukünftige Trendformate
- `ASSET_PLAN.md`: Icons, Illustrationen, Animationen und Produktionsbudgets
- `ARCHITECTURE.md`: Speicher-, Offline-, Datenschutz- und Qualitätsverträge

## Aktueller Freigabestatus

Der aktuelle Branch ist für automatisierte Tests vorbereitet. Ein endgültiger grüner Lauf ist noch nicht dokumentiert, weil GitHub Actions weiterhin keinen verlässlichen Runnerlauf mit sichtbaren Schritten liefert. Die zuletzt geprüften Jobs endeten vor dem Checkout mit `runner_id: 0` und `steps: []`. Realer Geräte-/Party-Betatest, Merge und öffentlicher Release bleiben deshalb `NO_GO`.