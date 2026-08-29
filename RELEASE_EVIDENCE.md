# Secret Circle – Release-Evidence-Vertrag

Stand: 29. August 2026  
Status: **PREPARED – kein Release Candidate eingefroren**

## 1. Zweck

`release-evidence.json` ist die maschinenlesbare Freigabeakte für einen späteren Secret-Circle-Release. Sie verhindert, dass CI, Staging, Geräte, Accessibility, Gruppentests, Rechte und Legal auf unterschiedlichen Commits bestanden werden und anschließend trotzdem gemeinsam als Releasebeweis gelten.

`release-meta.json` enthält zusätzlich den **aktuellen nicht-finalen Arbeitsstand** für Source-Generation, Cachegeneration, Spielzahlen, Wave-1-Status, Arbeitsbranch, PR und bekannten CI-Blocker. Diese Datei ist eine Synchronisationshilfe und **kein Releasebeweis**.

**Ein grüner Einzeltest ist kein Release-PASS.** Die finale Freigabe benötigt Belege für denselben unveränderten Release-Candidate-Commit.

## 2. Aktueller Arbeitsstand

Laut `release-meta.json`:

- Source-Generation: **v64**
- Package-Version: **1.0.0-beta.3**
- Offline-Cache: **`secret-circle-v64`**
- Staging-Cache: **`secret-circle-v64-staging`**
- Built-ins: **55 · 15 Core / 13 Extended / 27 Labs**
- Expansion Wave 1: **10/10 source-implemented, real evidence OPEN**
- Arbeitsbranch: `agent/release-foundation-2027`
- Draft-PR: **#13**
- Releaseentscheidung: **NO_GO**

Dieser Arbeitsstand darf sich bis zum Freeze noch ändern. Er darf nicht mit der späteren unveränderlichen RC-Identität verwechselt werden.

## 3. Aktueller Evidence-Zustand

`release-evidence.json` ist derzeit nur ein vorbereitetes Template:

- `evidenceStatus = PREPARED`
- `releaseDecision = NO_GO`
- kein RC-Commit
- kein Release-Tag
- keine Staging-/Production-URL
- reale Gates bleiben `OPEN` oder `BLOCKED`

Zusätzlich existiert `operator-release.json` als eigene maschinenlesbare Akte für Betreiber, Hosting, Legal, Support und Incident Response. Sie steht bewusst auf `PREPARED / BLOCKED`.

Es werden keine Run-IDs, Geräteprüfungen, URLs, Betreiberangaben, Zeitpunkte oder Sign-offs erfunden.

## 4. Aktueller CI-Blocker

Der zuletzt konkret untersuchte v64-Actions-Lauf ist **Run #3608**:

- Run-ID `33253663445`
- Job-ID `99103557030`
- Head `2297868e1f65b45753294151a3b1f401a55f6288`
- `failure`
- `steps: []`
- `runner_id: 0`
- `runner_name: ""`
- kein Repositorycode ausgeführt

Damit bleibt das CI-Gate **BLOCKED**. Dieser Lauf ist kein negativer App-Code-Test, weil der Job keinen Hosted Runner/Workflow-Step erreicht hat.

## 5. Kandidatenidentität

Sobald ein RC eingefroren wird, müssen mindestens feststehen:

- vollständiger 40-stelliger Git-Commit-SHA
- Release-Tag
- App-Version
- PWA-Cachegeneration
- getrennte HTTPS-Staging-Origin
- Production-Origin
- Zeitpunkt des Freeze

Nach einem Codefix ist der alte Evidence-Satz nicht auf den neuen Commit übertragbar. Es entsteht ein neuer RC beziehungsweise die betroffenen Gates werden erneut ausgeführt.

`release-meta.json` kann bei Freeze als Quelle für den aktuellen Arbeitsstand dienen, aber `release-evidence.json` muss anschließend explizit an den tatsächlichen unveränderten RC gebunden werden.

## 6. Pflichtgates

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

Wave-1-Labs werden zusätzlich in der Detail-Evidence aus `RELEASE_CHECKLIST.md`/Issue #8 geprüft. Ihre Source-Implementierung erweitert den Core nicht automatisch.

## 7. Evidence-Felder

Ein Gate mit `PASS` benötigt:

- denselben `commit` wie der Release Candidate
- ein nicht-leeres `evidence`-Objekt oder eine belastbare Referenz

Beispiele:

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
- Legal/Privacy: `operator-release.json = FINAL / READY`, finaler Betreiber-/Hosting-/Privacy-Sign-off und öffentliche Legal-Flächen
- Support/Incident: `operator-release.json = FINAL / READY`, getesteter Kontakt/Securityweg, reale Verantwortliche, Probe-Supportfall, SEV-1- und Rollback-Drill
- Production: finaler HTTPS-/PWA-Smoke auf genau dem freigegebenen Stand

## 8. Operator-Gate

`operator-release.json` ist der zentrale Untervertrag für die beiden Release-Gates `legalPrivacy` und `supportIncident`.

Diese Release-Gates dürfen erst `PASS` werden, wenn:

- `operator-release.json.evidenceStatus = FINAL`
- `operator-release.json.operatorGate = READY`
- reale Betreiber-/Kontaktangaben vorhanden sind
- Hostingprovider, Staging-/Production-Origin und Log-/Privacybedingungen final sind
- Support- und Securitywege praktisch getestet wurden
- reale Incident-Verantwortliche feststehen
- Probe-Supportfall, SEV-1-Drill und Rollback-Drill abgeschlossen sind
- finale Rechts-/Privacy-Plausibilisierung dokumentiert ist

`scripts/operator_release_contract_audit.py` erzwingt diese Beziehung und verhindert, dass `legalPrivacy` oder `supportIncident` auf `PASS` stehen, während die Operator-Akte noch blockiert ist.

## 9. Statuswerte

Zulässig für Release-Gates:

- `OPEN`
- `BLOCKED`
- `PASS`
- `FAIL`

`PREPARED` ist nur der Gesamtstatus des noch nicht eingefrorenen Evidence-Templates, kein Gate-PASS.

## 10. GO-Regel

`releaseDecision = GO` ist nur zulässig, wenn:

- `evidenceStatus = FINAL`
- vollständiger RC-Commit/Tag/Cache/URLs vorhanden
- alle Pflichtgates `PASS`
- jeder Gate-Commit exakt dem RC-Commit entspricht
- kein leerer PASS-Beleg vorhanden ist
- `operator-release.json = FINAL / READY`
- keine bekannten Critical/High-Blocker verbleiben
- Root-`icon.svg` Rechtebasis belegt oder das Asset vollständig ersetzt ist
- Branch Protection / Required Checks real verifiziert sind

Andernfalls bleibt `releaseDecision = NO_GO`.

## 11. Verbindung zu anderen Releaseverträgen

Die Evidence-Akte ersetzt keine Detaildokumente. Sie verweist auf deren realen Nachweis:

- `release-meta.json` – aktueller Arbeitsstand, kein PASS-Beleg
- `RELEASE_CHECKLIST.md`
- `RELEASE_SCOPE_2027.md`
- `RELEASE_STATUS.md`
- `CI_TROUBLESHOOTING.md`
- `BRANCH_PROTECTION.md`
- `ENVIRONMENTS.md`
- `DEPLOYMENT.md`
- `BETA_TEST_PLAN.md`
- `ACCESSIBILITY.md`
- `THIRD_PARTY_NOTICES.md`
- `ASSET_RIGHTS_SIGNOFF.md`
- `LEGAL_CHECKLIST.md`
- `operator-release.json`
- `OPERATOR_RELEASE_SIGNOFF.md`
- `HOSTING_DECISION.md`
- `SUPPORT.md`
- `INCIDENT_RESPONSE.md`

## 12. Automatischer Vertrag

- `scripts/release_evidence_audit.py` validiert Schema, Gate-Menge, Statuswerte, RC-Bindung und die strenge GO-Regel.
- `scripts/operator_release_contract_audit.py` validiert Operator-/Hosting-/Support-/Incident-Status und die Kopplung zu `legalPrivacy`/`supportIncident`.
- `scripts/release_readiness_contract_audit.py` verlangt beide Vertragswelten gemeinsam.

Die Audits dürfen das aktuelle Template als **NO_GO/PREPARED** akzeptieren, aber keinen unvollständigen Evidence-Satz als Release-PASS.

## 13. Aktuelle Freigabe

**NO_GO.** `release-evidence.json` und `operator-release.json` sind absichtlich unvollständig, bis ein echter unveränderter RC mit realen Nachweisen existiert. `release-meta.json` dokumentiert lediglich den aktuellen v64-Arbeitsstand und darf diese Freigabe nicht überschreiben.
