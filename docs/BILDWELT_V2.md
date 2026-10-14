# Bildwelt für Secret Circle v2

**Stand: 14. Oktober 2026.** Diese Fassung ersetzt die frühere Bildwelt mit „dunklem, unscharfem Hintergrund und genau einem Motiv“. Maßgeblich sind jetzt die drei Bilder, die in der App zu sehen sind.

## Die Vorlage

Die drei Bilder sind die Stilvorlage. Was dort zu sehen ist, gilt. Steht hier etwas anderes, gewinnt das Bild.

| Bild | Was es zeigt |
|---|---|
| `assets/images/imposter.webp` | Chamäleon blufft mit leerer Karte in einer Art-déco-Lounge, zwei Mitspieler halten dieselbe Schlüsselkarte. |
| `assets/images/truth-dare.webp` | Bühnenmagier legt die Maske ab (Wahrheit), Waschbär-Stuntfigur macht einen Handstand (Pflicht). |
| `assets/images/mafia.webp` | Kater flüstert einem Wiesel etwas zu, eine Detektivin bemerkt die Absprache, nächtlicher Stadtplatz. |

Bei jedem neuen Bild **alle drei Bilder als Referenz anhängen**. Die Originalprompts stehen in `assets/manifests/asset-provenance.json`.

## Was jedes Bild ausmacht

- **Machart:** polierter 3D-Animationsfilm-Look. Nicht fotorealistisch, nicht flach, nicht babyhaft-niedlich.
- **Figuren:** erwachsen wirkende Cartoon-Figuren, also vermenschlichte Tiere und stilisierte Menschen gemischt. Große, ausdrucksstarke Augen und Augenbrauen, klares Schauspiel.
- **Kleidung:** passt zur Rolle (Spion im Trenchcoat, Magier in Weste, Schiedsrichterin mit Flaggen).
- **Ort:** ein ausgestalteter, farbiger Schauplatz – Lounge, Bühne, Stadtplatz. Kein leerer Hintergrund.
- **Licht:** warmes, weiches Hauptlicht und eine farbige Akzentfarbe. Satte, aber kontrollierte Farben.
- **Handlung:** Das Bild erklärt das Spiel durch das, was die Figuren gerade tun. Man soll den Spielmoment ohne Text verstehen.
- **Aufbau:** höchstens drei Figuren, groß im Bild. Gesichter und die entscheidende Geste liegen in den mittleren 60 % des Bildes. Das Bild muss als Kachel (136 × 104 Pixel) und als breites Banner funktionieren.
- **Eigenständig:** Jedes Spiel hat einen eigenen Ort, eine eigene Farbwelt und eigene Figuren. Kein Spiel wiederholt den Ort oder die Hauptfigur eines anderen.

## Was nie ins Bild darf

- Text jeder Art: Buchstaben, Zahlen, Wörter, Schilder mit Schrift, Logos, Wasserzeichen. Einzelne Zeichen wie „?“ oder „!“ als Form sind erlaubt, ebenso Notenformen und einfache Bildsymbole.
- echte Personen, Marken, Produkte mit erkennbarem Design, echte Geldscheine
- erkennbare Figuren aus Filmen, Serien, Anime, Comics oder Spielen – auch keine „fast gleichen“ Varianten. Besonders vermeiden: Waschbär im Overall (Rocket), Hasen-Polizistin und Fuchs mit grünem Hemd (Zoomania), Fuchs mit Bogen (Robin Hood), Pinguine in Kommando-Pose (Madagascar), Erdmännchen mit Warzenschwein (König der Löwen), Ratte als Koch (Ratatouille), Kastenroboter mit Ketten (WALL·E).
- Alkohol, Becher, Gläser zum Trinken, Zigaretten, Drogen, Waffen, Blut, Gewalt, Glücksspiel-Kulisse (`CONTENT_AGE_POLICY.md`, `FAN_CONTENT_REVIEW.md`)
- Handys, Bildschirme mit Oberfläche, Geräterahmen

## Stil-Block für jedes Bild

Diesen Block **unverändert** vor jeden Motiv-Prompt setzen. Englisch, weil Bildmodelle darauf am zuverlässigsten reagieren.

```text
Create ONE original finished landscape 4:3 illustration for the Secret Circle party game app.
The three attached images (chameleon in a game lounge, theater stage with magician and raccoon,
night town square with whispering cat, weasel and detective) are the exact STYLE REFERENCE:
same animated world, polished 3D animated-feature look, appealing adult cartoon characters
(anthropomorphic animals and stylized humans), expressive eyes and eyebrows, clear acting,
role-specific stylized clothing, a fully shaped colorful location, warm soft directional key light
with one colored accent light, rich but controlled color. Same degree of detail as the references:
not photorealistic, not a flat toon shader, not baby-like cute mascots.
The image explains the game through action, facial expression, outfit and location.
At most three characters, large in frame; main faces and the decisive gesture in the central 60%
of the image so it reads as a small game tile and survives a wide banner crop.
Every character anatomically coherent: exactly two arms and two hands, clearly separate limbs.
Use a DIFFERENT location, palette and characters than the references.
Original designs only, no existing franchise characters or near-copies of their outfits or colors.
No words, letters, numbers, logos, brands, watermarks, phones, screens, UI, real people,
alcohol, cups or glasses, cigarettes, weapons, blood, violence or gambling.
```

Danach folgt der Motiv-Prompt des Spiels.

## Technische Vorgaben

- **Format:** WebP, **800 × 600** Pixel, höchstens etwa **35 KB** pro Bild (Qualität etwa 70–75). Gern größer erzeugen und dann verkleinern.
- **Budget:** Alle Bilder im Offline-Cache werden bei der Installation geladen. Das Gesamtbudget ist 3,2 MB (`scripts/performance_budget.py`). Bilder für alle 55 Spiele brauchen gut 1,9 MB und passen nur knapp. Reicht das Budget nicht, wird das vor dem Einbinden entschieden (Budget erhöhen oder Bilder außerhalb des Offline-Kerns laden) – nicht stillschweigend.
- **Dateiname:** `assets/images/<spiel-id>.webp`.
- **Varianten:** pro Spiel 2–3 Varianten erzeugen, Arman wählt aus.

## Einbinden (Medienvertrag)

Für jedes neue Bild gemeinsam aktualisieren:

1. `v2-hub.js` → `GAME_ART`: `'<spiel-id>': { src: 'assets/images/<spiel-id>.webp', alt: '<deutscher Alt-Text>' }`. Der Alt-Text beschreibt in einem Satz, was zu sehen ist.
2. `scripts/media_inventory_audit.py` → `EXPECTED_CURRENT_MEDIA` um die Datei ergänzen.
3. `assets/manifests/asset-provenance.json` → Herkunft: Werkzeug bzw. Modell, Datum, Rechtegrundlage, vollständiger Prompt.
4. `scripts/performance_budget.py` → Budgeteintrag für die Datei.
5. `sw.js` → Datei in die `CORE`-Liste, danach `python3 scripts/offline_core_lock.py --bump` und Eintrag in `CHANGELOG.md`.
6. `THIRD_PARTY_NOTICES.md` und `ASSET_RIGHTS_SIGNOFF.md` ergänzen.
7. In `tests/e2e/v2-hub.spec.js` prüfen, dass das Bild lokal lädt (`naturalWidth > 0`) und den Alt-Text trägt.
8. Alle vier Prüfungen laufen lassen (`npm run check`, `npm test`, `npm run validate`, `npm run test:e2e`).

## Reihenfolge

1. **Kernspiele:** Ich habe noch nie, Wer würde eher?, Entweder oder, Paranoia, Scharade, Nicht sagen!, Heiße Kartoffel, Wortkette, Zwei Wahrheiten eine Lüge, Question Imposter, Location Spy, Nur falsche Antworten.
2. **Empfohlene Spiele der Startseite:** Spektrum-Tipp, Schnellfeuer, Stirn-Raten, Wer bin ich?, Anime-Archetypen, Blind Ranking, Finger runter, Höher oder tiefer.
3. **Alle übrigen Spiele.**
4. **Bei Bedarf:** neue Fassungen für Wahrheit oder Pflicht und Mafia.

## Motive für alle 55 Spiele

Jedes Spiel hat einen Spielmoment (was das Bild zeigen soll) und einen Motiv-Prompt. Die Prompts sind ein Startpunkt. Passt eine andere Idee besser, ist das erlaubt – solange die Regeln oben gelten. Wird ein Bild verbessert, den Prompt hier mit anpassen.

### Täuschung & Bluff

#### Word Imposter (`imposter`) – fertig

**Spielmoment:** Alle kennen denselben Begriff, nur der Imposter nicht – und er blufft.

Bild bleibt. Der Originalprompt steht im Provenienzmanifest.

#### Zwei Wahrheiten, eine Lüge (`two-truths`)

**Spielmoment:** Jemand erzählt drei Dinge über sich, eins ist erfunden. Die anderen mustern ihn.

```text
TWO TRUTHS AND A LIE: A cozy bookshop café with tall wooden shelves, deep teal walls and warm golden
lamps. A charming badger storyteller in a mustard corduroy jacket sits on a leather armchair and
holds up three fingers on one hand with a perfectly innocent smile, while his other hand behind his
back secretly crosses two fingers, visible only to the viewer. Two listeners lean in: a skeptical
grey heron in a knitted cardigan narrows its eyes, and a young adult human woman with a dark bob
haircut taps her chin, trying to spot the lie. Teal, gold and warm brown palette.
```

#### Question Imposter (`question-imposter`)

**Spielmoment:** Alle beantworten dieselbe Frage, einer hatte eine leicht andere – und seine Antwort passt nicht.

```text
QUESTION IMPOSTER: A rooftop terrace at dusk with string lights and potted plants, coral and lavender
sky. Three friends reveal their answers at the same moment by holding up simple drawn picture cards.
Two cards show the same sunny beach with a palm tree drawing. The third card, held by a lanky
anteater in a striped sweater, shows a snowy mountain drawing. The anteater realizes it too late,
freezes with a stiff awkward smile and starts lowering its card, while a confident human man with
curly hair and a cheerful hippo in a floral shirt turn their heads toward it with raised eyebrows.
Drawings only, no writing. Coral, lavender and warm string-light palette.
```

#### Location Spy (`location-spy`)

**Spielmoment:** Alle kennen den Ort, nur der Spion nicht – und er gibt sich alle Mühe, dazuzugehören.

```text
LOCATION SPY: The sunny deck of a cruise ship with turquoise sea, white railings and orange life
rings without writing. Everyone wears summer clothes, but in the center a sleek otter spy wears a
full winter ski outfit with goggles pushed up on his forehead, holding a tiny notebook and trying to
look completely relaxed, one bead of sweat on his brow. Behind him a human ship captain woman in a
white uniform and a pelican tourist in a Hawaiian shirt and sun hat glance at him with growing
suspicion. Turquoise, white and sunny orange palette.
```

#### Mafia (`mafia`) – Bild bleibt vorerst

**Spielmoment:** Nachts handeln geheime Rollen, tags wird abgestimmt.

Das jetzige Bild bleibt. Falls es neu gemacht wird: weniger Gedränge, die Detektivin näher zur Mitte, damit sie in der Kachel zu sehen ist.

```text
MAFIA: A compact night town square with curved cobblestones, crooked navy-blue houses, warm amber
windows, a rounded streetlamp and a moon disk. A slim grey cat in a fitted ink-blue suit and charcoal
fedora whispers behind its paw to a stocky weasel in a mustard waistcoat, who wears an overconfident
innocent smile. Just behind them, close to the center of the image and clearly visible, an adult
human woman detective with short swept auburn hair and a dark teal trench coat leans out from a low
brick corner with a skeptical knowing look; she has noticed their alliance. All three faces close
together in the central area. Violet-blue night palette with mustard and burgundy accents.
```

#### Undercover – ähnliches Wort (`undercover-similar-word`)

**Spielmoment:** Fast alle haben denselben Begriff, einer einen ähnlichen – und versucht, nicht aufzufallen.

```text
UNDERCOVER SIMILAR WORD: A sunny garden costume party with a striped awning and lemon trees. Two
guests wear identical round lemon costumes: a cheerful human woman with braids and a plump goose.
Between them stands a tall stork wearing a lime costume instead, smiling far too widely and holding
its wings stiffly at its sides to blend in. The goose glances sideways at the stork's green costume
with one raised eyebrow. Lemon yellow, leaf green and sky blue palette.
```

#### Imposter ohne Wort (`no-word-imposter`)

**Spielmoment:** Alle wissen, worum es geht – nur einer nicht. Er zuckt ahnungslos mit den Schultern.

```text
NO WORD IMPOSTER: A grand museum hall with marble columns and deep blue walls. Two visitors stare in
awe at a glowing exhibit hidden behind a half-drawn velvet curtain, only its golden light visible:
an elegant elderly human man with a white mustache and a capybara in a tweed coat, both with mouths
open in delight. In the middle, a porcupine in a neat vest stands with its back to the exhibit,
looking straight at the viewer and shrugging with both hands up, completely clueless.
Deep blue, gold and burgundy palette.
```

#### Bluff Trivia (`bluff-trivia`)

**Spielmoment:** Erfundene Antworten klingen glaubwürdig – und die Gruppe glaubt sie fast.

```text
BLUFF TRIVIA: A wood-paneled natural history lecture room with green banker lamps. A confident
peacock professor in a tweed suit points with a long wooden pointer at an absurd exhibit on a
pedestal: a teapot with small feathered wings. His expression is completely serious. In the front
row, a beaver in a cardigan nods, convinced, while a human older woman with silver hair and round
glasses squints with deep suspicion. Emerald, burgundy and warm wood palette.
```

### Social & Klassiker

#### Wahrheit oder Pflicht (`truth-dare`) – Bild bleibt vorerst

**Spielmoment:** Eine Person beantwortet ehrlich eine Frage, eine andere erfüllt eine harmlose Aufgabe.

Das jetzige Bild bleibt. Falls es neu gemacht wird: Wahrheit und Pflicht deutlicher trennen, keinen Waschbär im Overall (zu nah an einer bekannten Figur).

```text
TRUTH OR DARE: A small game-show stage split into two lighting halves. On the left in cool blue
light, an adult human woman with a short silver-streaked haircut and a velvet blazer places one hand
on her heart and laughs while admitting an embarrassing truth, blushing. On the right in warm orange
light, a lanky goat in a sparkly cape proudly balances a tall wobbly stack of cushions on its head,
arms out for balance. A large glowing arrow on the floor between them has just stopped spinning.
Cool blue and warm orange halves, dark stage with warm footlights.
```

#### Ich habe noch nie (`never-have`)

**Spielmoment:** Eine Aussage wird vorgelesen, und jemand wird ertappt, weil er es doch schon erlebt hat.

```text
NEVER HAVE I EVER: A cozy living room with fairy lights, a big green sofa and knitted blankets. A
round-cheeked elephant in a chunky orange sweater sheepishly raises one hand, caught, ears slightly
pink. A small glowing memory bubble above its head shows a kite stuck in a tree. Next to it, a
flamingo in a denim jacket gasps with delighted surprise, and a young adult human man with a beard
laughs and points. Forest green and warm orange palette.
```

#### Pass das Handy (`pass-the-phone`)

**Spielmoment:** Eine Karte sagt, an wen weitergegeben wird – und alle schauen auf die gewählte Person.

```text
PASS THE PHONE: A long wooden dinner table in a warm rustic kitchen with copper pans on the wall,
no cups or glasses on the table. A smiling young adult human woman with curly red hair reaches across
the table and hands over a smooth glowing round game token (not a phone) to a surprised walrus in
suspenders, who points at himself in disbelief. A cheerful crow in a waistcoat
cheers in the background. Copper, cream and warm brick-red palette.
```

#### Finger runter (`put-a-finger-down`)

**Spielmoment:** Wer etwas schon erlebt hat, nimmt einen Finger runter.

```text
PUT A FINGER DOWN: A retro diner booth with mint-green leather seats and cherry-red tables, no drinks.
A cheerful violet octopus in a bowling shirt holds up all its tentacles; some are already curled down,
and it curls down one more with a guilty grin. Across the table, a human man with a high fade haircut
and a cheerful yak in a denim vest both hold up their
hands with all fingers still raised, laughing at the octopus. Mint green, cherry red and chrome palette.
```

#### Wer kennt mich am besten? (`know-me-best`)

**Spielmoment:** Eine Person wählt heimlich eine von drei Antworten, die anderen tippen, welche es ist.

```text
WHO KNOWS ME BEST: A sunny kitchen with butter-yellow cabinets and sky-blue tiles. A basset hound in
a cozy cardigan hides one object behind his back with a smug knowing smile. On the table in front of
him lie a red ball and an old sock, with an empty spot where the third object was. Two friends lean
in and point confidently at different guesses: a kiwi bird in a beanie and a young adult human woman
with a ponytail. Butter yellow, sky blue and warm wood palette.
```

### Abstimmen & Ranking

#### Wer würde eher? (`most-likely`)

**Spielmoment:** Alle zeigen gleichzeitig auf dieselbe Person.

```text
WHO IS MOST LIKELY: A colorful living room party with confetti in the air. In the center stands a
surprised hedgehog in a sparkly party jacket, eyes wide, hand on its chest. From every side, hands,
paws and one wing all point at it at exactly the same moment; at the edges we glimpse a laughing
human woman, a grinning tiger and a gleeful parrot. Magenta, teal and gold palette.
```

#### Entweder oder (`would-rather`)

**Spielmoment:** Zwei Möglichkeiten, eine Entscheidung.

```text
WOULD YOU RATHER: A fork in a forest path. The left path leads to a snowy mountain cabin glowing cool
blue, the right path to a sunny beach glowing warm orange. In the middle a young adult human man with
a backpack and messy hair holds a folded map, eyebrows scrunched, torn between both. A crow perched
on a blank wooden signpost shrugs with both wings. Split cool blue and warm orange palette with
forest green.
```

#### Hot Takes (`hot-takes`)

**Spielmoment:** Jemand vertritt eine gewagte Meinung, die Gruppe reagiert gespalten.

```text
HOT TAKES: A small city park with a wooden soapbox in front of a colorful mural without writing. A
capybara in a bow tie stands on the soapbox and proudly points at his own feet, which wear socks
with sandals, one fist raised in passionate conviction. In front of him, a human woman with a pink
undercut gasps in shock while a seagull in a beret nods slowly, convinced. Tomato red, mustard and
park green palette.
```

#### Paranoia (`paranoia`)

**Spielmoment:** Eine Frage wird nur geflüstert, jemand nennt einen Namen – und ein Münzwurf entscheidet, ob alle es erfahren.

```text
PARANOIA: A dim lounge with plum-purple velvet sofas and lime-green accent lamps. A young adult human
woman with braids whispers behind her hand to a smirking lynx in a leather jacket. In the
foreground, a nervous armadillo in a hoodie looks back over his shoulder at them, one bead of sweat
on his brow. Between them a large plain golden coin spins in mid-air, catching the light. Plum,
lime and gold palette.
```

#### Geld-Challenge (`money-challenge`)

**Spielmoment:** Hypothetische Geldfragen – niemand zahlt wirklich.

```text
MONEY CHALLENGE: A grand old bank lobby with navy walls, brass details and a marble floor. A stout
beaver in a pinstripe vest sits on a velvet bench, chin on his fist, deep in thought. Above his head
a glowing thought cloud shows a tiny private island with a single palm tree. Next to him, a winged
piggy bank hovers, and a few plain golden coins without markings float in the air. Navy, brass and
gold palette.
```

#### Blind Ranking (`blind-ranking`)

**Spielmoment:** Begriffe einordnen, ohne zu wissen, was noch kommt.

```text
BLIND RANKING: A game-show stage with a five-step winners' podium in teal and tangerine. A mole in a
smart sweater vest wears a blindfold and carefully places a rubber duck onto one of the middle steps,
tongue out in concentration. Behind a half-open curtain, more random objects wait in a queue: a
pineapple, a trumpet, a slipper. A human stagehand with headphones watches, biting her nails.
Teal, tangerine and warm spotlight palette.
```

#### Red Flag oder Green Flag (`red-green-flag`)

**Spielmoment:** Ist das ein Warnsignal oder ein gutes Zeichen? Die Gruppe entscheidet.

```text
RED FLAG OR GREEN FLAG: A tennis court at sunset. A flamingo referee in a crisp white polo shirt sits
on a tall umpire chair, holding a red flag in one wing and a green flag in the other, frowning,
unable to decide. Below her, a lizard in a slightly too big suit nervously presents a bouquet of
slightly wilted flowers toward the viewer with a hopeful grin. Sunset pink, court green and red
palette.
```

#### Tier List Battle (`tier-list`)

**Spielmoment:** Begriffe werden auf Ränge sortiert – und alle haben eine Meinung.

```text
TIER LIST BATTLE: A bright modern warehouse with five stacked shelves colored gold, green, yellow,
orange and grey, no letters. A giraffe in a smart turtleneck holds a donut, judging where it belongs,
one eyebrow raised. Already placed on the shelves: a rubber duck, a sock, a crown and a cactus. At
the side, a human man with glasses and a goat in overalls argue, each pointing to a different shelf.
Gold, green and warm grey palette.
```

#### Hear Me Out (`hear-me-out`)

**Spielmoment:** Jemand verteidigt eine überraschende These – die Gruppe ist halb überzeugt.

```text
HEAR ME OUT: A small wood-paneled courtroom set with amber lamps. A petite mouse lawyer in an
oversized blazer stands on a little podium and passionately presents a pineapple as evidence, one
fist raised. Behind the bench, a stern owl judge in a black robe leans forward, one eyebrow rising,
half convinced. Amber, forest green and warm wood palette.
```

#### Party Bracket (`party-bracket`)

**Spielmoment:** Acht Dinge treten im K.-o.-System gegeneinander an, bis ein Sieger übrig ist.

```text
PARTY BRACKET: A small neon-lit arena with a glowing tournament bracket made of light lines in the
background, no writing. On two pedestals, a giant donut and a rubber duck face off. A young adult
human woman referee with a whistle and striped shirt raises the donut high as the winner, while a
cheering crowd of a rhino and a koala celebrates in the stands. Neon pink and electric
blue palette.
```

### Darstellen & Erklären

#### Scharade (`charades`)

**Spielmoment:** Ein Begriff wird ohne Worte dargestellt, die anderen raten.

```text
CHARADES: A cozy living room with a small improvised stage made from a rug and a floor lamp as a
spotlight. A burly bear in white mime gloves and a striped shirt pulls an invisible rope with huge
effort, face strained. On the sofa, a human woman with a messy bun and a wombat in a hoodie shout out
guesses, leaning forward. Red, cream and warm lamp-light palette.
```

#### Nicht sagen! (`taboo`)

**Spielmoment:** Einen Begriff erklären, ohne die verbotenen Wörter zu sagen.

```text
TABOO: A study room with tall bookshelves, teal walls and orange lamps. A parrot in a cardigan
gestures wildly with one wing while clamping its own beak shut with the other, cheeks puffed. Small
speech-bubble shapes filled with crossed-out scribbles float around its head, no letters. Across from
it, a young adult human man with a beanie squints, trying hard to guess. Teal and orange palette.
```

#### Geräusche erraten (`sound-imitation`)

**Spielmoment:** Etwas wird nur mit Geräuschen dargestellt.

```text
SOUND IMITATION: A band rehearsal room with egg-crate walls and colorful lamps. A frog in a band
T-shirt without print makes a sound with hugely puffed cheeks. Visible sound waves come out of its
mouth and form the silhouettes of a cow, a steam train and a bird. Two friends react: a laughing
human woman covering one ear and a zebra in a bomber jacket guessing with a raised finger. Lime green
and purple palette.
```

#### Stirn-Raten (`forehead-guess`)

**Spielmoment:** Alle sehen den Begriff, nur die Person mit dem Stirnband nicht.

```text
FOREHEAD GUESS: A log cabin living room with red plaid blankets and a crackling fireplace. A moose in
a cozy sweater wears a headband with a small picture card facing away from him showing a banana.
He looks up, puzzled, with one hoof raised as if asking a question. In front of him, a human woman
with glasses and a red panda desperately mime peeling a banana, trying
not to giggle. Red plaid, pine green and firelight palette.
```

#### Melodie summen (`hum-song`)

**Spielmoment:** Jemand summt eine Melodie, die anderen raten den Song.

```text
HUM A SONG: A vinyl record shop at night with deep blue walls and warm golden shelf lights, record
covers without writing. A hippo in a corduroy jacket hums with eyes closed and a blissful smile;
glowing music-note shapes swirl out of him into the air. Two friends lean in, snapping their fingers
and guessing: a young adult human man with dreadlocks and a hare in a vintage vest. Deep blue and
gold palette.
```

#### Wer bin ich? (`who-am-i`)

**Spielmoment:** Die Gruppe kennt deine geheime Identität, du findest sie mit Ja-Nein-Fragen heraus.

```text
WHO AM I: A backstage costume room with racks of colorful costumes and a large ornate mirror ringed
with bulbs. A tall heron wears a puffy costume shaped like a big question mark and looks into the
mirror, thinking hard. Inside the mirror, faint glowing silhouettes of an astronaut, a chef and a
knight appear behind its reflection. A human costume designer woman with a measuring tape around her
neck watches with a knowing smile. Magenta, gold and warm bulb-light palette.
```

#### Ein-Wort-Hinweis (`password-one-word`)

**Spielmoment:** Ein einziges Hinweiswort muss reichen.

```text
ONE WORD CLUE: A night garden with tall grasses, paper lanterns and indigo sky. A raven in a knitted
scarf releases one single glowing firefly from its cupped wings with a meaningful look. Two friends
lean forward to catch it in a glass jar: a young adult human woman with a headscarf and a tortoise
in a raincoat, both concentrating. Indigo and firefly-yellow palette.
```

### Schnell & Challenge

#### Heiße Kartoffel (`hot-potato`)

**Spielmoment:** Weitergeben, bevor der Timer abläuft.

```text
HOT POTATO: A busy restaurant kitchen with red and white tiles and hanging copper pots. A steaming
hot potato with a small round kitchen timer tied to it flies through the air mid-toss, motion trails
behind it. A pig in a chef's apron has just thrown it with a panicked face, and a young adult human
woman with a headband reaches out to catch it, eyes wide. Red, white and copper palette.
```

#### Wortkette (`word-chain`)

**Spielmoment:** Jedes Wort hängt am letzten Buchstaben des vorigen.

```text
WORD CHAIN: An attic with a large model railway on a wooden table and warm lamp light. A small toy
train of linked wagons winds around the track; each wagon carries a different object (an apple, an
umbrella, an anchor, a rabbit plush). A dachshund in a conductor's cap and a young adult human man
with round glasses lean over the table, watching it with excitement. No letters. Warm wood, forest
green and brass palette.
```

#### Schnellfeuer (`rapid-fire`)

**Spielmoment:** In wenigen Sekunden möglichst viele Antworten.

```text
RAPID FIRE: A running track inside a stadium under bright lights. A cheetah in a sporty tracksuit
sprints toward the viewer holding a stopwatch, speed lines behind him. Small random objects (a
banana, a shoe, a lamp, a book) fly out of his path. On the sideline, a human coach woman with a
whistle cheers with both fists up. Orange and teal palette.
```

#### Buchstaben-Kategorien (`letter-categories`)

**Spielmoment:** Zu einem Buchstaben unter Zeitdruck passende Antworten finden.

```text
LETTER CATEGORIES: A street fair with striped tents and bunting without writing. A lop-eared rabbit
juggler in a patterned vest juggles an apple, an anchor, an ant and a small airplane, tongue out in
concentration. Next to him on a barrel an hourglass runs out. A human spectator, a man
with a mustache, claps. Sunny yellow, red and teal palette. No letters.
```

#### Nicht lachen! (`dont-laugh`)

**Spielmoment:** Ernst bleiben, während jemand Faxen macht.

```text
DON'T LAUGH: A fancy portrait studio with velvet drapes and a painted backdrop. A very serious
tortoise in a bow tie poses stiffly for a portrait, lips pressed together, eyes watering as he tries
not to laugh. Beside him, a monkey in suspenders tickles his cheek with a long feather and pulls a
ridiculous face. A human photographer woman behind an old camera bites her lip. Plum and mint palette.
```

#### Gegenstandsjagd (`scavenger-hunt`)

**Spielmoment:** Als Erster einen passenden Gegenstand finden und zurückbringen.

```text
SCAVENGER HUNT: A cozy living room in happy chaos. A shaggy sheepdog-type dog dashes toward the
viewer with a rubber duck in its mouth, ears flying, cushions tossed behind it. In the background a
young adult human woman dives headfirst into a closet, legs sticking out, and a goat holds up a
slipper triumphantly but too late. Warm orange, sage green and cream palette.
```

#### Geheime Mission (`secret-mission`)

**Spielmoment:** Eine geheime Aufgabe unauffällig erledigen.

```text
SECRET MISSION: A garden party at night with paper lanterns, hedges and a buffet table without
drinks. An elegant young adult human woman in an evening dress secretly sticks a small paper star
onto the back of a portly pelican host in a tuxedo, while smiling innocently at the viewer. The
pelican, unaware, chats happily with a guest. Emerald and soft pink palette with warm lantern light.
```

#### Hot Seat (`hot-seat`)

**Spielmoment:** Eine Person beantwortet schnell hintereinander Fragen.

```text
HOT SEAT: A late-night talk show set with a crimson curtain and golden lights. A nervous koala in a
neat blazer sits in a big velvet armchair under a single spotlight, gripping the armrests. Glowing
question-mark shapes orbit around his head. From the left, a confident human host with a pompadour
leans forward with a cue card without writing. Crimson and gold palette.
```

### Werkzeuge

#### Flaschendrehen (`spin-bottle`)

**Spielmoment:** Zufällig wird eine Person ausgewählt.

```text
SPIN THE BOTTLE: A picnic blanket in a park at dusk with fairy lights in the trees. In the middle of
the blanket a large glowing compass needle spins, motion blur. Around it sit friends waiting to see
who it points to: a young adult human woman with freckles, a bulldog in a striped shirt and a
lanky crane, all leaning in with excitement. No bottle. Dusk purple, warm gold and grass green palette.
```

#### Würfel & Münze (`dice-coin`)

**Spielmoment:** Würfel, Münzwurf, Zufall.

```text
DICE AND COIN: A wooden board-game table in a mountain cabin with warm lamp light. A pangolin in a
cozy waistcoat flicks a plain golden coin into the air with his thumb, while a large rounded die
with dots tumbles mid-air next to it, both sparkling. Across the table, a young adult human man
with a beard watches with wide eyes. Warm wood, forest green and gold palette.
```

### Kreativ & Schreiben

#### Nur falsche Antworten (`wrong-answers`)

**Spielmoment:** Absichtlich falsch und möglichst kreativ antworten.

```text
WRONG ANSWERS ONLY: An old classroom with a big chalkboard and warm afternoon light. A goat
professor in round glasses and a tweed jacket proudly presents a chalk drawing of a fish riding a
bicycle as the answer, chalk dust in the air. In the front row, a human woman student facepalms
while laughing and a penguin in a sweater applauds. Drawings only, no writing. Chalkboard green,
ochre and warm brown palette.
```

#### Zeichnen & Raten (`draw-guess`)

**Spielmoment:** Jemand zeichnet einen Begriff, die anderen raten.

```text
DRAW AND GUESS: A bright art studio with paint splashes and big windows. A kangaroo artist in a
paint-stained smock draws with a giant crayon on a large sheet of paper; the half-finished doodle
could be either a cat or a house. Two friends point at it with completely different guesses: a
young adult human man with a bandana and an sheep in overalls. Sunny yellow, cobalt and
paint-splash palette.
```

#### Caption Battle (`caption-battle`)

**Spielmoment:** Zu einem absurden Bild erfindet jeder eine Bildunterschrift.

```text
CAPTION BATTLE: A modern white art gallery with cobalt accents. A large framed painting shows a cow
on a skateboard. In front of it, three friends each hold up an empty speech-bubble sign with a
proud grin: a young adult human woman with a nose ring, a heron in a turtleneck and a ram
in a blazer. No writing. White, cobalt and warm wood palette.
```

#### Story Chain (`story-chain`)

**Spielmoment:** Jede Person fügt der Geschichte einen Satz hinzu.

```text
STORY CHAIN: A magical library at night with towering shelves and floating warm lights. A chain of
open books forms a winding bridge through the air. Tiny characters step from the pages of one book
onto the next: a knight, a dragon, a sailor. At the bottom, a young adult human woman with a long
braid and a quokka in a reading vest hand each other the next book. Midnight
blue and warm gold palette.
```

#### Satz beenden (`finish-the-sentence`)

**Spielmoment:** Einen offenen Satz spontan zu Ende bringen.

```text
FINISH THE SENTENCE: A park bench under autumn trees with falling leaves. A young adult human poet
with a beret and a long scarf writes in the air with a feather quill; the glowing trail curls into a
question-mark shape at its end. Next to her a squirrel in a tiny waistcoat watches wide-eyed, holding
an acorn. Autumn orange, rust and soft gold palette.
```

#### Satzduell (`fill-blank-battle`)

**Spielmoment:** Alle füllen dieselbe Lücke, die Antworten werden gemischt und gewählt.

```text
FILL THE BLANK BATTLE: A game café with ochre walls and teal shelves full of board games. A giant
puzzle hangs on the wall with one missing piece. Three friends each hold up a very different puzzle
piece toward the gap, competing to fit theirs: a young adult human man with a cap, an
ostrich in a sweater and a bat in a hoodie. Ochre, teal and warm light palette.
```

#### Wer hat das geschrieben? (`who-wrote-it`)

**Spielmoment:** Anonyme Antworten werden den Personen zugeordnet.

```text
WHO WROTE IT: A cozy attic with a round window and warm lamplight. A bespectacled tapir in a tweed
cape inspects a pile of folded paper notes with a magnifying glass, one eyebrow raised. Behind him,
three suspects whistle innocently: a young adult human woman with a bob, a stork and a hamster in a
bow tie. No readable writing. Warm brown, plum and lamp-gold palette.
```

### Wissen & Quiz

#### Anime-Archetypen erraten (`anime-guess`)

**Spielmoment:** Typische Rollen erkennen – ohne bekannte Figuren.

```text
ANIME ARCHETYPE GUESS: A dramatic stage with backlit fog and colored spotlights. Three completely
original stylized characters strike poses: a hero with a flowing red scarf, a mage with a glowing
staff and a calm swordsman with a wooden practice sword. In front, a young adult human quizmaster
woman with headphones points at them, guessing. No recognizable character, costume, hairstyle or
pose from any existing anime. Crimson, violet and electric blue palette.
```

#### Emoji Quiz (`emoji-quiz`)

**Spielmoment:** Eine Bildkombination ergibt einen Begriff.

```text
EMOJI QUIZ: A colorful game room with bean bags. Above a coffee table, glossy round expressive
spheres float in a row like a picture riddle: one sphere wears a chef's hat, next to it floats a
pizza. Two friends think hard: a young adult human man with a buzz cut and a toucan in a hoodie.
Original sphere design, not any existing emoji set. Bubblegum pink, sunny yellow and sky blue palette.
```

#### Party Quiz (`party-quiz`)

**Spielmoment:** Schnell die richtige Antwort wählen.

```text
PARTY QUIZ: A small game-show studio with glowing floor tiles. An eager hamster in a sparkly jacket
stands at a podium with four large glowing buttons in red, blue, green and yellow, one paw hovering
ready to press. At the next podium, a young adult human woman with braids has already slammed her
button and cheers. No letters. Bright red, blue, green and yellow on dark purple.
```

#### Fake oder Fakt (`fact-or-fake`)

**Spielmoment:** Stimmt die Aussage oder ist sie erfunden?

```text
FACT OR FAKE: A fairy-tale photo booth with clouds and stars painted on the backdrop. A horse half
removes a unicorn mask with a glittering horn, caught in the act, looking sheepish under a spotlight.
Two friends judge: a young adult human woman with crossed arms and a smirk, and a emu in
a blazer giving a thumbs down. Lilac, silver and warm gold palette.
```

### Schätzen & Tippen

#### Spektrum-Tipp (`wavelength`)

**Spielmoment:** Der Zielwert liegt irgendwo zwischen zwei Polen.

```text
WAVELENGTH: A circus tent with striped walls and warm spotlights. A penguin acrobat in a sparkly
leotard balances on a glowing tightrope stretched between a melting ice cube on one side and a small
warm sun on the other, arms out, looking for the right spot. Below, a young adult human ringmaster
woman in a red tailcoat watches tensely. Icy blue to sunny orange gradient palette with circus red.
```

#### Preis schätzen (`guess-the-price`)

**Spielmoment:** Den Preis eines Gegenstands schätzen.

```text
GUESS THE PRICE: A quirky auction house with velvet chairs and a wooden stand. On a pedestal stands a
strange invention: a toaster with small wings and a blank price tag. A mouse in a tweed vest inspects
it closely through a magnifying glass, while a young adult human woman auctioneer with an
open hand presents it with a big smile. Burgundy, brass and cream palette.
```

#### Höher oder tiefer (`higher-lower`)

**Spielmoment:** Ist die nächste Zahl höher oder tiefer?

```text
HIGHER OR LOWER: A fantastical staircase junction in a palace of floating stairs. One staircase rises
into bright warm light, the other descends into cool blue shadow. An ibex in a smart vest stands at
the junction, one hoof on each first step, deciding. Behind him, a young adult human woman with a
lantern shrugs. Warm gold and cool blue palette.
```

#### Prozent schätzen (`percent-guess`)

**Spielmoment:** Einen Anteil möglichst genau schätzen.

```text
PERCENT GUESS: A cozy candy shop with pastel shelves. A squirrel in a striped apron squints at a large
glass jar partly filled with glowing marbles, holding up one paw like a measuring stick. Behind the
counter, a young adult human shopkeeper man with a mustache leans on his elbows, smiling. Pastel mint,
peach and lavender palette.
```
