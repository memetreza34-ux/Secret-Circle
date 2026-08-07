# Release-Status – Secret Circle

Stand: 7. August 2026
Zielrelease: 4.–15. Januar 2027
Arbeitsbranch: `agent/release-foundation-2027`
Draft-PR: #13

## Aktueller Gesamtstatus

**Phase:** technische Release-Grundlage und Informationsarchitektur

Secret Circle besitzt bereits einen großen Funktionsumfang. Der Januar-Release wird jedoch nicht nach der Anzahl sichtbarer Spiele bewertet, sondern nach Stabilität, Verständlichkeit, Inhaltsqualität, Offlinefähigkeit, Barrierefreiheit und realen Gruppentests.

## Abgeschlossen

### Release und Struktur

- separater Release-Foundation-Branch
- verbindlicher Fahrplan und moderne Release-Checkliste bis Januar 2027
- qualitätsbasierter Umfang mit Kernrelease, erweitertem Release und Labs
- Party Hub in **15 Kernspiele**, **13 Erweiterungen** und **17 Labs-Modi** gegliedert
- eigener Reifestufenfilter und sichtbare Qualitätsbadges auf Spielkarten
- Schnellwahlkarten für Kernspiele, Erweiterungen und Labs
- selbst erstellte Spiele werden als Erweiterungen eingeordnet
- neue Struktur reagiert auf Suche, Filter, Favoriten und neu gerenderte Karten
- Katalogverteilung wird durch Unit-, Contract-, Architektur- und Release-Gates geschützt
- Suche, Gruppe, Stimmung, Spielerzahl, Alter, Status, Reifestufe und letzte Ansicht werden lokal gespeichert
- alle gespeicherten Filter lassen sich mit einer Schaltfläche zurücksetzen
- direkte URL-Ansichten haben Vorrang vor einem gespeicherten letzten Bereich
- Alters- und Reifestufenfilter werden als gemeinsame Sichtbarkeitsregel ausgewertet
- Synonyme, bekannte alternative Spielnamen und kleine Tippfehler erzeugen gewichtete Suchvorschläge
- Suchvorschläge unterstützen Maus, Touch, Pfeiltasten, Enter, Escape und Screenreader

### Engine, Session und Daten

- unabhängige Imposter-Zuweisung direkt in der Engine
- maximale Zahl von sechs Impostern direkt in der Engine validiert
- Runtime-Monkey-Patching der Rollenlogik entfernt
- Creator-Zeitstempel bei Laden, Export und Import stabilisiert
- gemeinsames Abschlussregister mit stabilen Session- und Abschluss-IDs
- Creator, klassische Quick-, Mega- und Viral-Engine sind direkt an dasselbe Session-Ledger angebunden
- jede neue Session besitzt sofort eine stabile Session-ID
- ältere aktive Sessions erhalten deterministisch eine kompatible Session-ID
- Verlauf, Spielanzahl, Rundenzahl und Bestwert werden pro Session höchstens einmal aktualisiert
- der alte Mega-/Viral-`plays`-Fehler ist direkt in den Engines beseitigt
- fehlgeschlagene Abschlussbereinigung stellt den aktiven Abschlusszustand wieder her
- temporärer Legacy-Guard und sein globales `Storage.prototype`-Patching wurden vollständig entfernt
- `party-session-controls.js` stellt für Quick-, Mega-, Viral- und Creator-Modi dieselbe Steuerung bereit
- Pause/Fortsetzen, Runde überspringen, bestätigter Abbruch, Wiederholen und nächstes Spiel sind über dieselbe Oberfläche erreichbar
- laufende Timer dieser vier Enginefamilien frieren während einer Pause tatsächlich ein und laufen anschließend mit der Restzeit weiter
- pausierte Rundenaktionen werden mit `inert` und einem sichtbaren Pausenstatus blockiert
- Abbruch entfernt eine aktive Session nur dann endgültig, wenn die Speicherbereinigung erfolgreich war
- die vier schnellen Engines besitzen keine eigenen Intervalltimer mehr

### Backup und Wiederherstellung

- drei Sicherungsformate zentral in `backup-schema-registry.js` registriert
- Word Imposter, Gesamtsicherung und Creator-Bibliothek eindeutig versioniert
- gemeinsames Dateilimit von 1.500.000 UTF-8-Bytes
- maximale Einträge und Creator-Kapazitäten im Register dokumentiert
- Runtime-Verträge werden automatisch gegen das zentrale Register geprüft
- Migrations-, Rollback- und Release-Regeln in `BACKUP_SCHEMAS.md` dokumentiert

### PWA und Offline

- Offline-Fallback für Query-Routen korrigiert
- kanonische Cache-Schlüssel für dynamische Spiel-URLs
- unbekannte Quick-Game-Routen werden sicher abgelehnt
- neue PWA-Versionen werden separat vorbereitet und nicht mehr automatisch aktiviert
- sichtbarer Updatehinweis mit „Jetzt aktualisieren“ und „Später“
- laufende Sessions werden im Updatehinweis ausdrücklich berücksichtigt
- aktiver Offline-Cache wird bei der Promotion nicht mehr vorzeitig gelöscht
- neue Dateien werden zuerst vollständig übernommen; erst danach werden veraltete Cacheeinträge entfernt
- Party-Hub-Reifestufen, gespeicherte Filter, Suchhilfe, Such-Styles und gemeinsame Sessionsteuerung funktionieren auch offline
- der entfernte Legacy-Guard gehört nicht mehr zum Offline-Core

### Qualität

- moderne Struktur-, Architektur-, Contract-, Performance- und Release-Audits
- feste Größenbudgets für Registry, Ledger, gemeinsame Sessionsteuerung, PWA-Update, Release-Struktur, Filterzustand und Suchhilfe
- direkte Genau-einmal-Vertragstests für Creator, Quick, Mega und Viral
- Unit-Test für pausierbaren Timer, Skip, Abbruch, Replay, Next-Game und ARIA-/`inert`-Zustände
- Browserprüfung für echte Timerpause, Fortsetzung, Überspringen, bestätigten Abbruch, Wiederholen und nächstes Spiel vorbereitet
- Regressionstests für Offline-Routing, Quick Loader, Rollenfairness, Creator-Zeitstempel, Unicode-Backups, Sessionabschlüsse, PWA-Updates, Release-Tiers, Filterzustand und Suchhilfe
- Browserprüfungen für Filterwiederherstellung, Reset, URL-Priorität, kombinierte Alters-/Reifestufenfilter sowie Maus- und Tastaturbedienung der Suche vorbereitet
- Validatoren stoppen bei privaten nicht pausierbaren Timern in den vier schnellen Enginefamilien
- Validatoren stoppen bei einer erneuten Einführung des entfernten Legacy-Guards
- alter falscher Release-Audit-Marker `activeSessionKeys` auf den tatsächlichen Runtime-Vertrag `ACTIVE_SESSION_KEYS` korrigiert
- README, Changelog, Roadmap, Release-Checkliste, Architekturvertrag und manueller Testplan auf den aktuellen Foundation-Stand synchronisiert

## Geprüft beziehungsweise als Testvertrag abgesichert

- deterministische Rollenverteilung
- 200 Fairnessstichproben mit wechselnder erster Aufdeckrolle
- Timer- und Runden-Smoke-Test der Word-Imposter-Engine
- Creator-Laden ohne künstliche Änderung von `updatedAt`
- Creator-Export und -Import mit unveränderten Zeitstempeln
- echte Bearbeitung aktualisiert `updatedAt`
- ASCII- und mehrbyteige Unicode-Backups gegen dieselbe Bytegrenze
- atomischer Import-Rollback bei Speicherfehlern
- stabile Abschluss-IDs für alle vier schnellen Enginefamilien
- direkte Genau-einmal-Aktualisierung von Verlauf, `plays`, Runden und Bestwert
- deterministische Migration alter aktiver Mega- und Viral-Sessions
- Wiederherstellung bei fehlgeschlagener Bereinigung des aktiven Abschlusses
- gemeinsamer pausierbarer Timervertrag für Quick, Mega, Viral und Creator
- gemeinsamer Bedienvertrag für Pause, Skip, Abbruch, Replay und nächstes Spiel
- isolierter Controller-Smoke-Test lokal grün
- zentrales Backup-Register und seine Runtime-Verträge
- feste Katalogverteilung 15 Kernspiele / 13 Erweiterungen / 17 Labs
- Filterzustand wird normalisiert; ungültige Werte fallen auf sichere Standards zurück
- nicht verfügbarer oder voller lokaler Speicher wird als Fehler gemeldet
- Suchnormalisierung, Synonyme, Tippfehlertoleranz und maximal sechs Vorschläge

Ein vollständiger grüner Lauf aller Tests ist weiterhin nicht dokumentiert, da der aktuelle GitHub-Actions-Blocker die Remote-Ausführung verhindert. Die neu ergänzte Browserprüfung ist deshalb vorbereitet, aber noch nicht durch einen vertrauenswürdigen Remote-Runner bestätigt.

## Externer Releaseblocker

Der aktuelle GitHub-Actions-Lauf **#1487** für Commit `57f64ab94ea13a49bfb737e4853e57c721e7eba2` wurde am 7. August 2026 bereits nach zwei Sekunden beendet.

Der Job `validate` zeigt erneut:

- `runner_id: 0`
- leeren Runnernamen
- `runner_group_id: 0`
- `steps: []`
- kein Checkout
- kein ausgeführter Repository-Befehl

Damit ist weiterhin **kein Repository-Test fehlgeschlagen**; der Code wurde von GitHub Actions gar nicht ausgeführt. Vor Merge und Release müssen Actions, Abrechnung beziehungsweise Minutenbudget und mögliche Organisationsrichtlinien außerhalb des Repository-Codes korrigiert werden.

## Nächste technische Prioritäten

1. die 15 Kernspiele einzeln nach Regeln, Inhalt, Timer, Wiederaufnahme, Statistik und Accessibility abnehmen
2. Timer über App-Wechsel, Sperrbildschirm und Neuladen korrekt fortsetzen und auf echten Geräten prüfen
3. PWA-Update von einer älteren installierten Version auf echten Geräten prüfen
4. Kerninhalte redaktionell und nach Altersstufen prüfen
5. Android-, iPhone-, Tablet- und echte Gruppentests
6. reproduzierbaren Dependency-Lock erzeugen und CI auf `npm ci` umstellen
7. Branch Protection und verpflichtende Checks aktivieren, sobald Actions wieder läuft

## Releaseentscheidung

- **Öffentlicher Release heute:** Nein
- **Kontrollierte Entwicklungsbeta:** Ja
- **Merge von PR #13 heute:** Nein, Draft bleibt bestehen
- **Releaseziel Januar 2027 erreichbar:** Ja, sofern CI, Geräteprüfungen, Kernspielqualität und rechtliche Angaben rechtzeitig abgeschlossen werden
