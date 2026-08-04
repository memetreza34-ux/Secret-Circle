# Secret Circle – Manueller Testplan

Dieser Plan ergänzt die automatisierten Prüfungen. Er muss vor einer öffentlichen Freigabe auf echten Geräten und mit echten Testpersonen durchgeführt werden.

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

Bewertung:

- `BESTANDEN`: vollständig wie erwartet
- `FEHLER`: Abweichung mit Gerät, Browser, Schritten und Beleg dokumentieren
- `BLOCKIERT`: wegen eines externen Problems nicht ausführbar

## A. Grundlegender Smoke-Test

### A1 – Start mit drei Personen

1. Browserdaten löschen.
2. Drei unterschiedliche Namen eingeben.
3. Einen Imposter und eine Runde wählen.
4. Spiel starten.

Erwartet:

- Start ohne Fehler,
- genau drei Karten,
- jede Karte nach Weitergabe vollständig verborgen.

### A2 – Start mit zwanzig Personen

1. Zwanzig Namen eingeben.
2. Sechs Imposter wählen.
3. Spiel starten und nach Neuladen fortsetzen.

Erwartet:

- jede Person erscheint genau einmal,
- sechs unterschiedliche Imposter,
- keine fehlenden Karten oder Abstimmungsoptionen,
- keine horizontale Überbreite.

### A3 – Live-Einrichtung und Grenzen

Prüfen:

- zwei Personen,
- doppelte Namen mit anderer Großschreibung,
- einundzwanzig Personen,
- genauso viele Imposter wie Personen,
- Gruppe nach hoher Imposter-Auswahl verkleinern.

Erwartet:

- eindeutige Personenzahl wird live angezeigt,
- doppelte Namen werden genannt,
- zulässiger Imposter-Bereich passt sich an,
- zu hoher Wert wird sicher begrenzt,
- ungültiger Start erzeugt keinen Spielstand.

## B. Kartenübergabe und Rollen

### B1 – Vertrauliche Kartenübergabe

1. Gerät nacheinander weitergeben.
2. Karte öffnen, merken und schließen.
3. Aus mehreren Blickwinkeln prüfen.

Erwartet:

- vor Öffnung keine Rolle und kein Begriff,
- nach Schließen keine geheimen Inhalte,
- Fokus auf der richtigen Folgeaktion.

### B2 – Automatische Kartenverdeckung

1. Geheime Karte öffnen.
2. App wechseln, Browser minimieren oder Bildschirm kurz sperren.
3. Zurückkehren.
4. Ohne erneutes Öffnen eine Weitergabe versuchen.
5. Karte erneut öffnen und normal fortfahren.

Erwartet:

- Karte wird automatisch verdeckt,
- verständlicher Hinweis erscheint,
- Weitergabe ist verborgen und technisch blockiert,
- Fokus kehrt zum Öffnen-Button zurück,
- Runde kann danach normal fortgesetzt werden.

### B3 – Mehrere Imposter

Mit mindestens sechs Personen und zwei Impostern alle Karten kontrolliert prüfen.

Erwartet:

- exakt zwei unterschiedliche Imposter,
- alle Unschuldigen sehen denselben Begriff,
- Imposter sehen nur Hilfswort oder „Kein Begriff“.

## C. Timer und Bildschirmaktivität

### C1 – Start, Pause und Fortsetzen

1. Eine Minute wählen.
2. Timer starten.
3. Nach einigen Sekunden pausieren.
4. Fünf Sekunden warten und fortsetzen.

Erwartet:

- reale Zeit nimmt korrekt ab,
- Pause friert die Restzeit ein,
- Fortsetzen nutzt die gespeicherte Restzeit.

### C2 – Hintergrund und Gerätesperre

1. Timer starten.
2. App mindestens zehn Sekunden in den Hintergrund schicken.
3. Optional Bildschirm sperren.
4. Zurückkehren.

Erwartet:

- reale vergangene Zeit ist berücksichtigt,
- Timer springt nicht zurück,
- abgelaufener Timer zeigt `00:00`.

### C3 – Neuladen bei laufendem Timer

1. Timer starten.
2. Seite neu laden oder PWA schließen.
3. Runde fortsetzen.

Erwartet:

- Deadline wird korrekt wiederhergestellt,
- laufender Timer läuft weiter,
- abgelaufener Timer bleibt abgelaufen.

### C4 – Wake Lock

Auf einem unterstützten Gerät:

1. Diskussion erreichen.
2. Gerät länger als die normale Display-Abschaltzeit liegen lassen.
3. Abstimmung starten.
4. App in den Hintergrund schicken.

Erwartet:

- Bildschirm bleibt während der sichtbaren Diskussion aktiv,
- Wake Lock endet beim Wechsel zur Abstimmung,
- Wake Lock endet im Hintergrund,
- bei Rückkehr in eine aktive Diskussion wird er erneut angefordert.

Auf einem Gerät oder Browser ohne Wake-Lock-API:

- Spiel bleibt vollständig nutzbar,
- keine Fehlermeldung oder Blockade.

## D. Abstimmung, Stichwahl und Punkte

### D1 – Unschuldige Person gewählt

Erwartet:

- Runde endet direkt,
- Imposter gewinnen,
- jeder Imposter erhält zwei Punkte,
- Verlauf enthält genau einen Eintrag.

### D2 – Imposter gewählt und falsch geraten

Erwartet:

- ausgeschiedener Imposter erhält eine Ratechance,
- Gruppe gewinnt,
- jede unschuldige Person erhält einen Punkt.

### D3 – Imposter gewählt und richtig geraten

Erwartet:

- Imposter gewinnen,
- jeder Imposter erhält zwei Punkte,
- Groß-/Kleinschreibung und äußere Leerzeichen werden toleriert.

### D4 – Stichwahl

1. Erste Wahl absichtlich unentschieden.
2. Prüfen, dass nur Führende auswählbar sind.
3. Stichwahl erneut unentschieden.

Erwartet:

- genau eine Stichwahl,
- keine Selbstwahl,
- keine Stimme außerhalb der Führenden,
- garantiertes Rundenende zugunsten der Imposter.

### D5 – Geheime Abstimmungsübergabe

Erwartet:

- jede Person genau eine Stimme,
- vorherige Stimme unsichtbar,
- aktuell abstimmende Person eindeutig,
- Doppelklick erzeugt keine zweite Stimme.

## E. Mehr-Runden-Match und Verlauf

### E1 – Drei Runden

Drei Runden spielen und zwischen zwei Runden neu laden.

Erwartet:

- Punktestand bleibt erhalten,
- Rundennummer korrekt,
- keine Wiederholung bei verfügbaren unbenutzten Begriffen,
- nach letzter Runde keine weitere Runde.

### E2 – Verlauf

Erwartet:

- jede beendete Runde genau einmal,
- Begriff, Kategorie, Runde und Sieger korrekt,
- maximal zwanzig Einträge,
- separates Löschen funktioniert.

## F. Eigene Kategorien und Eingabesicherheit

### F1 – Gültige Kategorie

Kategorie mit mindestens zwei Zeilen `Begriff | Hilfswort` erstellen und spielen.

Erwartet:

- bleibt nach Neuladen erhalten,
- Inhalte korrekt verwendet,
- HTML-Zeichen nur als Text.

### F2 – Ungültige Kategorie

Prüfen:

- nur ein Begriff,
- leere Zeilen,
- doppelte Begriffe,
- sehr lange Eingaben,
- HTML- und Skriptzeichen.

Erwartet:

- keine beschädigte Kategorie,
- verständliche Validierung,
- keine Skriptausführung,
- App bleibt bedienbar.

## G. Speicherung, Backup und Löschung

### G1 – Sicherung exportieren

Erwartet:

- lokale JSON-Datei,
- Format, Version, Exportzeit und lokale Daten vorhanden,
- keine Übertragung an externe Server.

### G2 – Sicherung importieren

1. Eigene Kategorie und aktiven Spielstand sichern.
2. Daten löschen.
3. Sicherung importieren.

Erwartet:

- Spielstand, Einstellungen, Verlauf und Kategorien wiederhergestellt,
- Live-Einrichtung aktualisiert,
- Bestätigung vor Import,
- fehlerhafte, fremde oder zu große Datei abgelehnt,
- fehlgeschlagener Import verändert keine bestehenden Daten.

### G3 – Vollständige Datenlöschung

Erwartet:

- aktive Runde, Einstellungen, Verlauf, Kategorien und alte Schlüssel entfernt,
- Standardwerte erscheinen,
- Offline-App-Dateien dürfen im Cache bleiben.

## H. PWA und Offline

### H1 – Android-Installation

Erwartet:

- App installierbar,
- scharfes Icon,
- Name „Secret Circle“,
- Start im Standalone-Modus.

### H2 – iPhone-/iPad-Installation

In Safari über Teilen → „Zum Home-Bildschirm“ installieren.

Erwartet:

- korrektes Touch-Icon und App-Name,
- Notch und Home-Indikator überdecken nichts,
- Eingabefelder verursachen keinen unerwarteten Zoom.

### H3 – Vollständig offline

1. App einmal vollständig online laden.
2. Flugmodus aktivieren.
3. App neu starten.
4. Datenschutzseite öffnen und Match spielen.
5. Setup, Karten-Sichtschutz und Diskussion prüfen.

Erwartet:

- Kernseiten und Spiel funktionieren,
- Offline-Anzeige sichtbar,
- `setup-ux.js`, `privacy-guard.js` und `wake-lock.js` geladen,
- Spielstand bleibt erhalten.

### H4 – App-Update

1. Ältere installierte Beta öffnen.
2. Neue Version online laden.
3. App neu starten.

Erwartet:

- alter Cache entfernt,
- nur `secret-circle-v16` bleibt,
- keine Mischung aus alter Oberfläche und neuer Engine,
- kompatible lokale Daten bleiben erhalten.

## I. Accessibility

### I1 – Tastatur

Erwartet:

- alle Aktionen mit Tab, Umschalt+Tab, Enter und Leertaste erreichbar,
- Fokus sichtbar und logisch,
- Regeln per Tastatur aufklappbar,
- Fokus kehrt nach Kartenverdeckung sicher zurück.

### I2 – Screenreader und Vergrößerung

Prüfen:

- Überschriften,
- Labels,
- Live-Gruppenhinweise,
- Status- und Fehlermeldungen,
- 200-Prozent-Vergrößerung,
- reduzierte Bewegung,
- hoher Kontrast.

Erwartet:

- keine unbeschrifteten Elemente,
- keine abgeschnittenen Inhalte,
- keine wichtige reine Farbcodierung.

## J. Realer Partytest

Mindestens testen:

- Gruppe mit 3–4 Personen,
- Gruppe mit mindestens 8 Personen,
- Match mit mehreren Impostern.

Beobachten:

- Wird Einrichtung ohne Hilfe verstanden?
- Wird Kartenübergabe verstanden?
- Wird automatische Verdeckung verstanden?
- Bleibt der Bildschirm während Diskussionen aktiv?
- Ist die abstimmende Person klar?
- Werden Punkte und Stichwahl verstanden?
- Gibt es Rollenenthüllungen, Blockaden oder Zögern?

## Freigaberegel

`GO` nur, wenn:

- alle automatisierten Prüfungen erfolgreich,
- alle kritischen manuellen Fälle bestanden,
- keine kritischen oder hohen Fehler offen,
- Android und iOS geprüft,
- mindestens zwei Partytests dokumentiert,
- rechtliche Anbieterinformationen vollständig.
