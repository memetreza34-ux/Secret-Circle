# Secret Circle – UX-Flow und Informationsarchitektur

Stand: 16. August 2026

## 1. UX-Ziel

Secret Circle soll sich nicht wie eine Sammlung von 45 Einzelspielen anfühlen, sondern wie ein **gemeinsamer Party-Hub für einen ganzen Spieleabend**.

Der wichtigste UX-Erfolg lautet:

> Eine neue Gruppe kann ohne Entwicklerhilfe Spieler festlegen, ein geeignetes Kernspiel starten, private Übergaben verstehen, eine Session sicher beenden und anschließend direkt weiterspielen.

## 2. Primärer End-to-End-Flow

```text
App öffnen
  ↓
Gruppe vorhanden?
  ├─ Nein → Spieler anlegen / Preset laden
  └─ Ja
  ↓
Spiel finden
  ├─ Empfehlung
  ├─ Schnellwahl nach Stimmung
  ├─ Suche/Filter
  ├─ Favoriten
  └─ Smart Party Night
  ↓
Spieldetail
  ↓
Pack / Optionen / Kurzregeln
  ↓
Spiel starten
  ↓
Rundenflow
  ↓
Beenden & speichern
  ↓
Ergebnis
  ├─ Wiederholen
  ├─ Nächstes Spiel
  ├─ Verlauf
  └─ Hub
```

## 3. Ziel-Informationsarchitektur

### Hauptnavigation

1. **Start** – nächster sinnvoller Schritt / Party beginnen
2. **Spiele** – vollständiger Katalog
3. **Spieler** – gemeinsame Gruppe/Presets
4. **Favoriten** – schnelle Wiederwahl
5. **Verlauf** – letzte Sessions/Statistik
6. **Daten** – Backup, Import, Löschung, Datenschutz

Diese Struktur existiert im aktuellen Hub bereits grundsätzlich und soll beibehalten werden, solange reale Tests keine bessere Struktur zeigen.

## 4. Startseite – Zielhierarchie

Die Startseite darf nicht primär „viele Spiele“ verkaufen. Nach aktueller Marktanalyse ist das kein starkes Alleinstellungsmerkmal.

### Zielreihenfolge

1. **Party starten / weiterspielen**
2. aktive/gespeicherte Session, falls vorhanden
3. Gruppe/Spielerstatus
4. empfohlene Kernspiele
5. schnelle Auswahl nach Stimmung
6. zuletzt gespielt
7. sekundäre Features

### Copy-Richtung

Aktuelle Aussagen wie:

`Ein Handy · viele Spiele · komplett offline`

sind als Produktgrundlage korrekt, aber zu austauschbar als Hero-USP.

Zielbotschaft sollte stärker ausdrücken:

- ganzer Spieleabend
- sichere geheime Übergaben
- schnell zwischen Spielen wechseln
- eigene Spiele
- lokale Datenkontrolle

Finale Hero-Copy wird im Design-/Copy-Pass festgelegt.

## 5. Erststart

### Ziel

Ein Erstnutzer versteht in weniger als einer Minute, wie er beginnt.

### Flow

```text
Startseite
  ↓
„Party starten“
  ↓
Sind Spieler gespeichert?
  ├─ Nein → kompakter Spieler-Setup
  └─ Ja → bestehende Gruppe bestätigen
  ↓
Empfohlene Kernspiele passend zur Gruppengröße
```

### Vermeiden

- Nutzer sofort mit allen 45 Spielen überfordern
- zuerst Einstellungen erklären
- lange Onboarding-Karussells
- Fachbegriffe wie „Engine“, „Tier“, „Ledger“, „PWA“ in Nutzertexten

## 6. Wiederkehrender Nutzer

### Ziel

Weniger Schritte als beim Erststart.

Priorität:

1. aktive Session fortsetzen
2. zuletzt verwendete Gruppe
3. letztes Spiel / Replay
4. Favoriten
5. nächstes empfohlenes Spiel

## 7. Spielerflow

Aktuell besitzt der Hub eine gemeinsame lokale Spieleransicht mit Namen pro Zeile und Presets.

### Ziel

```text
Spieler
  ↓
Namen bearbeiten
  ↓
Speichern
  ↓
optional Preset speichern/laden
  ↓
zum Spiel zurück / Spiel auswählen
```

### Anforderungen

- klare Mindest-/Maximalgrenze beim konkreten Spiel
- keine stillen ungültigen Namen
- leere Gruppe verständlich
- lange Listen auf Smartphone bedienbar
- Preset-Auswahl darf aktuelle Gruppe nicht unerwartet zerstören

## 8. Spiel finden

Es gibt mehrere gleichberechtigte Wege:

### A. Empfehlung

Für Nutzer, die nicht suchen möchten.

### B. Quick Pick

Stimmung:

- lustig
- Wettkampf
- tiefer
- Chaos

### C. Suche

Für Nutzer mit konkretem Spielnamen/Mechanik.

### D. Filter

- Art
- Stimmung
- Gruppengröße
- Alter
- Reifestufe/Status

### E. Favoriten

Für wiederkehrende Gruppen.

### UX-Regel

Filter dienen der Entscheidung, nicht dem Selbstzweck. Wenn die Filterzeile auf kleinen Smartphones zu komplex wirkt, soll eine kompakte progressive Filteroberfläche geprüft werden.

## 9. Core / Extended / Labs

### Ziel

Reifestufe muss verständlich sein, ohne interne Release-Sprache vorauszusetzen.

Empfohlene Nutzerbedeutung:

- **Kernspiel** – vollständig priorisiert und getestet
- **Erweiterung** – spielbar, zusätzliche Auswahl
- **Labs** – experimentell / in Erprobung

### Anforderungen

- Badge allein reicht möglicherweise nicht
- Detailansicht erklärt Labs kurz
- familien-/gruppenrelevante Filter bleiben unabhängig von Reifestufe
- Labs dürfen nicht standardmäßig wichtiger erscheinen als Core

## 10. Spieldetail

Aktueller Detaildialog enthält:

- Icon/Name
- Gruppe/Beschreibung
- Badges
- Kategorien/Inhalte
- Regeln
- Packauswahl
- Start
- Favorit

### Zielreihenfolge

1. Was ist das?
2. Für wie viele?
3. Wie lange?
4. Welche Alters-/Reifestufe?
5. Was brauche ich?
6. Regeln in maximal vier Schritten
7. Pack/Optionen
8. Start

### UX-Regel

Ein Nutzer darf nicht erst nach „Spiel starten“ erfahren, dass Gruppe oder Pack ungeeignet ist.

## 11. Spielstart

Vor dem Start prüfen:

- gültige Spielerzahl
- gültiges Pack
- notwendige Optionen
- aktive alte Session
- private Übergaberegel, wenn relevant

Bei Konflikt klare Entscheidung anbieten:

- alte Session fortsetzen
- alte Session verwerfen
- Start abbrechen

Keine stille Überschreibung.

## 12. Standard-Rundenflow

```text
Rundenstatus
  ↓
aktive Person / Aufgabe
  ↓
Aktion
  ↓
Ergebnis / nächste Person
  ↓
nächste Runde
```

Gemeinsame Controls bleiben möglichst an derselben Stelle:

- Pause/Fortsetzen
- Runde überspringen
- Beenden & speichern
- Abbrechen & verwerfen

### Wichtig

„Beenden“ und „Abbrechen“ dürfen visuell und sprachlich nicht verwechselt werden.

## 13. Private Reveal-Flow

Für private Rollen/Fragen:

```text
„Gerät an [Name] geben“
  ↓
Bestätigung „Ich bin bereit“
  ↓
privaten Inhalt anzeigen
  ↓
„Verdecken / weitergeben“
  ↓
gedeckter Übergabebildschirm
  ↓
nächste Person
```

### MUST

- Name der aktuell vorgesehenen Person eindeutig
- Reveal nie automatisch bei Reload
- private Information nicht im Übergabestatus sichtbar
- Zurücknavigation darf vorherige Rolle nicht unkontrolliert öffnen

## 14. Timer-Flow

### Laufend

- verbleibende Zeit klar, außer absichtlich verdeckter Hot-Potato-Timer
- Punkt-/Trefferzähler nicht mit Sieger verwechseln

### Pause

- Timer friert sichtbar/intern ein
- Rundenaktionen inert/deaktiviert
- Status erklärt Pause

### Resume nach Reload

- Sessionkarte zeigt Fortsetzen
- Timer startet pausiert
- Nutzer setzt bewusst fort

## 15. Skip-Flow

### Ziel

Skip soll Sicherheit und Spielfluss verbessern.

### Regeln

- ein Tap/Klick = genau ein Skip
- keine Punktvergabe
- keine private Information offenlegen
- Fokus landet sinnvoll auf neuer Karte/nächster Aktion

Bei sensiblen Fragen niemals Rechtfertigung verlangen.

## 16. Abschlussflow

### Regulär

```text
Beenden & speichern
  ↓
Bestätigung, falls nötig
  ↓
Completion genau einmal
  ↓
Ergebnis
  ↓
Wiederholen | Nächstes Spiel | Verlauf | Hub
```

### Abbruch

```text
Abbrechen & verwerfen
  ↓
Bestätigung
  ↓
aktive Session entfernen
  ↓
KEIN Verlauf / KEINE Statistik
  ↓
Hub
```

## 17. Ergebnis

Das Ergebnis muss zwischen drei Arten unterscheiden:

- echter Sieger
- Rundenergebnis
- bloßer Sessionzähler

Beispiele:

- Word Imposter: Matchpunkte + Gewinnerseite
- Scharade/Tabu: Trefferzähler, nicht automatisch Gesamtsieger
- Heiße Kartoffel: Rundenverlierer, kein künstlicher Score
- Mafia: Rollen-/Überlebenssieg

`CORE_SCORING_RULES.md` bleibt verbindlich.

## 18. „Nächstes Spiel“-Flow

Dies ist ein wichtiger Differenzierungsbereich.

Empfehlung soll berücksichtigen:

- aktuelle Spielerzahl
- Altersfilter
- zuletzt gespielte Spiele
- nicht direkt dasselbe Spiel
- Reifestufe bevorzugt Core
- ggf. Stimmung

Ziel: Gruppen bleiben im Party-Hub statt nach jeder Session neu zu beginnen.

## 19. Smart Party Night

### Ziel

Nicht nur Spiele anzeigen, sondern einen ganzen Abend führen.

Flow:

```text
Gruppe
  ↓
Stimmung / gewünschte Länge
  ↓
Spielabfolge
  ↓
Spiel 1
  ↓
kurzer Übergang
  ↓
Spiel 2 ...
```

Vor Release muss geprüft werden, ob dieser Modus echten Mehrwert bringt oder den Einstieg unnötig verkompliziert.

## 20. Creator-Flow

```text
Creator öffnen
  ↓
Vorlage
  ↓
Name/Icon/Akzent/Gruppe
  ↓
Kategorien/Karten
  ↓
Prüfen/Vorschau
  ↓
Speichern
  ↓
Direkt testen
  ↓
im Hub verfügbar
```

### Anforderungen

- Fehler am betroffenen Feld
- Entwurfsverlust vermeiden
- Vorschau entspricht tatsächlicher Engine
- Importkonflikte verständlich
- eigene Inhalte klar von Built-ins getrennt

## 21. Datenflow

```text
Daten
  ├─ Alles exportieren
  ├─ Sicherung importieren
  ├─ Datenschutz ansehen
  └─ Alle lokalen Daten löschen
```

### Löschen

Vor endgültiger Aktion exakt erklären:

- welche Daten gelöscht werden
- dass Vorgang lokal ist
- ob Rückgängig nicht möglich ist
- Backup vorher anbieten, wo sinnvoll

## 22. PWA-Update-Flow

```text
Neue Version erkannt
  ↓
Staging vollständig vorbereitet
  ↓
aktive Session?
  ├─ Ja → nicht automatisch aktivieren
  └─ Nein
  ↓
Hinweis „Jetzt aktualisieren“ / „Später“
  ↓
Nutzerentscheidung
```

Fehlgeschlagene Promotion darf den bisherigen Offline-Core nicht zerstören.

## 23. Leere Zustände

Jeder leere Zustand beantwortet:

1. Was ist hier?
2. Warum ist es leer?
3. Was kann ich jetzt tun?

Beispiele:

- keine Favoriten → „Spiel als Favorit markieren“
- kein Verlauf → „Starte euer erstes Spiel“
- keine Suchergebnisse → Filter zurücksetzen / Suche ändern
- keine Spieler → Spieler hinzufügen / Preset laden

## 24. Fehlermeldungen

Fehlermeldung enthält:

- was passiert ist
- ob Daten sicher sind
- was Nutzer tun kann

Nicht nur:

`Fehler` / `Ungültig` / `Etwas ist schiefgelaufen`.

## 25. Accessibility-Flow

Jeder dynamische Wechsel prüft Fokus:

- Detaildialog öffnen → Fokus in Dialog
- Dialog schließen → Fokus zum auslösenden Spiel zurück
- Reveal → Fokus auf Hauptinhalt/Weiter-Aktion
- neue Runde → Fokus sinnvoll, ohne Screenreader zu überfluten
- Ergebnis → Fokus auf Ergebnisüberschrift
- Pause → Statusmeldung live

## 26. Mobile Prioritäten

Auf kleinem Smartphone müssen immer sichtbar/erreichbar bleiben:

- primäre nächste Aktion
- private Übergabeaktion
- Pause/Skip/Abbruch, wo aktiv
- Timer
- aktuelle Person

Sekundäre Informationen dürfen weiter unten/progressiv offenliegen.

## 27. Aktuelle UX-Funde aus dem Repository

### UX-FIND-001 – Hero-Differenzierung

Aktuelle Startseitenbotschaft fokussiert „Ein Handy · viele Spiele · komplett offline“. Nach Marktanalyse ist das zu generisch.

**Aktion:** Hero/Unterzeile im Design-/Copy-Pass auf Party-Hub-Tiefe und Spieleabend-Nutzen neu formulieren.

### UX-FIND-002 – Startseite vor Katalog

Die Startseite enthält bereits Schnellstart, Empfehlungen, Quick Picks und zuletzt gespielt. Das ist eine gute Grundlage, muss aber stärker auf „Party starten/fortsetzen“ priorisiert werden.

### UX-FIND-003 – Filterdichte

Die Katalogfilter sind funktional umfangreich. Auf kleinen Smartphones muss geprüft werden, ob sechs gleichzeitige Felder Entscheidungsstress oder viel Scroll verursachen.

### UX-FIND-004 – Reifestufenverständnis

Core/Extended/Labs müssen in realen Tests ohne Entwicklererklärung verstanden werden.

### UX-FIND-005 – direkte Word-Imposter-Sondernavigation

Der Header bietet „Word Imposter direkt“. Prüfen, ob dieser Sonderweg die Hub-Positionierung stärkt oder Nutzer verwirrt. Entscheidung erst nach realem Nutzungstest.

## 28. UX-Abnahme vor Release

- [ ] Erststart mit unerfahrenem Nutzer
- [ ] Spieler anlegen
- [ ] Kernspiel über Empfehlung starten
- [ ] Kernspiel über Suche starten
- [ ] Filter auf kleinem Smartphone
- [ ] private Reveal-Kette
- [ ] Timer + Pause
- [ ] Skip
- [ ] Beenden & speichern
- [ ] Abbrechen & verwerfen
- [ ] Replay
- [ ] nächstes Spiel
- [ ] Offline-Neustart
- [ ] Resume nach Reload
- [ ] PWA-Update-Hinweis
- [ ] Backup/Import/Löschung
- [ ] Creator-Erstnutzung
- [ ] 200 % Zoom
- [ ] Tastatur
- [ ] Screenreader-Smoke-Test

## 29. Nächste UX-Arbeit

1. `DESIGN_SYSTEM.md` aus aktuellem CSS/UI ableiten
2. Hero-/Startseitenhierarchie überarbeiten
3. Filter-Mobile-Pattern prüfen
4. Core/Extended/Labs-Erklärung visuell prüfen
5. Kernspiel-Detailkarten vereinheitlichen
6. reale Erstnutzertests vorbereiten

Eine UX-Änderung wird anschließend wieder gegen `USER_SCENARIOS.md`, `REQUIREMENTS.md` und `RISK_REGISTER.md` geprüft.
