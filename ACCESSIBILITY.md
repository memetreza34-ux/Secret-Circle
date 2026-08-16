# Secret Circle – Accessibility-Vertrag

Stand: 16. August 2026
Status: **PREPARED – reale Abnahme offen**

## 1. Ziel

Secret Circle soll die 15 Kernspiele auch bei Tastaturbedienung, vergrößerter Darstellung, Reduced Motion und assistiven Technologien verständlich halten. Accessibility ist kein später Designcheck, sondern ein Querschnittsvertrag.

## 2. Automatisch geschützte Grundlage

### Dokumentstruktur

- `lang="de"`
- responsiver Viewport mit `viewport-fit=cover`
- Skip-Link auf den zentralen Inhalt der Hauptoberflächen
- semantische Überschriften und `main`
- Dialoge mit `role="dialog"`, `aria-modal` und beschrifteter Überschrift

### Formulare

- Inputs/Selects/Textareas besitzen sichtbares `<label for>` oder ARIA-Beschriftung
- Statusfelder nutzen `role="status"`/`aria-live`, wo dynamische Rückmeldung wichtig ist

### Fokus und Tastatur

- sichtbarer `:focus-visible`-Ring
- Suchvorschläge besitzen ARIA-Listbox/Autocomplete
- Pfeiltasten, Enter und Escape für Suchvorschläge
- Skip-Link wird bei Fokus sichtbar
- dynamische Spielübergänge sollen Fokus auf die nächste sinnvolle Aktion oder Überschrift setzen

### Touch

Wichtige interaktive Controls: mindestens **44 × 44 CSS-Pixel**. Primäre Buttons sind größer. Frühere 36–42px-Ausnahmen wurden im Designpass angehoben.

### Bewegung

- `prefers-reduced-motion: reduce` wird respektiert
- keine Funktion darf von Animation abhängig sein
- Timer laufen unabhängig von visueller Bewegung

### Persönliche Inhalte

Hub und Advanced-Setup erklären sichtbar:

- persönliche Angaben sind freiwillig
- Runden dürfen übersprungen werden
- niemand muss einen Skip begründen

Das ist sowohl Safety als auch kognitive/soziale Accessibility.

## 3. Core-Flow-Matrix

| Flow | Automatische Grundlage | Manuelle Abnahme |
|---|---|---|
| Hub-Start/Katalog | Struktur, Fokus, Labels, Suche | 200 % Zoom, Screenreader |
| Spieler/Presets | Labels, Textarea, Status | lange Namen, Zoom, VoiceOver/TalkBack |
| Spieldetail-Dialog | Dialogrollen/Beschriftung | Fokusfalle/Rückkehrfokus real |
| direkte Hub-Spiele | Fokus-/Statusgrundlage, 44px Controls | komplette Tastatur-/Screenreader-Runde |
| private Reveals | verdeckter Zustand/Status | Übergabe mit Screenreader real |
| Timer | Pausezustand, Live-Status | Sperrbildschirm + Reduced Motion |
| Advanced | semantischer Setup-Bereich | private Rollen/Abstimmung per Screenreader |
| Quick Modes | Labels/Status/Sessioncontrols | Touch + Tastatur + Zoom |
| Creator | Labels, Wizardstruktur | kompletter Wizard ohne Maus |
| Daten/Backup | Labels, Status, Bestätigung | Dateiimport mit assistiver Technik |

## 4. Manuelle Release-Gates

Vor `ACCESSIBILITY PASS`:

- [ ] gesamte App bei 200 % Browserzoom ohne verlorene Kernfunktion
- [ ] kleine Smartphonebreite ohne horizontale Pflichtnavigation in Kernflows
- [ ] vollständiger Hub-Kernflow nur Tastatur
- [ ] mindestens ein Core-Spiel nur Tastatur
- [ ] Word-Imposter-Reveal mit Screenreader-Smoke
- [ ] Advanced-Private-Reveal mit Screenreader-Smoke
- [ ] Creator-Wizard nur Tastatur
- [ ] VoiceOver auf iPhone oder iPad
- [ ] TalkBack auf Android
- [ ] Reduced Motion real geprüft
- [ ] sichtbarer Fokus auf allen kritischen Controls
- [ ] keine Information ausschließlich durch Farbe
- [ ] Touchziele auf realem Smartphone geprüft

## 5. Screenreader-Prüffragen

Bei jedem dynamischen Zustand prüfen:

1. Ist klar, welche Seite/Phase geöffnet ist?
2. Wird die aktive Person verständlich benannt?
3. Wird ein privater Inhalt nicht versehentlich angesagt, bevor er bewusst geöffnet wurde?
4. Ist nach einer Aktion klar, was passiert ist?
5. Ist die nächste Aktion auffindbar?
6. Wird Pause/Fortsetzen programmatisch vermittelt?
7. Bleibt nach Dialogschluss ein sinnvoller Fokuspunkt?

## 6. Zoom-/Reflow-Prüfung

Bei 200 % Zoom:

- Texte nicht abgeschnitten
- Buttons nicht überlagert
- Dialoge scrollbar
- Timer und zentrale Spielkarte sichtbar erreichbar
- Sessioncontrols weiterhin bedienbar
- keine wichtige horizontale Scrollpflicht
- Safe Areas auf mobilen Standalone-PWAs berücksichtigt

## 7. Grenzen der Automatisierung

Ein statischer Test kann vorhandene Attribute und CSS-Verträge prüfen, aber nicht beweisen, dass VoiceOver/TalkBack sinnvoll klingen oder ein reales 200-%-Layout verständlich ist.

Deshalb gilt:

**`tests/accessibility-contract.test.js` grün ≠ ACCESSIBILITY PASS.**

Finaler Pass benötigt dokumentierte reale Bedienung.
