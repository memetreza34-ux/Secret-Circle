# Secret Circle – Architekturvertrag für langfristige Wartbarkeit

Stand: 28. August 2026

Secret Circle bleibt für den Januar-2027-Release eine statische **offline-first PWA** für gemeinsame Spiele auf einem Gerät.

## 1. Produktgrenzen

V1 besitzt kein Pflichtkonto, Backend, eigene Server-API, Werbung, Tracking oder externe Runtime-CDNs. Neue Online-/Cloud-/Kamera-/Mikrofonfunktionen benötigen einen neuen Architektur-, Privacy- und Securityentscheid.

## 2. Stabile Identitäten

Persistierte Spiel-/Pack-/Creator-/Session-/Completion-IDs, Storage-Keys, Backupformate, Manifest-ID und PWA-Scope sind Verträge. Persistierte IDs werden nur mit Migration geändert. Ein Abschluss darf Verlauf und Statistik genau einmal verändern.

## 3. Versionierte Daten und Backups

`backup-schema-registry.js` Version 2 ist die zentrale Quelle für Complete-Backup-Format, Größenlimits und aktuell **17 explizit verwaltete Storage-Keys**. `party-data-tools.js` Version 6 konsumiert diesen Vertrag.

Seit v51 verändert Restore nur registrierte aktuelle Keys; Future-/Unknown-Namespaces bleiben erhalten. Seit v57 gehört der promptfreie Timer-Store `secret-circle-party-quick-timers-v1` zum Complete Backup.

## 4. Katalog- und Contentarchitektur

Kette:

`party-catalog.js → party-expansion.js → party-trending-catalog.js → party-mega-catalog.js → party-viral-catalog.js → party-core-release-catalog.js → party-core-classic-content.js → party-routing.js`

`party-core-classic-content.js` steht auf v4. Privacy-/Reference-Safe-Entscheidungen werden durch eigene Audits geschützt.

## 5. Hub- und Timergrenzen

`party-hub.js`, `party-hub-round-state.js`, `party-hub-timers.js`, `party-session-controls.js`, `party-hub-resume-guard.js`, `party-hub-polish.js` und `party-hub-a11y.js` besitzen getrennte Verantwortlichkeiten.

Runtime-Reihenfolge: `party-session-controls.js → party-hub-timers.js → party-hub-round-state.js → party-hub.js`.

v52: sichere Hub-Karten bleiben über Reload stabil. v53: Paranoia bleibt verdeckt und behält Frage/Resultat. v54: Hot Potato/Wortkette behalten sichere Pre-Timer-Werte.

## 6. Advanced-Core-Grenzen – v55

Advanced trennt `party-advanced.js`, `advanced-resume-guard.js`, `party-advanced-runner.js` und `advanced-privacy-guard.js`. Guard v4 schützt Location-Result-Pfade, Mafia-Rollen-/Winnerzustände, exact-once-Abschluss und bestätigten Session-Ersatz.

## 7. Quick-/Mega-/Viral-/Creator-Session-Ersatz – v56

`quick-session-replacement-guard.js` v1 + `quick-loader.js` v7 schützen Same-/Cross-Game-Ersatz in Quick/Trending, Mega, Viral und Creator. Ein vorhandener Family-Snapshot wird nur nach Bestätigung ersetzt; Write-Fail bleibt fail-closed.

## 8. Quick-Family Timer Resume – v57

`party-session-controls.js` führte den gemeinsamen Restzeit-Resume ein. `secret-circle-party-quick-timers-v1` speichert ausschließlich `gameId`, `sessionId`, `round`, `phase`, `durationMs` und `remainingMs` je Enginefamilie. Prompt-/Antwort-/Mission-/Identitäts-/Karteninhalte sind verboten.

Ein Snapshot wird nur bei exakt passender Game-ID, Session-ID, Runde, Phase und Ausgangsdauer konsumiert. Stale Snapshots werden gelöscht.

## 9. Quick-Family BFCache Resume – v58

Bei `pageshow.persisted === true` prüft die gemeinsame Sessionsteuerung den gespeicherten Timer-Snapshot. Ein exakt passender Snapshot führt kontrolliert in den normalen QT57-Resume-Pfad; der Snapshot bleibt bis dahin erhalten. Ein stale/fremder Snapshot wird gelöscht, ohne unnötigen Reload. BFCache darf keinen eingefrorenen `running`-Timer als interaktiven Zustand zurücklassen.

## 10. Quick-Family Background Pause – v59

Für Quick/Trending, Mega, Viral und Creator gilt bei einem tatsächlich laufenden Timer:

- `document.hidden === true` löst über `visibilitychange` automatisch Pause aus;
- Hintergrundzeit durch App-Wechsel, Tabwechsel oder Screen-Lock wird nicht vom Timer abgezogen;
- beim erneuten Sichtbarwerden erfolgt **kein Auto-Resume**;
- erst eine bewusste Nutzeraktion setzt den Timer fort;
- ohne aktive laufende Timer-Runde verändert `visibilitychange` keinen Spielzustand.

## 11. Quick-Family Hidden Snapshot – v60

`party-session-controls.js` steht seit **v60 auf Version 5**.

Mobile Browser/OS können eine Seite nach `visibilitychange(hidden)` beenden, ohne zuverlässig noch `pagehide` auszuliefern. Deshalb gilt zusätzlich:

- sobald eine aktive Quick-Family-Timerrunde `hidden` wird, wird die aktuelle Restzeit **sofort** in `secret-circle-party-quick-timers-v1` persistiert;
- diese Visibility-Persistenz setzt **nicht** `preservePersistedOnNextStop`, damit ein normal fortgesetzter/abgeschlossener Round-Flow den Snapshot wieder löschen kann;
- nur der `pagehide`-Pfad ruft `persistRunningTimerSnapshot(true)` auf, weil dort die Engine direkt danach ihren In-Memory-Timer stoppen kann;
- ein Cold-Start nach OS-Kill ohne `pagehide` kann dadurch dieselbe Restzeit über den bestehenden QT57-Vertrag einmalig wieder aufnehmen;
- ein normaler Same-Page-Stop entfernt den Visibility-Snapshot wieder;
- der Store bleibt promptfrei und das Backup-Dateiformat bleibt unverändert.

`tests/party-session-controls.test.js`, `tests/e2e/quick-background-pause.spec.js` und `scripts/quick_hidden_snapshot_audit.py` schützen HS60. Reale Prozess-Kill-/App-Wechsel-Abnahme bleibt Geräte-Evidence.

## 12. Lokale Transaktionen und Exact-once

Kritische Datenoperationen validieren zuerst, sichern den alten Zustand, schreiben vollständig und rollen bei Fehlern zurück. Fertige Sessions besitzen stabile Completion-/History-IDs. Reload, Retry oder Doppelklick dürfen keinen zweiten Verlaufseintrag erzeugen.

## 13. Datenschutz und Security durch Architektur

- keine Analytics-/Ads-Skripte oder externen Runtime-CDNs
- restriktive CSP
- Imports nach Format, Version, Größe, Key-Allowlist und Struktur
- Geheimkarten/Rollen/Fragen bei Fokusverlust verdecken
- geheime Zustände nach Reload nie automatisch sichtbar öffnen
- Timer-Resume speichert nur technische Restzeit-Metadaten
- Hintergrundwechsel pausieren laufende Quick-Family-Timer statt Zeit unsichtbar abzuziehen
- Hidden persistiert technische Restzeit sofort für einen möglichen OS-Kill
- Sichtbarwerden startet einen pausierten Timer nicht automatisch
- manipulierte Resume-Zustände werden fail-closed verworfen
- Session-Ersatz erfolgt nicht still

## 14. Offline- und Updatevertrag

Aktueller Offline-Core: **`secret-circle-v60` / `secret-circle-v60-staging`**.

Jüngere Linie: v51 Backup → v52 Safe Current → v53 Paranoia → v54 Pre-Timer → v55 Advanced Integrity → v56 Quick Replacement → v57 Quick Timer Resume → v58 BFCache Restore → v59 Background Pause → **v60 Hidden Snapshot Durability**.

Bei jeder Änderung einer Offline-Core-Datei: CORE prüfen → Cachegeneration erhöhen → SW-Test aktualisieren → Architektur/Deployment/Privacy/Environment/Hosting synchronisieren → Alt→Neu/Rollback real testen.

## 15. PWA-Installationsmetadaten

`party.html`, `index.html`, `creator.html`, `advanced.html` und `quick-play.html` besitzen denselben Installationsvertrag. Reale Homescreen-/Standalone-Abnahme bleibt Geräte-Evidence.

## 16. Accessibility als Definition of Done

Kernoberflächen benötigen semantische Struktur, Labels, sichtbaren Fokus, Tastaturbedienung, modale Fokusgrenzen, Touchziele, Reduced Motion und Reflow. VoiceOver/TalkBack/Touch/Zoom bleiben reale Gates.

## 17. Inhalts- und Rechtevertrag

Keine kopierten proprietären Karten, fremden Medien/Logos ohne Rechte oder unnötigen konkreten Marken-/Franchisebezug. Ein `unresolved` Releaseasset blockiert `assetsThirdParty = PASS`.

## 18. Testpyramide

Normale Änderungen: Syntaxchecks, Unit-/Contracttests und Architektur-/Advanced-/Quick-Replacement-/Quick-Timer-/BFCache-/Background-Pause-/Hidden-Snapshot-/Backup-/Content-/Privacy-/Reference-/Asset-/Accessibility-/Operator-/Release-Audits.

QT57: `scripts/quick_timer_resume_audit.py`. BF58: `scripts/quick_bfcache_resume_audit.py`. BG59: `scripts/quick_background_pause_audit.py`. HS60: `scripts/quick_hidden_snapshot_audit.py`. Release Candidate zusätzlich: Online-`npm ci`, vollständiges CI, Chromium/Firefox/WebKit, HTTPS-Staging, reale PWA-/Geräte-/Accessibility-/Gruppentests.

## 19. Performance und Assets

Produktionsmodule bleiben grundsätzlich unter 1000 Zeilen und 100 KB. PWA-Assets: `icon.svg`, `icon-192.png`, `icon-512.png`, Provenienzmanifest. Rechtebasis wird separat menschlich freigegeben.

## 20. Betrieb, Deprecation und Rollback

Kein Force-Push auf stabile Release-Basen. Rollback/Hotfix erhält nach Offline-Core-Änderungen eine neue Cachegeneration. Persistierte Daten müssen kompatibel bleiben oder explizit migriert werden.

## 21. Releaseentscheidung

Eine Funktion ist erst releasefähig, wenn Code, Datenverhalten, Privacy/Security, Offline, Accessibility, Tests und Dokumentation zusammenpassen **und reale Gates tatsächlich ausgeführt wurden**. `release-evidence.json` ist die finale Quelle; `GO` erst bei belegten PASS-Gates auf demselben unveränderten RC.