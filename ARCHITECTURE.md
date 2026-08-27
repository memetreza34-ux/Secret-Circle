# Secret Circle – Architekturvertrag für langfristige Wartbarkeit

Stand: 27. August 2026

Secret Circle bleibt für den Januar-2027-Release eine statische **offline-first PWA** für gemeinsame Spiele auf einem Gerät.

## 1. Produktgrenzen

V1 besitzt kein Pflichtkonto, Backend, eigene Server-API, Werbung, Tracking oder externe Runtime-CDNs. Online-Multiplayer, Cloud-Sync, Live-KI-Inhalte, Kamera/Mikrofon oder Mehrgerätefunktionen benötigen einen neuen Produkt-, Privacy-, Security- und Architekturentscheid.

## 2. Stabile Identitäten

Persistierte Spiel-/Pack-/Creator-/Session-/Completion-IDs, Storage-Keys, Backupformate, Manifest-ID und PWA-Scope sind Verträge. Anzeigenamen dürfen geändert werden; persistierte IDs nur mit Migration. Ein Abschluss darf Verlauf und Statistik genau einmal verändern.

## 3. Versionierte Daten und Backups

`backup-schema-registry.js` Version 2 ist die zentrale Quelle für Complete-Backup-Format, Größenlimits und aktuell **17 explizit verwaltete Storage-Keys**. `party-data-tools.js` Version 6 konsumiert diesen Vertrag.

Seit v51 gilt: Restore verändert nur registrierte aktuelle Keys; unknown/future Namespaces und Storage-Versionen bleiben erhalten; managed Werte werden vor Mutation strukturell geprüft; Schreibfehler rollen ausschließlich managed Keys zurück; „Alle lokalen Daten löschen“ bleibt separat prefixweit.

Seit v57 gehört `secret-circle-party-quick-timers-v1` zum Complete-Backup-Vertrag. Er enthält ausschließlich technische Timer-Resume-Metadaten und keinen Karten-/Promptinhalt.

## 4. Katalog- und Contentarchitektur

Kette:

`party-catalog.js → party-expansion.js → party-trending-catalog.js → party-mega-catalog.js → party-viral-catalog.js → party-core-release-catalog.js → party-core-classic-content.js → party-routing.js`

`party-core-classic-content.js` steht auf **v4**. Privacy-/Reference-Safe-Entscheidungen werden durch eigene Audits geschützt.

## 5. Hub- und Timergrenzen

- `party-hub.js`: direkte Hub-Sessions und nicht zeitgesteuerte Flows
- `party-hub-round-state.js`: Current-Referenzen, Truth/Dare-Pools, sichere/verdeckte Resume-Phasen
- `party-hub-timers.js`: Scharade, Tabu, Hot Potato, Wortkette
- `party-session-controls.js`: gemeinsame pausierbare Timer-/Sessionsteuerung
- `party-hub-resume-guard.js`: Timer-/Resume-Integrität
- `party-hub-polish.js`: Live-Guidance/Privacy
- `party-hub-a11y.js`: Fokus-/Modalgrenzen

Runtime-Reihenfolge:

`party-session-controls.js → party-hub-timers.js → party-hub-round-state.js → party-hub.js`

v52: sichere Truth-Dare-/Prompt-/Choice-Karten bleiben als validierte Indexreferenz über Reload stabil; Wahrheit/Pflicht besitzen getrennte Usage-Pools.

v53: Paranoia darf Frage/Phase/Münzwurf-Ergebnis als validierte Referenz fortsetzen, bleibt nach Reload und Fokusverlust aber gedeckt.

v54: Hot-Potato-Aufgabe und Wortketten-Startbuchstabe dürfen **vor Timerstart** als sichere Current-Referenz fortgesetzt werden. Beim Start wird `current` gelöscht und derselbe Wert über `timer.prompt`/`timer.letter` übernommen. Scharade/Tabu bleiben ausgeschlossen.

## 6. Advanced-Core-Grenzen – v55

Advanced trennt `party-advanced.js`, `advanced-resume-guard.js`, `party-advanced-runner.js` und `advanced-privacy-guard.js`.

Seit **v55** gilt zusätzlich:

- `advanced-resume-guard.js` Version **4**;
- Location Spy akzeptiert im Result-State **genau einen** Ergebnisweg: Gruppenwahl **oder** Spion-Ortsguess, niemals beides gleichzeitig;
- Mafia darf nur `stage=finished` besitzen, wenn die aktuelle Alive-Verteilung bereits einen Sieger bestimmt; umgekehrt darf ein nicht-fertiger Stage keinen bereits eindeutigen Siegerzustand fortsetzen;
- Mafia-Rollenanzahl muss zur Spielerzahl und zum Pack passen;
- eine fertige Mafia-Runde vor „Neue Mafia-Runde“ wird beim direkten Sessionabschluss genau einmal gezählt;
- eine vorhandene Advanced-Resume-Session darf durch „Neue Session beginnen“ nur nach expliziter Verwerfbestätigung ersetzt werden;
- schlägt das Entfernen des alten Active-State fehl, startet keine neue Session;
- geheime Reveals und Mafia-Moderatorinformationen bleiben bei Reload/Fokusverlust geschützt.

`tests/e2e/advanced-*.spec.js`, `tests/advanced-resume-guard.test.js` und `scripts/advanced_integrity_audit.py` schützen diese Grenze.

## 7. Quick-/Mega-/Viral-/Creator-Session-Ersatz – v56

Die vier Schnellspiel-Enginefamilien teilen je Familie einen Active-Storage-Key. Deshalb darf ein normaler Start weder eine bestehende Session desselben Spiels noch die Session eines anderen Spiels derselben Familie still überschreiben.

Seit **v56** gilt:

- `quick-session-replacement-guard.js` Version **1** ordnet Quick/Trending, Mega, Viral und Creator ihrem jeweiligen Active-Key zu;
- `quick-loader.js` Version **7** lädt Session Ledger → Session Controls → Replacement Guard → Engine;
- ein plausibler vorhandener Snapshot verlangt vor „Spiel starten“ eine explizite Verwerfbestätigung;
- Cancel verändert weder Storage noch Session-ID;
- Cross-Game-Wechsel innerhalb derselben Familie benötigt dieselbe Bestätigung;
- der Guard löscht den alten Snapshot **nicht** vor dem Neustart;
- schlägt der Replacement-Write fehl, bleibt der gespeicherte Alt-Snapshot fail-closed erhalten.

`tests/quick-session-replacement-guard.test.js`, `tests/e2e/quick-session-replacement.spec.js` und `scripts/quick_session_replacement_audit.py` schützen diese Grenze.

## 8. Quick-Family Timer Resume – v57

`party-session-controls.js` steht seit **v57 auf Version 2** und besitzt den gemeinsamen Timer-Resume-Vertrag für Quick/Trending, Mega, Viral und Creator.

- laufende Restzeit wird bei `pagehide` **vor** dem Engine-Stop erfasst;
- gespeichert wird ausschließlich in `secret-circle-party-quick-timers-v1`;
- Snapshot-Felder: Familie, `gameId`, `sessionId`, `round`, `phase`, `durationMs`, `remainingMs`;
- **kein Prompt, keine Antwort, Mission, Identität, Karte oder anderer geheimer Inhalt** wird im Timer-Store gespeichert;
- Resume ist nur erlaubt, wenn Game-ID, Session-ID, Runde, Phase und ursprüngliche Dauer exakt passen;
- ein passender Snapshot wird genau einmal konsumiert;
- stale/fremde Snapshots werden verworfen und dürfen einen neuen Timer weder verkürzen noch verlängern;
- `setSessionActive(false)` und normale Timerabschlüsse räumen persistierte Timer-Metadaten auf;
- der Timer-Store ist als 17. exakter Key im Complete-Backup-Schema registriert.

`tests/party-session-controls.test.js`, `tests/e2e/quick-timer-resume.spec.js` und `scripts/quick_timer_resume_audit.py` schützen diese Grenze.

## 9. Lokale Transaktionen und Exact-once

Kritische Datenoperationen validieren zuerst, sichern den alten Zustand, schreiben vollständig und rollen bei Fehlern zurück. Fertige Sessions besitzen stabile Completion-/History-IDs. Reload, Retry oder Doppelklick dürfen keinen zweiten Verlaufseintrag erzeugen.

Session-Ersatz ist ebenfalls eine lokale Transaktion: Ein vorhandener Quick-Family-Snapshot bleibt bis zum erfolgreichen Schreiben seines Nachfolgers erhalten.

## 10. Datenschutz und Security durch Architektur

- keine Analytics-/Ads-Skripte oder externen Runtime-Fonts/CDNs
- restriktive CSP
- Nutzereingaben bevorzugt über `textContent`
- Importgrenzen nach Format, Version, Größe, Key-Allowlist und Struktur
- Geheimkarten/Rollen/Fragen bei Fokusverlust verdecken
- geheime Zustände nach Reload nie automatisch sichtbar öffnen
- sichere Current-/Pre-Timer-Werte dürfen kontrolliert fortgesetzt werden
- Quick-Timer-Resume speichert nur technische Restzeit-Metadaten
- Advanced-Snapshots mit unmöglichen Ergebnis-/Winnerzuständen werden fail-closed verworfen
- vorhandene Advanced-Resume-Sessions werden nicht still durch einen Neustart ersetzt
- vorhandene Quick-/Mega-/Viral-/Creator-Sessions werden nicht still durch einen normalen Start ersetzt
- persönliche Inhalte freiwillig/überspringbar

## 11. Offline- und Updatevertrag

Aktueller Offline-Core: **`secret-circle-v57` / `secret-circle-v57-staging`**.

Jüngere Generationen:

- v48 Word-Imposter Voting-/Datenhärtung
- v49 zentraler Hub-Resume-Guard
- v50 fail-closed Resume-UI
- v51 Complete Backup / Forward Compatibility
- v52 sichere direkte Hub-Current-Runden
- v53 Paranoia Resume/Privacy
- v54 sichere Pre-Timer-Kontinuität für Hot Potato/Wortkette
- v55 Advanced Resume-/Winner-/Result-Integrität + bestätigter Session-Ersatz
- v56 bestätigter/fail-closed Quick-Family-Session-Ersatz
- **v57 persistente Quick-Family-Timer-Restzeit über Reload**

Neue Versionen werden zuerst im `STAGING_CACHE` vorbereitet und erst nach bewusster Nutzeraktivierung übernommen. Der aktive Cache wird nicht vor erfolgreicher Promotion zerstört.

Bei jeder Änderung einer Offline-Core-Datei: CORE prüfen → Cachegeneration erhöhen → SW-Test aktualisieren → Architektur/Deployment/Privacy/Environment/Hosting synchronisieren → Alt→Neu/Rollback real testen.

## 12. PWA-Installationsmetadaten

`party.html`, `index.html`, `creator.html`, `advanced.html` und `quick-play.html` besitzen denselben Installationsvertrag. Reale Homescreen-/Standalone-Abnahme bleibt Geräte-Evidence.

## 13. Accessibility als Definition of Done

Kernoberflächen benötigen semantische Struktur, Labels, sichtbaren Fokus, Tastaturbedienung, modale Fokusgrenzen, Touchziele, Reduced Motion und Reflow. Quellschichten: `party-hub-a11y.js` und `secondary-surface-a11y.js`. VoiceOver/TalkBack/Touch/Zoom bleiben reale Gates.

## 14. Inhalts- und Rechtevertrag

Keine kopierten proprietären Karten, fremden Medien/Logos ohne Rechte oder unnötigen konkreten Marken-/Franchisebezug. Nutzerinhalte bleiben getrennt. Ein `unresolved` Releaseasset blockiert `assetsThirdParty = PASS`.

## 15. Testpyramide

Normale Änderungen: Syntaxchecks, Unit-/Contracttests und Architektur-/Advanced-/Quick-Replacement-/Quick-Timer-/Backup-/Content-/Privacy-/Reference-/Asset-/Accessibility-/Operator-/Release-Audits.

Advanced besitzt seit v55 `scripts/advanced_integrity_audit.py`; Quick-Family-Session-Ersatz seit v56 `scripts/quick_session_replacement_audit.py`; Timer-Restzeit-Resume seit v57 `scripts/quick_timer_resume_audit.py`.

Release Candidate zusätzlich: Online-`npm ci`, vollständiges CI, Chromium/Firefox/WebKit, HTTPS-Staging, PWA Upgrade/Rollback, Android/iPhone/Tablet, VoiceOver/TalkBack/Zoom/Tastatur und reale Gruppen.

## 16. Performance und Assets

Produktionsmodule bleiben grundsätzlich unter 1000 Zeilen und 100 KB; engere Budgets haben Vorrang. PWA-Assets: `icon.svg`, `icon-192.png`, `icon-512.png`, Provenienzmanifest. Rechtebasis wird separat menschlich freigegeben.

## 17. Betrieb, Deprecation und Rollback

Kein Force-Push auf stabile Release-Basen. Rollback/Hotfix erhält nach Offline-Core-Änderungen eine neue Cachegeneration. Persistierte Daten müssen kompatibel bleiben oder explizit migriert werden.

## 18. Releaseentscheidung

Eine Funktion ist erst releasefähig, wenn Code, Datenverhalten, Privacy/Security, Offline, Accessibility, Tests und Dokumentation zusammenpassen **und reale Gates tatsächlich ausgeführt wurden**. `release-evidence.json` ist die finale Quelle; `GO` erst bei belegten PASS-Gates auf demselben unveränderten RC.