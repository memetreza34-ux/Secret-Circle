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
| R-001 | GitHub Actions weist Jobs keinen funktionierenden Runner mit sichtbaren Schritten zu | CI/Release | hoch | kritisch | P0 | Runner-/Account-/Policyproblem beheben; echten Checkout + `npm run ci` dokumentieren | **OFFEN – Releaseblocker** |
| R-002 | Kein reproduzierbares `package-lock.json`; CI nutzt noch `npm install` | Build/Supply Chain | hoch | hoch | P1 | Lockfile erzeugen, prüfen, CI auf `npm ci` umstellen | offen |
| R-003 | Branch Protection / Required Checks fehlen oder sind nicht bestätigt | Git/Release | mittel | hoch | P1 | stabile Basis schützen und Pflichtchecks konfigurieren | offen |
| R-004 | Timer verhalten sich bei echtem Sperrbildschirm/OS-Hintergrund anders als Simulation | Geräte/PWA | mittel | hoch | P1 | reales Android + iPhone testen | offen |
| R-005 | PWA-Update beschädigt Offline-Core oder lokale Session | PWA/Daten | mittel | kritisch | P1 | mindestens zwei alte Versionen → RC sowie Rollback real testen | offen; aktueller Core v32 vorbereitet |
| R-006 | Private Rollen/Fragen werden bei Resume versehentlich sichtbar | Privacy/Gameplay | niedrig-mittel | hoch | P1 | private Kernspiele E2E + reale Übergabetests | technisch gehärtet, reale Abnahme offen |
| R-007 | Lokale Daten werden bei Quota-/Import-/Migration beschädigt | Daten | niedrig-mittel | kritisch | P1 | atomare Validierung/Rollbacktests + echte Browserprüfung | technisch stark vorbereitet, reale Abnahme offen |
| R-008 | Sessionabschluss zählt Verlauf/Statistik mehrfach | Daten/Statistik | niedrig | hoch | P1 | stabile Completion-ID + Exact-once Tests | technisch stark abgesichert; CI-Nachweis offen |
| R-009 | Kerninhalte enthalten schwache, semantisch doppelte oder unpassende Karten | Content | mittel | hoch | P1 | Mengen-Gates + vollständiges manuelles Review aller Core-Packs | **Mengenproblem behoben; semantisches Review offen** |
| R-010 | Altersstufen/sensible Inhalte sind inkonsistent | Content/Safety | mittel | hoch | P1 | `CONTENT_AGE_POLICY.md`, manueller Review, Skip-Vertrag | offen; technischer Altersvertrag vorhanden |
| R-011 | Fan-/Marken-/Anime-Inhalte erzeugen Rechte-Risiken | Recht/Content | mittel | hoch | P1 | Inhalte inventarisieren; Logos/Zitate/Audios/Bilder vermeiden; Rechtsreview | offen; besonders Extended/Labs |
| R-012 | Betreiber-/Support-/Lizenz-/Rechtsangaben unvollständig | Recht/Release | mittel | kritisch | P1 | Legal-Checkliste und öffentliche Seiten | offen |
| R-013 | UI ist für Erstnutzer zu kompliziert | UX | mittel | hoch | P1 | reale Tests ohne Entwicklerhilfe | offen |
| R-014 | Design wirkt uneinheitlich oder provisorisch | Design | mittel-hoch | mittel | P2 | Designsystem, Icons, Hierarchie, Startseitenpass | offen; erste Touchziel-Fixes umgesetzt |
| R-015 | Accessibility-Probleme bei Tastatur, Screenreader, Zoom oder kleinen Displays | Accessibility | mittel | hoch | P1 | automatisierte + manuelle A11y-Abnahme | offen |
| R-016 | Große Gruppen erleben lange Übergaben oder unklare Rollenfolgen | UX/Group | mittel | mittel-hoch | P2 | 9–12-Personen-Test | offen |
| R-017 | Mafia-Balance ist in realen Gruppen unklar | Gameplay | mittel | mittel | P2 | mehrere echte 8+-Personen-Sessions | offen |
| R-018 | Labs wirken trotz Kennzeichnung releasegleichwertig | Produkt/UX | mittel | mittel | P2 | Reifestufe visuell und textlich eindeutig halten | technische Basis vorhanden, Nutzerprüfung offen |
| R-019 | Statisches Production-Hosting verhält sich anders als lokale Tests | Deployment | mittel | hoch | P1 | HTTPS-Staging/Preview vor Production | offen |
| R-020 | Veraltete Deployment-/Cache-/PR-Dokumentation führt zu falschem Releaseprozess | Prozess | niedrig | mittel | P2 | Architektur/Deployment bei jeder Cachegeneration synchronisieren | **stark gemindert: PR #13 + v32 + Stagingprozess synchronisiert; Auditnachweis offen** |
| R-021 | Dependency/Buildtool enthält bekannte Schwachstelle oder Lizenzproblem | Supply Chain | niedrig-mittel | hoch | P2 | Lockfile, Dependency-Audit, Third-Party-Inventar | offen |
| R-022 | Browser-/iOS-PWA-Änderungen bis Januar 2027 verändern Verhalten | Plattform | mittel | mittel-hoch | P2 | kurz vor RC Zielbrowser erneut testen | beobachten |
| R-023 | Creator-Eingaben belasten UI/Speicher oder umgehen Grenzen | Creator/Security | niedrig-mittel | mittel-hoch | P2 | Limits, Sanitizing, Quota-/Fuzz-/E2E | technisch weitgehend abgesichert; reale Abnahme offen |
| R-024 | Fehlender Support-/Incidentprozess erschwert Reaktion nach Release | Betrieb | hoch | hoch | P1 | `SUPPORT.md` + `INCIDENT_RESPONSE.md` | offen |
| R-025 | 45 Spiele lenken Zeit von 15 Core-Spielen ab | Scope | mittel | hoch | P1 | Core/Extended/Labs strikt priorisieren | kontrolliert, weiter beobachten |
| R-026 | Wettbewerber bieten Basisnutzen „viele Spiele + offline + kein Account + ein Gerät“ | Produkt/Markt | hoch | hoch | P2 | Differenzierung auf Hub-Tiefe, Resume/Privacy, Creator und Contentqualität | Marktanalyse abgeschlossen; Positionierung angepasst |

## 3. Aktuelle Releaseblocker

1. R-001 – kein belastbarer Actions-/CI-Nachweis
2. R-002 – Lockfile/`npm ci` offen
3. R-004/R-005 – reale Geräte-/PWA-Unterbrechungs-/Updateabnahme offen
4. R-009/R-010 – manuelles semantisches Inhalts-/Alters-/Privacy-Review offen
5. R-012 – finale Rechts-/Supportangaben offen
6. R-013/R-015 – reale UX-/Accessibility-Abnahme offen
7. R-024 – Support-/Incidentprozess offen

## 4. Fortschritt bei R-009

Drei Content-Wellen haben die früheren zu kleinen Core-Packs auf definierte Release-Mengen gebracht. `tests/core-content-quality.test.js` verlangt jetzt für alle Core-Packs die Zielmengen und keine quantitativen Shortfalls.

R-009 bleibt trotzdem P1, weil folgende qualitative Risiken nicht rein automatisierbar sind:

- semantisch ähnliche Karten
- schwacher oder unklarer Ton
- unpassende Packzuordnung
- Privacy-/Drittinhaltsprobleme
- tatsächlicher Spielspaß und Wiederholungsgefühl

## 5. Risiko-Regel für neue Features

Vor jeder größeren neuen Funktion prüfen:

- neuer Netzwerkzugriff?
- neue personenbezogene Daten?
- neue Berechtigungen?
- neue persistierte Daten oder Migration?
- geheime Inhalte betroffen?
- neue Dependency?
- Offline-Core/Performance betroffen?
- Alters-/Rechtslage verändert?
- Marktpositionierung verändert?

Wenn ja, wird die Risikobewertung vor Implementierung ergänzt.

## 6. Schließregel

P0/P1 gilt erst geschlossen mit überprüfbarem Nachweis, zum Beispiel:

- grüner unveränderter CI-Commit
- Testreport
- dokumentiertes reales Gerät
- ausgefüllte Releasecheckliste
- dokumentiertes redaktionelles Review
- finale Rechts-/Datenschutzunterlagen

„Code sieht richtig aus“ ist kein Schließnachweis.
