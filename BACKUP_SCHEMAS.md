# Secret Circle – Sicherungsformate

Stand: 16. August 2026  
Vertragsregister: `backup-schema-registry.js` **Registry-Version 2**

## Zweck

Secret Circle besitzt mehrere lokale Datenbereiche. Jede exportierte JSON-Datei muss eindeutig erkennbar, größenbegrenzt, versioniert und vor dem Schreiben vollständig geprüft sein.

Eine Datei darf niemals nur deshalb akzeptiert werden, weil sie syntaktisch gültiges JSON enthält.

## Gemeinsame Regeln

Für alle Sicherungsformate gilt:

- maximale Dateigröße: **1.500.000 UTF-8-Bytes**
- Dateiendung: `.json`
- Größenmessung als UTF-8-Bytes, nicht als JavaScript-Zeichenanzahl
- Formatname und Version müssen vor Inhaltsprüfung übereinstimmen
- unbekannte zukünftige Versionen werden nicht stillschweigend importiert
- Importdaten werden vollständig validiert, bevor bestehende Daten verändert werden
- fehlgeschlagene Schreibvorgänge müssen den vorherigen Zustand wiederherstellen
- Exportdateien bleiben unverschlüsselt und dürfen nicht als sicherer Geheimnisspeicher beschrieben werden
- sensible Daten sollen nicht in Prompts, Karten oder Spielernamen gespeichert werden
- Complete-Backup-Format und Grenzwerte werden zentral aus `backup-schema-registry.js` gelesen; Runtime-Module dürfen dafür keine abweichenden Kopien pflegen

## Schema 1 – Word Imposter

| Feld | Wert |
|---|---|
| Registry-ID | `word-imposter` |
| Format | `secret-circle-backup` |
| Version | `1` |
| Maximalgröße | 1.500.000 Bytes |
| Umfang | aktiver Spielstand, eigene Begriffe, Verlauf, Einstellungen |

Der Import darf einen älteren enthaltenen Spielstand nur über die dokumentierte Engine-Migration auf die aktuelle Version anheben. Ein nicht sicher migrierbarer Spielstand wird abgelehnt.

## Schema 2 – Gesamtsicherung

| Feld | Wert |
|---|---|
| Registry-ID | `complete` |
| Format | `secret-circle-complete-backup` |
| Version | `1` |
| Maximalgröße | 1.500.000 Bytes |
| Maximale Einträge | 100 |
| Maximalgröße je Wert | 1.000.000 Bytes |
| allgemeines Produktpräfix | `secret-circle-` |
| tatsächlich importierbare Familien | versionierte Word-Imposter-Keys und versionierte `secret-circle-party-*`-Keys |

### Erlaubte Storage-Key-Familien

Die Gesamtsicherung akzeptiert nur diese beiden Familien:

1. Word Imposter:
   - `secret-circle-active-v<version>`
   - `secret-circle-custom-v<version>`
   - `secret-circle-history-v<version>`
   - `secret-circle-settings-v<version>`
2. Party Hub und zugehörige Module:
   - `secret-circle-party-<name>-v<version>`

Die Prüfung erfolgt zentral über `isAllowedCompleteStorageKey()` im Registry-Modul.

Beispiele gültiger Schlüssel:

- `secret-circle-active-v7`
- `secret-circle-history-v7`
- `secret-circle-party-hub-v1`
- `secret-circle-party-hub-active-v1`
- `secret-circle-party-created-games-v1`
- `secret-circle-party-catalog-filters-v1`

Beispiele, die bei einem Complete-Import abgelehnt werden:

- `secret-circle-evil-v1`
- `secret-circle-random-data`
- unversionierte oder zu lange Schlüssel
- Schlüssel außerhalb der beiden registrierten Familien

### Warum Import enger ist als „Alle Daten löschen“

Der Import darf nur bekannte Produktverträge herstellen. Deshalb besitzt er eine Allowlist.

Die Funktion **„Alle lokalen Daten löschen“** bleibt absichtlich breiter und entfernt weiterhin alle Browser-Schlüssel mit dem Präfix `secret-circle-`. So werden auch alte, verwaiste oder künftig nicht mehr erkannte Secret-Circle-Reste vom Gerät entfernt.

### Transaktionaler Import

1. Datei und Header über das Registry-Schema prüfen.
2. Gesamtgröße und Anzahl der Einträge prüfen.
3. jeden Schlüssel über die Allowlist prüfen.
4. jeden Wert und seine UTF-8-Größe prüfen.
5. JSON-artige Werte syntaktisch prüfen.
6. aktuellen lokalen Zustand als Rollback-Snapshot erfassen.
7. neue Werte schreiben.
8. bei einem Fehler vorherigen Zustand wiederherstellen.

Unbekannte `secret-circle-*`-Namespaces dürfen durch eine importierte Datei nicht neu in den lokalen Speicher eingebracht werden.

## Schema 3 – Creator-Bibliothek

| Feld | Wert |
|---|---|
| Registry-ID | `creator-library` |
| Formatfeld | `type` |
| Format | `secret-circle-created-games` |
| Version | `1` |
| Maximalgröße | 1.500.000 Bytes |
| Maximale Spiele | 40 |
| Maximale Packs je Spiel | 8 |
| Maximale Karten je Pack | 200 |

Beim Import werden Titel, IDs, Vorlagen, Altersstufen, Spielergrenzen, Packs und Karten erneut normalisiert. Doppelte IDs oder Titel dürfen nicht unkontrolliert zusätzliche Spiele erzeugen.

## Registry-Version und Formatversion sind getrennt

Die Registry steht aktuell auf **Version 2**, weil ihre Sicherheits- und Vertragslogik erweitert wurde. Die drei Datei-Formate bleiben jeweils auf Formatversion 1, weil ihre externen JSON-Header nicht geändert werden mussten.

Eine Registry-Version darf daher steigen, ohne automatisch alle Backup-Dateien inkompatibel zu machen.

## Versionsregeln für Backupformate

Eine Formatversion wird nur erhöht, wenn mindestens einer dieser Fälle eintritt:

- Pflichtfelder ändern sich
- die Bedeutung eines vorhandenen Feldes ändert sich
- die Struktur eines Datenbereichs ändert sich
- alte Importe könnten ohne Migration falsch interpretiert werden
- Sicherheits- oder Datenschutzgrenzen werden so verändert, dass alte Dateien anders interpretiert werden müssten

Eine neue App- oder Cache-Version allein erhöht keine Sicherungsversion.

## Migration

Für jede neue Sicherungsversion sind erforderlich:

- explizite Erkennung der alten Version
- reine, testbare Migration ohne direkte Speicheränderung
- Validierung des migrierten Ergebnisses
- Test mit gültigen, beschädigten und zu großen Dateien
- Rollbacktest bei simuliertem Speicherfehler
- Dokumentation in `CHANGELOG.md` und dieser Datei

## Aktueller Security-Stand

### SEC-F01 – doppelte Complete-Backup-Konstanten

**CLOSED IN CODE / RUNNER VERIFICATION OPEN**

`party-data-tools.js` bezieht Format und Grenzwerte aus `backup-schema-registry.js` statt dieselben Werte separat zu pflegen.

### SEC-F02 – zu breite `secret-circle-*`-Importfläche

**CLOSED IN CODE / RUNNER VERIFICATION OPEN**

Complete-Imports verwenden die Registry-Allowlist. Unbekannte Namespaces werden abgelehnt.

## Release-Gates

Ein Release ist `NO_GO`, wenn:

- ein Runtime-Modul andere Formatnamen oder Grenzen als das Register verwendet
- Complete-Imports unbekannte Storage-Key-Familien akzeptieren
- Größen nur als Zeichenanzahl geprüft werden
- ein Import bestehende Daten vor vollständiger Validierung löscht
- Rollback nicht getestet ist
- unbekannte Formatversionen still akzeptiert werden
- ein Backupformat nicht in `backup-schema-registry.js` dokumentiert ist
- Registry-/Runtime-/Test-/Dokumentationsverträge auseinanderlaufen

Die Code-Härtung allein ist noch kein Release-Pass. `tests/backup-schema-registry.test.js`, Daten-/Rollbacktests und reale Browserimporte müssen auf einem funktionierenden Runner beziehungsweise Zielbrowser bestätigt werden.
