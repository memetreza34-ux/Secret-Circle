# Änderungsverlauf

## In Entwicklung – Bedienbarkeit, Creator und Offline-Core v29

### Hinzugefügt

- Party Hub mit 45 eingebauten technisch spielbaren Spielen
- 27 Quick-, Trend- und Viral-Modi
- Drei-Schritte-Einstieg für neue Gruppen
- kontextabhängige Kurz-Hilfen in allen Hauptbereichen
- erster-Besuch-Onboarding
- „Kurz erklärt“-Regeln direkt im Spieldetail
- eigener lokaler No-Code-Game-Creator
- sechs Creator-Vorlagen: Fragen, Auswahl, Erraten, Challenges, Story und Debatte
- Live-Vorschau mit Icon, Akzent, Spielerzahl und Dauer
- bis zu 40 selbst erstellte Spiele
- bis zu 8 Kategorien und 200 Karten je eigener Kategorie
- Bearbeiten, Kopieren, Löschen, Exportieren und Importieren eigener Spiele
- Integration selbst erstellter Spiele in Suche, Filter, Favoriten, Verlauf und einfache Hub-Engines
- Creator- und Guidance-E2E-Tests
- Creator-Unit-Test mit Unicode-, Struktur-, Export-, Import- und Rollback-Prüfung
- `ASSET_PLAN.md` für Icons, Illustrationen und Animationen
- Offline-Core `secret-circle-v29`

### Verbessert

- klarere Buttons: „Spielen“, „Jetzt spielen“, „Eigenes Spiel starten“ und engineabhängige Aktionen
- verständlichere Spielkarten mit Mechanik- oder Kategorielabel
- neue Creator-Einstiege in Navigation, Hero und Startseite
- leere Zustände erklären die nächste Aktion
- eigene Spiele werden validiert und transaktionssicher gespeichert
- strukturierte Entweder-oder-Karten bleiben über Speichern, Export und Import erhalten
- Gesamtsicherung und Datenlöschung nennen und enthalten selbst erstellte Spiele
- Datenschutzseite erklärt Creator-, Social-, Anime-, Geld- und Preisdaten
- Katalogrouting auf Version 7
- Custom-Pack-Manager auf Version 4
- Architektur-, Struktur-, Release- und Performance-Gates auf v29 synchronisiert

### Noch offen

- vollständiger grüner `npm run ci`-Lauf
- grüner Cross-Browser-Lauf
- sichtbare grüne GitHub-Actions-Schritte
- echte Android-, iOS- und PWA-v29-Update-Prüfung
- reale Creator-Usability-Tests
- reale Partytests mit allen 45 eingebauten Spielen
- Produktion der geplanten Icons, Illustrationen und Animationen
- redaktionelle Inhalts-, Alters-, Fan-Content- und Rechtsprüfung

## Frühere Erweiterungswellen

### Viral- und Trend-Modi

- Wer bin ich?
- Anime-Figuren erraten
- hypothetische Geld-Challenge
- Blind Ranking
- Emoji Quiz
- Pass das Handy
- Red Flag oder Green Flag
- Geheime Mission
- Tier List Battle
- Finger runter
- Preis schätzen
- Höher oder tiefer
- Wer kennt mich am besten?
- Hear Me Out
- Hot Seat
- Story Chain
- Satz beenden

### Word Imposter und Plattformkern

- vollständiger Rollen-, Timer-, Abstimmungs-, Rate- und Punkteablauf
- Smart Party Night
- Advanced-Spiele
- lokale Speicherung und Sicherung
- installierbare Offline-PWA
- 14 Imposter-Kategorien mit 168 Begriff-Hinweis-Paaren
- Content Security Policy und Laufzeit-Fehlerschutz
- keine Anmeldung, Analyse-, Werbe- oder Tracking-Dienste
