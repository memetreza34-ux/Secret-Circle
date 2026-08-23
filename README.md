# Secret Circle Party Hub

Secret Circle ist eine **offline-first Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät**. Der Januar-2027-Release priorisiert sichere private Übergaben, Wiederaufnahme nach Unterbrechungen, lokale Datenkontrolle, eigene Spiele und belastbare Release-Gates.

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

Aktueller Offline-Core: **`secret-circle-v45`** / `secret-circle-v45-staging`  
Classic Content: **v4**  
Core Source Review: **15/15 PREPARED**  
Core Source Hardening: **15/15 PREPARED**  
Freigabe: **NO_GO**

v45 ist die erste Cachegeneration nach dem vollständigen 15/15-Core-Hardening. Sie nimmt die neuen Resume-/Privacy-Guards explizit in den Offline-Core auf und vermeidet die Wiederverwendung des bereits belegten v44-Caches.

## Core-Hardening

Der vollständige 15-Core-Codepfad wurde erneut auf Setup, Geheimhaltung, Resume, Timer, Punkte und Anfänger-UX geprüft.

Wesentliche zusätzliche Verträge:

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

## A-bis-Z-Grundlage

Zentrale Verträge:

- `APP_ENTWICKLUNG_VON_A_BIS_Z.md`
- `APP_DEVELOPMENT_STATUS.md`
- `CORE_GAME_ACCEPTANCE.md`
- `RELEASE_STATUS.md`
- `RELEASE_CHECKLIST.md`
- `RELEASE_EVIDENCE.md` / `release-evidence.json`
- `BRANCH_PROTECTION.md`
- `CI_TROUBLESHOOTING.md`
- `ARCHITECTURE.md`
- `ENVIRONMENTS.md`
- `DEPLOYMENT.md`
- `SECURITY.md` / `THREAT_MODEL.md`
- `CONTENT_AGE_POLICY.md` / `CORE_CONTENT_REVIEW.md`
- `THIRD_PARTY_NOTICES.md` / `ASSET_RIGHTS_SIGNOFF.md` / `FAN_CONTENT_REVIEW.md`
- `ACCESSIBILITY.md` / `BETA_TEST_PLAN.md` / `MANUAL_TEST_PLAN.md`
- `LEGAL_CHECKLIST.md` / `SUPPORT.md` / `INCIDENT_RESPONSE.md` / `MAINTENANCE.md`

## Content / Privacy / Reference

- alle definierten quantitativen Core-Ziele erreicht
- 15/15 erster Core-Quellpass dokumentiert
- 15/15 Core-Hardening dokumentiert
- unnötige konkrete Marken-/Franchise-/Eventreferenzen generisch ersetzt
- `anime-guess` → **Anime-Archetypen erraten**
- stabile ID `wavelength` → sichtbar **Spektrum-Tipp**
- Browser-Tabu verwendet generischen Begriff statt konkrete Browsermarke
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
- `scripts/lockfile_contract_audit.py` schützt Package-/Lock-Synchronität und Dependencygraph

## CI – aktuell blockiert

Der Workflow selbst ist normal aufgebaut. Der aktuellste vollständig untersuchte App-Lauf und zusätzlich ein minimaler Runner-Probe ohne Repository-Code endeten jedoch **vor Step 1** mit `steps: []`.

Damit sind Secret-Circle-Code, npm, Playwright und Checkout-Actions nicht als unmittelbare Ursache des aktuellen Fehlermusters belegt. Der verbleibende Prüfbereich liegt bei Hosted-Runner-Zuteilung, GitHub-Actions-/Account-/Billing-/Budget-/Policyzustand oder GitHub-seitiger Runner-Störung.

Details und UI-Prüfschritte: `CI_TROUBLESHOOTING.md` und Issue #7.

Solange der Runner keinen echten Checkout/Online-`npm ci`/Testlauf ausführt, wird **kein CI-PASS** behauptet.

## Offline / PWA – v45

Der Service Worker verwendet:

- `secret-circle-v45`
- `secret-circle-v45-staging`

Zum Offline-Core gehören unter anderem:

- Hub / Word Imposter / Advanced / Quick / Creator / Privacy
- Katalog-/Contentmodule
- Backup-Registry
- Timer-/Sessioncontroller
- `word-imposter-resume-guard.js`
- `party-hub-resume-guard.js`
- `advanced-resume-guard.js`
- `advanced-privacy-guard.js`
- Manifest und App-Icons

Updates werden staged und erst nach bewusster Nutzerentscheidung aktiviert. Reale PWA-Upgrades, Rollbacks und Gerätetests bleiben offen.

## Assets / Rechte

`assets/manifests/asset-provenance.json` inventarisiert `icon.svg`, `icon-192.png` und `icon-512.png`.

Die technische Ableitung/Dimensionierung ist dokumentiert; die Rechtebasis des SVG ist noch `unresolved`. `ASSET_RIGHTS_SIGNOFF.md` definiert den menschlichen Nachweis, der vor einem verifizierten Rechtestatus erforderlich ist.

Bis dahin bleibt `ASSETS / THIRD PARTY` blockiert.

## Release Evidence

`release-evidence.json` bleibt absichtlich:

- `evidenceStatus = PREPARED`
- `releaseDecision = NO_GO`

Ein späteres `GO` erfordert echte Belege auf **demselben unveränderten RC-Commit** für CI, Cross-Browser, Branch Protection, HTTPS-Staging, PWA Upgrade/Rollback, Android/iOS/Tablet, Accessibility, reale Gruppen, Content/Privacy/Reference, Assets/Third Party, Legal/Privacy, Support/Incident und Production-Smoke.

## Aktuell höchste Priorität

1. GitHub Actions/Hosted Runner bis zum ersten echten Step reparieren
2. Online-`npm ci` + vollständiges `npm run ci`
3. Cross-Browser auf demselben Commit
4. Branch Protection real bestätigen
5. HTTPS-Staging-Origin festlegen und Smoke ausführen
6. PWA v45 Upgrade/Rollback auf echten Installationen
7. Android/iPhone/iPad + VoiceOver/TalkBack/200-%-Zoom
8. reale Gruppentests für alle 15 Core-Games
9. App-Icon-Rechtebasis und restlicher Visual-/Third-Party-Sign-off
10. Betreiber-/Hosting-/Privacy-/Support-/Legal-Details + Incident-Drill
11. unveränderlicher RC + vollständige Release Evidence

## Was jetzt nicht priorisiert wird

- keine neue 122-Mode-Scope-Welle
- kein großes Backend/Accountsystem
- keine Monetarisierungsarchitektur vor den Release-Gates
- keine weitere Featuremenge auf Kosten von CI, Geräten, Gruppen und Legal

**Aktuell: NO_GO. PR #13 bleibt Draft und wird nicht gemergt.**
