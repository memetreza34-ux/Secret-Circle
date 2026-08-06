# Release-Status – Secret Circle

Stand: 6. August 2026
Zielrelease: 4.–15. Januar 2027
Arbeitsbranch: `agent/release-foundation-2027`
Draft-PR: #13

## Aktueller Gesamtstatus

**Phase:** technische Release-Grundlage und Informationsarchitektur

Secret Circle besitzt bereits einen großen Funktionsumfang. Der Januar-Release wird jedoch nicht nach der Anzahl sichtbarer Spiele bewertet, sondern nach Stabilität, Verständlichkeit, Inhaltsqualität, Offlinefähigkeit, Barrierefreiheit und realen Gruppentests.

## Abgeschlossen

### Release und Struktur

- separater Release-Foundation-Branch
- verbindlicher Fahrplan bis Januar 2027
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

### Engine und Daten

- unabhängige Imposter-Zuweisung direkt in der Engine
- maximale Zahl von sechs Impostern direkt in der Engine validiert
- Runtime-Monkey-Patching der Rollenlogik entfernt
- Creator-Zeitstempel bei Laden, Export und Import stabilisiert
- gemeinsames Abschlussregister mit stabilen Session- und Abschluss-IDs
- Creator- und klassische Quick-Abschlüsse werden höchstens einmal gezählt
- Mega- und Viral-Abschlüsse werden während ihrer schrittweisen Migration zuverlässig dedupliziert
- Spielanzahl, Rundenzahl, Bestwert und Verlauf werden gemeinsam aktualisiert

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
- Party-Hub-Reifestufen und gespeicherte Filter funktionieren auch offline

### Qualität

- moderne Struktur-, Architektur-, Contract-, Performance- und Release-Audits
- feste Größenbudgets für Registry, Ledger, PWA-Update, Release-Struktur und Filterzustand
- Regressionstests für Offline-Routing, Quick Loader, Rollenfairness, Creator-Zeitstempel, Unicode-Backups, Sessionabschlüsse, PWA-Updates, Release-Tiers und Filterzustand
- Browserprüfungen für Filterwiederherstellung, Reset, URL-Priorität und kombinierte Alters-/Reifestufenfilter vorbereitet
- README, Changelog, Roadmap, Backupvertrag, Releaseumfang und Release-Status aktualisiert

## Lokal geprüft

- JavaScript-Syntax ausgewählter geänderter Kernmodule
- deterministische Rollenverteilung
- 200 Fairnessstichproben mit wechselnder erster Aufdeckrolle
- Timer- und Runden-Smoke-Test der Word-Imposter-Engine
- Creator-Laden ohne künstliche Änderung von `updatedAt`
- Creator-Export und -Import mit unveränderten Zeitstempeln
- echte Bearbeitung aktualisiert `updatedAt`
- ASCII- und mehrbyteige Unicode-Backups gegen dieselbe Bytegrenze
- atomischer Import-Rollback bei Speicherfehlern
- Mega-/Viral-Abschlussguard mit Erststart und wiederholtem Abschluss
- liegengebliebene Session einer anderen Engine wird korrekt ignoriert
- zentrales Backup-Register und seine Runtime-Verträge
- feste Katalogverteilung 15 Kernspiele / 13 Erweiterungen / 17 Labs
- Filterzustand wird normalisiert; ungültige Werte fallen auf sichere Standards zurück
- nicht verfügbarer oder voller lokaler Speicher wird als Fehler gemeldet

## Externer Releaseblocker

Frühere GitHub-Actions-Läufe erhielten weiterhin keinen Runner und blieben ohne sichtbare Schritte. Für den zuletzt geprüften PR-Head wurde kein Workflowlauf zurückgegeben.

Damit existiert weiterhin kein vertrauenswürdiger grüner Remote-Lauf:

- frühere Jobs ohne zugewiesenen Runner
- leerer Runnername
- `steps: []`
- zuletzt geprüfter Head ohne gefundenen Workflowlauf

Vor Merge und Release müssen Repository-Actions, Abrechnung beziehungsweise Minutenbudget und Organisationsrichtlinien geprüft werden.

## Nächste technische Prioritäten

1. Mega- und Viral-Engines direkt auf das Session-Ledger umstellen und den Kompatibilitätsschutz entfernen
2. gemeinsame Bedienlogik für Pause, Überspringen, Abbruch, Wiederholen und nächstes Spiel
3. PWA-Update von einer älteren installierten Version auf echten Geräten prüfen
4. Kernspiele einzeln nach Regeln, Inhalt, Timer, Wiederaufnahme und Accessibility abnehmen
5. Suchbegriffe, Synonyme und Tippfehler besser unterstützen
6. Kerninhalte redaktionell und nach Altersstufen prüfen
7. Android-, iPhone-, Tablet- und echte Gruppentests
8. reproduzierbaren Dependency-Lock erzeugen und CI auf `npm ci` umstellen

## Releaseentscheidung

- **Öffentlicher Release heute:** Nein
- **Kontrollierte Entwicklungsbeta:** Ja
- **Merge von PR #13 heute:** Nein, Draft bleibt bestehen
- **Releaseziel Januar 2027 erreichbar:** Ja, sofern CI, Geräteprüfungen, Kernspielqualität und rechtliche Angaben rechtzeitig abgeschlossen werden
