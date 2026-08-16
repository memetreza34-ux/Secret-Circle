# Secret Circle – Risk Register

Stand: 16. August 2026

## 1. Zweck

Dieses Dokument macht Produkt-, Technik-, Inhalts-, Rechts- und Release-Risiken sichtbar. Ein dokumentiertes Risiko gilt erst dann als geschlossen, wenn ein überprüfbarer Nachweis existiert.

### Priorität

- P0: Releaseblocker / sofort
- P1: vor Release zwingend schließen
- P2: vor Release bewerten oder mindern
- P3: beobachten / später

## 2. Aktuelle Risiken

| ID | Risiko | Bereich | Wahrscheinlichkeit | Auswirkung | Priorität | Gegenmaßnahme | Status / Schließnachweis |
|---|---|---|---|---|---|---|---|
| R-001 | GitHub Actions weist Jobs keinen funktionierenden Runner mit sichtbaren Schritten zu | CI/Release | hoch | kritisch | P0 | Runner-/Account-/Policyproblem beheben; echten Checkout + `npm run ci` dokumentieren | **OFFEN – Run #1905 erneut `steps: []`** |
| R-002 | Kein reproduzierbares `package-lock.json`; CI nutzt noch Übergangsinstallation | Build/Supply Chain | hoch | hoch | P1 | echtes Lockfile erzeugen, prüfen, CI anschließend auf `npm ci` umstellen | **OFFEN – lokale Lockfile-Erzeugung scheiterte am Paketnetzwerk/Timeout; nichts erfunden** |
| R-003 | Branch Protection / Required Checks fehlen oder sind nicht bestätigt | Git/Release | mittel | hoch | P1 | stabile Basis schützen und Pflichtchecks konfigurieren, sobald Checks zuverlässig laufen | offen |
| R-004 | Timer verhalten sich bei echtem Sperrbildschirm/OS-Hintergrund anders als Simulation | Geräte/PWA | mittel | hoch | P1 | reales Android + iPhone testen | offen |
| R-005 | PWA-Update beschädigt Offline-Core oder lokale Session | PWA/Daten | mittel | kritisch | P1 | mindestens zwei alte installierte Versionen → RC sowie Rollback real testen | offen; aktueller Core **v35** vorbereitet |
| R-006 | Private Rollen/Fragen werden bei Resume versehentlich sichtbar | Privacy/Gameplay | niedrig-mittel | hoch | P1 | private Kernspiele E2E + reale Übergabetests | technisch gehärtet, reale Abnahme offen |
| R-007 | Lokale Daten werden bei Quota-/Import-/Migration beschädigt | Daten | niedrig-mittel | kritisch | P1 | atomare Validierung/Rollbacktests + echte Browserprüfung | technisch stark vorbereitet; Registry v2, reale Abnahme offen |
| R-008 | Sessionabschluss zählt Verlauf/Statistik mehrfach | Daten/Statistik | niedrig | hoch | P1 | stabile Completion-ID + Exact-once Tests | technisch stark abgesichert; CI-Nachweis offen |
| R-009 | Kerninhalte enthalten schwache, semantisch doppelte oder unpassende Karten | Content | mittel | hoch | P1 | Mengen-Gates + Quellreview + reale Sessions | **quantitativ geschlossen; erster 15/15-Quellpass PREPARED; reale Langsessions/finaler Sign-off offen** |
| R-010 | Altersstufen/sensible Inhalte sind inkonsistent | Content/Safety | mittel | hoch | P1 | `CONTENT_AGE_POLICY.md`, 15/15 Quellreview, sichtbarer Skip-/Freiwilligkeitsvertrag | **Quellpass vorbereitet; reale Gruppendynamik/finaler Alters-Sign-off offen** |
| R-011 | Fan-/Marken-/Anime-Inhalte erzeugen Rechte-Risiken | Recht/Content | mittel | hoch | P1 | Inhalte/Assets inventarisieren; Logos/Zitate/Audios/Bilder vermeiden; finale Rechteprüfung | offen; besonders Extended/Labs |
| R-012 | Betreiber-/Support-/Lizenz-/Rechtsangaben sind zum Release unvollständig | Recht/Release | mittel | kritisch | P1 | `LEGAL_CHECKLIST.md`, `SUPPORT.md`, echte Betreiber-/Hosting-/Kontaktangaben, Third-Party-Inventar | **Dokumente PREPARED; reale Angaben weiter offen** |
| R-013 | UI ist für Erstnutzer zu kompliziert | UX | mittel | hoch | P1 | reale Tests ohne Entwicklerhilfe | offen; Positionierung/Consent-Copy verbessert |
| R-014 | Design wirkt uneinheitlich oder provisorisch | Design | mittel-hoch | mittel | P2 | Designsystem, Icons, Hierarchie und Kernflows vereinheitlichen | offen; Hero/Touchziele verbessert |
| R-015 | Accessibility-Probleme bei Tastatur, Screenreader, Zoom oder kleinen Displays | Accessibility | mittel | hoch | P1 | Contract + E2E + reale A11y-Abnahme | **automatisierte Grundlage PREPARED; VoiceOver/TalkBack/200 %/Geräte offen** |
| R-016 | Große Gruppen erleben lange Übergaben oder unklare Rollenfolgen | UX/Group | mittel | mittel-hoch | P2 | 9–12-Personen-Test | offen |
| R-017 | Mafia-Balance ist in realen Gruppen unklar | Gameplay | mittel | mittel | P2 | mehrere echte 8+-Personen-Sessions | offen |
| R-018 | Labs wirken trotz Kennzeichnung releasegleichwertig | Produkt/UX | mittel | mittel | P2 | Reifestufe visuell und textlich eindeutig halten | technische Basis vorhanden, Nutzerprüfung offen |
| R-019 | Statisches Production-Hosting verhält sich anders als lokale Tests | Deployment | mittel | hoch | P1 | HTTPS-Staging/Preview vor Production | offen |
| R-020 | Veraltete Cache-/Deployment-/Release-Dokumentation führt zu falschem Prozess | Prozess | niedrig | mittel | P2 | Cachegeneration dynamisch in Audits ableiten; Docs bei Offline-Änderung synchronisieren | **stark gemindert: v35 in SW/Test/Architektur/Deployment/Privacy synchron; Runnernachweis offen** |
| R-021 | Dependency/Buildtool enthält bekannte Schwachstelle oder Lizenzproblem | Supply Chain | niedrig-mittel | hoch | P2 | Lockfile, Dependency-Audit, Third-Party-Inventar | offen; Runtime aktuell ohne npm-Dependencies, Dev-Dependency vorhanden |
| R-022 | Browser-/iOS-PWA-Änderungen bis Januar 2027 verändern Verhalten | Plattform | mittel | mittel-hoch | P2 | kurz vor RC Zielbrowser erneut testen | beobachten |
| R-023 | Creator-Eingaben belasten UI/Speicher oder umgehen Grenzen | Creator/Security | niedrig-mittel | mittel-hoch | P2 | Limits, Sanitizing, Quota-/Fuzz-/E2E | technisch weitgehend abgesichert; reale Abnahme offen |
| R-024 | Fehlender oder ungeprüfter Support-/Incidentprozess erschwert Reaktion nach Release | Betrieb | mittel | hoch | P1 | `SUPPORT.md`, `INCIDENT_RESPONSE.md`, echte Rollen/Kontakte, Probe-SEV-1 | **Dokumente PREPARED; Personen/Kontakte/Drill offen** |
| R-025 | 45 Spiele lenken Zeit von 15 Core-Spielen ab | Scope | mittel | hoch | P1 | Core/Extended/Labs strikt priorisieren | kontrolliert, weiter beobachten |
| R-026 | Wettbewerber bieten Basisnutzen „viele Spiele + offline + kein Account + ein Gerät“ | Produkt/Markt | hoch | hoch | P2 | Differenzierung auf Hub-Tiefe, Resume/Privacy, Creator und Contentqualität | Marktanalyse abgeschlossen; Hub-Hero/Positionierung angepasst |
| R-027 | Complete-Backup importiert unbekannte `secret-circle-*`-Namespaces | Security/Import | niedrig nach Fix | hoch | P1 | Registry-v2-Allowlist für Word-/Party-Key-Familien | **CLOSED IN CODE; Runner + echter Browserimport offen** |
| R-028 | Complete-Backup-Format/Limits driften durch doppelte Konstanten auseinander | Security/Maintenance | niedrig nach Fix | hoch | P1 | Registry v2 als einzige Complete-Backup-Quelle | **CLOSED IN CODE; Runnernachweis offen** |
| R-029 | Herkunft/Lizenz von Icons, PNGs oder anderen gebündelten Assets ist nicht vollständig dokumentiert | Recht/Supply Chain | mittel | hoch | P1 | Asset-/Third-Party-Inventar mit Herkunft, Lizenz und Freigabestatus | **OFFEN – vor RC schließen** |
| R-030 | Support-/Legal-Platzhalter (`TBD`) gelangen versehentlich in Production | Recht/Betrieb | mittel | hoch | P1 | Release-Audit/Checklist + finaler Platzhalter-Scan | **OFFEN – Platzhalter aktuell bewusst vorhanden** |

## 3. Aktuelle Releaseblocker

1. **R-001** – kein belastbarer Actions-/CI-Nachweis
2. **R-002** – Lockfile/`npm ci` offen
3. **R-003** – Branch Protection/Required Checks offen
4. **R-004/R-005** – reale Geräte-/PWA-Unterbrechungs-/Updateabnahme offen
5. **R-009/R-010** – reale Content-/Alters-/Gruppenabnahme und finaler Sign-off offen
6. **R-011/R-012/R-029/R-030** – Rechte, Betreiber, Support, Lizenzen/Assets offen
7. **R-013/R-015** – reale UX-/Accessibility-Abnahme offen
8. **R-019** – HTTPS-Staging offen
9. **R-024** – reale Support-/Incident-Verantwortung und Drill offen

## 4. Fortschritt bei Content-Risiken

Drei Content-Wellen haben die früheren zu kleinen Core-Packs auf definierte Release-Mengen gebracht. `tests/core-content-quality.test.js` schützt diese Zielmengen.

`CORE_CONTENT_REVIEW.md` enthält inzwischen einen ersten vollständigen **15/15-Core-Quellpass**.

Damit sind R-009/R-010 deutlich gemindert, aber nicht geschlossen, weil folgende Punkte nur real beziehungsweise final redaktionell beantwortbar sind:

- semantische Ermüdung in längeren Sessions
- Gruppendynamik bei Paranoia/Truth-Dare/Never-Have
- tatsächlicher Spielspaß und Schwierigkeit
- Marken-/Rechtefragen außerhalb rein generischer Inhalte
- finale Alters-/Storebewertung

## 5. Fortschritt bei Security/Backup

Registry v2 schließt zwei konkrete Architekturprobleme im Code:

- R-027: Importfläche ist nicht mehr pauschal jedes `secret-circle-*`
- R-028: Complete-Backup-Runtime liest Format und Limits aus dem zentralen Register

Zusätzlich wird `backup-schema-registry.js` im Hub vor `party-data-tools.js` geladen.

Diese Risiken werden erst nach tatsächlichem Unit-/Browsernachweis endgültig geschlossen.

## 6. Risiko-Regel für neue Features

Vor jeder größeren neuen Funktion prüfen:

- neuer Netzwerkzugriff?
- neue personenbezogene Daten?
- neue Berechtigungen?
- neue persistierte Daten oder Migration?
- geheime Inhalte betroffen?
- neue Dependency?
- neue Storage-Key-Familie?
- Offline-Core/Performance betroffen?
- Alters-/Rechtslage verändert?
- Marktpositionierung verändert?

Wenn ja, wird die Risikobewertung vor Implementierung ergänzt.

## 7. Schließregel

P0/P1 gilt erst geschlossen mit überprüfbarem Nachweis, zum Beispiel:

- grüner unveränderter CI-Commit
- tatsächlicher Testreport
- dokumentiertes reales Gerät
- ausgefüllte Releasecheckliste
- dokumentiertes redaktionelles Review + reale Sitzung
- finale Rechts-/Datenschutz-/Lizenzunterlagen
- getesteter Support-/Incidentweg

„Code sieht richtig aus“ oder „Dokument existiert“ ist kein vollständiger Schließnachweis.
