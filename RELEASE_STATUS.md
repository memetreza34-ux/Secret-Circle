# Release-Status – Secret Circle

Stand: 19. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13

## Gesamtstatus

**Phase:** Release-Härtung  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v42`**  
**Classic Content:** **v4**

Die technische Grundlage ist weit fortgeschritten: 15 priorisierte Core-Games, quantitative Contentziele, 15/15 Core-Quellreview, Exact-once-Sessions, sichere Resume-/Timerpfade, Registry-v2-Backups, Accessibility-Basis und Betriebs-/Legal-Verträge sind vorbereitet.

Seit v41 ist der Reference-Safe-Vertrag source-level abgesichert. v42 hat zusätzlich einen echten PWA-Assetfehler geschlossen: `icon-192.png` fehlte und die bisherige Datei `icon-512.png` war tatsächlich nur 192×192. Beide Rastericons liegen jetzt in korrekter Größe vor und werden per Hash/IHDR/Manifest-Audit geprüft.

Nicht abgeschlossen sind echter CI-Nachweis, Lockfile/`npm ci`, Branch Protection, reale Device-/PWA-/Accessibility-/Gruppentests, **Rechtebasis des Root-SVG-Icons**, manuelle visuelle/rechtliche Restabnahme, Betreiber-/Supportangaben und HTTPS-Staging.

## Produkt / Katalog

- 45 technisch spielbare Built-ins
- 15 Core / 13 Extended / 17 Labs
- Filter für Reifestufe, Alter, Gruppe, Stimmung und Status
- Synonym-/Tippfehlersuche
- sichtbare Freiwilligkeits-/Skip-Regel
- finaler Katalogpfad: `base → expansion → trending → mega → viral → core-release → core-classic(v4) → routing`

## Core-Content

Alle definierten quantitativen Mindestziele sind implementiert. `CORE_CONTENT_REVIEW.md` dokumentiert 15/15 Core-Spiele als ersten Quellpass.

Privacy-Fund geschlossen: keine letzte private Nachricht vorlesen, keine Kamerarolle als Spielmaterial durchsuchen; Regression geschützt.

## Reference-Safe-Pass

### v36 – Word Imposter

- Bluetooth → Funkverbindung
- Oscar → Filmpreis
- Formel 1 → Motorsport

### v37/v40 – Anime-Quiz

- stabile ID `anime-guess`
- finaler Titel `Anime-Archetypen erraten`
- 4 generische Packs / 40 Archetypen
- seit v40 keine der 40 früheren konkreten Figuren mehr in `party-mega-catalog.js`

### v38 – Viral Sport

- olympisches Ringsymbol → Ecken eines Fünfecks
- olympisches Stadion → typische 400-m-Leichtathletikanlage
- Grand-Slam-Formulierung → Best-of-five-Tennismatch

### v41 – physischer Source-Vertrag

- `party-expansion.js`: `wavelength` bleibt stabile technische ID, sichtbarer Titel **Spektrum-Tipp**
- Browser-Tabu enthält direkt `Tab`, nicht `Chrome`
- `party-mega-catalog.js`: `🦁🌾 → Löwe`, nicht `Löwenkönig`
- Classic Content v4 enthält nur noch zwei Privacy-Editorial-Replacements
- zentraler Reference-Source-Audit scannt acht ausgelieferte Contentquellen

Diese neuen Tests/Audits sind implementiert, aber wegen des Actions-Runnerproblems noch nicht belastbar als grün ausgeführt dokumentiert.

## PWA-Asset-Hardening – v42

Gefundener Zustand vor v42:

- `icon-192.png` fehlte auf dem Branch
- `icon-512.png` enthielt laut PNG-IHDR nur 192×192 Pixel
- `manifest.webmanifest` deklarierte trotzdem 192×192 und 512×512

Umgesetzt:

- neues echtes `icon-192.png` mit 192×192
- neues echtes `icon-512.png` mit 512×512
- beide aus `icon.svg` erzeugt
- Rasterableitung, Erstellungswerkzeuge und SHA-256 in `asset-provenance.json` dokumentiert
- `asset_provenance_audit.py` prüft Existenz, SHA-256, PNG-Signatur/IHDR sowie Webmanifest-Größen
- Git-Historie belegt, dass das aktuelle `icon.svg` am 2. August 2026 in Commit `c183d439882bf3f25a5577e3867b76b4f930e84c` neu in das Repo kam

**Nicht behauptet:** Diese Git-Historie beweist nicht automatisch Urheberrecht oder kommerzielle Nutzungsrechte. `icon.svg` bleibt deshalb korrekt `unresolved` bis menschlicher Bestätigung.

## Sessions / Resume / Timer

- stabile Session-/Completion-IDs
- Exact-once History/Stats
- direkter Hub Active-State + Spieler-Snapshot
- Advanced Active-State
- private Inhalte nach Reload wieder verdeckt
- Beenden & speichern getrennt von Abbrechen & verwerfen
- Skip ohne Punkt
- pausierbare gemeinsame Timer
- Scharade 60 s, Tabu 60 s, Hot Potato 10–25 s verdeckt, Wortkette 30 s

## Security / Backup

Registry v2 zentralisiert Complete-Backup-Grenzen und erlaubte versionierte Word-/Party-Key-Familien. Unbekannte Namespaces werden beim Import abgelehnt; breite Komplettlöschung bleibt bewusst erhalten. Registry lädt vor Datentools.

SEC-F01/F02: **CLOSED IN CODE / REAL VERIFICATION OPEN**.

## PWA / Offline

- `secret-circle-v42`
- `secret-circle-v42-staging`
- staged update
- bewusste Nutzeraktivierung
- aktiver Core wird nicht vor erfolgreicher Promotion zerstört
- Privacy, Architektur, Deployment, Environment und Service-Worker-Test auf v42 synchronisiert
- `icon.svg`, `icon-192.png`, `icon-512.png` sind explizit Teil des Offline-Core

Offen: reale Altversion→v42-Upgrades, iOS/Android-PWA, Rollback, echtes Installationsicon und Sperrbildschirmtests.

## Accessibility / Beta

Accessibility-Dokument, statischer Contract, Playwright-E2E-Basis, 320px-Reflow, Fokus, Reduced Motion, ARIA und Touchzielverträge sind vorbereitet. `BETA_TEST_PLAN.md` definiert Geräte-/Gruppen-/Update-/Rollback-Sessions.

Real offen: 200 % Zoom, VoiceOver, TalkBack, echte Touchbedienung, private Reveal-Smokes und reale Gruppen.

## Legal / Third Party / Betrieb

Vorhanden: `LEGAL_CHECKLIST.md`, `THIRD_PARTY_NOTICES.md`, `FAN_CONTENT_REVIEW.md`, `SUPPORT.md`, `INCIDENT_RESPONSE.md`, `MAINTENANCE.md`, `BETA_TEST_PLAN.md`, `ENVIRONMENTS.md`.

Noch real offen:

- Betreiber-/Kontakt-/Hostingangaben
- menschliche Rechtebestätigung für `icon.svg`
- transitive Dependencyinventur nach echtem Lockfile
- manueller Extended/Labs-/Marketing-/Visual-Rechtepass
- Support-/Incident-Verantwortliche
- Staging-/Production-Origin

Die technischen Rasterableitungen von `icon-192.png` und `icon-512.png` sind seit v42 belegt; sie sind nicht mehr als „unbekannte Dateiherkunft“ zu behandeln.

## CI – P0

Der verbindliche aktuelle CI-Befund wird **zentral in `CI_TROUBLESHOOTING.md`** geführt, damit reine Actions-Runnummern nicht zwischen mehreren Statusdateien driften.

Aktueller bestätigter Zustand dort:

- aktueller v42-Head wurde von `Secret Circle CI` erneut als failure erfasst
- Job `validate` erreicht keine Repository-Steps (`steps: []`)
- ein gezielter Re-Run der fehlgeschlagenen Jobs zeigte dasselbe Muster
- kein Checkout
- kein verwertbarer Job-Log

Damit existiert weiterhin **kein belastbarer grüner Unit-/Audit-/Playwright-/Cross-Browser-Nachweis**. Das Muster beweist zugleich keinen Repository-Codefehler, weil kein Step ausgeführt wird.

## Build – P1

`package-lock.json` fehlt. Es wurden keine Integritätswerte erfunden. Erst mit echtem Lockfile wird CI auf `npm ci` umgestellt.

## Nächste Releaseblöcke

1. Actions-Runner / echter Checkout + sichtbare Steps
2. echtes `package-lock.json` + `npm ci`
3. Branch Protection / Required Checks
4. Reference- und Asset-Audits auf funktionierendem Runner tatsächlich ausführen
5. menschliche Rechtebasis für `icon.svg` bestätigen
6. manueller Extended/Labs-/Marketing-/Visual-Rechtepass
7. HTTPS-Staging
8. reale Upgrade-/Rollback-/Geräte-/Installationsicon-Tests
9. reale Accessibilitytests
10. reale Gruppentests
11. Betreiber-/Supportdaten
12. Incident-Drill
13. unveränderter RC + Tag

## Releaseentscheidung

- öffentlicher Release heute: **Nein**
- PR #13 mergen: **Nein**
- PR #13 bleibt Draft: **Ja**
- kontrollierte Entwicklungsbeta: möglich
- Januar-2027-Ziel: weiterhin erreichbar, sofern die offenen externen und realen Gates geschlossen werden
