# Sicherheitsrichtlinie

## Unterstützte Versionen

Während der Beta wird ausschließlich der aktuelle Stand von `1.0.0-beta.3` beziehungsweise der neueste Commit des aktiven Expansionsbranches gepflegt. Frühere Entwicklungsstände erhalten keine separaten Sicherheitskorrekturen.

## Sicherheitsproblem melden

Sicherheitsprobleme nicht mit vollständigen Ausnutzungsdetails in einer öffentlichen Diskussion melden.

Bevorzugter Weg:

1. Repository auf GitHub öffnen.
2. Tab `Security` öffnen.
3. `Report a vulnerability` oder eine private Security Advisory verwenden, sofern aktiviert.
4. betroffene Version, Commit, reproduzierbare Schritte und Auswirkungen angeben.

Vor einem öffentlichen Release muss zusätzlich eine verantwortliche Kontaktmöglichkeit dokumentiert sein.

## Hilfreiche Angaben

- App-Version und Commit
- betroffener Bereich: Party Hub, komplexes Spiel oder Word Imposter
- Gerät, Betriebssystem und Browser
- installierte PWA oder Browser-Tab
- Online- oder Offline-Zustand
- betroffene lokale Daten oder Sicherungsdatei
- minimale reproduzierbare Schritte
- Screenshot oder Video ohne fremde geheime Rollen, Fragen oder Aussagen
- mögliche Auswirkung: Datenverlust, Rollenenthüllung, Skriptausführung, fremder Netzwerkzugriff oder Spielblockade

## Sicherheitsmodell

Secret Circle ist eine statische lokale Pass-and-Play-PWA:

- kein Benutzerkonto,
- keine eigene Server-API,
- keine Analyse-, Werbe- oder Tracking-Dienste,
- Daten im lokalen Browser-Speicher,
- restriktive Content Security Policy,
- Service Worker verarbeitet nur GET-Anfragen derselben Origin,
- dynamische Namen, Aussagen, Kategorien und Ergebnisse werden über Textknoten ausgegeben,
- geplante Spiele sind technisch nicht startbar,
- importierte Gesamtsicherungen besitzen Format-, Schlüssel-, Größen- und JSON-Prüfung,
- fehlgeschlagene Imports stellen den vorherigen Zustand wieder her,
- vollständige Löschung entfernt alle Schlüssel mit Präfix `secret-circle-`,
- komplexe aktive Sessions werden vor Wiederaufnahme grundlegend validiert.

## Geheime Inhalte

Die App reduziert versehentliche Enthüllungen, kann physische Privatsphäre aber nicht erzwingen:

- Word-Imposter-Karten werden bei Fokusverlust verdeckt.
- Question-Imposter-Fragen und Location-Spy-Rollen werden einzeln angezeigt und bewusst weitergegeben.
- Zwei-Wahrheiten-Eingaben besitzen eine verdeckte Übergabestufe.
- Mafia besitzt eine bestätigungspflichtige Moderatoransicht.

Testpersonen müssen das Gerät bei geheimen Inhalten abschirmen. Eine Person mit physischem Zugriff auf das entsperrte Gerät kann lokale Daten oder aktive Sessions untersuchen.

## Gesamtsicherungen

Die exportierte JSON-Datei ist **nicht verschlüsselt**. Sie kann enthalten:

- Spielernamen,
- Preset-Namen,
- Favoriten und Verlauf,
- Statistiken,
- eigene Kategorien,
- aktive Hub- und Imposter-Sessions,
- lokale Einstellungen.

Sicherungsdateien nur bewusst weitergeben und nach Verwendung sicher aufbewahren oder löschen. Der Import darf ausschließlich aus vertrauenswürdigen Quellen erfolgen, obwohl Skriptausführung durch die Daten nicht vorgesehen ist.

## Nicht als Sicherheitslücke eingestuft

- Personen in derselben Runde besitzen physischen Zugriff auf dasselbe Gerät.
- Nutzer können ihre eigenen Browserdaten oder exportierten JSON-Dateien verändern.
- Browser oder Betriebssystem können lokalen Speicher bei Speicherdruck entfernen.
- absichtlich weitergegebene Sicherungen legen ihre gespeicherten Inhalte offen.
- die App verhindert kein absichtliches Beobachten des Bildschirms.
- der Mafia-Moderator sieht konstruktionsbedingt alle Rollen.

Manipulierte lokale Daten dürfen jedoch nicht zu Skriptausführung, fremden Netzwerkzugriffen, dauerhaftem Datenverlust oder einem nicht behebbaren App-Zustand führen.

## Sicherheitsrelevante Prüfungen

Vor Release mindestens:

- CSP auf `index.html`, `party.html` und `advanced.html`,
- Namen, eigene Kategorien und Zwei-Wahrheiten-Aussagen mit Markup-Zeichen,
- manipulierte aktive Sessions,
- ungültige, zu große und fremde Sicherungsdateien,
- Import-Rollback,
- vollständige Datenlöschung,
- Offline-Cache ohne fremde Origins,
- Karten- und Rollenübergabe auf realen Geräten,
- Moderatoransicht in Mafia,
- Abhängigkeiten und GitHub-Actions-Workflow.

## Bearbeitung

Nach einer nachvollziehbaren Meldung:

1. Eingang bestätigen.
2. Schweregrad und Reproduzierbarkeit prüfen.
3. Korrektur auf separatem Branch entwickeln.
4. Engine-, Speicher-, Daten-, Sicherheits- und Browserprüfungen ausführen.
5. Cache-Version bei geänderten Offline-Dateien erhöhen.
6. Changelog und bekannte Einschränkungen aktualisieren.
7. betroffene Beta-Version ersetzen oder zurückziehen.

Eine öffentliche Produktionsfreigabe ist blockiert, solange ein bestätigter kritischer oder hoher Sicherheitsfehler offen ist.
