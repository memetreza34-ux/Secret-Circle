# Secret Circle – CI Troubleshooting

Stand: 26. August 2026

## Aktueller Befund

Die geprüften GitHub-Actions-Jobs erreichen weiterhin **keinen Workflow-Schritt**.

Letzter vollständig untersuchter App-CI-Befund bleibt der historische **v49 Run #2787** (`Secret Circle CI`) auf Head `a9ad91389ff9e966af432b0a77103ddc0960709d`.

- Run-ID `32871536761`
- Job-ID `97879489858`
- `completed / failure`
- Jobliste `steps: null`
- separate Step-Abfrage `steps: []`
- kein Checkout / Node-/Python-Setup / npm / Test / Playwright / Repositorycode ausgeführt

Dieser historische Bezug bleibt absichtlich v49. Der aktuelle Source-/Offline-Core ist inzwischen **v54**. **v50–v54 besitzen keinen echten Runner-PASS.**

## Isolierter Hosted-Runner-Probe

Der temporäre `Secret Circle Runner Probe` enthielt keinen Checkout, keine Setup-Action und keine Dependencyinstallation, sondern nur lokalen Bash-Code (`echo`, `uname -a`).

Run #7: Head `a9f2591a5280ec67b9042df8ff636019c7c6149a`, Run-ID `32650097848`, Job-ID `97220210640`, `steps: []`. Selbst dieser lokale Bash-Schritt startete nicht.

Damit sind `actions/checkout`, Node/Python-Setup, `npm ci`, Playwright und Secret-Circle-Code als **unmittelbare Ursache des Pre-Step-Fehlers** ausgeschlossen. Die exakte externe Ursache ist weiterhin nicht bewiesen; plausible Prüfflächen sind Hosted-Runner-Zuteilung, Account/Billing/Budget, Repo-/Org-/Enterprise-Policy oder GitHub-seitige Runner-Störung.

## Aktueller Buildvertrag – v54

- Offline-Core `secret-circle-v54` / `secret-circle-v54-staging`
- Hub Resume Guard v2 + v50 fail-closed Lade-/Button-Sperre
- Complete Backup v51: Registry v2 + `party-data-tools.js` v6
- Hub Round Resume v52
- Paranoia Resume/Privacy v53: same-question/same-result ohne Auto-Reveal
- **PT54:** `party-hub-round-state.js` v3 + Hot-Potato-/Word-Chain-Pre-Start-Resume
- `tests/e2e/core-hub-prestart-resume.spec.js` im Syntax-Preflight
- `scripts/hub_prestart_resume_audit.py` als self-enforcing Teil von `npm run validate`
- Timer-Save-Exact-once zusätzlich in `tests/e2e/core-hub-controls.spec.js` und `tests/core-scoring-contract.test.js`
- `package-lock.json` v3
- Playwright 1.54.2 exakt
- CI und Cross-Browser verwenden `npm ci`
- Backup-/A11y-/Architecture-/Operator-/Release-Audits bleiben aktiv

Ein echter Online-`npm ci`-PASS bleibt offen, weil Actions Step 1 nicht erreicht.

## Was nicht auf Verdacht geändert wird

- keine Tests/Audits deaktivieren
- kein `continue-on-error` für Pflichtgates
- Checkout nicht umgehen
- Required Checks nicht künstlich grün markieren
- nicht auf ungesperrtes `npm install` zurückgehen
- keine Featureänderungen als vermeintliche Runner-Reparatur

## Externe Prüfflächen

1. persönliche `Settings → Billing and licensing` / Actions-Nutzung/Budget
2. Repository `Settings → Actions → General`
3. private-Repo-Actions-Erlaubnis
4. Account-/Org-/Enterprise-Regeln für GitHub-hosted Runner
5. GitHub Status für Actions-/Runner-Störungen

Erst wenn ein Minimaljob einen echten Step ausführt, lohnt sich weitere repositoryseitige CI-Diagnostik.

## Wenn der Runner wieder echte Steps zeigt

1. Step 1 und Checkout bestätigen
2. Online-`npm ci` / Integrity-Download
3. `npm run check`
4. `npm test`
5. `npm run validate` inklusive PT54-/Backup-/A11y-/Architecture-/Operator-/Release-Audits
6. Chromium E2E inklusive DWI/HR2/BK51/HR52/PR53/PT54
7. vollständiges `npm run ci`
8. Cross-Browser auf demselben RC-Commit
9. unveränderten Commit vollständig retesten
10. erst danach Branch Protection und Release Evidence real auf PASS setzen

## Release-Regel

Ein Workflow mit `steps: []` zählt weder als PASS noch als negativer Code-Test. Öffentlicher Release und Merge von PR #13 bleiben **NO_GO**, bis ein echter Runner den unveränderten RC vollständig ausgeführt hat.