# Secret Circle Party Hub – Deployment und Rollback

Secret Circle besteht aus statischen Dateien. Eine installierbare PWA benötigt HTTPS; `localhost` ist nur für lokale Entwicklung eine Ausnahme.

## Aktueller Umfang

- `party.html`: installierter Startpunkt und Party-Hub-Navigation
- `advanced.html`: komplexe Spiele
- `index.html`: Word Imposter
- `privacy.html`: Datenschutzinformationen
- Manifest-Start: `./party.html`
- Service-Worker-Cache: `secret-circle-v23`
- 22 sichtbare Spiele, 18 spielbar, 4 geplant und gesperrt
- Eigene Hub-Packs für kompatible Spiele

## Voraussetzungen für ein öffentliches Deployment

- `npm run ci` vollständig erfolgreich
- `npm run test:cross-browser` erfolgreich
- GitHub Actions mit sichtbaren Schritten grün
- keine kritischen oder hohen Fehler
- Android- und iOS-Installation geprüft
- Offline-Start und Update auf `secret-circle-v23` geprüft
- alle 18 Spiele mindestens einmal real getestet
- ein eigenes Pack erstellt, gespielt, exportiert, gelöscht und importiert
- kleiner und großer Partytest dokumentiert
- redaktionelle Inhaltsprüfung abgeschlossen
- Betreiber-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben ergänzt

## GitHub Pages

1. Draft-PR #11 erst nach erfolgreicher Prüfung freigeben.
2. Abhängige Basisänderungen geordnet in `main` übernehmen.
3. `Settings → Pages` öffnen.
4. `Deploy from a branch` wählen.
5. `main` und `/ (root)` auswählen.
6. HTTPS-Adresse abwarten.
7. den vollständigen Deployment-Smoke-Test ausführen.

## Smoke-Test nach dem Deployment

### Dateien und Browserkonsole

1. `party.html`, `advanced.html`, `index.html`, `privacy.html` und `manifest.webmanifest` liefern Status 200.
2. alle referenzierten CSS- und JavaScript-Dateien laden ohne Fehler.
3. Manifest installiert „Secret Circle – Party Hub“ mit `./party.html` als Start-URL.
4. 192- und 512-Pixel-Icons werden erkannt.
5. Content Security Policy blockiert keine benötigten eigenen Dateien.
6. Konsole und Netzwerkansicht enthalten keine unerwarteten Fehler.

### Party Hub

7. Startseite zeigt 18 spielbare und 4 geplante Spiele.
8. Suche und alle Filter funktionieren gemeinsam.
9. geplante Spiele sind sichtbar, aber nicht startbar.
10. Spieler, Presets, Favoriten, Altersstufe und Standardlänge bleiben nach Neuladen erhalten.
11. Verlauf, Statistik und Erfolge aktualisieren sich nach einer Session.
12. ältere unvollständige Statistikwerte werden aus dem Verlauf repariert.

### Eigene Hub-Packs

13. der Editor erscheint im Datenbereich.
14. nur kompatible Spiele stehen zur Auswahl.
15. weniger als drei Karten werden abgelehnt.
16. doppelte Karten werden entfernt.
17. doppelte Packnamen im selben Spiel werden blockiert.
18. ein gespeichertes Pack erscheint in Spieldetail und Pack-Auswahl.
19. das gewählte eigene Pack wird tatsächlich gespielt.
20. Löschen entfernt das Pack vollständig.
21. Export und Import erhalten das Pack.

### Komplexe Sessions

22. Zwei Wahrheiten, Question Imposter, Location Spy und Mafia starten korrekt.
23. eine gestartete Session speichert ihre ursprüngliche Spielergruppe.
24. die gemeinsame Lobby wird danach geändert.
25. nach Neuladen verwendet die Session weiterhin den ursprünglichen Spieler-Snapshot.
26. Rollen, Fragen und aktive Person passen weiterhin zu dieser Spielergruppe.
27. 3-, 5-, 10- und 20-Runden-Sessions funktionieren.
28. mehr als 20 Runden sind nicht möglich.
29. eine beschädigte aktive Session wird sicher verworfen.
30. ein simuliertes Scheitern der Verlaufsspeicherung lässt die Session aktiv.
31. erneutes Speichern erzeugt nur einen Verlaufseintrag.

### Word Imposter

32. Rollenverteilung ist unabhängig von der Aufdeckreihenfolge.
33. maximal sechs Imposter werden erzwungen.
34. Karten-Sichtschutz, Timer, Wahl, Stichwahl, Punkte und nächste Runde funktionieren.

### Gesamtsicherung

35. Export enthält Hub-, Pack-, Session- und Word-Imposter-Daten.
36. gültiger Import stellt alle Bereiche wieder her.
37. ungültiger Import verändert vorhandene Daten nicht.
38. fehlgeschlagener Schreibvorgang führt zum Rollback.
39. vollständige Löschung entfernt alle `secret-circle-*`-Schlüssel.

### PWA und Offline

40. nur Cache `secret-circle-v23` bleibt aktiv.
41. Party Hub, Pack-Editor, komplexe Spiele, Word Imposter und Datenschutz starten offline.
42. Question Imposter kann offline begonnen werden.
43. eine aktive Session bleibt nach PWA-Update erhalten.
44. die Spielergruppe der aktiven Session bleibt nach dem Update unverändert.
45. Eigene Hub-Packs bleiben nach dem Update erhalten.

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

Die Expansion ist noch kein freigegebener stabiler Release. Nach vollständiger Beta-Freigabe:

```bash
git tag -a v1.0.0-beta.4 -m "Secret Circle Party Hub beta 4"
git push origin v1.0.0-beta.4
```

`v1.0.0` darf erst nach allen automatisierten, realen und rechtlichen Prüfungen erstellt werden.

## Update-Regeln

Bei Änderungen an offline benötigten Dateien:

1. Cache-Version in `sw.js` erhöhen.
2. CORE-Liste, Offline-Test, Runtime-Test, Validator und Release-Audit synchronisieren.
3. Manifest und HTML-Scriptreihenfolge prüfen.
4. eine alte installierte Version öffnen.
5. neue Version online laden.
6. kontrollieren, dass nur der neue Cache besteht.
7. Hub-Daten, Eigene Hub-Packs, aktive Session und Word-Imposter-Daten prüfen.
8. insbesondere den Session-Spieler-Snapshot vor und nach dem Update vergleichen.

## Datenkompatibilität

Relevante Speicherbereiche:

- Word-Imposter-Schlüssel der Version 7
- `secret-circle-party-hub-v1`
- `secret-circle-party-custom-packs-v1`
- `secret-circle-party-active-v1`
- `secret-circle-party-preferences-v1`

Der Gesamtexport sammelt alle Schlüssel mit Präfix `secret-circle-`. Ein Rollback darf diese Daten nicht unkontrolliert löschen oder in ein inkompatibles Format zurücksetzen.

## Rollback

Bei einem kritischen Fehler:

1. Veröffentlichung stoppen.
2. gezielten Revert auf den letzten funktionierenden Commit erstellen.
3. Cache-Version erneut erhöhen, damit installierte Apps den Rollback laden.
4. Speicherschemata nur mit kompatibler Migration zurücksetzen.
5. Party Hub, eigene Packs, komplexe Spiele und Word Imposter getrennt prüfen.
6. eine Sicherung von vor dem Rollback importieren.
7. vollständige CI- und manuelle Kernprüfungen wiederholen.
8. Rollback im Changelog dokumentieren.

Keinen Force-Push auf `main` verwenden.

## Produktionsfreigabe

GitHub Pages eignet sich für eine kontrollierte Web-PWA-Beta. Der öffentliche Produktionsrelease bleibt blockiert, bis CI, Browsermatrix, Android/iOS, Offline-Update, reale Gruppen, Inhalte und rechtliche Angaben vollständig bestätigt sind.
