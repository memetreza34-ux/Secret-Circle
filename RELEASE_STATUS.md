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

Die technische Grundlage ist weit fortgeschritten. Reference-/Privacy-Safe-Verträge liegen source-level vor; PWA-Icondimensionen sind technisch gehärtet; Branch-Protection- und HTTPS-Staging-Verträge sind reproduzierbar vorbereitet; **`package-lock.json` v3 ist jetzt vorhanden und beide Workflows verwenden `npm ci`.**

Nicht abgeschlossen sind echter Online-CI-/`npm ci`-Nachweis, tatsächliche Branch Protection, konkrete HTTPS-Staging-/Production-Origin, reale Device-/PWA-/Accessibility-/Gruppentests, Rechtebasis des Root-SVG-Icons, manuelle visuelle/rechtliche Restabnahme sowie Betreiber-/Supportangaben.

## Build / Supply Chain

Neu abgeschlossen im Repositoryvertrag:

- `package-lock.json` v3
- `@playwright/test` 1.54.2
- `playwright` 1.54.2
- `playwright-core` 1.54.2
- optional `fsevents` 2.3.2
- Registry-URLs und `sha512`-Integrities festgehalten
- Dependencygraph gegen offizielle Upstream-Tags geprüft
- Lizenzen: Playwright-Pakete Apache-2.0, fsevents MIT
- normaler CI- und Cross-Browser-Workflow auf `npm ci --ignore-scripts --no-audit --no-fund`
- `scripts/lockfile_contract_audit.py` in `npm run validate`

Lokaler Offline-`npm ci`-Strukturcheck akzeptierte Package-/Lock-Synchronität und scheiterte erst am fehlenden Tarballcache (`ENOTCACHED`).

**Noch offen:** echter Online-`npm ci`-PASS auf unverändertem Commit. R-002 ist daher **CLOSED IN CODE / ONLINE VERIFICATION OPEN**.

## Audit-Härtung

Der veraltete Foundation-Audit mit Registry-v1-/Hardcode-Annahmen wurde durch einen aktuellen Foundation-v2-Vertrag ersetzt. Zusätzlich verbindet `scripts/release_readiness_contract_audit.py` die Querschnittsgates für Lockfile, Branch Protection, HTTPS-Staging, Privacy, Reference, Assets und reale Release-Nachweise.

## Reference / Privacy

- v36–v41: Reference-Safe-Source-Pass
- v42: echte 192×192-/512×512-PWA-Rastericons plus Hash/IHDR/Manifestvertrag
- v43: bekannte Private-Device-Prompts physisch aus `party-catalog.js` entfernt
- `privacy_content_audit.py` und `reference_content_audit.py` scannen acht ausgelieferte Contentquellen

## Branch Protection

Vorbereitet:

- `BRANCH_PROTECTION.md`
- `scripts/branch_protection_contract_audit.py`
- gewünschter Required Check **`Secret Circle CI / validate`**
- Cross-Browser bleibt bei aktuellem `workflow_dispatch` separater RC-Gate
- Lockfile/`npm ci` sind im technischen Vertrag jetzt aktiv

Die tatsächliche GitHub-Einstellung ist **nicht belastbar bestätigt**.

## HTTPS-Staging / Production-Smoke

Vorbereitet:

- `scripts/staging_smoke.py`
- `scripts/staging_smoke_contract_audit.py`
- `npm run staging:smoke`

Staging:

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
- Offline-Core und Iconvertrag vorbereitet

Offen: reale Altversion→v43-Upgrades, iOS/Android-PWA, Rollback, Installationsicon und Sperrbildschirmtests.

## Accessibility / Beta

Verträge und E2E-Basis sind vorbereitet. Real offen: 200-%-Zoom, VoiceOver, TalkBack, echte Touchbedienung, private Reveal-Smokes und reale Gruppen.

## Legal / Third Party / Betrieb

Noch real offen:

- Betreiber-/Kontakt-/Hostingangaben
- menschliche Rechtebestätigung für `icon.svg`
- manueller Extended/Labs-/Marketing-/Visual-Rechtepass
- Support-/Incident-Verantwortliche
- konkrete Staging-/Production-Origin
- finaler Vulnerability-/Installationsnachweis der gelockten Dev-Pakete vor RC

## CI – P0

Der jeweils aktuelle Befund wird zentral in `CI_TROUBLESHOOTING.md` geführt. Bisher wiederholt: Job `validate` endet mit `steps: []`, also kein Checkout und kein Repository-Code.

Der neue Lockfile-/`npm ci`-Stand wurde deshalb noch **nicht** von Actions ausgeführt.

## Nächste Releaseblöcke

1. Actions-Runner / echter Checkout + sichtbare Steps
2. Online-`npm ci` + `npm run ci` auf unverändertem Commit
3. Branch Protection / Required Checks tatsächlich bestätigen
4. Lockfile-/Privacy-/Reference-/Asset-/Branch-/Staging-Contract-Audits tatsächlich grün
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
