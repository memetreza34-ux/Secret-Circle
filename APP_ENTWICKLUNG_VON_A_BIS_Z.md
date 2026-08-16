# Secret Circle – App-Entwicklung von A bis Z

> Verbindlicher Entwicklungsstandard für Secret Circle vom Produktgedanken bis Betrieb und Wartung. Diese Datei darf weiterentwickelt werden, wenn neue Erkenntnisse entstehen. Sie ist kein statisches Tutorial, sondern der übergeordnete Arbeitsprozess des Projekts.

## 0. Produktziel und Releasegrenze

Secret Circle ist eine **offline-first Partyspiel-PWA für Gruppen, die gemeinsam auf einem Gerät spielen**. Der Januar-2027-Release priorisiert Qualität, Einfachheit, Privatsphäre, sichere geheime Inhalte, Wiederaufnahme und reale Gruppentauglichkeit vor maximaler Funktionsmenge.

Aktuelle Zieltermine:

- Funktionsfertig: **30. November 2026**
- Code Freeze: **5. Dezember 2026**
- Release Candidate: **15. Dezember 2026**
- öffentlicher Release: **4.–15. Januar 2027**

Für diesen Release gelten aktuell bewusst folgende Produktgrenzen:

- statische Web-App / installierbare PWA
- offline-first
- ein gemeinsam genutztes Gerät
- kein verpflichtendes Konto
- kein Backend als Releasevoraussetzung
- keine Cloud-Datenbank als Releasevoraussetzung
- keine Werbung
- keine Analytics-/Trackingdienste
- keine Zahlungen oder Abonnements
- keine native Android-/iOS-Store-App als Releasevoraussetzung
- keine externen Laufzeit-CDNs oder fremden Schriftarten

Wenn eine dieser Grenzen später geändert wird, müssen Architektur, Datenschutz, Security, Tests, Deployment und Release-Scope neu bewertet werden.

---

# A. Querschnittsverträge – gelten ab der ersten Zeile Code

Diese Themen sind **keine späten Phasen**. Jede Produkt-, Design- und Codeentscheidung muss sie berücksichtigen.

## A1. Security

- alle Nutzereingaben sind grundsätzlich nicht vertrauenswürdig
- keine Secrets im Repository oder Clientcode
- Dateiimporte vollständig vor dem Schreiben validieren
- HTML-/Script-Injection verhindern
- externe URLs und Netzwerkzugriffe bewusst begrenzen
- Berechtigungen minimieren
- kritische Datenänderungen rollbackfähig machen
- Abhängigkeiten und deren Risiken bewusst verwalten

Für neue Angriffsflächen wird ein Threat Model ergänzt.

## A2. Datenschutz

- nur Daten speichern, die für das Produkt notwendig sind
- lokale Speicherung bevorzugen
- Datenflüsse dokumentieren
- Löschung und Export ermöglichen, wo Daten persistiert werden
- keine versteckten Drittanbieter oder Netzwerkaufrufe
- neue externe Dienste erfordern vor Integration eine Datenschutzprüfung

## A3. Accessibility

Ab Wireframe und Komponentenentwurf berücksichtigen:

- semantische Struktur
- Labels
- Tastaturbedienung
- sichtbarer Fokus
- ausreichender Kontrast
- Status nicht nur über Farbe
- mindestens 44 × 44 Pixel Touchziele
- 200 % Zoom
- Reduced Motion
- Screenreader-Smoke-Test
- Safe Areas und Bildschirmtastatur

## A4. Testing

Testing beginnt mit der Anforderung, nicht nach Fertigstellung.

Für jedes Feature wird vor Implementierung geklärt:

- welche reine Logik Unit-Tests braucht
- welche Architekturregeln Contract-Tests brauchen
- welche Integrationen gemeinsam geprüft werden müssen
- welcher echte Nutzerflow E2E benötigt
- welche manuellen Geräte-/Gruppentests nötig sind

## A5. Performance

- Größenbudgets vor Wachstum definieren
- keine große Bibliothek ohne messbaren Nutzen
- keine schweren Assets ohne Kompression und Begründung
- Module statt Monolithen
- Offline-Core-Größe sichtbar halten

## A6. Datenintegrität

- stabile IDs
- versionierte Schemas
- Validierung vor Schreiben
- Migrationen für alte Daten
- unbekannte neuere Versionen nicht blind überschreiben
- exakte Einmaligkeit bei Abschlüssen
- Rollback bei fehlgeschlagenen kritischen Schreibvorgängen

---

# 1. Discovery – Problem, Zielgruppe und Positionierung

## Ziel

Bevor weitere Produktarbeit erfolgt, muss klar sein, welches Problem Secret Circle löst, für wen und warum die App gegenüber Alternativen relevant ist.

## Aufgaben

- Produktversprechen in maximal drei Sätzen definieren
- primäre und sekundäre Zielgruppen festlegen
- reale Nutzungssituationen beschreiben
- Hauptprobleme und Abbruchgründe erfassen
- direkte und indirekte Alternativen analysieren
- klare Positionierung formulieren
- Risiken früh identifizieren

## Pflichtdokumente

- `PRODUCT_BRIEF.md`
- `USER_SCENARIOS.md`
- `MARKET_RESEARCH.md`
- `RISK_REGISTER.md`

## Exit

Problem, Zielgruppe, Kernnutzen und wichtigste Risiken sind schriftlich eindeutig.

---

# 2. Produktstrategie – Scope, Erfolg und Nicht-Ziele

## Ziel

Klar definieren, was Januar 2027 sein soll und was bewusst später kommt.

## Aufgaben

- MUSS / SOLL / SPÄTER / NICHT GEPLANT trennen
- Kernspiele und Reifestufen definieren
- Releaseverbote festlegen
- Produkt-Erfolgskriterien definieren
- Qualitätsmetriken festlegen
- Monetarisierung bewusst entscheiden
- Mehrsprachigkeit bewusst entscheiden

## Secret Circle – aktuelle Entscheidungen

### Monetarisierung

Für Januar 2027: **keine Werbung, keine In-App-Käufe, kein Abo**. Eine spätere Monetarisierung ist eine neue Produkt-/Rechts-/Architekturentscheidung.

### Lokalisierung

Primärer Release: **Deutsch**. Weitere Sprachen erst nach einem eigenen Lokalisierungsvertrag; UI darf deshalb nicht unnötig von festen Textlängen abhängen.

## Pflichtdokumente

- `RELEASE_SCOPE_2027.md`
- `ROADMAP_2027.md`
- `PRODUCT_BRIEF.md`

## Exit

Jede sichtbare Funktion gehört eindeutig zum Release, zu einer Erweiterung, zu Labs oder zu später.

---

# 3. Plattformstrategie

## Ziel

Vor weiteren technischen Entscheidungen ist der Veröffentlichungsweg verbindlich.

## Secret Circle – Januar 2027

Primärplattform:

- responsive Web-App
- installierbare PWA
- HTTPS in Produktion
- Offlinebetrieb nach Installation/Vorladung

Zielgeräte:

- aktuelles Android/Chrome
- aktuelles iPhone/Safari
- Tablet/iPad
- Desktop-Browser für Entwicklung und optionale Nutzung

Nicht Releasevoraussetzung:

- Google Play Store
- Apple App Store
- nativer Wrapper

## Pflichtdokument

- `PLATFORM_STRATEGY.md`

## Exit

Zielplattform, Mindestgeräte, Browser und Deploymentweg sind eindeutig.

---

# 4. Anforderungen und Akzeptanzkriterien

## Ziel

Jede Kernfunktion erhält überprüfbares Verhalten statt nur einen Funktionsnamen.

Für jede Funktion dokumentieren:

- Zweck
- Eingaben
- Ausgaben
- Normalablauf
- Fehlerfälle
- Abbruch
- Wiederaufnahme
- Datenschutz
- Offlineverhalten
- Accessibility
- Performancegrenze
- Akzeptanzkriterien

Beispiel:

Nicht: „Timer soll pausierbar sein.“

Sondern: „Wenn Pause aktiviert wird, darf sich die sichtbare Restzeit nicht verändern. Fortsetzen verwendet dieselbe Restzeit. Ein Reload stellt die Runde bewusst pausiert wieder her.“

## Dokumente

- `REQUIREMENTS.md`
- funktionsspezifische Contract-Dokumente
- `CORE_GAME_ACCEPTANCE.md`
- `CORE_SCORING_RULES.md`

## Exit

Alle Release-Kernfunktionen besitzen testbare Akzeptanzkriterien.

---

# 5. UX, Informationsarchitektur und Design

## Ziel

Die wichtigsten Aufgaben müssen ohne Entwicklererklärung verständlich sein.

## Reihenfolge

1. Kernaufgaben definieren
2. Informationsarchitektur
3. User Flows
4. Wireframes
5. Komponenten
6. Designsystem
7. responsive Varianten
8. Accessibility-Abnahme
9. visuelles Polishing

## Kernflow Secret Circle

`App öffnen → Spieler festlegen → Spiel wählen → Pack/Optionen wählen → spielen → Ergebnis/Abschluss → Wiederholen/nächstes Spiel/Verlauf`

Für private Rollen oder Fragen kommt ein eigener Übergabe-/Reveal-Vertrag hinzu.

## Benötigte Dokumente

- `UX_FLOW.md`
- `DESIGN_SYSTEM.md`
- `ASSET_PLAN.md`

## Exit

Kernflows funktionieren auf kleinem Smartphone, Tablet und Desktop mit klarer Navigation, Fehlerführung und Fokusführung.

---

# 6. Architektur und Architecture Decision Records

## Ziel

Verantwortungen im Code eindeutig halten und wichtige Entscheidungen nachvollziehbar machen.

## Secret Circle – Kernarchitektur

- statische PWA
- lokale Daten
- kein verpflichtender Server
- getrennte Engine-/UI-Verantwortung
- versionierte lokale Schemas
- gemeinsame Session-Ledger- und Steuerungsverträge
- kontrollierter Service-Worker-Updatefluss

## ADRs

Größere irreversible oder weitreichende Entscheidungen erhalten bei Bedarf `docs/adr/ADR-XXX-*.md` mit:

- Problem
- betrachtete Optionen
- Entscheidung
- Gründe
- Nachteile
- Konsequenzen

## Backend/API-Regel

Für Januar 2027 **nicht anwendbar**. Falls später Backend, Auth, Mehrgeräte-Sync oder Cloud dazukommen, müssen vor Implementierung zusätzlich definiert werden:

- API-Verträge und Versionierung
- Authentifizierung und Autorisierung
- Rollen/Rechte
- Rate Limits
- Timeouts/Retry
- Idempotenz
- Datenbankmigrationen
- Transaktionen
- Backups und Restore
- Hintergrundjobs/Webhooks

## Dokumente

- `ARCHITECTURE.md`
- `DATA_MODEL.md`
- `BACKUP_SCHEMAS.md`
- `docs/adr/` bei Bedarf

## Exit

Jede wichtige Verantwortung hat einen klaren Eigentümer und Datenänderungen besitzen Migrations-/Rollbackregeln.

---

# 7. Security, Threat Modeling und Supply Chain

## Ziel

Sicherheitsrisiken werden systematisch statt reaktiv behandelt.

## Threat Model für Secret Circle

Mindestens betrachten:

- manipulierte Importdateien
- gespeicherte beschädigte Daten
- HTML-/Script-Injection über Creator-Inhalte
- fremde/unerwartete externe URLs
- Service-Worker-/Cache-Fehler
- Verlust lokaler Daten bei Migration
- Offenlegung geheimer Rollen/Inhalte nach Reload
- Dependency-/Build-Risiken

## Supply Chain

- Abhängigkeiten minimieren
- Lockfile verwenden
- reproduzierbare Installation
- bekannte Sicherheitslücken prüfen
- ungewartete Dependencies vermeiden
- Lizenzen dokumentieren
- keine unnötigen Postinstall-Skripte

## Secrets/Environments

Secret Circle benötigt für die statische Januar-Version aktuell keine Produktionssecrets. Falls später Secrets nötig sind:

- niemals committen
- `.env.example` ohne echte Werte
- Development/Test/Staging/Production trennen
- Secret Store verwenden
- Rotation und Widerruf planen

## Dokumente

- `SECURITY.md`
- `THREAT_MODEL.md`
- `THIRD_PARTY_NOTICES.md`

## Exit

Keine bekannte kritische Angriffsfläche ist ohne Gegenmaßnahme oder bewusste Risikoakzeptanz offen.

---

# 8. Repository, Entwicklungsumgebungen und Git-Prozess

## Ziel

Das Repository ist die nachvollziehbare Quelle des Produktzustands.

## Regeln

- stabile Hauptbranch schützen
- Features über Branches und Pull Requests
- keine Secrets
- `.gitignore` pflegen
- verständliche Commits
- kritische Änderungen reviewen
- Branch Protection vor Release
- reproduzierbares Lockfile
- CI mit `npm ci`, sobald Lockfile vorhanden

## Umgebungen

Für Secret Circle:

- Local: Entwicklung
- CI/Test: automatisierte Prüfungen
- Preview/Staging: releaseähnliche HTTPS-Prüfung vor Produktion
- Production: freigegebener unveränderlicher Release

Auch eine statische PWA braucht vor Veröffentlichung einen realistischen Preview-/Staging-Test, besonders für HTTPS, Service Worker, Cache und Updateverhalten.

## Exit

Ein frischer Rechner und die CI können denselben Projektstand reproduzierbar installieren und prüfen.

---

# 9. Entwicklungsloop pro Feature

## Reihenfolge

1. Anforderung lesen
2. Risiko/Datenschutz/Accessibility prüfen
3. State-/Datenänderung definieren
4. reine Logik implementieren
5. Unit-/Contract-Test
6. UI anbinden
7. Fehler-/Abbruchpfade
8. Persistenz/Resume
9. E2E-Test
10. responsive/Accessibility
11. Performance
12. Dokumentation
13. PR-Review

## Definition of Done für ein Feature

- [ ] Zweck klar
- [ ] Akzeptanzkriterien klar
- [ ] Happy Path funktioniert
- [ ] Fehlerfälle behandelt
- [ ] Eingaben validiert
- [ ] Datenmodell migrationsfähig
- [ ] Abbruch sicher
- [ ] Reload/Resume geklärt
- [ ] Unit-/Contract-Tests passend vorhanden
- [ ] E2E für Kernflow vorhanden
- [ ] Tastatur/Fokus geprüft
- [ ] mobile Ansicht geprüft
- [ ] Datenschutz geprüft
- [ ] Security geprüft
- [ ] Performancebudget geprüft
- [ ] Dokumentation aktuell

---

# 10. Fehlerbehandlung und Resilienz

## Pflichtfälle

- Offline/Netzwerkverlust
- lokaler Speicher voll
- beschädigter Import
- verweigerte Browserfunktion
- Sessionabbruch
- Reload mitten im Prozess
- Browser-/PWA-Neustart
- ungültige URL
- leere/zu lange Eingaben
- doppelte Aktion
- fehlgeschlagener Schreibvorgang
- fehlgeschlagenes PWA-Update

## Regeln

- verständliche Fehlermeldung
- keine stillen Datenverluste
- atomare/rollbackfähige kritische Schreibvorgänge
- wiederholte Aktion erzeugt keine Doppelzählung
- beschädigte Daten werden isoliert statt unkontrolliert weiterverwendet

## Exit

Jeder kritische Nutzerfluss besitzt einen definierten Fehler- und Wiederherstellungspfad.

---

# 11. Teststrategie und CI/CD

## Testpyramide

1. Syntax/statische Checks
2. Unit-Tests
3. Contract-Tests
4. Integrationstests
5. E2E-Browser
6. Cross-Browser
7. echte Geräte
8. reale Gruppen

## CI muss mindestens

- Checkout ausführen
- Node/Python reproduzierbar einrichten
- Dependencies reproduzierbar installieren
- Syntax prüfen
- Unit-/Contract-Tests ausführen
- Architektur-/Performance-/Release-Audits ausführen
- E2E ausführen
- Berichte/Artifacts bereitstellen

## Secret Circle aktueller Blocker

Workflows existieren, aber ein Freigabenachweis zählt erst, wenn ein Runner tatsächlich Checkout und Testschritte ausführt. `runner_id: 0` / `steps: []` ist **kein grüner Testlauf**.

## Dokumente

- `TEST_PLAN.md`
- `MANUAL_TEST_PLAN.md`
- `.github/workflows/`

## Exit

Der unveränderte Release-Commit besteht alle automatisierten und manuellen Release-Gates.

---

# 12. Offline, PWA, Resume und Update

## Ziel

Offline- und Unterbrechungsverhalten sind Kernproduktfunktionen von Secret Circle.

## Prüfen

- Offline-Erststart nach Installation/Vorladung
- App-/Tabwechsel
- Sperrbildschirm
- Reload
- Browser-Neustart
- PWA-Neustart
- aktive Timer
- private Reveal-Zustände
- Update während aktiver Session
- Update von mindestens zwei älteren Versionen
- fehlgeschlagene Cache-Promotion
- Rollbackdeployment

## Exit

Jede aktive Kernsession besitzt einen dokumentierten Resume-Vertrag, und ein Update zerstört weder laufende Session noch lokale Nutzerdaten.

---

# 13. Content, Alter und Rechte

## Ziel

Technisch korrekte Spiele müssen auch redaktionell releasefähig sein.

## Prüfen

- doppelte Karten
- zu ähnliche Karten
- schwache/missverständliche Formulierungen
- Packgröße
- Wiederholungsrate
- Altersstufen
- sensible Inhalte
- sichere Skip-Möglichkeit
- familienfreundliche Defaults
- Marken/Fan-Content
- Urheberrecht
- fremde Bilder/Logos/Zitate/Audios

## Dokumente

- `CONTENT_GUIDE.md`
- `CONTENT_AGE_POLICY.md`
- `THIRD_PARTY_NOTICES.md`

## Exit

Jeder Releaseinhalt ist redaktionell geprüft und alters-/rechtsseitig eingeordnet.

---

# 14. Beta, reale Nutzer und Gruppentests

## Testgruppen

- 3–4 Personen
- 5–8 Personen
- 9–12 Personen
- unerfahrene Nutzer
- großer Word-Imposter-Test
- Mafia mit mindestens 8 Personen
- Creator durch unerfahrene Nutzer
- mindestens drei vollständige Smart-Party-Night-Abende

## Beobachten

- Hilfebedarf
- Fehlklicks
- unverständliche Texte
- Wartezeiten
- versehentliche Aktionen
- Übergabeprobleme
- Sichtbarkeit geheimer Inhalte
- Spaß-/Wiederholungsfaktor

## Exit

Keine offenen kritischen oder hohen Fehler; Kernspiele können ohne Entwicklerhilfe abgeschlossen werden.

---

# 15. Datenschutz, Recht und Support – finale Releaseprüfung

## Vor Veröffentlichung final bestätigen

- Datenschutzerklärung
- notwendige Betreiber-/Impressumsangaben
- Lizenz
- Drittanbieterhinweise
- Rechte an Assets/Inhalten
- Supportkontakt
- Sicherheitskontakt
- ggf. Nutzungsbedingungen

Rechtliche Anforderungen ändern sich. Die finale Prüfung muss kurz vor Veröffentlichung anhand aktueller Regeln erfolgen.

## Dokumente

- `PRIVACY.md` / öffentliche Datenschutzseite
- `LEGAL_CHECKLIST.md`
- `THIRD_PARTY_NOTICES.md`
- `SUPPORT.md`
- `SECURITY.md`

## Exit

Alle Pflichtangaben sind final, erreichbar und stimmen mit der tatsächlich ausgelieferten App überein.

---

# 16. Release Management und Release Candidate

## Benötigt

- finaler Scope
- Versionsnummer
- Code Freeze
- Release Candidate
- unveränderlicher Release-Commit
- Release-Tag
- Changelog
- Release Notes
- Rollbackplan
- Hotfixplan

Ab Code Freeze keine neuen Features, nur:

- kritische/hohe Fehlerkorrekturen
- Contentkorrekturen
- Accessibility
- Performance
- Security
- rechtlich notwendige Änderungen
- Releaseautomatisierung

## RC-Gates

- CI grün
- Cross-Browser grün
- echte Geräte grün
- Offline/PWA grün
- Inhalte final
- Security/Datenschutz/Recht final
- Icons/Screenshots final
- Rollback geprüft
- reale Gruppentests abgeschlossen

## Exit

Nur noch **GO** oder **NO_GO**.

---

# 17. Deployment und Veröffentlichung

## Web/PWA

Voraussetzungen:

- HTTPS
- finale Domain/URL
- Produktionskonfiguration
- Manifest/Icons korrekt
- Service Worker korrekt
- Datenschutz/Betreiber/Support erreichbar

Nach Deployment:

- Hauptseiten HTTP 200
- keine Konsolenfehler
- keine fehlenden Assets
- keine unerwarteten Netzwerkaufrufe
- Installation funktioniert
- Offline-Neustart funktioniert
- Update funktioniert
- lokale Daten bleiben erhalten
- vollständiger Hauptflow erneut getestet

## Native Stores

Für Januar 2027 nicht erforderlich. Falls später geplant, entsteht ein eigener Store-Releaseplan für Signing, Store-Metadaten, Altersfreigabe, Datenschutzangaben, Testtracks/TestFlight, Review und kontrollierten Rollout.

---

# 18. Operations, Monitoring und Incident Response

## Grundsatz

Secret Circle verwendet aktuell kein personenbezogenes Produkttracking. Trotzdem braucht ein öffentliches Produkt einen Betriebspfad.

## Bewusst entscheiden

- wie Fehler gemeldet werden
- welcher Supportkanal gilt
- wie Produktionsprobleme erkannt werden
- welche nicht-personenbezogenen technischen Signale nötig sind
- wer bei kritischen Fehlern entscheidet

## Incident-Ablauf

1. Problem erkennen
2. Schweregrad bestimmen
3. Schaden begrenzen
4. Release/Update ggf. stoppen
5. Hotfix oder Rollback
6. notwendige Nutzerkommunikation
7. Root Cause dokumentieren
8. Postmortem
9. präventive Tests/Gates ergänzen

## Dokumente

- `SUPPORT.md`
- `INCIDENT_RESPONSE.md`
- `KNOWN_LIMITATIONS.md`
- `POST_RELEASE.md`

## Exit

Ein kritischer Produktionsfehler kann kontrolliert behandelt werden, ohne ad-hoc entscheiden zu müssen.

---

# 19. Wartung, Migration und Lebenszyklus

## Regeln

- Datenmigrationen versionieren
- alte Formate kontrolliert deprecaten
- Abhängigkeiten regelmäßig prüfen
- Sicherheitsupdates priorisieren
- Browser-/OS-Änderungen testen
- Backups kompatibel halten
- Release Notes pflegen
- veraltete Funktionen bewusst entfernen
- bei größeren Änderungen Migration und Rollback vor Release testen

## Exit

Neue Versionen zerstören keine bestehenden Nutzerdaten und besitzen einen nachvollziehbaren Upgrade-/Rollbackpfad.

---

# 20. Risiko-Management

`RISK_REGISTER.md` ist ein lebendes Dokument.

Jedes relevante Risiko enthält:

- Beschreibung
- Bereich
- Wahrscheinlichkeit
- Auswirkung
- Priorität
- Gegenmaßnahme
- Verantwortungsbereich
- Status
- Nachweis für Schließung

Beispiele für Secret Circle:

- GitHub Actions führt keinen Code aus
- PWA-Update auf iOS verhält sich anders als erwartet
- Sperrbildschirm beeinflusst Timer
- Inhalts-/Altersprüfung unvollständig
- lokaler Speicher läuft voll
- Migration beschädigt alte Daten
- Fan-/Markeninhalt erzeugt Rechtsrisiko
- große Gruppe versteht Übergaben nicht

Risiken werden nicht nur dokumentiert, sondern in Roadmap und Release-Gates übersetzt.

---

# 21. Dokumentenlandkarte

| Verantwortung | Datei | aktueller Stand |
|---|---|---|
| Gesamtprozess | `APP_ENTWICKLUNG_VON_A_BIS_Z.md` | vorhanden |
| Produkt | `PRODUCT_BRIEF.md` | zu erstellen |
| Nutzer/Szenarien | `USER_SCENARIOS.md` | zu erstellen |
| Markt | `MARKET_RESEARCH.md` | zu erstellen |
| Risiken | `RISK_REGISTER.md` | zu erstellen |
| Plattform | `PLATFORM_STRATEGY.md` | zu erstellen |
| Scope | `RELEASE_SCOPE_2027.md` | vorhanden |
| Roadmap | `ROADMAP_2027.md` | vorhanden |
| Anforderungen | `REQUIREMENTS.md` | verteilt / zu konsolidieren |
| UX | `UX_FLOW.md` | zu erstellen |
| Design | `DESIGN_SYSTEM.md` | zu erstellen |
| Assets | `ASSET_PLAN.md` | vorhanden |
| Architektur | `ARCHITECTURE.md` | vorhanden |
| Daten | `DATA_MODEL.md` | verteilt / zu konsolidieren |
| Backups | `BACKUP_SCHEMAS.md` | vorhanden |
| Security | `SECURITY.md` | zu erstellen |
| Threat Model | `THREAT_MODEL.md` | zu erstellen |
| Content | `CONTENT_GUIDE.md` | zu erstellen |
| Altersrichtlinie | `CONTENT_AGE_POLICY.md` | zu erstellen |
| Tests | `TEST_PLAN.md` | verteilt / zu konsolidieren |
| manuelle Tests | `MANUAL_TEST_PLAN.md` | vorhanden/vorbereitet |
| Release | `RELEASE_CHECKLIST.md` | vorhanden |
| Deployment | `DEPLOYMENT.md` | vorhanden, veraltete Angaben synchronisieren |
| Recht | `LEGAL_CHECKLIST.md` | zu erstellen |
| Drittanbieter | `THIRD_PARTY_NOTICES.md` | zu erstellen |
| Support | `SUPPORT.md` | zu erstellen |
| Incident Response | `INCIDENT_RESPONSE.md` | zu erstellen |
| Einschränkungen | `KNOWN_LIMITATIONS.md` | vorhanden |
| Änderungen | `CHANGELOG.md` | vorhanden |

---

# 22. App-weite Definition of Done vor Veröffentlichung

## Produkt

- [ ] Problem, Zielgruppe und Positionierung klar
- [ ] Scope eingefroren
- [ ] Risiken bewertet
- [ ] Kernflows ohne Entwicklerhilfe verständlich
- [ ] reale Nutzer getestet

## Technik

- [ ] reproduzierbare Installation
- [ ] stabile Architektur
- [ ] versionierte Daten/Migrationen
- [ ] keine offenen kritischen Speicher-/Securityprobleme
- [ ] Rollback für kritische Änderungen

## Qualität

- [ ] Syntaxchecks grün
- [ ] Unit-/Contract-/Integrationstests grün
- [ ] E2E grün
- [ ] Cross-Browser grün
- [ ] reale Zielgeräte geprüft

## UX / Accessibility

- [ ] Smartphone/Tablet geprüft
- [ ] Tastatur vollständig
- [ ] sichtbarer Fokus
- [ ] 200 % Zoom
- [ ] Kontrast
- [ ] Reduced Motion
- [ ] Screenreader-Smoke-Test

## PWA / Offline

- [ ] installierte PWA online/offline
- [ ] Reload/Resume
- [ ] Sperrbildschirm/Appwechsel
- [ ] Update alte→neue Version
- [ ] fehlgeschlagene Promotion
- [ ] Rollbackdeployment

## Inhalte

- [ ] Kerninhalte redaktionell geprüft
- [ ] Altersstufen geprüft
- [ ] sensible Inhalte/Skip geprüft
- [ ] Rechte geprüft

## Datenschutz / Recht / Support

- [ ] Datenschutz final
- [ ] Betreiberangaben final
- [ ] Lizenz/Drittanbieter final
- [ ] Supportkontakt final
- [ ] Sicherheitskontakt final

## Release

- [ ] Version festgelegt
- [ ] Release-Commit festgelegt
- [ ] Release-Tag
- [ ] Changelog
- [ ] Release Notes
- [ ] Hotfix-/Incidentprozess
- [ ] vollständige `RELEASE_CHECKLIST.md`

---

# 23. Aktueller Secret-Circle-Status

## Bereits stark

- definierter Januar-2027-Scope
- 15 priorisierte Kernspiele
- Reifestufen Core/Extended/Labs
- umfangreicher Architekturvertrag
- versionierte lokale Daten und Backups
- Offline/PWA-Architektur
- Session-/Resume-/Exact-once-Verträge
- umfangreiche Unit-/Contract-/E2E-Struktur
- Performance-/Architektur-Audits
- Release-Checkliste
- Rollbackgrundlagen

## Aktuell wesentliche offene Gates

- Produkt-/Zielgruppen-/Risiko-Dokumentation konsolidieren
- CI-Runner muss echten Code ausführen
- `package-lock.json` + `npm ci`
- Branch Protection
- Kerninhalte redaktionell/altersseitig prüfen
- finale UI-/Designabnahme
- Accessibility-Abnahme
- Android/iPhone/Tablet real testen
- Sperrbildschirm/Appwechsel real testen
- reale Gruppentests
- Recht/Datenschutz/Support/Lizenz finalisieren
- Deployment-Dokumentation auf aktuellen PR/Cache/Releasezustand synchronisieren

Aktueller öffentlicher Freigabestatus bleibt **NO_GO**.

---

# 24. Verbindliche Arbeitsreihenfolge ab jetzt

1. `PRODUCT_BRIEF.md`
2. `USER_SCENARIOS.md`
3. `RISK_REGISTER.md`
4. `PLATFORM_STRATEGY.md`
5. Markt-/Positionierungsprüfung
6. Requirements konsolidieren
7. UX-Flow dokumentieren und Hub daran prüfen
8. Designsystem konsolidieren
9. Security + Threat Model
10. Content-/Altersaudit der 15 Kernspiele
11. CI/Lockfile/Branch Protection
12. vollständige automatisierte Kernabnahme
13. Accessibility
14. reale Zielgeräte und PWA-Updates
15. Gruppentests
16. Recht/Datenschutz/Support
17. Code Freeze
18. Release Candidate
19. vollständige Releasefreigabe
20. Produktionsdeployment
21. Post-Release/Incident/Hotfix

Diese Reihenfolge darf angepasst werden, wenn ein neu entdecktes kritisches Risiko eine frühere Bearbeitung verlangt.

---

# Grundregel

> **Secret Circle wird nicht veröffentlicht, weil es startet oder viele Spiele besitzt. Es wird veröffentlicht, wenn Produkt, UX, Technik, Daten, Security, Accessibility, Inhalte, Geräte, reale Gruppen, Recht und Betrieb für denselben unveränderten Release-Commit nachweislich freigegeben sind.**
