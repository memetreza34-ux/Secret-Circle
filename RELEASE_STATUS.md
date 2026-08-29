# Release-Status – Secret Circle

Stand: 29. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13

## Gesamtstatus

**Phase:** Release-Härtung / Verifikation  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v64` / `secret-circle-v64-staging`**  
**Built-ins:** **55 · 15 Core / 13 Extended / 27 Labs**  
**Expansion Wave 1:** **10/10 source implemented, real evidence OPEN**  
**Classic Content:** **v4**  
**Core Source Review/Hardening:** **15/15 PREPARED**  
**Accessibility:** **PREPARED**  
**Bestehende Spezialgates bis HS60:** **source PREPARED, real evidence OPEN**  
**Operator / Hosting / Legal:** **PREPARED / BLOCKED**  
**PR-Stack:** **DIVERGED_FROM_MAIN – Reconciliation vor Release-Merge erforderlich**

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

**Wichtig:** Wave-1-Labs erweitern den Januar-Core nicht automatisch. Vor einer Promotion bleiben reale Browser-/PWA-/Accessibility-/Gruppentests Pflicht.

## Runtime-/Metadaten-Synchronität

`release-meta.json` ist die zentrale Arbeitsmetadatenquelle für:

- v64
- Package `1.0.0-beta.3`
- `secret-circle-v64` / `secret-circle-v64-staging`
- 55 / 15 / 13 / 27
- Wave 1 10/10
- NO_GO / PR #13 Draft
- CI-Referenzbefund
- aktuellen PR-Stack-Drift

`tests/party-release-structure.test.js` vergleicht diese Metadaten mit dem real zusammengesetzten Runtime-Katalog. `tests/service-worker.test.js` vergleicht die Cachegeneration mit denselben Metadaten. Damit soll Versions-/Spielzahl-/Cache-Drift künftig automatisch auffallen.

## PWA v64

- `secret-circle-v64`
- `secret-circle-v64-staging`
- alle zehn Wave-1-Labs offline enthalten
- SessionControls v5 und alle bisherigen Resume-/Privacy-/A11y-/Backup-/Advanced-Verträge bleiben enthalten
- reale Installation, Update, Rollback, Cold Resume und Offline-Smokes bleiben Evidence-Gates

## CI – P0

Referenzierter vollständig untersuchter v64-Actions-Lauf:

- Run **#3608**
- Run ID `33253663445`
- Job `99103557030`
- Head `2297868e1f65b45753294151a3b1f401a55f6288`
- Ergebnis `failure`
- `steps: []`
- `runner_id: 0`
- `runner_name: ""`
- requested label `ubuntu-latest`

Ein späterer Lauf **#3644** auf Commit `6c518161b30fb34bba60d6924b32836b89477d24` reproduzierte dasselbe Muster: Job `99106788535`, `steps: []`, `runner_id: 0`, leerer Runner-Name.

Kein Checkout, npm, Playwright, Python-Audit oder Repositorycode wurde in diesen Jobs ausgeführt.

**v50–v64 besitzen keinen echten Hosted-Runner-PASS.** Der nächste Schritt ist kein App-Code-Workaround, sondern Actions-/Hosted-Runner-/Account-/Billing-/Policy-Diagnose gemäß Issue #7.

## PR-/Branch-Stack – P0/P1

Aktuelle Kette:

```text
main
  └─ PR #3  codex/improve-gameplay-v3
       └─ PR #11 codex/party-hub-foundation
            └─ PR #13 agent/release-foundation-2027
```

Intern ist der Stack sauber:

- PR #11 liegt vollständig auf PR #3
- PR #13 liegt vollständig auf PR #11

Die erste Stack-Basis ist gegenüber aktuellem `main` jedoch **diverged**. Zwei spätere `main`-Commits liegen nicht in der Stack-Abstammung:

- `6b6bddd0ae619d160b4468b61ae49cb30e2ea834` – Legacy-ZIP-Inventar-/Safety-Tooling
- `d347c7138bae18325c288632222917ad618e6547` – finale Hub-Separation

Vor einer Release-Mergefolge muss die Basis kontrolliert mit `main` reconciled werden. Diese zwei Änderungen dürfen nicht versehentlich verloren gehen. Nach echter Merge-/Rebase-Integration ist der resultierende Commit ein neuer Kandidat und muss erneut durch die Release-Gates.

PR #3 wurde sichtbar als **DO NOT MERGE** gekennzeichnet; der Versuch, ihn über die Connector-Schnittstelle zurück in Draft zu versetzen, scheiterte an einem GitHub-GraphQL-Connectorfehler. PR #11 und PR #13 bleiben Draft.

## Release Evidence / Assets

- `release-evidence.json`: **PREPARED / NO_GO**
- `operator-release.json`: **PREPARED / BLOCKED**
- Root-`icon.svg`: Rechtebasis `unresolved`
- finaler RC-Commit/Tag/Cache/Staging-/Production-URL: noch nicht gesetzt

## Zentrale offene Blocker

1. **#7** Hosted Runner endet vor Step 1
2. **PR-Stack/Main-Reconciliation** vor einer Release-Mergefolge
3. **#8** reale Geräte, v64 Offline-PWA, Spezialgates, Accessibility, Core-Partytests und Wave-1-Labs
4. **#14** Operator, Hosting, Legal, Support und Incident Evidence
5. Root-`icon.svg` Rechtebasis

## Real offene Releasegates

1. Actions-Runner / Online-`npm ci` / CI / Cross-Browser
2. Stack-Reconciliation + Branch Protection
3. Hostingprovider + getrennte HTTPS-Origins
4. v64/RC Staging-/Production-/PWA-Smokes + Upgrade/Rollback
5. bestehende Spezialgates bis HS60
6. Android / iPhone / Tablet
7. VoiceOver / TalkBack / Tastatur / 200-%-Zoom
8. reale Gruppen/Beta für alle 15 Core-Spiele
9. Wave-1-Labs nur bei eigener realer Evidence über Labs hinaus einstufen
10. Asset-/Operator-/Privacy-/Support-/Legal-Sign-off
11. Incident-/Rollback-Drill
12. unveränderter RC + Release Evidence FINAL/GO

## Entwicklungsregel ab v64

- **Feature-Freeze für neue Core-Spielmodi**, bis P0/P1-Releasegates geschlossen sind
- keine große Architekturmigration vor dem RC
- reale Fehler aus CI, Browser-, Geräte-, Accessibility- und Gruppentests zuerst beheben
- Labs nicht still in Core übernehmen
- offene Evidence-Gates niemals nur aufgrund vorhandenen Codes als PASS markieren

## Releaseentscheidung

- öffentlicher Release: **NO_GO**
- PR #13 mergen: **Nein**
- PR #13 bleibt Draft: **Ja**
