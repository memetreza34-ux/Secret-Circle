# Secret Circle – Release-Checkliste Januar 2027

Stand: 19. August 2026

Diese Checkliste gilt für den **unveränderten Release-Commit**. Ein vorhandener Test oder Vertrag ist kein PASS, solange er nicht tatsächlich ausgeführt beziehungsweise real abgenommen wurde.

## 1. Repository / CI / Branch Protection

- [ ] Release-Commit und Tag festgelegt
- [ ] sichtbarer GitHub-Actions-Checkout und echte Steps
- [ ] `npm run ci` vollständig grün
- [ ] Chromium, Firefox und WebKit auf demselben RC-Commit grün
- [ ] echtes `package-lock.json`
- [ ] CI und Cross-Browser verwenden `npm ci`
- [ ] `BRANCH_PROTECTION.md` abgearbeitet
- [ ] Pull Requests für stabilen Zielbranch verpflichtend
- [ ] **`Secret Circle CI / validate`** als Required Check aktiv
- [ ] Required Check auf echtem Runner grün
- [ ] Force-Push / Branch-Löschung / Review-/Bypass-Regeln geprüft
- [ ] Cross-Browser separat auf exakt demselben RC-Commit grün; bei aktuellem `workflow_dispatch` nicht als permanenter PR-Required-Check konfiguriert
- [ ] `scripts/branch_protection_contract_audit.py` grün

## 2. Engine / Session / Daten

- [ ] stabile Session-/Completion-IDs
- [ ] Exact-once-Verlauf/Statistik
- [ ] Hub-/Advanced-Resume sicher
- [ ] private Reveal-Zustände nach Reload wieder verdeckt
- [ ] Beenden & speichern getrennt von Abbrechen & verwerfen
- [ ] Skip vergibt keinen künstlichen Punkt
- [ ] Timer pausieren/fortsetzen über Reload korrekt
- [ ] Registry v2 vor Datentools geladen
- [ ] unbekannte Complete-Backup-Namespaces abgelehnt
- [ ] Quota-/Korruptions-/Rollbackpfade real geprüft
- [ ] Export → Import → Löschung real geprüft

## 3. 15 Core-Games

Für jedes Core-Spiel:

- [ ] Start / Lobby / Packauswahl
- [ ] Regeln verständlich
- [ ] persönliche Inhalte freiwillig / Skip möglich
- [ ] Pause / Abbruch / Resume
- [ ] Punkte-/Winner-Vertrag korrekt
- [ ] Verlauf/Statistik korrekt
- [ ] Tastatur/Fokus/Zoom/Reduced Motion
- [ ] reale Gruppe ohne Entwicklerhilfe

Spezielle Timer-/Advanced-/Mafia-Verträge aus `CORE_GAME_ACCEPTANCE.md`, `CORE_SCORING_RULES.md` und `BETA_TEST_PLAN.md` vollständig abarbeiten.

## 4. Party Hub / UX / Suche

- [ ] 15 Core / 13 Extended / 17 Labs korrekt dargestellt
- [ ] Reifestufe/Alter/Gruppe/Stimmung/Status gemeinsam filterbar
- [ ] Suchsynonyme/Tippfehler funktionieren
- [ ] Vorschläge mit Maus/Touch/Tastatur/Screenreader nutzbar
- [ ] leere Zustände und Storagefehler verständlich
- [ ] wichtige Touchziele mindestens 44×44 px
- [ ] sinnvolle Fokusführung nach Reveal-/Rundenwechsel
- [ ] Erstnutzer-Test ohne Entwicklerhilfe

## 5. PWA / Offline – v43

- [ ] finaler Cache **`secret-circle-v43`** / Staging **`secret-circle-v43-staging`**
- [ ] SW, Test, Architektur, Deployment, Privacy und Environment synchron
- [ ] Online-/Standalone-/Offline-Neustart
- [ ] Base-, Expansion-, Mega-, Viral- und Core-Contentmodule offline
- [ ] Backup-Registry, Engines, Manifest und Icons offline
- [ ] `icon-192.png` tatsächlich 192×192
- [ ] `icon-512.png` tatsächlich 512×512
- [ ] Manifestgrößen und SHA-256 stimmen
- [ ] Query-Routen offline
- [ ] staged update / bewusste Aktivierung
- [ ] aktive Session durch Update geschützt
- [ ] Upgrade von mindestens zwei älteren installierten Versionen auf v43
- [ ] Rollback mit neuer Cachegeneration

## 6. Privacy-Content – v43

- [ ] `party-catalog.js` enthält die alte Kamerarollen-Frage physisch nicht
- [ ] `party-catalog.js` enthält die Pflicht zum Vorlesen der letzten Handy-Nachricht physisch nicht
- [ ] sichere Ersatztexte stehen direkt im Basiskatalog
- [ ] `scripts/privacy_content_audit.py` auf exakt dem RC-Commit grün
- [ ] keine Built-in-Aufforderung, private Chats/Nachrichten, private Fotos/Kamerarolle, Passwörter, Adresse, Telefonnummer, Standort oder Kontodaten offenzulegen
- [ ] harmlose Geräte-/Chat-Erwähnungen wurden nicht unnötig entfernt
- [ ] persönliche Inhalte bleiben sichtbar freiwillig und überspringbar
- [ ] manueller Privacy-/Safety-Contentpass abgeschlossen

## 7. Reference-/Fan-Content

- [ ] `party-core-classic-content.js` v4
- [ ] `anime-guess` = **Anime-Archetypen erraten**, 4×10 generische Archetypen
- [ ] keine früheren 40 konkreten Anime-Namen in `party-mega-catalog.js`
- [ ] `wavelength` bleibt technische ID, sichtbar upstream **Spektrum-Tipp**
- [ ] Browser-Tabu upstream `Tab`, nicht `Chrome`
- [ ] Emoji-Quiz `Löwe`, nicht `Löwenkönig`
- [ ] drei entfernte Viral-Sportreferenzen nicht zurückgekehrt
- [ ] `scripts/reference_content_audit.py` grün
- [ ] manueller Extended/Labs-/Marketing-/Visual-Rechtepass abgeschlossen
- [ ] keine fremden Logos/Screenshots/Charakterbilder/Audios/Videos/Zitate ohne Rechte

## 8. Assets / Third Party / Recht

- [ ] `scripts/media_inventory_audit.py` grün
- [ ] `scripts/asset_provenance_audit.py` grün
- [ ] alle gebündelten Releaseassets im Provenienzmanifest
- [ ] `icon.svg` tatsächlicher Urheber/Ersteller bestätigt
- [ ] KI-/Template-/Stock-Ursprung geklärt
- [ ] kommerzielle Rechtebasis/Attribution geklärt
- [ ] kein Releaseasset `unresolved`
- [ ] transitive Dependencies aus finalem Lockfile geprüft
- [ ] Projekt-/Quellcodelizenz bewusst entschieden
- [ ] `LEGAL_CHECKLIST.md` final
- [ ] Privacy auf reales Hosting angepasst
- [ ] Betreiber-/Impressums-/Supportangaben final
- [ ] keine öffentlichen Placeholderwerte

## 9. Accessibility / Geräte

- [ ] Accessibility-Contract und E2E tatsächlich grün
- [ ] Android + Chrome
- [ ] iPhone + Safari
- [ ] Tablet/iPad
- [ ] Hoch-/Querformat
- [ ] 320 CSS px Reflow
- [ ] 200-%-Zoom
- [ ] vollständige Tastatur
- [ ] sichtbarer Fokus
- [ ] VoiceOver
- [ ] TalkBack
- [ ] private Reveals mit Screenreader
- [ ] Safe Areas / Bildschirmtastatur
- [ ] Reduced Motion
- [ ] Sperrbildschirm/App-Wechsel bei Timern
- [ ] reales Installationsicon auf Zielplattformen

## 10. Reale Gruppen / Beta

- [ ] 3–4 Personen
- [ ] 5–8 Personen
- [ ] 9–12 Personen
- [ ] großer Word-Imposter-Test
- [ ] Mafia 8+ mit mehreren Rollen
- [ ] Smart Party Night mindestens 3 vollständige Abende
- [ ] Creator mit unerfahrener Person
- [ ] Bugs nach Schweregrad dokumentiert
- [ ] keine offenen Critical/High Bugs

## 11. Staging / Betrieb / Veröffentlichung

- [ ] getrennte HTTPS-Staging-Origin
- [ ] Production-Origin festgelegt
- [ ] Staging-Smoke vollständig
- [ ] Rollbackprobe vollständig
- [ ] `SUPPORT.md` echter Kontakt
- [ ] `INCIDENT_RESPONSE.md` reale Verantwortliche
- [ ] Probe-SEV-1
- [ ] Wartungs-/Hotfixroutine
- [ ] finale Versionsnummer / Cacheversion v43 oder bewusst neuer
- [ ] Release Notes / Changelog
- [ ] unveränderlicher Release-Tag
- [ ] Production-Smoke nach Deployment

## Freigabe

- Release-Commit: ____________________
- Release-Tag: ____________________
- Datum: ____________________
- getestete Geräte: ____________________
- offene mittlere/niedrige Risiken: ____________________
- technische Freigabe: ____________________
- Produkt-/Inhaltsfreigabe: ____________________
- Accessibility-Freigabe: ____________________
- Legal-/Betriebsfreigabe: ____________________

**Keine Veröffentlichung**, solange Actions keine echten Repository-Steps ausführt, Kern-CI/Cross-Browser/Branch-/Privacy-/Reference-/Asset-Gates nicht tatsächlich grün sind, Critical/High Bugs offen sind oder Geräte-, Gruppen-, Rechte-, Legal- und Betriebsabnahmen fehlen.
