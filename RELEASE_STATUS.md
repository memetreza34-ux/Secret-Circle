# Release-Status – Secret Circle

Stand: 19. August 2026  
Zielrelease: 4.–15. Januar 2027  
Arbeitsbranch: `agent/release-foundation-2027`  
Draft-PR: #13

## Gesamtstatus

**Phase:** Release-Härtung  
**Öffentliche Freigabe:** **NO_GO**  
**Offline-Core:** **`secret-circle-v43`**  
**Classic Content:** **v4**

Die technische Grundlage ist weit fortgeschritten. Neu seit v43: Die zwei früher identifizierten Private-Device-Truth/Dare-Prompts sind nicht mehr nur final überschrieben, sondern physisch aus `party-catalog.js` entfernt. Ein globaler Privacy-Content-Audit schützt acht ausgelieferte Built-in-Contentquellen.

Nicht abgeschlossen sind echter CI-Nachweis, Lockfile/`npm ci`, tatsächliche Branch Protection, reale Device-/PWA-/Accessibility-/Gruppentests, Rechtebasis des Root-SVG-Icons, manuelle visuelle/rechtliche Restabnahme, Betreiber-/Supportangaben und HTTPS-Staging.

## Produkt / Katalog

- 45 technisch spielbare Built-ins
- 15 Core / 13 Extended / 17 Labs
- finaler Katalogpfad: `base → expansion → trending → mega → viral → core-release → core-classic(v4) → routing`
- persönliche Inhalte sichtbar freiwillig und überspringbar
- gespeicherte Filter, Suchhilfe und sichere Resume-/Timerpfade

## Reference-Safe-Pass

- **v36:** Bluetooth → Funkverbindung, Oscar → Filmpreis, Formel 1 → Motorsport
- **v37/v40:** `anime-guess` → 40 generische Archetypen; konkrete Figuren auch physisch aus `party-mega-catalog.js` entfernt
- **v38:** drei unnötig konkrete Viral-Sportformulierungen neutralisiert
- **v41:** `Spektrum-Tipp` und `Tab` upstream, `Löwenkönig` → `Löwe`, Classic v4, zentraler Reference-Source-Audit

## Privacy Source Hardening – v43

Physisch aus `party-catalog.js` entfernt:

- `Was ist das Seltsamste in deiner Kamerarolle?`
- `Lies die letzte Nachricht auf deinem Handy wie ein Theatermonolog, ohne Namen zu nennen.`

Direkt im Basiskatalog stehen jetzt:

- `Welches Foto-Motiv findest du besonders lustig?`
- `Lies einen selbst erfundenen Satz wie einen dramatischen Theatermonolog vor.`

`scripts/privacy_content_audit.py` scannt acht ausgelieferte Contentquellen auf konkrete Offenlegungsaufforderungen zu privaten Chats/Nachrichten, Fotos/Kamerarolle, Passwörtern, Adressen, Telefonnummern, Standort oder Kontodaten. Harmlose Alltagsreferenzen werden nicht pauschal gesperrt.

Status: **IMPLEMENTED / RUNNER VERIFICATION OPEN**.

## PWA-Asset-Hardening – v42

- echtes `icon-192.png` mit 192×192
- echtes `icon-512.png` mit 512×512
- SHA-256-/PNG-IHDR-/Manifestvertrag vorbereitet
- Root-SVG-Rechtebasis bleibt bewusst `unresolved`

## Branch Protection

`BRANCH_PROTECTION.md` und `scripts/branch_protection_contract_audit.py` sind neu Bestandteil des Releasevertrags.

Vorgesehen:

- Pull Requests auf stabilem Zielbranch
- Required Check **`Secret Circle CI / validate`**
- keine Force-Pushes / Branch-Löschung gemäß finaler GitHub-Konfiguration
- Review-/Bypass-Regeln prüfen
- Cross-Browser bleibt bei aktuellem `workflow_dispatch` separater RC-Gate, nicht permanenter PR-Required-Check

Die tatsächliche GitHub-Einstellung ist **nicht belastbar bestätigt**.

## Security / Backup

Registry v2 zentralisiert Complete-Backup-Grenzen und erlaubte versionierte Word-/Party-Key-Familien. Unbekannte Namespaces werden beim Import abgelehnt. SEC-F01/F02 bleiben **CLOSED IN CODE / REAL VERIFICATION OPEN**.

## PWA / Offline

- `secret-circle-v43`
- `secret-circle-v43-staging`
- staged update
- bewusste Nutzeraktivierung
- Base-, Expansion-, Mega-, Viral- und Core-Contentmodule offline vorgesehen
- PWA-Manifest und Icons offline vorgesehen

Offen: reale Altversion→v43-Upgrades, iOS/Android-PWA, Rollback, Installationsicon und Sperrbildschirmtests.

## Accessibility / Beta

Verträge und E2E-Basis sind vorbereitet. Real offen: 200-%-Zoom, VoiceOver, TalkBack, echte Touchbedienung, private Reveal-Smokes und reale Gruppen.

## Legal / Third Party / Betrieb

Noch real offen:

- Betreiber-/Kontakt-/Hostingangaben
- menschliche Rechtebestätigung für `icon.svg`
- transitive Dependencyinventur nach echtem Lockfile
- manueller Extended/Labs-/Marketing-/Visual-Rechtepass
- Support-/Incident-Verantwortliche
- Staging-/Production-Origin

## CI – P0

Der aktuelle CI-Befund wird zentral in `CI_TROUBLESHOOTING.md` geführt. Wiederholt erreicht `Secret Circle CI` im Job `validate` keine Repository-Steps (`steps: []`), also kein Checkout, keine Tests und keine Audits.

Das ist **kein belastbarer grüner Nachweis**, aber auch kein durch Actions nachgewiesener Repository-Codefehler.

## Build – P1

`package-lock.json` fehlt weiterhin. Keine Integritätswerte werden erfunden. Erst mit echtem Lockfile wird auf `npm ci` umgestellt.

## Nächste Releaseblöcke

1. Actions-Runner / echter Checkout + sichtbare Steps
2. echtes `package-lock.json` + `npm ci`
3. Branch Protection / Required Checks tatsächlich bestätigen
4. Privacy-/Reference-/Asset-/Branch-Audits auf funktionierendem Runner grün ausführen
5. Rechtebasis für `icon.svg`
6. manueller Extended/Labs-/Marketing-/Visual-Rechtepass
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
- Januar-2027-Ziel: weiterhin erreichbar, sofern die offenen externen und realen Gates geschlossen werden
