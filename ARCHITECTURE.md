# Secret Circle – Architekturvertrag für langfristige Wartbarkeit

Stand: 23. August 2026

Dieses Dokument definiert die technischen Grenzen, die Secret Circle langfristig verständlich, migrierbar, offline nutzbar und testbar halten.

## 1. Produktgrenzen

Secret Circle bleibt für den Januar-2027-Release eine statische Offline-first-PWA ohne verpflichtendes Konto, Backend, eigene Server-API, Werbung, Tracking oder externe Laufzeit-CDNs. Ein gemeinsames Gerät reicht für den vollständigen Kernabend.

Online-Multiplayer, Cloud-Sync, KI-Live-Inhalte, Kamera/Mikrofon und Mehrgerätefunktionen benötigen vor Einführung einen neuen Produkt-, Datenschutz-, Security- und Architekturentscheid.

## 2. Stabile Identitäten

Spiel-IDs, Pack-IDs, Creator-Spiel-IDs, Session-IDs, Abschluss-IDs, Speicherpräfix `secret-circle-`, Backupformate, Manifest-ID und PWA-Scope sind interne Verträge. Anzeigenamen dürfen sich ändern; persistierte IDs benötigen bei Änderungen eine Migration.

Jede wiederaufnehmbare Session erhält eine stabile Session-ID. Reload oder wiederholter Abschluss dürfen keinen zweiten Verlaufseintrag erzeugen.

## 3. Versionierte Daten und Backups

Persistierte Bereiche besitzen explizite Versionen. Beschädigte Daten werden normalisiert, isoliert verworfen oder über definierte Guard-Verträge abgelehnt. Unbekannte neuere Versionen werden nicht blind überschrieben.

`backup-schema-registry.js` ist der zentrale Backup-Vertragsmittelpunkt und steht auf Registry-Version 2. Complete-Backup-Format, Größenlimits und erlaubte Storage-Key-Familien werden dort definiert. `party-data-tools.js` darf diese Werte nicht separat duplizieren.

Complete-Imports akzeptieren nur bekannte versionierte Word-Imposter-Key-Familien sowie definierte `secret-circle-party-*`-Familien. Vollständiges Löschen bleibt absichtlich breiter und entfernt weiterhin alle `secret-circle-*`-Reste.

## 4. Katalog- und Contentarchitektur

Der vollständige Party-Katalog wird in dieser Reihenfolge aufgebaut:

`party-catalog.js → party-expansion.js → party-trending-catalog.js → party-mega-catalog.js → party-viral-catalog.js → party-core-release-catalog.js → party-core-classic-content.js → party-routing.js`

Verantwortung:

- `party-catalog.js`: Basisspiele und Ausgangsinhalte
- `party-expansion.js`: Advanced-Spiele und reference-safe Grunddefinitionen
- `party-trending-catalog.js`: klassische Quick Modes
- `party-mega-catalog.js`: Trend-/Ranking-/Social-Formate
- `party-viral-catalog.js`: Viral-/Preis-/Wissens-/Storyformate
- `party-core-release-catalog.js`: soziale Core-Releaseinhalte
- `party-core-classic-content.js`: klassische Core-Inhalte und finale redaktionelle Invarianten
- `party-routing.js`: finale Routingfassade, Competition-Metadaten und Creator-Spiele

`party-core-classic-content.js` steht auf Version **4**. Der final ausgelieferte Content hält unter anderem:

- `anime-guess` als generisches **Anime-Archetypen erraten**,
- die stabile ID `wavelength` sichtbar als **Spektrum-Tipp**,
- Browser-Tabu ohne konkrete Browsermarke,
- generische Löwen-/Event-/Sportformulierungen,
- keine früher identifizierten Private-Device-Truth/Dare-Offenlegungsaufforderungen.

`scripts/privacy_content_audit.py` und `scripts/reference_content_audit.py` schützen diese Source-Verträge.

## 5. Hub- und Timergrenzen

- `party-hub.js`: Session, Navigation, Ledger, Fokus und nicht zeitgesteuerte direkte Hub-Spiele
- `party-hub-timers.js`: Scharade, Tabu, Heiße Kartoffel und Wortkette samt Timer-State
- `party-session-controls.js`: generischer pausierbarer Timer und gemeinsame Sessionaktionen
- `party-hub-resume-guard.js`: Cross-Mode-/Timer-Resume-Integrität
- `party-hub-polish.js`: Live-Guidance, Freiwilligkeit und Geheimkarten-Sichtschutz im direkten Hub

Ladereihenfolge: `party-session-controls.js → party-hub-timers.js → party-hub.js`.

Für Datenverwaltung gilt: `backup-schema-registry.js` muss vor `party-data-tools.js` geladen sein.

## 6. Weitere Modulgrenzen

Word Imposter trennt:

- Fachlogik: `game-engine.js`
- Rollen: `role-assignment.js`
- Speicherung: `data-store.js`
- Resume-Integrität: `word-imposter-resume-guard.js`
- UI: `app.js`

Advanced Core trennt:

- Fachlogik: `party-advanced.js`
- Resume-Integrität: `advanced-resume-guard.js`
- Laufzeit/Session: `party-advanced-runner.js`
- Live-Privacy: `advanced-privacy-guard.js`
- Einstellungen: `party-advanced-preferences.js`

Der Game Creator trennt Daten-/Validierungslogik (`game-creator.js`), Wizard (`creator-page.js`) und Laufzeit (`party-created-modes.js`). Quick/Mega/Viral/Creator verwenden die gemeinsame Sessionsteuerung statt privater Intervalltimer.

Globale Monkey-Patches von `Storage.prototype`, Engine-Methoden oder Browser-APIs zur nachträglichen Korrektur von Fachlogik sind verboten.

## 7. Lokale Transaktionen und Exact-once

Kritische Vorgänge validieren zuerst, erfassen den alten Zustand, schreiben vollständig und stellen bei Fehlern den vorherigen Zustand wieder her. Ein Abschluss verwendet eine stabile Completion-ID, schreibt Verlauf/Statistik genau einmal und entfernt den aktiven Zustand erst nach erfolgreicher Verbuchung.

Abbruch und Skip dürfen keinen künstlichen Abschluss-/Punktzustand erzeugen.

## 8. Datenschutz und Security durch Architektur

- keine Analytics-/Ads-Skripte
- keine versteckten Netzwerkaufrufe
- keine externen Fonts zur Laufzeit
- restriktive CSP
- Nutzerdaten bevorzugt über `textContent`
- Importgrenzen nach Format, Größe, Key-Allowlist und Struktur
- geheime Inhalte nach Hintergrundwechsel/Reload nicht automatisch sichtbar
- Word-Imposter-, Hub- und Advanced-Resume-Zustände werden zusätzlich auf Integrität geprüft
- lokale Daten auffindbar, exportierbar und löschbar
- Built-in-Content verlangt keine privaten Nachrichten/Fotos/Passwörter/Adressen als Spielmaterial
- persönliche Inhalte bleiben freiwillig und überspringbar

`SECURITY.md`, `THREAT_MODEL.md`, `BACKUP_SCHEMAS.md`, `CORE_GAME_ACCEPTANCE.md` und die Privacy-/Resume-Guards ergänzen diesen Vertrag.

## 9. Offline- und Updatevertrag

Aktueller Offline-Core: **`secret-circle-v45`**.

Historie der letzten relevanten Cachegenerationen:

- v36: unnötige konkrete Word-Imposter-Referenzen generisch ersetzt
- v37: Anime-Archetypen im finalen Runtime-Katalog
- v38: konkrete Sport-/Eventreferenzen generisch ersetzt
- v39: Browsermarke entfernt, sichtbares Spektrum-Tipp
- v40: konkrete Anime-Figurennamen physisch aus ausgelieferter Quelle entfernt
- v41: Reference-Safe-Invarianten upstream + Classic Content v4
- v42: echte 192×192-/512×512-PNGs + Hash/IHDR/Manifestvertrag
- v43: Private-Device-Truth/Dare-Texte physisch entfernt + Privacy-Source-Audit
- v44: gemeinsamer Manifest-/iOS-/Icon-Head-Vertrag für Hub, Word Imposter, Creator, Advanced und Quick
- **v45: Cachegeneration nach 15/15-Core-Hardening erhöht; Word-Imposter-Resume, Advanced-Resume und Advanced-Live-Privacy explizit im Offline-Core**

Neue Versionen werden zuerst vollständig in einem Staging-Cache vorbereitet. Aktivierung erfolgt erst nach sichtbarer Nutzerentscheidung. Der aktive Offline-Core wird nicht vor erfolgreicher Promotion zerstört.

Bei jeder offline benötigten Dateiänderung:

1. CORE-Liste prüfen
2. Cachegeneration erhöhen
3. Service-Worker-Test aktualisieren
4. Architektur/Deployment/Privacy/Environment/Release-Dokumente synchronisieren
5. reale alte→neue Updatepfade später testen

## 10. PWA-Installationsmetadaten

Die interaktiven Einstiegseiten `party.html`, `index.html`, `creator.html`, `advanced.html` und `quick-play.html` verwenden denselben Installationsvertrag:

- responsiver Viewport mit `viewport-fit=cover`
- `theme-color`
- `referrer=no-referrer`
- Mobile-/Apple-Web-App-Metadaten
- CSP mit `manifest-src 'self'`
- `manifest.webmanifest`
- `icon.svg`
- `icon-192.png` als PNG-Favicon und Apple-Touch-Icon

`tests/pwa-head-metadata.test.js` schützt diesen Source-Vertrag. Reale Homescreen-/Installationsdarstellung bleibt ein Geräte-Gate.

## 11. Accessibility als Definition of Done

Kernoberflächen benötigen semantische Struktur, beschriftete Controls, Tastaturbedienung, sichtbaren Fokus, ausreichend große Touchziele, Reduced Motion, 200-%-Zoom/Reflow, verständliche Live-/Statusmeldungen sowie reale Smartphone-/Tablet-/Desktopprüfung. Farbe allein darf keinen Status erklären.

Private Reveal-Cover müssen mit Screenreader verständlich und nach bewusster Wiederöffnung fokussierbar sein.

`ACCESSIBILITY.md`, Contracttests und E2E bilden die automatisierbare Grundlage. VoiceOver/TalkBack und echte Touchbedienung bleiben manuelle Release-Gates.

## 12. Inhalts- und Rechtevertrag

- keine kopierten proprietären Karten anderer Apps
- keine fremden Logos/Bilder/Audios/Zitate ohne geklärte Rechte
- vermeidbare konkrete Marken-/Award-/Eventbegriffe generisch formulieren
- konkrete Fan-/Franchise-Namen aus finalem Runtime-Content und ausgelieferten Source-Dateien entfernen, sofern kein zwingender Produktnutzen besteht
- stabile interne IDs dürfen aus Migrationsgründen von sichtbaren Produktnamen abweichen
- keine Aufforderung zur Offenlegung privater Chats, Fotos, Passwörter, Adressen, Telefonnummern, Standorte oder Kontodaten
- Nutzerinhalte bleiben von Built-ins getrennt

`CONTENT_AGE_POLICY.md`, `CORE_CONTENT_REVIEW.md`, `FAN_CONTENT_REVIEW.md`, `THIRD_PARTY_NOTICES.md`, `ASSET_RIGHTS_SIGNOFF.md` und die Content-Audits definieren die Release-Gates.

## 13. Testpyramide

Bei jedem Commit vorgesehen:

- Syntaxchecks
- Unit-/Contracttests
- Strukturvalidatoren
- Content-/Scoring-Audits
- Resume-/Timerverträge
- PWA-Head-/Privacy-/Reference-/Asset-/Placeholder-/Accessibility-/Performance-/Release-Audits

Bei Release Candidates zusätzlich:

- Chromium, Firefox, WebKit
- reale Android-/iPhone-/Tablet-Tests
- PWA Upgrade/Rollback
- Screenreader/Zoom
- reale Partygruppen

## 14. Performance und Assets

Produktionsmodule bleiben grundsätzlich unter 1000 Zeilen und 100 KB; engere Budgets aus `scripts/performance_budget.py` haben Vorrang.

PWA-Icon-Vertrag:

- `icon.svg`: Vektorquelle; Rechtebasis noch menschlich zu bestätigen
- `icon-192.png`: echtes 192×192-PNG
- `icon-512.png`: echtes 512×512-PNG
- `assets/manifests/asset-provenance.json`: Hash/Ableitung/Rechtestatus
- `ASSET_RIGHTS_SIGNOFF.md`: menschlicher Sign-off-Pfad
- `scripts/asset_provenance_audit.py`: technischer Provenienzvertrag

`unresolved` bleibt ein Releaseblocker.

## 15. Betrieb, Deprecation und Rollback

`SUPPORT.md`, `INCIDENT_RESPONSE.md`, `MAINTENANCE.md` und `DEPLOYMENT.md` definieren den Betriebsvertrag nach Release.

Veraltete Funktionen werden dokumentiert migriert und nicht still entfernt. Keine Force-Pushes auf stabile Release-Basen. Rollback muss persistierte Daten kompatibel halten und benötigt bei PWA-Dateiänderungen erneut eine höhere Cachegeneration.

## 16. Releaseentscheidung

Eine Funktion ist erst fertig, wenn Happy Path und Fehlerfälle funktionieren, Daten-/Migrationsverhalten geklärt ist, Security/Privacy/Offline/Accessibility berücksichtigt sind, relevante Tests vorhanden **und tatsächlich ausgeführt** wurden, Dokumentation synchron ist und releasekritische Flows real beobachtet wurden.

**„Code vorhanden“ ist nicht gleich „Release PASS“.** Aktueller öffentlicher Release-Status: **NO_GO**.
