# Änderungsverlauf

## In Entwicklung – Release Foundation Januar 2027

### Behoben

- Offline-Navigation für dynamische Spiel-URLs wie `quick-play.html?game=...` verwendet nun einen kanonischen Cache-Schlüssel ohne Query-Parameter.
- Unbekannte oder beschädigte Quick-Game-IDs laden nicht mehr stillschweigend die falsche Spiel-Engine.
- Word-Imposter-Rollen werden unabhängig von der Karten-Aufdeckreihenfolge erzeugt.
- Die maximale Zahl von sechs Impostern wird direkt durch die Hauptengine validiert.
- Das nachträgliche Überschreiben von Engine-Methoden durch `role-assignment.js` wurde entfernt.
- Creator-Zeitstempel bleiben beim Laden, Exportieren und Importieren unverändert.
- `updatedAt` wird nur noch bei einem tatsächlichen Speichervorgang erneuert.
- Duplizierte Creator-Spiele erhalten eigene Erstellungs- und Änderungszeitpunkte.
- Word-Imposter-Backups verwenden jetzt dieselbe 1,5-MB-Grenze wie die Gesamtsicherung.
- Backupgrößen werden als echte UTF-8-Bytes statt als JavaScript-Zeichenanzahl geprüft.
- Auch als Objekt übergebene Backups werden vor dem Import serialisiert und gegen die Größenbegrenzung geprüft.
- Creator- und klassische Quick-Sessions schreiben Verlauf, Spielanzahl und Rundenzahl höchstens einmal.
- Mega- und Viral-Abschlüsse werden über einen eng begrenzten Kompatibilitätsschutz dedupliziert.
- Der alte Mega-/Viral-/Quick-Fehler, bei dem `plays` praktisch bei mindestens 1 blieb, wird im gemeinsamen Abschlussregister korrekt behandelt.
- Liegengebliebene Sessions einer anderen Engine blockieren die Zuordnung eines aktuellen Abschlusses nicht mehr.
- Eine neue PWA-Version wird nicht mehr automatisch mitten in einer laufenden Nutzung aktiviert.

### Hinzugefügt

- gemeinsames `session-ledger.js` mit stabilen Session- und Abschluss-IDs
- `session-ledger-legacy-guard.js` für die schrittweise Migration großer Alt-Engines
- sichtbarer PWA-Updatehinweis mit „Jetzt aktualisieren“ und „Später“
- separat vorbereiteter Service-Worker-Staging-Cache
- barrierearme, responsive Updateleiste mit Safe-Area- und Reduced-Motion-Unterstützung

### Qualität

- Regressionstest für Service-Worker-Navigation ergänzt.
- Regressionstest für Quick-Game-Routing ergänzt.
- Fairnessprüfung mit 200 deterministischen Rollenstichproben ergänzt.
- Regressionstest für Creator-Zeitstempel ergänzt.
- Unicode-Regressionstest für mehrbyteige Backupinhalte ergänzt.
- Genau-einmal-Tests für Creator, Quick, Mega und Viral ergänzt.
- Erststart-, Retry- und liegengebliebene-Session-Fälle für den Abschlussguard ergänzt.
- statische Qualitätsprüfung für sichtbare und kontrollierte PWA-Aktualisierungen ergänzt.
- Verbindlicher Releasefahrplan und qualitätsbasierter Releaseumfang für Januar 2027 ergänzt.

### Bekannte externe Blockade

- GitHub Actions weist dem Workflow weiterhin keinen Runner zu beziehungsweise lässt den Job ohne Schritte in der Warteschlange. Lokale Tests und Syntaxprüfungen ersetzen den verpflichtenden grünen Remote-Lauf nicht.

## Frühere Entwicklungswelle – Bedienbarkeit, Creator und Offline-Core v29

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
