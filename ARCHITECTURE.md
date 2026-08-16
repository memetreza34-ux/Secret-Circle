# Secret Circle – Architekturvertrag für langfristige Wartbarkeit

Stand: 16. August 2026

Dieses Dokument definiert die technischen Grenzen, die Secret Circle langfristig verständlich, migrierbar, offline nutzbar und testbar halten.

## 1. Produktgrenzen

Secret Circle bleibt für den Januar-2027-Release eine statische Offline-first-PWA ohne verpflichtendes Konto, Backend, eigene Server-API, Werbung, Tracking oder externe Laufzeit-CDNs. Ein gemeinsames Gerät reicht für den vollständigen Kernabend.

Online-Multiplayer, Cloud-Sync, KI-Live-Inhalte, Kamera/Mikrofon und Mehrgerätefunktionen benötigen vor Einführung einen neuen Produkt-, Datenschutz-, Security- und Architekturentscheid.

## 2. Stabile Identitäten

Spiel-IDs, Pack-IDs, Creator-Spiel-IDs, Session-IDs, Abschluss-IDs, Speicherpräfix `secret-circle-`, Backupformate, Manifest-ID und PWA-Scope sind interne Verträge. Anzeigenamen dürfen sich ändern; persistierte IDs benötigen bei Änderungen eine Migration.

Jede wiederaufnehmbare Session erhält genau eine stabile `sessionId`. Abschluss-IDs werden aus Engine, Spiel und Session abgeleitet. Reload oder wiederholter Abschluss dürfen keinen zweiten Verlaufseintrag erzeugen.

## 3. Versionierte Daten und Backups

Persistierte Bereiche besitzen explizite Versionen. Beschädigte Daten werden normalisiert oder isoliert verworfen. Unbekannte neuere Versionen werden nicht blind überschrieben. Persistenzänderungen benötigen Migrations-, Korruptions-, Quota- und Rollbacktests.

Aktuelle wichtige Verträge umfassen Word-Imposter-Schema v7, Advanced-Session v2 sowie Hub, Party Night, Filter, Quick/Mega/Viral/Creator, Session-Ledger, eigene Packs, selbst erstellte Spiele und Gesamtsicherung in ihren dokumentierten Versionen.

`backup-schema-registry.js` ist der zentrale Backup-Vertragsmittelpunkt und steht auf Registry-Version 2. Complete-Backup-Format, Größenlimits und erlaubte Storage-Key-Familien werden dort definiert. `party-data-tools.js` darf diese Werte nicht separat duplizieren.

Complete-Imports akzeptieren nur bekannte versionierte Word-Imposter-Key-Familien sowie versionierte `secret-circle-party-*`-Familien. Vollständiges Löschen bleibt absichtlich breiter und entfernt weiterhin alle `secret-circle-*`-Reste.

## 4. Katalog- und Contentarchitektur

Der vollständige Party-Katalog wird in dieser Reihenfolge aufgebaut:

`party-catalog.js → party-expansion.js → party-trending-catalog.js → party-mega-catalog.js → party-viral-catalog.js → party-core-release-catalog.js → party-core-classic-content.js → party-routing.js`

Verantwortung:

- `party-catalog.js`: Basisspiele und Ausgangsinhalte
- `party-expansion.js`: Advanced-Spiele und strukturierte Welle-1-Erweiterungen
- `party-trending-catalog.js`: klassische Quick Modes
- `party-mega-catalog.js`: Trend-/Ranking-/Social-Formate
- `party-viral-catalog.js`: Viral-/Preis-/Wissens-/Storyformate
- `party-core-release-catalog.js`: soziale Core-Releaseinhalte aus Welle 2
- `party-core-classic-content.js`: klassische Core-Releaseinhalte aus Welle 3 und finale redaktionelle Built-in-Ersetzungen
- `party-routing.js`: finale Routingfassade, Competition-Metadaten und lokale Creator-Spiele

Die beiden Core-Contentmodule dürfen keine DOM-, Session-, Statistik-, Scoring-, Persistenz-, Netzwerk- oder Timerlogik übernehmen.

## 5. Hub- und Timergrenzen

- `party-hub.js`: Session, Navigation, Ledger, Fokus und nicht zeitgesteuerte direkte Hub-Spiele
- `party-hub-timers.js`: Scharade, Tabu, Heiße Kartoffel und Wortkette samt Timer-State
- `party-session-controls.js`: generischer pausierbarer Timer und gemeinsame Sessionaktionen

Ladereihenfolge: `party-session-controls.js → party-hub-timers.js → party-hub.js`.

Für Datenverwaltung gilt zusätzlich: `backup-schema-registry.js` muss vor `party-data-tools.js` geladen sein.

Direkte Hub-Spiele trennen **Beenden & speichern** von **Abbrechen & verwerfen**. Skip vergibt keinen künstlichen Punkt. Timermechaniken dürfen nicht zurück in `party-hub.js` dupliziert werden.

## 6. Weitere Modulgrenzen

Word Imposter trennt Fachlogik (`game-engine.js`), Rollen (`role-assignment.js`), Speicherung (`data-store.js`) und UI (`app.js`). Der Game Creator trennt Daten-/Validierungslogik (`game-creator.js`), Wizard (`creator-page.js`) und Laufzeit (`party-created-modes.js`). Quick/Mega/Viral/Creator verwenden die gemeinsame Sessionsteuerung statt privater Intervalltimer.

Globale Monkey-Patches von `Storage.prototype`, Engine-Methoden oder Browser-APIs zur nachträglichen Korrektur von Fachlogik sind verboten.

## 7. Lokale Transaktionen und Exact-once

Kritische Vorgänge validieren zuerst, erfassen den alten Zustand, schreiben vollständig und stellen bei Fehlern den vorherigen Zustand wieder her. Das gilt insbesondere für Import, Löschung, eigene Packs, eigene Spiele und Sessionabschlüsse.

Ein Abschluss verwendet eine stabile Completion-ID, schreibt Verlauf/Statistik genau einmal und entfernt den aktiven Zustand erst nach erfolgreicher Verbuchung.

## 8. Datenschutz und Security durch Architektur

- keine Analytics-/Ads-Skripte
- keine versteckten Netzwerkaufrufe
- keine externen Fonts zur Laufzeit
- restriktive CSP
- Nutzerdaten bevorzugt über `textContent`
- Importgrenzen nach Format, Größe, Key-Allowlist und Struktur
- geheime Inhalte nach Hintergrundwechsel/Reload nicht automatisch sichtbar
- lokale Daten auffindbar, exportierbar und löschbar
- Built-in-Content darf keine privaten Nachrichten/Fotos als Spielmaterial verlangen
- persönliche Inhalte bleiben freiwillig und überspringbar

`SECURITY.md`, `THREAT_MODEL.md` und `BACKUP_SCHEMAS.md` ergänzen diesen Vertrag verbindlich.

## 9. Offline- und Updatevertrag

Aktueller Offline-Core: **`secret-circle-v35`**.

Zum Offline-Core gehören Kernseiten, Word Imposter, Creator, Release-Tiers, Filter/Suche, beide Core-Contentmodule, Backup-Registry, Session-Ledger, gemeinsame Sessionsteuerung, Hub-Timermodul, benötigte Engines und Datenschutzseite.

Neue Versionen werden zuerst vollständig in einem Staging-Cache vorbereitet. Aktivierung erfolgt erst nach sichtbarer Nutzerentscheidung. Der aktive Offline-Core wird nicht vor erfolgreicher Promotion zerstört.

Bei jeder offline benötigten Dateiänderung:

1. CORE-Liste prüfen
2. Cachegeneration erhöhen
3. Service-Worker-Test aktualisieren
4. Architektur/Deployment synchronisieren
5. reales alte→neue Update später testen

## 10. Accessibility als Definition of Done

Kernoberflächen benötigen semantische Struktur, beschriftete Controls, Tastaturbedienung, sichtbaren Fokus, mindestens 44 × 44 px wichtige Touchziele, Reduced Motion, 200-%-Zoom/Reflow, verständliche Live-/Statusmeldungen sowie reale Smartphone-/Tablet-/Desktopprüfung. Farbe allein darf keinen Status erklären.

`ACCESSIBILITY.md`, `tests/accessibility-contract.test.js` und `tests/e2e/accessibility-core.spec.js` bilden die automatisierbare Grundlage. VoiceOver/TalkBack, reales 200-%-Zoom und echte Touchbedienung bleiben manuelle Release-Gates.

## 11. Inhaltsvertrag

- keine kopierten proprietären Karten anderer Apps
- keine fremden Logos/Bilder/Audios/Zitate ohne geklärte Rechte
- keine Aufforderung zur Offenlegung privater Chats, Fotos, Passwörter oder Adressen
- jede Built-in-Karte besitzt einen redaktionellen Zweck
- Altersstufe und sensible Themen werden dokumentiert
- strukturierte Mechaniken verwenden strukturierte Daten
- Nutzerinhalte bleiben von Built-ins getrennt
- wachsende Contentmengen liegen in dedizierten Contentmodulen

`CONTENT_AGE_POLICY.md` und `CORE_CONTENT_REVIEW.md` definieren Mengen-, Safety- und redaktionelle Gates.

## 12. Testpyramide

Bei jedem Commit vorgesehen: Syntaxchecks, Unit-/Contracttests, Strukturvalidatoren, Content-/Scoring-Audits, Accessibility-Contract, Performancebudget und Release-Audit.

Bei Release Candidates zusätzlich: Chromium, Firefox, WebKit, reale Android-/iPhone-/Tablet-Tests, Offline-Update, Screenreader/Zoom und reale Partygruppen.

Core-Contenttests verwenden den finalen `party-routing.js`-Pfad und prüfen dadurch Expansion plus beide Core-Contentmodule gemeinsam.

## 13. Performance und Assets

Produktionsmodule bleiben grundsätzlich unter 1000 Zeilen und 100 KB; engere Budgets aus `scripts/performance_budget.py` haben Vorrang. Aktuell insbesondere:

- `party-hub.js` max. 50 KB
- `party-hub-timers.js` max. 18 KB
- `party-core-release-catalog.js` max. 65 KB
- `party-core-classic-content.js` max. 45 KB

Wenn ein Modul sein Budget erreicht, wird entlang klarer Verantwortungsgrenzen getrennt statt das Budget reflexartig anzuheben.

## 14. Betrieb, Deprecation und Rollback

`SUPPORT.md`, `INCIDENT_RESPONSE.md`, `MAINTENANCE.md` und `DEPLOYMENT.md` definieren den Betriebsvertrag nach Release.

Veraltete Funktionen werden dokumentiert migriert und nicht still entfernt. Keine Force-Pushes auf stabile Release-Basen. Rollback muss persistierte Daten kompatibel halten und benötigt bei PWA-Dateiänderungen erneut eine höhere Cachegeneration.

## 15. Releaseentscheidung

Eine Funktion ist erst fertig, wenn Happy Path und Fehlerfälle funktionieren, Daten-/Migrationsverhalten geklärt ist, Security/Privacy/Offline/Accessibility berücksichtigt sind, relevante Tests vorhanden **und tatsächlich ausgeführt** wurden, Dokumentation synchron ist und releasekritische Flows real beobachtet wurden.

„Code vorhanden“ ist kein Release-Nachweis.
