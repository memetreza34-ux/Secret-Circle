# Secret Circle – Releasefahrplan bis Januar 2027

Stand: 29. August 2026

## Verbindliches Ziel

- **Funktionsfertig:** spätestens 30. November 2026
- **Code Freeze:** 5. Dezember 2026
- **Release Candidate:** spätestens 15. Dezember 2026
- **Öffentlicher Release:** 4.–15. Januar 2027

Neue Funktionen nach dem Code Freeze dürfen den Release nicht gefährden. Die finale Abnahme erfolgt anhand von `RELEASE_CHECKLIST.md`.

## Produktprinzipien

1. extrem einfache Bedienung ohne Entwicklererklärung;
2. Standardspiele in höchstens 2–3 Entscheidungen bis zur ersten echten Aktion;
3. zuverlässige Offline-/Resume-Nutzung;
4. hochwertige, jugend-/familienfreundliche Inhalte ohne 18+-Bereich;
5. klare Trennung Core / Extended / Labs;
6. viele Themen über gemeinsame Enginefamilien statt 100 Einzelengines;
7. starke Imposter-Welt als langfristiger Schwerpunkt;
8. lokale Datenkontrolle und Creator;
9. echte Geräte-/Gruppentests statt nur startbarer Seiten;
10. reproduzierbarer, dokumentierter Releaseprozess.

Aktueller Katalog: **47 Built-ins · 15 Core / 13 Extended / 19 Labs**.

## Prioritätsregel

**Release-Härtung schlägt Expansion.**

Labs dürfen parallel entstehen, wenn sie:

- den 15-Core-Scope nicht aufblähen,
- gemeinsame Engines wiederverwenden,
- eigene Tests/Audits besitzen,
- keine offenen P0/P1-Releasearbeiten verdrängen.

Kein Labs-Modus wird nur wegen vorhandenen Codes zum Core oder Release-PASS.

## August 2026 – technische Grundlage

### Repository / Release

- [x] separater Release-Foundation-Branch
- [x] Query-Navigation offline repariert
- [x] Service-Worker-Regressionstests
- [x] Release-Checkliste auf Januar 2027
- [x] `package-lock.json` v3
- [x] CI/Cross-Browser auf `npm ci`
- [ ] GitHub-Actions-Runner wieder funktionsfähig machen
- [ ] geschützte stabile Releasebasis / Branch Protection real aktivieren
- [ ] PR-Kette vor finalem RC kontrolliert konsolidieren

### Kerntechnik

- [x] Word-Imposter-Engine/Role-/Voting-/Resume-Hardening
- [x] zentrale Backup-Registry + Forward-Compatibility
- [x] Hub-/Advanced-/Quick-Resume-/Privacy-Grenzen
- [x] exact-once Session-Ledger
- [x] PWA-Updatefluss mit kontrollierter Aktivierung
- [x] Quick-Family Replacement / Timer Resume / BFCache / Background Pause / Hidden Snapshot
- [x] Offline-Core bis **`secret-circle-v61` / `secret-circle-v61-staging`**

### Spielbibliothek / Expansion

- [x] Konkurrenz-/Mechaniklücken in `APP_SPIELMODI_UND_THEMEN_ANLEITUNG.md` dokumentiert
- [x] maschinenlesbaren `GAME_LIBRARY_BACKLOG.json` angelegt
- [x] Content-Multiplikator-Regel: Themen auf gemeinsame Engines
- [x] **Party Quiz** als erstes Wave-1-Lab implementiert
- [x] **Fake oder Fakt** auf demselben Shared Runner implementiert
- [x] beide als Labs statt Core klassifiziert
- [x] Wave-1 Unit-/E2E-/Validate-Verträge ergänzt
- [ ] Bluff Trivia
- [ ] Prozent schätzen
- [ ] anonyme Schreibengine
- [ ] Party Bracket
- [ ] Undercover ähnliches Wort
- [ ] No-Word Imposter
- [ ] Ein-Wort-Hinweis

## September 2026 – Bedienung und Kernspiele

### Party Hub

- [ ] Navigation/Informationsarchitektur mit echten Nutzern testen
- [ ] Startseite auf wenige klare Hauptaktionen reduzieren
- [x] Filterzustand und zuletzt verwendete Ansicht speichern
- [x] Alters-/Reifestufenfilter
- [x] Core/Extended/Labs sichtbar kennzeichnen
- [x] **15 Core / 13 Extended / 19 Labs** im aktuellen v61-Katalog
- [x] Suchbegriffe/Synonyme/Tippfehler unterstützen
- [ ] visuelle Kartenhierarchie für großen Katalog vereinheitlichen
- [ ] Collections ergänzen: Imposter, Quiz, Raten, Schreiben, Team, Film/Serie, Anime/Gaming, Sport, Familie
- [ ] Schnellstart so testen, dass Nutzer nicht von 47+ Kacheln überfordert werden

### Kernspiele

- [ ] 15 Core vollständig real prüfen
- [ ] Regeln pro Core in maximal vier kurzen Schritten verständlich
- [x] gemeinsame Pause/Skip/Abort/Replay-Steuerung in Schnellspiel-Familien
- [x] direkte Hub-Sessions Save vs. bestätigtes Abort trennen
- [ ] Warte-/Übergabezeit bei großen Gruppen reduzieren
- [ ] Punkte-/Siegerlogik pro Core final dokumentieren
- [ ] Timer/Resume auf realen Zielgeräten

### Labs UX

- [ ] Party Quiz mit unerfahrener Gruppe testen
- [ ] Fake oder Fakt mit unerfahrener Gruppe testen
- [ ] beide in höchstens 2–3 Entscheidungen starten
- [ ] Labs-Badge/Filter verhindert Verwechslung mit Core-Reife

## Oktober 2026 – Inhalte, Creator und Design

### Inhalte

- [ ] jedes Release-Spiel redaktionell prüfen
- [ ] doppelte/schwache/missverständliche Karten entfernen
- [ ] Alters-/Privacy-Regeln konsistent
- [ ] mindestens drei hochwertige Packs pro Core
- [ ] sensible Fan-/Marken-/Franchise-Inhalte separieren
- [ ] Wave-1-Quizpacks nur mit geprüften, stabilen Fakten erweitern

### Themenbibliothek

Priorisierte Content-Layer:

- Film & Serie
- Anime-Archetypen
- Gaming / Internet
- Fußball / Sport
- Musik
- Deutschland / Europa / Welt
- Geschichte / Wissenschaft / Technik
- Natur / Tiere
- Essen / Reisen
- Familie / Freundschaft / Icebreaker

Konkrete moderne Franchises nur nach Referenz-/Rechteprüfung.

### Creator / Design

- [ ] Creator mobil vollständig testen
- [ ] strukturierte Fehler direkt am Feld
- [ ] Importkonflikte transparent
- [ ] eigene Icons/Illustrationen für Kernspiele
- [ ] Dark Mode/Kontrast/Reduced Motion/Touch/Safe Areas real prüfen

## November 2026 – Qualität und reale Tests

### Automatisiert

- [ ] vollständiges `npm run ci` grün dokumentieren
- [ ] Chromium / Firefox / WebKit grün
- [x] Daten-/Quota-/Rollback-/Importgrenzen durch Contracts abgedeckt
- [ ] alle Query-Routen offline in echten Browserläufen
- [ ] Service-Worker-Upgrade von mindestens zwei älteren Builds auf v61/RC
- [ ] Performancebudget einhalten

### Reale Geräte

- [ ] Android / Chrome
- [ ] iPhone / Safari
- [ ] iPad/Tablet
- [ ] installierte PWA + Browser-Tab
- [ ] Offline-Neustart
- [ ] Rotation / kleine Displays
- [ ] App-Wechsel / Screen-Lock / Prozess-Kill
- [ ] VoiceOver / TalkBack / Tastatur / 200-%-Zoom

### Gruppentests

- [ ] 3–4 Personen
- [ ] 5–8 Personen
- [ ] 9–12 Personen
- [ ] mehrere Imposter
- [ ] Smart Party Night
- [ ] Creator mit unerfahrener Person
- [ ] Party Quiz + Fake oder Fakt als Labs separat
- [ ] Feedback nach Severity/Wiederholbarkeit dokumentieren

## Dezember 2026 – Release Candidate

Ab 5. Dezember nur noch Fehler-, Content-, Accessibility-, Performance-, PWA-, Legal- und Releasekorrekturen.

Bis 15. Dezember:

- [ ] finale Version / Cachegeneration
- [ ] finale Icons/Assets/Rechte
- [ ] Privacy / Legal / Betreiber / Support
- [ ] Changelog / Deployment / Rollback
- [ ] unveränderter RC vollständig getestet
- [ ] keine Critical/High Bugs
- [ ] Labs nur dann im RC, wenn sie dieselben Mindestgates erfüllen; sonst aus Releaseoberfläche zurückstufen

## Januar 2027 – Veröffentlichung

- [ ] Production HTTPS
- [ ] Install/Offline nach Deployment erneut prüfen
- [ ] Release-Tag + unveränderlicher Commit
- [ ] Release Notes
- [ ] Supportkanal
- [ ] Hotfixprozess

## Releaseverbote

Kein öffentlicher Release, wenn unter anderem:

- Actions keine sichtbaren Schritte ausführt;
- CI/Cross-Browser rot ist;
- Offline/PWA-Update auf Zielgerät scheitert;
- Critical/High Bugs offen sind;
- Betreiber-/Privacy-/Lizenzangaben fehlen;
- Core-Spiele keine realen Gruppentests besitzen;
- Import/Restore lokale Daten ohne sicheren Rollback zerstören kann.

## Nach dem Release / große Bibliothek

Die Vision bleibt: **100+ sichtbare Spielvarianten**, aber über 20–30 belastbare Enginefamilien und viele Themenpacks.

Nächste Expansionsreihenfolge nach `GAME_LIBRARY_BACKLOG.json`:

1. Bluff Trivia
2. Prozent schätzen
3. anonyme Schreib-/Voting-Engine
4. Party Bracket
5. Shared Imposter: Undercover + No-Word
6. Ein-Wort-Hinweis
7. danach Survey/Co-op/Speaking/Puzzle/Telephone usw.

Jede neue Mechanik muss einen klaren Nutzen besitzen und die Bedienung einfacher oder die echte Vielfalt größer machen – nicht nur die Zahl der Kacheln erhöhen.
