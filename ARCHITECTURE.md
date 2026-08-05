# Secret Circle – Architekturvertrag für langfristige Wartbarkeit

Dieses Dokument beschreibt die technischen Regeln, die Secret Circle auch nach vielen Jahren verständlich, migrierbar und testbar halten sollen.

## 1. Produktgrenzen

Secret Circle bleibt im Kern:

- offline-first,
- ohne verpflichtendes Konto,
- ohne externe Laufzeitabhängigkeiten,
- als statische PWA auslieferbar,
- auf einem gemeinsam genutzten Gerät vollständig spielbar,
- mit klar getrennten optionalen Erweiterungen.

Ein späterer Online-Mehrspielermodus darf den lokalen Modus nicht ersetzen. Er muss als separates Modul funktionieren und bei Serverausfall vollständig deaktivierbar sein.

## 2. Stabile Identitäten

Folgende IDs sind interne Verträge und dürfen nicht ohne Migration geändert werden:

- Spiel-IDs wie `imposter`, `charades` oder `question-imposter`,
- Pack-IDs und Packnamen in gespeicherten Sessions,
- Speicherpräfix `secret-circle-`,
- Backupformat `secret-circle-complete-backup`,
- Manifest-ID und PWA-Scope.

Anzeigenamen dürfen geändert oder übersetzt werden. Persistierte IDs bleiben stabil.

## 3. Versionierte Daten

Jeder dauerhaft gespeicherte komplexe Datensatz besitzt eine Versionsnummer.

Aktuelle Bereiche:

- Word-Imposter-Schema Version 7,
- erweiterte Session Version 2,
- Party Hub Version 1,
- Party Night Version 1,
- eigene Hub-Packs Version 1,
- Gesamtsicherung Version 1.

Regeln:

1. neue Felder erhalten sichere Standardwerte,
2. alte gültige Daten werden migriert,
3. unbekannte neuere Versionen werden nicht blind überschrieben,
4. beschädigte Daten werden isoliert verworfen,
5. Migrationen werden mit realistischen alten Snapshots getestet,
6. ein Schema wird erst entfernt, wenn eine dokumentierte Export-/Import-Alternative existiert.

## 4. Modulgrenzen

### Word Imposter

- `game-engine.js`: reine Regeln und Zustandsübergänge
- `role-assignment.js`: unabhängige Rollenverteilung
- `data-store.js`: Migration, Validierung und Sicherung
- `app.js`: Browseroberfläche und Orchestrierung

### Party Hub

- `party-catalog.js`: Basisspiele und Inhalte
- `party-expansion.js`: zusätzliche Spiele und Inhalte
- `party-routing.js`: stabile Fassade und Routing
- `party-hub.js`: einfache Spiele und Hub-Zustand
- `party-hub-plus.js`: Einstellungen, Statistik, Erfolge und Installation
- `party-custom-packs.js`: eigene Inhalte mit Transaktionsschutz
- `party-night.js`: reine Planung, Fortschritt und Browserintegration
- `party-data-tools.js`: Gesamtsicherung und vollständige Löschung

### Komplexe Spiele

- `party-advanced.js`: Spielregeln und Renderzustände
- `party-advanced-runner.js`: Session, Spieler-Snapshot und Verlauf
- `party-advanced-preferences.js`: Startwerte

Neue große Funktionen erhalten ein eigenes Modul. Bestehende Dateien werden nicht unbegrenzt erweitert.

## 5. Reine Logik vor DOM-Logik

Planung, Validierung, Migration, Rollenverteilung und Spielzustände sollen als testbare Funktionen ohne Browser verfügbar sein.

DOM-Code darf Elemente erstellen, Ereignisse verbinden, Status anzeigen und reine Funktionen aufrufen. DOM-Code darf keine zweite, abweichende Version der Spielregeln enthalten.

## 6. Lokale Transaktionen

Vorgänge über mehrere Speicherschlüssel folgen dem Muster:

1. Eingabe vollständig validieren,
2. alten Zustand erfassen,
3. neue Werte schreiben,
4. Ergebnis prüfen,
5. bei Fehler alten Zustand wiederherstellen,
6. fehlgeschlagenen Rollback deutlich melden.

Das gilt insbesondere für Gesamtsicherungsimport, vollständige Löschung, Sessionabschluss, eigene Packs und spätere Inhaltsmigrationen.

## 7. Datenschutz durch Architektur

- keine Analyse- oder Werbeskripte im Kernprodukt,
- keine externen Schriftarten oder Laufzeit-CDNs,
- keine versteckten Netzwerkaufrufe,
- dynamische Inhalte über `textContent`,
- restriktive Content Security Policy,
- Exportdateien klar als unverschlüsselt kennzeichnen,
- alle App-Daten über das Präfix `secret-circle-` auffindbar und löschbar halten.

Eine spätere optionale Cloud-Funktion benötigt ausdrückliche Aktivierung, eigene Datenschutzhinweise und eine vollständige lokale Alternative.

## 8. Offline- und Updatevertrag

Jede veröffentlichte Version muss:

- einen eindeutigen Service-Worker-Cache besitzen,
- alle benötigten Kernressourcen auflisten,
- alte Caches bei Aktivierung entfernen,
- Navigation offline auf eine sinnvolle Seite zurückführen,
- lokale Daten bei Updates erhalten,
- ein Rollback über eine erneut erhöhte Cache-Version ermöglichen.

Keine stillen Änderungen an offline benötigten Dateien nach einer veröffentlichten Cache-Version.

## 9. Accessibility als Definition of Done

Jede neue Oberfläche benötigt:

- semantische Überschriften,
- beschriftete Formularfelder,
- vollständige Tastaturbedienung,
- sichtbaren Fokus,
- mindestens 44 × 44 Pixel große Touchziele,
- reduzierte Bewegung,
- 200-Prozent-Zoom ohne horizontale Sackgassen,
- verständliche Live-Statusmeldungen,
- Tests auf Smartphone und Desktop.

Farbe allein darf nie den einzigen Statusunterschied darstellen.

## 10. Inhaltsvertrag

- keine proprietären Karten oder Texte anderer Apps kopieren,
- jede Karte besitzt ein eigenes redaktionelles Ziel,
- Dopplungen und nahezu gleiche Inhalte regelmäßig prüfen,
- Altersstufe und sensible Themen dokumentieren,
- strukturierte Spielmodi verwenden strukturierte Daten statt Freitext-Tricks,
- Nutzerpacks bleiben klar von eingebauten Inhalten getrennt.

## 11. Testpyramide

### Bei jedem Commit

- JavaScript-Syntax,
- Unit-Tests,
- Strukturvalidator,
- Release-Audit,
- Performancebudget.

### Bei jedem Release Candidate

- vollständige Chromium-E2E-Suite,
- Firefox und WebKit,
- Android- und iPhone-Simulation,
- echte Android- und iOS-Geräte,
- Offline-Installation und Update,
- kleiner und großer Partytest.

### Für kritische Datenänderungen

- alte Snapshots,
- beschädigte Daten,
- Quota- und Schreibfehler,
- fehlgeschlagener Rollback,
- Mehrbyte- und Größenlimits.

## 12. Performancebudget

- neue Module erhalten ein eigenes Dateibudget,
- keine großen Frameworks ohne messbaren Produktgewinn,
- keine Bilder oder Videos im Kerncache ohne Kompression und Budget,
- keine ungenutzten Bibliotheken,
- Offline-Core-Wachstum muss im Performanceaudit sichtbar sein.

## 13. Erweiterungspunkte

Langfristig sinnvolle Module:

- lokalisierte Inhaltsdateien,
- optionale Sound- und Haptikschicht,
- strukturierter Editor für Paar-, Rollen- und Tabu-Packs,
- Team- und Turniermodus,
- optionaler Raumcode-Mehrspielermodus,
- moderierte Inhaltsupdates,
- anonyme lokale Qualitätsbewertung von Karten.

Jeder Erweiterungspunkt muss ohne ihn weiterhin eine vollständige lokale App hinterlassen.

## 14. Deprecation und Rollback

Eine Funktion oder ein Schema wird nicht sofort entfernt.

1. als veraltet markieren,
2. Migration und Export anbieten,
3. mindestens einen Beta-Zyklus beobachten,
4. Entfernung dokumentieren,
5. Rollback testen.

Force-Pushes auf Release-Branches und nicht migrierbare stille Datenlöschungen sind ausgeschlossen.

## 15. Releaseentscheidung

Eine Funktion ist erst fertig, wenn Verhalten implementiert, Fehlerzustände behandelt, Datenmigration geklärt, Offline-Betrieb und Accessibility geprüft, Unit- und Browsertests vorhanden, Dokumentation und Datenschutz angepasst und reale Nutzung mindestens einmal beobachtet wurden.
