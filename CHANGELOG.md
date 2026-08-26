# Changelog

Alle nennenswerten Änderungen an Secret Circle werden hier dokumentiert.

## Unreleased – Januar-2027 Release Foundation

Stand: 26. August 2026

### Aktueller Status

- Core Source Review/Hardening: **15/15 PREPARED**
- Accessibility: **PREPARED**
- DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56: **quellsseitig PREPARED, real offen**
- Offline-Core: **`secret-circle-v56` / `secret-circle-v56-staging`**
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

- `advanced-resume-guard.js` auf Version 4 erhöht.
- Location Spy akzeptiert im Result-State genau einen Ergebnisweg: Vote oder Guess.
- Mafia verwirft non-finished Stages bei bereits eindeutigem Alive-Winner.
- Mafia-Winner/Rollenanzahl bleiben an Alive-/Pack-/Spielerstruktur gebunden.
- `stage=finished` kann direct-save exact-once abgeschlossen werden.
- bestehende Advanced-Resume-Session wird nur nach Bestätigung ersetzt; Remove-Fehler bleibt fail-closed.
- neun kritische Advanced-E2Es + `scripts/advanced_integrity_audit.py` ergänzt.
- AD55 als realer Abnahmetest definiert.

### v56 – Quick Session Replacement

- neues `quick-session-replacement-guard.js` Version **1**.
- `quick-loader.js` auf **Version 7** erhöht und Loader-Reihenfolge auf Ledger → Controls → Replacement Guard → Engine erweitert.
- Guard schützt die gemeinsamen Active-Keys von Quick/Trending, Mega, Viral und Creator.
- normaler „Spiel starten“-Pfad darf eine gespeicherte Session desselben Spiels nicht mehr still überschreiben.
- Cross-Game-Wechsel innerhalb derselben Enginefamilie wird ebenfalls erkannt, selbst wenn der fremde Snapshot auf der aktuellen Seite nicht als Resume-Karte erscheint.
- Same-/Cross-Game-Ersatz benötigt eine ausdrückliche Bestätigung.
- Cancel verändert den gespeicherten Game-ID-/Session-ID-Snapshot nicht.
- der Alt-Snapshot wird nicht vorzeitig gelöscht; ein erfolgreicher Engine-`setItem` ersetzt ihn atomar.
- schlägt der Replacement-Write fehl und der Alt-Snapshot ist weiterhin gespeichert, blockiert der Guard den `pagehide`-Retry des fehlerhaften neuen In-Memory-Zustands und lädt kontrolliert neu.
- `tests/quick-session-replacement-guard.test.js` ergänzt.
- `tests/e2e/quick-session-replacement.spec.js` ergänzt: Same Game, Cross Game, Storage-Fail.
- `tests/e2e/party-session-controls.spec.js` prüft Controls → Guard → Engine für Quick/Mega/Viral.
- `tests/quick-loader.test.js` auf Loader v7 einschließlich Creator-Familie erweitert.
- `scripts/quick_session_replacement_audit.py` ergänzt und in `npm run validate` aufgenommen.
- `party-session-controls.spec.js` zusätzlich in den Syntax-Preflight aufgenommen.
- bestehender Staging-Smoke-Dokumentvertrag repariert: Deployment/Environment/Release-Checkliste enthalten wieder die verlangten `scripts/staging_smoke.py`-/`tests/pwa-head-metadata.test.js`-/Smoke-Marker.
- QR56 als eigener realer Abnahmetest definiert.

### PWA / Offline – v56

- Offline-Core auf **`secret-circle-v56` / `secret-circle-v56-staging`** erhöht.
- Quick Replacement Guard v1 und Quick Loader v7 werden offline ausgeliefert.
- alle früheren Advanced-/A11y-/Resume-/Privacy-/Backup-/Timerverträge bleiben enthalten.

### Build / CI

- `package-lock.json` v3; Playwright exakt 1.54.2; keine npm-Runtime-Dependencies.
- CI/Cross-Browser verwenden `npm ci`.
- PT54-, AD55- und QR56-Audits im Validate-Gate.
- letzter vollständig untersuchter Actions-Lauf bleibt historisch **Run #2787 auf v49**, `steps: null` / `steps: []`, ohne ausgeführten Repositorycode.
- **v50–v56 haben keinen Runner-PASS.**

### Operator / Assets

- `operator-release.json` bleibt `PREPARED / BLOCKED`.
- reale Hosting-/Legal-/Support-/Incident-Evidence bleibt offen.
- Root-`icon.svg` bleibt bis echter Rechtebestätigung `unresolved`.

### Releaseentscheidung

Zentrale offene Issues: **#7 CI**, **#8 Geräte/Beta/A11y/DWI/HR2/BK51/HR52/PR53/PT54/AD55/QR56**, **#14 Operator/Hosting/Legal/Support**.

Öffentlicher Release: **NO_GO**.