# Secret Circle – A-bis-Z Entwicklungsstatus

Stand: 26. August 2026

Operativer Fortschrittstracker zu `APP_ENTWICKLUNG_VON_A_BIS_Z.md`.

## Gesamtstatus

**Öffentliche Releasefreigabe: NO_GO**  
**Offline-Core: `secret-circle-v54` / `secret-circle-v54-staging`**  
**Classic Content: v4**  
**Core Source Review/Hardening: 15/15 PREPARED**  
**Accessibility: PREPARED**  
**DWI / HR2 / BK51 / HR52 / PR53 / PT54: quellsseitig PREPARED, real offen**  
**Operator / Hosting / Legal: PREPARED / BLOCKED**

Arbeitsstand: Draft-PR #13 auf `agent/release-foundation-2027`.

## Versionslinie

v45 Core-Hardening → v46 Hub-A11y → v47 Secondary-A11y → v48 Word-Imposter Data/Resume → v49 zentraler Hub-Resume-Guard → v50 fail-closed Loader → v51 Complete Backup → v52 sichere Hub-Current-Runden → v53 Paranoia Resume/Privacy → **v54 sichere Pre-Timer-Kontinuität für Hot Potato und Wortkette**.

## A-bis-Z-Tracker

| # | Bereich | Status | Nächste reale Aktion |
|---|---|---|---|
| 0 | Produktziel / Releasegrenze | DONE | bei Scopeänderung aktualisieren |
| A | Querschnittsverträge | PREPARED | reale Gates schließen |
| 1 | Discovery / Nutzer / Markt | DONE | reale Nutzer weiter validieren |
| 2 | Produktstrategie / Scope | PREPARED | reale Gruppen/Nutzer |
| 3 | Plattformstrategie | PREPARED | reale Zielgeräte |
| 4 | Requirements / Akzeptanz | PREPARED | Runner + reale Core-Abnahme |
| 5 | UX / IA / Design | PREPARED | reale UX-/Tastaturtests |
| 6 | Architektur / ADR | PREPARED | PT54-/PWA-Evidence |
| 7 | Security / Threat Model | PREPARED | echter Browser/Runner |
| 8 | Repo / Git / Build | BLOCKED | Issue #7 + Branch Protection |
| 9 | Feature-Entwicklungsloop | PREPARED | gezielte Hardening-Funde, kein Scope-Bloat |
| 10 | Fehlerbehandlung / Resilienz | PREPARED | Quota/Update/Resume/Restore real |
| 11 | Tests / CI | BLOCKED | funktionierender Hosted Runner |
| 12 | Offline / PWA / Resume | PREPARED | v54 Install/Upgrade/Rollback + DWI/HR2/BK51/HR52/PR53/PT54 |
| 13 | Content / Alter / Privacy | IN PROGRESS | reale Gruppen + finaler Sign-off |
| 14 | Beta / reale Gruppen | PREPARED | G1–G5 + Spezialgates + PN1–PN3 |
| 15 | Datenschutz / Recht / Support | BLOCKED | reale Betreiber-/Hosting-/Kontaktangaben |
| 16 | Release Management / RC | PREPARED | unveränderlichen RC einfrieren |
| 17 | Deployment / Environments | BLOCKED | Provider + echte HTTPS-Origins |
| 18 | Operations / Incident | BLOCKED | Verantwortliche + reale Drills |
| 19 | Wartung / Migration | PREPARED | operative Routine real |
| 20 | Risk Management | IN PROGRESS | laufend aktualisieren |
| 21 | Accessibility | PREPARED | VoiceOver/TalkBack/Zoom/Tastatur/Geräte |
| 22 | Third Party / Assetrechte | BLOCKED | Icon-Rechte menschlich bestätigen |
| 23 | Fan-/Referenzcontent | IN PROGRESS | Runner + manuelle Visual/Legal-Abnahme |
| 24 | Release Evidence | PREPARED | reale Belege auf einen RC sammeln |

## v54 – Pre-Timer Resume

- `party-hub-round-state.js` Version 3 nimmt `hot-potato` und `word-chain` in die sicheren Current-Modi auf.
- Hot Potato behält die bereits sichtbare Aufgabe vor Timerstart über Reload/Resume.
- Wortkette behält den bereits sichtbaren Startbuchstaben vor Timerstart über Reload/Resume.
- Timerstart löscht `current` vor Erstellung des Timer-Snapshots.
- derselbe Wert lebt danach ausschließlich in `timer.prompt` bzw. `timer.letter` weiter.
- Scharade/Tabu bleiben wegen ihrer privaten Karten aus dem sichtbaren Pre-Start-Current-Vertrag ausgeschlossen.
- `tests/e2e/core-hub-prestart-resume.spec.js` schützt beide Browserübergänge.
- `scripts/hub_prestart_resume_audit.py` ist Teil von `npm run validate` und prüft sich selbst als Required Validate-Gate.

Realer Nachweis: **PT54**.

## Offline / PWA v54

- `secret-circle-v54`
- `secret-circle-v54-staging`
- RoundState v3 / Hub Timer / alle früheren Resume-, Privacy-, A11y-, Backup- und Katalogmodule offline
- DWI / HR2 / BK51 / HR52 / PR53 / PT54 müssen auf installierter PWA bestätigt werden

## Build / CI

- `package-lock.json` v3
- Playwright 1.54.2
- keine npm-Runtime-Dependencies
- PT54-E2E im Syntax-Preflight
- PT54 eigener Audit in `npm run validate`
- letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**, `steps: null` / `steps: []`; kein Repositorycode ausgeführt
- **v50–v54 besitzen keinen echten Runner-PASS**

Status: **CLOSED IN CODE / ONLINE RUNNER VERIFICATION OPEN**.

## Zentrale offene Issues

- **#7:** GitHub Actions endet vor Step 1
- **#8:** reale Geräte, v54 Offline-PWA, Accessibility, DWI, HR2, BK51, HR52, PR53, PT54 und Partytests
- **#14:** Operator, Hosting, Legal, Support und Incident Evidence

Zusätzlich bleibt die Icon-Rechtebasis offen.

## Höchste Prioritäten

1. Hosted Runner / Online-`npm ci` / CI / Cross-Browser
2. Branch Protection
3. Provider + HTTPS-Staging/Production
4. v54 PWA-Smoke / Upgrade / Rollback
5. DWI + HR2 + BK51 + HR52 + PR53 + PT54 real
6. Android / iPhone / Tablet / VoiceOver / TalkBack / Tastatur / Zoom
7. reale Gruppentests für alle 15 Core-Spiele
8. Asset-/Operator-/Legal-/Support-/Incident-Sign-off
9. unveränderter RC + `release-evidence.json = FINAL / GO`

## Nicht als bestanden behaupten

Online-`npm ci`, CI/Cross-Browser, Branch Protection, HTTPS-Staging, reale PWA-/Geräte-/Accessibility-/Spezialgate-/Gruppentests, Asset-/Operator-/Legal-/Support-Sign-off und finaler Release Evidence GO sind weiterhin offen.