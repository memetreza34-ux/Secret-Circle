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
- optionaler Bildschirm-Wake-Lock während der Diskussionsrunde
- lokaler Verlauf für jede abgeschlossene Runde
- versionierter Datenspeicher mit Migration älterer Spielstände
- Sicherungsexport und -import als JSON-Datei
- vollständige lokale Datenlöschung
- Live-Erkennung der Gruppengröße und dynamischer gültiger Imposter-Bereich
- automatische Verdeckung sichtbarer geheimer Karten bei App-Wechsel oder Fokusverlust
- Schutz vor Kartenweitergabe, solange eine automatisch verdeckte Karte nicht erneut geöffnet wurde
- Datenschutzseite und Content Security Policy
- 192- und 512-Pixel-PNG-Icons sowie mobile Installationsmetadaten
- globaler Laufzeit-Fehlerschutz und kontrollierter PWA-Update-Neustart
- vollständiger Offline-Core `secret-circle-v16`
- Desktop- und Mobile-End-to-End-Tests für Spielablauf, Timer, Verlauf, Speicherung, Inhalte, Offline-Modus, Privatsphäre, Wake Lock, Accessibility, Sicherheit und PWA-Installation
- Grenzwerttests für 3–20 Personen und mehrere Imposter
- deterministische Fuzz-Tests über 120 Spielszenarien mit Engine-Invarianten
- optionaler Chromium-, Firefox-, WebKit-, Android- und iPhone-Smoke-Test
- Repository-Hygieneprüfung und Performancebudget für den vollständigen Offline-Core
- strukturierter HTML-, Asset-, Manifest- und Service-Worker-Validator
- Release-Audit und ausführliche Release-Checkliste
- manueller Gerätetestplan, Deployment-/Rollback-Anleitung, Sicherheitsrichtlinie und objektiver Release-Status

### Verbessert

- Fokusführung, Tastaturbedienung und Screenreader-Struktur
- Touchflächen, iPhone-Safe-Areas, dynamische Viewport-Höhe und mobile Darstellung
- Bildschirm bleibt auf unterstützten Geräten während der Diskussion aktiv
- Wake Lock wird bei Abstimmung, Hintergrundbetrieb und Seitenwechsel sicher freigegeben
- Geräte ohne Wake-Lock-API verwenden einen fehlerfreien Fallback
- Offline-Cache und Service-Worker-Aktualisierung
- Validierung manipulierter oder beschädigter Spielstände
- verständliche Spiel- und Punktregeln direkt in der App
- sichere Fokuswiederherstellung nach automatischer Kartenverdeckung
- CI-Installation verändert keine Repository-Dateien und prüft getrackte Dateien statt lokaler Installationsordner
- Release-Validierung bleibt auch nach einer lokalen `npm install`-Ausführung verwendbar

### Behoben

- endlose Stichwahlen
- zufällige Begriffswiederholungen innerhalb eines Matches
- Timerabweichungen nach Hintergrundbetrieb oder Neuladen
- fehlender Verlauf bei Runden, die direkt durch die Abstimmung enden
- unvollständige Migration älterer lokaler Spielstände
- unvollständiger Offline-Cache für Datenspeicher, Laufzeit-, Setup-, Privatsphäre- und Wake-Lock-Schutz sowie Installationsicons
- versehentliche Weitergabe einer automatisch verdeckten Karte über programmatische oder schnelle Eingaben
- fehlerhafte Release-Gates, die einen lokalen `node_modules`-Ordner irrtümlich als eingecheckten Fehler bewerteten
- nicht abgewartete dynamische Service-Worker-Cache-Schreibvorgänge

### Sicherheit und Datenschutz

- keine Analyse-, Werbe- oder Tracking-Dienste
- keine Anmeldung und keine appgesteuerte Übertragung von Spieldaten
- restriktive Richtlinie für Skripte, Ressourcen und Formulare
- lokale Prüfung und Größenbegrenzung importierter Sicherungsdateien
- Rollback bei fehlgeschlagenem Sicherungsimport
- Browsertests gegen HTML-/Skript-Injektion durch Namen und eigene Kategorien
- automatischer Sichtschutz für geheime Rollen und Begriffe
- dokumentierter Weg für private Sicherheitsmeldungen

## Frühere Beta-Stände

Frühere Entwicklungsstände enthielten den grundlegenden Offline-Spielablauf, die deterministische Engine, benutzerdefinierte Kategorien und die erste PWA-Struktur. Beta.3 fasst diese Arbeiten zu einer testbaren Produktionsbeta zusammen.
