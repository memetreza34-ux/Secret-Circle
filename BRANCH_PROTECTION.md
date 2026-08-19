# Secret Circle – Branch Protection und Required Checks

Stand: 19. August 2026  
Status: **PREPARED – GitHub-Einstellung selbst noch nicht belastbar bestätigt**

## 1. Ziel

Dieser Vertrag definiert, wie der stabile Secret-Circle-Releasezweig geschützt werden soll. Er beschreibt die gewünschte Repository-Konfiguration; er behauptet **nicht**, dass GitHub diese Einstellungen bereits aktiviert hat.

Aktueller PR-Basiszweig: `codex/party-hub-foundation`  
Arbeitszweig: `agent/release-foundation-2027`

PR #13 bleibt Draft und darf vor Erfüllung der Release-Gates nicht gemergt werden.

## 2. Verbindlicher normaler PR-Check

Workflow:

- Name: `Secret Circle CI`
- Datei: `.github/workflows/ci.yml`
- Job: `validate`
- gewünschter Required-Check-Kontext: **`Secret Circle CI / validate`**

Der Job muss echten Checkout und alle vorgesehenen Repository-Schritte ausführen. Ein GitHub-Job mit `steps: []` gilt **nicht** als bestandener Required Check, selbst wenn eine UI später einen anderen Status anzeigen sollte.

## 3. Cross-Browser ist Release-Gate, aber derzeit kein permanenter PR-Required-Check

Workflow:

- Name: `Secret Circle Cross-Browser Smoke`
- Datei: `.github/workflows/cross-browser.yml`
- Job: `smoke`
- Trigger aktuell: `workflow_dispatch`

Dieser Workflow ist für Release Candidate / Releasefreigabe zwingend, läuft aber nicht automatisch für jeden Pull Request. Solange das so bleibt, darf `Secret Circle Cross-Browser Smoke / smoke` **nicht** als dauerhaft erforderlicher PR-Check konfiguriert werden, weil normale PRs sonst ohne automatisch erzeugten Check blockieren könnten.

Vor RC muss der Cross-Browser-Workflow auf dem **exakten unveränderten RC-Commit** manuell grün ausgeführt und dokumentiert werden.

Falls Cross-Browser später auf `pull_request` umgestellt wird, darf die Required-Check-Entscheidung neu bewertet werden.

## 4. Empfohlene Branch-Protection-Regeln

Für den stabilen Zielzweig vor öffentlichem Release:

- Änderungen nur über Pull Request
- mindestens ein erfolgreicher Required Check: `Secret Circle CI / validate`
- Branch muss vor Merge aktuell beziehungsweise mit der gewählten GitHub-Regel kompatibel sein
- direkte Force-Pushes deaktivieren
- Branch-Löschung deaktivieren
- offene Review-Threads vor Merge auflösen
- Administrator-/Bypass-Ausnahmen so klein wie praktisch halten
- Merge erst nach vollständiger `RELEASE_CHECKLIST.md`

Ein Mindestreview durch eine zweite reale Person ist sinnvoll, falls vor Release eine zweite berechtigte Person verfügbar ist. Dieser Punkt wird nicht als bereits eingerichtet behauptet.

## 5. Merge-Grenze für PR #13

Unabhängig von GitHub-Einstellungen gilt für PR #13:

1. PR bleibt Draft bis Release-Gates erfüllt sind.
2. Kein Merge bei `steps: []`.
3. Kein Merge ohne echtes `package-lock.json` und finalen `npm ci`-Workflow.
4. Kein Merge ohne grünen `npm run ci` auf unverändertem Commit.
5. Kein Merge ohne grünen manuellen Cross-Browser-Lauf auf demselben RC-Commit.
6. Kein Merge ohne reale PWA-/Device-/Accessibility-/Gruppenabnahme.
7. Kein Merge ohne finalen Legal-/Asset-/Support-Sign-off.

## 6. Lockfile-Übergang

Aktuell fehlt `package-lock.json`. Deshalb verwendet `.github/workflows/ci.yml` vorläufig eine Installation ohne Lockfile.

Sobald ein echtes, geprüftes Lockfile vorliegt:

- Workflow auf `npm ci` umstellen
- Cross-Browser-Workflow ebenfalls auf `npm ci` umstellen
- neuen unveränderten Commit vollständig testen
- erst danach Required-Check-Konfiguration als Release-Nachweis akzeptieren

Keine Integrity-Werte oder Lockfile-Inhalte manuell erfinden.

## 7. Aktueller externer Blocker

`CI_TROUBLESHOOTING.md` dokumentiert aktuell wiederholte Actions-Jobs mit `steps: []`. Solange kein echter Runner Repository-Schritte ausführt, kann die gewünschte Required-Check-Regel technisch vorbereitet, aber nicht belastbar als funktionierend abgenommen werden.

## 8. Abnahmeprotokoll

Vor Schließung des Branch-Protection-Gates dokumentieren:

```text
Protected branch:
Protection verified at:
Pull requests required: yes/no
Required check contexts:
Force pushes blocked: yes/no
Branch deletion blocked: yes/no
Review conversation resolution required: yes/no
Admin/bypass rules reviewed: yes/no
Test PR used for verification:
Successful CI run:
Successful RC cross-browser run:
Verifier:
```

## 9. Release-Gate

`BRANCH PROTECTION PASS` erst wenn:

- [ ] tatsächlicher stabiler Zielbranch festgelegt
- [ ] Pull-Request-Pflicht in GitHub bestätigt
- [ ] `Secret Circle CI / validate` als Required Check bestätigt
- [ ] Required Check auf echtem Runner mindestens einmal erfolgreich durchgelaufen
- [ ] Force-Push-/Löschregeln geprüft
- [ ] Review-/Bypass-Regeln geprüft
- [ ] Lockfile/`npm ci` im finalen Workflow aktiv
- [ ] RC-Cross-Browser-Lauf separat grün dokumentiert

Bis dahin bleibt Branch Protection **OPEN / RELEASE NO_GO**.
