# Secret Circle Party Hub – Manueller Testplan

Dieser Plan ergänzt die automatisierten Prüfungen. Für jeden Durchlauf dokumentieren: Version, Commit, Datum, Testperson, Gerät, Betriebssystem, Browser, Installationsmodus, Gruppengröße und Online-/Offline-Zustand.

Bewertung je Test: `BESTANDEN`, `FEHLER` oder `BLOCKIERT`.

## A. Party-Hub-Navigation

Eine Person ohne Erklärung öffnet `party.html`.

Prüfen:

- Start, Spiele, Spieler, Favoriten, Verlauf und Daten werden verstanden,
- „Spielbar“ und „In Arbeit“ werden nicht verwechselt,
- Spielerzahl, Dauer und Kategorien sind schnell auffindbar,
- Suche und Filter funktionieren gemeinsam,
- 22 Einträge, 18 spielbare und 4 gesperrte Spiele werden korrekt angezeigt.

## B. Spieler, Presets und Einstellungen

- 1, 3, 8 und 20 Namen speichern
- Leerzeilen, Sonderzeichen und doppelte Namen eingeben
- Presets erstellen, laden und löschen
- Favoriten setzen und entfernen
- Altersfilter und Standardlänge ändern
- Browser neu laden

Zusätzlich einen Browser-Speicherfehler für Präferenzen simulieren.

Erwartet: Die aktuelle Auswahl bleibt nutzbar, eine Warnung erscheint und nach Neuladen gilt der letzte erfolgreich gespeicherte Wert.

## C. Einfache Hub-Spiele

Mindestens eine Session je Spiel:

- Wahrheit oder Pflicht
- Ich habe noch nie
- Wer würde eher?
- Entweder oder
- Hot Takes
- Nur falsche Antworten
- Paranoia
- Scharade
- Nicht sagen! / Tabu
- Heiße Kartoffel
- Wortkette
- Flaschendrehen
- Würfel & Münze

Prüfen: aktive Person, Kartenwiederholung, Timer, Zufall, Punkte, Verlassen und Verlauf.

## D. Vier komplexe Spiele

### Zwei Wahrheiten, eine Lüge

- drei unterschiedliche Aussagen eingeben
- Lüge markieren
- mischen und verdecken
- abstimmen und auflösen
- neu laden und fortsetzen

### Question Imposter

- mit 4 und 8 Personen
- jede Frage einzeln zeigen und verdecken
- diskutieren und abstimmen
- beide Fragen und den Imposter auflösen

### Location Spy

- Rollen verteilen
- Fragerunde spielen
- Verdächtigenwahl und Ortsratechance testen
- mehrere Packs verwenden

### Mafia

- mit 6, 8 und 12 Personen
- Rollenübergabe und Moderatorbestätigung
- Nachtziel, Schutz, Untersuchung und Tageswahl
- Mafia- und Dorfsieg

## E. Spielergruppe und Session-Snapshot

1. Spielergruppe `Alex, Sam, Mika, Lina` speichern.
2. Question Imposter starten.
3. erste Karte öffnen und wieder verdecken.
4. gemeinsame Lobby auf `Nora, Omar, Pia, Rami` ändern.
5. gespeicherte Session fortsetzen.

Erwartet:

- gespeicherte Session zeigt weiterhin vier ursprüngliche Personen,
- Fragen, Imposter und aktive Person gehören weiter zu Alex, Sam, Mika und Lina,
- neue Namen erscheinen erst in einer neu begonnenen Session.

Denselben Test mit Mafia wiederholen. Rollenübersicht, Nacht- und Tagesauswahl müssen dieselbe ursprüngliche Spielergruppe verwenden.

## F. Sessionlängen und Abschluss

Je eine Session mit 3, 5, 10 und 20 Runden starten.

Prüfen:

- Neuladen vor der ersten Aktion,
- Neuladen mitten in einer Runde,
- Neuladen auf der Zusammenfassung,
- Verlängerung um fünf Runden,
- keine Verlängerung über 20 Runden,
- beschädigte aktive Daten,
- normaler Abschluss erzeugt genau einen Verlaufseintrag.

## G. Speicherfehler beim Sessionabschluss

1. komplexe Session bis zur Zusammenfassung bringen.
2. Hub-Speicherung einmalig fehlschlagen lassen.
3. Abschluss auslösen.
4. Speicherfehler entfernen.
5. Abschluss erneut auslösen.

Erwartet:

- beim ersten Versuch kein Fortschrittsverlust,
- Session bleibt aktiv und sichtbar,
- kein unvollständiger Verlaufseintrag,
- beim zweiten Versuch genau ein Verlaufseintrag,
- Runden und Bestwert stimmen.

## H. Eigene Hub-Kategorien

1. Pack mit zwei Karten versuchen.
2. Pack mit mindestens drei Karten speichern.
3. gleiche Karte mit anderer Großschreibung und kombinierter Unicode-Schreibweise eingeben.
4. gleichnamiges Pack erneut versuchen.
5. Pack auswählen und spielen.
6. Pack löschen.

Erwartet:

- zu kurzes Pack wird abgelehnt,
- visuell gleiche Unicode- und Groß-/Kleinschreibungs-Duplikate werden entfernt,
- doppelter Packname wird blockiert,
- Pack erscheint nach Neuladen,
- ausschließlich eigene Karten werden genutzt,
- normales Löschen entfernt es vollständig.

Danach Speicherfehler beim Hinzufügen und Löschen simulieren. Erwartet: Speicher und Katalog bleiben jeweils vollständig im vorherigen Zustand.

## I. Gesamtsicherung

Vorbereitung:

- Hub-Spieler, Preset und Favorit erstellen
- einfaches Spiel beenden
- eigenes Hub-Pack erstellen
- komplexe Session starten
- eigene Imposter-Kategorie und aktives Imposter-Spiel anlegen

Dann exportieren, alles löschen und importieren.

Erwartet: Alle Bereiche werden wiederhergestellt.

### Mehrbyte- und Byte-Grenze

- Sicherungsdatei mit vielen Umlauten oder anderen Mehrbyte-Zeichen erstellen
- tatsächliche Dateigröße knapp unter 1,5 MB testen
- tatsächliche Dateigröße über 1,5 MB testen

Erwartet:

- unter dem Limit wird validiert,
- über dem Limit wird vor jeder Datenänderung abgelehnt,
- Zeichenanzahl allein entscheidet nicht.

### Import-Rollback

- gültigen Import vorbereiten
- ersten Schreibvorgang einmalig fehlschlagen lassen
- Import auslösen

Erwartet: Alle alten Daten werden vollständig wiederhergestellt und eine klare Rollback-Meldung erscheint.

### Lösch-Rollback

- mehrere lokale Bereiche vorbereiten
- einen Löschvorgang einmalig fehlschlagen lassen
- vollständige Löschung auslösen

Erwartet: Vorherige Daten werden vollständig wiederhergestellt; kein gemischter Teilzustand bleibt bestehen.

## J. Statistik und Erfolge

- zwei Verlaufseinträge desselben Spiels mit unterschiedlichen Runden und Punkten anlegen
- zu niedrige alte Statistikwerte setzen
- Verlauf öffnen

Erwartet: Sessions, Runden und Bestwert werden erhöht, aber bereits höhere Werte nie reduziert.

Zusätzlich negative Werte, unbekannte Spiel-ID und einen Speicherfehler bei der Reparatur testen. Erwartet: sichere Normalisierung, unbekanntes Spiel wird ignoriert und der Hub bleibt bedienbar.

## K. Word Imposter

- 3 und 20 Personen
- 1 bis 6 Imposter
- doppelte Namen, 21 Personen und 7 Imposter
- mindestens 20 Runden zur Rollenverteilung
- Kartenübergabe und Fokusverlust
- Timer, Pause, Hintergrund und Neuladen
- unschuldige Person gewählt
- Imposter gewählt und richtig/falsch geraten
- Gleichstand, Stichwahl und Mehr-Runden-Match

Erwartet: faire Rollen, korrekte Punkte, genau ein Verlaufseintrag pro Runde und keine Sackgasse.

## L. Android-Installation

- aktuelles Android und Chrome
- Installation, Icon und Start im Party Hub
- Offline-Start aller Kernbereiche
- eigenes Pack offline
- Update einer älteren Installation auf Cache `secret-circle-v24`
- aktive Session und Spieler-Snapshot nach Update
- Vibration, Portrait und Landscape

## M. iPhone-/iPad-Installation

- aktuelles Safari
- „Zum Home-Bildschirm“
- Start im Party Hub
- Safe Areas und Bildschirmtastatur
- Offline-Start
- eigene Packs und komplexe Kartenübergabe
- Update auf Cache `secret-circle-v24`
- aktive Spielergruppe nach Update unverändert

## N. Browser und Accessibility

Auf Chrome, Firefox und Safari/WebKit:

- Tastaturbedienung
- sichtbarer Fokus
- Screenreader-Kurztest
- 200-Prozent-Vergrößerung
- reduzierte Bewegung
- hoher Kontrast
- Smartphone und Tablet
- Portrait und Landscape
- keine abgeschnittenen Aktionen
- Touchflächen mindestens 44 × 44 Pixel

## O. Realer Partytest

Mindestens zwei Gruppen:

- 3–4 Personen
- mindestens 8 Personen

Pflichtspiele: Word Imposter, Question Imposter, Location Spy, Mafia, Scharade, Heiße Kartoffel und ein eigenes Hub-Pack.

Dokumentieren: Zeit bis zum Start, benötigte Erklärungen, Übergabeprobleme, Spaß, Länge, Wiederholungswunsch, Blockaden und Fehler.

## Freigaberegel

`GO` nur, wenn alle automatisierten Prüfungen erfolgreich sind, Android und iOS bestanden haben, ein kleiner und ein großer Partytest dokumentiert sind, alle 18 Spiele mindestens einmal real geprüft wurden, keine kritischen oder hohen Fehler offen sind und erforderliche Betreiberinformationen vorliegen.
