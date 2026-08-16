# Secret Circle – Risk Register

Stand: 16. August 2026

## 1. Zweck

Dieses Dokument macht Produkt-, Technik-, Inhalts-, Rechts- und Release-Risiken sichtbar. Ein dokumentiertes Risiko gilt nicht als gelöst. Für hohe und kritische Risiken muss eine konkrete Gegenmaßnahme und ein Nachweis existieren.

## 2. Bewertung

### Wahrscheinlichkeit

- niedrig
- mittel
- hoch

### Auswirkung

- niedrig
- mittel
- hoch
- kritisch

### Priorität

- P0: Releaseblocker / sofort
- P1: vor Release zwingend schließen
- P2: vor Release bewerten oder mindern
- P3: beobachten / später

## 3. Aktuelle Risiken

| ID | Risiko | Bereich | Wahrscheinlichkeit | Auswirkung | Priorität | Gegenmaßnahme | Status / Schließnachweis |
|---|---|---|---|---|---|---|---|
| R-001 | GitHub Actions weist Jobs keinen funktionierenden Runner mit sichtbaren Schritten zu | CI/Release | hoch | kritisch | P0 | Runner-/Account-/Policyproblem beheben; echten Checkout + `npm run ci` dokumentieren | **OFFEN – Releaseblocker** |
| R-002 | Kein reproduzierbares `package-lock.json`; CI nutzt noch `npm install` | Build/Supply Chain | hoch | hoch | P1 | Lockfile erzeugen, prüfen, CI auf `npm ci` umstellen | offen |
| R-003 | Branch Protection / Required Checks fehlen oder sind nicht als Releasegate bestätigt | Git/Release | mittel | hoch | P1 | stabile Basis schützen und Pflichtchecks konfigurieren | offen |
| R-004 | Direkte Hub-/Quick-/Mega-/Viral-Timer verhalten sich bei echtem Sperrbildschirm/OS-Hintergrund anders als Browser-Simulation | Geräte/PWA | mittel | hoch | P1 | reales Android + iPhone testen, Verhalten dokumentieren, ggf. Statevertrag anpassen | offen |
| R-005 | PWA-Update alte→neue Version beschädigt Offline-Core oder lokale Session auf realem Gerät | PWA/Daten | mittel | kritisch | P1 | Updates von mindestens zwei älteren Versionen auf Zielgeräten testen; Rollbackdeployment prüfen | offen |
| R-006 | Private Rollen/Fragen werden bei einem nicht getesteten Resume-Pfad versehentlich sichtbar | Privacy/Gameplay | niedrig-mittel | hoch | P1 | alle privaten Kernspiele E2E + realen Übergabetest; Resume-Verträge beibehalten | technisch gehärtet, reale Abnahme offen |
| R-007 | Lokale Daten werden bei Quota-/Import-/Migrationsfehler beschädigt | Daten | niedrig-mittel | kritisch | P1 | atomare Validierung/Rollbacktests; alte Snapshots; echte Browserprüfung | weitgehend technisch abgesichert, reale Abnahme offen |
| R-008 | Sessionabschluss zählt Verlauf/Statistik mehrfach | Daten/Statistik | niedrig | hoch | P1 | Session-Ledger + stabile Completion-ID + Exact-once Tests | technisch stark abgesichert; vollständiger CI-Nachweis offen |
| R-009 | Kerninhalte enthalten Duplikate, schwache Karten oder zu kleine Packs | Content | hoch | mittel-hoch | P1 | automatischer Qualitätsaudit + manuelle Redaktion aller 15 Kernspiele | offen |
| R-010 | Altersstufen und sensible Inhalte sind inkonsistent | Content/Safety | mittel | hoch | P1 | `CONTENT_AGE_POLICY.md`, Inhaltsaudit, familienfreundliche Defaults, Skip-Vertrag | offen |
| R-011 | Fan-/Marken-/Anime-Inhalte erzeugen Urheber-/Markenrisiken | Recht/Content | mittel | hoch | P1 | Inhalte inventarisieren; Bilder/Logos/Zitate/Audios vermeiden; finale Rechtsprüfung | offen; besonders Labs/Extended später prüfen |
| R-012 | Datenschutz-/Betreiber-/Support-/Lizenzangaben sind zum Release unvollständig | Recht/Release | mittel | kritisch | P1 | finale Legal-Checkliste und öffentliche Seiten vor RC | offen |
| R-013 | UI der 15 Kernspiele ist technisch korrekt, aber für Erstnutzer zu kompliziert | UX | mittel | hoch | P1 | User-Flow-Prüfung + reale Tests ohne Entwicklerhilfe | offen |
| R-014 | Design wirkt uneinheitlich oder zu stark emoji-/provisorisch geprägt | Design | hoch | mittel | P2 | Designsystem, Icons, Kernspielkarten und visuelle Hierarchie vereinheitlichen | offen |
| R-015 | Accessibility-Probleme bei Tastatur, Screenreader, 200 % Zoom oder kleinen Displays | Accessibility | mittel | hoch | P1 | automatisierte + manuelle A11y-Abnahme, echte Geräte | offen |
| R-016 | Große Gruppen erleben lange Übergaben oder unklare Rollenfolgen | UX/Group | mittel | mittel-hoch | P2 | 9–12-Personen-Tests; Wartezeit/Übergabefluss messen und verbessern | offen |
| R-017 | Mafia-Skalierung/Rollenlogik erzeugt in realen Gruppen unerwartete Balance-/Verständnisprobleme | Gameplay | mittel | mittel | P2 | Test mit mindestens 8 Personen und mehreren Mafia-Rollen | offen |
| R-018 | Labs werden von Nutzern trotz Badge als gleichwertig releasefertig wahrgenommen | Produkt/UX | mittel | mittel | P2 | Reifestufe deutlich in Katalog, Detail und Start kommunizieren | technisch vorhanden; visuelle Nutzerprüfung offen |
| R-019 | Statisches GitHub-Pages-/Hosting-Deployment unterscheidet sich von lokalem HTTP-Verhalten | Deployment | mittel | hoch | P1 | HTTPS-Staging/Preview mit Service Worker vor Production testen | offen |
| R-020 | Veraltete Dokumentation führt zu falschem Releaseprozess (z. B. Cache-/PR-Angaben) | Prozess | hoch | mittel | P1 | Dokumente synchronisieren; Release-Audit um Versions-/Cache-Konsistenz erweitern | offen; `DEPLOYMENT.md` bekannt veraltet |
| R-021 | Dependency oder Buildtool enthält bekannte Schwachstelle / Lizenzproblem | Supply Chain | niedrig-mittel | hoch | P2 | Lockfile, Dependency-Audit, Drittanbieter-/Lizenzinventar | offen |
| R-022 | Browser-/iOS-PWA-Änderungen bis Januar 2027 verändern Verhalten | Plattform | mittel | mittel-hoch | P2 | kurz vor RC aktuelle Zielbrowser erneut testen | beobachten |
| R-023 | Game Creator akzeptiert problematische/extreme Eingaben, die UI oder Speicherung belasten | Creator/Security | niedrig-mittel | mittel-hoch | P2 | Limits, Sanitizing, Quota-/Fuzz-/E2E-Tests | technisch weitgehend abgesichert; reale Abnahme offen |
| R-024 | Fehlender Support-/Incidentprozess erschwert Reaktion nach öffentlichem Release | Betrieb | hoch | hoch | P1 | `SUPPORT.md` + `INCIDENT_RESPONSE.md` vor RC | offen |
| R-025 | Umfang von 45 eingebauten Spielen lenkt Zeit von 15 Kernspielen ab | Scope | mittel | hoch | P1 | Core/Extended/Labs konsequent priorisieren; keine neuen Releasefeatures vor Kernabnahme | kontrolliert, weiter beobachten |

## 4. Releaseblocker aktuell

Mindestens folgende Punkte verhindern derzeit ein öffentliches GO:

1. R-001 – kein belastbarer GitHub-Actions-/CI-Nachweis
2. R-002 – Lockfile/`npm ci` offen
3. R-004/R-005 – reale Geräte-/PWA-Unterbrechungs- und Updateabnahme offen
4. R-009/R-010 – redaktionelle Inhalts-/Altersprüfung offen
5. R-012 – finale Rechts-/Supportangaben offen
6. R-013/R-015 – reale UX-/Accessibility-Abnahme offen
7. R-024 – Support-/Incidentprozess offen

## 5. Risiko-Regel bei neuen Features

Vor jeder größeren neuen Funktion wird geprüft:

- erzeugt sie Netzwerkzugriff?
- erzeugt sie neue personenbezogene Daten?
- benötigt sie Berechtigungen?
- verändert sie persistierte Daten?
- betrifft sie geheime Inhalte?
- fügt sie eine Dependency hinzu?
- erhöht sie Offline-Core/Performancekosten?
- verändert sie Alters-/Rechtslage?

Wenn ja, wird vor Implementierung mindestens ein neuer Risikoeintrag oder eine dokumentierte Bewertung ergänzt.

## 6. Schließregel

Ein P0/P1-Risiko wird erst als geschlossen markiert, wenn ein überprüfbarer Nachweis existiert, zum Beispiel:

- grüner unveränderter CI-Commit
- Testreport
- real dokumentiertes Gerät
- ausgefüllte Release-Checkliste
- redaktionelles Review
- aktualisierte Rechts-/Datenschutzdokumentation

„Code sieht richtig aus“ ist kein Schließnachweis.
