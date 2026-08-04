# Secret Circle – Deployment und Rollback

Secret Circle besteht ausschließlich aus statischen Dateien. Eine veröffentlichte PWA benötigt HTTPS; `localhost` ist nur für lokale Entwicklung eine Ausnahme.

## Voraussetzungen

- `npm run ci` lokal erfolgreich
- `npm run test:cross-browser` erfolgreich
- GitHub Actions auf dem endgültigen Commit grün
- reale Geräte- und Partytests dokumentiert
- keine offenen kritischen oder hohen Fehler

## GitHub Pages

1. Pull Request #3 nach erfolgreicher Prüfung zusammenführen.
2. `Settings → Pages` öffnen.
3. `Deploy from a branch` wählen.
4. Branch `main`, Ordner `/ (root)` auswählen.
5. HTTPS-Adresse abwarten und den Smoke-Test durchführen.

## Prüfung nach dem Deployment

1. `index.html`, `privacy.html` und `manifest.webmanifest` liefern Status 200.
2. Manifest, 192- und 512-Pixel-Icons werden korrekt erkannt.
3. Service Worker verwendet ausschließlich Cache `secret-circle-v17`.
4. Rollenverteilung ist aktiv und unabhängig von der Aufdeckreihenfolge.
5. Über mehrere Runden ist die zuerst aufdeckende Person nicht systematisch Imposter.
6. App startet nach einem Online-Aufruf vollständig offline.
7. `role-assignment.js`, `setup-ux.js`, `privacy-guard.js` und `wake-lock.js` sind offline verfügbar.
8. Android- und iOS-Installation funktionieren.
9. Aktiver Spielstand, Timer, Verlauf und Punkte überstehen Neuladen.
10. Backup-Export, Import und vollständige Datenlöschung funktionieren.
11. Geheime Karten werden bei App-Wechsel verdeckt und können nicht verdeckt weitergegeben werden.
12. Wake Lock wird während der Diskussion angefordert und anschließend freigegeben; ohne API funktioniert das Spiel weiter.
13. Nach einem Update bleibt nur Cache `secret-circle-v17` bestehen.

## Release markieren

```bash
git tag -a v1.0.0-beta.3 -m "Secret Circle 1.0.0 beta 3"
git push origin v1.0.0-beta.3
```

Eine stabile Version `v1.0.0` darf erst nach allen Freigabeprüfungen erstellt werden.

## Update-Regeln

Bei Änderungen an offline benötigten Dateien:

1. Cache-Version in `sw.js` erhöhen.
2. `CORE`, Offline-Test, Strukturvalidator und Release-Audit synchronisieren.
3. alte installierte Version öffnen und Update testen.
4. prüfen, dass keine Mischung aus alten und neuen Laufzeitdateien entsteht.
5. lokale Datenmigration separat prüfen.

## Rollback

Bei einem kritischen Fehler:

1. Veröffentlichung stoppen.
2. gezielten Revert auf den letzten funktionierenden Commit erstellen.
3. Service-Worker-Cache erneut erhöhen, damit installierte Apps den Rollback beziehen.
4. Speicherschema nicht ohne kompatible Migration zurücksetzen.
5. vollständige CI- und manuelle Kernprüfungen erneut ausführen.
6. Rollback im Changelog dokumentieren.

Keinen Force-Push auf `main` verwenden.

## Eigene Domain und Recht

Zusätzlich prüfen:

- gültiges HTTPS-Zertifikat
- keine Weiterleitungsschleife
- Manifest-Scope innerhalb derselben Origin
- Hosting-Anbieter und Kontaktinformationen im Datenschutz
- erforderliche Anbieter- und Impressumsangaben

## Produktionsfreigabe

GitHub Pages ist für eine kontrollierte Web-PWA-Beta geeignet. Der öffentliche Produktionsrelease bleibt blockiert, bis CI, Rollenverteilung, Android/iOS, Offline-Modus, Partytests und rechtliche Angaben vollständig bestätigt sind.
