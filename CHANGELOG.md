# Changelog

Alle nennenswerten Änderungen an Secret Circle werden hier dokumentiert.

## Unreleased – Januar-2027 Release Foundation

Stand: 26. August 2026

### Aktueller Status

- Core Source Review/Hardening: **15/15 PREPARED**
- Accessibility: **PREPARED**
- DWI / HR2 / BK51 / HR52 / PR53 / PT54: **quellsseitig PREPARED, real offen**
- `release-evidence.json`: **PREPARED / NO_GO**
- PR #13: **Draft / ungemergt**

### v46–v47 – Accessibility

Hub-A11y sowie Advanced/Quick/Creator-Fokus-/Modal-/Radiogroup-Hardening eingeführt. Reale Screenreader-/Geräteabnahme bleibt offen.

### v48 – Word-Imposter Data/Resume

Voting-Resume, 50 Kategorien, 200 Begriffe je Kategorie, 1,5-MB-UTF-8-Grenze, kein stilles Trunkieren und keine Bestandsmutation bei abgelehntem Import.

### v49–v50 – Hub Resume Guard

Zentraler `party-hub-resume-guard.js` v2; Cross-Mode-/Timer-Inkonsistenzen fail-closed; stale Resume UI entfernt; Resume-Aktionen während Guard-Ladung bis erfolgreicher Validierung deaktiviert.

### v51 – Complete Backup / Forward Compatibility

Registry-basierte aktuelle Key-Eigentümerschaft, Future-Key/-Version-Erhalt, key-spezifische Vorvalidierung, `party-data-tools.js` v6 und managed-only Restore/Rollback. BK51 als Realtest definiert.

### v52 – Hub Round Resume / Truth-Dare Usage

`party-hub-round-state.js` eingeführt. Sichere Truth-Dare-/Prompt-/Choice-Karten bleiben über Reload identisch; Wahrheit/Pflicht besitzen getrennte Usage-Pools; ungültige Current-Referenzen werden verworfen. HR52 definiert.

### v53 – Paranoia Resume / Privacy

`party-hub-round-state.js` v2: Paranoia hält validierte Kartenreferenz/Phase und bereits gefälltes Münzwurf-Ergebnis, bleibt nach Reload aber gedeckt. `party-hub-polish.js` v17 verdeckt auch den aufgelösten Zustand bei Fokusverlust. Same-question/same-result-E2E und PR53 ergänzt.

### v54 – Pre-Timer Resume

- `party-hub-round-state.js` auf **Version 3** erhöht.
- `hot-potato` und `word-chain` sind sichere Pre-Start-Current-Modi.
- Hot Potato behält die bereits angezeigte Aufgabe über Reload/Resume vor Timerstart.
- Wortkette behält den bereits angezeigten Startbuchstaben über Reload/Resume vor Timerstart.
- Beim tatsächlichen Timerstart wird `current` **vor** Erstellung des Timer-Snapshots gelöscht.
- derselbe Hot-Potato-Wert wird danach in `timer.prompt`, derselbe Wortkettenwert in `timer.letter` fortgeführt.
- Scharade/Tabu sind ausdrücklich nicht in den sichtbaren Pre-Start-Current-Modi enthalten.
- neues `tests/e2e/core-hub-prestart-resume.spec.js` schützt beide Browserpfade.
- `tests/hub-resume-contract.test.js` und `tests/hub-timer-contract.test.js` schützen RoundState-v3-/Handoff-Verträge.
- neues `scripts/hub_prestart_resume_audit.py` bündelt Runtime, Tests, PWA und Deploymentvertrag und läuft in `npm run validate`; der Audit prüft seine eigene Validate-Einbindung.
- PT54 als eigener Realtest definiert.

### PWA / Offline – v54

- Offline-Core: **`secret-circle-v54` / `secret-circle-v54-staging`**.
- Service-Worker-Test auf Cachevertrag 54.
- Architektur, Deployment, Environment, Privacy und Hosting auf v54/PT54 synchronisiert.
- alle v46–v53 Schutzschichten bleiben enthalten.

### Build / CI

- `package-lock.json` v3; Playwright exakt 1.54.2; keine npm-Runtime-Dependencies.
- CI/Cross-Browser verwenden `npm ci`.
- PT54-E2E im Syntax-Preflight und PT54-Audit im Validate-Gate.
- Letzter vollständig untersuchter Actions-Lauf bleibt historisch **Run #2787 auf v49**, `steps: null` / `steps: []`, ohne ausgeführten Repositorycode.
- **v50–v54 haben keinen Runner-PASS.**

### Operator / Assets

- `operator-release.json` bleibt `PREPARED / BLOCKED`.
- reale Hosting-/Legal-/Support-/Incident-Evidence bleibt offen.
- Root-`icon.svg` bleibt bis echter Rechtebestätigung `unresolved`.

### Releaseentscheidung

Zentrale offene Issues: **#7 CI**, **#8 Geräte/Beta/A11y/DWI/HR2/BK51/HR52/PR53/PT54**, **#14 Operator/Hosting/Legal/Support**.

Öffentlicher Release: **NO_GO**.