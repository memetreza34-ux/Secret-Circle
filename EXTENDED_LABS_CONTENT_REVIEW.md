# Secret Circle – Extended-/Labs-Content-Review

Stand: 29. August 2026  
Status: **AUTOMATED CONTRACT PREPARED / MANUAL SIGN-OFF OPEN**

## 1. Umfang

Dieses Dokument ergänzt `CORE_CONTENT_REVIEW.md` für die **40 Nicht-Core-Spiele** im aktuellen v64-Katalog:

- **13 Extended**
- **27 Labs**
- darin **Wave 1 = 10/10** neue Labs

Es trennt drei Ebenen:

1. automatisierbarer Struktur-/Sicherheitsvertrag
2. manuelle redaktionelle/semantische Prüfung
3. reale Gruppentauglichkeit

Ein vorhandener Test oder Audit ist weder juristische Freigabe noch reale Nutzer-Evidence.

## 2. Automatischer v64-Vertrag

`tests/extended-labs-content-quality.test.js` lädt jetzt den **vollständigen finalen Wave-1-Katalog** über `party-wave-one-clue-catalog.js` und prüft explizit:

- 55 Built-ins insgesamt
- 15 Core / 13 Extended / 27 Labs
- 40 Nicht-Core-Spiele
- alle 10 `waveOneGameIds` vorhanden
- alle 10 Wave-1-Modi bleiben Labs
- alle IDs eindeutig
- Titel, Beschreibung und 3–5 Regeln vorhanden
- Alter, Spielergrenzen und Dauer strukturell plausibel
- Release-Spiele technisch `playable`
- Link-Modi führen ausschließlich auf lokale App-Seiten
- beworbene Packs existieren im final zusammengesetzten Katalog
- mindestens sechs Items je Content-Pack
- exakte normalisierte Duplikate innerhalb eines Packs werden abgelehnt
- HTML-/Script-/Inline-Handler-Muster werden abgelehnt
- konkrete Aufforderungen zur Offenlegung privater Nachrichten, Kamerarolle, Chats, Passwort, Adresse oder Fotos werden abgelehnt
- `spin-bottle` und `dice-coin` bleiben die zwei expliziten contentlosen Utility-Modi
- insgesamt 38 content-getriebene Nicht-Core-Spiele werden durchlaufen

`scripts/extended_labs_content_audit.py` verlangt denselben v64-Vertrag und führt den Node-Test als eigenständiges Gate aus.

**Wichtig:** Wegen des externen Hosted-Runner-Problems ist dieser aktualisierte Vertrag noch nicht als real ausgeführter PASS dokumentiert.

## 3. Extended – 13 Spiele

| Spiel-ID | Manueller Schwerpunkt | Status |
|---|---|---|
| `hot-takes` | unnötige Eskalation, sensible Thesen, Altersfit | PREPARED |
| `spin-bottle` | keine implizite Pflicht zu intimen Aufgaben | PREPARED |
| `dice-coin` | Erwartung/Verständlichkeit | PREPARED |
| `wavelength` | verständliche Pole, keine irreführende Markenwirkung | PREPARED |
| `draw-guess` | Darstellbarkeit, Schwierigkeitsmix | PREPARED |
| `rapid-fire` | realistische Schwierigkeit, klare Aufgaben | PREPARED |
| `sound-imitation` | sichere/problemfreie Nachahmungen | PREPARED |
| `forehead-guess` | faire Erklärbarkeit, sinnvoller Packmix | PREPARED |
| `letter-categories` | Antwortbreite, keine redundanten Sets | PREPARED |
| `dont-laugh` | körperlich/sozial ungefährlich, nicht demütigend | PREPARED |
| `hum-song` | keine konkreten geschützten Liedvorgaben | PREPARED |
| `scavenger-hunt` | sichere Umgebung, keine privaten/gefährlichen Gegenstände | PREPARED |
| `caption-battle` | keine beleidigenden/privaten Bildkontexte | PREPARED |

## 4. Bestehende Labs – 17 Spiele

| Spiel-ID | Manueller Schwerpunkt | Status |
|---|---|---|
| `who-am-i` | historische/Fan-/Namenswirkung | PREPARED |
| `anime-guess` | generische Archetypen; keine Nähe zu konkreten Figuren | PREPARED |
| `money-challenge` | kein realer Zahlungsdruck, Altersfit | PREPARED |
| `blind-ranking` | Kategorienmix, problematische Wertungen vermeiden | PREPARED |
| `emoji-quiz` | Eindeutigkeit, keine unnötigen Franchise-Antworten | PREPARED |
| `pass-the-phone` | kein Bloßstellen/sozialer Zwang | PREPARED |
| `red-green-flag` | sensible Beziehungsthemen, keine Diagnosebehauptungen | PREPARED |
| `secret-mission` | sicher, freiwillig, nicht manipulativ | PREPARED |
| `tier-list` | Konfliktpotenzial, verständliche Themen | PREPARED |
| `put-a-finger-down` | nicht zu intim, Skip/Freiwilligkeit | PREPARED |
| `guess-the-price` | feste Spielwerte, keine Aktualitätsbehauptung | PREPARED |
| `higher-lower` | Faktenstabilität und Einheiten | PREPARED |
| `know-me-best` | freiwillig, nicht verletzend | PREPARED |
| `hear-me-out` | keine gefährlichen/extremen Thesen | PREPARED |
| `hot-seat` | Tempo darf Skip nicht erschweren | PREPARED |
| `story-chain` | Tonalität, Altersfit, Vielfalt | PREPARED |
| `finish-the-sentence` | keine erzwungene intime Offenlegung | PREPARED |

## 5. Wave 1 – 10 zusätzliche Labs

| Spiel-ID | Inhalt / manueller Schwerpunkt | Status |
|---|---|---|
| `bluff-trivia` | Trivia + private Fake-Antworten; keine heiklen Fakten/Offenlegung | PREPARED |
| `party-quiz` | Quizfragen; Faktenstabilität, klare Antworten | PREPARED |
| `fact-or-fake` | Fakten/Fakes; keine irreführenden aktuellen Behauptungen | PREPARED |
| `percent-guess` | Schätzwerte; verständliche Zielwerte und Einheiten | PREPARED |
| `fill-blank-battle` | Texteingaben; keine erzwungene intime/beleidigende Richtung | PREPARED |
| `who-wrote-it` | anonyme Texte; Autorenschutz und freiwillige Eingaben | PREPARED |
| `party-bracket` | Auswahl-/Rankingthemen; keine entwürdigenden Personenkategorien | PREPARED |
| `undercover-similar-word` | ähnliche Wörter; faire Paarungen, private Rollen | PREPARED |
| `no-word-imposter` | Imposter ohne Zielwort; faire Hinweise, private Rollen | PREPARED |
| `password-one-word` | Zielwort + Ein-Wort-Hinweis; generische Begriffe, private Reveals | PREPARED |

Alle zehn bleiben Labs, bis eigene reale Browser-/PWA-/Accessibility-/Gruppenevidence vorliegt.

## 6. Manuelle Semantikprüfung

Vor `EXTENDED / LABS CONTENT PASS` muss jedes der 40 Nicht-Core-Spiele im finalen Working-Branch-Katalog gelesen werden.

Je Spiel prüfen:

- Titel, Description und Regeln passen zur Mechanik
- Packnamen sind verständlich
- keine schwachen Füllkarten oder semantischen Fast-Duplikate
- keine unbeabsichtigte private Offenlegung
- keine Demütigung, gefährliche körperliche Aufgabe oder sozialer Zwang
- Altersstufe passt zum tatsächlichen Inhalt
- generische Referenzen bleiben generisch
- keine unnötige aktuelle Faktbehauptung, die zum Release veraltet sein kann
- strukturierte Karten besitzen sinnvolle Werte/Optionen
- Skip/Freiwilligkeit ist bei persönlichen Modi verständlich
- Wave-1-Private-Inputs/Reveals sind redaktionell mit der Privacy-UX vereinbar

## 7. Reale Gruppenabnahme

Automatischer und manueller Quellpass reichen nicht für Release-GO.

Mindestens beobachten:

- 3–4 Personen
- 5–8 Personen
- 9–12 Personen
- Erstnutzer ohne Entwicklererklärung
- mehrere Alters-/Stimmungsfilter
- kompletter Abend mit Core/Extended/Labs-Mix

Erfassen:

- unklare/zu ähnliche Karte
- langweilige/redundante Karte
- unangenehme Karte
- zu leichte/zu schwere Aufgabe
- zu lange Übergabe
- Regelmissverständnis
- Skip-Situation
- Content, den reale Nutzer freiwillig vermeiden

## 8. Release-Gate

Vor `EXTENDED / LABS CONTENT PASS`:

- [x] 13 Extended und 27 Labs explizit inventarisiert
- [x] 40 Nicht-Core-Spiele im v64-Vertrag
- [x] Wave 1 10/10 in denselben Non-Core-Vertrag aufgenommen
- [x] alle Wave-1-IDs bleiben Labs
- [x] contentlose Utility-Modi explizit getrennt
- [x] Privacy-Offenlegungs-Prompt-Gate
- [x] Markup-/Injection-Muster-Gate
- [x] Duplikat-Gate
- [x] internes Routing-Gate
- [x] `extended-labs-content-quality.test.js` auf finalen v64-Katalog umgestellt
- [x] `extended_labs_content_audit.py` auf 55 / 13 / 27 / Wave 1 10/10 umgestellt
- [ ] Node-Vertrag auf funktionierendem Runner tatsächlich grün
- [ ] Python-Audit auf demselben Stand tatsächlich grün
- [ ] alle 13 Extended manuell semantisch final gelesen
- [ ] alle 27 Labs manuell semantisch final gelesen
- [ ] Alters-/Safety-Sign-off abgeschlossen
- [ ] Reference-/Media-/Asset-Gates final abgenommen
- [ ] reale Gruppenabnahme abgeschlossen
- [ ] keine offenen Critical/High Contentfehler

Bis dahin bleibt der Extended-/Labs-Content **IN PROGRESS** und der öffentliche Release **NO_GO**.
