# Bildwelt für Secret Circle v2

Die Spielbilder teilen dieselbe sorgfältig gestaltete 3D-Bildsprache: prägnante Silhouetten, glaubwürdige Materialien, klare Mimik, gerichtetes Licht und eine lesbare Handlung. Jedes Spiel bekommt trotzdem eine eigene Figur oder Figurengruppe, Farbwelt, Umgebung und Requisiten.

## Motivregel

Vor jedem Bild wird in einem Satz festgehalten, **welcher Spielmoment oder welche Rolle sichtbar wird**. Das Motiv folgt dieser Idee. Tiere sind möglich, aber keine Vorgabe. Menschen können vorkommen, wenn sie als eigenständige Rolle erkennbar sind, etwa als Detektivin, Spion, Astronautin oder Bühnenfigur. Auch Roboter, andere Wesen, Gegenstände, Orte oder ganze Szenen sind möglich – ein Bild braucht keine Figur, wenn ein Gegenstand oder Ort das Spiel besser zeigt. Austauschbare Partygäste ohne erkennbare Rolle tragen kein Titelmotiv.

Eine Karte, ein Tisch, dieselbe Farbe oder dieselben Symbole werden nicht als verbindendes Serienelement wiederholt. Die gemeinsame Welt entsteht durch Formgebung, Material, Ausdruck und Licht. Ein Motiv muss sowohl in der 138 × 104 Pixel großen Spielkachel als auch in der größeren Detailansicht funktionieren. Bildtext, Logos, Telefonrahmen und fremde bekannte Figuren gehören nicht in die Illustration.

## Was in jedem Bild gleich ist

Das hält die Welt zusammen, egal was zu sehen ist:

- **Machart:** stilisierte 3D-Illustration in der Qualität eines Animationsfilms – weiche, runde Formen, glaubwürdige Materialien (Stoff, Fell, Holz, Metall, Glas), ausdrucksstarke Gesichter.
- **Licht:** gerichtetes, warmes Hauptlicht und ein farbiges Kantenlicht; die Akzentfarbe wählt jedes Motiv selbst.
- **Hintergrund:** dunkel und weich unscharf, wenig Details – das Bild steht auf einer fast schwarzen Oberfläche.
- **Aufbau:** genau ein klares Hauptmotiv. Gesicht bzw. wichtigstes Detail liegt in der Bildmitte (mittlere 60 % der Breite und Höhe), weil Kachel und Startseiten-Banner unterschiedlich zuschneiden.
- **Kein Text:** keine Buchstaben, Zahlen, Wörter, Schilder mit Schrift, Logos oder Wasserzeichen. Einzelne Zeichen wie „?“ oder „!“ als Form sind erlaubt.

## Was nie ins Bild darf

- echte Personen, Marken, Logos, Produkte mit erkennbarem Design, echte Geldscheine
- erkennbare Figuren aus Filmen, Serien, Anime, Comics oder Spielen – auch keine „fast gleichen“ Varianten (Kostüm, Farben, Accessoires einer bekannten Figur)
- Alkohol, Partybecher, Zigaretten, Drogen, Waffen, Blut oder Gewalt – die App ist für alle Altersstufen (`CONTENT_AGE_POLICY.md`, `FAN_CONTENT_REVIEW.md`)
- Handy- oder Geräterahmen um das Bild

## Stil-Prompt für jedes Bild

Diesen Block vor jeden Motiv-Prompt setzen (Englisch, weil Bildmodelle darauf am zuverlässigsten reagieren):

```text
Stylized 3D illustration with the polish of a high-end animated feature film.
Soft rounded shapes, believable materials (fabric, fur, wood, metal, glass), expressive faces.
Cinematic directional warm key light plus a subtle colored rim light, shallow depth of field,
dark softly blurred background with little detail. Exactly one clear main subject;
the face or key detail sits in the central 60% of the frame so it survives tight crops.
Original designs only. No text, no letters, no numbers, no words, no signs with writing,
no logos, no brands, no watermark, no device or phone frame. Family friendly: no alcohol,
no cups that suggest drinking, no weapons, no violence. Landscape 4:3.
```

Danach folgt der Motiv-Prompt aus der Tabelle unten.

## Technische Vorgaben

- **Format:** WebP, **800 × 600** Pixel, Ziel **höchstens 35 KB** pro Bild (Qualität etwa 70–75). Erzeugen gern größer (z. B. 1600 × 1200) und dann verkleinern.
- **Warum so klein:** Alle Bilder im Offline-Cache werden bei der Installation geladen. Das Gesamtbudget ist 3,2 MB (`scripts/performance_budget.py`), davon sind gut 1,3 MB belegt. 52 weitere Bilder passen nur mit etwa 35 KB pro Bild hinein. Reicht das Budget nicht, wird das vor dem Einbinden entschieden (Budget erhöhen oder Bilder außerhalb des Offline-Kerns laden) – nicht stillschweigend.
- **Dateiname:** `assets/images/<spiel-id>.webp`, z. B. `assets/images/charades.webp`. Die drei vorhandenen Dateien behalten ihre Namen.
- **Varianten:** pro Spiel 2–3 Varianten erzeugen, die beste auswählen; wir schauen sie gemeinsam an, bevor sie eingebunden werden.

## Einbinden (Medienvertrag)

Für jedes neue Bild gemeinsam aktualisieren:

1. `v2-hub.js` → `GAME_ART`: `'<spiel-id>': { src: 'assets/images/<spiel-id>.webp', alt: '<deutscher Alt-Text>' }`. Alt-Text beschreibt in einem Satz, was zu sehen ist.
2. `scripts/media_inventory_audit.py` → `EXPECTED_CURRENT_MEDIA` um die Datei ergänzen.
3. `assets/manifests/asset-provenance.json` → Herkunft: Werkzeug bzw. Modell, Datum, Rechtegrundlage, Prompt.
4. `scripts/performance_budget.py` → Budgeteintrag für die Datei.
5. `sw.js` → Datei in die `CORE`-Liste, danach `python3 scripts/offline_core_lock.py --bump` und Eintrag in `CHANGELOG.md`.
6. `THIRD_PARTY_NOTICES.md` und `ASSET_RIGHTS_SIGNOFF.md` ergänzen.
7. Beim Ersetzen eines vorhandenen Bildes die alte Datei löschen und alle Einträge aus den Schritten 1–6 auf die neue Datei umstellen.
8. Alle vier Prüfungen laufen lassen (`npm run check`, `npm test`, `npm run validate`, `npm run test:e2e`).

## Reihenfolge

1. **Die drei vorhandenen Bilder neu erzeugen**, damit sie zur gesamten Serie passen (Prompts unten). Die alten Dateien werden erst ersetzt, wenn die neuen abgenommen sind – bis dahin bleiben sie eingebunden.
2. **Die übrigen 12 Kernspiele** (Core 15): Wer würde eher?, Entweder oder, Paranoia, Scharade, Nicht sagen!, Heiße Kartoffel, Wortkette, Zwei Wahrheiten eine Lüge, Question Imposter, Location Spy, Mafia, Nur falsche Antworten.
3. **Empfohlene Spiele der Startseite:** Spektrum-Tipp, Schnellfeuer, Stirn-Raten, Wer bin ich?, Anime-Archetypen, Blind Ranking, Finger runter, Höher oder tiefer.
4. **Alle übrigen Spiele.**

## Vorhandene Motive

Die drei Bilder sind der Anfang der Bildwelt, aber nicht festgeschrieben: Sie dürfen ersetzt werden, damit alle Spiele aus einem Guss sind. Die Ideen dürfen bleiben, die Umsetzung richtet sich nach den Regeln oben.

| Spiel | Sichtbare Idee | Figuren | Eigene Akzente |
|---|---|---|---|
| Word Imposter | Eine Person kennt den Begriff nicht und blufft. | Chamäleon mit leerem Hinweis zwischen zwei gleichen Hinweisen | Violett, warmes Licht, Anpassung |
| Wahrheit oder Pflicht | Eine Figur beantwortet eine Frage; die andere führt eine Aufgabe aus. | Eulen-Detektivin und Waschbär-Stuntfigur | Kühle Frage-Seite, warme Aufgaben-Seite, unterschiedliche Handlungen |
| Ich habe noch nie | Nach einer Aussage erinnert sich die Figur an ein eigenes Erlebnis und meldet sich ertappt. | Elefant mit erhobener Hand | Dunkles Grün, warmes Orange, Erinnerung als Charaktereigenschaft |

**Word Imposter** (`imposter`, ersetzt `word-imposter-chamaeleon.webp`):

```text
A chameleon in a purple jacket holds up a blank card with a sly, slightly nervous smile, its skin
subtly shifting color to blend in, while two paws at the edges of the frame hold up cards showing
the same simple golden key symbol.
```

**Wahrheit oder Pflicht** (`truth-dare`, ersetzt `wahrheit-oder-pflicht.webp`): Der rote Partybecher auf dem Fuß des Waschbären steht für Trinkspiele und kommt weg. Der Overall mit Gurten soll nicht an eine bekannte Filmfigur erinnern – andere Kleidung wählen.

```text
Split scene. Left, cool blue side: an owl detective in a teal coat holds a vintage microphone
and thinks hard about an honest answer, a large glowing question mark shape behind her.
Right, warm orange side: a raccoon acrobat in a simple striped sweater does a playful one-handed
handstand while balancing a shiny red apple on one foot, a large glowing exclamation mark shape behind him.
```

**Ich habe noch nie** (`never-have`, ersetzt `ich-habe-noch-nie.webp`): Gesicht in die Bildmitte; auf der kleinen Kachel ist bisher nur die Hand zu sehen. Die menschlich wirkende Hand mit Fingernägeln vermeiden.

```text
An elephant in a rust-orange jacket, caught remembering something embarrassing, sheepishly raises
its trunk like a hand with a guilty smile, eyes glancing sideways; face centered in the frame.
```

## Neue Motive

Die Prompts sind Vorschläge. Passt ein anderes Motiv besser zum Spiel, ist das ausdrücklich erlaubt – solange die Regeln oben eingehalten sind.

### Täuschung & Bluff

| Spiel (id) | Sichtbare Idee | Motiv-Prompt |
|---|---|---|
| Zwei Wahrheiten, eine Lüge (`two-truths`) | Von drei Dingen ist eins erfunden. | A fox illusionist in a velvet waistcoat presents three closed gift boxes on a small stage; one box leaks a tiny suspicious puff of glittering smoke while the fox smiles innocently. |
| Question Imposter (`question-imposter`) | Alle haben dieselbe Frage, einer eine etwas andere. | A row of small round robots each with a glowing question mark shape above its head; one robot's question mark is slightly tilted and a different color, and it glances sideways nervously. |
| Location Spy (`location-spy`) | Alle kennen den Ort, nur der Spion nicht. | An otter spy in a trench coat and hat peeks out from behind a large potted palm in a grand, softly lit hotel lobby, holding a tiny notebook and looking completely lost. |
| Mafia (`mafia`) | Nachts handeln geheime Rollen, tags wird abgestimmt. | A moonlit miniature village square at night with warm glowing windows; a cat in a long coat and fedora whispers a secret to a wise owl narrator holding a lantern. No weapons. |
| Undercover – ähnliches Wort (`undercover-similar-word`) | Einer hat ein ähnliches, aber anderes Wort. | A neat row of cheerful lemons with faces on a wooden shelf; one of them is actually a lime trying very hard to look like a lemon, sweating slightly. |
| Imposter ohne Wort (`no-word-imposter`) | Alle kennen den Begriff – nur einer nicht. | A group of penguins stares in awe at a glowing object hidden behind a half-open curtain; one penguin in the middle looks straight at the viewer and shrugs, clueless. |
| Bluff Trivia (`bluff-trivia`) | Erfundene Antworten klingen glaubwürdig. | A peacock in a tweed jacket lectures confidently in a museum, pointing a long pointer at an absurd exhibit on a pedestal: a teapot with small feathered wings. |

### Reden & Wählen

| Spiel (id) | Sichtbare Idee | Motiv-Prompt |
|---|---|---|
| Wer würde eher? (`most-likely`) | Alle zeigen gleichzeitig auf eine Person. | A surprised hedgehog stands in the center while many different animal paws and wings from all sides point at it at the same moment. |
| Entweder oder (`would-rather`) | Zwei Möglichkeiten, eine Entscheidung. | A sloth sits at a fork in a forest path, holding a scoop of ice cream in one hand and a slice of pizza in the other, torn between them; two paths glow in different colors. |
| Paranoia (`paranoia`) | Eine geheime Frage, ein geflüsterter Name. | A meerkat whispers into another meerkat's ear behind a raised paw, while a third meerkat in the foreground looks over its shoulder nervously with one bead of sweat. |
| Hot Takes (`hot-takes`) | Eine gewagte Meinung bringt alle zum Diskutieren. | A small chili pepper character stands on a wooden soapbox giving a passionate speech with a little steam rising from its head; a crowd of vegetables gasps. |
| Geld-Challenge (`money-challenge`) | Hypothetische Geldfragen, niemand zahlt wirklich. | A hamster in a tiny business suit thinks hard while a piggy bank with small wings hovers in front of it, surrounded by floating plain golden coins without markings. |
| Blind Ranking (`blind-ranking`) | Einordnen, ohne zu wissen, was noch kommt. | A blindfolded mole carefully places a rubber duck onto one step of a five-step winners' podium; other random objects wait in a queue behind it. |
| Red Flag oder Green Flag (`red-green-flag`) | Warnsignal oder gutes Zeichen? | A flamingo referee holds a red flag in one wing and a green flag in the other, frowning thoughtfully and unable to decide. |
| Tier List Battle (`tier-list`) | Begriffe auf Ränge sortieren. | A giraffe arranges everyday objects onto five stacked shelves colored gold, green, yellow, orange and gray, holding a donut and judging where it belongs. No letters. |
| Hear Me Out (`hear-me-out`) | Eine überraschende These verteidigen. | A tiny mouse on a big stage in a single spotlight passionately defends a pineapple, holding a vintage microphone, one fist raised. |
| Pass das Handy (`pass-the-phone`) | Weitergeben an die beschriebene Person. | A relay of different animal paws passing a glowing orb of light from one to the next in a smooth arc, motion trails behind it. |
| Finger runter (`put-a-finger-down`) | Wer etwas erlebt hat, nimmt einen Finger runter. | A cheerful octopus holds up its tentacles; some are curled down, others still raised, and it grins as it curls down one more. |
| Wer kennt mich am besten? (`know-me-best`) | Die Gruppe sagt die geheime Antwort voraus. | A dog with a thought bubble showing three objects (a bone, a ball, a sock) while two friends lean in, trying to guess which one it is thinking of. |

### Raten & Zeigen

| Spiel (id) | Sichtbare Idee | Motiv-Prompt |
|---|---|---|
| Scharade (`charades`) | Begriffe ohne Worte darstellen. | A bear mime with white gloves on a small stage pulls an invisible rope with great effort, a single spotlight on it, curtains in the background. |
| Nicht sagen! (`taboo`) | Erklären, ohne die verbotenen Wörter zu benutzen. | A parrot holds its beak shut with one wing, cheeks puffed, while speech bubbles filled with crossed-out scribbles float around its head. |
| Geräusche erraten (`sound-imitation`) | Nur mit Geräuschen darstellen. | A frog with hugely puffed cheeks makes a sound; the visible sound waves coming out form the silhouettes of a cow, a steam train and a bird. |
| Stirn-Raten (`forehead-guess`) | Alle sehen den Begriff, nur du nicht. | A llama wears a headband holding a small framed picture of a mystery object facing away from it, while friends behind it try not to giggle. |
| Melodie summen (`hum-song`) | Eine Melodie ohne Worte erkennen. | A whale humming underwater with eyes closed; musical note shapes rise from it as glowing bubbles toward the light above. |
| Wer bin ich? (`who-am-i`) | Mit Ja-Nein-Fragen die eigene Identität finden. | A small figure wearing a costume shaped like a big question mark looks into a tall mirror whose reflection shows faint silhouettes of an astronaut, a chef and a knight. |
| Ein-Wort-Hinweis (`password-one-word`) | Ein einziges Hinweiswort führt zum Ziel. | A fox cups its paws and releases a single small glowing orb toward a curious group of friends, who lean forward to catch it. |

### Kreativ

| Spiel (id) | Sichtbare Idee | Motiv-Prompt |
|---|---|---|
| Nur falsche Antworten (`wrong-answers`) | Absichtlich falsch, möglichst kreativ antworten. | A goat professor in round glasses proudly presents a chalkboard drawing of a fish riding a bicycle as the answer, chalk dust in the air. Drawings only, no writing. |
| Zeichnen & Raten (`draw-guess`) | Begriffe zeichnen, die Gruppe rät. | A kangaroo artist draws with a giant crayon on a big sheet of paper; the half-finished doodle could be either a cat or a house. |
| Caption Battle (`caption-battle`) | Eine Bildunterschrift für eine absurde Situation. | A framed picture in a gallery shows a cow on a skateboard; empty speech bubbles float around the frame, waiting to be filled. |
| Story Chain (`story-chain`) | Jede Person fügt einen Satz an. | A chain of open books forms a winding bridge through the air; tiny characters walk from one book's pages onto the next. |
| Satz beenden (`finish-the-sentence`) | Einen offenen Satz spontan zu Ende bringen. | A feather quill writes a glowing trail through the air that curls into a question-mark shape at its end, while a squirrel watches wide-eyed. |
| Satzduell (`fill-blank-battle`) | Alle füllen dieselbe Lücke, anonym gemischt. | A puzzle with one missing piece; several very different puzzle pieces hover in front of the gap, each glowing and competing to fit in. |
| Wer hat das geschrieben? (`who-wrote-it`) | Anonyme Antworten den Personen zuordnen. | A cat detective with a magnifying glass inspects a pile of folded paper notes, one eyebrow raised, the notes softly lit. No readable writing. |

### Wissen & Schätzen

| Spiel (id) | Sichtbare Idee | Motiv-Prompt |
|---|---|---|
| Spektrum-Tipp (`wavelength`) | Ein Zielwert liegt zwischen zwei Polen. | A penguin balances on a glowing tightrope stretched between a melting ice cube on one side and a small warm sun on the other. |
| Anime-Archetypen erraten (`anime-guess`) | Typische Rollen erkennen, ohne bekannte Figuren. | Three backlit, completely original stylized silhouettes on a stage – a hero with a flowing scarf, a mage with a staff, a calm swordsman with a wooden practice sword – no recognizable character, costume or hairstyle from any existing anime. |
| Emoji Quiz (`emoji-quiz`) | Eine Bildkombination ergibt einen Begriff. | Glossy round expressive spheres float in a row like a picture riddle: one sphere wears a chef's hat, next to it floats a pizza. Original sphere design, not any existing emoji set. |
| Preis schätzen (`guess-the-price`) | Den Preis eines Gegenstands schätzen. | A quirky invention – a toaster with small wings – stands on a pedestal with a blank price tag, while a mouse inspects it through a magnifying glass. |
| Höher oder tiefer (`higher-lower`) | Ist die nächste Zahl höher oder tiefer? | A mountain goat stands at a junction where one staircase rises into light and another descends into shadow, deciding which way to go. |
| Party Quiz (`party-quiz`) | Schnell die richtige Antwort wählen. | An eager hamster at a small game-show podium with four large glowing buttons in different colors, one paw hovering ready to press. No letters. |
| Fake oder Fakt (`fact-or-fake`) | Stimmt die Aussage oder ist sie erfunden? | A horse half-removes a unicorn mask, caught in the act, looking sheepish under a spotlight. |
| Prozent schätzen (`percent-guess`) | Einen Anteil möglichst genau schätzen. | A squirrel squints at a large glass jar partly filled with glowing marbles, holding up one paw to estimate the level. |
| Party Bracket (`party-bracket`) | Acht Optionen im K.-o.-System bis zum Sieger. | A glowing tournament tree made of light lines; at the bottom eight random objects (a sock, a donut, a crown, a rubber duck…), at the top a small shining trophy. |

### Schnell

| Spiel (id) | Sichtbare Idee | Motiv-Prompt |
|---|---|---|
| Heiße Kartoffel (`hot-potato`) | Weitergeben, bevor der Timer endet. | A steaming hot potato with a small kitchen timer tied to it flies through the air between two animal paws, mid-toss, motion blur. |
| Wortkette (`word-chain`) | Jedes Wort beginnt mit dem letzten Buchstaben des vorigen. | A small toy train of linked wagons winds along a track; each wagon carries a different object that leads to the next. No letters. |
| Flaschendrehen (`spin-bottle`) | Zufällig eine Person auswählen. | A large glowing compass needle spins on a round rug, motion blur, while animal friends sit in a circle around it waiting to see who it points to. No bottle. |
| Würfel & Münze (`dice-coin`) | Würfel, Münzwurf, Zufall. | A large rounded die and a plain golden coin spin through the air, sparkling, against a dark background. |
| Schnellfeuer (`rapid-fire`) | In wenigen Sekunden viele Antworten. | A cheetah sprints with a stopwatch in its paw, speed lines behind it, small objects flying out of its path. |
| Buchstaben-Kategorien (`letter-categories`) | Zu einem Buchstaben passende Antworten finden. | A bunny juggles an apple, an anchor, an ant and an airplane, an hourglass running next to it. No letters. |
| Nicht lachen! (`dont-laugh`) | Ernst bleiben, während jemand Faxen macht. | A very serious tortoise in a bow tie tries hard not to laugh while a monkey tickles it with a feather and pulls a funny face. |
| Gegenstandsjagd (`scavenger-hunt`) | Zuerst einen passenden Gegenstand finden. | A dog dashes back through a cozy living room carrying a rubber duck in its mouth, ears flying, a trail of tossed cushions behind. |
| Geheime Mission (`secret-mission`) | Eine geheime Aufgabe unauffällig erledigen. | A mouse in a tiny ninja outfit secretly places a small flag behind a flower vase during a party, glancing around to check nobody saw. |
| Hot Seat (`hot-seat`) | Schnelle Fragen an eine Person. | A nervous bunny sits in a big armchair under a single spotlight while glowing question-mark shapes orbit around it. |
