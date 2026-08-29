# Secret Circle – Architekturvertrag für langfristige Wartbarkeit

Stand: 29. August 2026

Secret Circle bleibt für den Januar-2027-Release eine statische **offline-first PWA** für gemeinsame Spiele auf einem Gerät. Der aktuelle Katalog besitzt **49 Built-ins: 15 Core / 13 Extended / 21 Labs**. Die vier Wave-1-Spiele bleiben Labs und erweitern den Januar-Core nicht automatisch.

## 1. Produktgrenzen

V1 besitzt kein Pflichtkonto, Backend, eigene Server-API, Werbung, Tracking oder externe Runtime-CDNs. Neue Online-/Cloud-/Kamera-/Mikrofonfunktionen benötigen einen neuen Architektur-, Privacy- und Securityentscheid. Built-in-Content bleibt ohne 18+-Bereich, explizite Sexualinhalte, Trinkzwang oder gefährliche Challenges.

## 2. Stabile Identitäten

Persistierte Spiel-/Pack-/Creator-/Session-/Completion-IDs, Storage-Keys, Backupformate, Manifest-ID und PWA-Scope sind Verträge. Persistierte IDs werden nur mit Migration geändert. Ein Abschluss darf Verlauf und Statistik genau einmal verändern.

## 3. Versionierte Daten und Backups

`backup-schema-registry.js` Version 2 ist die zentrale Quelle für Complete-Backup-Format, Größenlimits und aktuell 17 explizit verwaltete Storage-Keys. `party-data-tools.js` Version 6 konsumiert diesen Vertrag.

Seit v51 verändert Restore nur registrierte aktuelle Keys; Future-/Unknown-Namespaces bleiben erhalten. Seit v57 gehört der promptfreie Timer-Store `secret-circle-party-quick-timers-v1` zum Complete Backup.

## 4. Katalog- und Contentarchitektur

Browserkette auf Hub und Quick-Play:

`party-catalog.js → party-expansion.js → party-trending-catalog.js → party-mega-catalog.js → party-viral-catalog.js → party-core-release-catalog.js → party-core-classic-content.js → party-routing.js → party-wave-one-catalog.js → party-wave-one-imposter-catalog.js`

`party-wave-one-catalog.js` v3 ist die **eine inhaltliche Wave-1-Quelle** und liefert aktuell vier spielbare Labs. `party-wave-one-imposter-catalog.js` ist nur ein kleiner Kompatibilitäts-Adapter und darf keine Spiele oder Inhalte ein zweites Mal anhängen.

Wave 1 trennt Katalog und Mechanik: Quiz/Fakt-Fake laufen über `party-wave-one-modes.js`, die zwei Imposter-Varianten über `party-wave-one-imposter-modes.js`. Themen bleiben Content-Layer und sollen möglichst mehrere gemeinsame Enginefamilien nutzen.

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

Erste Quiz-Labs:

- `party-quiz` – Multiple Choice;
- `fact-or-fake` – Fakt/Fake.

Beide nutzen `party-wave-one-modes.js`, denselben Quick-Family-Session-Schutz, stabile Completion-IDs und Ergebnis-Resume ohne Doppelpunkt.

## 13. Expansion Wave 1 Imposter – v62

Zweite gemeinsame Enginefamilie:

- `undercover-similar-word` – Mehrheit erhält Wort A, eine Person ein ähnliches Wort B;
- `no-word-imposter` – eine Person erhält kein Wort und bekommt bei korrekter Enttarnung genau einen letzten Wort-Guess.

Verträge:

- gemeinsamer Runner `party-wave-one-imposter-modes.js` statt zwei Sonderengines;
- `quick-loader.js` v9 routet `waveOneImposterGameIds` **vor** dem allgemeinen Wave-1-/Quick-Fallback zum Imposter-Runner;
- private Rollen-/Wortkarten werden nacheinander mit explizitem Handoff gezeigt;
- Blur, `pagehide` und Hidden verdecken offene Secret-/Vote-UI wieder;
- Abstimmungen werden pro Spieler privat abgegeben;
- Tie/Fehlwahl und korrekte Enttarnung besitzen definierte Gewinnerpfade;
- No-Word hat nur nach korrekter Enttarnung einen letzten Guess;
- `current.scored` verhindert doppelte Rundenscores nach Reload/Resume;
- Sessionabschluss nutzt stabile `wave1-imposter`-Completion-IDs;
- alle vier Wave-1-Spiele sind ausdrücklich **Labs**;
- Built-in-Content bleibt jugend-/familienfreundlich und reference-safe.

`GAME_LIBRARY_BACKLOG.json` bleibt die maschinenlesbare Expansionsplanung. Neue Labs werden nicht automatisch Core.

## 14. Lokale Transaktionen und Exact-once

Kritische Datenoperationen validieren zuerst, sichern den alten Zustand, schreiben vollständig und rollen bei Fehlern zurück. Fertige Sessions besitzen stabile Completion-/History-IDs. Reload, Retry oder Doppelklick dürfen keinen zweiten Verlaufseintrag erzeugen.

## 15. Datenschutz und Security durch Architektur

- keine Analytics-/Ads-Skripte oder externen Runtime-CDNs
- restriktive CSP
- Imports nach Format, Version, Größe, Key-Allowlist und Struktur
- Geheimkarten/Rollen/Fragen bei Fokusverlust verdecken
- geheime Zustände nach Reload nie automatisch sichtbar öffnen
- Quick-/Wave-1-Session-Ersatz erfolgt nicht still
- Wave-1-Imposter-Reveal und geheime Abstimmung werden nach Fokusverlust wieder verdeckt
- Timer-Resume speichert nur technische Restzeit-Metadaten
- Hintergrundwechsel pausieren laufende Quick-Family-Timer
- Sichtbarwerden startet einen pausierten Timer nicht automatisch
- manipulierte Resume-Zustände werden fail-closed verworfen
- Wave-1-Content ist textbasiert und benötigt keine fremden Bilder, Audioassets oder Zitate

## 16. Offline- und Updatevertrag

Aktueller Offline-Core: **`secret-circle-v62` / `secret-circle-v62-staging`**.

Jüngere Linie: v51 Backup → v52 Safe Current → v53 Paranoia → v54 Pre-Timer → v55 Advanced Integrity → v56 Quick Replacement → v57 Quick Timer Resume → v58 BFCache Restore → v59 Background Pause → v60 Hidden Snapshot → v61 Wave-1-Quiz → **v62 Wave-1-Imposter**.

Bei jeder Änderung einer Offline-Core-Datei: CORE prüfen → Cachegeneration erhöhen → SW-Test aktualisieren → Architektur/Deployment/Privacy/Environment/Hosting synchronisieren → Alt→Neu/Rollback real testen.

## 17. PWA-Installationsmetadaten

`party.html`, `index.html`, `creator.html`, `advanced.html` und `quick-play.html` besitzen denselben Installationsvertrag. Reale Homescreen-/Standalone-Abnahme bleibt Geräte-Evidence.

## 18. Accessibility als Definition of Done

Kernoberflächen und Labs benötigen semantische Struktur, Labels, sichtbaren Fokus, Tastaturbedienung, modale Fokusgrenzen, Touchziele, Reduced Motion und Reflow. Private Übergaben brauchen zusätzlich verständliche Handoff-Texte. VoiceOver/TalkBack/Touch/Zoom bleiben reale Gates.

## 19. Inhalts- und Rechtevertrag

Keine kopierten proprietären Karten, fremden Medien/Logos ohne Rechte oder unnötigen konkreten Marken-/Franchisebezug. Film/Serie/Anime/Gaming dürfen als Themenwelten vorkommen; konkrete moderne Franchises benötigen vor Built-in-Veröffentlichung einen eigenen Referenz-/Rechteentscheid. Ein `unresolved` Releaseasset blockiert `assetsThirdParty = PASS`.

## 20. Testpyramide

Normale Änderungen: Syntaxchecks, Unit-/Contracttests und Architektur-/Wave-1-Quiz-/Wave-1-Imposter-/Advanced-/Quick-Replacement-/Quick-Timer-/BFCache-/Background-Pause-/Hidden-Snapshot-/Backup-/Content-/Privacy-/Reference-/Asset-/Accessibility-/Operator-/Release-Audits.

Wave 1 aktuell:

- `tests/party-wave-one-catalog.test.js`
- `tests/party-wave-one-imposter-catalog.test.js`
- `tests/e2e/wave-one-quiz.spec.js`
- `tests/e2e/wave-one-imposter.spec.js`
- `scripts/wave_one_quiz_audit.py`
- `scripts/wave_one_imposter_audit.py`

Release Candidate zusätzlich: Online-`npm ci`, vollständiges CI, Chromium/Firefox/WebKit, HTTPS-Staging, reale PWA-/Geräte-/Accessibility-/Gruppentests.

## 21. Performance und Assets

Produktionsmodule bleiben grundsätzlich unter 1000 Zeilen und 100 KB. Neue sichtbare Varianten sollen bevorzugt Content auf gemeinsamen Engines wiederverwenden. PWA-Assets: `icon.svg`, `icon-192.png`, `icon-512.png`; Provenienz wird separat geprüft.

## 22. Betrieb, Deprecation und Rollback

Kein Force-Push auf stabile Release-Basen. Rollback/Hotfix erhält nach Offline-Core-Änderungen eine neue Cachegeneration. Persistierte Daten müssen kompatibel bleiben oder explizit migriert werden.

## 23. Releaseentscheidung

Eine Funktion ist erst releasefähig, wenn Code, Datenverhalten, Privacy/Security, Offline, Accessibility, Tests und Dokumentation zusammenpassen **und reale Gates tatsächlich ausgeführt wurden**. `release-evidence.json` ist die finale Quelle; `GO` erst bei belegten PASS-Gates auf demselben unveränderten RC.
