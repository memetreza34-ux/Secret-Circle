# Release-Status – Secret Circle

Stand: 25. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13

## Gesamtstatus

**Phase:** Release-Härtung  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v49` / `secret-circle-v49-staging`**  
**Classic Content:** **v4**  
**Core Source Review:** **15/15 PREPARED**  
**Core Source Hardening:** **15/15 PREPARED**  
**Accessibility Source Hardening:** **PREPARED**  
**Word-Imposter Data/Resume Hardening:** **PREPARED**  
**Hub Resume Integrity v2:** **PREPARED**  
**Operator / Hosting / Legal:** **PREPARED / BLOCKED**

v45 war die Core-Hardening-Generation, v46 brachte Hub-A11y, v47 erweiterte Accessibility auf Advanced/Quick/Creator, v48 bündelte Word-Imposter-Voting-Resume und lokale Custom-/Backup-Datenhärtung. **v49** vereinheitlicht die direkte Hub-Resume-Integrität auf den tatsächlich getesteten `party-hub-resume-guard.js` und synchronisiert die Release-Audits auf einen späteren echten FINAL/GO-Übergang.

## Core-Hardening – 15/15

Word Imposter, soziale Hub-Spiele, Paranoia, Scharade/Tabu, Heiße Kartoffel, Wortkette, Nur falsche Antworten sowie Advanced/Mafia sind quellsseitig auf Setup, Privacy, Resume, Timer, Regeln und Sieger-/Scoreintegrität gehärtet. Details: `CORE_GAME_ACCEPTANCE.md`.

## Word-Imposter Data/Resume – eingeführt v48, weiterhin in v49

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

## Hub Resume Integrity – v49

- `party-hub-resume-guard.js` Version 2 ist die zentrale getestete Hub-Resume-Quelle
- `party-hub-polish.js` delegiert an denselben Guard statt die Timer-/Resume-Validierung zu duplizieren
- gekreuzte oder logisch widersprüchliche Timerzustände werden verworfen
- beim Verwerfen wird auch eine bereits sichtbare `#hub-resume-session`-Karte entfernt
- gültige gespeicherte Sessions bleiben unangetastet
- `tests/party-hub-resume-guard.test.js` prüft Modul, Runtime-Einbindung, Offline-Core und stale-Resume-UI-Regressionsfall

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

Beide A11y-Schichten bleiben im v49-Offline-Core. **Noch offen:** echter Runner, VoiceOver/TalkBack, 200-%-Zoom, reale Tastatur-/Touch-/Browserabnahme.

## Operator / Hosting / Legal / Support

- `operator-release.json`: `PREPARED / BLOCKED`
- `OPERATOR_RELEASE_SIGNOFF.md`
- `OPERATOR_EVIDENCE_LOG.md` als einheitlicher realer Ausführungsnachweis
- `HOSTING_DECISION.md` auf v49-Smokevertrag
- `LEGAL_CHECKLIST.md` Stand 25. August 2026
- `SUPPORT.md` / `INCIDENT_RESPONSE.md`
- Issue #14 führt reale Operator-/Hosting-/Legal-/Support-/Incident-Schritte

Der Operator-Audit erzwingt bei einem späteren `READY` reale Privacy-/Legal-Dateien, echte veröffentlichte Werte, getrennte HTTPS-Origins sowie Links von allen fünf öffentlichen Einstiegseiten.

## Release-Audits / Final-State-Übergang

Die zentralen Verträge sind jetzt **transition-safe**:

- `scripts/branch_protection_contract_audit.py`
- `scripts/foundation_contract_audit.py`
- `scripts/release_readiness_contract_audit.py`
- `scripts/release_audit.py`
- `scripts/validate_project.py`

Sie prüfen weiterhin den heutigen PREPARED/OPEN/NO_GO-Zustand, blockieren aber nicht mehr einen später korrekt belegten PASS/FINAL/GO-Zustand durch hart codierte historische Statusannahmen. `validate_project.py` ist auf die aktuellen v49-Scriptketten synchronisiert und prüft zusätzlich den dynamischen Hub-Resume-v2-Loadervertrag.

## Build / Supply Chain

- `package-lock.json` v3
- Playwright exakt 1.54.2
- keine npm-Runtime-Dependencies
- CI/Cross-Browser verwenden `npm ci`
- Lockfile-, Architektur-, Hub-A11y-, Secondary-A11y-, Word-Imposter-Daten-, Operator- und Readiness-Verträge eingebunden

**Offen:** echter Online-`npm ci`-/Integrity-PASS auf funktionierendem Runner.

## PWA v49

Service Worker:

- `secret-circle-v49`
- `secret-circle-v49-staging`

Offline enthalten sind Hub/Word Imposter/Advanced/Quick/Creator/Privacy, Katalog-/Contentmodule, Backup-Registry, Session-/Timercontroller, Word-Imposter-/Hub-/Advanced-Resume-Guards, Privacy-Guards, beide A11y-Schichten, aktuelle Word-Imposter-UI-/Store-Dateien, Manifest und Icons.

Reale Installation, Upgrades, Rollback und Offline-Gerätetest bleiben offen.

## CI – P0

Letzter vollständig untersuchter v49-App-Actions-Lauf: **Run #2787**.

- Run ID `32871536761`
- Job `validate`, Job ID `97879489858`
- Head `a9ad91389ff9e966af432b0a77103ddc0960709d`
- `failure`
- `steps: null` / separate Step-Abfrage `steps: []`
- kein Checkout, npm, Test oder Repository-Code ausgeführt

Der Minimal-Runner-Probe zeigte dasselbe Muster ohne Repositoryabhängigkeit. Die unmittelbare Fehlerfläche bleibt deshalb vor der Step-Ausführung: Hosted-Runner-Zuteilung, Actions-/Account-/Billing-/Budget-/Policyzustand oder GitHub-seitige Runner-Störung. Run #2787 bestätigt das Pre-Step-Muster ausdrücklich auch auf v49. Details: Issue #7 / `CI_TROUBLESHOOTING.md`.

## Release Evidence / Assets

- `release-evidence.json`: **PREPARED / NO_GO**
- `operator-release.json`: **PREPARED / BLOCKED**
- Root-`icon.svg` und Ableitungen: Rechtebasis weiterhin `unresolved`

## Drei zentrale offene GitHub-Blocker

1. **Issue #7** – Hosted Runner vor Step 1
2. **Issue #8** – reale Geräte, v49 Offline-PWA, Accessibility, Word-Imposter-Datengrenzen, Hub-Resume-v2 und Partytests
3. **Issue #14** – Operator, Hosting, Legal, Support und Incident Evidence

## Real offene Releasegates

1. Actions-Runner / echte Steps
2. Online-`npm ci` + CI/Cross-Browser
3. Branch Protection real aktiv
4. Hostingprovider + getrennte HTTPS-Origins
5. v49 Staging-/Production-/PWA-Smokes
6. v49 Upgrade/Rollback auf echten Installationen
7. Word-Imposter-Daten-/Voting-Verträge + Hub-Resume-v2 real ausführen
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