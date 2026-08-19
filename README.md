# Secret Circle Party Hub

Secret Circle ist eine **offline-first Partyspiel-Plattform für gemeinsame Spiele auf einem Gerät**. Der Januar-2027-Release priorisiert sichere private Übergaben, Wiederaufnahme nach Unterbrechungen, lokale Datenkontrolle, eigene Spiele und belastbare Release-Gates.

## Aktueller Funktionsumfang

- 45 eingebaute technisch spielbare Spiele
- 15 priorisierte Core-Games / 13 Extended / 17 Labs
- 27 Quick-, Trend- und Viral-Modi
- 4 Advanced-Kernspiele
- Word Imposter und Smart Party Night
- lokaler Spielerpool, Favoriten, Presets, Verlauf, Statistiken und Erfolge
- lokaler No-Code-Game-Creator mit 6 Vorlagen und bis zu 40 eigenen Spielen
- gespeicherte Filter und Synonym-/Tippfehlersuche
- gemeinsame Pause-/Skip-/Abbruch-/Replay-/Next-Game-Steuerung
- sichere Reload-Wiederaufnahme und pausierbare Timer
- installierbare Offline-PWA mit kontrollierter Aktualisierung
- kein verpflichtendes Konto, keine Analyse-, Werbe- oder Trackingdienste

„Technisch spielbar“ bedeutet **nicht automatisch releasefertig**.

## Releaseziel

- funktionsfertig bis **30. November 2026**
- Code Freeze **5. Dezember 2026**
- Release Candidate bis **15. Dezember 2026**
- öffentlicher Release **4.–15. Januar 2027**

Aktueller Offline-Core: **`secret-circle-v43`**.  
Classic Content: **v4**.  
Öffentliche Freigabe: **NO_GO**.

## A-bis-Z-Releasegrundlage

Zentrale Verträge sind unter anderem `APP_ENTWICKLUNG_VON_A_BIS_Z.md`, `APP_DEVELOPMENT_STATUS.md`, `RELEASE_STATUS.md`, `RELEASE_CHECKLIST.md`, `BRANCH_PROTECTION.md`, `CI_TROUBLESHOOTING.md`, `ARCHITECTURE.md`, `ENVIRONMENTS.md`, `SECURITY.md`, `RISK_REGISTER.md`, `DEPLOYMENT.md`, `CONTENT_AGE_POLICY.md`, `THIRD_PARTY_NOTICES.md`, `ACCESSIBILITY.md`, `BETA_TEST_PLAN.md`, `LEGAL_CHECKLIST.md`, `SUPPORT.md`, `INCIDENT_RESPONSE.md` und `MAINTENANCE.md`.

## Content-/Privacy-/Reference-Hardening

- v36–v41: unnötige konkrete Marken-/Franchise-/Eventreferenzen generisch ersetzt; `anime-guess` als **Anime-Archetypen erraten**, `wavelength` sichtbar als **Spektrum-Tipp**, Browser-Tabu `Tab`, Emoji-Quiz `Löwe`.
- v42: echte PWA-Rastericons 192×192 / 512×512 plus Hash/IHDR/Manifestvertrag.
- v43: bekannte Private-Device-Truth/Dare-Prompts physisch aus `party-catalog.js` entfernt.
- `privacy_content_audit.py` und `reference_content_audit.py` scannen jeweils acht ausgelieferte Contentquellen.

## Reproduzierbarer Build

Vorhanden:

- **`package-lock.json` v3**
- exakt gepinnt/gelockt: `@playwright/test`, `playwright`, `playwright-core` 1.54.2; optional `fsevents` 2.3.2
- feste Registry-URLs + `sha512`-Integrities
- Dependencygraph/Lizenzen gegen offizielle Upstream-Tags geprüft
- normaler CI- und Cross-Browser-Workflow verwenden **`npm ci`** und npm-Cache
- `scripts/lockfile_contract_audit.py` in `npm run validate`

Ein lokaler Offline-`npm ci`-Strukturcheck akzeptierte Package-/Lock-Synchronität und scheiterte erst am erwarteten fehlenden Tarballcache (`ENOTCACHED`). **Echter Online-`npm ci`-PASS auf Actions bleibt offen.**

## Validatorbasis

Die zentralen Validatoren sind auf den aktuellen Stand synchronisiert:

- `foundation_contract_audit.py`: Foundation v2 / Registry v2 / keine Backup-Policy-Duplikation
- `validate_project.py`: Lockfile v3 + aktuelle Releasegates
- `release_readiness_contract_audit.py`: Lockfile, Branch, Staging, Privacy, Reference, Assets und reale NO_GO-Gates

Zusätzlich laufen Lockfile-, Branch-, Staging-, Privacy-, Reference-, Asset-, Media- und Placeholder-Audits in `npm run validate`.

## Branch Protection

Gewünschter normaler Required Check: **`Secret Circle CI / validate`**. Cross-Browser bleibt bei aktuellem `workflow_dispatch` separater RC-Gate. Die tatsächliche GitHub-Konfiguration ist noch nicht belastbar bestätigt.

## HTTPS-Staging-Smoke

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v43
```

Production nach Freigabe:

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v43 --production
```

Der Smoke prüft echte HTTPS-Ressourcen, Same-Origin-Redirects, Kernrouten, Manifest, PNG-Dimensionen, Cachegeneration sowie Privacy-/Reference-Source-Verträge. Service-Worker-Installation, Offline-Neustart, Updates, lokale Daten und reale Geräte bleiben separate Browser-/PWA-Gates.

## Backup / PWA

- Backup Registry v2 ist zentrale Complete-Backup-Policy.
- unbekannte Secret-Circle-Namespaces werden beim Import abgelehnt.
- aktueller Cache: `secret-circle-v43` / `secret-circle-v43-staging`.
- staged update mit bewusster Nutzeraktivierung.

## Accessibility / Beta / Recht

Reale Android-/iPhone-/Tablet-, VoiceOver-/TalkBack-, 200-%-Zoom-, PWA-Upgrade-/Rollback- und Gruppentests bleiben offen. Ebenso Betreiber-/Support-/Hostingangaben, manueller Visual-/Legal-Pass und die finale Rechtebasis von `icon.svg`.

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

## Aktuelle Blocker

- GitHub Actions: bisher wiederholt `steps: []`, also kein Repository-Code ausgeführt
- echter Online-`npm ci`- und CI-Nachweis
- Branch Protection real bestätigen
- neue Audits auf funktionierendem Runner grün ausführen
- konkrete HTTPS-Staging-Origin + Netzwerk-Smoke
- finale Rechtebasis für `icon.svg`
- reale PWA-/Geräte-/Accessibility-/Gruppentests
- Betreiber-/Support-/Hostingangaben

## Freigabestatus

- öffentlicher Release: **NO_GO**
- PR #13: **Draft, nicht mergen**
- Releaseziel Januar 2027: weiter erreichbar, wenn die externen und realen Gates rechtzeitig geschlossen werden
