# Changelog

Alle nennenswerten Änderungen an Secret Circle werden hier dokumentiert.

## Unreleased – Januar-2027 Release Foundation

### Release-/A-bis-Z-Prozess

- A-bis-Z-Masterprozess, operativer Tracker, Risk Register, Produkt-/UX-/Architektur-/Security-/Accessibility-/Beta-/Legal-/Support-/Incident-/Maintenance-/Environment-Verträge ergänzt.
- `BRANCH_PROTECTION.md` und `scripts/branch_protection_contract_audit.py` definieren jetzt den zukünftigen Required-Check-Vertrag.
- gewünschter normaler PR-Check: **`Secret Circle CI / validate`**.
- Cross-Browser bleibt bei aktuellem `workflow_dispatch` separater RC-Gate und wird nicht fälschlich als permanenter PR-Required-Check verlangt.

### Core-Content

- alle 15 priorisierten Core-Games auf definierte quantitative Releaseziele gebracht.
- 15/15 erster manueller Core-Quellpass dokumentiert.
- persönliche Inhalte sichtbar freiwillig/überspringbar.

### Reference-Safe-Content

#### PWA v36

- `Bluetooth` → `Funkverbindung`
- `Oscar` → `Filmpreis`
- `Formel 1` → `Motorsport`

#### PWA v37/v40

- `anime-guess` als **Anime-Archetypen erraten** mit 4 generischen Packs / 40 Archetypen.
- 40 frühere konkrete Anime-Figuren seit v40 physisch aus `party-mega-catalog.js` entfernt.

#### PWA v38

- drei unnötig konkrete olympisch/Grand-Slam-nahe Viral-Sportformulierungen neutralisiert.

#### PWA v39/v41

- stabile ID `wavelength`, sichtbarer Titel upstream **Spektrum-Tipp**.
- Browser-Tabu upstream `Tab` statt `Chrome`.
- Emoji-Quiz `Löwenkönig` → generisches `Löwe`.
- `party-core-classic-content.js` auf v4.
- `scripts/reference_content_audit.py` scannt acht ausgelieferte Contentquellen.

### PWA v42 – Asset-Hardening

- fehlendes `icon-192.png` durch echtes 192×192-PNG ergänzt.
- falsch dimensioniertes `icon-512.png` durch echtes 512×512-PNG ersetzt.
- Rasterableitung aus `icon.svg`, SHA-256, PNG-IHDR und Manifestgrößen werden geprüft.
- Root-SVG-Rechtebasis bleibt bewusst `unresolved` bis menschlicher Bestätigung.

### PWA v43 – Privacy Source Hardening

Die zwei früher identifizierten Private-Device-Truth/Dare-Prompts sind jetzt **physisch aus `party-catalog.js` entfernt**:

- Kamerarollen-Frage → `Welches Foto-Motiv findest du besonders lustig?`
- letzte Handy-Nachricht vorlesen → `Lies einen selbst erfundenen Satz wie einen dramatischen Theatermonolog vor.`

Zusätzlich:

- `scripts/privacy_content_audit.py` ergänzt.
- Audit scannt acht ausgelieferte Built-in-Contentquellen.
- blockiert konkrete Aufforderungen zur Offenlegung privater Chats/Nachrichten, Fotos/Kamerarolle, Passwörter, Adresse, Telefonnummer, Standort oder Kontodaten.
- harmlose Geräte-/Chat-Erwähnungen werden bewusst nicht pauschal blockiert.
- Audit in `npm run validate` integriert.
- Service Worker auf **`secret-circle-v43`** / `secret-circle-v43-staging` angehoben.
- Service-Worker-Test auf v43 synchronisiert und verlangt `party-catalog.js` offline.
- Architektur, Deployment, Privacy, Environment, README, Release-Status, A-bis-Z-Tracker und Release-Checkliste auf v43 synchronisiert.

### Backup / Security

- Backup Registry v2 ist zentrale Quelle für Complete-Backup-Format, Größenlimits und erlaubte Storage-Key-Familien.
- unbekannte `secret-circle-*`-Namespaces werden beim Complete-Import abgelehnt.
- vollständiges Löschen bleibt bewusst breit.

### Accessibility / Beta

- statischer Accessibility-Contract und Playwright-E2E-Basis vorhanden.
- reale Android-/iPhone-/Tablet-, VoiceOver-/TalkBack-/200-%-Zoom- und Gruppentests bleiben offen.

### Third Party / Assets / Legal

- `@playwright/test` 1.54.2 upstream als Apache-2.0 verifiziert.
- Asset-Provenienz-, Media-Inventar-, Reference-, Privacy- und Placeholder-Audits Bestandteil des Qualitätsprozesses.
- finale Rechtebasis des Root-SVGs, transitive Dependencyinventur, Betreiber-/Support-/Hostingangaben und manueller Visual-/Legal-Pass bleiben offen.

### CI / Build – noch offen

- GitHub Actions beendet geprüfte `validate`-Jobs weiterhin vor Repository-Steps mit `steps: []`.
- dadurch sind v41–v43-Audits/Tests nicht belastbar runner-verifiziert.
- `package-lock.json` fehlt weiterhin; keine Integrity-Werte wurden erfunden.
- final muss auf `npm ci` umgestellt werden.
- tatsächliche Branch Protection/Required Checks sind noch nicht bestätigt.

### Release-Status

- PR #13 bleibt Draft und ungemergt.
- öffentlicher Release bleibt **NO_GO**, bis CI, Lockfile, Branch Protection, Privacy-/Reference-/Asset-Audits, reale Geräte/PWA-Upgrades, Accessibility, Gruppen, Rechte, Legal/Support und Staging bestanden sind.
