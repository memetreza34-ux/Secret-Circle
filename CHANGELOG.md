# Änderungsverlauf

## In Entwicklung – Party-Hub-Erweiterung

### Hinzugefügt

- installierter PWA-Einstieg öffnet den Party Hub
- Suche und Filter nach Art, Stimmung, Gruppengröße, Altersstufe und Status
- gemeinsame lokale Spieler, Host-Presets, Favoriten, Verlauf, Statistik und Erfolge
- Smart Party Night mit 15-, 30-, 45-, 60- und 90-Minuten-Plänen
- vollständige Word-Imposter-, Advanced- und Quick-Session-Wiederaufnahme
- 28 technisch spielbare Spiele
- neue Quick-Mode-Engine für zehn besonders starke Mechaniken
- Wellenlänge mit geheimem Zielwert und abstandsbasierter Punktewertung
- Zeichnen & Raten
- Schnellfeuer mit variablen Anforderungen und Zeitlimits
- Geräusche erraten
- Stirn-Raten
- Buchstaben-Kategorien
- Nicht lachen!
- Melodie summen
- Gegenstandsjagd
- Caption Battle
- 3, 5, 10 oder 20 Quick-Mode-Runden
- Quick-Mode-Spieler-Snapshot, Punkte, Rangliste, Verlauf und Statistik
- eigene originale Packs für alle neuen Quick Modes
- eigene Hub-Kategorien für kompatible Spiele
- vollständiger gemeinsamer Export, Import und Datenlöschung
- langfristiges 122-Modi-Universum mit 94 zusätzlichen Roadmap-Modi
- Architekturvertrag und automatischer Architektur-Audit
- Offline-Core `secret-circle-v26`

### Verbessert

- Hub-Schaltflächen unterscheiden jetzt Quick Mode, Advanced-Spiel und Word Imposter eindeutig
- alle 28 sichtbaren Katalogeinträge sind technisch startbar
- Party Night kann aus einem deutlich vielfältigeren Katalog auswählen
- Quick-Sessions bleiben nach Neuladen erhalten
- korrupte Quick-Snapshots werden verworfen
- Quick-Timer verwenden reale Deadlines während einer laufenden Seite
- mobile Quick-Ansicht berücksichtigt Safe Areas, Touchflächen und Überlauf
- Nutzertexte werden als Text ausgegeben
- Statistikwerte älterer Sessions werden aus dem Verlauf repariert
- Backup-Grenzen verwenden tatsächliche UTF-8-Byte-Größen
- Package-, Struktur-, Release-, Architektur- und Performance-Gates berücksichtigen alle Quick-Dateien
- Chromium-, Firefox-, WebKit-, Android- und iPhone-Smoke-Matrix umfasst den 28-Spiel-Katalog

### Behoben

- vier zuvor sichtbare Roadmap-Spiele waren trotz vorhandener Produktdefinition nicht startbar
- generische Link-Schaltflächen bezeichneten Advanced- oder Quick-Spiele fälschlich als Word Imposter
- manipulierte Quick-Session-Daten konnten als Fortsetzungsoption erscheinen
- bösartig aussehende Spielernamen werden in Quick-Ergebnissen nicht als HTML interpretiert
- eigene Hub-Packs werden vor dem Katalogrendern geladen
- doppelte eigene Karten und Packnamen werden normalisiert und abgefangen
- fehlgeschlagene Speicher-, Import- und Löschvorgänge besitzen Rollback oder erhalten die aktive Session

### Noch offen

- vollständig erfolgreicher lokaler `npm run ci`-Lauf
- erfolgreicher Cross-Browser-Gesamtlauf
- grüner GitHub-Actions-Lauf auf dem endgültigen Commit
- echte Android-, iOS- und PWA-Update-Prüfung
- reale Partytests mit kleinen und großen Gruppen
- praktischer Test aller 28 Spiele
- redaktionelle Inhalts- und Altersprüfung
- öffentliche Betreiber-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben

## 1.0.0-beta.3 – 2026-08-04

### Hinzugefügt

- vollständiger Word-Imposter-Karten-, Diskussions-, Abstimmungs-, Rate- und Ergebnisablauf
- Punkte, Rangliste, Mehr-Runden-Matches und begrenzte Stichwahl
- maximal sechs Imposter
- unabhängige deterministische Rollenverteilung
- 14 Kategorien mit 168 Begriff-Hinweis-Paaren
- deadline-basierter Timer mit Hintergrund- und Neulade-Wiederherstellung
- Verlauf, Migration, Sicherung und vollständige lokale Löschung
- Datenschutzseite, Content Security Policy und Laufzeit-Fehlerschutz
- 192- und 512-Pixel-PNG-Icons

### Behoben

- Kopplung der Imposter an die ersten Positionen der Aufdeckreihenfolge
- mehr als sechs Imposter werden zuverlässig abgelehnt
- endlose Stichwahlen
- doppelte Stimmen und Selbstwahl
- Begriffswiederholungen innerhalb eines noch nicht erschöpften Pools
- Timerabweichungen nach Hintergrundbetrieb oder Neuladen
- fehlende Verlaufseinträge bei direkt beendeten Runden
- unvollständige Migration älterer Spielstände

### Sicherheit und Datenschutz

- keine Anmeldung, Analyse-, Werbe- oder Tracking-Dienste
- keine appgesteuerte Übertragung von Spieldaten
- restriktive Ressourcen- und Skriptrichtlinie
- escaped Namen und Kategorien
- Größenbegrenzung und Rollback für Sicherungsimporte
- automatischer Sichtschutz geheimer Rollen und Begriffe
