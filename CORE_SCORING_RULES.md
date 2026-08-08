# Secret Circle – Punkte- und Siegervertrag der 15 Kernspiele

Stand: 8. August 2026

Dieses Dokument definiert, **was die App tatsächlich zählt** und **was als Rundensieger oder Matchsieger gilt**. Ein Zähler ist nicht automatisch ein Siegerpunktestand.

## Begriffe

- **Matchpunkte:** Punkte gehören konkreten Personen und bestimmen einen Matchstand.
- **Session-Zähler:** Die App zählt erfolgreiche Aktionen/Runden, ordnet sie aber keiner Person oder keinem Team zu.
- **Erfolgszähler:** Die App zählt bestimmte erfolgreiche Gruppenaktionen; der Rundensieger wird separat bestimmt.
- **Scorelos:** Die App erklärt keinen Punktestand. Die Gruppe spielt nur die Karten/Runden.
- **Manuelles Rundenergebnis:** Die Gruppe erkennt selbst, wer eine Runde verliert oder gewinnt; die App führt daraus keinen Gesamtstand.

## Verbindliche Matrix

| Kernspiel | App-Zähler | Regel | Rundensieger | Gesamtsieger |
|---|---|---|---|---|
| Word Imposter | **individuelle Matchpunkte** | Unschuldige erhalten je +1, wenn ein Imposter gewählt wird und den Begriff nicht errät. Imposter erhalten je +2, wenn kein Imposter eliminiert wird oder der eliminierte Imposter den Begriff richtig errät. | `innocents` oder `imposters` | Rangliste nach den individuellen Punkten nach der festgelegten Rundenzahl |
| Wahrheit oder Pflicht | **scorelos** | Erledigte Karten erhöhen nur die Rundenzahl. | keiner durch die App | keiner |
| Ich habe noch nie | **scorelos** | Jede Karte ist eine Gesprächsrunde. | keiner | keiner |
| Wer würde eher? | **scorelos** | Abstimmung dient nur der Unterhaltung. | keiner | keiner |
| Entweder oder | **scorelos** | Auswahl und Diskussion ohne Punkte. | keiner | keiner |
| Paranoia | **scorelos** | Münzwurf entscheidet nur, ob die geheime Frage aufgedeckt wird. | keiner | keiner |
| Scharade | **Session-Zähler „Treffer“** | Jeder bestätigte Treffer während der 60-Sekunden-Runde erhöht den Session-Zähler um 1. Übersprungene Begriffe geben keinen Treffer. | App erklärt keinen formalen Rundensieger. | keiner; Teams/Einzelvergleich kann die Gruppe außerhalb des App-Zählers führen |
| Nicht sagen! / Tabu | **Session-Zähler „Treffer“** | Jeder bestätigte Treffer während der 60-Sekunden-Runde erhöht den Session-Zähler um 1. Übersprungene Begriffe geben keinen Treffer. | App erklärt keinen formalen Rundensieger. | keiner; Teams/Einzelvergleich kann die Gruppe außerhalb des App-Zählers führen |
| Heiße Kartoffel | **scorelos** | Der zufällige Timer bleibt verborgen. Wer das Gerät bei Ablauf hält, verliert die Runde. | Person mit Gerät verliert die Runde. | keiner |
| Wortkette | **Session-Zähler „geschaffte Runden“** | „Runde geschafft“ erhöht den Session-Zähler um 1. Zeitablauf oder globales Überspringen gibt keinen Punkt. | App erklärt nur geschafft/nicht geschafft. | keiner |
| Zwei Wahrheiten, eine Lüge | **Erfolgszähler** | Findet die Gruppe die Lüge, steigt der Session-Zähler um 1. | Gruppe bei richtiger Wahl, sonst Autor/Autorin („gut getäuscht“). | keiner; Session-Zähler misst nur erkannte Lügen |
| Question Imposter | **Erfolgszähler** | Findet die Gruppe den Question Imposter, steigt der Session-Zähler um 2. | Gruppe bei korrekter Wahl, sonst Question Imposter. | keiner; Session-Zähler misst nur erfolgreiche Enttarnungen |
| Location Spy | **Erfolgszähler** | Gruppe +2 bei korrekter Spionwahl; Spionpfad erhöht den aktuellen Session-Zähler um 2, wenn der Ort korrekt erraten wird. | Spion gewinnt bei richtig erratenem Ort oder falscher Gruppenwahl; sonst Gruppe. | keiner; der aktuelle globale Zähler darf nicht als Teamrangliste interpretiert werden |
| Mafia | **Erfolgszähler** | Eine per Tageswahl eliminierte Mafia-Rolle erhöht den Session-Zähler um 3. | Dorf gewinnt bei 0 lebenden Mafia; Mafia gewinnt, sobald lebende Mafia mindestens so zahlreich wie das restliche Dorf ist. | der Sieger ist die Seite aus der Mafia-Siegbedingung; der Session-Zähler bestimmt den Sieger nicht |
| Nur falsche Antworten | **scorelos / manuelles Rundenergebnis** | Wer korrekt antwortet oder nach Gruppenregel zu lange braucht, verliert die Runde. Die App speichert keinen individuellen Verlustpunkt. | manuell durch die Gruppe | keiner |

## Release-Regeln

### 1. Score und Sieger dürfen nicht vermischt werden

`session.score` im Party Hub und Advanced Runner ist bei mehreren Spielen nur ein **Session-/Erfolgszähler**. Nur Word Imposter besitzt einen individuellen Punktestand pro Person und eine Rangliste.

### 2. Globale Hub-Aktion „Runde überspringen“

Die gemeinsame Hub-Aktion beendet die aktuelle Runde, erhöht die Rundenzahl und gibt **keinen Punkt**. Spielinterne Begriffs-Skips bei Scharade und Tabu wechseln dagegen nur die aktuelle Karte und beenden die 60-Sekunden-Runde nicht.

### 3. Abbruch ist kein Ergebnis

**„Abbrechen & verwerfen“** erzeugt keinen Verlauf, keine Statistik und keinen Sieger. **„Beenden & speichern“** speichert den bis dahin bewusst erspielten Stand.

### 4. Statistik `best`

Der Hub-Wert `best` speichert den höchsten numerischen `score` einer Session. Weil die Bedeutung von `score` je Spiel unterschiedlich ist, ist `best` **nur innerhalb desselben Spiels** vergleichbar.

### 5. Keine erfundene Teamwertung

Scharade und Tabu können in der realen Gruppe als Teamspiel gespielt werden, aber die aktuelle App besitzt **keine persistente Team-ID und keinen Team-Punktestand**. Die Oberfläche darf deshalb den globalen Trefferzähler nicht als automatisch ermittelten Teamsieger darstellen.

## Bekannte Produktgrenze

Location Spy verwendet derzeit denselben globalen Session-Zähler für zwei unterschiedliche erfolgreiche Pfade: korrekte Gruppenenttarnung und korrekten Ortsguess des Spions. Der eigentliche Rundensieger wird separat korrekt angezeigt. Bis ein echter Team-/Seitenpunktestand eingeführt wird, darf dieser Zähler nicht als Gruppen-gegen-Spion-Gesamtwertung beschrieben werden.

## Abnahmekriterien

Für den Release muss für jedes Kernspiel gelten:

- sichtbarer Text widerspricht diesem Vertrag nicht,
- Punktänderungen erfolgen höchstens einmal pro Aktion,
- Skip erzeugt keinen unerlaubten Punkt,
- Abbruch erzeugt keine Statistik,
- Rundensieger und numerischer Zähler werden nicht gleichgesetzt, wenn sie unterschiedliche Bedeutung haben,
- Word Imposter behält seinen individuellen Match-Punktestand und die Rangliste,
- Mafia-Sieger wird ausschließlich aus der lebenden Rollenverteilung bestimmt,
- reale Gruppentests bestätigen, dass Spieler ohne Entwicklererklärung verstehen, ob ein Spiel Punkte besitzt und wie eine Runde endet.
