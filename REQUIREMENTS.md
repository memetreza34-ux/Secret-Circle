# Secret Circle – Anforderungen Januar 2027

Stand: 16. August 2026

Dieses Dokument konsolidiert die wichtigsten Produkt- und Qualitätsanforderungen. Detailverträge bleiben in `ARCHITECTURE.md`, `CORE_GAME_ACCEPTANCE.md`, `CORE_SCORING_RULES.md`, `BACKUP_SCHEMAS.md`, `RELEASE_SCOPE_2027.md` und `RELEASE_CHECKLIST.md` verbindlich.

## 1. Prioritäten

- **MUST** – Releaseblocker, wenn nicht erfüllt
- **SHOULD** – sehr wichtig; Abweichung muss vor RC bewusst akzeptiert werden
- **COULD** – optional, darf den Release nicht gefährden
- **N/A V1** – bewusst nicht Teil von Januar 2027

## 2. Produktgrenze

### MUST

- [ ] Secret Circle funktioniert als responsive Web-App/PWA.
- [ ] Primärer Spieleabend funktioniert ohne Benutzerkonto.
- [ ] Nach erfolgreicher Vorladung/Installation funktionieren Kernflows offline.
- [ ] Ein einzelnes gemeinsames Gerät reicht für die Kernspiele.
- [ ] 15 Kernspiele sind eindeutig von Erweiterungen und Labs getrennt.
- [ ] Keine Funktion darf Labs automatisch als vollständig releaseabgenommen darstellen.

### N/A V1

- Backend
- Cloudkonto
- Mehrgeräte-Sync
- Online-Multiplayer
- Werbung
- Analytics/Tracking
- Abonnement
- In-App-Käufe
- native App-Store-Veröffentlichung

---

# 3. Party Hub

## HUB-001 – Einstieg

**MUST**

Ein Erstnutzer muss erkennen können:

1. Spieler festlegen
2. Spiel auswählen
3. Pack/Optionen wählen
4. starten

Akzeptanz:

- keine Entwicklererklärung erforderlich
- keine unnötige Kontopflicht
- ungültige Spielerzahl wird vor Start verhindert oder klar erklärt

## HUB-002 – Reifestufen

**MUST**

Der Katalog unterscheidet:

- 15 Core
- 13 Extended
- 17 Labs

Akzeptanz:

- Status ist sichtbar
- Filter funktionieren gemeinsam mit Alters-/Gruppenfiltern
- Labs werden nicht als gleichwertig releasefertig präsentiert

## HUB-003 – Suche

**MUST**

- Groß-/Kleinschreibung robust
- Umlaute/ß/Sonderzeichen normalisiert
- bekannte Synonyme/Alternativnamen
- kleine Tippfehler unterstützen
- maximal begrenzte Vorschlagsmenge
- Tastaturbedienung
- ARIA-Listbox

## HUB-004 – gespeicherte Katalogpräferenzen

**SHOULD**

Gespeichert werden dürfen:

- Suche
- Gruppe
- Stimmung
- Spielerzahl
- Alter
- Reifestufe
- letzte Ansicht

Direkte URL-Navigation besitzt Vorrang vor gespeicherter letzter Ansicht.

## HUB-005 – Spielerpool

**MUST**

- Spieler lokal speichern
- über mehrere Spiele wiederverwenden
- jedes Spiel validiert eigene Spielergrenzen
- Spieler-Snapshot einer laufenden Session bleibt stabil

## HUB-006 – leere/fehlerhafte Zustände

**MUST**

Bei leerem Ergebnis, ungültigen Daten oder blockiertem lokalen Speicher erklärt die UI die nächste sinnvolle Aktion.

---

# 4. Kernspiele

## CORE-001 – Kernspielmenge

**MUST**

Die Release-Kernspiele sind exakt:

1. Word Imposter
2. Wahrheit oder Pflicht
3. Ich habe noch nie
4. Wer würde eher?
5. Entweder oder
6. Paranoia
7. Scharade
8. Tabu
9. Heiße Kartoffel
10. Wortkette
11. Zwei Wahrheiten, eine Lüge
12. Question Imposter
13. Location Spy
14. Mafia
15. Nur falsche Antworten

## CORE-002 – Regeln

**MUST**

Jedes Kernspiel erklärt die erste Runde in höchstens vier klaren Schritten, sofern die Mechanik das zulässt.

## CORE-003 – Pack-/Content-Auswahl

**MUST**

- Pack existiert
- Pack ist nicht leer
- Packname verständlich
- strukturierte Inhalte behalten ihre Struktur
- ungeeignete/sensible Inhalte können übersprungen werden, wo erforderlich

## CORE-004 – Punkte/Sieger

**MUST**

Punkte, Sessionzähler, Rundenergebnis und Sieger dürfen nicht vermischt werden.

`CORE_SCORING_RULES.md` ist verbindlich.

Nur Word Imposter besitzt einen individuellen persistenten Matchpunktestand unter den 15 Core-Spielen.

## CORE-005 – reale Gruppenabnahme

**MUST**

Jedes Kernspiel wird mindestens einmal ohne Entwicklerhilfe real abgeschlossen.

---

# 5. Direkte Hub-Sessionsteuerung

## SESSION-001 – Start

**MUST**

Neue Session erzeugt genau eine stabile Session-ID und speichert einen stabilen Spieler-Snapshot.

## SESSION-002 – Pause

**MUST**, wo Timer/aktive Runde unterstützt wird:

- sichtbarer Pausenstatus
- Timer friert tatsächlich ein
- Rundenaktionen werden während Pause nicht versehentlich ausgelöst

## SESSION-003 – Skip

**MUST**

- wechselt genau einmal weiter
- vergibt keinen unbeabsichtigten Punkt
- exponiert keine private Information

## SESSION-004 – Beenden & speichern

**MUST**

- klar getrennt von Abbruch
- Verlauf/Statistik genau einmal
- Active State danach sauber entfernt

## SESSION-005 – Abbrechen & verwerfen

**MUST**

- Bestätigung
- kein Verlauf
- keine Statistik
- andere lokale Daten bleiben erhalten

Escape darf keinen stillen Abschluss erzeugen.

## SESSION-006 – Replay/Nächstes Spiel

**SHOULD**

Nach regulärem Abschluss stehen Wiederholen und nächstes Spiel konsistent zur Verfügung.

---

# 6. Timer

## TIMER-001 – gemeinsamer Timervertrag

**MUST**

Keine schnelle Enginefamilie oder direkte Hub-Engine besitzt einen privaten nicht pausierbaren Timer neben dem gemeinsamen Controller.

## TIMER-002 – Scharade

**MUST**

- 60 Sekunden
- Pause friert ein
- Restzeit/Rundentreffer/aktuelle Karte resume-fähig
- Reload stellt pausiert wieder her

## TIMER-003 – Tabu

**MUST**

- 60 Sekunden
- Trefferzähler
- Skip ohne Punkt
- Restzeit/Rundentreffer/Begriff/verbotene Wörter resume-fähig
- Reload stellt pausiert wieder her

## TIMER-004 – Heiße Kartoffel

**MUST**

- zufälliger verdeckter Timer
- Pause friert interne Restzeit ein
- Restzeit bleibt für Nutzer verborgen
- Reload stellt dieselbe interne Restzeit pausiert wieder her

## TIMER-005 – Wortkette

**MUST**

- 30 Sekunden
- Buchstabe + Restzeit resume-fähig
- Reload stellt pausiert wieder her

## TIMER-006 – reale Betriebssystemunterbrechung

**MUST vor Release**

Timerverhalten bei echtem Appwechsel/Sperrbildschirm auf Android und iPhone wird dokumentiert und ggf. korrigiert.

---

# 7. Private Inhalte

## PRIV-001 – Reveal

**MUST**

Geheime Information wird nur nach bewusster Aktion sichtbar.

## PRIV-002 – Übergabe

**MUST**

Vor Weitergabe muss private Information wieder sicher verdeckt werden können.

## PRIV-003 – Reload

**MUST**

Private Inhalte werden nach Reload nicht automatisch offen wiederhergestellt.

Besonders:

- Word Imposter
- Question Imposter
- Location Spy
- Mafia
- Paranoia

## PRIV-004 – Mafia Moderator

**MUST**

Moderatorübersicht erfordert nach Reload erneut bewusste Bestätigung.

---

# 8. Advanced-Kernspiele

## ADV-001 – Zwei Wahrheiten, eine Lüge

**MUST**

- private Eingabe
- Mischung
- Abstimmung
- korrektes Rundenergebnis
- Reload-/Abbruchverhalten

## ADV-002 – Question Imposter

**MUST**

- private Reveal-Kette
- korrekte Gruppen-/Imposter-Auswertung
- sichere Wiederaufnahme

## ADV-003 – Location Spy

**MUST**

- Ort/Spion geheim
- korrekte Rundenauswertung
- Ort-Guess und Gruppenentscheidung getrennt korrekt
- sichere Wiederaufnahme

## ADV-004 – Mafia

**MUST**

- 6–20 Spieler
- Mafiaanzahl skaliert 1/2/3/4
- Packs Schnell/Klassisch/Erweitert
- Arzt/Detektiv/Beschützer in Erweitert
- Beschützer nicht dieselbe Person zwei Nächte hintereinander
- Sieger ausschließlich nach lebender Rollenverteilung

---

# 9. Word Imposter

## IMP-001 – Rollenfairness

**MUST**

Rollenverteilung darf nicht aus Aufdeck-/Kartenreihenfolge ableitbar sein.

## IMP-002 – Zufall

**MUST**

Reveal-, Rollen- und Wortzufall bleiben logisch unabhängig.

## IMP-003 – Impostergrenze

**MUST**

Maximal sechs Imposter, innerhalb gültiger Spieler-/Rollenregeln.

## IMP-004 – Scoring

**MUST**

- gefangener Imposter + korrektes Wort: Imposter +2
- gefangener Imposter + falsches Wort: Unschuldige +1
- Nicht-Imposter eliminiert: Imposter +2
- Round Winner korrekt
- individuelle Rangliste korrekt

---

# 10. Game Creator

## CREATOR-001 – Vorlagen

**SHOULD**

Sechs Vorlagen:

- Fragen/Aussagen
- Entweder oder
- Erraten/Darstellen
- Challenges
- Story/Kreativität
- Meinung/Debatte

## CREATOR-002 – lokale Sicherheit

**MUST**

- Eingaben validieren
- kein ungeprüftes HTML
- Limits für Kategorien/Karten
- Import vollständig validieren
- Speicherfehler rollbackfähig

## CREATOR-003 – Lebenszyklus

**SHOULD**

- erstellen
- bearbeiten
- kopieren
- löschen
- exportieren
- importieren
- direkt spielen

## CREATOR-004 – Plattformintegration

**MUST**

Creator-Spiele respektieren:

- Session-Ledger
- gemeinsame Sessionsteuerung
- Offlinebetrieb
- Backup
- Verlauf/Statistik genau einmal

---

# 11. Daten und Backups

## DATA-001 – Prefix

**MUST**

App-Daten bleiben über den Prefix `secret-circle-` inventarisierbar/löschbar.

## DATA-002 – Versionierung

**MUST**

Persistierte Schemas besitzen Versionen und sichere Defaults/Migrationen.

## DATA-003 – unbekannte Version

**MUST**

Neuere unbekannte Formate werden nicht blind überschrieben.

## DATA-004 – Backup

**MUST**

Unterstützte Backupformate entsprechen `BACKUP_SCHEMAS.md`.

## DATA-005 – Größenlimit

**MUST**

Importgrenze: 1.500.000 UTF-8-Bytes für die dokumentierten Backupwege.

## DATA-006 – Transaktion

**MUST**

Kritische Import-/Lösch-/Completion-Vorgänge validieren zuerst und besitzen einen sicheren Rollbackpfad.

## DATA-007 – Exact once

**MUST**

Eine Session darf Verlauf, `plays`, Runden und Bestwert pro Completion höchstens einmal erhöhen.

---

# 12. PWA und Offline

## PWA-001 – HTTPS

**MUST Production**

Installierbare PWA wird über HTTPS ausgeliefert.

## PWA-002 – Offline-Core

**MUST**

Kernseiten, Kernengines, Creator, Datenschutz, Release-/Filter-/Suchmodule, Session-Ledger und gemeinsame Steuerung sind offline verfügbar.

## PWA-003 – staged update

**MUST**

- neue Version zuerst vollständig vorbereiten
- keine stille Aktivierung mitten in aktiver Session
- sichtbare Entscheidung „aktualisieren/später“
- aktiver Offline-Core vor erfolgreicher Promotion nicht löschen

## PWA-004 – aktive Sessions

**MUST**

Update-Schutz erkennt direkte Hub-, Advanced-, Word-/Quick-/Mega-/Viral-/Creator-Sessions gemäß dokumentierten Keys.

## PWA-005 – reale Updates

**MUST vor Release**

Mindestens zwei alte→neue Versionspfade auf realistischen installierten PWAs testen.

---

# 13. Security

## SEC-001

**MUST** – keine Secrets im Repository/Client.

## SEC-002

**MUST** – Nutzereingaben/Importe vor sensibler Verwendung validieren.

## SEC-003

**MUST** – dynamische Nutzerdaten nicht über unsicheres HTML rendern.

## SEC-004

**MUST** – keine unnötigen externen Laufzeitabhängigkeiten.

## SEC-005

**MUST** – restriktive CSP darf benötigte lokale Funktionen nicht blockieren.

## SEC-006

**MUST vor Release** – `SECURITY.md` und `THREAT_MODEL.md` finalisieren.

---

# 14. Accessibility

## A11Y-001

**MUST** – semantische Überschriften/Labels.

## A11Y-002

**MUST** – vollständige Kernflow-Tastaturbedienung.

## A11Y-003

**MUST** – sichtbarer Fokus und logische Fokusführung.

## A11Y-004

**MUST** – Status nicht ausschließlich Farbe.

## A11Y-005

**MUST** – 200 % Zoom.

## A11Y-006

**MUST** – Reduced Motion.

## A11Y-007

**MUST** – mindestens 44 × 44 Pixel für wichtige Touchziele.

## A11Y-008

**MUST vor Release** – Screenreader-Smoke-Test auf realem Zielsetup.

---

# 15. Performance

## PERF-001

**MUST** – Produktionsmodule bleiben unter Architekturgrenzen.

## PERF-002

**MUST** – engeres Budget aus `scripts/performance_budget.py` bleibt grün.

## PERF-003

**MUST** – neue große Dependency/Asset benötigt messbare Begründung.

## PERF-004

**SHOULD** – Kernflow bleibt auch auf kleineren Mobilgeräten flüssig.

---

# 16. Content und Alter

## CONTENT-001

**MUST** – keine leeren Kernpacks.

## CONTENT-002

**MUST** – Duplikate/schwache/missverständliche Kernkarten redaktionell prüfen.

## CONTENT-003

**MUST** – Altersstufen konsistent.

## CONTENT-004

**MUST** – persönliche/sensible Inhalte besitzen sichere Skip-Möglichkeit, wo erforderlich.

## CONTENT-005

**MUST** – keine unzulässigen fremden Bilder/Logos/lange Zitate/Audios.

## CONTENT-006

**MUST vor Release** – alle 15 Kernspiele redaktionell abgenommen.

---

# 17. Recht, Datenschutz und Support

## LEGAL-001

**MUST** – finale Datenschutzerklärung entspricht tatsächlicher App.

## LEGAL-002

**MUST** – notwendige Betreiber-/Impressumsangaben final.

## LEGAL-003

**MUST** – Lizenz und Drittanbieterhinweise final.

## LEGAL-004

**MUST** – Supportkontakt vorhanden.

## LEGAL-005

**MUST** – Sicherheitskontakt/Incidentweg vorhanden.

---

# 18. CI, Git und Release

## REL-001

**MUST** – reproduzierbares `package-lock.json`.

## REL-002

**MUST** – CI verwendet `npm ci`.

## REL-003

**MUST** – GitHub Actions zeigt echten Checkout und ausgeführte Schritte.

## REL-004

**MUST** – `npm run ci` vollständig grün auf unverändertem Release-Commit.

## REL-005

**MUST** – Cross-Browser vollständig grün.

## REL-006

**MUST** – Branch Protection/Required Checks aktiv.

## REL-007

**MUST** – Android/iPhone/Tablet real geprüft.

## REL-008

**MUST** – reale Gruppentests abgeschlossen.

## REL-009

**MUST** – keine offenen kritischen/hohen Fehler.

## REL-010

**MUST** – Release-Commit, Tag, Changelog, Release Notes, Rollback-/Hotfixpfad.

---

# 19. Traceability-Regel

Eine MUST-Anforderung gilt erst als erfüllt, wenn mindestens ein überprüfbarer Nachweis existiert:

- automatisierter Test
- Audit
- E2E
- manuelles Testprotokoll
- realer Gerätetest
- Gruppentest
- finale Dokument-/Rechtsfreigabe

„Implementiert“ ist nicht dasselbe wie „abgenommen“.

## 20. Aktueller Requirements-Status

### Stark technisch vorbereitet

- Session/Exact-once
- Hub-Timer
- sichere Resume-Grundlagen
- PWA-Update-Grundlage
- Backups/Migration
- Core-Scoring-Vertrag
- Katalogtiers/Suche/Filter

### Noch nicht releaseabgenommen

- vollständige CI-Ausführung
- Lockfile/`npm ci`
- reale Geräte
- reale PWA-Updates
- Accessibility
- Core-Content/Alter
- reale Gruppen
- Recht/Support
- finale visuelle UX

Daher bleibt der Releasezustand **NO_GO**.
