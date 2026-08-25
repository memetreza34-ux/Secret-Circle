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

Aktueller Offline-Core: **`secret-circle-v47` / `secret-circle-v47-staging`**  
Classic Content: **v4**  
Core Source Review: **15/15 PREPARED**  
Core Source Hardening: **15/15 PREPARED**  
Accessibility Source Hardening: **PREPARED**  
Operator / Hosting / Legal: **PREPARED / BLOCKED**  
Freigabe: **NO_GO**

## Core-Hardening

Der vollständige 15-Core-Codepfad wurde auf Setup, Geheimhaltung, Resume, Timer, Punkte und Anfänger-UX geprüft. Details: `CORE_GAME_ACCEPTANCE.md`.

Wichtige Verträge: Word-Imposter-Setup/Fairness/Voting/Resume, freiwillige Social-Games, Paranoia-/Scharade-/Tabu-Privacy, Heiße-Kartoffel-Timer 10–25 s, Wortketten-/Wrong-Answers-Regeln sowie Advanced Resume/Privacy inklusive Mafia-Integrität.

## Accessibility-Hardening – v46/v47

**v46** führte `party-hub-a11y.js` für den direkten Hub ein:

- Bereichswechsel fokussieren die sichtbare Hauptüberschrift
- Spieldetail und aktive Hub-Runde sind modale Tastaturkontexte
- Hintergrund wird über `inert` isoliert
- Tab/Shift+Tab bleibt im aktiven Overlay
- Rückkehrfokus nach Schließen des Spieldetails

**v47** erweitert denselben Qualitätsanspruch auf Advanced, Quick und Creator über `secondary-surface-a11y.js`:

- Advanced-Spieloverlay als modaler Fokuskontext
- Quick-Fokus-Recovery nach dynamischen Phasenwechseln
- Creator-Wizard-Schrittüberschriften tatsächlich programmatisch fokussierbar
- Creator-Hilfe mit Hintergrundisolation, Fokus-Trap und Rückkehrfokus
- Creator-Template-Radiogroup mit roving `tabindex`, Pfeiltasten, Home und End
- neue Unit-/Playwright-Verträge sowie `scripts/secondary_surface_a11y_contract_audit.py`
- beide A11y-Schichten sind im v47-Offline-Core enthalten

**Noch kein Accessibility PASS:** VoiceOver, TalkBack, reales 200-%-Zoom, Touchbedienung und echte Geräte-/Browserabnahme bleiben offen.

## Zentrale A-bis-Z-Verträge

`APP_ENTWICKLUNG_VON_A_BIS_Z.md`, `APP_DEVELOPMENT_STATUS.md`, `CORE_GAME_ACCEPTANCE.md`, `ACCESSIBILITY.md`, `ARCHITECTURE.md`, `RELEASE_STATUS.md`, `RELEASE_CHECKLIST.md`, `RELEASE_EVIDENCE.md`, `release-evidence.json`, `operator-release.json`, `OPERATOR_RELEASE_SIGNOFF.md`, `HOSTING_DECISION.md`, `BRANCH_PROTECTION.md`, `CI_TROUBLESHOOTING.md`, `ENVIRONMENTS.md`, `DEPLOYMENT.md`, `SECURITY.md`, `THREAT_MODEL.md`, `BETA_TEST_PLAN.md`, `MANUAL_TEST_PLAN.md`, `LEGAL_CHECKLIST.md`, `SUPPORT.md`, `INCIDENT_RESPONSE.md` und `MAINTENANCE.md`.

## Operator / Hosting / Legal

Der reale Betriebs-/Legalblock ist als eigener Releasevertrag modelliert:

- `operator-release.json` startet bewusst mit `PREPARED / BLOCKED`
- `OPERATOR_RELEASE_SIGNOFF.md` bündelt Betreiber-/Legal-/Support-/Incident-Freigaben
- `HOSTING_DECISION.md` erzwingt Provider-, Log-, Datenschutz-, Staging-/Production- und Rollbackprüfung
- `scripts/operator_release_contract_audit.py` läuft in `npm run validate`
- Issue #14 führt die real offenen Operator-/Hosting-/Legal-/Support-/Incident-Schritte

## Build / Supply Chain

- `package-lock.json` v3
- Playwright-Testkette exakt 1.54.2
- keine npm-Runtime-Dependencies
- CI/Cross-Browser verwenden `npm ci`
- Lockfile-, Architektur-, Hub-A11y-, Secondary-A11y-, Operator- und Release-Readiness-Audits sind in den Qualitätsgates eingebunden

## CI – extern blockiert

Der jüngste ausdrücklich untersuchte Lauf vor dem v47-Block war **Run #2637**. Er endete erneut vor Step 1 mit `steps: []`; kein Checkout, npm, Test oder Repositorycode wurde ausgeführt. Ein früherer Minimal-Runner-Probe ohne Checkout/Setup/npm/Playwright zeigte dasselbe Muster.

Damit liegt die unmittelbare Fehlerfläche weiterhin vor der Repository-Ausführung: Hosted-Runner-Zuteilung, Actions-/Account-/Billing-/Budget-/Policyzustand oder GitHub-seitige Runner-Störung. Details: `CI_TROUBLESHOOTING.md` und Issue #7.

## Offline / PWA – v47

Der Service Worker verwendet:

- `secret-circle-v47`
- `secret-circle-v47-staging`

Zum Offline-Core gehören Hub, Word Imposter, Advanced, Quick, Creator, Privacy, Katalog-/Contentmodule, Backup-Registry, Timer-/Sessioncontroller, Resume-/Privacy-Guards, `party-hub-a11y.js`, `secondary-surface-a11y.js` sowie Manifest/App-Icons.

Updates werden staged und erst nach bewusster Nutzerentscheidung aktiviert. Reale PWA-Upgrades, Rollbacks und Gerätetests bleiben offen.

## Assets / Rechte

Die technische Icon-Provenienz ist dokumentiert; die Rechtebasis des Root-`icon.svg` bleibt `unresolved`. `ASSET_RIGHTS_SIGNOFF.md` definiert den menschlichen Nachweis. Bis dahin bleibt `ASSETS / THIRD PARTY` blockiert.

## Release Evidence

`release-evidence.json` bleibt absichtlich `PREPARED / NO_GO`.  
`operator-release.json` bleibt absichtlich `PREPARED / BLOCKED`.

Ein späteres `GO` erfordert echte Belege auf **demselben unveränderten RC-Commit**.

## Drei zentrale offene Issues

1. **#7** – GitHub Actions / Hosted Runner endet vor Step 1
2. **#8** – reale Geräte, Offline-PWA, Accessibility und Partytests auf v47
3. **#14** – Operator, Hosting, Legal, Support und Incident Evidence

Zusätzlich bleibt die Icon-Rechtebasis offen.

## Aktuell höchste Priorität

1. Hosted Runner bis zum ersten echten Step reparieren
2. Online-`npm ci` + vollständiges CI/Cross-Browser
3. Branch Protection real bestätigen
4. Provider + echte HTTPS-Staging-/Production-Origin
5. v47 Staging-/PWA-Smoke, Upgrade und Rollback
6. reale Android/iPhone/iPad-/VoiceOver-/TalkBack-/Tastatur-/Zoom-Abnahme
7. reale Gruppentests für alle 15 Core-Games
8. Icon-/Third-Party- und Operator-/Legal-/Support-/Incident-Sign-off
9. unveränderlicher RC + vollständige Release Evidence

**Aktuell: NO_GO. PR #13 bleibt Draft und wird nicht gemergt.**
