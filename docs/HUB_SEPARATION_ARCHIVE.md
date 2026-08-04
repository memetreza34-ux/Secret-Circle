# Secret Circle – endgültige Hub-Trennung

Stand: 04.08.2026

## Verbindliches Zielrepository

`memetreza34-ux/Secret-Circle`

Dieses Repository ist ab jetzt der einzige aktive Ort für PWA-Code, Wortpakete, Accessibility, Offline-Funktion, Tests und weitere Entwicklung.

## Historische Hub-Quellen

Die frühere Binärquelle und Projektzustandsdatei werden aus dem aktiven Hub entfernt. Der frühere Stand bleibt über unveränderliche Git-Referenzen nachvollziehbar:

- letzter Hub-Hauptstand vor Bereinigung: `1b3e75fbf8fa435be973796a91ee313ae1b08d1a`
- frühere ZIP-Datei: `secret-circle.zip`
- exakter ZIP-Git-Blob: `0bda8a341c6167d83f3a10c2f62fb4efacbd42d7`
- frühere Zustandsdatei: `automation/partygame/STATE.md`
- vorhandenes Inventarwerkzeug im Zielrepository: `tools/inventory_legacy_archive.py`
- dokumentierte Quellgrenze: `docs/legacy-archive-source.json`

## Trennungsregel

- Neue Secret-Circle-Arbeit findet ausschließlich in diesem Repository statt.
- Der Hub darf keine aktive ZIP-Kopie, keinen Party-Game-State und keinen Secret-Circle-Workflow mehr enthalten.
- Der frühere ZIP-Blob bleibt über den angegebenen historischen Commit reproduzierbar referenziert.
- Die aktive PWA in diesem Repository ist der verbindliche Produktstand.

## Status

`OWN_REPOSITORY_AUTHORITATIVE / ACTIVE_HUB_BINARY_REMOVAL_APPROVED / LEGACY_BLOB_REFERENCED / NO_SECOND_ACTIVE_SOURCE`
