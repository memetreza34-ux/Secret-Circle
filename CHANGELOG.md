# Änderungsverlauf

## In Entwicklung – Mega-Trend-Erweiterung

### Hinzugefügt

- Katalog von 28 auf **37 technisch spielbare Spiele** erweitert
- eigene Mega-Trend-Engine mit wiederaufnehmbaren Sessions
- Wer bin ich? mit Anime-Archetypen, Gaming, Geschichte, Sport, Berufen, Tieren, Mythen und Bühne
- inoffizielles textbasiertes Anime-Figuren-Quiz ohne Bilder, Logos oder Zitate
- hypothetische Geld-Challenge mit 10-, 50-, 100- und 500-Euro-Fragen sowie „Wer zahlt?“-Situationen
- Blind Ranking mit fünf festen Positionen
- Emoji Quiz mit Tieren, Essen, Berufen, Orten, Sprichwörtern und Alltag
- Pass das Handy mit Freundschaft, Komplimenten, Chaos, Team und Entscheidungen
- Red Flag oder Green Flag für Freundschaft, Dating, Alltag, Schule, Arbeit und Internet
- Geheime Mission mit sicheren Gesprächs-, Bewegungs-, Team- und Chaosaufgaben
- Tier List Battle mit Snacks, Apps, Schulfächern, Hobbys, Reisen und Partysituationen
- eigene Text-Packs für Wer bin ich?, Anime-Figuren, Pass das Handy, Flags, Missionen und Tier Lists
- neuer `quick-loader.js`, der pro Seite genau eine Quick- oder Trend-Engine lädt
- Offline-Core `secret-circle-v27`
- Unit-, E2E-, Offline- und Cross-Browser-Prüfungen für die neuen Modi

### Verbessert

- insgesamt 19 Quick- und Trend-Modi
- eigene Packgrenze auf 30 Packs und 150 Karten je Pack erhöht
- Party Hub, Suche, Filter, Favoriten, Statistik und Smart Party Night verwenden den 37-Spiel-Katalog
- Trend-Spiele sind im Detailfenster klar mit „Trend Mode öffnen“ gekennzeichnet
- alle neuen Sessions besitzen Spieler-Snapshot, Verlauf, Statistik, Wiederaufnahme und Korruptionsprüfung
- Geldfragen lösen keine echte Zahlung aus
- Nutzertexte werden ausschließlich als Text dargestellt
- Architektur-, Struktur-, Release- und Performance-Gates auf v27 synchronisiert
- 122-Modi-Universum besteht jetzt aus 37 aktuellen und 85 zukünftigen Modi

### Noch offen

- vollständiger grüner `npm run ci`-Lauf
- grüner Cross-Browser-Lauf
- sichtbare und grüne GitHub-Actions-Schritte
- echte Android-, iOS- und PWA-v27-Update-Prüfung
- reale Partytests mit allen 37 Spielen
- redaktionelle Inhalts-, Alters- und Fan-Content-Prüfung
- öffentliche Betreiber-, Kontakt-, Hosting- und Rechtsangaben

## 1.0.0-beta.3 – 2026-08-04

### Hinzugefügt

- vollständiger Word-Imposter-Ablauf mit Rollen, Timer, Abstimmung, Ratechance und Punkten
- Party Hub, Smart Party Night, Advanced-Spiele und klassische Quick Modes
- lokale Speicherung, Sicherung, vollständige Löschung und Offline-PWA
- 14 Imposter-Kategorien mit 168 Begriff-Hinweis-Paaren
- Content Security Policy und Laufzeit-Fehlerschutz

### Behoben

- unabhängige Imposter-Verteilung
- maximal sechs Imposter
- begrenzte Stichwahl
- doppelte Stimmen und Selbstwahl
- Begriffswiederholungen vor Pool-Erschöpfung
- Timerabweichungen nach Hintergrundbetrieb oder Neuladen
- fehlende Verlaufseinträge und unvollständige Migrationen

### Sicherheit und Datenschutz

- keine Anmeldung, Analyse-, Werbe- oder Tracking-Dienste
- keine appgesteuerte Übertragung von Spieldaten
- restriktive Ressourcenrichtlinie
- sichere Textausgabe und Import-Rollback
- automatischer Sichtschutz geheimer Inhalte
