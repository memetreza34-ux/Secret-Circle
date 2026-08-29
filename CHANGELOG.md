# Changelog

Alle nennenswerten Änderungen an Secret Circle werden hier dokumentiert.

## Unreleased – Januar-2027 Release Foundation

Stand: 29. August 2026

### Aktueller Status

- Source-Generation: **v64**
- Built-ins: **55 · 15 Core / 13 Extended / 27 Labs**
- Expansion Wave 1: **10/10 quellsseitig implementiert; real evidence OPEN**
- Core Source Review/Hardening: **15/15 PREPARED**
- Accessibility: **PREPARED**
- Spezialgates DWI bis HS60: **quellsseitig PREPARED, real offen**
- Offline-Core: **`secret-circle-v64` / `secret-circle-v64-staging`**
- `release-evidence.json`: **PREPARED / NO_GO**
- PR #13: **Draft / ungemergt**
- PR-Stack: **muss vor Release mit zwei späteren `main`-Commits reconciled werden**

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

Quick Replacement Guard v1 schützt Same-/Cross-Game-Ersatz in Quick/Trending, Mega, Viral und Creator; Cancel erhält Altstand, Write-Fail bleibt fail-closed.

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
- Cold Resume nach mobilem OS-/Browserprozess-Kill ist quellsseitig auch dann vorgesehen, wenn `pagehide` nicht mehr zuverlässig ausgeführt wird.
- der Hidden-Snapshot wird beim Cold Resume genau einmal über QT57 konsumiert.
- HS60 als eigener realer Mobile-/PWA-Abnahmetest definiert.

### v61 – Wave 1 Quiz

- gemeinsame Quiz-Infrastruktur eingeführt
- `party-quiz` und `fact-or-fake` als Labs integriert
- Result-Resume und exact-once Score/History quellsseitig abgesichert

### v62 – Wave 1 Imposter

- gemeinsame Imposter-Infrastruktur ergänzt
- `undercover-similar-word` und `no-word-imposter` als Labs integriert
- private Handoff-/Vote-/Guess-Grenzen und Resume-Verträge ergänzt

### v63 – Wave 1 Writing

- gemeinsame Writing-Infrastruktur ergänzt
- `fill-blank-battle` und `who-wrote-it` als Labs integriert
- private Eingaben, anonyme Phasen und exact-once Completion quellsseitig gehärtet

### v64 – Expansion Wave 1 Complete

Expansion Wave 1 ist quellsseitig mit **10/10 geplanten Labs** komplett:

1. `bluff-trivia`
2. `party-quiz`
3. `fact-or-fake`
4. `percent-guess`
5. `fill-blank-battle`
6. `who-wrote-it`
7. `party-bracket`
8. `undercover-similar-word`
9. `no-word-imposter`
10. `password-one-word`

Gemeinsame Architektur:

- sechs wiederverwendbare Enginefamilien: Quiz, Imposter, Writing, Estimation/Voting, Bluff und Clue
- `quick-loader.js` **v11** routet alle Wave-1-Familien explizit
- `party-release-structure.js` **v5** hält alle zehn Wave-1-Modi in Labs
- aktueller zusammengesetzter Katalog: **55 Built-ins / 15 Core / 13 Extended / 27 Labs**
- Wave-1-Unit-/E2E-/Audit-Verträge sind vorbereitet
- reale Browser-/PWA-/Accessibility-/Gruppenevidence bleibt offen

### Release-Metadaten / Drift-Schutz

- neue zentrale `release-meta.json` für Source-Generation, Package-Version, Cachegeneration, Built-in-Zahlen, Wave-1-Status, Releasezustand, CI-Befund und PR-Stack
- `tests/party-release-structure.test.js` bindet `release-meta.json` an den real zusammengesetzten Runtime-Katalog
- `tests/service-worker.test.js` bindet Production-/Staging-Cache an `release-meta.json`
- dadurch sollen zukünftige Abweichungen wie v61-Doku bei v64-Runtime als Testfehler sichtbar werden

### PWA / Offline – v64

- Offline-Core auf **`secret-circle-v64` / `secret-circle-v64-staging`** erhöht.
- SessionControls v5, QT57, BF58, BG59, HS60, Quick Replacement Guard und Quick Loader v11 werden offline ausgeliefert.
- alle sechs Wave-1-Katalog-/Runnerfamilien sind im Service-Worker-Core enthalten.
- alle früheren Advanced-/A11y-/Resume-/Privacy-/Backup-Verträge bleiben enthalten.

### Build / CI

- `package-lock.json` v3; Playwright exakt 1.54.2; keine npm-Runtime-Dependencies.
- CI/Cross-Browser verwenden `npm ci`.
- Syntax-, Unit-, Contract-, Audit- und Playwright-Gates sind vorbereitet.
- frischer v64-Actions-Nachweis: **Run #3608**, Run ID `33253663445`, Job `99103557030`, Head `2297868e1f65b45753294151a3b1f401a55f6288`, `steps: []`, `runner_id: 0`, leerer Runner-Name.
- kein Repositorycode wurde in diesem Job ausgeführt.
- **v50–v64 haben keinen Hosted-Runner-PASS.**

### PR-/Branch-Stack

Aktuelle Kette:

`main` → PR #3 → PR #11 → PR #13.

PR #11 liegt vollständig auf #3 und PR #13 vollständig auf #11. Die erste Stack-Basis ist gegenüber aktuellem `main` jedoch diverged und enthält zwei spätere Main-Commits nicht in ihrer Abstammung:

- `6b6bddd0ae619d160b4468b61ae49cb30e2ea834`
- `d347c7138bae18325c288632222917ad618e6547`

Vor einer Release-Mergefolge muss diese Basis kontrolliert reconciled werden; danach sind wegen des neuen Kandidaten neue Release-Tests/Evidence erforderlich.

### Operator / Assets

- `operator-release.json` bleibt `PREPARED / BLOCKED`.
- reale Hosting-/Legal-/Support-/Incident-Evidence bleibt offen.
- Root-`icon.svg` bleibt bis echter Rechtebestätigung oder Ersatz `unresolved`.

### Releaseentscheidung

Zentrale offene Issues: **#7 CI**, **#8 Geräte/Beta/A11y + Spezialgates + Wave 1**, **#14 Operator/Hosting/Legal/Support**.

Zusätzlicher struktureller Blocker: **PR-Stack mit aktuellem `main` reconciliieren**.

Öffentlicher Release: **NO_GO**.
