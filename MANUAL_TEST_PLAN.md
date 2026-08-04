# Secret Circle Party Hub – Manueller Testplan

Dieser Plan ergänzt die automatisierten Prüfungen. Für jeden Durchlauf dokumentieren: Version, Commit, Datum, Testperson, Gerät, Betriebssystem, Browser, Installationsmodus, Gruppengröße und Online-/Offline-Zustand.

Bewertung je Test: `BESTANDEN`, `FEHLER` oder `BLOCKIERT`.

## A. Party-Hub-Navigation

### A1 – Erster Eindruck

Eine Person ohne Erklärung öffnet `party.html`.

Erwartet:

- Start, Spiele, Spieler, Favoriten, Verlauf und Daten werden verstanden,
- „Spielbar“ und „In Arbeit“ werden nicht verwechselt,
- Spielerzahl, Dauer und Kategorien sind schnell auffindbar,
- Word Imposter und komplexe Spiele sind eindeutig erreichbar.

### A2 – Katalog

- Suche nach Titel, Beschreibung und Kategorie
- Filter nach Art, Stimmung, Gruppe, Altersstufe und Status kombinieren
- Filter zurücksetzen
- 22 Katalogeinträge zählen

Erwartet: 18 spielbare und 4 gesperrte Spiele; keine falsche oder leere Karte.

## B. Spieler und Presets

- 1, 3, 8 und 20 Namen speichern
- Leerzeilen, Sonderzeichen und doppelte Namen eingeben
- drei Presets erstellen, laden und löschen
- Favoriten setzen und entfernen
- Browser neu laden

Erwartet: eindeutige lokale Daten, verständliche Mindestspielerblockade und vollständige Wiederherstellung.

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

Prüfen:

- aktive Person rotiert,
- Karten wiederholen sich nicht unmittelbar,
- Timer und Zufallsergebnisse sind verständlich,
- Punkte und Verlauf stimmen,
- Verlassen beendet oder speichert die Session nachvollziehbar.

## D. Zwei Wahrheiten, eine Lüge

1. drei Personen speichern,
2. Session starten,
3. drei unterschiedliche Aussagen eingeben,
4. Lüge markieren,
5. Gerät weitergeben,
6. Gruppe abstimmen lassen,
7. nächste Person starten,
8. neu laden und fortsetzen.

Erwartet: private Eingabe bleibt verborgen, Reihenfolge wird gemischt, Auflösung stimmt und Punktestand bleibt erhalten.

## E. Question Imposter

Mit 4 und 8 Personen testen.

Erwartet:

- genau eine Person erhält die andere Frage,
- jede Frage wird einzeln angezeigt,
- Übergabe verdeckt die Frage,
- Diskussion und Wahl sind verständlich,
- Auflösung zeigt beide Fragen und den Imposter.

## F. Location Spy

Mit mindestens vier Personen:

- Rollen privat verteilen,
- Fragenrunde durchführen,
- einmal Verdächtigen wählen,
- einmal den Spion den Ort raten lassen,
- mehrere Packs testen.

Erwartet: genau ein Spion, ein gemeinsamer Ort, sechs Ortsoptionen und korrekte Auflösung.

## G. Mafia

Mit 6, 8 und 12 Personen:

- Rollen privat öffnen,
- Moderatorbestätigung,
- Nachtziel eintragen,
- Schutz und Untersuchung prüfen,
- Tageswahl eintragen,
- bis Mafia- oder Dorfsieg spielen.

Erwartet: Rollen bleiben geschützt, eliminierte Personen werden nicht erneut angeboten und Siegbedingungen enden das Spiel zuverlässig.

## H. Spielergruppe und Session-Snapshot

### H1 – Lobbyänderung während Question Imposter

1. Spielergruppe `Alex, Sam, Mika, Lina` speichern.
2. Question Imposter starten.
3. erste private Karte anzeigen und wieder verdecken.
4. zum Party Hub wechseln.
5. gemeinsame Lobby auf `Nora, Omar, Pia, Rami` ändern.
6. gespeicherte Session erneut öffnen.

Erwartet:

- Fortsetzen zeigt vier gespeicherte Personen,
- erste und folgende Karten verwenden weiterhin Alex, Sam, Mika und Lina,
- der Imposter gehört zur ursprünglichen Spielergruppe,
- neue Lobby-Namen tauchen in der laufenden Session nicht auf.

### H2 – Mafia-Snapshot

1. Mafia mit sechs Personen starten.
2. alle Rollen verteilen.
3. Lobby im Hub vollständig ändern.
4. Mafia fortsetzen.

Erwartet:

- Rollenübersicht besitzt weiterhin genau die ursprünglichen sechs Personen,
- Nacht- und Tagesauswahl verwenden dieselbe Spielergruppe,
- keine Rolle fehlt und keine neue Person wird eingefügt.

### H3 – Neue Session nach Lobbyänderung

Nach Abschluss oder bewusstem Verwerfen eine neue Session starten.

Erwartet: Die neue Session verwendet die aktuelle Lobby. Nur die alte Session bleibt an ihren Spieler-Snapshot gebunden.

## I. Sessionlängen und Wiederaufnahme

Je eine komplexe Session mit 3, 5, 10 und 20 Runden starten.

Prüfen:

- Neuladen vor der ersten Aktion,
- Neuladen mitten in einer Runde,
- Neuladen auf der Zusammenfassung,
- Verlängerung um fünf Runden,
- keine Verlängerung über 20 Runden,
- beschädigten lokalen Sessiondatensatz simulieren.

Erwartet: gültige Sessions werden fortgesetzt; ungültige werden verständlich verworfen.

## J. Transaktionssicherer Abschluss

1. komplexe Session bis zur Zusammenfassung bringen.
2. normalen Abschluss durchführen.
3. Verlauf und Statistik prüfen.
4. denselben Abschluss durch einen simulierten Speicherfehler blockieren.
5. kontrollieren, dass die Session sichtbar und aktiv bleibt.
6. Speicherfehler entfernen und erneut abschließen.

Erwartet:

- bei Erfolg genau ein Verlaufseintrag,
- bei Fehler kein Verlaufseintrag und kein Fortschrittsverlust,
- erneuter Versuch speichert genau einmal,
- aktiver Marker wird erst nach erfolgreichem Speichern entfernt,
- Runden, Sessions und Bestwert stimmen.

## K. Eigene Hub-Kategorien

1. Datenbereich öffnen.
2. kompatibles Spiel auswählen.
3. Pack mit zwei Karten versuchen.
4. Pack mit mindestens drei Karten speichern.
5. doppelte Karte in anderer Großschreibung hinzufügen.
6. gleichnamiges Pack erneut versuchen.
7. Pack im Spieldetail auswählen und spielen.
8. Pack löschen.

Erwartet:

- zu kurzes Pack wird abgelehnt,
- Duplikate werden entfernt,
- doppelter Packname wird blockiert,
- Pack erscheint nach Neuladen,
- ausschließlich eigene Karten werden genutzt,
- Löschen entfernt es vollständig.

Zusätzlich HTML-, Skript- und sehr lange Texte eingeben. Erwartet: reine Textausgabe ohne Skriptausführung.

## L. Word Imposter

### L1 – Grenzen

- 3 Personen mit 1 und 2 Impostern
- 20 Personen mit 6 Impostern
- doppelte Namen, 21 Personen und 7 Imposter

### L2 – Faire Rollen

Mindestens 20 Runden mit denselben sechs Personen protokollieren.

Erwartet: Aufdeckreihenfolge verrät die Rollen nicht; verschiedene Personen können Imposter sein.

### L3 – Vollständiger Ablauf

- Kartenübergabe und Fokusverlust
- Timer, Pause, Hintergrund und Neuladen
- unschuldige Person gewählt
- Imposter gewählt, richtig und falsch geraten
- Gleichstand und Stichwahl
- Mehr-Runden-Match

Erwartet: korrekte Punkte, genau ein Verlaufseintrag pro Runde und keine Sackgasse.

## M. Gesamtsicherung

1. Spieler, Preset und Favorit erstellen.
2. einfaches Hub-Spiel beenden.
3. eigenes Hub-Pack erstellen.
4. komplexe Session starten.
5. eigene Imposter-Kategorie und aktives Imposter-Spiel anlegen.
6. Gesamtsicherung exportieren.
7. alle lokalen Daten löschen.
8. Sicherung importieren.

Erwartet: Hub, Eigene Hub-Kategorien, Präferenzen, Verlauf, aktive Session und Imposter-Daten werden wiederhergestellt.

Zusätzlich testen:

- ungültiges JSON,
- falsches Format,
- Datei über 1,5 MB,
- mehr als 100 Schlüssel,
- simulierten Speicherfehler.

## N. Android-Installation

- aktuelles Android und Chrome
- Installation über Browser
- App-Name und Icon
- Start direkt im Party Hub
- Offline-Start
- Question Imposter offline
- eigenes Pack offline
- Word Imposter offline
- Update einer älteren Installation auf Cache `secret-circle-v23`
- aktive Session und Spieler-Snapshot nach Update
- Hintergrundtimer, Vibration, Portrait und Landscape

## O. iPhone-/iPad-Installation

- aktuelles Safari
- Teilen → „Zum Home-Bildschirm“
- Start direkt im Party Hub
- Safe Areas
- Tastatur und Eingabefeld-Zoom
- Offline-Start
- komplexe Kartenübergabe
- eigenes Pack offline
- Fallback ohne Wake Lock
- Update auf Cache `secret-circle-v23`
- aktive Spielergruppe nach Update unverändert

## P. Browser und Accessibility

Auf Chrome, Firefox und Safari/WebKit:

- Tastaturbedienung
- sichtbarer Fokus
- Screenreader-Kurztest
- 200-Prozent-Vergrößerung
- reduzierte Bewegung
- hoher Kontrast
- kleine Smartphone-Breite
- große Schrift
- keine abgeschnittenen Modale oder Aktionen
- Touchflächen mindestens 44 × 44 Pixel

## Q. Inhalt und Altersfilter

- familienfreundlicher Filter
- „bis ab 12“-Filter
- alle Inhalte
- mindestens 50 zufällige Karten
- alle Question-Imposter-Paare
- alle Location-Spy-Orte
- Mafia-Regeltexte

Dokumentieren: unklare Formulierungen, Dopplungen, ungeeignete Altersstufe, Schwierigkeit und falsche Dauerangaben.

## R. Realer Partytest

Mindestens zwei Gruppen:

- 3–4 Personen
- mindestens 8 Personen

Pflichtspiele:

- Word Imposter
- Question Imposter
- Location Spy
- Mafia
- Scharade
- Heiße Kartoffel
- ein eigenes Hub-Pack

Dokumentieren: Zeit bis zum Start, benötigte Erklärungen, Übergabeprobleme, Spaß, Länge, Wiederholungswunsch, Blockaden und Fehler.

## Freigaberegel

`GO` nur, wenn alle automatisierten Prüfungen erfolgreich sind, Android und iOS bestanden haben, ein kleiner und ein großer Partytest dokumentiert sind, alle 18 Spiele mindestens einmal real geprüft wurden, keine kritischen oder hohen Fehler offen sind und erforderliche Betreiberinformationen vorliegen.
