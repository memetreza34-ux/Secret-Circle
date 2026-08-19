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
- aktueller Offline-Core: **`secret-circle-v43`**
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
- `package-lock.json` vorhanden
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
- Word-Imposter-Rechtepass regressionsgesichert
- `anime-guess` liefert 40 eigenständige Archetypen und `party-mega-catalog.js` enthält die früheren konkreten Figuren physisch nicht mehr
- `party-expansion.js` liefert `Spektrum-Tipp` und Browser-Tabu mit `Tab` direkt upstream
- Emoji-Quiz nutzt generisch `🦁🌾 → Löwe` statt `Löwenkönig`
- Viral-`higher-lower` enthält die generischen Sportfragen aus v38
- `party-catalog.js` enthält die beiden früher problematischen Private-Device-Truth/Dare-Prompts seit v43 physisch nicht mehr
- `scripts/privacy_content_audit.py` und `scripts/reference_content_audit.py` sind Teil von `npm run validate`
- übrige Extended/Labs final manuell/visuell/rechtlich geprüft
- Asset-/Dependency-Rechte aus `THIRD_PARTY_NOTICES.md` final
- keine offenen kritischen/hohen Releasefehler

### PWA-Icons / Assets

Seit v42 ist der technische Rastervertrag repariert:

- `icon-192.png` existiert und ist exakt 192×192
- `icon-512.png` existiert und ist exakt 512×512
- beide Rasterdateien sind aus `icon.svg` abgeleitet
- `assets/manifests/asset-provenance.json` enthält SHA-256 und Ableitungsnachweis
- `scripts/asset_provenance_audit.py` prüft Datei, Hash, PNG-IHDR-Dimensionen und Manifestgrößen
- die finale Rechtebasis von `icon.svg` bleibt bis menschlicher Bestätigung `unresolved`

### Geräte und Accessibility

- reales Android-Smartphone
- reales iPhone
- mindestens ein Tablet
- PWA-Installation, Standalone und Offline-Neustart
- Sperrbildschirm/OS-Hintergrund bei Timern
- Tastatur, Fokus, 200-%-Zoom/Reflow, Reduced Motion
- VoiceOver-/TalkBack-Smoke-Test

### Daten und PWA

- Offline-Start aus **`secret-circle-v43`** bestätigt
- `backup-schema-registry.js` vor `party-data-tools.js` geladen
- Base-, Expansion-, Mega-, Viral- und beide Core-Contentmodule offline verfügbar
- `icon.svg`, `icon-192.png` und `icon-512.png` offline verfügbar
- Update von mindestens zwei älteren installierten Versionen geprüft
- aktive Session über kontrolliertes Update wiederherstellbar
- Export/Import/Löschung geprüft
- Complete-Import lehnt unbekannte Storage-Key-Familien ab
- Quota-/Korruptions-/Rollbackpfade geprüft
- Rollbackdeployment vorbereitet

### Recht und Betrieb

Vor Production final:

- `LEGAL_CHECKLIST.md` abgearbeitet
- Betreiber-/Kontaktangaben final
- Datenschutz auf tatsächliches Hosting angepasst
- Hostingangaben final
- `THIRD_PARTY_NOTICES.md` und `FAN_CONTENT_REVIEW.md` final
- Asset-Provenienz ohne `unresolved` Releaseassets
- Privacy-/Reference-/Placeholder-Audits grün
- echter Supportweg nach `SUPPORT.md`
- Incident-/Hotfixprozess nach `INCIDENT_RESPONSE.md`

## Production-Smoke-Test

### Seiten und Manifest

`party.html`, `creator.html`, `advanced.html`, `quick-play.html`, `index.html` und `privacy.html` liefern Status 200. Manifest und Icons sind erreichbar; die Rastergrößen sind 192×192 und 512×512.

### Katalog und Privacy

Browserfolge:

`party-catalog → expansion → trending → mega → viral → core-release → core-classic(v4) → routing`

Online und offline müssen dieselben finalen Inhalte verfügbar sein.

Zusätzliche Checks:

- `anime-guess` → **Anime-Archetypen erraten** mit vier generischen 10er-Packs
- `party-mega-catalog.js` enthält keine der 40 entfernten konkreten Anime-Figuren und `Löwe` statt `Löwenkönig`
- `wavelength` zeigt **Spektrum-Tipp** bereits in `party-expansion.js`
- Browser-Tabu enthält `Tab`, nicht `Chrome`
- `party-catalog.js` enthält weder die frühere Kamerarollen-Frage noch die Pflicht zum Vorlesen der letzten Handy-Nachricht
- die sicheren Ersatztexte stehen bereits im Basiskatalog
- `scripts/privacy_content_audit.py` und `scripts/reference_content_audit.py` sind auf demselben RC-Commit tatsächlich grün

### Offline

- aktiver Cache: **`secret-circle-v43`**
- Base-, Expansion-, Mega-, Viral-, Backup-Registry- und beide Core-Contentmodule verfügbar
- alle drei App-Iconquellen verfügbar
- Kernseiten und benötigte Engines starten offline
- Query-Navigation besitzt Fallback
- lokale Daten bleiben bei Update erhalten

## Lokale Befehle – Übergangszustand

Solange das Lockfile fehlt:

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

Vor Release muss gelten:

```bash
npm ci
npx playwright install --with-deps chromium
npm run ci
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

## Update-Regel

Bei jeder offline benötigten Dateiveränderung:

1. Offline-Core aktualisieren
2. Cachegeneration erhöhen
3. Service-Worker-Test aktualisieren
4. Architektur/Deployment/Privacy/Environment/Release-Audits synchronisieren
5. reale ältere installierte Version → neue Version testen

## Rollback

Bei kritischem Fehler Veröffentlichung stoppen, gezielten Revert/Hotfix erstellen, Cachegeneration erneut erhöhen, persistierte Daten rückwärtsverträglich halten oder migrieren, betroffene Kernflows und Datenpfade auf HTTPS-Staging testen und anschließend Production aktualisieren. Kein Force-Push auf die stabile Production-Basis.

## Produktionsfreigabe

Ein öffentlicher Release bleibt blockiert, bis Produkt-, CI-, Cross-Browser-, Branch-Protection-, PWA-, Geräte-, Accessibility-, Daten-, Inhalts-, Privacy-, Rechte-, Gruppen-, Rechts- und Betriebs-Gates auf demselben unveränderten Release Candidate bestätigt sind.

Aktueller Status: **NO_GO**.
