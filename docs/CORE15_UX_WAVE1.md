# Core 15 – UX-Qualitätsprüfung, Welle 1

Stand: 9. Oktober 2026  
Basis: `design/v2-gesamt`, v2-Hub und die bestehenden Spiel-Engines  
Status: **Quell-/Testvorbereitung; reale Gruppentests offen.** Diese Datei bedeutet **keine** Release-Freigabe.

## Ziel

Die 15 Kernspiele müssen nicht nur technisch starten, sondern von einer Gruppe auf einem einzigen Handy ohne Entwicklerhilfe verstanden und bequem gespielt werden können. Keine neuen Spielmodi vor dieser Qualitätsrunde.

## Automatisierter Einstiegstest

`tests/e2e/core15-entry-ux.spec.js` prüft alle **15** veröffentlichten Core-Routen aus dem tatsächlichen Katalog:

1. Ein Spiel lässt sich aus der v2-Spieldetailseite aufrufen.
2. Titel, Kurzbeschreibung und mindestens ein Regelschritt sind vorhanden.
3. Mit einer zulässigen 8-Personen-Gruppe ist „Start“ freigeschaltet.
4. Der Start öffnet den **richtigen** Spiel-Runner (Word Imposter / Party Hub / Advanced).
5. Die jeweilige Spiel-Oberfläche erscheint und wirft dabei keinen JS-Seitenfehler.

Hinweis: Dieser Test ersetzt **nicht** das vollständige Durchspielen. Die vorhandenen Timer-, Privacy-, Resume-, Advanced- und Completion-Tests bleiben zusätzlich verbindlich.

## Core-Matrix – konkrete Gruppentest-Skripte

| Spiel | Einstieg | Wichtigster Gruppen-Test | UX-Risiko / nächste Prüfung |
|---|---|---|---|
| Word Imposter | eigener Runner | 3, 4, 6, 10 Personen; geheim verteilen; Stichwahl; Gruppe entscheidet Tipp | abgeschlossene Tests für PR #22 und Freigabe separat |
| Wahrheit oder Pflicht | direkter Hub | freiwillig Wahrheit/Pflicht auswählen, Skip ohne Begründung, nächste Person | kein Drängeln zum Mitmachen; Buttons beim Weitergeben groß genug |
| Ich habe noch nie | direkter Hub | alle reagieren gleichzeitig; nächste Karte; Skip | Thema und Freiwilligkeit sofort verständlich |
| Wer würde eher? | direkter Hub | alle zeigen gleichzeitig; Wechsel ohne App-Punktestand | wer gerade dran ist und wie entschieden wird klar |
| Entweder oder | direkter Hub | A/B-Frage, sofort neue Karte, Wechsel | darf sich nicht wie Quiz mit richtiger Lösung anfühlen |
| Paranoia | direkter Hub | geheime Frage, Name nennen, Münzwurf, Handy sperren, Reload | keinerlei Geheimtext beim Weitergeben oder Wiederaufnehmen |
| Scharade | direkter Hub | Begriff nur aktivem Spieler zeigen; 60-S-Timer; Treffer/Skip; neue Person | kein versehentliches Anzeigen für die gesamte Gruppe |
| Nicht sagen! / Tabu | direkter Hub | Wort + verbotene Wörter geheim; 60-S-Timer; Treffer/Skip | lange verbotene Wörter auf kleinen Displays gut lesbar |
| Heiße Kartoffel | direkter Hub | versteckter Zufallstimer 10–25 s; Handy schnell weitergeben | kein sichtbarer Restzeit-Leak, akustischer/visueller STOPP klar |
| Wortkette | direkter Hub | Anfangsbuchstabe/letzter Buchstabe; 30-S-Timer; Gewinnerklärung | manuelle Bestätigung wird verstanden, keine falschen Siegerpunkte |
| Zwei Wahrheiten, eine Lüge | Advanced | private Eingabe, andere tippen, Ergebnis und Reload | private Texte beim Gerätewechsel immer verborgen |
| Question Imposter | Advanced | unterschiedliche geheime Fragen, Voting, Ergebnis | falsche Frage nicht für andere sichtbar |
| Location Spy | Advanced | jeder erhält Ort/Rolle geheim; Diskussion; Spion-Tipp | verdeckte Rollen und Ergebnis bleiben bei Resume geschützt |
| Mafia | Advanced | Moderator; Nacht-/Tag-Wechsel; eliminierte Rollen; Spielende | Moderator-Privatsphäre und tote Spieler, Gruppe mit 6–10 Personen |
| Nur falsche Antworten | direkter Hub | absichtlich falsch antworten; manuell Verlierer; nächste Karte | kein impliziter Punktestand oder verwirrende „richtig“-Taste |

## Bewertungsmaßstab pro Spiel

- **Verständlichkeit:** Start ohne vorherige externe Anleitung; höchstens ein kurzer Regelhinweis.
- **Bedienaufwand:** keine unnötigen Textfelder oder Tipp-Kaskaden mitten in einer Runde.
- **Privatsphäre:** geheimen Inhalt nie automatisch nach Neuaufruf, Fokusverlust oder Weitergabe zeigen.
- **Tempo:** große, eindeutige Aktionen; „Weiter“, „Überspringen“, „Ergebnis“ dürfen nicht verwechselt werden.
- **Fehlertoleranz:** Zurück, Neuladen, Sperrbildschirm und Unterbrechung erzeugen keine doppelten Punkte oder Kartenverluste.
- **Barrierefreiheit:** auf 320px-Bildschirm, 200%-Zoom, per Tastatur und Screenreader verwendbar.
- **Fairness:** errechnete Punkte nur dort, wo die Spielregeln sie vorsehen.
- **Wiederholbarkeit:** anderes Pack, nächste Runde und Spiel beenden ohne Datenverlust.

## Priorisierung

**P0** – Codefehler, private Daten sichtbar, falsche Gewinner/Punkte, kaputter Resume-Flow: sofort beheben.  
**P1** – unnötige Taps, unverständliche Aktion/Übergabe, Mobile-Overflow, unklare Bedienung: vor V1.  
**P2** – Animationen und visuelle Bildwelt: nach dem technischen UX-Pass.

## Konkrete nächste Wellen

- **Welle A (hier begonnen):** alle 15 Einstiege per Chromium/WebKit prüfen; Word Imposter PR #22 separat abschließen.
- **Welle B (automatisiert vorbereitet):** Wahrheit/Pflicht, Ich habe noch nie, Wer würde eher?, Entweder oder und Paranoia. In `tests/e2e/core15-social-ux.spec.js` werden Rundenwechsel, freiwilliges Überspringen, scorelose Spielregeln, A/B-Entscheidungen sowie Paranoia-Geheimhaltung über Reload geprüft. Ein echter 4–8-Personen-Gruppentest bleibt offen.
- **Welle C:** Scharade, Tabu, Heiße Kartoffel, Wortkette und Nur falsche Antworten; Timer und Weitergabe.
- **Welle D:** Vier Advanced-Modi inklusive Mafia, Rollenschutz und Abbruch/Resume.
- **Abnahme:** reales Android + iPhone; je ein moderierter und ein unmoderierter Gruppentest pro Core-Spiel dokumentieren.

### Belege

Die Quelle für die 15 IDs ist `party-release-structure.js` / `tests/core-game-contract.test.js`; technische Status und bislang offene manuelle Prüfungen stehen in `CORE_GAME_ACCEPTANCE.md`. Automatische grüne Tests allein reichen nicht für `RELEASE PASS`.
