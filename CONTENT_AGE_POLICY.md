# Secret Circle – Content- und Altersrichtlinie

Stand: 16. August 2026

## 1. Zweck

Diese Richtlinie definiert die redaktionelle Qualitäts- und Alterslogik für eingebaute Secret-Circle-Inhalte. Sie ersetzt keine gesetzliche Altersfreigabe oder Store-Einstufung. Vor einer späteren Store-Veröffentlichung müssen die dann aktuellen offiziellen Einstufungsregeln separat geprüft werden.

Für Januar 2027 dienen `all` und `teen` als interne Produktfilter und redaktionelle Freigabestufen.

## 2. Grundregeln

Jede eingebaute Karte, Frage, Aufgabe, Rolle oder jeder Begriff muss:

- einen klaren spielerischen Zweck haben
- verständlich und smartphone-tauglich formuliert sein
- zum vorgesehenen Pack passen
- sich ausreichend von anderen Karten unterscheiden
- frei von eingebetteten HTML-/Scriptfragmenten sein
- keine fremden geschützten Texte, Logos, Bilder oder Audios kopieren
- ohne unnötige Demütigung, Zwang oder gefährliche Aufgaben auskommen
- überspringbar sein, wenn persönliche oder unangenehme Inhalte vorkommen können

Menge allein ist kein Qualitätsnachweis.

## 3. Interne Altersstufen

### `all`

- Standard für gemischte Gruppen
- keine sexualisierten Aufgaben
- keine Trinkpflicht
- keine gefährlichen Challenges
- keine gezielte Bloßstellung
- keine drastische Gewaltbeschreibung
- keine Aufforderung zu illegalem Verhalten
- persönliche Fragen bleiben leicht oder freiwillig

`all` bedeutet nicht automatisch „für jedes Kind jeder Altersstufe geeignet“.

### `teen`

Darf persönlichere Fragen, tiefere soziale Themen, peinliche Alltagserfahrungen sowie stärkere Täuschungs-/Konfliktmechaniken enthalten. Auch `teen` erlaubt keine sexuellen, gefährlichen, diskriminierenden oder stark übergriffigen Built-ins.

## 4. Alterszuordnung der 15 Kernspiele

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

`tests/core-content-quality.test.js` schützt diese Zuordnung als technischen Vertrag. Die finale redaktionelle Altersfreigabe bleibt manuell.

## 5. Sensible Inhalte

Besondere Vorsicht gilt bei:

- Geheimnissen
- Beziehungen
- körperlichen Themen
- psychischer Gesundheit
- Familie
- Geld
- Religion
- Politik
- Sexualität
- Alkohol/Drogen
- Trauma
- Aussehen/Körper
- sozialer Ausgrenzung

Regeln:

- nicht beiläufig in `all`-Standardpacks mischen
- sensible Inhalte klar einordnen
- freiwilliges Überspringen ermöglichen
- niemand muss einen Skip begründen

## 6. Challenges / Pflichten

Nicht als Built-in zulässig:

- gefährliche körperliche Aufgaben
- Zerstörung von Eigentum
- Belästigung Dritter
- Veröffentlichung privater Inhalte
- Zwang zu Nachrichten/Kontakten mit Dritten
- riskantes Essen/Trinken
- Alkoholzwang
- sexuelle Handlungen
- Demütigung/Bloßstellung
- illegale Handlungen

Bevorzugt werden kurze Darstellung, Stimme/Mimik, harmlose Kreativaufgaben, niedrig-riskante Bewegung und positives Gruppenfeedback.

## 7. Datenschutz innerhalb von Karten

Built-ins dürfen nicht verlangen:

- Passwörter zu zeigen
- private Chats vollständig vorzulesen
- private Fotos zu zeigen
- Telefonnummern/Adressen preiszugeben
- Kontodaten zu nennen

Die bestehende Truth/Dare-Karte zum Vorlesen der letzten Nachricht bleibt als konkreter redaktioneller Privacy-Fund markiert und muss vor `CONTENT PASS` entfernt oder so umformuliert werden, dass kein Drittinhalt offengelegt werden muss.

## 8. Marken, Fan- und Popkultur

- keine fremden Logos
- keine kopierten Karten aus Konkurrenzapps
- keine langen fremden Zitate
- keine geschützten Bilder/Audios
- keine täuschende offizielle Partnerschaft

Word Imposter verwendet überwiegend generische Anime-/Gaming-/Filmbegriffe. Extended/Labs mit stärkerem Fanbezug benötigen vor öffentlicher Vermarktung ein separates Review.

## 9. Quantitative Release-Gates

Die folgenden Werte sind nach Content-Welle 3 **erreichte harte Regression-Gates**:

| Mechanik | Minimum pro Pack |
|---|---:|
| Truth/Dare | **24 kombiniert = mindestens 12 Truth + 12 Dare** |
| Never Have | **24** |
| Most Likely | **24** |
| Would Rather | **24 Paare** |
| Paranoia | **20** |
| Wrong Answers | **24** |
| Charades | **30** |
| Taboo | **24** |
| Hot Potato | **20** |
| Word Chain | **10 Starts** |
| Two Truths | **16 Prompts** |
| Question Imposter | **16 Paare** |
| Location Spy | **16 Orte** |
| Mafia | mindestens **3 eindeutige Rollen**, zusätzlich Balanceprüfung |
| Word Imposter | **12 Begriffe je 14 Built-in-Kategorien** |

`tests/core-content-quality.test.js` verlangt, dass kein quantitatives Core-Ziel mehr unterschritten wird.

## 10. Content-Wellen

### Ausgangsbasis

- Word Imposter: 14 × 12 = 168 Begriffe
- Truth/Dare: 4 × 16
- Charades: 4 × 12
- viele weitere Core-Packs nur 8 Einträge

### Welle 1 – strukturierte/kleine Pools

In `party-expansion.js`:

- Taboo: 8 → 16
- Hot Potato: 8 → 16
- Word Chain: 5 → 10
- Two Truths: 8 → 16
- Question Imposter: 8 → 16
- Location Spy: 8 → 16

### Welle 2 – soziale Prompt-/Choice-Spiele

In `party-core-release-catalog.js`:

- Never Have: 8 → 24
- Most Likely: 8 → 24
- Would Rather: 8 → 24
- Paranoia: 8 → 20
- Wrong Answers: 8 → 24

### Welle 3 – klassische Core-Spiele

In `party-core-classic-content.js`:

- Truth/Dare: 16 → **24** je Pack
- Charades: 12 → **30** je Pack
- Taboo: 16 → **24** je Pack
- Hot Potato: 16 → **20** je Pack

Damit haben **alle 15 Kernspiele ihre definierten quantitativen Releaseziele erreicht**.

## 11. Strukturverträge

### Truth/Dare

- getrennte `truth`- und `dare`-Listen
- mindestens 12 + 12 pro Pack
- keine exakten normalisierten Duplikate

### Would Rather

- genau zwei nicht-leere, unterschiedliche Optionen

### Taboo

- genau ein Zielwort
- genau drei eindeutige verbotene Wörter
- Zielwort nicht selbst verboten

### Question Imposter

- `main` und `imposter` vorhanden
- verständlich und nicht identisch
- redaktionell ähnlich genug für vergleichbare Antworten

### Location Spy

- Orte innerhalb eines Packs eindeutig

### Mafia

- Rollen innerhalb eines Packs eindeutig
- Packname entspricht Enginevariante
- reale Balanceprüfung bleibt Pflicht

### Word Imposter

- Begriff + Kontext
- 14 Built-in-Kategorien
- 12 Einträge je Kategorie
- keine Duplikate innerhalb derselben Kategorie

## 12. Duplikat- und Textregeln

Automatisch blockiert werden exakte Duplikate nach Unicode-Normalisierung, Trimmen, Zusammenfassen von Leerzeichen und Kleinschreibung.

Semantisch fast gleiche Karten, unpassender Ton oder langweilige Wiederholungen benötigen weiterhin menschliches Review.

Built-in-Texte müssen außerdem innerhalb der in `tests/core-content-quality.test.js` definierten Längen- und Markup-Grenzen bleiben.

## 13. Quantitativer Status

**QUANTITY TARGET: PREPARED / vollständig implementiert, aber wegen des externen CI-Runnerblockers noch nicht als ausgeführter PASS dokumentiert.**

Der Code-/Contractstand verlangt keine bekannten quantitativen Shortfalls mehr.

## 14. Was für CONTENT PASS noch fehlt

- [ ] Core-Content-Test auf funktionierendem Runner tatsächlich grün
- [ ] jeden Core-Pack manuell vollständig lesen
- [ ] semantische Doppelungen entfernen
- [ ] Ton und Verständlichkeit prüfen
- [ ] Altersstufen redaktionell bestätigen
- [ ] Privacy-Fund in Truth/Dare schließen
- [ ] sensible Inhalte und Skip-Flows prüfen
- [ ] mindestens ein realer Gruppentest pro Kernspiel
- [ ] Wiederholungsrate in längeren Sessions beobachten
- [ ] Fan-/Marken-/Urheberrechtsprüfung abschließen

Bis diese Punkte nachgewiesen sind, bleibt Content **IN PROGRESS** und nicht `CONTENT PASS`.
