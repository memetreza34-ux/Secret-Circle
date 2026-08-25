# Secret Circle – CI Troubleshooting

Stand: 25. August 2026

## Aktueller Befund

Secret Circle besitzt normale GitHub-Actions-Workflows, aber die geprüften Jobs erreichen weiterhin **keinen Workflow-Schritt**.

Aktuellster vollständig untersuchter App-CI-Befund bleibt der v49-Lauf **Run #2787** (`Secret Circle CI`) auf Head **`a9ad91389ff9e966af432b0a77103ddc0960709d`** / Job `validate`.

- Run-ID `32871536761`
- Job-ID `97879489858`
- `completed / failure`
- Jobliste liefert `steps: null`
- separate Step-Abfrage liefert `steps: []`
- kein Checkout
- kein Node-/Python-Setup
- kein Online-`npm ci`
- keine Syntaxchecks
- keine Unit-/Contracttests
- keine Validatoren/Audits
- kein Playwright
- kein Repositorycode ausgeführt

Run #2787 liegt auf dem **v49-/Hub-Resume-v2-/Release-Audit-/Operator-Evidence-Hardening-Stand**. Damit wurden der zentrale `party-hub-resume-guard.js` v2, der stale-Resume-UI-Regressionsfall und die transition-safe Release-Audits nicht durch einen GitHub-Runner ausgeführt.

Der aktuelle Source-/Offline-Core ist inzwischen **v50**. v50 ergänzt die fail-closed Ladephase des Hub-Resume-Schutzes: Bereits gerenderte Resume-Aktionen sind bis zum Abschluss der Guard-Validierung gesperrt. Auch dieser v50-Vertrag besitzt weiterhin **keinen echten Runner-PASS**.

Das wiederholte Muster ist **kein Beweis für einen Codefehler**, weil der Repositorycode nicht startet.

## Isolierter Hosted-Runner-Probe

Am 23. August 2026 wurde zusätzlich ein temporärer Minimalworkflow `Secret Circle Runner Probe` ausgeführt. Dieser Job enthielt **keinen Checkout, keine Setup-Action und keine Dependencyinstallation**, sondern ausschließlich einen lokalen Bash-Schritt mit `echo` und `uname -a`.

Ergebnis: **Runner Probe Run #7** auf Head `a9f2591a5280ec67b9042df8ff636019c7c6149a`.

- Run-ID `32650097848`
- Job-ID `97220210640`
- `completed / failure`
- `steps: []`
- selbst der erste lokale Bash-Schritt wurde nicht erzeugt oder gestartet
- keine Repositorydatei und keine externe Action war für den Fehler erforderlich

Damit ist ausgeschlossen, dass `actions/checkout`, `actions/setup-node`, `actions/setup-python`, `npm ci`, Playwright oder Secret-Circle-Code die **unmittelbare Ursache dieses Pre-Step-Fehlers** sind.

Der verbleibende Fehlerbereich liegt **vor der Step-Ausführung**, insbesondere bei Hosted-Runner-Zuteilung, Account-/Billing-/Budgetzustand, Repository-/Organisations-/Enterprise-Policy oder einer GitHub-seitigen Runner-Störung. Die exakte externe Ursache darf erst benannt werden, wenn GitHub sie in Einstellungen, Billing oder Statusdaten bestätigt.

## Wiederholbarkeit

Das gleiche Pre-Step-Muster wurde über viele Heads beobachtet, darunter Run #2244, #2334, #2359, #2363, #2387, #2401, #2565, #2575, #2627, #2637, #2685, #2715 und **#2787** sowie der isolierte Runner-Probe Run #7.

Die Wiederholung über Core-Hardening, Operator-/Legal-Erweiterungen, v46-Hub-A11y, v47-Secondary-A11y, v48-Word-Imposter-Datenhardening und v49-Hub-Resume-/Release-Audit-Hardening hinweg verstärkt die Diagnose: Der unmittelbare Fehler tritt **vor jeder Repositoryausführung** auf. v50 ändert an dieser externen Diagnose nichts.

## Aktueller Buildvertrag

- Offline-Core `secret-circle-v50` / `secret-circle-v50-staging`
- Hub Resume Guard v2 + fail-closed Lade-/Button-Sperre
- `package-lock.json` v3
- `@playwright/test`, `playwright`, `playwright-core` 1.54.2; optional `fsevents` 2.3.2
- feste Registry-URLs + `sha512`-Integrities
- CI und Cross-Browser verwenden `npm ci`
- `scripts/lockfile_contract_audit.py`
- `scripts/hub_a11y_contract_audit.py`
- `scripts/secondary_surface_a11y_contract_audit.py`
- `tests/word-imposter-data-contract.test.js`
- `tests/party-hub-resume-guard.test.js`
- `scripts/operator_release_contract_audit.py`
- `scripts/release_readiness_contract_audit.py`
- `scripts/release_audit.py`
- `scripts/architecture_audit.py`

Ein echter Online-`npm ci`-PASS bleibt offen, weil Actions Step 1 nicht erreicht.

## Aktuelle Releasegates

Unter anderem vorhanden:

- Foundation-/Architektur-Audits
- Lockfile-/Branch-Protection-Audits
- Hub- und Secondary-Surface-A11y-Audits
- Word-Imposter-Daten-/Voting-Contracttest
- Hub-Resume-v2-Contracttest inklusive v50-Ladephasen-Sperre
- HTTPS-Staging-Smoke + Contract-Audit
- PWA-Head-Metadata-Test für fünf interaktive Einstiegseiten
- Privacy-/Reference-/Asset-/Media-/Placeholder-Audits
- Operator-/Hosting-/Legal-/Support-/Incident-Vertrag + `OPERATOR_EVIDENCE_LOG.md`
- `release-evidence.json` + `RELEASE_EVIDENCE.md`
- transition-safe Release-Readiness-/Release-Audits

Diese Gates sind implementiert, aber nicht durch einen Actions-Runner ausgeführt.

## Aktuelle Workflows

### Secret Circle CI

- `ubuntu-latest`
- `actions/checkout@v4`
- Node 22 + npm cache
- Python 3.12
- `npm ci --ignore-scripts --no-audit --no-fund`
- Playwright Chromium
- `npm run check`
- `npm test`
- `npm run validate`
- `npm run test:e2e`

### Cross-Browser

- manueller `workflow_dispatch`
- `npm ci`
- Chromium + Firefox + WebKit
- `npm run test:cross-browser`

## Was nicht auf Verdacht geändert wird

- keine Tests/Audits deaktivieren
- kein `continue-on-error` für Pflichtgates
- Checkout nicht umgehen
- Required Checks nicht künstlich grün markieren
- nicht zurück auf ungesperrtes `npm install`
- keine Featureänderungen als vermeintliche Runner-Reparatur

## Externe Prüfflächen

Weil sogar der action-freie Runner-Probe vor Step 1 endet, jetzt zuerst prüfen:

1. persönliche `Settings → Billing and licensing` beziehungsweise Actions-Nutzung/Budget
2. Repository `Settings → Actions → General`
3. ob GitHub Actions für das private Repository erlaubt ist
4. ob GitHub-hosted Runner durch Account-/Organisations-/Enterprise-Regeln gesperrt sind
5. GitHub Status auf Actions-/Runner-Störung

Erst wenn ein Minimaljob einen echten Step ausführt, lohnt sich weitere Repository-CI-Diagnostik.

## Wenn der Runner wieder echte Steps zeigt

1. Job muss Step 1 erreichen
2. Checkout bestätigen
3. Online-`npm ci` / Integrity-Download prüfen
4. ersten echten Repositoryfehler isolieren
5. `npm run check`
6. `npm test` inklusive `tests/word-imposter-data-contract.test.js` und `tests/party-hub-resume-guard.test.js`
7. `npm run validate` einschließlich A11y-/Architektur-/Operator-/Release-Evidence-Audits
8. Chromium E2E
9. vollständiges `npm run ci`
10. Cross-Browser auf demselben RC-Commit
11. unveränderten Commit erneut vollständig testen
12. erst danach Branch Protection und Release Evidence als reale PASS-Gates abnehmen

## Release-Regel

Ein Workflow mit `steps: []` zählt weder als PASS noch als negativer Code-Test. Öffentlicher Release und Merge von PR #13 bleiben **NO_GO**, bis ein echter Runner den unveränderten RC inklusive Online-`npm ci` vollständig ausgeführt hat.