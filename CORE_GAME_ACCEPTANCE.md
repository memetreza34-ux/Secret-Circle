# Secret Circle – Kernspiel-Abnahme Januar 2027

Stand: 7. August 2026

Dieses Dokument trennt **technisch vorhanden**, **automatisch abgesichert**, **noch technisch zu korrigieren** und **manuell zu testen**. Kein Eintrag in dieser Matrix ersetzt die finale Freigabe aus `RELEASE_CHECKLIST.md`.

## Statusbegriffe

- **TECHNISCH ABGESICHERT:** aktueller Code besitzt den vorgesehenen Engineweg und relevante automatisierte Verträge.
- **TECHNISCH OFFEN:** ein konkreter Codepunkt muss vor der Kernspielabnahme verbessert werden.
- **MANUELL OFFEN:** technische Grundlage vorhanden, reale Browser-/Geräte-/Gruppenprüfung fehlt.
- **RELEASE PASS:** erst nach vollständig dokumentierter automatisierter und manueller Abnahme zulässig.

## Gemeinsame maschinelle Mindestanforderungen

`tests/core-game-contract.test.js` prüft für alle 15 Kernspiele:

- Spiel-ID existiert exakt einmal in der Kernliste.
- finaler Katalogstatus ist `playable`.
- Spielergrenzen sind ganzzahlig, geordnet und höchstens 20.
- Dauer liegt in einem begrenzten Bereich.
- Altersstufe ist bekannt.
- Regeln bestehen aus 1–4 eindeutigen, nicht leeren Schritten.
- mindestens ein Pack ist vorhanden.
- jedes deklarierte Pack besitzt Inhalt.
- Word Imposter routet zu `index.html`.
- vier Advanced-Kernspiele routen zu `advanced.html`.
- zehn einfache Kernspiele bleiben in der direkten Hub-Engine.
- das bloße Öffnen eines Hub- oder Link-Spiels erhöht `plays` nicht.
- direkte Hub-Abschlüsse verwenden `session-ledger.js`.

`tests/hub-timer-contract.test.js` prüft zusätzlich:

- Hub-Timer verwenden `party-session-controls.js`.
- kein privater `activeTimer`, `window.setInterval` oder `performance.now()` bleibt im Hub-Timerpfad.
- Scharade verwendet den gemeinsamen 60-Sekunden-Countdown.
- Heiße Kartoffel verwendet den gemeinsamen verdeckten Zufalls-Countdown.
- Wortkette verwendet den gemeinsamen 30-Sekunden-Countdown.
- ein laufender Hub-Timer wird bei `visibilitychange` in den Hintergrund automatisch pausiert.

`tests/advanced-resume-contract.test.js` schützt den Advanced-Wiederaufnahmevertrag:

- Runtime Guard und Advanced Runner verwenden denselben Schlüssel `secret-circle-party-active-v1`.
- geöffnete private Fragen, Orte und Rollen werden nach Reload wieder verdeckt.
- eine offene Mafia-Moderatorübersicht verlangt nach Reload erneut die bewusste Bestätigung.

`tests/mafia-rules.test.js` schützt den Mafia-Regelvertrag:

- 6–7 Personen: 1 Mafia.
- 8–11 Personen: 2 Mafia.
- 12–15 Personen: 3 Mafia.
- 16–20 Personen: 4 Mafia.
- `Schnell`: Mafia, Detektiv, Dorfbewohner.
- `Klassisch`: zusätzlich Arzt ab passender Gruppengröße.
- `Erweitert`: zusätzlich echter Beschützer mit eigener Nachtaktion.

Vorbereitete Browserverträge:

- `tests/e2e/core-hub-timers.spec.js`
- `tests/e2e/advanced-core-smoke.spec.js`
- `tests/e2e/advanced-core-abort.spec.js`
- `tests/e2e/advanced-secret-resume.spec.js`
- `tests/e2e/advanced-core-round-flow.spec.js`
- `tests/e2e/advanced-completion-exact-once.spec.js`
- `tests/e2e/mafia-extended.spec.js`

Sie sind wegen des weiterhin blockierten GitHub-Actions-Runners noch nicht als grün dokumentiert.

## Aktuelle Matrix

| Kernspiel | Engine | Timer | Wiederaufnahme | Statistik/Verlauf | aktueller technischer Status | manuell |
|---|---|---|---|---|---|---|
| Word Imposter | `game-engine.js` / `app.js` | ja | eigener v7-Spielstand | eigene geprüfte Engine | **TECHNISCH ABGESICHERT** – Rollenfairness und v7-Verträge vorhanden | offen |
| Wahrheit oder Pflicht | direkte Hub-Engine | nein | Reload noch offen | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** – Startversuch zählt nicht mehr als Play | offen |
| Ich habe noch nie | direkte Hub-Engine | nein | Reload noch offen | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** | offen |
| Wer würde eher? | direkte Hub-Engine | nein | Reload noch offen | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** | offen |
| Entweder oder | direkte Hub-Engine | nein | Reload noch offen | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** | offen |
| Paranoia | direkte Hub-Engine | nein | Reload noch offen | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT**, Sichtschutz real prüfen | offen |
| Scharade | direkte Hub-Engine | 60 s | Hintergrund: Pause; Reload offen | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** – gemeinsamer pausierbarer Timer | offen |
| Nicht sagen! / Tabu | direkte Hub-Engine | aktuell nein | Reload noch offen | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT**, gewünschte Rundendauer real prüfen | offen |
| Heiße Kartoffel | direkte Hub-Engine | Zufall 10–25 s | Hintergrund: Pause; Reload offen | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** – Zufallsrestzeit bleibt verborgen | offen |
| Wortkette | direkte Hub-Engine | 30 s | Hintergrund: Pause; Reload offen | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** – gemeinsamer pausierbarer Timer | offen |
| Zwei Wahrheiten, eine Lüge | Advanced Runner | rundenabhängig | aktive Advanced-Session | stabiler Advanced-Abschluss | **TECHNISCH ABGESICHERT** – Eingabe/Mischen/Abstimmung als Browservertrag vorbereitet | offen |
| Question Imposter | Advanced Runner | rundenabhängig | sichere aktive Advanced-Session | stabiler Advanced-Abschluss | **TECHNISCH ABGESICHERT** – geöffnete Geheimfrage wird nach Reload wieder verdeckt | offen |
| Location Spy | Advanced Runner | rundenabhängig | sichere aktive Advanced-Session | stabiler Advanced-Abschluss | **TECHNISCH ABGESICHERT** – geöffneter Ort/Spionzustand wird nach Reload wieder geschützt | offen |
| Mafia | Advanced Runner | phasenabhängig | sichere aktive Advanced-Session | stabiler Advanced-Abschluss | **TECHNISCH ABGESICHERT** – skalierte Mafia, Packregeln, Arzt/Detektiv/Beschützer, sichere Moderator-Wiederaufnahme | offen |
| Nur falsche Antworten | direkte Hub-Engine | nein | Reload noch offen | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** | offen |

## Behobene Kernspiel-Fehler

### Hub-Statistik

Vor der Abnahme erhöhte `party-hub.js` `plays` bereits beim Öffnen beziehungsweise Startversuch. Dadurch konnten insbesondere Advanced-Spiele doppelt gezählt werden.

Jetzt gilt:

1. **Öffnen:** aktualisiert ausschließlich `recent`.
2. **Direktes Hub-Spiel starten:** erhält eine stabile `sessionId`.
3. **Echter Hub-Abschluss:** verwendet `L.completionId('hub', ...)` und `L.recordCompletion(...)`.
4. **Link-/Advanced-Spiel:** die Zielengine ist allein für den echten Abschluss verantwortlich.

### Hub-Timer

- Scharade: gemeinsamer 60-Sekunden-Countdown.
- Heiße Kartoffel: gemeinsamer verdeckter Zufalls-Countdown.
- Wortkette: gemeinsamer 30-Sekunden-Countdown.
- Pause/Fortsetzen sperrt Rundenaktionen mit `inert`.
- App-/Tab-Wechsel pausiert einen noch laufenden Timer automatisch.

### Advanced-Wiederaufnahme und PWA

- Der PWA-Update-Schutz verwendete zuvor einen anderen Advanced-Speicherschlüssel als der Runner. Beide verwenden jetzt `secret-circle-party-active-v1`.
- `revealed: true` wird beim Laden einer privaten Reveal-Phase auf `false` zurückgesetzt.
- Eine persistierte Mafia-Moderatorübersicht fällt beim Resume wieder auf den geschützten Moderator-Schritt zurück.
- Die vorbereiteten E2E-Verträge verwenden jetzt ebenfalls den echten Schlüssel und die ausdrücklich notwendige Schaltfläche „Session fortsetzen“.

### Mafia

- Die frühere Rolleinteilung erzeugte unabhängig von der Gruppengröße genau eine Mafia.
- Der ausgewählte Mafia-Packtyp beeinflusste die Rollen nicht.
- `Erweitert` deklarierte einen Beschützer, ohne eine Beschützer-Mechanik zu besitzen.

Jetzt skaliert die Mafiaanzahl mit der Gruppe; Schnell, Klassisch und Erweitert besitzen unterschiedliche Rollenverträge. Der Beschützer ist als Nachtaktion umgesetzt und kann nicht dieselbe Person in zwei aufeinanderfolgenden Nächten schützen.

## Noch technisch offen

1. Direkte Hub-Sessions werden bei einem vollständigen Seiten-Reload noch nicht wiederhergestellt.
2. Damit wird auch die exakte Timerrestzeit direkter Hub-Spiele über Reload noch nicht persistiert.
3. Tabu benötigt noch eine Produktentscheidung, ob eine feste Rundenuhr Teil des Kernmodus sein soll.
4. Automatisierte Browserverträge benötigen einen tatsächlich laufenden Playwright-/Actions-Runner.
5. Reale Geräte-, Accessibility-, Inhalts- und Gruppentests sind noch offen.

## Nächster technischer Block

1. sicheren Reload-/Resume-Vertrag für direkte Hub-Sessions implementieren.
2. dabei Paranoia und andere private Zustände nach Reload standardmäßig verdeckt halten.
3. Timerzustände für Scharade, Heiße Kartoffel und Wortkette über Reload definiert wiederherstellen oder bewusst als neue Runde starten.
4. danach direkte Hub-Kernspiele auf Skip, Punkte, Fokus und mobile Bedienung prüfen.
5. anschließend Inhalts- und Altersprüfung starten.

## Releasegrenze

Ein Kernspiel wird erst auf **RELEASE PASS** gesetzt, wenn:

- alle automatisierten Kernverträge grün sind,
- kein kritischer/hoher technischer Punkt offen ist,
- zutreffende Offline-, Timer-, Wiederaufnahme- und Accessibility-Fälle bestanden sind,
- Inhalt und Altersstufe redaktionell geprüft wurden,
- mindestens ein realer Gruppentest ohne Entwicklerhilfe dokumentiert ist.
