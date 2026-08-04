# GitHub Actions – Fehler vor dem ersten Schritt

## Beobachtetes Verhalten

Die Workflow-Läufe von `Secret Circle CI` werden als fehlgeschlagen beendet, bevor ein einziger Schritt ausgeführt wird.

Zuletzt bestätigt:

- Workflow-Lauf: `#384`
- Run-ID: `30902981127`
- Job-ID: `91971379782`
- Commit zum Prüfzeitpunkt: `058b68f4e1125f5d9dbb211066324c9a79a9c538`
- Jobname: `validate`
- Status: `completed`
- Ergebnis: `failure`
- Schrittliste: leer
- Job-Log: nicht vorhanden

Typische Merkmale des Problems:

- der Job endet, bevor `Check out repository` erscheint,
- keine GitHub-Actions-Schritte werden protokolliert,
- der Log-Download liefert keinen normalen Workflow-Log,
- neue Commits erzeugen dasselbe Verhalten.

Das unterscheidet sich von einem Syntax-, Test-, Validator- oder Playwright-Fehler. Bei einem Repository-Fehler wären mindestens Checkout, Setup oder der fehlerhafte Befehl in der Schrittliste sichtbar.

## Wahrscheinliche externe Ursachen

In dieser Reihenfolge prüfen:

1. **Actions ist für das Repository deaktiviert oder eingeschränkt.**
2. **Kontolimit, Budget oder Abrechnung blockiert neue gehostete Runner.**
3. **GitHub-App- oder Organisationsrichtlinie verhindert die Runner-Bereitstellung.**
4. **Vorübergehende GitHub-Actions-Störung.**
5. **Das Konto oder Repository besitzt eine externe Nutzungsbeschränkung.**

## Prüfung im Repository

### 1. Actions-Berechtigungen

Im Repository öffnen:

`Settings → Actions → General`

Prüfen:

- Actions ist erlaubt.
- `Allow all actions and reusable workflows` ist aktiv oder die verwendeten offiziellen Actions sind ausdrücklich erlaubt.
- `Workflow permissions` besitzt mindestens `Read repository contents permission`.
- Änderungen speichern.

Verwendete offizielle Actions:

- `actions/checkout@v4`
- `actions/setup-node@v4`
- `actions/setup-python@v5`
- `actions/upload-artifact@v4`

### 2. Abrechnung und Nutzungslimits

Im persönlichen GitHub-Konto öffnen:

`Settings → Billing and licensing`

Prüfen:

- kein erreichtes Actions-Ausgabenlimit,
- keine abgelehnte oder abgelaufene Zahlungsmethode,
- keine deaktivierte Actions-Nutzung,
- ausreichend Actions-Minuten beziehungsweise zulässige Nutzung für private Repositories.

Bei Organisationsbesitz zusätzlich die Billing- und Actions-Einstellungen der Organisation prüfen.

### 3. Repository- und Kontostatus

Prüfen:

- Repository ist nicht archiviert.
- Konto besitzt weiterhin Schreibzugriff.
- Keine Sicherheits- oder Nutzungsbeschränkung im Konto.
- GitHub-Statusseite meldet keine aktuelle Actions-Störung.

## Workflow erneut auslösen

Nach Korrektur der Einstellungen:

1. Pull Request #3 öffnen.
2. Tab `Checks` oder `Actions` öffnen.
3. Fehlgeschlagenen Lauf erneut ausführen oder `Secret Circle CI` über `Run workflow` starten.
4. Kontrollieren, dass mindestens der Schritt `Check out repository` erscheint.

Sobald Schritte sichtbar sind, normale Fehler anhand des ersten roten Schritts bearbeiten.

## Lokale Ersatzprüfung

Bis GitHub Actions wieder Runner startet:

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci
```

Optionaler Browser-Smoke-Test:

```bash
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

Die Validierung prüft Repository-Hygiene, Dateigrößen, Syntax, Engine, Speicherung, PWA-Struktur, vollständigen Cache `secret-circle-v16`, Live-Einrichtung, Karten-Sichtschutz, Wake Lock, Datenschutz, Sicherheit und Browserabläufe. Ein lokaler erfolgreicher Lauf ist deshalb ein starkes technisches Signal, ersetzt für den öffentlichen Release aber nicht den erfolgreichen Lauf auf dem endgültigen GitHub-Commit.

## Tracking

Das externe Problem wird zusätzlich in Issue #7 verfolgt.

## Freigabeentscheidung

- **Code-Review oder lokaler Betatest:** möglich, wenn `npm run ci` erfolgreich ist.
- **Merge ohne grüne CI:** nur als bewusste Ausnahme und nicht als Produktionsfreigabe.
- **Öffentlicher Release:** blockiert, bis der Workflow auf dem endgültigen Commit Schritte ausführt und vollständig grün ist.
