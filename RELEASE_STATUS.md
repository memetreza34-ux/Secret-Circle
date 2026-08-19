# Release-Status – Secret Circle

Stand: 19. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13

## Gesamtstatus

**Phase:** Release-Härtung  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v44`**  
**Classic Content:** **v4**

Die technische Grundlage ist weit fortgeschritten. Core-Content, Exact-once-Sessions, sichere Resume-/Timerpfade, Registry-v2-Backups, source-level Privacy-/Reference-Schutz, PWA-Assets, Lockfile/npm-ci-Vertrag, Branch-Protection-Vertrag, HTTPS-Smoke und Accessibility-Basis sind vorbereitet.

## Neuester interner Stand

### Build / Supply Chain

- `package-lock.json` v3 vorhanden
- `@playwright/test`, `playwright`, `playwright-core` exakt 1.54.2
- optional `fsevents` 2.3.2
- Registry-URLs + `sha512`-Integrities
- keine npm-Runtime-Dependencies
- normaler CI und Cross-Browser verwenden `npm ci`
- `scripts/lockfile_contract_audit.py` in `npm run validate`

**Offen:** echter Online-`npm ci`-/Integrity-PASS auf einem funktionierenden Runner.

### v44 – PWA Installationsvertrag

Hub, Word Imposter, Creator, Advanced und Quick besitzen jetzt denselben Installations-Head-Vertrag:

- Manifest-Link
- Mobile-/Apple-Web-App-Metadaten
- Apple Statusbar + App-Titel
- SVG-Favicon
- 192×192-PNG-Favicon
- Apple-Touch-Icon
- CSP `manifest-src 'self'`

`tests/pwa-head-metadata.test.js` schützt den lokalen Source-Vertrag. `scripts/staging_smoke.py` prüft denselben Vertrag später gegen die tatsächlich ausgelieferten HTTPS-Seiten.

### Release Evidence

Neu:

- `release-evidence.json`
- `RELEASE_EVIDENCE.md`
- `scripts/release_evidence_audit.py`

Die Evidence-Akte ist aktuell absichtlich **PREPARED / NO_GO**. Ein späteres `GO` benötigt 15 Pflichtgates mit echten Belegen auf exakt demselben unveränderten RC-Commit.

## Content / Privacy / Reference

- quantitative Ziele aller 15 Core-Games erreicht
- 15/15 erster Core-Quellpass dokumentiert
- zwei frühere Private-Device-Truth/Dare-Prompts physisch aus `party-catalog.js` entfernt
- `scripts/privacy_content_audit.py` scannt acht ausgelieferte Contentquellen
- Anime-Figuren/unnötige Marken-/Eventreferenzen source-level generisch ersetzt
- `scripts/reference_content_audit.py` scannt acht ausgelieferte Contentquellen

Manueller finaler Extended/Labs-/Marketing-/Visual-/Rechtepass bleibt offen.

## PWA / Staging

- `secret-circle-v44`
- `secret-circle-v44-staging`
- staged update / bewusste Nutzeraktivierung
- `scripts/staging_smoke.py` für echtes HTTPS-Staging/Production vorbereitet

Offen: konkrete Staging-/Production-Origin, reale Altversion→v44-Upgrades, Rollback, Service-Worker-/Offline-/Installationsprüfung auf realen Geräten.

## Security / Backup

Registry v2 ist zentrale Complete-Backup-Vertragsquelle. Unbekannte Namespaces werden beim Import abgelehnt. SEC-F01/F02: **CLOSED IN CODE / REAL VERIFICATION OPEN**.

## Branch Protection

`BRANCH_PROTECTION.md` und Contract-Audit sind vorhanden. Gewünschter Required Check: **`Secret Circle CI / validate`**. Die tatsächliche GitHub-Einstellung ist weiterhin nicht bestätigt.

## CI – P0

Aktuellster vollständig geprüfter Lauf: **#2363** auf Head `81d26c7acc85c8ad6c4a20dcb1ea04128316291f`.

- `validate` = failure
- `steps: []`
- kein Checkout
- kein Online-`npm ci`
- kein Repository-Code ausgeführt

Damit sind die neuen v44-/Evidence-Verträge **implementiert, aber nicht runnerverifiziert**.

## Real offene Releasegates

1. Actions-Runner / echte Steps
2. Online-`npm ci` + vollständiges CI/Cross-Browser
3. Branch Protection tatsächlich aktiv
4. HTTPS-Staging + automatisierter und manueller PWA-Smoke
5. PWA Upgrade/Rollback auf real installierten Versionen
6. Android / iPhone / Tablet
7. VoiceOver / TalkBack / 200-%-Zoom
8. reale Gruppen/Beta
9. Root-`icon.svg`-Rechtebasis
10. finaler Visual-/Content-/Third-Party-Sign-off
11. Betreiber-/Hosting-/Privacy-/Support-/Legalangaben
12. Incident-Drill
13. unveränderter RC + Release Evidence FINAL/GO

## Releaseentscheidung

- öffentlicher Release: **NO_GO**
- PR #13 mergen: **Nein**
- PR #13 bleibt Draft: **Ja**