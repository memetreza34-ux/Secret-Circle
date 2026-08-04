# Secret Circle – Release-Checkliste

Diese Checkliste muss für jeden öffentlichen Release vollständig ausgefüllt werden. Nicht bestätigte Punkte blockieren den Release.

## 1. Automatisierte Prüfungen

- [ ] `npm run check`
- [ ] `npm test`
- [ ] `npm run validate`
- [ ] `npm run test:e2e`
- [ ] `npm run ci`
- [ ] `npm run test:cross-browser`
- [ ] GitHub Actions auf dem Release-Commit erfolgreich
- [ ] Playwright-Bericht ohne fehlgeschlagene Desktop- oder Mobile-Tests
- [ ] Keine offenen kritischen oder hohen Fehler

## 2. Kernspiel

- [ ] Spielstart mit 3 Personen
- [ ] Spielstart mit 20 Personen
- [ ] Live-Anzeige erkennt Gruppengröße und doppelte Namen korrekt
- [ ] Gültiger Imposter-Bereich passt sich an die Gruppengröße an
- [ ] Mehrere Imposter korrekt verteilt
- [ ] Doppelte Namen werden blockiert
- [ ] Kartenübergabe zeigt nur die aktuelle Rolle
- [ ] Sichtbare Karte wird bei App-Wechsel oder Fokusverlust automatisch verdeckt
- [ ] Automatisch verdeckte Karte kann nicht ohne erneutes Öffnen weitergegeben werden
- [ ] Sichere Fokusposition wird nach Rückkehr wiederhergestellt
- [ ] Diskussion und Timer funktionieren
- [ ] Timer pausieren und fortsetzen funktioniert
- [ ] Timer läuft nach App-Wechsel und Neuladen korrekt weiter
- [ ] Abgelaufener Timer wird nach Rückkehr korrekt angezeigt
- [ ] Abstimmung aller Personen funktioniert
- [ ] Selbstwahl und doppelte Stimmen werden verhindert
- [ ] Stichwahl bei Gleichstand funktioniert und endet garantiert
- [ ] Gefundener Imposter kann den Begriff raten
- [ ] Punkte werden korrekt vergeben
- [ ] Rangliste ist korrekt sortiert
- [ ] Jede abgeschlossene Runde erscheint genau einmal im Verlauf
- [ ] Nächste Runde übernimmt den Punktestand
- [ ] Begriffe wiederholen sich erst nach erschöpftem Pool
- [ ] Match endet nach der gewählten Rundenzahl

## 3. Speicherung, Sicherung und Datenschutz

- [ ] Aktive Runde kann nach Neuladen fortgesetzt werden
- [ ] Alte Engine-Spielstände werden auf Version 7 migriert
- [ ] Alte Speicherschlüssel werden nach erfolgreicher Migration entfernt
- [ ] Beschädigte lokale Daten werden sicher verworfen
- [ ] Einstellungen bleiben lokal erhalten
- [ ] Eigene Kategorien bleiben lokal erhalten
- [ ] Rundenverlauf bleibt lokal erhalten
- [ ] Vollständige JSON-Sicherung kann exportiert werden
- [ ] Exportierte Sicherung enthält Spielstand, Einstellungen, Verlauf und Kategorien
- [ ] Gültige aktuelle und ältere Sicherung kann importiert werden
- [ ] Ungültige oder zu große Sicherung wird abgelehnt
- [ ] Fehlgeschlagener Import beschädigt keine bestehenden Daten
- [ ] Alle lokalen Daten können vollständig gelöscht werden
- [ ] Nach vollständigem Löschen startet die App sauber
- [ ] Datenschutzseite erklärt lokale Sicherungsdateien
- [ ] Keine Analyse-, Tracking- oder Werbedienste eingebunden
- [ ] Keine Secrets oder `.env`-Dateien im Repository

## 4. PWA und Offline

- [ ] Manifest enthält stabile relative Werte für `id`, `start_url` und `scope`
- [ ] PNG-Icon mit 192 × 192 Pixeln vorhanden und gültig
- [ ] PNG-Icon mit 512 × 512 Pixeln vorhanden und gültig
- [ ] Apple-Touch-Icon und mobile App-Metadaten vorhanden
- [ ] Erstaufruf online erfolgreich
- [ ] App danach vollständig offline startbar
- [ ] `index.html` und `privacy.html` offline verfügbar
- [ ] CSS, JavaScript, Manifest und alle Icons offline verfügbar
- [ ] `setup-ux.js`, `privacy-guard.js`, `word-packs.js` und `data-store.js` offline verfügbar
- [ ] Cache `secret-circle-v15` enthält alle Kernressourcen
- [ ] Nur die aktuelle Service-Worker-Cache-Version bleibt bestehen
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
- [ ] iPhone-Safe-Areas geprüft
- [ ] App-Wechsel während laufendem Timer geprüft
- [ ] App-Wechsel während sichtbarer geheimer Karte geprüft
- [ ] Energiesparmodus beziehungsweise gesperrter Bildschirm geprüft

## 6. Accessibility und Bedienung

- [ ] Vollständig per Tastatur bedienbar
- [ ] Fokus bleibt bei Bildschirmwechseln nachvollziehbar
- [ ] Fokus ist sichtbar
- [ ] Formulare besitzen verständliche Labels
- [ ] Statusmeldungen werden angekündigt
- [ ] Live-Setup-Hinweise werden verständlich angekündigt
- [ ] Farbkontrast manuell geprüft
- [ ] Vergrößerung auf 200 % geprüft
- [ ] `prefers-reduced-motion` geprüft
- [ ] Screenreader-Kurztest durchgeführt
- [ ] Touchflächen sind mindestens 44 × 44 Pixel groß

## 7. Inhalt und Sicherheit

- [ ] Alle 14 eingebauten Kategorien redaktionell geprüft
- [ ] Alle 168 eingebauten Begriffe redaktionell geprüft
- [ ] Keine diskriminierenden oder ungeeigneten Inhalte
- [ ] Hilfswörter verraten den Begriff nicht direkt
- [ ] Eigene Kategorien behandeln Eingaben sicher
- [ ] Dynamische Inhalte werden vor HTML-Ausgabe escaped
- [ ] Content Security Policy ist aktiv und blockiert fremde Skripte
- [ ] Keine externen Ressourcen ohne klare Notwendigkeit
- [ ] Geheime Rollen bleiben bei Fokusverlust verdeckt

## 8. Realer Party-Betatest

- [ ] Mindestens ein vollständiges Match mit 3–4 Personen
- [ ] Mindestens ein vollständiges Match mit 8 oder mehr Personen
- [ ] Mindestens ein Match mit mehreren Impostern
- [ ] Kartenübergabe ist verständlich und verrät keine Rolle
- [ ] Automatische Kartenverdeckung wird von Testpersonen verstanden
- [ ] Abstimmungsübergabe ist verständlich
- [ ] Punktesystem wird von Testpersonen verstanden
- [ ] Keine Blockade oder unklare Sackgasse im Ablauf
- [ ] Feedback und beobachtete Probleme dokumentiert

## 9. Release-Dokumentation

- [ ] Versionsnummer festgelegt
- [ ] Release-Commit dokumentiert
- [ ] Änderungen seit vorheriger Version beschrieben
- [ ] Bekannte Einschränkungen dokumentiert
- [ ] Rollback-Möglichkeit festgelegt
- [ ] Backup-Kompatibilität dokumentiert
- [ ] Verantwortliche Testperson und Testdatum eingetragen
- [ ] Impressum beziehungsweise Anbieterinformationen vor öffentlicher kommerzieller Nutzung ergänzt

## Freigabe

- Version:
- Commit:
- Testdatum:
- Getestet von:
- Ergebnis: `GO` / `NO_GO`
- Offene Einschränkungen:
