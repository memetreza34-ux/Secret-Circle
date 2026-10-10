# Secret Circle – Extended-/Labs-Content-Review

Stand: 28. September 2026  
Status: **AUTOMATED CONTRACT PREPARED / MANUAL SIGN-OFF OPEN**

## 1. Zweck

Dieses Dokument ergänzt `CORE_CONTENT_REVIEW.md` für die **40 Nicht-Core-Spiele**: **13 Extended** und **27 Labs** (davon 10 aus Expansion Wave 1).

Es trennt drei Ebenen:

1. **Struktur-/Codevertrag** – automatisierbar
2. **redaktionelle Semantik** – manuell
3. **reale Gruppentauglichkeit** – echte Tests

Ein vorhandener Test oder Audit bedeutet nicht automatisch, dass der Inhalt redaktionell oder rechtlich freigegeben ist.

## 2. Automatischer Vertrag

`tests/extended-labs-content-quality.test.js` prüft für alle Nicht-Core-Spiele:

- Release-Tiers bleiben 15 Core / 13 Extended / 27 Labs
- alle 55 IDs bleiben eindeutig
- Titel, Beschreibung und Regeln sind vorhanden
- Alter, Spielergrenzen und Dauer sind plausibel strukturiert
- Release-Games stehen technisch auf `playable`
- Link-Modi führen nur auf lokale App-Seiten
- beworbene Packs und tatsächliche Content-Packs stimmen exakt überein (Namen und Reihenfolge)
- Karten-/Set-Mindestmengen sind schema-aware
- exakte normalisierte Duplikate innerhalb eines Packs werden abgelehnt
- HTML-/Script-/Inline-Handler-Muster werden abgelehnt
- konkrete Aufforderungen zur Offenlegung letzter privater Nachrichten, Kamerarolle, Chats, Passwörter, Adresse oder Fotos werden abgelehnt
- `spin-bottle` und `dice-coin` werden korrekt als contentlose Utility-Modi behandelt

Standard-Mindestmenge: **6 Items je Content-Pack**.  
Schema-Ausnahme: `letter-categories` benötigt mindestens **3 Sets je Pack**, weil jedes Set gleichzeitig fünf Kategorien enthält.

`scripts/extended_labs_content_audit.py` führt den Node-Vertrag eigenständig aus und validiert dessen JSON-Ergebnis.

Beide laufen seit dem 28. September 2026 in `npm test` bzw. `npm run validate` mit. Vorher prüfte der Test nur 45 Spiele und war in keinem Gate eingebunden; beim Einbinden fielen vier Spiele auf, deren beworbene Kategorien nicht zum Inhalt passten (`wavelength`, `draw-guess`, `sound-imitation`, `forehead-guess`). Die Metadaten sind korrigiert.

## 3. Extended – 13 Spiele

| Spiel-ID | Inhaltstyp | Automatischer Fokus | Manueller Fokus | Status |
|---|---|---|---|---|
| `hot-takes` | Diskussionsaussagen | Packs, Textsicherheit, Duplikate | unnötige Eskalation, politische/soziale Sensibilität, Altersfit | PREPARED |
| `spin-bottle` | Zufallsauswahl/Utility | Metadaten, Routing | klare Erwartung, keine implizite Pflicht zu intimen Aufgaben | PREPARED |
| `dice-coin` | Würfel/Münze/Utility | Metadaten, Routing | Verständlichkeit | PREPARED |
| `wavelength` | Spektrum-Paare | strukturierte Paare, Reference-Safe-Titel | Pole verständlich, keine irreführende Markenwirkung | PREPARED |
| `draw-guess` | Zeichenbegriffe | Packtiefe, Duplikate | Darstellbarkeit, Schwierigkeitsmix | PREPARED |
| `rapid-fire` | Zeit-/Anzahl-Challenges | Struktur, Zeiten/Ziele | realistische Schwierigkeit, klare Formulierungen | PREPARED |
| `sound-imitation` | Geräuschbegriffe | Packtiefe, Duplikate | ohne problematische Nachahmungen spielbar | PREPARED |
| `forehead-guess` | Erratbegriffe | beworbene + zusätzliche Packs | faire Erklärbarkeit, Zusatzpacks sinnvoll | PREPARED |
| `letter-categories` | Kategorien-Sets | mindestens 3 Sets/Pack | Abwechslung, Antwortbreite, keine redundanten Sets | PREPARED |
| `dont-laugh` | sichere Mini-Performance | Packtiefe, Textsicherheit | körperlich/sozial ungefährlich, nicht demütigend | PREPARED |
| `hum-song` | Summ-/Stilhinweise | generische Hinweise, Packtiefe | keine konkreten urheberrechtlich problematischen Liedvorgaben | PREPARED |
| `scavenger-hunt` | Gegenstandssuche | Textsicherheit | sichere Umgebung, keine privaten/gefährlichen Gegenstände | PREPARED |
| `caption-battle` | kreative Situationen | Packtiefe, Duplikate | keine beleidigenden/privaten Bildkontexte | PREPARED |

## 4. Labs – 27 Spiele

| Spiel-ID | Inhaltstyp | Automatischer Fokus | Manueller Fokus | Status |
|---|---|---|---|---|
| `who-am-i` | Identitäten/Archetypen | Packtiefe, Source-Reference-Gates | historische/Fan-/Namenswirkung | PREPARED |
| `anime-guess` | generische Anime-Archetypen | 40 reference-safe Archetypen | keine visuelle/semantische Nähe zu konkreten Figuren | PREPARED |
| `money-challenge` | hypothetische Geldfragen | Struktur/Text | kein realer Zahlungsdruck, altersgerecht | PREPARED |
| `blind-ranking` | Rankingbegriffe | Packtiefe/Duplikate | Kategorienmix, keine problematischen Wertungen | PREPARED |
| `emoji-quiz` | Emoji-Hinweise | strukturierte Paare | Eindeutigkeit, keine unnötigen Franchise-Antworten | PREPARED |
| `pass-the-phone` | Social-Prompts | Privacy-Prompt-Gate | kein Bloßstellen/sozialer Zwang | PREPARED |
| `red-green-flag` | Situationen bewerten | Textsicherheit | sensible Beziehungsthemen, keine Diagnosebehauptungen | PREPARED |
| `secret-mission` | verdeckte Aufgaben | Privacy-/Markup-Gate | sicher, freiwillig, nicht manipulativ | PREPARED |
| `tier-list` | gemeinsame Rankings | Packtiefe | Konfliktpotenzial, verständliche Themen | PREPARED |
| `put-a-finger-down` | Selbstaussagen | Privacy-Prompt-Gate | nicht zu intim, Skip/Freiwilligkeit | PREPARED |
| `guess-the-price` | feste Spielpreise | strukturierte Werte | klar als Spielwerte, keine Aktualitätsbehauptung | PREPARED |
| `higher-lower` | stabile Zahlenwerte | Struktur/Reference-Gates | Faktenstabilität, verständliche Einheiten | PREPARED |
| `know-me-best` | persönliche Auswahlfragen | Privacy-Prompt-Gate | freiwillig, nicht verletzend | PREPARED |
| `hear-me-out` | harmlose Debatten | Textsicherheit | keine gefährlichen/extremen Thesen | PREPARED |
| `hot-seat` | Schnellfragen | Privacy-Prompt-Gate | Tempo darf Skip nicht erschweren | PREPARED |
| `story-chain` | Geschichtenanfänge | Textsicherheit | Tonalität, Altersfit, Vielfalt | PREPARED |
| `finish-the-sentence` | offene Satzanfänge | Privacy-Prompt-Gate | keine erzwungene intime Offenlegung | PREPARED |
| `party-quiz` | Quizfragen mit Antwortoptionen | Struktur, Duplikate, Textsicherheit | Faktenstabilität, eindeutige richtige Antwort | PREPARED |
| `fact-or-fake` | Aussagen mit Auflösung | Struktur, Textsicherheit | Erklärung korrekt und nicht veraltend | PREPARED |
| `percent-guess` | Schätzfragen mit Zielwert | strukturierte Werte | Zielwert belastbar, Frage eindeutig | PREPARED |
| `party-bracket` | Turnier mit acht Begriffen | Struktur, Duplikate | faire, harmlose Duelle | PREPARED |
| `bluff-trivia` | Trivia mit richtiger Antwort | Struktur, Textsicherheit | Antwort eindeutig, gut bluffbar | PREPARED |
| `fill-blank-battle` | Lückensätze | Textsicherheit, Duplikate | lädt nicht zu verletzenden Antworten ein | PREPARED |
| `who-wrote-it` | offene Fragen | Privacy-Prompt-Gate | keine erzwungene persönliche Offenlegung | PREPARED |
| `undercover-similar-word` | ähnliche Wortpaare | Struktur, Duplikate | Paare ähnlich, aber unterscheidbar | PREPARED |
| `no-word-imposter` | Einzelbegriffe | Packtiefe, Duplikate | ohne Wort ratbar, nicht zu eindeutig | PREPARED |
| `password-one-word` | Zielwörter | Packtiefe, Duplikate | mit einem Hinweiswort lösbar | PREPARED |

## 5. Manuelle Quellprüfung

Vor `EXTENDED / LABS CONTENT PASS` wird jedes der 40 Spiele direkt im finalen Working-Branch-Katalog gelesen.

Je Spiel prüfen:

- Titel/Description/Regeln passen wirklich zur Mechanik
- jeder Packname ist verständlich
- keine schwachen Füllkarten
- keine semantischen Duplikate trotz unterschiedlicher Wörter
- keine unbeabsichtigte private Offenlegung
- keine Demütigung, riskante körperliche Aufgabe oder sozialer Zwang
- Altersstufe passt zum tatsächlichen Inhalt
- generische Referenzen bleiben generisch
- keine aktuelle Faktbehauptung, die vor Release veraltet sein kann
- strukturierte Karten besitzen sinnvolle Werte/Optionen
- Skip/Freiwilligkeit ist bei persönlichen Modi real verständlich

## 6. Reale Gruppenabnahme

Automatischer und manueller Quellpass reichen nicht für die Releasefreigabe.

Mindestens beobachten:

- 3–4 Personen
- 5–8 Personen
- 9–12 Personen
- Erstnutzer ohne Erklärung durch Entwickler
- mehrere Alters-/Stimmungsfilter
- mindestens ein kompletter Abend mit Extended/Labs-Mix

Erfassen:

- unklare Karte
- langweilige/redundante Karte
- unangenehme Karte
- zu leichte/zu schwere Aufgabe
- zu lange Übergabe
- Regelmissverständnis
- Skip-Situation
- Content, den reale Nutzer freiwillig vermeiden

## 7. Release-Gate

Vor `EXTENDED / LABS CONTENT PASS`:

- [x] 13 Extended und 27 Labs explizit inventarisiert
- [x] 40 Nicht-Core-Spiele besitzen einen eigenen automatischen Qualitätsvertrag
- [x] contentlose Utility-Modi explizit getrennt
- [x] schema-aware Mindestmengen definiert
- [x] Privacy-Offenlegungs-Prompt-Gate definiert
- [x] Markup-/Injection-Muster-Gate definiert
- [x] Duplikat-Gate definiert
- [x] internes Routing-Gate definiert
- [x] eigenständig ausführbarer `extended_labs_content_audit.py` vorbereitet
- [x] Node-Vertrag tatsächlich erfolgreich ausgeführt (lokal am 28. September 2026; Teil von `npm test`)
- [x] Python-Audit tatsächlich erfolgreich ausgeführt (lokal am 28. September 2026; Teil von `npm run validate`)
- [ ] alle 13 Extended manuell semantisch gelesen
- [ ] alle 27 Labs manuell semantisch gelesen
- [ ] Alters-/Safety-Sign-off abgeschlossen
- [ ] Reference-/Media-/Asset-Gates tatsächlich grün
- [ ] reale Gruppenabnahme abgeschlossen
- [ ] keine offenen Critical/High Contentfehler

Bis dahin bleibt der Extended-/Labs-Content **IN PROGRESS** und der öffentliche Release **NO_GO**.
