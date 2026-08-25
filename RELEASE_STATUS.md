# Release-Status – Secret Circle

Stand: 25. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13

## Gesamtstatus

**Phase:** Release-Härtung  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v45` / `secret-circle-v45-staging`**  
**Classic Content:** **v4**  
**Core Source Review:** **15/15 PREPARED**  
**Core Source Hardening:** **15/15 PREPARED**  
**Operator / Hosting / Legal:** **PREPARED / BLOCKED**

v45 ist die korrekte Cachegeneration nach dem vollständigen Core-Hardening. Die neuen Resume-/Privacy-Guards sind explizit Bestandteil des Offline-Core; v44 wird nicht für veränderte Offline-Inhalte wiederverwendet.

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

## Operator / Hosting / Legal / Support

Neu zentralisiert:

- `operator-release.json` – maschinenlesbare Operator-Akte, aktuell `PREPARED / BLOCKED`
- `OPERATOR_RELEASE_SIGNOFF.md`
- `HOSTING_DECISION.md`
- `scripts/operator_release_contract_audit.py` in `npm run validate`
- `LEGAL_CHECKLIST.md` auf Stand 25. August 2026
- `SUPPORT.md` und `INCIDENT_RESPONSE.md` an dieselbe Operator-Akte gebunden
- Issue #14 führt die real offenen Betreiber-/Hosting-/Legal-/Support-/Incident-Schritte

`legalPrivacy` und `supportIncident` dürfen in `release-evidence.json` erst PASS werden, wenn `operator-release.json = FINAL / READY` und reale Nachweise existieren.

## Build / Supply Chain

- `package-lock.json` v3
- Playwright-Testkette exakt 1.54.2
- keine npm-Runtime-Dependencies
- feste Registry-/Integrity-Verträge
- CI/Cross-Browser verwenden `npm ci`
- Lockfile-/Operator-/Readiness-Audits in `npm run validate`

**Offen:** echter Online-`npm ci`-/Integrity-PASS auf funktionierendem Runner.

## PWA v45

Service Worker:

- `secret-circle-v45`
- `secret-circle-v45-staging`

Offline enthalten sind unter anderem fünf Einstiegspfade, Katalog-/Contentmodule, Backup-Registry, Session-/Timercontroller, Resume-/Privacy-Guards sowie Manifest/PWA-Icons.

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

Aktuellster bestätigter App-CI-Befund:

- Run **#2565**
- Run ID `32808084307`
- Job ID `97681972379`
- Head `668c65fce0233553fb2013631be2abe6cfd2f2a4`
- `failure`
- Jobliste `steps: null`
- Step-Abfrage `steps: []`
- Joblogs nicht vorhanden
- kein Checkout / kein npm / keine Tests / kein Repository-Code ausgeführt

Der frühere Minimal-Runner-Probe ohne Checkout, Setup-Actions, npm, Playwright oder Repository-Code endete ebenfalls vor Step 1 mit `steps: []`.

Damit liegt der verbleibende Prüfbereich vor der Step-Ausführung: Hosted-Runner-Zuteilung, Actions-/Account-/Billing-/Budget-/Policyzustand oder GitHub-seitige Runner-Störung.

Details: Issue #7 und `CI_TROUBLESHOOTING.md`.

## Branch Protection

`BRANCH_PROTECTION.md` und Contract-Audit existieren. Gewünschter Required Check: **`Secret Circle CI / validate`**. Die tatsächliche GitHub-Einstellung ist weiterhin nicht real bestätigt.

## HTTPS / Environment

- v45-Vertrag in Architektur/Deployment/Environment/Privacy synchronisiert
- `HOSTING_DECISION.md` vorbereitet
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
5. HTTPS-Staging + automatisierter/manueller PWA-Smoke
6. PWA v45 Upgrade/Rollback auf real installierten Versionen
7. Android / iPhone / Tablet
8. VoiceOver / TalkBack / Tastatur / 200-%-Zoom
9. reale Gruppen/Beta für alle 15 Core-Spiele
10. Icon-Rechtebasis + finaler Visual-/Third-Party-Sign-off
11. Operator-/Privacy-/Support-/Legalangaben final
12. Support-/Securitytest + SEV-1-/Rollback-Drill
13. unveränderter RC + Release Evidence FINAL/GO

## Releaseentscheidung

- öffentlicher Release: **NO_GO**
- PR #13 mergen: **Nein**
- PR #13 bleibt Draft: **Ja**
