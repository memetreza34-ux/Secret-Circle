# Secret Circle – Punkte- und Siegervertrag der 15 Kernspiele

Stand: 26. August 2026

Dieses Dokument definiert, **was die App tatsächlich zählt** und **was als Rundensieger oder Matchsieger gilt**. Ein Zähler ist nicht automatisch ein Siegerpunktestand.

## Begriffe

- **Matchpunkte:** Punkte gehören konkreten Personen und bestimmen einen Matchstand.
- **Session-Zähler:** erfolgreiche Aktionen/Runden ohne Personen-/Teamrangliste.
- **Erfolgszähler:** erfolgreiche Gruppenaktionen; Rundensieger separat.
- **Scorelos:** kein App-Punktestand.
- **Manuelles Rundenergebnis:** Gruppe bestimmt Verlierer/Gewinner selbst.

## Verbindliche Matrix

| Kernspiel | App-Zähler | Regel | Rundensieger | Gesamtsieger |
|---|---|---|---|---|
| Word Imposter | **individuelle Matchpunkte** | Unschuldige je +1 bei gefangenem Imposter mit falschem Guess; Imposter je +2 bei Entkommen oder richtigem Guess. | `innocents` oder `imposters` | Rangliste nach Matchpunkten |
| Wahrheit oder Pflicht | **scorelos** | Erledigte Karten erhöhen nur die Rundenzahl. | keiner | keiner |
| Ich habe noch nie | **scorelos** | Jede Karte ist eine Gesprächsrunde. | keiner | keiner |
| Wer würde eher? | **scorelos** | Abstimmung nur zur Unterhaltung. | keiner | keiner |
| Entweder oder | **scorelos** | Auswahl/Diskussion ohne Punkte. | keiner | keiner |
| Paranoia | **scorelos** | Münzwurf entscheidet nur über Offenlegung. | keiner | keiner |
| Scharade | **Session-Zähler „Treffer“** | Jeder bestätigte Treffer während der Timer-Runde +1. | kein formaler App-Sieger | keiner |
| Nicht sagen! / Tabu | **Session-Zähler „Treffer“** | Jeder bestätigte Treffer während der Timer-Runde +1. | kein formaler App-Sieger | keiner |
| Heiße Kartoffel | **scorelos** | Verborgener Zufallstimer; Person mit Gerät bei STOPP verliert. | manuell | keiner |
| Wortkette | **Session-Zähler „geschaffte Runden“** | „Runde geschafft“ +1; Zeitablauf/Skip kein Punkt. | geschafft/nicht geschafft | keiner |
| Zwei Wahrheiten, eine Lüge | **Erfolgszähler** | Gruppe findet Lüge → +1. | Gruppe oder Autor/in | keiner |
| Question Imposter | **Erfolgszähler** | Gruppe findet Imposter → +2. | Gruppe oder Imposter | keiner |
| Location Spy | **Erfolgszähler** | korrekte Spionwahl +2; korrekter Ortsguess des Spions +2. | Spion oder Gruppe | keiner |
| Mafia | **Erfolgszähler** | Tageswahl eliminiert Mafia → +3. | Dorf oder Mafia nach Alive-Bedingung | Seite nach Siegbedingung |
| Nur falsche Antworten | **scorelos / manuell** | richtige oder zu langsame Antwort verliert Runde. | manuell | keiner |

## Release-Regeln

### 1. Score und Sieger dürfen nicht vermischt werden

`session.score` im Party Hub und Advanced Runner ist bei mehreren Spielen nur ein Session-/Erfolgszähler. Nur Word Imposter besitzt einen individuellen Punktestand pro Person und eine Rangliste.

### 2. Globale Hub-Aktion „Runde überspringen“

Die gemeinsame Hub-Aktion beendet die aktuelle Runde, erhöht die Rundenzahl und gibt **keinen Punkt**. Spielinterne Begriffs-Skips bei Scharade und Tabu wechseln nur die aktuelle Karte und beenden die Timer-Runde nicht.

### 3. Abbruch ist kein Ergebnis

**„Abbrechen & verwerfen“** erzeugt keinen Verlauf, keine Statistik und keinen Sieger.

### 4. „Beenden & speichern“ und laufende Timer

**„Beenden & speichern“** speichert den bis dahin bewusst erspielten Stand. Wird eine bereits gestartete Timer-Runde dabei vor Ablauf beendet, gilt sie als **bewusst verkürzte gespielte Runde** und wird in der Rundenzahl genau einmal erfasst. Bereits bestätigte Treffer/Erfolge bleiben erhalten. Eine Timer-Runde, deren Timer bereits `ended` ist, wird beim direkten Speichern vor „Nächste Person“ ebenfalls genau einmal gezählt.

Damit gilt:

- laufender Timer + „Beenden & speichern“ → aktuelle Timer-Runde genau **1×** in History,
- `phase=ended` + „Beenden & speichern“ vor Next → aktuelle Timer-Runde genau **1×**,
- erst „Nächste Person“, später „Beenden & speichern“ → Runde bereits in `session.rounds`, **kein zweites +1**,
- „Abbrechen & verwerfen“ → **0 History-/Statistik-Einträge**, auch während Timer.

`tests/e2e/core-hub-controls.spec.js` schützt diese Exact-once-Grenze.

### 5. Statistik `best`

Der Hub-Wert `best` speichert den höchsten numerischen `score` einer Session. Weil die Bedeutung von `score` je Spiel unterschiedlich ist, ist `best` **nur innerhalb desselben Spiels** vergleichbar.

### 6. Keine erfundene Teamwertung

Scharade und Tabu können real als Teamspiel gespielt werden, aber die aktuelle App besitzt keine persistente Team-ID und keinen Team-Punktestand. Der globale Trefferzähler darf deshalb nicht als automatisch ermittelter Teamsieger dargestellt werden.

## Bekannte Produktgrenze

Location Spy verwendet derzeit denselben globalen Session-Zähler für zwei unterschiedliche erfolgreiche Pfade: korrekte Gruppenenttarnung und korrekten Ortsguess des Spions. Der eigentliche Rundensieger wird separat korrekt angezeigt. Bis ein echter Team-/Seitenpunktestand eingeführt wird, darf dieser Zähler nicht als Gruppen-gegen-Spion-Gesamtwertung beschrieben werden.

## Abnahmekriterien

Für den Release muss für jedes Kernspiel gelten:

- sichtbarer Text widerspricht diesem Vertrag nicht,
- Punktänderungen erfolgen höchstens einmal pro Aktion,
- Skip erzeugt keinen unerlaubten Punkt,
- Abbruch erzeugt keine Statistik,
- laufende/gerade beendete Timer-Runde wird bei Save exakt einmal gezählt,
- Rundensieger und numerischer Zähler werden nicht gleichgesetzt,
- Word Imposter behält individuellen Match-Punktestand und Rangliste,
- Mafia-Sieger wird ausschließlich aus lebender Rollenverteilung bestimmt,
- reale Gruppentests bestätigen die Verständlichkeit.