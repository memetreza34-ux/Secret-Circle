# Secret Circle – Architekturvertrag für langfristige Wartbarkeit

Stand: 29. August 2026

Secret Circle bleibt für den Januar-2027-Release eine statische **offline-first PWA** für gemeinsame Spiele auf einem Gerät. Der aktuelle Katalog besitzt **55 Built-ins: 15 Core / 13 Extended / 27 Labs**. **Expansion Wave 1 ist mit 10/10 geplanten Modi quellsseitig implementiert**, bleibt aber Labs und erweitert den Januar-Core nicht automatisch.

## 1. Produktgrenzen

V1 besitzt kein Pflichtkonto, Backend, eigene Server-API, Werbung, Tracking oder externe Runtime-CDNs. Built-in-Content bleibt ohne 18+-Bereich, explizite Sexualinhalte, Trinkzwang oder gefährliche Challenges.

## 2. Stabile Identitäten

Persistierte Spiel-/Pack-/Creator-/Session-/Completion-IDs, Storage-Keys, Backupformate, Manifest-ID und PWA-Scope sind Verträge. Ein Abschluss darf Verlauf und Statistik genau einmal verändern.

## 3. Versionierte Daten und Backups

`backup-schema-registry.js` Version 2 ist die zentrale Quelle für Complete-Backup-Format, Größenlimits und 17 explizit verwaltete Storage-Keys. `party-data-tools.js` Version 6 konsumiert diesen Vertrag. Seit v57 gehört der promptfreie Timer-Store `secret-circle-party-quick-timers-v1` zum Complete Backup.

## 4. Katalog- und Contentarchitektur

Browserkette auf Hub und Quick-Play:

`party-catalog.js → party-expansion.js → party-trending-catalog.js → party-mega-catalog.js → party-viral-catalog.js → party-core-release-catalog.js → party-core-classic-content.js → party-routing.js → party-wave-one-catalog.js → party-wave-one-imposter-catalog.js → party-wave-one-writing-catalog.js → party-wave-one-voting-catalog.js → party-wave-one-bluff-catalog.js → party-wave-one-clue-catalog.js`

Wave 1 verwendet mehrere kleine Katalog-Layer, aber **sechs wiederverwendbare Enginefamilien**: Quiz, Imposter, Writing, Estimation/Voting, Bluff und Clue. Themen bleiben Content-Layer; neue sichtbare Varianten sollen bevorzugt auf vorhandenen Engines entstehen.

## 5. Hub- und Timergrenzen

`party-hub.js`, `party-hub-round-state.js`, `party-hub-timers.js`, `party-session-controls.js`, `party-hub-resume-guard.js`, `party-hub-polish.js` und `party-hub-a11y.js` besitzen getrennte Verantwortlichkeiten. Runtime-Reihenfolge: `party-session-controls.js → party-hub-timers.js → party-hub-round-state.js → party-hub.js`.

## 6. Advanced-Core-Grenzen – v55

Advanced trennt `party-advanced.js`, `advanced-resume-guard.js`, `party-advanced-runner.js` und `advanced-privacy-guard.js`. Guard v4 schützt Location-Result-Pfade, Mafia-Rollen-/Winnerzustände, exact-once-Abschluss und bestätigten Session-Ersatz.

## 7. Quick-/Mega-/Viral-/Creator-Session-Ersatz – v56

`quick-session-replacement-guard.js` v2 schützt Same-/Cross-Game-Ersatz. Ein vorhandener Family-Snapshot wird nur nach Bestätigung ersetzt; Write-Fail bleibt fail-closed. Wave-1-Spiele verwenden dieselbe Quick-Familie.

## 8. Quick-Family Timer Resume – v57

`secret-circle-party-quick-timers-v1` speichert ausschließlich technische Timer-Metadaten. Snapshots werden nur bei passender Game-ID, Session-ID, Runde, Phase und Ausgangsdauer konsumiert.

## 9. Quick-Family BFCache Resume – v58

Bei `pageshow.persisted` führt ein passender Snapshot kontrolliert in den normalen Resume-Pfad; stale/fremde Snapshots werden gelöscht.

## 10. Quick-Family Background Pause – v59

Hidden pausiert einen laufenden Quick-Family-Timer. Sichtbarwerden startet nicht automatisch weiter.

## 11. Quick-Family Hidden Snapshot – v60

`party-session-controls.js` Version 5 persistiert bei Hidden technische Restzeit sofort; Same-Page-Stop entfernt den Snapshot.

## 12. Expansion Wave 1 – v61

Gemeinsame Quiz-Engine: `party-quiz` und `fact-or-fake` über `party-wave-one-modes.js`.

## 13. Expansion Wave 1 Imposter – v62

Gemeinsame Imposter-Engine: `undercover-similar-word` und `no-word-imposter` über `party-wave-one-imposter-modes.js`. Private Handoffs, geheime Votes, Blur/Hidden-Concealment, letzter Guess und exact-once-Scoring sind Source-Verträge.

## 14. Expansion Wave 1 Writing – v63

Gemeinsame Schreib-Engine:

- `fill-blank-battle` – private Antworten, danach anonyme Gruppenwahl;
- `who-wrote-it` – private Antworten, danach anonyme Autorenraten.

Private Eingaben werden bei Blur/Hidden verdeckt. Antworten bleiben während Vote/Guess anonym; Ergebnis-Resume darf Score nicht doppelt vergeben.

## 15. Expansion Wave 1 Complete – v64

Die ursprünglich geplanten 10 Wave-1-Modi sind jetzt quellsseitig vorhanden:

1. `bluff-trivia`
2. `party-quiz`
3. `fact-or-fake`
4. `percent-guess`
5. `fill-blank-battle`
6. `who-wrote-it`
7. `party-bracket`
8. `undercover-similar-word`
9. `no-word-imposter`
10. `password-one-word`

Neue v64-Verträge:

- `percent-guess`: speichert Kartenindex + Schätzung; Punkte werden aus dem Built-in-Zielwert deterministisch abgeleitet.
- `party-bracket`: speichert Kartenindex + sieben 0/1-Entscheidungen; aktuelles Duell und Sieger werden deterministisch rekonstruiert.
- `bluff-trivia`: private Fake-Antworten, anonyme Kandidaten, keine Stimme auf eigene Fake-Antwort, richtige Antwort erst im Ergebnis, Wissens- und Täuschungspunkte exact-once.
- `password-one-word`: Zielwort nur über Kartenindex persistiert, explizites Secret-Reveal, genau ein anderes Hinweiswort, Blur/Hidden verdeckt das Ziel wieder.
- `quick-loader.js` v11 routet alle sechs Wave-1-Enginefamilien explizit vor dem normalen Quick-Fallback.
- `party-release-structure.js` v5 klassifiziert alle 10 Wave-1-Modi als Labs.
- `GAME_LIBRARY_BACKLOG.json` bleibt die maschinenlesbare Produktplanung.
- Built-in-18+-Content bleibt ausgeschlossen.

## 16. Lokale Transaktionen und Exact-once

Kritische Datenoperationen validieren zuerst, sichern den alten Zustand und rollen bei Fehlern zurück. Fertige Sessions besitzen stabile Completion-/History-IDs. Reload, Retry oder Doppelklick dürfen keinen zweiten Verlaufseintrag erzeugen.

## 17. Datenschutz und Security durch Architektur

- keine Analytics-/Ads-Skripte oder externen Runtime-CDNs
- restriktive CSP
- Geheimkarten und private Eingaben bei Fokusverlust verdecken
- Session-Ersatz erfolgt nicht still
- anonyme Vote-/Guess-Phasen zeigen keine Autorennamen
- Bluff-Antworten und Secret-Clue-Zielwörter bleiben pass-and-play geschützt
- Timer-Resume speichert nur technische Metadaten
- manipulierte Resume-Zustände werden fail-closed verworfen
- Wave-1-Content ist textbasiert und benötigt keine fremden Bilder, Audioassets oder Zitate

## 18. Offline- und Updatevertrag

Aktueller Offline-Core: **`secret-circle-v64` / `secret-circle-v64-staging`**.

Jüngere Linie: v51 Backup → v52 Safe Current → v53 Paranoia → v54 Pre-Timer → v55 Advanced Integrity → v56 Quick Replacement → v57 Timer Resume → v58 BFCache → v59 Background Pause → v60 Hidden Snapshot → v61 Quiz → v62 Imposter → v63 Writing → **v64 Wave 1 Complete**.

Bei jeder Änderung einer Offline-Core-Datei: CORE prüfen → Cachegeneration erhöhen → SW-Test aktualisieren → Architektur/Deployment/Privacy/Environment/Hosting synchronisieren → Upgrade/Rollback real testen.

## 19. PWA-Installationsmetadaten

`party.html`, `index.html`, `creator.html`, `advanced.html` und `quick-play.html` besitzen denselben Installationsvertrag. Reale Homescreen-/Standalone-Abnahme bleibt Geräte-Evidence.

## 20. Accessibility als Definition of Done

Kernoberflächen und Labs benötigen semantische Struktur, Labels, sichtbaren Fokus, Tastaturbedienung, Touchziele, Reduced Motion und Reflow. Private Übergaben brauchen verständliche Handoff-Texte. VoiceOver/TalkBack/Touch/Zoom bleiben reale Gates.

## 21. Inhalts- und Rechtevertrag

Keine kopierten proprietären Karten, fremden Medien/Logos ohne Rechte oder unnötigen konkreten Marken-/Franchisebezug. Film/Serie/Anime/Gaming dürfen als Themenwelten vorkommen; konkrete moderne Franchises benötigen vor Built-in-Veröffentlichung einen eigenen Referenz-/Rechteentscheid.

## 22. Testpyramide

Normale Änderungen: Syntaxchecks, Unit-/Contracttests und Architektur-/Wave-1-/Advanced-/Quick-Replacement-/Quick-Timer-/BFCache-/Background-Pause-/Hidden-Snapshot-/Backup-/Content-/Privacy-/Reference-/Asset-/Accessibility-/Operator-/Release-Audits.

Wave 1 besitzt eigene Unit-/E2E-Verträge für Quiz, Imposter, Writing sowie den finalen Prozent-/Bracket-/Bluff-/Clue-Block. `scripts/wave_one_remaining_audit.py` erzwingt Wave 1 = 10/10, v64, Loader v11 und kein 18+-Built-in-Content.

## 23. Performance und Assets

Produktionsmodule bleiben grundsätzlich unter 1000 Zeilen und 100 KB. Neue sichtbare Varianten sollen bevorzugt Content auf gemeinsamen Engines wiederverwenden.

## 24. Betrieb, Deprecation und Rollback

Kein Force-Push auf stabile Release-Basen. Rollback/Hotfix erhält nach Offline-Core-Änderungen eine neue Cachegeneration. Persistierte Daten müssen kompatibel bleiben oder explizit migriert werden.

## 25. Releaseentscheidung

Eine Funktion ist erst releasefähig, wenn Code, Datenverhalten, Privacy/Security, Offline, Accessibility, Tests und Dokumentation zusammenpassen **und reale Gates tatsächlich ausgeführt wurden**. `release-evidence.json` ist die finale Quelle; `GO` erst bei belegten PASS-Gates auf demselben unveränderten RC.
