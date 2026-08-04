# Secret Circle – Release-Checkliste

Nicht bestätigte Punkte blockieren den öffentlichen Release.

## 1. Automatisierte Prüfungen

- [ ] `npm run check`
- [ ] `npm test`
- [ ] `npm run validate`
- [ ] `npm run test:e2e`
- [ ] `npm run ci`
- [ ] `npm run test:cross-browser`
- [ ] GitHub Actions auf dem endgültigen Commit erfolgreich
- [ ] Keine offenen kritischen oder hohen Fehler

## 2. Rollen und Kernspiel

- [ ] Spielstart mit 3 und 20 Personen
- [ ] maximal sechs Imposter möglich
- [ ] doppelte Namen und ungültige Imposter-Werte werden blockiert
- [ ] Rollenverteilung ist unabhängig von der Aufdeckreihenfolge
- [ ] über wiederholte Runden ist die zuerst aufdeckende Person nicht systematisch Imposter
- [ ] gleiche Seeds erzeugen reproduzierbare Rollen und Aufdeckreihenfolge
- [ ] mehrere Imposter sind eindeutig und korrekt verteilt
- [ ] Kartenübergabe zeigt nur die aktuelle Rolle
- [ ] sichtbare Karte wird bei Fokusverlust automatisch verdeckt
- [ ] verdeckte Karte kann nicht ohne erneutes Öffnen weitergegeben werden
- [ ] Diskussion, Timer, Abstimmung, Stichwahl und Ratechance funktionieren
- [ ] Selbstwahl und doppelte Stimmen werden verhindert
- [ ] Punkte, Rangliste, Verlauf und nächste Runde sind korrekt
- [ ] Begriffe wiederholen sich erst nach erschöpftem Pool
- [ ] Match endet nach der gewählten Rundenzahl

## 3. Timer und Geräteverhalten

- [ ] Timer startet, pausiert und setzt korrekt fort
- [ ] Timer übersteht App-Wechsel, Hintergrund und Neuladen
- [ ] abgelaufener Timer bleibt bei Rückkehr abgelaufen
- [ ] Wake Lock wird während der Diskussion angefordert
- [ ] Wake Lock wird vor Abstimmung und im Hintergrund freigegeben
- [ ] Spiel funktioniert ohne Wake-Lock-API
- [ ] Bildschirmrotation und Energiesparmodus geprüft

## 4. Speicherung und Datenschutz

- [ ] aktives Spiel kann nach Neuladen fortgesetzt werden
- [ ] alte Daten werden auf Version 7 migriert
- [ ] beschädigte Daten werden sicher verworfen
- [ ] Einstellungen, Verlauf und eigene Kategorien bleiben lokal erhalten
- [ ] vollständige JSON-Sicherung kann exportiert und importiert werden
- [ ] ungültige oder zu große Sicherung wird abgelehnt
- [ ] fehlgeschlagener Import besitzt Rollback
- [ ] alle lokalen Daten können vollständig gelöscht werden
- [ ] keine Analyse-, Tracking- oder Werbedienste
- [ ] keine Secrets oder `.env`-Dateien im Repository

## 5. PWA und Offline

- [ ] Manifest besitzt stabile relative Werte für `id`, `start_url` und `scope`
- [ ] 192- und 512-Pixel-PNG-Icons sind gültig
- [ ] Android- und Apple-Installationsmetadaten vorhanden
- [ ] Cache `secret-circle-v17` enthält alle Kernressourcen
- [ ] `role-assignment.js`, `setup-ux.js`, `privacy-guard.js` und `wake-lock.js` sind offline verfügbar
- [ ] nur der aktuelle Cache bleibt bestehen
- [ ] App startet nach erstem Online-Aufruf vollständig offline
- [ ] Installation und Update auf Android erfolgreich
- [ ] Installation und Update auf iOS erfolgreich

## 6. Browser und Accessibility

- [ ] aktuelles Chrome Android
- [ ] aktuelles Safari iOS
- [ ] Chrome, Firefox und Safari Desktop
- [ ] kleine und große Smartphone-Breite
- [ ] iPhone-Safe-Areas
- [ ] vollständige Tastaturbedienung
- [ ] sichtbarer und logischer Fokus
- [ ] verständliche Labels und Statusmeldungen
- [ ] 200-Prozent-Vergrößerung
- [ ] Screenreader-Kurztest
- [ ] reduzierte Bewegung und ausreichender Kontrast
- [ ] Touchflächen mindestens 44 × 44 Pixel

## 7. Inhalt und Sicherheit

- [ ] alle 14 Kategorien redaktionell geprüft
- [ ] alle 168 Begriffe und Hilfswörter redaktionell geprüft
- [ ] keine ungeeigneten oder diskriminierenden Inhalte
- [ ] dynamische Inhalte werden escaped
- [ ] eigene Kategorien führen keinen HTML- oder Skriptcode aus
- [ ] Content Security Policy blockiert fremde Skripte
- [ ] keine unnötigen externen Ressourcen
- [ ] Rollen können nicht aus der Aufdeckreihenfolge abgeleitet werden

## 8. Realer Party-Betatest

- [ ] vollständiges Match mit 3–4 Personen
- [ ] vollständiges Match mit mindestens 8 Personen
- [ ] mindestens ein Match mit mehreren Impostern
- [ ] Einrichtung und Kartenübergabe werden ohne Erklärung verstanden
- [ ] automatische Kartenverdeckung wird verstanden
- [ ] Aufdeckreihenfolge erzeugt keinen Rollenverdacht
- [ ] Abstimmung, Punkte und Stichwahl werden verstanden
- [ ] keine Blockade oder unklare Sackgasse
- [ ] Feedback und Fehler dokumentiert

## 9. Release-Dokumentation

- [ ] Version und Release-Commit festgelegt
- [ ] Changelog und bekannte Einschränkungen aktuell
- [ ] Rollback und Backup-Kompatibilität dokumentiert
- [ ] Anbieter-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben ergänzt
- [ ] Testperson und Testdatum eingetragen

## Freigabe

- Version:
- Commit:
- Testdatum:
- Getestet von:
- Ergebnis: `GO` / `NO_GO`
- Offene Einschränkungen:
