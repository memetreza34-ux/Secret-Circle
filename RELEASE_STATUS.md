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
- Regressionstests für Offline-Routing, Quick Loader, Rollenfairness und Creator-Zeitstempel
- Changelog und Roadmap aktualisiert

## Lokal geprüft

- JavaScript-Syntax der geänderten Kernmodule
- deterministische Rollenverteilung
- 200 Fairnessstichproben mit wechselnder erster Aufdeckrolle
- Timer- und Runden-Smoke-Test der Word-Imposter-Engine
- Creator-Laden ohne künstliche Änderung von `updatedAt`
- Creator-Export und -Import mit unveränderten Zeitstempeln
- echte Bearbeitung aktualisiert `updatedAt`

## Externer Releaseblocker

GitHub Actions startet weiterhin keinen Runner. Der aktuelle Fehler entsteht vor Checkout und vor allen Workflow-Schritten:

- `runner_id: 0`
- kein Runnername
- `steps: []`

Dadurch existiert weiterhin kein vertrauenswürdiger grüner Remote-Lauf. Vor Merge und Release müssen Repository-Actions, Abrechnung beziehungsweise Minutenbudget und Organisationsrichtlinien geprüft werden.

## Nächste technische Prioritäten

1. UTF-8-Bytegrenzen aller Sicherungs- und Importwege vereinheitlichen
2. zentrales Backup-Schemaregister einführen
3. PWA-Updatehinweis und kontrollierte Aktivierung einer neuen Version
4. doppelte Sessionabschlüsse und Statistikschreibvorgänge verhindern
5. Hub klar in Kernspiele, Kategorien und Labs strukturieren
6. gemeinsame Bedienlogik für Pause, Überspringen, Abbruch und nächstes Spiel
7. Kerninhalte redaktionell und nach Altersstufen prüfen
8. Android-, iPhone-, Tablet- und echte Gruppentests

## Releaseentscheidung

- **Öffentlicher Release heute:** Nein
- **Kontrollierte Entwicklungsbeta:** Ja
- **Merge von PR #13 heute:** Nein, Draft bleibt bestehen
- **Releaseziel Januar 2027 erreichbar:** Ja, sofern CI, Geräteprüfungen, Kernspielqualität und rechtliche Angaben rechtzeitig abgeschlossen werden
