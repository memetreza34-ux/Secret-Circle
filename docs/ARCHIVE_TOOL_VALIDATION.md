# Legacy-Archivwerkzeug – Validierungsnachweis

Stand: 04.08.2026

## Geprüfter Branch

`tools/legacy-archive-inventory`

## Exakte Remote-Git-Blobs

| Datei | Git-Blob-SHA-1 |
|---|---|
| `tools/inventory_legacy_archive.py` | `20cb67dabcb3eb48952faeca98e925f31e086296` |
| `tests/archive-inventory.test.py` | `b08d0cdc2aaaa8dbfff3a07db014097cbb0807a7` |

Die lokal ausgeführten Dateien erzeugten bytegenau dieselben Git-Blob-SHAs wie der GitHub-Branch.

## Ausgeführte Befehle

```bash
python -m py_compile \
  tools/inventory_legacy_archive.py \
  tests/archive-inventory.test.py
python tests/archive-inventory.test.py
```

Beide Befehle endeten mit Exitcode `0`.

## Ergebnis

```json
{"ok":true,"validInventory":true,"gitBlobVerification":true,"noExtraction":true,"pathTraversalBlocked":true,"absolutePathsBlocked":true,"caseCollisionsBlocked":true,"duplicatesBlocked":true,"symlinksBlocked":true,"encryptedEntriesBlocked":true,"compressionBombBlocked":true,"fileSizeLimit":true,"entryCountLimit":true,"limitValidation":true}
```

## Sicherheitsfälle

### Gültiges synthetisches Archiv

Geprüft wurden:

- Archiv-SHA-256,
- erwarteter Git-Blob,
- pro-Datei SHA-256,
- Dateitypen,
- App-Wurzel-Erkennung,
- JSON-Ausgabe,
- Markdown-Ausgabe,
- keine Extraktion.

### Abgelehnte Archive und Einträge

- `../evil.txt`
- `..\\evil.txt`
- `/evil.txt`
- `C:/evil.txt`
- doppelte Pfade
- Groß-/Kleinschreibungs-Kollisionen
- Unix-Symlinks
- als verschlüsselt markierte Einträge
- verdächtige Kompressionsrate
- Datei über Grenzwert
- zu viele Einträge
- ungültige Limitkonfiguration
- falscher erwarteter Git-Blob

## Sicherheitsreview-Korrektur

Eine frühe Fassung verwendete `ZipFile.testzip()` vor den Größen- und Kompressionsgrenzen. Das hätte ein potenziell großes Archiv vor der eigentlichen Sicherheitsprüfung dekomprimieren können.

Die veröffentlichte Fassung wurde korrigiert:

1. alle ZIP-Metadaten werden zuerst geprüft,
2. Gesamtgröße wird vor jeder Dekompression begrenzt,
3. anschließend wird jeder Eintrag kontrolliert gestreamt,
4. Größe, SHA-256 und CRC-/ZIP-Struktur werden während dieses begrenzten Lesens geprüft.

## Tatsächliches Hub-Archiv

Das reale `secret-circle.zip` wurde nicht ausgeführt.

Grund:

- der Connector kann die Binärdatei in dieser Umgebung nicht als lokale ZIP-Datei bereitstellen,
- ein direkter Download ist ebenfalls nicht verfügbar.

Bekannt ist ausschließlich der Git-Blob:

`0bda8a341c6167d83f3a10c2f62fb4efacbd42d7`

Das Archiv bleibt daher `DO_NOT_DELETE`.

## Gate

`ARCHIVE_INVENTORY_TOOL_VALIDATED / ACTUAL_ARCHIVE_INVENTORY_BLOCKED / HUB_ARCHIVE_DO_NOT_DELETE`.
