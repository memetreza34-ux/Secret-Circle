# Secret Circle Party Hub – Manueller Testplan

Dieser Plan ergänzt die automatisierten Prüfungen. Für jeden Durchlauf dokumentieren: Version, Commit, Datum, Testperson, Gerät, Betriebssystem, Browser, Installationsmodus, Gruppengröße und Online-/Offline-Zustand.

Bewertung: `BESTANDEN`, `FEHLER` oder `BLOCKIERT`.

## A. Party-Hub-Navigation

### A1 – Erster Eindruck

Eine Testperson ohne Erklärung öffnet `party.html`.

Erwartet:

- Start, Spiele, Spieler, Favoriten, Verlauf und Daten werden verstanden,
- „Spielbar“ und „In Arbeit“ werden nicht verwechselt,
- Spielerzahl, Dauer und Kategorien sind schnell auffindbar,
- Word Imposter ist eindeutig erreichbar.

### A2 – Katalog

- Suche nach Titel, Beschreibung und Kategorie
- Filter nach Art, Stimmung, Gruppe, Altersstufe und Status kombinieren
- Filter zurücksetzen
- Katalog mit 22 Spielen prüfen

Erwartet: 18 spielbare und 4 gesperrte Spiele; keine leere oder falsche Karte.

## B. Spieler und Presets

- 1, 3, 8 und 20 Namen speichern
- Leerzeilen und doppelte Namen eingeben
- drei Presets erstellen, laden und löschen
- Favoriten setzen und entfernen
- Browser neu laden

Erwartet: eindeutige lokale Daten, korrekte Mindestspielerblockade und vollständige Wiederherstellung.

## C. Einfache Hub-Spiele

Mindestens je eine vollständige Session:

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

1. Drei Personen speichern.
2. 3-Runden-Session starten.
3. Drei unterschiedliche Aussagen eingeben.
4. eine Lüge markieren.
5. Gerät weitergeben.
6. Gruppe abstimmen lassen.
7. nächste Person starten.
8. während Runde 2 neu laden und fortsetzen.

Erwartet:

- private Eingabe bleibt verborgen,
- Reihenfolge wird gemischt,
- Auflösung zeigt die richtige Lüge,
- Punktestand und Rundenzahl bleiben erhalten.

## E. Question Imposter

Mit 4 und 8 Personen testen.

Erwartet:

- genau eine Person erhält eine abweichende Frage,
- jede Frage wird nur einzeln angezeigt,
- Übergabe verdeckt die Frage,
- Diskussion und Wahl sind ohne zusätzliche Erklärung verständlich,
- Auflösung zeigt beide Fragen und den Imposter,
- Verteilung wirkt über mehrere Runden zufällig.

## F. Location Spy

Mit mindestens vier Personen:

- Rollen privat verteilen,
- Fragenrunde durchführen,
- einmal Verdächtigen wählen,
- einmal den Spion den Ort raten lassen,
- mehrere Kategorien testen.

Erwartet: genau ein Spion, ein gemeinsamer Ort, sechs Ortsoptionen und korrekte Auflösung.

## G. Mafia

Mit 6, 8 und 12 Personen testen.

- Rollen privat öffnen
- Moderatorbestätigung
- Nachtziel eintragen
- mit Arzt eine Person retten
- Detektivergebnis prüfen
- Tageswahl eintragen
- bis Mafia- oder Dorfsieg spielen

Erwartet:

- Rollen bleiben vor der Gruppe verborgen,
- Moderatoransicht ist klar gekennzeichnet,
- eliminierte Personen werden nicht erneut angeboten,
- Nacht- und Tagestexte sind verständlich,
- Siegbedingung beendet das Spiel zuverlässig.

## H. Sessionlängen und Wiederaufnahme

Je eine komplexe Session mit 3, 5, 10 und 20 Runden starten.

Prüfen:

- Neuladen vor der ersten Aktion,
- Neuladen mitten in einer Runde,
- Neuladen auf der Zusammenfassung,
- „Weitere 5 Runden“ bei 5 und 15 Runden,
- keine Verlängerung über 20 Runden,
- neue Session verwirft die vorherige nur nach bewusster Aktion.

## I. Word Imposter

### I1 – Grenzen

- 3 Personen, 1 und 2 Imposter
- 20 Personen, 6 Imposter
- doppelte Namen, 21 Personen, 7 Imposter

### I2 – Faire Rollen

Mindestens 20 Runden mit denselben sechs Personen protokollieren.

Erwartet: Aufdeckreihenfolge verrät die Rollen nicht; verschiedene Personen können Imposter sein.

### I3 – vollständiger Ablauf

- Kartenübergabe und Fokusverlust
- Timer, Pause, Hintergrund und Neuladen
- unschuldige Person gewählt
- Imposter gewählt, richtig und falsch geraten
- Gleichstand und Stichwahl
- Mehr-Runden-Match

Erwartet: korrekte Punkte, genau ein Verlaufseintrag pro Runde und keine Sackgasse.

## J. Gesamtsicherung

1. Hub-Spieler, Preset und Favorit erstellen.
2. Hub-Session beenden.
3. komplexe Session starten und pausieren.
4. eigene Imposter-Kategorie speichern.
5. aktives Imposter-Spiel erstellen.
6. Gesamtsicherung exportieren.
7. alle lokalen Daten löschen.
8. Sicherung importieren.

Erwartet: Hub, Präferenzen, Verlauf, aktive Session und Imposter-Daten werden wiederhergestellt.

Zusätzlich testen:

- ungültiges JSON,
- falsches Sicherungsformat,
- Datei über 1,5 MB,
- mehr als 100 Schlüssel,
- simulierten Speicherfehler.

Erwartet: Ablehnung ohne Datenverlust beziehungsweise vollständiger Rollback.

## K. Android-Installation

- aktuelles Android und Chrome
- Installation über Browser
- App-Name und Icon
- Start direkt im Party Hub
- Offline-Start
- Question Imposter offline
- Word Imposter offline
- Update einer älteren Installation auf Cache `secret-circle-v21`
- Hintergrundtimer und Vibration
- Portrait und Landscape

## L. iPhone-/iPad-Installation

- aktuelles Safari
- Teilen → „Zum Home-Bildschirm“
- Start direkt im Party Hub
- Safe Areas
- Tastatur und Eingabefeld-Zoom
- Offline-Start
- komplexe Kartenübergabe
- Fallback ohne Wake-Lock-Unterstützung
- Update auf Cache `secret-circle-v21`

## M. Browser und Accessibility

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

## N. Inhalt und Altersfilter

- familienfreundlicher Filter
- „bis ab 12“-Filter
- alle Inhalte
- mindestens 50 zufällige Karten aus verschiedenen Spielen
- alle Question-Imposter-Paare
- alle Location-Spy-Orte
- Mafia-Regeltexte

Dokumentieren:

- unklare Formulierungen,
- Dopplungen,
- ungeeignete Altersstufe,
- zu leichte oder zu schwere Karten,
- falsche Dauer- oder Gruppengrößenangabe.

## O. Realer Partytest

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

Dokumentieren:

- Zeit bis zum ersten Spielstart,
- benötigte Erklärungen,
- Missverständnisse bei Übergabe oder Moderatoransicht,
- Spaß, Länge und Wiederholungswunsch,
- Blockaden, Verzögerungen und Fehler.

## Freigaberegel

`GO` nur, wenn alle automatisierten Prüfungen erfolgreich sind, Android und iOS bestanden haben, ein kleiner und ein großer Partytest dokumentiert sind, alle 18 Spiele mindestens einmal real geprüft wurden, keine kritischen oder hohen Fehler offen sind und die erforderlichen Anbieterinformationen vorliegen.
