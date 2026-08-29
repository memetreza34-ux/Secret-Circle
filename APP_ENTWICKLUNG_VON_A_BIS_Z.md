# App-Entwicklung von A bis Z – Secret-Circle-Masterprozess

Stand: 16. August 2026

Dieses Dokument ist der verbindliche Entwicklungsprozess für Secret Circle und zugleich eine wiederverwendbare Anleitung für zukünftige Apps. Es beschreibt nicht nur, **was gebaut wird**, sondern wann eine Phase wirklich abgeschlossen ist.

Secret Circle dient als konkretes Referenzprojekt. Projektspezifische Entscheidungen dürfen sich ändern; die Qualitätslogik bleibt bestehen.

---

# 0. Grundregel: „Code vorhanden“ ist nicht „fertig“

Eine veröffentlichungsreife App braucht gleichzeitig:

- Produktklarheit
- UX und Design
- Architektur
- Datenintegrität
- Security und Privacy
- Contentqualität
- Accessibility
- Tests
- reale Geräte
- reale Nutzer
- reproduzierbaren Build
- Deployment/Rollback
- Legal/Third Party
- Support/Incident Response
- Maintenance

Ein grüner statischer Test ersetzt kein reales Gerät. Ein funktionierendes Gerät ersetzt kein Securityreview. Ein Dokument ersetzt keinen Nachweis.

---

# A. Querschnittsregeln – gelten in jeder Phase

Diese Themen werden **nicht erst am Ende** geprüft:

## Security

- Eingaben validieren
- untrusted Daten begrenzen
- keine Secrets committen
- Threat Model bei neuen Daten-/Netzwerk-/Berechtigungsflächen aktualisieren
- Dependencies minimieren und prüfen

## Privacy

- Datenminimierung
- klare lokale/Remote-Grenze
- sichere Löschung/Export/Import
- geheime Inhalte nie unnötig offen anzeigen
- persönliche Inhalte freiwillig und überspringbar

## Accessibility

- semantische Struktur
- Tastatur
- Fokus
- 44×44px kritische Touchziele
- Reduced Motion
- 200-%-Zoom/Reflow
- Screenreader-Smokes

## Testing

- Unit/Contract
- Integration
- E2E
- Cross-Browser
- reale Geräte
- reale Nutzer

## Performance

- Modul-/Assetbudgets
- keine reflexartige Budgeterhöhung
- Offline-Core bewusst klein halten

## Observability / Support

Auch ohne Tracking braucht ein Produkt einen Support-/Incidentweg. Telemetrie ist eine bewusste Produkt-/Privacyentscheidung, keine automatische Pflicht.

## Rechte / Provenienz

- keine ungeklärten Assets
- neue Releaseassets gleichzeitig inventarisieren
- konkrete Marken-/Franchise-/Award-/Eventreferenzen nur bewusst
- sichtbare Produktnamen auf Verwechslungsrisiken prüfen
- stabile technische IDs dürfen von sichtbaren Namen abweichen

---

# 1. Idee und Problem

Klare Antworten:

- welches Problem löst die App?
- warum ist es relevant?
- warum reicht die bestehende Lösung nicht?
- welches konkrete Ergebnis bekommt der Nutzer?

Dokument: `PRODUCT_BRIEF.md`.

Secret Circle: lokaler Party-Hub für einen ganzen Spieleabend statt nur eine Sammlung isolierter Minispiele.

**Exit:** Problem, Produktversprechen und Nicht-Ziele dokumentiert.

---

# 2. Zielnutzer und Nutzungsszenarien

Nicht nur „junge Leute“, sondern echte Situationen beschreiben:

- kleine Gruppe
- mittlere Gruppe
- große Gruppe
- privates Reveal
- Timer
- Reload
- Offline
- Abbruch
- Accessibility
- Creator

Dokument: `USER_SCENARIOS.md`.

**Exit:** reale Kernfälle inklusive Fehler-/Unterbrechungsfällen vorhanden.

---

# 3. Markt, Konkurrenz und Positionierung

Prüfen:

- direkte Konkurrenz
- indirekte Alternativen
- Baseline-Funktionen
- echte Differenzierung
- Naming-/Branding-Risiken

Secret Circle: „offline + kein Account + ein Gerät“ ist Baseline, nicht alleiniger USP. Differenzierung erfolgt über Hub-Tiefe, sichere Übergaben, Resume, lokale Datenkontrolle, Creator und Core-Qualität.

Dokument: `MARKET_RESEARCH.md`.

**Exit:** Positionierung ist konkret und wird bei neuen Markt-/Naming-Erkenntnissen zurück in Product Brief/UX gespielt.

---

# 4. Risiko-Register

Früh anlegen:

- Risiko
- Wahrscheinlichkeit
- Auswirkung
- Priorität
- Gegenmaßnahme
- Status
- Schließnachweis

Dokument: `RISK_REGISTER.md`.

P0/P1 wird nur mit überprüfbarem Nachweis geschlossen.

---

# 5. Plattform- und Environment-Strategie

Festlegen:

- Web/PWA/native
- Zielbrowser
- Zielgeräte
- Local/Test/Staging/Production
- Hosting
- Offline
- Update

Secret Circle V1: statische installierbare Offline-first-PWA.

Environment-Kette:

**Local → CI/Test → getrenntes HTTPS-Staging → RC → Production**

Dokumente: `PLATFORM_STRATEGY.md`, `ENVIRONMENTS.md`.

**Exit:** Zielplattform und Releaseweg sind eindeutig.

---

# 6. MVP / Release Scope

Klar trennen:

- Must-have
- Extended
- Labs/Experimente
- Nicht-Ziele

Secret Circle: 15 Core / 13 Extended / 17 Labs.

Dokumente: `RELEASE_SCOPE_2027.md`, `ROADMAP_2027.md`.

**Exit:** jede Funktion besitzt eine Prioritäts-/Reifestufe.

---

# 7. Requirements und Acceptance Criteria

Anforderungen als prüfbare Verträge formulieren.

Beispiel Timer:

- Pause friert fachliche Restzeit ein
- Reload stellt Restzeit sicher wieder her
- restaurierter Timer läuft nicht automatisch los

Dokument: `REQUIREMENTS.md`.

**Exit:** MUST-Anforderungen sind test-/abnahmefähig.

---

# 8. Informationsarchitektur / User Flow

Für jeden Kernflow:

- Einstieg
- Entscheidung
- Aktion
- Fehler
- Abbruch
- Resume
- Abschluss

Dokument: `UX_FLOW.md`.

**Exit:** Happy Path und kritische Nebenpfade beschrieben.

---

# 9. Wireframes / Designsystem / sichtbare Namen

Definieren:

- Typografie
- Farben/Tokens
- Abstände
- Cards
- Buttons
- Dialoge
- Fokus
- Touchziele
- responsive Regeln
- sichtbare Produktnamen

Technische IDs dürfen stabil bleiben, UX zeigt freigegebene Namen.

Secret Circle aktuell:

- `anime-guess` → **Anime-Archetypen erraten**
- `wavelength` → **Spektrum-Tipp**

Dokument: `DESIGN_SYSTEM.md`.

**Exit:** wiederverwendbare UI-/Naming-Regeln vorhanden.

---

# 10. Technische Architektur und ADRs

Festlegen:

- Modulgrenzen
- State
- Persistenz
- Datenfluss
- Offline
- APIs/Backend falls vorhanden
- Securitygrenzen

Große Entscheidungen als ADR dokumentieren:

```text
docs/adr/ADR-001-...
```

ADR enthält Kontext, Optionen, Entscheidung, Gründe, Nachteile und Konsequenzen.

Dokument: `ARCHITECTURE.md`.

**Exit:** Verantwortlichkeiten sind klar und Monolithwachstum besitzt Grenzen.

---

# 11. Datenmodell, Persistenz und Migration

Dokumentieren:

- Keys/IDs
- Schema-Versionen
- Normalisierung
- Migration
- Rollback
- Quota/Korruption
- Delete/Export/Import

Secret Circle: `BACKUP_SCHEMAS.md`, `backup-schema-registry.js`.

**Exit:** persistierte Daten besitzen stabile/versionierte Verträge.

---

# 12. Privacy / Legal früh

Prüfen:

- welche Daten?
- lokal/remote?
- Rechts-/Informationspflichten?
- Hostinglogs?
- Tracking/Cookies?
- Betreiberangaben?
- Supportkontakt?

Dokumente: `privacy.html`, `LEGAL_CHECKLIST.md`.

Keine Betreiber-/Kontaktangaben erfinden.

---

# 13. Repository und Supply Chain

Benötigt:

- saubere Branchstrategie
- PRs
- keine Secrets
- `.gitignore`
- gepinnte direkte Dependencies
- Lockfile
- reproduzierbare Installation
- Branch Protection
- Required Checks
- Dependency-/Lizenzinventar

Secret Circle aktuell: Lockfile/`npm ci` und Branch Protection sind noch Releaseblocker.

**Exit:** Build ist reproduzierbar und geschützt.

---

# 14. Entwicklungsumgebung

Ein neuer Entwickler muss wissen:

- Voraussetzungen
- Startbefehl
- Testbefehle
- Browser-/Playwrightsetup

Secret Circle lokal via HTTP; `file://` ist keine valide PWA-Testumgebung.

**Exit:** reproduzierbarer Dev-Start dokumentiert.

---

# 15. Feature-Entwicklungsloop

Für jedes Feature:

1. Acceptance Criteria
2. State/Daten
3. reine Fachlogik
4. Unit-/Contracttest
5. UI
6. Error Paths
7. E2E
8. Accessibility
9. Security/Privacy
10. Performance/Offline
11. Dokumentation
12. PR

Kein „erst alles bauen, später testen“.

---

# 16. Fehlerbehandlung und sichere Zustände

Systematisch testen:

- Netzwerk weg
- Speicher voll
- beschädigter Import
- falsche Version
- Berechtigung verweigert
- Abbruch
- Browser geschlossen
- Reload
- ungültige URL
- leere Daten
- lange Eingaben
- doppelte Aktion
- Update während aktiver Session

**Exit:** kritische Fehlerpfade besitzen sichere Nutzerzustände.

---

# 17. Security und Threat Modeling

Threat Model bereits bei Architektur starten:

- Assets/Daten
- Angriffsflächen
- untrusted Inputs
- Importdateien
- URLs
- Storage
- externe Schnittstellen
- Dependencies
- geheime Zustände

Dokumente: `SECURITY.md`, `THREAT_MODEL.md`.

**Exit:** bekannte High-Risiken gemindert und Release-Security-Gate definiert.

---

# 18. Tests / Testpyramide

Ebenen:

1. Syntax/static
2. Unit
3. Contract
4. Integration
5. E2E
6. Cross-Browser
7. echte Geräte
8. echte Nutzer

Ein Test, der nicht ausgeführt wurde, ist kein Pass.

Secret Circle: Actions `steps: []` bleibt externer P0-Blocker.

---

# 19. CI/CD

CI soll mindestens:

- Checkout
- Runtime-Setup
- reproduzierbare Dependencyinstallation
- Syntax
- Unit/Contract
- Validate/Audits
- E2E
- Artefakte bei Fehlern

Release erst mit echtem Runner.

Dokument: `CI_TROUBLESHOOTING.md`.

---

# 20. Accessibility

Automatisch und manuell:

- Semantik
- Labels
- Tastatur
- Fokus
- Screenreader
- Kontrast
- 200-%-Zoom/Reflow
- Reduced Motion
- 44px Touchziele
- Safe Areas
- Hoch/Querformat

Dokument: `ACCESSIBILITY.md`.

**Exit:** echte Zielgeräte + assistive Technik dokumentiert.

---

# 21. Performance / Ressourcenbudget

Definieren:

- Modulgrößen
- Assetgrößen
- Offline-Core
- Start-/Interaktionsbudget

Budget nicht reflexartig erhöhen; bei Wachstum Verantwortlichkeiten splitten.

**Exit:** Performance-Audit und reale Nutzung akzeptabel.

---

# 22. Offline / Unterbrechung / Resume

Prüfen:

- Offline-Neustart
- Reload
- Appwechsel
- Sperrbildschirm
- aktive Timer
- private Inhalte
- Update während Session
- alte Version → neue Version
- Rollback

**Exit:** reale Geräte-/Updatepfade bestanden.

---

# 23. Content / Altersstufen / Referenzen

Prüfen:

- Menge
- Duplikate
- Ton
- Safety
- Privacy
- Altersstufe
- Rechte
- Marken-/Franchise-/Award-/Eventreferenzen
- sichtbare Spielnamen

Secret Circle verwendet `CONTENT_AGE_POLICY.md`, `CORE_CONTENT_REVIEW.md`, `FAN_CONTENT_REVIEW.md`.

Wichtig: Eine spätere Runtime-Überschreibung entfernt einen konkreten Begriff nicht automatisch aus einer öffentlich ausgelieferten Source-JS-Datei. Finaler Build **und** ausgelieferte Sourceoberfläche müssen bewusst bewertet werden.

---

# 24. Third Party / Asset-Provenienz

Jedes Releaseasset inventarisieren:

- Pfad
- Creator
- Quelle
- Datum/Kontext
- Lizenz/Rechtebasis
- Commercial Use
- Attribution
- Ableitung

Secret Circle:

- `assets/manifests/asset-provenance.json`
- `scripts/asset_provenance_audit.py`

`unresolved` darf Entwicklung erlauben, aber finalen Asset-Sign-off blockieren.

---

# 25. Analytics / Telemetrie / Erfolgsmessung

Bewusst entscheiden:

- keine Analytics
- privacy-preserving Metriken
- externe Analytics

Produktmetriken von Qualitätsmetriken trennen.

Secret Circle V1 verwendet aktuell keine Analytics/Ads/Tracking.

---

# 26. Beta / reale Nutzer

Testgruppen und Szenarien vorab planen.

Secret Circle: `BETA_TEST_PLAN.md` mit kleinen/mittleren/großen Gruppen, Word Imposter, Mafia, Party Night, Creator, Geräten, Accessibility und PWA-Upgrades.

Bugs nach Severity klassifizieren.

**Exit:** keine offenen Critical/High Bugs und reale Kernflows ohne Entwicklerhilfe.

---

# 27. Release Management

Benötigt:

- Versionsnummer
- Freeze
- RC
- unveränderlicher Commit
- Tag
- Changelog
- Release Notes
- Rollback-/Hotfixweg

Nach Fix entsteht ein neuer RC.

---

# 28. Release Candidate Gate

RC nur freigeben, wenn derselbe Commit besitzt:

- grünes CI
- grünes Cross-Browser
- Lockfile/`npm ci`
- Branch Protection
- Geräte
- Accessibility
- Offline/Update/Rollback
- Content/Rechte
- Asset-Provenienz
- Legal/Support
- reale Gruppen
- keine Critical/High Bugs

Dokument: `RELEASE_CHECKLIST.md`.

---

# 29. Web/PWA-Publikation

Vor Production:

- HTTPS-Staging
- getrennte Origin
- Install
- Offline
- Service Worker
- Update
- Rollback
- Datenisolation

Dokumente: `ENVIRONMENTS.md`, `DEPLOYMENT.md`.

---

# 30. App-Store-Publikation – nur falls später gewählt

Dann zusätzlich:

- Store-Konten
- Bundle IDs
- Signing
- Privacy Labels
- Screenshots
- Altersfreigaben
- In-App Purchases/Restore/Refunds falls relevant
- Store Review

Secret Circle Januar 2027: **N/A als Releasevoraussetzung**.

---

# 31. Release Day

- exakt freigegebenen RC deployen
- HTTP/HTTPS Smoke
- Manifest/Icons
- Installation
- Offline
- Kernflows
- Supportkanal
- Release Notes
- Monitoring/Support beobachten

Kein „kleiner letzter Fix“ direkt in Production ohne neuen RC-Vertrag.

---

# 32. Support und Incident Response

Dokumente:

- `SUPPORT.md`
- `INCIDENT_RESPONSE.md`

Incidentablauf:

1. erkennen
2. Severity
3. eindämmen
4. Verantwortliche
5. Rollback/Hotfix
6. Kommunikation
7. Root Cause
8. Postmortem
9. Prävention

---

# 33. Maintenance / Migration / EOL

Regelmäßig:

- Dependencies
- Browser/PWA-Verhalten
- Datenmigrationen
- Backups
- Content
- Rechte/Assets
- Security
- Support

Dokument: `MAINTENANCE.md`.

---

# Secret Circle – aktueller A-bis-Z-Stand

Aktueller Offline-Core: **`secret-circle-v39`**.

Stark vorbereitet:

- Discovery / Positionierung
- Requirements / UX / Designsystem
- Architektur
- Session-/Resume-/Timerintegrität
- Security / Threat Model / Registry-v2-Backups
- quantitative Core-Content-Ziele
- 15/15 Core-Quellpass
- Accessibility-Contracts
- Beta-Plan
- Legal/Support/Incident/Maintenance
- Environment-/Deploymentvertrag
- Asset-Provenienz-/Placeholder-Gates
- reference-safe sichtbare Namen/Inhalte

Aktuelle Hauptblocker:

1. GitHub-Actions-Runner (`steps: []`)
2. `package-lock.json` + `npm ci`
3. Branch Protection
4. reale Geräte/PWA-Upgrades/Rollback
5. reale Accessibility
6. reale Gruppen
7. restlicher Extended/Labs-/Source-Rechtepass
8. Icon-/Asset-Provenienz
9. echte Betreiber-/Support-/Hostingangaben
10. HTTPS-Staging

## Aktuelle reference-safe Entscheidungen

- Word Imposter: `Bluetooth/Oscar/Formel 1` entfernt
- `anime-guess` sichtbar **Anime-Archetypen erraten**
- Viral-Sportreferenzen generisch
- Browser-Tabu `Chrome → Tab`
- interne ID `wavelength` sichtbar **Spektrum-Tipp**
- Classic Content Version 3

Historischer konkrete Anime-Basiscontent in einer tieferen ausgelieferten JS-Datei bleibt ein bewusster Source-Distribution-Restpunkt.

## Gesamtfreigabe

**NO_GO**, bis `RELEASE_CHECKLIST.md` für einen unveränderten RC-Commit vollständig und mit echten Nachweisen geschlossen ist.
