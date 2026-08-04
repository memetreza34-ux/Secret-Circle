# Secret Circle – Deployment und Rollback

Secret Circle besteht ausschließlich aus statischen Dateien. Für die PWA-Installation und den Service Worker muss die veröffentlichte Website über HTTPS ausgeliefert werden. `localhost` ist nur für lokale Entwicklung eine Ausnahme.

## Empfohlener erster Betatest: GitHub Pages

### Voraussetzungen

- Pull Request #3 ist geprüft und zusammengeführt.
- `npm run ci` ist lokal erfolgreich.
- GitHub Actions läuft auf dem endgültigen Commit vollständig grün.
- `RELEASE_CHECKLIST.md` enthält keine offenen kritischen Punkte.

### Pages aktivieren

1. Repository öffnen.
2. `Settings → Pages` öffnen.
3. Als Quelle `Deploy from a branch` wählen.
4. Branch `main` und Ordner `/ (root)` auswählen.
5. Speichern und auf die bereitgestellte HTTPS-Adresse warten.

Für den ersten kontrollierten Betatest ist die Branch-Bereitstellung ausreichend, weil die App keinen Build-Schritt benötigt.

## Prüfung nach dem Deployment

Die veröffentlichte URL in einem privaten Browserfenster öffnen und prüfen:

1. `index.html`, `privacy.html` und `manifest.webmanifest` liefern Status 200.
2. Browser-Entwicklertools erkennen ein gültiges Manifest.
3. 192- und 512-Pixel-Icons werden ohne Fehler geladen.
4. Service Worker wird registriert und verwendet Cache `secret-circle-v15`.
5. App ist nach einem vollständigen Online-Aufruf im Flugmodus erneut startbar.
6. Installation auf Android beziehungsweise „Zum Home-Bildschirm“ auf iOS funktioniert.
7. Keine Fehler in Konsole oder Netzwerkansicht.
8. Aktiver Spielstand bleibt nach Neuladen erhalten.
9. Sicherungsexport und -import funktionieren.
10. Datenschutzseite, Live-Einrichtungslogik und Karten-Sichtschutz sind offline erreichbar.
11. Eine sichtbare geheime Karte wird bei App-Wechsel oder Fokusverlust automatisch verdeckt und kann erst nach erneutem Öffnen weitergegeben werden.
12. Nach einer Aktualisierung bleibt nur Cache `secret-circle-v15` bestehen.

## Release-Version markieren

Nach erfolgreicher Freigabe einen Git-Tag verwenden:

```bash
git tag -a v1.0.0-beta.3 -m "Secret Circle 1.0.0 beta 3"
git push origin v1.0.0-beta.3
```

Erst nach Abschluss aller Beta-Prüfungen sollte eine stabile Version wie `v1.0.0` erstellt werden.

## Update-Verhalten

Bei jeder Änderung an offline benötigten Dateien:

1. Cache-Version in `sw.js` erhöhen.
2. neue oder entfernte Kerndateien in `CORE` anpassen.
3. Offline-Test, Strukturvalidator und Release-Audit aktualisieren.
4. installierte ältere Version online öffnen.
5. automatische Aktualisierung und einmaliges Neuladen prüfen.
6. kontrollieren, dass nur der neue Cache erhalten bleibt.

Lokale Spielstände werden unabhängig vom Service-Worker-Cache gespeichert und müssen über `data-store.js` migriert werden, wenn sich das Format ändert.

## Rollback

Vor jedem öffentlichen Deployment den letzten funktionierenden Commit und Tag dokumentieren.

Bei einem kritischen Fehler:

1. Veröffentlichung nicht weiter bewerben.
2. letzten funktionierenden Commit auf `main` wiederherstellen oder einen gezielten Revert erstellen.
3. Cache-Version in `sw.js` erneut erhöhen, damit installierte Apps den Rollback übernehmen.
4. Datenschema nicht zurücksetzen, wenn dadurch neue lokale Spielstände unlesbar werden.
5. `npm run ci` und die kritischen manuellen Tests erneut ausführen.
6. Rollback als neuen Patch- beziehungsweise Beta-Release dokumentieren.

Ein Force-Push auf `main` sollte vermieden werden. Ein nachvollziehbarer Revert erhält die Release-Historie und erleichtert die Fehlersuche.

## Eigene Domain

Bei einer eigenen Domain zusätzlich prüfen:

- HTTPS-Zertifikat aktiv,
- keine Weiterleitungsschleife,
- `start_url` und `scope` bleiben innerhalb derselben Origin,
- Service Worker wird nicht unter einem Unterpfad außerhalb seines Gültigkeitsbereichs ausgeliefert,
- Hosting-Anbieter und Kontaktinformationen sind in Datenschutz und gegebenenfalls Impressum ergänzt.

## Produktionsfreigabe

GitHub Pages kann für eine kontrollierte Web-PWA-Beta verwendet werden. Eine öffentliche Produktionsfreigabe ist erst zulässig, wenn reale Android-/iOS-Tests, Partytests, rechtliche Angaben und der grüne CI-Nachweis vollständig dokumentiert sind.
