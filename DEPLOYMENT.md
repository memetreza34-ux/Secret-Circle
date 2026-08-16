# Secret Circle Party Hub – Deployment und Rollback

Stand: 16. August 2026

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
- aktueller Offline-Core: **`secret-circle-v32`**
- Release-PR: **Draft-PR #13** auf `agent/release-foundation-2027`

Die vollständige individuelle Produktabnahme priorisiert die 15 Kernspiele. Extended/Labs müssen weiterhin gemeinsame Stabilitäts-, Daten-, Security- und Offlineverträge erfüllen.

## Deployment-Reihenfolge

1. lokale Entwicklung
2. CI/Test
3. HTTPS-Staging/Preview
4. Release Candidate auf unverändertem Commit
5. Production

Production darf nicht der erste echte HTTPS-/Service-Worker-Test eines Release Candidates sein.

## Voraussetzungen vor Production

### Build/Repository

- unveränderter Release-Commit festgelegt
- `package-lock.json` vorhanden
- Installation über `npm ci` reproduzierbar
- `npm run ci` auf exakt diesem Commit grün
- `npm run test:cross-browser` auf exakt diesem Commit grün
- GitHub Actions zeigt echten Checkout und echte Steps; `steps: []` zählt nicht
- Required Checks/Branch Protection eingerichtet

### Produkt/Content

- alle 15 Kernspiele bestehen `CORE_GAME_ACCEPTANCE.md`
- Scoring-/Winner-Vertrag bestätigt
- quantitative Core-Content-Gates erfüllt
- manuelles semantisches Content-/Alters-/Privacy-Review abgeschlossen
- Extended/Labs besitzen mindestens technische Smoke-Abnahme
- keine offenen kritischen/hohen Releasefehler

### Geräte/Accessibility

- reales Android-Smartphone
- reales iPhone
- mindestens ein Tablet
- PWA-Installation/Standalone/Offline-Neustart
- Sperrbildschirm und OS-Hintergrund bei Timern
- Tastatur, Fokus, 200-%-Zoom, Reduced Motion
- Screenreader-Smoke-Test

### Daten/PWA

- Offline-Start aus **`secret-circle-v32`** bestätigt
- `party-core-release-catalog.js` offline verfügbar
- `party-core-classic-content.js` offline verfügbar
- Update von mindestens zwei älteren installierten Versionen geprüft
- aktive Session über kontrolliertes Update wiederherstellbar
- Export/Import/Löschung geprüft
- Quota-/Korruptions-/Rollbackpfade geprüft
- Rollbackdeployment vorbereitet

### Reale Gruppen

Dokumentierte Tests mindestens mit:

- 3–4 Personen
- 5–8 Personen
- 9–12 Personen
- großer Word-Imposter-Runde
- Mafia mit mehreren Rollen
- Smart Party Night mehrfach
- Creator mit einer Person ohne Entwicklerwissen

### Recht/Betrieb

Vor Production final:

- Betreiber-/Kontaktangaben
- Datenschutz
- gegebenenfalls Impressum
- Hostingangaben
- Lizenz-/Third-Party-Inventar
- Supportweg
- Incident-/Hotfixprozess

## GitHub Pages / statisches Hosting

GitHub Pages ist eine mögliche Route. Eine andere HTTPS-Plattform ist zulässig, wenn dieselben PWA-/Cache-/Rollbackverträge gelten.

Für GitHub Pages:

1. **PR #13 nicht vor Releasefreigabe mergen.**
2. freigegebenen Commit in stabile Zielbasis übernehmen
3. Pages-Deploymentquelle festlegen
4. HTTPS-Adresse prüfen
5. vollständigen Production-Smoke-Test durchführen
6. Deploymentcommit/-zeitpunkt dokumentieren

Keine Production-Freigabe von einem ungeprüften Arbeitscommit.

## Production-Smoke-Test

### Seiten

- `party.html`
- `creator.html`
- `advanced.html`
- `quick-play.html`
- `index.html`
- `privacy.html`

liefern Status 200.

Zusätzlich:

- Manifest/Icons korrekt
- keine kritischen Browser-/Netzwerkfehler
- CSP blockiert keine benötigten lokalen Dateien

### Katalog

Die Browserfolge muss vollständig laden:

`party-catalog → expansion → trending → mega → viral → core-release → core-classic → routing`

Die finalen Core-Inhalte müssen online und offline dieselben Mengen liefern.

### Hub/Creator/Engines

- Release-Tiers korrekt
- Suche/Filter/Favoriten/Spieler/Presets/Verlauf/Party Night funktionieren
- direkte URL-Navigation korrekt
- Abschluss vs. Verwerfen klar getrennt
- Creator: alle sechs Vorlagen, Bearbeiten/Kopieren/Löschen/Import/Export
- direkte Hub-, Quick-, Mega-, Viral-, Advanced-, Creator- und Word-Imposter-Flows starten
- aktive Sessions nach Reload sicher fortsetzbar
- private Inhalte nach Unterbrechung verdeckt
- Verlauf/Statistik genau einmal

### Offline

- aktiver Cache: **`secret-circle-v32`**
- beide Core-Contentmodule verfügbar
- Kernseiten und benötigte Engines starten offline
- Query-Navigation besitzt Offline-Fallback
- ältere lokale Daten bleiben bei Update erhalten

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
4. Architektur/Deployment/Release-Audits synchronisieren
5. reale ältere installierte Version → neue Version testen

## Rollback

Bei kritischem Fehler:

1. Veröffentlichung stoppen
2. betroffenen Releasecommit identifizieren
3. gezielten Revert/Hotfix erstellen
4. Cachegeneration erneut erhöhen
5. persistierte Daten rückwärtsverträglich halten oder migrieren
6. betroffene Kernflows testen
7. Daten-/Updatepfade prüfen
8. Rollback auf HTTPS-Staging testen
9. Production aktualisieren
10. Vorfall dokumentieren

Kein Force-Push auf die stabile Production-Basis.

## Produktionsfreigabe

Ein öffentlicher Release bleibt blockiert, bis Produkt-, CI-, Cross-Browser-, PWA-, Geräte-, Accessibility-, Daten-, Inhalts-, Gruppen-, Rechts- und Betriebs-Gates auf demselben unveränderten Release Candidate bestätigt sind.

Aktueller Status: **NO_GO**.
