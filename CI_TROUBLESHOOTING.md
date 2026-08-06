# GitHub Actions – Fehler vor dem ersten Schritt

## Beobachtung

GitHub-Actions-Läufe können als Fehler enden, bevor `actions/checkout` oder ein anderer Workflow-Schritt sichtbar wird. Eine leere Schrittliste und fehlende normale Job-Logs sind kein konkreter Beweis für einen JavaScript-, Unit-, Validator- oder Playwright-Fehler.

Der aktuelle Stand erwartet:

- 45 eingebaute technisch spielbare Spiele
- 27 Quick-, Trend- und Viral-Modi
- 4 Advanced-Spiele
- lokaler Game-Creator mit 6 Vorlagen und bis zu 40 eigenen Spielen
- Smart Party Night
- Offline-Core `secret-circle-v29`
- mindestens 13 Unit-Testdateien
- mindestens 27 E2E-Suiten
- fünf Browser-/Geräteprojekte

## Externe Ursachen prüfen

`Settings → Actions → General`:

- Actions ist erlaubt.
- offizielle Actions sind zugelassen.
- Workflow besitzt Lesezugriff auf Repository-Inhalte.
- Repository ist nicht archiviert.

`Settings → Billing and licensing`:

- kein erreichtes Actions-Limit
- keine blockierte Zahlungsmethode
- private Repository-Nutzung zulässig
- kein Organisationsbudget blockiert Runner

Zusätzlich GitHub-Status, Konto- und Organisationsbenachrichtigungen prüfen.

## Erneut auslösen

1. Draft-PR #11 öffnen.
2. `Checks` oder `Actions` öffnen.
3. fehlgeschlagenen Lauf erneut starten.
4. kontrollieren, dass `Check out repository` erscheint.
5. anschließend den ersten roten Schritt auswerten.

## Lokale Ersatzprüfung

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci
```

Cross-Browser:

```bash
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

## Erwartete lokale Prüfpunkte

- Syntax aller Produktionsmodule
- Engine und Speicher Version 7
- Katalogschichten mit 45 eingebauten Spielen
- Routing Version 7
- Creator-Speicher Version 1
- sechs Creator-Vorlagen
- strukturierte Auswahlkarten bleiben nach Export und Import erhalten
- Creator-Rollback bei Speicherfehler
- kurze Hilfen und Creator-Einstiege im Hub
- Quick-, Trend-, Viral- und Advanced-Sessions
- Backup und vollständige Löschung einschließlich eigener Spiele
- Manifest, CSP, Icons und Accessibility
- Cache `secret-circle-v29` vollständig und exklusiv
- Hub, Creator, Hilfesystem, alle Engines, Word Imposter und Datenschutz offline

## Typische Repository-Fehler

- Syntax: `npm run check`
- Unit-Tests: `npm test`
- Struktur, Cache oder Dokumentation: `npm run validate`
- Chromium: `npm run test:e2e`
- Firefox/WebKit: `npm run test:cross-browser`
- veralteter Cache: Ziel `secret-circle-v29`
- veraltete Routingversion: Ziel 7
- veralteter Custom-Pack-Manager: Ziel 4
- fehlende Creator-Dateien: `creator.html`, `game-creator.js`, `creator-page.js`, `creator.css`
- fehlende Guidance-Dateien: `party-guide.js`, `party-guide.css`

## Tracking

- Issue #7: externer GitHub-Actions-Runner-Blocker
- Issue #8: reale Geräte-, Rollen- und Partytests
- Issue #10: Party-Hub-Expansion
- Draft-PR #11: aktueller Expansions-, UX- und Creator-Stand

## Freigabe

Ein grüner lokaler Lauf ist ein starkes technisches Signal, ersetzt aber nicht den grünen GitHub-Actions-Nachweis auf dem endgültigen Commit. Merge, realer Betatest und öffentlicher Release bleiben bis zu den jeweiligen Gates blockiert.
