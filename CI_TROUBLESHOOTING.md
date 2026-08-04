# GitHub Actions – Fehler vor dem ersten Schritt

## Beobachtetes Verhalten

`Secret Circle CI` wird beendet, bevor ein einziger Workflow-Schritt ausgeführt wird.

Aktuellster bestätigter Lauf:

- Workflow-Lauf `#718`
- Run-ID `30937503573`
- Job-ID `92087237250`
- Jobname `validate`
- Ergebnis `failure`
- leere Schrittliste
- kein normaler Job-Log
- selbst `actions/checkout` wurde nicht gestartet
- Commit `9fad10128e7b2036465f89925bb21eab412e1098`

Zuvor wurden auch Run `30930748182` und dessen Wiederholungsjob ohne einen einzigen Schritt beendet. Die Wiederholung wurde von GitHub angenommen, änderte das Verhalten aber nicht.

Das unterscheidet sich von einem Syntax-, Unit-, Validator- oder Playwright-Fehler. Bei einem Repositoryfehler wäre mindestens der betroffene Workflow-Schritt mit Log sichtbar.

## Wahrscheinliche externe Ursachen

1. GitHub Actions ist für das Repository deaktiviert oder eingeschränkt.
2. Kontolimit, Budget oder Abrechnung blockiert gehostete Runner.
3. Konto- oder Organisationsrichtlinie verhindert die Runner-Bereitstellung.
4. eine Sicherheits- oder Nutzungsbeschränkung betrifft das Konto.
5. vorübergehende GitHub-Actions-Störung.

## Repositoryseitiger Stand

Die Workflow-Konfiguration verlangt:

- Syntaxprüfung aller Produktionsmodule
- 8 Unit-Testdateien
- Strukturvalidator
- Performancebudget
- Release-Audit
- mindestens 19 Playwright-E2E-Suiten
- Cross-Browser-Lauf für Chromium, Firefox und WebKit

Der aktuelle Offline-Core ist `secret-circle-v24`. Zusätzlich geprüft werden sollen:

- 18 spielbare Spiele und 4 gesperrte Roadmap-Spiele
- Eigene Hub-Packs mit transaktionssicherem Speichern und Löschen
- aktive Session Version 2 und Spieler-Snapshot
- transaktionssicherer Sessionabschluss
- tatsächliche UTF-8-Byte-Grenze für Sicherungen
- Import- und Lösch-Rollback
- Präferenz- und Statistik-Speicherfehler
- Manifest, Icons, CSP, Accessibility und Offline-Start

Diese Prüfungen sind im Repository definiert, wurden wegen des Runner-Blockers aber nicht auf GitHub ausgeführt.

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
- Organisationsbudget, falls zutreffend
- mögliche Konto- oder Zahlungsbeschränkung

## GitHub-Status und Konto prüfen

- GitHub-Statusseite auf Actions-Störung prüfen
- E-Mail- und Kontoverifizierung kontrollieren
- Repository- und Kontobenachrichtigungen auf Einschränkungen prüfen
- bei anhaltendem Fehler GitHub Support mit Run-ID und Job-ID kontaktieren

Hilfreiche Angaben für Support:

- Repository: `memetreza34-ux/Secret-Circle`
- aktueller Workflow-Run: `30937503573`
- aktueller Job: `92087237250`
- ältere Wiederholung: Run `30930748182`, Jobs `92064498410` und `92077185391`
- alle Jobs ohne Schritte und Logs

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

Ein erfolgreicher lokaler Lauf ist ein starkes technisches Signal. Er ersetzt nicht den grünen GitHub-Actions-Nachweis auf dem endgültigen Commit.

## Erwartete lokale Prüfergebnisse

Der Lauf muss unter anderem bestätigen:

- Engine und Speicher Version 7
- faire Rollenverteilung und maximal sechs Imposter
- 22 Katalogeinträge, 18 spielbar und 4 geplant
- Eigene Hub-Packs mit Unicode-Normalisierung und Rollback
- Spieler-Snapshot in komplexen Sessions
- aktive Session bleibt bei fehlgeschlagener Verlaufsspeicherung erhalten
- Mehrbyte-Datei über 1,5 MB wird anhand tatsächlicher Bytes abgelehnt
- Import- und Löschfehler stellen alte Daten wieder her
- Präferenz- und Statistikfehler bleiben beherrschbar
- Cache `secret-circle-v24` ist vollständig und exklusiv
- Hub, komplexe Spiele, Word Imposter und Datenschutz starten offline

## Tracking

- Issue #7: externer GitHub-Actions-Runner-Blocker
- Issue #8: reale Geräte-, Rollen- und Partytests
- Issue #10: Party-Hub-Expansion
- Draft-PR #11: aktueller Expansionsstand

## Freigabeentscheidung

- lokaler Entwickler-Test nach erfolgreichem `npm run ci`: möglich
- Merge ohne grüne CI: nur bewusste Ausnahme, nicht als Produktionsfreigabe
- realer Beta-Test: erst nach erfolgreichem lokalen Gesamt- und Browserlauf
- öffentlicher Release: blockiert, bis der endgültige Commit sichtbare erfolgreiche Workflow-Schritte besitzt
