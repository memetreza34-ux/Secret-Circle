# App-Entwicklung von A bis Z

> Master-Anleitung für die Entwicklung einer App von der ersten Idee bis zur öffentlichen Veröffentlichung und Wartung.
>
> Diese Datei ist absichtlich allgemein gehalten, damit sie für **Secret Circle** und zukünftige App-Projekte wiederverwendet werden kann. Secret Circle dient dabei als konkretes Beispiel.

---

## 0. Ziel dieser Anleitung

Eine App ist nicht fertig, sobald sie „funktioniert“. Für eine belastbare Veröffentlichung müssen Produkt, Technik, Design, Datenschutz, Inhalte, Tests, Geräte, Deployment, Support und Wartung gemeinsam vorbereitet sein.

Diese Anleitung beantwortet deshalb für jede Phase:

1. **Was ist das Ziel?**
2. **Was muss konkret erledigt werden?**
3. **Welche Dokumente oder Dateien brauchen wir im GitHub-Repository?**
4. **Wann darf die nächste Phase beginnen?**
5. **Welche typischen Fehler müssen vermieden werden?**

Die Reihenfolge lautet:

**Idee → Problem → Zielgruppe → Plattform → Scope → Produktplan → UX → Architektur → Repository → Entwicklung → Daten → Sicherheit → Tests → Accessibility → Performance → Beta → Release Candidate → Veröffentlichung → Monitoring → Wartung**

---

# PHASE 1 – Idee und Problem definieren

## Ziel

Bevor Code geschrieben wird, muss klar sein, **welches Problem die App löst und warum jemand sie benutzen sollte**.

## Aufgaben

- App-Idee in einem Satz beschreiben.
- Hauptproblem definieren.
- Zielnutzer definieren.
- Hauptnutzen definieren.
- erklären, warum vorhandene Lösungen nicht ausreichen.
- festlegen, welchen konkreten Erfolg die App für den Nutzer erzeugt.
- prüfen, ob die Idee technisch und wirtschaftlich grundsätzlich realistisch ist.

## Pflichtfragen

- Wer benutzt die App?
- Welches Problem hat diese Person?
- Wie löst die App dieses Problem?
- Warum sollte die Person diese App statt einer Alternative benutzen?
- Was ist die eine wichtigste Funktion?
- Was darf die erste Version ausdrücklich **nicht** enthalten?

## Empfohlene GitHub-Datei

`PRODUCT_BRIEF.md`

Inhalt:

- Produktname
- Problem
- Zielgruppe
- Kernnutzen
- Hauptfunktionen
- Nicht-Ziele
- Erfolgskriterien
- Risiken

## Exit-Kriterium

Die App lässt sich in höchstens drei klaren Sätzen erklären.

---

# PHASE 2 – Zielgruppe und Nutzungsszenarien

## Ziel

Nicht für „alle“ entwickeln, sondern für konkrete Nutzer und reale Situationen.

## Aufgaben

- primäre Zielgruppe definieren.
- sekundäre Zielgruppen definieren.
- Alter, technische Erfahrung und Geräte berücksichtigen.
- typische Nutzungssituationen beschreiben.
- Probleme, Wünsche und Abbruchgründe sammeln.
- 5–10 reale Kern-Szenarien formulieren.

## Beispiel

Secret Circle:

- Gruppe sitzt gemeinsam in einem Raum.
- ein Smartphone wird geteilt.
- Internet kann fehlen.
- Nutzer wollen ohne Konto sofort spielen.
- Übergaben und geheime Inhalte müssen sicher funktionieren.

## Empfohlene GitHub-Datei

`USER_SCENARIOS.md`

## Exit-Kriterium

Für jede Kernfunktion existiert mindestens ein nachvollziehbares Nutzungsszenario.

---

# PHASE 3 – Markt, Konkurrenz und Positionierung

## Ziel

Verstehen, wo die App im Markt steht.

## Aufgaben

- direkte Konkurrenten auflisten.
- indirekte Alternativen auflisten.
- Funktionen vergleichen.
- Preis- und Geschäftsmodelle vergleichen.
- Nutzerbewertungen analysieren.
- häufige Beschwerden identifizieren.
- eigenes Alleinstellungsmerkmal formulieren.

## Prüfen

- Was machen Konkurrenten besser?
- Was machen sie schlecht?
- Was können wir einfacher machen?
- Was können wir lokal, schneller, sicherer oder günstiger machen?

## Empfohlene GitHub-Datei

`MARKET_RESEARCH.md`

## Exit-Kriterium

Die App besitzt mindestens einen klaren Grund, warum Nutzer sie wählen könnten.

---

# PHASE 4 – Plattform und Veröffentlichungsweg festlegen

## Ziel

Vor Architekturentscheidungen muss klar sein, **wo die App laufen und veröffentlicht werden soll**.

## Mögliche Wege

### Web-App / PWA

Benötigt typischerweise:

- Webhosting
- HTTPS
- Domain oder Hosting-URL
- responsive Oberfläche
- Web App Manifest
- Service Worker bei Offline-/PWA-Funktionen
- Icons
- Datenschutz- und Betreiberinformationen
- Browser- und Gerätetests

### Native Android-App

Zusätzlich typischerweise:

- Android-Projekt
- eindeutige App-ID / Package-ID
- Signierung
- Release-Build
- Store-Eintrag
- Screenshots und App-Icon
- Datenschutzangaben
- Testtracks / Beta
- Store-Prüfung

### Native iOS-App

Zusätzlich typischerweise:

- iOS-Projekt
- Bundle Identifier
- Signing / Zertifikate / Provisioning
- Release-Build
- Store-Eintrag
- Screenshots und App-Icon
- Datenschutzangaben
- TestFlight oder vergleichbarer Betaweg
- Store-Prüfung

### Hybrid / Wrapper

Eine Web-App kann später in eine native Hülle überführt werden. Dieser Weg darf jedoch nicht ungeplant eingeführt werden, weil Store-Regeln, Berechtigungen, Signing, Navigation und Offlineverhalten zusätzliche Verträge erzeugen.

## Secret Circle aktuell

Secret Circle ist als **statische offline-first PWA** ausgelegt und benötigt für den geplanten Web/PWA-Release keine native Store-App als Voraussetzung.

## Empfohlene GitHub-Datei

`PLATFORM_STRATEGY.md`

## Exit-Kriterium

Primäre Plattform, Releaseweg und unterstützte Mindestgeräte sind festgelegt.

---

# PHASE 5 – MVP und Release-Scope festlegen

## Ziel

Eine kleine, klare erste Version definieren statt endlos Funktionen hinzuzufügen.

## Kategorien

- **MUSS**: Ohne diese Funktion kann nicht veröffentlicht werden.
- **SOLL**: Wichtig, aber bei Bedarf verschiebbar.
- **SPÄTER**: bewusst nach Release.
- **NICHT GEPLANT**: gehört nicht zum Produkt.

## Aufgaben

- Kernfunktionen festlegen.
- optionale Funktionen trennen.
- experimentelle Funktionen markieren.
- Releaseverbote definieren.
- Funktionsfreeze-Datum festlegen.

## Empfohlene GitHub-Dateien

- `RELEASE_SCOPE.md`
- `ROADMAP.md`

Secret Circle besitzt dafür bereits:

- `RELEASE_SCOPE_2027.md`
- `ROADMAP_2027.md`

## Exit-Kriterium

Jede geplante Funktion gehört eindeutig zu einer Reifestufe.

---

# PHASE 6 – Anforderungen schreiben

## Ziel

Nicht nur Funktionen benennen, sondern definieren, **wie sie sich korrekt verhalten müssen**.

## Für jede Funktion dokumentieren

- Zweck
- Eingaben
- Ausgaben
- normale Abläufe
- Fehlerfälle
- Abbruch
- Wiederaufnahme
- Datenschutz
- Offlineverhalten
- Accessibility
- Grenzen
- Akzeptanzkriterien

## Beispiel Akzeptanzkriterium

Nicht:

> „Timer soll pausierbar sein.“

Sondern:

> „Wenn der Nutzer Pause drückt, darf sich die sichtbare Restzeit nicht verändern. Nach Fortsetzen läuft dieselbe Restzeit weiter. Ein Reload stellt die Runde pausiert wieder her.“

## Empfohlene GitHub-Dateien

- `REQUIREMENTS.md`
- funktionsspezifische Contract-Dokumente

## Exit-Kriterium

Kernfunktionen besitzen überprüfbare Akzeptanzkriterien.

---

# PHASE 7 – Informationsarchitektur und User Flow

## Ziel

Festlegen, wie Nutzer durch die App gelangen, bevor Screens gebaut werden.

## Aufgaben

- Hauptnavigation definieren.
- Startseite definieren.
- Kernaufgaben auf wenige Schritte reduzieren.
- Login / Onboarding entscheiden.
- leere Zustände definieren.
- Fehlerwege definieren.
- Zurück-, Abbruch- und Wiederaufnahmewege definieren.

## Dokumentieren

Für jede Hauptaufgabe:

`Start → Auswahl → Eingabe → Ergebnis → nächster sinnvoller Schritt`

## Empfohlene GitHub-Datei

`UX_FLOW.md`

## Exit-Kriterium

Die wichtigsten Aufgaben sind ohne Entwicklererklärung verständlich.

---

# PHASE 8 – Wireframes und Designsystem

## Ziel

Bevor Detaildesign entsteht, zuerst Struktur und Wiederverwendbarkeit sichern.

## Wireframes

Zuerst einfache Entwürfe für:

- Startseite
- Navigation
- Kernfunktion
- Einstellungen
- Fehlerzustand
- leeren Zustand
- Modal / Bestätigung
- mobile Ansicht

## Designsystem definieren

- Farben
- Typografie
- Abstände
- Radius
- Buttons
- Formulare
- Karten
- Dialoge
- Statusmeldungen
- Icons
- Motion
- Dark Mode
- Fokuszustände

## Regeln

- keine wichtige Information nur durch Farbe.
- Touchziele groß genug.
- Kontrast früh prüfen.
- mobile zuerst mitdenken.
- Animation darf Nutzung nicht blockieren.

## Empfohlene GitHub-Dateien

- `DESIGN_SYSTEM.md`
- `ASSET_PLAN.md`

Secret Circle besitzt bereits `ASSET_PLAN.md`, benötigt aber weiterhin reale visuelle Abnahme der finalen Kernoberflächen.

## Exit-Kriterium

Alle Kernkomponenten besitzen ein wiederverwendbares visuelles Muster.

---

# PHASE 9 – Technische Architektur

## Ziel

Verantwortlichkeiten festlegen, bevor Code zu einem Monolithen wächst.

## Entscheiden

- Frontend-Technologie
- Backend ja/nein
- Datenbank ja/nein
- Authentifizierung ja/nein
- lokale Speicherung
- Offlineverhalten
- APIs
- Datei-Uploads
- Benachrichtigungen
- Analytics
- Zahlungsanbieter
- KI-Dienste
- Cloudspeicher

## Architekturregeln

- Fachlogik getrennt von UI.
- Datenformate versionieren.
- stabile IDs verwenden.
- Module besitzen klare Verantwortung.
- Fehler dürfen keine Daten zerstören.
- Migrationen planen.
- sensible Daten minimieren.
- keine unnötigen externen Abhängigkeiten.

## Empfohlene GitHub-Datei

`ARCHITECTURE.md`

Secret Circle besitzt bereits einen umfangreichen Architekturvertrag.

## Exit-Kriterium

Für jede wichtige Verantwortung existiert genau ein klarer Eigentümer im Code.

---

# PHASE 10 – Datenmodell, Speicher und Migration

## Ziel

Daten dürfen nicht zufällig entstehen. Schon Version 1 braucht stabile Strukturen.

## Für jeden Datentyp definieren

- Schema
- Version
- Pflichtfelder
- optionale Felder
- IDs
- Größenlimits
- Validierung
- Migration
- Export
- Import
- Löschung
- Wiederherstellung

## Testfälle

- gültige Daten
- fehlende Felder
- beschädigte Daten
- alte Version
- unbekannte neuere Version
- voller Speicher
- abgebrochener Schreibvorgang
- doppelter Abschluss

## Empfohlene GitHub-Dateien

- `DATA_MODEL.md`
- `BACKUP_SCHEMAS.md`

## Exit-Kriterium

Jeder persistierte Datentyp ist versioniert, validierbar und löschbar.

---

# PHASE 11 – Datenschutz und Recht von Anfang an

## Ziel

Datenschutz nicht erst kurz vor Release ergänzen.

## Fragen

- Welche Daten werden gespeichert?
- Warum werden sie benötigt?
- Bleiben sie lokal oder verlassen sie das Gerät?
- Welche Drittanbieter erhalten Daten?
- Gibt es Analytics?
- Gibt es Werbung?
- Gibt es Accounts?
- Gibt es Standort, Kamera, Mikrofon oder Kontakte?
- Gibt es Kinder als Zielgruppe?
- Werden Inhalte anderer Marken oder Creator verwendet?

## Prinzipien

- Datenminimierung
- sichere Standardwerte
- klare Löschfunktion
- keine unnötigen Berechtigungen
- keine geheimen Netzwerkaufrufe
- Nutzereingaben sanitizen
- Drittanbieter dokumentieren

## Vor Veröffentlichung benötigt

Je nach Produkt und Rechtsraum unter anderem:

- Datenschutzerklärung
- notwendige Betreiber-/Impressumsangaben
- Lizenz
- Drittanbieterhinweise
- Supportkontakt
- Sicherheitskontakt
- Nutzungsbedingungen, falls erforderlich

Rechtliche Anforderungen können sich ändern und müssen vor der tatsächlichen Veröffentlichung erneut geprüft werden.

## Empfohlene GitHub-Dateien

- `PRIVACY.md`
- `LEGAL_CHECKLIST.md`
- `THIRD_PARTY_NOTICES.md`

## Exit-Kriterium

Alle Datenflüsse und Drittanbieter sind bekannt und dokumentiert.

---

# PHASE 12 – Repository professionell aufsetzen

## Ziel

Das Repository wird zur nachvollziehbaren Quelle des Produktzustands.

## Mindeststruktur

```text
README.md
PRODUCT_BRIEF.md
ROADMAP.md
RELEASE_SCOPE.md
ARCHITECTURE.md
DESIGN_SYSTEM.md
TEST_PLAN.md
RELEASE_CHECKLIST.md
DEPLOYMENT.md
CHANGELOG.md
KNOWN_LIMITATIONS.md
src/ oder Produktionsdateien
tests/
scripts/
.github/workflows/
```

## Git-Regeln

- `main` bleibt stabil.
- Funktionen auf Branches entwickeln.
- Pull Requests verwenden.
- keine Secrets committen.
- `.gitignore` pflegen.
- große Binärdateien vermeiden.
- Commit-Nachrichten verständlich halten.
- kritische Änderungen reviewen.
- Branch Protection vor Release aktivieren.

## Abhängigkeiten

- Versionen pinnen, wo Reproduzierbarkeit wichtig ist.
- Lockfile verwenden.
- CI mit reproduzierbarer Installation betreiben.

## Secret Circle aktuell

Offen bleibt insbesondere ein reproduzierbares `package-lock.json` und die geplante Umstellung auf `npm ci`.

## Exit-Kriterium

Ein neuer Entwickler kann Repository, Abhängigkeiten und Startprozess nachvollziehen.

---

# PHASE 13 – Entwicklungsumgebung

## Ziel

Lokale Entwicklung muss reproduzierbar sein.

## Dokumentieren

- benötigte Runtime-Versionen
- Installationsbefehl
- Entwicklungsstart
- Testbefehle
- Buildbefehl
- Umgebungsvariablen
- lokale Services
- Seed-/Testdaten

## Beispiel Secret Circle

```bash
python -m http.server 8080
```

Qualitätsbefehle aktuell unter anderem:

```bash
npm run check
npm test
npm run validate
npm run test:e2e
npm run test:cross-browser
```

## Exit-Kriterium

Das Projekt kann auf einem frischen Rechner anhand der Dokumentation gestartet werden.

---

# PHASE 14 – Entwicklungsreihenfolge

## Ziel

Nicht gleichzeitig alles bauen.

## Empfohlene Reihenfolge

1. Datenmodell
2. Kernlogik
3. Unit-Tests
4. minimale UI
5. Haupt-User-Flow
6. Fehlerfälle
7. Persistenz
8. Wiederaufnahme
9. Accessibility
10. responsive Verhalten
11. Performance
12. Polishing

## Entwicklungsloop pro Funktion

1. Akzeptanzkriterien lesen.
2. Daten-/State-Änderung definieren.
3. reine Logik implementieren.
4. Unit-Test schreiben.
5. UI anbinden.
6. Fehlerfälle ergänzen.
7. Browser-/E2E-Test ergänzen.
8. Dokumentation aktualisieren.
9. PR prüfen.

## Exit-Kriterium

Keine neue Kernfunktion wird ohne Tests und dokumentiertes Verhalten als fertig markiert.

---

# PHASE 15 – Fehlerbehandlung und sichere Zustände

## Ziel

Fehler sind Teil des Produkts.

## Pflichtfälle

- Netzwerk fehlt
- lokaler Speicher voll
- Import beschädigt
- API nicht erreichbar
- Berechtigung verweigert
- Session abgebrochen
- Browser/App geschlossen
- Reload mitten im Prozess
- ungültige URL
- leere Daten
- sehr lange Eingaben
- doppelte Aktion

## Regeln

- Nutzer bekommt verständliche Meldung.
- Datenverlust vermeiden.
- kritische Schreibvorgänge rollbackfähig machen.
- Wiederholung darf keinen doppelten Abschluss erzeugen.

## Exit-Kriterium

Für jeden kritischen Vorgang existiert mindestens ein definierter Fehler- und Wiederherstellungspfad.

---

# PHASE 16 – Sicherheit

## Ziel

Die App soll auch bei absichtlichen oder beschädigten Eingaben stabil bleiben.

## Prüfen

- Eingaben validieren.
- HTML-/Script-Injection verhindern.
- Secrets nie im Client oder Repository speichern.
- Abhängigkeiten minimieren.
- Content Security Policy nutzen, wenn passend.
- externe URLs kontrollieren.
- Dateiimporte streng validieren.
- Größenlimits setzen.
- Berechtigungen minimieren.
- Auth-/Session-Tokens sicher behandeln, wenn vorhanden.

## Empfohlene GitHub-Datei

`SECURITY.md`

## Exit-Kriterium

Keine kritische Nutzereingabe gelangt ungeprüft in sensible Logik oder Speicherung.

---

# PHASE 17 – Teststrategie

## Ziel

Nicht nur manuell klicken.

## Testpyramide

### 1. Syntax / statische Checks

Schnell bei jedem Commit.

### 2. Unit-Tests

Prüfen reine Logik:

- Berechnung
- Regeln
- Validierung
- Migration
- Sortierung
- State-Übergänge

### 3. Contract-Tests

Prüfen Architekturregeln:

- IDs
- Dateistruktur
- Modulgrenzen
- Offline-Core
- Größenbudgets
- Release-Scope

### 4. Integrationstests

Prüfen mehrere Module gemeinsam.

### 5. E2E-Browsertests

Prüfen echte Nutzerabläufe.

### 6. Cross-Browser

Mindestens die tatsächlich unterstützten Engines prüfen.

### 7. Echte Geräte

Emulation ersetzt kein reales Smartphone.

### 8. Reale Nutzer

Die App ohne Entwicklerhilfe testen lassen.

## Empfohlene GitHub-Dateien

- `TEST_PLAN.md`
- `MANUAL_TEST_PLAN.md`

## Exit-Kriterium

Kernfunktionen besitzen automatisierte und reale Abnahmepfade.

---

# PHASE 18 – CI/CD

## Ziel

Jeder wichtige Commit wird automatisch überprüft.

## CI sollte mindestens

- Repository auschecken
- Runtime installieren
- Abhängigkeiten reproduzierbar installieren
- Syntax prüfen
- Unit-Tests ausführen
- Architektur-/Release-Gates ausführen
- E2E-Tests ausführen
- Berichte als Artifact bereitstellen

## Vor Merge

- Pflichtchecks grün
- Branch Protection aktiv
- kein Merge bei kritischen Fehlern

## Secret Circle aktuell

CI-Workflows existieren, aber die GitHub-Actions-Ausführung ist aktuell **kein belastbarer Freigabenachweis**, solange Jobs vor Checkout ohne sichtbare Schritte enden.

## Exit-Kriterium

Ein fehlerhafter Commit kann nicht unbemerkt in die Releasebasis gelangen.

---

# PHASE 19 – Accessibility

## Ziel

Die App darf nicht nur für Maus und perfektes Sehvermögen funktionieren.

## Mindestprüfung

- semantisches HTML
- Labels
- vollständige Tastaturbedienung
- sichtbarer Fokus
- sinnvolle Fokusreihenfolge
- Screenreader-Smoke-Test
- ausreichender Kontrast
- Status nicht nur durch Farbe
- 200 % Zoom
- Reduced Motion
- große Touchziele
- Hoch-/Querformat
- kleine Displays
- Bildschirmtastatur
- Safe Areas

## Exit-Kriterium

Die Kernaufgabe kann ohne Maus und bei starkem Zoom abgeschlossen werden.

---

# PHASE 20 – Performance und Ressourcenbudget

## Ziel

Die App bleibt schnell, klein und vorhersehbar.

## Messen

- initiale Dateigröße
- JavaScript-Größe
- CSS-Größe
- Bilder
- Offline-Cache
- Startzeit
- Speicherverbrauch
- lange Tasks

## Regeln

- keine große Bibliothek ohne messbaren Nutzen.
- Bilder komprimieren.
- Videos nur mit klarer Begründung.
- Module statt Monolithen.
- Budgets automatisiert prüfen.

## Secret Circle

Das Repository besitzt bereits eigene Performancebudgets und feste Modulgrenzen.

## Exit-Kriterium

Kein Kernpfad überschreitet das definierte Performancebudget.

---

# PHASE 21 – Offline, Unterbrechung und Wiederaufnahme

## Ziel

Für Apps mit Offline- oder Sessioncharakter müssen Unterbrechungen explizit geplant werden.

## Prüfen

- Netzwerkverlust
- Tabwechsel
- Appwechsel
- Sperrbildschirm
- Reload
- Browser-Neustart
- PWA-Neustart
- Update während aktiver Session

## Fragen

- Was wird gespeichert?
- Was darf aus Datenschutzgründen nicht offen wieder erscheinen?
- Läuft ein Timer weiter oder pausiert er?
- Was passiert bei einer alten Sessionversion?

## Exit-Kriterium

Jede aktive Kernsession besitzt einen dokumentierten Resume-Vertrag.

---

# PHASE 22 – Inhalte und Content-Qualität

## Ziel

Technisch korrekter Code kann durch schlechte Inhalte trotzdem ein schlechtes Produkt ergeben.

## Prüfen

- doppelte Inhalte
- schwache Inhalte
- unverständliche Formulierungen
- falsche Altersstufe
- sensible Inhalte
- problematische Marken-/Fan-Inhalte
- Urheberrecht
- unangenehme Aufgaben ohne Skip
- zu kleine Packs
- zu häufige Wiederholungen

## Content-Regel

Jede Karte, Frage oder Aufgabe braucht einen klaren Zweck und sollte sich von anderen Inhalten unterscheiden.

## Empfohlene GitHub-Datei

`CONTENT_GUIDE.md`

## Exit-Kriterium

Alle Releaseinhalte wurden redaktionell und rechtlich eingeordnet.

---

# PHASE 23 – Analytics, Telemetrie und Support bewusst entscheiden

## Ziel

Nicht automatisch Tracking hinzufügen.

## Entscheiden

- Brauchen wir Analytics überhaupt?
- Welche Produktfragen sollen beantwortet werden?
- Können wir sie ohne personenbezogenes Tracking beantworten?
- Wie werden Fehler gemeldet?
- Wie erreichen Nutzer den Support?

## Wenn Analytics genutzt wird

- Zweck dokumentieren.
- Daten minimieren.
- Rechtsgrundlage und Einwilligung prüfen.
- Anbieter dokumentieren.
- Datenschutz aktualisieren.

## Secret Circle

Aktuelles Produktprinzip: keine Analyse-, Werbe- oder Trackingdienste.

## Exit-Kriterium

Tracking existiert nur, wenn sein Nutzen und seine Datenschutzfolgen bewusst entschieden wurden.

---

# PHASE 24 – Beta und reale Nutzer

## Ziel

Fehler finden, die Entwickler selbst nicht sehen.

## Testgruppen

- kleine Gruppe
- mittlere Gruppe
- große Gruppe
- unerfahrene Nutzer
- verschiedene Geräte
- verschiedene Altersgruppen, wenn relevant

## Beobachten

- Wo fragt jemand nach Hilfe?
- Wo klickt jemand falsch?
- Welche Texte werden nicht verstanden?
- Wo dauert etwas zu lange?
- Wo wird eine Aktion versehentlich ausgelöst?
- Welche Funktionen werden ignoriert?

## Fehler klassifizieren

- kritisch
- hoch
- mittel
- niedrig

## Exit-Kriterium

Keine kritischen oder hohen Probleme bleiben offen.

---

# PHASE 25 – Release-Management

## Ziel

Die Veröffentlichung ist ein kontrollierter Prozess, kein spontaner Upload.

## Benötigt

- Release-Scope
- Versionsnummer
- Code Freeze
- Release Candidate
- Release-Commit
- Release-Tag
- Changelog
- Release Notes
- Rollbackplan
- Hotfixplan

## Branch-Modell

Mindestens:

- stabile Hauptbranch
- Entwicklungsbranches
- Pull Requests
- geschützte Releasebasis

## Exit-Kriterium

Der zu veröffentlichende Commit ist eindeutig und reproduzierbar.

---

# PHASE 26 – Release Candidate

## Ziel

Eine Version erzeugen, die **inhaltlich und technisch genau der geplanten Veröffentlichung entspricht**.

## Ab jetzt keine neuen Funktionen

Erlaubt sind nur:

- Fehlerkorrekturen
- Contentkorrekturen
- Accessibility
- Performance
- Sicherheitskorrekturen
- rechtlich notwendige Änderungen
- Releaseautomatisierung

## RC-Abnahme

- CI grün
- Cross-Browser grün
- echte Geräte grün
- Offline/PWA grün
- Datenschutz final
- Recht final
- Inhalte final
- Screenshots final
- Icons final
- Release Notes final
- Backup/Rollback geprüft

## Exit-Kriterium

Nur noch GO oder NO_GO – keine Featurediskussion mehr.

---

# PHASE 27 – Veröffentlichung Web / PWA

## Voraussetzungen

- HTTPS
- finale Domain/URL
- Produktionskonfiguration
- Manifest korrekt
- Service Worker korrekt
- Icons korrekt
- Datenschutz erreichbar
- notwendige Betreiberinformationen erreichbar
- Supportkontakt erreichbar

## Nach Deployment prüfen

- alle Hauptseiten Status 200
- keine Konsolenfehler
- keine fehlenden Assets
- keine unerwarteten Netzwerkaufrufe
- Installation funktioniert
- Offline-Neustart funktioniert
- Update funktioniert
- Daten bleiben erhalten
- Hauptflow erneut komplett testen

## Rollback

Wenn ein kritischer Fehler entdeckt wird:

1. Veröffentlichung stoppen.
2. Ursache isolieren.
3. gezielten Revert / Hotfix erstellen.
4. Versions-/Cachewechsel sauber durchführen.
5. Datenschema kompatibel halten.
6. Smoke-Test durchführen.
7. Rollback dokumentieren.

---

# PHASE 28 – Veröffentlichung in App Stores

Diese Phase gilt nur, wenn eine native Android-/iOS-Veröffentlichung geplant ist.

## Benötigt typischerweise

- Entwicklerkonto beim jeweiligen Store
- eindeutige App-ID
- Signing
- Produktionsbuild
- Version und Buildnummer
- App-Name
- Beschreibung
- Kategorie
- Altersfreigabe
- App-Icon
- Screenshots
- Datenschutz-URL
- Support-URL
- Store-Datenschutzangaben
- Berechtigungsbegründungen
- Testrelease
- Review
- kontrollierter Rollout

Store-Regeln ändern sich. Vor jedem tatsächlichen Store-Release müssen die aktuellen offiziellen Anforderungen erneut geprüft werden.

## Exit-Kriterium

Store-Build und öffentlicher Eintrag entsprechen exakt derselben freigegebenen Produktversion.

---

# PHASE 29 – Veröffentlichungstag

## Checkliste

- [ ] Release-Commit festgelegt
- [ ] Release-Tag gesetzt
- [ ] Produktionsdeployment abgeschlossen
- [ ] Hauptseiten erreichbar
- [ ] Login/Start funktioniert
- [ ] Kernfunktion funktioniert
- [ ] Daten speichern
- [ ] Offline funktioniert, wenn vorgesehen
- [ ] Installation funktioniert, wenn vorgesehen
- [ ] Datenschutz/Impressum erreichbar
- [ ] Support erreichbar
- [ ] Release Notes veröffentlicht
- [ ] Fehlerkanal überwacht
- [ ] Rollback möglich

---

# PHASE 30 – Nach dem Release

## Ziel

Release ist der Beginn des Betriebs.

## Erste Tage

- kritische Fehler priorisieren.
- Supportmeldungen sammeln.
- Crash-/Fehlerdaten prüfen, falls vorhanden.
- keine hektischen Großfeatures hinzufügen.
- Hotfixes klein halten.

## Danach

- Backlog neu priorisieren.
- echte Nutzungsprobleme auswerten.
- technische Schulden dokumentieren.
- Abhängigkeiten aktualisieren.
- Plattformänderungen beobachten.
- Datenschutz und Recht regelmäßig prüfen.

## Empfohlene GitHub-Dateien

- `CHANGELOG.md`
- `KNOWN_LIMITATIONS.md`
- `POST_RELEASE.md`

---

# PHASE 31 – Wartung und Migration

## Ziel

Die App muss auch nach Monaten und Jahren aktualisierbar bleiben.

## Regeln

- Datenmigrationen versionieren.
- alte Formate nur kontrolliert entfernen.
- Deprecations dokumentieren.
- Abhängigkeiten regelmäßig prüfen.
- Browser-/OS-Änderungen testen.
- Backups kompatibel halten.
- Release Notes pflegen.
- Sicherheitsupdates priorisieren.

## Exit-Kriterium

Ein Update zerstört keine vorhandenen Nutzerdaten und besitzt einen Rollbackpfad.

---

# MASTER: Welche GitHub-Dokumente brauchen wir insgesamt?

Nicht jede kleine App braucht sofort jede Datei. Für ein ernsthaftes Release sollte jedoch jede Verantwortung irgendwo eindeutig dokumentiert sein.

| Bereich | Empfohlene Datei | Secret Circle aktuell |
|---|---|---|
| Produktidee | `PRODUCT_BRIEF.md` | teilweise über README/Release-Dokumente |
| Zielgruppe / Szenarien | `USER_SCENARIOS.md` | noch nicht zentral |
| Marktanalyse | `MARKET_RESEARCH.md` | noch nicht zentral |
| Plattformstrategie | `PLATFORM_STRATEGY.md` | indirekt dokumentiert |
| MVP / Scope | `RELEASE_SCOPE.md` | vorhanden als `RELEASE_SCOPE_2027.md` |
| Roadmap | `ROADMAP.md` | vorhanden als `ROADMAP_2027.md` |
| Anforderungen | `REQUIREMENTS.md` | verteilt über Contracts |
| UX-Flows | `UX_FLOW.md` | noch nicht zentral |
| Designsystem | `DESIGN_SYSTEM.md` | noch nicht zentral |
| Assets | `ASSET_PLAN.md` | vorhanden |
| Architektur | `ARCHITECTURE.md` | vorhanden |
| Datenmodelle | `DATA_MODEL.md` | verteilt |
| Backup/Migration | `BACKUP_SCHEMAS.md` | vorhanden |
| Sicherheit | `SECURITY.md` | noch nicht zentral |
| Datenschutz | `PRIVACY.md` / Produktseite | teilweise vorhanden |
| Recht | `LEGAL_CHECKLIST.md` | noch nicht zentral |
| Contentregeln | `CONTENT_GUIDE.md` | noch nicht zentral |
| Tests | `TEST_PLAN.md` | verteilt über Tests/Checklisten |
| manuelle Tests | `MANUAL_TEST_PLAN.md` | vorhanden bzw. vorbereitet |
| Releasefreigabe | `RELEASE_CHECKLIST.md` | vorhanden |
| Deployment | `DEPLOYMENT.md` | vorhanden, muss aktuell gehalten werden |
| bekannte Einschränkungen | `KNOWN_LIMITATIONS.md` | vorhanden |
| Änderungen | `CHANGELOG.md` | vorhanden |
| Support | `SUPPORT.md` | noch nicht zentral |
| langfristige Wartung | `MAINTENANCE.md` | noch nicht zentral |

---

# MASTER: Definition of Done für eine einzelne Funktion

Eine Funktion ist erst fertig, wenn:

- [ ] Zweck definiert
- [ ] Akzeptanzkriterien definiert
- [ ] normaler Ablauf funktioniert
- [ ] Fehlerfälle behandelt
- [ ] Eingaben validiert
- [ ] Datenmodell versionierbar
- [ ] Abbruch sicher
- [ ] Reload/Wiederaufnahme geklärt
- [ ] Unit-Test vorhanden, wenn Logik vorhanden
- [ ] Integrationstest vorhanden, wenn mehrere Module beteiligt
- [ ] E2E-Test vorhanden, wenn Kernflow betroffen
- [ ] Tastaturbedienung geprüft
- [ ] Fokus geprüft
- [ ] mobile Ansicht geprüft
- [ ] Datenschutz geprüft
- [ ] Performancebudget geprüft
- [ ] Dokumentation aktualisiert

---

# MASTER: Definition of Done für eine App vor Veröffentlichung

Eine App ist releasefähig, wenn mindestens:

## Produkt

- [ ] Problem und Zielgruppe klar
- [ ] Scope eingefroren
- [ ] Kernflows verständlich
- [ ] reale Nutzer getestet

## Technik

- [ ] reproduzierbarer Build / Start
- [ ] stabile Architektur
- [ ] Datenmigrationen definiert
- [ ] keine kritischen Speicherfehler
- [ ] keine offenen kritischen Sicherheitsprobleme

## Qualität

- [ ] Syntaxchecks grün
- [ ] Unit-Tests grün
- [ ] Integrationstests grün
- [ ] E2E grün
- [ ] unterstützte Browser/Plattformen grün
- [ ] reale Geräte geprüft

## UX / Accessibility

- [ ] Kernaufgaben ohne Entwicklerhilfe verständlich
- [ ] mobile Nutzung geprüft
- [ ] Tastatur geprüft
- [ ] sichtbarer Fokus
- [ ] Kontrast geprüft
- [ ] Reduced Motion berücksichtigt
- [ ] Screenreader-Smoke-Test durchgeführt

## Inhalte

- [ ] Inhalte redaktionell geprüft
- [ ] Altersstufen geprüft
- [ ] sensible Inhalte geprüft
- [ ] Rechte an Assets/Inhalten geklärt

## Datenschutz / Recht

- [ ] Datenschutzerklärung final
- [ ] notwendige Betreiberinformationen final
- [ ] Drittanbieter dokumentiert
- [ ] Lizenz final
- [ ] Supportkontakt final

## Release

- [ ] Version festgelegt
- [ ] Release-Commit festgelegt
- [ ] Release-Tag geplant/gesetzt
- [ ] Changelog final
- [ ] Release Notes final
- [ ] Rollback getestet
- [ ] Hotfixprozess vorbereitet

---

# Aktuelle A-bis-Z-Einordnung von Secret Circle

Diese Einschätzung beschreibt den aktuellen Repository-Stand und ist **keine Releasefreigabe**.

## Bereits stark aufgebaut

- klare Produktidee als gemeinsamer Party-Hub
- definierter Januar-2027-Releasezeitraum
- 15 priorisierte Kernspiele
- Release-Scope und Reifestufen
- umfangreicher Architekturvertrag
- versionierte lokale Daten und Backups
- Offline/PWA-Architektur
- Session- und Resume-Verträge
- umfangreiche Unit-, Contract- und E2E-Teststruktur
- Performance- und Architektur-Audits
- Release-Checkliste
- Rollbackgrundlagen

## Vor öffentlichem Release noch wesentlich offen

- GitHub-Actions-Runner muss Repository-Code tatsächlich ausführen.
- vollständiges `npm run ci` muss nachweislich grün sein.
- Cross-Browser-Tests müssen nachweislich grün sein.
- reproduzierbares `package-lock.json` und `npm ci` fehlen noch.
- Branch Protection und verpflichtende Checks fehlen noch.
- echte Android-/iPhone-/Tablet-Abnahme fehlt.
- Sperrbildschirm-/OS-Hintergrundverhalten muss real getestet werden.
- redaktionelle Prüfung aller Kerninhalte ist noch nicht abgeschlossen.
- Alters- und sensible Contentprüfung ist noch offen.
- finale Design-/Icon-/Asset-Abnahme ist noch offen.
- Datenschutz-/Betreiber-/Support-/Lizenzangaben müssen vor Veröffentlichung final bestätigt werden.
- reale Gruppentests sind noch nicht vollständig dokumentiert.
- Deployment-Dokumentation muss vor Release auf aktuelle PR-, Cache- und Versionsdaten synchronisiert werden.

## Aktueller Freigabestatus

**NO_GO für öffentliche Veröffentlichung**, solange diese Release-Gates nicht vollständig erfüllt sind.

---

# Empfohlene Arbeitsreihenfolge für Secret Circle ab jetzt

1. Master-Dokumentation konsolidieren.
2. CI-Runner reparieren.
3. `package-lock.json` erzeugen und CI auf `npm ci` umstellen.
4. Branch Protection aktivieren.
5. 15 Kernspiele komplett funktional abnehmen.
6. Punkte-/Siegerdarstellung visuell prüfen.
7. Inhalte und Altersstufen redaktionell prüfen.
8. UI/Design der Kernflows vereinheitlichen.
9. Accessibility vollständig prüfen.
10. Android, iPhone und Tablet real testen.
11. Offline-Update und Sperrbildschirm real testen.
12. kleine, mittlere und große Gruppentests durchführen.
13. Recht, Datenschutz, Support und Lizenz finalisieren.
14. Deployment-Dokumente auf den echten Releasezustand synchronisieren.
15. Code Freeze durchführen.
16. Release Candidate erzeugen.
17. vollständige Release-Checkliste unterschreiben/ausfüllen.
18. Produktionsdeployment durchführen.
19. Deployment-Smoke-Test durchführen.
20. Release taggen und Release Notes veröffentlichen.
21. Support und Hotfixprozess überwachen.

---

# Grundregel

> **Nicht „Kann die App starten?“ entscheidet über eine Veröffentlichung, sondern „Ist der komplette Produkt-, Technik-, Daten-, Qualitäts-, Geräte-, Inhalts-, Rechts- und Supportprozess nachweislich abgeschlossen?“**

Diese Datei ist der übergeordnete Prozess. Projektspezifische Detailregeln bleiben in den jeweiligen Architektur-, Test-, Content-, Deployment- und Release-Dokumenten.