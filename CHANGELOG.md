# Änderungsverlauf

## In Entwicklung – Party-Hub-Erweiterung

### Hinzugefügt

- installierter PWA-Einstieg öffnet jetzt den Party Hub
- Party-Hub-Seite mit Start, Spiele, Spieler, Favoriten, Verlauf und Daten
- Katalogsuche und Filter nach Art, Stimmung, Gruppengröße, Altersstufe und Status
- klare Spieldetails mit Regeln, Spielerzahl, Dauer, Kategorien und Inhaltsmenge
- gemeinsame lokale Spielerliste und Host-Presets
- Favoriten, zuletzt gespielt, Verlauf, Statistik und acht Erfolge
- Standard-Sessionlänge und gespeicherte Alterspräferenz
- Installationsschaltfläche für unterstützte Browser
- 22 sichtbare Spiele, davon 18 spielbar und 4 eindeutig gesperrt
- neu vollständig spielbar:
  - Zwei Wahrheiten, eine Lüge
  - Question Imposter
  - Location Spy
  - Mafia
- neue sichtbare Roadmap-Spiele:
  - Wellenlänge
  - Zeichnen & Raten
  - Schnellfeuer
  - Geräusche erraten
- mehr als 390 eigenständige Hub-Fragen, Entscheidungen, Begriffe und Aufgaben
- private Eingabe, Mischung und Gruppenabstimmung für Zwei Wahrheiten, eine Lüge
- geheime ähnliche Fragen, Imposter-Verteilung und Abstimmung für Question Imposter
- geheime Orte, Spionrollen, Verdächtigenwahl und Ortsraten für Location Spy
- private Mafia-Rollen, Moderatoransicht, Nachtaktionen, Tageswahl und Siegprüfung
- wiederaufnehmbare komplexe Sessions
- Sessionlängen mit 3, 5, 10 oder 20 Runden
- vollständiger gemeinsamer Export für Hub und Word Imposter
- gemeinsamer Import mit Formatprüfung, Größenlimit und Rollback
- vollständige Löschung aller `secret-circle-*`-Daten
- Expansionskatalog-Unit-Test
- E2E-Suiten für alle vier komplexen Spiele
- E2E-Suiten für Export, Import, ungültige Sicherungen und vollständige Löschung
- Cross-Browser-Smoke-Test für Hub und komplexe Spiele
- vollständiger Offline-Core `secret-circle-v21`

### Verbessert

- Word Imposter und Party Hub sind gegenseitig klar verlinkt
- Inhalte und Entwicklungsstatus sind vor dem Start sichtbar
- geplante Spiele können nicht wie fertige Funktionen gestartet werden
- Altersfilter wird zwischen Katalog und Einstellungen synchronisiert
- fortgesetzte komplexe Sessions werden strenger validiert
- abgeschlossene Sessions öffnen nach Neuladen direkt die Zusammenfassung
- maximal 20 Runden werden auch beim Verlängern einer Session eingehalten
- Runtime-Fehler werden auf Imposter-, Hub- und erweiterten Spielseiten sichtbar
- Manifest, Offline-Test, PWA-Installationstest, Validator, Release-Audit und Performancebudget berücksichtigen den erweiterten Hub
- responsive Darstellung für Desktop, Smartphone, Safe Areas und installierte PWA

### Noch offen

- vollständig erfolgreicher lokaler Testlauf
- grüner GitHub-Actions-Lauf auf dem endgültigen Commit
- echte Android-, iOS- und PWA-Update-Prüfung
- reale Partytests mit kleinen und großen Gruppen
- mehr Packs und Karten für besonders häufige Spiele
- redaktionelle Alters-, Schwierigkeits- und Inhaltsprüfung
- öffentliche Anbieter-, Kontakt-, Hosting- und gegebenenfalls Impressumsangaben

## 1.0.0-beta.3 – 2026-08-04

### Hinzugefügt

- vollständiger Word-Imposter-Karten-, Diskussions-, Abstimmungs-, Rate- und Ergebnisablauf
- Punkte, Rangliste, Mehr-Runden-Matches und begrenzte Stichwahl
- maximal sechs Imposter
- unabhängige deterministische Rollenverteilung
- 14 Kategorien mit 168 Begriff-Hinweis-Paaren
- deadline-basierter Timer mit Hintergrund- und Neulade-Wiederherstellung
- Live-Gruppengröße und dynamische Imposter-Grenzen
- automatische Kartenverdeckung mit blockierter Weitergabe
- optionaler Wake Lock während der Diskussion
- Verlauf, Migration, Sicherung und vollständige lokale Löschung
- Datenschutzseite, Content Security Policy und Laufzeit-Fehlerschutz
- 192- und 512-Pixel-PNG-Icons

### Behoben

- kritische Kopplung der Imposter an die ersten Positionen der Aufdeckreihenfolge
- mehr als sechs Imposter werden zuverlässig abgelehnt
- endlose Stichwahlen
- doppelte Stimmen und Selbstwahl
- Begriffswiederholungen innerhalb eines noch nicht erschöpften Pools
- Timerabweichungen nach Hintergrundbetrieb oder Neuladen
- fehlende Verlaufseinträge bei direkt beendeten Runden
- unvollständige Migration älterer Spielstände
- versehentliche Weitergabe automatisch verdeckter Karten

### Sicherheit und Datenschutz

- keine Anmeldung, Analyse-, Werbe- oder Tracking-Dienste
- keine appgesteuerte Übertragung von Spieldaten
- restriktive Ressourcen- und Skriptrichtlinie
- escaped Namen und Kategorien
- Größenbegrenzung und Rollback für Sicherungsimporte
- automatischer Sichtschutz geheimer Rollen und Begriffe
