# Release-Status – Secret Circle

Stand: 25. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13

## Gesamtstatus

**Phase:** Release-Härtung  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v46` / `secret-circle-v46-staging`**  
**Classic Content:** **v4**  
**Core Source Review:** **15/15 PREPARED**  
**Core Source Hardening:** **15/15 PREPARED**  
**Accessibility Source Hardening:** **PREPARED**  
**Operator / Hosting / Legal:** **PREPARED / BLOCKED**

v45 war die Cachegeneration nach dem Core-Hardening. **v46** ist die neue Generation für das zusätzliche Hub-Accessibility-Hardening und nimmt `party-hub-a11y.js` explizit in den Offline-Core auf.

## Core-Hardening – 15/15

- Word Imposter: Setup-Validierung, Rollenfairness, Voting-/Resume-Guard, Geheimkarten-Schutz
- soziale Hub-Spiele: sichtbare Live-Regeln und Freiwilligkeit, wo relevant
- Paranoia: offene Geheimfrage wird bei Fokusverlust verdeckt
- Scharade/Tabu: offene Geheimkarten werden bei App-/Tab-Wechsel verdeckt
- Heiße Kartoffel: Zufallstimer exakt 10–25 Sekunden
- Wortkette: klarer manueller Erfolgsvertrag
- Nur falsche Antworten: klare manuelle Verlustregel; scorelos
- Hub-Resume: Timerzustand muss zur Spielart passen
- Advanced: `advanced-privacy-guard.js` + `advanced-resume-guard.js`
- Advanced-Resume validiert Two-Truths-Ergebnis, Question-Imposter-Rolle/Vote, Location-Spy-Zustand sowie Mafia-Rollenanzahl, Alive-Menge und Siegerintegrität

Details: `CORE_GAME_ACCEPTANCE.md`.

## Accessibility-Hardening – v46

Neu vorbereitet:

- `party-hub-a11y.js` Version 2
- Hub-Bereichswechsel fokussieren die neue sichtbare Hauptüberschrift mit `tabindex="-1"`
- aktive Hub-Spielrunde ist als `role="dialog"` + `aria-modal="true"` ausgezeichnet
- bei Spieldetail/Spielrunde wird der übrige Body-Hintergrund `inert`
- Tab/Shift+Tab bleibt innerhalb des aktiven Overlays
- dynamisch hinzugefügte Body-Siblings werden während eines offenen Overlays ebenfalls isoliert
- Skip-Link bleibt beim Erstladen erster sinnvoller Tastaturtarget
- `tests/accessibility-contract.test.js` erweitert
- `tests/e2e/accessibility-core.spec.js` um reale Browser-Fokuspfade erweitert
- `scripts/hub_a11y_contract_audit.py` in `npm run validate`
- `party-hub-a11y.js` Bestandteil von v46

**Noch offen:** echte Ausführung auf Runner, VoiceOver/TalkBack, 200-%-Zoom, reale Tastatur-/Touch-/Browserabnahme. Deshalb weiterhin PREPARED, nicht PASS.

## Operator / Hosting / Legal / Support

Zentralisiert:

- `operator-release.json` – aktuell `PREPARED / BLOCKED`
- `OPERATOR_RELEASE_SIGNOFF.md`
- `HOSTING_DECISION.md`
- `scripts/operator_release_contract_audit.py` in `npm run validate`
- `LEGAL_CHECKLIST.md` Stand 25. August 2026
- `SUPPORT.md` und `INCIDENT_RESPONSE.md` an dieselbe Operator-Akte gebunden
- Issue #14 führt die real offenen Betreiber-/Hosting-/Legal-/Support-/Incident-Schritte

`legalPrivacy` und `supportIncident` dürfen erst PASS werden, wenn `operator-release.json = FINAL / READY` und reale Nachweise existieren.

## Build / Supply Chain

- `package-lock.json` v3
- Playwright-Testkette exakt 1.54.2
- keine npm-Runtime-Dependencies
- feste Registry-/Integrity-Verträge
- CI/Cross-Browser verwenden `npm ci`
- Lockfile-/A11y-/Operator-/Readiness-Audits in `npm run validate`
- Operator- und Readiness-Audit leiten die aktuelle Cachegeneration inzwischen dynamisch aus `sw.js` ab

**Offen:** echter Online-`npm ci`-/Integrity-PASS auf funktionierendem Runner.

## PWA v46

Service Worker:

- `secret-circle-v46`
- `secret-circle-v46-staging`

Offline enthalten sind fünf Einstiegspfade, Katalog-/Contentmodule, Backup-Registry, Session-/Timercontroller, Resume-/Privacy-Guards, `party-hub-a11y.js` sowie Manifest/PWA-Icons.

Reale Installation, Upgrade älterer Versionen, Rollback und Offline-Gerätetest bleiben offen.

## Release Evidence

- `release-evidence.json`: **PREPARED / NO_GO**
- `operator-release.json`: **PREPARED / BLOCKED**

Ein `GO` benötigt echte Belege auf exakt demselben unveränderten RC-Commit.

## Assets / Third Party

- technisches Asset-Provenienzmanifest vorhanden
- PNG-Dimensionen/Hashes/Ableitungen dokumentiert
- `ASSET_RIGHTS_SIGNOFF.md` vorhanden
- `icon.svg` und PNG-Ableitungen bleiben bis menschlicher Rechtebestätigung `unresolved`

Daher bleibt `ASSETS / THIRD PARTY` blockiert.

## CI – P0

Der zuletzt ausdrücklich untersuchte aktuelle-Branch-Lauf war **Run #2575**, Job `97682633520`.

- `failure`
- keine ausführbaren Workflow-Schritte sichtbar
- separate Step-Abfrage `steps: []`
- Joblogs nicht vorhanden
- kein Checkout / kein npm / keine Tests / kein Repository-Code ausgeführt

Der frühere Minimal-Runner-Probe ohne Checkout, Setup-Actions, npm, Playwright oder Repository-Code endete ebenfalls vor Step 1 mit `steps: []`.

Damit liegt der verbleibende Prüfbereich vor der Step-Ausführung: Hosted-Runner-Zuteilung, Actions-/Account-/Billing-/Budget-/Policyzustand oder GitHub-seitige Runner-Störung.

Details: Issue #7 und `CI_TROUBLESHOOTING.md`.

## Branch Protection

`BRANCH_PROTECTION.md` und Contract-Audit existieren. Gewünschter Required Check: **`Secret Circle CI / validate`**. Die tatsächliche GitHub-Einstellung ist weiterhin nicht real bestätigt.

## HTTPS / Environment

- v46 in Architektur/Deployment/Environment/Privacy synchronisiert
- `HOSTING_DECISION.md` erwartet v46-Smokes
- konkrete Provider-, Staging- und Production-Entscheidung offen
- `scripts/staging_smoke.py` vorbereitet

## Drei zentrale offene GitHub-Blocker

1. **Issue #7** – GitHub Actions / Hosted Runner vor Step 1
2. **Issue #8** – reale Geräte, Offline-PWA, Accessibility und Partytests
3. **Issue #14** – Operator, Hosting, Legal, Support und Incident Evidence

Zusätzlich bleibt die Icon-Rechtebasis offen.

## Real offene Releasegates

1. Actions-Runner / echte Steps
2. Online-`npm ci` + vollständiges CI/Cross-Browser
3. Branch Protection tatsächlich aktiv
4. Hostingprovider + getrennte HTTPS-Staging-/Production-Origin
5. HTTPS-Staging + automatisierter/manueller v46-PWA-Smoke
6. PWA v46 Upgrade/Rollback auf real installierten Versionen
7. Android / iPhone / Tablet
8. VoiceOver / TalkBack / reale Tastatur-/Modalfokus-/200-%-Zoom-Abnahme
9. reale Gruppen/Beta für alle 15 Core-Spiele
10. Icon-Rechtebasis + finaler Visual-/Third-Party-Sign-off
11. Operator-/Privacy-/Support-/Legalangaben final
12. Support-/Securitytest + SEV-1-/Rollback-Drill
13. unveränderter RC + Release Evidence FINAL/GO

## Releaseentscheidung

- öffentlicher Release: **NO_GO**
- PR #13 mergen: **Nein**
- PR #13 bleibt Draft: **Ja**
