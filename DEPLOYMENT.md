# Secret Circle Party Hub – Deployment und Rollback

Secret Circle besteht aus statischen Dateien. Eine installierbare PWA benötigt HTTPS; `localhost` ist nur für lokale Entwicklung eine Ausnahme.

## Aktueller Umfang

- `party.html`: installierter Startpunkt und Party-Hub-Navigation
- `advanced.html`: komplexe Spiele
- `index.html`: Word Imposter
- `privacy.html`: Datenschutzinformationen
- Manifest-Start: `./party.html`
- Service-Worker-Cache: `secret-circle-v24`
- 22 sichtbare Spiele, 18 spielbar, 4 geplant und gesperrt
- Eigene Hub-Packs für kompatible Spiele
- byte-sichere Gesamtsicherung und transaktionssichere Löschung

## Voraussetzungen für ein öffentliches Deployment

- `npm run ci` vollständig erfolgreich
- `npm run test:cross-browser` erfolgreich
- GitHub Actions mit sichtbaren Schritten grün
- keine kritischen oder hohen Fehler
- Android- und iOS-Installation geprüft
- Offline-Start und Update auf `secret-circle-v24` geprüft
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
2. alle CSS- und JavaScript-Dateien laden ohne Fehler.
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
12. ein simulierter Präferenz-Speicherfehler zeigt eine Warnung, ohne die aktuelle Auswahl zu blockieren.
13. ein simulierter Statistik-Speicherfehler zeigt eine Warnung, ohne den Hub zu blockieren.

### Eigene Hub-Packs

14. Editor erscheint im Datenbereich.
15. nur kompatible Spiele stehen zur Auswahl.
16. weniger als drei Karten werden abgelehnt.
17. Unicode- und Groß-/Kleinschreibungs-Duplikate werden entfernt.
18. doppelte Packnamen werden blockiert.
19. ein gespeichertes Pack erscheint in Spieldetail und Auswahl.
20. das gewählte Pack wird tatsächlich gespielt.
21. simulierter Speicherfehler beim Hinzufügen verändert weder Packliste noch Katalog.
22. simulierter Speicherfehler beim Löschen erhält das Pack vollständig.
23. normaler Löschvorgang entfernt das Pack vollständig.

### Komplexe Sessions

24. Zwei Wahrheiten, Question Imposter, Location Spy und Mafia starten korrekt.
25. eine gestartete Session speichert ihre ursprüngliche Spielergruppe.
26. die gemeinsame Lobby wird danach geändert.
27. nach Neuladen verwendet die Session weiterhin den ursprünglichen Spieler-Snapshot.
28. Rollen, Fragen und aktive Person passen weiter zu dieser Spielergruppe.
29. 3-, 5-, 10- und 20-Runden-Sessions funktionieren.
30. mehr als 20 Runden sind nicht möglich.
31. eine beschädigte aktive Session wird sicher verworfen.
32. simuliertes Scheitern der Verlaufsspeicherung lässt die Session aktiv.
33. erneutes Speichern erzeugt genau einen Verlaufseintrag.

### Gesamtsicherung

34. Export enthält Hub-, Pack-, Session- und Word-Imposter-Daten.
35. gültiger Import stellt alle Bereiche wieder her.
36. ungültiger Import verändert vorhandene Daten nicht.
37. Mehrbyte-Datei über 1,5 MB wird vor Datenänderung abgelehnt.
38. simulierter Schreibfehler während des Imports stellt alle vorherigen Daten wieder her.
39. simulierter Löschfehler stellt alle vorherigen Daten wieder her.
40. fehlgeschlagener Rollback erzeugt eine eindeutige kritische Meldung.
41. normale vollständige Löschung entfernt alle `secret-circle-*`-Schlüssel.

### PWA und Offline

42. nur Cache `secret-circle-v24` bleibt aktiv.
43. Party Hub, Pack-Editor, komplexe Spiele, Word Imposter und Datenschutz starten offline.
44. Question Imposter kann offline begonnen werden.
45. aktive Session bleibt nach PWA-Update erhalten.
46. Spielergruppe der aktiven Session bleibt nach dem Update unverändert.
47. Eigene Hub-Packs und Einstellungen bleiben nach dem Update erhalten.

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
7. Hub-Daten, Eigene Hub-Packs, aktive Session und Word-Imposter-Daten prüfen.
8. Spieler-Snapshot vor und nach dem Update vergleichen.
9. Export der alten Version in die neue Version importieren.

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
6. Sicherung von vor dem Rollback importieren.
7. vollständige CI- und manuelle Kernprüfungen wiederholen.
8. Rollback im Changelog dokumentieren.

Keinen Force-Push auf `main` verwenden.

## Produktionsfreigabe

GitHub Pages eignet sich für eine kontrollierte Web-PWA-Beta. Der öffentliche Produktionsrelease bleibt blockiert, bis CI, Browsermatrix, Android/iOS, Offline-Update, reale Gruppen, Inhalte und rechtliche Angaben vollständig bestätigt sind.
