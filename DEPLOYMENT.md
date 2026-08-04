# Secret Circle Party Hub – Deployment und Rollback

Secret Circle besteht ausschließlich aus statischen Dateien. Eine veröffentlichte PWA benötigt HTTPS; `localhost` ist nur für lokale Entwicklung eine Ausnahme.

## Aktueller Umfang

- `party.html`: neuer Party Hub mit Spielekatalog und vierzehn spielbaren Spielen
- `index.html`: bestehendes Word-Imposter-Spiel
- `privacy.html`: Datenschutzinformationen
- Service-Worker-Cache: `secret-circle-v19`

## Voraussetzungen

Vor einem öffentlichen Deployment müssen folgende Punkte erfüllt sein:

- `npm run ci` lokal erfolgreich
- `npm run test:cross-browser` erfolgreich
- GitHub Actions auf dem endgültigen Commit grün
- Party-Hub-Navigation und mindestens fünf Hub-Spiele auf realen Geräten geprüft
- Word Imposter vollständig geprüft
- Offline- und Update-Test dokumentiert
- keine offenen kritischen oder hohen Fehler

## GitHub Pages

1. Expansionsbranch erst nach erfolgreicher Prüfung zusammenführen.
2. `Settings → Pages` öffnen.
3. `Deploy from a branch` wählen.
4. Branch `main`, Ordner `/ (root)` auswählen.
5. HTTPS-Adresse abwarten und den vollständigen Smoke-Test durchführen.

## Prüfung nach dem Deployment

### Seiten und Assets

1. `party.html`, `index.html`, `privacy.html` und `manifest.webmanifest` liefern Status 200.
2. `party.css`, `party-catalog.js` und `party-hub.js` werden ohne Fehler geladen.
3. Manifest, 192- und 512-Pixel-Icons werden korrekt erkannt.
4. Content Security Policy blockiert keine eigenen benötigten Dateien.

### Party Hub

5. Startseite zeigt vierzehn spielbare und vier geplante Spiele.
6. Suche und alle Filter funktionieren.
7. geplante Spiele sind sichtbar, aber nicht startbar.
8. Spieler, Host-Presets und Favoriten bleiben nach Neuladen erhalten.
9. Wahrheit oder Pflicht, Entweder oder, Scharade, Nicht sagen!, Heiße Kartoffel und Zufallswerkzeuge starten korrekt.
10. beendete Sessions erscheinen im lokalen Hub-Verlauf.
11. `party.html` verlinkt zu Word Imposter und `index.html` zurück zum Party Hub.

### Word Imposter

12. Rollenverteilung ist unabhängig von der Aufdeckreihenfolge.
13. maximal sechs Imposter werden auch bei wiederhergestellten Spielen erzwungen.
14. Karten-Sichtschutz, Timer, geheime Wahl, Stichwahl, Punkte und nächste Runde funktionieren.
15. Backup-Export, Import und vollständige Imposter-Datenlöschung funktionieren.

### PWA und Offline

16. Service Worker verwendet ausschließlich Cache `secret-circle-v19`.
17. Party Hub, Word Imposter und Datenschutzseite starten nach einem vollständigen Online-Aufruf offline.
18. folgende Hub-Dateien sind offline verfügbar:
    - `party.html`
    - `party.css`
    - `party-catalog.js`
    - `party-hub.js`
19. alle bisherigen Imposter- und Schutzmodule sind offline verfügbar.
20. nach einem Update bleibt nur Cache `secret-circle-v19` bestehen.
21. Android- und iOS-Installation funktionieren.

## Lokaler Smoke-Test

```bash
python -m http.server 8080
```

Danach prüfen:

- `http://localhost:8080/party.html`
- `http://localhost:8080/index.html`
- Browserkonsole ohne Fehler
- Responsive-Modus für kleines Smartphone, großes Smartphone und Tablet

## Release markieren

Die aktuelle Expansionsarbeit ist noch kein stabiler Release. Erst nach erfolgreicher Freigabe eine neue Beta-Version festlegen und markieren.

Beispiel nach der Freigabe:

```bash
git tag -a v1.0.0-beta.4 -m "Secret Circle Party Hub beta 4"
git push origin v1.0.0-beta.4
```

Eine stabile Version `v1.0.0` darf erst nach allen automatisierten, realen und rechtlichen Freigabeprüfungen erstellt werden.

## Update-Regeln

Bei Änderungen an offline benötigten Dateien:

1. Cache-Version in `sw.js` erhöhen.
2. `CORE`, Offline-Test, Strukturvalidator, Performancebudget und Release-Audit synchronisieren.
3. ältere installierte Version öffnen und Update testen.
4. prüfen, dass keine Mischung aus alten und neuen Laufzeitdateien entsteht.
5. lokale Hub- und Imposter-Daten getrennt auf Kompatibilität prüfen.
6. Changelog und Release-Status aktualisieren.

## Datenkompatibilität

Aktuell existieren zwei lokale Datenbereiche:

- versionierter Word-Imposter-Speicher
- Party-Hub-Speicher `secret-circle-party-hub-v1`

Ein Rollback darf keinen dieser Speicherbereiche unkontrolliert löschen. Vor einem stabilen Release soll das gemeinsame Backup beide Bereiche abdecken.

## Rollback

Bei einem kritischen Fehler:

1. Veröffentlichung stoppen.
2. gezielten Revert auf den letzten funktionierenden Commit erstellen.
3. Service-Worker-Cache erneut erhöhen, damit installierte Apps den Rollback beziehen.
4. Speicherschemata nicht ohne kompatible Migration zurücksetzen.
5. Party Hub und Word Imposter getrennt smoke-testen.
6. vollständige CI- und manuelle Kernprüfungen erneut ausführen.
7. Rollback im Changelog dokumentieren.

Keinen Force-Push auf `main` verwenden.

## Eigene Domain und Recht

Zusätzlich prüfen:

- gültiges HTTPS-Zertifikat
- keine Weiterleitungsschleife
- Manifest-Scope innerhalb derselben Origin
- Hosting-Anbieter und Kontaktinformationen im Datenschutz
- erforderliche Anbieter- und Impressumsangaben

## Produktionsfreigabe

GitHub Pages ist für eine kontrollierte Web-PWA-Beta geeignet. Der öffentliche Produktionsrelease bleibt blockiert, bis CI, Party Hub, Word Imposter, Android/iOS, Offline-Modus, reale Gruppen und rechtliche Angaben vollständig bestätigt sind.
