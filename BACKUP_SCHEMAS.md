# Secret Circle – Sicherungsformate

Stand: 28. August 2026  
Vertragsregister: `backup-schema-registry.js` Version 2  
Aktueller Offline-Core: **`secret-circle-v64` / `secret-circle-v64-staging`**

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

v58 ändert nur den BFCache-Lifecycle. v59 pausiert laufende Timer bei `document.hidden` und verlangt nach Rückkehr eine bewusste Fortsetzung. v60 persistiert dieselbe bereits definierte Restzeitstruktur bereits bei `visibilitychange(hidden)`, damit ein Cold Resume auch ohne zuverlässiges nachfolgendes `pagehide` möglich ist. **v58–v60 ändern weder die 17-Key-Allowlist noch das Backup-Dateiformat.**

### Restore-Vertrag seit Offline-Core v51

- Complete Restore besitzt nur die vom Registry-Schema explizit verwalteten aktuellen Keys.
- unbekannte andere `secret-circle-*`-Namespaces und zukünftige Storage-Versionen werden nicht importiert **und bei einem Restore nicht gelöscht**.
- dadurch kann ein älteres Backup lokale Daten einer neueren Secret-Circle-Version nicht still entfernen.
- jeder verwaltete Backup-Wert muss ein String mit gültigem JSON sein.
- die geparste JSON-Wurzel muss den für den Key erwarteten Root-Typ besitzen.
- die Registry prüft zusätzlich die aktuelle Storage-Version und minimale Wrapper-Pflichtfelder, bevor der Restore mutiert.
- tiefe Fachnormalisierung bleibt Aufgabe der jeweiligen Runtime/Engine; die Backup-Schicht dupliziert keine vollständige Spiellogik.
- alle Entries werden vollständig validiert, bevor der erste verwaltete lokale Key entfernt oder geschrieben wird.
- vor dem Restore wird ein Snapshot der aktuell verwalteten Keys erstellt.
- scheitert Löschen oder Schreiben, werden die verwalteten Keys erneut geleert und aus diesem Snapshot wiederhergestellt.
- unbekannte/future Namespaces bleiben auch während eines solchen Rollbacks unangetastet.

### Vollständige Datenlöschung

„Alle lokalen Daten löschen“ ist **kein Restore** und besitzt bewusst den gesamten `secret-circle-*`-Prefix. Die ausdrücklich bestätigte Löschung entfernt daher auch unbekannte, alte oder zukünftige Secret-Circle-Namespaces.

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

Neue Backupversion nur bei struktureller/semantischer Änderung des **Dateiformats**, nicht bei jeder Appversion. v51 verschärfte Restore-Sicherheit; v57 ergänzte den Timer-Store; v58–v60 ändern ausschließlich Browser-/Timer-Lifecycle. Das Backup-Dateiformat bleibt Version 1.

## Automatische Verträge

- `tests/backup-schema-registry.test.js`: Registry Version 2, exakte 17-Key-Allowlist und Timer-Store-Schema
- `tests/e2e/party-data.spec.js`: Export/Import, Future-Key-Erhalt, Validierung, Write-Rollback, vollständige Löschung
- `tests/e2e/backup-forward-compat.spec.js`: zukünftige Namespaces/Versionen bleiben erhalten
- `tests/party-session-controls.test.js`: Timer-Snapshot, BFCache, Background-Pause und hidden-only Cold Resume
- `tests/e2e/quick-timer-resume.spec.js`: QT57/BF58
- `tests/e2e/quick-background-pause.spec.js`: BG59/HS60
- `scripts/backup_contract_audit.py`: Registry/Runtime/Test/Offline-/Dokumentationsgrenze
- `scripts/quick_timer_resume_audit.py`: QT57
- `scripts/quick_bfcache_resume_audit.py`: BF58
- `scripts/quick_background_pause_audit.py`: BG59
- `scripts/quick_hidden_snapshot_audit.py`: HS60
- `tests/service-worker.test.js`: aktuelle Runtime im v60-Offline-Core

## Release-Gates

- [ ] Registry/Runtime identische Verträge
- [ ] UTF-8-Grenzen real
- [ ] unbekannte Backupversionen abgelehnt
- [ ] nicht registrierte Complete-Keys abgelehnt
- [ ] unbekannter/future Secret-Circle-Key überlebt Restore
- [ ] zukünftige Version eines bekannten Keys überlebt Restore
- [ ] Quick-Timer-Store enthält nur technische Metadaten
- [ ] Timer-Snapshot nur bei passender Session/Runde/Phase/Dauer
- [ ] BFCache-Rückkehr gemäß BF58
- [ ] Background-Pause gemäß BG59
- [ ] HS60 hidden-only Snapshot kann Cold Resume ermöglichen und wird bei normalem Same-Page-Stop wieder entfernt
- [ ] v60 verändert weder Key-Allowlist noch Backup-Dateiformat
- [ ] Validierung vollständig vor Schreiben
- [ ] Write-Rollback simuliert
- [ ] vollständige Löschung entfernt alle `secret-circle-*`-Keys
- [ ] Export→Import real
- [ ] zwei Browser real
- [ ] PWA-Update/Backup zusammen geprüft

Code-/Contracttests sind vorbereitet, echter Runner/Browsernachweis bleibt offen.