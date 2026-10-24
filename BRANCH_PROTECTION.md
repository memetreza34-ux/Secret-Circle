# Secret Circle – Branch Protection, PR-Stack und Required Checks

Stand: 16. Oktober 2026  
Status: **OPEN – Branch-Schutz auf `main` ist seit 16. Oktober 2026 real aktiv; PASS erst nach erneuter Prüfung auf dem eingefrorenen Release-Kandidaten**  
Evidence-Status: **OPEN**

Maschinenlesbare Freigabequelle: `release-evidence.json → gates.branchProtection`.  
Aktueller Arbeitsstand: `release-meta.json`.

## 1. Real verifizierter GitHub-Status

Am 16. Oktober 2026 (14:57 UTC) über die GitHub-API aktiviert und danach über den Branch-Endpunkt erneut abgefragt:

- `protected: true`, Required-Check-Enforcement: `everyone` (gilt auch für Admins)
- Pflicht-Checks: `validate` und `e2e-webkit` (`Secret Circle CI`) sowie `smoke` (`Secret Circle Cross-Browser Smoke`)
- Branch muss vor dem Merge auf aktuellem `main`-Stand sein (`strict: true`)
- Änderungen nur per Pull Request; 0 Pflicht-Freigaben, weil der Solo-Inhaber eigene PRs nicht selbst freigeben kann
- offene Review-Diskussionen müssen vor dem Merge aufgelöst sein
- Force-Push und Löschen von `main` gesperrt
- geprüfter `main`-Head: `0e0567f08df963f7d149730fdfbe0da33396ea58`

Das Gate steht damit auf `OPEN` statt `BLOCKED`. `PASS` erst, wenn die Einstellung auf dem eingefrorenen Release-Kandidaten erneut abgefragt wurde (siehe Abschnitt 11).

Historisch: Vom 29. August bis 16. Oktober 2026 lieferte der Endpunkt `protected: false` ohne Pflicht-Checks.

## 2. Historische PR-/Branch-Kette (Stand 29. August 2026, überholt)

**Überholt:** PR #15 wurde am 15. Oktober 2026 und PR #13 am 16. Oktober 2026 geschlossen; die Konsolidierung lief über PR #32. Neue Arbeit geht über kurze Branches direkt gegen `main`. Der Rest dieses Abschnitts und Abschnitt 3 sind Archiv.

Der damalige Release-Stack war:

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

Historische Beispiele (bis 29. August 2026):

- v64 Run #3608 / Job `99103557030`: `steps: []`, `runner_id: 0`
- v64 Run #3644 / Job `99106788535`: `steps: []`, `runner_id: 0`
- Reconciliation PR #15 Run #3652 / Job `99107510570`: `steps: []`, `runner_id: 0`

Damit ist auch der isolierte Main-Sync nicht repositoryseitig ausgeführt worden. Seit dem 5. September 2026 führt der Hosted Runner alle Schritte real aus; letzter grüner Lauf auf `main`: Run `36292530012` (27. September 2026, Head `0d157ba`, Jobs `validate` und `e2e-webkit`).

## 5. Aktivierungsreihenfolge (abgeschlossen am 16. Oktober 2026)

Die gewünschte finale Regel verlangt `Secret Circle CI / validate` als Required Check. Bis zum 5. September 2026 startete der Hosted Runner keinen einzigen Workflow-Step.

Würde jetzt ein dauerhaft erforderlicher CI-Check aktiviert, wäre `main` zwar formal stärker blockiert, aber ohne funktionierenden Runner gäbe es keinen belastbaren grünen Pfad. Deshalb gilt die Reihenfolge:

1. Hosted-Runner-/Actions-/Billing-/Policy-Blocker beheben. – erledigt am 5. September 2026
2. mindestens einen echten CI-Lauf mit Checkout und Repositoryschritten erhalten. – erledigt
3. `Secret Circle CI / validate` erfolgreich ausführen. – erledigt, zuletzt Run `36292530012`
4. danach Branch Protection + Required Check verbindlich aktivieren und erneut verifizieren. – erledigt am 16. Oktober 2026 (Abschnitt 1)

Seit dem 16. Oktober 2026 erzwingt GitHub, dass niemand direkt in `main` einspielt.

## 6. Cross-Browser ist Release-Gate

Workflow:

- Name: `Secret Circle Cross-Browser Smoke`
- Datei: `.github/workflows/cross-browser.yml`
- Job: `smoke`
- Trigger: `pull_request` (automatisch für neue Codeänderungen) und `workflow_dispatch` (manueller Retest)
- Browser-Matrix: Chromium, Firefox und WebKit mit Desktop- und mobilen Playwright-Projekten

Cross-Browser ist für den RC zwingend. `Secret Circle Cross-Browser Smoke / smoke` **ist seit 16. Oktober 2026 ein Pflicht-Check für Pull Requests auf `main`** (siehe Abschnitt 1 und `release-evidence.json → gates.branchProtection`). Ein grüner PR-Lauf ist zusätzliche reale CI-Evidence, **ersetzt aber keinen Cross-Browser-Release-PASS**: Vor Release muss Chromium/Firefox/WebKit auf dem **exakten unveränderten RC-Commit** grün dokumentiert sein.

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

Seit dem 5. September 2026 laufen diese Schritte im CI-Job `validate` real mit.

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
3. Actions einen echten Hosted Runner erhält (seit 5. September 2026 erfüllt).
4. Online-`npm ci` grün ist.
5. `npm run ci` grün ist.
6. Cross-Browser grün ist.
7. Branch Protection real aktiviert und erneut abgefragt wurde.
8. HTTPS-/PWA-/Geräte-/Accessibility-/Gruppentests bestanden sind.
9. Legal-/Asset-/Support-/Incident-Gates geschlossen sind.

## 10. Abnahmeprotokoll

```text
Protected branch: main
Protection verified at: 2026-10-16T14:57Z current state = enabled (head 0e0567f08df963f7d149730fdfbe0da33396ea58)
Current main reconciled into release stack: superseded – PR #13/#15 closed, consolidation via PR #32
Main reconciliation candidate: not applicable
Pull requests required: enforced (0 required approvals, solo owner)
Required check contexts: validate, e2e-webkit, smoke (strict, enforced for admins)
Force pushes blocked: enforced
Branch deletion blocked: enforced
Review conversation resolution required: enforced
Admin/bypass rules reviewed: enforce_admins = true, no bypass list
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
- [x] PR #15 entfällt: geschlossen am 15. Oktober 2026, Konsolidierung über PR #32
- [x] Hosted Runner führt echte Steps aus (seit 5. September 2026)
- [ ] Online-`npm ci` grün
- [x] `Secret Circle CI / validate` grün (main-Run `38898973994`, 16. Oktober 2026)
- [x] Branch Protection auf `main` real aktiviert (16. Oktober 2026)
- [x] PR-Pflicht bestätigt
- [x] Required Check bestätigt
- [x] Force-Push-/Löschregeln bestätigt
- [x] Review-/Bypass-Regeln geprüft
- [ ] RC-Cross-Browser-Lauf grün
- [ ] `release-evidence.json.gates.branchProtection = PASS` mit finaler RC-Evidence

**Aktuell: OPEN / RELEASE NO_GO.** Offen: Online-`npm ci`, RC-Cross-Browser-Lauf und erneute Prüfung auf dem eingefrorenen RC.
