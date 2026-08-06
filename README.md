# Secret Circle Party Hub

Offline Party Hub mit **37 technisch spielbaren Spielen**, Smart Party Night, Word Imposter, eigenen Packs, versionierten Sessions und Offline-Core `secret-circle-v27`.

## Neue Trend-Bereiche

- Wer bin ich? mit Anime-Archetypen, Gaming, Geschichte, Sport, Berufen, Tieren und Mythen
- inoffizielles Anime-Figuren-Namensquiz ohne Bilder, Logos oder Zitate
- hypothetische Geld-Challenge ohne echte Zahlungspflicht
- Blind Ranking
- Emoji Quiz
- Pass das Handy
- Red Flag oder Green Flag
- Geheime Mission
- Tier List Battle

Eigene Text-Packs sind unter anderem für Wer bin ich?, Anime-Figuren, Pass das Handy, Flags, Missionen und Tier Lists möglich.

## Start

Hub `/party.html` · Imposter `/index.html` · Advanced `/advanced.html?game=question-imposter` · Quick `/quick-play.html?game=wavelength` · Anime `/quick-play.html?game=anime-guess`.

## Tests

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

`MODE_UNIVERSE.md` beschreibt weiterhin 122 Modi: 37 aktuell und 85 als Roadmap. Automatisierter Gesamttest: `GO`. Realer Betatest und öffentlicher Release bleiben bis zu grünen automatisierten, Geräte-, Gruppen-, Inhalts- und Rechtsprüfungen `NO_GO`.
