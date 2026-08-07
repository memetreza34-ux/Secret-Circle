# Secret Circle – Architekturvertrag für langfristige Wartbarkeit

Dieses Dokument definiert die Regeln, die Secret Circle auch nach vielen Jahren verständlich, migrierbar, offline nutzbar und testbar halten sollen.

## 1. Produktgrenzen

Secret Circle bleibt offline-first, ohne verpflichtendes Konto, ohne externe Laufzeitabhängigkeiten, als statische PWA auslieferbar und auf einem gemeinsam genutzten Gerät vollständig spielbar. Spätere Online-, KI-, Kamera- oder Mehrgerätefunktionen bleiben optionale getrennte Module.

## 2. Stabile Identitäten

Spiel-IDs, Pack-IDs, Creator-Spiel-IDs, Session-IDs, Abschluss-IDs, Speicherpräfix `secret-circle-`, Backupformat, Manifest-ID und PWA-Scope sind interne Verträge. Anzeigenamen dürfen sich ändern; persistierte IDs benötigen bei Änderungen eine Migration.

Jede wiederaufnehmbare Session erhält beim Start genau eine stabile `sessionId`. Ältere aktive Sessions ohne dieses Feld erhalten über `legacySessionId` eine deterministische kompatible Identität. Abschluss-IDs werden ausschließlich aus Engine, Spiel-ID und Session-ID abgeleitet.

## 3. Versionierte Daten

Aktuelle Bereiche:

- Word-Imposter-Schema Version 7
- Advanced-Session Version 2
- Party Hub Version 1
- Party Night Version 1
- Katalogfilter Version 1
- klassische Quick-Session Version 1
- Mega-Trend-Session Version 1
- Viral-Session Version 1
- Creator-Session Version 1
- gemeinsames Session-Ledger Version 1
- eigene Hub-Packs Speicherschema Version 1, Manager Version 4
- selbst erstellte Spiele Version 1
- Gesamtsicherung Version 1

Neue Felder erhalten sichere Standardwerte. Beschädigte Daten werden isoliert verworfen oder auf begrenzte sichere Werte normalisiert. Unbekannte neuere Versionen werden nicht blind überschrieben. Migrationen benötigen realistische alte Snapshots.

## 4. Modulgrenzen

### Word Imposter

- `game-engine.js`: Regeln und Zustandsübergänge
- `role-assignment.js`: unabhängige Rollenverteilung
- `data-store.js`: Migration, Validierung und Sicherung
- `app.js`: Browseroberfläche

### Katalog und Hub

- `party-catalog.js`: Basisspiele
- `party-expansion.js`: Advanced-Erweiterung
- `party-trending-catalog.js`: klassische Quick Modes
- `party-mega-catalog.js`: Anime-, Geld-, Ranking- und Social-Trends
- `party-viral-catalog.js`: Viral-, Preis-, Wissens- und Storyformate
- `party-routing.js`: Routingfassade plus Integration selbst erstellter Spiele
- `party-release-structure.js`: 15 Kernspiele, 13 Erweiterungen, 17 Labs und kombinierter Altersfilter
- `party-filter-state.js`: normalisierte lokale Katalogfilter und letzte Hub-Ansicht
- `party-search-assist.js`: Synonyme, Tippfehlertoleranz und barrierearme Suchvorschläge
- `party-hub.js`: Katalog und einfache Spiele
- `party-hub-plus.js`: Einstellungen, Statistik, Erfolge und Installation
- `party-hub-polish.js`: kontextabhängige Aktionen und Hilfelader
- `party-guide.js`: Onboarding, kurze Erklärungen und Creator-Einstiege
- `party-custom-packs.js`: eigene Packs mit Transaktionsschutz
- `party-night.js`: Planung und Fortschritt
- `party-data-tools.js`: Gesamtsicherung und Löschung

Der Hub lädt Erweiterungen in kontrollierter Reihenfolge: Reifestufenstruktur, gespeicherter Filterzustand, Suchhilfe. Fällt eine Komfortschicht aus, bleibt der Basiskatalog nutzbar.

### Game-Creator

- `game-creator.js`: reine Validierung, Speicherung, Export, Import und Katalogabbildung
- `creator-page.js`: vierstufiger Wizard und lokale Bibliothek
- `creator.html`: semantische Creator-Oberfläche
- `creator.css`: responsive Vorschau und Bedienung
- `party-created-modes.js`: eigene wiederaufnehmbare Spielengine für alle sechs Vorlagen

Der Creator unterstützt Fragen, Auswahl, Erraten, Challenges, Story und Debatte. Neue Creator-Vorlagen werden nur ergänzt, wenn sie auf einer klaren Engine basieren und migrationsfähig bleiben.

### Spielengines und Abschlussregister

- `session-ledger.js`: stabile Session- und Abschluss-IDs sowie genau-einmal-Aktualisierung von Verlauf, zuletzt gespielt und Statistik
- `party-advanced.js` und `party-advanced-runner.js`: komplexe Rollen- und Täuschungsspiele
- `party-quick-modes.js`: zehn klassische Quick Modes
- `party-mega-modes.js`: neun Trend-Modi
- `party-viral-modes.js`: acht Viral-Modi
- `party-created-modes.js`: selbst erstellte Fragen-, Auswahl-, Erraten-, Challenge-, Story- und Debattenspiele
- `quick-loader.js`: lädt zuerst das gemeinsame Session-Ledger und danach genau eine passende Engine

Creator, Quick, Mega und Viral verwenden denselben direkten Abschlussvertrag. Keine Engine erzeugt beim wiederholten Abschlussversuch eine neue zufällige Verlaufs-ID. Ein globales Überschreiben von `Storage.prototype`, Engine-Methoden oder Browser-APIs zur nachträglichen Korrektur von Fachlogik ist verboten.

Neue Mechanikfamilien erhalten eigene Module. Produktionsmodule bleiben unter 1000 Zeilen und 100 KB.

## 5. Reine Logik vor DOM-Logik

Planung, Validierung, Suche, Migration und Zustandsübergänge sollen ohne Browser testbar sein. DOM-Code erstellt Elemente, verbindet Ereignisse und zeigt Status; er dupliziert keine abweichenden Regeln.

## 6. Lokale Transaktionen

Kritische Vorgänge validieren zuerst, erfassen den alten Zustand, schreiben vollständig und stellen bei Fehlern den vorherigen Stand wieder her. Das gilt für Import, Löschung, Sessionabschluss, eigene Packs, eigene Spiele und Inhaltsmigrationen.

Sessionabschlüsse schreiben Verlauf und Statistik genau einmal. Der Ablauf lautet:

1. stabile Abschluss-ID aus Engine, Spiel und Session erzeugen,
2. nächsten Hub-Zustand rein über `recordCompletion` berechnen,
3. Hub atomar speichern,
4. aktiven Abschluss als verbucht speichern,
5. aktive Session entfernen,
6. bei fehlgeschlagener Bereinigung den letzten aktiven Zustand wiederherstellen.

Jede neue echte Session erhöht `plays` genau um eins; ein Neuladen oder wiederholter Abschlussversuch erzeugt weder einen zweiten Verlaufseintrag noch zusätzliche Runden.

## 7. Bedienbarkeitsvertrag

- Hauptaufgaben sind in höchstens drei bis vier klaren Schritten erreichbar
- jede Seite erklärt kurz ihren Zweck
- Fachbegriffe erhalten direkte Hilfen
- Buttons benennen die konkrete nächste Aktion
- leere Zustände erklären, wie Inhalte entstehen
- wichtige Regeln stehen vor dem Start in Kurzform
- progressive Offenlegung statt langer Formulare auf einmal
- Nutzer können jederzeit zurück, abbrechen oder Daten sichern
- Suchvorschläge bleiben optional und vollständig per Tastatur bedienbar
- direkte URL-Navigation besitzt Vorrang vor einer gespeicherten letzten Ansicht

## 8. Datenschutz durch Architektur

- keine Analyse- oder Werbeskripte
- keine externen Schriftarten oder Laufzeit-CDNs
- keine versteckten Netzwerkaufrufe
- dynamische Nutzerdaten über `textContent`
- restriktive Content Security Policy
- alle App-Daten über `secret-circle-` auffindbar und löschbar
- Creator lädt keine Bilder automatisch hoch
- Fan-Quiz enthält keine fremden Bilder, Logos, Zitate oder Mediendateien
- Geld-Challenges bleiben hypothetisch
- Preisfragen verwenden feste Spielwerte

## 9. Offline- und Updatevertrag

Jede Version besitzt einen eindeutigen Cache, listet alle Kernressourcen auf, entfernt alte Caches, erhält lokale Daten und ermöglicht Rollback über eine erneut erhöhte Cache-Version. Aktueller Offline-Core: `secret-circle-v30`.

Creator, Hilfesystem, Release-Tiers, Filterzustand, Suchhilfe, Session-Ledger, alle Spielengines, Datenschutz und Kernseiten gehören zum Offline-Core. Nicht mehr verwendete Übergangsmodule werden aus Code, Tests, Loader und Cache entfernt.

Eine neue Version wird zuerst in einem Staging-Cache vollständig vorbereitet. Sie wird erst nach sichtbarer Zustimmung aktiviert. Der aktive Offline-Core wird nicht vor erfolgreicher Übernahme gelöscht.

## 10. Accessibility als Definition of Done

Jede Oberfläche benötigt semantische Überschriften, beschriftete Felder, Tastaturbedienung, sichtbaren Fokus, mindestens 44 × 44 Pixel große Touchziele, Reduced Motion, 200-Prozent-Zoom, verständliche Statusmeldungen sowie Smartphone- und Desktopprüfung. Farbe allein darf keinen Status erklären.

Dynamische Suchvorschläge verwenden eine ARIA-Listbox, einen nachvollziehbaren aktiven Eintrag und die Tasten Pfeil hoch, Pfeil runter, Enter und Escape.

## 11. Inhaltsvertrag

- keine proprietären Karten, Texte, Bilder, Logos, Zitate oder Audios anderer Apps kopieren
- allgemein bekannte Namen nur in klar inoffiziellem textbasiertem Fan-Kontext
- jede Karte besitzt ein eigenes redaktionelles Ziel
- Altersstufe und sensible Themen werden dokumentiert
- strukturierte Modi verwenden strukturierte Daten
- Nutzerpacks und selbst erstellte Spiele bleiben von eingebauten Inhalten getrennt
- öffentliche oder kommerzielle Fan-Inhalte benötigen eigene Rechtsprüfung

## 12. Asset- und Animationsvertrag

`ASSET_PLAN.md` definiert Icons, Illustrationen, Motion, Budgets und Dateistruktur. Kernfunktionen bleiben ohne Bilder und Animationen verständlich. Animationen blockieren keine Eingabe und beachten Reduced Motion.

## 13. Testpyramide

Bei jedem Commit: Syntax, Unit-Tests, Strukturvalidator, Release-Audit und Performancebudget. Bei Release Candidates zusätzlich Chromium, Firefox, WebKit, Android-/iPhone-Simulation, echte Geräte, Offline-Update sowie kleine und große Partytests. Datenänderungen benötigen Korruptions-, Quota-, Rollback- und Größenprüfungen.

Sessiontests prüfen alle vier schnellen Enginefamilien auf stabile Session-IDs, deterministische Migration alter Sessions, genau einen Verlaufseintrag, genau eine Statistikaktualisierung und Wiederherstellung bei fehlgeschlagener Bereinigung.

Creator-spezifische E2E-Prüfungen decken Wizard, strukturierte Karten, Offline-Start, Wiederaufnahme, Sanitizing, exakte Verlaufseinträge und wiederholte Statistik ab. Hub-E2E-Prüfungen decken Filterwiederherstellung, URL-Priorität, kombinierte Alters-/Reifestufenfilter sowie Suchvorschläge mit Maus und Tastatur ab.

## 14. Performancebudget

Neue Module und Assets erhalten eigene Budgets. Keine großen Frameworks, Videos oder Mediendateien ohne messbaren Nutzen, Kompression und Audit. Wachstum des Offline-Cores bleibt sichtbar.

## 15. Erweiterungspunkte

Lokalisierte Inhalte, optionale Sounds, strukturierte Editoren, Teams, Turniere, Tageschallenges, Raumcodes, moderierte Inhaltsupdates und lokale Kartenbewertungen dürfen den vollständig lokalen Modus nicht ersetzen.

## 16. Deprecation und Rollback

Veraltete Funktionen werden markiert, migriert, mindestens einen Beta-Zyklus beobachtet, dokumentiert entfernt und mit Rollback geprüft. Keine Force-Pushes auf Release-Branches und keine stillen nicht migrierbaren Datenlöschungen.

Ein Übergangsmodul darf nur existieren, solange die Zielmodule noch nicht direkt migriert sind. Nach direkter Migration wird es aus Runtime, Offline-Core, Tests, Budgets und Dokumentation entfernt.

## 17. Releaseentscheidung

Eine Funktion ist erst fertig, wenn Verhalten und Fehlerzustände implementiert, Datenmigration geklärt, Offline-Betrieb und Accessibility geprüft, relevante Tests vorhanden, Dokumentation und Datenschutz angepasst und reale Nutzung beobachtet wurden.
