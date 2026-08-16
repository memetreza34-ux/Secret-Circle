# Release-Status – Secret Circle

Stand: 16. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13

## Gesamtstatus

**Phase:** Release-Härtung  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v38`**

Die technische Grundlage ist weit fortgeschritten: 15 priorisierte Core-Games, quantitative Contentziele, 15/15 Core-Quellreview, Exact-once-Sessions, sichere Resume-/Timerpfade, Registry-v2-Backups, Accessibility-Basis und Betriebs-/Legal-Verträge sind vorbereitet.

Neu im Rechte-/Referenzpass:

- Word-Imposter-Core: drei unnötige konkrete Referenzen generisch ersetzt
- `anime-guess`: Option B umgesetzt, final **Anime-Archetypen erraten** mit 40 generischen Archetypen
- Viral `higher-lower`: drei unnötige olympisch/Grand-Slam-bezogene Sporttexte generisch ersetzt
- Classic Content v2: 12.954 Bytes bei 45.000-Byte-Budget; Performance-Risiko geschlossen

Nicht abgeschlossen sind echter CI-Nachweis, Lockfile/`npm ci`, Branch Protection, realer Device-/PWA-/Accessibility-/Gruppentest, Assetherkunft, restlicher Extended/Labs-Rechtepass, Betreiber-/Supportangaben und HTTPS-Staging.

## Produkt / Katalog

- 45 technisch spielbare Built-ins
- 15 Core / 13 Extended / 17 Labs
- Filter für Reifestufe, Alter, Gruppe, Stimmung und Status
- Synonym-/Tippfehlersuche
- sichtbare Freiwilligkeits-/Skip-Regel
- finaler Katalogpfad: `base → expansion → trending → mega → viral → core-release → core-classic(v2) → routing`

## Core-Content

Alle definierten quantitativen Mindestziele sind implementiert. `CORE_CONTENT_REVIEW.md` dokumentiert 15/15 Core-Spiele als ersten Quellpass.

Privacy-Fund geschlossen: keine letzte private Nachricht vorlesen, keine Kamerarolle als Spielmaterial durchsuchen; Regression geschützt.

## Reference-Safe-Pass

### Word Imposter

- Bluetooth → Funkverbindung
- Oscar → Filmpreis
- Formel 1 → Motorsport

### Anime-Quiz

- stabile ID `anime-guess`
- finaler Titel `Anime-Archetypen erraten`
- 4 generische Packs / 40 Archetypen
- 40 frühere konkrete Figuren im finalen Runtime-Content ausgeschlossen

### Viral Sport

- `Ringe im olympischen Symbol` → `Ecken eines Fünfecks`
- `Bahnen eines olympischen 400-Meter-Stadions häufig` → `Bahnen einer typischen 400-Meter-Leichtathletikanlage`
- `Sätze zum Sieg im Herren-Grand-Slam-Tennis` → `Gewinnsätze in einem Best-of-five-Tennismatch`

Die Werte 5 / 8 / 3 bleiben unverändert. `tests/party-viral-catalog.test.js` schützt diese Entscheidung.

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

- `secret-circle-v38`
- `secret-circle-v38-staging`
- staged update
- bewusste Nutzeraktivierung
- aktiver Core wird nicht vor erfolgreicher Promotion zerstört
- Privacy, Architektur, Deployment, Environment und Service-Worker-Test auf v38 synchronisiert

Offen: reale Altversion→v38-Upgrades, iOS/Android-PWA, Rollback und Sperrbildschirmtests.

## Accessibility / Beta

Accessibility-Dokument, statischer Contract, Playwright-E2E-Basis, 320px-Reflow, Fokus, Reduced Motion, ARIA und Touchzielverträge sind vorbereitet. `BETA_TEST_PLAN.md` definiert Geräte-/Gruppen-/Update-/Rollback-Sessions.

Real offen: 200 % Zoom, VoiceOver, TalkBack, echte Touchbedienung, private Reveal-Smokes und reale Gruppen.

## Legal / Third Party / Betrieb

Vorhanden: `LEGAL_CHECKLIST.md`, `THIRD_PARTY_NOTICES.md`, `FAN_CONTENT_REVIEW.md`, `SUPPORT.md`, `INCIDENT_RESPONSE.md`, `MAINTENANCE.md`, `BETA_TEST_PLAN.md`, `ENVIRONMENTS.md`.

Noch real offen: Betreiber-/Kontakt-/Hostingangaben, Icon-Herkunft, transitive Dependencyinventur nach Lockfile, restlicher Extended/Labs-Referenzscan, Support-/Incident-Verantwortliche und Staging-/Production-Origin.

## CI – P0

Neuester belastbar geprüfter Lauf: **#1905** – `validate`, failure, `steps: []`, kein Checkout, kein Repository-Code ausgeführt.

Daher kein belastbarer grüner Unit-/Audit-/Playwright-/Cross-Browser-Nachweis.

## Build – P1

`package-lock.json` fehlt. Lokale Generierung scheiterte am externen Paketnetzwerk/Timeout. Es wurden keine Integritätswerte erfunden. Erst mit echtem Lockfile wird CI auf `npm ci` umgestellt.

## Nächste Releaseblöcke

1. Actions-Runner
2. Lockfile + `npm ci`
3. Branch Protection
4. restlicher Extended/Labs-Referenzscan
5. Asset-Provenienz / Icon-Herkunft
6. HTTPS-Staging
7. reale Upgrade-/Rollback-/Gerätetests
8. reale Accessibilitytests
9. reale Gruppentests
10. Betreiber-/Supportdaten
11. Incident-Drill
12. unveränderter RC + Tag

## Releaseentscheidung

- öffentlicher Release heute: **Nein**
- PR #13 mergen: **Nein**
- PR #13 bleibt Draft: **Ja**
- kontrollierte Entwicklungsbeta: möglich
- Januar-2027-Ziel: weiterhin erreichbar, sofern die offenen externen und realen Gates geschlossen werden
