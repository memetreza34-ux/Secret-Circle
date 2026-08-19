# Secret Circle – CI Troubleshooting

Stand: 19. August 2026

## Aktueller Befund

Secret Circle besitzt normale GitHub-Actions-Workflows, aber die bislang geprüften Jobs erreichen **keinen Repository-Schritt**.

Aktuellster vollständig geprüfter Stand: **Run #2363** (`Secret Circle CI`) auf Head **`81d26c7acc85c8ad6c4a20dcb1ea04128316291f`** / Job `validate`.

- Run-ID `32282530981`
- Job-ID `96164384000`
- `completed / failure`
- `steps: []`
- kein Checkout
- kein Node-/Python-Setup
- kein Online-`npm ci`
- keine Tests/Audits/Playwright
- kein Repositorycode ausgeführt
- kein belastbarer Job-Log

Das wiederholte Muster ist **kein Beweis für einen Codefehler**, weil der Repositorycode nicht startet.

## Wiederholbarkeit

Das gleiche Pre-Step-Muster wurde über viele Heads beobachtet, darunter Run #2244, #2334, #2359 und jetzt #2363. Der aktuelle v44-Stand ist damit ebenfalls noch nicht runnerverifiziert.

## Aktueller Buildvertrag

Der frühere Zustand „kein Lockfile“ ist beendet.

Jetzt vorhanden:

- `package-lock.json` v3
- gelockt: `@playwright/test` 1.54.2, `playwright` 1.54.2, `playwright-core` 1.54.2, optional `fsevents` 2.3.2
- feste Registry-URLs + `sha512`-Integrities
- `scripts/lockfile_contract_audit.py`
- CI und Cross-Browser verwenden `npm ci --ignore-scripts --no-audit --no-fund`
- `actions/setup-node` nutzt npm-Cache

Dependencygraph und Lizenzen sind dokumentiert. Ein echter Online-`npm ci`-PASS auf dem unveränderten Branch-Head bleibt offen, weil Actions Step 1 nicht erreicht.

## Aktuelle Validatorbasis

Unter anderem vorhanden:

- Foundation-/Architektur-Audits
- `scripts/lockfile_contract_audit.py`
- `scripts/branch_protection_contract_audit.py`
- `scripts/staging_smoke_contract_audit.py`
- `scripts/privacy_content_audit.py`
- `scripts/reference_content_audit.py`
- `scripts/asset_provenance_audit.py`
- `scripts/media_inventory_audit.py`
- `scripts/public_release_placeholder_audit.py`
- `scripts/release_readiness_contract_audit.py`
- `scripts/release_audit.py`
- `tests/pwa-head-metadata.test.js` für die fünf interaktiven PWA-Einstiegseiten

Keiner dieser neuen/aktualisierten Gates wurde bisher auf einem Actions-Runner ausgeführt.

## Aktuelle Workflows

### Secret Circle CI

- `runs-on: ubuntu-latest`
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
- Node 22 + npm cache
- `npm ci`
- Chromium + Firefox + WebKit
- `npm run test:cross-browser`

## Was nicht auf Verdacht geändert wird

- keine Tests/Audits deaktivieren
- kein `continue-on-error` für Pflichtgates
- Checkout nicht umgehen
- Required Checks nicht künstlich grün markieren
- nicht zurück auf ungesperrtes `npm install`, nur um einen roten Status zu vermeiden

## Externe Prüfflächen

Weil der Fehler vor dem ersten Step liegt:

- Actions-/Workflow-Policy
- GitHub-hosted Runner-Verfügbarkeit
- Minuten-/Billing-/Accountlimits
- Organisations-/Enterprise-Regeln
- Repository-/Accountzustand
- mögliche GitHub-Actions-Störung

Eine konkrete Ursache wird erst benannt, wenn GitHub sie tatsächlich zeigt.

## Branch Protection

Gewünschter Required Check: **`Secret Circle CI / validate`**. Tatsächliche GitHub-Konfiguration bleibt offen.

Cross-Browser bleibt bei aktuellem manuellen Trigger ein separater RC-Gate.

## Wenn der Runner wieder echte Steps zeigt

1. Checkout bestätigen
2. Online-`npm ci` und Integrity-Download prüfen
3. ersten echten Repositoryfehler isolieren
4. Syntaxchecks
5. Unit-/Contracttests einschließlich `tests/pwa-head-metadata.test.js`
6. alle Validatoren/Audits
7. Chromium E2E
8. Cross-Browser auf demselben RC-Commit
9. unveränderten Commit erneut vollständig laufen lassen
10. erst danach Branch Protection/Required Checks real abnehmen

## Release-Regel

Ein Workflow mit `steps: []` zählt weder als PASS noch als negativer Code-Test. Öffentlicher Release und Merge von PR #13 bleiben **NO_GO**, bis ein echter Runner den unveränderten RC inklusive Online-`npm ci` vollständig ausgeführt hat.