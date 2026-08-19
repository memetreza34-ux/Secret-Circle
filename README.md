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

- `APP_ENTWICKLUNG_VON_A_BIS_Z.md`
- `APP_DEVELOPMENT_STATUS.md`
- `RELEASE_STATUS.md`
- `RELEASE_SCOPE_2027.md`
- `RELEASE_CHECKLIST.md`
- `BRANCH_PROTECTION.md`
- `CI_TROUBLESHOOTING.md`
- `PRODUCT_BRIEF.md`
- `USER_SCENARIOS.md`
- `MARKET_RESEARCH.md`
- `PLATFORM_STRATEGY.md`
- `REQUIREMENTS.md`
- `UX_FLOW.md`
- `DESIGN_SYSTEM.md`
- `ARCHITECTURE.md`
- `ENVIRONMENTS.md`
- `SECURITY.md`
- `THREAT_MODEL.md`
- `RISK_REGISTER.md`
- `BACKUP_SCHEMAS.md`
- `DEPLOYMENT.md`
- `CONTENT_AGE_POLICY.md`
- `CORE_CONTENT_REVIEW.md`
- `FAN_CONTENT_REVIEW.md`
- `THIRD_PARTY_NOTICES.md`
- `ACCESSIBILITY.md`
- `BETA_TEST_PLAN.md`
- `LEGAL_CHECKLIST.md`
- `SUPPORT.md`
- `INCIDENT_RESPONSE.md`
- `MAINTENANCE.md`

## Reference-, Privacy- und Asset-Hardening

### v36–v41 – Reference-Safe

- `Bluetooth` → `Funkverbindung`
- `Oscar` → `Filmpreis`
- `Formel 1` → `Motorsport`
- `anime-guess` → **Anime-Archetypen erraten**, 4 generische Packs / 40 Archetypen
- 40 frühere konkrete Anime-Figuren physisch aus `party-mega-catalog.js` entfernt
- drei konkrete olympisch/Grand-Slam-nahe Viral-Sportformulierungen neutralisiert
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

Die zwei früher identifizierten Private-Device-Truth/Dare-Prompts sind jetzt **physisch aus `party-catalog.js` entfernt**:

- Kamerarollen-Frage → `Welches Foto-Motiv findest du besonders lustig?`
- letzte Handy-Nachricht vorlesen → `Lies einen selbst erfundenen Satz wie einen dramatischen Theatermonolog vor.`

`scripts/privacy_content_audit.py` scannt acht ausgelieferte Built-in-Contentquellen auf konkrete Offenlegungsaufforderungen zu privaten Chats/Nachrichten, Fotos/Kamerarolle, Passwörtern, Adresse, Telefonnummer, Standort oder Kontodaten.

## Branch Protection

`BRANCH_PROTECTION.md` definiert den Zielvertrag:

- Pull Requests für stabilen Zielbranch
- **`Secret Circle CI / validate`** als Required Check
- keine Force-Pushes / Branch-Löschung gemäß finaler Konfiguration
- Review-/Bypass-Regeln prüfen
- Cross-Browser bleibt bei aktuellem `workflow_dispatch` ein separater RC-Gate und kein permanenter PR-Required-Check

Die tatsächliche GitHub-Konfiguration ist noch nicht belastbar bestätigt.

## HTTPS-Staging-Smoke

Neu vorbereitet:

- `scripts/staging_smoke.py`
- `scripts/staging_smoke_contract_audit.py`
- `npm run staging:smoke`

Staging-Beispiel:

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v43
```

Production nach finaler Freigabe:

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v43 --production
```

Der Smoke prüft echte ausgelieferte HTTPS-Ressourcen, Same-Origin-Redirects, Kernrouten, Manifest, reale PNG-Dimensionen, Cachegeneration sowie Privacy-/Reference-Source-Verträge. **Service-Worker-Installation, Offline-Neustart, Updates, lokale Daten und reale Geräte bleiben separate Browser-/PWA-Gates.**

## Backup- und Datenvertrag

`backup-schema-registry.js` ist Registry **v2**.

- maximale Backupdatei 1.500.000 UTF-8-Bytes
- nur registrierte Word-Imposter- und `secret-circle-party-*`-Key-Familien importierbar
- unbekannte Secret-Circle-Namespaces werden abgelehnt
- vollständiges Löschen entfernt bewusst alle `secret-circle-*`-Reste
- Registry wird vor `party-data-tools.js` geladen

## PWA und Offline

Aktuell:

- `secret-circle-v43`
- `secret-circle-v43-staging`

Updates werden zuerst vollständig in einem Staging-Cache vorbereitet und erst nach sichtbarer Nutzerentscheidung aktiviert. `ENVIRONMENTS.md` verlangt getrennte Origins für HTTPS-Staging und Production.

## Accessibility und Beta

Vorbereitet sind statische Accessibility-Verträge, Playwright-E2E-Basis und `BETA_TEST_PLAN.md` mit Android/iPhone/Tablet, VoiceOver/TalkBack, PWA-Upgrades, Rollback und realen Gruppen. Diese realen Abnahmen sind weiterhin offen.

## Third Party und Assetrechte

- keine npm-Runtime-Dependencies
- `@playwright/test` 1.54.2 upstream als Apache-2.0 verifiziert
- transitive Inventur wartet auf `package-lock.json`
- PNG-Iconableitung technisch belegt
- `icon.svg`: Repository-Herkunft dokumentiert, finale Rechtebasis noch `unresolved`
- keine Root-`LICENSE`; Projektlizenz wird nicht geraten

## Lokal starten

```bash
python -m http.server 8080
```

Qualitätsbefehle im Übergangszustand:

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci
```

Final vor Release muss ein echtes `package-lock.json` vorhanden sein und CI auf `npm ci` laufen.

## Aktuelle Blocker

- GitHub Actions: wiederholt `steps: []`, also kein Repository-Code ausgeführt
- echtes `package-lock.json` + `npm ci`
- Branch Protection / Required Checks tatsächlich bestätigen
- Privacy-/Reference-/Asset-/Staging-Contract-Audits auf funktionierendem Runner grün ausführen
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
