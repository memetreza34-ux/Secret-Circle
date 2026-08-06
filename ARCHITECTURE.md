# Secret Circle – Architekturvertrag für langfristige Wartbarkeit

Dieses Dokument definiert die Regeln, die Secret Circle auch nach vielen Jahren verständlich, migrierbar, offline nutzbar und testbar halten sollen.

## 1. Produktgrenzen

Secret Circle bleibt offline-first, ohne verpflichtendes Konto, ohne externe Laufzeitabhängigkeiten, als statische PWA auslieferbar und auf einem gemeinsam genutzten Gerät vollständig spielbar. Spätere Online-, KI-, Kamera- oder Mehrgerätefunktionen bleiben optionale getrennte Module.

## 2. Stabile Identitäten

Spiel-IDs, Pack-IDs, Creator-Spiel-IDs, Speicherpräfix `secret-circle-`, Backupformat, Manifest-ID und PWA-Scope sind interne Verträge. Anzeigenamen dürfen sich ändern; persistierte IDs benötigen bei Änderungen eine Migration.

## 3. Versionierte Daten

Aktuelle Bereiche:

- Word-Imposter-Schema Version 7
- Advanced-Session Version 2
- Party Hub Version 1
- Party Night Version 1
- klassische Quick-Session Version 1
- Mega-Trend-Session Version 1
- Viral-Session Version 1
- Creator-Session Version 1
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
- `party-hub.js`: Katalog und einfache Spiele
- `party-hub-plus.js`: Einstellungen, Statistik, Erfolge und Installation
- `party-hub-polish.js`: kontextabhängige Aktionen und Hilfelader
- `party-guide.js`: Onboarding, kurze Erklärungen und Creator-Einstiege
- `party-custom-packs.js`: eigene Packs mit Transaktionsschutz
- `party-night.js`: Planung und Fortschritt
- `party-data-tools.js`: Gesamtsicherung und Löschung

### Game-Creator

- `game-creator.js`: reine Validierung, Speicherung, Export, Import und Katalogabbildung
- `creator-page.js`: vierstufiger Wizard und lokale Bibliothek
- `creator.html`: semantische Creator-Oberfläche
- `creator.css`: responsive Vorschau und Bedienung
- `party-created-modes.js`: eigene wiederaufnehmbare Spielengine für alle sechs Vorlagen

Der Creator unterstützt Fragen, Auswahl, Erraten, Challenges, Story und Debatte. Neue Creator-Vorlagen werden nur ergänzt, wenn sie auf einer klaren Engine basieren und migrationsfähig bleiben.

### Spielengines

- `party-advanced.js` und `party-advanced-runner.js`: komplexe Rollen- und Täuschungsspiele
- `party-quick-modes.js`: zehn klassische Quick Modes
- `party-mega-modes.js`: neun Trend-Modi
- `party-viral-modes.js`: acht Viral-Modi
- `party-created-modes.js`: selbst erstellte Fragen-, Auswahl-, Erraten-, Challenge-, Story- und Debattenspiele
- `quick-loader.js`: lädt pro Quick-Seite genau eine passende Engine

Neue Mechanikfamilien erhalten eigene Module. Produktionsmodule bleiben unter 1000 Zeilen und 100 KB.

## 5. Reine Logik vor DOM-Logik

Planung, Validierung, Migration und Zustandsübergänge sollen ohne Browser testbar sein. DOM-Code erstellt Elemente, verbindet Ereignisse und zeigt Status; er dupliziert keine abweichenden Regeln.

## 6. Lokale Transaktionen

Kritische Vorgänge validieren zuerst, erfassen den alten Zustand, schreiben vollständig und stellen bei Fehlern den vorherigen Stand wieder her. Das gilt für Import, Löschung, Sessionabschluss, eigene Packs, eigene Spiele und Inhaltsmigrationen.

Sessionabschlüsse schreiben Verlauf und Statistik genau einmal. Wiederholte Creator-Sessions erhöhen den Zähler jeweils um eins; ein Neuladen darf keinen zweiten Abschluss erzeugen.

## 7. Bedienbarkeitsvertrag

- Hauptaufgaben sind in höchstens drei bis vier klaren Schritten erreichbar
- jede Seite erklärt kurz ihren Zweck
- Fachbegriffe erhalten direkte Hilfen
- Buttons benennen die konkrete nächste Aktion
- leere Zustände erklären, wie Inhalte entstehen
- wichtige Regeln stehen vor dem Start in Kurzform
- progressive Offenlegung statt langer Formulare auf einmal
- Nutzer können jederzeit zurück, abbrechen oder Daten sichern

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

Creator, Hilfesystem, Creator-Spielengine, alle weiteren Spielengines, Datenschutz und Kernseiten gehören zum Offline-Core.

## 10. Accessibility als Definition of Done

Jede Oberfläche benötigt semantische Überschriften, beschriftete Felder, Tastaturbedienung, sichtbaren Fokus, mindestens 44 × 44 Pixel große Touchziele, Reduced Motion, 200-Prozent-Zoom, verständliche Statusmeldungen sowie Smartphone- und Desktopprüfung. Farbe allein darf keinen Status erklären.

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

Creator-spezifische E2E-Prüfungen decken Wizard, strukturierte Karten, Offline-Start, Wiederaufnahme, Sanitizing, exakte Verlaufseinträge und wiederholte Statistik ab.

## 14. Performancebudget

Neue Module und Assets erhalten eigene Budgets. Keine großen Frameworks, Videos oder Mediendateien ohne messbaren Nutzen, Kompression und Audit. Wachstum des Offline-Cores bleibt sichtbar.

## 15. Erweiterungspunkte

Lokalisierte Inhalte, optionale Sounds, strukturierte Editoren, Teams, Turniere, Tageschallenges, Raumcodes, moderierte Inhaltsupdates und lokale Kartenbewertungen dürfen den vollständig lokalen Modus nicht ersetzen.

## 16. Deprecation und Rollback

Veraltete Funktionen werden markiert, migriert, mindestens einen Beta-Zyklus beobachtet, dokumentiert entfernt und mit Rollback geprüft. Keine Force-Pushes auf Release-Branches und keine stillen nicht migrierbaren Datenlöschungen.

## 17. Releaseentscheidung

Eine Funktion ist erst fertig, wenn Verhalten und Fehlerzustände implementiert, Datenmigration geklärt, Offline-Betrieb und Accessibility geprüft, relevante Tests vorhanden, Dokumentation und Datenschutz angepasst und reale Nutzung beobachtet wurden.
