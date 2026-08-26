# Release-Status – Secret Circle

Stand: 26. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13

## Gesamtstatus

**Phase:** Release-Härtung  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v53` / `secret-circle-v53-staging`**  
**Classic Content:** **v4**  
**Core Source Review:** **15/15 PREPARED**  
**Core Source Hardening:** **15/15 PREPARED**  
**Accessibility Source Hardening:** **PREPARED**  
**Word-Imposter Data/Resume Hardening:** **PREPARED**  
**Hub Resume Guard v2 + Lade-Quarantäne:** **PREPARED**  
**Complete Backup v51 Hardening:** **PREPARED**  
**Hub Round Resume v52:** **PREPARED**  
**Paranoia Resume/Privacy v53:** **PREPARED**  
**Operator / Hosting / Legal:** **PREPARED / BLOCKED**

Versionslinie:

- v45: Core-Hardening
- v46: Hub-A11y
- v47: Advanced-/Quick-/Creator-A11y
- v48: Word-Imposter Voting-/Datenhärtung
- v49: zentraler Hub-Resume-Guard v2
- v50: fail-closed Resume-UI während Guard-Lade-/Validierung
- v51: Complete-Backup-Transaktion und Forward-Compatibility
- v52: sichere Current-Karten + getrennte Wahrheit-/Pflicht-Usage-Pools
- **v53: gedeckte Paranoia-Rundenreferenz, stabiles Münzwurf-Ergebnis und Concealment auch nach Auflösung**

## v53 – Paranoia Resume/Privacy

Behoben:

- begonnene geheime Frage bleibt als validierte Kartenreferenz/Phase erhalten
- nach Reload wird die Frage **nicht automatisch sichtbar**
- erneute bewusste Reveal-Aktion zeigt exakt dieselbe Frage
- bereits gefällter Münzwurf wird gespeichert und nicht neu gewürfelt
- ein bereits aufgelöster Zustand bleibt nach Reload gedeckt und wird erst über „Rundenergebnis anzeigen“ geöffnet
- `party-hub-polish.js` Version 17 verdeckt Paranoia auch nach dem Münzwurf bei Blur/Appwechsel
- ungültige/out-of-range Referenzen und `resolved` ohne boolesches Ergebnis werden verworfen
- `party-hub.js` wurde nach dem Ausbau wieder deutlich unter die 1000-Zeilen-Grenze gebracht

Automatische Source-Verträge:

- `party-hub-round-state.js` Version 2
- `tests/hub-resume-contract.test.js`
- `tests/e2e/core-hub-resume.spec.js`
- `tests/e2e/core-hub-controls.spec.js`
- `scripts/architecture_audit.py`
- `tests/service-worker.test.js`

Realer RC-Nachweis: **PR53**.

## Bestehende Hardening-Verträge

### Word Imposter – v48

Voting-/Resume-Integrität, 50 Kategorien, 200 Begriffe, 1,5-MB-UTF-8-Grenze und fail-closed Import bleiben aktiv.

### Hub Resume – v49/v50

Zentraler Resume-Guard v2 plus fail-closed Ladequarantäne (`aria-busy`, deaktivierte Aktionen bis erfolgreicher Validierung).

### Complete Backup – v51

Registry v2, `party-data-tools.js` v6, managed-only Restore/Rollback, Future-Key-/Version-Erhalt und vollständige Vorvalidierung.

### Safe Hub Round Resume – v52

Truth-Dare-/Prompt-/Choice-Karten bleiben über Reload identisch; Wahrheit und Pflicht besitzen getrennte Usage-Pools; next/skip löschen Current.

## PWA v53

Service Worker:

- `secret-circle-v53`
- `secret-circle-v53-staging`

Der Offline-Core enthält `party-hub-round-state.js` Version 2 und `party-hub-polish.js` Version 17 sowie alle bisherigen Resume-/Privacy-/A11y-/Backup-Schichten.

Reale Installation, Upgrade, Rollback, BK51, HR52 und PR53 auf Zielgeräten bleiben offen.

## Build / Supply Chain

- `package-lock.json` v3
- Playwright 1.54.2
- keine npm-Runtime-Dependencies
- CI/Cross-Browser verwenden `npm ci`
- Hub-Resume- und Hub-Control-E2E-Verträge im Syntax-Preflight
- Architecture Audit prüft v53 Runtime, Privacy, Offline-Core und unveränderte 1000-Zeilen-Grenze

## CI – P0

Letzter vollständig untersuchter App-Actions-Lauf: **Run #2787 auf v49**.

- Run ID `32871536761`
- Job `validate`, Job ID `97879489858`
- Head `a9ad91389ff9e966af432b0a77103ddc0960709d`
- `failure`
- `steps: null` / `steps: []`
- kein Checkout, npm, Test oder Repository-Code ausgeführt

Der Minimal-Runner-Probe zeigte dasselbe Muster. **v50, v51, v52 und v53 besitzen keinen echten Runner-PASS.**

## Release Evidence / Assets

- `release-evidence.json`: **PREPARED / NO_GO**
- `operator-release.json`: **PREPARED / BLOCKED**
- Root-`icon.svg`: Rechtebasis weiterhin `unresolved`

## Drei zentrale offene GitHub-Blocker

1. **Issue #7** – Hosted Runner vor Step 1
2. **Issue #8** – reale Geräte, v53 Offline-PWA, DWI, HR2, BK51, HR52, PR53, Accessibility und Partytests
3. **Issue #14** – Operator, Hosting, Legal, Support und Incident Evidence

## Real offene Releasegates

1. Actions-Runner / Online-`npm ci` / CI / Cross-Browser
2. Branch Protection
3. Hostingprovider + getrennte HTTPS-Origins
4. v53 Staging-/Production-/PWA-Smokes
5. v53 Upgrade/Rollback
6. DWI + HR2 + BK51 + HR52 + **PR53**
7. Android / iPhone / Tablet
8. VoiceOver / TalkBack / Tastatur / 200-%-Zoom
9. reale Gruppen/Beta für alle 15 Core-Spiele
10. Icon-/Third-Party-/Operator-/Privacy-/Support-/Legal-Sign-off
11. unveränderter RC + Release Evidence FINAL/GO

## Releaseentscheidung

- öffentlicher Release: **NO_GO**
- PR #13 mergen: **Nein**
- PR #13 bleibt Draft: **Ja**