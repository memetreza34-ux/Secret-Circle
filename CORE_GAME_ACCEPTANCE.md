# Secret Circle – Kernspiel-Abnahme Januar 2027

Stand: 8. August 2026

Dieses Dokument trennt **technisch vorhanden**, **automatisch abgesichert**, **noch technisch zu korrigieren** und **manuell zu testen**. Kein Eintrag ersetzt die finale Freigabe aus `RELEASE_CHECKLIST.md`.

## Statusbegriffe

- **TECHNISCH ABGESICHERT:** aktueller Code besitzt den vorgesehenen Engineweg und relevante automatisierte Verträge.
- **TECHNISCH OFFEN:** ein konkreter Codepunkt muss vor der Kernspielabnahme verbessert werden.
- **MANUELL OFFEN:** technische Grundlage vorhanden, reale Browser-/Geräte-/Gruppenprüfung fehlt.
- **RELEASE PASS:** erst nach vollständig dokumentierter automatisierter und manueller Abnahme zulässig.

## Gemeinsame maschinelle Mindestanforderungen

`tests/core-game-contract.test.js` prüft für alle 15 Kernspiele unter anderem Katalogstatus, Spielergrenzen, Altersstufe, Regeln, Packs, Routing und den genau-einmal-Abschluss direkter Hub-Spiele.

Die direkten Hub-Timer besitzen eine feste Modulgrenze:

- `party-hub.js` besitzt Session, Ledger, Navigation, globale Bedienung und nicht zeitgesteuerte Hub-Spiele.
- `party-hub-timers.js` besitzt Timer-State-Normalisierung sowie Scharade, Tabu, Heiße Kartoffel und Wortkette.
- `party.html` lädt `party-session-controls.js` vor `party-hub-timers.js` und dieses wiederum vor `party-hub.js`.
- beide Produktionsmodule müssen unter 1.000 Zeilen bleiben; die Performancebudgets liegen bei 50 KB beziehungsweise 18 KB.

`tests/hub-timer-contract.test.js` schützt die vier zeitgesteuerten Hub-Kernspiele:

- Scharade, Tabu, Heiße Kartoffel und Wortkette verwenden `party-session-controls.js`.
- kein privater `activeTimer`, `window.setInterval` oder `performance.now()` bleibt in einem der beiden Hub-Module.
- die aktuelle Restzeit wird über `remainingMilliseconds()` serialisiert.
- Hintergrundwechsel pausieren laufende Timer.
- wiederhergestellte Timer starten bewusst pausiert.
- der Test schützt zusätzlich den Modul-Split und die Script-Reihenfolge.

`tests/hub-resume-contract.test.js` schützt den direkten Hub-Wiederaufnahmevertrag:

- aktiver Spielstand: `secret-circle-party-hub-active-v1`, Version 1.
- stabile Ledger-Session-ID und Spieler-Snapshot pro Session.
- gespeicherter Zustand wird validiert und beschädigter Zustand verworfen.
- Wiederaufnahme erfolgt nur über **„Session fortsetzen“**, nie automatisch.
- ein gespeicherter Stand kann ohne Statistik-/Verlaufseintrag verworfen werden.
- private Inhalte werden nach einem Reload nicht automatisch wieder geöffnet.
- Scharade, Tabu und Wortkette speichern Restzeit und aktuelle Rundendaten; Heiße Kartoffel speichert dieselbe interne Restzeit, zeigt sie aber weiterhin nicht an.
- der PWA-Update-Schutz erkennt den aktiven Hub-Spielstand.

`tests/hub-control-contract.test.js` und `scripts/hub_control_audit.py` schützen die direkte Hub-Bedienung:

- **Beenden & speichern** und **Abbrechen & verwerfen** sind getrennte Aktionen.
- Abbruch benötigt eine Bestätigung und schreibt niemals einen fertigen Verlaufseintrag.
- Escape verwendet denselben bestätigten Abbruchpfad statt still eine Session zu speichern.
- **Runde überspringen** beendet die aktuelle Runde ohne Punkt und wechselt zur nächsten Person.
- ein bereits gestarteter zeitgesteuerter Durchgang wird bei bewusstem Speichern als Runde gezählt, damit laufende Treffer nicht verloren gehen.
- Fokus springt nach Zustandswechseln auf die nächste sinnvolle Spielaktion beziehungsweise auf die Spielüberschrift.
- die vier Hauptsteuerungen besitzen mobile 44-Pixel-Touchziele und brechen auf kleinen Displays auf eine einspaltige Darstellung um.
- Tabu besitzt einen gemeinsamen pausierbaren 60-Sekunden-Timer mit Treffer-, Karten- und Resume-Zustand.

`tests/advanced-resume-contract.test.js` schützt den Advanced-Wiederaufnahmevertrag:

- Runtime Guard und Advanced Runner verwenden `secret-circle-party-active-v1`.
- geöffnete private Fragen, Orte und Rollen werden nach Reload wieder verdeckt.
- eine offene Mafia-Moderatorübersicht verlangt nach Reload erneut bewusste Bestätigung.

`tests/mafia-rules.test.js` schützt den Mafia-Regelvertrag:

- 6–7 Personen: 1 Mafia.
- 8–11 Personen: 2 Mafia.
- 12–15 Personen: 3 Mafia.
- 16–20 Personen: 4 Mafia.
- `Schnell`: Mafia, Detektiv, Dorfbewohner.
- `Klassisch`: zusätzlich Arzt ab passender Gruppengröße.
- `Erweitert`: zusätzlich echter Beschützer mit eigener Nachtaktion.

Vorbereitete relevante Browserverträge:

- `tests/e2e/core-hub-timers.spec.js`
- `tests/e2e/core-hub-resume.spec.js`
- `tests/e2e/core-hub-controls.spec.js`
- `tests/e2e/taboo-timer.spec.js`
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
| Wahrheit oder Pflicht | direkte Hub-Engine | nein | aktiver Hub-Spielstand + explizites Resume | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** – Startversuch zählt nicht als Play; globaler Skip/Abbruch vorhanden | offen |
| Ich habe noch nie | direkte Hub-Engine | nein | aktiver Hub-Spielstand + explizites Resume | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** – globaler Skip/Abbruch vorhanden | offen |
| Wer würde eher? | direkte Hub-Engine | nein | aktiver Hub-Spielstand + explizites Resume | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** – globaler Skip/Abbruch vorhanden | offen |
| Entweder oder | direkte Hub-Engine | nein | aktiver Hub-Spielstand + explizites Resume | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** – globaler Skip/Abbruch vorhanden | offen |
| Paranoia | direkte Hub-Engine | nein | Resume; Geheimfrage nach Reload wieder verdeckt | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT**, Sichtschutz real prüfen | offen |
| Scharade | `party-hub-timers.js` | 60 s | Restzeit + Treffer + Karte; Resume pausiert | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** – gemeinsamer pausierbarer/resumierbarer Timer | offen |
| Nicht sagen! / Tabu | `party-hub-timers.js` | 60 s | Restzeit + Treffer + aktuelle Karte; Resume pausiert | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** – gemeinsamer pausierbarer/resumierbarer Timer | offen |
| Heiße Kartoffel | `party-hub-timers.js` | Zufall 10–25 s | versteckte Restzeit; Resume pausiert | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** – Restzeit bleibt verborgen | offen |
| Wortkette | `party-hub-timers.js` | 30 s | Buchstabe + Restzeit; Resume pausiert | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** – gemeinsamer pausierbarer/resumierbarer Timer | offen |
| Zwei Wahrheiten, eine Lüge | Advanced Runner | rundenabhängig | aktive Advanced-Session | stabiler Advanced-Abschluss | **TECHNISCH ABGESICHERT** – Eingabe/Mischen/Abstimmung als Browservertrag vorbereitet | offen |
| Question Imposter | Advanced Runner | rundenabhängig | sichere aktive Advanced-Session | stabiler Advanced-Abschluss | **TECHNISCH ABGESICHERT** – geöffnete Geheimfrage wird nach Reload wieder verdeckt | offen |
| Location Spy | Advanced Runner | rundenabhängig | sichere aktive Advanced-Session | stabiler Advanced-Abschluss | **TECHNISCH ABGESICHERT** – privater Reveal wird nach Reload wieder geschützt | offen |
| Mafia | Advanced Runner | phasenabhängig | sichere aktive Advanced-Session | stabiler Advanced-Abschluss | **TECHNISCH ABGESICHERT** – skalierte Mafia, Packregeln, Arzt/Detektiv/Beschützer, sichere Moderator-Wiederaufnahme | offen |
| Nur falsche Antworten | direkte Hub-Engine | nein | aktiver Hub-Spielstand + explizites Resume | Hub-Ledger beim Abschluss | **TECHNISCH ABGESICHERT** – globaler Skip/Abbruch vorhanden | offen |

## Behobene Kernspiel-Fehler

### Hub-Statistik

Früher erhöhte `party-hub.js` `plays` bereits beim Öffnen beziehungsweise Startversuch. Jetzt aktualisiert Öffnen nur `recent`; erst ein echter Abschluss verwendet `L.completionId('hub', ...)` und `L.recordCompletion(...)`.

### Hub-Bedienung

- das frühere **„Spiel verlassen“** war mehrdeutig und speicherte unmittelbar als Abschluss.
- jetzt gibt es getrennt **„Beenden & speichern“** und **„Abbrechen & verwerfen“**.
- Abbruch verlangt eine Bestätigung und schreibt weder Verlauf noch Statistik.
- Escape löst denselben sicheren Abbruchpfad aus.
- **„Runde überspringen“** ist für direkte Hub-Spiele einheitlich verfügbar, erhöht die Rundenzahl, gibt aber keinen Punkt.
- nach Runden-/Reveal-Wechseln wird der Fokus auf die nächste spielbare Hauptaktion gesetzt.
- laufende zeitgesteuerte Runden werden beim bewussten Sessionabschluss als Runde berücksichtigt, damit bereits erzielte Treffer nicht verloren gehen.

### Hub-Timer und Reload

- die vier Timermechaniken wurden aus `party-hub.js` nach `party-hub-timers.js` ausgelagert, damit die 1.000-Zeilen-Modulgrenze bestehen bleibt.
- alle direkten Hub-Sessions besitzen einen versionierten aktiven Spielstand.
- eine Session speichert ihre eigene Spielergruppe, damit spätere Lobbyänderungen die laufende Runde nicht verändern.
- Reload zeigt zunächst eine Wiederaufnahme-Karte statt automatisch das Spiel zu öffnen.
- Scharade speichert Restzeit, Rundentreffer und aktuelle Karte.
- Tabu läuft 60 Sekunden und speichert Restzeit, Rundentreffer, aktuellen Begriff und verbotene Wörter.
- Heiße Kartoffel speichert intern die zufällige Restzeit, ohne einen Countdown anzuzeigen.
- Wortkette speichert Restzeit und Buchstaben.
- Timer werden nach Wiederaufnahme pausiert rekonstruiert und laufen erst nach „Fortsetzen“ weiter.
- Paranoia und andere private Zustände werden nach Reload nicht automatisch offengelegt.
- „Gespeicherten Stand verwerfen“ erzeugt keinen fertigen Verlaufseintrag.

### Advanced-Wiederaufnahme und PWA

- PWA-Update-Schutz und Advanced Runner verwenden denselben Advanced-Key.
- private Reveal-Zustände werden nach Reload wieder verdeckt.
- Mafia-Moderatorübersicht fällt beim Resume auf den geschützten Moderator-Schritt zurück.
- der PWA-Update-Schutz berücksichtigt zusätzlich direkte Hub-Sessions.

### Mafia

Die Mafiaanzahl skaliert mit der Gruppe; Schnell, Klassisch und Erweitert besitzen unterschiedliche Rollenverträge. Der Beschützer ist als Nachtaktion umgesetzt und kann nicht dieselbe Person in zwei aufeinanderfolgenden Nächten schützen.

## Noch offen

1. Automatisierte Browserverträge benötigen einen tatsächlich laufenden Playwright-/Actions-Runner.
2. Punkte- und Siegerlogik der 15 Kernspiele muss als Produktdokumentation vollständig durchgeprüft werden.
3. Reale Geräte-, PWA-Update-, Sperrbildschirm-, Accessibility-, Inhalts- und Gruppentests sind offen.
4. reproduzierbarer Dependency-Lock und `npm ci` bleiben bis zur funktionierenden CI offen.

## Nächster technischer/produktseitiger Block

1. Punkte- und Siegerlogik der 15 Kernspiele systematisch prüfen und dokumentieren.
2. Kerninhalte und Altersstufen redaktionell prüfen; schwache, doppelte oder unnötig sensible Karten entfernen.
3. danach Geräte-, PWA-Update- und reale Gruppentests durchführen.
4. parallel Dependency-Lock/CI reproduzierbar machen, sobald der Runner wieder Code ausführt.

## Releasegrenze

Ein Kernspiel wird erst auf **RELEASE PASS** gesetzt, wenn:

- alle automatisierten Kernverträge grün sind,
- kein kritischer/hoher technischer Punkt offen ist,
- zutreffende Offline-, Timer-, Wiederaufnahme- und Accessibility-Fälle bestanden sind,
- Inhalt und Altersstufe redaktionell geprüft wurden,
- mindestens ein realer Gruppentest ohne Entwicklerhilfe dokumentiert ist.
