# Release-Status – Secret Circle

Stand: 16. August 2026
Zielrelease: 4.–15. Januar 2027
Arbeitsbranch: `agent/release-foundation-2027`
Draft-PR: #13

## Aktueller Gesamtstatus

**Phase:** Release-Härtung nach technischer Core-Grundlage  
**Öffentliche Freigabe:** **NO_GO**  
**Aktueller Offline-Core:** **`secret-circle-v35`**

Secret Circle besitzt 45 eingebaute Spiele, davon 15 priorisierte Kernspiele. Die technische Releasegrundlage ist weit fortgeschritten. Quantitative Core-Content-Ziele sind erreicht, der erste redaktionelle Quellpass steht bei 15/15, Security-/Backup-Verträge wurden gehärtet und Accessibility-, Legal-, Support-, Incident- und Maintenance-Verträge sind vorbereitet.

Nicht abgeschlossen sind insbesondere echter CI-Nachweis, Lockfile/`npm ci`, Branch Protection, reale Geräte-/PWA-/Accessibilitytests, Gruppentests, finale Rechteprüfung, tatsächliche Betreiber-/Support-/Hostingangaben und HTTPS-Staging.

## Implementiert und vorbereitet

### Release und Katalog

- 15 Core, 13 Extended, 17 Labs
- Reifestufen-, Alters-, Gruppen-, Stimmungs- und Statusfilter
- gespeicherte Filter und URL-Priorität
- Synonym-/Tippfehlersuche mit Tastaturunterstützung
- `CORE_GAME_ACCEPTANCE.md`
- `CORE_SCORING_RULES.md`
- finaler Katalogpfad:
  `base → expansion → trending → mega → viral → core-release → core-classic → routing`

### Core-Content

Drei Ausbauwellen schließen die definierten quantitativen Core-Ziele:

- Never Have / Most Likely / Would Rather: 24 je Pack
- Paranoia: 20 je Pack
- Wrong Answers: 24 je Pack
- Truth/Dare: 24 je Pack
- Charades: 30 je Pack
- Taboo: 24 je Pack
- Hot Potato: 20 je Pack
- Word Chain: 10 Startbuchstaben je Pack
- Two Truths / Question Imposter / Location Spy: 16 je Pack
- Word Imposter: 14 Kategorien × 12 Begriffe

`CORE_CONTENT_REVIEW.md` dokumentiert den ersten **15/15-Core-Quellpass**. Alle 15 Kernspiele stehen dort auf `PREPARED`; reale Gruppen-, Rechte- und finale Semantikabnahme bleiben offen.

Geschlossener Privacy-Fund:

- keine Built-in-Aufforderung mehr, die letzte private Nachricht vorzulesen
- keine Built-in-Frage mehr nach dem seltsamsten Kamerarolleninhalt
- beide Alttexte als Regression blockiert

### Sichtbare Freiwilligkeit

Persönliche Inhalte sind nicht mehr nur technisch überspringbar:

- Hub-Spieldetail erklärt sichtbar, dass persönliche Inhalte freiwillig sind
- Skip darf ohne Begründung verwendet werden
- Advanced-Setup erklärt dieselbe Grundregel

### Word Imposter

- unabhängige Rollen-/Reveal-/Begriffszufallslogik
- maximal sechs Imposter
- kein Rollen-Monkey-Patching
- eigener individueller Match-Punktestand
- versionierte Daten-/Backupverträge

### Sessions, Statistik und Resume

- gemeinsames `session-ledger.js`
- stabile Session-/Completion-IDs
- Exact-once-Vertrag für Hub, Creator, Quick, Mega und Viral
- Advanced-Abschluss gegen Doppelzählung abgesichert
- direkte Hub-Sessions speichern Spieler-Snapshot
- explizite Wiederaufnahme statt automatischem Öffnen
- private Zustände bleiben nach Reload verdeckt
- Verwerfen erzeugt keine Statistik/History

### Direkte Hub-Steuerung

- **Beenden & speichern** getrennt von **Abbrechen & verwerfen**
- bestätigter Abbruch schreibt keine Statistik
- Escape folgt demselben Abbruchpfad
- globales Runde-überspringen ohne Punkt
- Fokusführung nach Reveal-/Rundenwechseln
- kritische Controls mindestens 44 px

### Timer

- gemeinsamer pausierbarer Timer über `party-session-controls.js`
- `party-hub-timers.js` als getrennte Modulgrenze
- Scharade 60 s
- Tabu 60 s
- Hot Potato zufällige 10–25 s, Restzeit verborgen
- Wortkette 30 s
- wiederhergestellte Timer starten pausiert
- Hintergrundwechsel pausiert laufende Hub-Timer

### Advanced / Mafia

- private Advanced-Reveals nach Reload wieder verdeckt
- Mafia-Moderatoransicht benötigt erneute Bestätigung
- Mafiaanzahl skaliert 1/2/3/4
- Schnell/Klassisch/Erweitert getrennt
- Arzt/Detektiv/Beschützer-Regeln vorbereitet
- Beschützer darf dieselbe Person nicht zwei Nächte hintereinander schützen

## Security und Backup

### Registry v2

`backup-schema-registry.js` ist zentraler Vertragsmittelpunkt.

- Complete-Backup-Format und Limits werden nicht mehr in `party-data-tools.js` dupliziert
- Complete-Import akzeptiert nur registrierte versionierte Word-Imposter- und `secret-circle-party-*`-Key-Familien
- unbekannte `secret-circle-*`-Namespaces werden beim Import abgelehnt
- vollständiges Löschen bleibt bewusst breiter und entfernt alle Secret-Circle-Reste
- `party.html` lädt `backup-schema-registry.js` vor `party-data-tools.js`

SEC-F01/F02: **CLOSED IN CODE / RUNNER + REAL BROWSER VERIFICATION OPEN**.

## PWA / Offline

Aktueller Cache:

- `secret-circle-v35`
- `secret-circle-v35-staging`

v35 enthält und synchronisiert unter anderem:

- aktuellen Hub-Hero
- sichtbare Freiwilligkeitsregel
- Backup-Registry-v2-Ladereihenfolge
- aktualisierte Privacy-Seite
- beide Core-Contentmodule

Der Service Worker staged Updates zuerst und zerstört den aktiven Core nicht vor erfolgreicher Promotion.

Noch offen:

- reale Altversion → v35 Updates
- installierte iOS-/Android-PWA
- Rollback auf HTTPS-Staging
- Sperrbildschirm/Background auf echten Geräten

## Accessibility

Vorbereitet:

- `ACCESSIBILITY.md`
- `tests/accessibility-contract.test.js`
- `tests/e2e/accessibility-core.spec.js`
- Contract in `npm test` und `npm run check`
- Reflow-Basis bei 320 CSS px
- Skip-Link-/Tastatur-/Autocomplete-Verträge
- Reduced-Motion-/Focus-/Touchziel-Verträge

Nicht als PASS behaupten:

- 200-%-Zoom real
- VoiceOver
- TalkBack
- reale Touchbedienung
- private Reveals mit Screenreader

## Legal, Support und Betrieb

Neu vorbereitet:

- `LEGAL_CHECKLIST.md`
- `SUPPORT.md`
- `INCIDENT_RESPONSE.md`
- `MAINTENANCE.md`

Noch zwingend real einzutragen/zu prüfen:

- Betreiber/Verantwortlicher
- ladungsfähige Anschrift, soweit erforderlich
- echter Support-/Security-Kontakt
- tatsächlicher Hostinganbieter und Log-/Privacyrealität
- Third-Party-/Lizenzinventar
- Incident Owner
- Probe-SEV-1
- Rollbackprobe auf HTTPS-Staging

Es wurden bewusst **keine** Betreiber- oder Supportdaten erfunden.

## Qualität und Release-Audits

Vorhanden beziehungsweise erweitert:

- Core-Game-/Scoring-/Content-Verträge
- Hub Timer/Resume/Control Contracts
- Advanced/Mafia Contracts
- Backup Registry Contract
- Accessibility Contract + E2E-Suite
- Architektur-/Foundation-/Hub-/Scoring-/Content-/Performance-/Release-Audits

`scripts/release_audit.py` verlangt inzwischen Accessibility, Legal, Support, Incident und Maintenance als Releaseverträge.

## Externer P0-Blocker: GitHub Actions

Neuester geprüfter CI-Lauf:

- Workflow: `Secret Circle CI`
- Run #1905
- Job: `validate`
- Ergebnis: failure
- ausgeführte Repository-Schritte: **0**
- `steps: []`

Damit wurde erneut weder Checkout noch `npm run check`, `npm test`, `npm run validate` oder Playwright ausgeführt.

**Folge:** Kein neuer Test/Audit darf als tatsächlich grün bezeichnet werden.

## P1-Blocker: Lockfile / npm ci

- `package-lock.json` fehlt weiterhin
- im Repository wurde kein bestehendes Lockfile gefunden
- lokale Erzeugung über `npm install --package-lock-only` konnte wegen externem Paketnetzwerk/Timeout nicht abgeschlossen werden
- kein Lockfile wurde erfunden
- Workflow bleibt deshalb vorerst auf seinem Übergangspfad; Umstellung auf `npm ci` erfolgt erst mit echtem geprüftem Lockfile

## Aktuell offene Releaseblöcke

1. **CI Runner / sichtbarer Checkout** – P0
2. **`package-lock.json` + `npm ci`** – P1
3. **Branch Protection / Required Checks** – P1
4. **finales Marken-/Urheber-/Third-Party-Review** – P1
5. **HTTPS-Staging** – P1
6. **reale Android-/iPhone-/Tablet-/PWA-Tests** – P1
7. **VoiceOver/TalkBack/200-%-Zoom** – P1
8. **reale Gruppen 3–4 / 5–8 / 9–12** – P1/P2
9. **große Word-Imposter-/Mafia-Sessions** – P1/P2
10. **echte Betreiber-/Support-/Hostingangaben** – P1
11. **Incident-/Rollbackprobe** – P1
12. **unveränderter RC + Release-Tag** – nach allen Gates

## Releaseentscheidung

- **Öffentlicher Release heute:** Nein
- **Entwicklungsstand:** weit fortgeschrittene Release-Härtung
- **Kontrollierte interne/Entwicklungsbeta:** möglich
- **Merge von PR #13 heute:** Nein
- **PR #13 bleibt Draft:** Ja
- **Releaseziel Januar 2027:** weiterhin erreichbar, sofern CI-/Lockfile-/Realtest-/Legal-Gates rechtzeitig geschlossen werden
