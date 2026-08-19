# Changelog

Alle nennenswerten Änderungen an Secret Circle werden hier dokumentiert.

## Unreleased – Januar-2027 Release Foundation

### Release-/A-bis-Z-Prozess

- Secret-Circle-spezifischen A-bis-Z-Masterprozess, operativen Tracker, Risk Register und Produkt-/UX-/Architektur-/Security-/Accessibility-/Beta-/Legal-/Support-/Incident-/Maintenance-/Environment-Verträge aufgebaut.
- `BRANCH_PROTECTION.md` + Contract-Audit definieren **`Secret Circle CI / validate`** als gewünschten normalen PR-Required-Check.
- Cross-Browser bleibt bei aktuellem `workflow_dispatch` separater RC-Gate.
- veralteten Foundation-Audit auf **Registry v2 / aktuelle Architektur / Lockfile / Branch / Staging / Privacy / Reference** erneuert.
- `scripts/release_readiness_contract_audit.py` als Querschnittsgate ergänzt.

### Core-Content / Privacy

- alle 15 priorisierten Core-Games auf quantitative Releaseziele gebracht.
- 15/15 erster manueller Core-Quellpass dokumentiert.
- persönliche Inhalte sichtbar freiwillig/überspringbar.
- v43: Kamerarollen- und Letzte-Nachricht-Prompt physisch aus `party-catalog.js` entfernt.
- `scripts/privacy_content_audit.py` scannt acht ausgelieferte Contentquellen und blockiert konkrete Private-Device-Offenlegungsaufforderungen.

### Reference-Safe-Content

- v36: Bluetooth → Funkverbindung, Oscar → Filmpreis, Formel 1 → Motorsport.
- v37/v40: `anime-guess` als **Anime-Archetypen erraten** mit 40 generischen Archetypen; frühere konkrete Figuren physisch entfernt.
- v38: unnötig konkrete olympisch/Grand-Slam-nahe Viral-Sportformulierungen neutralisiert.
- v39/v41: stabile ID `wavelength`, sichtbarer Titel upstream **Spektrum-Tipp**; Browser-Tabu `Tab` statt `Chrome`; `Löwenkönig` → `Löwe`; Classic Content v4.
- `scripts/reference_content_audit.py` scannt acht ausgelieferte Contentquellen.

### PWA / Assets

- v42: echtes `icon-192.png` 192×192 und echtes `icon-512.png` 512×512.
- Rasterableitung aus `icon.svg`, SHA-256, PNG-IHDR und Manifestgrößen werden geprüft.
- Root-SVG-Rechtebasis bleibt bewusst `unresolved`.
- aktueller Offline-Core v43 / v43-staging.

### Reproduzierbarer Build / Supply Chain

- **`package-lock.json` v3 hinzugefügt.**
- gelockt: `@playwright/test` 1.54.2, `playwright` 1.54.2, `playwright-core` 1.54.2, optional `fsevents` 2.3.2.
- Registry-URLs und `sha512`-Integrities festgehalten.
- Dependencygraph gegen offizielle Playwright-v1.54.2-/fsevents-v2.3.2-Tags geprüft.
- Lizenzen dokumentiert: Playwright-Pakete Apache-2.0, fsevents MIT.
- normaler CI- und Cross-Browser-Workflow auf `npm ci --ignore-scripts --no-audit --no-fund` plus npm-Cache umgestellt.
- `scripts/lockfile_contract_audit.py` ergänzt und in `npm run validate` integriert.
- lokaler Offline-`npm ci`-Strukturcheck akzeptierte Package-/Lock-Synchronität und scheiterte erst am fehlenden Tarballcache (`ENOTCACHED`).
- echter Online-`npm ci`-PASS bleibt bis funktionierendem Runner offen.

### HTTPS-Staging / Production-Smoke

- `scripts/staging_smoke.py` ergänzt.
- prüft echte HTTPS-Ressourcen, Same-Origin-Redirects, Größenlimits, Kernrouten, Manifest, PNG-Dimensionen, SW-Cache, Registry-Ladereihenfolge sowie Privacy-/Reference-Safe-Source-Verträge.
- `--expected-cache` bindet den Smoke an die erwartete Cachegeneration.
- `--production` verschärft öffentliche Placeholder-Prüfungen.
- `scripts/staging_smoke_contract_audit.py` in `npm run validate` integriert.
- reale Staging-/Production-Origin und Netzwerk-Smokes bleiben offen.

### Backup / Security

- Backup Registry v2 ist zentrale Quelle für Complete-Backup-Format, Größenlimits und erlaubte Storage-Key-Familien.
- `party-data-tools.js` konsumiert Registry-Werte statt Policy-Limits zu duplizieren.
- unbekannte `secret-circle-*`-Namespaces werden beim Complete-Import abgelehnt; vollständiges Löschen bleibt bewusst breit.

### Accessibility / Beta

- statischer Accessibility-Contract und Playwright-E2E-Basis vorhanden.
- reale Android-/iPhone-/Tablet-, VoiceOver-/TalkBack-/200-%-Zoom- und Gruppentests bleiben offen.

### Third Party / Legal

- gelockte Playwright-Paketkette vollständig inventarisiert.
- Asset-Provenienz-, Media-Inventar-, Reference-, Privacy- und Placeholder-Audits vorhanden.
- finale Rechtebasis des Root-SVGs, Betreiber-/Support-/Hostingangaben und manueller Visual-/Legal-Pass bleiben offen.

### CI / Build – realer Nachweis offen

- bisher geprüfte GitHub-Actions-`validate`-Jobs enden weiterhin vor Repository-Steps mit `steps: []`.
- deshalb sind Lockfile-/npm-ci-, v41–v43-, Foundation-/Readiness- und Browser-Gates noch nicht runner-verifiziert.
- der Repositoryvertrag ist jetzt auf Lockfile + `npm ci` umgestellt; nicht zurück auf ungesperrtes `npm install` wechseln, nur um CI kosmetisch grün zu bekommen.

### Release-Status

- PR #13 bleibt Draft und ungemergt.
- öffentlicher Release bleibt **NO_GO**, bis Online-`npm ci`, CI/Cross-Browser, echte Branch Protection, HTTPS-Staging, reale PWA-/Geräte-/Accessibility-/Gruppentests sowie Rechte-/Legal-/Support-Gates bestanden sind.
