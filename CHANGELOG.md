# Changelog

Alle nennenswerten Änderungen an Secret Circle werden hier dokumentiert.

## Unreleased – Januar-2027 Release Foundation

Stand: 28. August 2026

### Aktueller Status

- Core Source Review/Hardening: **15/15 PREPARED**
- Accessibility: **PREPARED**
- Spezialgates DWI bis HS60: **quellsseitig PREPARED, real offen**
- Offline-Core: **`secret-circle-v60` / `secret-circle-v60-staging`**
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

Promptfreier Store `secret-circle-party-quick-timers-v1` für Restzeit-Metadaten; Resume nur bei exakt passender Game-ID, Session-ID, Runde, Phase und Ausgangsdauer; Complete Backup verwaltet 17 exakte aktuelle Storage-Keys.

### v58 – BFCache Timer Resume

`pageshow.persisted` mit passendem Snapshot führt kontrolliert in den normalen QT57-Resume-Pfad; stale Snapshot wird gelöscht, ohne unnötigen Reload.

### v59 – Background Timer Fairness

`document.hidden` pausiert laufende Quick-/Trending-/Mega-/Viral-/Creator-Timer; Hintergrundzeit wird nicht abgezogen; sichtbare Rückkehr verlangt explizites `Fortsetzen`.

### v60 – Hidden Snapshot Durability

- `party-session-controls.js` auf **Version 5** erhöht.
- `visibilitychange(hidden)` persistiert die technische Restzeit sofort in den bestehenden promptfreien Timer-Store.
- Hidden-Persistenz setzt **nicht** `preservePersistedOnNextStop`; ein normaler Same-Page-Stop räumt den Snapshot wieder auf.
- nur der `pagehide`-Pfad setzt Preserve-on-next-stop, damit der unmittelbar folgende Engine-Stop den Snapshot nicht löscht.
- Cold Resume nach mobilem OS-/Browserprozess-Kill funktioniert dadurch auch dann, wenn `pagehide` nicht mehr zuverlässig ausgeführt wurde.
- der Hidden-Snapshot wird beim Cold Resume genau einmal über QT57 konsumiert.
- `tests/party-session-controls.test.js` um Hidden-only Persistenz, Cold Resume und Same-Page-Cleanup erweitert.
- `tests/e2e/quick-background-pause.spec.js` prüft sofortige Hidden-Persistenz und Cleanup nach normalem Rundenende.
- neues `scripts/quick_hidden_snapshot_audit.py` in `npm run validate`.
- QT57-/BF58-/BG59-Audits auf SessionControls v5 aktualisiert.
- `scripts/architecture_audit.py` erzwingt HS60.
- Backup-Dateiformat Version 1 und 17-Key-Allowlist bleiben unverändert.
- HS60 als eigener realer Mobile-/PWA-Abnahmetest definiert.

### PWA / Offline – v60

- Offline-Core auf **`secret-circle-v60` / `secret-circle-v60-staging`** erhöht.
- SessionControls v5, QT57, BF58, BG59, HS60, Quick Replacement Guard v1 und Quick Loader v7 werden offline ausgeliefert.
- alle früheren Advanced-/A11y-/Resume-/Privacy-/Backup-Verträge bleiben enthalten.

### Build / CI

- `package-lock.json` v3; Playwright exakt 1.54.2; keine npm-Runtime-Dependencies.
- CI/Cross-Browser verwenden `npm ci`.
- Timer-Lifecycle-Audits QT57/BF58/BG59/HS60 im Validate-Gate.
- letzter vollständig untersuchter Actions-Lauf bleibt historisch **Run #2787 auf v49**, `steps: null` / `steps: []`, ohne ausgeführten Repositorycode.
- **v50–v60 haben keinen Runner-PASS.**

### Operator / Assets

- `operator-release.json` bleibt `PREPARED / BLOCKED`.
- reale Hosting-/Legal-/Support-/Incident-Evidence bleibt offen.
- Root-`icon.svg` bleibt bis echter Rechtebestätigung `unresolved`.

### Releaseentscheidung

Zentrale offene Issues: **#7 CI**, **#8 Geräte/Beta/A11y + Spezialgates bis HS60**, **#14 Operator/Hosting/Legal/Support**.

Öffentlicher Release: **NO_GO**.