# Secret Circle Party Hub

Secret Circle ist eine **offline-first Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät**. Der Januar-2027-Release priorisiert sichere private Übergaben, Wiederaufnahme nach Unterbrechungen, lokale Datenkontrolle, Accessibility und belastbare Release-Gates.

## Aktueller Umfang

- 45 technisch spielbare Built-ins
- 15 Core / 13 Extended / 17 Labs
- 27 Quick-/Trend-/Viral-Modi
- 4 Advanced-Kernspiele
- Word Imposter + Smart Party Night
- lokaler Spielerpool, Favoriten, Presets, Verlauf, Statistiken und Erfolge
- lokaler No-Code-Game-Creator
- Offline-PWA ohne Pflichtkonto, Tracking, Werbung oder Cloudzwang

**Technisch spielbar ist nicht automatisch releasefertig.**

## Releaseziel

- funktionsfertig: 30. November 2026
- Code Freeze: 5. Dezember 2026
- RC: 15. Dezember 2026
- öffentlicher Release: 4.–15. Januar 2027

Aktueller Offline-Core: **`secret-circle-v49` / `secret-circle-v49-staging`**  
Classic Content: **v4**  
Core Source Review: **15/15 PREPARED**  
Core Source Hardening: **15/15 PREPARED**  
Accessibility Source Hardening: **PREPARED**  
Word-Imposter Data/Resume Hardening: **PREPARED**  
Hub Resume Guard v2: **PREPARED**  
Operator / Hosting / Legal: **PREPARED / BLOCKED**  
Freigabe: **NO_GO**

## Core-Hardening

Der vollständige 15-Core-Codepfad wurde auf Setup, Geheimhaltung, Resume, Timer, Punkte und Anfänger-UX geprüft. Details: `CORE_GAME_ACCEPTANCE.md`.

Wichtige Verträge: Word-Imposter-Setup/Fairness/Voting/Resume, freiwillige Social-Games, Paranoia-/Scharade-/Tabu-Privacy, Heiße-Kartoffel-Timer 10–25 s, Wortketten-/Wrong-Answers-Regeln sowie Advanced Resume/Privacy inklusive Mafia-Integrität.

## Word-Imposter Data/Resume Hardening – v48

- Voting bestimmt den nächsten **noch offenen** Wähler aus den tatsächlichen Vote-Keys statt aus der Stimmenanzahl.
- Der strengere Resume-Guard verwirft weiterhin nicht-sequenzielle manipulierte Voting-Snapshots.
- Maximal **50 eigene Kategorien** und **200 Begriffe je Kategorie**.
- 51 Kategorien beziehungsweise 201 Begriffe werden abgelehnt statt still gekürzt.
- Backupgrenze: **1,5 MB UTF-8**.
- Abgelehnte Imports verändern vorhandene lokale Daten nicht.
- Die UI erklärt die Grenzen sichtbar.
- `tests/storage.test.js` und `tests/word-imposter-data-contract.test.js` schützen diese Verträge.

Diese v48-Verträge bleiben Bestandteil des aktuellen v49-Offline-Core. **PREPARED bedeutet hier Source-Hardening, nicht Runner-PASS.**

## Accessibility-Hardening – v46/v47

**v46** führte `party-hub-a11y.js` für den direkten Hub ein: Bereichsfokus, modale Hub-Kontexte, `inert`-Hintergrund, Tab-Fokus-Trap und Rückkehrfokus.

**v47** erweiterte den Qualitätsanspruch über `secondary-surface-a11y.js` auf Advanced, Quick und Creator: Advanced-Modal, Quick-Fokus-Recovery, Creator-Wizard-Fokus, Hilfe-Modal und Template-Radiogroup mit Pfeiltasten/Home/End.

Beide A11y-Schichten bleiben Bestandteil des aktuellen v49-Offline-Core. **Noch kein Accessibility PASS:** VoiceOver, TalkBack, reales 200-%-Zoom, Touchbedienung und echte Geräte-/Browserabnahme bleiben offen.

## Zentrale A-bis-Z-Verträge

`APP_ENTWICKLUNG_VON_A_BIS_Z.md`, `APP_DEVELOPMENT_STATUS.md`, `CORE_GAME_ACCEPTANCE.md`, `ACCESSIBILITY.md`, `ARCHITECTURE.md`, `RELEASE_STATUS.md`, `RELEASE_CHECKLIST.md`, `RELEASE_EVIDENCE.md`, `release-evidence.json`, `operator-release.json`, `OPERATOR_RELEASE_SIGNOFF.md`, `OPERATOR_EVIDENCE_LOG.md`, `HOSTING_DECISION.md`, `BRANCH_PROTECTION.md`, `CI_TROUBLESHOOTING.md`, `ENVIRONMENTS.md`, `DEPLOYMENT.md`, `SECURITY.md`, `THREAT_MODEL.md`, `BETA_TEST_PLAN.md`, `MANUAL_TEST_PLAN.md`, `LEGAL_CHECKLIST.md`, `SUPPORT.md`, `INCIDENT_RESPONSE.md` und `MAINTENANCE.md`.

## Operator / Hosting / Legal

Der reale Betriebs-/Legalblock bleibt als eigener Releasevertrag modelliert. `operator-release.json` steht bewusst auf `PREPARED / BLOCKED`; Issue #14 führt die real offenen Provider-, Betreiber-, Kontakt-, Privacy-, Support- und Incident-Schritte.

## Build / Supply Chain

- `package-lock.json` v3
- Playwright-Testkette exakt 1.54.2
- keine npm-Runtime-Dependencies
- CI/Cross-Browser verwenden `npm ci`
- Lockfile-, Architektur-, Hub-A11y-, Secondary-A11y-, Word-Imposter-Daten-, Operator- und Release-Readiness-Verträge sind eingebunden

## CI – extern blockiert

Letzter vollständig untersuchter App-Actions-Lauf auf dem damaligen v48-Stand: **Run #2715**.

- Run ID `32850361668`
- Job `validate`, Job ID `97809595781`
- Head `9f87910567a60e5ce905ced42bb62201b3e3a85d`
- `failure`
- `steps: null` / separate Step-Abfrage `steps: []`
- kein Checkout, npm, Test oder Repositorycode ausgeführt

Ein früherer Minimal-Runner-Probe ohne Checkout/Setup/npm/Playwright zeigte dasselbe Muster. Die unmittelbare Fehlerfläche liegt weiterhin vor der Repository-Ausführung: Hosted-Runner-Zuteilung, Actions-/Account-/Billing-/Budget-/Policyzustand oder GitHub-seitige Runner-Störung. Für v49 existiert noch kein echter Runner-PASS. Details: `CI_TROUBLESHOOTING.md` und Issue #7.

## Offline / PWA – v49

Der Service Worker verwendet:

- `secret-circle-v49`
- `secret-circle-v49-staging`

Zum Offline-Core gehören Hub, Word Imposter, Advanced, Quick, Creator, Privacy, Katalog-/Contentmodule, Backup-Registry, Timer-/Sessioncontroller, Resume-/Privacy-Guards, beide A11y-Schichten sowie die aktuellen Word-Imposter-UI-/Store-Dateien und Manifest/App-Icons. Der direkte Hub nutzt den getesteten `party-hub-resume-guard.js` als zentrale Resume-Integritätsquelle.

Updates werden staged und erst nach bewusster Nutzerentscheidung aktiviert. Reale PWA-Upgrades, Rollbacks und Gerätetests bleiben offen.

## Assets / Rechte

Die technische Icon-Provenienz ist dokumentiert; die Rechtebasis des Root-`icon.svg` bleibt `unresolved`. `ASSET_RIGHTS_SIGNOFF.md` definiert den menschlichen Nachweis. Bis dahin bleibt `ASSETS / THIRD PARTY` blockiert.

## Release Evidence

`release-evidence.json` bleibt absichtlich `PREPARED / NO_GO`.  
`operator-release.json` bleibt absichtlich `PREPARED / BLOCKED`.

Ein späteres `GO` erfordert echte Belege auf **demselben unveränderten RC-Commit**.

## Drei zentrale offene Issues

1. **#7** – GitHub Actions / Hosted Runner endet vor Step 1
2. **#8** – reale Geräte, v49 Offline-PWA, Accessibility, Word-Imposter-Datengrenzen, Hub-Resume-v2 und Partytests
3. **#14** – Operator, Hosting, Legal, Support und Incident Evidence

Zusätzlich bleibt die Icon-Rechtebasis offen.

## Aktuell höchste Priorität

1. Hosted Runner bis zum ersten echten Step reparieren
2. Online-`npm ci` + vollständiges CI/Cross-Browser
3. Branch Protection real bestätigen
4. Provider + echte HTTPS-Staging-/Production-Origin
5. v49 Staging-/PWA-Smoke, Upgrade und Rollback
6. Word-Imposter-v48-Datengrenzen + Hub-Resume-v2 real ausführen
7. reale Android/iPhone/iPad-/VoiceOver-/TalkBack-/Tastatur-/Zoom-Abnahme
8. reale Gruppentests für alle 15 Core-Games
9. Icon-/Third-Party- und Operator-/Legal-/Support-/Incident-Sign-off
10. unveränderlicher RC + vollständige Release Evidence

**Aktuell: NO_GO. PR #13 bleibt Draft und wird nicht gemergt.**