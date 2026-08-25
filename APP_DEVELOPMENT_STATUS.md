# Secret Circle – A-bis-Z Entwicklungsstatus

Stand: 25. August 2026

Operativer Fortschrittstracker zu `APP_ENTWICKLUNG_VON_A_BIS_Z.md`.

## Gesamtstatus

**Öffentliche Releasefreigabe: NO_GO**  
**Offline-Core: `secret-circle-v49` / `secret-circle-v49-staging`**  
**Classic Content: v4**  
**Core Source Review: 15/15 PREPARED**  
**Core Source Hardening: 15/15 PREPARED**  
**Accessibility Source Hardening: PREPARED**  
**Word-Imposter Data/Resume Hardening: PREPARED**  
**Hub Resume Integrity v2: PREPARED**  
**Operator / Hosting / Legal: PREPARED / BLOCKED**

Arbeitsstand: Draft-PR #13 auf `agent/release-foundation-2027`.

v45 war Core-Hardening, v46 Hub-A11y, v47 Secondary-A11y für Advanced/Quick/Creator, v48 Word-Imposter-Voting-/Datenhärtung. **v49** vereinheitlicht den direkten Hub-Resume-Pfad auf den getesteten `party-hub-resume-guard.js` v2 und macht die zentralen Release-Audits für einen späteren echten FINAL/GO-Übergang kompatibel.

## A-bis-Z-Tracker

| # | Bereich | Status | Hauptnachweis | Nächste Aktion |
|---|---|---|---|---|
| 0 | Produktziel / Releasegrenze | DONE | Product Brief, Release Scope | bei Scopeänderung aktualisieren |
| A | Querschnittsverträge | PREPARED | Foundation + Readiness + Release/Operator Evidence | reale Gates schließen |
| 1 | Discovery / Nutzer / Markt | DONE | Brief, Scenarios, Market Research | reale Nutzer weiter validieren |
| 2 | Produktstrategie / Scope | PREPARED | Scope, Roadmap | reale Gruppen/Nutzer |
| 3 | Plattformstrategie | PREPARED | Platform Strategy | reale Zielgeräte |
| 4 | Requirements / Akzeptanz | PREPARED | Requirements, Core Contracts, 15/15 Hardening | Runner + reale Core-Abnahme |
| 5 | UX / IA / Design | PREPARED | UX Flow + A11y-Fokus-/Modal-/Radiogroup-Verträge | reale UX-/Tastaturtests |
| 6 | Architektur / ADR | PREPARED | `ARCHITECTURE.md`, Architecture Audit v49 | bei Grundsatzänderung ADR |
| 7 | Security / Threat Model | PREPARED | Security, Threat Model, Resume-/Privacy-/Import-Guards | Runner + echter Browser |
| 8 | Repo / Git / Build | BLOCKED | Lockfile v3, npm-ci-Workflows, Branch Contract | Issue #7 / echter Runner + Branch Protection |
| 9 | Feature-Entwicklungsloop | PREPARED | Tests/Contracts/PR #13, Core + A11y + Data + Resume Hardening | keine neue Scope-Welle; Evidence schließen |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Backup-/Session-/PWA-/Resume-/Data-Verträge | reale Quota-/Update-/Import-/Resume-Pfade |
| 11 | Tests / CI | BLOCKED | Run #2787 + Runner Probe | funktionierender Hosted Runner |
| 12 | Offline / PWA / Resume | PREPARED | Service Worker v49 + Guards/A11y/Data offline | Issue #8 / Install-/Upgrade-/Rollback-/HR2-Tests |
| 13 | Content / Alter / Privacy | IN PROGRESS | 15/15 Quellreview + Privacy-/Reference-Audits | reale Gruppen + finaler Sign-off |
| 14 | Beta / reale Gruppen | PREPARED | `BETA_TEST_PLAN.md`, Issue #8 | G1–G5, DWI, HR2, PN1–PN3 durchführen |
| 15 | Datenschutz / Recht / Support | BLOCKED | `operator-release.json`, `OPERATOR_EVIDENCE_LOG.md`, Legal, Support, Issue #14 | reale Betreiber-/Hosting-/Kontaktangaben |
| 16 | Release Management / RC | PREPARED | Checklist + transition-safe Release Evidence | unveränderlichen RC einfrieren |
| 17 | Deployment / Environments | BLOCKED | v49 Environment + `HOSTING_DECISION.md` | Provider + echte HTTPS-Origins |
| 18 | Operations / Incident | BLOCKED | Support + Incident + Operator Evidence Log | Verantwortliche + reale Drills |
| 19 | Wartung / Migration | PREPARED | Maintenance, Backups, Changelog | operative Routine real |
| 20 | Risk Management | IN PROGRESS | Risk Register | laufend aktualisieren |
| 21 | Accessibility | PREPARED | Hub + Secondary A11y, Unit/E2E/Audits | VoiceOver/TalkBack/Zoom/Tastatur/Geräte real |
| 22 | Third Party / Assetrechte | BLOCKED | Provenienzmanifest + Rights Sign-off | Icon-Rechte menschlich bestätigen |
| 23 | Fan-/Referenzcontent | IN PROGRESS | Fan Review + Source-Audit | Runner + manuelle Visual/Legal-Abnahme |
| 24 | Release Evidence | PREPARED | `release-evidence.json` + `operator-release.json` + transition-safe Audits | reale Belege auf einen RC sammeln |

## Core-Hardening

15/15 Core sind quellsseitig auf Setup, Rollen-/Geheimhaltung, Resume, Timer, Punkte/Sieger und Anfänger-UX gehärtet. Details: `CORE_GAME_ACCEPTANCE.md`.

## Word-Imposter Data/Resume – eingeführt v48

- UI bestimmt den nächsten noch nicht abstimmenden Spieler aus den tatsächlichen Vote-Keys.
- manipulierte nicht-sequenzielle Voting-Snapshots bleiben durch den Resume-Guard blockiert.
- 50 eigene Kategorien maximal.
- 200 Begriffe je eigener Kategorie maximal.
- 51/201 werden fail-closed abgelehnt, nicht still gekürzt.
- 1,5-MB-UTF-8-Backupgrenze ist zwischen UI und Store synchron.
- Ablehnung verändert bestehende lokale Daten nicht.
- `tests/storage.test.js` + `tests/word-imposter-data-contract.test.js` schützen den Source-Vertrag.

Diese Verträge bleiben im aktuellen v49-Offline-Core. Real offen: ausgeführte Runner-/Browser-/PWA-Evidence. Daher **PREPARED**, nicht PASS.

## Hub Resume Integrity – v49

- `party-hub-resume-guard.js` Version 2 ist die zentrale getestete Runtime-Quelle.
- `party-hub-polish.js` delegiert statt Timer-/Resume-Validierung zu duplizieren.
- Cross-Mode-/Phase-/Restzeit-Inkonsistenzen werden verworfen.
- beim Verwerfen verschwindet auch eine bereits sichtbare Hub-Resume-Karte.
- gültige gespeicherte Sessions bleiben unangetastet.
- `tests/party-hub-resume-guard.test.js` schützt Modul, Runtime-Einbindung, Offline-Core und stale-UI-Regressionsfall.
- BETA/MANUAL/Issue #8 führen HR2 als realen Abnahmefall.

## Accessibility-Hardening – v46/v47

**v46 / Hub:** `party-hub-a11y.js`, Bereichsfokus, Hub-Modals, `inert`, Fokus-Trap und Rückkehrfokus.

**v47 / Advanced, Quick, Creator:** `secondary-surface-a11y.js`, Advanced-Modal-Isolation, Quick-Fokus-Recovery, Creator-Wizard-Schrittfokus, Creator-Hilfe-Modal sowie Template-Radiogroup mit Pfeilen/Home/End.

Automatische Nachweise:

- `tests/accessibility-contract.test.js`
- `tests/e2e/accessibility-core.spec.js`
- `scripts/hub_a11y_contract_audit.py`
- `scripts/secondary_surface_a11y_contract_audit.py`
- `scripts/architecture_audit.py`

Beide Schichten bleiben Bestandteil des v49-Offline-Core. Real offen: VoiceOver, TalkBack, 200-%-Zoom, Tastatur/Touch und echte Browser/Geräte.

## Release-Audit-Übergang

Die zentralen Audits wurden von historischen Momentaufnahmen auf echte Evidence-Verträge umgestellt:

- Branch Protection kann heute OPEN und später korrekt PASS sein.
- Foundation leitet CI/Branch/Staging/Geräte aus `release-evidence.json` ab.
- Release Readiness akzeptiert PREPARED/NO_GO, FINAL/NO_GO oder korrektes FINAL/GO.
- Release Audit verlangt bei `assetsThirdParty = PASS`, dass kein Releaseasset mehr `unresolved` ist, blockiert aber nicht das spätere Lösen der Rechtefrage.
- `validate_project.py` kennt die aktuellen Runtime-Scriptketten und prüft den dynamischen Hub-Resume-v2-Loadervertrag.

## Operator-/Hosting-/Legal-Block

- `operator-release.json`: `PREPARED / BLOCKED`
- `OPERATOR_RELEASE_SIGNOFF.md`
- `OPERATOR_EVIDENCE_LOG.md`
- `HOSTING_DECISION.md` auf v49
- `LEGAL_CHECKLIST.md`, `SUPPORT.md`, `INCIDENT_RESPONSE.md`
- Issue #14 als operative Checkliste

## Offline / PWA v49

- `secret-circle-v49`
- `secret-circle-v49-staging`
- beide A11y-Schichten, Word-Imposter-/Hub-/Advanced-Resume-Guards, Privacy-Guards, aktuelle UI-/Store-Dateien, Katalog-/Session-/Backupmodule, Manifest/Icons offline

Reale Upgrade-/Rollback-/Geräte-Evidence bleibt offen.

## Build / CI

- `package-lock.json` v3
- Playwright 1.54.2
- keine npm-Runtime-Dependencies
- Syntax-/Unit-/Validate-/E2E-Verträge erweitert
- `tests/word-imposter-data-contract.test.js` und `tests/party-hub-resume-guard.test.js` im Testvertrag
- letzter vollständig untersuchter v49-App-Actions-Lauf: **Run #2787**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, erneut `steps: null` / `steps: []`; kein Repositorycode wurde ausgeführt

Status: **CLOSED IN CODE / ONLINE RUNNER VERIFICATION OPEN**.

## Zentrale offene Issues

- **#7:** GitHub Actions endet vor Step 1
- **#8:** reale Geräte, v49 Offline-PWA, Accessibility, Word-Imposter-Datengrenzen, Hub-Resume-v2 und Gruppentests
- **#14:** Operator, Hosting, Legal, Support und Incident Evidence

Zusätzlich bleibt die Icon-Rechtebasis offen.

## Höchste Prioritäten ab jetzt

1. Hosted Runner / Online-`npm ci` / CI / Cross-Browser
2. Branch Protection
3. Provider + HTTPS-Staging/Production
4. v49 PWA-Smoke / Upgrade / Rollback
5. Word-Imposter-Datengrenzen + Hub Resume Guard v2 real prüfen
6. Android / iPhone / Tablet / VoiceOver / TalkBack / Tastatur / Zoom
7. reale Gruppentests für alle 15 Core-Spiele
8. Icon-/Third-Party- und Operator-/Legal-/Support-/Incident-Sign-off
9. unveränderter RC + `release-evidence.json = FINAL / GO`

## Nicht als bestanden behaupten

Online-`npm ci`, CI/Cross-Browser, Branch Protection, HTTPS-Staging, reale PWA-/Geräte-/Accessibility-/Word-Imposter-Grenz-/Hub-Resume-/Gruppentests, Asset-/Operator-/Legal-/Support-Sign-off und finaler Release Evidence GO sind weiterhin offen.