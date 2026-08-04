# Änderungsverlauf

## 1.0.0-beta.3 – 2026-08-04

### Hinzugefügt

- vollständiger Karten-, Diskussions-, Abstimmungs-, Rate- und Ergebnisablauf
- Punkte, Rangliste, Mehr-Runden-Matches und begrenzte Stichwahl
- maximal sechs Imposter
- unabhängige deterministische Rollenverteilung in `role-assignment.js`
- 14 Kategorien mit 168 Begriff-Hinweis-Paaren
- deadline-basierter Timer mit Hintergrund- und Neulade-Wiederherstellung
- Live-Gruppengröße und dynamische Imposter-Grenzen
- automatische Kartenverdeckung mit blockierter Weitergabe
- optionaler Wake Lock während der Diskussion
- Verlauf, Datenmigration, Backup-Export/-Import und vollständige lokale Löschung
- Datenschutzseite, Content Security Policy und Laufzeit-Fehlerschutz
- 192- und 512-Pixel-PNG-Icons
- vollständiger Offline-Core `secret-circle-v17`
- fünf Unit-Testdateien einschließlich Rollenverteilung und 120 Fuzz-Szenarien
- vierzehn E2E-Suiten einschließlich Rollenverteilung, Privatsphäre, Wake Lock und Sicherheit
- Chromium-, Firefox-, WebKit-, Android- und iPhone-Smoke-Konfiguration
- Repository-Hygiene, Performancebudget, Strukturvalidator und Release-Audit
- Release-Checkliste, Testplan, Sicherheits-, Deployment- und Rollback-Dokumentation

### Verbessert

- mobile Safe Areas, dynamische Viewport-Höhe und zoomsichere Formulare
- Tastatur-, Fokus- und Screenreader-Struktur
- Wake-Lock-Fallback auf nicht unterstützten Geräten
- sichere Service-Worker-Cache-Schreibvorgänge und Update-Bereinigung
- strengere Validierung gespeicherter und importierter Daten
- reproduzierbare Tests der Rollenverteilung über 200 Unit- und 120 Browser-Samples

### Behoben

- **kritischer Rollenfehler:** Imposter waren zuvor an die ersten Positionen der Aufdeckreihenfolge gekoppelt
- Aufdeckreihenfolge verrät die Rollen nicht mehr systematisch
- mehr als sechs Imposter werden zuverlässig abgelehnt
- endlose Stichwahlen
- doppelte Stimmen und Selbstwahl
- Begriffswiederholungen innerhalb eines noch nicht erschöpften Pools
- Timerabweichungen nach Hintergrundbetrieb oder Neuladen
- fehlende Verlaufseinträge bei direkt beendeten Runden
- unvollständige Migration älterer Spielstände
- versehentliche Weitergabe automatisch verdeckter Karten
- unvollständiger Offline-Cache und nicht abgewartete Cache-Schreibvorgänge
- veraltete, nicht mehr geladene Match- und Accessibility-Dateien

### Sicherheit und Datenschutz

- keine Anmeldung, Analyse-, Werbe- oder Tracking-Dienste
- keine appgesteuerte Übertragung von Spieldaten
- restriktive Ressourcen- und Skriptrichtlinie
- escaped Namen und Kategorien
- Größenbegrenzung und Rollback für Sicherungsimporte
- automatischer Sichtschutz geheimer Rollen und Begriffe
- dokumentierter privater Meldeweg für Sicherheitsprobleme

## Frühere Beta-Stände

Frühere Entwicklungsstände enthielten den grundlegenden Offline-Spielablauf, eigene Kategorien und die erste PWA-Struktur. Beta.3 bündelt diese Arbeiten zu einer testbaren Produktionsbeta.
