# Secret Circle Party Hub

Offline Party Hub mit 28 technisch spielbaren Spielen, Smart Party Night, Word Imposter, eigenen Packs, versionierten Sessions und Offline-Core `secret-circle-v26`.

Start: `/party.html` · Imposter `/index.html` · Advanced `/advanced.html?game=question-imposter` · Quick `/quick-play.html?game=wavelength`.

Tests:

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

`MODE_UNIVERSE.md` beschreibt 122 Modi. Automatisierter Gesamttest: `GO`. Realer Betatest und öffentlicher Release bleiben bis zu grünen automatisierten, Geräte-, Gruppen-, Inhalts- und Rechtsprüfungen `NO_GO`.
