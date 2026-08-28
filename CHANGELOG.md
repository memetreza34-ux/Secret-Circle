# Changelog

Alle nennenswerten Änderungen an Secret Circle werden hier dokumentiert.

## Unreleased – Januar-2027 Release Foundation

Stand: 28. August 2026

### Aktueller Status

- Core Source Review/Hardening: **15/15 PREPARED**
- Accessibility: **PREPARED**
- DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57 / BF58 / BG59: **quellsseitig PREPARED, real offen**
- Offline-Core: **`secret-circle-v59` / `secret-circle-v59-staging`**
- `release-evidence.json`: **PREPARED / NO_GO**
- PR #13: **Draft / ungemergt**

### v46–v47 – Accessibility

Hub-A11y sowie Advanced/Quick/Creator-Fokus-/Modal-/Radiogroup-Hardening eingeführt. Reale Screenreader-/Geräteabnahme bleibt offen.

### v48 – Word-Imposter Data/Resume

Voting-Resume, Daten-/Importgrenzen und kein stilles Trunkieren gehärtet.

### v49–v50 – Hub Resume Guard

Zentraler Hub-Resume-Guard v2; Cross-Mode-/Timer-Inkonsistenzen fail-closed; Resume-Aktionen während Guard-Ladung deaktiviert.

### v51 – Complete Backup

Registry-basierte Key-Eigentümerschaft, Future-Key/-Version-Erhalt, Vorvalidierung und managed-only Restore/Rollback.

### v52–v54 – Hub Round / Privacy / Pre-Timer Resume

Sichere Current-Runden bleiben über Reload stabil; Paranoia behält verdeckt Frage/Resultat; Hot-Potato-/Word-Chain-Pre-Timer-Werte bleiben bis zum Timer-Handoff stabil.

### v55 – Advanced Integrity

Advanced Resume Guard v4, Location-/Mafia-Integrität, exact-once-Abschluss und bestätigter Advanced-Session-Ersatz.

### v56 – Quick Session Replacement

Quick Replacement Guard v1 + Quick Loader v7 schützen Same-/Cross-Game-Ersatz in Quick/Trending, Mega, Viral und Creator; Cancel erhält Altstand, Write-Fail bleibt fail-closed.

### v57 – Quick Timer Resume

- `party-session-controls.js` Version 2.
- promptfreier Store `secret-circle-party-quick-timers-v1` für Restzeit-Metadaten.
- Resume nur bei exakt passender Game-ID, Session-ID, Runde, Phase und Ausgangsdauer.
- Complete Backup verwaltet 17 exakte aktuelle Storage-Keys.
- QT57 als eigener Realtest.

### v58 – BFCache Timer Resume

- `party-session-controls.js` Version 3.
- `pageshow.persisted` mit passendem Snapshot führt kontrolliert in den normalen QT57-Resume-Pfad.
- stale Snapshot wird gelöscht, ohne unnötigen Reload.
- Browserfälle in `tests/e2e/quick-timer-resume.spec.js` und eigener BF58-Audit.

### v59 – Background Timer Fairness

- `party-session-controls.js` auf **Version 4** erhöht.
- laufende Quick-/Trending-/Mega-/Viral-/Creator-Timer beobachten `visibilitychange`.
- `document.hidden` pausiert eine aktive Timer-Runde automatisch.
- Hintergrundzeit durch App-/Tabwechsel oder Screen-Lock wird nicht als Spielzeit abgezogen.
- Rückkehr auf `visible` startet **nicht automatisch** weiter; der Nutzer muss bewusst `Fortsetzen` wählen.
- Visibility-Wechsel ohne laufenden Timer verändert keinen Rundenzustand.
- `tests/party-session-controls.test.js` um 60-Sekunden-Hintergrund-Fairnessvertrag erweitert.
- neues `tests/e2e/quick-background-pause.spec.js` prüft Pause-Overlay, stehende Restzeit und expliziten Resume.
- neues `scripts/quick_background_pause_audit.py` in `npm run validate`.
- QT57-/BF58-Audits auf SessionControls v4 kompatibel gemacht.
- `scripts/architecture_audit.py` erzwingt BG59 und den Browservertrag.
- BG59 als eigener realer App-Wechsel-/Screen-Lock-Abnahmetest definiert.

### PWA / Offline – v59

- Offline-Core auf **`secret-circle-v59` / `secret-circle-v59-staging`** erhöht.
- SessionControls v4, QT57, BF58, BG59, Quick Replacement Guard v1 und Quick Loader v7 werden offline ausgeliefert.
- Backup-Dateiformat bleibt Version 1 mit 17 managed Keys; BG59 erzeugt keine neuen Storage-Daten.
- alle früheren Advanced-/A11y-/Resume-/Privacy-/Backup-Verträge bleiben enthalten.

### Build / CI

- `package-lock.json` v3; Playwright exakt 1.54.2; keine npm-Runtime-Dependencies.
- CI/Cross-Browser verwenden `npm ci`.
- PT54-, AD55-, QR56-, QT57-, BF58- und BG59-Audits im Validate-Gate.
- Quick-Timer-/BFCache-/Background-Pause-Browserverträge im normalen Playwright-Gate; relevante Specs im Syntax-Preflight.
- letzter vollständig untersuchter Actions-Lauf bleibt historisch **Run #2787 auf v49**, `steps: null` / `steps: []`, ohne ausgeführten Repositorycode.
- **v50–v59 haben keinen Runner-PASS.**

### Operator / Assets

- `operator-release.json` bleibt `PREPARED / BLOCKED`.
- reale Hosting-/Legal-/Support-/Incident-Evidence bleibt offen.
- Root-`icon.svg` bleibt bis echter Rechtebestätigung `unresolved`.

### Releaseentscheidung

Zentrale offene Issues: **#7 CI**, **#8 Geräte/Beta/A11y + Spezialgates bis BG59**, **#14 Operator/Hosting/Legal/Support**.

Öffentlicher Release: **NO_GO**.