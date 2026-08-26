# Release-Status – Secret Circle

Stand: 26. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13

## Gesamtstatus

**Phase:** Release-Härtung  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v51` / `secret-circle-v51-staging`**  
**Classic Content:** **v4**  
**Core Source Review:** **15/15 PREPARED**  
**Core Source Hardening:** **15/15 PREPARED**  
**Accessibility Source Hardening:** **PREPARED**  
**Word-Imposter Data/Resume Hardening:** **PREPARED**  
**Hub Resume Guard v2 + Lade-Quarantäne:** **PREPARED**  
**Complete Backup v51 Hardening:** **PREPARED**  
**Operator / Hosting / Legal:** **PREPARED / BLOCKED**

Versionslinie:

- v45: Core-Hardening
- v46: Hub-A11y
- v47: Advanced-/Quick-/Creator-A11y
- v48: Word-Imposter Voting-/Datenhärtung
- v49: zentraler Hub-Resume-Guard v2
- v50: fail-closed Sperre der Resume-UI während der Guard-Lade-/Validierungsphase
- **v51: Complete-Backup-Transaktion, exakte Storage-Key-Eigentümerschaft, Forward-Compatibility und key-spezifische Vorvalidierung**

## Core-Hardening – 15/15

Word Imposter, soziale Hub-Spiele, Paranoia, Scharade/Tabu, Heiße Kartoffel, Wortkette, Nur falsche Antworten sowie Advanced/Mafia sind quellsseitig auf Setup, Privacy, Resume, Timer, Regeln und Sieger-/Scoreintegrität gehärtet. Details: `CORE_GAME_ACCEPTANCE.md`.

## Word-Imposter Data/Resume – v48-Verträge im aktuellen v51-Core

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
- Source-/E2E-Verträge decken verzögerte und fehlschlagende Guard-Ladung ab

## Complete Backup – v51

- `backup-schema-registry.js` Version 2 ist die zentrale Quelle
- `party-data-tools.js` Version 6 konsumiert den Registry-Vertrag
- Complete Restore verwaltet nur 16 explizite aktuelle Storage-Keys
- Wildcard-Eigentum für beliebige `secret-circle-party-*`-Keys wurde entfernt
- zukünftige Namespaces und Storage-Versionen wie `party-hub-v2` werden nicht importiert und nicht durch einen heutigen Restore gelöscht
- jeder managed Wert braucht gültiges JSON, erwarteten Root-Typ, aktuelle Storage-Version und minimale Pflichtstruktur
- `{version:999}` für einen heutigen managed Key wird vor der ersten Mutation abgelehnt
- Restore snapshotet und ersetzt nur managed Keys; Schreibfehler rollen nur diesen Bereich zurück
- die ausdrücklich bestätigte Funktion „Alle lokalen Daten löschen“ bleibt absichtlich prefixweit

Source-/Contract-Nachweise:

- `tests/backup-schema-registry.test.js`
- `tests/e2e/party-data.spec.js`
- `tests/e2e/backup-forward-compat.spec.js`
- `scripts/backup_contract_audit.py`

**Noch kein realer PASS:** Hosted Runner, Browser, PWA-Update und Export→Import müssen auf einem unveränderten RC real ausgeführt werden.

## Accessibility – v46/v47

- `party-hub-a11y.js`: Hub-Fokus, Modal, `inert`, Fokus-Trap und Rückkehrfokus
- `secondary-surface-a11y.js`: Advanced, Quick und Creator
- Creator-Radiogroup mit Pfeilen/Home/End

Beide A11y-Schichten bleiben im v51-Offline-Core. Reale VoiceOver-/TalkBack-/200-%-Zoom-/Touch-/Geräteabnahme bleibt offen.

## Operator / Hosting / Legal / Support

- `operator-release.json`: `PREPARED / BLOCKED`
- `OPERATOR_RELEASE_SIGNOFF.md`
- `OPERATOR_EVIDENCE_LOG.md`
- `HOSTING_DECISION.md` auf v51-Smokevertrag
- `LEGAL_CHECKLIST.md`, `SUPPORT.md`, `INCIDENT_RESPONSE.md`
- Issue #14 führt die realen Schritte

Kein Betreiber-, Provider-, Kontakt- oder Drill-Nachweis wird erfunden.

## Release-Audits

Die zentralen Verträge sind **transition-safe**:

- `scripts/branch_protection_contract_audit.py`
- `scripts/foundation_contract_audit.py`
- `scripts/backup_contract_audit.py`
- `scripts/release_readiness_contract_audit.py`
- `scripts/release_audit.py`
- `scripts/validate_project.py`

`backup_contract_audit.py` schützt den v51-Complete-Backup-Vertrag. Die Audits akzeptieren PREPARED/NO_GO heute und einen später korrekt belegten FINAL/GO-Zustand.

## Build / Supply Chain

- `package-lock.json` v3
- Playwright 1.54.2
- keine npm-Runtime-Dependencies
- CI/Cross-Browser verwenden `npm ci`
- Backup-E2E-Dateien sind im Syntax-Preflight und laufen über `playwright test`

**Offen:** echter Online-`npm ci`-/Integrity-PASS auf funktionierendem Runner.

## PWA v51

Service Worker:

- `secret-circle-v51`
- `secret-circle-v51-staging`

Offline enthalten sind Hub/Word Imposter/Advanced/Quick/Creator/Privacy, Katalog-/Contentmodule, Backup-Registry und `party-data-tools.js` v6, Session-/Timercontroller, Word-Imposter-/Hub-/Advanced-Resume-Guards, `party-hub-polish.js` mit v50-Resume-Quarantäne, Privacy-Guards, beide A11y-Schichten, aktuelle Word-Imposter-UI-/Store-Dateien, Manifest und Icons.

Reale Installation, Upgrades, Rollback, Complete-Backup-Restore und Offline-Gerätetest bleiben offen.

## CI – P0

Letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**.

- Run ID `32871536761`
- Job `validate`, Job ID `97879489858`
- Head `a9ad91389ff9e966af432b0a77103ddc0960709d`
- `failure`
- `steps: null` / separate Step-Abfrage `steps: []`
- kein Checkout, npm, Test oder Repository-Code ausgeführt

Der Minimal-Runner-Probe zeigte dasselbe Muster ohne Repositoryabhängigkeit. Run #2787 bestätigte den Pre-Step-Blocker historisch auf v49. **v50 und v51 sind daher ebenfalls noch nicht runnerverifiziert.** Details: Issue #7 / `CI_TROUBLESHOOTING.md`.

## Release Evidence / Assets

- `release-evidence.json`: **PREPARED / NO_GO**
- `operator-release.json`: **PREPARED / BLOCKED**
- Root-`icon.svg` und Ableitungen: Rechtebasis weiterhin `unresolved`

## Drei zentrale offene GitHub-Blocker

1. **Issue #7** – Hosted Runner vor Step 1
2. **Issue #8** – reale Geräte, v51 Offline-PWA, Accessibility, Word-Imposter-Datengrenzen, Hub-Resume-v2/v50-Ladequarantäne, Complete-Backup-v51 und Partytests
3. **Issue #14** – Operator, Hosting, Legal, Support und Incident Evidence

## Real offene Releasegates

1. Actions-Runner / echte Steps
2. Online-`npm ci` + CI/Cross-Browser
3. Branch Protection real aktiv
4. Hostingprovider + getrennte HTTPS-Origins
5. v51 Staging-/Production-/PWA-Smokes
6. v51 Upgrade/Rollback auf echten Installationen
7. Word-Imposter-Daten-/Voting-Verträge + Hub-Resume-v2/v50-Quarantäne real
8. Complete-Backup-v51: Export→Import, Future-Key-Erhalt, Future-Key-Reject, falsche Storage-Version, Write-Rollback
9. Android / iPhone / Tablet
10. VoiceOver / TalkBack / Tastatur / 200-%-Zoom
11. reale Gruppen/Beta für alle 15 Core-Spiele
12. Icon-/Visual-/Third-Party-Sign-off
13. Operator-/Privacy-/Support-/Legal-Sign-off
14. Support-/Security-/SEV-1-/Rollback-Drill
15. unveränderter RC + Release Evidence FINAL/GO

## Releaseentscheidung

- öffentlicher Release: **NO_GO**
- PR #13 mergen: **Nein**
- PR #13 bleibt Draft: **Ja**