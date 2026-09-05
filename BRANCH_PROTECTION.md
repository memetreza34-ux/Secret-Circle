# Secret Circle – Branch Protection, PR-Stack und Required Checks

Stand: 29. August 2026  
Status: **BLOCKED – `main` ist real ungeschützt; Hosted Runner weiterhin vor Step 1 blockiert**  
Evidence-Status: **OPEN**

Maschinenlesbare Freigabequelle: `release-evidence.json → gates.branchProtection`.  
Aktueller Arbeitsstand: `release-meta.json`.

## 1. Real verifizierter GitHub-Status

Der GitHub-Branch-Endpunkt für `main` liefert aktuell:

- `protected: false`
- `protection.enabled: false`
- Required-Check-Enforcement: `off`
- Required-Check-Kontexte: leer
- aktueller `main`-Head: `d347c7138bae18325c288632222917ad618e6547`

Damit ist Branch Protection nicht nur unbewiesen, sondern **nachweislich nicht aktiv**. Das Release-Gate bleibt `BLOCKED`.

Die vollständige Protection-Detail-API war über die Integration zuvor nicht zugänglich; der Branch-Endpunkt selbst liefert jedoch eindeutig `protected: false` und deaktivierte Protection.

## 2. Aktuelle PR-/Branch-Kette

Der aktive Release-Stack bleibt:

```text
main
  └─ PR #3  codex/improve-gameplay-v3
       └─ PR #11 codex/party-hub-foundation
            └─ PR #13 agent/release-foundation-2027
```

Aktueller Release-Arbeitszweig: `agent/release-foundation-2027`.  
Aktueller Release-PR: **#13 (Draft / NO_GO)**, Base **`codex/party-hub-foundation`**.

### Main-Drift auf dem aktiven Release-Branch

Der aktive Stack enthält zwei spätere `main`-Commits nicht in seiner Abstammung:

1. `6b6bddd0ae619d160b4468b61ae49cb30e2ea834` – sichere Legacy-ZIP-Inventar-/Tooling-Grenzen
2. `d347c7138bae18325c288632222917ad618e6547` – finale Hub-Separation

Die fehlende Arbeit war inhaltlich relevant: das aktive v64-Branch enthielt das Archiv-Inventarwerkzeug, die zugehörigen Sicherheits-/Source-Verträge und die Hub-Trennungsdoku nicht.

## 3. Kontrollierter Reconciliation-Kandidat – PR #15

Dafür existiert jetzt isoliert:

- Branch: `integration/v64-main-sync`
- Draft PR: **#15**
- Head: `8ccb43d8920d94f385cb5172440b5a0b63fb468c`
- Base: `agent/release-foundation-2027`
- Diff gegenüber aktivem v64-Branch: **9 Dateien**
- GitHub: `mergeable: true`
- Merge-State: `unstable`, weil CI weiterhin fehlschlägt

Der Integrationsbranch wurde bewusst manuell aufgelöst:

- sieben Main-only Sicherheits-/Source-Dateien blob-identisch wiederhergestellt
- alte Main-README/CI-Versionen **nicht** blind über v64 kopiert
- moderner v64-CI um das Archiv-Sicherheitsgate erweitert
- v64-README um die historische Archiv-/Hub-Grenze ergänzt
- danach echter Merge-Commit mit aktuellem `main` als zweitem Parent erzeugt

Verifizierte Abstammung dieses Kandidaten:

- gegen `main`: `behind_by = 0`
- gegen `agent/release-foundation-2027`: `behind_by = 0`

PR #15 wird **nicht automatisch gemergt**. Erst Review + echter Runner-PASS + Retest.

## 4. Verbindlicher normaler PR-Check

Workflow:

- Name: `Secret Circle CI`
- Datei: `.github/workflows/ci.yml`
- Job: `validate`
- gewünschter Required-Check-Kontext: **`Secret Circle CI / validate`**

Der Job muss echten Checkout und alle Repository-Schritte ausführen. Ein Job mit `steps: []` gilt weder als PASS noch als negativer Code-Test. Kein Merge bei `steps: []`.

Aktuelle Beispiele:

- v64 Run #3608 / Job `99103557030`: `steps: []`, `runner_id: 0`
- v64 Run #3644 / Job `99106788535`: `steps: []`, `runner_id: 0`
- Reconciliation PR #15 Run #3652 / Job `99107510570`: `steps: []`, `runner_id: 0`

Damit ist auch der isolierte Main-Sync nicht repositoryseitig ausgeführt worden.

## 5. Warum Required Check noch nicht aktiviert wird

Die gewünschte finale Regel verlangt `Secret Circle CI / validate` als Required Check. Der Hosted Runner startet aktuell aber keinen einzigen Workflow-Step.

Würde jetzt ein dauerhaft erforderlicher CI-Check aktiviert, wäre `main` zwar formal stärker blockiert, aber ohne funktionierenden Runner gäbe es keinen belastbaren grünen Pfad. Deshalb gilt die Reihenfolge:

1. Hosted-Runner-/Actions-/Billing-/Policy-Blocker beheben.
2. mindestens einen echten CI-Lauf mit Checkout und Repositoryschritten erhalten.
3. `Secret Circle CI / validate` erfolgreich ausführen.
4. danach Branch Protection + Required Check verbindlich aktivieren und erneut verifizieren.

Bis dahin darf niemand direkt in `main` releaserelevante Änderungen einspielen.

## 6. Cross-Browser ist Release-Gate

Workflow:

- Name: `Secret Circle Cross-Browser Smoke`
- Datei: `.github/workflows/cross-browser.yml`
- Job: `smoke`
- Trigger aktuell: `workflow_dispatch`

Cross-Browser ist für den RC zwingend. Aktuell darf `Secret Circle Cross-Browser Smoke / smoke` **nicht** als dauerhaft erforderlicher PR-Check aktiviert werden, weil der Job nur manuell (`workflow_dispatch`) läuft. Vor Release muss Chromium/Firefox/WebKit auf dem **exakten unveränderten RC-Commit** grün dokumentiert sein.

## 7. Reproduzierbarer Installationsvertrag

`package-lock.json` liegt als Lockfile v3 vor. CI und Cross-Browser verwenden:

```bash
npm ci --ignore-scripts --no-audit --no-fund
```

Ein echter Online-`npm ci` auf unverändertem Commit grün bleibt offen.

Der Reconciliation-Kandidat ergänzt im normalen CI außerdem die Legacy-Archiv-Sicherheitsprüfung:

```bash
python -m py_compile tools/inventory_legacy_archive.py tests/archive-inventory.test.py scripts/validate_archive_tool.py
python tests/archive-inventory.test.py
python scripts/validate_archive_tool.py
```

Diese Schritte wurden wegen des Hosted-Runner-Blockers noch nicht auf GitHub ausgeführt.

## 8. Zielregeln für den stabilen Branch

Vor öffentlichem Release:

- Änderungen nur über Pull Request
- `Secret Circle CI / validate` als Required Check
- Force-Pushes deaktiviert
- Branch-Löschung deaktiviert
- offene Review-Threads vor Merge auflösen
- Bypass-/Admin-Ausnahmen minimal halten
- Merge erst nach vollständiger `RELEASE_CHECKLIST.md`
- finaler RC muss die reconciled Main-Historie enthalten

## 9. Merge-Grenze

PR #13 beziehungsweise ein daraus abgeleiteter finaler RC darf erst Richtung stabilen Zielbranch gehen, wenn:

1. PR #15 oder eine äquivalent geprüfte Reconciliation übernommen wurde.
2. beide Main-only Änderungen erhalten sind.
3. Actions einen echten Hosted Runner erhält.
4. Online-`npm ci` grün ist.
5. `npm run ci` grün ist.
6. Cross-Browser grün ist.
7. Branch Protection real aktiviert und erneut abgefragt wurde.
8. HTTPS-/PWA-/Geräte-/Accessibility-/Gruppentests bestanden sind.
9. Legal-/Asset-/Support-/Incident-Gates geschlossen sind.

## 10. Abnahmeprotokoll

```text
Protected branch: main
Protection verified at: 2026-08-29 current state = disabled
Current main reconciled into release stack: candidate prepared in Draft PR #15, not merged
Main reconciliation candidate: 8ccb43d8920d94f385cb5172440b5a0b63fb468c
Pull requests required: currently not enforced by branch protection
Required check contexts: currently none
Force pushes blocked: not confirmed/enforced by current protection state
Branch deletion blocked: not confirmed/enforced by current protection state
Review conversation resolution required: not confirmed/enforced
Admin/bypass rules reviewed: open
Successful npm ci run: open
Successful CI run: open
Successful RC cross-browser run: open
Final verifier: open
Final evidence reference: open
```

## 11. Release-Gate

`BRANCH PROTECTION PASS` erst wenn:

- [x] aktueller realer Branchstatus geprüft: `main protected = false`
- [x] kontrollierter Main-Reconciliation-Kandidat in Draft PR #15 erstellt
- [x] Kandidat ist gegen `main` `behind_by = 0`
- [ ] PR #15 geprüft und in den aktiven Releasepfad übernommen
- [ ] Hosted Runner führt echte Steps aus
- [ ] Online-`npm ci` grün
- [ ] `Secret Circle CI / validate` grün
- [ ] Branch Protection auf `main` real aktiviert
- [ ] PR-Pflicht bestätigt
- [ ] Required Check bestätigt
- [ ] Force-Push-/Löschregeln bestätigt
- [ ] Review-/Bypass-Regeln geprüft
- [ ] RC-Cross-Browser-Lauf grün
- [ ] `release-evidence.json.gates.branchProtection = PASS` mit finaler RC-Evidence

**Aktuell: BLOCKED / RELEASE NO_GO.**
