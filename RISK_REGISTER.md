# Secret Circle – Risk Register

Stand: 29. August 2026

## 1. Zweck

Ein Risiko gilt erst geschlossen, wenn ein überprüfbarer Nachweis existiert. Source-seitig geschlossene Teilrisiken dürfen nicht mit einem finalen Release-PASS verwechselt werden.

### Priorität

- P0: Releaseblocker / sofort
- P1: vor Release zwingend schließen
- P2: vor Release bewerten oder mindern
- P3: beobachten / später

## 2. Aktuelle Risiken

| ID | Risiko | Bereich | Wahrscheinlichkeit | Auswirkung | Priorität | Gegenmaßnahme | Status / Nachweis |
|---|---|---|---|---|---|---|---|
| R-001 | GitHub Actions startet keinen belastbaren Repository-Job | CI/Release | hoch | kritisch | P0 | echten Checkout + `npm run ci` dokumentieren | **OFFEN – wiederholt `steps: []`, `runner_id: 0`; Issue #7** |
| R-002 | Reproduzierbarer npm-Install ist auf echtem Runner nicht bestätigt | Build/Supply Chain | mittel | hoch | P1 | Lockfile v3 + `npm ci` + Runnernachweis | **CLOSED IN CODE / ONLINE VERIFICATION OPEN** |
| R-003 | Branch Protection / Required Checks fehlen real | Git/Release | hoch | hoch | P1 | GitHub-Regel + funktionierenden Required Check aktivieren | **BLOCKED – main ungeschützt, Required Checks off** |
| R-004 | Timer weichen auf echten OS-/Sperrbildschirmpfaden ab | Geräte/PWA | mittel | hoch | P1 | Android + iPhone real | offen |
| R-005 | PWA-Upgrade beschädigt Offline-Core/lokale Session | PWA/Daten | mittel | kritisch | P1 | zwei Altversionen → RC + Rollback real | vorbereitet; real offen |
| R-006 | Private Rollen/Fragen werden beim Resume sichtbar | Privacy/Gameplay | niedrig-mittel | hoch | P1 | E2E + reale Übergaben | technisch gehärtet; real offen |
| R-007 | Quota-/Import-/Restore beschädigt lokale Daten | Daten | niedrig nach Hardening | kritisch | P1 | managed Snapshot/Rollback + echter Browser | technisch gehärtet; real offen |
| R-008 | Sessionabschluss zählt mehrfach | Daten/Statistik | niedrig | hoch | P1 | Completion-ID + Exact-once | technisch abgesichert; CI offen |
| R-009 | Core-Inhalte schwach/semantisch redundant | Content | mittel | hoch | P1 | Mengen-Gates + 15/15 Review + reale Sessions | quantitativ geschlossen; reale Langsessions offen |
| R-010 | Alters-/Safety-Einstufungen passen real nicht | Content/Safety | mittel | hoch | P1 | Policy + Quellreview + Gruppenabnahme | Quellpass vorbereitet; final offen |
| R-011 | Fan-/Marken-/Franchise-Inhalte erzeugen Rechte-Risiken | Recht/Content | niedrig nach Hardening | hoch | P1 | Source-Audit + manueller Visual/Marketing/Legal-Pass | stark gemindert; finaler manueller Review offen |
| R-012 | Betreiber-/Support-/Rechtsangaben unvollständig | Recht/Release | hoch | kritisch | P1 | echte Operator-/Kontakt-/Legal-Werte | **BLOCKED – reale Angaben fehlen** |
| R-013 | UI für Erstnutzer zu kompliziert | UX | mittel | hoch | P1 | Tests ohne Entwicklerhilfe | offen |
| R-014 | Design uneinheitlich/provisorisch | Design | mittel | mittel | P2 | Designsystem + reale Review | source-seitig verbessert; final offen |
| R-015 | Accessibilityprobleme bei Screenreader/Zoom/Touch | Accessibility | mittel | hoch | P1 | Contract/E2E + Realtests | Basis vorbereitet; real offen |
| R-016 | große Gruppen haben langsame/unklare Übergaben | UX/Group | mittel | mittel-hoch | P2 | 9–12-Personen-Test | offen |
| R-017 | Mafia-Balance real unklar | Gameplay | mittel | mittel | P2 | echte 8+-Sessions | offen |
| R-018 | Labs wirken releasegleichwertig | Produkt/UX | mittel | mittel | P2 | klare Reifestufen + Nutzerprüfung | Basis vorhanden |
| R-019 | Production-Hosting verhält sich anders als lokal | Deployment | mittel | hoch | P1 | getrenntes HTTPS-Staging + echter HTTP-Smoke | **Source-Hardening stark; reale Origin fehlt** |
| R-020 | Cache-/Release-Dokumente driften | Prozess | niedrig-mittel | mittel | P2 | dynamische Audits + Drift-Sweeps | laufend; aktueller v64-Sweep durchgeführt |
| R-021 | Dependency enthält Schwachstelle/Lizenzproblem | Supply Chain | niedrig-mittel | hoch | P2 | Lockfile, Inventar, Online-Install-/Integrity-Review | Paketkette inventarisiert; reale Online-Evidence offen |
| R-022 | Browser-/iOS-PWA-Änderungen bis RC | Plattform | mittel | mittel-hoch | P2 | Zielbrowser kurz vor RC erneut | beobachten |
| R-023 | Creator-Eingaben umgehen Limits/belasten Speicher | Creator/Security | niedrig-mittel | mittel-hoch | P2 | Limits, Fuzz, Quota, E2E | technisch weitgehend abgesichert |
| R-024 | Support-/Incidentprozess ungeprüft | Betrieb | mittel | hoch | P1 | echte Rollen/Kontakte + Probe-SEV-1 | Dokumente vorbereitet; Drill offen |
| R-025 | 55 Built-ins lenken vom Core 15 ab | Scope | mittel | hoch | P1 | Core/Extended/Labs + Feature-Freeze | kontrolliert; Core bleibt 15 |
| R-026 | Basisnutzen ist am Markt nicht einzigartig | Produkt/Markt | hoch | hoch | P2 | Hub-Tiefe, Resume/Privacy, Creator | Positionierung angepasst |
| R-027 | Älterer Complete-Restore besitzt/löscht zukünftige Secret-Circle-Namespaces | Daten/Forward Compatibility | niedrig nach Hardening | kritisch | P1 | exakte aktuelle **17-Key-Allowlist** + Future-Key-E2E | **CLOSED IN CODE / real offen** |
| R-028 | Backupkonstanten/Storageverträge driften zwischen Registry, Runtime und Tests | Security/Maintenance | niedrig | hoch | P1 | Registry als Quelle + Backup-Audit | CLOSED IN CODE / CI offen |
| R-029 | App-Icon-Rechtebasis ist ungeklärt | Recht/Supply Chain | sehr niedrig nach Ersatz | hoch | P1 | ungeklärtes Icon vollständig ersetzen + Provenienz/Hashes | **SOURCE RISK CLOSED – drei Release-Icons `verified-own`; Runner-/Finalreview offen** |
| R-030 | Support-/Legal-Platzhalter gelangen in Production | Recht/Betrieb | mittel | hoch | P1 | Placeholder-Audit + Production-Smoke | Audit vorbereitet; echte finale Angaben offen |
| R-031 | Content-/Offlinebudget wächst unkontrolliert | Performance/Architektur | niedrig | mittel | P1 | Performance-/Modulbudgets | technisch kontrolliert; Runnernachweis offen |
| R-032 | Release-Audits sind vorhanden, aber nicht tatsächlich ausgeführt | Recht/CI | hoch solange Runner blockiert | hoch | P1 | `npm run validate` auf unverändertem RC grün | **OFFEN – Actions erreicht keinen Step** |
| R-033 | PWA-Rastericons fehlen oder stimmen nicht mit Manifestgrößen überein | PWA/Assets | sehr niedrig | hoch | P1 | IHDR-/Hash-/Manifestprüfung | **CLOSED IN SOURCE – neue 192/512-Dateien + Hashvertrag; Runner/Staging offen** |
| R-034 | Staging-Smoke wird gegen falsche Origin/Cachegeneration/Commit ausgeführt | Deployment/Release | mittel | hoch | P1 | `--expected-cache`, RC-SHA, getrennte Origins | PREPARED – echter RC/Origin offen |
| R-035 | Private-Device-Prompts kehren in ausgelieferten Contentquellen zurück | Privacy/Content | niedrig | hoch | P1 | globaler Privacy-Audit + manueller Pass | CLOSED IN SOURCE / real offen |
| R-036 | Alte Audits verlangen historische Architektur und erzeugen falsche Releasefehler | Prozess/CI | niedrig | hoch | P1 | Foundation-/Readiness-Meta-Audits | CLOSED IN CODE / Runnernachweis offen |
| R-037 | Syntaktisch gültiger Backupwert trägt falsche Storage-Version/Pflichtstruktur | Daten/Integrity | niedrig | kritisch | P1 | key-spezifische Root-/Version-/Wrapper-Prüfung | CLOSED IN CODE / real offen |
| R-038 | Reconciliation-PR driftet nach Release-Hardening wieder hinter die Basis | Git/Release | mittel | hoch | P1 | vor Review/Merge Live-Compare, 9-Pfade-Scope, `behind_by=0` | **AKTUELL ERNEUT ZU SYNCHRONISIEREN** |
| R-039 | Source-Level-Asset-Provenienz wird fälschlich als finaler Marken-/Third-Party-PASS interpretiert | Recht/Release | niedrig-mittel | hoch | P1 | `assetsThirdParty` bis Runner-/Integrity-/Finalreview-Evidence BLOCKED halten | **MITIGIERT – Evidence-Datei unterscheidet Source-Resolution von Gate-PASS** |

## 3. Aktuelle Releaseblocker

1. **R-001** – Actions/Hosted Runner
2. **R-002/R-032** – Online-`npm ci` + reale Audit-/CI-Ausführung
3. **R-038** – PR #15 auf aktuellen Releasebranch synchronisieren
4. **R-003** – Branch Protection + Required Checks
5. **R-019/R-034** – echter Hostingprovider + HTTPS-Staging-/Production-Origin + Smoke
6. **R-004/R-005/R-007/R-027/R-037** – Geräte/PWA/Restore-/Rollback-Evidence
7. **R-009/R-010/R-013/R-015** – reale Content-/UX-/Accessibility-/Gruppenabnahme
8. **R-011/R-039** – finaler Marken-/Visual-/Third-Party-Review
9. **R-012/R-024/R-030** – Operator/Legal/Support/Incident

R-029, die konkrete frühere Icon-Rechtefrage, ist **nicht mehr selbst der offene Blocker**.

## 4. Build-/Supply-Chain-Fortschritt

- `package-lock.json` v3 vorhanden
- `@playwright/test` / `playwright` / `playwright-core` exakt 1.54.2
- optional `fsevents` exakt 2.3.2
- Registry-URLs + Integrity-Werte gelockt
- Lizenzen inventarisiert
- beide GitHub-Workflows auf `npm ci`
- `scripts/lockfile_contract_audit.py` in `npm run validate`

R-002 ist im Repositoryvertrag weitgehend geschlossen, aber erst nach echtem Online-Install auf einem funktionierenden Runner releaseverifiziert.

## 5. Asset-Fortschritt

Aktuelles Release-Media-Inventar bleibt exakt:

1. `icon.svg`
2. `icon-192.png`
3. `icon-512.png`

Alle drei stehen auf `verified-own`; Hashes, Dimensionen, Erstellungsweg und Ableitungsbeziehungen sind dokumentiert. Ein lokaler Reproduktionscheck des Assetvertrags ist konsistent.

Noch offen:

- Asset-/Media-Audits tatsächlich auf funktionierendem Runner/Checkout
- Online-Dependency-/Integrity-Evidence
- finaler manueller Visual-/Marken-/Third-Party-Plausibilitätsreview auf dem unveränderten RC

## 6. HTTPS-Staging

`scripts/staging_smoke.py` prüft echte ausgelieferte HTTPS-Ressourcen, Same-Origin-Redirects, Größenlimits, Manifest, PNG-Dimensionen, Cachegeneration, Response-Security-Header, Service-Worker-Cache-Policy sowie Privacy-/Reference-Verträge.

Cloudflare Pages ist technischer Preferred Candidate, aber noch nicht final ausgewählt. R-019/R-034 bleiben offen, solange keine reale Staging-Origin und kein unveränderter RC existieren.

## 7. Backup / Daten

Registry-Version 2 verwaltet aktuell **17 Storage-Keys**. Future-Namespace und Future-Version eines bekannten Keys bleiben außerhalb heutiger Restore-Eigentümerschaft. Managed Werte werden vor Mutation validiert; Rollback beschränkt sich auf managed Keys.

Reale Quota-/Forward-Compatibility-/Rollback-Evidence bleibt offen.

## 8. Schließregel

P0/P1 werden erst mit belastbarem Nachweis geschlossen, z. B. grünem unverändertem CI-Commit, Online-`npm ci`, Testreport, echtem HTTPS-Smoke auf dem RC, realem Gerät, realer Gruppe oder finalen Rechts-/Lizenzunterlagen.

„Code sieht richtig aus“ oder „Dokument existiert“ reicht nicht.
