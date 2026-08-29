# Secret Circle – Spielmodi- und Themen-Anleitung

Stand: 29. August 2026  
Status: **verbindliche Produkt-/Content-Roadmap, kein Scope-Zwang für Januar 2027**

Diese Anleitung ergänzt `APP_ENTWICKLUNG_VON_A_BIS_Z.md`. Die maschinenlesbare Planung liegt zusätzlich in `GAME_LIBRARY_BACKLOG.json`.

## 1. Produktziel

Secret Circle soll langfristig gleichzeitig:

1. **extrem einfach zu bedienen** sein – Standardspiele in höchstens 2–3 Entscheidungen bis zur ersten echten Aktion;
2. **extrem viele Spielmöglichkeiten** bieten – über gemeinsame Enginefamilien + viele Themenpacks statt 100 fragile Einzelengines.

Aktueller technischer Katalog: **47 Built-ins · 15 Core / 13 Extended / 19 Labs**.

### Harte Content-Grenze

Secret Circle bekommt **keinen 18+-Bereich**.

Nicht als Built-in-Content:

- sexuelle oder explizite Inhalte
- pornografische Inhalte
- Trinkzwang/Alkohol als Kernmechanik
- gefährliche Challenges
- Erniedrigung oder Zwang
- Aufgaben, die Passwörter, Adressen, Telefonnummern, intime Fotos oder vergleichbar private Daten verlangen

Party, Dating-light, Freundschaft, Cringe, Memes, Film/Serie, Anime, Gaming, Sport und Chaos dürfen trotzdem direkt und lustig sein, solange sie jugend-/familienfreundlich bleiben.

---

## 2. Konkurrenz-Lektion 2026

### Heads Up!-Prinzip

Eine sehr einfache Mechanik kann durch viele Decks/Themen wie sehr viele Spiele wirken.

**Secret-Circle-Lektion:** Content-Layer wiederverwenden, nicht für Film, Anime, Sport usw. jeweils neue Engines bauen.

### Undercover-/Spy-Prinzip

Eine Social-Deduction-Engine kann viele Rollenvarianten, Wortpaare und Themen tragen.

**Secret-Circle-Lektion:** Imposter wird eine eigene große Spielfamilie.

### Jackbox-Prinzip

Besonders relevante Mechanikfamilien:

- Trivia / Quiz
- Bluff / Deception
- Drawing
- Writing / Fill-in-the-Blank
- Voting / Polls
- Social Deduction
- Speaking / Präsentation
- Musik / Rhythmus
- Teamwork / Co-op
- Roleplay

**Secret-Circle-Lücke:** vor allem Bluff-Antworten, große Quizbibliothek, Schreiben/Voting, Umfragen, Speaking und echte Kooperation.

### One-Phone-Party-Hubs

Offline + ein Gerät + viele Klassiker sind inzwischen Baseline.

**Secret-Circle-Differenzierung:** extrem einfache Bedienung, große Mechanikbreite, starke Imposter-Welt, Resume/Privacy, lokale Datenkontrolle, Creator und klare Core/Extended/Labs-Reife.

---

## 3. Was bereits vorhanden ist

Secret Circle deckt bereits stark ab:

- Word Imposter
- Question Imposter
- Location Spy
- Mafia
- Zwei Wahrheiten, eine Lüge
- Wahrheit oder Pflicht
- Ich habe noch nie / Finger runter
- Wer würde eher?
- Entweder oder
- Hot Takes / Hear Me Out
- Paranoia
- Scharade
- Stirn-Raten / Wer bin ich?
- Tabu / Nicht sagen
- Zeichnen & Raten
- Geräusche erraten
- Melodie summen
- Hot Potato
- Wortkette
- Rapid Fire
- Buchstaben-Kategorien
- Gegenstandsjagd
- Nicht lachen
- Caption Battle
- Blind Ranking
- Tier List
- Emoji Quiz
- Preis schätzen
- Höher oder tiefer
- Red/Green Flag
- Secret Mission
- Know Me Best
- Hot Seat
- Story Chain
- Satz beenden
- Spektrum-Tipp
- Creator / eigene lokale Spiele

Neue Modi sollen deshalb **keine bloßen Namensduplikate** dieser Mechaniken sein.

---

# 4. Expansion Wave 1 – verbindliche Reihenfolge

`GAME_LIBRARY_BACKLOG.json` ist die maschinenlesbare Quelle. Wave 1 bleibt **Labs**, bis die jeweiligen Qualitätsgates bestanden sind.

| # | Modus | Enginefamilie | Status |
|---|---|---|---|
| 1 | Bluff Trivia | Bluff | BACKLOG |
| 2 | **Party Quiz** | Quiz | **IMPLEMENTED LAB – v61** |
| 3 | **Fake oder Fakt** | Quiz | **IMPLEMENTED LAB – v61** |
| 4 | Prozent schätzen | Schätzen/Voting | BACKLOG |
| 5 | Satzduell / Fill-in-the-Blank | Anonymes Schreiben | BACKLOG |
| 6 | Wer hat das geschrieben? | Anonymes Schreiben | BACKLOG |
| 7 | Party Bracket | Voting | BACKLOG |
| 8 | Undercover – ähnliches Wort | Imposter | BACKLOG |
| 9 | Imposter ohne Wort | Imposter | BACKLOG |
| 10 | Ein-Wort-Hinweis | Raten/Clue | BACKLOG |

## Wave-1-Umsetzungsstand v61

### Party Quiz – implementiert als Labs

- gemeinsame Engine: `party-wave-one-modes.js`
- Katalog: `party-wave-one-catalog.js` v2
- Packs: Allgemeinwissen, Film & Serie, Technik
- aktuell 24 Built-in-Karten
- Multiple Choice mit vier Antworten
- kurze Auflösung/Erklärung
- lokaler Score
- Resume am bereits aufgelösten Ergebnis ohne erneute Punktevergabe
- Quick-Family Session-Replacement-Schutz
- offline in `secret-circle-v61`

### Fake oder Fakt – implementiert als Labs

- dieselbe gemeinsame Wave-1-Engine
- Packs: Natur, Film & Serie, Technik
- aktuell 24 Built-in-Karten
- Fakt/Fake-Entscheidung
- kurze Erklärung
- lokaler Score
- Resume-/Replacement-Infrastruktur gemeinsam mit Party Quiz
- offline in `secret-circle-v61`

### Wave-1-Qualitätsvertrag

Automatisch vorbereitet:

- `tests/party-wave-one-catalog.test.js`
- `tests/e2e/wave-one-quiz.spec.js`
- `scripts/wave_one_quiz_audit.py`
- `quick-loader.js` v8 routet Wave-1 vor dem normalen Quick-Fallback
- `party-release-structure.js` hält beide Spiele ausdrücklich in Labs

**Noch kein Release-PASS:** reale Browser-/PWA-/Accessibility-/Gruppenevidence bleibt nötig.

---

# 5. Fehlende Mechanikfamilien nach Wave 1

## Höchste Priorität

### Bluff Trivia

- echte Triviafrage
- Spieler erfinden glaubwürdige Fake-Antworten
- Antworten anonym mischen
- Punkte für richtige Antwort und erfolgreiche Täuschung

Themen: Allgemeinwissen, Film & Serie, Gaming, Geschichte, Wissenschaft, Sport.

### Prozent schätzen / Poll Guess

- Prozent-/Verteilungsfrage
- Schätzung abgeben
- Punkte nach Nähe
- später optional gruppeninterne anonyme Abstimmung

### Satzduell / Fill-in-the-Blank

- jugendfreundlicher Prompt
- kurze Antworten
- anonym mischen
- Gruppe stimmt ab

### Wer hat das geschrieben?

- alle beantworten dieselbe harmlose Frage
- Antworten anonym mischen
- Zuordnung zu Personen erraten

### Party Bracket

- 8 oder 16 Einträge
- K.-o.-Abstimmungen
- Sieger kommt weiter

### Ein-Wort-Hinweis

- geheimes Zielwort
- exakt ein Hinweiswort
- Team rät mit begrenzten Versuchen

## Danach

- Survey Battle / häufigste Antworten
- Präsentations-Chaos / Impro-Speech
- kooperative Kommunikations-Challenge
- Code-Verbindung / Wörter verbinden
- 20 Fragen
- Geheime Regel / Pattern Detective
- Timeline Battle
- Puzzle-/Rätsel-Duell
- Mini Escape / Cooperative Mystery
- Drawing Telephone
- Text-/Flüsterpost
- Reverse Charades
- Sound Battle
- Rhythmus-/Beat-Challenge
- Memory Chain
- Auction/Bidding Guess
- Hidden Character Roleplay
- Detective Case
- Produkt-Pitch + Voting
- One-Word-Story
- Kategorien-Duell
- Alphabet-Challenge
- Definitions-Bluff
- Closest Wins
- Beobachtungs-/Memory-Challenges
- Lip-Reading ohne Aufnahme
- Pantomime-Staffel
- Team-Puzzle mit asymmetrischer Information

---

# 6. Imposter als eigene große Spielfamilie

Bereits vorhanden:

- Word Imposter
- Question Imposter
- Location Spy

Fehlende Varianten:

1. **Undercover – ähnliches Wort:** Mehrheit Wort A, Undercover ähnliches Wort B.
2. **Imposter ohne Wort:** Imposter erhält kein Wort und bekommt bei Enttarnung einen letzten Guess.
3. **Kategorie-bekannter Imposter:** nur Kategorie statt konkretem Wort.
4. **Character Imposter:** ähnliche/abweichende Rollen-Archetypen.
5. **Movie/Series Imposter:** Filmgenres, Seriengenres, Plot-/Figuren-Archetypen, Settings.
6. **Anime Imposter:** Archetypen, Kräfte, Settings, Genres.
7. **Gaming Imposter:** Genres, Rollen, Items, Settings, Mechaniken.
8. **Sport Imposter:** Sportarten, Positionen, Ausrüstung, Spielsituationen.
9. **Emoji Imposter:** ähnliche/unvollständige Emoji-Kombinationen.
10. **Fact Imposter:** eine Person erhält einen abweichenden Fakt/Hinweis.
11. Doppelagent / mehrere Undercover-Typen.
12. Jester/Decoy – Ziel ist, gewählt zu werden.
13. Judge/Tie-Breaker als optionale Sonderrolle.
14. Team Imposter.
15. Speed Imposter mit extrem kurzen Hinweisrunden.

### Regel

Standard-Imposter bleibt sehr einfach. Sonderrollen liegen in Advanced/Labs und werden nicht im Default-Setup aufgezwungen.

---

# 7. Themen- und Genre-Bibliothek

Themen sind **Content-Layer**, keine automatische neue Engine.

## Entertainment

- Film & Serie
- Filmgenres
- Seriengenres
- Kino
- Streaming-Kultur
- Plot-Archetypen
- Figuren-Archetypen
- Fantasy
- Science-Fiction
- Mystery
- Horror-light ohne Gore
- Superhelden-Archetypen
- Märchen / Mythen

## Anime / Manga

- Anime-Archetypen
- Genres
- Kräfte
- Rollen
- Settings
- Sport-Anime
- Fantasy-Anime
- School-Life
- Mystery

## Gaming / Internet

- Gaming-Genres
- Retro Gaming
- E-Sport
- Streaming
- Creator-Typen
- Internetkultur
- Memes
- Apps / Social Media
- Technik
- KI
- Coding

## Sport

- Fußball
- Basketball
- Tennis
- Motorsport
- Leichtathletik
- Schwimmen
- Kampfsport als Wissens-/Rateinhalt
- Wintersport
- Olympia
- Sportregeln
- Positionen
- Ausrüstung

## Musik

- Genres
- Instrumente
- Musikbegriffe
- Konzert/Festival
- Jahrzehnte
- Künstler-Archetypen
- Song-Situationen ohne geschützte Lyrics
- Rhythmus

## Wissen

- Allgemeinwissen
- Deutschland
- Europa
- Welt
- Länder / Städte / Geografie / Flaggen
- Geschichte
- Wissenschaft
- Weltraum
- Natur / Tiere
- Technik / Erfindungen
- Schule / Berufe

## Alltag / Lifestyle

- Essen / Snacks
- Reisen / Verkehr
- Zuhause
- Schule / Ausbildung / Arbeit
- Freundschaft / Familie
- Hobbys
- Mode allgemein
- Zukunft
- hypothetische Geldfragen

## Vibes

- Familie
- Kinderfreundlich
- Teen
- Freunde
- Icebreaker
- beste Freunde
- Team/Kollegen
- Roadtrip
- kurze Pause
- großer Spieleabend
- ruhig
- clever
- chaotisch
- kreativ
- kompetitiv

---

# 8. Content-Multiplikator

Beispiel **Film & Serie**:

Ein einziges Themenuniversum kann genutzt werden für:

- Imposter
- Party Quiz
- Fake oder Fakt
- Bluff Trivia
- Stirn-Raten
- Wer bin ich?
- Tabu
- Scharade
- Emoji Quiz
- Zeichnen & Raten
- Blind Ranking
- Tier List
- Buchstaben-Kategorien
- Spektrum-Tipp
- Party Bracket

Dasselbe Prinzip gilt für Anime, Gaming, Sport, Musik, Länder usw.

> **Ziel: 20–30 belastbare Mechanikfamilien × viele Themenpacks = 100+ sichtbare Spielvarianten, ohne 100 fragile Engines.**

---

# 9. Bedienungsregel – riesiger Katalog, einfache Oberfläche

Ein neuer Nutzer darf nicht mit 100 gleichwertigen Kacheln überfordert werden.

## Startseite

- Schnell spielen
- Spiel auswählen
- Imposter
- Für deine Gruppe
- Eigene Spiele

## Collections/Filter

- Imposter & Täuschung
- Quiz & Wissen
- Raten & Erklären
- Schreiben & Kreativ
- Zeichnen
- Team & Co-op
- Schnell & Timer
- Abstimmen & Diskussion
- Film & Serie
- Anime & Gaming
- Sport
- Musik
- Familie
- Alle Spiele

## Standardflow

1. Spiel/Empfehlung wählen
2. Pack/Gruppe bestätigen
3. Start

**Maximal 2–3 Entscheidungen bis zur ersten echten Spielaktion.** Regeln möglichst im Spielflow erklären statt in einer langen Pflicht-Regelwand.

---

# 10. Engine-Strategie

Implementierungsreihenfolge gemeinsamer Engines:

1. Shared Quiz Engine – gestartet mit Party Quiz + Fake oder Fakt
2. Shared Imposter Engine – Undercover/No-Word auf bestehendem Imposterwissen aufbauen
3. Shared Anonymous Writing Engine
4. Shared Voting Engine
5. Shared Clue Engine
6. Shared Bluff Engine
7. Shared Estimation Engine

Neue sichtbare Varianten sollen zuerst prüfen, ob sie als Content/Regelsatz auf einer vorhandenen Engine möglich sind.

---

# 11. Acceptance Criteria je Modus

Ein Modus zählt erst als wirklich vorhanden, wenn:

- Erklärung in ca. 30 Sekunden verständlich
- erste echte Aktion nach höchstens 2–3 Setup-Entscheidungen
- Skip/Abbruch vorhanden, wo sinnvoll
- Content-Policy erfüllt
- ausreichende Contentmenge gegen schnelle Wiederholung
- Reload/Resume fachlich definiert
- Timer fachlich definiert, falls vorhanden
- Score/Winner exact-once definiert
- Tastatur/Fokus/Touch/Zoom berücksichtigt
- Offlineverhalten definiert
- Unit/Contract/E2E vorhanden
- mindestens ein echter Gruppentest erfolgt
- Marken-/Franchise-/Assetrechte geprüft

**Code vorhanden = Source PREPARED, nicht automatisch Release PASS.**

---

# 12. Franchise-/Film-/Serienregel

Breite Themen sind erwünscht; unnötiges Rechte-Risiko nicht.

Built-in bevorzugt:

- Genres
- Archetypen
- allgemeine Settings
- allgemeine Plottypen
- historische/public-domain Inhalte
- eigene Formulierungen
- generische Begriffe

Konkrete moderne Franchises, Logos, Charakterbilder, geschützte Artwork-/Audio-/Videoassets oder längere Zitate benötigen vor Veröffentlichung einen eigenen Rechteentscheid.

Der lokale Creator kann private Nutzerpacks ermöglichen; diese werden nicht automatisch zu kuratiertem Built-in-Content.

---

# 13. Konkurrenzregel für weitere Research-Runden

Mindestens halbjährlich bzw. vor größeren Waves prüfen:

- direkte One-Phone-Party-Hubs
- Heads Up!-artige Deckprodukte
- Undercover-/Spy-Produkte
- Jackbox-/Party-Pack-Mechaniken
- kooperative Partyspiele
- neue schnell wachsende Social-/Partyformate

Erfasst werden:

- Mechanikfamilie
- Setup-Reibung
- Spielerzahl
- Rundendauer
- Packtiefe
- Custom Content
- Resume
- Offline
- Alters-/Family-Optionen
- Monetarisierung
- Bewertungen/Kritik

Leitfrage:

> **Welche Nutzeraufgabe oder Mechanikfamilie fehlt Secret Circle wirklich?**

Nicht:

> „Welche konkrete Konkurrenz-Karte können wir kopieren?“

---

# 14. Zielbild

> **Secret Circle soll der einfachste große Partyspiel-Hub für Freunde und Familie werden: in Sekunden startklar, riesige Auswahl an Mechaniken und Themen, starke Imposter-Welt, ohne 18+-Bereich, mit lokalen eigenen Packs und ohne dass die Oberfläche trotz der Menge kompliziert wird.**
