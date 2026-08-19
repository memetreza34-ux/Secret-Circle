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

## Zentrale A-bis-Z-Unterlagen

`APP_ENTWICKLUNG_VON_A_BIS_Z.md`, `APP_DEVELOPMENT_STATUS.md`, `RELEASE_STATUS.md`, `RELEASE_SCOPE_2027.md`, `RELEASE_CHECKLIST.md`, `BRANCH_PROTECTION.md`, `CI_TROUBLESHOOTING.md`, `ARCHITECTURE.md`, `ENVIRONMENTS.md`, `SECURITY.md`, `THREAT_MODEL.md`, `RISK_REGISTER.md`, `DEPLOYMENT.md`, `CONTENT_AGE_POLICY.md`, `CORE_CONTENT_REVIEW.md`, `FAN_CONTENT_REVIEW.md`, `THIRD_PARTY_NOTICES.md`, `ACCESSIBILITY.md`, `BETA_TEST_PLAN.md`, `LEGAL_CHECKLIST.md`, `SUPPORT.md`, `INCIDENT_RESPONSE.md` und `MAINTENANCE.md` bilden den aktuellen Releasevertrag.

## Reference-, Privacy- und Asset-Hardening

### v36–v41 – Reference-Safe

- `Bluetooth` → `Funkverbindung`
- `Oscar` → `Filmpreis`
- `Formel 1` → `Motorsport`
- `anime-guess` → **Anime-Archetypen erraten**, 4 generische Packs / 40 Archetypen
- frühere konkrete Anime-Figuren physisch aus `party-mega-catalog.js` entfernt
- konkrete olympisch/Grand-Slam-nahe Viral-Sportformulierungen neutralisiert
- `wavelength` bleibt stabile ID, sichtbarer Titel upstream **Spektrum-Tipp**
- Browser-Tabu enthält upstream `Tab` statt `Chrome`
- Emoji-Quiz enthält `Löwe` statt `Löwenkönig`
- `scripts/reference_content_audit.py` scannt acht ausgelieferte Contentquellen

### v42 – PWA-Assets

- echtes `icon-192.png` mit 192×192
- echtes `icon-512.png` mit 512×512
- Rasterableitung aus `icon.svg`
- SHA-256-, PNG-IHDR- und Manifestgrößenprüfung
- Root-SVG-Rechtebasis bleibt bewusst `unresolved`

### v43 – Privacy Source Hardening

Die zwei früher identifizierten Private-Device-Truth/Dare-Prompts sind physisch aus `party-catalog.js` entfernt und durch harmlose Texte ersetzt. `scripts/privacy_content_audit.py` scannt acht ausgelieferte Built-in-Contentquellen auf konkrete Offenlegungsaufforderungen zu privaten Chats/Nachrichten, Fotos/Kamerarolle, Passwörtern, Adresse, Telefonnummer, Standort oder Kontodaten.

## Reproduzierbarer Build

Neu vorhanden:

- **`package-lock.json`**, Lockfile v3
- exakt gepinnt: `@playwright/test` 1.54.2
- transitiv gelockt: `playwright` 1.54.2, `playwright-core` 1.54.2, optional `fsevents` 2.3.2
- feste npm-Registry-URLs und `sha512`-Integrities
- `scripts/lockfile_contract_audit.py`
- normaler CI- und Cross-Browser-Workflow verwenden **`npm ci`** und npm-Cache

Der Dependencygraph wurde gegen die offiziellen Playwright-/fsevents-Tags geprüft. Ein lokaler Offline-`npm ci`-Strukturcheck akzeptierte Package-/Lock-Synchronität und scheiterte erst am erwarteten fehlenden Tarballcache (`ENOTCACHED`).

**Noch offen:** echter Online-`npm ci`-PASS auf einem funktionierenden Runner. Deshalb wird der Build noch nicht als releaseverifiziert bezeichnet.

## Branch Protection

`BRANCH_PROTECTION.md` definiert den Zielvertrag:

- Pull Requests für stabilen Zielbranch
- **`Secret Circle CI / validate`** als Required Check
- keine Force-Pushes / Branch-Löschung gemäß finaler Konfiguration
- Review-/Bypass-Regeln prüfen
- Cross-Browser bleibt bei aktuellem `workflow_dispatch` separater RC-Gate

Die tatsächliche GitHub-Konfiguration ist noch nicht belastbar bestätigt.

## HTTPS-Staging-Smoke

Vorbereitet:

- `scripts/staging_smoke.py`
- `scripts/staging_smoke_contract_audit.py`
- `npm run staging:smoke`

Staging:

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v43
```

Production nach Freigabe:

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v43 --production
```

Der Smoke prüft echte ausgelieferte HTTPS-Ressourcen, Same-Origin-Redirects, Kernrouten, Manifest, reale PNG-Dimensionen, Cachegeneration sowie Privacy-/Reference-Source-Verträge. Service-Worker-Installation, Offline-Neustart, Updates, lokale Daten und reale Geräte bleiben separate Browser-/PWA-Gates.

## Backup- und Datenvertrag

`backup-schema-registry.js` ist Registry **v2**. Complete-Backup-Format, Grenzen und erlaubte Storage-Key-Familien sind dort zentral definiert. `party-data-tools.js` konsumiert diese Werte; unbekannte Secret-Circle-Namespaces werden beim Import abgelehnt, während vollständiges Löschen bewusst alle `secret-circle-*`-Reste entfernt.

## PWA und Offline

Aktuell:

- `secret-circle-v43`
- `secret-circle-v43-staging`

Updates werden zuerst vollständig in einem Staging-Cache vorbereitet und erst nach sichtbarer Nutzerentscheidung aktiviert. `ENVIRONMENTS.md` verlangt getrennte Origins für HTTPS-Staging und Production.

## Accessibility und Beta

Statische Accessibility-Verträge, Playwright-E2E-Basis und `BETA_TEST_PLAN.md` sind vorbereitet. Reale Android-/iPhone-/Tablet-, VoiceOver-/TalkBack-, 200-%-Zoom-, PWA-Upgrade-/Rollback- und Gruppentests bleiben offen.

## Third Party und Assetrechte

- keine npm-Runtime-Dependencies
- Playwright-Testkette vollständig im Lockfile inventarisiert
- Playwright-Pakete Apache-2.0; optionales `fsevents` MIT
- PNG-Iconableitung technisch belegt
- `icon.svg`: Repository-Herkunft dokumentiert, finale Rechtebasis noch `unresolved`
- keine Root-`LICENSE`; Projektlizenz wird nicht geraten

## Lokal / CI

Mit installierten Dependencies:

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

- GitHub Actions: wiederholt `steps: []`, also kein Repository-Code ausgeführt
- echter Online-`npm ci`- und CI-Nachweis
- Branch Protection / Required Checks tatsächlich bestätigen
- Privacy-/Reference-/Asset-/Lockfile-/Staging-Contract-Audits auf funktionierendem Runner grün ausführen
- konkrete HTTPS-Staging-Origin und echter Netzwerk-Smoke
- finale Rechtebasis für `icon.svg`
- manueller Extended/Labs-/Marketing-/Visual-Rechtepass
- reale PWA-Upgrade-/Rollback-/Gerätetests
- VoiceOver/TalkBack/200-%-Zoom
- reale Gruppentests
- Betreiber-/Support-/Hostingangaben

## Freigabestatus

- öffentlicher Release: **NO_GO**
- PR #13: **Draft, nicht mergen**
- Releaseziel Januar 2027: weiter erreichbar, wenn die externen und realen Gates rechtzeitig geschlossen werden
