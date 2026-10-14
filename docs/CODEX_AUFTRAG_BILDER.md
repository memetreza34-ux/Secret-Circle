# Auftrag für Codex: Bildprobe mit drei Spielbildern

**Auftraggeber:** Arman · **Datum:** 14. Oktober 2026 · **Status:** freigegeben als Probe – nur erzeugen und zeigen, **nicht** in die App einbauen.

Dieser Auftrag ist eine bewusste Ausnahme von der Regel in `AGENTS.md`, nach der weitere Bilder erst nach der technischen Härtung kommen: Arman möchte jetzt eine Probe sehen, um die Bildwelt zu bestätigen.

## Ziel

Drei Bilder für die ersten drei Spiele erzeugen, je **2–3 Varianten**:

| Spiel | Bildart |
|---|---|
| Word Imposter (`imposter`) | Tier |
| Wahrheit oder Pflicht (`truth-dare`) | Gegenstand |
| Ich habe noch nie (`never-have`) | Figur |

Die drei Bildarten sind Absicht. Die Probe soll zeigen, ob Tiere, Gegenstände und Figuren zusammen wie **eine** Bildwelt wirken. In der Bildwelt darf jede Art von Motiv vorkommen – Tiere, Figuren, Charaktere, Gegenstände, Orte –, Hauptsache gleiche Machart. Alle Regeln stehen in [`docs/BILDWELT_V2.md`](BILDWELT_V2.md).

## Die drei Prompts

Jeden Prompt **unverändert** verwenden. Der erste Absatz ist der gemeinsame Stil-Block, der zweite das Motiv.

### 1. Word Imposter – Tier

```text
Stylized 3D illustration with the polish of a high-end animated feature film. Soft rounded shapes, believable materials (fabric, fur, wood, metal, glass), expressive faces. Cinematic directional warm key light plus a subtle colored rim light, shallow depth of field, dark softly blurred background with little detail. Exactly one clear main subject; the face or key detail sits in the central 60% of the frame so it survives tight crops. Original designs only. No text, no letters, no numbers, no words, no signs with writing, no logos, no brands, no watermark, no device or phone frame. Family friendly: no alcohol, no cups that suggest drinking, no weapons, no violence. Landscape 4:3.

A chameleon in a purple velvet jacket holds up a blank card with a sly, slightly nervous smile. Its skin is mid-way through shifting color to blend in with the warm background. At the left and right edges of the frame, two paws hold up cards that both show the same simple golden key symbol.
```

### 2. Wahrheit oder Pflicht – Gegenstand

```text
Stylized 3D illustration with the polish of a high-end animated feature film. Soft rounded shapes, believable materials (fabric, fur, wood, metal, glass), expressive faces. Cinematic directional warm key light plus a subtle colored rim light, shallow depth of field, dark softly blurred background with little detail. Exactly one clear main subject; the face or key detail sits in the central 60% of the frame so it survives tight crops. Original designs only. No text, no letters, no numbers, no words, no signs with writing, no logos, no brands, no watermark, no device or phone frame. Family friendly: no alcohol, no cups that suggest drinking, no weapons, no violence. Landscape 4:3.

A large round game spinner stands on a small dark stage, caught mid-spin. One half glows cool blue with a big question mark shape, the other half glows warm orange with a big exclamation mark shape. A polished brass pointer at the top is about to land on the line between both halves. Spotlight from above.
```

### 3. Ich habe noch nie – Figur

```text
Stylized 3D illustration with the polish of a high-end animated feature film. Soft rounded shapes, believable materials (fabric, fur, wood, metal, glass), expressive faces. Cinematic directional warm key light plus a subtle colored rim light, shallow depth of field, dark softly blurred background with little detail. Exactly one clear main subject; the face or key detail sits in the central 60% of the frame so it survives tight crops. Original designs only. No text, no letters, no numbers, no words, no signs with writing, no logos, no brands, no watermark, no device or phone frame. Family friendly: no alcohol, no cups that suggest drinking, no weapons, no violence. Landscape 4:3.

A small, friendly round robot with soft rubber hands and a glowing heart-shaped light on its chest raises one hand, caught remembering something embarrassing. It smiles sheepishly, eyes glancing sideways, while a tiny glowing thought cloud above its head shows a faint memory of a kite stuck in a tree. Face centered in the frame.
```

## Ablage

- Alle Varianten nach **`.cache/bildproben/`** speichern. Der Ordner ist in `.gitignore` und vom Medien-Audit ausgenommen; er wird nicht committet.
- Dateinamen: `imposter-1.png`, `imposter-2.png`, `truth-dare-1.png`, … `never-have-3.png`.
- Format für die Probe: was das Bildwerkzeug liefert (PNG oder WebP, 4:3). Verkleinern und Umwandeln erst nach der Abnahme.

## Was du nicht tust

- Keine Datei unter `assets/images/` anlegen, `GAME_ART` in `v2-hub.js` nicht ändern.
- `sw.js`, Medienvertrag (`scripts/media_inventory_audit.py`), `assets/manifests/asset-provenance.json`, Budget und Rechte-Dokumente nicht anfassen.
- Keine Bilddatei committen.

## Abschluss

1. Arman alle Varianten zeigen (Dateipfade nennen).
2. Pro Bild kurz angeben: welches Werkzeug bzw. Modell, ob der Prompt unverändert blieb, und was dir selbst auffällt (z. B. Text im Bild, abgeschnittenes Motiv).
3. Arman zeigt die Bilder Claude; die Abnahme lautet **ja** oder **nein** pro Bild.
4. **Erst nach einem Ja:** das Bild nach dem Abschnitt „Einbinden (Medienvertrag)“ in `docs/BILDWELT_V2.md` einbauen (800 × 600 WebP, höchstens etwa 35 KB, Herkunft eintragen, alle vier Prüfungen laufen lassen).
