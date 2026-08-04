# Secret Circle – Manueller Testplan

Dieser Plan ergänzt die automatisierten Prüfungen. Vor jedem Durchlauf Version, Commit, Datum, Testperson, Gerät, Betriebssystem, Browser, Installationsmodus und Online-/Offline-Zustand dokumentieren.

Bewertung: `BESTANDEN`, `FEHLER` oder `BLOCKIERT`.

## A. Einrichtung und Grenzen

### A1 – Drei Personen

- drei eindeutige Namen, ein Imposter, eine Runde
- Start ohne Fehler
- genau drei Karten
- keine geheimen Inhalte nach der Weitergabe

### A2 – Zwanzig Personen

- zwanzig Namen und sechs Imposter
- jede Person genau einmal in der Aufdeckreihenfolge
- sechs unterschiedliche Imposter
- keine fehlenden Abstimmungsoptionen oder horizontale Überbreite

### A3 – Ungültige Werte

Prüfen: zwei Personen, doppelte Namen, einundzwanzig Personen, sieben Imposter und genauso viele Imposter wie Personen.

Erwartet: verständliche Live-Hinweise, sichere Begrenzung und kein beschädigter Spielstand.

## B. Unabhängige Rollenverteilung

### B1 – Aufdeckreihenfolge verrät keine Rolle

1. Mindestens zwanzig neue Runden mit denselben sechs Personen spielen.
2. Pro Runde erste aufdeckende Person und Imposter notieren.
3. Reihenfolge der Namen zwischen einigen Durchläufen verändern.

Erwartet:

- die erste Person ist nicht automatisch Imposter,
- Imposter sind nicht systematisch die ersten Positionen,
- alle Personen können über verschiedene Runden Imposter sein,
- bei zwei Impostern sind beide Rollen eindeutig,
- gleiche Testdaten mit gleichem Seed sind reproduzierbar.

### B2 – Kartenübergabe

- Rolle und Begriff nur nach bewusstem Öffnen sichtbar
- App-Wechsel verdeckt die Karte sofort
- verdeckte Karte kann nicht weitergegeben werden
- Fokus kehrt zum Öffnen-Button zurück
- erneutes Öffnen ermöglicht normale Fortsetzung

## C. Timer und Wake Lock

### C1 – Timer

- Start, Pause und Fortsetzen
- Hintergrund für mindestens zehn Sekunden
- Neuladen bei laufendem Timer
- Ablauf während Bildschirm- oder App-Wechsel

Erwartet: reale Zeit wird korrekt berücksichtigt; kein Zurückspringen.

### C2 – Wake Lock

Auf unterstütztem Gerät Diskussion länger als die normale Display-Abschaltzeit offen lassen.

Erwartet:

- Bildschirm bleibt während der Diskussion aktiv,
- Sperre endet vor der Abstimmung und im Hintergrund,
- bei Rückkehr wird sie erneut angefordert,
- ohne Wake-Lock-API bleibt das Spiel vollständig nutzbar.

## D. Abstimmung und Punkte

Prüfen:

- unschuldige Person wird gewählt,
- Imposter wird gewählt und rät falsch,
- Imposter wird gewählt und rät richtig,
- erste Wahl unentschieden,
- Stichwahl erneut unentschieden,
- schnelle Doppelklicks.

Erwartet:

- korrekter Sieger und Punktestand,
- keine Selbstwahl und keine Doppelstimme,
- genau eine Stichwahl,
- garantiertes Rundenende,
- genau ein Verlaufseintrag.

## E. Mehr-Runden-Match

Drei Runden spielen und zwischendurch neu laden.

Erwartet:

- Punktestand und Rundennummer bleiben korrekt,
- keine Begriffswiederholung bei verfügbarem Pool,
- nach der letzten Runde keine weitere Runde,
- Verlauf enthält jede Runde genau einmal.

## F. Speicherung und Backup

Prüfen:

- aktives Spiel nach Neuladen fortsetzen,
- eigene Kategorie speichern,
- vollständige Sicherung exportieren,
- Daten löschen und Sicherung importieren,
- ungültige und zu große Datei importieren,
- fehlgeschlagenen Import mit vorhandenen Daten.

Erwartet:

- gültige Daten werden vollständig wiederhergestellt,
- ungültige Daten werden abgelehnt,
- Rollback schützt bestehende Daten,
- vollständige Löschung setzt die App sauber zurück.

## G. Eingabe- und Inhaltssicherheit

Eigene Namen und Kategorien mit HTML-, Skript- und Sonderzeichen testen.

Erwartet:

- Inhalte erscheinen nur als Text,
- keine Skriptausführung,
- keine externen Netzwerkzugriffe,
- App bleibt bedienbar.

## H. PWA und Offline

### H1 – Android-Installation

- aktuelles Android-Gerät und Chrome
- Installation und Standalone-Start
- Flugmodus nach erstem vollständigem Laden
- Update von älterem Cache auf `secret-circle-v17`
- Timer, Karten-Sichtschutz und Wake Lock prüfen

### H2 – iPhone-/iPad-Installation

- aktuelles Safari
- Teilen → „Zum Home-Bildschirm“
- korrektes Icon und App-Name
- Safe Areas und Eingabefeld-Zoom
- Offline-Start
- Karten-Sichtschutz
- Fallback ohne Wake-Lock-Unterstützung

### H3 – Offline-Core

Erwartet:

- App und Datenschutzseite offline erreichbar,
- `role-assignment.js`, `setup-ux.js`, `privacy-guard.js` und `wake-lock.js` geladen,
- nur Cache `secret-circle-v17` vorhanden,
- Rollenverteilung bleibt unabhängig von der Aufdeckreihenfolge.

## I. Accessibility

- vollständige Tastaturbedienung
- sichtbarer logischer Fokus
- Screenreader-Kurztest
- 200-Prozent-Vergrößerung
- reduzierte Bewegung und hoher Kontrast
- keine abgeschnittenen Inhalte
- Touchflächen mindestens 44 × 44 Pixel

## J. Realer Partytest

Mindestens:

- ein Match mit 3–4 Personen,
- ein Match mit mindestens 8 Personen,
- ein Match mit mehreren Impostern.

Dokumentieren:

- Verständlichkeit der Einrichtung,
- Kartenübergabe und automatische Verdeckung,
- ob die Aufdeckreihenfolge Rollenverdacht erzeugt,
- Verständlichkeit von Abstimmung, Punkten und Stichwahl,
- Blockaden, Verzögerungen und beobachtete Fehler.

## Freigaberegel

`GO` nur, wenn alle automatisierten Prüfungen erfolgreich sind, Android und iOS bestanden haben, mindestens zwei Partytests dokumentiert sind, keine kritischen oder hohen Fehler offen sind und die erforderlichen Anbieterinformationen vollständig vorliegen.
