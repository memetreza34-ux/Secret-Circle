# Secret Circle Party Hub – Manueller Testplan Januar 2027

Stand: 25. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v48` / `secret-circle-v48-staging`**  
Produktstand: **45 Built-ins · 15 Core · 13 Extended · 17 Labs · lokaler Game Creator**

Dieser Plan ergänzt die automatisierten Prüfungen. Ein technisch startbarer Modus gilt erst nach den jeweils zutreffenden Tests als manuell abgenommen.

Bewertung: `BESTANDEN`, `FEHLER` oder `BLOCKIERT`.

Pro Durchlauf dokumentieren:

```text
Test-ID:
Version:
Commit:
Cachegeneration:
Datum:
Testperson/Host:
Gerät/OS/Browser:
Installationsmodus:
Gruppengröße:
Online/Offline:
Ergebnis:
Notizen/Funde:
```

Vorhandener Code oder vorhandene Tests sind **kein manueller PASS**.

## 1. Automatisierter Preflight

Vor finaler RC-Abnahme auf demselben Commit:

- [ ] Actions erreicht sichtbare Steps
- [ ] Checkout ausgeführt
- [ ] Online-`npm ci` grün
- [ ] `npm run check` grün
- [ ] `npm test` grün inklusive `tests/word-imposter-data-contract.test.js`
- [ ] `npm run validate` grün
- [ ] Chromium E2E grün
- [ ] vollständiges `npm run ci` grün
- [ ] Chromium / Firefox / WebKit grün

Aktueller externer Blocker: Issue #7. Aktuellster geprüfter v48-Lauf **#2715** erreicht keinen ersten Workflow-Step (`steps: []`).

## 2. Hub-Smoke

- [ ] 45 Built-ins
- [ ] 15 Core / 13 Extended / 17 Labs
- [ ] Suche/Filter/Synonyme/Tippfehler
- [ ] URL-Views/Deep Links
- [ ] Spieler/Presets/Favoriten/Einstellungen nach Reload
- [ ] Quick/Mega/Viral/Advanced/Creator/Imposter-Routen
- [ ] Datenschutzseite
- [ ] keine kritischen Laufzeit-/Ressourcenfehler
- [ ] Bereichswechsel setzt Fokus nachvollziehbar auf neue Hauptüberschrift
- [ ] Erstladen behält Skip-Link als ersten sinnvollen Tastaturtarget

## 3. Word Imposter

### Setup/Fairness

- [ ] 3 / 8 / 20 Personen
- [ ] doppelte Namen abgelehnt
- [ ] ungültige Gruppen blockiert
- [ ] 1 / mehrere / max. 6 Imposter
- [ ] 7 Imposter abgelehnt
- [ ] mindestens 20 reale Runden auf Reveal-/Rollenfairness protokolliert

### Geheimhaltung/Voting

- [ ] Karte nur aktuelle Person
- [ ] Appwechsel verdeckt offene Karte
- [ ] Handoff verrät vorige Rolle nicht
- [ ] Timer Start/Pause/Hintergrund
- [ ] geheime Abstimmung klar
- [ ] Teilabstimmung nach Reload startet beim nächsten tatsächlich offenen Wähler
- [ ] nicht-sequenziell manipulierter Voting-Snapshot verworfen
- [ ] Stichwahl
- [ ] Imposter-Ratechance
- [ ] Punkte korrekt
- [ ] Abschluss genau einmal

### Custom-/Backup-Grenzen – v48

- [ ] UI erklärt maximal 50 eigene Kategorien und 2–200 Begriffe je Kategorie
- [ ] 50 Kategorien akzeptiert
- [ ] 51 Kategorien vollständig abgelehnt; keine stille Kürzung
- [ ] nach abgelehntem 51-Kategorien-Import sind vorherige Daten unverändert
- [ ] 200 Begriffe akzeptiert
- [ ] 201 Begriffe abgelehnt
- [ ] 1,5-MB-UTF-8-Backupgrenze korrekt
- [ ] Multibyte-UTF-8 zählt nach Bytes, nicht Zeichen
- [ ] korrupter übergroßer lokaler Custom-State wird fail-safe verworfen und gemeldet

## 4. Direkte Hub-Core-Spiele

Vollständiger Durchlauf je Spiel: Wahrheit oder Pflicht, Ich habe noch nie, Wer würde eher?, Entweder oder, Paranoia, Scharade, Nicht sagen!/Tabu, Heiße Kartoffel, Wortkette und Nur falsche Antworten.

Gemeinsam:

- [ ] Spielerzahl/Pack/Regeln verständlich
- [ ] Skip ohne künstlichen Punkt
- [ ] Beenden & speichern ≠ Abbrechen & verwerfen
- [ ] Reload/Resume explizit
- [ ] Spieler-Snapshot stabil
- [ ] Verlauf/Statistik genau einmal
- [ ] aktive Runde ist für Tastatur/Screenreader als modaler Kontext verständlich
- [ ] Fokus kann nicht unbeabsichtigt in den Hub-Hintergrund wechseln

Spezifisch:

- [ ] persönliche Games: Freiwilligkeit/Skip verstanden
- [ ] Paranoia: Geheimfrage bei Appwechsel verdeckt
- [ ] Scharade/Tabu: Geheimkarten verdeckt, 60-s-Timer, Pause/Resume
- [ ] Heiße Kartoffel: tatsächliche Dauer ausschließlich **10–25 s**, Countdown verborgen
- [ ] Wortkette: letzter Buchstabe/Kategorie/keine Wiederholung manuell verstanden
- [ ] Nur falsche Antworten: richtige/zu langsame Antwort verliert manuell, App scorelos

## 5. Advanced Core

Für Zwei Wahrheiten/eine Lüge, Question Imposter, Location Spy und Mafia jeweils Fachlogik, Privacy, Resume und Siegerzustand prüfen.

Zusätzlich historischer v47-A11y-Vertrag auf dem aktuellen v48-RC:

- [ ] `advanced-play-layer` wird als modaler Dialog verstanden
- [ ] Setup/Skip-Link sind während aktiver Runde per Tastatur nicht erreichbar
- [ ] Tab vom letzten bedienbaren Control springt wieder zum ersten
- [ ] Shift+Tab vom ersten Control springt zum letzten
- [ ] bei dynamischem Rundenwechsel bleibt ein sinnvoller Fokuspunkt
- [ ] private Reveal-/Moderator-/Nachtinformationen mit Screenreader sinnvoll geschützt

## 6. Gemeinsame Quick-/Mega-/Viral-/Creator-Sessionsteuerung

- [ ] Pause/Fortsetzen
- [ ] pausierte Aktionen inert
- [ ] Timer eingefroren
- [ ] Skip stoppt Timer und wechselt genau eine Runde
- [ ] Abbruch bestätigt und schreibt keinen fertigen Verlauf
- [ ] Abschluss genau einmal
- [ ] Replay neue Session-ID
- [ ] Nächstes Spiel korrekt
- [ ] online und offline

## 7. Quick / Extended / Labs

Je Mechanikfamilie mindestens ein kompletter Smoke: Spektrum-Tipp, Zeichnen & Raten, Schnellfeuer, Geräusche/Stirn-Raten/Melodie summen, Buchstaben-Kategorien, Nicht lachen/Gegenstandsjagd, Caption Battle, Blind Ranking, Emoji Quiz, Preis-/Geld-Schätzspiele, Higher/Lower, Wer kennt mich am besten, Hot Seat/Story Chain.

Prüfen:

- [ ] private Ziele geschützt
- [ ] Timer pausierbar, wo relevant
- [ ] Labs als experimentell erkennbar
- [ ] Abschluss genau einmal
- [ ] nach jeder dynamischen Phasenänderung bleibt Fokus auf einem sichtbaren sinnvollen Control
- [ ] Spektrum-Tipp: nach „Ziel verbergen und Gerät weitergeben“ ist der Range-Regler direkt erreichbar/fokussiert
- [ ] Resultat/Replays vollständig per Tastatur bedienbar

## 8. Game Creator

- [ ] alle Vorlagen
- [ ] Template-Radiogroup besitzt genau einen Tab-Stopp
- [ ] ArrowRight/ArrowDown wählt nächste Vorlage
- [ ] ArrowLeft/ArrowUp wählt vorherige Vorlage
- [ ] Home/End springen zur ersten/letzten Vorlage
- [ ] Weiter/Zurück fokussiert die neue sichtbare Schrittüberschrift
- [ ] Hilfe öffnet als modaler Dialog
- [ ] Creator-Hintergrund ist bei offener Hilfe nicht fokussierbar
- [ ] Tab/Shift+Tab bleibt im Hilfedialog
- [ ] Hilfe schließen stellt Fokus auf den Auslöser zurück
- [ ] mehrere Packs / Mindestkarten
- [ ] Unicode/Sonderzeichen / HTML-artige Eingabe als Text
- [ ] strukturierte Karten nach Export/Import erhalten
- [ ] `updatedAt` korrekt
- [ ] Kopie eigene ID/Zeitstempel
- [ ] eigenes Spiel im Hub
- [ ] Start/Pause/Skip/Abort/Replay
- [ ] Export/Import / Speicherfehler-Rollback
- [ ] unerfahrene Person kann ohne Hilfe erstes valides Spiel erstellen

## 9. Smart Party Night

- [ ] 15 / 30 / 45 / 60 / 90 Minuten
- [ ] unterschiedliche Stimmungen
- [ ] Alter/Gruppe
- [ ] Favoriten/zuletzt gespielt
- [ ] Core-/Quick-/Advanced-/Creator-/Imposter-Abschluss synchron
- [ ] erledigt/übersprungen
- [ ] Neustart fortsetzbar
- [ ] mindestens drei vollständige reale Abende

## 10. Backup / Datenschutz

- [ ] Word-Imposter-Backup inklusive v48-Grenzen
- [ ] Gesamtexport
- [ ] Creator-Bibliothek
- [ ] ungültiges JSON / unbekannter Namespace abgelehnt
- [ ] Größenlimit UTF-8 korrekt
- [ ] simulierter Schreibfehler Rollback
- [ ] abgelehnter Import verändert Bestandsdaten nicht
- [ ] vollständige lokale Löschung
- [ ] keine Spieldaten an eigenen Server übertragen

## 11. PWA / Offline – v48

- [ ] Online-Erststart
- [ ] Android-Installation
- [ ] iOS Add to Home Screen
- [ ] Flugmodus
- [ ] Hub/Word Imposter/Advanced/Quick/Creator/Privacy offline
- [ ] Query-Routen offline
- [ ] Resume-/Privacy-Guards offline
- [ ] `party-hub-a11y.js` offline geladen
- [ ] `secondary-surface-a11y.js` offline geladen
- [ ] Word-Imposter-v48-UI-/Store-Logik offline aktuell
- [ ] Hub-Bereichsfokus / Modal-Fokus-Trap offline
- [ ] Advanced-Modal-Fokus-Trap offline
- [ ] Quick-Fokus-Recovery offline
- [ ] Creator-Wizard-/Help-/Radiogroup-A11y offline
- [ ] Word-Imposter 50/51-, 200/201- und Voting-Resume-Verträge offline
- [ ] Update von mindestens zwei echten älteren Installationen auf v48/RC
- [ ] Update zunächst staged
- [ ] aktive Session nicht ungefragt ersetzt
- [ ] `Später` behält aktuelle Version
- [ ] bewusste Aktivierung
- [ ] lokale Daten bleiben erhalten
- [ ] fehlgeschlagene Promotion lässt bisherigen Core verwendbar
- [ ] Rollback erhält neue Cachegeneration

## 12. Hintergrund / Sperrbildschirm / Reload

Für zeitgesteuerte Kernmechanismen:

- [ ] App/Tab Hintergrund → zurück
- [ ] Gerät sperren → entsperren
- [ ] Reload während Session
- [ ] Pause korrekt
- [ ] keine doppelte Endaktion
- [ ] keine doppelte Statistik
- [ ] private Inhalte bei Fokusverlust verdeckt

Muss real auf Android und iOS bestätigt werden.

## 13. Accessibility / Mobile

### Hub

- [ ] Tastatur ohne Maus
- [ ] Skip-Link beim Erstladen
- [ ] sichtbarer Fokus
- [ ] Hub-Bereichswechsel fokussieren neue Hauptüberschrift
- [ ] Spieldetail/aktive Runde: Hintergrund nicht fokussierbar
- [ ] Fokus-Trap und Rückkehrfokus real

### Advanced

- [ ] aktives Spiel als Modal verständlich
- [ ] Setup-Hintergrund nicht fokussierbar
- [ ] Fokus bleibt nach Phasenwechsel sinnvoll

### Quick

- [ ] Fokus geht beim Re-Render nicht verloren
- [ ] Pause/Skip/Result per Tastatur

### Creator

- [ ] Wizard-Schrittfokus
- [ ] Radiogroup-Pfeiltasten/Home/End
- [ ] Hilfe-Modal, Hintergrundisolation, Fokus-Trap und Rückkehrfokus

### Geräte/Screenreader

- [ ] VoiceOver / TalkBack
- [ ] private Inhalte vor Reveal nicht angesagt
- [ ] 200-%-Zoom / 320 CSS px / große Systemschrift
- [ ] Hoch-/Querformat / iPhone-Safe-Areas / Bildschirmtastatur
- [ ] Touchziele / Reduced Motion
- [ ] Status nicht nur Farbe

## 14. Reale Partytests

- [ ] 3–4 Personen / ≥60 min
- [ ] 5–8 Personen / ≥90 min
- [ ] 9–12 Personen / ≥90 min
- [ ] Word Imposter mit mehreren Impostern
- [ ] Word-Imposter-v48-Datengrenzen mit neutralen Testdaten
- [ ] Mafia
- [ ] Scharade/Tabu
- [ ] Party Night
- [ ] mindestens ein realer Nachweis pro Core-Spiel

Dokumentieren: Regeln, Wartezeit, Content, technische Unterbrechungen, Geheimnisoffenlegung, Daten-/Importfunde, bevorzugte/vermiedene Spiele, Fehlbedienung und Accessibility-/Fokusprobleme.

## 15. Content / Rechte

- [ ] Ton/Privacy/Safety/Alter passend
- [ ] keine störenden Wiederholungen
- [ ] Schwierigkeit passend
- [ ] keine unklare konkrete Marken-/Fanreferenz
- [ ] keine ungeklärten visuellen Rechte
- [ ] `ASSET_RIGHTS_SIGNOFF.md` vollständig

Root-`icon.svg` bleibt bis belegter Rechtebasis oder Ersatz offen.

## 16. Release-Freigabekriterium

- [ ] automatisierter Preflight auf finalem RC grün
- [ ] Branch Protection aktiv
- [ ] HTTPS-Staging/Production-Smoke grün
- [ ] Android/iPhone/iPad real
- [ ] Accessibility real inklusive Hub-/Advanced-/Quick-/Creator-Pfade
- [ ] Word-Imposter-v48-Voting-/Daten-/Importverträge real
- [ ] mindestens ein realer Nachweis pro Core-Spiel
- [ ] G1–G5, DWI und PN1–PN3 abgeschlossen
- [ ] zwei echte PWA-Upgrades auf v48/RC + Rollback
- [ ] keine offenen Critical/High-Funde
- [ ] Content-/Rechte-/Legal-/Support-/Hosting-Sign-off
- [ ] Incident-/Rollback-Drill
- [ ] unveränderter RC
- [ ] `release-evidence.json = FINAL / GO`

Bis dahin bleibt der öffentliche Release **NO_GO** und PR #13 **Draft / ungemergt**.