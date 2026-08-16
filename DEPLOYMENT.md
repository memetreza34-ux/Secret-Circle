# Secret Circle Party Hub – Deployment und Rollback

Stand: 16. August 2026

Secret Circle besteht für den Januar-2027-Release aus statischen Dateien. Eine installierbare PWA benötigt HTTPS; `localhost` ist nur für lokale Entwicklung eine Ausnahme.

## Aktueller Releaseumfang

- 45 eingebaute technisch spielbare Spiele
- davon **15 priorisierte Kernspiele** mit vollständiger Releaseabnahme
- 13 Extended-Spiele
- 17 Labs-Spiele
- 27 Quick-, Trend- und Viral-Modi
- 4 Advanced-Kernspiele
- Word Imposter
- Smart Party Night
- eigener No-Code-Game-Creator mit sechs Vorlagen
- bis zu 40 selbst erstellte Spiele
- kontextabhängige Schnellhilfe
- aktueller Offline-Core: **`secret-circle-v31`**
- Release-PR: **Draft-PR #13** auf `agent/release-foundation-2027`

Extended und Labs müssen die gemeinsamen Stabilitäts-, Offline-, Daten- und Sicherheitsverträge einhalten. Die vollständige individuelle Produktabnahme priorisiert für Januar 2027 die 15 Kernspiele.

## Deployment-Umgebungen

Die Reihenfolge ist verbindlich:

1. lokale Entwicklung
2. CI/Test
3. HTTPS-Staging beziehungsweise Preview
4. Release Candidate auf unverändertem Commit
5. Production

Production darf nicht der erste echte HTTPS-/Service-Worker-Test eines Release Candidates sein.

## Voraussetzungen vor öffentlichem Deployment

### Build und Repository

- unveränderter Release-Commit festgelegt
- `package-lock.json` vorhanden und geprüft
- Installation über `npm ci` reproduzierbar
- `npm run ci` auf genau diesem Commit vollständig erfolgreich
- `npm run test:cross-browser` auf genau diesem Commit vollständig erfolgreich
- GitHub Actions zeigt reale Schritte inklusive Checkout; ein Job mit `steps: []` zählt nicht
- Required Checks/Branch Protection für die stabile Zielbasis eingerichtet

### Produkt und Inhalt

- alle 15 Kernspiele bestehen `CORE_GAME_ACCEPTANCE.md`
- Punkte-/Siegervertrag aller 15 Kernspiele bestätigt
- Core-Content-Zielmengen und manuelles redaktionelles Review abgeschlossen
- Alters-/sensible Inhalte geprüft
- Extended/Labs besitzen mindestens einen technischen Launch-/Smoke-Test
- keine offenen kritischen oder hohen Releasefehler

### Geräte und Accessibility

- Android-Smartphone real geprüft
- iPhone real geprüft
- mindestens ein Tablet real geprüft
- PWA-Installation, Standalone-Modus und Offline-Neustart geprüft
- Sperrbildschirm/OS-Hintergrund bei Timern geprüft
- Tastatur, sichtbarer Fokus, 200-%-Zoom, Reduced Motion und Screenreader-Smoke-Test abgeschlossen

### Daten und PWA

- Offline-Start aus `secret-circle-v31` bestätigt
- Update von mindestens zwei älteren installierten Versionen auf den Release Candidate geprüft
- aktive Session bleibt beim kontrollierten Update wiederherstellbar
- Gesamtexport/-import und vollständige Löschung geprüft
- Quota-/beschädigte-Daten-/Rollbackpfade abgenommen
- Rollbackdeployment praktisch vorbereitet

### Reale Gruppen

Mindestens dokumentierte Sessions mit:

- 3–4 Personen
- 5–8 Personen
- 9–12 Personen
- großer Word-Imposter-Runde
- Mafia mit mehreren Rollen
- Smart Party Night mehrfach
- Game Creator mit einer Person ohne Entwicklerwissen

### Recht und Betrieb

- Betreiber-/Kontaktangaben
- Datenschutz
- gegebenenfalls Impressum
- Hostingangaben
- Lizenz-/Third-Party-Inventar
- Supportweg
- Incident-/Hotfixprozess

müssen vor Production final sein.

## GitHub Pages / statisches Hosting

GitHub Pages ist eine mögliche statische Auslieferungsroute. Eine spätere andere HTTPS-Plattform ist ebenfalls zulässig, solange dieselben PWA-/Cache-/Rollbackverträge erfüllt werden.

Für GitHub Pages:

1. **Draft-PR #13 nicht vor Releasefreigabe mergen.**
2. Nach allen Gates den freigegebenen Commit in die stabile Zielbasis übernehmen.
3. `Settings → Pages` öffnen.
4. gewünschte freigegebene Deploymentquelle festlegen.
5. HTTPS-Adresse prüfen.
6. vollständigen Production-Smoke-Test ausführen.
7. Deployment-Commit und Zeitpunkt dokumentieren.

Keine Production-Freigabe direkt von einem ungeprüften Arbeitscommit.

## Prüfung nach dem Deployment

### Seiten und Installation

- `party.html`, `creator.html`, `advanced.html`, `quick-play.html`, `index.html` und `privacy.html` liefern Status 200
- Manifest installiert „Secret Circle – Party Hub“ mit korrektem Startpunkt
- 192- und 512-Pixel-Icons werden erkannt
- Browserkonsole und Netzwerkansicht zeigen keine kritischen Fehler
- Content Security Policy blockiert keine benötigten lokalen Dateien
- `party-core-release-catalog.js` wird online und aus dem Offline-Core geladen

### Hub und Bedienbarkeit

- Release-Tiers Core/Extended/Labs werden korrekt dargestellt
- Suche, Filter, Favoriten, Spieler, Presets, Verlauf und Smart Party Night funktionieren
- direkte URL-Navigation und gespeicherter Filterzustand widersprechen sich nicht
- Spielkarten und Spieldetails benennen die nächste Aktion klar
- Kernspiel-Sessionsteuerung trennt Speichern von Verwerfen

### Creator

- alle sechs Vorlagen lassen sich öffnen
- strukturierte Karten werden korrekt gespeichert
- mehrere Kategorien, Icon, Akzent, Spielerzahl und Dauer bleiben erhalten
- Bearbeiten, Kopieren, Löschen, Export und Import funktionieren
- eigene Spiele erscheinen im Hub und sind direkt spielbar
- ungültige oder beschädigte Creator-Daten werden verworfen
- Speicherfehler stellt den alten Zustand wieder her

### Engines und Daten

- direkte Hub-, Quick-, Mega-, Viral-, Advanced-, Creator- und Word-Imposter-Abläufe starten
- aktive Sessions lassen sich nach Reload sicher fortsetzen
- private Inhalte werden nach Unterbrechung nicht automatisch sichtbar
- Verlauf und Statistik zählen Abschlüsse genau einmal
- Gesamtexport enthält relevante lokale Daten und aktive Sessions
- vollständige Löschung entfernt alle vorgesehenen Secret-Circle-Daten

### Offline

- aktiver Releasecache ist **`secret-circle-v31`**
- Hub, Creator, Release-Content-Modul, Suche, Filter, Sessionsteuerung, alle benötigten Engines, Word Imposter und Datenschutz starten offline
- Navigation mit Queryparametern besitzt einen funktionierenden Offline-Fallback
- Update von älteren Versionen erhält lokale Spieler, Packs, eigene Spiele und Sessions

## Lokale Befehle – aktueller Übergangszustand

Solange `package-lock.json` noch fehlt, verwendet die Entwicklungs-CI derzeit:

```bash
npm install --ignore-scripts --no-audit --no-fund --package-lock=false
npx playwright install --with-deps chromium
npm run ci
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

Das ist **kein finaler Releasezustand**.

Vor öffentlicher Freigabe muss daraus werden:

```bash
npm ci
npx playwright install --with-deps chromium
npm run ci
npx playwright install --with-deps chromium firefox webkit
npm run test:cross-browser
```

## Update-Regeln

Bei Änderungen an offline benötigten Dateien:

1. Service-Worker-Core aktualisieren.
2. Cachegeneration erhöhen.
3. Offline-/Service-Worker-Test aktualisieren.
4. Runtime-/Release-/Architekturverträge synchronisieren.
5. Dokumentation synchronisieren.
6. Update von einer real installierten älteren Version praktisch testen.

Eine Cacheversion darf nicht nur in einem Dokument erhöht werden.

## Rollback

Bei kritischem Fehler:

1. weitere Veröffentlichung stoppen
2. betroffenen Releasecommit identifizieren
3. gezielten Revert/Hotfix erstellen
4. Cachegeneration erneut erhöhen
5. persistierte Datenschemata rückwärtsverträglich halten oder Migration bereitstellen
6. Core-Hub, Word Imposter, Creator und betroffene Engines smoke-testen
7. Daten-/Updatepfade prüfen
8. Rollback auf HTTPS-Staging testen
9. Production aktualisieren
10. Vorfall und Korrektur dokumentieren

Kein Force-Push auf die stabile Production-Basis.

## Produktionsfreigabe

Ein öffentlicher Release bleibt blockiert, bis Produkt-, CI-, Cross-Browser-, PWA-, Geräte-, Accessibility-, Daten-, Inhalts-, Gruppen-, Rechts- und Betriebs-Gates auf demselben unveränderten Release Candidate bestätigt sind.

Aktueller Status: **NO_GO**.
