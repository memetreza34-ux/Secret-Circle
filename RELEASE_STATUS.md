# Release-Status – Secret Circle

Stand: 25. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13

## Gesamtstatus

**Phase:** Release-Härtung  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v48` / `secret-circle-v48-staging`**  
**Classic Content:** **v4**  
**Core Source Review:** **15/15 PREPARED**  
**Core Source Hardening:** **15/15 PREPARED**  
**Accessibility Source Hardening:** **PREPARED**  
**Word-Imposter Data/Resume Hardening:** **PREPARED**  
**Operator / Hosting / Legal:** **PREPARED / BLOCKED**

v45 war die Core-Hardening-Generation, v46 brachte Hub-A11y, v47 erweiterte Accessibility auf Advanced/Quick/Creator. **v48** bündelt Word-Imposter-Voting-Resume und lokale Custom-/Backup-Datenhärtung.

## Core-Hardening – 15/15

Word Imposter, soziale Hub-Spiele, Paranoia, Scharade/Tabu, Heiße Kartoffel, Wortkette, Nur falsche Antworten sowie Advanced/Mafia sind quellsseitig auf Setup, Privacy, Resume, Timer, Regeln und Sieger-/Scoreintegrität gehärtet. Details: `CORE_GAME_ACCEPTANCE.md`.

## Word-Imposter Data/Resume – v48

- nächste abstimmende Person wird aus den tatsächlich **noch offenen Vote-Keys** abgeleitet
- nicht-sequenzielle manipulierte Voting-Snapshots bleiben durch den Resume-Guard blockiert
- maximal 50 eigene Kategorien
- maximal 200 Begriffe je Kategorie
- 51/201 werden abgelehnt statt still gekürzt
- 1,5-MB-UTF-8-Backupgrenze zwischen UI und Store synchron
- abgelehnte Imports verändern bestehende Daten nicht
- sichtbare UI-Hinweise für 50 Kategorien / 2–200 Begriffe
- `tests/storage.test.js` + `tests/word-imposter-data-contract.test.js`

**Noch offen:** echte Ausführung dieser Tests auf dem Runner sowie realer Browser-/PWA-Smoke. Deshalb PREPARED, nicht PASS.

## Accessibility-Hardening – v46/v47

### Hub / v46

- `party-hub-a11y.js`
- Hub-Bereichsfokus
- Hub-Spieldetail und aktive Runde als modale Tastaturkontexte
- Hintergrund `inert`
- Tab-/Shift+Tab-Fokus-Trap
- Rückkehrfokus

### Advanced / Quick / Creator / v47

- `secondary-surface-a11y.js` Version 1
- Advanced-Spieloverlay modal + Hintergrundisolation + Fokus-Trap
- Quick-Fokus-Recovery bei dynamischen Phasenwechseln
- Creator-Schrittüberschriften programmatisch fokussierbar
- Creator-Hilfe modal + Hintergrundisolation + Fokus-Trap + Rückkehrfokus
- Creator-Template-Radiogroup mit roving `tabindex`, Pfeiltasten, Home und End
- `scripts/secondary_surface_a11y_contract_audit.py` in `npm run validate`

Beide A11y-Schichten bleiben im v48-Offline-Core. **Noch offen:** echter Runner, VoiceOver/TalkBack, 200-%-Zoom, reale Tastatur-/Touch-/Browserabnahme.

## Operator / Hosting / Legal / Support

- `operator-release.json`: `PREPARED / BLOCKED`
- `OPERATOR_RELEASE_SIGNOFF.md`
- `HOSTING_DECISION.md` auf v48-Smokevertrag
- `LEGAL_CHECKLIST.md` Stand 25. August 2026
- `SUPPORT.md` / `INCIDENT_RESPONSE.md`
- Issue #14 führt reale Operator-/Hosting-/Legal-/Support-/Incident-Schritte

## Build / Supply Chain

- `package-lock.json` v3
- Playwright exakt 1.54.2
- keine npm-Runtime-Dependencies
- CI/Cross-Browser verwenden `npm ci`
- Lockfile-, Architektur-, Hub-A11y-, Secondary-A11y-, Word-Imposter-Daten-, Operator- und Readiness-Verträge eingebunden

**Offen:** echter Online-`npm ci`-/Integrity-PASS auf funktionierendem Runner.

## PWA v48

Service Worker:

- `secret-circle-v48`
- `secret-circle-v48-staging`

Offline enthalten sind Hub/Word Imposter/Advanced/Quick/Creator/Privacy, Katalog-/Contentmodule, Backup-Registry, Session-/Timercontroller, Resume-/Privacy-Guards, beide A11y-Schichten, aktuelle Word-Imposter-UI-/Store-Dateien, Manifest und Icons.

Reale Installation, Upgrades, Rollback und Offline-Gerätetest bleiben offen.

## CI – P0

Aktuellster bestätigter v48-Lauf: **Run #2715**.

- Run ID `32850361668`
- Job `validate`, Job ID `97809595781`
- Head `9f87910567a60e5ce905ced42bb62201b3e3a85d`
- `failure`
- `steps: null` / separate Step-Abfrage `steps: []`
- kein Checkout, npm, Test oder Repository-Code ausgeführt

Der Minimal-Runner-Probe zeigte dasselbe Muster ohne Repositoryabhängigkeit. Die unmittelbare Fehlerfläche bleibt deshalb vor der Step-Ausführung: Hosted-Runner-Zuteilung, Actions-/Account-/Billing-/Budget-/Policyzustand oder GitHub-seitige Runner-Störung. Details: Issue #7 / `CI_TROUBLESHOOTING.md`.

## Release Evidence / Assets

- `release-evidence.json`: **PREPARED / NO_GO**
- `operator-release.json`: **PREPARED / BLOCKED**
- Root-`icon.svg` und Ableitungen: Rechtebasis weiterhin `unresolved`

## Drei zentrale offene GitHub-Blocker

1. **Issue #7** – Hosted Runner vor Step 1
2. **Issue #8** – reale Geräte, v48 Offline-PWA, Accessibility, Word-Imposter-Datengrenzen und Partytests
3. **Issue #14** – Operator, Hosting, Legal, Support und Incident Evidence

## Real offene Releasegates

1. Actions-Runner / echte Steps
2. Online-`npm ci` + CI/Cross-Browser
3. Branch Protection real aktiv
4. Hostingprovider + getrennte HTTPS-Origins
5. v48 Staging-/Production-/PWA-Smokes
6. v48 Upgrade/Rollback auf echten Installationen
7. Word-Imposter-v48-Daten-/Voting-Verträge real ausführen
8. Android / iPhone / Tablet
9. VoiceOver / TalkBack / Hub-/Advanced-/Quick-/Creator-Tastaturpfade / 200-%-Zoom
10. reale Gruppen/Beta für alle 15 Core-Spiele
11. Icon-/Visual-/Third-Party-Sign-off
12. Operator-/Privacy-/Support-/Legal-Sign-off
13. Support-/Security-/SEV-1-/Rollback-Drill
14. unveränderter RC + Release Evidence FINAL/GO

## Releaseentscheidung

- öffentlicher Release: **NO_GO**
- PR #13 mergen: **Nein**
- PR #13 bleibt Draft: **Ja**