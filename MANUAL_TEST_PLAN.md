# Secret Circle Party Hub – Manueller Testplan Januar 2027

Stand: 25. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v46` / `secret-circle-v46-staging`**  
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
- [ ] `npm test` grün
- [ ] `npm run validate` grün
- [ ] Chromium E2E grün
- [ ] vollständiges `npm run ci` grün
- [ ] Chromium / Firefox / WebKit grün

Aktueller externer Blocker: Issue #7. Auch Run #2575 erreicht keinen ersten Workflow-Step.

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
- [ ] Teilabstimmung nach Reload korrekt
- [ ] manipulierter Voting-Snapshot verworfen
- [ ] Stichwahl
- [ ] Imposter-Ratechance
- [ ] Punkte korrekt
- [ ] Abschluss genau einmal

## 4. Direkte Hub-Core-Spiele

Vollständiger Durchlauf je Spiel:

- Wahrheit oder Pflicht
- Ich habe noch nie
- Wer würde eher?
- Entweder oder
- Paranoia
- Scharade
- Nicht sagen! / Tabu
- Heiße Kartoffel
- Wortkette
- Nur falsche Antworten

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

### Zwei Wahrheiten, eine Lüge

- [ ] private Eingabe
- [ ] drei unterschiedliche Aussagen
- [ ] Appwechsel verdeckt Eingabe
- [ ] Mischung/Lügenindex geschützt
- [ ] Vote/Result korrekt
- [ ] manipulierter Outcome-Snapshot verworfen

### Question Imposter

- [ ] eigene Frage pro Person privat
- [ ] Appwechsel/Reload schützt Frage
- [ ] Diskussion/Vote korrekt
- [ ] manipulierter Rolle-/Vote-Snapshot verworfen

### Location Spy

- [ ] Ort/Spion privat
- [ ] Appwechsel schützt Karte
- [ ] Gruppenwahlpfad
- [ ] Spion-Guesspfad
- [ ] Sieger getrennt vom Session-Zähler
- [ ] manipulierter Result-Snapshot verworfen

### Mafia

- [ ] 6 / 8 / 12 / 16+ soweit praktisch
- [ ] Rollenanzahl/Pack korrekt
- [ ] Rollen privat
- [ ] Moderatorübersicht bewusst bestätigt und bei Appwechsel verdeckt
- [ ] Nachtformular privat
- [ ] Arzt/Detektiv/Beschützer korrekt
- [ ] Beschützer nicht zweimal hintereinander gleiche Person
- [ ] Tageswahl
- [ ] Dorf-/Mafia-Siegbedingung
- [ ] manipulierte Rollen-/Alive-/Winner-Snapshots verworfen

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

Je Mechanikfamilie mindestens ein kompletter Smoke:

- [ ] Spektrum-Tipp
- [ ] Zeichnen & Raten
- [ ] Schnellfeuer
- [ ] Geräusche/Stirn-Raten/Melodie summen
- [ ] Buchstaben-Kategorien
- [ ] Nicht lachen / Gegenstandsjagd
- [ ] Caption Battle
- [ ] Blind Ranking
- [ ] Emoji Quiz
- [ ] Preis-/Geld-Schätzspiele
- [ ] Higher/Lower
- [ ] Wer kennt mich am besten
- [ ] Hot Seat / Story Chain

Prüfen:

- [ ] private Ziele geschützt
- [ ] Timer pausierbar, wo relevant
- [ ] Labs als experimentell erkennbar
- [ ] keine automatische Behauptung vollständiger Releaseabnahme
- [ ] keine unklaren fremden Fan-/Markenassets
- [ ] Abschluss genau einmal

## 8. Game Creator

- [ ] alle Vorlagen
- [ ] mehrere Packs
- [ ] Mindestkarten
- [ ] Unicode/Sonderzeichen
- [ ] HTML-artige Eingabe als Text
- [ ] strukturierte Karten nach Export/Import erhalten
- [ ] `updatedAt` korrekt
- [ ] Kopie eigene ID/Zeitstempel
- [ ] eigenes Spiel im Hub
- [ ] Start/Pause/Skip/Abort/Replay
- [ ] Export/Import
- [ ] Speicherfehler/Rollback
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

- [ ] Word-Imposter-Backup
- [ ] Gesamtexport
- [ ] Creator-Bibliothek
- [ ] ungültiges JSON abgelehnt
- [ ] unbekannter Namespace abgelehnt
- [ ] Größenlimit UTF-8 korrekt
- [ ] simulierter Schreibfehler Rollback
- [ ] vollständige lokale Löschung
- [ ] keine Spieldaten an eigenen Server übertragen

## 11. PWA / Offline – v46

- [ ] Online-Erststart
- [ ] Android-Installation
- [ ] iOS Add to Home Screen
- [ ] Flugmodus
- [ ] Hub/Word Imposter/Advanced/Quick/Creator/Privacy offline
- [ ] Query-Routen offline
- [ ] Resume-/Privacy-Guards offline
- [ ] `party-hub-a11y.js` offline geladen
- [ ] Hub-Bereichsfokus offline funktional
- [ ] Modal-/Spiel-Fokus-Trap offline funktional
- [ ] Update von mindestens zwei echten älteren Installationen auf v46/RC
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

### Tastatur und Fokus

- [ ] Tastatur ohne Maus
- [ ] Skip-Link beim Erstladen
- [ ] sichtbarer Fokus
- [ ] Start → Spiele verschiebt Fokus sinnvoll auf `#games-title`
- [ ] weitere Hub-Bereichswechsel fokussieren die neue Hauptüberschrift
- [ ] Spieldetail öffnet als modaler Dialog
- [ ] Spieldetail: Hintergrund nicht fokussierbar
- [ ] Spieldetail: Tab vom letzten Control springt zum ersten
- [ ] Spieldetail: Shift+Tab vom ersten Control springt zum letzten
- [ ] Spieldetail schließen: Fokus kehrt zum Auslöser zurück
- [ ] aktive Hub-Spielrunde ist modal
- [ ] aktive Runde: Hintergrund nicht fokussierbar
- [ ] aktive Runde: Tab/Shift+Tab bleiben im Overlay

### Screenreader / Darstellung

- [ ] VoiceOver
- [ ] TalkBack
- [ ] private Inhalte vor Reveal nicht angesagt
- [ ] Privacy-Cover verständlich
- [ ] Bereichswechsel verständlich angekündigt
- [ ] modale Overlays als solche verständlich
- [ ] 200-%-Zoom
- [ ] 320 CSS px
- [ ] große Systemschrift
- [ ] Hoch-/Querformat
- [ ] iPhone-Safe-Areas
- [ ] Bildschirmtastatur
- [ ] Touchziele
- [ ] kein kritischer horizontaler Überlauf
- [ ] Reduced Motion
- [ ] Pause über `aria-pressed`
- [ ] inert Aktionen nicht bedienbar
- [ ] Status nicht nur Farbe

## 14. Reale Partytests

- [ ] 3–4 Personen / ≥60 min
- [ ] 5–8 Personen / ≥90 min
- [ ] 9–12 Personen / ≥90 min
- [ ] Word Imposter mit mehreren Impostern
- [ ] Mafia
- [ ] Scharade/Tabu
- [ ] Party Night
- [ ] mindestens ein realer Nachweis pro Core-Spiel

Dokumentieren: Regeln, Wartezeit, Content, technische Unterbrechungen, Geheimnisoffenlegung, bevorzugte/vermiedene Spiele, Fehlbedienung und Accessibility-/Fokusprobleme.

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
- [ ] Accessibility real inklusive v46-Fokus-/Modalpfade
- [ ] mindestens ein realer Nachweis pro Core-Spiel
- [ ] G1–G5 und PN1–PN3 abgeschlossen
- [ ] zwei echte PWA-Upgrades auf v46/RC + Rollback
- [ ] keine offenen Critical/High-Funde
- [ ] Content-/Rechte-/Legal-/Support-/Hosting-Sign-off
- [ ] Incident-/Rollback-Drill
- [ ] unveränderter RC
- [ ] `release-evidence.json = FINAL / GO`

Bis dahin bleibt der öffentliche Release **NO_GO** und PR #13 **Draft / ungemergt**.
