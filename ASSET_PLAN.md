# Secret Circle – Bild-, Icon- und Animationsplan

Dieses Dokument definiert die visuelle Produktion nach Abschluss der funktionalen Beta. Ziel ist ein eigenständiger, wiedererkennbarer Party-Hub-Look. Andere Apps dürfen als Orientierung für Verständlichkeit und Tempo dienen; Grafiken, Karten, Figuren, Animationen und Oberflächen werden nicht kopiert.

## 1. Visuelle Grundidee

Secret Circle verwendet eine dunkle, kontrastreiche Partywelt mit leuchtenden Akzentfarben. Jede Spielkarte soll in weniger als zwei Sekunden vermitteln:

- welche Art Spiel es ist
- welche Stimmung es erzeugt
- ob es für die aktuelle Gruppe passt
- welche Aktion als Nächstes folgt

## 2. Asset-System statt Einzelbilder

### Globale Assets

- App-Logo und Wortmarke
- Splash-/Startillustration
- PWA-Icons in mehreren Größen
- neutrale Kartenrückseite
- Standard-Hintergründe für Setup, aktive Runde und Ergebnis
- Offline-, Datenschutz-, Hilfe- und Creator-Illustration

### Kategorie-Assets

| Kategorie | Hauptmotiv | Akzent | Bewegungsprinzip |
|---|---|---|---|
| Rollen & Täuschung | Masken, Schatten, geheime Karte | Violett/Rot | langsames Aufdecken |
| Anime & Fandom | eigenständige stilisierte Silhouetten | Pink/Violett | Energiespur, keine bekannten Figurenbilder |
| Social & Freunde | Sprechblasen, Gruppenformen | Cyan/Grün | leichtes Pop-in |
| Quiz & Wissen | Fragezeichen, Buzzer, Kartenstapel | Blau/Türkis | schnelle Kartenfolge |
| Geld & Schätzen | Preisschild, Münzformen, Skala | Gelb/Orange | Zähler und Reveal |
| Ranking & Meinung | Stufen, Balken, Tier-Raster | Orange/Pink | Einsortieren und Einrasten |
| Kreativ & Story | Stift, Seiten, Ideenfunken | Pink/Blau | Zeichnen und Weiterblättern |
| Tempo & Challenge | Blitz, Timer, Zielscheibe | Rot/Orange | Pulse und Countdown |
| Eigene Spiele | Werkzeug, Bausteine, Plus-Karte | Cyan/Violett | Bausteine verbinden |

## 3. Icon-System

### Anforderungen

- einheitliche Strichstärke und Rundungen
- bei 24, 32, 48 und 64 Pixel lesbar
- keine fremden Markenlogos
- Symbol plus Text; wichtige Funktionen nie nur über Farbe erklären
- SVG als Hauptformat, PNG nur für Plattformanforderungen

### Benötigte Navigationsicons

- Start
- Spiele
- Spieler
- Erstellen
- Favoriten
- Verlauf
- Daten
- Suche
- Filter
- Hilfe
- Zurück
- Schließen
- Bearbeiten
- Kopieren
- Exportieren
- Importieren
- Löschen
- Offline
- Installieren

### Benötigte Spielmechanikicons

- geheime Rolle
- Frage
- Abstimmung
- Timer
- Punkte
- Teams
- Erraten
- Darstellen
- Zeichnen
- Audio
- Ranking
- Schätzen
- Story
- Mission
- Zufall
- eigenes Spiel

## 4. Illustrationspakete

### Startseite

- Hero-Illustration: mehrere abstrakte Spielkarten in einer gemeinsamen Partywelt
- „In drei Schritten“-Miniillustrationen
- Creator-Illustration: Kartenbausteine werden zu einem eigenen Spiel
- Smart-Party-Night-Illustration: Zeitplan mit gemischten Spielarten

### Spielkarten

Nicht jedes der 45 Spiele benötigt sofort ein komplett eigenes Bild. Für die erste visuelle Welle werden wiederverwendbare Mechanikillustrationen erstellt:

1. Rollen und Täuschung
2. Fragen und Social
3. Erraten und Darstellen
4. Quiz und Wissen
5. Geld und Schätzen
6. Ranking und Meinung
7. Kreativität und Story
8. Tempo und Bewegung
9. Zufallswerkzeuge
10. eigene Spiele

Später erhalten die meistgespielten Titel eigene Keyvisuals.

## 5. Anime- und Fan-Content-Regel

- keine bekannten Charakterbilder nachzeichnen
- keine Logos, Szenen, Panels oder Screenshots übernehmen
- Fan-Quiz zunächst nur mit Textnamen
- visuelle Begleitung über allgemeine eigenständige Archetypen: Ninja, Magierin, Mecha-Pilot, Schwertkämpfer, Detektiv, Sportteam
- vor öffentlicher oder kommerzieller Nutzung rechtliche Prüfung

## 6. Animationssystem

### Mikroanimationen

- Button-Druck: 100–140 ms
- Kartenwechsel: 180–240 ms
- Modal/Bottom Sheet: 220–280 ms
- Punktgewinn: kurzer 300-ms-Pop
- Fehler: sanfter horizontaler Hinweis, kein aggressives Schütteln
- Fortschritt: weiche Breitenänderung

### Spielanimationen

- Rollenkarte aufdecken
- Timer-Pulse in den letzten zehn Sekunden
- richtige Antwort mit kurzem Ringimpuls
- Ranking-Karte rastet in Stufe ein
- Preis oder Zahl zählt kontrolliert hoch
- Storykarte blättert weiter
- Creator-Vorschau aktualisiert sich ohne Seitenwechsel

### Regeln

- `prefers-reduced-motion` vollständig beachten
- keine Animation blockiert Eingaben
- keine Dauerschleifen ohne Pause
- Kernfunktion bleibt ohne Animation verständlich
- Animationen möglichst über Transform und Opacity

## 7. Dateistruktur

```text
assets/
  brand/
  icons/
    navigation/
    mechanics/
    status/
  illustrations/
    home/
    categories/
    games/
    creator/
  backgrounds/
  motion/
  manifests/
```

Dateinamen verwenden stabile englische IDs, zum Beispiel `mechanic-secret-role.svg`, `category-social.webp` oder `game-word-imposter-hero.webp`.

## 8. Technische Budgets

- SVG-Icon ideal unter 8 KB
- Kategorieillustration ideal unter 120 KB als WebP/AVIF
- Hero-Illustration ideal unter 250 KB
- keine Videos im Offline-Core der ersten Release-Version
- Lottie oder ähnliche Laufzeitbibliothek nur nach Architektur- und Performanceprüfung
- kritische Oberfläche funktioniert auch ohne geladenes Bild

## 9. Produktionsreihenfolge

### Welle 1 – Designsystem

- Logo und App-Icon
- 18 Navigations-/Statusicons
- zehn Mechanikicons
- Kartenrückseite und drei Hintergründe

### Welle 2 – Kategorien

- zehn Kategorieillustrationen
- Startseiten-Hero
- Creator-Keyvisual
- Smart-Party-Night-Keyvisual

### Welle 3 – Topspiele

Eigene Keyvisuals für Word Imposter, Wer bin ich?, Anime-Figuren, Wahrheit oder Pflicht, Wellenlänge, Blind Ranking, Finger runter, Preis schätzen, Mafia und Zeichnen & Raten.

### Welle 4 – Motion

- Kartenübergänge
- Timer
- Ergebnis
- Ranking
- Creator-Vorschau
- Installations-/Offlinefeedback

## 10. Abnahme

Jedes Asset wird auf 320-Pixel-Smartphone, aktuellem iPhone/Android, 200-Prozent-Zoom, Dark Mode, Reduced Motion und Offline-Start geprüft. Bilder dürfen keinen wichtigen Text enthalten und benötigen bei inhaltlicher Bedeutung einen geeigneten Alternativtext.
