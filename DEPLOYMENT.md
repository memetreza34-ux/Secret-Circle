# Secret Circle Party Hub – Deployment und Rollback

Stand: 19. August 2026

Secret Circle wird für Januar 2027 als statische Offline-first-PWA veröffentlicht. Eine installierbare PWA benötigt HTTPS; `localhost` ist nur für lokale Entwicklung eine Ausnahme.

## Aktueller Releaseumfang

- 45 eingebaute technisch spielbare Spiele
- 15 priorisierte Kernspiele
- 13 Extended-Spiele
- 17 Labs-Spiele
- 27 Quick-/Trend-/Viral-Modi
- 4 Advanced-Kernspiele
- Word Imposter
- Smart Party Night
- lokaler No-Code-Game-Creator mit sechs Vorlagen
- bis zu 40 selbst erstellte Spiele
- aktueller Offline-Core: **`secret-circle-v44`**
- Release-PR: **Draft-PR #13** auf `agent/release-foundation-2027`

## Deployment-Reihenfolge

1. lokale Entwicklung
2. CI/Test
3. HTTPS-Staging/Preview
4. Release Candidate auf unverändertem Commit
5. Production

Production darf nicht der erste echte HTTPS-/Service-Worker-Test eines Release Candidates sein.

## Voraussetzungen vor Production

### Build und Repository

- unveränderter Release-Commit festgelegt
- `package-lock.json` vorhanden und mit `package.json` synchron
- Installation über `npm ci` reproduzierbar
- `npm run ci` auf exakt diesem Commit grün
- `npm run test:cross-browser` auf exakt diesem Commit grün
- GitHub Actions zeigt echten Checkout und echte Steps; `steps: []` zählt nicht
- `BRANCH_PROTECTION.md` abgearbeitet
- `Secret Circle CI / validate` als Required Check auf echtem Runner bestätigt

### Produkt und Content

- alle 15 Kernspiele bestehen `CORE_GAME_ACCEPTANCE.md`
- Scoring-/Winner-Vertrag bestätigt
- quantitative Core-Content-Gates erfüllt
- 15/15 Core-Quellreview dokumentiert
- `anime-guess` liefert 40 eigenständige Archetypen und `party-mega-catalog.js` enthält die früheren konkreten Figuren physisch nicht mehr
- `party-expansion.js` liefert `Spektrum-Tipp` und Browser-Tabu mit `Tab` direkt upstream
- Emoji-Quiz nutzt `🦁🌾 → Löwe` statt `Löwenkönig`
- Viral-`higher-lower` enthält die generischen Sportfragen aus v38
- `party-catalog.js` enthält die beiden früher problematischen Private-Device-Truth/Dare-Prompts seit v43 physisch nicht mehr
- Privacy-/Reference-Content-Audits auf dem RC-Commit grün
- übrige Extended/Labs final manuell/visuell/rechtlich geprüft
- keine offenen kritischen/hohen Releasefehler

### PWA-Installationsmetadaten / Assets

Seit v44 müssen `party.html`, `index.html`, `creator.html`, `advanced.html` und `quick-play.html` denselben Installationsvertrag erfüllen:

- Manifest-Link
- `mobile-web-app-capable=yes`
- Apple-Web-App-Capable, Statusbar und Titel
- SVG-Favicon
- 192×192-PNG-Favicon
- Apple-Touch-Icon
- CSP mit `manifest-src 'self'`

Zusätzlich:

- `icon-192.png` existiert und ist exakt 192×192
- `icon-512.png` existiert und ist exakt 512×512
- beide Rasterdateien sind aus `icon.svg` abgeleitet
- `assets/manifests/asset-provenance.json` enthält SHA-256 und Ableitungsnachweis
- Asset-/Media-/PWA-Head-Audits bzw. Tests grün
- finale Rechtebasis von `icon.svg` menschlich bestätigt

### Geräte und Accessibility

- reales Android-Smartphone
- reales iPhone
- mindestens ein Tablet
- PWA-Installation, Standalone und Offline-Neustart
- Sperrbildschirm/OS-Hintergrund bei Timern
- Tastatur, Fokus, 200-%-Zoom/Reflow, Reduced Motion
- VoiceOver-/TalkBack-Smoke-Test

### Daten und PWA

- Offline-Start aus **`secret-circle-v44`** bestätigt
- `backup-schema-registry.js` vor `party-data-tools.js` geladen
- Base-, Expansion-, Mega-, Viral- und beide Core-Contentmodule offline verfügbar
- `icon.svg`, `icon-192.png` und `icon-512.png` offline verfügbar
- Update von mindestens zwei älteren installierten Versionen geprüft
- aktive Session über kontrolliertes Update wiederherstellbar
- Export/Import/Löschung geprüft
- Complete-Import lehnt unbekannte Storage-Key-Familien ab
- Quota-/Korruptions-/Rollbackpfade geprüft

### Recht und Betrieb

- `LEGAL_CHECKLIST.md` abgearbeitet
- Betreiber-/Kontakt-/Hostingangaben final
- Datenschutz auf tatsächliches Hosting angepasst
- `THIRD_PARTY_NOTICES.md` / `FAN_CONTENT_REVIEW.md` final
- Asset-Provenienz ohne `unresolved` Releaseassets
- Privacy-/Reference-/Placeholder-Audits grün
- echter Supportweg und Incident-/Hotfixprozess vorhanden

## Automatisierter HTTPS-Staging-Smoke

Vor dem manuellen Browser-/PWA-Smoke muss die tatsächlich ausgelieferte Staging-Origin den reproduzierbaren HTTP-Smoke bestehen:

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v44
```

Der Smoke (`scripts/staging_smoke.py`) prüft:

- ausschließlich HTTPS
- Same-Origin für Redirectziele
- Größenlimits für geladene Ressourcen
- Kernseiten und Query-Routen HTTP 200
- Manifest-/Standalone-Vertrag
- reale PNG-Dimensionen 192×192 und 512×512
- Service-Worker-Cache und Staging-Cache
- Backup-Registry vor Datentools
- physische v43-Privacy-Safe-Inhalte
- physische Reference-Safe-Inhalte aus v38–v41

`scripts/staging_smoke_contract_audit.py` ist Teil von `npm run validate` und schützt diesen Vertrag statisch. Die echte Netzwerkprüfung läuft dagegen nur gegen eine konkrete Deployment-URL.

## Manueller Staging-/PWA-Smoke

Der automatisierte HTTP-Smoke ersetzt nicht:

- Service Worker registriert
- App installierbar
- Installation von Hub **und mindestens einer Unterseite** mit korrektem Secret-Circle-Titel/Icon
- Offline-Neustart
- Updatebanner und bewusste Aktivierung
- aktive Session während Update
- lokale Daten nach Update erhalten
- Hub-Datenbereich und Registry im echten Browser
- Export/Import
- Core-/Timer-/Advanced-/Word-Imposter-/Creator-Smokes
- reale Installationsicons
- Geräte-/Screenreaderprüfung

## Production-Smoke-Test

Production erhält denselben freigegebenen RC-Stand. Zuerst:

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v44 --production
```

Danach Browser-/PWA-Smoke auf Production wiederholen. `--production` verschärft zusätzlich die Prüfung auf typische Placeholderwerte in öffentlichen Dateien.

### Katalog und Privacy

Online und offline müssen denselben finalen Katalogpfad liefern:

`party-catalog → expansion → trending → mega → viral → core-release → core-classic(v4) → routing`

Zu bestätigen:

- `anime-guess` → **Anime-Archetypen erraten** mit vier generischen 10er-Packs
- keine früheren konkreten Anime-Figuren in `party-mega-catalog.js`
- `Löwe`, nicht `Löwenkönig`
- `wavelength` → **Spektrum-Tipp**
- Browser-Tabu enthält `Tab`, nicht `Chrome`
- `party-catalog.js` enthält weder alte Kamerarollen-Frage noch Pflicht zum Vorlesen der letzten Handy-Nachricht
- sichere Ersatztexte stehen direkt im Basiskatalog

## Qualitätsbefehle

```bash
npm ci --ignore-scripts --no-audit --no-fund
npx playwright install --with-deps chromium
npm run ci
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

Der Lockfile-Vertrag wird durch `scripts/lockfile_contract_audit.py` geschützt. Ein echter Online-`npm ci`-PASS bleibt bis zu einem funktionierenden Runner offen.

## Update-Regel

Bei jeder offline benötigten Dateiveränderung:

1. Offline-Core aktualisieren
2. Cachegeneration erhöhen
3. Service-Worker-Test aktualisieren
4. Architektur/Deployment/Privacy/Environment/Release-Audits synchronisieren
5. reale ältere installierte Version → neue Version testen

## Rollback

Bei kritischem Fehler Veröffentlichung stoppen, gezielten Revert/Hotfix erstellen, Cachegeneration erneut erhöhen, persistierte Daten rückwärtsverträglich halten oder migrieren und auf HTTPS-Staging testen. Nach Rollback/Hotfix sowohl automatisierten HTTPS-Smoke als auch manuellen Browser-/PWA-Smoke erneut durchführen. Kein Force-Push auf stabile Production-Basis.

## Produktionsfreigabe

Ein öffentlicher Release bleibt blockiert, bis Produkt-, CI-, Cross-Browser-, Branch-Protection-, HTTPS-Smoke-, PWA-, Geräte-, Accessibility-, Daten-, Inhalts-, Privacy-, Rechte-, Gruppen-, Rechts- und Betriebs-Gates auf demselben unveränderten Release Candidate bestätigt sind.

Aktueller Status: **NO_GO**.