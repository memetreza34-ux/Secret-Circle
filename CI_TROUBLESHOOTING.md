# Secret Circle – CI Troubleshooting

Stand: 16. August 2026

## Aktueller Befund

Secret Circle besitzt vorbereitete GitHub-Actions-Workflows, aber die aktuell geprüften Jobs erreichen **keinen Repository-Schritt**.

Zuletzt belastbar geprüft: **Run #1905** / Job `validate`.

Beobachtetes Muster:

- Job endet `failure`
- `runner_id: 0`
- leerer Runnername
- `runner_group_id: 0`
- `steps: []`
- kein Checkout
- kein Node-/Python-Setup
- kein `npm install`
- kein `npm test`
- kein `npm run validate`
- kein Playwright
- kein verwertbarer Repository-Step-Log

Das ist **kein Beweis für einen Codefehler** im Repository. Der Code wird in diesen Läufen nicht ausgeführt.

## Was nicht auf Verdacht geändert wird

Solange GitHub dem Job keinen Runner zuweist, werden keine funktionierenden Testbefehle, Audit-Gates oder Browserprüfungen entfernt, nur um einen roten Status zu vermeiden.

Insbesondere nicht:

- Tests deaktivieren
- Audits aus `npm run validate` entfernen
- `continue-on-error` auf Releasegates setzen
- Checkout umgehen
- Required Checks künstlich grün markieren

## Workflow-Baseline

Der Hauptworkflow muss weiterhin mindestens enthalten:

1. Checkout
2. Node-Setup
3. Python-Setup
4. Dependencies installieren
5. Playwright Chromium installieren
6. `npm run check`
7. `npm test`
8. `npm run validate`
9. `npm run test:e2e`

Cross-Browser separat:

- Chromium
- Firefox
- WebKit
- `npm run test:cross-browser`

## Wahrscheinliche externe Prüfflächen

Weil der Fehler vor dem ersten Step liegt, müssen außerhalb des Repositorycodes geprüft werden:

- GitHub Actions für Repository/Account aktiviert
- zulässige Actions-/Workflow-Policy
- GitHub-hosted Runner für das private Repository verfügbar
- Minuten-/Billing-/Accountlimits
- Organisation-/Enterprise-Richtlinien, falls relevant
- Repository-Sperren oder Accountzustand
- temporäre GitHub-Actions-Störung

Diese Punkte dürfen erst als Ursache bezeichnet werden, wenn GitHub sie konkret bestätigt.

## Lockfile separat

Unabhängig vom Runner fehlt noch `package-lock.json`.

Aktueller Zustand:

- `@playwright/test` ist exakt auf `1.54.2` gepinnt
- lokaler Versuch `npm install --package-lock-only` konnte wegen Paketnetzwerk/Timeout kein belastbares Lockfile erzeugen
- keine Integrity-Hashes wurden erfunden
- Workflow bleibt deshalb vorläufig bei Installation ohne Lockfile

Vor Release:

```bash
npm ci
npm run ci
npm run test:cross-browser
```

## Nach Wiederherstellung des Runners

Erster erfolgreicher Runnerlauf wird **nicht sofort als Release-PASS** interpretiert. Reihenfolge:

1. sichtbaren Checkout bestätigen
2. echte Step-Liste dokumentieren
3. ersten tatsächlichen Fehler isolieren
4. `npm run check` beheben
5. Unit-/Contracttests beheben
6. Validatoren/Audits beheben
7. Chromium E2E beheben
8. Cross-Browser beheben
9. Lockfile erzeugen und verifizieren
10. Workflow auf `npm ci` umstellen
11. denselben unveränderten Commit erneut vollständig testen
12. erst danach Required Checks/Branch Protection als Releasegate verwenden

## Release-Regel

Ein Workflowlauf mit `steps: []` zählt weder als grün noch als negativer Code-Test.

Öffentlicher Release und Merge von PR #13 bleiben **NO_GO**, bis ein echter Runner den unveränderten Release Candidate vollständig ausgeführt hat.
