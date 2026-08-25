# Secret Circle – Sicherungsformate

Stand: 25. August 2026  
Vertragsregister: `backup-schema-registry.js` Version 2  
Aktueller Offline-Core: **`secret-circle-v51` / `secret-circle-v51-staging`**

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
- Runtime: `party-data-tools.js` Version 5
- max. 100 Einträge
- max. 1.000.000 Bytes je Wert

### Exakte aktuell verwaltete Storage-Keys

Der heutige Restore verwendet bewusst **keine Wildcards** für Namen oder Versionsnummern. Verwaltet werden exakt:

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
- `secret-circle-party-created-games-v1`
- `secret-circle-party-custom-packs-v1`
- `secret-circle-party-night-v1`
- `secret-circle-party-preferences-v1`
- `secret-circle-party-catalog-filters-v1`

Ein zukünftiger Key wie `secret-circle-party-hub-v2`, `secret-circle-settings-v8` oder `secret-circle-party-future-feature-v99` gehört **nicht** der heutigen Restore-Version und bleibt deshalb unangetastet.

### Restore-Vertrag seit Offline-Core v51

- Complete Restore **besitzt nur die 16 aktuell explizit registrierten Storage-Keys**.
- unbekannte andere `secret-circle-*`-Namespaces und zukünftige Versionen bekannter Keys werden nicht importiert **und bei einem Restore nicht gelöscht**.
- dadurch kann ein älteres Backup lokale Daten einer neueren Secret-Circle-Version nicht still entfernen.
- jeder verwaltete Backup-Wert muss ein String mit gültigem JSON sein.
- die geparste JSON-Wurzel muss strukturiert sein (Objekt oder Array), nicht `null`, String, Zahl oder Boolean.
- alle Entries werden vollständig validiert, bevor der erste verwaltete lokale Key entfernt oder geschrieben wird.
- vor dem Restore wird ein Snapshot der aktuell verwalteten Keys erstellt.
- scheitert Löschen oder Schreiben, werden die verwalteten Keys erneut geleert und aus diesem Snapshot wiederhergestellt.
- unbekannte/future Namespaces und Storage-Versionen bleiben auch während eines solchen Rollbacks unangetastet.

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
5. JSON-Syntax + strukturierte JSON-Wurzel
6. Snapshot der verwalteten lokalen Keys
7. nur verwaltete Keys entfernen
8. Zielwerte schreiben
9. bei Fehler nur verwaltete Keys auf Snapshot zurückrollen
10. unbekannte/future Namespaces und Versionen unverändert lassen

## Migration

Neue Backupversion nur bei struktureller/semantischer Änderung des **Dateiformats**, nicht bei jeder Appversion. Die v51-Härtung ändert nicht das Backup-Dateiformat Version 1, sondern verschärft ausschließlich die Restore-Sicherheitssemantik der aktuellen Runtime.

Eine zukünftige neue Storage-Version wird erst dann in `completeStorageKeys` aufgenommen, wenn die aktuelle Runtime diese Version tatsächlich besitzt und der dazugehörige Migrations-/Backupvertrag geprüft wurde.

Eine zukünftige neue Backupversion benötigt:

- explizite alte Version
- reine Migration
- Validierung
- Korrupt-/Oversize-/Rollbacktests
- Forward-Compatibility-Entscheid
- Changelog/Dokumentation

## Automatische Verträge

- `tests/backup-schema-registry.test.js`: Registry Version 2, exakte 16-Key-Allowlist, Runtime-Ownership, Future-Version-Ablehnung und zentrale Complete-Konstanten
- `tests/e2e/party-data.spec.js`: Export/Import, Future-Namespace-Erhalt, ungültige JSON-/Primitive-Werte, Write-Rollback, vollständige Löschung
- `tests/e2e/backup-forward-compat.spec.js`: `party-hub-v2`/Future-Party-Namespace überleben Restore; Future-Version darf nicht importiert werden
- `scripts/backup_contract_audit.py`: Registry/Runtime/Test/Offline-/Dokumentationsgrenze
- `tests/service-worker.test.js`: Registry und `party-data-tools.js` im v51-Offline-Core

## Release-Gates

- [ ] Registry/Runtime identische Verträge
- [ ] alle 16 managed Keys besitzen aktuellen Runtime-Eigentümer
- [ ] UTF-8-Grenzen real
- [ ] unbekannte Backupversionen abgelehnt
- [ ] unbekannte Complete-Keys abgelehnt
- [ ] `secret-circle-party-hub-v2` überlebt heutigen Restore
- [ ] zukünftiger Party-Namespace überlebt heutigen Restore
- [ ] Future-Key im Backup wird abgelehnt, ohne Bestandsdaten zu verändern
- [ ] Klartext und primitive JSON-Wurzeln in managed Keys werden vor Mutation abgelehnt
- [ ] Validierung vollständig vor Schreiben
- [ ] Write-Rollback simuliert
- [ ] vollständige Löschung entfernt auch unbekannte Secret-Circle-Namespaces
- [ ] Export→Import real
- [ ] zwei Browser real
- [ ] PWA-Update/Backup zusammen geprüft

Code-/Contracttests sind vorbereitet, echter Runner/Browsernachweis bleibt offen.