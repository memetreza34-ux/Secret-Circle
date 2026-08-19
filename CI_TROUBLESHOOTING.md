# Secret Circle – CI Troubleshooting

Stand: 19. August 2026

## Aktueller Befund

Secret Circle besitzt vorbereitete GitHub-Actions-Workflows, aber die aktuell geprüften Jobs erreichen **keinen Repository-Schritt**.

Aktuell belastbar geprüft: **Run #2194** (`Secret Circle CI`) auf Head **`e105b6326cdf6c640fd566a24887f20bf3a6a4fe`** / Job `validate`.

Aktueller Jobversuch:

- Run-ID `32222768925`
- Job-ID `95976321366`
- Workflow `completed / failure`
- Job `validate` = `failure`
- `steps: []`
- kein Checkout
- kein Node-/Python-Setup
- kein `npm install`
- kein `npm test`
- kein `npm run validate`
- kein Playwright
- kein Repositorycode ausgeführt

Damit wurden insbesondere die neu integrierten Gates `tests/manifest-icons.test.js` und `scripts/media_inventory_audit.py` **nicht ausgeführt**.

## Wiederholbarkeit des Problems

Bereits beim vorherigen v42-Stand wurde Run #2166 untersucht. Dort zeigte der erste Jobversuch ebenfalls `steps: []`. Ein gezielter Re-Run der fehlgeschlagenen Jobs wurde von GitHub akzeptiert und endete erneut mit `steps: []` sowie ohne verwertbaren Job-Log.

Der aktuelle Run #2194 bestätigt dasselbe Muster auf einem späteren Head. Damit ist ein einzelner kurzfristiger Jobaussetzer als Erklärung weniger plausibel. Eine konkrete externe Ursache wird trotzdem nicht erfunden.

Das ist **kein Beweis für einen Codefehler** im Repository. Der Repositorycode wird in diesen Jobs nicht ausgeführt.

## Workflow selbst geprüft

`.github/workflows/ci.yml` besitzt weiterhin eine normale GitHub-hosted Baseline:

- `runs-on: ubuntu-latest`
- `actions/checkout@v4`
- Node 22
- Python 3.12
- Dependencies installieren
- Playwright Chromium
- `npm run check`
- `npm test`
- `npm run validate`
- `npm run test:e2e`

Es wurde kein offensichtlicher Repository-YAML-/Runner-Label-Fehler gefunden, der `steps: []` erklärt.

## Was nicht auf Verdacht geändert wird

Solange GitHub dem Job keinen Runner mit echten Steps zuweist, werden keine funktionierenden Testbefehle, Audit-Gates oder Browserprüfungen entfernt, nur um einen roten Status zu vermeiden.

Insbesondere nicht:

- Tests deaktivieren
- Audits aus `npm run validate` entfernen
- `continue-on-error` auf Releasegates setzen
- Checkout umgehen
- Required Checks künstlich grün markieren

## Wahrscheinliche externe Prüfflächen

Weil der Fehler vor dem ersten Step liegt, müssen außerhalb des Repositorycodes geprüft werden:

- GitHub Actions für Repository/Account aktiviert
- zulässige Actions-/Workflow-Policy
- GitHub-hosted Runner für das private Repository verfügbar
- Minuten-/Billing-/Accountlimits
- Organisation-/Enterprise-Richtlinien, falls relevant
- Repository-/Accountzustand
- temporäre GitHub-Actions-Störung

Diese Punkte dürfen erst als Ursache bezeichnet werden, wenn GitHub sie konkret bestätigt.

## Lockfile separat

Unabhängig vom Runner fehlt `package-lock.json` weiterhin.

Aktueller Zustand:

- `@playwright/test` ist exakt auf `1.54.2` gepinnt
- `package-lock.json` liefert auf dem Arbeitsbranch weiterhin 404
- ein früherer lokaler Versuch `npm install --package-lock-only` konnte wegen Paketnetzwerk/Timeout kein belastbares Lockfile erzeugen
- keine Integrity-Hashes wurden erfunden
- Workflow bleibt deshalb vorläufig bei Installation ohne Lockfile

Vor Release:

```bash
npm ci
npm run ci
npm run test:cross-browser
```

## Nach Wiederherstellung des Runners

Der erste Lauf mit echten Steps wird **nicht sofort als Release-PASS** interpretiert. Reihenfolge:

1. sichtbaren Checkout bestätigen
2. echte Step-Liste dokumentieren
3. ersten tatsächlichen Repositoryfehler isolieren
4. `npm run check` beheben
5. Unit-/Contracttests inklusive `tests/manifest-icons.test.js` beheben
6. Validatoren/Audits inklusive `reference_content_audit.py`, `asset_provenance_audit.py` und `media_inventory_audit.py` beheben
7. Chromium E2E beheben
8. Cross-Browser beheben
9. Lockfile erzeugen und verifizieren
10. Workflow auf `npm ci` umstellen
11. denselben unveränderten Commit erneut vollständig testen
12. erst danach Required Checks/Branch Protection als Releasegate verwenden

## Release-Regel

Ein Workflowlauf mit `steps: []` zählt weder als grün noch als negativer Code-Test. Auch wiederholte Läufe mit demselben Muster ändern daran nichts.

Öffentlicher Release und Merge von PR #13 bleiben **NO_GO**, bis ein echter Runner den unveränderten Release Candidate vollständig ausgeführt hat.
