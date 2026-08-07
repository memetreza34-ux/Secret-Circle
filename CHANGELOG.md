# Änderungsverlauf

## In Entwicklung – Release Foundation Januar 2027

### Behoben

- Offline-Navigation für dynamische Spiel-URLs wie `quick-play.html?game=...` verwendet einen kanonischen Cache-Schlüssel ohne Query-Parameter.
- Unbekannte oder beschädigte Quick-Game-IDs laden nicht stillschweigend die falsche Spiel-Engine.
- Word-Imposter-Rollen werden unabhängig von der Karten-Aufdeckreihenfolge erzeugt; maximal sechs Imposter werden direkt in der Hauptengine validiert.
- Das nachträgliche Überschreiben von Engine-Methoden durch `role-assignment.js` wurde entfernt.
- Creator-Zeitstempel bleiben beim Laden, Exportieren und Importieren stabil; `updatedAt` ändert sich nur bei einer echten Bearbeitung.
- Word-Imposter- und Gesamtbackups verwenden dieselbe 1,5-MB-Grenze als echte UTF-8-Bytes.
- Creator-, Quick-, Mega- und Viral-Sessions schreiben Verlauf, Spielanzahl, Rundenzahl und Bestwert höchstens einmal pro echter Session.
- Direkte Hub-Spiele erhöhen `plays` nicht mehr beim Öffnen oder Startversuch; Statistik und Verlauf entstehen erst beim echten Abschluss.
- Ältere aktive Mega- und Viral-Sessions erhalten deterministische kompatible Session-IDs; der temporäre globale Storage-Guard wurde entfernt.
- Scharade, Heiße Kartoffel und Wortkette verwenden keine privaten Hub-Intervalle mehr, sondern den gemeinsamen pausierbaren Timerkern.
- Beim App-/Tab-Wechsel wird eine laufende Hub-Timerrunde automatisch pausiert.
- Direkte Hub-Sessions besitzen jetzt den versionierten Active-State `secret-circle-party-hub-active-v1` und können nach einem vollständigen Reload ausdrücklich fortgesetzt werden.
- Laufende Hub-Sessions speichern einen eigenen Spieler-Snapshot, damit spätere Lobbyänderungen eine bestehende Session nicht verändern.
- Beschädigte Hub-Active-States werden validiert und verworfen, statt ungeprüft geladen zu werden.
- Ein Reload öffnet direkte Hub-Spiele nicht automatisch; die Wiederaufnahme erfolgt über „Session fortsetzen“.
- Private Hub-Inhalte werden nach Reload nicht automatisch wieder offengelegt; insbesondere Paranoia kehrt zum verdeckten Schritt zurück.
- Scharade speichert über Reload Restzeit, Rundentreffer und aktuelle Karte und wird pausiert wiederhergestellt.
- Heiße Kartoffel speichert die interne zufällige Restzeit, zeigt sie aber auch nach Wiederaufnahme nicht an.
- Wortkette speichert Buchstabe und Restzeit und wird pausiert wiederhergestellt.
- Das Verwerfen eines gespeicherten Hub-Spielstands erzeugt keinen fertigen Verlaufseintrag und keine Statistikbuchung.
- Der PWA-Update-Schutz erkennt jetzt auch aktive direkte Hub-Sessions.
- Der PWA-Update-Schutz verwendet denselben realen Advanced-Speicherschlüssel wie der Advanced Runner.
- Bereits geöffnete private Question-Imposter-Fragen, Location-Spy-Karten und Mafia-Rollen werden nach Reload wieder verdeckt.
- Eine offene Mafia-Moderatorübersicht benötigt nach Reload erneut die bewusste Moderatorbestätigung.
- Advanced-Browserverträge wurden auf den tatsächlichen Resume-Flow und Speicherschlüssel korrigiert.
- Mafia skaliert die Zahl der Mafia-Rollen mit der Gruppengröße statt unabhängig von der Gruppe immer nur eine Mafia zu erzeugen.
- Die Mafia-Packs `Schnell`, `Klassisch` und `Erweitert` beeinflussen tatsächlich die Rollenverteilung.
- Der in `Erweitert` deklarierte Beschützer besitzt eine echte Nachtaktion und kann nicht dieselbe Person in zwei aufeinanderfolgenden Nächten schützen.
- Eine neue PWA-Version wird nicht automatisch mitten in einer laufenden Nutzung aktiviert.
- Der aktive Offline-Cache wird bei einer Aktualisierung nicht vor dem erfolgreichen Kopieren der neuen Dateien gelöscht.
- Alters- und Reifestufenfilter können sich nicht gegenseitig aufheben; eine URL-Ansicht hat Vorrang vor der gespeicherten Ansicht.
- Fehlender oder blockierter lokaler Speicher wird bei Katalogfiltern nicht fälschlich als erfolgreicher Schreibvorgang behandelt.
- Suchhilfe und Such-Styles werden in der kontrollierten Hub-Ladekette geladen und offline gespeichert.

### Hinzugefügt

- gemeinsames `session-ledger.js` mit stabilen Session- und Abschluss-IDs
- direkte Hub-Abschlüsse über dasselbe Session-Ledger
- gemeinsames `party-session-controls.js` für schnelle Engines und Hub-Timer
- versionierter direkter Hub-Wiederaufnahmezustand mit explizitem Resume und sicherem Verwerfen
- `CORE_GAME_ACCEPTANCE.md` als technische und manuelle Abnahmematrix der 15 Kernspiele
- zentrales `backup-schema-registry.js` für Word-Imposter-, Gesamt- und Creator-Sicherungen
- sichtbarer PWA-Updatehinweis mit „Jetzt aktualisieren“ und „Später“ sowie separater Staging-Cache
- Party-Hub-Reifestufen mit 15 Kernspielen, 13 Erweiterungen und 17 Labs-Modi
- dauerhafte Speicherung von Suche, Gruppe, Stimmung, Spielerzahl, Alter, Status, Reifestufe und letzter Hub-Ansicht
- Synonym- und Tippfehlersuche mit ARIA-Listbox, Tastatur, Maus und Touch
- vollständig neu strukturierte Release-Checkliste bis Januar 2027

### Qualität

- Regressionstests für Service-Worker-Navigation, Quick-Routing, Rollenfairness, Creator-Zeitstempel und Unicode-Backups.
- direkte Genau-einmal-Vertragstests für Creator, Quick, Mega, Viral und Hub-Abschlüsse.
- `tests/core-game-contract.test.js` für die 15 Kernspiele.
- `tests/hub-timer-contract.test.js` für den gemeinsamen pausierbaren Hub-Timer und die serialisierte Restzeit.
- `tests/hub-resume-contract.test.js` für Active-State, Spieler-Snapshot, sichere Wiederaufnahme, Geheimnis-Schutz und PWA-Update-Erkennung.
- `tests/e2e/core-hub-resume.spec.js` für Paranoia, Scharade, Heiße Kartoffel, Wortkette und das sichere Verwerfen gespeicherter Sessions.
- Browserkatalog- und Hub-Statistiktests für die Kernspiele.
- Advanced-Smoke-, Unterbrechungs-, Geheimnis-Resume-, Rundenfluss- und Genau-einmal-Abschlusstests.
- deterministische Mafia-Rollen- und Siegbedingungstests sowie Browservertrag für die erweiterte Mafia.
- Contract-Test für alle drei Backupformate.
- Unit-/Browser-Verträge für Filterzustand, kombinierte Alters-/Reifestufenfilter, Synonyme und Tippfehler.
- Struktur-, Architektur-, Foundation-, Performance- und Release-Audits auf gemeinsame Ledger-, Timer- und Hub-Resume-Verträge aktualisiert.
- das bestehende 65-KB-Budget für `party-hub.js` wurde trotz zusätzlicher Resume-Logik nicht gelockert.

### Bekannte externe Blockade

- GitHub Actions weist dem Workflow weiterhin keinen Runner zu. Die zuletzt überprüften Läufe endeten mit `runner_id: 0`, leerem Runnernamen, `steps: []` und ohne Checkout.
- Deshalb sind die neu ergänzten Node-/Playwright-Verträge vorbereitet, aber noch nicht durch einen vertrauenswürdigen vollständigen Remote-Lauf als grün dokumentiert.
- Ein reproduzierbares `package-lock.json` und die Umstellung auf `npm ci` bleiben offen, bis Abhängigkeiten in einer funktionierenden CI- oder lokalen npm-Umgebung aufgelöst werden können.

### Noch offen

- Produktentscheidung über einen festen Tabu-Rundentimer
- systematische Vereinheitlichung von Skip, Fokus, Punkteverhalten und mobiler Accessibility in den direkten Hub-Kernspielen
- vollständiger grüner `npm run ci`- und Cross-Browser-Lauf
- echte Android-, iOS-, Tablet-, Sperrbildschirm- und PWA-Update-Prüfung
- reale Kernspiel- und Gruppentests
- redaktionelle Inhalts-, Alters-, Fan-Content- und Rechtsprüfung

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
