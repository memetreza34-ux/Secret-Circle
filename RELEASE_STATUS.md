# Release-Status – Secret Circle

Stand: 6. August 2026
Zielrelease: 4.–15. Januar 2027
Arbeitsbranch: `agent/release-foundation-2027`
Draft-PR: #13

## Aktueller Gesamtstatus

**Phase:** technische Release-Grundlage

Secret Circle besitzt bereits einen großen Funktionsumfang. Der Januar-Release wird jedoch nicht nach der Anzahl sichtbarer Spiele bewertet, sondern nach Stabilität, Verständlichkeit, Inhaltsqualität, Offlinefähigkeit, Barrierefreiheit und realen Gruppentests.

## Abgeschlossen

- separater Release-Foundation-Branch
- verbindlicher Fahrplan bis Januar 2027
- qualitätsbasierter Umfang mit Kernrelease, erweitertem Release und Labs
- Offline-Fallback für Query-Routen korrigiert
- kanonische Cache-Schlüssel für dynamische Spiel-URLs
- unbekannte Quick-Game-Routen werden sicher abgelehnt
- unabhängige Imposter-Zuweisung direkt in der Engine
- maximale Zahl von sechs Impostern direkt in der Engine validiert
- Runtime-Monkey-Patching der Rollenlogik entfernt
- Creator-Zeitstempel bei Laden, Export und Import stabilisiert
- Word-Imposter- und Gesamtsicherung verwenden dieselbe 1,5-MB-Grenze
- Backupgrößen werden als UTF-8-Bytes geprüft
- Regressionstests für Offline-Routing, Quick Loader, Rollenfairness, Creator-Zeitstempel und Unicode-Backups
- Changelog und Roadmap aktualisiert

## Lokal geprüft

- JavaScript-Syntax der geänderten Kernmodule
- deterministische Rollenverteilung
- 200 Fairnessstichproben mit wechselnder erster Aufdeckrolle
- Timer- und Runden-Smoke-Test der Word-Imposter-Engine
- Creator-Laden ohne künstliche Änderung von `updatedAt`
- Creator-Export und -Import mit unveränderten Zeitstempeln
- echte Bearbeitung aktualisiert `updatedAt`
- ASCII- und mehrbyteige Unicode-Backups gegen dieselbe Bytegrenze
- atomischer Import-Rollback bei Speicherfehlern

## Externer Releaseblocker

GitHub Actions hat dem aktuellen Job weiterhin keinen Runner zugewiesen. Der Job befindet sich ohne sichtbare Schritte in der Warteschlange beziehungsweise scheitert bei früheren Läufen vor Checkout:

- kein zugewiesener Runner
- kein Runnername
- `steps: []`

Dadurch existiert weiterhin kein vertrauenswürdiger grüner Remote-Lauf. Vor Merge und Release müssen Repository-Actions, Abrechnung beziehungsweise Minutenbudget und Organisationsrichtlinien geprüft werden.

## Nächste technische Prioritäten

1. zentrales Backup-Schemaregister einführen
2. sichtbaren und kontrollierten PWA-Updatefluss ergänzen
3. doppelte Sessionabschlüsse und Statistikschreibvorgänge verhindern
4. Hub klar in Kernspiele, Kategorien und Labs strukturieren
5. gemeinsame Bedienlogik für Pause, Überspringen, Abbruch und nächstes Spiel
6. Kerninhalte redaktionell und nach Altersstufen prüfen
7. Android-, iPhone-, Tablet- und echte Gruppentests

## Releaseentscheidung

- **Öffentlicher Release heute:** Nein
- **Kontrollierte Entwicklungsbeta:** Ja
- **Merge von PR #13 heute:** Nein, Draft bleibt bestehen
- **Releaseziel Januar 2027 erreichbar:** Ja, sofern CI, Geräteprüfungen, Kernspielqualität und rechtliche Angaben rechtzeitig abgeschlossen werden
