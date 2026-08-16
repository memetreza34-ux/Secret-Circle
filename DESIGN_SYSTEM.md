# Secret Circle – Designsystem

Stand: 16. August 2026

## 1. Ziel

Secret Circle soll über Hub, Kernspiele, Advanced, Creator und Datenbereiche wie **ein Produkt** wirken. Das Designsystem priorisiert Bedienbarkeit im Gruppenbetrieb vor visueller Dekoration.

## 2. Designprinzipien

1. **Nächste Aktion zuerst** – primäre Handlung muss sofort erkennbar sein.
2. **Party-tauglich** – große, gut lesbare Elemente auf einem herumgereichten Gerät.
3. **Privat, wenn nötig** – Reveal-/Übergabezustände visuell eindeutig.
4. **Konsistent** – gleiche Bedeutung = gleiche Komponente/Position.
5. **Responsive** – kleines Smartphone ist kein Sonderfall.
6. **Accessible by default** – Fokus, Kontrast, Touch, Zoom und Reduced Motion gehören ins Basissystem.
7. **Schnell** – keine schweren visuellen Abhängigkeiten oder blockierenden Animationen.
8. **Core vor Deko** – ein hübscher Labs-Modus darf nicht besser gepflegt sein als ein Release-Kernflow.

## 3. Aktuelle visuelle Basis

Das aktuelle Produkt verwendet ein dunkles System mit violett/cyaner Akzentwelt.

### Kernfarben aus `party.css`

| Token | Wert | Bedeutung |
|---|---|---|
| `--bg` | `#070b14` | App-Hintergrund |
| `--surface` | `#101827` | Hauptflächen |
| `--surface-2` | `#172033` | Karten/sekundäre Flächen |
| `--surface-3` | `#1d2940` | aktive/tertiäre Flächen |
| `--border` | `#2a3853` | Standardrahmen |
| `--text` | `#f8fafc` | Haupttext |
| `--muted` | `#9fb0c9` | Sekundärtext |
| `--primary` | `#8b5cf6` | primäre Aktion |
| `--primary-strong` | `#7c3aed` | primärer Verlauf |
| `--accent` | `#22d3ee` | Fokus/Akzent |
| `--success` | `#34d399` | Erfolg |
| `--warning` | `#fbbf24` | Warnung/Offline |
| `--danger` | `#fb7185` | Gefahr/Fehler |

### Form

- globaler Hauptradius: `22px`
- große Hero-/Play-Flächen: ca. `28–32px`
- kleinere Controls: ca. `10–16px`
- Karten nutzen weiche Schatten und dünne Borders

Diese Basis wird beibehalten; neue Bereiche sollen nicht eigene unabhängige Farbwelten erfinden.

## 4. Typografie

Aktuelle Font-Familie:

```css
Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

Da Secret Circle keine externe Runtime-Schriftart benötigt, muss das UI auch mit Systemfonts vollständig funktionieren.

### Hierarchie

- Hero/Page H1: sehr deutlich, responsive via `clamp()`
- Section H2: klare Abschnittsebene
- Card H3: Spiel-/Elementtitel
- Body: gut lesbar, keine unnötig kleinen Fließtexte
- Eyebrow: nur für kurze Kategorie-/Kontextzeilen, nicht für wichtige Informationen

### Mindestregeln

- wesentliche Body-Texte nicht unter ca. 16px auf mobilen Eingabeoberflächen
- sekundäre Metadaten dürfen kleiner sein, müssen aber kontrastreich genug bleiben
- keine Information nur über Schriftgröße/Versalien erklären

## 5. Spacing-System

Der aktuelle Code verwendet viele freie Werte. Für neue/refaktorierte Komponenten wird dieses Raster bevorzugt:

- `4px` – Mikroabstand
- `8px` – kompakt
- `12px` – kleine Komponenten
- `16px` – Standardabstand
- `24px` – Abschnitt innen
- `32px` – größere Gruppierung
- `48px` – Seiten-/Hero-Trennung

Ziel ist nicht, sofort jedes bestehende CSS umzuschreiben, sondern neue Inkonsistenzen zu vermeiden und bei betroffenen Komponenten schrittweise zu konsolidieren.

## 6. Touch- und Click-Targets

### Verbindlich

Jede wichtige interaktive Fläche besitzt mindestens **44 × 44 CSS-Pixel**.

Dazu gehören insbesondere:

- Navigation
- Favorit
- Dialog schließen
- Hilfe
- Preset-Aktionen
- Spielkartenaktionen
- Creator-Aktionen
- Sessioncontrols
- Reveal/Weiter/Skip

### Aktueller Fund

Mehrere bestehende Controls liegen noch bei 38–42px. Diese werden auf mindestens 44px angehoben.

Sekundäre Textlinks können kompakter sein, wenn ihre tatsächliche interaktive Fläche trotzdem sicher bedienbar bleibt und sie nicht Teil eines schnellen Partyflows sind.

## 7. Buttons

### Primary

Für die wichtigste nächste Aktion:

- Start
- Weiter
- Speichern
- Reveal, wenn dies die einzige nächste Aktion ist

Eigenschaften:

- violetter Verlauf
- weißer Text
- hoher Kontrast
- mindestens 44px hoch

### Secondary

Für alternative, reversible Aktion:

- zurück
- Favorit
- zusätzliche Auswahl

Transparent/dunkel mit Border.

### Ghost

Für Header-/Toolbar-/Sessionnebenaktionen.

### Danger

Nur für destruktive Aktionen:

- alle Daten löschen
- bestätigtes Verwerfen

Gefahr darf nicht allein durch Rot erklärt werden. Text muss eindeutig sein.

### Verboten

- zwei gleich stark gestaltete Buttons mit gegensätzlicher Wirkung
- „OK“/„Weiter“ ohne Kontext bei destruktiven Entscheidungen
- Abschluss und Verwerfen visuell/sprachlich verwechselbar

## 8. Navigation

Aktueller Hub:

- Start
- Spiele
- Spieler
- Favoriten
- Verlauf
- Daten

### Regeln

- `aria-current` für aktuelle Ansicht
- auf Mobile 3→2 Spalten umbrechen statt horizontales Abschneiden
- Navigation darf bei 200 % Zoom nicht unbedienbar werden
- Label sind wichtiger als Icons

## 9. Game Card

Jede Spielkarte soll in konsistenter Reihenfolge zeigen:

1. Icon/visuelle Identität
2. Spielname
3. kurze Beschreibung
4. Spielerzahl/Dauer/Alter
5. Reifestufe
6. primäre Öffnen-/Startaktion
7. Favorit sekundär

### Reifestufe

- Core darf visuell priorisiert sein
- Extended neutral
- Labs sichtbar experimentell

Reifestufe wird nicht nur über Farbe erklärt.

## 10. Hero / Startseite

Der Hero darf nicht nur „viele Spiele + offline“ kommunizieren.

### Ziel

- ganzer Spieleabend
- schnell starten/fortsetzen
- lokal und ohne Konto
- sichere gemeinsame Nutzung

### Struktur

1. kurze Eyebrow
2. klare Value Proposition
3. ein Satz Nutzen
4. maximal zwei primäre Aktionen
5. sekundäre Produktmetriken nachgeordnet

## 11. Dialoge

### Anforderungen

- Fokus beim Öffnen in Dialog
- Fokus beim Schließen zurück zum Auslöser
- sichtbare Schließen-Aktion ≥44px
- Escape nur, wenn sicher
- destruktive Aktionen benötigen klare Bestätigung
- `aria-modal`/Dialogrolle korrekt

## 12. Play Layer

Während des Spiels soll die Oberfläche radikal einfacher sein als der Hub.

### Priorität

1. aktueller Spielzustand
2. aktive Person
3. private/öffentliche Hauptinformation
4. primäre Rundenaktion
5. Timer/Score, wenn relevant
6. Sessioncontrols

### Sessioncontrols

- Beenden & speichern
- Runde überspringen
- Pause/Fortsetzen
- Abbrechen & verwerfen

Auf kleinen Smartphones einspaltig bzw. klar umbrechend.

## 13. Private Reveal

Private Zustände benötigen eine eigene visuelle Sprache:

### Gedeckt

- Name der vorgesehenen Person
- klare „bereit/reveal“-Aktion
- keine geheime Information

### Offen

- private Information groß und eindeutig
- auffällige „Verdecken/weitergeben“-Aktion
- keine unnötigen anderen Aktionen

### Übergabe

- gedeckter Zwischenzustand
- Name der nächsten Person

Privacy darf nicht nur durch kleine Hinweistexte erklärt werden.

## 14. Timer

### Sichtbare Timer

- große Restzeit
- hoher Kontrast
- Pausezustand klar
- bei kritischer Restzeit keine ausschließlich farbliche Warnung

### Hot Potato

Interne Restzeit bleibt absichtlich verborgen. UI darf keine visuellen Hinweise erzeugen, die die Zufallsdauer verraten.

## 15. Score / Ergebnis

Design muss unterscheiden:

- echter Gewinner
- Rundenergebnis
- Treffer-/Sessionzähler

Keine Trophy-/Siegerdarstellung für bloße Zähler.

`CORE_SCORING_RULES.md` ist semantischer Vertrag.

## 16. Formulare

- Label immer sichtbar
- Placeholder ersetzt kein Label
- Fehler möglichst feldnah
- Browser-Zoom bei iOS vermeiden: Eingabeschrift mobil mindestens 16px
- lange Eingaben mit Limits/Zähler, wo relevant
- Speichern nicht still bei ungültigem Zustand

## 17. Filter

Desktop darf mehrere Felder nebeneinander zeigen.

Mobile:

- Suchfeld zuerst
- restliche Filter klar gruppieren
- bei Bedarf progressive Filtersektion statt sehr langer sofortiger Liste
- aktiver Filterzustand muss erkennbar sein
- „Filter zurücksetzen“ leicht auffindbar

## 18. Empty States

Bestehen aus:

- kurzer Erklärung
- nächster Aktion

Beispiele:

- keine Favoriten → Spiele entdecken
- kein Verlauf → erstes Spiel starten
- keine Suchergebnisse → Filter zurücksetzen

## 19. Statusfarben

Farben unterstützen Bedeutung, ersetzen aber keinen Text.

- Success → grün + Text/Icon
- Warning → gelb + Text/Icon
- Danger → rot/rosa + eindeutiger Text
- Offline → Warnstatus + „Offline“

## 20. Focus

Bestehende globale Basis:

- `3px` Accent-Outline
- `3px` Offset

Diese Basis ist gut und bleibt erhalten.

Jede dynamische Oberfläche muss zusätzlich die **Fokusposition** logisch steuern.

## 21. Motion

- kurze Übergänge
- keine langen Introanimationen vor Spielaktionen
- Animation blockiert keine Eingabe
- `prefers-reduced-motion` deaktiviert/verkürzt Motion

Bestehende Reduced-Motion-Regeln bleiben verbindlich.

## 22. Responsive Breakpoints

Bestehende sinnvolle Ebenen:

- ca. 1000px – Filter/Layouts verdichten
- ca. 900px – Creator-Layout einspaltig
- ca. 760px – Navigation/Advanced reduzieren
- ca. 620px – Creator Mobile
- ca. 480px – sehr kleine Hubansicht

Breakpoints sind kein Selbstzweck. Reale Geräte und 200-%-Zoom entscheiden.

## 23. Safe Areas

Auf iPhone/PWA:

- Top Header
- Seitenränder
- Bottom Controls
- Sticky Wizard Actions

verwenden `env(safe-area-inset-*)`, wo relevant.

Bestehende Verwendung ist eine gute Basis und darf bei neuen Vollbildflächen nicht vergessen werden.

## 24. Creator

Creator bleibt visuell im selben System, darf aber eigene Akzentfarben für nutzergenerierte Karten anbieten.

### Regeln

- Wizard-Schritte sichtbar
- Fortschritt verständlich
- Vorschau sekundär zu Eingabe
- mobile Sticky-Actions sicher über Safe Area
- Templateauswahl nicht nur Farbe
- Fehler feldnah

## 25. Icons

Aktuell werden viele Emojis genutzt.

### Releaseziel

- funktionale Icons konsistent
- Hauptmarke/Navigation/Kernspielidentität professioneller
- Emojis können als Content-/Stimmungsbestandteil bleiben, aber nicht das gesamte visuelle System ersetzen
- keine fremden Markenlogos ohne Rechte

`ASSET_PLAN.md` bleibt Produktionsgrundlage.

## 26. Design-Tokens – nächste technische Konsolidierung

Zusätzlich zu bestehenden Farben sollten schrittweise Tokens für folgende Bereiche eingeführt werden:

- spacing
- control heights
- small/medium/large radius
- typography sizes
- z-index layers
- motion durations

Keine großflächige Tokenmigration kurz vor Release ohne Nutzen; bei ohnehin berührten Komponenten konsolidieren.

## 27. Bekannte Design-/UI-Funde

### DS-FIND-001 – Touchziele unter 44px

Betroffen sind aktuell mehrere 38–42px-Controls in Hub/Advanced/Creator.

**Priorität: P1 Accessibility/Touch.**

### DS-FIND-002 – Hero-USP zu generisch

„Ein Handy · viele Spiele · komplett offline“ ist Marktbaseline.

**Aktion:** Copy in Richtung „ganzer Spieleabend / sicher / lokal / direkt weiterspielen“ verschieben.

### DS-FIND-003 – freie Spacing-/Radiuswerte

Visuell grundsätzlich konsistent, technisch aber noch viele Einzelwerte.

**Aktion:** bei neuen/refaktorierten Komponenten Tokens bevorzugen.

### DS-FIND-004 – Emojis stark präsent

Für Prototyp gut, vor Release bei Kernspiel-Identität/Branding prüfen.

### DS-FIND-005 – Filterdichte mobile

Funktioniert responsive, aber reale 320–390px-/Zoom-Prüfung fehlt.

## 28. Design Definition of Done für Kernscreen

- [ ] klare primäre Aktion
- [ ] keine konkurrierenden Primary Buttons
- [ ] wichtige Touchziele ≥44×44px
- [ ] Tastatur vollständig
- [ ] Fokus sichtbar/logisch
- [ ] 200 % Zoom
- [ ] kleiner Smartphone-Screen
- [ ] Safe Area
- [ ] Reduced Motion
- [ ] Kontrast
- [ ] Status nicht nur Farbe
- [ ] leere/Fehlerzustände
- [ ] keine unnötige Motion/Assetlast
- [ ] gleiche Semantik wie `UX_FLOW.md` / `REQUIREMENTS.md`

## 29. Nächste Designänderungen

1. Touchziel-Verstöße korrigieren
2. Hero-Copy an Produktpositionierung anpassen
3. danach Mobile-Filter/Startseitenhierarchie mit E2E/realem Gerät prüfen
4. Core/Extended/Labs visuelle Verständlichkeit testen
5. eigenes Kernspiel-Iconset anhand `ASSET_PLAN.md` weiterentwickeln
