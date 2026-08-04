# GitHub Actions – Fehler vor dem ersten Schritt

## Beobachtetes Verhalten

`Secret Circle CI` wird beendet, bevor ein einziger Workflow-Schritt ausgeführt wird.

Zuletzt bestätigt:

- Workflow-Lauf `#420`
- Run-ID `30903841947`
- erster Job `91974191883`
- erneuter Job `91974334081`
- Commit `3217d826f428402d079ef458e2147d880ad94e92`
- Job `validate`
- Ergebnis `failure`
- bei beiden Versuchen leere Schrittliste und kein normales Job-Log

Der erneute Workflow-Versuch wurde von GitHub angenommen, endete aber erneut vor `actions/checkout`. Das unterscheidet sich von einem Syntax-, Test- oder Playwright-Fehler, bei dem mindestens der fehlerhafte Schritt sichtbar wäre.

## Wahrscheinliche externe Ursachen

1. Actions ist für das Repository deaktiviert oder eingeschränkt.
2. Kontolimit, Budget oder Abrechnung blockiert gehostete Runner.
3. Konto- oder Organisationsrichtlinie verhindert die Runner-Bereitstellung.
4. Vorübergehende GitHub-Actions-Störung.
5. Externe Einschränkung des Kontos oder Repositorys.

## Prüfung

### Actions-Berechtigungen

`Settings → Actions → General`

- Actions erlauben
- offizielle `actions/*`-Workflows erlauben
- mindestens Leseberechtigung für Repository-Inhalte aktivieren

Verwendete Actions:

- `actions/checkout@v4`
- `actions/setup-node@v4`
- `actions/setup-python@v5`
- `actions/upload-artifact@v4`

### Abrechnung und Nutzungslimits

`Settings → Billing and licensing`

- Actions-Ausgabenlimit
- verfügbare Minuten
- Zahlungsmethode
- deaktivierte Actions-Nutzung
- Organisations-Billing, falls zutreffend

### Repository und Konto

- Repository nicht archiviert
- Schreibzugriff vorhanden
- keine Konto- oder Organisationsbeschränkung
- GitHub-Statusseite ohne aktuelle Actions-Störung

## Erneut ausführen

1. Pull Request #3 öffnen.
2. `Checks` oder `Actions` öffnen.
3. Workflow erneut starten.
4. Prüfen, ob `Check out repository` erscheint.
5. Erst ab dann den ersten roten Schritt als Repository-Fehler behandeln.

## Lokale Ersatzprüfung

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci

npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

Die aktuelle Validierung prüft unter anderem:

- Engine und Speicherung Version 7
- unabhängige Rollenverteilung und maximale Anzahl von sechs Impostern
- keine Kopplung der Rollen an die Aufdeckreihenfolge
- vollständigen Offline-Cache `secret-circle-v17`
- Live-Einrichtung, Karten-Sichtschutz und Wake Lock
- Datenschutz, Eingabesicherheit und Browserabläufe
- Rollen-, Inhalts- und Fuzz-Tests

Ein erfolgreicher lokaler Lauf ist ein starkes technisches Signal, ersetzt aber nicht den grünen GitHub-Actions-Nachweis auf dem endgültigen Commit.

## Tracking

- Issue #7: externer GitHub-Actions-Blocker
- Issue #8: reale Geräte-, Rollen- und Partytests

## Freigabeentscheidung

- lokaler Betatest nach erfolgreichem `npm run ci`: möglich
- Merge ohne grüne CI: nur bewusste Ausnahme, keine Produktionsfreigabe
- öffentlicher Release: blockiert, bis der endgültige Commit sichtbare und erfolgreiche Workflow-Schritte besitzt
