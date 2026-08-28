# Secret Circle – CI Troubleshooting

Stand: 28. August 2026

## Aktueller Befund

Die geprüften GitHub-Actions-Jobs erreichen weiterhin **keinen Workflow-Schritt**.

Letzter vollständig untersuchter App-CI-Befund bleibt der historische **v49 Run #2787** (`Secret Circle CI`) auf Head `a9ad91389ff9e966af432b0a77103ddc0960709d`.

- Run-ID `32871536761`
- Job-ID `97879489858`
- `completed / failure`
- Jobliste `steps: null`
- separate Step-Abfrage `steps: []`
- kein Checkout / Node-/Python-Setup / npm / Test / Playwright / Repositorycode ausgeführt

Dieser historische Bezug bleibt absichtlich v49. Der aktuelle Source-/Offline-Core ist inzwischen **v59**. **v50–v59 besitzen keinen echten Runner-PASS.**

## Isolierter Hosted-Runner-Probe

Der temporäre `Secret Circle Runner Probe` enthielt keinen Checkout, keine Setup-Action und keine Dependencyinstallation, sondern nur lokalen Bash-Code (`echo`, `uname -a`).

Run #7: Head `a9f2591a5280ec67b9042df8ff636019c7c6149a`, Run-ID `32650097848`, Job-ID `97220210640`, `steps: []`. Selbst dieser lokale Bash-Schritt startete nicht.

Damit sind Checkout, Node/Python-Setup, `npm ci`, Playwright und Secret-Circle-Code als **unmittelbare Ursache dieses Pre-Step-Fehlers** ausgeschlossen. Die exakte externe Ursache ist nicht bewiesen. Prüfflächen bleiben Hosted-Runner-Zuteilung, Account/Billing/Budget, Repo-/Org-/Enterprise-Policy und GitHub-seitige Runner-Störung.

## Aktueller Buildvertrag – v59

- Offline-Core `secret-circle-v59` / `secret-circle-v59-staging`
- v50 Hub Resume Loader fail-closed
- v51 Complete Backup Registry v2 + PartyDataTools v6
- v52 Safe Hub Current
- v53 Paranoia Resume/Privacy
- v54 PT54 Pre-Timer Resume
- v55 Advanced Resume Guard v4 + `advanced_integrity_audit.py`
- v56 Quick Replacement Guard v1 + Quick Loader v7
- v57 promptfreier Quick-Family-Timer-Store + Restzeit-Resume
- v58 BFCache `pageshow.persisted` Restore-Schutz
- **v59 `party-session-controls.js` Version 4**
- **BG59: `document.hidden` pausiert laufende Quick-Family-Timer; `visible` startet nicht automatisch weiter**
- **Hintergrundzeit durch App-/Tabwechsel oder Screen-Lock wird nicht als Spielzeit abgezogen**
- `tests/party-session-controls.test.js` in `npm test`
- `tests/e2e/quick-timer-resume.spec.js` + `tests/e2e/quick-background-pause.spec.js` im Browservertrag
- `scripts/quick_timer_resume_audit.py`, `scripts/quick_bfcache_resume_audit.py`, `scripts/quick_background_pause_audit.py` in `npm run validate`
- Complete Backup verwaltet 17 exakte aktuelle Storage-Keys einschließlich Timer-Store
- `scripts/backup_contract_audit.py` und `scripts/architecture_audit.py` erzwingen die aktuellen Timerverträge ebenfalls
- `package-lock.json` v3
- Playwright 1.54.2 exakt
- CI/Cross-Browser verwenden `npm ci`
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
5. `npm run validate` inklusive PT54 / AD55 / QR56 / QT57 / BF58 / **BG59** / Backup / A11y / Architecture / Operator / Release-Audits
6. Chromium E2E inklusive Quick-Timer-/BFCache-/Background-Pause-Verträge
7. vollständiges `npm run ci`
8. Cross-Browser auf demselben RC-Commit
9. unveränderten Commit vollständig retesten
10. erst danach Branch Protection und Release Evidence real auf PASS setzen

## Release-Regel

Ein Workflow mit `steps: []` zählt weder als PASS noch als negativer Code-Test. Öffentlicher Release und Merge von PR #13 bleiben **NO_GO**, bis ein echter Runner den unveränderten RC vollständig ausgeführt hat.