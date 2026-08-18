# Secret Circle – Risk Register

Stand: 18. August 2026

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
| R-001 | GitHub Actions startet keinen belastbaren Repository-Job | CI/Release | hoch | kritisch | P0 | echten Checkout + `npm run ci` dokumentieren | **OFFEN – bekannte Runs enden vor verwertbaren Steps** |
| R-002 | Kein reproduzierbares `package-lock.json` | Build/Supply Chain | hoch | hoch | P1 | echtes Lockfile, prüfen, CI auf `npm ci` | **OFFEN** |
| R-003 | Branch Protection / Required Checks nicht bestätigt | Git/Release | mittel | hoch | P1 | Pflichtchecks konfigurieren | offen |
| R-004 | Timer weichen auf echten OS-/Sperrbildschirmpfaden ab | Geräte/PWA | mittel | hoch | P1 | Android + iPhone real | offen |
| R-005 | PWA-Upgrade beschädigt Offline-Core/lokale Session | PWA/Daten | mittel | kritisch | P1 | zwei Altversionen→RC + Rollback real | **offen; aktueller Core v41 vorbereitet** |
| R-006 | Private Rollen/Fragen werden beim Resume sichtbar | Privacy/Gameplay | niedrig-mittel | hoch | P1 | E2E + reale Übergaben | technisch gehärtet; real offen |
| R-007 | Quota-/Import-/Migration beschädigt lokale Daten | Daten | niedrig-mittel | kritisch | P1 | Rollbacktests + echter Browser | Registry v2 vorbereitet; real offen |
| R-008 | Sessionabschluss zählt mehrfach | Daten/Statistik | niedrig | hoch | P1 | Completion-ID + Exact-once | technisch abgesichert; CI offen |
| R-009 | Core-Inhalte schwach/semantisch redundant | Content | mittel | hoch | P1 | Mengen-Gates + 15/15 Review + reale Sessions | quantitativ geschlossen; reale Langsessions offen |
| R-010 | Alters-/Safety-Einstufungen passen real nicht | Content/Safety | mittel | hoch | P1 | Policy + Quellreview + Gruppenabnahme | Quellpass vorbereitet; final offen |
| R-011 | Fan-/Marken-/Franchise-Inhalte erzeugen Rechte-Risiken | Recht/Content | niedrig nach v41-Hardening | hoch | P1 | Source-Audit + manueller Visual/Marketing/Legal-Pass | **stark gemindert: physischer Source-Pass umgesetzt; finale manuelle/rechtliche Abnahme offen** |
| R-012 | Betreiber-/Support-/Rechtsangaben unvollständig | Recht/Release | mittel | kritisch | P1 | Legal/Support + echte Angaben | Dokumente vorbereitet; reale Angaben offen |
| R-013 | UI für Erstnutzer zu kompliziert | UX | mittel | hoch | P1 | Tests ohne Entwicklerhilfe | offen |
| R-014 | Design uneinheitlich/provisorisch | Design | mittel | mittel | P2 | Designsystem + reale Review | Hero/Touchziele verbessert |
| R-015 | Accessibilityprobleme bei Screenreader/Zoom/Touch | Accessibility | mittel | hoch | P1 | Contract/E2E + Realtests | Basis vorbereitet; real offen |
| R-016 | große Gruppen haben langsame/unklare Übergaben | UX/Group | mittel | mittel-hoch | P2 | 9–12-Personen-Test | offen |
| R-017 | Mafia-Balance real unklar | Gameplay | mittel | mittel | P2 | echte 8+-Sessions | offen |
| R-018 | Labs wirken releasegleichwertig | Produkt/UX | mittel | mittel | P2 | klare Reifestufen + Nutzerprüfung | Basis vorhanden |
| R-019 | Production-Hosting verhält sich anders als lokal | Deployment | mittel | hoch | P1 | getrenntes HTTPS-Staging | offen |
| R-020 | Cache-/Release-Dokumente driften | Prozess | niedrig | mittel | P2 | dynamische Audits + synchronisierte Docs | **stark gemindert: v41 in SW/Test/Privacy/Architektur/Deployment/Environment** |
| R-021 | Dependency enthält Schwachstelle/Lizenzproblem | Supply Chain | niedrig-mittel | hoch | P2 | Lockfile, Audit, Third-Party-Inventar | Playwright direkt verifiziert; transitiv offen |
| R-022 | Browser-/iOS-PWA-Änderungen bis RC | Plattform | mittel | mittel-hoch | P2 | Zielbrowser kurz vor RC erneut | beobachten |
| R-023 | Creator-Eingaben umgehen Limits/belasten Speicher | Creator/Security | niedrig-mittel | mittel-hoch | P2 | Limits, Fuzz, Quota, E2E | technisch weitgehend abgesichert |
| R-024 | Support-/Incidentprozess ungeprüft | Betrieb | mittel | hoch | P1 | echte Rollen/Kontakte + Probe-SEV-1 | Dokumente vorbereitet; Drill offen |
| R-025 | 45 Spiele lenken von Core 15 ab | Scope | mittel | hoch | P1 | Core/Extended/Labs priorisieren | kontrolliert |
| R-026 | Basisnutzen ist am Markt nicht einzigartig | Produkt/Markt | hoch | hoch | P2 | Hub-Tiefe, Resume/Privacy, Creator | Positionierung angepasst |
| R-027 | Backup importiert unbekannte Secret-Circle-Namespaces | Security | niedrig nach Fix | hoch | P1 | Registry-v2-Allowlist | CLOSED IN CODE; real offen |
| R-028 | Backupkonstanten driften | Security/Maintenance | niedrig nach Fix | hoch | P1 | Registry als einzige Quelle | CLOSED IN CODE; CI offen |
| R-029 | Herkunft/Lizenz gebündelter Icons/Assets unklar | Recht/Supply Chain | mittel | hoch | P1 | Asset-Provenance dokumentieren | **OFFEN – drei Icons weiterhin `unresolved`** |
| R-030 | Support-/Legal-Platzhalter gelangen in Production | Recht/Betrieb | mittel | hoch | P1 | Placeholder-Audit + Releaseaudit | Audit vorbereitet; echte finale Angaben offen |
| R-031 | Classic-Content überschreitet Modul-/Offlinebudget | Performance/Architektur | sehr niedrig | mittel | P1 | 45-KB-Budget im Performance-Audit | **technisch kontrolliert; Runnernachweis für v4 offen** |
| R-032 | Reference-Source-Audit ist vorhanden, aber nicht tatsächlich ausgeführt | Recht/CI | hoch solange Runner blockiert | hoch | P1 | `npm run validate` auf unverändertem RC grün | **OFFEN – Audit in Validate integriert** |

## 3. Aktuelle Releaseblocker

1. R-001 – Actions/CI
2. R-002 – Lockfile/`npm ci`
3. R-003 – Branch Protection
4. R-004/R-005 – reale Geräte/PWA-Upgrades
5. R-009/R-010 – reale Content-/Altersabnahme
6. R-011/R-012/R-029/R-030/R-032 – Rechte/Betreiber/Assets/Source-Gate
7. R-013/R-015 – reale UX/Accessibility
8. R-019 – HTTPS-Staging
9. R-024 – Incident-/Support-Drill

## 4. Fortschritt Fan-/Referenzcontent

### Word Imposter – v36

- Bluetooth → Funkverbindung
- Oscar → Filmpreis
- Formel 1 → Motorsport

### `anime-guess` – v37/v40

- Option B umgesetzt
- stabile ID `anime-guess`
- finaler Titel `Anime-Archetypen erraten`
- vier generische Packs / 40 eigenständige Archetypen
- seit v40 keine der 40 früheren konkreten Namen mehr in `party-mega-catalog.js`

### Viral `higher-lower` – v38

- olympisches Ringsymbol → Fünfeck
- olympisches Stadion → typische Leichtathletikanlage
- Grand-Slam-Tennis → Best-of-five-Tennismatch

### Physischer Source-Pass – v41

- `party-expansion.js`: `Wellenlänge` → **Spektrum-Tipp**
- Browser-Tabu: `Chrome` → `Tab`
- `party-mega-catalog.js`: `Löwenkönig` → `Löwe`
- Classic Content auf v4 vereinfacht
- `scripts/reference_content_audit.py` scannt acht ausgelieferte Contentquellen
- Audit in `npm run validate` integriert

R-011 bleibt wegen manueller Semantik-, Visual-, Marketing- und finaler Rechtsabnahme offen. R-032 bleibt offen, bis der neue Source-Audit auf einem funktionierenden Runner tatsächlich grün ist.

## 5. Performance

Das bestehende Budget für `party-core-classic-content.js` bleibt **45.000 Bytes**. Die ältere bestätigte v2-Größe von 12.954 Bytes zeigte deutlichen Spielraum; Classic v4 muss das unveränderte Budget weiterhin über `scripts/performance_budget.py` einhalten. Kein Budget wird zur kosmetischen Freigabe erhöht.

## 6. Security/Backup

Registry v2 schließt im Code R-027/R-028. Endgültige Schließung erst nach tatsächlich ausgeführten Tests und echtem Browserimport/-rollback.

## 7. Risiko-Regel für neue Features

Vor jeder größeren Funktion prüfen: Netzwerk, personenbezogene Daten, Berechtigungen, Persistenz/Migration, geheime Inhalte, Dependencies, Storage-Key-Familien, Offline-Core/Performance, Accessibility, Alter/Rechte, Marktpositionierung und ausgelieferte Source-/Assetreferenzen.

## 8. Schließregel

P0/P1 erst geschlossen mit belastbarem Nachweis, z. B. grünem unverändertem CI-Commit, Testreport, realem Gerät, realer Gruppe, ausgefüllter Releasecheckliste oder finalen Rechts-/Lizenzunterlagen.

„Code sieht richtig aus“ oder „Dokument existiert“ reicht nicht.
