# Secret Circle Party Hub

Secret Circle ist eine **offline-first Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät**. Der Januar-2027-Release priorisiert sichere private Übergaben, Wiederaufnahme nach Unterbrechungen, lokale Datenkontrolle, eigene Spiele und belastbare Release-Gates.

## Aktueller Umfang

- 45 technisch spielbare Built-ins
- 15 Core / 13 Extended / 17 Labs
- 27 Quick-/Trend-/Viral-Modi
- 4 Advanced-Kernspiele
- Word Imposter + Smart Party Night
- lokaler Spielerpool, Favoriten, Presets, Verlauf, Statistiken und Erfolge
- lokaler No-Code-Game-Creator
- Offline-PWA ohne Pflichtkonto, Tracking, Werbung oder Cloudzwang

**Technisch spielbar ist nicht automatisch releasefertig.**

## Releaseziel

- funktionsfertig: 30. November 2026
- Code Freeze: 5. Dezember 2026
- RC: 15. Dezember 2026
- öffentlicher Release: 4.–15. Januar 2027

Aktueller Offline-Core: **`secret-circle-v44`** / `secret-circle-v44-staging`  
Classic Content: **v4**  
Freigabe: **NO_GO**

## A-bis-Z-Grundlage

Zentrale Verträge:

- `APP_ENTWICKLUNG_VON_A_BIS_Z.md`
- `APP_DEVELOPMENT_STATUS.md`
- `RELEASE_STATUS.md`
- `RELEASE_CHECKLIST.md`
- `RELEASE_EVIDENCE.md` / `release-evidence.json`
- `BRANCH_PROTECTION.md`
- `CI_TROUBLESHOOTING.md`
- `ARCHITECTURE.md`
- `ENVIRONMENTS.md`
- `DEPLOYMENT.md`
- `SECURITY.md` / `THREAT_MODEL.md`
- `CONTENT_AGE_POLICY.md` / `CORE_CONTENT_REVIEW.md`
- `THIRD_PARTY_NOTICES.md` / `FAN_CONTENT_REVIEW.md`
- `ACCESSIBILITY.md` / `BETA_TEST_PLAN.md`
- `LEGAL_CHECKLIST.md` / `SUPPORT.md` / `INCIDENT_RESPONSE.md` / `MAINTENANCE.md`

## Content / Privacy / Reference

- alle definierten quantitativen Core-Ziele erreicht
- 15/15 erster Core-Quellpass dokumentiert
- v36–v41: unnötige konkrete Marken-/Franchise-/Eventreferenzen generisch ersetzt
- `anime-guess` → **Anime-Archetypen erraten**
- stabile ID `wavelength` → sichtbar **Spektrum-Tipp**
- Browser-Tabu `Tab` statt `Chrome`
- Emoji-Quiz `Löwe` statt `Löwenkönig`
- v43: bekannte Kamerarollen-/Letzte-Nachricht-Prompts physisch aus `party-catalog.js` entfernt
- Privacy-/Reference-Audits scannen die ausgelieferten Contentquellen

## Build / Supply Chain

- `package-lock.json` v3 vorhanden
- `@playwright/test`, `playwright`, `playwright-core` exakt 1.54.2
- optional `fsevents` 2.3.2
- Registry-URLs + `sha512`-Integrities
- keine npm-Runtime-Dependencies
- CI und Cross-Browser verwenden `npm ci`
- `scripts/lockfile_contract_audit.py` schützt Package-/Lock-Synchronität und Dependencygraph

Ein echter Online-`npm ci`-/Integrity-PASS bleibt offen, solange GitHub Actions keinen Repository-Step startet.

## PWA v44

Die fünf interaktiven Einstiegseiten:

- `party.html`
- `index.html`
- `creator.html`
- `advanced.html`
- `quick-play.html`

verwenden denselben Manifest-/iOS-/Icon-Vertrag. `tests/pwa-head-metadata.test.js` schützt den Source-Stand; `scripts/staging_smoke.py` prüft dieselben Metadaten später gegen die **wirklich ausgelieferten HTTPS-Seiten**.

PWA-Assets:

- echtes `icon-192.png` 192×192
- echtes `icon-512.png` 512×512
- Hash-/IHDR-/Manifestprüfung
- Root-`icon.svg`-Rechtebasis weiterhin `unresolved`

## HTTPS-Staging / Production

Staging:

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v44
```

Production:

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v44 --production
```

Der HTTP-Smoke prüft HTTPS, Same-Origin-Redirects, Kernrouten, Manifest, reale PNG-Dimensionen, Cachegeneration, PWA-Head-Metadaten sowie Privacy-/Reference-Source-Verträge. Service-Worker-Installation, Offline-Neustart, Update/Rollback und reale Geräte bleiben separate Gates.

## Release Evidence

`release-evidence.json` ist aktuell **PREPARED / NO_GO**. Ein späteres `GO` benötigt 15 Pflichtgates mit realen Belegen auf exakt demselben unveränderten RC-Commit. `scripts/release_evidence_audit.py` verhindert einen unvollständigen GO-Zustand.

## CI – aktueller P0-Blocker

Zuletzt vollständig geprüft: Run **#2363** auf Head `81d26c7acc85c8ad6c4a20dcb1ea04128316291f`.

- `validate` = failure
- `steps: []`
- kein Checkout
- kein Online-`npm ci`
- kein Repository-Code ausgeführt

Daher sind die neuen Verträge implementiert, aber nicht runnerverifiziert.

## Lokal / CI

```bash
npm ci --ignore-scripts --no-audit --no-fund
npx playwright install --with-deps chromium
npm run ci
```

Cross-Browser:

```bash
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

## Real offene Gates

- Actions-Runner / echter CI-Lauf
- Branch Protection tatsächlich aktivieren/bestätigen
- konkrete HTTPS-Staging-/Production-Origin
- PWA Upgrade/Rollback
- Android / iPhone / Tablet
- VoiceOver / TalkBack / 200-%-Zoom
- reale Gruppen/Beta
- Root-SVG-Rechte und finaler Third-Party-/Visual-Sign-off
- Betreiber-/Hosting-/Privacy-/Support-/Legalangaben
- Incident-Drill
- finaler unveränderter RC mit `release-evidence.json = FINAL / GO`

**PR #13 bleibt Draft und wird nicht gemergt.**