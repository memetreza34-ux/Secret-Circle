# Secret Circle Party Hub – Deployment und Rollback

Secret Circle besteht aus statischen Dateien. Eine installierbare PWA benötigt HTTPS; `localhost` ist nur für lokale Entwicklung eine Ausnahme.

## Aktueller Umfang

- `party.html`: installierter Startpunkt und Party-Hub-Navigation
- `advanced.html`: komplexe Spiele
- `index.html`: Word Imposter
- `privacy.html`: Datenschutzinformationen
- Manifest-Start: `./party.html`
- Service-Worker-Cache: `secret-circle-v25`
- 22 sichtbare Spiele, 18 spielbar, 4 geplant und gesperrt
- Smart Party Night für gespeicherte komplette Spielabläufe
- eigene Hub-Packs für kompatible Spiele
- byte-sichere Gesamtsicherung und transaktionssichere Löschung

## Voraussetzungen für ein öffentliches Deployment

- `npm run ci` vollständig erfolgreich
- `npm run test:cross-browser` erfolgreich
- GitHub Actions mit sichtbaren Schritten grün
- keine kritischen oder hohen Fehler
- Android- und iOS-Installation geprüft
- Offline-Start und Update auf `secret-circle-v25` geprüft
- Smart Party Night mit allen Zeitbudgets geprüft
- alle 18 Spiele mindestens einmal real getestet
- eigenes Pack erstellt, gespielt, exportiert, gelöscht und importiert
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
7. vollständigen Deployment-Smoke-Test ausführen.

## Smoke-Test nach dem Deployment

### Dateien und Browserkonsole

1. `party.html`, `advanced.html`, `index.html`, `privacy.html` und `manifest.webmanifest` liefern Status 200.
2. alle CSS- und JavaScript-Dateien einschließlich `party-night.css` und `party-night.js` laden ohne Fehler.
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
12. die Desktop-Navigation zeigt sechs gleichwertige Ziele und bricht mobil sauber auf drei Spalten um.
13. Tastaturfokus ist auf Spielkarten, Timeline und Aktionen sichtbar.

### Smart Party Night

14. Planer zeigt die gespeicherte Spielerzahl.
15. 15, 30, 45, 60 und 90 Minuten erzeugen gültige Abläufe.
16. Familienfilter enthält ausschließlich familienfreundliche Spiele.
17. Gruppengröße schließt unpassende Spiele aus.
18. ein Plan enthält keine doppelten Spiele.
19. Favoriten und zuletzt gespielte Titel beeinflussen die Reihenfolge nachvollziehbar.
20. „Öffnen“ zeigt die korrekten Spieldetails.
21. „Als erledigt“ verschiebt den aktuellen Schritt.
22. „Überspringen“ wird im Fortschritt getrennt gezählt.
23. Plan bleibt nach Neuladen und PWA-Neustart erhalten.
24. abgeschlossener Plan zeigt den Abschlusszustand.
25. Plan kann neu erzeugt oder vollständig gelöscht werden.

### Eigene Hub-Packs

26. Editor erscheint im Datenbereich.
27. nur kompatible Spiele stehen zur Auswahl.
28. weniger als drei Karten werden abgelehnt.
29. Unicode- und Groß-/Kleinschreibungs-Duplikate werden entfernt.
30. doppelte Packnamen werden blockiert.
31. ein gespeichertes Pack erscheint in Spieldetail und Auswahl.
32. das gewählte Pack wird tatsächlich gespielt.
33. simulierter Speicherfehler beim Hinzufügen verändert weder Packliste noch Katalog.
34. simulierter Speicherfehler beim Löschen erhält das Pack vollständig.
35. normaler Löschvorgang entfernt das Pack vollständig.

### Komplexe Sessions

36. Zwei Wahrheiten, Question Imposter, Location Spy und Mafia starten korrekt.
37. eine gestartete Session speichert ihre ursprüngliche Spielergruppe.
38. die gemeinsame Lobby wird danach geändert.
39. nach Neuladen verwendet die Session weiterhin den ursprünglichen Spieler-Snapshot.
40. Rollen, Fragen und aktive Person passen weiter zu dieser Spielergruppe.
41. 3-, 5-, 10- und 20-Runden-Sessions funktionieren.
42. mehr als 20 Runden sind nicht möglich.
43. eine beschädigte aktive Session wird sicher verworfen.
44. simuliertes Scheitern der Verlaufsspeicherung lässt die Session aktiv.
45. erneutes Speichern erzeugt genau einen Verlaufseintrag.

### Gesamtsicherung

46. Export enthält Hub-, Party-Night-, Pack-, Session- und Word-Imposter-Daten.
47. gültiger Import stellt alle Bereiche wieder her.
48. ungültiger Import verändert vorhandene Daten nicht.
49. Mehrbyte-Datei über 1,5 MB wird vor Datenänderung abgelehnt.
50. simulierter Schreibfehler während des Imports stellt alle vorherigen Daten wieder her.
51. simulierter Löschfehler stellt alle vorherigen Daten wieder her.
52. fehlgeschlagener Rollback erzeugt eine eindeutige kritische Meldung.
53. normale vollständige Löschung entfernt alle `secret-circle-*`-Schlüssel.

### PWA und Offline

54. nur Cache `secret-circle-v25` bleibt aktiv.
55. Party Hub, Party Night, Pack-Editor, komplexe Spiele, Word Imposter und Datenschutz starten offline.
56. Party Night kann offline einen Plan erzeugen und fortsetzen.
57. Question Imposter kann offline begonnen werden.
58. aktive Session bleibt nach PWA-Update erhalten.
59. Spielergruppe der aktiven Session bleibt nach dem Update unverändert.
60. eigene Hub-Packs, Party-Night-Fortschritt und Einstellungen bleiben nach dem Update erhalten.

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

## Update-Regeln

Bei Änderungen an offline benötigten Dateien:

1. Cache-Version in `sw.js` erhöhen.
2. CORE-Liste, Offline-Test, Runtime-Test, Validator und Release-Audit synchronisieren.
3. Manifest und HTML-Scriptreihenfolge prüfen.
4. alte installierte Version öffnen.
5. neue Version online laden.
6. kontrollieren, dass nur der neue Cache besteht.
7. Hub-Daten, Party Night, eigene Hub-Packs, aktive Session und Word-Imposter-Daten prüfen.
8. Spieler-Snapshot vor und nach dem Update vergleichen.
9. Export der alten Version in die neue Version importieren.

## Datenkompatibilität

Relevante Speicherbereiche:

- Word-Imposter-Schlüssel der Version 7
- `secret-circle-party-hub-v1`
- `secret-circle-party-night-v1`
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
5. Party Hub, Party Night, eigene Packs, komplexe Spiele und Word Imposter getrennt prüfen.
6. Sicherung von vor dem Rollback importieren.
7. vollständige CI- und manuelle Kernprüfungen wiederholen.
8. Rollback im Changelog dokumentieren.

Keinen Force-Push auf `main` verwenden.

## Produktionsfreigabe

GitHub Pages eignet sich für eine kontrollierte Web-PWA-Beta. Der öffentliche Produktionsrelease bleibt blockiert, bis CI, Browsermatrix, Android/iOS, Offline-Update, reale Gruppen, Party Night, Inhalte und rechtliche Angaben vollständig bestätigt sind.
