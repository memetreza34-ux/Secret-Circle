# Secret Circle – Architekturvertrag für langfristige Wartbarkeit

Stand: 19. August 2026

Dieses Dokument definiert die technischen Grenzen, die Secret Circle langfristig verständlich, migrierbar, offline nutzbar und testbar halten.

## 1. Produktgrenzen

Secret Circle bleibt für den Januar-2027-Release eine statische Offline-first-PWA ohne verpflichtendes Konto, Backend, eigene Server-API, Werbung, Tracking oder externe Laufzeit-CDNs. Ein gemeinsames Gerät reicht für den vollständigen Kernabend.

Online-Multiplayer, Cloud-Sync, KI-Live-Inhalte, Kamera/Mikrofon und Mehrgerätefunktionen benötigen vor Einführung einen neuen Produkt-, Datenschutz-, Security- und Architekturentscheid.

## 2. Stabile Identitäten

Spiel-IDs, Pack-IDs, Creator-Spiel-IDs, Session-IDs, Abschluss-IDs, Speicherpräfix `secret-circle-`, Backupformate, Manifest-ID und PWA-Scope sind interne Verträge. Anzeigenamen dürfen sich ändern; persistierte IDs benötigen bei Änderungen eine Migration.

Jede wiederaufnehmbare Session erhält genau eine stabile `sessionId`. Abschluss-IDs werden aus Engine, Spiel und Session abgeleitet. Reload oder wiederholter Abschluss dürfen keinen zweiten Verlaufseintrag erzeugen.

## 3. Versionierte Daten und Backups

Persistierte Bereiche besitzen explizite Versionen. Beschädigte Daten werden normalisiert oder isoliert verworfen. Unbekannte neuere Versionen werden nicht blind überschrieben. Persistenzänderungen benötigen Migrations-, Korruptions-, Quota- und Rollbacktests.

`backup-schema-registry.js` ist der zentrale Backup-Vertragsmittelpunkt und steht auf Registry-Version 2. Complete-Backup-Format, Größenlimits und erlaubte Storage-Key-Familien werden dort definiert. `party-data-tools.js` darf diese Werte nicht separat duplizieren.

Complete-Imports akzeptieren nur bekannte versionierte Word-Imposter-Key-Familien sowie versionierte `secret-circle-party-*`-Familien. Vollständiges Löschen bleibt absichtlich breiter und entfernt weiterhin alle `secret-circle-*`-Reste.

## 4. Katalog- und Contentarchitektur

Der vollständige Party-Katalog wird in dieser Reihenfolge aufgebaut:

`party-catalog.js → party-expansion.js → party-trending-catalog.js → party-mega-catalog.js → party-viral-catalog.js → party-core-release-catalog.js → party-core-classic-content.js → party-routing.js`

Verantwortung:

- `party-catalog.js`: Basisspiele und Ausgangsinhalte; seit v43 enthält der spielbare Basiskatalog die zwei früher problematischen Private-Device-Truth/Dare-Texte physisch nicht mehr
- `party-expansion.js`: Advanced-Spiele, strukturierte Welle-1-Erweiterungen und seit v41 reference-safe Grunddefinitionen für `wavelength`/Tabu
- `party-trending-catalog.js`: klassische Quick Modes
- `party-mega-catalog.js`: Trend-/Ranking-/Social-Formate; `anime-guess` liegt dort physisch als generischer Archetypenmodus vor
- `party-viral-catalog.js`: Viral-/Preis-/Wissens-/Storyformate
- `party-core-release-catalog.js`: soziale Core-Releaseinhalte aus Welle 2
- `party-core-classic-content.js`: klassische Core-Releaseinhalte sowie finale redaktionelle Privacy-/Reference-Safe-Invarianten und defensive Fallback-Ersetzungen
- `party-routing.js`: finale Routingfassade, Competition-Metadaten und lokale Creator-Spiele

`party-core-classic-content.js` steht auf Version **4**. Die finale Schicht:

- hält `anime-guess` auf 40 eigenständigen Archetypen,
- hält die stabile interne Spiel-ID `wavelength` öffentlich auf **Spektrum-Tipp**,
- behält die zwei Privacy-Textkorrekturen nur noch als defensive Fallback-Ersetzungen,
- behält persistierte IDs/Routingkompatibilität bei.

Seit v41 gilt zusätzlich upstream:

- `party-expansion.js` enthält direkt **Spektrum-Tipp** statt `Wellenlänge`.
- Die Browser-Tabu-Karte enthält direkt `Tab` statt `Chrome`.
- `party-mega-catalog.js` enthält die 40 generischen Anime-Archetypen und keine früheren konkreten Anime-Figuren.
- Der Emoji-Quiz-Löwenhinweis ist generisch `🦁🌾 → Löwe` statt `Löwenkönig`.

Seit v43 gilt zusätzlich für Privacy-Content:

- `party-catalog.js` enthält direkt `Welches Foto-Motiv findest du besonders lustig?` statt einer Kamerarollen-Aufforderung.
- `party-catalog.js` enthält direkt `Lies einen selbst erfundenen Satz wie einen dramatischen Theatermonolog vor.` statt einer Aufforderung, die letzte Handy-Nachricht vorzulesen.
- `scripts/privacy_content_audit.py` scannt acht ausgelieferte Built-in-Contentquellen auf konkrete Offenlegungsaufforderungen zu privaten Chats/Nachrichten, Kamerarolle/Fotos, Passwörtern, Adresse, Telefonnummer, Standort oder Kontodaten.
- Harmlose Geräte-/Chat-Erwähnungen werden nicht pauschal blockiert; der Audit trennt private Offenlegung von normalen Alltagsthemen.

`scripts/reference_content_audit.py` scannt ebenfalls die tatsächlich ausgelieferten Contentquellen und macht die Reference-Safe-Entscheidungen zu einem Releasevertrag. Die stabile technische ID `wavelength` bleibt ausdrücklich erlaubt; der alte sichtbare Produktname ist gesperrt.

## 5. Hub- und Timergrenzen

- `party-hub.js`: Session, Navigation, Ledger, Fokus und nicht zeitgesteuerte direkte Hub-Spiele
- `party-hub-timers.js`: Scharade, Tabu, Heiße Kartoffel und Wortkette samt Timer-State
- `party-session-controls.js`: generischer pausierbarer Timer und gemeinsame Sessionaktionen

Ladereihenfolge: `party-session-controls.js → party-hub-timers.js → party-hub.js`.

Für Datenverwaltung gilt zusätzlich: `backup-schema-registry.js` muss vor `party-data-tools.js` geladen sein.

## 6. Weitere Modulgrenzen

Word Imposter trennt Fachlogik (`game-engine.js`), Rollen (`role-assignment.js`), Speicherung (`data-store.js`) und UI (`app.js`). Der Game Creator trennt Daten-/Validierungslogik (`game-creator.js`), Wizard (`creator-page.js`) und Laufzeit (`party-created-modes.js`). Quick/Mega/Viral/Creator verwenden die gemeinsame Sessionsteuerung statt privater Intervalltimer.

Globale Monkey-Patches von `Storage.prototype`, Engine-Methoden oder Browser-APIs zur nachträglichen Korrektur von Fachlogik sind verboten.

## 7. Lokale Transaktionen und Exact-once

Kritische Vorgänge validieren zuerst, erfassen den alten Zustand, schreiben vollständig und stellen bei Fehlern den vorherigen Zustand wieder her. Ein Abschluss verwendet eine stabile Completion-ID, schreibt Verlauf/Statistik genau einmal und entfernt den aktiven Zustand erst nach erfolgreicher Verbuchung.

## 8. Datenschutz und Security durch Architektur

- keine Analytics-/Ads-Skripte
- keine versteckten Netzwerkaufrufe
- keine externen Fonts zur Laufzeit
- restriktive CSP
- Nutzerdaten bevorzugt über `textContent`
- Importgrenzen nach Format, Größe, Key-Allowlist und Struktur
- geheime Inhalte nach Hintergrundwechsel/Reload nicht automatisch sichtbar
- lokale Daten auffindbar, exportierbar und löschbar
- Built-in-Content darf keine privaten Nachrichten/Fotos/Passwörter/Adressen als Spielmaterial verlangen
- persönliche Inhalte bleiben freiwillig und überspringbar
- Source-Level-Privacy-Content wird zusätzlich durch `scripts/privacy_content_audit.py` geschützt

`SECURITY.md`, `THREAT_MODEL.md` und `BACKUP_SCHEMAS.md` ergänzen diesen Vertrag verbindlich.

## 9. Offline- und Updatevertrag

Aktueller Offline-Core: **`secret-circle-v44`**.

- v36: unnötige konkrete Word-Imposter-Referenzen generisch ersetzt
- v37: `anime-guess` im finalen Runtime-Katalog auf 40 generische Archetypen umgestellt
- v38: drei unnötig konkrete Sport-/Eventreferenzen im Viral-`higher-lower` generisch ersetzt
- v39: `Chrome` im finalen Tabu-Content entfernt und sichtbare Bezeichnung `Wellenlänge` durch **Spektrum-Tipp** ersetzt
- v40: 40 historische konkrete Anime-Figurennamen physisch aus der ausgelieferten `party-mega-catalog.js` entfernt
- v41: `Spektrum-Tipp` und `Tab` upstream in `party-expansion.js` verankert, Classic Content auf v4 bereinigt, `Löwenkönig` durch generischen Löwenhinweis ersetzt und zentraler Source-Reference-Audit in `npm run validate` aufgenommen
- v42: fehlendes `icon-192.png` ergänzt, falsch dimensioniertes `icon-512.png` durch echtes 512×512-Raster ersetzt und Asset-Audit um PNG-IHDR-, Manifestgrößen- und SHA-256-Prüfung erweitert
- v43: die zwei historischen Private-Device-Truth/Dare-Prompts physisch aus `party-catalog.js` entfernt und ein globaler Privacy-Content-Source-Audit in `npm run validate` aufgenommen
- v44: `creator.html`, `advanced.html` und `quick-play.html` auf denselben Manifest-/iOS-/Icon-Head-Vertrag wie Hub und Word Imposter gebracht; `tests/pwa-head-metadata.test.js` schützt fünf interaktive Einstiegseiten

Neue Versionen werden zuerst vollständig in einem Staging-Cache vorbereitet. Aktivierung erfolgt erst nach sichtbarer Nutzerentscheidung. Der aktive Offline-Core wird nicht vor erfolgreicher Promotion zerstört.

Bei jeder offline benötigten Dateiänderung:

1. CORE-Liste prüfen
2. Cachegeneration erhöhen
3. Service-Worker-Test aktualisieren
4. Architektur/Deployment/Privacy/Environment synchronisieren
5. reales alte→neue Update später testen

## 10. PWA-Installationsmetadaten

Die interaktiven Einstiegseiten `party.html`, `index.html`, `creator.html`, `advanced.html` und `quick-play.html` verwenden denselben Installationsvertrag:

- responsiver Viewport mit `viewport-fit=cover`
- `theme-color`
- `referrer=no-referrer`
- `mobile-web-app-capable=yes`
- `apple-mobile-web-app-capable=yes`
- `apple-mobile-web-app-status-bar-style=black-translucent`
- `apple-mobile-web-app-title=Secret Circle`
- CSP mit `manifest-src 'self'`
- `manifest.webmanifest`
- `icon.svg`
- `icon-192.png` als PNG-Favicon
- `icon-192.png` als Apple-Touch-Icon

`tests/pwa-head-metadata.test.js` schützt diesen Source-Vertrag. Reale Homescreen-/Installationsdarstellung auf iOS/Android/Desktop bleibt ein Geräte-Gate.

## 11. Accessibility als Definition of Done

Kernoberflächen benötigen semantische Struktur, beschriftete Controls, Tastaturbedienung, sichtbaren Fokus, mindestens 44 × 44 px wichtige Touchziele, Reduced Motion, 200-%-Zoom/Reflow, verständliche Live-/Statusmeldungen sowie reale Smartphone-/Tablet-/Desktopprüfung. Farbe allein darf keinen Status erklären.

`ACCESSIBILITY.md`, `tests/accessibility-contract.test.js`, `tests/pwa-head-metadata.test.js` und `tests/e2e/accessibility-core.spec.js` bilden die automatisierbare Grundlage. VoiceOver/TalkBack, reales 200-%-Zoom und echte Touchbedienung bleiben manuelle Release-Gates.

## 12. Inhalts- und Rechtevertrag

- keine kopierten proprietären Karten anderer Apps
- keine fremden Logos/Bilder/Audios/Zitate ohne geklärte Rechte
- vermeidbare konkrete Marken-/Award-/Eventbegriffe werden generisch formuliert
- konkrete Fan-/Franchise-Namen werden aus finalem Runtime-Content **und ausgelieferten Source-Dateien** entfernt, sofern sie keinen zwingenden Produktnutzen haben
- stabile interne IDs dürfen aus Migrationsgründen von sichtbaren Produktnamen abweichen
- keine Aufforderung zur Offenlegung privater Chats, Fotos, Passwörter, Adressen, Telefonnummern, Standorte oder Kontodaten
- jede Built-in-Karte besitzt einen redaktionellen Zweck
- Altersstufe und sensible Themen werden dokumentiert
- Nutzerinhalte bleiben von Built-ins getrennt

`CONTENT_AGE_POLICY.md`, `CORE_CONTENT_REVIEW.md`, `FAN_CONTENT_REVIEW.md`, `THIRD_PARTY_NOTICES.md`, `scripts/privacy_content_audit.py` und `scripts/reference_content_audit.py` definieren die Release-Gates.

## 13. Testpyramide

Bei jedem Commit vorgesehen: Syntaxchecks, Unit-/Contracttests, Strukturvalidatoren, Content-/Scoring-Audits, PWA-Head-, Privacy-Source-, Reference-Source-, Asset-Provenienz-, Placeholder-, Accessibility-, Performance- und Release-Audits.

Bei Release Candidates zusätzlich: Chromium, Firefox, WebKit, reale Android-/iPhone-/Tablet-Tests, Offline-Update, Screenreader/Zoom und reale Partygruppen.

## 14. Performance und Assets

Produktionsmodule bleiben grundsätzlich unter 1000 Zeilen und 100 KB; engere Budgets aus `scripts/performance_budget.py` haben Vorrang. Aktuell insbesondere:

- `party-hub.js` max. 50 KB
- `party-hub-timers.js` max. 18 KB
- `party-core-release-catalog.js` max. 65 KB
- `party-core-classic-content.js` max. 45 KB

Die zuletzt bestätigte Classic-v2-Größe lag bei 12.954 Bytes. Classic v4 bleibt unter demselben unveränderten 45-KB-Budget; die tatsächliche Ausführung des Performance-Audits bleibt vom funktionierenden Runner abhängig.

PWA-Icon-Vertrag seit v42:

- `icon.svg`: 512er Vektorquelle; Git-Historie belegt den Repository-Eintrag vom 2. August 2026, finale Rechtebasis bleibt menschlich zu bestätigen
- `icon-192.png`: echtes 192×192-PNG, deterministisch aus `icon.svg` erzeugt
- `icon-512.png`: echtes 512×512-PNG, deterministisch aus `icon.svg` erzeugt und PNG-optimiert
- `assets/manifests/asset-provenance.json` enthält SHA-256 und Ableitung
- `scripts/asset_provenance_audit.py` validiert Existenz, Hash, IHDR-Dimension und Manifestmetadaten

## 15. Betrieb, Deprecation und Rollback

`SUPPORT.md`, `INCIDENT_RESPONSE.md`, `MAINTENANCE.md` und `DEPLOYMENT.md` definieren den Betriebsvertrag nach Release.

Veraltete Funktionen werden dokumentiert migriert und nicht still entfernt. Keine Force-Pushes auf stabile Release-Basen. Rollback muss persistierte Daten kompatibel halten und benötigt bei PWA-Dateiänderungen erneut eine höhere Cachegeneration.

## 16. Releaseentscheidung

Eine Funktion ist erst fertig, wenn Happy Path und Fehlerfälle funktionieren, Daten-/Migrationsverhalten geklärt ist, Security/Privacy/Offline/Accessibility berücksichtigt sind, relevante Tests vorhanden **und tatsächlich ausgeführt** wurden, Dokumentation synchron ist und releasekritische Flows real beobachtet wurden.

„Code vorhanden“ ist kein Release-Nachweis.