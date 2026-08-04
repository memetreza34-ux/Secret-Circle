# Änderungsverlauf

Alle wesentlichen Änderungen an Secret Circle werden in dieser Datei dokumentiert.

## 1.0.0-beta.3 – 2026-08-04

### Hinzugefügt

- vollständige geheime Abstimmung mit Selbstwahl- und Doppelstimmenschutz
- begrenzte Stichwahl und eindeutiges Rundenende
- Imposter-Rateschritt, Punktesystem, Rangliste und Mehr-Runden-Matches
- 14 integrierte Kategorien mit insgesamt 168 Begriffen
- Vermeidung wiederholter Begriffe bis zum Ende des jeweiligen Pools
- deadline-basierter Timer mit Pause, Hintergrund- und Neulade-Wiederherstellung
- lokaler Verlauf für jede abgeschlossene Runde
- versionierter Datenspeicher mit Migration älterer Spielstände
- Sicherungsexport und -import als JSON-Datei
- vollständige lokale Datenlöschung
- Datenschutzseite und Content Security Policy
- 192- und 512-Pixel-PNG-Icons sowie mobile Installationsmetadaten
- globaler Laufzeit-Fehlerschutz und kontrollierter PWA-Update-Neustart
- Desktop- und Mobile-End-to-End-Tests für Spielablauf, Timer, Verlauf, Speicherung, Inhalte, Offline-Modus, Accessibility, Sicherheit und PWA-Installation
- Grenzwerttests für 3–20 Personen und mehrere Imposter
- deterministische Fuzz-Tests über 120 Spielszenarien mit Engine-Invarianten
- optionaler Chromium-, Firefox-, WebKit-, Android- und iPhone-Smoke-Test
- Repository-Hygieneprüfung und Performancebudget für den vollständigen Offline-Core
- Produktionsvalidator, Release-Audit und ausführliche Release-Checkliste
- manueller Gerätetestplan, Deployment-/Rollback-Anleitung, Sicherheitsrichtlinie und objektiver Release-Status

### Verbessert

- Fokusführung, Tastaturbedienung und Screenreader-Struktur
- Touchflächen und mobile Darstellung
- Offline-Cache und Service-Worker-Aktualisierung
- Validierung manipulierter oder beschädigter Spielstände
- verständliche Spiel- und Punktregeln direkt in der App
- CI-Installation verändert keine Repository-Dateien und prüft getrackte Dateien statt lokaler Installationsordner
- Release-Validierung bleibt auch nach einer lokalen `npm install`-Ausführung verwendbar

### Behoben

- endlose Stichwahlen
- zufällige Begriffswiederholungen innerhalb eines Matches
- Timerabweichungen nach Hintergrundbetrieb oder Neuladen
- fehlender Verlauf bei Runden, die direkt durch die Abstimmung enden
- unvollständige Migration älterer lokaler Spielstände
- unvollständiger Offline-Cache für Datenspeicher, Laufzeitschutz und Installationsicons
- fehlerhafte Release-Gates, die einen lokalen `node_modules`-Ordner irrtümlich als eingecheckten Fehler bewerteten
- nicht abgewartete dynamische Service-Worker-Cache-Schreibvorgänge

### Sicherheit und Datenschutz

- keine Analyse-, Werbe- oder Tracking-Dienste
- keine Anmeldung und keine appgesteuerte Übertragung von Spieldaten
- restriktive Richtlinie für Skripte, Ressourcen und Formulare
- lokale Prüfung und Größenbegrenzung importierter Sicherungsdateien
- Rollback bei fehlgeschlagenem Sicherungsimport
- Browsertests gegen HTML-/Skript-Injektion durch Namen und eigene Kategorien
- dokumentierter Weg für private Sicherheitsmeldungen

## Frühere Beta-Stände

Frühere Entwicklungsstände enthielten den grundlegenden Offline-Spielablauf, die deterministische Engine, benutzerdefinierte Kategorien und die erste PWA-Struktur. Beta.3 fasst diese Arbeiten zu einer testbaren Produktionsbeta zusammen.
