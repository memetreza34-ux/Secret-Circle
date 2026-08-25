# Release-Status – Secret Circle

Stand: 25. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13

## Gesamtstatus

**Phase:** Release-Härtung  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v50` / `secret-circle-v50-staging`**  
**Classic Content:** **v4**  
**Core Source Review:** **15/15 PREPARED**  
**Core Source Hardening:** **15/15 PREPARED**  
**Accessibility Source Hardening:** **PREPARED**  
**Word-Imposter Data/Resume Hardening:** **PREPARED**  
**Hub Resume Guard v2 + Lade-Quarantäne:** **PREPARED**  
**Operator / Hosting / Legal:** **PREPARED / BLOCKED**

Versionslinie:

- v45: Core-Hardening
- v46: Hub-A11y
- v47: Advanced-/Quick-/Creator-A11y
- v48: Word-Imposter Voting-/Datenhärtung
- v49: zentraler Hub-Resume-Guard v2
- **v50: fail-closed Sperre der Resume-UI während der Guard-Lade-/Validierungsphase**

## Core-Hardening – 15/15

Word Imposter, soziale Hub-Spiele, Paranoia, Scharade/Tabu, Heiße Kartoffel, Wortkette, Nur falsche Antworten sowie Advanced/Mafia sind quellsseitig auf Setup, Privacy, Resume, Timer, Regeln und Sieger-/Scoreintegrität gehärtet. Details: `CORE_GAME_ACCEPTANCE.md`.

## Word-Imposter Data/Resume – v48-Verträge im aktuellen v50-Core

- nächster abstimmender Spieler aus tatsächlichen offenen Vote-Keys
- manipulierte nicht-sequenzielle Voting-Snapshots blockiert
- 50 eigene Kategorien maximal
- 200 Begriffe je Kategorie maximal
- 51/201 fail-closed abgelehnt
- 1,5-MB-UTF-8-Backupgrenze
- abgelehnte Imports verändern bestehende Daten nicht

Source-Nachweise: `tests/storage.test.js`, `tests/word-imposter-data-contract.test.js`.

## Hub Resume – v49/v50

### v49

- `party-hub-resume-guard.js` Version 2 als zentrale getestete Runtime-Quelle
- `party-hub-polish.js` delegiert an denselben Guard
- Cross-Mode-/Phase-/Restzeit-Inkonsistenzen werden verworfen
- stale `#hub-resume-session` wird beim Verwerfen entfernt

### v50

- sichtbare Resume-Karte wird während der Guard-Prüfung `aria-busy`
- Resume-Buttons werden sofort deaktiviert
- Freigabe erst nach erfolgreicher Guard-Validierung
- Lade-/Integritätsfehler bleibt fail-closed
- `tests/party-hub-resume-guard.test.js` schützt diese Quarantäne zusätzlich

## Accessibility – v46/v47

- `party-hub-a11y.js`: Hub-Fokus, Modal, `inert`, Fokus-Trap und Rückkehrfokus
- `secondary-surface-a11y.js`: Advanced, Quick und Creator
- Creator-Radiogroup mit Pfeilen/Home/End

Beide A11y-Schichten bleiben im v50-Offline-Core. Reale VoiceOver-/TalkBack-/200-%-Zoom-/Touch-/Geräteabnahme bleibt offen.

## Operator / Hosting / Legal / Support

- `operator-release.json`: `PREPARED / BLOCKED`
- `OPERATOR_RELEASE_SIGNOFF.md`
- `OPERATOR_EVIDENCE_LOG.md`
- `HOSTING_DECISION.md` auf v50-Smokevertrag
- `LEGAL_CHECKLIST.md`, `SUPPORT.md`, `INCIDENT_RESPONSE.md`
- Issue #14 führt die realen Schritte

Kein Betreiber-, Provider-, Kontakt- oder Drill-Nachweis wird erfunden.

## Release-Audits

Die zentralen Verträge sind **transition-safe**:

- `scripts/branch_protection_contract_audit.py`
- `scripts/foundation_contract_audit.py`
- `scripts/release_readiness_contract_audit.py`
- `scripts/release_audit.py`
- `scripts/validate_project.py`

`validate_project.py` prüft zusätzlich den Hub-Resume-Loadervertrag. Die Audits akzeptieren PREPARED/NO_GO heute und einen später korrekt belegten FINAL/GO-Zustand.

## Build / Supply Chain

- `package-lock.json` v3
- Playwright 1.54.2
- keine npm-Runtime-Dependencies
- CI/Cross-Browser verwenden `npm ci`

**Offen:** echter Online-`npm ci`-/Integrity-PASS auf funktionierendem Runner.

## PWA v50

Service Worker:

- `secret-circle-v50`
- `secret-circle-v50-staging`

Offline enthalten sind Hub/Word Imposter/Advanced/Quick/Creator/Privacy, Katalog-/Contentmodule, Backup-Registry, Session-/Timercontroller, Word-Imposter-/Hub-/Advanced-Resume-Guards, `party-hub-polish.js` mit v50-Resume-Quarantäne, Privacy-Guards, beide A11y-Schichten, aktuelle Word-Imposter-UI-/Store-Dateien, Manifest und Icons.

Reale Installation, Upgrades, Rollback und Offline-Gerätetest bleiben offen.

## CI – P0

Letzter vollständig untersuchter v49-App-Actions-Lauf: **Run #2787**.

- Run ID `32871536761`
- Job `validate`, Job ID `97879489858`
- Head `a9ad91389ff9e966af432b0a77103ddc0960709d`
- `failure`
- `steps: null` / separate Step-Abfrage `steps: []`
- kein Checkout, npm, Test oder Repository-Code ausgeführt

Der Minimal-Runner-Probe zeigte dasselbe Muster ohne Repositoryabhängigkeit. Run #2787 bestätigte den Pre-Step-Blocker auf v49. **v50 ist daher ebenfalls noch nicht runnerverifiziert.** Details: Issue #7 / `CI_TROUBLESHOOTING.md`.

## Release Evidence / Assets

- `release-evidence.json`: **PREPARED / NO_GO**
- `operator-release.json`: **PREPARED / BLOCKED**
- Root-`icon.svg` und Ableitungen: Rechtebasis weiterhin `unresolved`

## Drei zentrale offene GitHub-Blocker

1. **Issue #7** – Hosted Runner vor Step 1
2. **Issue #8** – reale Geräte, v50 Offline-PWA, Accessibility, Word-Imposter-Datengrenzen, Hub-Resume-v2/v50-Ladequarantäne und Partytests
3. **Issue #14** – Operator, Hosting, Legal, Support und Incident Evidence

## Real offene Releasegates

1. Actions-Runner / echte Steps
2. Online-`npm ci` + CI/Cross-Browser
3. Branch Protection real aktiv
4. Hostingprovider + getrennte HTTPS-Origins
5. v50 Staging-/Production-/PWA-Smokes
6. v50 Upgrade/Rollback auf echten Installationen
7. Word-Imposter-Daten-/Voting-Verträge + Hub-Resume-v2/v50-Quarantäne real
8. Android / iPhone / Tablet
9. VoiceOver / TalkBack / Tastatur / 200-%-Zoom
10. reale Gruppen/Beta für alle 15 Core-Spiele
11. Icon-/Visual-/Third-Party-Sign-off
12. Operator-/Privacy-/Support-/Legal-Sign-off
13. Support-/Security-/SEV-1-/Rollback-Drill
14. unveränderter RC + Release Evidence FINAL/GO

## Releaseentscheidung

- öffentlicher Release: **NO_GO**
- PR #13 mergen: **Nein**
- PR #13 bleibt Draft: **Ja**