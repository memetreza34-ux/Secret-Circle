# Secret Circle Party Hub – Release-Checkliste

Jeder nicht bestätigte kritische Punkt blockiert den öffentlichen Release.

## 1. Automatisierte Prüfungen

- [ ] `npm run check`
- [ ] `npm test`
- [ ] `npm run validate`
- [ ] `npm run test:e2e`
- [ ] `npm run ci`
- [ ] `npm run test:cross-browser`
- [ ] GitHub Actions auf dem endgültigen Commit erfolgreich
- [ ] keine offenen kritischen oder hohen Fehler
- [ ] Testausgaben und Commit-SHA dokumentiert

## 2. Party-Hub-Struktur

- [ ] installierte PWA startet auf `party.html`
- [ ] Start, Spiele, Spieler, Favoriten, Verlauf und Daten sind direkt erkennbar
- [ ] Katalog zeigt 22 Spiele
- [ ] 18 Spiele sind als spielbar markiert
- [ ] 4 Roadmap-Spiele sind sichtbar, aber technisch gesperrt
- [ ] Suche funktioniert mit Titel, Beschreibung und Kategorien
- [ ] Filter für Art, Stimmung, Gruppengröße, Altersstufe und Status funktionieren gemeinsam
- [ ] Spielerzahl, Dauer, Inhaltsmenge und Regeln sind vor dem Start sichtbar
- [ ] Quick Picks, Schnellstart und zuletzt gespielt funktionieren
- [ ] Navigation zwischen Party Hub, komplexen Spielen und Word Imposter funktioniert

## 3. Spieler, Presets und Präferenzen

- [ ] 1–20 eindeutige Hub-Spieler können gespeichert werden
- [ ] doppelte oder leere Namen werden bereinigt
- [ ] benötigte Mindestspielerzahl blockiert ungeeignete Spielstarts
- [ ] Host-Presets können gespeichert, geladen und gelöscht werden
- [ ] Favoriten bleiben nach Neuladen erhalten
- [ ] Altersstufe bleibt nach Neuladen erhalten
- [ ] Standard-Sessionlänge bleibt nach Neuladen erhalten
- [ ] Verlauf, Statistik und Erfolge werden korrekt aktualisiert

## 4. 14 einfache Hub-Spiele

- [ ] Wahrheit oder Pflicht
- [ ] Ich habe noch nie
- [ ] Wer würde eher?
- [ ] Entweder oder
- [ ] Hot Takes
- [ ] Nur falsche Antworten
- [ ] Paranoia
- [ ] Scharade
- [ ] Nicht sagen! / Tabu
- [ ] Heiße Kartoffel
- [ ] Wortkette
- [ ] Flaschendrehen
- [ ] Würfel & Münze
- [ ] Word Imposter wird aus dem Hub korrekt geöffnet
- [ ] Karten wiederholen sich nicht unmittelbar innerhalb einer Session
- [ ] aktive Person rotiert korrekt
- [ ] Timer, Punkte, Zufall und Vibration blockieren das Spiel nicht

## 5. Vier komplexe Spiele

### Zwei Wahrheiten, eine Lüge

- [ ] drei unterschiedliche Aussagen werden validiert
- [ ] Lüge wird nach der Eingabe zufällig neu angeordnet
- [ ] private Eingabe bleibt vor der Gruppe verborgen
- [ ] Gruppenwahl und Auflösung stimmen überein
- [ ] nächste Person und Punktestand funktionieren

### Question Imposter

- [ ] genau eine zufällige Person erhält die andere Frage
- [ ] jede Frage wird einzeln und privat angezeigt
- [ ] Fragen werden vor Weitergabe wieder verdeckt
- [ ] Diskussion und Abstimmung funktionieren
- [ ] Hauptfrage, andere Frage und Imposter werden korrekt aufgelöst

### Location Spy

- [ ] genau eine zufällige Person ist Spion
- [ ] alle anderen sehen denselben Ort
- [ ] Rollenübergabe bleibt privat
- [ ] Gruppe kann einen Verdächtigen wählen
- [ ] Spion kann aus sechs Orten raten
- [ ] Sieg und Punktestand werden korrekt aufgelöst

### Mafia

- [ ] Rollen werden privat und eindeutig verteilt
- [ ] Moderatoransicht besitzt eine Bestätigung
- [ ] Nachtziel, Schutz und Untersuchung funktionieren
- [ ] eliminierte Personen verschwinden aus späteren Wahlen
- [ ] Tageswahl funktioniert
- [ ] Mafia- und Dorf-Siegbedingungen enden das Spiel
- [ ] Moderatoransicht wird nicht versehentlich anderen Personen gezeigt

## 6. Komplexe Sessions

- [ ] 3-Runden-Session
- [ ] 5-Runden-Session
- [ ] 10-Runden-Session
- [ ] 20-Runden-Session
- [ ] mehr als 20 Runden sind nicht möglich
- [ ] aktive Session übersteht Neuladen
- [ ] abgeschlossene Session öffnet nach Neuladen die Zusammenfassung
- [ ] ungültiger gespeicherter Sessionzustand wird verworfen
- [ ] abgeschlossene Session erscheint genau einmal im Verlauf
- [ ] Punkte, Runden und Bestwert werden korrekt gespeichert

## 7. Word Imposter

- [ ] Start mit 3 und 20 Personen
- [ ] maximal sechs Imposter
- [ ] Rollenverteilung ist unabhängig von der Aufdeckreihenfolge
- [ ] gleiche Seeds bleiben reproduzierbar
- [ ] Kartenübergabe zeigt nur die aktuelle Rolle
- [ ] sichtbare Karte wird bei Fokusverlust verdeckt
- [ ] verdeckte Karte kann nicht ungesehen weitergegeben werden
- [ ] Timer startet, pausiert und übersteht Hintergrund sowie Neuladen
- [ ] geheime Abstimmung, Stichwahl und Ratechance funktionieren
- [ ] Selbstwahl und doppelte Stimmen werden verhindert
- [ ] Punkte, Rangliste, Verlauf und nächste Runde sind korrekt
- [ ] Begriffe wiederholen sich erst nach erschöpftem Pool

## 8. Gesamtsicherung und Datenschutz

- [ ] Export enthält Hub- und Word-Imposter-Daten
- [ ] Dateiname und JSON-Format sind korrekt
- [ ] gültiger Import stellt Spieler, Favoriten, Präferenzen und Imposter-Daten wieder her
- [ ] ungültiges JSON wird abgelehnt
- [ ] falsches Sicherungsformat wird abgelehnt
- [ ] Datei über 1,5 MB wird abgelehnt
- [ ] mehr als 100 Datensätze werden abgelehnt
- [ ] fehlgeschlagener Import stellt den vorherigen Zustand wieder her
- [ ] „Alle lokalen Daten löschen“ entfernt alle `secret-circle-*`-Schlüssel
- [ ] keine Analyse-, Tracking- oder Werbedienste
- [ ] keine Secrets oder `.env`-Dateien im Repository

## 9. PWA und Offline

- [ ] Manifest heißt „Secret Circle – Party Hub“
- [ ] `start_url` ist `./party.html`
- [ ] `id` und `scope` bleiben relativ
- [ ] 192- und 512-Pixel-PNG-Icons sind gültig
- [ ] Cache `secret-circle-v21` enthält alle Kernressourcen
- [ ] nur der aktuelle Cache bleibt bestehen
- [ ] Party Hub startet offline
- [ ] Question Imposter startet offline
- [ ] Word Imposter startet offline
- [ ] Datenschutzseite startet offline
- [ ] aktive Hub- und Imposter-Sessions bleiben nach PWA-Update erhalten
- [ ] Installation und Update auf Android erfolgreich
- [ ] Installation und Update auf iPhone/iPad erfolgreich

## 10. Browser, Mobile und Accessibility

- [ ] Chrome Android
- [ ] Safari iOS
- [ ] Chrome, Firefox und Safari/WebKit Desktop
- [ ] kleine und große Smartphone-Breite
- [ ] Tablet
- [ ] Portrait und Landscape
- [ ] iPhone-Safe-Areas
- [ ] Bildschirmtastatur verdeckt keine wichtige Aktion
- [ ] vollständige Tastaturbedienung
- [ ] logischer und sichtbarer Fokus
- [ ] verständliche Labels und Statusmeldungen
- [ ] 200-Prozent-Vergrößerung
- [ ] Screenreader-Kurztest
- [ ] reduzierte Bewegung und ausreichender Kontrast
- [ ] Touchflächen mindestens 44 × 44 Pixel

## 11. Inhalte und Sicherheit

- [ ] mehr als 390 Hub-Inhalte redaktionell geprüft
- [ ] alle 168 Imposter-Begriffe und Hilfswörter geprüft
- [ ] keine problematischen Dopplungen
- [ ] keine diskriminierenden oder ungeeigneten Inhalte
- [ ] Altersstufen sind nachvollziehbar
- [ ] Kategorien und Dauerangaben passen zum realen Spiel
- [ ] dynamische Namen und Eingaben werden als Text gerendert
- [ ] eigene Kategorien führen keinen HTML- oder Skriptcode aus
- [ ] Content Security Policy blockiert fremde Skripte
- [ ] keine unnötigen externen Ressourcen
- [ ] geheime Rollen und Fragen werden bei Übergabe geschützt

## 12. Realer Party-Betatest

- [ ] kleine Gruppe mit 3–4 Personen
- [ ] große Gruppe mit mindestens 8 Personen
- [ ] Word Imposter mit mehreren Impostern
- [ ] Question Imposter
- [ ] Location Spy
- [ ] Mafia
- [ ] Scharade
- [ ] Heiße Kartoffel
- [ ] mindestens eine 10-Runden-Session
- [ ] Einrichtung wird ohne Entwicklerhilfe verstanden
- [ ] Kennzeichnung „Spielbar“ und „In Arbeit“ wird verstanden
- [ ] keine Blockade oder unklare Sackgasse
- [ ] Feedback und Fehler dokumentiert

## 13. Release-Dokumentation und Recht

- [ ] Version und Release-Commit festgelegt
- [ ] Changelog aktuell
- [ ] bekannte Einschränkungen aktuell
- [ ] Deployment, Backup-Kompatibilität und Rollback geprüft
- [ ] Datenschutz an endgültiges Hosting angepasst
- [ ] Anbieter-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben ergänzt
- [ ] Testpersonen und Testdatum eingetragen

## Freigabe

- Version:
- Commit:
- Testdatum:
- Getestet von:
- Ergebnis: `GO` / `NO_GO`
- Offene Einschränkungen:
