# Secret Circle – Accessibility-Vertrag

Stand: 16. August 2026
Status: **PREPARED – reale Abnahme offen**

## 1. Ziel

Secret Circle soll die 15 Kernspiele sowie zentrale Extended-/Labs-/Creator-Flows auch bei Tastaturbedienung, vergrößerter Darstellung, Reduced Motion und assistiven Technologien verständlich halten. Accessibility ist ein Querschnittsvertrag.

## 2. Automatisch geschützte Grundlage

### Dokumentstruktur

- `lang="de"`
- responsiver Viewport mit `viewport-fit=cover`
- Skip-Link auf zentrale Inhalte
- semantische Überschriften und `main`
- Dialoge mit Rolle/Beschriftung

### Formulare

- Inputs/Selects/Textareas besitzen sichtbares Label oder ARIA-Beschriftung
- Statusfelder nutzen `role="status"`/`aria-live`, wo dynamische Rückmeldung wichtig ist

### Fokus und Tastatur

- sichtbarer `:focus-visible`-Ring
- Suchvorschläge mit ARIA-Listbox/Autocomplete
- Pfeiltasten, Enter, Escape
- dynamische Übergänge setzen Fokus sinnvoll

### Touch

Wichtige interaktive Controls: mindestens **44 × 44 CSS-Pixel**.

### Bewegung

- `prefers-reduced-motion: reduce`
- keine Funktion hängt von Animation ab
- Timer laufen fachlich unabhängig von visueller Bewegung

### Persönliche Inhalte

Hub und Advanced erklären sichtbar:

- persönliche Angaben freiwillig
- Runden überspringbar
- keine Begründung nötig

## 3. Anzeigenamen und Screenreader

Technische IDs sind kein Nutzerlabel.

Aktuell müssen sichtbare/angesagte Titel dem finalen Katalog entsprechen:

- `anime-guess` → **Anime-Archetypen erraten**
- `wavelength` → **Spektrum-Tipp**

Ein Screenreader soll nicht versehentlich interne IDs oder veraltete sichtbare Namen als Hauptbezeichnung erhalten.

## 4. Core-/Hub-Flow-Matrix

| Flow | Automatische Grundlage | Manuelle Abnahme |
|---|---|---|
| Hub-Start/Katalog | Struktur, Fokus, Labels, Suche | 200 % Zoom, Screenreader |
| Spieler/Presets | Labels, Textarea, Status | lange Namen, Zoom, VoiceOver/TalkBack |
| Spieldetail-Dialog | Dialogrollen/Beschriftung | Fokusfalle/Rückkehrfokus real |
| direkte Hub-Spiele | Fokus-/Statusgrundlage, 44px Controls | komplette Tastatur-/Screenreader-Runde |
| private Reveals | verdeckter Zustand/Status | Übergabe mit Screenreader real |
| Timer | Pausezustand, Live-Status | Sperrbildschirm + Reduced Motion |
| Advanced | semantischer Setup-Bereich | private Rollen/Abstimmung per Screenreader |
| Quick/Extended | Labels/Status/Sessioncontrols | Spektrum-Tipp + andere Flows real |
| Creator | Labels, Wizardstruktur | kompletter Wizard ohne Maus |
| Daten/Backup | Labels, Status, Bestätigung | Dateiimport mit assistiver Technik |

## 5. Manuelle Release-Gates

Vor `ACCESSIBILITY PASS`:

- [ ] gesamte App bei 200 % Browserzoom ohne verlorene Kernfunktion
- [ ] kleine Smartphonebreite ohne horizontale Pflichtnavigation
- [ ] vollständiger Hub-Kernflow nur Tastatur
- [ ] mindestens ein Core-Spiel nur Tastatur
- [ ] Word-Imposter-Reveal mit Screenreader-Smoke
- [ ] Advanced-Private-Reveal mit Screenreader-Smoke
- [ ] Spektrum-Tipp verständlich benannt/bedienbar
- [ ] Creator-Wizard nur Tastatur
- [ ] VoiceOver auf iPhone/iPad
- [ ] TalkBack auf Android
- [ ] Reduced Motion real geprüft
- [ ] sichtbarer Fokus auf kritischen Controls
- [ ] keine Information ausschließlich durch Farbe
- [ ] Touchziele real geprüft

## 6. Screenreader-Prüffragen

1. Ist klar, welche Seite/Phase geöffnet ist?
2. Wird die aktive Person verständlich benannt?
3. Wird privater Inhalt nicht vor bewusstem Reveal angesagt?
4. Ist nach einer Aktion klar, was passiert ist?
5. Ist die nächste Aktion auffindbar?
6. Wird Pause/Fortsetzen programmatisch vermittelt?
7. Bleibt nach Dialogschluss ein sinnvoller Fokuspunkt?
8. Wird der aktuelle sichtbare Produktname statt einer technischen ID angesagt?

## 7. Zoom-/Reflow-Prüfung

Bei 200 % Zoom:

- Texte nicht abgeschnitten
- Buttons nicht überlagert
- Dialoge scrollbar
- Timer und zentrale Spielkarte erreichbar
- Sessioncontrols bedienbar
- keine wichtige horizontale Scrollpflicht
- Safe Areas berücksichtigt

## 8. Grenzen der Automatisierung

Ein statischer Test kann Attribute/CSS-Verträge prüfen, aber nicht beweisen, dass VoiceOver/TalkBack sinnvoll klingen oder ein reales 200-%-Layout verständlich ist.

**`tests/accessibility-contract.test.js` grün ≠ ACCESSIBILITY PASS.**

Finaler Pass benötigt dokumentierte reale Bedienung.
