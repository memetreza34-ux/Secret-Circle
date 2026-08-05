# Secret Circle Party Hub – Entwicklungs- und Release-Status

Stand: 5. August 2026  
Version: `1.0.0-beta.3`  
Branch: `codex/party-hub-foundation`  
Draft-PR: `#11`  
Planung: Issue `#10`

## Kernzahlen

- 28 sichtbare und technisch spielbare Spiele
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
| Inhalte und Kategorien | 87 % |
| Eigene Hub-Packs | 96 % |
| Speicherung und Datensicherung | 98 % |
| PWA und Offline | 97 % |
| Accessibility und Mobile | 93 % |
| Automatisierte Vorbereitung | 99 % |
| Langfristige Architektur | 96 % |
| Gesamte 122-Modi-Vision funktional | 34 % |
| Bereit für reale Geräte-/Partytests | 94 % |
| Bereit für öffentlichen Release | 83 % |

Die Werte bewerten Implementierung und Vorbereitung. Sie ersetzen keine bestandenen Tests.

## Neu abgeschlossen

- Wellenlänge, Zeichnen & Raten, Schnellfeuer und Geräusche erraten freigeschaltet
- Stirn-Raten, Buchstaben-Kategorien, Nicht lachen!, Melodie summen, Gegenstandsjagd und Caption Battle ergänzt
- gemeinsame wiederaufnehmbare Quick-Mode-Engine
- 3, 5, 10 oder 20 Runden
- Spieler-Snapshot, Punkte, Rangliste, Verlauf und Statistik
- eigene Inhalte für alle zehn Quick Modes
- korrupte Quick-Sessions werden verworfen
- Security-, Tastatur-, Touch-, Overflow- und Reduced-Motion-Tests
- Offline-Core v26
- 122-Modi-Universum auf 28 spielbare und 94 zukünftige Modi synchronisiert
- Struktur-, Release-, Architektur- und Performance-Gates erweitert

## Blocker

1. `npm run ci` noch nicht erfolgreich protokolliert.
2. `npm run test:cross-browser` noch nicht erfolgreich protokolliert.
3. GitHub Actions muss sichtbare Schritte ausführen und grün enden.
4. reale Android-/iOS- und PWA-Update-Tests fehlen.
5. kleiner und großer Partytest fehlen.
6. alle 28 Spiele müssen real geprüft werden.
7. redaktionelle Inhalts- und Altersprüfung fehlt.
8. öffentliche Betreiber- und Kontaktangaben fehlen.

## Befehle

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci

npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

## Freigabe

- vollständiger lokaler Testlauf: `GO`
- kontrollierter Entwickler-Browsertest: `GO_WITH_CONDITIONS`
- realer Geräte-/Party-Betatest: `NO_GO` bis grüne automatisierte Läufe
- Merge von Draft-PR #11: `NO_GO` bis grüne Kernprüfungen
- öffentlicher Release: `NO_GO`
