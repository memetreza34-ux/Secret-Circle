# Changelog

Alle nennenswerten Änderungen an Secret Circle werden hier dokumentiert.

## Unreleased – Januar-2027 Release Foundation

Stand: 26. August 2026

### Aktueller Status

- Core Source Review/Hardening: **15/15 PREPARED**
- Accessibility: **PREPARED**
- DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55: **quellsseitig PREPARED, real offen**
- Offline-Core: **`secret-circle-v55` / `secret-circle-v55-staging`**
- `release-evidence.json`: **PREPARED / NO_GO**
- PR #13: **Draft / ungemergt**

### v46–v47 – Accessibility

Hub-A11y sowie Advanced/Quick/Creator-Fokus-/Modal-/Radiogroup-Hardening eingeführt. Reale Screenreader-/Geräteabnahme bleibt offen.

### v48 – Word-Imposter Data/Resume

Voting-Resume, 50 Kategorien, 200 Begriffe je Kategorie, 1,5-MB-UTF-8-Grenze, kein stilles Trunkieren und keine Bestandsmutation bei abgelehntem Import.

### v49–v50 – Hub Resume Guard

Zentraler Hub-Resume-Guard v2; Cross-Mode-/Timer-Inkonsistenzen fail-closed; Resume-Aktionen während Guard-Ladung deaktiviert.

### v51 – Complete Backup

Registry-basierte Key-Eigentümerschaft, Future-Key/-Version-Erhalt, Vorvalidierung und managed-only Restore/Rollback.

### v52 – Hub Round Resume

Sichere Truth-Dare-/Prompt-/Choice-Karten bleiben über Reload identisch; Wahrheit/Pflicht besitzen getrennte Usage-Pools.

### v53 – Paranoia Resume / Privacy

Paranoia hält validierte Kartenreferenz/Phase und bereits gefälltes Münzwurf-Ergebnis, bleibt nach Reload aber gedeckt. Aufgelöster Zustand wird bei Fokusverlust erneut verdeckt.

### v54 – Pre-Timer Resume

Hot-Potato-Aufgabe und Wortketten-Startbuchstabe bleiben vor Timerstart über Reload stabil. Beim Start wird `current` gelöscht und derselbe Wert in `timer.prompt`/`timer.letter` übernommen. PT54-Audit und Browser-Spec ergänzt.

### v55 – Advanced Integrity

- `advanced-resume-guard.js` auf **Version 4** erhöht.
- Location Spy akzeptiert im Result-State genau einen Ergebnisweg: Vote oder Guess, nicht beide zugleich.
- Mafia verwirft non-finished Stages, wenn die Alive-Verteilung bereits eindeutig einen Gewinner bestimmt.
- Mafia-Winner und Rollenanzahl bleiben an die tatsächliche Alive-/Pack-/Spielerstruktur gebunden.
- `stage=finished` kann direkt gespeichert werden; die fertige Mafia-Runde wird dabei exact-once verbucht.
- erneutes Speichern derselben Advanced-Session-ID erzeugt keinen zweiten History-/Stats-Eintrag.
- „Neue Session beginnen“ ersetzt eine bestehende Advanced-Resume-Session erst nach expliziter Bestätigung.
- schlägt das Entfernen des alten Active-State fehl, startet keine neue Session.
- `tests/e2e/advanced-secret-resume.spec.js`: veralteter 8-Spieler-Klassisch-Fixture auf korrekte 2 Mafia korrigiert.
- neues `tests/e2e/advanced-new-session-guard.spec.js` für Cancel/Confirm/Storage-Fail.
- `tests/e2e/advanced-resume-integrity.spec.js` um Location-Hybrid- und Mafia-Terminalzustände erweitert.
- `tests/e2e/advanced-completion-exact-once.spec.js` um den Mafia-finished-Direktabschluss erweitert.
- neun kritische Advanced-E2Es im Syntax-Preflight.
- neues `scripts/advanced_integrity_audit.py` in `npm run validate`.
- AD55 als eigener realer Abnahmetest definiert.

### PWA / Offline – v55

- Offline-Core auf **`secret-circle-v55` / `secret-circle-v55-staging`** erhöht.
- Advanced Resume Guard v4 und der gehärtete Advanced Runner werden offline ausgeliefert.
- alle früheren A11y-/Resume-/Privacy-/Backup-/Timerverträge bleiben enthalten.

### Build / CI

- `package-lock.json` v3; Playwright exakt 1.54.2; keine npm-Runtime-Dependencies.
- CI/Cross-Browser verwenden `npm ci`.
- PT54- und AD55-Audits im Validate-Gate.
- letzter vollständig untersuchter Actions-Lauf bleibt historisch **Run #2787 auf v49**, `steps: null` / `steps: []`, ohne ausgeführten Repositorycode.
- **v50–v55 haben keinen Runner-PASS.**

### Operator / Assets

- `operator-release.json` bleibt `PREPARED / BLOCKED`.
- reale Hosting-/Legal-/Support-/Incident-Evidence bleibt offen.
- Root-`icon.svg` bleibt bis echter Rechtebestätigung `unresolved`.

### Releaseentscheidung

Zentrale offene Issues: **#7 CI**, **#8 Geräte/Beta/A11y/DWI/HR2/BK51/HR52/PR53/PT54/AD55**, **#14 Operator/Hosting/Legal/Support**.

Öffentlicher Release: **NO_GO**.