# Secret Circle – CI Troubleshooting

Stand: 19. August 2026

## Aktueller Befund

Secret Circle besitzt normale GitHub-Actions-Workflows, aber die bislang geprüften Jobs erreichen **keinen Repository-Schritt**.

Aktuellster vollständig geprüfter Stand: **Run #2387** (`Secret Circle CI`) auf Head **`4335f670229b8a89a07a600f5a3527b43f0fe123`** / Job `validate`.

- Run-ID `32283581882`
- Job-ID `96167714801`
- `completed / failure`
- `steps: []`
- kein Checkout
- kein Node-/Python-Setup
- kein Online-`npm ci`
- keine Tests/Audits/Playwright
- kein Repositorycode ausgeführt

Das wiederholte Muster ist **kein Beweis für einen Codefehler**, weil der Repositorycode nicht startet.

## Wiederholbarkeit

Das gleiche Pre-Step-Muster wurde über viele Heads beobachtet, darunter Run #2244, #2334, #2359, #2363 und jetzt #2387. Der v44-/Release-Evidence-Stand ist damit ebenfalls noch nicht runnerverifiziert.

## Aktueller Buildvertrag

- `package-lock.json` v3
- `@playwright/test`, `playwright`, `playwright-core` 1.54.2; optional `fsevents` 2.3.2
- feste Registry-URLs + `sha512`-Integrities
- CI und Cross-Browser verwenden `npm ci`
- `scripts/lockfile_contract_audit.py`

Ein echter Online-`npm ci`-PASS bleibt offen, weil Actions Step 1 nicht erreicht.

## Aktuelle Releasegates

Unter anderem vorhanden:

- Foundation-/Architektur-Audits
- Lockfile-/Branch-Protection-Audits
- HTTPS-Staging-Smoke + Contract-Audit
- PWA-Head-Metadata-Test für fünf interaktive Einstiegseiten
- Privacy-/Reference-/Asset-/Media-/Placeholder-Audits
- `release-evidence.json` + `RELEASE_EVIDENCE.md`
- `scripts/release_evidence_audit.py`
- `scripts/release_readiness_contract_audit.py`
- `scripts/release_audit.py`

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

## Externe Prüfflächen

Weil der Fehler vor dem ersten Step liegt:

- Actions-/Workflow-Policy
- GitHub-hosted Runner-Verfügbarkeit
- Minuten-/Billing-/Accountlimits
- Organisations-/Enterprise-Regeln
- Repository-/Accountzustand
- mögliche GitHub-Actions-Störung

Eine konkrete Ursache wird erst benannt, wenn GitHub sie tatsächlich zeigt.

## Wenn der Runner wieder echte Steps zeigt

1. Checkout bestätigen
2. Online-`npm ci` / Integrity-Download prüfen
3. ersten echten Repositoryfehler isolieren
4. Syntaxchecks
5. Unit-/Contracttests einschließlich PWA-Head
6. Validatoren/Audits einschließlich Release Evidence
7. Chromium E2E
8. Cross-Browser auf demselben RC-Commit
9. unveränderten Commit erneut vollständig testen
10. erst danach Branch Protection und Release Evidence als reale PASS-Gates abnehmen

## Release-Regel

Ein Workflow mit `steps: []` zählt weder als PASS noch als negativer Code-Test. Öffentlicher Release und Merge von PR #13 bleiben **NO_GO**, bis ein echter Runner den unveränderten RC inklusive Online-`npm ci` vollständig ausgeführt hat.