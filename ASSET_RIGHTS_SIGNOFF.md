# Secret Circle – Asset Rights Sign-off

Stand: 23. August 2026  
Status: **OPEN – menschliche Rechtebestätigung erforderlich**

## Zweck

Dieses Dokument schließt die Lücke zwischen technischer Git-Herkunft und einer belastbaren Rechtebasis für die gebündelten Release-Assets.

Aktuell betroffen:

- `icon.svg`
- `icon-192.png`
- `icon-512.png`

Die PNG-Dateien sind technisch dokumentierte Ableitungen von `icon.svg`. Solange die Rechtebasis des SVG ungeklärt ist, bleiben deshalb alle drei Assets in `assets/manifests/asset-provenance.json` auf `unresolved`.

## Aktueller technischer Nachweis

### `icon.svg`

- im Repository am 2. August 2026 neu angelegt
- Git-Commit: `c183d439882bf3f25a5577e3867b76b4f930e84c`
- aktueller Provenienzstatus: `unresolved`
- Git-Herkunft allein beweist nicht, dass keine externe Vorlage, Stock-Datei oder fremde Grafik verwendet wurde

### Rasterableitungen

- `icon-192.png`: 192×192, aus `icon.svg` erzeugt
- `icon-512.png`: 512×512, aus `icon.svg` erzeugt
- ihre Rechtebasis folgt dem SVG

## Menschliche Bestätigung

Vor Umstellung auf `verified-own` muss die verantwortliche Person die folgenden Aussagen prüfen und dokumentiert bestätigen:

- [ ] Ich weiß, wer das aktuelle `icon.svg` gestaltet hat.
- [ ] Das Design wurde selbst erstellt oder ich besitze nachweislich sämtliche erforderlichen Rechte.
- [ ] Es wurde **keine** fremde Logo-/Icon-Datei ohne passende Lizenz kopiert oder verändert.
- [ ] Falls eine Vorlage, Stock-Datei, ein Icon-Pack oder ein Design-Tool-Asset verwendet wurde, ist Quelle und Lizenz vollständig dokumentiert.
- [ ] Falls KI bei der Erstellung verwendet wurde, ist der verwendete Dienst/Workflow dokumentiert und es wurden keine fremden geschützten Assets als unzulässige Vorlage eingebunden.
- [ ] Kommerzielle Nutzung für Secret Circle ist erlaubt.
- [ ] Erforderliche Attribution ist bekannt und dokumentiert oder es ist keine Attribution erforderlich.

## Sign-off-Felder

```text
Asset: icon.svg
Ersteller / Rechteinhaber:
Erstellungsweg:
Externe Vorlage verwendet: ja / nein
Wenn ja – Quelle:
Lizenz / Rechtebasis:
Kommerzielle Nutzung erlaubt: ja / nein
Attribution erforderlich: ja / nein
Attributionstext, falls nötig:
Bestätigt von:
Datum:
Nachweis / Link / interne Referenz:
```

## Danach im Repository ändern

Nur nach echter Bestätigung:

1. `assets/manifests/asset-provenance.json`
   - `icon.svg.status` → `verified-own` oder `verified-third-party`
   - `creator` konkret setzen
   - `source` konkret setzen
   - `license` / Rechtebasis konkret setzen
   - `commercialUse` → `true`
   - Attribution korrekt setzen
2. dieselbe belegte Rechtebasis auf `icon-192.png` und `icon-512.png` übertragen
3. `scripts/asset_provenance_audit.py` ausführen
4. `scripts/media_inventory_audit.py` ausführen
5. `THIRD_PARTY_NOTICES.md` aktualisieren
6. finalen Visual-/Asset-Sign-off auf dem unveränderten RC dokumentieren

## Alternative bei unklarer Herkunft

Wenn die Fragen oben nicht sicher beantwortet werden können, **nicht** auf `verified-own` setzen.

Stattdessen:

1. neues eigenständiges App-Icon aus nachweisbar eigener Produktion erstellen,
2. Quelle/Erstellungsweg bereits bei Erstellung dokumentieren,
3. 192×192- und 512×512-Ableitungen neu erzeugen,
4. Manifest/Hashes aktualisieren,
5. das alte ungeklärte Asset vollständig aus dem Release-Core entfernen.

## Release-Regel

Solange dieser Sign-off offen ist und das Provenienzmanifest `unresolved` enthält, bleibt `THIRD-PARTY / ASSET PASS` offen und der öffentliche Release **NO_GO**.
