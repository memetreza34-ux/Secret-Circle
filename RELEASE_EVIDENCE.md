# Secret Circle – Release-Evidence-Vertrag

Stand: 25. August 2026  
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

Zusätzlich existiert `operator-release.json` als eigene maschinenlesbare Akte für Betreiber, Hosting, Legal, Support und Incident Response. Sie steht bewusst auf `PREPARED / BLOCKED`.

Es werden keine Run-IDs, Geräteprüfungen, URLs, Betreiberangaben, Zeitpunkte oder Sign-offs erfunden.

## 3. Kandidatenidentität

Sobald ein RC eingefroren wird, müssen mindestens feststehen:

- vollständiger 40-stelliger Git-Commit-SHA
- Release-Tag
- App-Version
- PWA-Cachegeneration
- getrennte HTTPS-Staging-Origin
- Production-Origin
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

## 6. Operator-Gate

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

## 7. Statuswerte

Zulässig für Release-Gates:

- `OPEN`
- `BLOCKED`
- `PASS`
- `FAIL`

`PREPARED` ist nur der Gesamtstatus des noch nicht eingefrorenen Evidence-Templates, kein Gate-PASS.

## 8. GO-Regel

`releaseDecision = GO` ist nur zulässig, wenn:

- `evidenceStatus = FINAL`
- vollständiger RC-Commit/Tag/Cache/URLs vorhanden
- alle Pflichtgates `PASS`
- jeder Gate-Commit exakt dem RC-Commit entspricht
- kein leerer PASS-Beleg vorhanden ist
- `operator-release.json = FINAL / READY`
- keine bekannten Critical/High-Blocker verbleiben

Andernfalls bleibt `releaseDecision = NO_GO`.

## 9. Verbindung zu anderen Releaseverträgen

Die Evidence-Akte ersetzt keine Detaildokumente. Sie verweist auf deren realen Nachweis:

- `RELEASE_CHECKLIST.md`
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

## 10. Automatischer Vertrag

- `scripts/release_evidence_audit.py` validiert Schema, Gate-Menge, Statuswerte, RC-Bindung und die strenge GO-Regel.
- `scripts/operator_release_contract_audit.py` validiert Operator-/Hosting-/Support-/Incident-Status und die Kopplung zu `legalPrivacy`/`supportIncident`.
- `scripts/release_readiness_contract_audit.py` verlangt beide Vertragswelten gemeinsam.

Die Audits dürfen das aktuelle Template als **NO_GO/PREPARED** akzeptieren, aber keinen unvollständigen Evidence-Satz als Release-PASS.

## 11. Aktuelle Freigabe

**NO_GO.** `release-evidence.json` und `operator-release.json` sind absichtlich unvollständig, bis ein echter unveränderter RC mit realen Nachweisen existiert.
