# Secret Circle – historisches ZIP-Inventar

Stand: 04.08.2026

Tracking-Issue: #6

## Quelle

Das frühere zentrale Repository enthält weiterhin:

- Repository: `memetreza34-ux/autonomous-project-hub`
- Pfad: `secret-circle.zip`
- Git-Blob-SHA-1: `0bda8a341c6167d83f3a10c2f62fb4efacbd42d7`
- Zweck: historische Backfill-Quelle für frühere Dateien, Assets und Spielfunktionen

Das Archiv darf noch nicht gelöscht werden.

## Aktueller Ausführungsstatus

`ACTUAL_ARCHIVE_INVENTORY_BLOCKED_BINARY_TRANSFER`

Der GitHub-Connector bestätigt Datei und Git-Blob, kann Binärdateien in dieser Laufzeit aber nicht als lokale ZIP-Datei bereitstellen. Der direkte öffentliche Download ist in der Ausführungsumgebung ebenfalls nicht verfügbar.

Deshalb wurde das echte Archiv noch nicht geöffnet, inventarisiert oder mit dem aktuellen Repository verglichen.

Nicht behauptet werden:

- Anzahl der Archivdateien,
- enthaltene App-Wurzel,
- vorhandene Assets oder Wortpakete,
- vollständige oder fehlende Funktionsbereiche,
- sichere Löschbarkeit des Archivs.

## Sicheres Inventarwerkzeug

`tools/inventory_legacy_archive.py` inventarisiert ein lokal bereitgestelltes ZIP ausschließlich lesend und ohne Extraktion.

Beispiel:

```bash
python tools/inventory_legacy_archive.py /sicherer/pfad/secret-circle.zip \
  --expected-git-blob 0bda8a341c6167d83f3a10c2f62fb4efacbd42d7 \
  --json docs/generated/legacy-inventory.json \
  --markdown docs/generated/legacy-inventory.md
```

## Sicherheitsregeln des Werkzeugs

Vor jeder Dekompression werden Metadaten und Grenzen geprüft:

- maximal 5.000 Einträge,
- maximal 50 MiB je Datei,
- maximal 500 MiB unkomprimiert insgesamt,
- maximale Kompressionsrate 200:1,
- nur unterstützte ZIP-Kompressionsverfahren.

Abgelehnt werden:

- `../`-Traversal,
- absolute Unix-Pfade,
- Windows-Laufwerkspfade,
- Backslash-Traversal,
- Symlinks,
- verschlüsselte Einträge,
- doppelte Pfade,
- Groß-/Kleinschreibungs-Kollisionen,
- verdächtige Kompressionsraten,
- zu große Dateien oder Archive,
- inkonsistente Größen oder CRC-/ZIP-Strukturen,
- ein vom erwarteten Hub-Git-Blob abweichendes Archiv.

## Ausgabe

Das Werkzeug erzeugt:

- Archiv-SHA-256,
- Git-Blob-SHA-1,
- Dateianzahl und Größen,
- pro Datei SHA-256,
- Dateitypen,
- Top-Level-Verzeichnisse,
- mögliche App-Wurzeln anhand neutraler Marker,
- maschinenlesbares JSON,
- menschenlesbares Markdown.

Es führt keine enthaltene Datei aus und extrahiert nichts auf das Dateisystem.

## Synthetische Sicherheitsprüfung

Die Testdatei `tests/archive-inventory.test.py` erzeugt ausschließlich temporäre synthetische ZIPs und prüft:

- gültiges Archiv,
- Git-Blob-Verifikation,
- keine Extraktion,
- Traversal- und Absolutpfadsperren,
- Windows-Pfadsperre,
- Duplikate und Case-Kollisionen,
- Symlinks,
- Verschlüsselung,
- Kompressionsbomben,
- Datei-, Gesamt- und Entry-Limits,
- JSON- und Markdown-Ausgabe.

Der exakte Remote-Code wurde lokal kompiliert und ausgeführt.

## Ablauf nach Verfügbarkeit des echten Archivs

1. Archiv in ein temporäres, nicht öffentliches Testverzeichnis laden.
2. Git-Blob `0bda8a341c6167d83f3a10c2f62fb4efacbd42d7` erzwingen.
3. Inventar ohne Extraktion erzeugen.
4. Inventar und Prüfsummen im Zielrepository speichern.
5. jede historische Datei dem aktuellen PWA-Stand zuordnen:
   - bereits vorhanden,
   - sinnvoll zu übertragen,
   - zu modernisieren,
   - nur zu archivieren,
   - zu verwerfen.
6. relevante Inhalte in getrennten PRs übertragen und testen.
7. erst danach über Archivierung, Auslagerung oder Löschung der Hub-Datei entscheiden.

## Löschgrenze

`secret-circle.zip` bleibt `DO_NOT_DELETE`, bis:

- das reale Inventar bestanden ist,
- alle relevanten historischen Dateien bewertet sind,
- fehlende Inhalte übertragen oder ausdrücklich verworfen wurden,
- die Archiventscheidung dokumentiert wurde.

## Gate

`LEGACY_ARCHIVE_TOOLING_GO / ACTUAL_ARCHIVE_INVENTORY_BLOCKED / HUB_ARCHIVE_DO_NOT_DELETE / LOCAL_ACCESSIBLE_PARTY_PWA_GO / PUBLIC_RELEASE_NO_GO`.
