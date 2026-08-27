# Secret Circle – Sicherungsformate

Stand: 27. August 2026  
Vertragsregister: `backup-schema-registry.js` Version 2  
Aktueller Offline-Core: **`secret-circle-v58` / `secret-circle-v58-staging`**

## Gemeinsame Regeln

- maximale Datei: **1.500.000 UTF-8-Bytes**
- JSON / `.json`
- Format/Version vor Inhalt prüfen
- unbekannte Versionen nicht still akzeptieren
- vollständige Validierung vor der ersten Mutation
- Schreibfehler versucht den vorherigen verwalteten Zustand wiederherzustellen
- Exporte sind unverschlüsselt

## Word Imposter

- Registry-ID `word-imposter`
- Format `secret-circle-backup`
- Version 1
- Scope: aktiver Zustand, eigene Begriffe, Verlauf, Einstellungen

## Complete Backup

- Registry-ID `complete`
- Format `secret-circle-complete-backup`
- Version 1
- Runtime: `party-data-tools.js` Version 6
- max. 100 Einträge
- max. 1.000.000 Bytes je Wert

Der Complete-Restore verwaltet **nur die 17 aktuell registrierten exakten Storage-Keys**:

- `secret-circle-active-v7`
- `secret-circle-custom-v7`
- `secret-circle-history-v7`
- `secret-circle-settings-v7`
- `secret-circle-party-hub-v1`
- `secret-circle-party-hub-active-v1`
- `secret-circle-party-active-v1`
- `secret-circle-party-quick-active-v1`
- `secret-circle-party-mega-active-v1`
- `secret-circle-party-viral-active-v1`
- `secret-circle-party-created-active-v1`
- `secret-circle-party-quick-timers-v1`
- `secret-circle-party-created-games-v1`
- `secret-circle-party-custom-packs-v1`
- `secret-circle-party-night-v1`
- `secret-circle-party-preferences-v1`
- `secret-circle-party-catalog-filters-v1`

Wildcard-Verträge wie `secret-circle-party-<name>-v<version>` sind absichtlich **nicht** Restore-Eigentum. Eine zukünftige Version wie `secret-circle-party-hub-v2` oder `secret-circle-settings-v8` muss von einem heutigen Restore unangetastet bleiben.

### Quick-Timer-Metadaten seit v57

`secret-circle-party-quick-timers-v1` enthält ausschließlich technische Resume-Metadaten für laufende Quick-/Mega-/Viral-/Creator-Timer:

- Familie: `quick`, `mega`, `viral` oder `created`
- `gameId`
- `sessionId`
- `round`
- `phase`
- ursprüngliche `durationMs`
- verbleibende `remainingMs`

Der Store enthält **keinen Prompt, keine Antwort, keine Mission, keine Identität und keinen geheimen Karteninhalt**. Ein Timer-Snapshot darf nur wiederverwendet werden, wenn Game-ID, Session-ID, Runde, Phase und ursprüngliche Dauer exakt zur aktiven Session passen. Stale Snapshots werden verworfen.

v58 ändert das Backup-Dateiformat nicht. Die BFCache-Härtung nutzt denselben promptfreien Timer-Store und verändert ausschließlich den Browser-Lifecycle bei `pageshow.persisted`.

### Restore-Vertrag seit Offline-Core v51

- Complete Restore besitzt nur die vom Registry-Schema explizit verwalteten aktuellen Keys.
- unbekannte andere `secret-circle-*`-Namespaces und zukünftige Storage-Versionen werden nicht importiert **und bei einem Restore nicht gelöscht**.
- dadurch kann ein älteres Backup lokale Daten einer neueren Secret-Circle-Version nicht still entfernen.
- jeder verwaltete Backup-Wert muss ein String mit gültigem JSON sein.
- die geparste JSON-Wurzel muss den für den Key erwarteten Root-Typ besitzen.
- die Registry prüft zusätzlich die aktuelle Storage-Version und minimale Wrapper-Pflichtfelder, bevor der Restore mutiert.
- Beispiel: `secret-circle-party-hub-v1` mit `{ "version": 999, ... }` wird abgelehnt, obwohl das JSON syntaktisch korrekt ist.
- tiefe Fachnormalisierung bleibt Aufgabe der jeweiligen Runtime/Engine; die Backup-Schicht dupliziert keine vollständige Spiellogik.
- alle Entries werden vollständig validiert, bevor der erste verwaltete lokale Key entfernt oder geschrieben wird.
- vor dem Restore wird ein Snapshot der aktuell verwalteten Keys erstellt.
- scheitert Löschen oder Schreiben, werden die verwalteten Keys erneut geleert und aus diesem Snapshot wiederhergestellt.
- unbekannte/future Namespaces bleiben auch während eines solchen Rollbacks unangetastet.

### Vollständige Datenlöschung

„Alle lokalen Daten löschen“ ist **kein Restore** und besitzt bewusst den gesamten `secret-circle-*`-Prefix. Die ausdrücklich bestätigte Löschung entfernt daher auch unbekannte, alte oder zukünftige Secret-Circle-Namespaces, damit keine lokalen App-Reste zurückbleiben.

## Creator Library

- Registry-ID `creator-library`
- Format `secret-circle-created-games`
- Version 1
- max. 40 Spiele
- max. 8 Packs je Spiel
- max. 200 Karten je Pack

## Importreihenfolge Complete Backup

1. Datei/UTF-8-Größe
2. Header/Version
3. Entries/exakte Key-Allowlist
4. Wertgröße
5. JSON-Syntax + Root-Typ
6. key-spezifische Storage-Version + minimale Pflichtstruktur
7. Snapshot der verwalteten lokalen Keys
8. nur verwaltete Keys entfernen
9. Zielwerte schreiben
10. bei Fehler nur verwaltete Keys auf Snapshot zurückrollen
11. unbekannte/future Namespaces und Storage-Versionen unverändert lassen

## Migration

Neue Backupversion nur bei struktureller/semantischer Änderung des **Dateiformats**, nicht bei jeder Appversion. v51 verschärfte Restore-Sicherheit; v57 ergänzt einen weiteren exakt verwalteten aktuellen Storage-Key; v58 ändert nur den BFCache-Lifecycle. Das Backup-Dateiformat bleibt Version 1.

Eine zukünftige neue Backupversion benötigt:

- explizite alte Version
- reine Migration
- Validierung
- Korrupt-/Oversize-/Rollbacktests
- Forward-Compatibility-Entscheid
- Changelog/Dokumentation

## Automatische Verträge

- `tests/backup-schema-registry.test.js`: Registry Version 2, exakte 17-Key-Allowlist, Key-Eigentümer, Root-/Storage-Version-/Wrapper-Verträge einschließlich Quick-Timer-Store
- `tests/e2e/party-data.spec.js`: Export/Import, Future-Key-Erhalt, ungültige JSON-/Primitive-/Storage-Version-Werte, Write-Rollback, vollständige Löschung
- `tests/e2e/backup-forward-compat.spec.js`: zukünftiger Namespace und `party-hub-v2` überleben heutigen Restore; Future-Version-Import wird abgelehnt
- `tests/party-session-controls.test.js` + `tests/e2e/quick-timer-resume.spec.js`: Timer-Snapshot-Konsistenz, Stale-Reject und BFCache-Lifecycle
- `scripts/backup_contract_audit.py`: Registry/Runtime/Test/Offline-/Dokumentationsgrenze
- `scripts/quick_timer_resume_audit.py`: QT57-Timerresume-Vertrag
- `scripts/quick_bfcache_resume_audit.py`: BF58-Browser-Lifecycle-Vertrag
- `tests/service-worker.test.js`: Registry und gemeinsame Session-Controls im v58-Offline-Core

## Release-Gates

- [ ] Registry/Runtime identische Verträge
- [ ] UTF-8-Grenzen real
- [ ] unbekannte Backupversionen abgelehnt
- [ ] nicht registrierte Complete-Keys abgelehnt
- [ ] unbekannter/future Secret-Circle-Key überlebt Restore
- [ ] zukünftige Version eines bekannten Keys überlebt Restore
- [ ] Future-Key darf vom heutigen Backup nicht importiert werden
- [ ] Klartext, primitive JSON-Wurzeln und falsche Storage-Versionen werden vor Mutation abgelehnt
- [ ] Quick-Timer-Store enthält nur technische Metadaten
- [ ] Quick-Timer-Snapshot wird nur bei exakt passender Session/Runde/Phase/Dauer verwendet
- [ ] BFCache-Rückkehr verändert den Timer-Store nur gemäß BF58-Vertrag
- [ ] Validierung vollständig vor Schreiben
- [ ] Write-Rollback simuliert
- [ ] vollständige Löschung entfernt auch unbekannte Secret-Circle-Namespaces
- [ ] Export→Import real
- [ ] zwei Browser real
- [ ] PWA-Update/Backup zusammen geprüft

Code-/Contracttests sind vorbereitet, echter Runner/Browsernachweis bleibt offen.