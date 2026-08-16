# Secret Circle – Manuelles Core-Content-Review

Stand: 16. August 2026

## 1. Zweck

Diese Matrix dokumentiert das menschliche Review der **15 priorisierten Kernspiele**. Automatische Tests prüfen Struktur, Mengen, exakte Duplikate, Markup und einzelne verbotene Regressionen. Dieses Dokument prüft zusätzlich Bedeutung, Ton, Privacy, Safety und Altersplausibilität.

Ein Eintrag `PREPARED` bedeutet: erster redaktioneller Quellpass durchgeführt, keine bekannte kritische Built-in-Karte offen. Er bedeutet **nicht**, dass reale Gruppentests, CI oder finale Rechtsprüfung bestanden sind.

## 2. Reviewkriterien

Pro Spiel wird geprüft:

- passt der Inhalt zur Mechanik?
- ist der Ton verständlich und nicht unnötig verletzend?
- fordert keine Karte private Chats/Fotos/Passwörter/Adressen/Kontodaten an?
- keine gefährlichen körperlichen Aufgaben?
- kein Alkohol-/Drogenzwang?
- keine sexualisierten Built-in-Aufgaben?
- keine gezielte Demütigung/Bloßstellung?
- `all`/`teen` plausibel?
- Skip/Freiwilligkeit dort sinnvoll, wo persönliche Antworten entstehen?
- keine offensichtliche fremde Franchise-/Konkurrenzkarte kopiert?

## 3. Matrix

| Core-Spiel | Alter | Quellpass | Privacy/Safety-Befund | Noch offen |
|---|---|---|---|---|
| Word Imposter | all | PREPARED | generische Begriffe/Kategorien; keine Aufforderung zur Preisgabe privater Daten | reale Wiederholungsrate, Fan-/Markenreview |
| Wahrheit oder Pflicht | teen | IN PROGRESS | Private-Device-Fund `SC-CONTENT-PRIV-001` geschlossen; Built-in-Pflichten überwiegend kurze harmlose Kreativ-/Darstellungsaufgaben | vollständiges Ton-/Semantikreview + reale Gruppe |
| Ich habe noch nie | teen | PREPARED | Alltag/Unterwegs/Digital/Peinlich; keine Alkohol-/Sex-/Drogenpflichten im aktuellen Core-Pool | persönliche Komfortgrenze in realer Gruppe prüfen |
| Wer würde eher? | all | PREPARED | überwiegend positive, lustige, Zukunfts- und Fantasiefragen; keine gezielte Abwertung | Gruppendynamik/soziale Wirkung real prüfen |
| Entweder oder | all | PREPARED | hypothetische Entscheidungen; keine reale gefährliche Handlung verlangt | einzelne Extremfragen auf Verständlichkeit testen |
| Paranoia | teen | PREPARED | Fragen überwiegend positiv/sozial; Mechanik nennt Personen und kann dadurch sensibler wirken | Skip/Freiwilligkeit und Gruppendynamik real prüfen |
| Scharade | all | PREPARED | Begriffe wie Boxen/Klettern/Tauchen sind **nur zu pantomimisch darstellende Begriffe**, keine Aufforderung zur echten Aktivität | physische Verständlichkeit/Barrierefreiheit real testen |
| Nicht sagen! / Tabu | all | PREPARED | „Passwort“ ist ein neutrales Zielwort; Nutzer werden nicht aufgefordert, ein echtes Passwort zu nennen | Kartenschwierigkeit und verbotene Wörter real testen |
| Heiße Kartoffel | all | PREPARED | Mini-Aufgaben sind niedrig-riskant: zählen, nennen, Geräusch, leichte Armbewegung | Geräteweitergabe/Tempo real testen |
| Wortkette | all | PREPARED | nur Kategorien/Startbuchstaben; keine sensiblen Inhalte | Buchstaben-/Kategorieschwierigkeit real prüfen |
| Zwei Wahrheiten, eine Lüge | all | PREPARED | Built-ins sind Inspirationsprompts; Nutzer bestimmen ihre persönlichen Aussagen selbst | UI muss Freiwilligkeit/keine sensiblen Details unterstützen |
| Question Imposter | all | PREPARED | Alltag/Meinung/Schätzung; keine vertraulichen Daten verlangt | Fragepaare auf Ähnlichkeit/Fairness real testen |
| Location Spy | all | PREPARED | generische reale/Fantasieorte; keine privaten Aufenthaltsorte des Nutzers verlangt | Ortsverständlichkeit real testen |
| Mafia | teen | PREPARED | Eliminations-/Täuschungssprache ohne grafische Gewalt; deshalb bewusst `teen` | Rollenbalance und Gruppendynamik real testen |
| Nur falsche Antworten | all | PREPARED | harmlose Wissens-/Alltags-/Fantasiefragen | Timing und Frustniveau real prüfen |

## 4. Geschlossener Fund SC-CONTENT-PRIV-001

### Problem

Im ursprünglichen Truth/Dare-Pool standen:

- eine Frage nach dem seltsamsten Inhalt der Kamerarolle
- eine Pflicht, die letzte Handy-Nachricht vorzulesen

Beide konnten private oder fremde Inhalte in die Runde ziehen.

### Korrektur

Der finale Runtime-Katalog ersetzt sie durch:

- `Welches Foto-Motiv findest du besonders lustig?`
- `Lies einen selbst erfundenen Satz wie einen dramatischen Theatermonolog vor.`

### Regression

`tests/core-content-quality.test.js` verlangt, dass die beiden alten Texte im finalen Core-Katalog nicht vorkommen.

Status: **CLOSED IN CODE / RUNNER VERIFICATION OPEN**.

## 5. Bedeutungsregeln aus dem Review

### Begriffe sind nicht automatisch Handlungsaufforderungen

Ein Wort wie `Boxen` in Scharade bedeutet „darstellen“, nicht „eine Person schlagen“. `Passwort` in Tabu bedeutet „Begriff erklären“, nicht „echtes Passwort offenlegen“.

Safety-Reviews bewerten deshalb **Mechanik + Text gemeinsam** und nicht nur einzelne Schlagwörter.

### Persönliche soziale Mechaniken

Truth/Dare, Never Have, Paranoia und Two Truths benötigen unabhängig von der konkreten Karte eine sichtbare soziale Grundregel:

> Überspringen ist jederzeit erlaubt. Niemand muss persönliche Details erklären.

Diese Regel muss in der UX dort sichtbar sein, wo Nutzer persönliche Inhalte sehen oder beantworten.

## 6. Erster Reviewbefund

Nach dem ersten vollständigen Core-Quellpass:

- keine bekannte Built-in-Alkoholpflicht
- keine bekannte Built-in-Drogenaufforderung
- keine bekannte sexualisierte Built-in-Aufgabe
- keine bekannte gefährliche körperliche Pflicht
- kein bekannter Core-Prompt, der nach der Korrektur private Chats/Kamerarolle verlangt
- Mafia bleibt bewusst `teen`
- Paranoia/Truth-Dare/Never-Have bleiben bewusst `teen`

Dies ist eine **redaktionelle Quellbewertung**, kein realer Nutzer- oder Rechtsnachweis.

## 7. Noch erforderliche Content-Gates

- [ ] `npm test` / Core-Content-Vertrag auf funktionierendem Runner grün
- [ ] semantische Fast-Duplikate in längeren realen Sessions beobachten
- [ ] Skip/Freiwilligkeit in persönlichen Core-Flows sichtbar verifizieren
- [ ] reale Gruppe pro Kernspiel
- [ ] große Gruppen für Paranoia/Mafia/Word Imposter
- [ ] Fan-/Marken-/Urheberrechtsreview für alle öffentlich vermarkteten Inhalte
- [ ] finaler Content-Sign-off vor Release Candidate

Bis dahin bleibt der Bereich **CONTENT IN PROGRESS**.
