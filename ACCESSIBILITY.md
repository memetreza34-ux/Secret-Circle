# Secret Circle – Accessibility-Vertrag

Stand: 25. August 2026  
Status: **PREPARED – reale Abnahme offen**  
Offline-Core: **`secret-circle-v46` / `secret-circle-v46-staging`**

## 1. Ziel

Secret Circle soll die 15 Kernspiele sowie zentrale Extended-/Labs-/Creator-Flows auch bei Tastaturbedienung, vergrößerter Darstellung, Reduced Motion und assistiven Technologien verständlich halten. Accessibility ist ein Querschnittsvertrag.

## 2. Automatisch geschützte Grundlage

### Dokumentstruktur

- `lang="de"`
- responsiver Viewport mit `viewport-fit=cover`
- Skip-Link auf zentrale Inhalte
- semantische Überschriften und `main`
- Dialoge mit Rolle/Beschriftung
- aktive Hub-Spielrunde als `role="dialog"` + `aria-modal="true"`

### Formulare

- Inputs/Selects/Textareas besitzen sichtbares Label oder ARIA-Beschriftung
- Statusfelder nutzen `role="status"`/`aria-live`, wo dynamische Rückmeldung wichtig ist

### Fokus und Tastatur

- sichtbarer `:focus-visible`-Ring
- Suchvorschläge mit ARIA-Listbox/Autocomplete
- Pfeiltasten, Enter, Escape
- dynamische Hub-Bereichswechsel fokussieren die neue Hauptüberschrift programmatisch
- Spieldetail und aktive Hub-Spielrunde isolieren den restlichen Dokumenthintergrund mit `inert`
- Tab/Shift+Tab bleibt über `party-hub-a11y.js` innerhalb des aktiven Overlays
- beim Erstladen bleibt die Skip-Link-Reihenfolge unverändert
- nach Schließen des Spieldetails kehrt Fokus zum auslösenden Spielbutton zurück

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

## 3. v46 Hub-Accessibility-Hardening

Neu in v46:

- `party-hub-a11y.js` als eigenständige kleine Accessibility-Schicht
- `party-hub-polish.js` lädt die A11y-Schicht
- `party.html` kennzeichnet die aktive Spielrunde als modalen Dialog
- Hintergrund-Siblings werden während Detail-/Spieloverlay `inert`
- dynamisch neu hinzugefügte Body-Siblings werden bei offenem Overlay ebenfalls isoliert
- Fokus-Trap behandelt Tab und Shift+Tab
- neue sichtbare Hub-Ansicht erhält einen programmatischen Fokuspunkt auf `h1/h2` mit `tabindex="-1"`
- `tests/accessibility-contract.test.js` schützt den statischen Vertrag
- `tests/e2e/accessibility-core.spec.js` schützt Bereichsfokus, Modal-Isolation und Fokus-Trap im Browser
- `scripts/hub_a11y_contract_audit.py` ist Teil von `npm run validate`
- `party-hub-a11y.js` ist Bestandteil des v46-Offline-Core

**PREPARED bleibt bewusst bestehen:** Ohne funktionierenden Runner sowie reale VoiceOver-/TalkBack-/Zoom-/Touchprüfung ist dies noch kein Accessibility PASS.

## 4. Anzeigenamen und Screenreader

Technische IDs sind kein Nutzerlabel.

Aktuell müssen sichtbare/angesagte Titel dem finalen Katalog entsprechen:

- `anime-guess` → **Anime-Archetypen erraten**
- `wavelength` → **Spektrum-Tipp**

Ein Screenreader soll nicht versehentlich interne IDs oder veraltete sichtbare Namen als Hauptbezeichnung erhalten.

## 5. Core-/Hub-Flow-Matrix

| Flow | Automatische Grundlage | Manuelle Abnahme |
|---|---|---|
| Hub-Start/Katalog | Struktur, Skip-Link, Bereichsfokus, Labels, Suche | 200 % Zoom, Screenreader |
| Spieler/Presets | Labels, Textarea, Status | lange Namen, Zoom, VoiceOver/TalkBack |
| Spieldetail-Dialog | Dialogrolle, `aria-modal`, Hintergrund `inert`, Fokus-Trap, Rückkehrfokus | Screenreader-/Browserrealität |
| direkte Hub-Spiele | modales Spieloverlay, Fokus-/Statusgrundlage, 44px Controls | komplette Tastatur-/Screenreader-Runde |
| private Reveals | verdeckter Zustand/Status | Übergabe mit Screenreader real |
| Timer | Pausezustand, Live-Status | Sperrbildschirm + Reduced Motion |
| Advanced | semantischer Setup-Bereich | private Rollen/Abstimmung per Screenreader |
| Quick/Extended | Labels/Status/Sessioncontrols | Spektrum-Tipp + andere Flows real |
| Creator | Labels, Wizardstruktur | kompletter Wizard ohne Maus |
| Daten/Backup | Labels, Status, Bestätigung | Dateiimport mit assistiver Technik |

## 6. Manuelle Release-Gates

Vor `ACCESSIBILITY PASS`:

- [ ] gesamte App bei 200 % Browserzoom ohne verlorene Kernfunktion
- [ ] kleine Smartphonebreite ohne horizontale Pflichtnavigation
- [ ] vollständiger Hub-Kernflow nur Tastatur
- [ ] Bereichswechsel Fokus in Chrome/Safari/Firefox real nachvollziehbar
- [ ] Spieldetail-Modal verliert Tab-Fokus nicht in den Hintergrund
- [ ] aktive Hub-Spielrunde verliert Tab-Fokus nicht in den Hintergrund
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

## 7. Screenreader-Prüffragen

1. Ist klar, welche Seite/Phase geöffnet ist?
2. Wird die aktive Person verständlich benannt?
3. Wird privater Inhalt nicht vor bewusstem Reveal angesagt?
4. Ist nach einer Aktion klar, was passiert ist?
5. Ist die nächste Aktion auffindbar?
6. Wird Pause/Fortsetzen programmatisch vermittelt?
7. Bleibt nach Dialogschluss ein sinnvoller Fokuspunkt?
8. Bleibt während eines modalen Overlays der Hintergrund aus der Lesereihenfolge/Interaktion heraus?
9. Wird der aktuelle sichtbare Produktname statt einer technischen ID angesagt?

## 8. Zoom-/Reflow-Prüfung

Bei 200 % Zoom:

- Texte nicht abgeschnitten
- Buttons nicht überlagert
- Dialoge scrollbar
- Timer und zentrale Spielkarte erreichbar
- Sessioncontrols bedienbar
- keine wichtige horizontale Scrollpflicht
- Safe Areas berücksichtigt

## 9. Grenzen der Automatisierung

Ein statischer Test oder Playwright-Vertrag kann Attribute, Fokuspfade und CSS-/DOM-Grenzen prüfen, aber nicht beweisen, dass VoiceOver/TalkBack sinnvoll klingen oder ein reales 200-%-Layout verständlich ist.

**`tests/accessibility-contract.test.js` + E2E + A11y-Audit grün ≠ ACCESSIBILITY PASS.**

Finaler Pass benötigt dokumentierte reale Bedienung.
