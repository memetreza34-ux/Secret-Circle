# Secret Circle – A-bis-Z Entwicklungsstatus

Stand: 26. August 2026

Operativer Fortschrittstracker zu `APP_ENTWICKLUNG_VON_A_BIS_Z.md`.

## Gesamtstatus

**Öffentliche Releasefreigabe: NO_GO**  
**Offline-Core: `secret-circle-v52` / `secret-circle-v52-staging`**  
**Classic Content: v4**  
**Core Source Review: 15/15 PREPARED**  
**Core Source Hardening: 15/15 PREPARED**  
**Accessibility Source Hardening: PREPARED**  
**Word-Imposter Data/Resume Hardening: PREPARED**  
**Hub Resume Integrity v2 + v50-Ladequarantäne: PREPARED**  
**Complete Backup v51 Hardening: PREPARED**  
**Hub Round Resume v52: PREPARED**  
**Operator / Hosting / Legal: PREPARED / BLOCKED**

Arbeitsstand: Draft-PR #13 auf `agent/release-foundation-2027`.

Versionslinie: v45 Core-Hardening, v46 Hub-A11y, v47 Secondary-A11y, v48 Word-Imposter-Voting-/Datenhärtung, v49 zentraler Hub-Resume-Guard v2, v50 fail-closed Resume-Ladequarantäne, v51 Complete-Backup-/Forward-Compatibility-Härtung. **v52** ergänzt sicheren direkten Hub-Rundenstatus: laufende nicht-geheime Karten können korrekt fortgesetzt werden, Wahrheit/Pflicht verwenden getrennte Usage-Pools und geheime Current-Inhalte bleiben aus dem Auto-Resume ausgeschlossen.

## A-bis-Z-Tracker

| # | Bereich | Status | Hauptnachweis | Nächste Aktion |
|---|---|---|---|---|
| 0 | Produktziel / Releasegrenze | DONE | Product Brief, Release Scope | bei Scopeänderung aktualisieren |
| A | Querschnittsverträge | PREPARED | Foundation + Readiness + Release/Operator Evidence | reale Gates schließen |
| 1 | Discovery / Nutzer / Markt | DONE | Brief, Scenarios, Market Research | reale Nutzer weiter validieren |
| 2 | Produktstrategie / Scope | PREPARED | Scope, Roadmap | reale Gruppen/Nutzer |
| 3 | Plattformstrategie | PREPARED | Platform Strategy | reale Zielgeräte |
| 4 | Requirements / Akzeptanz | PREPARED | Requirements, Core Contracts, 15/15 Hardening | Runner + reale Core-Abnahme |
| 5 | UX / IA / Design | PREPARED | UX Flow + A11y-/Resume-Verträge | reale UX-/Tastaturtests |
| 6 | Architektur / ADR | PREPARED | `ARCHITECTURE.md`, Architecture Audit v52 | bei Grundsatzänderung ADR |
| 7 | Security / Threat Model | PREPARED | Security, Threat Model, Resume-/Privacy-/Import-Guards | Runner + echter Browser |
| 8 | Repo / Git / Build | BLOCKED | Lockfile v3, npm-ci-Workflows, Branch Contract | Issue #7 / echter Runner + Branch Protection |
| 9 | Feature-Entwicklungsloop | PREPARED | Tests/Contracts/PR #13, Core + A11y + Data + Resume + Backup + Hub Round | keine Scope-Welle; gezielt weiter härten |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Backup-/Session-/PWA-/Resume-/Current-Verträge | reale Quota-/Update-/Import-/Resume-Pfade |
| 11 | Tests / CI | BLOCKED | Run #2787 + Runner Probe | funktionierender Hosted Runner |
| 12 | Offline / PWA / Resume | PREPARED | Service Worker v52 + Guards/A11y/Data/Backup/Hub-Round offline | Issue #8 / Install-/Upgrade-/Rollback-Tests |
| 13 | Content / Alter / Privacy | IN PROGRESS | 15/15 Quellreview + Privacy-/Reference-Audits | reale Gruppen + finaler Sign-off |
| 14 | Beta / reale Gruppen | PREPARED | `BETA_TEST_PLAN.md`, Issue #8 | G1–G5, DWI, HR2, BK51, HR52, PN1–PN3 durchführen |
| 15 | Datenschutz / Recht / Support | BLOCKED | Operator Evidence, Legal, Support, Issue #14 | reale Betreiber-/Hosting-/Kontaktangaben |
| 16 | Release Management / RC | PREPARED | Checklist + transition-safe Release Evidence | unveränderlichen RC einfrieren |
| 17 | Deployment / Environments | BLOCKED | v52 Environment + `HOSTING_DECISION.md` | Provider + echte HTTPS-Origins |
| 18 | Operations / Incident | BLOCKED | Support + Incident + Operator Evidence Log | Verantwortliche + reale Drills |
| 19 | Wartung / Migration | PREPARED | Maintenance, Backups, Changelog, v51/v52 Verträge | operative Routine real |
| 20 | Risk Management | IN PROGRESS | Risk Register | laufend aktualisieren |
| 21 | Accessibility | PREPARED | Hub + Secondary A11y, Unit/E2E/Audits | VoiceOver/TalkBack/Zoom/Tastatur/Geräte real |
| 22 | Third Party / Assetrechte | BLOCKED | Provenienzmanifest + Rights Sign-off | Icon-Rechte menschlich bestätigen |
| 23 | Fan-/Referenzcontent | IN PROGRESS | Fan Review + Source-Audit | Runner + manuelle Visual/Legal-Abnahme |
| 24 | Release Evidence | PREPARED | `release-evidence.json` + `operator-release.json` + transition-safe Audits | reale Belege auf einen RC sammeln |

## Word-Imposter Data/Resume – v48

- nächster noch nicht abstimmender Spieler wird aus tatsächlichen Vote-Keys bestimmt
- manipulierte nicht-sequenzielle Voting-Snapshots werden blockiert
- 50 eigene Kategorien / 200 Begriffe pro Kategorie
- 51/201 fail-closed
- 1,5-MB-UTF-8-Backupgrenze
- abgelehnte Imports verändern lokale Bestandsdaten nicht

Status: **PREPARED**, nicht PASS.

## Hub Resume Integrity – v49/v50

**v49:** zentraler `party-hub-resume-guard.js` v2, Cross-Mode-/Phase-/Restzeit-Prüfung, stale Resume UI wird entfernt.

**v50:** sichtbare Resume-Karte bleibt während Guard-Ladung `aria-busy`, Aktionen sind deaktiviert und werden erst nach erfolgreicher Validierung freigegeben; Lade-/Integritätsfehler bleiben fail-closed.

## Complete Backup – v51

- `backup-schema-registry.js` Version 2 ist zentrale Quelle
- `party-data-tools.js` Version 6 konsumiert die Registry
- Restore besitzt nur registrierte aktuelle Storage-Keys
- Future-Namespaces/-Versionen bleiben erhalten
- managed Werte werden vollständig vor Mutation validiert
- Restore und Rollback verändern nur managed Keys
- vollständige Datenlöschung bleibt separat prefixweit

Status: **PREPARED**, weil echter Runner, Browser, PWA-Upgrade und Restore-Evidence offen sind.

## Hub Round Resume – v52

- neues Modul `party-hub-round-state.js`
- sichere laufende Truth-Dare-/Prompt-/Choice-Karten erhalten einen validierten Current-Zustand
- bereits geöffnete Wahrheit/Pflicht-Karte bleibt nach Reload/Resume dieselbe Karte
- Wahrheit und Pflicht besitzen getrennte Usage-Pools und dürfen denselben numerischen Index unabhängig verwenden
- ungültige Current-Referenzen werden nicht übernommen
- Paranoia und andere geheime Inhalte werden über diesen Pfad nicht automatisch wieder geöffnet
- `next` und globales Skip löschen den vorherigen Current-Zustand
- `tests/hub-resume-contract.test.js` und `tests/e2e/core-hub-resume.spec.js` schützen den Vertrag
- `scripts/architecture_audit.py` prüft Modulgrenze, Scriptreihenfolge und Secret-Current-Verbot

Status: **PREPARED**, reale Runner-/Browser-/PWA-/Gruppen-Evidence bleibt offen.

## Accessibility-Hardening – v46/v47

**v46 / Hub:** `party-hub-a11y.js`, Bereichsfokus, Hub-Modals, `inert`, Fokus-Trap und Rückkehrfokus.

**v47 / Advanced, Quick, Creator:** `secondary-surface-a11y.js`, Advanced-Modal-Isolation, Quick-Fokus-Recovery, Creator-Schrittfokus und Template-Radiogroup.

Beide Schichten bleiben Bestandteil des v52-Offline-Core. Real offen: VoiceOver, TalkBack, 200-%-Zoom, Tastatur/Touch und echte Browser/Geräte.

## Offline / PWA v52

- `secret-circle-v52`
- `secret-circle-v52-staging`
- `party-hub-round-state.js` ist Bestandteil des Offline-Core
- alle vorherigen A11y-, Resume-, Privacy-, Session-, Backup- und Katalogmodule bleiben offline
- direkte Hub-Resume-Aktionen bleiben bis Guard-Validierung gesperrt
- sichere direkte Hub-Current-Runden können kontrolliert wiederhergestellt werden
- geheime Current-Inhalte bleiben ausgeschlossen

Reale Upgrade-/Rollback-/Geräte-/BK51-/HR52-Evidence bleibt offen.

## Build / CI

- `package-lock.json` v3
- Playwright 1.54.2
- keine npm-Runtime-Dependencies
- Syntax-/Unit-/Validate-/E2E-Verträge erweitert
- letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`
- **v50, v51 und v52 besitzen noch keinen echten Runner-PASS**

Status: **CLOSED IN CODE / ONLINE RUNNER VERIFICATION OPEN**.

## Zentrale offene Issues

- **#7:** GitHub Actions endet vor Step 1
- **#8:** reale Geräte, v52 Offline-PWA, Accessibility, Word-Imposter-Datengrenzen, Hub-Resume-v2/v50, BK51 und HR52
- **#14:** Operator, Hosting, Legal, Support und Incident Evidence

Zusätzlich bleibt die Icon-Rechtebasis offen.

## Höchste Prioritäten ab jetzt

1. Hosted Runner / Online-`npm ci` / CI / Cross-Browser
2. Branch Protection
3. Provider + HTTPS-Staging/Production
4. v52 PWA-Smoke / Upgrade / Rollback
5. Word-Imposter-Datengrenzen + Hub Resume v49/v50 + Complete Backup BK51 + Hub Round Resume HR52 real prüfen
6. Android / iPhone / Tablet / VoiceOver / TalkBack / Tastatur / Zoom
7. reale Gruppentests für alle 15 Core-Spiele
8. Icon-/Third-Party- und Operator-/Legal-/Support-/Incident-Sign-off
9. unveränderter RC + `release-evidence.json = FINAL / GO`

## Nicht als bestanden behaupten

Online-`npm ci`, CI/Cross-Browser, Branch Protection, HTTPS-Staging, reale PWA-/Geräte-/Accessibility-/Word-Imposter-Grenz-/Hub-Resume-/BK51-/HR52-/Gruppentests, Asset-/Operator-/Legal-/Support-Sign-off und finaler Release Evidence GO sind weiterhin offen.