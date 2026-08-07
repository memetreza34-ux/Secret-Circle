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
- Creator-, Quick-, Mega- und Viral-Sessions schreiben Verlauf, Spielanzahl, Rundenzahl und Bestwert höchstens einmal pro echter Session.
- Der alte Mega-/Viral-/Quick-Fehler, bei dem `plays` praktisch bei mindestens 1 blieb, ist in allen betroffenen Engines direkt beseitigt.
- Ältere aktive Mega- und Viral-Sessions erhalten beim Laden eine deterministische kompatible Session-ID.
- Ein fehlgeschlagenes Entfernen der aktiven Session stellt den letzten Abschlusszustand wieder her, statt eine inkonsistente Oberfläche zu hinterlassen.
- Der temporäre globale `Storage.prototype`-Guard wurde nach der direkten Engine-Migration vollständig entfernt.
- Eine neue PWA-Version wird nicht mehr automatisch mitten in einer laufenden Nutzung aktiviert.
- Der aktive Offline-Cache wird bei einer Aktualisierung nicht mehr vor dem erfolgreichen Kopieren der neuen Dateien gelöscht.
- Veraltete Cacheeinträge werden erst entfernt, nachdem der vorbereitete Offline-Core vollständig übernommen wurde.
- Alters- und Reifestufenfilter können sich nicht mehr gegenseitig aufheben.
- Eine ausdrücklich per URL angeforderte Hub-Ansicht überschreibt korrekt die zuvor gespeicherte Ansicht.
- Fehlender oder blockierter lokaler Speicher wird bei Katalogfiltern nicht mehr fälschlich als erfolgreicher Schreibvorgang behandelt.
- Suchhilfe und Such-Styles werden jetzt tatsächlich in der kontrollierten Hub-Ladekette geladen und offline gespeichert.

### Hinzugefügt

- gemeinsames `session-ledger.js` mit stabilen Session- und Abschluss-IDs für Creator, Quick, Mega und Viral
- zentrales `backup-schema-registry.js` für Word-Imposter-, Gesamt- und Creator-Sicherungen
- `BACKUP_SCHEMAS.md` mit Formatversionen, Größen, Migration, Rollback und Release-Gates
- sichtbarer PWA-Updatehinweis mit „Jetzt aktualisieren“ und „Später“
- separat vorbereiteter Service-Worker-Staging-Cache
- barrierearme, responsive Updateleiste mit Safe-Area- und Reduced-Motion-Unterstützung
- Party-Hub-Reifestufen mit 15 Kernspielen, 13 Erweiterungen und 17 Labs-Modi
- Reifestufenfilter, Schnellwahlkarten und sichtbare Qualitätsbadges im Spielekatalog
- dauerhafte Speicherung von Suche, Gruppe, Stimmung, Spielerzahl, Alter, Status, Reifestufe und letzter Hub-Ansicht
- einheitliche Schaltfläche „Filter zurücksetzen“
- Synonym- und Tippfehlersuche mit bekannten Alternativnamen, gewichteten Vorschlägen und maximal sechs Ergebnissen
- barrierearme Suchvorschläge mit ARIA-Listbox, Pfeiltasten, Enter, Escape, Maus und Touch
- responsive Styles für Kernspiele, Erweiterungen, Labs, Filterreset und Suchvorschläge
- vollständig neu strukturierte Release-Checkliste für CI, Engines, Kernspiele, Hub, Backups, PWA, Geräte, Inhalte und Gruppentests

### Qualität

- Regressionstest für Service-Worker-Navigation ergänzt.
- Regressionstest für Quick-Game-Routing ergänzt.
- Fairnessprüfung mit 200 deterministischen Rollenstichproben ergänzt.
- Regressionstest für Creator-Zeitstempel ergänzt.
- Unicode-Regressionstest für mehrbyteige Backupinhalte ergänzt.
- Direkte Genau-einmal-Vertragstests für Creator, Quick, Mega und Viral ergänzt.
- Migration älterer aktiver Sessions und Rollback bei fehlgeschlagener Abschlussbereinigung werden geprüft.
- Der Build verbietet eine erneute Einführung des entfernten Legacy-Guards in Loader, Offline-Core oder Testskripten.
- statische Qualitätsprüfung für sichtbare und kontrollierte PWA-Aktualisierungen ergänzt.
- Test für nicht-destruktive Cache-Promotion ergänzt.
- Contract-Test für alle drei Backupformate ergänzt.
- feste Prüfung der Katalogverteilung 15 / 13 / 17 ergänzt.
- Unit-Test für Filterzustand, Sanitizing, Speicherfehler und URL-Priorität ergänzt.
- Browsertests für Filterwiederherstellung, Reset und kombinierte Alters-/Reifestufenfilter ergänzt.
- Unit- und Browsertests für Synonyme, Tippfehler, Maus-, Tastatur- und Escape-Bedienung ergänzt.
- Struktur-, Architektur-, Contract-, Performance- und Release-Audits auf die direkte Ledger-Architektur aktualisiert.
- feste Größenbudgets für Registry, Ledger, PWA-Update, Release-Struktur, Filterzustand und Suchhilfe ergänzt.
- Verbindlicher Releasefahrplan und qualitätsbasierter Releaseumfang für Januar 2027 ergänzt.

### Bekannte externe Blockade

- GitHub Actions weist dem Workflow weiterhin keinen Runner zu. Der aktuelle Lauf #1401 endete mit `runner_id: 0`, leerem Runnernamen, `steps: []` und ohne Joblog vor dem Checkout.
- Ein reproduzierbares `package-lock.json` und die Umstellung auf `npm ci` bleiben offen, bis Abhängigkeiten in einer funktionierenden CI- oder lokalen npm-Umgebung aufgelöst werden können.

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
