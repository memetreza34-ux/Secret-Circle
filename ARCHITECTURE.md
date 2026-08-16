# Secret Circle – Architekturvertrag für langfristige Wartbarkeit

Stand: 16. August 2026

Dieses Dokument definiert die technischen Grenzen, die Secret Circle langfristig verständlich, migrierbar, offline nutzbar und testbar halten.

## 1. Produktgrenzen

Secret Circle bleibt für den Januar-2027-Release:

- offline-first
- ohne verpflichtendes Konto
- ohne Backend oder eigene Server-API
- ohne Analyse-, Werbe- oder Trackingdienste
- ohne externe Laufzeit-CDNs
- als statische PWA auslieferbar
- vollständig auf einem gemeinsam genutzten Gerät spielbar

Online-Multiplayer, Cloud-Sync, KI-Live-Inhalte, Kamera/Mikrofon und Mehrgerätefunktionen benötigen vor Einführung einen neuen Produkt-, Datenschutz-, Security- und Architekturentscheid.

## 2. Stabile Identitäten

Spiel-IDs, Pack-IDs, Creator-Spiel-IDs, Session-IDs, Abschluss-IDs, Speicherpräfix `secret-circle-`, Backupformate, Manifest-ID und PWA-Scope sind interne Verträge.

Anzeigenamen dürfen sich ändern. Persistierte IDs dürfen nur mit Migration verändert werden.

Jede wiederaufnehmbare Session erhält genau eine stabile `sessionId`. Abschluss-IDs werden aus Engine, Spiel und Session abgeleitet; Reload oder wiederholter Abschluss dürfen keinen zweiten Verlaufseintrag erzeugen.

## 3. Versionierte Daten

Aktuelle persistierte Verträge umfassen unter anderem:

- Word-Imposter-Schema Version 7
- Advanced-Session Version 2
- Party Hub Version 1
- Party Night Version 1
- Katalogfilter Version 1
- Quick-/Mega-/Viral-/Creator-Session Version 1
- Session-Ledger Version 1
- gemeinsame Sessionsteuerung Version 1
- eigene Hub-Packs Schema Version 1
- selbst erstellte Spiele Version 1
- Gesamtsicherung Version 1

Neue Felder erhalten sichere Defaults. Beschädigte Daten werden normalisiert oder isoliert verworfen. Unbekannte neuere Versionen werden nicht blind überschrieben. Persistenzänderungen benötigen Migrations- und Rollbacktests.

## 4. Katalog- und Contentarchitektur

### Katalogkette

Der vollständige Party-Katalog wird in dieser Reihenfolge aufgebaut:

`party-catalog.js → party-expansion.js → party-trending-catalog.js → party-mega-catalog.js → party-viral-catalog.js → party-core-release-catalog.js → party-core-classic-content.js → party-routing.js`

Verantwortung:

- `party-catalog.js`: Basisspiele und kompakte Ausgangsinhalte
- `party-expansion.js`: Advanced-Spiele sowie strukturierte Welle-1-Core-Erweiterungen
- `party-trending-catalog.js`: klassische Quick Modes
- `party-mega-catalog.js`: Trend-/Ranking-/Social-Formate
- `party-viral-catalog.js`: Viral-, Preis-, Wissens- und Storyformate
- `party-core-release-catalog.js`: größere soziale Core-Releaseinhalte aus Content-Welle 2
- `party-core-classic-content.js`: klassische Core-Releaseinhalte aus Content-Welle 3, inklusive verschachteltem Truth/Dare-Merge
- `party-routing.js`: finale Routingfassade, Scoringmetadaten und lokale Creator-Spiele

### Contentmodule dürfen nicht zu Engines werden

`party-core-release-catalog.js` und `party-core-classic-content.js` dürfen ausschließlich Built-in-Content erweitern und Lesefunktionen auf den erweiterten Content zeigen lassen.

Sie dürfen keine:

- DOM-Logik
- Sessionlogik
- Statistik
- Scoringlogik
- Persistenz
- Netzwerklogik
- eigene Timer

übernehmen.

Dadurch kann die Inhaltsmenge wachsen, ohne Engine- oder Hubmodule zu Monolithen zu machen.

## 5. Hub- und Timergrenzen

- `party-hub.js`: Session, Navigation, Ledger-Anbindung, Fokus und nicht zeitgesteuerte direkte Hub-Spiele
- `party-hub-timers.js`: Scharade, Tabu, Heiße Kartoffel und Wortkette sowie deren Timer-State
- `party-session-controls.js`: generischer pausierbarer Timer und gemeinsame Sessionaktionen

Ladereihenfolge:

`party-session-controls.js → party-hub-timers.js → party-hub.js`

Timermechaniken dürfen nicht zurück in `party-hub.js` kopiert werden. Direkte Hub-Spiele trennen **Beenden & speichern** von **Abbrechen & verwerfen**. Skip vergibt keinen künstlichen Punkt.

## 6. Weitere Module

### Word Imposter

- `game-engine.js`: Fachlogik
- `role-assignment.js`: Rollenverteilung
- `data-store.js`: Speicherung/Migration/Backup
- `app.js`: Browser-UI

### Game Creator

- `game-creator.js`: Validierung, Speicherung, Import/Export, Katalogabbildung
- `creator-page.js`: Wizard und Bibliothek
- `party-created-modes.js`: wiederaufnehmbare Creator-Spielengine

### Weitere Enginefamilien

- `party-advanced.js` / `party-advanced-runner.js`
- `party-quick-modes.js`
- `party-mega-modes.js`
- `party-viral-modes.js`
- `party-created-modes.js`
- `quick-loader.js`

Alle schnellen Enginefamilien verwenden `party-session-controls.js` statt privater Intervalltimer.

## 7. Modulgrößen

Produktionsmodule bleiben grundsätzlich unter 1000 Zeilen und 100 KB. Engere Budgets aus `scripts/performance_budget.py` haben Vorrang.

Besonders:

- `party-hub.js`: max. 50 KB
- `party-hub-timers.js`: max. 18 KB
- `party-core-release-catalog.js`: max. 65 KB
- `party-core-classic-content.js`: max. 45 KB

Wenn ein Contentmodul sein Budget erreicht, wird entlang klarer mechanischer/thematischer Grenzen getrennt; das Budget wird nicht reflexartig erhöht.

## 8. Reine Logik vor DOM-Logik

Planung, Validierung, Katalog, Suche, Migration und Zustandsübergänge sollen ohne Browser testbar bleiben.

DOM-Code verbindet Eingaben und Darstellung, dupliziert aber keine abweichenden Fachregeln.

Globale Monkey-Patches von `Storage.prototype`, Engine-Methoden oder Browser-APIs zur nachträglichen Korrektur von Fachlogik sind verboten.

## 9. Lokale Transaktionen und Exact-once

Kritische Vorgänge:

1. validieren Eingaben
2. erfassen den vorherigen Zustand
3. schreiben vollständig
4. stellen bei Fehlern den vorherigen Zustand wieder her

Das gilt insbesondere für Import, Löschung, eigene Packs, eigene Spiele und Sessionabschlüsse.

Ein Sessionabschluss:

1. verwendet eine stabile Abschluss-ID
2. berechnet den nächsten Ledgerzustand
3. speichert Verlauf/Statistik
4. markiert den Abschluss als verbucht
5. entfernt erst danach die aktive Session
6. stellt bei fehlgeschlagener Bereinigung einen sicheren Zustand wieder her

## 10. Datenschutz und Security durch Architektur

- keine Analytics-/Ads-Skripte
- keine versteckten Netzwerkaufrufe
- keine externen Fonts zur Laufzeit
- restriktive CSP
- dynamische Nutzerdaten bevorzugt über `textContent`
- Imports besitzen Format-/Größen-/Strukturgrenzen
- geheime Inhalte werden bei Hintergrundwechsel/Reload nicht automatisch wieder sichtbar
- alle lokalen Appdaten bleiben identifizierbar und löschbar
- Creator lädt keine Medien automatisch hoch

`SECURITY.md` und `THREAT_MODEL.md` sind verbindliche Ergänzungen dieses Architekturvertrags.

## 11. Offline- und Updatevertrag

Aktueller Offline-Core: **`secret-circle-v32`**.

Zum Offline-Core gehören unter anderem:

- Kernseiten
- Word Imposter
- Creator
- Release-Tiers
- Filter und Suche
- beide Core-Contentmodule
- Session-Ledger
- gemeinsame Sessionsteuerung
- Hub-Timermodul
- benötigte Engines
- Datenschutzseite

Eine neue PWA-Version wird zuerst vollständig in einem Staging-Cache vorbereitet. Aktivierung erfolgt erst nach sichtbarer Nutzerentscheidung. Der aktive Offline-Core wird nicht vor erfolgreicher Promotion zerstört.

Bei jeder neuen offline benötigten Datei:

1. CORE-Liste ändern
2. Cachegeneration erhöhen
3. Service-Worker-Test ändern
4. Architektur/Deployment synchronisieren
5. reales alte→neue Update später testen

## 12. Accessibility als Definition of Done

Jede Kernoberfläche benötigt:

- semantische Struktur
- beschriftete Felder
- vollständige Tastaturbedienung
- sichtbaren Fokus
- mindestens 44 × 44 px wichtige Touchziele
- Reduced Motion
- 200-%-Zoom
- verständliche Statusmeldungen
- Smartphone-/Tablet-/Desktopprüfung
- Status nicht nur über Farbe

Dynamische Suchvorschläge benötigen ARIA-Listbox und nachvollziehbare Tastaturnavigation. Pausenstatus wird sichtbar und programmatisch kommuniziert.

## 13. Inhaltsvertrag

- keine kopierten proprietären Karten anderer Apps
- keine fremden Logos/Bilder/Audios/Zitate ohne geklärte Rechte
- jede Built-in-Karte besitzt einen eigenen redaktionellen Zweck
- Altersstufe und sensible Themen werden dokumentiert
- strukturierte Mechaniken verwenden strukturierte Daten
- Nutzerinhalte bleiben von Built-ins getrennt
- steigende Contentmengen liegen in dedizierten Contentmodulen

`CONTENT_AGE_POLICY.md` definiert die aktuellen quantitativen und redaktionellen Release-Gates.

## 14. Testpyramide

Bei jedem Commit vorgesehen:

- Syntaxchecks
- Unit-/Contracttests
- Strukturvalidatoren
- Content-/Scoring-Audits
- Performancebudget
- Release-Audit

Bei Release Candidates zusätzlich:

- Chromium
- Firefox
- WebKit
- echte Android-/iPhone-/Tablet-Tests
- Offline-Update
- Accessibility
- reale Partygruppen

Contenttests verwenden den finalen `party-routing.js`-Pfad und prüfen damit Expansion + beide Core-Contentmodule gemeinsam.

## 15. Performance und Assets

Keine großen Frameworks, Videos oder Mediendateien ohne messbaren Produktnutzen, Kompression und explizites Budget. Wachstum des Offline-Cores bleibt über `scripts/performance_budget.py` sichtbar.

`ASSET_PLAN.md` definiert visuelle Assets. Kernfunktionalität muss ohne dekorative Bilder/Animationen verständlich bleiben.

## 16. Deprecation, Rollback und Erweiterung

Veraltete Funktionen werden dokumentiert migriert und nicht still entfernt. Keine Force-Pushes auf stabile Release-Basen.

Rollback muss persistierte Daten kompatibel halten und benötigt bei PWA-Dateiänderungen erneut eine höhere Cachegeneration.

Spätere Lokalisierung, Sounds, Teams, Turniere, Tageschallenges oder Onlinefunktionen dürfen den lokalen Offline-Kern nicht unabsichtlich ersetzen.

## 17. Releaseentscheidung

Eine Funktion ist erst fertig, wenn:

- Happy Path und Fehlerfälle funktionieren
- Daten-/Migrationsverhalten geklärt ist
- Security/Privacy berücksichtigt ist
- Offlineverhalten passt
- Accessibility berücksichtigt ist
- relevante Tests vorhanden und tatsächlich ausgeführt sind
- Dokumentation synchron ist
- reale Nutzung bei releasekritischen Flows beobachtet wurde

„Code vorhanden“ ist kein Release-Nachweis.
