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


## Gewählte Bildwelt und Scharade – 30. Oktober 2026

Arman hat das Figuren-/Materialblatt `docs/bildwelt/vorlage-2026-10-30.webp` als Bildwelt und anschließend den klassischen Pantomimen in `assets/images/charades.webp` mit „besser weiter“ ausgewählt. Werkzeug: integriertes OpenAI `image_gen`; eine konkrete Modellbezeichnung wurde nicht ausgegeben. Nur eigene projektseitige Illustrationen dienten als Referenzen. Die tatsächliche Ausgangsreferenz aus Commit `9c12e6d` ist bytegleich unter `docs/bildwelt/ausgangsreferenz-imposter-2026-10-30.webp` archiviert. Diese Dokumentationsbilder gehören nicht zum Offline-Core.

Vollständige Generierungs- und Bearbeitungsprompts, Herkunft, Rechtebasis und SHA-256-Prüfsummen stehen im Provenienzmanifest; Prompts zusätzlich unter `docs/bildwelt/`. Der Pantomime zeigt eine eigene klassische Theaterrolle ohne erkennbare bekannte Figur, Bildschrift oder Marke. Export mit Pillow als 800×600 WebP unter 35 KB. Spielbildfreigabe und Herkunftsdokumentation sind keine öffentliche Releasefreigabe. Handy-/Desktop-Screenshots dokumentieren die eigene App mit diesem Bild.


## Nicht sagen! – 30. Oktober 2026

Arman hat den klassischen Showmaster als einzelnes Spielbild konkret ausgewählt. `assets/images/taboo.webp` wurde mit dem integrierten OpenAI `image_gen` und der gewählten eigenen Figuren-/Materialvorlage erzeugt; das Werkzeug weist kein konkretes Modell aus. Eigener Rollenentwurf, keine echte Person, Marke oder bekannte Figur. Vollständiger Prompt: `docs/bildwelt/taboo-2026-10-30.prompt.txt`; Rechtebasis, Referenzkette und SHA-256 stehen im Provenienzmanifest. Lokale WebP-Datei, 800×600 und 34.510 Bytes. Die Kartensymbole veranschaulichen das Erklären ohne verbotene Begriffe, ohne eine neue Spielregel einzuführen. Screenshots zeigen die eigene App in isolierten Testkontexten. Keine öffentliche Releasefreigabe.


## Heiße Kartoffel – 2. November 2026

Eigenes Gegenstandsmotiv in der gewählten Bildwelt, erzeugt am 30. Oktober mit integriertem OpenAI `image_gen`; konkretes Modell vom Werkzeug nicht ausgewiesen. Fortsetzung des Einbaus nach der gezeigten Probe von Arman beauftragt. `assets/images/hot-potato.webp`: 800×600 WebP, 34.954 Bytes. Die Kartoffel und die Sanduhr stehen sinnbildlich für Weitergeben unter Zeitdruck, ohne die Regeln zu ändern. Eigene projektseitige Stilvorlage; keine Marken oder fremden Figuren. Vollständiger Prompt unter `docs/bildwelt/hot-potato-2026-10-30.prompt.txt`, Herkunft, Rechtebasis und SHA-256 im Manifest. Screenshots dokumentieren ausschließlich die eigene App. Keine öffentliche Releasefreigabe.

## Wortkette – 3. November 2026

Von Arman konkret freigegebenes Motiv einer Zugbegleiterin, die Waggons mit Apfel, Lampe und Elefant verbindet. Erzeugt am 2. November mit integriertem OpenAI `image_gen`; konkretes Modell vom Werkzeug nicht ausgewiesen. `assets/images/word-chain.webp`: 800×600 WebP, 34.030 Bytes. Eigene projektseitige Stilvorlage, keine Marken oder fremden Figuren. Vollständiger Prompt unter `docs/bildwelt/word-chain-2026-11-02.prompt.txt`; Herkunft, Rechtebasis und SHA-256 im Manifest. Die Wortfolge und Waggons erklären den Spielgedanken bildlich, ohne die Regeln zu ändern. Keine öffentliche Releasefreigabe.

## Zwei Wahrheiten, eine Lüge – 3. November 2026

Von Arman konkret freigegebener Fuchs-Abenteurer mit drei erzählten Erlebnissen, darunter ein erfundener Papierflieger-Flug. Erzeugt mit integriertem OpenAI `image_gen`; konkretes Modell vom Werkzeug nicht ausgewiesen. `assets/images/two-truths.webp`: 800×600 WebP, 34.470 Bytes. Eigene projektseitige Stilvorlage; keine Marken oder fremden Figuren. Vollständiger Prompt unter `docs/bildwelt/two-truths-2026-11-03.prompt.txt`; Herkunft, Rechtebasis und SHA-256 im Manifest. Die Erlebnisse sind ein Bildmotiv und ändern keine Spielregel. Keine öffentliche Releasefreigabe.
