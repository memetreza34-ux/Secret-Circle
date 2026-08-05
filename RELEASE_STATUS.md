# Secret Circle Party Hub – Release-Status

Stand: 5. August 2026 · Version `1.0.0-beta.3` · Branch `codex/party-hub-foundation` · Draft-PR #11

## Kernzahlen

- 28 technisch spielbare Spiele
- 10 Quick Modes
- 4 Advanced-Spiele
- 122 Modi im langfristigen Universum
- Offline-Core `secret-circle-v26`
- mindestens 10 Unit-Testdateien
- mindestens 23 E2E-Suiten
- 5 Browser-/Geräteprojekte

## Fortschritt

| Bereich | Stand |
|---|---:|
| Word Imposter | 98 % |
| Party-Hub-Grundlage | 98 % |
| 28 spielbare Spiele | 93 % |
| Quick-Mode-Engine | 92 % |
| Advanced-Spiele | 88 % |
| Inhalte | 87 % |
| eigene Packs | 96 % |
| Speicherung und Backup | 98 % |
| PWA und Offline | 97 % |
| Accessibility und Mobile | 93 % |
| Testvorbereitung | 99 % |
| langfristige Architektur | 96 % |
| 122-Modi-Vision funktional | 34 % |
| reale Testbereitschaft | 94 % |
| öffentlicher Release | 83 % |

Die Werte bewerten Implementierung und Vorbereitung, nicht bestandene Tests.

## Neu

- zehn Quick Modes mit gemeinsamer wiederaufnehmbarer Engine
- Wellenlänge, Zeichnen, Schnellfeuer, Geräusche, Stirn-Raten, Buchstaben-Kategorien, Nicht lachen, Summen, Gegenstandsjagd und Caption Battle
- 3, 5, 10 oder 20 Runden
- Spieler-Snapshot, Punkte, Verlauf und Statistik
- Korruptions-, Security-, Tastatur-, Touch-, Overflow- und Reduced-Motion-Prüfungen
- v26 Offline-Core
- 28 aktuelle plus 94 zukünftige Modi

## Blocker

1. `npm run ci` noch nicht erfolgreich protokolliert.
2. Cross-Browser-Lauf noch nicht erfolgreich protokolliert.
3. GitHub Actions startet weiterhin keine sichtbaren Schritte.
4. Android-, iOS- und PWA-Update-Tests fehlen.
5. reale kleine und große Partytests fehlen.
6. alle 28 Spiele benötigen reale Prüfung.
7. Inhalts-, Alters- und Rechtsprüfung fehlt.

## Befehle

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

## Entscheidung

- automatisierter Gesamttest: `GO`
- realer Geräte-/Party-Betatest: `NO_GO` bis grüne automatisierte Läufe
- Merge von PR #11: `NO_GO` bis grüne Kernprüfungen
- öffentlicher Release: `NO_GO`
