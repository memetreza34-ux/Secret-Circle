# Secret Circle Party Hub – Deployment und Rollback

Stand: 18. August 2026

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
- aktueller Offline-Core: **`secret-circle-v41`**
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
- Required Checks/Branch Protection eingerichtet

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
- Classic Content **v4** hält die reference-safe Runtime-Invarianten
- `scripts/reference_content_audit.py` ist Teil von `npm run validate`
- übrige Extended/Labs final manuell/visuell/rechtlich auf vermeidbare Marken-/Franchisereferenzen geprüft
- Asset-/Dependency-Rechte aus `THIRD_PARTY_NOTICES.md` final
- keine offenen kritischen/hohen Releasefehler

### Geräte und Accessibility

- reales Android-Smartphone
- reales iPhone
- mindestens ein Tablet
- PWA-Installation, Standalone und Offline-Neustart
- Sperrbildschirm/OS-Hintergrund bei Timern
- Tastatur, Fokus, 200-%-Zoom/Reflow, Reduced Motion
- VoiceOver-/TalkBack-Smoke-Test
- `tests/e2e/accessibility-core.spec.js` auf funktionierendem Runner ausgeführt

### Daten und PWA

- Offline-Start aus **`secret-circle-v41`** bestätigt
- `backup-schema-registry.js` vor `party-data-tools.js` geladen
- Expansion-, Mega-, Viral- und beide Core-Contentmodule offline verfügbar
- Update von mindestens zwei älteren installierten Versionen geprüft
- aktive Session über kontrolliertes Update wiederherstellbar
- Export/Import/Löschung geprüft
- Complete-Import lehnt unbekannte Storage-Key-Familien ab
- Quota-/Korruptions-/Rollbackpfade geprüft
- Rollbackdeployment vorbereitet

### Reale Gruppen

Dokumentierte Tests mindestens mit 3–4, 5–8 und 9–12 Personen sowie großer Word-Imposter-Runde, Mafia mit mehreren Rollen, Smart Party Night mehrfach und Creator mit einer Person ohne Entwicklerwissen.

### Recht und Betrieb

Vor Production final:

- `LEGAL_CHECKLIST.md` abgearbeitet
- Betreiber-/Kontaktangaben final
- Datenschutz auf tatsächliches Hosting angepasst
- gegebenenfalls Impressum/Anbieterkennzeichnung final
- Hostingangaben final
- `THIRD_PARTY_NOTICES.md` final
- `FAN_CONTENT_REVIEW.md` final synchronisiert
- Asset-Provenienz ohne `unresolved` Releaseassets
- öffentlicher Placeholder-Audit grün
- Reference-Source-Audit tatsächlich grün
- echter Supportweg nach `SUPPORT.md`
- Incident-/Hotfixprozess nach `INCIDENT_RESPONSE.md`
- Wartungsprozess nach `MAINTENANCE.md`

## GitHub Pages / statisches Hosting

GitHub Pages ist eine mögliche Route. Eine andere HTTPS-Plattform ist zulässig, wenn dieselben PWA-/Cache-/Rollbackverträge gelten.

1. **PR #13 nicht vor Releasefreigabe mergen.**
2. freigegebenen Commit in stabile Zielbasis übernehmen
3. Deploymentquelle festlegen
4. HTTPS-Adresse prüfen
5. vollständigen Production-Smoke-Test durchführen
6. Deploymentcommit/-zeitpunkt dokumentieren

## Production-Smoke-Test

### Seiten

`party.html`, `creator.html`, `advanced.html`, `quick-play.html`, `index.html` und `privacy.html` liefern Status 200. Manifest/Icons sind korrekt, CSP blockiert keine benötigten lokalen Dateien und Browser-/Netzwerkansicht zeigen keine kritischen Fehler.

### Katalog

Browserfolge:

`party-catalog → expansion → trending → mega → viral → core-release → core-classic(v4) → routing`

Online und offline müssen dieselben finalen Inhalte verfügbar sein.

Zusätzliche sichtbare/source Checks:

- `anime-guess` → **Anime-Archetypen erraten** mit vier generischen 10er-Packs
- ausgelieferte `party-mega-catalog.js` enthält keine der 40 entfernten konkreten Anime-Figuren
- ausgelieferte `party-mega-catalog.js` enthält `Löwe`, nicht `Löwenkönig`
- stabile ID `wavelength` → sichtbarer Titel **Spektrum-Tipp** bereits in `party-expansion.js`
- Browser-Tabu-Karte enthält `Tab`, nicht `Chrome`, bereits in `party-expansion.js`
- im Viral-Sportpack tauchen die drei entfernten olympisch/Grand-Slam-spezifischen Texte nicht wieder auf
- `scripts/reference_content_audit.py` ist auf demselben RC-Commit tatsächlich grün

### Hub, Creator und Engines

Suche, Filter, Favoriten, Spieler, Presets, Verlauf, Party Night, Creator und alle relevanten Enginefamilien starten. Abschluss und Verwerfen bleiben getrennt. Private Inhalte bleiben nach Unterbrechung verdeckt. Persönliche Inhalte sind sichtbar freiwillig/überspringbar. Verlauf/Statistik zählen Abschlüsse genau einmal.

### Daten

- `backup-schema-registry.js` lädt vor `party-data-tools.js`
- Registry-Version 2 aktiv
- Export enthält nur registrierte Key-Familien
- unbekannter `secret-circle-*`-Namespace wird beim Import abgelehnt
- vollständiges Löschen entfernt weiterhin alle Secret-Circle-Reste
- Importfehler stellt vorherigen Zustand soweit möglich wieder her

### Offline

- aktiver Cache: **`secret-circle-v41`**
- Expansion-, Mega-, Viral-, Backup-Registry- und beide Core-Contentmodule verfügbar
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

Detaillierter Incidentablauf: `INCIDENT_RESPONSE.md`.

## Produktionsfreigabe

Ein öffentlicher Release bleibt blockiert, bis Produkt-, CI-, Cross-Browser-, PWA-, Geräte-, Accessibility-, Daten-, Inhalts-, Rechte-, Gruppen-, Rechts- und Betriebs-Gates auf demselben unveränderten Release Candidate bestätigt sind.

Aktueller Status: **NO_GO**.
