# Secret Circle Party Hub – Release-Checkliste

Jeder nicht bestätigte kritische Punkt blockiert den öffentlichen Release.

## 1. Automatisierte Prüfungen

- [ ] `npm run check`
- [ ] `npm test`
- [ ] `npm run validate`
- [ ] `npm run test:e2e`
- [ ] `npm run ci`
- [ ] `npm run test:cross-browser`
- [ ] GitHub Actions führt sichtbare Schritte aus
- [ ] GitHub Actions endet auf dem endgültigen Commit grün
- [ ] Testausgaben und Commit-SHA sind dokumentiert
- [ ] keine offenen kritischen oder hohen Fehler

## 2. Party-Hub-Struktur

- [ ] installierte PWA startet auf `party.html`
- [ ] Start, Spiele, Spieler, Favoriten, Verlauf und Daten sind verständlich
- [ ] Katalog zeigt 22 Einträge
- [ ] 18 Spiele sind spielbar
- [ ] 4 Roadmap-Spiele sind sichtbar und technisch gesperrt
- [ ] Suche funktioniert mit Titel, Beschreibung und Kategorien
- [ ] Filter für Art, Stimmung, Gruppe, Altersstufe und Status funktionieren gemeinsam
- [ ] Spielerzahl, Dauer, Kategorien und Regeln sind vor dem Start sichtbar
- [ ] Navigation zwischen Hub, komplexen Spielen und Word Imposter funktioniert

## 3. Spieler und Presets

- [ ] 1–20 eindeutige Hub-Spieler können gespeichert werden
- [ ] Leerzeilen und doppelte Namen werden bereinigt
- [ ] ungültige Gruppengröße blockiert neue Spielstarts
- [ ] Host-Presets können gespeichert, geladen und gelöscht werden
- [ ] Favoriten bleiben nach Neuladen erhalten
- [ ] Altersstufe und Standard-Sessionlänge bleiben erhalten
- [ ] Verlauf, Statistik und Erfolge werden korrekt aktualisiert

## 4. Einfache Hub-Spiele

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
- [ ] Word Imposter öffnet korrekt
- [ ] Karten wiederholen sich nicht unmittelbar
- [ ] aktive Person rotiert korrekt
- [ ] Timer, Zufall und Vibration blockieren das Spiel nicht

## 5. Komplexe Spiele

### Zwei Wahrheiten, eine Lüge

- [ ] drei unterschiedliche Aussagen werden validiert
- [ ] private Eingabe bleibt verborgen
- [ ] Aussagen werden gemischt
- [ ] Wahl und Auflösung stimmen überein
- [ ] nächste Person und Punktestand funktionieren

### Question Imposter

- [ ] genau eine Person erhält die andere Frage
- [ ] Fragen werden einzeln angezeigt und wieder verdeckt
- [ ] Diskussion und Abstimmung funktionieren
- [ ] beide Fragen und der Imposter werden korrekt aufgelöst

### Location Spy

- [ ] genau eine Person ist Spion
- [ ] alle anderen sehen denselben Ort
- [ ] Verdächtigenwahl funktioniert
- [ ] Ortsratechance zeigt sechs Optionen
- [ ] Sieg und Punkte stimmen

### Mafia

- [ ] Rollen werden privat und eindeutig verteilt
- [ ] Moderatoransicht verlangt Bestätigung
- [ ] Nachtziel, Schutz und Untersuchung funktionieren
- [ ] eliminierte Personen verschwinden aus späteren Wahlen
- [ ] Mafia- und Dorf-Siegbedingungen enden das Spiel

## 6. Spieler-Snapshot und Wiederaufnahme

- [ ] neue komplexe Session speichert Session-Schema Version 2
- [ ] Session besitzt eindeutige ID
- [ ] Session speichert eigene Spielergruppe
- [ ] gemeinsame Lobby wird nach Sessionstart verändert
- [ ] nach Neuladen bleiben ursprüngliche Namen erhalten
- [ ] Rollen, Fragen, Spion und aktive Person gehören weiter zum Spieler-Snapshot
- [ ] neue Session verwendet dagegen die aktuelle Lobby
- [ ] alte Session ohne Snapshot wird kontrolliert migriert
- [ ] ungültige Spielergruppe wird verworfen
- [ ] ungültiges oder gelöschtes Pack verwirft die Session
- [ ] 3-, 5-, 10- und 20-Runden-Sessions funktionieren
- [ ] mehr als 20 Runden sind unmöglich
- [ ] abgeschlossene Session öffnet nach Neuladen die Zusammenfassung

## 7. Transaktionssicherer Sessionabschluss

- [ ] normaler Abschluss erzeugt genau einen Verlaufseintrag
- [ ] Runden und Bestwert werden korrekt addiert
- [ ] eindeutige Historien-ID verhindert Duplikate
- [ ] simuliertes Scheitern der Hub-Speicherung lässt die Session aktiv
- [ ] nach Speicherfehler bleibt die Zusammenfassung sichtbar
- [ ] erneuter erfolgreicher Versuch speichert genau einmal
- [ ] aktiver Session-Marker wird erst nach erfolgreicher Verlaufsspeicherung entfernt
- [ ] beschädigte aktive Daten werden verständlich verworfen

## 8. Eigene Hub-Kategorien

- [ ] Editor ist im Datenbereich sichtbar
- [ ] nur kompatible Spiele sind auswählbar
- [ ] mindestens drei Karten sind erforderlich
- [ ] doppelte Karten werden entfernt
- [ ] maximal 100 Karten pro Pack
- [ ] maximal 20 Packs
- [ ] doppelte Packnamen pro Spiel werden blockiert
- [ ] HTML- und Skripttexte werden nur als Text ausgegeben
- [ ] Pack erscheint in Spieldetail und Auswahl
- [ ] Pack kann gespielt werden
- [ ] Pack kann vollständig gelöscht werden

## 9. Word Imposter

- [ ] Start mit 3 und 20 Personen
- [ ] maximal sechs Imposter
- [ ] Rollenverteilung unabhängig von Aufdeckreihenfolge
- [ ] gleiche Seeds bleiben reproduzierbar
- [ ] Kartenübergabe schützt geheime Inhalte
- [ ] Fokusverlust verdeckt sichtbare Karte
- [ ] Timer übersteht Hintergrund und Neuladen
- [ ] Wahl, Stichwahl und Ratechance funktionieren
- [ ] Selbstwahl und doppelte Stimmen werden verhindert
- [ ] Punkte, Rangliste, Verlauf und nächste Runde sind korrekt

## 10. Gesamtsicherung und Datenschutz

- [ ] Export enthält Hub-, Pack-, Session- und Word-Imposter-Daten
- [ ] Dateiname und JSON-Format sind korrekt
- [ ] gültiger Import stellt alle Bereiche wieder her
- [ ] ungültiges JSON wird abgelehnt
- [ ] falsches Format wird abgelehnt
- [ ] Datei über 1,5 MB wird abgelehnt
- [ ] mehr als 100 Datensätze werden abgelehnt
- [ ] fehlgeschlagener Import besitzt Rollback
- [ ] vollständige Löschung entfernt alle `secret-circle-*`-Schlüssel
- [ ] keine Analyse-, Tracking- oder Werbedienste
- [ ] keine Secrets oder `.env`-Dateien im Repository

## 11. PWA und Offline

- [ ] Manifest heißt „Secret Circle – Party Hub“
- [ ] `start_url` ist `./party.html`
- [ ] `id` und `scope` sind relativ
- [ ] Icons sind gültige 192- und 512-Pixel-PNGs
- [ ] Cache `secret-circle-v23` enthält alle Kernressourcen
- [ ] nur Cache `secret-circle-v23` bleibt bestehen
- [ ] Hub, Pack-Editor, komplexe Spiele, Word Imposter und Datenschutz starten offline
- [ ] aktive Session übersteht PWA-Update
- [ ] Spieler-Snapshot übersteht PWA-Update
- [ ] Eigene Hub-Kategorien überstehen PWA-Update
- [ ] Android-Installation und Update erfolgreich
- [ ] iPhone-/iPad-Installation und Update erfolgreich

## 12. Browser, Mobile und Accessibility

- [ ] Chrome Android
- [ ] Safari iOS
- [ ] Chrome, Firefox und Safari/WebKit Desktop
- [ ] Smartphone, Tablet, Portrait und Landscape
- [ ] iPhone-Safe-Areas
- [ ] Bildschirmtastatur verdeckt keine wichtige Aktion
- [ ] vollständige Tastaturbedienung
- [ ] logischer und sichtbarer Fokus
- [ ] verständliche Labels und Statusmeldungen
- [ ] 200-Prozent-Vergrößerung
- [ ] Screenreader-Kurztest
- [ ] reduzierte Bewegung und ausreichender Kontrast
- [ ] Touchflächen mindestens 44 × 44 Pixel

## 13. Inhalte und Sicherheit

- [ ] mindestens 384 Hub-Inhalte redaktionell geprüft
- [ ] alle 168 Imposter-Begriffe geprüft
- [ ] keine problematischen Dopplungen
- [ ] keine diskriminierenden oder ungeeigneten Inhalte
- [ ] Altersstufen sind nachvollziehbar
- [ ] dynamische Inhalte werden als Text gerendert
- [ ] Content Security Policy blockiert fremde Skripte
- [ ] keine unnötigen externen Ressourcen
- [ ] geheime Rollen und Fragen bleiben bei Übergabe geschützt

## 14. Realer Party-Betatest

- [ ] Gruppe mit 3–4 Personen
- [ ] Gruppe mit mindestens 8 Personen
- [ ] Word Imposter mit mehreren Impostern
- [ ] Question Imposter
- [ ] Location Spy
- [ ] Mafia
- [ ] Scharade
- [ ] Heiße Kartoffel
- [ ] eigenes Hub-Pack
- [ ] mindestens eine 10-Runden-Session
- [ ] Einrichtung wird ohne Entwicklerhilfe verstanden
- [ ] keine Blockade oder unklare Sackgasse
- [ ] Feedback und Fehler dokumentiert

## 15. Release-Dokumentation und Recht

- [ ] Version und Release-Commit festgelegt
- [ ] Changelog aktuell
- [ ] bekannte Einschränkungen aktuell
- [ ] Deployment und Rollback geprüft
- [ ] Datenschutz an endgültiges Hosting angepasst
- [ ] Betreiber-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben ergänzt
- [ ] Testpersonen und Testdatum eingetragen

## Freigabe

- Version:
- Commit:
- Testdatum:
- Getestet von:
- Ergebnis: `GO` / `NO_GO`
- Offene Einschränkungen:
