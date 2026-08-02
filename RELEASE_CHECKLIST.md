# Secret Circle – Release-Checkliste

Diese Checkliste muss für jeden öffentlichen Release vollständig ausgefüllt werden. Nicht bestätigte Punkte blockieren den Release.

## 1. Automatisierte Prüfungen

- [ ] `npm run check`
- [ ] `npm test`
- [ ] `npm run validate`
- [ ] `npm run test:e2e`
- [ ] `npm run ci`
- [ ] GitHub Actions auf dem Release-Commit erfolgreich
- [ ] Keine offenen kritischen oder hohen Fehler

## 2. Kernspiel

- [ ] Spielstart mit 3 Personen
- [ ] Spielstart mit 20 Personen
- [ ] Mehrere Imposter korrekt verteilt
- [ ] Doppelte Namen werden blockiert
- [ ] Kartenübergabe zeigt nur die aktuelle Rolle
- [ ] Diskussion und Timer funktionieren
- [ ] Timer pausieren und fortsetzen funktioniert
- [ ] Abstimmung aller Personen funktioniert
- [ ] Selbstwahl wird verhindert
- [ ] Stichwahl bei Gleichstand funktioniert und endet garantiert
- [ ] Gefundener Imposter kann den Begriff raten
- [ ] Punkte werden korrekt vergeben
- [ ] Rangliste ist korrekt sortiert
- [ ] Nächste Runde übernimmt den Punktestand
- [ ] Begriffe wiederholen sich erst nach erschöpftem Pool
- [ ] Match endet nach der gewählten Rundenzahl

## 3. Speicherung, Sicherung und Datenschutz

- [ ] Aktive Runde kann nach Neuladen fortgesetzt werden
- [ ] Ältere lokale Daten werden korrekt migriert
- [ ] Beschädigte lokale Daten werden sicher verworfen
- [ ] Einstellungen bleiben lokal erhalten
- [ ] Eigene Kategorien bleiben lokal erhalten
- [ ] Rundenverlauf bleibt lokal erhalten
- [ ] Vollständige JSON-Sicherung kann exportiert werden
- [ ] Exportierte Sicherung enthält Spielstand, Einstellungen, Verlauf und Kategorien
- [ ] Gültige Sicherung kann vollständig importiert werden
- [ ] Ungültige oder zu große Sicherung wird abgelehnt
- [ ] Fehlgeschlagener Import beschädigt keine bestehenden Daten
- [ ] Alle lokalen Daten können vollständig gelöscht werden
- [ ] Nach vollständigem Löschen startet die App sauber
- [ ] Datenschutzseite ist erreichbar und verständlich
- [ ] Keine Analyse-, Tracking- oder Werbedienste eingebunden
- [ ] Keine Secrets oder `.env`-Dateien im Repository

## 4. PWA und Offline

- [ ] Erstaufruf online erfolgreich
- [ ] App danach vollständig offline startbar
- [ ] `index.html` offline verfügbar
- [ ] `privacy.html` offline verfügbar
- [ ] CSS, JavaScript, Manifest und Icon offline verfügbar
- [ ] `word-packs.js` und `data-store.js` offline verfügbar
- [ ] Service-Worker-Update ersetzt alte Cache-Version
- [ ] Installation auf Android erfolgreich
- [ ] Installation auf iOS zum Home-Bildschirm erfolgreich
- [ ] Start aus installiertem Modus erfolgreich
- [ ] Aktualisierung einer installierten Version geprüft

## 5. Browser und Geräte

- [ ] Chrome Android aktuell
- [ ] Safari iOS aktuell
- [ ] Chrome Desktop aktuell
- [ ] Safari Desktop aktuell
- [ ] Firefox Desktop aktuell
- [ ] Kleine Smartphone-Breite geprüft
- [ ] Großes Smartphone geprüft
- [ ] Tablet geprüft
- [ ] Bildschirmrotation geprüft

## 6. Accessibility und Bedienung

- [ ] Vollständig per Tastatur bedienbar
- [ ] Fokus bleibt bei Bildschirmwechseln nachvollziehbar
- [ ] Fokus ist sichtbar
- [ ] Formulare besitzen verständliche Labels
- [ ] Statusmeldungen werden angekündigt
- [ ] Farbkontrast manuell geprüft
- [ ] Vergrößerung auf 200 % geprüft
- [ ] `prefers-reduced-motion` geprüft
- [ ] Screenreader-Kurztest durchgeführt
- [ ] Touchflächen sind groß genug

## 7. Inhalt und Sicherheit

- [ ] Alle 14 eingebauten Kategorien redaktionell geprüft
- [ ] Alle 168 eingebauten Begriffe redaktionell geprüft
- [ ] Keine diskriminierenden oder ungeeigneten Inhalte
- [ ] Hilfswörter verraten den Begriff nicht direkt
- [ ] Eigene Kategorien behandeln Eingaben sicher
- [ ] Dynamische Inhalte werden vor HTML-Ausgabe escaped
- [ ] Content Security Policy ist aktiv und blockiert fremde Skripte
- [ ] Keine externen Ressourcen ohne klare Notwendigkeit

## 8. Release-Dokumentation

- [ ] Versionsnummer festgelegt
- [ ] Release-Commit dokumentiert
- [ ] Änderungen seit vorheriger Version beschrieben
- [ ] Bekannte Einschränkungen dokumentiert
- [ ] Rollback-Möglichkeit festgelegt
- [ ] Backup-Kompatibilität dokumentiert
- [ ] Verantwortliche Testperson und Testdatum eingetragen

## Freigabe

- Version:
- Commit:
- Testdatum:
- Getestet von:
- Ergebnis: `GO` / `NO_GO`
- Offene Einschränkungen:
