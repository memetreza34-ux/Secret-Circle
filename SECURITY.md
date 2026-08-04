# Sicherheitsrichtlinie

## Unterstützte Versionen

Während der Beta wird ausschließlich der neueste Commit des aktiven Release-Branches gepflegt. Frühere Entwicklungsstände erhalten keine separaten Sicherheitskorrekturen.

## Sicherheitsproblem melden

Sicherheitsprobleme sollten nicht öffentlich mit vollständigen Ausnutzungsdetails veröffentlicht werden.

Bevorzugter Weg:

1. Repository auf GitHub öffnen.
2. Tab `Security` öffnen.
3. `Report a vulnerability` beziehungsweise eine private Security Advisory verwenden, sofern aktiviert.
4. Problem, betroffene Version, Reproduktionsschritte, erwartetes Verhalten und mögliche Auswirkungen angeben.

Falls keine private Meldefunktion verfügbar ist, muss vor öffentlichem Release eine verantwortliche Kontaktmöglichkeit ergänzt werden.

## Hilfreiche Angaben

- App-Version und Commit
- Gerät, Betriebssystem und Browser
- installierte PWA oder Browser-Tab
- Online- oder Offline-Zustand
- betroffene lokale Daten oder Sicherungsdatei
- minimale reproduzierbare Schritte
- Screenshot oder Video ohne fremde geheime Spielinhalte
- mögliche Auswirkungen: Datenverlust, Rollenenthüllung, Skriptausführung, unbemerkte Datenmischung oder Spielblockade

## Sicherheitsmodell

Secret Circle ist eine statische lokale Pass-and-Play-PWA:

- kein Benutzerkonto,
- keine eigene Server-API,
- keine Analyse-, Werbe- oder Tracking-Dienste,
- Spieldaten im lokalen Browser-Speicher,
- Sicherungsexport und -import ausschließlich lokal,
- restriktive Content Security Policy,
- dynamische Namen, Kategorien, Packtexte und Ergebnisse werden als Text ausgegeben,
- importierte Daten werden nach Format, Schlüssel, Anzahl und tatsächlicher UTF-8-Byte-Größe validiert,
- Service Worker verarbeitet nur GET-Anfragen derselben Origin.

## Schutz lokaler Transaktionen

### Komplexe Sessions

- eine gestartete Session besitzt eine eindeutige ID und einen Spieler-Snapshot,
- Verlauf und Statistik werden vor dem Entfernen des aktiven Session-Markers gespeichert,
- bei einem Schreibfehler bleibt die Session aktiv,
- eindeutige Historien-IDs verhindern doppelte Abschlüsse.

### Eigene Hub-Packs

- Texte werden Unicode-normalisiert,
- Duplikate werden bereinigt,
- Speichern und Löschen aktualisieren lokalen Speicher und Katalog gemeinsam,
- bei einem Fehler wird der vorherige Zustand wiederhergestellt.

### Gesamtsicherung und Löschung

- die 1,5-MB-Grenze basiert auf tatsächlichen UTF-8-Bytes,
- Mehrbyte-Zeichen können die Grenze nicht umgehen,
- Import und vollständige Löschung arbeiten als lokale Transaktion,
- bei einem Fehler wird der vorherige Zustand wiederhergestellt,
- ein fehlgeschlagener Rollback erzeugt eine gesonderte kritische Meldung.

Diese Maßnahmen reduzieren unbeabsichtigten lokalen Datenverlust. Sie ersetzen keine verschlüsselte Datenbank und keinen Schutz vor einer Person, die das eigene Gerät und den Browser-Speicher bewusst manipuliert.

## Nicht als Sicherheitslücke eingestuft

- Personen derselben Runde besitzen physischen Zugriff auf dasselbe Gerät.
- Nutzer können ihre eigenen Browserdaten oder Sicherungsdateien verändern.
- Browser oder Betriebssystem können lokalen Speicher bei Speicherdruck entfernen.
- eine absichtlich weitergegebene Sicherungsdatei enthält lokale Namen und Spielinformationen im Klartext.
- das Spiel kann absichtliches Beobachten des Bildschirms nicht verhindern.
- es gibt keinen Schutz gegen einen Gerätebesitzer, der Entwicklerwerkzeuge zur Rollenanzeige verwendet.

Manipulierte lokale Daten dürfen jedoch keine Skriptausführung, fremde Netzwerkzugriffe oder einen nicht behebbaren App-Zustand verursachen.

## Besonders relevante Testfälle

Vor einer Sicherheitsfreigabe müssen mindestens bestehen:

- HTML-/Skripttexte in Namen, Imposter-Kategorien und eigenen Hub-Packs,
- ungültige und übergroße Sicherungsdatei,
- Mehrbyte-Datei über der Byte-Grenze,
- simulierter Fehler während Import und Löschung,
- simulierter Fehler während Pack-Speichern und -Löschen,
- simulierter Fehler beim Sessionabschluss,
- beschädigter aktiver Sessiondatensatz,
- Content Security Policy ohne `unsafe-inline` und `unsafe-eval`,
- vollständiger Offline-Start ohne externe Ressourcen.

## Bearbeitung einer Meldung

Nach Eingang einer nachvollziehbaren Meldung:

1. Empfang bestätigen,
2. Schweregrad und Reproduzierbarkeit prüfen,
3. Korrektur auf separatem Branch erstellen,
4. Engine-, Speicher-, Sicherheits- und Browserprüfungen ausführen,
5. Cache-Version bei geänderten PWA-Dateien erhöhen,
6. Korrektur im `CHANGELOG.md` dokumentieren,
7. betroffene Beta-Version ersetzen oder zurückziehen.

Eine öffentliche Produktionsfreigabe ist blockiert, solange ein bestätigter kritischer oder hoher Sicherheitsfehler offen ist.
