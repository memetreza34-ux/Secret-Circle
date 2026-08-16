# Secret Circle – Content- und Altersrichtlinie

Stand: 16. August 2026

## 1. Zweck

Diese Richtlinie definiert die redaktionelle Qualitäts- und Alterslogik für eingebaute Secret-Circle-Inhalte. Sie ersetzt keine gesetzliche Altersfreigabe oder Store-Einstufung. Vor einer späteren Store-Veröffentlichung müssen die dann aktuellen offiziellen Einstufungsregeln separat geprüft werden.

Für Januar 2027 dienen die internen Werte `all` und `teen` primär als **Produktfilter und redaktionelle Freigabestufe**.

## 2. Grundregeln für alle eingebauten Inhalte

Jede eingebaute Karte, Frage, Aufgabe, Rolle oder Begriff muss:

- einen klaren spielerischen Zweck haben
- verständlich formuliert sein
- innerhalb des vorgesehenen Packs sinnvoll passen
- sich ausreichend von anderen Karten unterscheiden
- keine eingebetteten HTML-/Scriptfragmente enthalten
- keine fremden geschützten Texte, Logos, Bilder oder Audios kopieren
- ohne unnötige Demütigung, Zwang oder gefährliche Aufgaben auskommen
- überspringbar sein, wenn Inhalt persönlich oder unangenehm werden kann

## 3. Interne Altersstufen

### `all`

Bedeutung für Secret Circle:

- Standardinhalt für gemischte Gruppen
- keine sexualisierten Aufgaben
- keine Trinkpflicht
- keine gefährlichen Challenges
- keine gezielte Bloßstellung
- keine drastische Gewaltbeschreibung
- keine Aufforderung zu illegalem Verhalten
- persönliche Fragen bleiben leicht oder freiwillig

`all` bedeutet **nicht automatisch „für jedes Kind jeder Altersstufe geeignet“**. Es ist eine interne familienfreundlichere Produktkategorie und muss vor einer offiziellen Store-Altersfreigabe erneut bewertet werden.

### `teen`

Darf:

- persönlichere Fragen
- tiefere soziale Themen
- peinliche Alltagserfahrungen
- stärkere Täuschungs-/Konfliktmechaniken
- Mafia-/Eliminationssprache im spielerischen Kontext

enthalten, solange keine unnötig expliziten oder riskanten Aufgaben eingebaut werden.

Auch `teen` ist kein Freibrief für sexuelle, gefährliche, diskriminierende oder stark übergriffige Inhalte.

## 4. Aktuelle Alterszuordnung der 15 Kernspiele

### `teen`

- Wahrheit oder Pflicht (`truth-dare`)
- Ich habe noch nie (`never-have`)
- Paranoia (`paranoia`)
- Mafia (`mafia`)

### `all`

- Word Imposter (`imposter`)
- Wer würde eher? (`most-likely`)
- Entweder oder (`would-rather`)
- Scharade (`charades`)
- Nicht sagen! / Tabu (`taboo`)
- Heiße Kartoffel (`hot-potato`)
- Wortkette (`word-chain`)
- Zwei Wahrheiten, eine Lüge (`two-truths`)
- Question Imposter (`question-imposter`)
- Location Spy (`location-spy`)
- Nur falsche Antworten (`wrong-answers`)

Diese Zuordnung wird durch `tests/core-content-quality.test.js` geschützt.

## 5. Persönliche und sensible Inhalte

Folgende Arten benötigen besondere Vorsicht:

- Geheimnisse
- Beziehungen
- körperliche Themen
- psychische Gesundheit
- Familie
- Geld
- Religion
- Politik
- Sexualität
- Alkohol/Drogen
- Trauma
- Aussehen/Körper
- soziale Ausgrenzung

Für Januar 2027 gilt:

- solche Themen nicht beiläufig in familienfreundliche Standardpacks mischen
- sensible Inhalte klar in passend bezeichnete Packs einordnen
- Skip jederzeit ermöglichen, wenn die Mechanik persönliche Antworten verlangt
- niemand muss erklären, warum eine Karte übersprungen wird

## 6. Challenges / Pflichten

Nicht erlaubt als Built-in:

- gefährliche körperliche Aufgaben
- Zerstörung von Eigentum
- Belästigung fremder Personen
- Veröffentlichung privater Inhalte
- Zwang zu Kontaktaufnahme/Nachrichten an Dritte
- Essen/Trinken mit Gesundheitsrisiko
- Alkoholzwang
- sexuelle Handlungen
- Demütigung/Bloßstellung
- illegale Handlungen

Bevorzugt:

- kurze Darstellung
- Stimme/Mimik
- harmlose Kreativaufgabe
- Bewegung mit sehr niedrigem Risiko
- positives Gruppenfeedback

## 7. Datenschutz innerhalb von Karten

Built-in-Karten dürfen nicht verlangen:

- Passwörter zu zeigen
- private Chats vollständig vorzulesen
- private Fotos zu zeigen
- Telefonnummern/Adressen preiszugeben
- Kontodaten zu nennen

Bestehende Truth/Dare-Karte „Lies die letzte Nachricht ... ohne Namen zu nennen“ wird vor finaler Contentfreigabe nochmals redaktionell bewertet, weil auch ohne Namen privater Drittinhalt betroffen sein kann.

## 8. Marken, Fan- und Popkultur

Allgemeine Begriffe und allgemein bekannte Kategorien können redaktionell verwendet werden, aber:

- keine fremden Logos
- keine kopierten Karten aus Konkurrenzapps
- keine langen fremden Zitate
- keine geschützten Bilder/Audios
- keine täuschende offizielle Partnerschaft

Word Imposter verwendet aktuell generische Anime-/Gaming-/Filmbegriffe statt konkreter Franchise-Karten. Extended/Labs mit stärkerem Fanbezug werden separat vor öffentlicher Vermarktung geprüft.

## 9. Qualitätsbudgets – harte Mindestwerte

Harte Mindestwerte werden nach erfolgreichem Ausbau **angehoben**. Ein späterer Commit darf einen bereits erreichten Contentstand nicht still zurücksetzen.

| Mechanik | aktuelles hartes Minimum pro Pack |
|---|---:|
| Truth/Dare | 16 kombinierte Karten; mindestens 8 Truth + 8 Dare |
| Never Have / Most Likely / Would Rather / Paranoia / Wrong Answers | 8 |
| Charades | 12 |
| Taboo | **16** |
| Hot Potato | **16** |
| Word Chain | **10 Startbuchstaben** |
| Two Truths prompts | **16** |
| Question Imposter | **16 Paare** |
| Location Spy | **16 Orte** |
| Mafia | mindestens 3 eindeutige Rollen je Pack |
| Word Imposter | 12 Begriffe je Built-in-Kategorie |

Diese Mindestwerte werden automatisiert in `tests/core-content-quality.test.js` geprüft.

## 10. Redaktionelle Releaseziele

Vor finaler Januar-2027-Inhaltsfreigabe gelten folgende Zielwerte, sofern reale Tests keinen besseren mechanikspezifischen Wert ergeben:

- Truth/Dare und klassische Prompt-/Choice-Packs: Ziel **mindestens 20–24** hochwertige Karten pro Pack
- Paranoia: Ziel **mindestens 20** pro Pack
- Charades: Ziel **mindestens 30** Begriffe pro Pack
- Taboo: Ziel **mindestens 24** Karten pro Pack
- Hot Potato: Ziel **mindestens 20** Aufgaben/Kategorien pro Pack
- Word Chain: Ziel **mindestens 10** sinnvolle Startbuchstaben pro Pack oder eine bessere dynamische Startlogik
- Two Truths: Ziel **mindestens 16** Inspirationsprompts pro Pack
- Question Imposter: Ziel **mindestens 16** hochwertige Fragepaare pro Pack
- Location Spy: Ziel **mindestens 16** Orte pro Pack
- Word Imposter: 12 Begriffe × 14 Kategorien bleiben die aktuelle Releasebasis; Wiederholungsrate real testen

Mafia wird über Rollenbalance statt Kartenmenge bewertet.

### Bereits auf Zielniveau nach Content-Welle 1

- Word Chain: 10 Starts je Pack
- Two Truths: 16 Prompts je Pack
- Question Imposter: 16 Paare je Pack
- Location Spy: 16 Orte je Pack
- Word Imposter: 14 × 12 Begriffe

### Verbessert, aber noch unter Endziel

- Taboo: 16 statt vorher 8 je Pack; Ziel 24
- Hot Potato: 16 statt vorher 8 je Pack; Ziel 20

Die restlichen dünnen Core-Packs folgen in den nächsten Content-Wellen.

## 11. Strukturverträge

### Truth/Dare

- jedes Pack besitzt getrennte `truth`- und `dare`-Listen
- mindestens 8 + 8
- keine Duplikate innerhalb des Packs

### Would Rather

- genau zwei Optionen
- beide nicht leer
- Optionen dürfen nicht identisch sein

### Taboo

Jede Karte:

- genau ein Zielwort
- genau drei verbotene Wörter
- alle drei verbotenen Wörter eindeutig
- Zielwort ist nicht selbst verbotene Vokabel

### Question Imposter

- `main` und `imposter` vorhanden
- beide verständlich
- nicht identisch
- sollten ähnlich genug sein, dass Antworten vergleichbar bleiben

Der letzte Punkt bleibt redaktionell und kann nicht vollständig automatisiert bewertet werden.

### Location Spy

- Orte innerhalb eines Packs eindeutig
- keine leeren Orte

### Mafia

- Rollen innerhalb eines Packs eindeutig
- Packnamen entsprechen tatsächlicher Enginevariante
- Balance wird zusätzlich in realen Gruppen geprüft

### Word Imposter

- jeder Eintrag besteht aus Begriff + Hinweis/Kontext
- 14 Built-in-Kategorien
- 12 Einträge je Kategorie
- keine Duplikate innerhalb derselben Kategorie

## 12. Duplikatregel

Automatisch blockiert werden exakte Duplikate nach:

- Unicode-Normalisierung
- Trimmen
- Zusammenfassen mehrfacher Leerzeichen
- Kleinschreibung

Semantisch fast gleiche Karten benötigen weiterhin manuelles Review.

## 13. Textlängen

Built-in-Texte sollen kurz genug für Smartphone/Partyfluss bleiben.

Automatischer Vertrag:

- keine leeren Strings
- normale Karten keine extrem langen Texte
- einzelne Begriffe dürfen kurz sein
- strukturierte Fragen/Prompts werden auf sinnvolle Obergrenzen geprüft

Das visuelle 200-%-Zoom-/Small-Screen-Review bleibt trotzdem nötig.

## 14. Content-Ausbau – aktueller Stand

### Solide Basis

- Word Imposter: 14 Kategorien × 12 Begriffe = 168
- Truth/Dare: 4 Packs × 16 = 64
- Charades: 4 Packs × 12 = 48

### Release-Welle 1 umgesetzt

`party-expansion.js` erweitert bestehende Inhalte, ohne die Spielmechaniken zu verändern:

- Taboo: 8 → **16** Karten je Pack
- Hot Potato: 8 → **16** Einträge je Pack
- Word Chain: 5 → **10** Startbuchstaben je Pack
- Two Truths: 8 → **16** Prompts je Pack
- Question Imposter: 8 → **16** Fragepaare je Pack
- Location Spy: 8 → **16** Orte je Pack

Die neuen Werte sind nicht nur dokumentiert, sondern in `tests/party-expansion.test.js` und `tests/core-content-quality.test.js` als Regression-Gates festgeschrieben.

### Noch auszubauen

- Truth/Dare: 16 → Ziel 20–24
- Never Have: 8 → Ziel 20–24
- Most Likely: 8 → Ziel 20–24
- Would Rather: 8 → Ziel 20–24
- Paranoia: 8 → Ziel 20
- Charades: 12 → Ziel 30
- Taboo: 16 → Ziel 24
- Hot Potato: 16 → Ziel 20
- Wrong Answers: 8 → Ziel 20–24

### Aktueller Gesamtbefund

**Strukturell deutlich verbessert, redaktionell weiterhin IN PROGRESS.**

Content wird weiter in kontrollierten Wellen ausgebaut und anschließend mit realen Gruppen auf Wiederholungsrate, Verständlichkeit, Ton und tatsächlichen Spielspaß geprüft.

## 15. Releasefreigabe Content

Vor `CONTENT PASS`:

- [ ] automatischer Core-Content-Test grün auf funktionierendem Runner
- [ ] keine strukturellen Kartenfehler
- [ ] keine exakten Duplikate
- [ ] jeder Core-Pack manuell gelesen
- [ ] semantische Wiederholungen entfernt
- [ ] Altersstufen bestätigt
- [ ] sensible Inhalte/Skip geprüft
- [ ] Content-Tiefe auf Zielniveau oder bewusst begründet
- [ ] mindestens ein realer Test pro Kernspiel
- [ ] Fan-/Marken-/Urheberrechtsprüfung abgeschlossen

Bis dahin bleibt Content **IN PROGRESS**.
