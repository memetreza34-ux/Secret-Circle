# Secret Circle – Kernspiel-Abnahme Januar 2027

Stand: 23. August 2026

Status: **15/15 CORE SOURCE HARDENING PREPARED / CI + REALGERÄTE + GRUPPENTESTS OFFEN**

Dieses Dokument trennt **im Code vorbereitet** von **wirklich bestanden**. Kein Eintrag ersetzt die finale Freigabe aus `RELEASE_CHECKLIST.md` oder die Evidence aus `release-evidence.json`.

## Statusbegriffe

- **TECHNISCH ABGESICHERT:** vorgesehener Engineweg und relevante Quell-/Testverträge sind vorhanden.
- **PREPARED:** Test/Abnahme ist angelegt, aber auf dem derzeit blockierten Runner nicht als grün nachgewiesen.
- **MANUELL OFFEN:** echte Browser-, Geräte-, Accessibility- oder Gruppentests fehlen.
- **RELEASE PASS:** erst nach grüner automatisierter Evidence und dokumentierter manueller Abnahme zulässig.

## 15/15 Hardening-Pass vom 23. August 2026

Der vollständige Core-Quellpass wurde einmal durchlaufen. Dabei wurden nicht nur Inhalte, sondern auch Setup, Resume, Geheimhaltung, Timer, Punkte und Anfänger-UX geprüft.

### Word Imposter

- Setup sperrt ungültige Spieler-/Imposter-Konfigurationen bereits vor Spielstart.
- Rollen bleiben unabhängig von der Kartenreihenfolge.
- ein eigener Resume-Guard verwirft inkonsistente Abstimmungsstände.
- geheime Karten werden bei Fokusverlust/Weitergabe verdeckt.
- Mehrfach-Imposter, Stichwahl, Voting und Punkte bleiben Engine-vertraglich getrennt.

### Direkte Hub-Spiele

- Wahrheit oder Pflicht, Ich habe noch nie, Wer würde eher? und Entweder oder zeigen ihre Rundenerklärung direkt im laufenden Spiel.
- persönliche Social-Games machen Freiwilligkeit und Skip ohne Begründung sichtbar.
- Paranoia verdeckt eine offene Geheimfrage bei App-/Tab-Wechsel.
- Scharade und Tabu verdecken offene Geheimkarten bei App-/Tab-Wechsel und erklären sichtbar, wer das Display sehen darf.
- Heiße Kartoffel verwendet jetzt exakt den dokumentierten Zufallsbereich **10–25 Sekunden**.
- Wortkette erklärt live Kategorie, letzten Buchstaben, Wiederholungsverbot und den manuellen Erfolgsabschluss.
- Nur falsche Antworten erklärt live den manuellen Verlierer: richtige oder nach Gruppenregel zu langsame Antwort verliert; die App vergibt bewusst keine Punkte.
- der Hub-Resume-Vertrag lehnt gekreuzte Timerzustände ab, z. B. einen Scharade-Timer in einer anderen Spielart.

### Advanced Core

Für Zwei Wahrheiten/eine Lüge, Question Imposter, Location Spy und Mafia wurden zwei zusätzliche Schutzschichten ergänzt:

- `advanced-privacy-guard.js`: verdeckt private Eingaben, Fragen, Orte, Rollen, Moderatorübersichten und andere sensible Zustände bei Fokusverlust.
- `advanced-resume-guard.js`: validiert spielinterne Resume-Zustände vor dem Runner.

Der Resume-Guard prüft u. a.:

- Spielerzugehörigkeit und eindeutige Spielerlisten,
- zulässige Phasen,
- Two-Truths-Lügenindex und Ergebnis-Konsistenz,
- Question-Imposter-Rolle und Abstimmung,
- Location-Spy-Spion/Ergebnis,
- Mafia-Rollenanzahl pro Gruppengröße und Pack,
- `alive`-Menge,
- zulässige Rollen,
- Mafia-Sieger ausschließlich aus der lebenden Rollenverteilung.

Manipulierte oder widersprüchliche Advanced-Snapshots werden vor dem Resume verworfen.

## Gemeinsame technische Verträge

Wichtige automatisierte Nachweise:

- `tests/core-game-contract.test.js`
- `tests/core-scoring-contract.test.js`
- `tests/core-content-quality.test.js`
- `tests/word-imposter-resume-guard.test.js`
- `tests/party-hub-resume-guard.test.js`
- `tests/hub-timer-contract.test.js`
- `tests/hub-resume-contract.test.js`
- `tests/hub-control-contract.test.js`
- `tests/advanced-resume-contract.test.js`
- `tests/advanced-resume-guard.test.js`
- `tests/mafia-rules.test.js`
- `tests/service-worker.test.js`

Relevante vorbereitete Browserverträge:

- `tests/e2e/core-hub-controls.spec.js`
- `tests/e2e/core-hub-timers.spec.js`
- `tests/e2e/core-hub-resume.spec.js`
- `tests/e2e/advanced-secret-resume.spec.js`
- `tests/e2e/advanced-resume-integrity.spec.js`
- weitere vorhandene Advanced-/Completion-/Mafia-E2E-Specs.

Diese Tests sind **nicht als grün dokumentiert**, solange GitHub Actions vor dem Checkout/den eigentlichen Schritten scheitert.

## Aktuelle Matrix

| Kernspiel | Technik nach Quellpass | Wichtiger Schutz | Manueller Status |
|---|---|---|---|
| Word Imposter | TECHNISCH ABGESICHERT | Setup, Rollenfairness, Voting-/Resume-Guard, Secret Cover | offen |
| Wahrheit oder Pflicht | TECHNISCH ABGESICHERT | Freiwilligkeit, Skip, klare Rundenführung | offen |
| Ich habe noch nie | TECHNISCH ABGESICHERT | Freiwilligkeit + Live-Regel | offen |
| Wer würde eher? | TECHNISCH ABGESICHERT | freiwillige Diskussion + Live-Regel | offen |
| Entweder oder | TECHNISCH ABGESICHERT | klare A/B-Rundenregel | offen |
| Paranoia | TECHNISCH ABGESICHERT | Geheimfrage bei Fokusverlust verdeckt | offen |
| Scharade | TECHNISCH ABGESICHERT | 60-s-Timer, Resume pausiert, Geheimkarte geschützt | offen |
| Nicht sagen! / Tabu | TECHNISCH ABGESICHERT | 60-s-Timer, Resume pausiert, Geheimkarte geschützt | offen |
| Heiße Kartoffel | TECHNISCH ABGESICHERT | versteckter Timer exakt 10–25 s | offen |
| Wortkette | TECHNISCH ABGESICHERT | 30-s-Timer + sichtbarer Regelvertrag | offen |
| Zwei Wahrheiten, eine Lüge | TECHNISCH ABGESICHERT | Privacy Guard + Outcome-Resume-Validierung | offen |
| Question Imposter | TECHNISCH ABGESICHERT | Secret Cover + Rollen-/Vote-Resume-Validierung | offen |
| Location Spy | TECHNISCH ABGESICHERT | Secret Cover + Spion-/Ergebnis-Validierung | offen |
| Mafia | TECHNISCH ABGESICHERT | Moderatorprivacy + Rollen-/Alive-/Winner-Integrität | offen |
| Nur falsche Antworten | TECHNISCH ABGESICHERT | klare manuelle Verlustregel, scorelos | offen |

## Punkte- und Siegervertrag

`CORE_SCORING_RULES.md` bleibt verbindlich.

Wichtig:

- nur Word Imposter besitzt individuelle Matchpunkte und eine Rangliste.
- Scharade, Tabu und Wortkette führen Session-/Erfolgszähler, keine automatisch ermittelten Teamsieger.
- Truth/Dare, Never Have, Most Likely, Would Rather, Paranoia, Hot Potato und Wrong Answers bleiben scorelos bzw. besitzen nur manuelle Rundenergebnisse.
- Advanced-Scores sind Erfolgszähler; Mafia- und Location-Spy-Sieger werden separat aus der jeweiligen Spielregel ermittelt.
- Skip erzeugt keinen unerlaubten Punkt.
- Abbruch erzeugt keinen fertigen Verlaufseintrag.

## Offline-/Resume-Vertrag

- Word Imposter besitzt eigenen Spielstand + eigenen Resume-Guard.
- direkte Hub-Spiele verwenden `secret-circle-party-hub-active-v1`.
- Advanced Core verwendet `secret-circle-party-active-v1`.
- Timerzustände müssen zur aktuellen Spielart passen.
- Advanced-Rundenzustände müssen logisch zum jeweiligen Spiel passen.
- sensible Inhalte werden nach Reload nicht automatisch geöffnet.
- laufende Timer werden nach Resume bewusst pausiert rekonstruiert.
- `advanced-resume-guard.js` und `advanced-privacy-guard.js` sind Bestandteil des Offline-Core.

## Was noch **nicht** bestanden ist

1. GitHub Actions / Online-`npm ci` / vollständiges `npm run ci`.
2. Cross-Browser-Lauf auf demselben Release-Commit.
3. Android, iPhone/iPad und Tablet real.
4. installierte PWA: Offline-Neustart, Upgrade und Rollback.
5. VoiceOver, TalkBack, Tastatur und 200-%-Zoom.
6. mindestens ein echter Gruppentest pro Core-Spiel ohne Entwicklerhilfe.
7. große Gruppen insbesondere für Word Imposter, Paranoia und Mafia.
8. finaler Content-/Visual-/Asset-/Rechte-Sign-off.
9. unveränderlicher RC + vollständige Release Evidence.

## Releasegrenze

Der 15/15-Quellpass bedeutet **PREPARED**, nicht `RELEASE PASS`.

Ein Core-Spiel erhält erst `RELEASE PASS`, wenn:

- die relevanten automatisierten Verträge auf dem finalen Commit grün sind,
- kein kritischer/hoher technischer Fund offen ist,
- relevante Offline-/Timer-/Resume-/Accessibility-Fälle real bestanden sind,
- Inhalt und Altersstufe final abgenommen sind,
- mindestens ein realer Gruppentest dokumentiert ist.
