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

`tests/e2e/core-hub-timers.spec.js` bildet den Browservertrag für Pause/Fortsetzen ab. Die Suite ist vorhanden, aber wegen des weiterhin blockierten GitHub-Actions-Runners noch nicht als grün dokumentiert.

## Aktuelle Matrix

| Kernspiel | Engine | Timer | Wiederaufnahme | Statistik/Verlauf | aktueller technischer Status | manuell |
|---|---|---|---|---|---|---|
| Word Imposter | `game-engine.js` / `app.js` | ja | eigener v7-Spielstand | eigene geprüfte Engine | **TECHNISCH ABGESICHERT** – Rollenfairness und v7-Verträge vorhanden | offen |
| Wahrheit oder Pflicht | direkte Hub-Engine | nein | nicht persistiert | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** – Startversuch zählt nicht mehr als Play | offen |
| Ich habe noch nie | direkte Hub-Engine | nein | nicht persistiert | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** | offen |
| Wer würde eher? | direkte Hub-Engine | nein | nicht persistiert | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** | offen |
| Entweder oder | direkte Hub-Engine | nein | nicht persistiert | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** | offen |
| Paranoia | direkte Hub-Engine | nein | nicht persistiert | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT**, Sichtschutz real prüfen | offen |
| Scharade | direkte Hub-Engine | 60 s | Hintergrund: Pause; Reload: nicht persistiert | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** – gemeinsamer pausierbarer Timer; Browsernachweis vorbereitet | offen |
| Nicht sagen! / Tabu | direkte Hub-Engine | aktuell nein | nicht persistiert | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT**, gewünschte Rundendauer real prüfen | offen |
| Heiße Kartoffel | direkte Hub-Engine | Zufall 10–25 s | Hintergrund: Pause; Reload: nicht persistiert | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** – Zufallsrestzeit bleibt verborgen; Browsernachweis vorbereitet | offen |
| Wortkette | direkte Hub-Engine | 30 s | Hintergrund: Pause; Reload: nicht persistiert | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** – gemeinsamer pausierbarer Timer; Browsernachweis vorbereitet | offen |
| Zwei Wahrheiten, eine Lüge | Advanced Runner | rundenabhängig | aktive Advanced-Session | Advanced-Abschlussvertrag | **TECHNISCHE DETAILABNAHME OFFEN** | offen |
| Question Imposter | Advanced Runner | rundenabhängig | aktive Advanced-Session | Advanced-Abschlussvertrag | **TECHNISCHE DETAILABNAHME OFFEN** | offen |
| Location Spy | Advanced Runner | rundenabhängig | aktive Advanced-Session | Advanced-Abschlussvertrag | **TECHNISCHE DETAILABNAHME OFFEN** | offen |
| Mafia | Advanced Runner | phasenabhängig | aktive Advanced-Session | Advanced-Abschlussvertrag | **TECHNISCHE DETAILABNAHME OFFEN** | offen |
| Nur falsche Antworten | direkte Hub-Engine | nein | nicht persistiert | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** | offen |

## Bereits gefundener und behobener Kernspiel-Fehler

Vor dieser Abnahme erhöhte `party-hub.js` in `rememberRecent()` den Wert `plays` bereits beim Öffnen beziehungsweise Startversuch eines Spiels. Das passierte vor der eigentlichen Session und auch bei Link-Spielen. Dadurch konnten insbesondere Advanced-Spiele beim Öffnen und später beim Abschluss zweimal gezählt werden.

Der Vertrag ist jetzt getrennt:

1. **Öffnen:** aktualisiert ausschließlich `recent`.
2. **Direktes Hub-Spiel starten:** erhält eine stabile `sessionId`.
3. **Echter Hub-Abschluss:** verwendet `L.completionId('hub', ...)` und `L.recordCompletion(...)`.
4. **Link-/Advanced-Spiel:** die Zielengine ist allein für den echten Abschluss verantwortlich.

## Behobener Timer-Block

Die drei zeitgesteuerten direkten Hub-Kernspiele verwenden nicht mehr den alten privaten Timerpfad:

1. **Scharade:** `hubTimer.countdown(60, ...)`.
2. **Heiße Kartoffel:** zufällige 10–25 Sekunden laufen über denselben Controller, die Restzeit wird weiterhin nicht angezeigt.
3. **Wortkette:** `hubTimer.countdown(30, ...)`.
4. **Pause/Fortsetzen:** `#pause-hub-game` sperrt Rundenaktionen mit `inert` und lässt die Restzeit stehen.
5. **App-/Tab-Wechsel:** ein noch laufender Timer pausiert automatisch bei `visibilitychange` beziehungsweise `pagehide`.

**Noch offen:** Ein kompletter Seiten-Reload persistiert direkte Hub-Sessions und ihre Timerrestzeit weiterhin nicht. Das bleibt ein eigener Releasepunkt und darf nicht mit der Hintergrundpause verwechselt werden.

## Nächster technischer Block

Priorität vor weiterer Inhaltsarbeit:

1. Advanced-Kernspiele einzeln auf Sessionpersistenz, Abbruch und genau-einmal-Statistik prüfen.
2. Question Imposter und Location Spy auf Sichtschutz und geheime Informationen prüfen.
3. Mafia auf Rollenverteilung, Nacht-/Tag-Zustände, Siegbedingung und Abschluss prüfen.
4. Zwei Wahrheiten, eine Lüge auf Eingabe, Mischung, Abstimmung und Reload prüfen.
5. Danach die zehn direkten Hub-Kernspiele auf Skip/Sichtschutz/Punkte und mobile Accessibility prüfen.
6. Reload-Vertrag für direkte Hub-Sessions separat entscheiden und implementieren.

## Releasegrenze

Ein Kernspiel wird erst auf **RELEASE PASS** gesetzt, wenn:

- alle automatisierten Kernverträge grün sind,
- kein kritischer/hoher technischer Punkt offen ist,
- zutreffende Offline-, Timer-, Wiederaufnahme- und Accessibility-Fälle bestanden sind,
- Inhalt und Altersstufe redaktionell geprüft wurden,
- mindestens ein realer Gruppentest ohne Entwicklerhilfe dokumentiert ist.
