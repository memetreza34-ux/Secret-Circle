# Changelog

Alle nennenswerten Änderungen an Secret Circle werden hier dokumentiert.

## v89 – „Zuletzt gespielt“ auch auf der Startseite

- Startseite: Eine Reihe „Zuletzt gespielt“ steht über den anderen Reihen und sieht aus wie sie. Sie zeigt die zuletzt beendeten Spiele, jedes einmal, schon ab einem Spiel. „Alle ansehen“ führt zur Liste mit Namen und Datum im Profil.
- Ohne Verlauf erscheint die Reihe nicht.

## v88 – Weiterspielen nur im Profil, „Zuletzt gespielt“ mit Namen

- Startseite: Die Karten „Weiterspielen“ oben sind weg. Gespeicherte, nicht beendete Spiele stehen nur noch im Profil.
- Profil: „Zuletzt gespielt“ ist eine schlichte Liste der beendeten Spiele, neueste zuerst, mit den Namen der Runde und dem Datum. Ein Tipp öffnet das Spiel.
- Der Verlauf speichert jetzt, wer mitgespielt hat: `session-ledger.js` legt die Namen (`players`) an jeden Abschluss, Advanced-Spiele und Word Imposter ebenso. Ältere Einträge ohne Namen zeigen nur das Datum.

## v87 – Altes Design gelöscht, alles im v2-Design

- Die Oberfläche von `party.html` (Start, Katalog, Spieler, Favoriten, Verlauf und Erfolge, Daten und Sicherung, eigene Kategorien, Partyabend-Planer, Spieldetail, Anleitung) trägt jetzt das v2-Design: neutrale dunkle Flächen, weiße Pillen-Knöpfe, Archivo-Black-Überschriften. Alle Funktionen, IDs und Abläufe bleiben unverändert.
- Neue Stildateien: `v2-party-hub.css` für diese Oberfläche, `v2-update.css` für den Hinweis „Neue Secret-Circle-Version bereit“.
- Gelöscht: `party.css`, `party-extra.css`, `party-night.css`, `party-guide.css`, `party-release.css`, `party-search.css`, `pwa-update.css`. `runtime-guard.js` und `party-hub-polish.js` laden sie nicht mehr nach.
- Manifest und `party.html` verwenden die v2-Grundfarbe `#0A0B0F` als Theme- und Hintergrundfarbe.
- Die Fußzeile von `party.html` führt zur Startseite zurück und nennt keine „lokale Offline-PWA“ mehr.
- Prüfungen, die die alten Stildateien lasen, prüfen dieselben Zusagen jetzt in `v2-party-hub.css` und `v2-update.css`.

## v84 – Überflüssige Hinweise entfernt

- Word Imposter: Die Fußzeile („Version … · Lokale Offline-PWA · Datenschutz“) und die Zeile „Secret Circle · Offline-Partyspiel“ über dem Titel sind weg.
- Die Versionsnummer steht jetzt klein unten im Profil der Startseite; der Datenschutz bleibt dort unter Profil → Datenschutz erreichbar.
- Creator: Der Entwicklerhinweis „Für spätere Bilder und Animationen vorbereitet“ und der Zusatz „Secret Circle Creator · lokale Daten“ in der Fußzeile sind entfernt.

## v83 – Verbindungsanzeige nur noch offline

- Die Anzeige „Online · offline bereit“ oben rechts ist weg. Word Imposter, Party Hub und Quick Play zeigen nur noch „Offline-Modus“, wenn das Gerät kein Netz hat; online bleibt die Stelle leer.

## v82 – Hilfswort an oder aus, dazu drei Stufen

- Word Imposter: Ein Schalter „Hilfswort für Imposter“ stellt das Hilfswort an oder aus. Ist es an, gibt es drei Stufen: Einfach (Hilfswort), Mittel (nur die Kategorie) und Schwer (nur die Anzahl der Buchstaben des Begriffs). Aus heißt: Der Imposter sieht nichts.
- Die Spiellogik kennt dafür `hintLevel: 'off'`; ältere Spielstände mit `useHint: false` werden als „aus“ gelesen. Die gewählte Stufe bleibt gespeichert, auch während das Hilfswort aus ist.
- Größenbudget für `v2-imposter.css` von 20 auf 24 KB angehoben, weil die Datei jetzt die ganze Einrichtung (Spielerliste, Regler, Schalter, Stufen) trägt.

## v81 – Startseite: schwarze Spielseiten, ganze Bilder, änderbare Namen, „Gemischt“

- Spielseiten, Spieler- und Kategorieseite sowie die Spielansichten sind einheitlich schwarz mit weißer Schrift und weißen Hauptknöpfen statt in der Farbe der Spielart; die Farbe bleibt als Punkt bei den Spielkacheln und als kleiner Akzent im Spiel.
- Spielbilder werden oben statt mittig zugeschnitten, damit Köpfe nicht abgeschnitten sind.
- In der gemeinsamen Spielerliste lassen sich Namen direkt antippen und ändern; doppelte Namen werden abgelehnt.
- Hub-Spiele mit mehreren Kategorien bieten zuerst „Gemischt“ an: Es nimmt die Karten aller Kategorien in fester Reihenfolge zusammen (`party-hub-round-state.js`), auch beim Fortsetzen nach dem Neuladen. Die Kategorie-Logik der Startseite liegt jetzt in `v2-hub-packs.js`.

## v80 – Hilfswort in drei Stufen

- Word Imposter: Statt des Schalters „Hilfswort“ gibt es die Stufen Einfach (Imposter sieht das Hilfswort), Mittel (nur die Kategorie des Begriffs) und Schwer (nichts). Eine Zeile darunter sagt, was die Stufe bedeutet.
- Die Spiellogik speichert die Stufe (`hintLevel`) und die Kategorie des Begriffs (`hintGroup`); ältere Spielstände und Einstellungen mit `useHint` laden weiter und werden als Einfach bzw. Schwer gelesen.

## v78 – Spielerliste zum Bearbeiten, freie Rundenzeit und Rundenzahl

- Word Imposter zeigt die Spieler als Liste: Jeder Name steht in einem eigenen Feld und lässt sich direkt ändern; × entfernt, „Spieler hinzufügen“ öffnet ein neues Feld. Leere Felder verschwinden wieder, doppelte Namen werden rot markiert.
- Rundenzeit (1–10 Minuten) und Runden (1–20) lassen sich in Einerschritten mit − und + oder per Eingabe einstellen statt nur in festen Stufen. Gespeicherte Einstellungen übernehmen jeden Wert in diesem Bereich.
- Der Fokusrahmen um den Spielbereich nach dem Laden entfällt; per Tastatur erreichbare Bedienelemente behalten ihren Fokusrahmen.

## v77 – Word Imposter ohne eigene Kategorien

- Word Imposter bietet nur noch die eingebauten Kategorien zur Auswahl; das Anlegen und Löschen eigener Kategorien ist aus der Einrichtung entfernt.
- Gespeicherte eigene Kategorien älterer Versionen bleiben im Speicher und in der Sicherung erhalten, werden aber nicht mehr angeboten; eine darauf zeigende Einstellung fällt auf „Gemischt“ zurück.

## v76 – Einfachere Einrichtung bei Word Imposter

- Spieler werden als Namen hinzugefügt und mit × entfernt statt in ein Textfeld getippt; doppelte Namen fängt das Feld direkt ab.
- Imposter, Rundenzeit und Runden stellt man mit − und + in je einer Zeile ein; das Hilfswort ist ein Schalter.
- „Letzte Runden“ und „Lokale Daten“ (Sicherung, Import, alles löschen) sind von der Einrichtung entfernt. Sicherung und Löschen bleiben im Profil unter „Daten und eigene Inhalte“ und umfassen weiter die Word-Imposter-Daten; der Verlauf wird weiter genau einmal gespeichert.
- Die Kurzanleitung über dem Formular entfällt; die Regeln stehen weiter unter „Spielregeln und Punkte“. Datenschutz ist über die Fußzeile erreichbar.

## v75 – Ungenutzte alte Stildateien entfernt

- `styles.css`, `pwa.css`, `creator.css` und `party-quick.css` werden von keiner Seite mehr geladen und sind gelöscht; Offline-Core, Größenbudget und Offline-Tests nennen sie nicht mehr.
- Die Zusage „reduzierte Bewegung und Touch-Mindesthöhe“ aus `creator.css` prüft `tests/accessibility-contract.test.js` jetzt für `v2-creator.css`, `v2-imposter.css` und `v2-advanced.css`.

## v74 – Creator im v2-Design

- `creator.html` nutzt `v2-theme.css` und die neue `v2-creator.css` statt `party.css`, `party-guide.css` und `creator.css`.
- Vorlagen, Felder, Icon- und Akzentwahl, Karteneditor, Prüfung, Vorschau, „Meine Spiele“ und Hilfeblatt folgen dem v2-Design; Akzentfarben erscheinen als Punkt statt als Fläche.
- Bei 320 px Breite läuft nichts mehr seitlich über. Logik, IDs und Fokusführung bleiben unverändert.

## v73 – Advanced-Spiele im v2-Design

- `advanced.html` (Mafia, Zwei Wahrheiten, Ortsspion, Fragen-Imposter) nutzt `v2-theme.css` und die neue `v2-advanced.css` statt `party.css` und `party-extra.css`.
- Einrichtung wie Quick Play; die Spielansicht trägt den roten Grundton von „Täuschung & Bluff“ wie die Party-Spielansicht. Lange Formulare lassen die Spielkarte nicht mehr schrumpfen.
- Spiellogik, IDs, Verdecken und Fortsetzen bleiben unverändert.

## v72 – Word Imposter im v2-Design

- `index.html` (Word Imposter) und `privacy.html` nutzen `v2-theme.css` und die neue `v2-imposter.css` statt `styles.css` und `pwa.css`.
- Einrichtung zeigt das Chamäleon-Spielbild; Karte, Timer, Abstimmung und Auflösung folgen den v2-Spielbildschirmen. Lange Begriffe werden getrennt statt mitten im Wort umgebrochen.
- Beim Start springt die Seite nicht mehr unter Titel und Bild (Fokus ohne Scrollen auf der Einrichtung). Spiellogik, IDs, Verdecken und Fortsetzen bleiben unverändert.

## v71 – Codex-Stände zusammengeführt

- Quick Play (v2), Party-Spielansicht (v2) und die ersten drei Spielbilder liegen jetzt in einem gemeinsamen Stand.
- Offline-Core enthält `v2-play.css`, `v2-party-play.css` und die drei WebP-Spielbilder; Medienvertrag nennt sechs Laufzeitmedien und acht PR-Screenshots.

## v70 – Spielbild für „Ich habe noch nie“

- Eigenständigen Elefantencharakter als lokales WebP in die v2-Spielansicht aufgenommen.
- Herkunft, Medienvertrag und Offline-Core um das Bild erweitert; Handy- und Desktop-Screenshots für PR #19 ergänzt.

## Unreleased – Januar-2027 Release Foundation

Stand: 3. Oktober 2026

### Aktueller Status

- Source-Generation: **v82**
- Built-ins: **55 · 15 Core / 13 Extended / 27 Labs**
- Expansion Wave 1: **10/10 quellsseitig implementiert; real evidence OPEN**
- Core Source Review/Hardening: **15/15 PREPARED**
- Accessibility: **PREPARED**
- Spezialgates DWI bis HS60: **quellsseitig PREPARED, real offen**
- Offline-Core: **`secret-circle-v70` / `secret-circle-v70-staging`**
- `release-evidence.json`: **PREPARED / NO_GO**
- PR #13: **Draft / ungemergt**
- PR-Stack: **muss vor Release mit zwei späteren `main`-Commits reconciled werden**

### v68 – Party-Spielansicht im v2-Design

- `party.html` zeigt die laufenden Hub-Spiele mit v2-Farben, Schriften, Karten und Steuerung; die bisherige Hub-Oberfläche bleibt erhalten.
- `v2-party-play.css` ist lokal und offline verfügbar; Medien- und Sicherheitslogik der Spiele bleibt unverändert.
- Handy- und Desktop-Screenshots der Spielansicht als PR-Dokumentation inventarisiert.

### v67 – Quick Play im v2-Design

- Setup, Spielansicht, Pause, Sitzungssteuerung und Ergebnis nutzen `v2-theme.css` und `v2-play.css`.
- Die bestehende Spiellogik, Element-IDs, Fortsetzung und Offline-Funktionen bleiben erhalten.
- `v2-play.css` ist Teil des Offline-Core; die Cachegeneration wurde nach dem Style-Wechsel erhöht.

### v46–v47 – Accessibility

Hub-A11y sowie Advanced/Quick/Creator-Fokus-/Modal-/Radiogroup-Hardening eingeführt. Reale Screenreader-/Geräteabnahme bleibt offen.

### v48 – Word-Imposter Data/Resume

Voting-Resume, Daten-/Importgrenzen und kein stilles Trunkieren gehärtet.

### v49–v50 – Hub Resume Guard

Zentraler Hub-Resume-Guard v2; Cross-Mode-/Timer-Inkonsistenzen fail-closed; Resume-Aktionen während Guard-Ladung deaktiviert.

### v51 – Complete Backup

Registry-basierte Key-Eigentümerschaft, Future-Key/-Version-Erhalt, Vorvalidierung und managed-only Restore/Rollback.

### v52–v54 – Hub Round / Privacy / Pre-Timer Resume

Sichere Current-Runden bleiben über Reload stabil; Paranoia behält verdeckt Frage/Resultat; Hot-Potato-/Word-Chain-Pre-Timer-Werte bleiben bis zum Timer-Handoff stabil.

### v55 – Advanced Integrity

Advanced Resume Guard v4, Location-/Mafia-Integrität, exact-once-Abschluss und bestätigter Advanced-Session-Ersatz.

### v56 – Quick Session Replacement

Quick Replacement Guard v1 schützt Same-/Cross-Game-Ersatz in Quick/Trending, Mega, Viral und Creator; Cancel erhält Altstand, Write-Fail bleibt fail-closed.

### v57 – Quick Timer Resume

Promptfreier Store `secret-circle-party-quick-timers-v1` für Restzeit-Metadaten; Resume nur bei exakt passender Game-ID, Session-ID, Runde, Phase und Ausgangsdauer; Complete Backup verwaltet 17 exakte aktuelle Storage-Keys.

### v58 – BFCache Timer Resume

`pageshow.persisted` mit passendem Snapshot führt kontrolliert in den normalen QT57-Resume-Pfad; stale Snapshot wird gelöscht, ohne unnötigen Reload.

### v59 – Background Timer Fairness

`document.hidden` pausiert laufende Quick-/Trending-/Mega-/Viral-/Creator-Timer; Hintergrundzeit wird nicht abgezogen; sichtbare Rückkehr verlangt explizites `Fortsetzen`.

### v60 – Hidden Snapshot Durability

- `party-session-controls.js` auf **Version 5** erhöht.
- `visibilitychange(hidden)` persistiert die technische Restzeit sofort in den bestehenden promptfreien Timer-Store.
- Hidden-Persistenz setzt **nicht** `preservePersistedOnNextStop`; ein normaler Same-Page-Stop räumt den Snapshot wieder auf.
- nur der `pagehide`-Pfad setzt Preserve-on-next-stop, damit der unmittelbar folgende Engine-Stop den Snapshot nicht löscht.
- Cold Resume nach mobilem OS-/Browserprozess-Kill ist quellsseitig auch dann vorgesehen, wenn `pagehide` nicht mehr zuverlässig ausgeführt wird.
- der Hidden-Snapshot wird beim Cold Resume genau einmal über QT57 konsumiert.
- HS60 als eigener realer Mobile-/PWA-Abnahmetest definiert.

### v61 – Wave 1 Quiz

- gemeinsame Quiz-Infrastruktur eingeführt
- `party-quiz` und `fact-or-fake` als Labs integriert
- Result-Resume und exact-once Score/History quellsseitig abgesichert

### v62 – Wave 1 Imposter

- gemeinsame Imposter-Infrastruktur ergänzt
- `undercover-similar-word` und `no-word-imposter` als Labs integriert
- private Handoff-/Vote-/Guess-Grenzen und Resume-Verträge ergänzt

### v63 – Wave 1 Writing

- gemeinsame Writing-Infrastruktur ergänzt
- `fill-blank-battle` und `who-wrote-it` als Labs integriert
- private Eingaben, anonyme Phasen und exact-once Completion quellsseitig gehärtet

### v64 – Expansion Wave 1 Complete

Expansion Wave 1 ist quellsseitig mit **10/10 geplanten Labs** komplett:

1. `bluff-trivia`
2. `party-quiz`
3. `fact-or-fake`
4. `percent-guess`
5. `fill-blank-battle`
6. `who-wrote-it`
7. `party-bracket`
8. `undercover-similar-word`
9. `no-word-imposter`
10. `password-one-word`

Gemeinsame Architektur:

- sechs wiederverwendbare Enginefamilien: Quiz, Imposter, Writing, Estimation/Voting, Bluff und Clue
- `quick-loader.js` **v11** routet alle Wave-1-Familien explizit
- `party-release-structure.js` **v5** hält alle zehn Wave-1-Modi in Labs
- aktueller zusammengesetzter Katalog: **55 Built-ins / 15 Core / 13 Extended / 27 Labs**
- Wave-1-Unit-/E2E-/Audit-Verträge sind vorbereitet
- reale Browser-/PWA-/Accessibility-/Gruppenevidence bleibt offen

### v69 – Bildüberlagerungen korrigiert

Empfehlungsbadge und Rangzahl bleiben vor Spielbildern sichtbar.

### v68 – Bildbanner auf dem Handy korrigiert

Das neue Startbanner begrenzt die Bildhöhe; Titel, Beschreibung und Startknopf bleiben bei 375 × 812 sichtbar. Ein Browser-Test prüft Laden und Bild-Titel-Abstand in Chromium und WebKit.

### v67 – Erste Spielbilder im v2-Hub

Word Imposter zeigt das vom Nutzer ausgewählte Chamäleon; Wahrheit oder Pflicht zeigt die Eule beim Antworten und den Waschbären bei einer Aufgabe. Beide Motive sind lokale WebP-Dateien, in Spielkacheln, Startbanner und Spieldetails eingebunden und im Offline-Core enthalten. Vier WebP-Screenshots dokumentieren beide Ansichten auf Handy und Desktop für den PR. Medieninventar, Provenienz, Rechtehinweise und Größenbudgets wurden entsprechend erweitert.

### v66 – Oberfläche im Claude-Design

Das Design aus Claude Design (`v2-hub.html`, `v2-hub.js`, `v2-theme.css`, Schriften in `fonts/`) ist zurück und jetzt die Startseite der App. Es war am 24. September als ungenutzter Prototyp entfernt worden.

- „Spiel starten“ übergibt an die geprüften Engines statt an die vereinfachte eigene Spielmechanik des Prototyps (die entfällt). Hub-Spiele starten über `party.html?play=…&from=v2` und kehren danach zu v2 zurück.
- Spielerliste, Verlauf und gespeicherte Spielstände sind dieselben wie im Rest der App; der Prototyp hatte einen eigenen Speicher.
- Die sechs Farbwelten bündeln die neun aktuellen Katalog-Gruppen. Mit der alten Zuordnung wären fast alle Spiele unter „Täuschung“ gelandet.
- „Top 10 aktuell“ und „Meistgespielt“ ohne Datengrundlage ersetzt: „Meistgespielt“ nur mit echtem Verlauf, sonst „Empfehlung“.
- Die Startseite bietet echte gespeicherte Spielstände zum Fortsetzen an.
- Content-Security-Policy, Manifest, `runtime-guard.js` und vollständige Katalogkette ergänzt; Inline-Styles durch Klassen ersetzt.
- Zurück-Links der Spielseiten, Creator und Datenschutzseite führen zu v2.
- Schriften: Die zwölf Dateien aus dem Design-Export waren teilweise defekt (unter anderem Archivo Black); der Browser zeigte dort eine Ersatzschrift. Ersetzt durch vier Originaldateien von Google Fonts, Figtree als variable Schrift (52 statt 136 KB).

### v65 – Offline-Core-Sperre und Hub-Korrekturen

Seit dem 10. September hatten 16 Commits Offline-Core-Dateien geändert, ohne die Cachegeneration zu erhöhen. Installierte Apps bekamen deshalb frisches HTML zu alten Skripten und Styles. v65 liefert alle diese Korrekturen aus.

- `scripts/offline_core_lock.py` hält eine Prüfsumme über alle CORE-Dateien in `release-meta.json` fest. `npm run validate` schlägt fehl, sobald sich eine Datei ändert, ohne dass die Generation steigt.
- `python3 scripts/offline_core_lock.py --bump` erhöht die Generation und zieht `sw.js`, `release-meta.json`, `operator-release.json`, `privacy.html` und die Statusdokumente nach.
- Hub: Ein neues Spiel ersetzt einen gespeicherten Spielstand nur noch nach Rückfrage; die alte Fortsetzen-Karte verschwindet danach.
- Hub: Die Beschriftung des Startknopfs entsteht nur noch in `party-hub.js`. `party-hub-polish.js` (v18) und `party-hub-plus.js` (v6) überschreiben sie nicht mehr.
- Hub: Spiele werden über ihre ID erkannt statt über den Titel. Ein eigenes Spiel mit dem Namen eines eingebauten wird nicht mehr verwechselt.
- Hub: Beobachter und Fokusfalle bleiben nach `pagehide` verbunden. Nach der Rückkehr aus dem Back-Forward-Cache stimmen Knopftexte, Spielhinweise und Tastaturfokus weiterhin.
- Service Worker: Das Staging lädt den Offline-Core mit `cache: 'reload'`. Vorher konnte ein Update noch frische HTTP-Cache-Einträge der alten Version übernehmen und sie bis zur nächsten Generation offline ausliefern.
- Party Night aktualisiert sich nach „Spiel beenden“ wieder; der Klick-Hook zeigte auf den entfernten Knopf `#exit-game`.
- Hub: Die Fortsetzen-Karte bleibt gesperrt, bis der Resume-Schutz den gespeicherten Stand geprüft hat. Vorher ließ sich ein inkonsistenter Timer-Stand fortsetzen, solange die Skripte noch luden.
- Hub: Die Einführungskarte schließt auch, wenn der Speicher voll oder gesperrt ist.
- Party Night plant ohne gespeicherte Gruppe mit derselben Beispielgruppe wie Hub und Spiel-Engines. Vorher zeigte der Planer bei neuen Nutzern „0 Personen“ und verweigerte den Plan.
- `tests/cross-browser/smoke.spec.js` lief nie und prüfte noch den Stand mit 45 Spielen; er ist auf 55 Spiele und die aktuellen Texte nachgezogen.
- Katalog: Die beworbenen Kategorien von `wavelength`, `draw-guess`, `sound-imitation` und `forehead-guess` entsprechen jetzt dem Inhalt. Die Suche fand vorher „Filme“ oder „Fahrzeuge“, die es nicht gibt, aber nicht die sechs zusätzlichen Stirn-Raten-Kategorien.
- Offline-Core: zwölf Schriftdateien (136 KB) entfernt, die seit dem Entfernen des v2-Prototyps kein Stylesheet mehr nutzte.
- `tests/extended-labs-content-quality.test.js` prüft alle 55 Spiele und läuft jetzt in `npm test`; `scripts/extended_labs_content_audit.py` läuft in `npm run validate`.
- Statusdokumente und `release-evidence.json` beschreiben den CI-Stand wieder richtig: Der Runner-Ausfall ist seit dem 5. September 2026 behoben, der Cross-Browser-Workflow wurde noch nie gestartet.

### Release-Metadaten / Drift-Schutz

- neue zentrale `release-meta.json` für Source-Generation, Package-Version, Cachegeneration, Built-in-Zahlen, Wave-1-Status, Releasezustand, CI-Befund und PR-Stack
- `tests/party-release-structure.test.js` bindet `release-meta.json` an den real zusammengesetzten Runtime-Katalog
- `tests/service-worker.test.js` bindet Production-/Staging-Cache an `release-meta.json`
- dadurch sollen zukünftige Abweichungen wie v61-Doku bei v64-Runtime als Testfehler sichtbar werden

### PWA / Offline – v64

- Offline-Core auf **`secret-circle-v70` / `secret-circle-v70-staging`** erhöht.
- SessionControls v5, QT57, BF58, BG59, HS60, Quick Replacement Guard und Quick Loader v11 werden offline ausgeliefert.
- alle sechs Wave-1-Katalog-/Runnerfamilien sind im Service-Worker-Core enthalten.
- alle früheren Advanced-/A11y-/Resume-/Privacy-/Backup-Verträge bleiben enthalten.

### Build / CI

- `package-lock.json` v3; Playwright exakt 1.54.2; keine npm-Runtime-Dependencies.
- CI/Cross-Browser verwenden `npm ci`.
- Syntax-, Unit-, Contract-, Audit- und Playwright-Gates sind vorbereitet.
- frischer v64-Actions-Nachweis: **Run #3608**, Run ID `33253663445`, Job `99103557030`, Head `2297868e1f65b45753294151a3b1f401a55f6288`, `steps: []`, `runner_id: 0`, leerer Runner-Name.
- kein Repositorycode wurde in diesem Job ausgeführt.
- **v50–v64 haben keinen Hosted-Runner-PASS.**

### PR-/Branch-Stack

Aktuelle Kette:

`main` → PR #3 → PR #11 → PR #13.

PR #11 liegt vollständig auf #3 und PR #13 vollständig auf #11. Die erste Stack-Basis ist gegenüber aktuellem `main` jedoch diverged und enthält zwei spätere Main-Commits nicht in ihrer Abstammung:

- `6b6bddd0ae619d160b4468b61ae49cb30e2ea834`
- `d347c7138bae18325c288632222917ad618e6547`

Vor einer Release-Mergefolge muss diese Basis kontrolliert reconciled werden; danach sind wegen des neuen Kandidaten neue Release-Tests/Evidence erforderlich.

### Operator / Assets

- `operator-release.json` bleibt `PREPARED / BLOCKED`.
- reale Hosting-/Legal-/Support-/Incident-Evidence bleibt offen.
- Root-`icon.svg` bleibt bis echter Rechtebestätigung oder Ersatz `unresolved`.

### Releaseentscheidung

Zentrale offene Issues: **#7 CI**, **#8 Geräte/Beta/A11y + Spezialgates + Wave 1**, **#14 Operator/Hosting/Legal/Support**.

Zusätzlicher struktureller Blocker: **PR-Stack mit aktuellem `main` reconciliieren**.

Öffentlicher Release: **NO_GO**.
