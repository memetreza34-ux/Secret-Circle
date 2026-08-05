# Secret Circle Party Hub

Offline nutzbare Partyspiel-Plattform.

**Stand:** 28 technisch spielbare Spiele · Smart Party Night · Offline-Core `secret-circle-v26` · 122-Modi-Roadmap.

## Start

```bash
python -m http.server 8080
```

Hub `/party.html` · Imposter `/index.html` · Advanced `/advanced.html?game=question-imposter` · Quick `/quick-play.html?game=wavelength`.

## Umfang

- 28 Spiele
- 10 wiederaufnehmbare Quick Modes
- 4 Advanced-Spiele
- Smart Party Night
- Spieler, Presets, Favoriten, Verlauf, Statistik und Erfolge
- eigene Packs
- Export, Import, Löschung und Rollback
- Offline-PWA ohne Tracking
- 122-Modi-Produktlandkarte

## Tests

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

Automatisierter Gesamttest: `GO`. Realer Betatest und öffentlicher Release bleiben bis zu grünen automatisierten, Geräte-, Gruppen-, Inhalts- und Rechtsprüfungen `NO_GO`.
