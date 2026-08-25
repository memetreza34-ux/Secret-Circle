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

Aktueller Offline-Core: **`secret-circle-v46` / `secret-circle-v46-staging`**  
Classic Content: **v4**  
Core Source Review: **15/15 PREPARED**  
Core Source Hardening: **15/15 PREPARED**  
Accessibility Source Hardening: **PREPARED**  
Operator / Hosting / Legal: **PREPARED / BLOCKED**  
Freigabe: **NO_GO**

## Core-Hardening

Der vollständige 15-Core-Codepfad wurde auf Setup, Geheimhaltung, Resume, Timer, Punkte und Anfänger-UX geprüft.

Wichtige Verträge:

- Word Imposter: Setup-Grenzen, Rollenfairness, Voting-/Resume-Integrität
- persönliche Hub-Games: sichtbare Freiwilligkeit/Skip-Regel
- Paranoia: Geheimfrage bei Fokusverlust verdeckt
- Scharade/Tabu: Geheimkarte bei Fokusverlust verdeckt
- Heiße Kartoffel: Zufallstimer exakt 10–25 Sekunden
- Wortkette: klarer manueller Erfolgsvertrag
- Nur falsche Antworten: klare manuelle Verlustregel, bewusst scorelos
- direkter Hub: Timerzustand muss zur Spielart passen
- Advanced: `advanced-resume-guard.js` + `advanced-privacy-guard.js`
- Mafia-Resume: Rollenanzahl, Alive-Menge und Sieger müssen konsistent sein

Details: `CORE_GAME_ACCEPTANCE.md`.

## Accessibility-Hardening – v46

Der Party Hub besitzt jetzt zusätzlich:

- `party-hub-a11y.js` als eigene kleine Accessibility-Schicht
- programmatischen Fokus auf die sichtbare Hauptüberschrift nach Hub-Bereichswechseln
- `role="dialog"` + `aria-modal="true"` für die aktive Hub-Spielrunde
- `inert`-Isolation des Hintergrunds bei Spieldetail und aktiver Spielrunde
- Tab-/Shift+Tab-Fokus-Trap innerhalb des aktiven Overlays
- unveränderten Skip-Link als ersten sinnvollen Tastaturtarget beim Erstladen
- statische Accessibility-Verträge, neue Playwright-E2E-Fälle und `scripts/hub_a11y_contract_audit.py`
- Offline-Verfügbarkeit dieser A11y-Schicht im v46-Service-Worker-Core

**Noch kein Accessibility PASS:** VoiceOver, TalkBack, reales 200-%-Zoom, Touchbedienung und echte Geräte-/Browserabnahme bleiben offen.

## A-bis-Z-Grundlage

Zentrale Verträge:

- `APP_ENTWICKLUNG_VON_A_BIS_Z.md`
- `APP_DEVELOPMENT_STATUS.md`
- `CORE_GAME_ACCEPTANCE.md`
- `ACCESSIBILITY.md`
- `RELEASE_STATUS.md`
- `RELEASE_CHECKLIST.md`
- `RELEASE_EVIDENCE.md` / `release-evidence.json`
- `operator-release.json` / `OPERATOR_RELEASE_SIGNOFF.md`
- `HOSTING_DECISION.md`
- `BRANCH_PROTECTION.md`
- `CI_TROUBLESHOOTING.md`
- `ARCHITECTURE.md`
- `ENVIRONMENTS.md`
- `DEPLOYMENT.md`
- `SECURITY.md` / `THREAT_MODEL.md`
- `CONTENT_AGE_POLICY.md` / `CORE_CONTENT_REVIEW.md`
- `THIRD_PARTY_NOTICES.md` / `ASSET_RIGHTS_SIGNOFF.md` / `FAN_CONTENT_REVIEW.md`
- `BETA_TEST_PLAN.md` / `MANUAL_TEST_PLAN.md`
- `LEGAL_CHECKLIST.md` / `SUPPORT.md` / `INCIDENT_RESPONSE.md` / `MAINTENANCE.md`

## Operator / Hosting / Legal

Der reale Betriebs-/Legalblock ist als eigener Releasevertrag modelliert:

- `operator-release.json` startet bewusst mit `PREPARED / BLOCKED`
- `OPERATOR_RELEASE_SIGNOFF.md` bündelt Betreiber-/Legal-/Support-/Incident-Freigaben
- `HOSTING_DECISION.md` erzwingt Provider-, Log-, Datenschutz-, Staging-/Production- und Rollbackprüfung
- `scripts/operator_release_contract_audit.py` läuft in `npm run validate`
- `legalPrivacy` und `supportIncident` dürfen erst PASS werden, wenn die Operator-Akte `FINAL / READY` ist
- Issue #14 führt die real offenen Operator-/Hosting-/Legal-/Support-/Incident-Schritte

## Content / Privacy / Reference

- alle definierten quantitativen Core-Ziele erreicht
- 15/15 erster Core-Quellpass dokumentiert
- 15/15 Core-Hardening dokumentiert
- unnötige konkrete Marken-/Franchise-/Eventreferenzen generisch ersetzt
- `anime-guess` → **Anime-Archetypen erraten**
- stabile ID `wavelength` → sichtbar **Spektrum-Tipp**
- frühere Private-Device-Truth/Dare-Prompts physisch entfernt
- Privacy-/Reference-Audits scannen ausgelieferte Contentquellen
- persönliche Core-Inhalte bleiben freiwillig/überspringbar

## Build / Supply Chain

- `package-lock.json` v3
- `@playwright/test`, `playwright`, `playwright-core` exakt 1.54.2
- optional `fsevents` 2.3.2
- Registry-URLs + `sha512`-Integrities
- keine npm-Runtime-Dependencies
- CI und Cross-Browser verwenden `npm ci`
- Lockfile-, A11y-, Operator- und Release-Readiness-Audits sind in `npm run validate` eingebunden

## CI – extern blockiert

Der zuletzt ausdrücklich untersuchte aktuelle-Branch-Lauf war **Run #2575**, Job `97682633520`.

- `failure`
- Jobliste ohne Workflow-Schritte
- separate Step-Abfrage `steps: []`
- keine Joblogs
- kein Checkout / kein npm / keine Tests / kein Repository-Code ausgeführt

Ein früherer Minimal-Runner-Probe ohne Checkout, Setup-Actions, npm, Playwright oder Repository-Code endete ebenfalls vor Step 1 mit `steps: []`.

Damit liegt die unmittelbare Fehlerfläche vor der Repository-Ausführung: Hosted-Runner-Zuteilung, Actions-/Account-/Billing-/Budget-/Policyzustand oder GitHub-seitige Runner-Störung.

Details: `CI_TROUBLESHOOTING.md` und Issue #7.

## Offline / PWA – v46

Der Service Worker verwendet:

- `secret-circle-v46`
- `secret-circle-v46-staging`

Zum Offline-Core gehören Hub, Word Imposter, Advanced, Quick, Creator, Privacy, Katalog-/Contentmodule, Backup-Registry, Timer-/Sessioncontroller, Resume-/Privacy-Guards, `party-hub-a11y.js` sowie Manifest/App-Icons.

Updates werden staged und erst nach bewusster Nutzerentscheidung aktiviert. Reale PWA-Upgrades, Rollbacks und Gerätetests bleiben offen.

## Assets / Rechte

`assets/manifests/asset-provenance.json` inventarisiert `icon.svg`, `icon-192.png` und `icon-512.png`.

Die technische Ableitung/Dimensionierung ist dokumentiert; die Rechtebasis des SVG ist noch `unresolved`. `ASSET_RIGHTS_SIGNOFF.md` definiert den menschlichen Nachweis. Bis dahin bleibt `ASSETS / THIRD PARTY` blockiert.

## Release Evidence

`release-evidence.json` bleibt absichtlich `PREPARED / NO_GO`.  
`operator-release.json` bleibt absichtlich `PREPARED / BLOCKED`.

Ein späteres `GO` erfordert echte Belege auf **demselben unveränderten RC-Commit**.

## Drei zentrale offene Issues

1. **#7** – GitHub Actions / Hosted Runner endet vor Step 1
2. **#8** – reale Geräte, Offline-PWA, Accessibility und Partytests
3. **#14** – Operator, Hosting, Legal, Support und Incident Evidence

Zusätzlich bleibt die Icon-Rechtebasis offen.

## Aktuell höchste Priorität

1. Issue #7: Hosted Runner bis zum ersten echten Step reparieren
2. Online-`npm ci` + vollständiges `npm run ci`
3. Cross-Browser auf demselben Commit
4. Branch Protection real bestätigen
5. Issue #14: Provider + Betreiber-/Kontakt-/Privacy-/Supportangaben finalisieren
6. HTTPS-Staging-Origin festlegen und v46-Smoke ausführen
7. Issue #8: PWA v46 Upgrade/Rollback + reale Geräte/A11y/Gruppen
8. App-Icon-Rechtebasis und restlicher Visual-/Third-Party-Sign-off
9. Support-/Securitytest + SEV-1-/Rollback-Drill
10. unveränderlicher RC + vollständige Release Evidence

## Was jetzt nicht priorisiert wird

- keine neue 122-Mode-Scope-Welle
- kein großes Backend/Accountsystem
- keine Monetarisierungsarchitektur vor den Release-Gates
- keine weitere Featuremenge auf Kosten von CI, Geräten, Gruppen, Hosting und Legal

**Aktuell: NO_GO. PR #13 bleibt Draft und wird nicht gemergt.**
