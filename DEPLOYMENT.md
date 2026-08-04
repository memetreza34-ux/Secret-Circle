# Secret Circle Party Hub – Deployment und Rollback

Secret Circle besteht aus statischen Dateien. Eine installierbare PWA benötigt HTTPS; `localhost` ist nur für lokale Entwicklung eine Ausnahme.

## Aktueller Deployment-Umfang

- `party.html`: installierter Startpunkt und Party-Hub-Navigation
- `advanced.html`: komplexe Spiele
- `index.html`: vollständiges Word-Imposter-Modul
- `privacy.html`: Datenschutzinformationen
- Manifest-Start: `./party.html`
- Service-Worker-Cache: `secret-circle-v21`
- 22 sichtbare Spiele, 18 spielbar, 4 gesperrt geplant

## Voraussetzungen

Vor einem öffentlichen Deployment:

- `npm run ci` lokal erfolgreich
- `npm run test:cross-browser` erfolgreich
- GitHub Actions auf dem endgültigen Commit grün
- Android- und iOS-Installation geprüft
- Offline-Start und Update auf Cache `secret-circle-v21` geprüft
- alle 18 Spiele mindestens einmal real getestet
- kleiner und großer Partytest dokumentiert
- vollständiger Backup-/Import-/Löschtest bestanden
- keine offenen kritischen oder hohen Fehler
- öffentliche Anbieter- und Kontaktangaben vorhanden

## GitHub Pages

1. Draft-PR #11 erst nach erfolgreicher Prüfung zusammenführen.
2. Basierenden Word-Imposter-PR ebenfalls geordnet in `main` übernehmen.
3. `Settings → Pages` öffnen.
4. `Deploy from a branch` wählen.
5. Branch `main`, Ordner `/ (root)` auswählen.
6. HTTPS-Adresse abwarten.
7. Deployment-Smoke-Test vollständig ausführen.

## Prüfung nach dem Deployment

### Seiten und Assets

1. `party.html`, `advanced.html`, `index.html`, `privacy.html` und `manifest.webmanifest` liefern Status 200.
2. Manifest installiert „Secret Circle – Party Hub“ und verwendet `./party.html` als Start-URL.
3. 192- und 512-Pixel-Icons werden erkannt.
4. Browserkonsole und Netzwerkansicht zeigen keine Fehler.
5. Content Security Policy blockiert keine eigenen benötigten Dateien.

### Party Hub

6. Startseite zeigt 18 spielbare und 4 geplante Spiele.
7. Suche sowie Filter für Art, Stimmung, Gruppengröße, Altersstufe und Status funktionieren.
8. geplante Spiele sind sichtbar, aber nicht startbar.
9. Spieler, Presets, Favoriten, Altersstufe und Standardlänge bleiben nach Neuladen erhalten.
10. Verlauf, Statistik und Erfolge werden nach abgeschlossenen Sessions aktualisiert.
11. Installationsschaltfläche erscheint in unterstützten Browsern.

### Komplexe Spiele

12. Zwei Wahrheiten, eine Lüge unterstützt private Eingabe, Mischung, Abstimmung und Auflösung.
13. Question Imposter verteilt geheime ähnliche Fragen und löst die Wahl auf.
14. Location Spy verteilt Ort und Spion, erlaubt Wahl sowie Ortsraten.
15. Mafia verteilt Rollen, schützt die Moderatoransicht und verarbeitet Nacht, Tag und Sieg.
16. aktive komplexe Sessions werden nach Neuladen korrekt fortgesetzt.
17. 3-, 5-, 10- und 20-Runden-Sessions funktionieren; mehr als 20 Runden sind gesperrt.

### Word Imposter

18. Rollenverteilung ist unabhängig von der Aufdeckreihenfolge.
19. maximal sechs Imposter werden auch bei wiederhergestellten Spielen erzwungen.
20. Karten-Sichtschutz, Timer, Wahl, Stichwahl, Punkte und nächste Runde funktionieren.

### Daten

21. Gesamtexport enthält Hub- und Word-Imposter-Daten.
22. gültiger Import ersetzt lokale Daten und lädt die App neu.
23. ungültiger Import verändert vorhandene Daten nicht.
24. fehlgeschlagener Schreibvorgang stellt den vorherigen Zustand wieder her.
25. vollständige Löschung entfernt alle `secret-circle-*`-Datensätze.

### PWA und Offline

26. nur Cache `secret-circle-v21` bleibt aktiv.
27. Party Hub, komplexe Spiele, Word Imposter und Datenschutz starten offline.
28. Question Imposter kann vollständig offline begonnen werden.
29. Update von einer älteren installierten Cache-Version lädt nur die neue Dateiversion.
30. lokale Spielstände bleiben nach dem PWA-Update erhalten.

## Lokaler Test

```bash
python -m http.server 8080
```

Danach öffnen:

- `http://localhost:8080/party.html`
- `http://localhost:8080/advanced.html?game=question-imposter`
- `http://localhost:8080/index.html`

Automatisierte Prüfung:

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci

npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

## Release markieren

Die Expansion ist noch kein freigegebener stabiler Release. Nach vollständiger Beta-Freigabe kann eine neue Version markiert werden:

```bash
git tag -a v1.0.0-beta.4 -m "Secret Circle Party Hub beta 4"
git push origin v1.0.0-beta.4
```

`v1.0.0` darf erst nach allen automatisierten, realen und rechtlichen Prüfungen erstellt werden.

## Update-Regeln

Bei Änderungen an einer offline benötigten Datei:

1. Cache-Version in `sw.js` erhöhen.
2. `CORE`, Offline-Test, Runtime-Test, Validator, Release-Audit und Dokumentation synchronisieren.
3. Manifest-Start und alle HTML-Scriptreihenfolgen prüfen.
4. alte installierte Version öffnen.
5. neue Version online laden.
6. kontrollieren, dass nur der neue Cache bestehen bleibt.
7. Hub-, aktive Session- und Imposter-Daten auf Kompatibilität prüfen.

## Datenkompatibilität

Relevante Bereiche:

- versionierter Word-Imposter-Speicher
- Hub-Speicher `secret-circle-party-hub-v1`
- aktive komplexe Session `secret-circle-party-active-v1`
- Hub-Präferenzen `secret-circle-party-preferences-v1`

Der Gesamtexport sammelt alle Schlüssel mit Präfix `secret-circle-`. Ein Rollback darf diese Daten nicht unkontrolliert löschen oder in ein inkompatibles Format zurücksetzen.

## Rollback

Bei einem kritischen Fehler:

1. Veröffentlichung stoppen.
2. gezielten Revert auf den letzten funktionierenden Commit erstellen.
3. Service-Worker-Cache erneut erhöhen, damit installierte Apps den Rollback laden.
4. Speicherschemata nur mit kompatibler Migration zurücksetzen.
5. Party Hub, komplexe Spiele und Word Imposter getrennt smoke-testen.
6. Export und Wiederherstellung einer vor dem Rollback erzeugten Sicherung prüfen.
7. vollständige CI- und manuelle Kernprüfungen erneut ausführen.
8. Rollback im Changelog dokumentieren.

Keinen Force-Push auf `main` verwenden.

## Eigene Domain und Recht

Zusätzlich prüfen:

- gültiges HTTPS-Zertifikat
- keine Weiterleitungsschleife
- Manifest-Scope innerhalb derselben Origin
- korrekte Cache- und Content-Type-Header
- Hosting-Anbieter und Kontaktinformationen im Datenschutz
- erforderliche Anbieter- und Impressumsangaben

## Produktionsfreigabe

GitHub Pages eignet sich für eine kontrollierte Web-PWA-Beta. Ein öffentlicher Produktionsrelease bleibt blockiert, bis CI, alle Spielarten, Android/iOS, Offline-Update, reale Gruppen, Inhalte und rechtliche Angaben vollständig bestätigt sind.
