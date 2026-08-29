# Secret Circle – Architekturvertrag für langfristige Wartbarkeit

Stand: 29. August 2026

Secret Circle bleibt für den Januar-2027-Release eine statische **offline-first PWA** für gemeinsame Spiele auf einem Gerät. Der aktuelle Katalog besitzt **47 Built-ins: 15 Core / 13 Extended / 19 Labs**. Die beiden neuen Wave-1-Spiele sind Labs und erweitern den Januar-Core nicht automatisch.

## 1. Produktgrenzen

V1 besitzt kein Pflichtkonto, Backend, eigene Server-API, Werbung, Tracking oder externe Runtime-CDNs. Neue Online-/Cloud-/Kamera-/Mikrofonfunktionen benötigen einen neuen Architektur-, Privacy- und Securityentscheid. Built-in-Content bleibt ohne 18+-Bereich, explizite Sexualinhalte, Trinkzwang oder gefährliche Challenges.

## 2. Stabile Identitäten

Persistierte Spiel-/Pack-/Creator-/Session-/Completion-IDs, Storage-Keys, Backupformate, Manifest-ID und PWA-Scope sind Verträge. Persistierte IDs werden nur mit Migration geändert. Ein Abschluss darf Verlauf und Statistik genau einmal verändern.

## 3. Versionierte Daten und Backups

`backup-schema-registry.js` Version 2 ist die zentrale Quelle für Complete-Backup-Format, Größenlimits und aktuell 17 explizit verwaltete Storage-Keys. `party-data-tools.js` Version 6 konsumiert diesen Vertrag.

Seit v51 verändert Restore nur registrierte aktuelle Keys; Future-/Unknown-Namespaces bleiben erhalten. Seit v57 gehört der promptfreie Timer-Store `secret-circle-party-quick-timers-v1` zum Complete Backup.

## 4. Katalog- und Contentarchitektur

Kette auf Hub und Quick-Play:

`party-catalog.js → party-expansion.js → party-trending-catalog.js → party-mega-catalog.js → party-viral-catalog.js → party-core-release-catalog.js → party-core-classic-content.js → party-routing.js → party-wave-one-catalog.js`

`party-core-classic-content.js` steht auf v4. `party-wave-one-catalog.js` v2 ergänzt die ersten zwei Expansion-Labs, ohne bestehende IDs oder Core-Reifestufen umzudefinieren. Themen sind Content-Layer und sollen möglichst mehrere gemeinsame Enginefamilien nutzen.

## 5. Hub- und Timergrenzen

`party-hub.js`, `party-hub-round-state.js`, `party-hub-timers.js`, `party-session-controls.js`, `party-hub-resume-guard.js`, `party-hub-polish.js` und `party-hub-a11y.js` besitzen getrennte Verantwortlichkeiten.

Runtime-Reihenfolge: `party-session-controls.js → party-hub-timers.js → party-hub-round-state.js → party-hub.js`.

v52: sichere Hub-Karten bleiben über Reload stabil. v53: Paranoia bleibt verdeckt und behält Frage/Resultat. v54: Hot Potato/Wortkette behalten sichere Pre-Timer-Werte.

## 6. Advanced-Core-Grenzen – v55

Advanced trennt `party-advanced.js`, `advanced-resume-guard.js`, `party-advanced-runner.js` und `advanced-privacy-guard.js`. Guard v4 schützt Location-Result-Pfade, Mafia-Rollen-/Winnerzustände, exact-once-Abschluss und bestätigten Session-Ersatz.

## 7. Quick-/Mega-/Viral-/Creator-Session-Ersatz – v56

`quick-session-replacement-guard.js` v2 und der gemeinsame Quick-Family-Active-Key schützen Same-/Cross-Game-Ersatz. Ein vorhandener Family-Snapshot wird nur nach Bestätigung ersetzt; Write-Fail bleibt fail-closed. Wave-1-Spiele werden technisch in dieser Quick-Familie registriert, damit derselbe Schutz wiederverwendet wird.

## 8. Quick-Family Timer Resume – v57

`party-session-controls.js` führte den gemeinsamen Restzeit-Resume ein. `secret-circle-party-quick-timers-v1` speichert ausschließlich `gameId`, `sessionId`, `round`, `phase`, `durationMs` und `remainingMs` je Enginefamilie. Prompt-/Antwort-/Mission-/Identitäts-/Karteninhalte sind verboten.

Ein Snapshot wird nur bei exakt passender Game-ID, Session-ID, Runde, Phase und Ausgangsdauer konsumiert. Stale Snapshots werden gelöscht.

## 9. Quick-Family BFCache Resume – v58

Bei `pageshow.persisted === true` prüft die gemeinsame Sessionsteuerung den gespeicherten Timer-Snapshot. Ein exakt passender Snapshot führt kontrolliert in den normalen QT57-Resume-Pfad. Ein stale/fremder Snapshot wird gelöscht, ohne unnötigen Reload.

## 10. Quick-Family Background Pause – v59

Für Quick/Trending, Mega, Viral und Creator gilt bei laufendem Timer: `document.hidden === true` pausiert automatisch; Hintergrundzeit wird nicht unsichtbar abgezogen; beim Sichtbarwerden erfolgt kein Auto-Resume.

## 11. Quick-Family Hidden Snapshot – v60

`party-session-controls.js` steht seit v60 auf Version 5. Hidden persistiert die technische Restzeit sofort, damit ein OS-Kill ohne zuverlässiges `pagehide` nicht wieder bei voller Dauer startet. Same-Page-Stop entfernt diesen Snapshot wieder.

## 12. Expansion Wave 1 – v61

Wave 1 folgt dem Prinzip **wenige gemeinsame Engines + viele Themenpacks**, nicht „eine neue Engine pro sichtbarem Spiel“.

Erste implementierte Labs:

- `party-quiz` – Multiple Choice über den gemeinsamen `party-wave-one-modes.js`-Runner;
- `fact-or-fake` – Fakt/Fake über denselben Runner.

Verträge:

- `party-wave-one-catalog.js` v2 liefert aktuell je 24 textbasierte, reference-safe Karten;
- `quick-loader.js` v8 routet `waveOneGameIds` explizit zu `party-wave-one-modes.js`, bevor die normale Quick-Fallback-Engine greift;
- Wave-1-IDs werden zusätzlich in `quickGameIds` registriert, damit bestehender Session-Replacement-/Resume-Schutz wiederverwendet wird;
- `party-release-structure.js` klassifiziert beide ausdrücklich als Labs;
- Abschluss nutzt stabile Session-/Completion-IDs und exact-once-Ledger;
- Ergebnis-Resume darf Punkte nicht ein zweites Mal vergeben;
- `GAME_LIBRARY_BACKLOG.json` bleibt die maschinenlesbare Expansionsplanung;
- kein Wave-1-Lab wird ohne Content-, Resume-, Privacy-, Offline-, Accessibility-, E2E- und Gruppentest automatisch zum Core.

## 13. Lokale Transaktionen und Exact-once

Kritische Datenoperationen validieren zuerst, sichern den alten Zustand, schreiben vollständig und rollen bei Fehlern zurück. Fertige Sessions besitzen stabile Completion-/History-IDs. Reload, Retry oder Doppelklick dürfen keinen zweiten Verlaufseintrag erzeugen.

## 14. Datenschutz und Security durch Architektur

- keine Analytics-/Ads-Skripte oder externen Runtime-CDNs
- restriktive CSP
- Imports nach Format, Version, Größe, Key-Allowlist und Struktur
- Geheimkarten/Rollen/Fragen bei Fokusverlust verdecken
- geheime Zustände nach Reload nie automatisch sichtbar öffnen
- Timer-Resume speichert nur technische Restzeit-Metadaten
- Hintergrundwechsel pausieren laufende Quick-Family-Timer
- Hidden persistiert technische Restzeit für möglichen OS-Kill
- Sichtbarwerden startet einen pausierten Timer nicht automatisch
- manipulierte Resume-Zustände werden fail-closed verworfen
- Session-Ersatz erfolgt nicht still
- Wave-1-Quizcontent ist textbasiert und benötigt keine fremden Bilder, Audioassets oder Zitate

## 15. Offline- und Updatevertrag

Aktueller Offline-Core: **`secret-circle-v61` / `secret-circle-v61-staging`**.

Jüngere Linie: v51 Backup → v52 Safe Current → v53 Paranoia → v54 Pre-Timer → v55 Advanced Integrity → v56 Quick Replacement → v57 Quick Timer Resume → v58 BFCache Restore → v59 Background Pause → v60 Hidden Snapshot → **v61 Expansion Wave 1**.

Bei jeder Änderung einer Offline-Core-Datei: CORE prüfen → Cachegeneration erhöhen → SW-Test aktualisieren → Architektur/Deployment/Privacy/Environment/Hosting synchronisieren → Alt→Neu/Rollback real testen.

## 16. PWA-Installationsmetadaten

`party.html`, `index.html`, `creator.html`, `advanced.html` und `quick-play.html` besitzen denselben Installationsvertrag. Reale Homescreen-/Standalone-Abnahme bleibt Geräte-Evidence.

## 17. Accessibility als Definition of Done

Kernoberflächen und Labs benötigen semantische Struktur, Labels, sichtbaren Fokus, Tastaturbedienung, modale Fokusgrenzen, Touchziele, Reduced Motion und Reflow. VoiceOver/TalkBack/Touch/Zoom bleiben reale Gates.

## 18. Inhalts- und Rechtevertrag

Keine kopierten proprietären Karten, fremden Medien/Logos ohne Rechte oder unnötigen konkreten Marken-/Franchisebezug. Film/Serie/Anime/Gaming dürfen als Themenwelten vorkommen; konkrete moderne Franchises benötigen vor Built-in-Veröffentlichung einen eigenen Referenz-/Rechteentscheid. Ein `unresolved` Releaseasset blockiert `assetsThirdParty = PASS`.

## 19. Testpyramide

Normale Änderungen: Syntaxchecks, Unit-/Contracttests und Architektur-/Wave-1-/Advanced-/Quick-Replacement-/Quick-Timer-/BFCache-/Background-Pause-/Hidden-Snapshot-/Backup-/Content-/Privacy-/Reference-/Asset-/Accessibility-/Operator-/Release-Audits.

Wave 1: `tests/party-wave-one-catalog.test.js`, `tests/e2e/wave-one-quiz.spec.js`, `scripts/wave_one_quiz_audit.py`. QT57/BF58/BG59/HS60 bleiben eigene Verträge. Release Candidate zusätzlich: Online-`npm ci`, vollständiges CI, Chromium/Firefox/WebKit, HTTPS-Staging, reale PWA-/Geräte-/Accessibility-/Gruppentests.

## 20. Performance und Assets

Produktionsmodule bleiben grundsätzlich unter 1000 Zeilen und 100 KB. Neue sichtbare Varianten sollen bevorzugt Content auf gemeinsamen Engines wiederverwenden. PWA-Assets: `icon.svg`, `icon-192.png`, `icon-512.png`; Provenienz wird separat geprüft.

## 21. Betrieb, Deprecation und Rollback

Kein Force-Push auf stabile Release-Basen. Rollback/Hotfix erhält nach Offline-Core-Änderungen eine neue Cachegeneration. Persistierte Daten müssen kompatibel bleiben oder explizit migriert werden.

## 22. Releaseentscheidung

Eine Funktion ist erst releasefähig, wenn Code, Datenverhalten, Privacy/Security, Offline, Accessibility, Tests und Dokumentation zusammenpassen **und reale Gates tatsächlich ausgeführt wurden**. `release-evidence.json` ist die finale Quelle; `GO` erst bei belegten PASS-Gates auf demselben unveränderten RC.
