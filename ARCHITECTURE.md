# Secret Circle – Architekturvertrag für langfristige Wartbarkeit

Dieses Dokument beschreibt die Regeln, die Secret Circle auch nach vielen Jahren verständlich, migrierbar, offline nutzbar und testbar halten sollen.

## 1. Produktgrenzen

Secret Circle bleibt im Kern offline-first, ohne verpflichtendes Konto, ohne externe Laufzeitabhängigkeiten, als statische PWA auslieferbar und auf einem gemeinsam genutzten Gerät vollständig spielbar. Spätere Onlinefunktionen bleiben optionale getrennte Module.

## 2. Stabile Identitäten

Spiel-IDs, Pack-IDs, Speicherpräfix `secret-circle-`, Backupformat, Manifest-ID und PWA-Scope sind interne Verträge. Anzeigenamen dürfen sich ändern; persistierte IDs benötigen bei Änderungen eine Migration.

## 3. Versionierte Daten

Aktuelle Bereiche:

- Word-Imposter-Schema Version 7
- Advanced-Session Version 2
- Party Hub Version 1
- Party Night Version 1
- klassische Quick-Session Version 1
- Mega-Trend-Session Version 1
- eigene Hub-Packs Speicherschema Version 1, Manager Version 3
- Gesamtsicherung Version 1

Neue Felder erhalten sichere Standardwerte. Beschädigte Daten werden isoliert verworfen. Unbekannte neuere Versionen werden nicht blind überschrieben. Migrationen benötigen realistische alte Snapshots.

## 4. Modulgrenzen

### Word Imposter

- `game-engine.js`: Regeln und Zustandsübergänge
- `role-assignment.js`: unabhängige Rollenverteilung
- `data-store.js`: Migration, Validierung und Sicherung
- `app.js`: Browseroberfläche

### Party Hub und Katalogschichten

- `party-catalog.js`: Basisspiele
- `party-expansion.js`: Advanced-Erweiterung
- `party-trending-catalog.js`: klassische Quick Modes
- `party-mega-catalog.js`: Anime-, Geld-, Ranking-, Social- und weitere Trend-Modi
- `party-routing.js`: stabile Routingfassade
- `party-hub.js`: Hub und einfache Spiele
- `party-hub-plus.js`: Einstellungen, Statistik, Erfolge und Installation
- `party-hub-polish.js`: kontextabhängige Aktionen
- `party-custom-packs.js`: eigene Inhalte mit Transaktionsschutz
- `party-night.js`: Planung und Fortschritt
- `party-data-tools.js`: Gesamtsicherung und Löschung

### Spielengines

- `party-advanced.js` und `party-advanced-runner.js`: komplexe Rollen- und Täuschungsspiele
- `party-quick-modes.js`: zehn klassische Quick Modes
- `party-mega-modes.js`: neun neue Trend-Modi
- `quick-loader.js`: lädt pro Quick-Seite genau eine Engine

Neue Mechanikfamilien erhalten eigene Module. Produktionsmodule bleiben unter 1000 Zeilen und 100 KB.

## 5. Reine Logik vor DOM-Logik

Planung, Validierung, Migration und Zustandsübergänge sollen ohne Browser testbar sein. DOM-Code erstellt Elemente, verbindet Ereignisse und zeigt Status; er dupliziert keine abweichenden Spielregeln.

## 6. Lokale Transaktionen

Kritische Vorgänge validieren zuerst, erfassen den alten Zustand, schreiben vollständig und stellen bei Fehlern den vorherigen Stand wieder her. Das gilt für Import, Löschung, Sessionabschluss, eigene Packs und Inhaltsmigrationen.

## 7. Datenschutz durch Architektur

- keine Analyse- oder Werbeskripte
- keine externen Schriftarten oder Laufzeit-CDNs
- keine versteckten Netzwerkaufrufe
- dynamische Texte über `textContent`
- restriktive Content Security Policy
- alle App-Daten über `secret-circle-` auffindbar und löschbar
- Fan-Quiz enthält nur Namen und eigene Beschreibungen, keine fremden Bilder, Logos, Zitate oder Mediendateien
- Geld-Challenges bleiben ausdrücklich hypothetisch und lösen keine Zahlung aus

## 8. Offline- und Updatevertrag

Jede Version besitzt einen eindeutigen Cache, listet alle Kernressourcen auf, entfernt alte Caches, erhält lokale Daten und ermöglicht Rollback über eine erneut erhöhte Cache-Version. Aktueller Offline-Core: `secret-circle-v27`.

## 9. Accessibility als Definition of Done

Jede Oberfläche benötigt semantische Überschriften, beschriftete Felder, Tastaturbedienung, sichtbaren Fokus, mindestens 44 × 44 Pixel große Touchziele, Reduced Motion, 200-Prozent-Zoom, verständliche Statusmeldungen sowie Smartphone- und Desktopprüfung. Farbe allein darf keinen Status erklären.

## 10. Inhaltsvertrag

- keine proprietären Karten, Texte, Bilder, Logos, Zitate oder Audios anderer Apps kopieren
- allgemein bekannte Namen werden nur in einem klar inoffiziellen textbasierten Fan-Quiz verwendet
- jede Karte besitzt ein eigenes redaktionelles Ziel
- Altersstufe und sensible Themen werden dokumentiert
- strukturierte Modi verwenden strukturierte Daten
- Nutzerpacks bleiben von eingebauten Inhalten getrennt
- öffentliche oder kommerzielle Fan-Inhalte benötigen vor Release eine eigene Rechtsprüfung

## 11. Testpyramide

Bei jedem Commit: Syntax, Unit-Tests, Strukturvalidator, Release-Audit und Performancebudget. Bei Release Candidates zusätzlich Chromium, Firefox, WebKit, Android-/iPhone-Simulation, echte Geräte, Offline-Update sowie kleine und große Partytests. Datenänderungen benötigen Korruptions-, Quota-, Rollback- und Größenprüfungen.

## 12. Performancebudget

Neue Module erhalten eigene Budgets. Keine großen Frameworks oder Medien ohne messbaren Nutzen, Kompression und Audit. Wachstum des Offline-Cores muss sichtbar bleiben.

## 13. Erweiterungspunkte

Lokalisierte Inhalte, optionale Sounds, strukturierte Editoren, Team- und Turniermodi, tägliche Challenges, optionale Raumcodes, moderierte Inhaltsupdates und lokale Kartenbewertungen dürfen den vollständig lokalen Modus nicht ersetzen.

## 14. Deprecation und Rollback

Veraltete Funktionen werden markiert, migriert, mindestens einen Beta-Zyklus beobachtet, dokumentiert entfernt und mit Rollback geprüft. Keine Force-Pushes auf Release-Branches und keine stillen nicht migrierbaren Datenlöschungen.

## 15. Releaseentscheidung

Eine Funktion ist erst fertig, wenn Verhalten und Fehlerzustände implementiert, Datenmigration geklärt, Offline-Betrieb und Accessibility geprüft, relevante Tests vorhanden, Dokumentation und Datenschutz angepasst und reale Nutzung beobachtet wurden.
