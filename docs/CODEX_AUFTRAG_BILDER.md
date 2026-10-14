# Auftrag für Codex: Bilder für alle Spiele

**Auftraggeber:** Arman · **Datum:** 14. Oktober 2026 · **Status:** freigegeben.

Dieser Auftrag ersetzt die frühere Bildprobe mit drei Bildern. Die Probe ist abgeschlossen: Word Imposter, Wahrheit oder Pflicht und Mafia sind in der App und gelten als Stilvorlage.

## Ziel

Für jedes Spiel ohne Bild ein Bild im Stil der drei Vorlagen erzeugen. Alle Regeln, der Stil-Block und die Motiv-Prompts für alle 55 Spiele stehen in [`docs/BILDWELT_V2.md`](BILDWELT_V2.md).

Bilder dürfen jederzeit verbessert werden. Wird ein Bild neu gemacht, den Prompt in `BILDWELT_V2.md` mit anpassen, damit Datei und Bild zusammenpassen.

## So wird jedes Bild erzeugt

1. Die drei Vorlagen anhängen: `assets/images/imposter.webp`, `assets/images/truth-dare.webp`, `assets/images/mafia.webp`.
2. Prompt = Stil-Block aus `BILDWELT_V2.md` + Motiv-Prompt des Spiels.
3. 2–3 Varianten erzeugen.
4. Selbst prüfen, bevor Arman sie sieht:
   - Kein Text, keine Buchstaben, keine Zahlen im Bild.
   - Gesichter und die wichtigste Geste in der Bildmitte; in einer Kachel von 136 × 104 Pixeln noch erkennbar.
   - Hände und Arme stimmen (keine doppelten oder fehlenden Hände).
   - Keine Figur sieht aus wie eine bekannte Figur aus Film, Serie, Anime oder Spiel.
   - Nichts aus der Liste „Was nie ins Bild darf“.

## Ablage

- Varianten nach **`.cache/bildproben/`** speichern (in `.gitignore`, wird nicht committet). Dateinamen: `<spiel-id>-1.png`, `<spiel-id>-2.png`, …
- Arman wählt pro Spiel eine Variante oder lässt sie neu machen.

## Einbauen

Erst nach Armans Auswahl, in Gruppen nach der Reihenfolge in `BILDWELT_V2.md`:

1. Auf 800 × 600 WebP verkleinern, höchstens etwa 35 KB.
2. Alle Schritte aus „Einbinden (Medienvertrag)“ in `BILDWELT_V2.md` erledigen – auch Herkunft mit vollständigem Prompt im Provenienzmanifest.
3. Vor dem Einbau prüfen, ob das Offline-Budget reicht. Reicht es nicht: anhalten und Arman fragen, nicht stillschweigend Budget oder Ladeweg ändern.
4. Alle vier Prüfungen laufen lassen. Branch und Pull Request, nicht direkt auf `main`.

## Was du nicht tust

- Keine Spiellogik, Element-IDs, Speicher-Keys oder Tests abschwächen, um Bilder unterzubringen.
- Keine Bilder von externen Adressen laden.
- Keine Bilddatei unter `assets/images/` ablegen, die Arman nicht ausgewählt hat.
