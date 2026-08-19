# Secret Circle – Release-Evidence-Vertrag

Stand: 19. August 2026  
Status: **PREPARED – kein Release Candidate eingefroren**

## 1. Zweck

`release-evidence.json` ist die maschinenlesbare Freigabeakte für einen späteren Secret-Circle-Release. Sie verhindert, dass CI, Staging, Geräte, Accessibility, Gruppentests, Rechte und Legal auf unterschiedlichen Commits bestanden werden und anschließend trotzdem gemeinsam als Releasebeweis gelten.

**Ein grüner Einzeltest ist kein Release-PASS.** Die finale Freigabe benötigt Belege für denselben unveränderten Release-Candidate-Commit.

## 2. Aktueller Zustand

Die Datei ist derzeit nur ein Template:

- `evidenceStatus = PREPARED`
- `releaseDecision = NO_GO`
- kein RC-Commit
- kein Release-Tag
- keine Staging-/Production-URL
- reale Gates bleiben `OPEN` oder `BLOCKED`

Es werden keine Run-IDs, Geräteprüfungen, URLs, Zeitpunkte oder Sign-offs erfunden.

## 3. Kandidatenidentität

Sobald ein RC eingefroren wird, müssen mindestens feststehen:

- vollständiger 40-stelliger Git-Commit-SHA
- Release-Tag
- App-Version
- PWA-Cachegeneration
- getrennte HTTPS-Staging-Origin
- Zeitpunkt des Freeze

Nach einem Codefix ist der alte Evidence-Satz nicht auf den neuen Commit übertragbar. Es entsteht ein neuer RC beziehungsweise die betroffenen Gates werden erneut ausgeführt.

## 4. Pflichtgates

`release-evidence.json` führt folgende Gates:

1. `ci`
2. `crossBrowser`
3. `branchProtection`
4. `stagingHttpSmoke`
5. `pwaUpgradeRollback`
6. `android`
7. `ios`
8. `tablet`
9. `accessibility`
10. `groups`
11. `contentPrivacyReference`
12. `assetsThirdParty`
13. `legalPrivacy`
14. `supportIncident`
15. `productionSmoke`

Für einen öffentlichen `GO` müssen alle Pflichtgates `PASS` sein.

## 5. Evidence-Felder

Ein Gate mit `PASS` benötigt:

- denselben `commit` wie der Release Candidate
- ein nicht-leeres `evidence`-Objekt oder eine belastbare Referenz

Beispiele für Evidence:

- CI: Workflow Run-ID/URL, Resultat, Required Check
- Cross-Browser: Workflow Run-ID/URL, Chromium/Firefox/WebKit
- Branch Protection: dokumentierte GitHub-Einstellung / Screenshot- oder Adminnachweis
- Staging: HTTPS-URL + `staging_smoke.py` Ergebnis
- PWA: Ausgangsversion, Zielcache, Rollbackversion und Ergebnis
- Geräte: Modell, OS, Browser, getestete Flows
- Accessibility: VoiceOver/TalkBack/Zoom/Tastatur-Testbogen
- Gruppen: G1–G5/PN1–PN3 Testprotokolle und offene Bugs
- Content/Rechte: finale Review-/Auditnachweise
- Assets: Provenienz und Root-SVG-Rechtebasis
- Legal: Betreiber/Hosting/Privacy/Impressum-Sign-off
- Support/Incident: Kontakt, Verantwortliche, Drill
- Production: finaler HTTPS-/PWA-Smoke auf genau dem freigegebenen Stand

## 6. Statuswerte

Zulässig:

- `OPEN`
- `BLOCKED`
- `PASS`
- `FAIL`

`PREPARED` ist nur der Gesamtstatus des noch nicht eingefrorenen Evidence-Templates, kein Gate-PASS.

## 7. GO-Regel

`releaseDecision = GO` ist nur zulässig, wenn:

- `evidenceStatus = FINAL`
- vollständiger RC-Commit/Tag/Cache/URLs vorhanden
- alle Pflichtgates `PASS`
- jeder Gate-Commit exakt dem RC-Commit entspricht
- kein leerer PASS-Beleg vorhanden ist
- keine bekannten Critical/High-Blocker verbleiben

Andernfalls bleibt `releaseDecision = NO_GO`.

## 8. Verbindung zu anderen Releaseverträgen

Die Evidence-Akte ersetzt keine Detaildokumente. Sie verweist auf deren realen Nachweis:

- `RELEASE_CHECKLIST.md`
- `CI_TROUBLESHOOTING.md`
- `BRANCH_PROTECTION.md`
- `ENVIRONMENTS.md`
- `DEPLOYMENT.md`
- `BETA_TEST_PLAN.md`
- `ACCESSIBILITY.md`
- `THIRD_PARTY_NOTICES.md`
- `LEGAL_CHECKLIST.md`
- `SUPPORT.md`
- `INCIDENT_RESPONSE.md`

## 9. Automatischer Vertrag

`scripts/release_evidence_audit.py` validiert Schema, Gate-Menge, Statuswerte, RC-Bindung und die strenge GO-Regel. Der Audit darf das aktuelle Template als **NO_GO/PREPARED** akzeptieren, aber keinen unvollständigen Evidence-Satz als Release-PASS.

## 10. Aktuelle Freigabe

**NO_GO.** Die Datei ist absichtlich unvollständig, bis ein echter unveränderter RC mit realen Nachweisen existiert.
