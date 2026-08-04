# GitHub Actions – Fehler vor dem ersten Schritt

## Beobachtetes Verhalten

`Secret Circle CI` wird beendet, bevor ein einziger Workflow-Schritt ausgeführt wird.

Aktuell bestätigt:

- Workflow-Lauf `#648`
- Run-ID `30930748182`
- ursprünglicher Job `92064498410`
- erneut ausgeführter Job `92077185391`
- Jobname `validate`
- Ergebnis jeweils `failure`
- bei beiden Versuchen leere Schrittliste
- kein normaler Job-Log
- selbst `actions/checkout` wurde nicht gestartet

Der fehlgeschlagene Job wurde am 4. August 2026 erneut über die GitHub-API angestoßen. GitHub akzeptierte die Wiederholung, beendete aber auch den neuen Job vor dem ersten Schritt. Das unterscheidet sich von einem Syntax-, Unit-, Validator- oder Playwright-Fehler, bei dem mindestens ein konkreter Workflow-Schritt und normalerweise ein Log sichtbar wäre.

## Wahrscheinliche externe Ursachen

1. GitHub Actions ist für das Repository deaktiviert oder eingeschränkt.
2. Kontolimit, Budget oder Abrechnung blockiert gehostete Runner.
3. Konto- oder Organisationsrichtlinie verhindert die Runner-Bereitstellung.
4. Eine Sicherheits- oder Nutzungsbeschränkung betrifft das Konto.
5. Vorübergehende GitHub-Actions-Störung.

## Repositoryseitiger Stand

Die Workflow-Konfiguration verlangt:

- Syntaxprüfung aller Produktionsmodule
- 8 Unit-Testdateien
- Strukturvalidator
- Performancebudget
- Release-Audit
- mindestens 19 Playwright-E2E-Suiten
- Cross-Browser-Lauf für Chromium, Firefox und WebKit

Der aktuelle Offline-Core ist `secret-circle-v23`. Zusätzlich geprüft werden sollen:

- 18 spielbare Spiele und 4 gesperrte Roadmap-Spiele
- Eigene Hub-Packs
- aktive Session Version 2
- Spieler-Snapshot bei späterer Lobbyänderung
- transaktionssicherer Abschluss ohne Fortschrittsverlust
- Gesamtexport, Import, Rollback und Löschung
- Manifest, Icons, CSP, Accessibility und Offline-Start

Diese Prüfungen sind im Repository definiert, aber durch den Runner-Blocker noch nicht auf GitHub ausgeführt worden.

## Actions-Berechtigungen prüfen

`Settings → Actions → General`

- Actions für das Repository erlauben
- offizielle `actions/*`-Workflows erlauben
- Workflow-Berechtigung mindestens auf Lesen des Repository-Inhalts setzen
- Fork- und Organisationsrichtlinien kontrollieren
- Repository darf nicht archiviert sein

Verwendete offizielle Actions:

- `actions/checkout@v4`
- `actions/setup-node@v4`
- `actions/setup-python@v5`
- `actions/upload-artifact@v4`

## Abrechnung und Nutzungslimits prüfen

`Settings → Billing and licensing`

- verfügbare Actions-Minuten
- Ausgabenlimit
- Zahlungsmethode
- deaktivierte Actions-Nutzung
- Organisationsbudget, falls das Repository einer Organisation gehört
- mögliche Konto- oder Zahlungsbeschränkung

## GitHub-Status und Konto prüfen

- GitHub-Statusseite auf Actions-Störung prüfen
- E-Mail- und Kontoverifizierung kontrollieren
- Repository- und Kontobenachrichtigungen auf Einschränkungen prüfen
- bei anhaltendem Fehler GitHub Support mit Run-ID und Job-ID kontaktieren

Hilfreiche Angaben für Support:

- Repository: `memetreza34-ux/Secret-Circle`
- Workflow-Run: `30930748182`
- erster Job: `92064498410`
- Wiederholungsjob: `92077185391`
- beide Jobs ohne Schritte und Logs

## Erneut ausführen

1. Einstellungen und Abrechnung prüfen.
2. Draft-PR #11 öffnen.
3. `Checks` oder `Actions` öffnen.
4. fehlgeschlagenen Job erneut starten.
5. prüfen, ob `Check out repository` erscheint.
6. erst danach einen roten Repository-Schritt anhand seines Logs bearbeiten.

## Lokale Ersatzprüfung

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci

npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

Ein erfolgreicher lokaler Lauf ist ein starkes technisches Signal. Er ersetzt jedoch nicht den grünen GitHub-Actions-Nachweis auf dem endgültigen Commit.

## Erwartete lokale Prüfergebnisse

Der Lauf muss unter anderem bestätigen:

- Engine und Speicher Version 7
- faire Rollenverteilung und maximal sechs Imposter
- 22 Katalogeinträge, 18 spielbar und 4 geplant
- mindestens 384 Hub-Inhalte
- Eigene Hub-Packs mit Limits und sicherer Textausgabe
- Spieler-Snapshot in komplexen Sessions
- aktive Session bleibt bei fehlgeschlagener Verlaufsspeicherung erhalten
- Cache `secret-circle-v23` ist vollständig und exklusiv
- Hub, komplexe Spiele, Word Imposter und Datenschutz starten offline
- Browser- und mobile Gates bestehen

## Tracking

- Issue #7: externer GitHub-Actions-Runner-Blocker
- Issue #8: reale Geräte-, Rollen- und Partytests
- Issue #10: Party-Hub-Expansion
- Draft-PR #11: aktueller Expansionsstand

## Freigabeentscheidung

- lokaler Entwickler-Test nach erfolgreichem `npm run ci`: möglich
- Merge ohne grüne CI: nur als bewusste Ausnahme, nicht als Produktionsfreigabe
- realer Beta-Test: erst nach erfolgreichem lokalen Gesamt- und Browserlauf
- öffentlicher Release: blockiert, bis der endgültige Commit sichtbare erfolgreiche Workflow-Schritte besitzt
