# Secret Circle Party Hub – Deployment und Rollback

Secret Circle besteht aus statischen Dateien. Eine installierbare PWA benötigt HTTPS; `localhost` ist nur für lokale Entwicklung eine Ausnahme.

## Aktueller Umfang

- `party.html`: installierter Party-Hub-Startpunkt
- `advanced.html`: vier komplexe lokale Spiele
- `quick-play.html`: zehn wiederaufnehmbare Quick Modes
- `index.html`: vollständiges Word-Imposter-Modul
- `privacy.html`: Datenschutz
- 28 technisch spielbare Spiele
- Smart Party Night
- eigene Hub-Packs
- Offline-Cache `secret-circle-v26`

## Voraussetzungen vor öffentlichem Deployment

- `npm run ci` lokal vollständig erfolgreich
- `npm run test:cross-browser` vollständig erfolgreich
- GitHub Actions auf dem endgültigen Commit grün
- Android- und iOS-Installation geprüft
- Offline-Start und Update auf `secret-circle-v26` geprüft
- alle 28 Spiele mindestens einmal real getestet
- Quick Modes mit 3, 5, 10 und 20 Runden geprüft
- kleine und große Partygruppe dokumentiert
- eigene Packs erstellt, gespielt, exportiert und importiert
- Inhalts- und Altersprüfung abgeschlossen
- Betreiber-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben vorhanden

## GitHub Pages

1. Draft-PR #11 erst nach erfolgreicher Prüfung zusammenführen.
2. Abhängige Basisänderungen geordnet in `main` übernehmen.
3. `Settings → Pages` öffnen.
4. `Deploy from a branch` wählen.
5. Branch `main` und Ordner `/ (root)` auswählen.
6. HTTPS-Adresse abwarten.
7. vollständigen Deployment-Smoke-Test durchführen.

## Prüfung nach dem Deployment

### Seiten und Assets

1. `party.html`, `advanced.html`, `quick-play.html`, `index.html`, `privacy.html` und `manifest.webmanifest` liefern Status 200.
2. Manifest installiert „Secret Circle – Party Hub“ mit `./party.html` als Start-URL.
3. 192- und 512-Pixel-Icons werden erkannt.
4. Browserkonsole und Netzwerkansicht zeigen keine Fehler.
5. Content Security Policy blockiert keine benötigten lokalen Dateien.

### Katalog und Hub

6. Startseite zeigt 28 spielbare und 0 geplante Spiele.
7. Katalog enthält exakt 28 eindeutige IDs.
8. Suche und alle Filter funktionieren.
9. Quick-, Advanced- und Imposter-Schaltflächen sind eindeutig beschriftet.
10. Spieler, Presets, Favoriten, Altersstufe und Standardlänge bleiben nach Neuladen erhalten.
11. Verlauf, Statistik und Erfolge werden aktualisiert.
12. Smart Party Night erstellt und speichert alle Zeitbudgets.

### Quick Modes

13. Wellenlänge verteilt ein geheimes Ziel und wertet den Abstand aus.
14. Zeichnen & Raten zeigt private Begriffe und zählt Treffer.
15. Schnellfeuer verwendet das jeweilige Zeitlimit und die erforderliche Antwortzahl.
16. Geräusche erraten funktioniert ohne gesprochene Zielwörter.
17. Stirn-Raten schützt die Karte vor der ratenden Person.
18. Buchstaben-Kategorien erzeugt Buchstabe, Kategorien, Timer und Punkteingabe.
19. Nicht lachen! besitzt sicheren 30-Sekunden-Ablauf.
20. Melodie summen verwendet keine bereitgestellten geschützten Musikaufnahmen oder Liedtexte.
21. Gegenstandsjagd verwendet sichere Eigenschaften und einen begrenzten Spielbereich.
22. Caption Battle lässt einen Gewinner aus der aktiven Gruppe wählen.
23. aktive Quick-Sessions werden nach Neuladen fortgesetzt.
24. beschädigte Quick-Snapshots werden verworfen.
25. abgeschlossene Quick-Sessions erscheinen einmalig in Verlauf und Statistik.

### Advanced und Word Imposter

26. Zwei Wahrheiten, Question Imposter, Location Spy und Mafia laufen vollständig.
27. aktive Advanced-Sessions behalten ihren Spieler-Snapshot.
28. Word-Imposter-Rollen sind unabhängig von der Aufdeckreihenfolge.
29. maximal sechs Imposter werden erzwungen.
30. Karten-Sichtschutz, Timer, Abstimmung, Stichwahl und Punkte funktionieren.

### Daten und Offline

31. Gesamtexport enthält Hub, Party Night, Quick-, Advanced- und Imposter-Daten.
32. gültiger Import ersetzt lokale Daten vollständig.
33. ungültiger Import verändert vorhandene Daten nicht.
34. vollständige Löschung entfernt alle `secret-circle-*`-Datensätze.
35. nur Cache `secret-circle-v26` bleibt aktiv.
36. Party Hub, Quick Modes, Advanced-Spiele, Word Imposter und Datenschutz starten offline.
37. Update von einer älteren Cache-Version übernimmt lokale Daten und lädt die neue Dateiversion.

## Lokale Befehle

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci

npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

## Update-Regeln

Bei jeder Änderung an einer offline benötigten Datei:

1. Cache-Version in `sw.js` erhöhen.
2. `CORE`, Offline-Test, Runtime-Test, Validator, Release-Audit und Dokumentation synchronisieren.
3. HTML-Scriptreihenfolgen prüfen.
4. alte installierte Version öffnen.
5. neue Version online laden.
6. kontrollieren, dass nur der neue Cache bestehen bleibt.
7. Hub-, Quick-, Advanced-, Pack- und Imposter-Daten auf Kompatibilität prüfen.

## Rollback

Bei einem kritischen Fehler:

1. Veröffentlichung stoppen.
2. gezielten Revert auf den letzten funktionierenden Commit erstellen.
3. Service-Worker-Cache erneut erhöhen.
4. Speicherschemata nur mit kompatibler Migration zurücksetzen.
5. Party Hub, Quick Modes, Advanced-Spiele und Word Imposter getrennt smoke-testen.
6. Sicherung vor und nach dem Rollback prüfen.
7. vollständige CI- und manuelle Kernprüfungen erneut ausführen.
8. Rollback im Changelog dokumentieren.

Keinen Force-Push auf `main` verwenden.

## Produktionsfreigabe

GitHub Pages eignet sich für eine kontrollierte Web-PWA-Beta. Ein öffentlicher Produktionsrelease bleibt blockiert, bis CI, alle 28 Spiele, Android/iOS, Offline-Update, reale Gruppen, Inhalte und rechtliche Angaben vollständig bestätigt sind.
