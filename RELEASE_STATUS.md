# Release-Status – Secret Circle

Stand: 23. August 2026  
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

v45 ist die korrekte Cachegeneration nach dem vollständigen Core-Hardening. Die neuen Resume-/Privacy-Guards sind damit explizit Bestandteil des Offline-Core; v44 wird nicht für veränderte Offline-Inhalte wiederverwendet.

## Core-Hardening – 15/15

- Word Imposter: Setup-Validierung, Rollenfairness, Voting-/Resume-Guard, Geheimkarten-Schutz
- Truth/Dare, Never Have, Most Likely, Would Rather: sichtbare Live-Regeln und Freiwilligkeit, wo relevant
- Paranoia: offene Geheimfrage wird bei Fokusverlust verdeckt
- Scharade/Tabu: offene Geheimkarten werden bei App-/Tab-Wechsel verdeckt
- Heiße Kartoffel: Zufallstimer exakt 10–25 Sekunden
- Wortkette: klarer manueller Erfolgsvertrag
- Nur falsche Antworten: klare manuelle Verlustregel; scorelos
- Hub-Resume: Timerzustand muss zur Spielart passen
- Advanced: `advanced-privacy-guard.js` + `advanced-resume-guard.js`
- Advanced-Resume validiert Two-Truths-Ergebnis, Question-Imposter-Rolle/Vote, Location-Spy-Zustand sowie Mafia-Rollenanzahl, Alive-Menge und Siegerintegrität

Details: `CORE_GAME_ACCEPTANCE.md`.

## Build / Supply Chain

- `package-lock.json` v3
- Playwright-Testkette exakt 1.54.2
- keine npm-Runtime-Dependencies
- feste Registry-/Integrity-Verträge
- CI/Cross-Browser verwenden `npm ci`
- Lockfile-Audit in `npm run validate`

**Offen:** echter Online-`npm ci`-/Integrity-PASS auf funktionierendem Runner.

## PWA v45

Service Worker:

- `secret-circle-v45`
- `secret-circle-v45-staging`

Offline enthalten sind unter anderem:

- fünf interaktive Einstiegspfade
- Katalog-/Contentmodule
- Backup-Registry
- Session-/Timercontroller
- `word-imposter-resume-guard.js`
- `party-hub-resume-guard.js`
- `advanced-resume-guard.js`
- `advanced-privacy-guard.js`
- Manifest und PWA-Icons

Reale Installation, Upgrade älterer Versionen, Rollback und Offline-Gerätetest bleiben offen.

## Release Evidence

`release-evidence.json` bleibt absichtlich **PREPARED / NO_GO**. Ein `GO` benötigt echte Belege auf exakt demselben unveränderten RC-Commit.

## Content / Privacy / Reference

- quantitative Ziele aller 15 Core-Games erreicht
- 15/15 erster Core-Quellpass dokumentiert
- 15/15 Core-Hardening dokumentiert
- frühere Private-Device-Prompts entfernt
- Privacy-/Reference-Audits integriert
- konkrete unnötige Marken-/Fan-/Eventreferenzen generisch ersetzt

Manueller Extended/Labs-/Marketing-/Visual-/Rechtepass bleibt offen.

## Assets / Third Party

- technisches Asset-Provenienzmanifest vorhanden
- PNG-Dimensionen/Hashes/Ableitungen dokumentiert
- `ASSET_RIGHTS_SIGNOFF.md` neu vorhanden
- `icon.svg` und PNG-Ableitungen bleiben bis menschlicher Rechtebestätigung `unresolved`

Daher bleibt `ASSETS / THIRD PARTY` blockiert.

## CI – P0

Aktuellster vollständig geprüfter App-CI-Befund:

- Run #2401
- Run ID `32650097844`
- Job ID `97220210755`
- Head `a9f2591a5280ec67b9042df8ff636019c7c6149a`
- `failure`
- `steps: []`
- kein Checkout / kein npm / keine Tests / kein Repository-Code ausgeführt

Ein zusätzlicher Minimal-Runner-Probe ohne Checkout, Setup-Actions, npm, Playwright oder Repository-Code endete ebenfalls vor Step 1 mit `steps: []`.

Damit ist der verbleibende Prüfbereich vor der Step-Ausführung: Hosted-Runner-Zuteilung, GitHub-Actions-/Account-/Billing-/Budget-/Policyzustand oder GitHub-seitige Runner-Störung.

Details: Issue #7 und `CI_TROUBLESHOOTING.md`.

## Branch Protection

`BRANCH_PROTECTION.md` und Contract-Audit existieren. Gewünschter Required Check: **`Secret Circle CI / validate`**. Die tatsächliche GitHub-Einstellung ist über die verfügbaren Repo-Aktionen weiterhin nicht bestätigt.

## HTTPS / Environment

- v45-Vertrag in `ARCHITECTURE.md`, `DEPLOYMENT.md`, `ENVIRONMENTS.md` und `privacy.html` synchronisiert
- konkrete Staging-/Production-Origin weiterhin offen
- `scripts/staging_smoke.py` vorbereitet

## Real offene Releasegates

1. Actions-Runner / echte Steps
2. Online-`npm ci` + vollständiges CI/Cross-Browser
3. Branch Protection tatsächlich aktiv
4. HTTPS-Staging + automatisierter/manueller PWA-Smoke
5. PWA v45 Upgrade/Rollback auf real installierten Versionen
6. Android / iPhone / Tablet
7. VoiceOver / TalkBack / Tastatur / 200-%-Zoom
8. reale Gruppen/Beta für alle 15 Core-Spiele
9. Icon-Rechtebasis + finaler Visual-/Third-Party-Sign-off
10. Betreiber-/Hosting-/Privacy-/Support-/Legalangaben
11. Incident-Drill
12. unveränderter RC + Release Evidence FINAL/GO

## Releaseentscheidung

- öffentlicher Release: **NO_GO**
- PR #13 mergen: **Nein**
- PR #13 bleibt Draft: **Ja**
