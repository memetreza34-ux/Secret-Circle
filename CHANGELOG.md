# Changelog

Alle nennenswerten Änderungen an Secret Circle werden hier dokumentiert.

## Unreleased – Januar-2027 Release Foundation

Stand: 27. August 2026

### Aktueller Status

- Core Source Review/Hardening: **15/15 PREPARED**
- Accessibility: **PREPARED**
- DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57: **quellsseitig PREPARED, real offen**
- Offline-Core: **`secret-circle-v57` / `secret-circle-v57-staging`**
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

- `quick-session-replacement-guard.js` Version 1.
- `quick-loader.js` Version 7: Ledger → Controls → Replacement Guard → Engine.
- Same-/Cross-Game-Ersatz innerhalb Quick/Trending, Mega, Viral und Creator benötigt Bestätigung.
- Cancel erhält den Alt-Snapshot; Replacement-Write-Fail bleibt fail-closed.
- Unit-/Browser-/Load-Order-Verträge + `scripts/quick_session_replacement_audit.py` ergänzt.
- QR56 als realer Abnahmetest definiert.

### v57 – Quick Timer Resume

- `party-session-controls.js` auf **Version 2** erhöht.
- laufende Quick-/Trending-/Mega-/Viral-/Creator-Timer sichern bei `pagehide` ihre verbleibende Zeit vor dem späteren Engine-Stop.
- neuer technischer Store `secret-circle-party-quick-timers-v1` Version 1.
- Timer-Snapshots enthalten ausschließlich `gameId`, `sessionId`, `round`, `phase`, `durationMs` und `remainingMs` je Enginefamilie.
- keine Prompts, Antworten, Missionen, Identitäten oder geheimen Karteninhalte im Timer-Store.
- Resume nur bei exakt passender Game-ID, Session-ID, Runde, Phase und Ausgangsdauer.
- passender Snapshot wird einmalig konsumiert; stale/fremde Snapshots werden verworfen.
- `backup-schema-registry.js` verwaltet nun **17 exakte aktuelle Storage-Keys** einschließlich Timer-Store; Complete-Backup-Dateiformat bleibt Version 1.
- `tests/party-session-controls.test.js` um Restzeit-Persistenz, Pagehide-Handoff und Stale-Reject erweitert.
- neues `tests/e2e/quick-timer-resume.spec.js`: Rapid Fire nimmt Restzeit statt voller Dauer wieder auf; Fremdsession-Snapshot darf neuen Timer nicht verkürzen.
- `tests/backup-schema-registry.test.js` um Timer-Store-Schema und Runtime-Eigentum erweitert.
- neues `scripts/quick_timer_resume_audit.py` in `npm run validate`.
- `scripts/backup_contract_audit.py` und `scripts/architecture_audit.py` auf QT57 erweitert.
- QT57 als eigener realer Abnahmetest definiert.

### PWA / Offline – v57

- Offline-Core auf **`secret-circle-v57` / `secret-circle-v57-staging`** erhöht.
- SessionControls v2, Timer-Resume, Quick Replacement Guard v1 und Quick Loader v7 werden offline ausgeliefert.
- alle früheren Advanced-/A11y-/Resume-/Privacy-/Backup-Verträge bleiben enthalten.

### Build / CI

- `package-lock.json` v3; Playwright exakt 1.54.2; keine npm-Runtime-Dependencies.
- CI/Cross-Browser verwenden `npm ci`.
- PT54-, AD55-, QR56- und QT57-Audits im Validate-Gate.
- QT57-Browser-Spec im Syntax-Preflight.
- letzter vollständig untersuchter Actions-Lauf bleibt historisch **Run #2787 auf v49**, `steps: null` / `steps: []`, ohne ausgeführten Repositorycode.
- **v50–v57 haben keinen Runner-PASS.**

### Operator / Assets

- `operator-release.json` bleibt `PREPARED / BLOCKED`.
- reale Hosting-/Legal-/Support-/Incident-Evidence bleibt offen.
- Root-`icon.svg` bleibt bis echter Rechtebestätigung `unresolved`.

### Releaseentscheidung

Zentrale offene Issues: **#7 CI**, **#8 Geräte/Beta/A11y/DWI/HR2/BK51/HR52/PR53/PT54/AD55/QR56/QT57**, **#14 Operator/Hosting/Legal/Support**.

Öffentlicher Release: **NO_GO**.