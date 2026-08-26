# Release-Status – Secret Circle

Stand: 26. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13

## Gesamtstatus

**Phase:** Release-Härtung  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v54` / `secret-circle-v54-staging`**  
**Classic Content:** **v4**  
**Core Source Review/Hardening:** **15/15 PREPARED**  
**Accessibility:** **PREPARED**  
**Word-Imposter v48:** **PREPARED**  
**Hub Resume v49/v50:** **PREPARED**  
**Complete Backup v51:** **PREPARED**  
**Hub Round Resume v52:** **PREPARED**  
**Paranoia Resume/Privacy v53:** **PREPARED**  
**Pre-Timer Resume v54:** **PREPARED**  
**Operator / Hosting / Legal:** **PREPARED / BLOCKED**

## Versionslinie

- v45 Core-Hardening
- v46 Hub-A11y
- v47 Secondary-Surface-A11y
- v48 Word-Imposter Voting-/Datenhärtung
- v49 zentraler Hub-Resume-Guard v2
- v50 fail-closed Resume-Ladequarantäne
- v51 Complete Backup / Forward Compatibility
- v52 sichere direkte Hub-Current-Runden + Truth/Dare-Pooltrennung
- v53 Paranoia same-question/same-result ohne Auto-Reveal
- **v54 sichere Pre-Timer-Kontinuität für Hot Potato und Wortkette**

## v54 – Pre-Timer Resume

Behoben:

- Hot Potato verbraucht vor Timerstart keine unsichtbare Ersatzaufgabe mehr nach Reload.
- Wortkette behält vor Timerstart denselben Startbuchstaben über Reload/Resume.
- `party-hub-round-state.js` steht auf **Version 3** und erlaubt `hot-potato`/`word-chain` als sichere Current-Modi.
- Beim Timerstart wird `current` sofort gelöscht.
- Danach besitzt ausschließlich der Timer-Snapshot denselben Wert über `timer.prompt` beziehungsweise `timer.letter`.
- Scharade/Tabu bleiben aus diesem sichtbaren Pre-Start-Current-Vertrag ausgeschlossen.

Automatische Verträge:

- `tests/hub-resume-contract.test.js`
- `tests/hub-timer-contract.test.js`
- `tests/e2e/core-hub-prestart-resume.spec.js`
- `tests/service-worker.test.js`
- `ARCHITECTURE.md`

Realer RC-Nachweis: **PT54**.

## PWA v54

- `secret-circle-v54`
- `secret-circle-v54-staging`
- `party-hub-round-state.js` v3 und `party-hub-timers.js` mit PT54-Vertrag offline
- alle bisherigen Resume-/Privacy-/A11y-/Backup-Schichten bleiben enthalten

Reale Installation, Upgrade, Rollback und DWI/HR2/BK51/HR52/PR53/PT54 bleiben offen.

## Build / Supply Chain

- `package-lock.json` v3
- Playwright 1.54.2 exakt
- keine npm-Runtime-Dependencies
- CI/Cross-Browser verwenden `npm ci`
- neue PT54-E2E-Spec im Syntax-Preflight
- Unit-/Timer-Verträge prüfen den Current→Timer-Snapshot-Übergang

## CI – P0

Letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49** – Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`; kein Repository-Code wurde ausgeführt. Minimal-Runner-Probe zeigte dasselbe Muster.

**v50–v54 besitzen keinen echten Runner-PASS.**

## Release Evidence / Assets

- `release-evidence.json`: **PREPARED / NO_GO**
- `operator-release.json`: **PREPARED / BLOCKED**
- Root-`icon.svg`: Rechtebasis weiterhin `unresolved`

## Zentrale offene Blocker

1. **#7** Hosted Runner vor Step 1
2. **#8** reale Geräte, v54 Offline-PWA, DWI, HR2, BK51, HR52, PR53, PT54, Accessibility und Partytests
3. **#14** Operator, Hosting, Legal, Support und Incident Evidence

## Real offene Releasegates

1. Actions-Runner / Online-`npm ci` / CI / Cross-Browser
2. Branch Protection
3. Hostingprovider + getrennte HTTPS-Origins
4. v54 Staging-/Production-/PWA-Smokes + Upgrade/Rollback
5. DWI + HR2 + BK51 + HR52 + PR53 + **PT54**
6. Android / iPhone / Tablet
7. VoiceOver / TalkBack / Tastatur / 200-%-Zoom
8. reale Gruppen/Beta für alle 15 Core-Spiele
9. Icon-/Third-Party-/Operator-/Privacy-/Support-/Legal-Sign-off
10. unveränderter RC + Release Evidence FINAL/GO

## Releaseentscheidung

- öffentlicher Release: **NO_GO**
- PR #13 mergen: **Nein**
- PR #13 bleibt Draft: **Ja**