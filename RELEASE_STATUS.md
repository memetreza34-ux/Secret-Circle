# Release-Status – Secret Circle

Stand: 26. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13

## Gesamtstatus

**Phase:** Release-Härtung  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v55` / `secret-circle-v55-staging`**  
**Classic Content:** **v4**  
**Core Source Review/Hardening:** **15/15 PREPARED**  
**Accessibility:** **PREPARED**  
**DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55:** **source PREPARED, real evidence OPEN**  
**Operator / Hosting / Legal:** **PREPARED / BLOCKED**

## Versionslinie

v45 Core → v46 Hub A11y → v47 Secondary A11y → v48 Word-Imposter → v49 Hub Resume Guard → v50 fail-closed Loader → v51 Complete Backup → v52 Safe Hub Current → v53 Paranoia Resume/Privacy → v54 Pre-Timer Resume → **v55 Advanced Integrity**.

## v55 – Advanced Integrity

Behoben/gehärtet:

- `advanced-resume-guard.js` Version 4
- Location Spy: Vote- und Guess-Result-Pfad sind gegenseitig exklusiv
- Mafia: ein nicht-fertiger Stage darf keinen bereits eindeutigen Alive-Winnerzustand fortsetzen
- Mafia: Rollenverteilung bleibt pack-/spielerzahlkonsistent
- Mafia `stage=finished` direkt speichern → fertige Runde exact-once
- bestehende Advanced-Resume-Session wird durch „Neue Session beginnen“ nur nach Bestätigung ersetzt
- Active-State-Löschfehler bleibt fail-closed und startet keine neue Session
- veralteter 8-Spieler-Mafia-Testfixture auf 2 Mafia korrigiert

Automatische Verträge:

- `tests/advanced-resume-guard.test.js`
- `tests/e2e/advanced-resume-integrity.spec.js`
- `tests/e2e/advanced-completion-exact-once.spec.js`
- `tests/e2e/advanced-new-session-guard.spec.js`
- insgesamt 9 kritische Advanced-E2Es im Syntax-Preflight
- `scripts/advanced_integrity_audit.py` in `npm run validate`
- Architecture Audit erzwingt Guard v4, Runner-Confirm und Advanced-Audit

Realer RC-Nachweis: **AD55**.

## PWA v55

- `secret-circle-v55`
- `secret-circle-v55-staging`
- Advanced Guard v4 + Runner-Neustartschutz offline
- alle bisherigen Resume-/Privacy-/A11y-/Backup-/Timer-Verträge bleiben enthalten

Reale Installation, Upgrade, Rollback und alle Spezialgates bleiben offen.

## CI – P0

Letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`; kein Repositorycode ausgeführt.

**v50–v55 besitzen keinen echten Runner-PASS.**

## Release Evidence / Assets

- `release-evidence.json`: **PREPARED / NO_GO**
- `operator-release.json`: **PREPARED / BLOCKED**
- Root-`icon.svg`: Rechtebasis `unresolved`

## Zentrale offene Blocker

1. **#7** Hosted Runner vor Step 1
2. **#8** reale Geräte, v55 Offline-PWA, DWI, HR2, BK51, HR52, PR53, PT54, AD55, Accessibility und Partytests
3. **#14** Operator, Hosting, Legal, Support und Incident Evidence

## Real offene Releasegates

1. Actions-Runner / Online-`npm ci` / CI / Cross-Browser
2. Branch Protection
3. Hostingprovider + getrennte HTTPS-Origins
4. v55 Staging-/Production-/PWA-Smokes + Upgrade/Rollback
5. DWI + HR2 + BK51 + HR52 + PR53 + PT54 + **AD55**
6. Android / iPhone / Tablet
7. VoiceOver / TalkBack / Tastatur / 200-%-Zoom
8. reale Gruppen/Beta für alle 15 Core-Spiele
9. Asset-/Operator-/Privacy-/Support-/Legal-Sign-off
10. unveränderter RC + Release Evidence FINAL/GO

## Releaseentscheidung

- öffentlicher Release: **NO_GO**
- PR #13 mergen: **Nein**
- PR #13 bleibt Draft: **Ja**