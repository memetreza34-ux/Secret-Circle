# Secret Circle – Sicherungsformate

Stand: 16. August 2026  
Vertragsregister: `backup-schema-registry.js` Version 2

## Gemeinsame Regeln

- maximale Datei: **1.500.000 UTF-8-Bytes**
- JSON / `.json`
- Format/Version vor Inhalt prüfen
- unbekannte Versionen nicht still akzeptieren
- vollständige Validierung vor bestehende Daten verändert werden
- Schreibfehler versucht vorherigen Zustand wiederherzustellen
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
- max. 100 Einträge
- max. 1.000.000 Bytes je Wert

Zulässige Key-Familien:

- `secret-circle-(active|custom|history|settings)-v<version>`
- `secret-circle-party-<name>-v<version>`

Unbekannte andere `secret-circle-*`-Namespaces werden **nicht importiert**.

Vollständiges Löschen bleibt absichtlich breiter und entfernt alle `secret-circle-*`-Reste, damit alte/verwaiste Daten nicht zurückbleiben.

## Creator Library

- Registry-ID `creator-library`
- Format `secret-circle-created-games`
- Version 1
- max. 40 Spiele
- max. 8 Packs je Spiel
- max. 200 Karten je Pack

## Importreihenfolge

1. Datei/Größe
2. Header/Version
3. Entries/Keys/Werte
4. Snapshot
5. schreiben
6. bei Fehler Rollback

## Migration

Neue Backupversion nur bei struktureller/semantischer Änderung, nicht bei jeder Appversion.

Neue Version benötigt:

- explizite alte Version
- reine Migration
- Validierung
- Korrupt-/Oversize-/Rollbacktests
- Changelog/Dokumentation

## Release-Gates

- [ ] Registry/Runtime identische Verträge
- [ ] UTF-8-Grenzen
- [ ] unbekannte Versionen abgelehnt
- [ ] unbekannte Complete-Key-Familien abgelehnt
- [ ] Validierung vor Schreiben
- [ ] Rollback simuliert
- [ ] Export→Import real
- [ ] zwei Browser real
- [ ] PWA-Update/Backup zusammen geprüft

Code-/Contracttests sind vorbereitet, echter Runner/Browsernachweis bleibt offen.
