# Secret Circle Party Hub – Release-Checkliste

Jeder nicht bestätigte kritische Punkt blockiert den öffentlichen Release.

## 1. Automatisierte Prüfungen

- [ ] `npm run check`
- [ ] `npm test`
- [ ] `npm run validate`
- [ ] `npm run test:e2e`
- [ ] `npm run ci`
- [ ] `npm run test:cross-browser`
- [ ] alle 9 Unit-Testdateien laufen erfolgreich
- [ ] mindestens 20 E2E-Suiten laufen erfolgreich
- [ ] GitHub Actions führt sichtbare Schritte aus
- [ ] GitHub Actions endet auf dem endgültigen Commit grün
- [ ] Testausgaben und Commit-SHA sind dokumentiert
- [ ] keine offenen kritischen oder hohen Fehler

## 2. Party Hub und Spiele

- [ ] installierte PWA startet auf `party.html`
- [ ] Katalog zeigt 22 Einträge
- [ ] 18 Spiele sind spielbar
- [ ] 4 Roadmap-Spiele sind sichtbar und technisch gesperrt
- [ ] Suche und alle Filter funktionieren kombiniert
- [ ] Spielerzahl, Dauer, Kategorien und Regeln sind vor dem Start sichtbar
- [ ] Navigation zeigt auf Desktop sechs gleichwertige Ziele
- [ ] Navigation zwischen Hub, komplexen Spielen und Word Imposter funktioniert
- [ ] alle 18 spielbaren Spiele wurden mindestens einmal vollständig geprüft

## 3. Smart Party Night

- [ ] Planer zeigt die aktuelle gespeicherte Spielerzahl
- [ ] Zeitbudgets 15, 30, 45, 60 und 90 Minuten erzeugen gültige Pläne
- [ ] Stimmung „Bunter Mix“ erzeugt verschiedene Spielarten
- [ ] jede einzelne Stimmung erzeugt passende Spiele, soweit verfügbar
- [ ] Familienfilter enthält nur familienfreundliche Spiele
- [ ] Gruppengröße schließt nicht spielbare Kandidaten aus
- [ ] Utility- und reine Zufallswerkzeuge werden nicht als Hauptstation eingeplant
- [ ] ein Plan enthält keine doppelten Spiele
- [ ] Favoriten werden bei gleicher Eignung bevorzugt
- [ ] zuletzt gespielte Titel werden nach Möglichkeit nicht sofort wiederholt
- [ ] erster Schritt eignet sich als schneller Einstieg
- [ ] Abschluss bevorzugt bei Eignung Wettkampf oder Chaos
- [ ] jede Station zeigt Spiel, Spielart, Dauer und Empfehlungsgrund
- [ ] „Öffnen“ öffnet die korrekten Spieldetails
- [ ] „Als erledigt“ verschiebt den aktuellen Schritt
- [ ] „Überspringen“ wird getrennt gezählt
- [ ] Fortschrittsbalken stimmt mit bearbeiteten Stationen überein
- [ ] Plan bleibt nach Neuladen und PWA-Neustart erhalten
- [ ] Hero-Aktion wechselt von „planen“ auf „fortsetzen“
- [ ] abgeschlossener Plan zeigt den Abschlusszustand
- [ ] Neuplanung ersetzt den alten Plan vollständig
- [ ] Löschen entfernt `secret-circle-party-night-v1`
- [ ] Party-Night-Plan ist in Export, Import und Gesamtlöschung enthalten

## 4. Spieler, Presets und Einstellungen

- [ ] 1–20 eindeutige Hub-Spieler können gespeichert werden
- [ ] Leerzeilen und doppelte Namen werden bereinigt
- [ ] ungültige Gruppengröße blockiert neue Spielstarts
- [ ] Host-Presets können gespeichert, geladen und gelöscht werden
- [ ] Favoriten bleiben nach Neuladen erhalten
- [ ] Altersstufe und Standard-Sessionlänge bleiben erhalten
- [ ] simulierter Präferenz-Speicherfehler wird sichtbar gemeldet
- [ ] aktuelle Auswahl bleibt bei Speicherfehler bis zum Neuladen nutzbar

## 5. Spieler-Snapshot und komplexe Sessions

- [ ] neue Session speichert Schema Version 2
- [ ] Session besitzt eindeutige ID
- [ ] Session speichert eigene Spielergruppe
- [ ] gemeinsame Lobby wird nach Sessionstart verändert
- [ ] nach Neuladen bleiben ursprüngliche Namen erhalten
- [ ] Rollen, Fragen, Spion und aktive Person gehören weiter zum Spieler-Snapshot
- [ ] neue Session verwendet dagegen die aktuelle Lobby
- [ ] alte Session ohne Snapshot wird kontrolliert migriert
- [ ] ungültige Spielergruppe oder Packzuordnung wird verworfen
- [ ] 3-, 5-, 10- und 20-Runden-Sessions funktionieren
- [ ] mehr als 20 Runden sind unmöglich

## 6. Transaktionssicherer Sessionabschluss

- [ ] normaler Abschluss erzeugt genau einen Verlaufseintrag
- [ ] Runden und Bestwert werden korrekt addiert
- [ ] eindeutige Historien-ID verhindert Duplikate
- [ ] simulierter Fehler beim Hub-Speichern lässt Session aktiv
- [ ] nach Fehler bleibt Zusammenfassung sichtbar
- [ ] erneuter erfolgreicher Versuch speichert genau einmal
- [ ] aktiver Marker wird erst nach erfolgreicher Verlaufsspeicherung entfernt

## 7. Eigene Hub-Kategorien

- [ ] Editor ist im Datenbereich sichtbar
- [ ] nur kompatible Spiele sind auswählbar
- [ ] mindestens drei Karten sind erforderlich
- [ ] Unicode-, Groß-/Kleinschreibungs- und direkte Duplikate werden entfernt
- [ ] maximal 100 Karten pro Pack
- [ ] maximal 20 Packs
- [ ] doppelte Packnamen und IDs werden bereinigt oder blockiert
- [ ] HTML- und Skripttexte werden nur als Text ausgegeben
- [ ] Pack erscheint in Spieldetail und Auswahl
- [ ] Pack kann gespielt und gelöscht werden
- [ ] simulierter Schreibfehler beim Hinzufügen verändert weder Speicher noch Katalog
- [ ] simulierter Schreibfehler beim Löschen erhält Pack und Katalog

## 8. Gesamtsicherung

- [ ] Export enthält Hub-, Party-Night-, Pack-, Session- und Word-Imposter-Daten
- [ ] Dateiname und JSON-Format sind korrekt
- [ ] gültiger Import stellt alle Bereiche wieder her
- [ ] importierter Party-Night-Fortschritt ist weiterhin nutzbar
- [ ] ungültiges JSON und falsches Format werden abgelehnt
- [ ] Byte-Grenze von 1,5 MB wird anhand tatsächlicher UTF-8-Bytes geprüft
- [ ] Mehrbyte-Datei über dem Limit wird vor Datenänderung abgelehnt
- [ ] mehr als 100 Datensätze werden abgelehnt
- [ ] einzelner Wert über der Byte-Grenze wird abgelehnt
- [ ] simulierter Import-Schreibfehler stellt vorherige Daten vollständig wieder her
- [ ] fehlgeschlagener Rollback wird eindeutig gemeldet
- [ ] simulierter Löschfehler stellt vorherige Daten wieder her
- [ ] normale vollständige Löschung entfernt alle `secret-circle-*`-Schlüssel

## 9. Statistik und Erfolge

- [ ] Verlauf, Statistik und acht Erfolge werden korrekt aktualisiert
- [ ] ältere zu niedrige Statistikwerte werden aus dem Verlauf repariert
- [ ] höhere neuere Werte werden nicht reduziert
- [ ] negative und ungültige Werte werden normalisiert
- [ ] unbekannte Spiel-IDs werden ignoriert
- [ ] simulierter Statistik-Speicherfehler wird sichtbar gemeldet
- [ ] Hub bleibt bei Statistik-Speicherfehler bedienbar

## 10. Word Imposter

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

## 11. PWA und Offline

- [ ] Manifest heißt „Secret Circle – Party Hub“
- [ ] `start_url` ist `./party.html`
- [ ] `id` und `scope` sind relativ
- [ ] Icons sind gültige 192- und 512-Pixel-PNGs
- [ ] Cache `secret-circle-v25` enthält alle Kernressourcen
- [ ] nur Cache `secret-circle-v25` bleibt bestehen
- [ ] `party-night.js` und `party-night.css` sind offline verfügbar
- [ ] Hub, Party Night, Pack-Editor, komplexe Spiele, Word Imposter und Datenschutz starten offline
- [ ] Party Night kann offline erstellt und fortgesetzt werden
- [ ] aktive Session und Spieler-Snapshot überstehen PWA-Update
- [ ] Party-Night-Plan, eigene Packs und Einstellungen überstehen PWA-Update
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
- [ ] Party-Night-Timeline ist per Tastatur bedienbar
- [ ] verständliche Labels und Statusmeldungen
- [ ] 200-Prozent-Vergrößerung
- [ ] Screenreader-Kurztest
- [ ] reduzierte Bewegung und ausreichender Kontrast
- [ ] Touchflächen mindestens 44 × 44 Pixel

## 13. Inhalte, Partytests und Recht

- [ ] mindestens 384 Hub-Inhalte redaktionell geprüft
- [ ] alle 168 Imposter-Begriffe geprüft
- [ ] keine problematischen Dopplungen oder ungeeigneten Inhalte
- [ ] Altersstufen sind nachvollziehbar
- [ ] Gruppe mit 3–4 Personen hat vollständigen Test durchgeführt
- [ ] Gruppe mit mindestens 8 Personen hat vollständigen Test durchgeführt
- [ ] mindestens ein vollständiger Smart-Party-Night-Abend wurde real gespielt
- [ ] eigenes Hub-Pack wurde real getestet
- [ ] mindestens eine 10-Runden-Session wurde real gespielt
- [ ] Einrichtung wird ohne Entwicklerhilfe verstanden
- [ ] Version und Release-Commit festgelegt
- [ ] Datenschutz an endgültiges Hosting angepasst
- [ ] Betreiber-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben ergänzt

## Freigabe

- Version:
- Commit:
- Testdatum:
- Getestet von:
- Ergebnis: `GO` / `NO_GO`
- Offene Einschränkungen:
