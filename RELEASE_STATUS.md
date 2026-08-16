# Release-Status – Secret Circle

Stand: 16. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13

## Gesamtstatus

**Phase:** Release-Härtung  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v37`**

Die technische Grundlage ist weit fortgeschritten: 15 priorisierte Core-Games, quantitative Contentziele, 15/15 Core-Quellreview, Exact-once-Sessions, sichere Resume-/Timerpfade, Registry-v2-Backups, Accessibility-Basis und Betriebs-/Legal-Verträge sind vorbereitet.

Neu im Rechtepass:

- Word-Imposter-Core: drei unnötige konkrete Referenzen generisch ersetzt
- `anime-guess`: **Option B** umgesetzt
- finaler Runtime-Titel: **Anime-Archetypen erraten**
- 40 konkrete Figurenreferenzen werden durch 40 eigenständige Archetypen ersetzt
- `party-core-classic-content.js` Version 2
- PWA deshalb auf **v37**

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

Privacy-Fund geschlossen:

- keine letzte private Nachricht vorlesen
- keine Kamerarolle als Spielmaterial durchsuchen
- Regression geschützt

## Reference-Safe-Pass

### Word Imposter

- Bluetooth → Funkverbindung
- Oscar → Filmpreis
- Formel 1 → Motorsport

### Anime-Quiz

Stabile ID `anime-guess`, aber final:

- Titel `Anime-Archetypen erraten`
- Gruppe `Anime-Quiz`
- 4 generische Packs
- 10 Archetypen je Pack
- 40 konkrete frühere Figuren im finalen Runtime-Content ausgeschlossen

`tests/core-content-quality.test.js`, `scripts/core_content_audit.py`, Architektur- und Release-Audit schützen den Vertrag. **Nicht runnerverifiziert.**

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

Registry v2:

- zentrale Complete-Backup-Grenzen
- erlaubte versionierte Word-/Party-Key-Familien
- unbekannte Namespaces beim Import abgelehnt
- breite Komplettlöschung bleibt bewusst erhalten
- Registry lädt vor Datentools

SEC-F01/F02: **CLOSED IN CODE / REAL VERIFICATION OPEN**.

## PWA / Offline

- `secret-circle-v37`
- `secret-circle-v37-staging`
- staged update
- bewusste Nutzeraktivierung
- aktiver Core wird nicht vor erfolgreicher Promotion zerstört
- Privacy, Architektur, Deployment, Environment und Service-Worker-Test auf v37 synchronisiert

Offen: reale Altversion→v37-Upgrades, iOS/Android-PWA, Rollback und Sperrbildschirmtests.

## Accessibility

Vorbereitet:

- Accessibility-Dokument
- statischer Contract-Test
- Playwright-E2E-Basis
- 320px Reflow
- Fokus, Reduced Motion, ARIA, Touchzielverträge

Real offen: 200 % Zoom, VoiceOver, TalkBack, echte Touchbedienung und private Reveal-Smokes.

## Legal / Third Party / Betrieb

Vorhanden:

- `LEGAL_CHECKLIST.md`
- `THIRD_PARTY_NOTICES.md`
- `FAN_CONTENT_REVIEW.md`
- `SUPPORT.md`
- `INCIDENT_RESPONSE.md`
- `MAINTENANCE.md`
- `BETA_TEST_PLAN.md`
- `ENVIRONMENTS.md`

Noch real offen:

- Betreiber-/Kontakt-/Hostingangaben
- Icon-Herkunft
- transitive Dependencyinventur nach Lockfile
- restlicher Extended/Labs-Referenzscan
- Support-/Incident-Verantwortliche
- Staging-/Production-Origin

## CI – P0

Neuester belastbar geprüfter Lauf: **#1905**.

- `validate`
- failure
- `steps: []`
- kein Checkout
- kein Repository-Code ausgeführt

Daher kein belastbarer grüner Unit-/Audit-/Playwright-/Cross-Browser-Nachweis.

## Build – P1

`package-lock.json` fehlt. Lokale Generierung scheiterte am externen Paketnetzwerk/Timeout. Es wurden keine Integritätswerte erfunden. Erst mit echtem Lockfile wird CI auf `npm ci` umgestellt.

## Nächste Releaseblöcke

1. Actions-Runner
2. Lockfile + `npm ci`
3. Branch Protection
4. Classic-Content-v2-Performancebudget
5. restlicher Extended/Labs-Referenzscan
6. Assetherkunft
7. HTTPS-Staging
8. reale Upgrade-/Rollback-/Gerätetests
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
