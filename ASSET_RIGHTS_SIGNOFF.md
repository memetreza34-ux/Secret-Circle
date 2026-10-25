# Secret Circle – Asset Rights Sign-off

Stand: 29. August 2026  
Status: **SOURCE SIGN-OFF COMPLETE – finaler RC-Visual-/Trademark-Review offen**

## Zweck

Dieses Dokument hält die belastbare Provenienz des aktuellen Release-Iconsets fest. Das frühere Icon mit ungeklärter Rechtebasis wurde vollständig aus den drei Release-Medien ersetzt.

Aktuelles Release-Iconset:

- `icon.svg`
- `icon-192.png`
- `icon-512.png`

Alle drei Dateien stehen in `assets/manifests/asset-provenance.json` auf `verified-own`.

## Aktuelle Originalquelle

### `icon.svg`

- neu für Secret Circle am **29. August 2026** erstellt
- rein geometrischer SVG-Aufbau mit `rect`, `circle` und `path`
- keine fremde Logo-/Icon-Datei kopiert oder verändert
- keine Stock-Datei
- kein Icon-Pack
- keine externe Bildreferenz
- keine externe Fontdatei
- keine fremde geschützte Grafik als Vorlage eingebunden
- Workflow: nutzergesteuerte OpenAI/ChatGPT-Unterstützung bei der SVG-Konstruktion
- detaillierter Herkunftsnachweis: `assets/manifests/ORIGINAL_ICON_SOURCE.md`
- SHA-256: `ccc23350cb82cd76ff804f36fadafa51b8b4690ce9c1f8fc2c6793c66888f83c`

Rechtebasis: projektseitige Output-Rechte unter den anwendbaren OpenAI-Nutzungsbedingungen, soweit gesetzlich zulässig. Für den Erstellungsworkflow ist keine Drittanbieter-Attribution erforderlich.

**Wichtig:** Dieser Provenienz-Sign-off ist keine Markenregistrierung, keine Markenrecherche und keine Garantie, dass weltweit kein unabhängig entwickeltes ähnliches Zeichen existiert.

## Rasterableitungen

### `icon-192.png`

- 192×192
- deterministische Ableitung aus dem aktuellen `icon.svg`
- CairoSVG 2.8.2, anschließend Palette-Optimierung mit Pillow
- SHA-256: `75c0de14d6a6683f589a8bc2ca99c89e00dea69ee8c04fb51693dcb9fc6a5e5e`
- keine zusätzliche Drittanbieter-Grafik enthalten

### `icon-512.png`

- 512×512
- deterministische Ableitung aus dem aktuellen `icon.svg`
- CairoSVG 2.8.2, anschließend Palette-Optimierung mit Pillow
- SHA-256: `1be8d9c863a2e05b96fcd64c4254126e7fcec3a9fcab25c6756d156b40e0b1ce`
- keine zusätzliche Drittanbieter-Grafik enthalten

## Maschinenlesbare Kontrolle

`scripts/asset_provenance_audit.py` prüft:

- Existenz der drei Release-Assets
- SHA-256-Drift
- erlaubte Provenienzstatus
- Creator/Source/Rechtebasis bei verifizierten Assets
- `commercialUse = true`
- PNG-Dimensionen
- PWA-Manifest-Verknüpfung

`scripts/media_inventory_audit.py` erzwingt die vollständige erlaubte Menge der App-Icons, lokalen Spielillustrationen und Dokumentationsscreenshots. Alle sind samt Herkunft und Prüfsumme im Provenienzmanifest erfasst. Dokumentationsscreenshots gehören nicht zum Offline-Core.

## Aktuelle Spielbilder vom 14. Oktober 2026

Auf Armans Anweisung zur Ansicht direkt eingebunden. Werkzeug: integriertes OpenAI `image_gen` in Codex; konkrete Modellkennung nicht ausgegeben. Originale projektseitige Stilreferenz: erste Mafia-Stadtplatzszene. WebP-Export lokal mit `cwebp`, 800 × 600 Pixel und höchstens 35 KB pro Bild.

| Datei | SHA-256 |
|---|---|
| `assets/images/imposter.webp` | `15e7c9214042f5a21df56874e6a3d9057c9ea32b06ca08cdaf76aa146b082351` |
| `assets/images/truth-dare.webp` | `67d7ff134733f73ae669258b22a37ae0102f42f118e20420991eca46c54fd0d6` |
| `assets/images/mafia.webp` | `f261beca039c3e25641431959f0771c958ee9330d71cc6ad21019858b5cbff35` |

Die vollständigen Originalprompts stehen im Provenienzmanifest. Rechtebasis: projektseitige Output-Rechte gemäß geltenden OpenAI-Nutzungsbedingungen, soweit gesetzlich zulässig. Die Sichtprüfung zeigt originale stilisierte Figuren ohne echte Personen, Marken oder Schrift. Ein finaler Ähnlichkeits- und Markenreview des Release Candidate bleibt offen; die App-Vorschau ist keine abschließende Design- oder Releaseabnahme.

## Spielbilder vom 4. Oktober 2026 (am 13. Oktober 2026 entfernt)

| Datei | Werkzeug und Herkunft | SHA-256 |
|---|---|---|
| `assets/images/word-imposter-chamaeleon.webp` | OpenAI integriertes `image_gen`; Nutzer-Screenshot nur als allgemeine Stilreferenz; WebP mit `cwebp` | `6c5cbe0f92e4676fdeeefa41bb0aced520291152f001d48f4f31e13ef4a107e9` |
| `assets/images/wahrheit-oder-pflicht.webp` | OpenAI integriertes `image_gen`; projektseitiges Chamäleonbild als Stilreferenz; WebP mit `cwebp` | `bad0722b64128ce81b0c3c75d292f2250b027616540882b3634433baa2f60e82` |
| `assets/images/ich-habe-noch-nie.webp` | OpenAI integriertes `image_gen`; eigenständiger Elefantencharakter; WebP mit `cwebp` | `bfad5649a3574caf55e452e582568eae26183a7c210c991d7fcfe54463c17c44` |

Rechtebasis: projektseitige Output-Rechte gemäß geltenden OpenAI-Nutzungsbedingungen. Die Bilder enthalten nach dem direkten Motivvergleich keine fremden Logos oder erkennbaren geschützten Figuren. Ein finaler visueller Ähnlichkeits- und Markenreview des Release Candidate bleibt offen.

## Was damit geschlossen ist

- [x] ungeklärtes altes `icon.svg` als Releaseasset ersetzt
- [x] neues Original-`icon.svg` mit dokumentiertem Erstellungsweg
- [x] keine externe visuelle Vorlage im dokumentierten Workflow
- [x] kommerzielle Nutzungsbasis dokumentiert
- [x] Attribution für diesen Workflow nicht erforderlich
- [x] 192×192-Ableitung neu erzeugt
- [x] 512×512-Ableitung neu erzeugt
- [x] neue SHA-256-Werte im Provenienzmanifest
- [x] alle drei Release-Assets `verified-own`
- [x] zusätzliche temporäre SVG-Kopie wieder entfernt, damit der Media-Inventory-Vertrag exakt drei Medien behält

## Was für den finalen Release noch offen bleibt

- [ ] `scripts/asset_provenance_audit.py` auf funktionierendem Runner/Checkout tatsächlich grün
- [ ] `scripts/media_inventory_audit.py` auf demselben Stand tatsächlich grün
- [ ] kompletter `npm run validate` auf funktionierendem Runner grün
- [ ] finaler manueller Visual-/Marken-/Third-Party-Plausibilitätsreview auf dem unveränderten RC
- [ ] falls vor Release irgendein neues Mediaasset hinzukommt: neue Provenienzprüfung

## Release-Regel

Der frühere **Icon-Rechteblocker ist quellsseitig geschlossen**. Das übergeordnete `assetsThirdParty`-Gate bleibt trotzdem `BLOCKED`, bis die realen Runner-/Installationsnachweise und der finale manuelle Review auf dem unveränderten Release Candidate abgeschlossen sind.

## Ergänzung 25.10.2026 – Klassiker-Ansicht

Zwei eigene Browser-Screenshots unter `docs/screenshots/klassiker-zeichnen-*.webp`, samt Prüfsummen und Abmessungen im Provenienzmanifest. Nur Dokumentation; keine neuen Spielillustrationen und keine zusätzlichen Offline-Medien.
