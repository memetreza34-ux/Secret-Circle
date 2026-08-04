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
- Desktop- und Mobile-End-to-End-Tests für Spielablauf, Timer, Verlauf, Speicherung, Inhalte, Offline-Modus, Accessibility und PWA-Installation
- Produktionsvalidator, Release-Audit und ausführliche Release-Checkliste

### Verbessert

- Fokusführung, Tastaturbedienung und Screenreader-Struktur
- Touchflächen und mobile Darstellung
- Offline-Cache und Service-Worker-Aktualisierung
- Validierung manipulierter oder beschädigter Spielstände
- verständliche Spiel- und Punktregeln direkt in der App

### Behoben

- endlose Stichwahlen
- zufällige Begriffswiederholungen innerhalb eines Matches
- Timerabweichungen nach Hintergrundbetrieb oder Neuladen
- fehlender Verlauf bei Runden, die direkt durch die Abstimmung enden
- unvollständige Migration älterer lokaler Spielstände
- unvollständiger Offline-Cache für Datenspeicher und Installationsicons

### Sicherheit und Datenschutz

- keine Analyse-, Werbe- oder Tracking-Dienste
- keine Anmeldung und keine appgesteuerte Übertragung von Spieldaten
- restriktive Richtlinie für Skripte, Ressourcen und Formulare
- lokale Prüfung und Größenbegrenzung importierter Sicherungsdateien
- Rollback bei fehlgeschlagenem Sicherungsimport

## Frühere Beta-Stände

Frühere Entwicklungsstände enthielten den grundlegenden Offline-Spielablauf, die deterministische Engine, benutzerdefinierte Kategorien und die erste PWA-Struktur. Beta.3 fasst diese Arbeiten zu einer testbaren Produktionsbeta zusammen.
