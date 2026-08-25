# Secret Circle – Accessibility-Vertrag

Stand: 25. August 2026  
Status: **PREPARED – reale Abnahme offen**  
Offline-Core: **`secret-circle-v48` / `secret-circle-v48-staging`**

## 1. Ziel

Secret Circle soll die 15 Kernspiele sowie zentrale Extended-/Labs-/Creator-Flows auch bei Tastaturbedienung, vergrößerter Darstellung, Reduced Motion und assistiven Technologien verständlich halten. Accessibility ist ein Querschnittsvertrag.

## 2. Automatisch geschützte Grundlage

### Dokumentstruktur

- `lang="de"`
- responsiver Viewport mit `viewport-fit=cover`
- Skip-Link auf zentrale Inhalte
- semantische Überschriften und `main`
- Dialoge mit Rolle/Beschriftung
- aktive Hub- und Advanced-Spielrunde als `role="dialog"` + `aria-modal="true"`

### Formulare

- Inputs/Selects/Textareas besitzen sichtbares Label oder ARIA-Beschriftung
- Statusfelder nutzen `role="status"`/`aria-live`, wo dynamische Rückmeldung wichtig ist
- Creator-Template-Auswahl ist eine beschriftete Radiogroup mit genau einem Tab-Stopp
- Word-Imposter-Custom-Eingabe beschreibt ihr 2–200-Begriffe-Limit sichtbar und über `aria-describedby`

### Fokus und Tastatur

- sichtbarer `:focus-visible`-Ring
- Suchvorschläge mit ARIA-Listbox/Autocomplete
- Pfeiltasten, Enter, Escape
- dynamische Hub-Bereichswechsel fokussieren die neue Hauptüberschrift programmatisch
- Hub-Spieldetail und aktive Hub-Spielrunde isolieren den restlichen Dokumenthintergrund mit `inert`
- Tab/Shift+Tab bleibt im aktiven Hub-Overlay
- Advanced-Spieloverlay isoliert den Setup-Hintergrund und hält Fokus im Spiel
- Quick-Phasen stellen Fokus wieder her, wenn die vorherige Aktion beim Re-Render entfernt wurde
- Creator-Schrittüberschriften sind programmatisch fokussierbar
- Creator-Hilfe isoliert den Hintergrund und hält Tab/Shift+Tab im Dialog
- Creator-Template-Radiogroup unterstützt Pfeiltasten sowie Home/End
- Word-Imposter-Voting-Resume führt zur nächsten tatsächlich noch offenen abstimmenden Person
- beim Erstladen bleibt die Skip-Link-Reihenfolge unverändert

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

v46 führte `party-hub-a11y.js` ein:

- Hub-Bereichsfokus auf sichtbare Hauptüberschrift
- modale Hintergrundisolation mit `inert`
- Fokus-Trap für Spieldetail und aktive Hub-Spielrunde
- stabiler Rückkehrfokus nach Schließen des Spieldetails
- Unit-/E2E-/Auditverträge

## 4. v47 Advanced-/Quick-/Creator-Hardening

v47 führte `secondary-surface-a11y.js` ein:

- Advanced-Spielrunde als modaler Dialog mit Hintergrundisolation und Tab-Fokus-Trap
- Quick-Phasen-Fokus-Recovery nach dynamischem DOM-Austausch
- Creator-Wizard-Schrittüberschriften mit `tabindex="-1"` für echte programmatische Fokusführung
- Creator-Hilfe als modaler Tastaturkontext mit `inert`-Hintergrund
- Creator-Template-Radiogroup mit roving `tabindex`, Arrow-Tasten sowie Home/End
- Unit-/E2E-/Auditverträge

Diese v47-A11y-Schicht bleibt **unverändert Bestandteil des aktuellen v48-Offline-Core**.

## 5. v48 Word-Imposter-UX-/Daten-Hardening

v48 ist primär ein Daten-/Resume-Release, besitzt aber auch Accessibility-relevante UI-Verträge:

- die nächste abstimmende Person wird aus den tatsächlich offenen Stimmen abgeleitet, sodass Resume nicht auf einen bereits abgeschlossenen Wähler zeigt,
- das Custom-Panel kommuniziert **maximal 50 Kategorien** und **2–200 Begriffe je Kategorie** sichtbar,
- das Begriffe-Textarea verweist programmatisch auf den erklärenden Hilfetext,
- Importfehler werden als Statusmeldung ausgegeben und dürfen Bestandsdaten nicht still verändern.

`tests/word-imposter-data-contract.test.js` schützt die statische Verbindung zwischen UI und Datenvertrag. Dies ist **kein Ersatz** für reale Screenreader-/Tastaturtests mit großen gültigen Datensätzen.

## 6. Anzeigenamen und Screenreader

Technische IDs sind kein Nutzerlabel.

Aktuell müssen sichtbare/angesagte Titel dem finalen Katalog entsprechen:

- `anime-guess` → **Anime-Archetypen erraten**
- `wavelength` → **Spektrum-Tipp**

Ein Screenreader soll nicht versehentlich interne IDs oder veraltete sichtbare Namen als Hauptbezeichnung erhalten.

## 7. Flow-Matrix

| Flow | Automatische Grundlage | Manuelle Abnahme |
|---|---|---|
| Hub-Start/Katalog | Struktur, Skip-Link, Bereichsfokus, Labels, Suche | 200 % Zoom, Screenreader |
| Spieler/Presets | Labels, Textarea, Status | lange Namen, Zoom, VoiceOver/TalkBack |
| Hub-Spieldetail | Dialogrolle, `aria-modal`, Hintergrund `inert`, Fokus-Trap, Rückkehrfokus | Screenreader-/Browserrealität |
| direkte Hub-Spiele | modales Spieloverlay, Fokus-/Statusgrundlage, 44px Controls | komplette Tastatur-/Screenreader-Runde |
| Word-Imposter Voting | offene-Wähler-Ableitung + Resume-Guard | partielle Abstimmung mit Screenreader/Tastatur |
| Word-Imposter Custom | sichtbare/programmatische 50-/2–200-Hinweise | große valide Kategorie + Fehlermeldung real |
| private Reveals | verdeckter Zustand/Status | Übergabe mit Screenreader real |
| Timer | Pausezustand, Live-Status | Sperrbildschirm + Reduced Motion |
| Advanced | modales Spieloverlay, Fokus-Recovery, Privacy-/Resume-Guards | private Rollen/Abstimmung per Screenreader |
| Quick/Extended | dynamisches Fokus-Recovery, Labels/Status/Sessioncontrols | Spektrum-Tipp + weitere Flows real |
| Creator | Wizard-Schrittfokus, Radiogroup-Tastatur, modale Hilfe | kompletter Wizard ohne Maus + Screenreader |
| Daten/Backup | Labels, Status, Bestätigung | Dateiimport mit assistiver Technik |

## 8. Manuelle Release-Gates

Vor `ACCESSIBILITY PASS`:

- [ ] gesamte App bei 200 % Browserzoom ohne verlorene Kernfunktion
- [ ] kleine Smartphonebreite ohne horizontale Pflichtnavigation
- [ ] vollständiger Hub-Kernflow nur Tastatur
- [ ] Hub-Bereichswechsel Fokus in Chrome/Safari/Firefox real nachvollziehbar
- [ ] Hub-Spieldetail verliert Tab-Fokus nicht in den Hintergrund
- [ ] aktive Hub-Spielrunde verliert Tab-Fokus nicht in den Hintergrund
- [ ] Advanced-Spielrunde verliert Tab-Fokus nicht in Setup/Seitenhintergrund
- [ ] Quick-Phasenwechsel behalten einen sinnvollen Fokuspunkt
- [ ] Creator-Schrittwechsel werden mit Tastatur/Screenreader verständlich angekündigt
- [ ] Creator-Template-Radiogroup mit Pfeiltasten/Home/End real bedienbar
- [ ] Creator-Hilfe verliert Fokus nicht in den Hintergrund und kehrt zum Auslöser zurück
- [ ] Word-Imposter-Teilabstimmung nach Reload zeigt/ansagt die richtige nächste Person
- [ ] Word-Imposter-Custom-Hilfe und Grenzfehler sind mit Screenreader verständlich
- [ ] mindestens ein Core-Spiel nur Tastatur
- [ ] Word-Imposter-Reveal mit Screenreader-Smoke
- [ ] Advanced-Private-Reveal mit Screenreader-Smoke
- [ ] Spektrum-Tipp verständlich benannt/bedienbar
- [ ] Creator-Wizard komplett nur Tastatur
- [ ] VoiceOver auf iPhone/iPad
- [ ] TalkBack auf Android
- [ ] Reduced Motion real geprüft
- [ ] sichtbarer Fokus auf kritischen Controls
- [ ] keine Information ausschließlich durch Farbe
- [ ] Touchziele real geprüft

## 9. Screenreader-Prüffragen

1. Ist klar, welche Seite/Phase geöffnet ist?
2. Wird die aktive Person verständlich benannt?
3. Wird privater Inhalt nicht vor bewusstem Reveal angesagt?
4. Ist nach einer Aktion klar, was passiert ist?
5. Ist die nächste Aktion auffindbar?
6. Wird Pause/Fortsetzen programmatisch vermittelt?
7. Bleibt nach Dialogschluss ein sinnvoller Fokuspunkt?
8. Bleibt während eines modalen Overlays der Hintergrund aus Interaktion und Lesereihenfolge heraus?
9. Wird ein Creator-Schrittwechsel sinnvoll angekündigt?
10. Wird beim Word-Imposter-Voting nach Resume die richtige nächste Person angekündigt?
11. Sind Word-Imposter-Custom-Grenzen und Importfehler ohne rein visuelle Hinweise verständlich?
12. Wird der aktuelle sichtbare Produktname statt einer technischen ID angesagt?

## 10. Zoom-/Reflow-Prüfung

Bei 200 % Zoom:

- Texte nicht abgeschnitten
- Buttons nicht überlagert
- Dialoge scrollbar
- Timer und zentrale Spielkarte erreichbar
- Sessioncontrols bedienbar
- Creator-Wizard und Hilfe erreichbar
- Word-Imposter-Custom-Editor und Hilfetext erreichbar
- keine wichtige horizontale Scrollpflicht
- Safe Areas berücksichtigt

## 11. Grenzen der Automatisierung

Ein statischer Test oder Playwright-Vertrag kann Attribute, Fokuspfade und CSS-/DOM-Grenzen prüfen, aber nicht beweisen, dass VoiceOver/TalkBack sinnvoll klingen oder ein reales 200-%-Layout verständlich ist.

**Unit/E2E/A11y-/Word-Data-Verträge grün ≠ ACCESSIBILITY PASS.**

Finaler Pass benötigt dokumentierte reale Bedienung.