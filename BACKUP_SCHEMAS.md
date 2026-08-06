# Secret Circle – Sicherungsformate

Stand: 6. August 2026  
Vertragsregister: `backup-schema-registry.js`

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
| Erlaubtes Schlüsselpräfix | `secret-circle-` |

Die Gesamtsicherung enthält alle lokalen Secret-Circle-Schlüssel, einschließlich Hub, Favoriten, Presets, Statistiken, aktive Sessions, eigene Packs und Creator-Spiele.

Der Import muss transaktional ablaufen:

1. Datei und Header prüfen.
2. Einträge, Schlüssel und Werte prüfen.
3. aktuellen Zustand sichern.
4. neue Werte schreiben.
5. bei einem Fehler alle vorherigen Werte wiederherstellen.

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

## Versionsregeln

Eine Formatversion wird nur erhöht, wenn mindestens einer dieser Fälle eintritt:

- Pflichtfelder ändern sich,
- die Bedeutung eines vorhandenen Feldes ändert sich,
- die Struktur eines Datenbereichs ändert sich,
- alte Importe könnten ohne Migration falsch interpretiert werden,
- Sicherheits- oder Datenschutzgrenzen werden strukturell verändert.

Eine neue App-Version allein erhöht keine Sicherungsversion.

## Migration

Für jede neue Sicherungsversion sind erforderlich:

- explizite Erkennung der alten Version,
- reine, testbare Migration ohne direkte Speicheränderung,
- Validierung des migrierten Ergebnisses,
- Test mit gültigen, beschädigten und zu großen Dateien,
- Rollbacktest bei simuliertem Speicherfehler,
- Dokumentation in `CHANGELOG.md` und dieser Datei.

## Release-Gates

Ein Release ist `NO_GO`, wenn:

- ein Runtime-Modul andere Formatnamen oder Grenzen als das Register verwendet,
- Größen nur als Zeichenanzahl geprüft werden,
- ein Import bestehende Daten vor vollständiger Validierung löscht,
- Rollback nicht getestet ist,
- unbekannte Versionen still akzeptiert werden,
- ein Backupformat nicht in `backup-schema-registry.js` dokumentiert ist.

## Geplante Konsolidierung

Das Register ist ab sofort der überprüfte Vertragsmittelpunkt. Die bestehenden Runtime-Module behalten zunächst ihre lokalen Konstanten, während automatisierte Contract-Tests jede Abweichung verhindern. In einem folgenden, kleineren Refactor werden die Importmodule direkt auf gemeinsame Registry-Helfer umgestellt, ohne mehrere große Datenpfade gleichzeitig zu verändern.
