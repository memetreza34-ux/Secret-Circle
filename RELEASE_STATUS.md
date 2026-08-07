# Release-Status – Secret Circle

Stand: 7. August 2026
Zielrelease: 4.–15. Januar 2027
Arbeitsbranch: `agent/release-foundation-2027`
Draft-PR: #13

## Aktueller Gesamtstatus

**Phase:** technische Kernspiel-Abnahme auf stabiler Release-Grundlage

Secret Circle besitzt 45 eingebaute Spiele, davon 15 priorisierte Kernspiele. Für den Januar-Release zählen Stabilität, verständliche Regeln, sichere Wiederaufnahme, korrekte Statistik, Offlinefähigkeit, Accessibility, Inhaltsqualität und reale Gruppentests.

## Abgeschlossen

### Release und Struktur

- verbindlicher Fahrplan bis Januar 2027
- 15 Kernspiele, 13 Erweiterungen und 17 Labs-Modi
- Reifestufen-, Alters-, Gruppen-, Stimmungs- und Statusfilter
- lokal gespeicherte Filter und URL-Priorität
- Synonym- und Tippfehlersuche mit Tastatur-/Touch-Unterstützung
- Kernspielvertrag und eigene Abnahmematrix in `CORE_GAME_ACCEPTANCE.md`

### Word Imposter

- Rollen unabhängig von der Aufdeckreihenfolge
- getrennte Zufallsströme für Reveal, Rollen und Begriff
- maximal sechs Imposter direkt in der Hauptengine
- kein Laufzeit-Monkey-Patching der Rollenlogik
- deterministische Fairnessverträge

### Sessionabschluss und Statistik

- gemeinsames `session-ledger.js`
- Creator, Quick, Mega, Viral und direkte Hub-Sessions mit stabilen Session-/Abschluss-IDs
- Hub-`plays` wird nicht mehr beim bloßen Öffnen oder Startversuch erhöht
- echte Hub-Abschlüsse schreiben Verlauf/Statistik genau einmal
- Quick/Mega/Viral/Creator schreiben ebenfalls genau einmal
- Advanced Runner besitzt eine stabile Abschluss-ID aus seiner Session-ID und einen Wiederholschutz

### Direkte Hub-Sessions und Wiederaufnahme

- versionierter Active-State `secret-circle-party-hub-active-v1`
- jede direkte Hub-Session besitzt einen eigenen Spieler-Snapshot
- Active-State validiert Spiel, Pack, Spielergrenzen, Session-ID, Runden, Score und Timerzustand
- beschädigte Active-States werden verworfen statt blind geladen
- nach Reload wird nicht automatisch in das Spiel gesprungen; es erscheint **„Session fortsetzen“**
- gespeicherter Stand kann ohne Verlauf-/Statistikbuchung verworfen werden
- private Inhalte werden nach Reload nicht automatisch wieder geöffnet
- Paranoia kehrt nach Reload bewusst zum verdeckten Schritt zurück
- PWA-Update-Schutz erkennt direkte Hub-Sessions zusätzlich zu Word, Quick, Mega, Viral, Creator und Advanced

### Gemeinsame Timer und Bedienung

- `party-session-controls.js` für Quick/Mega/Viral/Creator und direkte Hub-Timer
- Pause, Skip, bestätigter Abbruch, Replay und nächstes Spiel auf derselben schnellen Oberfläche
- Scharade: pausierbarer 60-Sekunden-Timer; Restzeit, Rundentreffer und aktuelle Karte werden gespeichert
- Heiße Kartoffel: pausierbarer verdeckter Zufallstimer; interne Restzeit wird gespeichert, aber nicht angezeigt
- Wortkette: pausierbarer 30-Sekunden-Timer; Restzeit und Buchstabe werden gespeichert
- wiederhergestellte Hub-Timer starten bewusst pausiert und laufen erst nach „Fortsetzen“ weiter
- Hub-Rundenaktionen werden während Pause per `inert` gesperrt
- laufende Hub-Timer pausieren beim Wechsel in den Hintergrund
- private Intervalltimer wurden aus den schnellen Engines und dem Hub-Timerpfad entfernt

### Advanced-Kernspiele

- realer Advanced-Speicherschlüssel ist `secret-circle-party-active-v1`
- PWA-Update-Schutz verwendet denselben Schlüssel
- nach Reload werden bereits geöffnete private Fragen, Orte und Rollen wieder verdeckt
- Mafia-Moderatorübersicht benötigt nach Reload erneut bewusste Bestätigung
- Advanced-Smoke- und Unterbrechungsverträge wurden auf den tatsächlichen Resume-Flow korrigiert
- Zwei Wahrheiten: Eingabe, Mischung, Abstimmung und Rundenfortschritt als Browservertrag vorbereitet
- Question Imposter: komplette private Reveal-Kette und Abstimmung als Browservertrag vorbereitet
- Location Spy: komplette private Reveal-Kette und korrekte Spionwahl als Browservertrag vorbereitet
- Advanced-Abschluss wird für alle vier Modi gegen doppelte Statistik abgesichert

### Mafia

- Mafiaanzahl skaliert mit der Gruppe: 1 / 2 / 3 / 4
- `Schnell`, `Klassisch` und `Erweitert` besitzen unterschiedliche Rollenverträge
- Arzt ist in passenden Packs verfügbar
- `Erweitert` besitzt eine echte Beschützer-Nachtaktion
- Beschützer darf dieselbe Person nicht zwei Nächte hintereinander schützen
- geschützte Mafia-Ziele überleben die Nacht
- Detektiv-Ergebnis bleibt in der Moderatoransicht
- Siegbedingung Dorf/Mafia bleibt zentral geprüft

### Backup und PWA

- zentrales Backup-Schemaregister
- Word-, Gesamt- und Creator-Backup versioniert
- gemeinsame Grenze von 1.500.000 UTF-8-Bytes
- Gesamtsicherung erfasst alle `secret-circle-*`-Schlüssel und damit auch aktive Hub-/Advanced-Spielstände
- PWA-Staging-Cache und sichtbare Updateentscheidung
- kein automatisches Aktivieren einer neuen Version während normaler Nutzung
- aktiver Cache wird nicht vor erfolgreicher Promotion zerstört

### Qualität

Neu beziehungsweise erweitert:

- `tests/core-game-contract.test.js`
- `tests/hub-timer-contract.test.js`
- `tests/hub-resume-contract.test.js`
- `tests/advanced-resume-contract.test.js`
- `tests/mafia-rules.test.js`
- `tests/e2e/core-game-catalog.spec.js`
- `tests/e2e/core-hub-statistics.spec.js`
- `tests/e2e/core-hub-timers.spec.js`
- `tests/e2e/core-hub-resume.spec.js`
- `tests/e2e/advanced-core-smoke.spec.js`
- `tests/e2e/advanced-core-abort.spec.js`
- `tests/e2e/advanced-secret-resume.spec.js`
- `tests/e2e/advanced-core-round-flow.spec.js`
- `tests/e2e/advanced-completion-exact-once.spec.js`
- `tests/e2e/mafia-extended.spec.js`

Struktur-, Architektur-, Foundation-, Performance- und Release-Audit kennen direkte Hub-Sessions als fünften genau-einmal-Abschlussweg und verlangen jetzt zusätzlich den versionierten Reload-/Resume-Vertrag. Das bestehende 65-KB-Budget für `party-hub.js` wurde nicht gelockert.

## Noch technisch offen

1. **Tabu:** Produktentscheidung über eine feste Rundenuhr fehlt.
2. **Direkte Hub-Bedienung:** Skip, Fokus, Punkteverhalten und mobile Accessibility müssen systematisch vereinheitlicht/geprüft werden.
3. **Automatisierte Browserausführung:** die vorbereiteten Playwright-Verträge benötigen einen funktionierenden Runner.
4. **Dependency-Lock:** `package-lock.json` und `npm ci` bleiben offen.
5. **Geräte und reale Gruppen:** Android, iPhone, Tablet, PWA-Update, Sperrbildschirm und echte Partyabende fehlen noch.
6. **Inhalte und Recht:** redaktionelle Alters-, Fan-Content- und Rechtsprüfung ist noch nicht abgeschlossen.

## Externer Releaseblocker

GitHub Actions beendet die Jobs weiterhin vor dem ersten Repository-Schritt. Das bekannte Muster ist:

- `runner_id: 0`
- leerer Runnername
- `runner_group_id: 0`
- `steps: []`
- kein Checkout

Damit darf ein solcher Lauf nicht als Repository-Testfehler interpretiert werden; der Code wird gar nicht ausgeführt. Die neuen Unit-/E2E-Verträge sind deshalb **vorbereitet, aber noch nicht als grün dokumentiert**.

## Nächste technische Prioritäten

1. direkte Hub-Kernspiele auf Skip, Fokus, Punkte und mobile Accessibility prüfen und vereinheitlichen
2. Tabu-Rundenuhr als Produktentscheidung abschließen
3. Kerninhalte und Altersstufen redaktionell prüfen
4. Android-, iPhone-, Tablet-, PWA-Update-, Sperrbildschirm- und reale Gruppentests
5. Dependency-Lock erzeugen und CI auf `npm ci` umstellen
6. Branch Protection aktivieren, sobald Actions zuverlässig läuft

## Releaseentscheidung

- **Öffentlicher Release heute:** Nein
- **Kontrollierte Entwicklungsbeta:** Ja
- **Merge von PR #13 heute:** Nein, Draft bleibt bestehen
- **Releaseziel Januar 2027:** weiterhin realistisch, wenn CI, Geräteprüfungen, Inhaltsqualität und rechtliche Angaben rechtzeitig abgeschlossen werden
