# Secret Circle – Manueller Testplan

Dieser Testplan ergänzt die automatisierten Prüfungen. Er muss vor einer öffentlichen Freigabe auf echten Geräten und mit echten Testpersonen durchgeführt werden.

## Testprotokoll

Vor jedem Durchlauf ausfüllen:

- App-Version:
- Commit:
- Datum:
- Testperson:
- Gerät:
- Betriebssystem:
- Browser:
- Installiert als PWA: Ja / Nein
- Online / Offline:

Für jeden Fall gilt:

- `BESTANDEN`: Verhalten entspricht vollständig dem erwarteten Ergebnis.
- `FEHLER`: Abweichung mit Screenshot, Video, Gerät, Browser und genauen Schritten dokumentieren.
- `BLOCKIERT`: Test konnte wegen eines externen Problems nicht ausgeführt werden.

## A. Grundlegender Smoke-Test

### A1 – Start mit drei Personen

1. Browserdaten der App löschen.
2. Drei unterschiedliche Namen eingeben.
3. Einen Imposter und eine Runde auswählen.
4. Spiel starten.

Erwartet:

- Spiel startet ohne Fehlermeldung.
- Genau drei Karten werden nacheinander angezeigt.
- Jede Karte ist nach dem Weitergeben vollständig verborgen.

### A2 – Start mit zwanzig Personen

1. Zwanzig unterschiedliche Namen eingeben.
2. Sechs Imposter auswählen.
3. Spiel starten und den gespeicherten Zustand nach einem Neuladen fortsetzen.

Erwartet:

- Alle zwanzig Personen erscheinen genau einmal.
- Keine Karte oder Abstimmungsoption fehlt.
- Bedienung bleibt auf dem Smartphone flüssig und ohne horizontales Scrollen.

### A3 – Ungültige Einrichtung

Jeweils prüfen:

- nur zwei Personen,
- doppelte Namen mit unterschiedlicher Großschreibung,
- einundzwanzig Personen,
- genauso viele Imposter wie Personen.

Erwartet:

- verständliche Fehlermeldung,
- kein neuer Spielstand,
- Einrichtung bleibt erhalten und kann korrigiert werden.

## B. Kartenübergabe und Rollen

### B1 – Vertrauliche Kartenübergabe

1. Gerät an jede Person weitergeben.
2. Karte anzeigen, merken und schließen.
3. Aus mehreren Blickwinkeln prüfen, ob vorherige Inhalte sichtbar bleiben.

Erwartet:

- Vor dem Öffnen ist weder Rolle noch Begriff sichtbar.
- Nach dem Schließen bleiben keine geheimen Inhalte auf dem Bildschirm.
- Fokus liegt auf der richtigen nächsten Aktion.

### B2 – Mehrere Imposter

1. Mindestens sechs Personen und zwei Imposter verwenden.
2. Alle Karten kontrolliert aufdecken.

Erwartet:

- exakt zwei unterschiedliche Personen sind Imposter,
- unschuldige Personen sehen denselben Begriff,
- Imposter sehen nur das konfigurierte Hilfswort beziehungsweise „Kein Begriff“.

## C. Timer

### C1 – Start, Pause und Fortsetzen

1. Eine Minute auswählen.
2. Timer starten und mindestens drei Sekunden warten.
3. Timer pausieren, fünf Sekunden warten und fortsetzen.

Erwartet:

- laufende Zeit nimmt korrekt ab,
- pausierte Zeit bleibt unverändert,
- Fortsetzen verwendet die verbleibende Zeit.

### C2 – Hintergrund und Gerätesperre

1. Timer starten.
2. App für mindestens zehn Sekunden in den Hintergrund schicken.
3. Optional Bildschirm sperren.
4. Zur App zurückkehren.

Erwartet:

- die vergangene reale Zeit wurde berücksichtigt,
- Timer springt nicht zurück,
- abgelaufener Timer zeigt `00:00` und eine verständliche Statusmeldung.

### C3 – Neuladen bei laufendem Timer

1. Timer starten.
2. Seite neu laden oder installierte App vollständig schließen.
3. Runde fortsetzen.

Erwartet:

- Timer wird anhand der gespeicherten Frist korrekt wiederhergestellt,
- laufender Timer läuft weiter,
- abgelaufener Timer bleibt abgelaufen.

## D. Abstimmung, Stichwahl und Punkte

### D1 – Unschuldige Person wird gewählt

Erwartet:

- Runde endet direkt,
- Imposter gewinnen,
- jeder Imposter erhält zwei Punkte,
- Runde erscheint genau einmal im Verlauf.

### D2 – Imposter wird gewählt und rät falsch

Erwartet:

- nur die ausgeschiedene Imposter-Person erhält die letzte Ratechance,
- Gruppe gewinnt,
- jede unschuldige Person erhält einen Punkt.

### D3 – Imposter wird gewählt und rät richtig

Erwartet:

- Imposter gewinnen,
- jeder Imposter erhält zwei Punkte,
- Groß-/Kleinschreibung und äußere Leerzeichen führen nicht zu einer falschen Bewertung.

### D4 – Stichwahl

1. Erste Abstimmung absichtlich unentschieden gestalten.
2. Prüfen, dass nur führende Personen auswählbar sind.
3. Stichwahl erneut unentschieden gestalten.

Erwartet:

- genau eine Stichwahl,
- keine Selbstwahl,
- keine Stimme außerhalb der führenden Personen,
- danach eindeutiges Rundenende zugunsten der Imposter.

### D5 – Geheime Abstimmungsübergabe

Erwartet:

- jede Person stimmt genau einmal ab,
- vorherige Stimme wird nicht angezeigt,
- der Name der aktuell abstimmenden Person ist eindeutig,
- Doppelklick erzeugt keine zweite Stimme.

## E. Mehr-Runden-Match

### E1 – Drei Runden

1. Drei Runden vollständig spielen.
2. Zwischen Runde eins und zwei neu laden.

Erwartet:

- Punktestand bleibt erhalten,
- Rundennummer ist korrekt,
- Begriffe wiederholen sich nicht, solange unbenutzte Begriffe verfügbar sind,
- nach der letzten Runde ist „Nächste Runde“ nicht mehr verfügbar.

### E2 – Verlauf

Erwartet:

- jede beendete Runde erscheint genau einmal,
- Begriff, Kategorie, Runde und Sieger sind korrekt,
- maximal zwanzig Einträge werden gespeichert,
- Verlauf kann separat gelöscht werden.

## F. Eigene Kategorien und Inhalte

### F1 – Gültige eigene Kategorie

1. Kategorie mit mindestens zwei Zeilen im Format `Begriff | Hilfswort` erstellen.
2. Kategorie auswählen und mehrere Runden spielen.

Erwartet:

- Kategorie bleibt nach Neuladen erhalten,
- Begriffe und Hilfswörter werden korrekt verwendet,
- HTML-Zeichen werden nur als Text angezeigt.

### F2 – Ungültige eigene Kategorie

Prüfen:

- nur ein Begriff,
- leere Zeilen,
- doppelte Begriffe,
- sehr lange Eingaben.

Erwartet:

- keine beschädigte Kategorie,
- verständliche Validierung,
- App bleibt bedienbar.

## G. Speicherung, Backup und Löschung

### G1 – Sicherung exportieren

Erwartet:

- JSON-Datei wird lokal heruntergeladen,
- Datei enthält Format, Version, Exportzeit und lokale Daten,
- App sendet keine Spieldaten an einen externen Server.

### G2 – Sicherung importieren

1. Eigene Kategorie und aktiven Spielstand sichern.
2. Alle lokalen Daten löschen.
3. Sicherung importieren.

Erwartet:

- Kategorie, Einstellungen, Verlauf und aktiver Spielstand werden wiederhergestellt,
- Import verlangt eine Bestätigung,
- fehlerhafte, fremde oder zu große Datei wird abgelehnt.

### G3 – Vollständige Datenlöschung

Erwartet:

- aktive Runde, Einstellungen, Verlauf, eigene Kategorien und alte Speicherschlüssel sind entfernt,
- App startet mit Standardwerten,
- Offline-App-Dateien dürfen im Service-Worker-Cache bleiben.

## H. PWA und Offline

### H1 – Android-Installation

Erwartet:

- Browser erkennt die App als installierbar,
- Icon ist scharf,
- Name lautet „Secret Circle“,
- App startet ohne Browserleiste im Standalone-Modus.

### H2 – iPhone-/iPad-Installation

1. In Safari über Teilen → „Zum Home-Bildschirm“ installieren.

Erwartet:

- korrektes Touch-Icon,
- korrekter App-Name,
- sichere Bereiche um Notch und Home-Indikator werden nicht überdeckt.

### H3 – Vollständig offline

1. App einmal vollständig online laden.
2. Flugmodus aktivieren.
3. App schließen und erneut starten.
4. Datenschutzseite öffnen und ein Match spielen.

Erwartet:

- alle Kernseiten und Spielinhalte funktionieren,
- Offline-Anzeige ist sichtbar,
- Spielstand bleibt lokal erhalten.

### H4 – App-Update

1. Eine ältere installierte Beta öffnen.
2. Neue Version online laden.
3. App neu starten.

Erwartet:

- alter Cache wird entfernt,
- neue App-Dateien und Icons werden verwendet,
- bestehende kompatible lokale Daten werden migriert,
- keine Mischung aus alter Oberfläche und neuer Engine.

## I. Accessibility

### I1 – Tastatur

Erwartet:

- alle Aktionen sind per Tab, Umschalt+Tab, Enter und Leertaste erreichbar,
- Fokus ist sichtbar,
- Reihenfolge ist logisch,
- Spielregeln lassen sich per Tastatur öffnen und schließen.

### I2 – Screenreader und Vergrößerung

Prüfen:

- Überschriftenstruktur,
- Feldbeschriftungen,
- Status- und Fehlermeldungen,
- 200-Prozent-Vergrößerung,
- reduzierte Bewegung,
- hoher Kontrast.

Erwartet:

- keine unbeschrifteten Bedienelemente,
- keine abgeschnittenen Inhalte,
- keine reine Farbcodierung wichtiger Informationen.

## J. Realer Partytest

Mindestens zwei Gruppen testen:

- eine Gruppe mit drei bis vier Personen,
- eine Gruppe mit acht oder mehr Personen,
- mindestens ein Match mit mehreren Impostern.

Beobachten und dokumentieren:

- Verstehen alle Personen die Kartenübergabe ohne Erklärung?
- Ist klar, wer gerade abstimmt?
- Werden Punkte und Stichwahl verstanden?
- Gibt es versehentliche Rollenenthüllungen?
- Wie lange dauert die Einrichtung?
- Wo stockt oder zögert die Gruppe?

## Freigaberegel

Ein `GO` ist nur zulässig, wenn:

- alle automatisierten Prüfungen erfolgreich sind,
- alle kritischen manuellen Fälle bestanden sind,
- keine reproduzierbaren kritischen oder hohen Fehler offen sind,
- Android und iOS geprüft wurden,
- mindestens zwei reale Partytests dokumentiert sind,
- rechtliche Anbieterinformationen für die geplante Veröffentlichung vollständig sind.
