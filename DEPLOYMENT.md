# Secret Circle Party Hub – Deployment und Rollback

Stand: 25. August 2026

Secret Circle wird für Januar 2027 als statische Offline-first-PWA veröffentlicht. Eine installierbare PWA benötigt HTTPS; `localhost` ist nur für lokale Entwicklung eine Ausnahme.

## Aktueller Releaseumfang

- 45 eingebaute technisch spielbare Spiele
- 15 Core / 13 Extended / 17 Labs
- 27 Quick-/Trend-/Viral-Modi
- 4 Advanced-Kernspiele
- Word Imposter
- Smart Party Night
- lokaler No-Code-Game-Creator
- Core Source Review: 15/15 PREPARED
- Core Source Hardening: 15/15 PREPARED
- Accessibility Source Hardening: PREPARED
- Word-Imposter Data/Resume Hardening: PREPARED
- aktueller Offline-Core: **`secret-circle-v48`**
- Staging-Cache: **`secret-circle-v48-staging`**
- Release-PR: **Draft-PR #13** auf `agent/release-foundation-2027`
- öffentliche Freigabe: **NO_GO**

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

Aktueller P0 bleibt Issue #7. Der Hosted Runner scheitert weiterhin vor Step 1; dieser externe Blocker ist nicht durch v48-Code behoben.

### Produkt und Core

- alle 15 Kernspiele bestehen `CORE_GAME_ACCEPTANCE.md`
- 15/15 Quellreview PREPARED
- 15/15 Core-Hardening PREPARED
- Scoring-/Winner-Vertrag bestätigt
- Word-Imposter-Setup/Fairness/Voting/Resume real geprüft
- Word-Imposter Custom-/Backup-Grenzen real geprüft
- direkte Hub-Games inklusive Privacy-/Timer-/Skip-Verträge real geprüft
- Advanced-Privacy-/Resume-Verträge real geprüft
- Privacy-/Reference-Content-Audits auf dem RC-Commit grün
- übrige Extended/Labs final manuell/visuell/rechtlich geprüft
- keine offenen Critical/High-Releasefehler

### Word-Imposter-Datenvertrag v48

Vor RC-Abnahme müssen die neuen Grenzen real bzw. im ausgeführten Testgate bestätigt sein:

- maximal 50 eigene Kategorien
- maximal 200 Begriffe je eigener Kategorie
- 51 Kategorien werden vollständig abgelehnt und nicht still auf 50 gekürzt
- 201 Begriffe werden vollständig abgelehnt
- Backupgröße maximal 1,5 MB UTF-8
- abgelehnter Import verändert vorhandene Daten nicht
- Voting-Resume bestimmt den nächsten noch offenen Wähler aus tatsächlichen Stimmen
- der strengere Resume-Guard verwirft weiterhin nicht-sequenzielle manipulierte Voting-Snapshots

### PWA-Installationsmetadaten / Assets

Die fünf interaktiven Einstiegseiten `party.html`, `index.html`, `creator.html`, `advanced.html` und `quick-play.html` müssen denselben Installationsvertrag erfüllen:

- Manifest-Link
- Mobile-/Apple-Web-App-Metadaten
- SVG-Favicon
- 192×192-PNG-Favicon
- Apple-Touch-Icon
- CSP mit `manifest-src 'self'`

Zusätzlich:

- `icon-192.png` exakt 192×192
- `icon-512.png` exakt 512×512
- Asset-Provenienzmanifest vollständig
- `ASSET_RIGHTS_SIGNOFF.md` abgeschlossen
- keine Releaseassets mehr `unresolved`

### Resume-/Privacy-/Accessibility-Guards im Offline-Core

v48 muss offline enthalten:

- `word-imposter-resume-guard.js`
- `party-hub-resume-guard.js`
- `party-hub-a11y.js`
- `secondary-surface-a11y.js`
- `advanced-resume-guard.js`
- `advanced-privacy-guard.js`

sowie die zugehörigen Runtime-Module und Test-/Auditverträge.

### Geräte und Accessibility

- reales Android-Smartphone
- reales iPhone
- mindestens ein Tablet/iPad
- PWA-Installation, Standalone und Offline-Neustart
- Sperrbildschirm/OS-Hintergrund bei Timern
- Tastatur/Fokus/200-%-Zoom/Reflow/Reduced Motion
- VoiceOver/TalkBack
- private Reveal-Cover und Fokus-Recovery real
- Hub-Bereichswechsel verschieben Fokus sinnvoll
- Hub-Detail-/Spieloverlays isolieren den Hintergrund
- Advanced-Spieloverlay isoliert Setup und hält Tab/Shift+Tab im Spiel
- Quick-Phasen verlieren nach Re-Render keinen Tastaturfokus
- Creator-Schrittwechsel fokussieren die neue Schrittüberschrift
- Creator-Hilfe isoliert den Hintergrund und hält Fokus im Dialog
- Creator-Template-Auswahl funktioniert mit Pfeiltasten, Home und End

### Daten und PWA

- Offline-Start aus **`secret-circle-v48`** bestätigt
- Backup-Registry vor Datentools geladen
- Katalog-/Core-/Guard-/A11y-Module offline verfügbar
- Update von mindestens zwei echten älteren installierten Versionen geprüft
- aktive Session über kontrolliertes Update wiederherstellbar
- Export/Import/Löschung geprüft
- Word-Imposter 50/51- und 200/201-Grenzen geprüft
- unbekannte Storage-Key-Familien abgelehnt
- Quota-/Korruptions-/Rollbackpfade geprüft

### Recht und Betrieb

- `LEGAL_CHECKLIST.md` abgearbeitet
- `operator-release.json = FINAL / READY`
- Betreiber-/Kontakt-/Hostingangaben final
- Datenschutz auf tatsächliches Hosting angepasst
- `THIRD_PARTY_NOTICES.md` / `FAN_CONTENT_REVIEW.md` final
- Asset-Provenienz ohne `unresolved`
- echter Supportweg und Incident-/Hotfixprozess vorhanden

## Automatisierter HTTPS-Staging-Smoke

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v48
```

Der Smoke prüft unter anderem HTTPS, Same-Origin-Redirects, Größenlimits, Kernseiten/Query-Routen, Manifest, PNG-Dimensionen, Service-Worker-Cachegeneration, Backup-Registry-Ladereihenfolge, Privacy-/Reference-Source-Verträge und PWA-Head-Metadaten.

`scripts/staging_smoke_contract_audit.py` schützt den Vertrag statisch. Die echte Netzwerkprüfung läuft nur gegen eine konkrete Deployment-URL.

## Manueller Staging-/PWA-Smoke

Zusätzlich:

- Service Worker registriert
- App installierbar
- Hub und Unterseiten mit korrektem Titel/Icon
- Offline-Neustart
- Updatebanner und bewusste Aktivierung
- aktive Session während Update geschützt
- lokale Daten nach Update erhalten
- Export/Import
- Word Imposter inklusive Voting-Resume und Custom-/Backup-Grenzen
- direktes Hub-Core-Spiel
- Timer-Core-Spiel
- Advanced-Core-Spiel
- Quick Mode
- Creator
- Resume-/Privacy-/A11y-Guards offline
- reale Geräte-/Screenreaderprüfung

## Production-Smoke-Test

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v48 --production
```

Danach Browser-/PWA-Smoke auf Production wiederholen. `--production` verschärft die Placeholder-Prüfung öffentlicher Dateien.

## Qualitätsbefehle

```bash
npm ci --ignore-scripts --no-audit --no-fund
npx playwright install --with-deps chromium
npm run ci
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

Ein echter Online-`npm ci`-PASS bleibt bis zu einem funktionierenden Runner offen.

## Update-Regel

Bei **jeder offline benötigten Dateiveränderung**:

1. Offline-Core-Liste aktualisieren
2. Cachegeneration erhöhen
3. Service-Worker-Test aktualisieren
4. `ARCHITECTURE.md`, `DEPLOYMENT.md`, `privacy.html`, `ENVIRONMENTS.md` und Release-Dokumente synchronisieren
5. echte alte installierte Version → neue Version testen

v45 wurde für den 15/15-Core-Hardening-Block eingeführt. v46 folgte für das Hub-Accessibility-Hardening. v47 erweiterte den A11y-Vertrag auf Advanced, Quick und Creator. **v48** bündelt das Word-Imposter-Voting-Resume- und lokale Daten-/Backup-Hardening.

## Rollback

Bei kritischem Fehler:

1. Veröffentlichung stoppen
2. gezielten Revert/Hotfix erstellen
3. Cachegeneration erneut erhöhen
4. persistierte Daten rückwärtsverträglich halten oder migrieren
5. HTTPS-Staging testen
6. automatisierten Smoke wiederholen
7. manuellen PWA-/Geräte-Smoke wiederholen

Kein Force-Push auf eine stabile Production-Basis.

## Produktionsfreigabe

Ein öffentlicher Release bleibt blockiert, bis Produkt-, CI-, Cross-Browser-, Branch-Protection-, HTTPS-Smoke-, PWA-, Geräte-, Accessibility-, Daten-, Inhalts-, Privacy-, Rechte-, Gruppen-, Rechts- und Betriebs-Gates auf demselben unveränderten Release Candidate bestätigt sind.

Aktueller Status: **NO_GO**.