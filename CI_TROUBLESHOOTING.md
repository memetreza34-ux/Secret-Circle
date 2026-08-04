# GitHub Actions – Fehler vor dem ersten Schritt

## Beobachtetes Verhalten

Die Workflow-Läufe von `Secret Circle CI` werden als fehlgeschlagen beendet, bevor ein einziger Schritt ausgeführt wird.

Typische Merkmale des aktuellen Problems:

- Jobname `validate`
- Status `completed`
- Ergebnis `failure`
- leere Schrittliste
- kein Job-Log verfügbar
- Log-Download endet mit `404 BlobNotFound`

Das unterscheidet sich von einem normalen Syntax-, Test- oder Playwright-Fehler. Bei einem Repository-Fehler wären mindestens Checkout, Setup oder der fehlerhafte Befehl in der Schrittliste sichtbar.

## Wahrscheinliche externe Ursachen

In dieser Reihenfolge prüfen:

1. **Actions ist für das Repository deaktiviert oder eingeschränkt.**
2. **Kontolimit, Budget oder Abrechnung blockiert neue gehostete Runner.**
3. **GitHub-App-/Organisationsrichtlinie verhindert die Runner-Bereitstellung.**
4. **Vorübergehende GitHub-Actions-Störung.**
5. **Workflow wartet intern auf eine nicht bereitgestellte Runner-Umgebung und wird von GitHub sofort beendet.**

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
npm install --ignore-scripts --no-audit --no-fund
npx playwright install --with-deps chromium
npm run check
npm test
npm run validate
npm run test:e2e
```

Oder vollständig:

```bash
npm run ci
```

Ein lokaler erfolgreicher Lauf ist ein wichtiges Signal, ersetzt aber für den öffentlichen Release nicht den erfolgreichen Lauf auf dem endgültigen GitHub-Commit.

## Freigabeentscheidung

- **Code-Review oder lokaler Betatest:** möglich, wenn lokale Prüfungen erfolgreich sind.
- **Merge ohne grüne CI:** nur als bewusste Ausnahme und nicht als Produktionsfreigabe.
- **Öffentlicher Release:** blockiert, bis der Workflow auf dem endgültigen Commit Schritte ausführt und vollständig grün ist.
