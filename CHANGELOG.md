# Changelog

Alle nennenswerten Änderungen an Secret Circle werden hier dokumentiert.

## Unreleased – Januar-2027 Release Foundation

### Release-/A-bis-Z-Prozess

- `APP_ENTWICKLUNG_VON_A_BIS_Z.md` als Masterprozess von Discovery bis Maintenance eingeführt und Secret-Circle-spezifisch erweitert.
- Operativer Tracker `APP_DEVELOPMENT_STATUS.md`, Risikoregister, Produktbrief, Nutzerszenarien, Marktanalyse, Requirements, UX-Flow, Designsystem, Security/Threat Model, Accessibility, Beta, Legal, Support, Incident Response, Maintenance und Environment-Vertrag ergänzt.
- Release-Audit verlangt Content-, Reference-Source-, Accessibility-, Asset-Provenienz-, Placeholder-, Legal-/Support-/Operations- und Environment-Nachweise.

### Core-Content

- alle 15 priorisierten Core-Games auf definierte quantitative Releaseziele gebracht.
- 15/15 erster manueller Core-Quellpass dokumentiert.
- private Truth/Dare-Prompts entfernt, die Kamerarolle oder letzte private Handy-Nachricht als Spielmaterial verwenden konnten.
- sichtbare Freiwilligkeits-/Skip-Regel im Hub und Advanced-Bereich ergänzt.

### Reference-Safe-Content

#### PWA v36

- Word Imposter: `Bluetooth` → `Funkverbindung`.
- Word Imposter: `Oscar` → `Filmpreis`.
- Word Imposter: `Formel 1` → `Motorsport`.

#### PWA v37

- `anime-guess` final als **Anime-Archetypen erraten** mit vier generischen Packs und 40 eigenständigen Archetypen ausgeliefert.
- finale Runtime-Schicht blockiert die 40 früher inventarisierten konkreten Figuren im ausgespielten Katalog.

#### PWA v38

- Viral `higher-lower`: drei unnötig konkrete olympisch/Grand-Slam-bezogene Sportformulierungen durch neutrale Fragen mit denselben Zahlenwerten ersetzt.

#### PWA v39

- finale Tabu-Browserkarte auf `Tab` statt `Chrome` umgestellt.
- stabile interne ID `wavelength` sichtbar als **Spektrum-Tipp** statt Wellenlänge dargestellt.
- `party-core-classic-content.js` auf Version 3 angehoben.

#### PWA v40

- die 40 historischen konkreten Anime-Figuren vollständig aus der tatsächlich ausgelieferten `party-mega-catalog.js` entfernt.
- `tests/party-mega-catalog.test.js` liest die ausgelieferte Quelle selbst ein und blockiert die Rückkehr dieser Namen.

#### PWA v41

- `party-expansion.js` liefert die stabile ID `wavelength` bereits upstream mit sichtbarem Titel **Spektrum-Tipp**.
- Browser-Tabu enthält bereits upstream `Tab` statt `Chrome`; der nachträgliche Classic-Fallback wurde entfernt.
- Emoji-Quiz: `🦁👑 → Löwenkönig` durch generisches `🦁🌾 → Löwe` ersetzt.
- `party-core-classic-content.js` auf **Version 4** vereinfacht; dort verbleiben nur noch zwei Privacy-Editorial-Replacements.
- `scripts/reference_content_audit.py` ergänzt. Der Audit scannt acht tatsächlich ausgelieferte Contentquellen und blockiert bewusst entfernte konkrete Referenzen sowie ausgewählte nicht freigegebene hochprofilige Plattform-/Franchise-Namen.
- Reference-Source-Audit in `npm run validate` integriert.
- Core-, Architektur- und Release-Audits auf den physischen Source-Vertrag umgestellt.

Die v41-Verträge sind implementiert, aber wegen des aktuellen Actions-Runnerproblems noch **nicht belastbar als grün ausgeführt dokumentiert**.

### Backup / Security

- `backup-schema-registry.js` auf Registry v2 als zentrale Quelle für Complete-Backup-Format, Größenlimits und zulässige Storage-Key-Familien erweitert.
- `party-data-tools.js` konsumiert das zentrale Registry-Schema statt kritische Grenzen zu duplizieren.
- unbekannte `secret-circle-*`-Namespaces werden beim Complete-Import abgelehnt.
- vollständiges Löschen bleibt bewusst breit und entfernt auch alte/verwaiste Secret-Circle-Schlüssel.
- `party.html` lädt Backup-Registry vor den Datentools.

### PWA / Offline

- kontrollierte staged Updates mit sichtbarer Nutzeraktivierung und nicht-destruktiver Promotion beibehalten.
- aktueller Offline-Core: **`secret-circle-v41`** / `secret-circle-v41-staging`.
- Cachegeneration, Privacy, Architektur, Deployment, Environment und Service-Worker-Vertrag auf v41 synchronisiert.

### Accessibility

- `ACCESSIBILITY.md` eingeführt.
- `tests/accessibility-contract.test.js` in Unit-/Syntax-Gates integriert.
- `tests/e2e/accessibility-core.spec.js` als Playwright-Basis ergänzt.
- 44px-kritische Touchziele, Fokus, Reduced Motion, ARIA und Reflow-Verträge verschärft.

### Third Party / Assets / Legal

- `THIRD_PARTY_NOTICES.md` eingeführt.
- `@playwright/test` 1.54.2 upstream als Apache-2.0 verifiziert.
- `assets/manifests/asset-provenance.json` ergänzt; die drei bestehenden App-Icons bleiben ausdrücklich `unresolved`, bis Herkunft/Rechte belegt sind.
- `scripts/asset_provenance_audit.py` in `npm run validate` integriert.
- `scripts/public_release_placeholder_audit.py` ergänzt, um typische Dummywerte in öffentlichen Runtime-Dateien zu blockieren.
- `scripts/reference_content_audit.py` ergänzt, um physische Contentquellen auf bereits bewertete konkrete Referenzen zu prüfen.
- `LEGAL_CHECKLIST.md`, `SUPPORT.md`, `INCIDENT_RESPONSE.md` und `MAINTENANCE.md` ergänzt.

### Sessions / Hub / Timer

- gemeinsame Exact-once-Session-Ledger-Grundlage für Hub/Creator/Quick/Mega/Viral weiter abgesichert.
- direkte Hub-Sessions mit sicherem Resume, Spieler-Snapshot und explizitem Verwerfen.
- **Beenden & speichern** klar von **Abbrechen & verwerfen** getrennt.
- gemeinsame Pause-/Skip-Steuerung und Fokusführung.
- Timermechaniken in `party-hub-timers.js` ausgelagert.
- Scharade 60 s, Tabu 60 s, Hot Potato 10–25 s verdeckt, Wortkette 30 s mit pausiertem Resume.

### Advanced / Mafia

- private Advanced-Reveals werden nach Reload wieder verdeckt.
- Mafia skaliert Mafiaanzahl mit Gruppengröße und unterstützt Schnell/Klassisch/Erweitert mit Arzt/Detektiv/Beschützer.
- Beschützer darf dieselbe Person nicht zwei Nächte nacheinander schützen.

### CI / Build – noch offen

- die zuletzt geprüften GitHub-Actions-Läufe enden weiterhin vor einem belastbaren Repository-Checkout/Testlauf.
- daher sind die neuen v41-Unit-/Audit-/Reference-Source-Verträge noch nicht runner-verifiziert.
- `package-lock.json` fehlt; keine Integrity-Werte wurden erfunden.
- CI bleibt vorläufig auf Installationsübergang und wird erst mit echtem Lockfile auf `npm ci` umgestellt.
- Branch Protection/Required Checks bleiben offen.

### Release-Status

- PR #13 bleibt Draft und ungemergt.
- öffentlicher Release bleibt **NO_GO**, bis CI, Lockfile, Branch Protection, Reference-Source-Audit, reale Geräte/PWA-Upgrades, Accessibility, reale Gruppen, Asset-/Rechte-, Legal-/Support- und Staging-Gates bestanden sind.
