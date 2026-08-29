# Release-Status – Secret Circle

Stand: 29. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13

## Gesamtstatus

**Phase:** Release-Härtung + kontrollierte Labs-Expansion  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v61` / `secret-circle-v61-staging`**  
**Built-ins:** **47 · 15 Core / 13 Extended / 19 Labs**  
**Classic Content:** **v4**  
**Core Source Review/Hardening:** **15/15 PREPARED**  
**Accessibility:** **PREPARED**  
**Bestehende Spezialgates bis HS60:** **source PREPARED, real evidence OPEN**  
**Wave-1 Party Quiz / Fake oder Fakt:** **source PREPARED, real evidence OPEN**  
**Operator / Hosting / Legal:** **PREPARED / BLOCKED**

## Versionslinie

v45 Core → v46 Hub A11y → v47 Secondary A11y → v48 Word-Imposter → v49 Hub Resume Guard → v50 fail-closed Loader → v51 Complete Backup → v52 Safe Hub Current → v53 Paranoia → v54 Pre-Timer → v55 Advanced Integrity → v56 Quick Replacement → v57 Quick Timer Resume → v58 BFCache → v59 Background Pause → v60 Hidden Snapshot → **v61 Expansion Wave 1**.

## v61 – Expansion Wave 1

Erste zwei neue Labs sind technisch implementiert:

- **Party Quiz** – 3 Packs / 24 Karten / Multiple Choice / Erklärung / Score / Result-Resume
- **Fake oder Fakt** – 3 Packs / 24 Karten / Fakt-Fake / Erklärung / Score

Gemeinsame Architektur:

- `party-wave-one-catalog.js` v2
- `party-wave-one-modes.js`
- `quick-loader.js` v8
- beide IDs bleiben Labs
- bestehender Quick-Family-Replacement-Schutz wird wiederverwendet
- exact-once Completion über das Session-Ledger
- Offline-Core enthält Katalog + Runner

Automatische Verträge:

- `tests/party-wave-one-catalog.test.js`
- `tests/e2e/wave-one-quiz.spec.js`
- `scripts/wave_one_quiz_audit.py`
- Architecture Audit und `validate_project.py` kennen die neue Runtimekette

Langfristige Expansion: `APP_SPIELMODI_UND_THEMEN_ANLEITUNG.md` + `GAME_LIBRARY_BACKLOG.json`.

**Wichtig:** Wave-1-Labs erweitern den Januar-Core nicht automatisch. Vor einer Release-Einstufung bleiben reale Browser-/PWA-/Accessibility-/Gruppentests Pflicht.

## PWA v61

- `secret-circle-v61`
- `secret-circle-v61-staging`
- `party-wave-one-catalog.js` und `party-wave-one-modes.js` offline
- Quick Loader v8 offline
- SessionControls v5 und alle bisherigen Resume-/Privacy-/A11y-/Backup-/Advanced-Verträge bleiben enthalten

## CI – P0

Letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`; kein Repositorycode ausgeführt.

**v50–v61 besitzen keinen echten Runner-PASS.**

## Release Evidence / Assets

- `release-evidence.json`: **PREPARED / NO_GO**
- `operator-release.json`: **PREPARED / BLOCKED**
- Root-`icon.svg`: Rechtebasis `unresolved`

## Zentrale offene Blocker

1. **#7** Hosted Runner vor Step 1
2. **#8** reale Geräte, v61 Offline-PWA, Spezialgates, Accessibility, Core-Partytests und Wave-1-Labs
3. **#14** Operator, Hosting, Legal, Support und Incident Evidence

## Real offene Releasegates

1. Actions-Runner / Online-`npm ci` / CI / Cross-Browser
2. Branch Protection
3. Hostingprovider + getrennte HTTPS-Origins
4. v61 Staging-/Production-/PWA-Smokes + Upgrade/Rollback
5. bestehende Spezialgates
6. Android / iPhone / Tablet
7. VoiceOver / TalkBack / Tastatur / 200-%-Zoom
8. reale Gruppen/Beta für alle 15 Core-Spiele
9. Wave-1-Labs nur bei eigener realer Evidence releasefähig markieren
10. Asset-/Operator-/Privacy-/Support-/Legal-Sign-off
11. unveränderter RC + Release Evidence FINAL/GO

## Releaseentscheidung

- öffentlicher Release: **NO_GO**
- PR #13 mergen: **Nein**
- PR #13 bleibt Draft: **Ja**
