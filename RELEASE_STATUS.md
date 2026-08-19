# Release-Status – Secret Circle

Stand: 19. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13

## Gesamtstatus

**Phase:** Release-Härtung  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v43`**  
**Classic Content:** **v4**

Die technische Grundlage ist weit fortgeschritten. Reference-/Privacy-Safe-Verträge liegen source-level vor; PWA-Icondimensionen sind gehärtet; Branch-Protection- und HTTPS-Staging-Verträge sind vorbereitet; **`package-lock.json` v3 ist vorhanden und beide Workflows verwenden `npm ci`.**

Nicht abgeschlossen sind echter Online-CI-/`npm ci`-Nachweis, tatsächliche Branch Protection, konkrete HTTPS-Staging-/Production-Origin, reale Device-/PWA-/Accessibility-/Gruppentests, Rechtebasis des Root-SVG-Icons, manuelle visuelle/rechtliche Restabnahme sowie Betreiber-/Supportangaben.

## Build / Supply Chain

Im Repositoryvertrag abgeschlossen:

- `package-lock.json` v3
- `@playwright/test` / `playwright` / `playwright-core` exakt 1.54.2
- optional `fsevents` 2.3.2
- feste Registry-URLs und `sha512`-Integrities
- Dependencygraph gegen offizielle Upstream-Tags geprüft
- Playwright-Pakete Apache-2.0, fsevents MIT
- normaler CI- und Cross-Browser-Workflow auf `npm ci --ignore-scripts --no-audit --no-fund`
- `scripts/lockfile_contract_audit.py` in `npm run validate`

Offline-`npm ci` akzeptierte Package-/Lock-Synchronität und scheiterte erst am fehlenden lokalen Tarballcache (`ENOTCACHED`). **Echter Online-`npm ci`-PASS bleibt offen.**

## Audit-Härtung

- `scripts/foundation_contract_audit.py` auf aktuellen **Foundation-v2-Vertrag** umgestellt; historische Registry-v1-/Hardcode-Annahmen entfernt.
- `scripts/validate_project.py` verlangt Registry v2, Lockfile v3 und aktuelle Querschnittsaudits.
- `scripts/release_readiness_contract_audit.py` verbindet Lockfile, Branch Protection, HTTPS-Staging, Privacy, Reference, Assets und reale NO_GO-Gates.

Status dieser Audits: **IMPLEMENTED / RUNNER VERIFICATION OPEN**.

## Reference / Privacy / Assets

- v36–v41: Reference-Safe-Source-Pass
- v42: echte 192×192-/512×512-PWA-Rastericons plus Hash/IHDR/Manifestvertrag
- v43: bekannte Private-Device-Prompts physisch aus `party-catalog.js` entfernt
- Privacy-/Reference-Audits scannen acht ausgelieferte Contentquellen
- Root-SVG-Rechtebasis bleibt `unresolved`

## Branch Protection

Vorbereitet: `BRANCH_PROTECTION.md`, Contract-Audit und gewünschter Required Check **`Secret Circle CI / validate`**. Cross-Browser bleibt bei aktuellem `workflow_dispatch` separater RC-Gate.

Die tatsächliche GitHub-Einstellung ist **nicht belastbar bestätigt**.

## HTTPS-Staging / Production-Smoke

Vorbereitet: `scripts/staging_smoke.py`, Contract-Audit und `npm run staging:smoke`.

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v43
```

Production später zusätzlich mit `--production`.

Noch offen: reale Staging-/Production-Origin und echte Netzwerkausführung. Browser-only PWA-/Offline-/Update-/Geräteverhalten bleibt separat zu testen.

## Security / Backup

Registry v2 ist zentrale Complete-Backup-Vertragsquelle. `party-data-tools.js` konsumiert Format/Grenzen aus der Registry; unbekannte Namespaces werden beim Import abgelehnt. SEC-F01/F02: **CLOSED IN CODE / REAL VERIFICATION OPEN**.

## PWA / Offline

- `secret-circle-v43`
- `secret-circle-v43-staging`
- staged update / bewusste Nutzeraktivierung

Offen: reale Altversion→v43-Upgrades, iOS/Android-PWA, Rollback, Installationsicon und Sperrbildschirmtests.

## Accessibility / Beta

Verträge und E2E-Basis sind vorbereitet. Real offen: 200-%-Zoom, VoiceOver, TalkBack, echte Touchbedienung, private Reveal-Smokes und reale Gruppen.

## CI – P0

`CI_TROUBLESHOOTING.md` führt den jeweils aktuellen Actions-Befund. Bisher enden geprüfte `validate`-Jobs wiederholt mit `steps: []`; der neue Lockfile-/`npm ci`-/Validator-Stand wurde deshalb noch nicht von Actions ausgeführt.

## Nächste Releaseblöcke

1. Actions-Runner / echter Checkout + sichtbare Steps
2. Online-`npm ci` + `npm run ci` auf unverändertem Commit
3. Branch Protection / Required Checks tatsächlich bestätigen
4. neue Querschnittsaudits tatsächlich grün ausführen
5. konkrete HTTPS-Staging-Origin + echter Netzwerk-Smoke
6. Rechtebasis für `icon.svg`
7. manueller Extended/Labs-/Marketing-/Visual-Rechtepass
8. reale Upgrade-/Rollback-/Gerätetests
9. reale Accessibilitytests
10. reale Gruppentests
11. Betreiber-/Supportdaten
12. Incident-Drill
13. unveränderter RC + Tag

## Releaseentscheidung

- öffentlicher Release heute: **Nein**
- PR #13 mergen: **Nein**
- PR #13 bleibt Draft: **Ja**
- Januar-2027-Ziel: weiterhin erreichbar, sofern die offenen externen und realen Gates geschlossen werden
