# Secret Circle – A-bis-Z Entwicklungsstatus

Stand: 26. August 2026

Operativer Fortschrittstracker zu `APP_ENTWICKLUNG_VON_A_BIS_Z.md`.

## Gesamtstatus

**Öffentliche Releasefreigabe: NO_GO**  
**Offline-Core: `secret-circle-v53` / `secret-circle-v53-staging`**  
**Classic Content: v4**  
**Core Source Review: 15/15 PREPARED**  
**Core Source Hardening: 15/15 PREPARED**  
**Accessibility Source Hardening: PREPARED**  
**Word-Imposter Data/Resume Hardening: PREPARED**  
**Hub Resume Integrity v2 + v50-Ladequarantäne: PREPARED**  
**Complete Backup v51 Hardening: PREPARED**  
**Hub Round Resume v52: PREPARED**  
**Paranoia Resume/Privacy v53: PREPARED**  
**Operator / Hosting / Legal: PREPARED / BLOCKED**

Arbeitsstand: Draft-PR #13 auf `agent/release-foundation-2027`.

## Versionslinie

- v45: Core-Hardening
- v46: Hub-A11y
- v47: Secondary-Surface-A11y
- v48: Word-Imposter Voting-/Datenhärtung
- v49: zentraler Hub-Resume-Guard v2
- v50: fail-closed Resume-Ladequarantäne
- v51: Complete Backup / Forward Compatibility
- v52: sichere direkte Hub-Current-Runden + getrennte Wahrheit/Pflicht-Pools
- **v53: Paranoia-Frage und bereits gefällter Münzwurf bleiben über Resume konsistent, ohne Auto-Reveal; Privacy-Cover gilt auch nach der Auflösung**

## A-bis-Z-Tracker

| # | Bereich | Status | Hauptnachweis | Nächste Aktion |
|---|---|---|---|---|
| 0 | Produktziel / Releasegrenze | DONE | Product Brief, Release Scope | bei Scopeänderung aktualisieren |
| A | Querschnittsverträge | PREPARED | Foundation + Release/Operator Evidence | reale Gates schließen |
| 1 | Discovery / Nutzer / Markt | DONE | Brief, Scenarios, Market Research | reale Nutzer weiter validieren |
| 2 | Produktstrategie / Scope | PREPARED | Scope, Roadmap | reale Gruppen/Nutzer |
| 3 | Plattformstrategie | PREPARED | Platform Strategy | reale Zielgeräte |
| 4 | Requirements / Akzeptanz | PREPARED | Requirements, Core Contracts | Runner + reale Core-Abnahme |
| 5 | UX / IA / Design | PREPARED | UX Flow + A11y-/Resume-Verträge | reale UX-/Tastaturtests |
| 6 | Architektur / ADR | PREPARED | `ARCHITECTURE.md`, Architecture Audit v53 | bei Grundsatzänderung ADR |
| 7 | Security / Threat Model | PREPARED | Security, Threat Model, Privacy-/Resume-/Import-Guards | Runner + echter Browser |
| 8 | Repo / Git / Build | BLOCKED | Lockfile v3, npm-ci-Workflows, Branch Contract | Issue #7 / Runner + Branch Protection |
| 9 | Feature-Entwicklungsloop | PREPARED | Core + A11y + Data + Resume + Backup Hardening | gezielt weiter härten; kein Scope-Bloat |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Backup-/Session-/Resume-/Current-Verträge | reale Quota-/Update-/Resume-Pfade |
| 11 | Tests / CI | BLOCKED | Run #2787 + Runner Probe | funktionierender Hosted Runner |
| 12 | Offline / PWA / Resume | PREPARED | Service Worker v53 + Guards/A11y/Data/Backup | Install-/Upgrade-/Rollback-/PR53-Tests |
| 13 | Content / Alter / Privacy | IN PROGRESS | 15/15 Quellreview + Privacy-/Reference-Audits | reale Gruppen + finaler Sign-off |
| 14 | Beta / reale Gruppen | PREPARED | `BETA_TEST_PLAN.md`, Issue #8 | G1–G5, DWI, HR2, BK51, HR52, PR53, PN1–PN3 |
| 15 | Datenschutz / Recht / Support | BLOCKED | Operator Evidence, Legal, Support, Issue #14 | reale Betreiber-/Hosting-/Kontaktangaben |
| 16 | Release Management / RC | PREPARED | Checklist + transition-safe Evidence | unveränderlichen RC einfrieren |
| 17 | Deployment / Environments | BLOCKED | v53 Environment + Hosting-Vertrag | Provider + echte HTTPS-Origins |
| 18 | Operations / Incident | BLOCKED | Support + Incident + Operator Evidence | Verantwortliche + reale Drills |
| 19 | Wartung / Migration | PREPARED | Maintenance, Backups, Changelog | operative Routine real |
| 20 | Risk Management | IN PROGRESS | Risk Register | laufend aktualisieren |
| 21 | Accessibility | PREPARED | Hub + Secondary A11y | VoiceOver/TalkBack/Zoom/Tastatur/Geräte |
| 22 | Third Party / Assetrechte | BLOCKED | Provenienzmanifest + Rights Sign-off | Icon-Rechte menschlich bestätigen |
| 23 | Fan-/Referenzcontent | IN PROGRESS | Fan Review + Source-Audit | Runner + manuelle Visual/Legal-Abnahme |
| 24 | Release Evidence | PREPARED | `release-evidence.json` + `operator-release.json` | reale Belege auf einen RC sammeln |

## Quellsseitige Hardening-Blöcke

### v48 – Word Imposter

Voting-Resume, 50/51 Kategorien, 200/201 Begriffe, 1,5-MB-UTF-8-Backupgrenze und fail-closed Import ohne Bestandsmutation.

### v49/v50 – Hub Resume Guard

Zentrale Timer-/Resume-Integrität; stale UI entfernt; Resume-Aktionen während Guard-Ladung blockiert; Ladefehler fail-closed.

### v51 – Complete Backup

Registry-basierte aktuelle Key-Eigentümerschaft, Future-Key-Erhalt, key-spezifische Vorvalidierung und managed-only Rollback.

### v52 – sichere Hub-Rundenkontinuität

`party-hub-round-state.js`: Truth-Dare-/Prompt-/Choice-Current-Referenzen, getrennte Wahrheit/Pflicht-Pools, ungültige Referenzen verworfen, `next`/Skip bereinigen den Current-Zustand.

### v53 – Paranoia Resume / Privacy

- Paranoia speichert nur validierte Kartenreferenz/Phase/Ergebnis, keinen frei eingebetteten Geheimtext.
- Reload/Resume öffnet die Geheimfrage nicht automatisch.
- bewusste Reveal-Aktion zeigt wieder dieselbe Frage.
- ein bereits gefällter Münzwurf bleibt über Reload identisch und wird nicht neu randomisiert.
- Fokus-/Appverlust verdeckt private Inhalte sowohl vor als auch nach der Auflösung.
- ungültige/out-of-range Paranoia-Referenzen werden verworfen.
- `party-hub.js` bleibt unter der 1000-Zeilen-Architekturgrenze.

Verträge: `tests/hub-resume-contract.test.js`, `tests/e2e/core-hub-resume.spec.js`, `tests/e2e/core-hub-controls.spec.js`, `scripts/architecture_audit.py`.

Status aller Blöcke: **PREPARED**, weil echte Runner-/Browser-/PWA-/Gruppen-Evidence offen ist.

## Offline / PWA v53

- `secret-circle-v53`
- `secret-circle-v53-staging`
- `party-hub-round-state.js` v2 und `party-hub-polish.js` v17 offline
- alle vorherigen Resume-, Privacy-, A11y-, Backup- und Katalogmodule bleiben offline
- DWI / HR2 / BK51 / HR52 / PR53 müssen auf realer installierter PWA bestätigt werden

## Build / CI

- `package-lock.json` v3
- Playwright 1.54.2
- keine npm-Runtime-Dependencies
- Syntax-/Unit-/Validate-/E2E-Verträge erweitert
- letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**, `steps: null` / `steps: []`, kein Repositorycode ausgeführt
- **v50–v53 besitzen keinen echten Runner-PASS**

Status: **CLOSED IN CODE / ONLINE RUNNER VERIFICATION OPEN**.

## Zentrale offene Issues

- **#7:** GitHub Actions endet vor Step 1
- **#8:** reale Geräte, v53 Offline-PWA, Accessibility, DWI, HR2, BK51, HR52, PR53 und Partytests
- **#14:** Operator, Hosting, Legal, Support und Incident Evidence

Zusätzlich bleibt die Icon-Rechtebasis offen.

## Höchste Prioritäten

1. Hosted Runner / Online-`npm ci` / CI / Cross-Browser
2. Branch Protection
3. Provider + HTTPS-Staging/Production
4. v53 PWA-Smoke / Upgrade / Rollback
5. DWI + HR2 + BK51 + HR52 + PR53 real prüfen
6. Android / iPhone / Tablet / VoiceOver / TalkBack / Tastatur / Zoom
7. reale Gruppentests für alle 15 Core-Spiele
8. Icon-/Third-Party- und Operator-/Legal-/Support-/Incident-Sign-off
9. unveränderter RC + `release-evidence.json = FINAL / GO`

## Nicht als bestanden behaupten

Online-`npm ci`, CI/Cross-Browser, Branch Protection, HTTPS-Staging, reale PWA-/Geräte-/Accessibility-/DWI-/HR2-/BK51-/HR52-/PR53-/Gruppentests, Asset-/Operator-/Legal-/Support-Sign-off und finaler Release Evidence GO sind weiterhin offen.