# Sicherheitsrichtlinie

## Unterstützte Versionen

Während der Beta wird ausschließlich der aktuelle Stand von `1.0.0-beta.3` beziehungsweise der neueste Commit des aktiven Release-Branches gepflegt. Frühere Entwicklungsstände erhalten keine separaten Sicherheitskorrekturen.

## Sicherheitsproblem melden

Sicherheitsprobleme sollten nicht als öffentlich sichtbare Diskussion mit vollständigen Ausnutzungsdetails veröffentlicht werden.

Bevorzugter Weg:

1. Repository auf GitHub öffnen.
2. Tab `Security` öffnen.
3. `Report a vulnerability` beziehungsweise eine private Security Advisory verwenden, sofern diese Funktion für das Repository aktiviert ist.
4. Problem, betroffene Version, genaue Reproduktionsschritte, erwartetes Verhalten und mögliche Auswirkungen angeben.

Falls die private Meldefunktion nicht aktiviert ist, muss vor einem öffentlichen Release eine verantwortliche Kontaktmöglichkeit ergänzt werden.

## Hilfreiche Angaben

- App-Version und Commit
- Gerät, Betriebssystem und Browser
- installierte PWA oder normaler Browser-Tab
- Online- oder Offline-Zustand
- betroffene lokale Daten oder Sicherungsdatei
- minimale reproduzierbare Schritte
- Screenshot oder Video ohne fremde geheime Spielinhalte
- Einschätzung, ob Datenverlust, Rollenenthüllung, Skriptausführung oder eine Blockade des Spiels möglich ist

## Sicherheitsmodell der App

Secret Circle ist eine statische lokale Pass-and-Play-PWA:

- kein Benutzerkonto,
- keine eigene Server-API,
- keine Analyse-, Werbe- oder Tracking-Dienste,
- Spieldaten ausschließlich im lokalen Browser-Speicher,
- Sicherungsexport und -import ausschließlich lokal,
- restriktive Content Security Policy,
- dynamische Namen, Kategorien und Ergebnisse werden vor HTML-Ausgabe escaped,
- importierte Daten werden validiert und in der Größe begrenzt,
- fehlgeschlagene Imports besitzen einen Rollback,
- Service Worker verarbeitet nur GET-Anfragen derselben Origin.

## Nicht als Sicherheitslücke eingestuft

Folgende Eigenschaften sind dokumentierte Produktgrenzen:

- Personen in derselben Runde besitzen physischen Zugriff auf dasselbe Gerät.
- Ein Nutzer kann seine eigenen Browserdaten, lokalen Spielstände oder exportierten Sicherungsdateien verändern.
- Das Betriebssystem oder der Browser kann lokalen Speicher bei Speicherdruck entfernen.
- Eine absichtlich weitergegebene Sicherungsdatei enthält die darin gespeicherten lokalen Namen und Spielinformationen.
- Das Spiel verhindert kein absichtliches Beobachten des Bildschirms durch andere anwesende Personen.

Manipulierte lokale Daten dürfen die App jedoch nicht zur Skriptausführung, zu fremden Netzwerkzugriffen oder zu einem nicht behebbaren Zustand bringen.

## Bearbeitung

Nach Eingang einer nachvollziehbaren Meldung sollte:

1. Empfang bestätigt werden,
2. Schweregrad und Reproduzierbarkeit geprüft werden,
3. eine Korrektur auf einem separaten Branch entstehen,
4. Engine-, Speicher-, Sicherheits- und Browserprüfungen ausgeführt werden,
5. Cache-Version bei geänderten PWA-Dateien erhöht werden,
6. Korrektur im `CHANGELOG.md` dokumentiert werden,
7. betroffene Beta-Version ersetzt oder zurückgezogen werden.

Eine öffentliche Produktionsfreigabe ist blockiert, solange ein bestätigter kritischer oder hoher Sicherheitsfehler offen ist.
