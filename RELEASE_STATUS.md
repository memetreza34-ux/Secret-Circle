# Release-Status – Secret Circle

Stand: 26. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13

## Gesamtstatus

**Phase:** Release-Härtung  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v52` / `secret-circle-v52-staging`**  
**Classic Content:** **v4**  
**Core Source Review:** **15/15 PREPARED**  
**Core Source Hardening:** **15/15 PREPARED**  
**Accessibility Source Hardening:** **PREPARED**  
**Word-Imposter Data/Resume Hardening:** **PREPARED**  
**Hub Resume Guard v2 + Lade-Quarantäne:** **PREPARED**  
**Complete Backup v51 Hardening:** **PREPARED**  
**Hub Round Resume v52:** **PREPARED**  
**Operator / Hosting / Legal:** **PREPARED / BLOCKED**

Versionslinie:

- v45: Core-Hardening
- v46: Hub-A11y
- v47: Advanced-/Quick-/Creator-A11y
- v48: Word-Imposter Voting-/Datenhärtung
- v49: zentraler Hub-Resume-Guard v2
- v50: fail-closed Sperre der Resume-UI während Guard-Lade-/Validierungsphase
- v51: Complete-Backup-Transaktion, exakte Storage-Key-Eigentümerschaft, Forward-Compatibility und Vorvalidierung
- **v52: direkter Hub-Rundenstatus – sichere Current-Karten über Resume + getrennte Wahrheit-/Pflicht-Usage-Pools**

## Core-Hardening – 15/15

Word Imposter, soziale Hub-Spiele, Paranoia, Scharade/Tabu, Heiße Kartoffel, Wortkette, Nur falsche Antworten sowie Advanced/Mafia sind quellsseitig auf Setup, Privacy, Resume, Timer, Regeln und Sieger-/Scoreintegrität gehärtet. Details: `CORE_GAME_ACCEPTANCE.md`.

## Word-Imposter Data/Resume – v48

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
- Cross-Mode-/Phase-/Restzeit-Inkonsistenzen werden verworfen
- stale Resume UI wird beim Verwerfen entfernt

### v50

- sichtbare Resume-Karte wird während Guard-Prüfung `aria-busy`
- Resume-Buttons werden sofort deaktiviert
- Freigabe erst nach erfolgreicher Guard-Validierung
- Lade-/Integritätsfehler bleibt fail-closed

## Complete Backup – v51

- `backup-schema-registry.js` Version 2 als zentrale Quelle
- `party-data-tools.js` Version 6 konsumiert den Registry-Vertrag
- Restore verwaltet nur registrierte aktuelle Storage-Keys
- zukünftige Namespaces/Storage-Versionen bleiben außerhalb heutigen Restore-Eigentums
- managed Werte werden vor Mutation nach JSON-Root, Storage-Version und Pflichtstruktur validiert
- Restore/Rollback verändert nur managed Keys
- vollständige Datenlöschung bleibt bewusst prefixweit

Source-/Contract-Nachweise:

- `tests/backup-schema-registry.test.js`
- `tests/e2e/party-data.spec.js`
- `tests/e2e/backup-forward-compat.spec.js`
- `scripts/backup_contract_audit.py`

## Hub Round Resume – v52

Der direkte Hub besitzt jetzt einen eigenen kleinen Rundenstatus-Vertrag über `party-hub-round-state.js`.

Behoben:

- bereits angezeigte sichere Karten gehen nach Reload/Resume nicht mehr verloren
- Wahrheit und Pflicht teilen nicht mehr dieselbe numerische `used`-Liste
- Wahrheit/Pflicht besitzen getrennte Usage-Pools
- dieselbe bereits angezeigte Wahrheit/Pflicht-Karte wird nach Resume wiederhergestellt
- Prompt-/Choice-Runden können denselben sicheren Current-Zustand wiederherstellen
- manipulierte/ungültige Current-Referenzen werden verworfen
- Paranoia und andere geheime Inhalte werden über diesen Pfad nicht automatisch geöffnet
- `next` und globales Skip löschen Current sauber vor der nächsten Runde

Automatische Verträge:

- `tests/hub-resume-contract.test.js`
- `tests/e2e/core-hub-resume.spec.js`
- `scripts/architecture_audit.py`
- `tests/service-worker.test.js`

**Noch kein realer PASS:** Hosted Runner, Browser/PWA-Upgrade und Realgerätetest müssen auf einem unveränderten RC ausgeführt werden.

## Accessibility – v46/v47

- `party-hub-a11y.js`: Hub-Fokus, Modal, `inert`, Fokus-Trap und Rückkehrfokus
- `secondary-surface-a11y.js`: Advanced, Quick und Creator
- Creator-Radiogroup mit Pfeilen/Home/End

Beide A11y-Schichten bleiben im v52-Offline-Core. Reale VoiceOver-/TalkBack-/200-%-Zoom-/Touch-/Geräteabnahme bleibt offen.

## Build / Supply Chain

- `package-lock.json` v3
- Playwright 1.54.2
- keine npm-Runtime-Dependencies
- CI/Cross-Browser verwenden `npm ci`
- `party-hub-round-state.js` im Syntax-Preflight
- `tests/e2e/core-hub-resume.spec.js` im Syntax-Preflight
- Architektur-Audit prüft Modulgrenze, Scriptreihenfolge, v52-Offline-Core und Secret-Current-Verbot

**Offen:** echter Online-`npm ci`-/Integrity-PASS auf funktionierendem Runner.

## PWA v52

Service Worker:

- `secret-circle-v52`
- `secret-circle-v52-staging`

Neu offline enthalten: `party-hub-round-state.js`. Alle vorherigen Resume-/Privacy-/A11y-/Backup-Module bleiben enthalten.

Reale Installation, Upgrade, Rollback, Complete-Backup-Restore und Hub-Round-Resume auf Zielgeräten bleiben offen.

## CI – P0

Letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**.

- Run ID `32871536761`
- Job `validate`, Job ID `97879489858`
- Head `a9ad91389ff9e966af432b0a77103ddc0960709d`
- `failure`
- `steps: null` / separate Step-Abfrage `steps: []`
- kein Checkout, npm, Test oder Repository-Code ausgeführt

Der Minimal-Runner-Probe zeigte dasselbe Muster ohne Repositoryabhängigkeit. **v50, v51 und v52 sind daher noch nicht runnerverifiziert.** Details: Issue #7 / `CI_TROUBLESHOOTING.md`.

## Release Evidence / Assets

- `release-evidence.json`: **PREPARED / NO_GO**
- `operator-release.json`: **PREPARED / BLOCKED**
- Root-`icon.svg` und Ableitungen: Rechtebasis weiterhin `unresolved`

## Drei zentrale offene GitHub-Blocker

1. **Issue #7** – Hosted Runner vor Step 1
2. **Issue #8** – reale Geräte, v52 Offline-PWA, Accessibility, Word-Imposter-Datengrenzen, Hub-Resume-v2/v50, Complete-Backup-v51, Hub-Round-Resume-v52 und Partytests
3. **Issue #14** – Operator, Hosting, Legal, Support und Incident Evidence

## Real offene Releasegates

1. Actions-Runner / echte Steps
2. Online-`npm ci` + CI/Cross-Browser
3. Branch Protection real aktiv
4. Hostingprovider + getrennte HTTPS-Origins
5. v52 Staging-/Production-/PWA-Smokes
6. v52 Upgrade/Rollback auf echten Installationen
7. Word-Imposter-Daten-/Voting-Verträge + Hub-Resume-v2/v50 real
8. Complete-Backup-v51 real
9. Hub-Round-Resume-v52: gleiche laufende Karte nach Reload, getrennte Wahrheit-/Pflicht-Pools, Secret-Current bleibt geschlossen
10. Android / iPhone / Tablet
11. VoiceOver / TalkBack / Tastatur / 200-%-Zoom
12. reale Gruppen/Beta für alle 15 Core-Spiele
13. Icon-/Visual-/Third-Party-Sign-off
14. Operator-/Privacy-/Support-/Legal-Sign-off
15. unveränderter RC + Release Evidence FINAL/GO

## Releaseentscheidung

- öffentlicher Release: **NO_GO**
- PR #13 mergen: **Nein**
- PR #13 bleibt Draft: **Ja**