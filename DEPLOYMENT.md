# Secret Circle Party Hub – Deployment und Rollback

Secret Circle besteht aus statischen Dateien. Eine installierbare PWA benötigt HTTPS; `localhost` ist nur für lokale Entwicklung eine Ausnahme.

## Aktueller Umfang

- 45 eingebaute technisch spielbare Spiele
- 27 Quick-, Trend- und Viral-Modi
- 4 Advanced-Spiele
- Word Imposter
- Smart Party Night
- eigener No-Code-Game-Creator mit sechs Vorlagen
- bis zu 40 selbst erstellte Spiele
- kontextabhängige Schnellhilfe
- Offline-Core `secret-circle-v29`

## Voraussetzungen vor öffentlichem Deployment

- `npm run ci` vollständig erfolgreich
- `npm run test:cross-browser` vollständig erfolgreich
- GitHub Actions auf dem endgültigen Commit grün
- Android- und iOS-Installation geprüft
- Offline-Start und Update auf v29 geprüft
- alle 45 eingebauten Spiele real getestet
- Creator auf Android und iOS getestet
- eigenes Fragen-, Auswahl- und Erratenspiel erstellt und gespielt
- kleine und große Partygruppe dokumentiert
- Inhalts-, Alters-, Fan-Content- und Rechtsprüfung abgeschlossen
- Betreiber-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben vorhanden

## GitHub Pages

1. Draft-PR #11 erst nach erfolgreicher Prüfung zusammenführen.
2. `Settings → Pages` öffnen.
3. `Deploy from a branch` wählen.
4. Branch `main` und Ordner `/ (root)` auswählen.
5. HTTPS-Adresse abwarten.
6. vollständigen Deployment-Smoke-Test durchführen.

## Prüfung nach dem Deployment

### Seiten und Installation

- `party.html`, `creator.html`, `advanced.html`, `quick-play.html`, `index.html` und `privacy.html` liefern Status 200.
- Manifest installiert „Secret Circle – Party Hub“ mit `party.html` als Startpunkt.
- 192- und 512-Pixel-Icons werden erkannt.
- Browserkonsole und Netzwerkansicht zeigen keine Fehler.
- Content Security Policy blockiert keine benötigten lokalen Dateien.

### Hub und Bedienbarkeit

- ohne eigene Spiele werden 45 spielbare und 0 geplante Spiele angezeigt.
- Drei-Schritte-Einstieg, Onboarding und kontextabhängige Hilfen funktionieren.
- Suche, Filter, Favoriten, Spieler, Presets, Verlauf und Smart Party Night funktionieren.
- Spielkarten und Spieldetails benennen die nächste Aktion klar.

### Creator

- alle sechs Vorlagen lassen sich öffnen.
- Fragen-, Auswahl- und Erraten-Spiel speichern strukturierte Karten korrekt.
- mehrere Kategorien, Icon, Akzent, Spielerzahl und Dauer bleiben erhalten.
- Bearbeiten, Kopieren, Löschen, Export und Import funktionieren.
- eigene Spiele erscheinen im Hub und sind direkt spielbar.
- ungültige oder beschädigte Creator-Daten werden verworfen.
- Speicherfehler stellt den alten Zustand wieder her.

### Engines und Daten

- Quick-, Trend-, Viral-, Advanced- und Word-Imposter-Abläufe funktionieren.
- aktive Sessions lassen sich fortsetzen.
- Verlauf und Statistik zählen Abschlüsse genau einmal.
- Gesamtexport enthält selbst erstellte Spiele und alle Sessionarten.
- vollständige Löschung entfernt alle `secret-circle-*`-Datensätze.

### Offline

- nur Cache `secret-circle-v29` bleibt aktiv.
- Hub, Creator, Schnellhilfe, alle Engine-Familien, Word Imposter und Datenschutz starten offline.
- Update von einer älteren Version erhält lokale Spieler, Packs, eigene Spiele und Sessions.

## Lokale Befehle

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

## Update-Regeln

Bei Änderungen an offline benötigten Dateien Cache-Version erhöhen und Service Worker, Offline-Test, Runtime-Test, Validator, Release-Audit und Dokumentation synchronisieren. Danach Update von einer installierten älteren Version praktisch testen.

## Rollback

Bei kritischem Fehler Veröffentlichung stoppen, gezielten Revert erstellen, Cache erneut erhöhen, Datenschemata kompatibel halten, Hub, Creator und sämtliche Engines smoke-testen und den Rollback dokumentieren. Kein Force-Push auf `main`.

## Produktionsfreigabe

Ein öffentlicher Release bleibt blockiert, bis CI, Creator, alle 45 Spiele, Android/iOS, Offline-Update, reale Gruppen, Inhalte und rechtliche Angaben bestätigt sind.
