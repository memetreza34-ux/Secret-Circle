# Release-Status – Secret Circle

Stand: 29. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13  
Main-Reconciliation-Kandidat: Draft-PR #15

## Gesamtstatus

**Phase:** Release-Härtung / Verifikation  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v64` / `secret-circle-v64-staging`**  
**Package:** **`1.0.0-beta.3`**  
**Built-ins:** **55 · 15 Core / 13 Extended / 27 Labs**  
**Expansion Wave 1:** **10/10 source implemented, real evidence OPEN**  
**Classic Content:** **v4**  
**Core Source Review/Hardening:** **15/15 PREPARED**  
**Accessibility:** **PREPARED**  
**Bestehende Spezialgates bis HS60:** **source PREPARED, real evidence OPEN**  
**Operator / Hosting / Legal / Support:** **PREPARED / BLOCKED**  
**Branch Protection:** **BLOCKED – `main` aktuell ungeschützt**  
**CI / Cross-Browser:** **BLOCKED – Hosted Runner erreicht Step 1 nicht**  
**PR-Stack:** **Reconciliation-Kandidat PR #15 vorhanden, noch nicht in Releasebranch integriert**

## Versionslinie

v45 Core → v46 Hub A11y → v47 Secondary A11y → v48 Word-Imposter → v49 Hub Resume Guard → v50 fail-closed Loader → v51 Complete Backup → v52 Safe Hub Current → v53 Paranoia → v54 Pre-Timer → v55 Advanced Integrity → v56 Quick Replacement → v57 Quick Timer Resume → v58 BFCache → v59 Background Pause → v60 Hidden Snapshot → v61 Quiz → v62 Imposter → v63 Writing → **v64 Wave 1 Complete**.

## v64 – Expansion Wave 1 Complete

Die zehn geplanten Wave-1-Labs sind quellsseitig implementiert:

1. `bluff-trivia`
2. `party-quiz`
3. `fact-or-fake`
4. `percent-guess`
5. `fill-blank-battle`
6. `who-wrote-it`
7. `party-bracket`
8. `undercover-similar-word`
9. `no-word-imposter`
10. `password-one-word`

Gemeinsame Architektur:

- sechs wiederverwendbare Enginefamilien: Quiz, Imposter, Writing, Estimation/Voting, Bluff und Clue
- `quick-loader.js` v11 routet alle Wave-1-Familien explizit
- `party-release-structure.js` v5 hält alle zehn Modi in Labs
- Session-Replacement-, Resume-, exact-once- und Offline-Verträge werden wiederverwendet
- Wave-1-Unit-/E2E-/Audit-Verträge sind in `npm run test`, `npm run check` und `npm run validate` eingebunden

**Kein Wave-1-Modus erweitert automatisch den Januar-Core.**

## Runtime-/Release-Metadaten-Synchronität

`release-meta.json` ist die zentrale Arbeitsmetadatenquelle für:

- v64
- Package `1.0.0-beta.3`
- `secret-circle-v64` / `secret-circle-v64-staging`
- 55 / 15 / 13 / 27
- Wave 1 10/10
- NO_GO / PR #13 Draft
- CI-/Branch-Protection-Befunde
- PR-Stack-/PR-15-Reconciliation

`tests/party-release-structure.test.js` vergleicht die Metadaten mit dem real zusammengesetzten Runtime-Katalog, dem Package und jetzt auch mit `operator-release.json.releaseContext`. Dadurch dürfen Operator-/Hosting-Evidence, App-Version und Cachegeneration nicht still auseinanderlaufen.

## PWA v64

- `secret-circle-v64`
- `secret-circle-v64-staging`
- alle zehn Wave-1-Labs offline enthalten
- SessionControls v5 und alle bisherigen Resume-/Privacy-/A11y-/Backup-/Advanced-Verträge bleiben enthalten
- reale Installation, Update, Rollback, Cold Resume und Offline-Smokes bleiben Evidence-Gates

## CI – P0

Aktuellster direkt untersuchter Reconciliation-Kandidat:

- Workflow: `Secret Circle CI`
- Run **#3660**
- Run ID `33255333073`
- Job `99107918414`
- Head `c3b1f423c48d623ac22c6a0c38c5fdf927773ab3`
- Branch `integration/v64-main-sync`
- Ergebnis `failure`
- `steps: []`
- `runner_id: 0`
- `runner_name: ""`
- requested label `ubuntu-latest`

Kein Checkout, npm, Playwright, Python-Audit oder Repositorycode wurde ausgeführt. Damit bleibt der Fehler **vor Repository-Ausführung**.

**Folge:**

- CI = **BLOCKED**
- Cross-Browser = **BLOCKED**
- kein App-Code-Workaround
- Issue #7 bleibt P0

## PR-/Branch-Stack – P0/P1

Historische Kette:

```text
main
  └─ PR #3  codex/improve-gameplay-v3
       └─ PR #11 codex/party-hub-foundation
            └─ PR #13 agent/release-foundation-2027
```

Die zwei späteren `main`-Commits außerhalb der ursprünglichen Stack-Abstammung sind:

- `6b6bddd0ae619d160b4468b61ae49cb30e2ea834` – Legacy-ZIP-Inventar-/Safety-Tooling
- `d347c7138bae18325c288632222917ad618e6547` – finale Hub-Separation

Dafür existiert jetzt der isolierte Draft-PR **#15** auf `integration/v64-main-sync`.

Der Kandidat:

- enthält die aktuelle `main`-Historie
- lag bei letzter Synchronisierung `behind_by = 0` gegenüber Releasebranch und `main`
- ändert gegenüber dem v64-Releasebranch nur 9 Pfade
- verändert keine Spielengine, keinen Katalog und keinen Service-Worker-Runtime-Code
- integriert die historischen Archiv-/Safety-Dateien und moderne v64-CI-Verkabelung
- bleibt ungemergt, bis reale Tests wieder laufen

PR #3 ist sichtbar als **DO NOT MERGE** gekennzeichnet. PR #11, #13 und #15 bleiben Draft.

## Branch Protection – bestätigt BLOCKED

GitHub meldet für `main` aktuell:

- `protected: false`
- `protection.enabled: false`
- Required-Check-Enforcement: `off`
- keine Required-Check-Kontexte

Branch Protection darf erst als PASS gelten, wenn eine reale Regel aktiviert und mit einem funktionierenden `Secret Circle CI / validate` geprüft wurde.

## Operator / Hosting / Legal / Support

`operator-release.json` ist weiterhin korrekt **PREPARED / BLOCKED**.

Neu ist ein maschinenlesbarer `releaseContext` mit:

- Source Generation `v64`
- App `1.0.0-beta.3`
- Production Cache `secret-circle-v64`
- Staging Cache `secret-circle-v64-staging`
- Release Target `2027-01`
- Release Decision `NO_GO`

Real weiterhin nicht vorhanden:

- finaler Betreiber / Rechtsform / ladungsfähige Anschrift
- öffentlicher Betreiber-/Supportkontakt
- Security-/Privacy-Meldeweg
- Hostingprovider / Produkt / Region
- getrennte HTTPS-Staging-/Production-Origin
- finale Hosting-/Log-/Privacy-Prüfung
- Legal-/Anbieterkennzeichnungsseite mit realen Angaben
- Incident-Verantwortliche
- Probe-Supportfall
- Probe-SEV-1
- Rollback-Drill

Deshalb sind jetzt korrekt als **BLOCKED** klassifiziert:

- `stagingHttpSmoke`
- `legalPrivacy`
- `supportIncident`
- `productionSmoke`

## Assets

- Root-`icon.svg`: Provenienz `unresolved`
- `icon-192.png` / `icon-512.png`: Ableitungen des ungeklärten SVG
- Git-Historie beweist die Repository-Herkunft, aber nicht die tatsächliche Rechtebasis

Daher bleibt `assetsThirdParty = BLOCKED`, bis Rechte real bestätigt oder das Icon durch ein eindeutig eigenes Asset ersetzt wurde.

## Noch offene, aber nicht extern blockierte reale Gates

- Android
- iPhone/iOS
- Tablet/iPad
- Accessibility real: VoiceOver / TalkBack / Tastatur / 200-%-Zoom / Touch / Rotation
- reale Gruppen für alle 15 Core-Spiele
- bestehende Spezialgates bis HS60 auf echten Browsern/Geräten
- Wave-1-Labs reale Browser-/PWA-/Gruppenevidence
- Content-/Privacy-/Reference-Finalreview
- PWA Upgrade/Rollback nach verfügbarer Testumgebung

## Priorität ab jetzt

1. **Issue #7:** Hosted Runner / Actions / Billing / Policy lösen
2. **PR #15:** nach funktionierendem CI vollständig testen und erst dann in Releasepfad übernehmen
3. **Branch Protection:** `Secret Circle CI / validate` real als Required Check aktivieren/prüfen
4. Hostingprovider + getrennte HTTPS-Origins festlegen
5. Operator-/Support-/Security-Kontakte real festlegen
6. v64/RC Staging-/PWA-/Upgrade-/Rollback-Smokes
7. Android / iPhone / Tablet + Accessibility
8. reale Gruppentests für alle 15 Core-Games
9. Assetrechte / Icon lösen
10. Legal-/Support-/Incident-Sign-off
11. unveränderlichen RC einfrieren
12. `release-evidence.json = FINAL / GO` erst nach vollständiger realer Evidence

## Entwicklungsregel ab v64

- **Feature-Freeze für neue Core-Spielmodi**
- keine große Architekturmigration vor dem RC
- reale Releasefehler vor neuen Features
- Labs nicht still in Core übernehmen
- PREPARED/OPEN/BLOCKED niemals als PASS interpretieren

## Releaseentscheidung

- öffentlicher Release: **NO_GO**
- PR #13 mergen: **Nein**
- PR #15 mergen: **Noch nicht**
- neue Core-Features bauen: **Nein**
