# Release-Status – Secret Circle

Stand: 23. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13

## Gesamtstatus

**Phase:** Release-Härtung  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v44`**  
**Classic Content:** **v4**  
**Core Source Hardening:** **15/15 PREPARED**

Die technische Grundlage ist weit fortgeschritten. Core-Content, Exact-once-Sessions, sichere Resume-/Timerpfade, Live-Privacy-Guards, Registry-v2-Backups, source-level Privacy-/Reference-Schutz, PWA-Assets, Lockfile/npm-ci-Vertrag, Branch-Protection-Vertrag, HTTPS-Smoke und Accessibility-Basis sind vorbereitet.

`PREPARED` ist ausdrücklich kein `RELEASE PASS`: CI, reale Geräte, Accessibility, Gruppen-/Beta-Tests und finale Rechte-/Legal-Evidence fehlen weiterhin.

## Core-Hardening – 15/15

Der vollständige Core-Codepfad wurde am 23. August nochmals auf Setup, Privacy, Resume, Timer, Punkte und Anfänger-UX geprüft.

Wichtige Änderungen:

- Word Imposter: Setup-Validierung, Rollenfairness, Voting-/Resume-Guard, Geheimkarten-Schutz
- Truth/Dare, Never Have, Most Likely, Would Rather: sichtbare Live-Regeln und Freiwilligkeit, wo relevant
- Paranoia: offene Geheimfrage wird bei Fokusverlust verdeckt
- Scharade/Tabu: offene Geheimkarten werden bei App-/Tab-Wechsel verdeckt
- Heiße Kartoffel: Zufallstimer exakt 10–25 Sekunden
- Wortkette: klarer manueller Erfolgsvertrag
- Nur falsche Antworten: klare manuelle Verlustregel; weiterhin bewusst scorelos
- Hub-Resume: Timerzustand muss zur aktiven Spielart passen
- Advanced Core: `advanced-privacy-guard.js` + `advanced-resume-guard.js`
- Advanced-Resume validiert Two-Truths-Ergebnis, Question-Imposter-Rolle/Vote, Location-Spy-Zustand sowie Mafia-Rollenanzahl, Alive-Menge und Siegerintegrität

Details: `CORE_GAME_ACCEPTANCE.md`.

## Build / Supply Chain

- `package-lock.json` v3 vorhanden
- `@playwright/test`, `playwright`, `playwright-core` exakt 1.54.2
- optional `fsevents` 2.3.2
- Registry-URLs + `sha512`-Integrities
- keine npm-Runtime-Dependencies
- normaler CI und Cross-Browser verwenden `npm ci`
- `scripts/lockfile_contract_audit.py` in `npm run validate`

**Offen:** echter Online-`npm ci`-/Integrity-PASS auf einem funktionierenden Runner.

## PWA v44

Hub, Word Imposter, Creator, Advanced und Quick besitzen denselben Installations-Head-Vertrag:

- Manifest-Link
- Mobile-/Apple-Web-App-Metadaten
- Apple Statusbar + App-Titel
- SVG-Favicon
- 192×192-PNG-Favicon
- Apple-Touch-Icon
- CSP `manifest-src 'self'`

Die neuen Resume-/Privacy-Guards sind Bestandteil des Offline-Core. `tests/pwa-head-metadata.test.js` schützt den lokalen Source-Vertrag. `scripts/staging_smoke.py` prüft denselben Vertrag später gegen tatsächlich ausgelieferte HTTPS-Seiten.

## Release Evidence

Vorhanden:

- `release-evidence.json`
- `RELEASE_EVIDENCE.md`
- `scripts/release_evidence_audit.py`

Die Evidence-Akte ist aktuell absichtlich **PREPARED / NO_GO**. Ein späteres `GO` benötigt 15 Pflichtgates mit echten Belegen auf exakt demselben unveränderten RC-Commit.

## Content / Privacy / Reference

- quantitative Ziele aller 15 Core-Games erreicht
- 15/15 erster Core-Quellpass dokumentiert
- 15/15 Core-Hardening dokumentiert
- frühere Private-Device-Truth/Dare-Prompts entfernt
- `scripts/privacy_content_audit.py` scannt ausgelieferte Contentquellen
- konkrete Anime-/unnötige Marken-/Eventreferenzen source-level generisch ersetzt
- `scripts/reference_content_audit.py` scannt ausgelieferte Contentquellen

Manueller finaler Extended/Labs-/Marketing-/Visual-/Rechtepass bleibt offen.

## Security / Backup / Resume

Registry v2 ist zentrale Complete-Backup-Vertragsquelle. Unbekannte Namespaces werden beim Import abgelehnt.

Zusätzlich:

- Word-Imposter-Resume-Guard
- direkter Hub-Resume-Integritätsvertrag
- Advanced-Resume-Guard
- Advanced-Live-Privacy-Guard

Status: **CLOSED/PREPARED IN CODE / REAL VERIFICATION OPEN**.

## Branch Protection

`BRANCH_PROTECTION.md` und Contract-Audit sind vorhanden. Gewünschter Required Check: **`Secret Circle CI / validate`**. Die tatsächliche GitHub-Einstellung ist weiterhin nicht bestätigt.

## CI – P0

Aktuellster vollständig geprüfter App-CI-Befund: **Run #2401** auf Head `a9f2591a5280ec67b9042df8ff636019c7c6149a`.

- Run ID `32650097844`
- Job ID `97220210755`
- `failure`
- `steps: []`
- kein Checkout
- kein Node-/Python-Setup
- kein Online-`npm ci`
- keine Unit-/Audit-/Playwright-Ausführung
- kein Repository-Code ausgeführt

Zusätzlich wurde ein temporärer **Runner Probe** ausgeführt, der nur einen lokalen Bash-Schritt (`echo` + `uname -a`) enthielt – ohne Checkout, Setup-Actions, npm, Playwright oder Repository-Code. Auch dieser Probe-Job endete mit `steps: []`.

Damit sind Repositorycode, npm und die verwendeten Actions als unmittelbare Ursache des aktuellen Pre-Step-Fehlers ausgeschlossen. Der verbleibende Prüfbereich liegt bei Hosted-Runner-Zuteilung, Account-/Billing-/Budgetzustand oder GitHub-/Policy-Sperren.

Neuere Hardening-Commits besitzen weiterhin keine erfolgreiche Runner-Evidence. Details: `CI_TROUBLESHOOTING.md` und Issue #7.

## PWA / Staging

- `secret-circle-v44`
- `secret-circle-v44-staging`
- staged update / bewusste Nutzeraktivierung
- `scripts/staging_smoke.py` für echtes HTTPS-Staging/Production vorbereitet

Offen: konkrete Staging-/Production-Origin, reale Altversion→v44-Upgrades, Rollback, Service-Worker-/Offline-/Installationsprüfung auf realen Geräten.

## Real offene Releasegates

1. Actions-Runner / echte Steps
2. Online-`npm ci` + vollständiges CI/Cross-Browser
3. Branch Protection tatsächlich aktiv
4. HTTPS-Staging + automatisierter und manueller PWA-Smoke
5. PWA Upgrade/Rollback auf real installierten Versionen
6. Android / iPhone / Tablet
7. VoiceOver / TalkBack / Tastatur / 200-%-Zoom
8. reale Gruppen/Beta für alle 15 Core-Spiele
9. Root-`icon.svg`-Rechtebasis
10. finaler Visual-/Content-/Third-Party-Sign-off
11. Betreiber-/Hosting-/Privacy-/Support-/Legalangaben
12. Incident-Drill
13. unveränderter RC + Release Evidence FINAL/GO

## Releaseentscheidung

- öffentlicher Release: **NO_GO**
- PR #13 mergen: **Nein**
- PR #13 bleibt Draft: **Ja**
