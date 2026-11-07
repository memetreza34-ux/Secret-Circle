# Secret Circle – CI Troubleshooting

Stand: 29. August 2026

## 7. November 2026 – Browserinstallation auf Ubuntu 26.04 blockiert

Die Pflichtläufe [CI #42378099065](https://github.com/memetreza34-ux/Secret-Circle/actions/runs/42378099065) und [Smoke #42378099069](https://github.com/memetreza34-ux/Secret-Circle/actions/runs/42378099069) auf `c779f26` erreichten Checkout und `npm ci`, scheiterten aber bei `playwright install --with-deps`. `ubuntu-latest` lieferte Ubuntu 26.04.1; Playwright 1.54.2 meldete ausdrücklich, dass diese Plattform nicht unterstützt wird. Die App-Tests wurden in diesen Jobs nicht ausgeführt.

Alle drei Browser-Testjobs verwenden deshalb das feste Label `ubuntu-24.04`. Diese Plattform ist im [versionsgebundenen Playwright-Plattformvertrag](https://github.com/microsoft/playwright/blob/v1.54.2/packages/playwright-core/src/server/utils/hostPlatform.ts) unterstützt und als [GitHub-Runnerlabel verfügbar](https://docs.github.com/en/actions/reference/runners/github-hosted-runners). Paketversionen, Installationsbefehle, Tests, Zeitlimits und Pflichtcheck-Namen bleiben erhalten. Erst der neue tatsächliche CI-Lauf belegt, ob Installation und anschließende Prüfungen erfolgreich sind.

## Windows-Prüfung vom 7. November 2026 – aktueller Bild-/UX-Zwischenstand

- `npm ci --ignore-scripts --no-audit --no-fund`, `npm run check`, `npm test` und sämtliche Audits aus `npm run validate` bestanden. Unter Windows wurde derselbe Audit-Befehl mit `python` statt dem nicht verfügbaren Alias `python3` ausgeführt.
- Die UX-Regressionen sind in 80 gezielten Chromium-/WebKit-Desktop-/Handyfällen abgedeckt: 68 bestanden im ersten Lauf; die zwölf neuen Ergebnisfälle bestanden nach Korrektur eines ungültigen Test-Wortvorrats vollständig. Der separate responsive Bildlauf bestand zuvor mit 55 Fällen direkt und einem Fall nach Wiederholung. Das sind begrenzte lokale Nachweise, kein vollständiger aktueller CI-PASS.
- Ein erster Gesamtlauf mit vier Workern wurde nach Zeitüberschreitungen beim Anlegen leerer Browserseiten gestoppt. Ein zweiter mit den bestehenden CI-Zeitlimits und zwei Workern wurde nach 875 von 1.614 Fällen und sechs dauerhaft roten Fällen beendet. Der Rechner hat vier CPUs und 8 GB RAM; während des Laufs waren häufig nur etwa 0,4 GB frei. **Beide abgebrochenen Läufe sind kein PASS.**
- Die sechs Diagnosefälle betreffen Bildladen bei 320 CSS-Pixeln, Offline-Katalognavigation, einen Offline-Creator-Start, den zeitabhängigen Tabu-Neuladetest sowie zwei WebKit-Navigations-/Fokusfälle. Ihre Ursache ist noch nicht als Produkt- oder Umgebungsfehler abgegrenzt.
- Ein weiterer vollständiger lokaler Lauf schreibt Artefakte außerhalb des OneDrive-Verzeichnisses und zeichnet keine Videos auf. Screenshots, Traces, Assertions, Browserprofile, CI-Zeitlimits und Wiederholungsregeln bleiben erhalten. Dieser Lauf ist beim Sichern des Zwischenstands noch unvollständig; auch dort ist ein Startfall von Gegenstandsjagd in ein Zeitlimit gelaufen.
- Die unveränderten App-Dateien werden im Testserver aus einem Speicher-Snapshot ausgeliefert. Offline-Core v109: `916522350e77d61d022fdcb9cef226b3c28713c0bcf0e62a4177e2aaa11289c8`. Vollständige Pflicht-CI auf dem neuen PR-Commit, isolierte Nachprüfung aller roten Fälle, unabhängiges Review und reale Geräte-/Gruppentests bleiben erforderlich. PR #69 ist bis dahin Draft; Release bleibt **NO_GO**.

## Update 5./6. September 2026 – Runner-Blocker behoben

Der unten beschriebene Pre-Step-/Runner-Ausfall (`steps: []`, `runner_id: 0`) ist seit dem 5. September 2026 nicht mehr reproduzierbar. Der Hosted Runner führt Checkout, Setup, `npm ci`, Python-Audits und Node-Tests real aus. `npm test` und `npm run validate` sind auf GitHub Actions grün; seit dem 25. September 2026 laufen auch die Browser-Tests vollständig durch, aufgeteilt auf die Jobs `validate` (Chromium) und `e2e-webkit` (siehe `RELEASE_STATUS.md`). Der folgende historische Befund bleibt als Nachweis stehen, beschreibt aber nicht mehr den aktuellen Zustand.

## Aktueller Befund (historisch, bis 29. August 2026)

Die geprüften GitHub-Actions-Jobs erreichen weiterhin **keinen Workflow-Schritt**. Der aktuelle v64-Nachweis bestätigt das Problem erneut auf dem aktiven Release-Foundation-Branch.

### Frisch bestätigter v64-Lauf

**Secret Circle CI – Run #3608**

- Run-ID `33253663445`
- Job-ID `99103557030`
- Head `2297868e1f65b45753294151a3b1f401a55f6288`
- Branch `agent/release-foundation-2027`
- `completed / failure`
- `steps: []`
- `runner_id: 0`
- `runner_name: ""`
- requested label `ubuntu-latest`
- kein Checkout / Node-/Python-Setup / npm / Test / Playwright / Repositorycode ausgeführt

Damit ist der frühere v49-Befund nicht mehr nur historisch: **derselbe Pre-Step-/Runner-Ausfall ist auf v64 erneut reproduziert.**

**v50–v64 besitzen weiterhin keinen echten Hosted-Runner-PASS.**

## Historischer Vergleich

Der frühere vollständig untersuchte App-CI-Lauf war **v49 Run #2787** auf Head `a9ad91389ff9e966af432b0a77103ddc0960709d`:

- Run-ID `32871536761`
- Job-ID `97879489858`
- `completed / failure`
- `steps: null` / `steps: []`
- kein Repositorycode ausgeführt

Der aktuelle v64-Lauf #3608 zeigt dasselbe Grundmuster und stärkt damit die Einordnung als Problem **vor** Repository-Schritten.

## Isolierter Hosted-Runner-Probe

Der temporäre `Secret Circle Runner Probe` enthielt keinen Checkout, keine Setup-Action und keine Dependencyinstallation, sondern nur lokalen Bash-Code (`echo`, `uname -a`).

Run #7: Head `a9f2591a5280ec67b9042df8ff636019c7c6149a`, Run-ID `32650097848`, Job-ID `97220210640`, `steps: []`. Selbst dieser lokale Bash-Schritt startete nicht.

Damit sind Checkout, Node/Python-Setup, `npm ci`, Playwright und Secret-Circle-Code als **unmittelbare Ursache dieses Pre-Step-Fehlers** ausgeschlossen. Die exakte externe Ursache ist nicht bewiesen. Prüfflächen bleiben Hosted-Runner-Zuteilung, Account/Billing/Budget, Repo-/Org-/Enterprise-Policy und GitHub-seitige Runner-Störung.

## Aktueller Buildvertrag – v64

Zentrale Release-Metadaten: `release-meta.json`.

- Source-Generation `v64`
- Offline-Core `secret-circle-v109` / `secret-circle-v109-staging`
- 55 Built-ins · 15 Core / 13 Extended / 27 Labs
- Expansion Wave 1: 10/10 quellsseitig implementiert
- v50 Hub Resume Loader fail-closed
- v51 Complete Backup Registry v2
- v52 Safe Hub Current
- v53 Paranoia Resume/Privacy
- v54 PT54 Pre-Timer Resume
- v55 Advanced Integrity
- v56 Quick Session Replacement
- v57 promptfreier Quick-Family-Timer-Store + Restzeit-Resume
- v58 BFCache-Restore-Schutz
- v59 Hidden Auto-Pause ohne Auto-Resume
- v60 `party-session-controls.js` Version 5 / HS60 Hidden Snapshot Durability
- v61 Quiz-Familie
- v62 Imposter-Familie
- v63 Writing-Familie
- v64 Wave 1 komplett
- `quick-loader.js` v11
- `party-release-structure.js` v5
- Unit-/E2E-/Audit-Verträge für Wave-1-Familien vorhanden
- `package-lock.json` v3
- Playwright 1.54.2 exakt
- CI/Cross-Browser verwenden `npm ci`

Ein echter Online-`npm ci`-PASS bleibt offen, weil Actions Step 1 nicht erreicht.

## Workflow-Befund

Die Repository-Workflowdefinition selbst fordert einen normalen GitHub-hosted Runner (`ubuntu-latest`) an und enthält die erwartete Kette aus Checkout, Node/Python-Setup, `npm ci`, Playwright-Installation und Projektgates.

Da Run #3608 bereits **vor einem einzigen Step** mit `runner_id: 0` endet, gibt es aktuell keinen Beleg dafür, dass eine Änderung an App-Code, Testcode oder Dependencyinstallation diesen Fehler beheben würde.

## Was nicht auf Verdacht geändert wird

- keine Tests/Audits deaktivieren
- kein `continue-on-error` für Pflichtgates
- Checkout nicht umgehen
- Required Checks nicht künstlich grün markieren
- nicht auf ungesperrtes `npm install` zurückgehen
- keine Featureänderungen als vermeintliche Runner-Reparatur
- keine Self-hosted-Runner-Scheinlösung nur zur Umgehung eines ungeklärten Account-/Policy-Problems

## Externe Prüfflächen – Priorität

1. persönliche `Settings → Billing and licensing` → Actions-Nutzung/Budget/Spending
2. Repository `Settings → Actions → General`
3. Actions-Erlaubnis für private Repositories
4. GitHub-hosted-Runner-Erlaubnis
5. Account-/Org-/Enterprise-Regeln
6. Zahlungs-/Budgetstatus
7. GitHub Status für Actions-/Runner-Störungen

### Erfolgskriterium der externen Reparatur

Der nächste Testlauf muss mindestens:

- einen Runner zugewiesen bekommen (`runner_id != 0`)
- einen nicht-leeren Runner-Namen zeigen
- `Check out repository` als sichtbaren Step enthalten

Erst **danach** beginnt repositoryseitige CI-Diagnostik.

## Wenn der Runner wieder echte Steps zeigt

1. exakten Commit notieren
2. Checkout bestätigen
3. Online-`npm ci --ignore-scripts --no-audit --no-fund`
4. `npm run check`
5. `npm test`
6. `npm run validate` inklusive Spezialgates bis HS60, Wave-1-, Backup-, A11y-, Architecture-, Operator- und Release-Audits
7. Chromium E2E einschließlich Timer-/Lifecycle- und Wave-1-Verträge
8. vollständiges `npm run ci`
9. Chromium + Firefox + WebKit auf demselben Commit
10. unveränderten RC vollständig retesten
11. erst danach Branch Protection und Release Evidence real auf PASS setzen

## Release-Regel

Ein Workflow mit `steps: []` und `runner_id: 0` zählt weder als PASS noch als negativer Code-Test.

**Öffentlicher Release und Merge von PR #13 bleiben NO_GO**, bis ein echter Hosted Runner den unveränderten RC vollständig ausgeführt hat.
