# Secret Circle Party Hub – Release-Status

Stand: 5. August 2026 · `1.0.0-beta.3` · Draft-PR #11

- 28 technisch spielbare Spiele
- 10 Quick Modes
- 4 Advanced-Spiele
- 122 Modi im Gesamtuniversum
- Offline-Core `secret-circle-v26`
- mindestens 10 Unit- und 23 E2E-Dateien
- 5 Browser-/Geräteprojekte

## Fortschritt

Word Imposter 98 % · Party Hub 98 % · 28 Spiele 93 % · Quick Engine 92 % · Advanced 88 % · Inhalte 87 % · eigene Packs 96 % · Speicherung 98 % · PWA/Offline 97 % · Accessibility 93 % · Testvorbereitung 99 % · Architektur 96 % · 122-Modi-Vision funktional 34 % · reale Testbereitschaft 94 % · öffentlicher Release 83 %.

## Blocker

`npm run ci`, Cross-Browser, GitHub Actions, Android/iOS, PWA-Update, reale Gruppen, alle 28 Spiele, Inhalte, Alter und Recht müssen noch erfolgreich bestätigt werden.

## Befehle

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

Automatisierter Gesamttest: `GO`. Realer Betatest, Merge und öffentlicher Release: `NO_GO` bis die jeweiligen Gates grün sind.
