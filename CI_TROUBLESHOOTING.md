# Secret Circle – CI Troubleshooting

Stand: 19. August 2026

## Aktueller Befund

Secret Circle besitzt normale GitHub-Actions-Workflows, aber die bislang geprüften Jobs erreichen **keinen Repository-Schritt**.

Zuletzt belastbar vor dem neuen Lockfile-/`npm ci`-Stand geprüft: **Run #2244** (`Secret Circle CI`) auf Head `1c9c5a0888cb7192408e3a3dbca316782d3d61e7` / Job `validate`.

- Run-ID `32228246835`
- Job-ID `95992378765`
- `completed / failure`
- `steps: []`
- kein Checkout
- kein Node-/Python-Setup
- kein Dependency-Install
- keine Tests/Audits/Playwright
- kein Repositorycode ausgeführt

Das Muster wurde über mehrere Runs reproduziert und ist **kein Beweis für einen Codefehler**, weil der Repositorycode nicht startet.

## Neuer Buildstand: Lockfile + npm ci

Der frühere Zustand „kein Lockfile“ ist beendet.

Jetzt vorhanden:

- `package-lock.json`, Lockfile v3
- `@playwright/test` 1.54.2 exakt
- `playwright` 1.54.2 exakt
- `playwright-core` 1.54.2 exakt
- optional `fsevents` 2.3.2 für macOS
- feste Registry-URLs und `sha512`-Integrities
- `scripts/lockfile_contract_audit.py`

Beide Workflows verwenden jetzt:

```bash
npm ci --ignore-scripts --no-audit --no-fund
```

und `actions/setup-node` mit npm-Cache.

### Was bereits geprüft wurde

- Dependencygraph gegen offizielle Tags von Playwright v1.54.2 und fsevents v2.3.2 geprüft
- Lizenzen: Playwright-Pakete Apache-2.0, fsevents MIT
- lokaler Offline-`npm ci`-Strukturcheck akzeptierte Package-/Lock-Synchronität und scheiterte erst erwartungsgemäß mit `ENOTCACHED`, weil keine Registry-Tarballs lokal vorhanden waren

### Was noch **nicht** behauptet wird

- kein echter Online-`npm ci`-PASS
- keine tatsächliche Integrity-Downloadverifikation auf Actions
- kein grünes `npm run ci`
- kein grüner Cross-Browser-Lauf

Der nächste Actions-Lauf mit echten Steps muss deshalb zunächst zeigen, dass `npm ci` die gesperrten Pakete erfolgreich aus der Registry lädt.

## Aktuelle Workflows

`.github/workflows/ci.yml`:

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

`.github/workflows/cross-browser.yml`:

- manueller `workflow_dispatch`
- Node 22 + npm cache
- `npm ci`
- Chromium + Firefox + WebKit
- `npm run test:cross-browser`

## Neue Release-Gates seit Run #2244

Noch nicht runner-verifiziert sind unter anderem:

- `scripts/lockfile_contract_audit.py`
- `scripts/branch_protection_contract_audit.py`
- `scripts/staging_smoke_contract_audit.py`
- `scripts/privacy_content_audit.py`
- `scripts/reference_content_audit.py`
- `scripts/asset_provenance_audit.py`
- `scripts/media_inventory_audit.py`
- `scripts/public_release_placeholder_audit.py`
- aktualisierter `scripts/foundation_contract_audit.py` für Registry v2
- Accessibility-/PWA-/Content-/Sessiontests

## Was nicht auf Verdacht geändert wird

Solange kein echter Runner Repository-Steps ausführt:

- keine Tests deaktivieren
- keine Release-Audits entfernen
- kein `continue-on-error` für Pflichtgates
- kein Checkout umgehen
- keine Required Checks künstlich grün markieren
- nicht von `npm ci` zurück auf ungesperrtes `npm install` wechseln

## Wahrscheinliche externe Prüfflächen

Weil der bisherige Fehler vor dem ersten Step liegt:

- GitHub Actions für Repository/Account aktiviert
- zulässige Actions-/Workflow-Policy
- GitHub-hosted Runner verfügbar
- Minuten-/Billing-/Accountlimits
- Organisations-/Enterprise-Richtlinien, falls relevant
- Repository-/Accountzustand
- temporäre GitHub-Actions-Störung

Eine konkrete Ursache wird erst benannt, wenn GitHub sie tatsächlich zeigt.

## Branch Protection

`BRANCH_PROTECTION.md` definiert **`Secret Circle CI / validate`** als gewünschten normalen Required Check. Die tatsächliche GitHub-Konfiguration ist noch nicht belastbar bestätigt.

Cross-Browser bleibt bei aktuellem `workflow_dispatch` ein separater RC-Gate und kein permanenter PR-Required-Check.

## Wenn der Runner wieder echte Steps zeigt

Reihenfolge:

1. Checkout bestätigen
2. `npm ci` und Integrity-Download prüfen
3. ersten tatsächlichen Repositoryfehler isolieren
4. `npm run check`
5. Unit-/Contracttests
6. Foundation-/Lockfile-/Branch-/Privacy-/Reference-/Asset-/Media-/Placeholder-/Staging-Contract-Audits
7. Chromium E2E
8. Cross-Browser auf exakt demselben RC-Commit
9. unveränderten Commit erneut vollständig laufen lassen
10. erst dann Required Checks/Branch Protection als real abnehmen

## Release-Regel

Ein Workflow mit `steps: []` zählt weder als PASS noch als negativer Code-Test.

Öffentlicher Release und Merge von PR #13 bleiben **NO_GO**, bis ein echter Runner den unveränderten Release Candidate inklusive Online-`npm ci` vollständig ausgeführt hat.
