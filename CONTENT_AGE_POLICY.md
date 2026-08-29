# Secret Circle – Content- und Altersrichtlinie

Stand: 19. August 2026

## 1. Zweck

Diese Richtlinie definiert die redaktionelle Qualitäts-, Safety-, Privacy- und Alterslogik für eingebaute Secret-Circle-Inhalte. Sie ersetzt keine gesetzliche Altersfreigabe oder Store-Einstufung. `all` und `teen` sind interne Produktfilter und redaktionelle Freigabestufen.

## 2. Grundregeln

Jede eingebaute Karte, Frage, Aufgabe, Rolle oder jeder Begriff muss:

- einen klaren spielerischen Zweck haben
- verständlich und smartphone-tauglich formuliert sein
- zum vorgesehenen Pack passen
- sich ausreichend von anderen Karten unterscheiden
- frei von eingebetteten HTML-/Scriptfragmenten sein
- keine fremden geschützten Texte, Logos, Bilder oder Audios kopieren
- keine unnötige Demütigung, gefährliche Handlung oder Zwang erzeugen
- überspringbar sein, wenn persönliche Inhalte vorkommen können
- keine privaten Nachrichten, Fotos, Passwörter, Adressen oder Kontodaten als Spielmaterial verlangen

Menge allein ist kein Qualitätsnachweis.

## 3. Interne Altersstufen

### `all`

Für gemischte Gruppen. Keine sexualisierten Aufgaben, Trinkpflicht, gefährlichen Challenges, gezielte Bloßstellung, drastische Gewalt oder Aufforderungen zu illegalem Verhalten. Persönliche Fragen bleiben leicht oder freiwillig.

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

`tests/core-content-quality.test.js` schützt diese technische Zuordnung. Die finale redaktionelle Einstufung bleibt manuell.

## 5. Sensible Themen

Besondere Vorsicht gilt bei Geheimnissen, Beziehungen, körperlichen Themen, psychischer Gesundheit, Familie, Geld, Religion, Politik, Sexualität, Alkohol/Drogen, Trauma, Aussehen/Körper und sozialer Ausgrenzung.

Regeln:

- nicht beiläufig in `all`-Standardpacks mischen
- sensible Inhalte klar einordnen
- Skip ermöglichen
- niemand muss einen Skip begründen

## 6. Challenges / Pflichten

Nicht als Built-in zulässig:

- gefährliche körperliche Aufgaben
- Zerstörung von Eigentum
- Belästigung Dritter
- Veröffentlichung privater Inhalte
- Zwang zu Nachrichten/Kontakten mit Dritten
- riskantes Essen/Trinken oder Alkoholzwang
- sexuelle Handlungen
- Demütigung/Bloßstellung
- illegale Handlungen

Bevorzugt werden kurze Darstellung, Stimme/Mimik, harmlose Kreativaufgaben, niedrig-riskante Bewegung und positives Gruppenfeedback.

## 7. Privacy-Regeln für Karten

Built-ins dürfen nicht verlangen:

- Passwörter zu zeigen
- private Chats oder Nachrichten vorzulesen
- private Fotos/Kamerarolle zu zeigen oder zu durchsuchen
- Telefonnummern/Adressen preiszugeben
- Konto-/Zahlungsdaten zu nennen
- fremde Geräte oder Accounts zu verwenden

### Geschlossener Fund SC-CONTENT-PRIV-001

Im manuellen Review wurden zwei problematische Truth/Dare-Karten gefunden:

1. Frage nach dem „Seltsamsten in deiner Kamerarolle“
2. Pflicht, die letzte Handy-Nachricht vorzulesen

Beide Texte werden im finalen Runtime-Content durch harmlose Alternativen ersetzt:

- `Welches Foto-Motiv findest du besonders lustig?`
- `Lies einen selbst erfundenen Satz wie einen dramatischen Theatermonolog vor.`

`tests/core-content-quality.test.js` verlangt, dass die beiden alten Texte im finalen Core-Content nicht mehr vorkommen. Dieser konkrete Fund ist damit **technisch geschlossen**, die Testausführung auf einem funktionierenden Runner bleibt jedoch ausstehend.

### Globaler Source-Vertrag

`scripts/privacy_content_audit.py` erweitert diesen Schutz auf die **acht ausgelieferten Built-in-Contentquellen**. Der Audit blockiert konkrete Aufforderungsmuster, die private Nachrichten, Kamerarolle/Fotos, Passwörter, Adresse, Telefonnummer, Standort oder Kontodaten zum verpflichtenden Spielmaterial machen würden.

Der Audit blockiert bewusst **nicht** jede harmlose Erwähnung eines Geräts oder Chats. Aussagen wie „Gruppenchat“, „letzte App geöffnet?“ oder allgemeine Internet-Situationen bleiben zulässig, solange keine private Offenlegung verlangt wird. Persönliche Inhalte bleiben zusätzlich über den sichtbaren Skip-/Freiwilligkeitsvertrag geschützt.

## 8. Marken, Fan- und Popkultur

- keine fremden Logos
- keine kopierten Karten aus Konkurrenzapps
- keine langen fremden Zitate
- keine geschützten Bilder/Audios ohne Rechte
- keine täuschende offizielle Partnerschaft

Extended/Labs mit stärkerem Fanbezug benötigen ein separates Review.

## 9. Quantitative Release-Gates

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

Nach drei Content-Wellen haben **alle 15 Kernspiele ihre definierten quantitativen Releaseziele erreicht**. Der Vertrag verlangt `editorialShortfalls = []`.

## 10. Content-Wellen

### Welle 1

Taboo 8→16, Hot Potato 8→16, Word Chain 5→10, Two Truths 8→16, Question Imposter 8→16, Location Spy 8→16.

### Welle 2

Never Have 8→24, Most Likely 8→24, Would Rather 8→24, Paranoia 8→20, Wrong Answers 8→24.

### Welle 3

Truth/Dare 16→24, Charades 12→30, Taboo 16→24, Hot Potato 16→20.

## 11. Strukturverträge

### Truth/Dare

Getrennte `truth`-/`dare`-Listen, mindestens 12+12 je Pack, keine exakten normalisierten Duplikate.

### Would Rather

Genau zwei nicht-leere, unterschiedliche Optionen.

### Taboo

Ein Zielwort, genau drei eindeutige verbotene Wörter; Zielwort nicht selbst verboten.

### Question Imposter

`main` und `imposter` vorhanden, verständlich, nicht identisch und redaktionell ähnlich genug für vergleichbare Antworten.

### Location Spy / Mafia / Word Imposter

Orte/Rollen/Begriffe innerhalb ihres vorgesehenen Scopes eindeutig; Mafia zusätzlich reale Balanceprüfung; Word Imposter 14 Kategorien × 12 Einträge.

## 12. Duplikat- und Textregeln

Automatisch blockiert werden exakte Duplikate nach Unicode-Normalisierung, Trimmen, Zusammenfassen von Leerzeichen und Kleinschreibung. Semantisch ähnliche Karten, schwacher Ton oder unpassende Packzuordnung benötigen weiterhin menschliches Review.

## 13. Quantitativer Status

**QUANTITY TARGET: PREPARED / vollständig implementiert, aber wegen des externen CI-Runnerblockers noch nicht als ausgeführter PASS dokumentiert.**

## 14. Was für CONTENT PASS noch fehlt

- [ ] Core-Content-Test auf funktionierendem Runner tatsächlich grün
- [ ] `scripts/privacy_content_audit.py` auf funktionierendem Runner tatsächlich grün
- [ ] alle 15 Core-Games in `CORE_CONTENT_REVIEW.md` vollständig redaktionell abnehmen
- [ ] semantische Doppelungen entfernen
- [ ] Ton und Verständlichkeit prüfen
- [ ] Altersstufen redaktionell bestätigen
- [x] erster Private-Device-Fund geschlossen
- [ ] weitere Privacy-/Safety-Funde durch globalen Audit und manuelles Review ausschließen oder beheben
- [ ] mindestens ein realer Gruppentest pro Kernspiel
- [ ] Wiederholungsrate beobachten
- [ ] Fan-/Marken-/Urheberrechtsprüfung abschließen

Bis dahin bleibt Content **IN PROGRESS**.
