# Secret Circle – Branch Protection, PR-Stack und Required Checks

Stand: 29. August 2026  
Status: **PREPARED – GitHub-Einstellung selbst noch nicht belastbar bestätigt**  
Evidence-Status: **OPEN**

Maschinenlesbare Freigabequelle: `release-evidence.json → gates.branchProtection`.  
Aktueller Arbeitsstand: `release-meta.json`.

## 1. Ziel

Dieser Vertrag definiert, wie der stabile Secret-Circle-Releasezweig geschützt werden soll. Er beschreibt die gewünschte Repository-Konfiguration und den späteren Abnahmenachweis; `Evidence-Status: OPEN` behauptet ausdrücklich **nicht**, dass GitHub diese Einstellungen bereits aktiviert hat.

## 2. Aktuelle PR-/Branch-Kette

Der aktuelle Entwicklungsstand liegt in einem gestapelten PR-Aufbau:

```text
main
  └─ PR #3  codex/improve-gameplay-v3
       └─ PR #11 codex/party-hub-foundation
            └─ PR #13 agent/release-foundation-2027
```

Aktueller Release-Arbeitszweig: `agent/release-foundation-2027`.  
Aktueller Release-PR: **#13 (Draft)**.

### Wichtiger Main-Drift-Befund

Der Vergleich `main` → `codex/improve-gameplay-v3` ist aktuell **diverged**:

- Stack-Layer #3 ist 181 Commits vor seinem Merge-Base
- zugleich fehlen ihm **2 spätere Commits von `main`**
- Merge-Base: `a16a612c8e5f919eaca2dcf0a905e7e8824ec472`
- aktuelles `main`: `d347c7138bae18325c288632222917ad618e6547`

Die zwei Main-Commits außerhalb der Stack-Abstammung sind:

1. `6b6bddd0ae619d160b4468b61ae49cb30e2ea834` – sichere Legacy-ZIP-Inventar-/Tooling-Grenzen
2. `d347c7138bae18325c288632222917ad618e6547` – finale Hub-Separation dokumentiert

Diese Commits dürfen vor dem Release nicht versehentlich verloren gehen. Vor einer Mergefolge muss die Stack-Basis kontrolliert mit dem aktuellen `main` abgeglichen werden. Ein späterer Merge/Rebase ist **kein Dokumentationsschritt**, sondern eine Codeintegration und benötigt anschließend vollständige Retests.

PR #11 liegt vollständig auf PR #3 (`behind_by = 0`), und PR #13 liegt vollständig auf PR #11 (`behind_by = 0`). Das interne Stack-Verhältnis ist damit sauber; offen ist die Basis gegenüber aktuellem `main`.

## 3. Stack-Merge-Regel

Bis zur kontrollierten Basis-Synchronisierung:

- PR #3 nicht unabhängig als releasefertig behandeln
- PR #11 bleibt Draft und historischer Mittellayer
- PR #13 bleibt Draft und ist die einzige aktuelle Release-Arbeitsfläche
- keine direkte Retarget-/Force-Push-Aktion nur zum kosmetischen Aufräumen
- keine der zwei späteren Main-Änderungen verlieren
- nach jeder echten Basisintegration neue CI-/Browser-/PWA-/Regression-Evidence auf dem neuen Commit

Erst wenn die Stack-Basis mit `main` reconciled und die resultierende Commitkette geprüft ist, darf eine endgültige Merge-Strategie festgelegt werden.

## 4. Verbindlicher normaler PR-Check

Workflow:

- Name: `Secret Circle CI`
- Datei: `.github/workflows/ci.yml`
- Job: `validate`
- gewünschter Required-Check-Kontext: **`Secret Circle CI / validate`**

Der Job muss echten Checkout und alle vorgesehenen Repository-Schritte ausführen. Ein GitHub-Job mit `steps: []` gilt **nicht** als bestandener Required Check.

Aktueller v64-Nachweis: Run #3608 / Job `99103557030` endete erneut mit `steps: []`, `runner_id: 0` und leerem Runner-Namen. Kein Repositorycode wurde ausgeführt.

## 5. Cross-Browser ist Release-Gate, aber derzeit kein permanenter PR-Required-Check

Workflow:

- Name: `Secret Circle Cross-Browser Smoke`
- Datei: `.github/workflows/cross-browser.yml`
- Job: `smoke`
- Trigger aktuell: `workflow_dispatch`

Dieser Workflow ist für Release Candidate / Releasefreigabe zwingend, läuft aber nicht automatisch für jeden Pull Request. Solange das so bleibt, darf `Secret Circle Cross-Browser Smoke / smoke` **nicht** als dauerhaft erforderlicher PR-Check konfiguriert werden.

Vor RC muss der Cross-Browser-Workflow auf dem **exakten unveränderten RC-Commit** manuell grün ausgeführt und dokumentiert werden.

## 6. Reproduzierbarer Installationsvertrag

`package-lock.json` liegt als Lockfile v3 vor.

Beide Workflows verwenden:

```bash
npm ci --ignore-scripts --no-audit --no-fund
```

`actions/setup-node` nutzt den npm-Cache auf Basis des Lockfiles.

`scripts/lockfile_contract_audit.py` schützt:

- Root-Package/Version/Engine/Dev-Dependency-Synchronität
- minimale Paketmenge
- exakte Playwright-Version 1.54.2
- optionales `fsevents` 2.3.2
- Registry-URLs und `sha512`-Integrities
- `npm ci` in normalem und Cross-Browser-Workflow

Ein echter Online-`npm ci`-PASS auf dem unveränderten Commit bleibt erforderlich und wird nicht durch die Existenz des Lockfiles ersetzt.

## 7. Empfohlene Branch-Protection-Regeln

Für den stabilen Zielzweig vor öffentlichem Release:

- Änderungen nur über Pull Request
- mindestens `Secret Circle CI / validate` als Required Check
- Branch muss vor Merge mit der gewählten GitHub-Regel kompatibel/aktuell sein
- direkte Force-Pushes deaktivieren
- Branch-Löschung deaktivieren
- offene Review-Threads vor Merge auflösen
- Administrator-/Bypass-Ausnahmen so klein wie praktisch halten
- Merge erst nach vollständiger `RELEASE_CHECKLIST.md`

Ein Mindestreview durch eine zweite reale Person ist sinnvoll, falls vor Release eine zweite berechtigte Person verfügbar ist. Dieser Punkt wird nicht als bereits eingerichtet behauptet.

## 8. Merge-Grenze für PR #13

Unabhängig von GitHub-Einstellungen gilt:

1. Stack-Basis zuerst kontrolliert mit aktuellem `main` reconciliieren.
2. PR #13 bleibt Draft bis Release-Gates erfüllt sind.
3. Kein Merge bei `steps: []`.
4. Kein Merge ohne grünes Online-`npm ci` auf unverändertem Commit.
5. Kein Merge ohne grünen `npm run ci` auf demselben Commit.
6. Kein Merge ohne grünen manuellen Cross-Browser-Lauf auf demselben RC-Commit.
7. Kein Merge ohne echte Branch-Protection-Abnahme.
8. Kein Merge ohne HTTPS-Staging-/PWA-/Device-/Accessibility-/Gruppenabnahme.
9. Kein Merge ohne finalen Legal-/Asset-/Support-Sign-off.

## 9. Aktuelle externe/strukturelle Blocker

### Extern

`CI_TROUBLESHOOTING.md` dokumentiert wiederholte Actions-Jobs mit `steps: []`. Solange kein echter Runner Repository-Schritte ausführt, kann die gewünschte Required-Check-Regel technisch vorbereitet, aber nicht belastbar als funktionierend abgenommen werden.

### Strukturell

Die PR-Stack-Basis enthält die zwei späteren `main`-Commits nicht in ihrer Abstammung. Das muss vor RC/Merge kontrolliert aufgelöst werden. Dieser Punkt ist unabhängig vom Hosted-Runner-Problem.

## 10. Abnahmeprotokoll

```text
Protected branch:
Protection verified at:
Current main reconciled into release stack: yes/no
Main reconciliation commit/review:
Pull requests required: yes/no
Required check contexts:
Force pushes blocked: yes/no
Branch deletion blocked: yes/no
Review conversation resolution required: yes/no
Admin/bypass rules reviewed: yes/no
Test PR used for verification:
Successful npm ci run:
Successful CI run:
Successful RC cross-browser run:
Verifier:
Evidence reference:
```

## 11. Release-Gate

`BRANCH PROTECTION PASS` erst wenn:

- [ ] tatsächlicher stabiler Zielbranch festgelegt
- [ ] aktueller `main` kontrolliert in die Release-/PR-Stack-Basis integriert oder eine äquivalente geprüfte Merge-Strategie abgeschlossen
- [ ] die zwei späteren Main-Änderungen nachweislich erhalten
- [ ] Pull-Request-Pflicht in GitHub bestätigt
- [ ] `Secret Circle CI / validate` als Required Check bestätigt
- [ ] Required Check auf echtem Runner mindestens einmal erfolgreich durchgelaufen
- [ ] Force-Push-/Löschregeln geprüft
- [ ] Review-/Bypass-Regeln geprüft
- [x] Lockfile/`npm ci` im Workflow technisch aktiv
- [ ] Online-`npm ci` auf unverändertem Commit grün
- [ ] RC-Cross-Browser-Lauf separat grün dokumentiert
- [ ] `release-evidence.json.gates.branchProtection = PASS` mit demselben RC-Commit und echter Evidence
- [ ] `Evidence-Status` in diesem Dokument auf `PASS` aktualisiert

Solange diese Punkte nicht real erfüllt sind, bleibt `Evidence-Status: OPEN` und Branch Protection **RELEASE NO_GO**.
