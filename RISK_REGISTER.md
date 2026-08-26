# Secret Circle – Risk Register

Stand: 26. August 2026

## 1. Zweck

Ein Risiko gilt erst geschlossen, wenn ein überprüfbarer Nachweis existiert.

### Priorität

- P0: Releaseblocker / sofort
- P1: vor Release zwingend schließen
- P2: vor Release bewerten oder mindern
- P3: beobachten / später

## 2. Aktuelle Risiken

| ID | Risiko | Bereich | Wahrscheinlichkeit | Auswirkung | Priorität | Gegenmaßnahme | Status / Nachweis |
|---|---|---|---|---|---|---|---|
| R-001 | GitHub Actions startet keinen belastbaren Repository-Job | CI/Release | hoch | kritisch | P0 | echten Checkout + `npm run ci` dokumentieren | **OFFEN – wiederholt `steps: []`; Details in `CI_TROUBLESHOOTING.md`** |
| R-002 | Reproduzierbarer npm-Install ist auf echtem Runner nicht bestätigt | Build/Supply Chain | mittel | hoch | P1 | Lockfile v3 + `npm ci` + Runnernachweis | **CLOSED IN CODE / ONLINE VERIFICATION OPEN – Lockfile vorhanden, beide Workflows auf `npm ci`** |
| R-003 | Branch Protection / Required Checks nicht bestätigt | Git/Release | mittel | hoch | P1 | `BRANCH_PROTECTION.md` + GitHub-Konfiguration | **PREPARED / reale GitHub-Einstellung offen** |
| R-004 | Timer weichen auf echten OS-/Sperrbildschirmpfaden ab | Geräte/PWA | mittel | hoch | P1 | Android + iPhone real | offen |
| R-005 | PWA-Upgrade beschädigt Offline-Core/lokale Session | PWA/Daten | mittel | kritisch | P1 | zwei Altversionen→v51/RC + Rollback real | **offen; v51-Core/Promotion-Vertrag vorbereitet** |
| R-006 | Private Rollen/Fragen werden beim Resume sichtbar | Privacy/Gameplay | niedrig-mittel | hoch | P1 | E2E + reale Übergaben | technisch gehärtet; real offen |
| R-007 | Quota-/Import-/Restore beschädigt lokale Daten | Daten | niedrig nach v51 | kritisch | P1 | managed Snapshot/Rollback + BK51 + echter Browser | **v51 stark gehärtet; realer Browser-/Quota-Nachweis offen** |
| R-008 | Sessionabschluss zählt mehrfach | Daten/Statistik | niedrig | hoch | P1 | Completion-ID + Exact-once | technisch abgesichert; CI offen |
| R-009 | Core-Inhalte schwach/semantisch redundant | Content | mittel | hoch | P1 | Mengen-Gates + 15/15 Review + reale Sessions | quantitativ geschlossen; reale Langsessions offen |
| R-010 | Alters-/Safety-Einstufungen passen real nicht | Content/Safety | mittel | hoch | P1 | Policy + Quellreview + Gruppenabnahme | Quellpass vorbereitet; final offen |
| R-011 | Fan-/Marken-/Franchise-Inhalte erzeugen Rechte-Risiken | Recht/Content | niedrig nach Hardening | hoch | P1 | Source-Audit + manueller Visual/Marketing/Legal-Pass | stark gemindert; finale manuelle/rechtliche Abnahme offen |
| R-012 | Betreiber-/Support-/Rechtsangaben unvollständig | Recht/Release | mittel | kritisch | P1 | Legal/Support + echte Angaben | Dokumente vorbereitet; reale Angaben offen |
| R-013 | UI für Erstnutzer zu kompliziert | UX | mittel | hoch | P1 | Tests ohne Entwicklerhilfe | offen |
| R-014 | Design uneinheitlich/provisorisch | Design | mittel | mittel | P2 | Designsystem + reale Review | Hero/Touchziele verbessert |
| R-015 | Accessibilityprobleme bei Screenreader/Zoom/Touch | Accessibility | mittel | hoch | P1 | Contract/E2E + Realtests | Basis vorbereitet; real offen |
| R-016 | große Gruppen haben langsame/unklare Übergaben | UX/Group | mittel | mittel-hoch | P2 | 9–12-Personen-Test | offen |
| R-017 | Mafia-Balance real unklar | Gameplay | mittel | mittel | P2 | echte 8+-Sessions | offen |
| R-018 | Labs wirken releasegleichwertig | Produkt/UX | mittel | mittel | P2 | klare Reifestufen + Nutzerprüfung | Basis vorhanden |
| R-019 | Production-Hosting verhält sich anders als lokal | Deployment | mittel | hoch | P1 | getrenntes HTTPS-Staging + reproduzierbarer HTTP-Smoke | **stark gemindert: `staging_smoke.py` vorbereitet; echte Origin/Netzwerkausführung offen** |
| R-020 | Cache-/Release-Dokumente driften | Prozess | niedrig | mittel | P2 | dynamische Audits + synchronisierte Docs | **stark gemindert: v51-Verträge synchronisiert; laufender Drift-Sweep nötig** |
| R-021 | Dependency enthält Schwachstelle/Lizenzproblem | Supply Chain | niedrig-mittel | hoch | P2 | Lockfile, Audit, Third-Party-Inventar | **gelockte Paketkette inventarisiert; Lizenzen verifiziert; Online-Install/Vulnerability-Review vor RC offen** |
| R-022 | Browser-/iOS-PWA-Änderungen bis RC | Plattform | mittel | mittel-hoch | P2 | Zielbrowser kurz vor RC erneut | beobachten |
| R-023 | Creator-Eingaben umgehen Limits/belasten Speicher | Creator/Security | niedrig-mittel | mittel-hoch | P2 | Limits, Fuzz, Quota, E2E | technisch weitgehend abgesichert |
| R-024 | Support-/Incidentprozess ungeprüft | Betrieb | mittel | hoch | P1 | echte Rollen/Kontakte + Probe-SEV-1 | Dokumente vorbereitet; Drill offen |
| R-025 | 45 Spiele lenken von Core 15 ab | Scope | mittel | hoch | P1 | Core/Extended/Labs priorisieren | kontrolliert |
| R-026 | Basisnutzen ist am Markt nicht einzigartig | Produkt/Markt | hoch | hoch | P2 | Hub-Tiefe, Resume/Privacy, Creator | Positionierung angepasst |
| R-027 | Älterer Complete-Restore besitzt oder löscht zukünftige Secret-Circle-Namespaces/Storage-Versionen | Daten/Forward Compatibility | niedrig nach v51 | kritisch | P1 | exakte aktuelle 16-Key-Allowlist + Future-Key-E2E | **CLOSED IN CODE / BK51 + Cross-Browser real offen** |
| R-028 | Backupkonstanten/Storageverträge driften zwischen Registry, Runtime und Tests | Security/Maintenance | niedrig nach v51 | hoch | P1 | Registry als Quelle + `backup_contract_audit.py` | **CLOSED IN CODE / CI offen** |
| R-029 | Rechtebasis des Root-App-Icons ist nicht final bestätigt | Recht/Supply Chain | mittel | hoch | P1 | SVG-Urheber/Rechtebasis menschlich bestätigen | **OFFEN – Rasterherkunft/Größen belegt; `icon.svg` rights-unresolved** |
| R-030 | Support-/Legal-Platzhalter gelangen in Production | Recht/Betrieb | mittel | hoch | P1 | Placeholder-Audit + Production-Smoke | Audit vorbereitet; echte finale Angaben offen |
| R-031 | Classic-Content überschreitet Modul-/Offlinebudget | Performance/Architektur | sehr niedrig | mittel | P1 | 45-KB-Budget im Performance-Audit | technisch kontrolliert; Runnernachweis offen |
| R-032 | Release-Audits sind vorhanden, aber nicht tatsächlich ausgeführt | Recht/CI | hoch solange Runner blockiert | hoch | P1 | `npm run validate` auf unverändertem RC grün | **OFFEN – Audits integriert; Actions erreicht keinen Step** |
| R-033 | PWA-Rastericons fehlen oder stimmen nicht mit Manifestgrößen überein | PWA/Assets | sehr niedrig nach v42 | hoch | P1 | IHDR-/Hash-/Manifestprüfung | CLOSED IN CODE; Runner/Staging-Verifikation offen |
| R-034 | Staging-Smoke wird gegen falsche Origin/Cachegeneration oder nicht gegen den RC ausgeführt | Deployment/Release | mittel | hoch | P1 | `--expected-cache`, RC-SHA dokumentieren, getrennte Origins | **PREPARED – echter RC/Origin offen** |
| R-035 | Private-Device-Prompts kehren in einer anderen ausgelieferten Contentquelle zurück | Privacy/Content | niedrig nach v43 | hoch | P1 | globaler `privacy_content_audit.py` + manueller Pass | **CLOSED IN SOURCE / RUNNER + MANUAL VERIFICATION OPEN** |
| R-036 | Alte Audits verlangen historische Architektur und erzeugen falsche Releasefehler | Prozess/CI | niedrig nach Fix | hoch | P1 | Foundation-v2-/Readiness-Meta-Audits | **CLOSED IN CODE – historische Hardcode-Drifts entfernt; Runnernachweis offen** |
| R-037 | Syntaktisch gültiger Backupwert trägt falsche interne Storage-Version/Pflichtstruktur und überschreibt valide Daten | Daten/Integrity | niedrig nach v51 | kritisch | P1 | key-spezifische Root-/Version-/Wrapper-Prüfung vor Mutation | **CLOSED IN CODE / BK51 real offen** |

## 3. Aktuelle Releaseblocker

1. R-001 – Actions/CI
2. R-002 – echtes Online-`npm ci` auf unverändertem Commit
3. R-003 – Branch Protection tatsächlich konfigurieren
4. R-004/R-005 – reale Geräte/PWA-Upgrades
5. R-007/R-027/R-037 – BK51 Restore-/Forward-Compatibility-/Rollback-Evidence
6. R-009/R-010 – reale Content-/Altersabnahme
7. R-011/R-012/R-029/R-030/R-032 – Rechte/Betreiber/Root-Asset/Audit-Nachweis
8. R-013/R-015 – reale UX/Accessibility
9. R-019/R-034 – echte HTTPS-Staging-Origin + RC-Smoke
10. R-024 – Incident-/Support-Drill

## 4. Build-/Supply-Chain-Fortschritt

- `package-lock.json` v3 vorhanden
- `@playwright/test` / `playwright` / `playwright-core` exakt 1.54.2
- optional `fsevents` exakt 2.3.2
- Registry-URLs + `sha512`-Integrity gelockt
- Dependencygraph gegen offizielle Upstream-Tags geprüft
- Playwright-Lizenzen Apache-2.0, fsevents MIT
- beide GitHub-Workflows auf `npm ci`
- `scripts/lockfile_contract_audit.py` in `npm run validate`
- lokaler Offline-`npm ci`-Strukturcheck kam bis `ENOTCACHED`, also kein Package-/Lock-Mismatch

R-002 ist damit **im Repositoryvertrag geschlossen**, aber erst nach echtem Online-Install auf einem funktionierenden Runner releaseverifiziert.

## 5. Reference-/Privacy-Fortschritt

- v36–v41: Source-Level-Reference-Safe-Pass
- v43: Private-Device-Prompts physisch aus Basiskatalog entfernt
- `reference_content_audit.py` und `privacy_content_audit.py` schützen ausgelieferte Contentquellen

## 6. HTTPS-Staging-Automation

`scripts/staging_smoke.py` prüft echte ausgelieferte HTTPS-Ressourcen, Same-Origin-Redirects, Größenlimits, Kernrouten, Manifest, PNG-Dimensionen, Cachegeneration, Backup-Ladereihenfolge und Privacy-/Reference-Source-Verträge.

`scripts/staging_smoke_contract_audit.py` ist in `npm run validate` integriert. R-019/R-034 bleiben offen, solange keine echte Staging-Origin und kein unveränderter RC existieren.

## 7. Audit-Härtung

Der Foundation-/Readiness-Vertrag ist transition-safe. Zusätzlich schützt `scripts/backup_contract_audit.py` die v51-Grenze zwischen Backup-Registry, Runtime v6, Unit-/E2E-Tests, Offline-Core und Dokumentation.

## 8. CI-Nachweis

Der detaillierte aktuelle CI-Befund liegt zentral in `CI_TROUBLESHOOTING.md`. Historisch letzter vollständig untersuchter App-Lauf: Run #2787 auf v49, `steps: []`, kein Checkout, kein Repositorycode. Damit bleibt R-001 P0; v50/v51 sind ebenfalls nicht runnerverifiziert.

## 9. Security / Complete Backup v51

- Registry v2 besitzt exakt 16 aktuelle managed Storage-Keys.
- Future-Namespace und Future-Version eines bekannten Keys bleiben außerhalb heutiger Restore-Eigentümerschaft.
- `party-data-tools.js` v6 validiert Root-Typ, Storage-Version und minimale Wrapper vor Mutation.
- Restore-/Rollbacktransaktion besitzt nur managed Keys.
- `tests/backup-schema-registry.test.js`, `tests/e2e/party-data.spec.js`, `tests/e2e/backup-forward-compat.spec.js` und `scripts/backup_contract_audit.py` schützen die Source-Grenze.
- reale BK51-/Cross-Browser-/PWA-Evidence bleibt offen.

## 10. Schließregel

P0/P1 erst geschlossen mit belastbarem Nachweis, z. B. grünem unverändertem CI-Commit, Online-`npm ci`, Testreport, echtem HTTPS-Smoke auf dem RC, realem Gerät, realer Gruppe oder finalen Rechts-/Lizenzunterlagen.

„Code sieht richtig aus“ oder „Dokument existiert“ reicht nicht.