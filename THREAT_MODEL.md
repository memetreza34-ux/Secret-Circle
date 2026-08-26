# Secret Circle – Threat Model

Stand: 26. August 2026

## 1. Scope

Dieses Threat Model gilt für den Januar-2027-Release der statischen offline-first PWA. Aktueller Source-/Offline-Core: **`secret-circle-v51` / `secret-circle-v51-staging`**.

In Scope:

- Party Hub
- Word Imposter
- Advanced-Spiele
- Quick/Mega/Viral/Creator-Engines
- lokale Sessions
- localStorage
- Import/Export/Backup
- Game Creator
- Service Worker/PWA-Update
- Query-Routing
- lokale Inhalte

Nicht in Scope für V1:

- eigenes Backend
- Cloud-Datenbank
- Benutzerkonten
- Online-Multiplayer
- Payments
- Werbung
- Analytics

Wenn einer dieser Bereiche später hinzukommt, muss dieses Threat Model vor Implementierung erweitert werden.

## 2. Schutzgüter

| Asset | Warum wichtig |
|---|---|
| geheime Rollen/Wörter/Fragen | Offenlegung zerstört Spiel/Privatsphäre |
| aktive Session | darf nicht doppelt, beschädigt oder unkontrolliert fortgesetzt werden |
| lokale Spieler-/Verlaufsdaten | dürfen nicht still verloren oder vermischt werden |
| zukünftige/unbekannte lokale Appdaten | dürfen von einem älteren Restore nicht still gelöscht werden |
| Creator-Inhalte | untrusted User Content |
| Backups | enthalten lokale Appdaten im Klartext |
| Offline-Core | muss konsistent und rollbackfähig bleiben |
| Releaseintegrität | Nutzer sollen genau den geprüften Build erhalten |

## 3. Akteure

### A. Normaler Nutzer

Kann versehentlich:

- falsche Datei importieren
- Browser schließen
- Gerät sperren
- doppelt klicken
- Speicherlimit erreichen
- sensible Karte offen lassen

### B. Neugieriger Mitspieler

Kann versuchen:

- Bildschirm vorzeitig zu sehen
- zurückzugehen
- Reload auszulösen
- Browserzustand zu beobachten

Gegen physischen Gerätezugriff existiert nur UX-/State-Härtung, keine echte Geheimhaltung vor dem Gerätebesitzer.

### C. Manipulierter lokaler Datensatz / Import

Kann enthalten:

- falsche Typen
- übergroße Strings
- unerwartete Keys
- unbekannte Versionen
- syntaktisch gültige, aber semantisch falsche Storage-Wrapper
- HTML-/Scripttext
- widersprüchliche Sessiondaten

### D. Supply-Chain-/Buildproblem

Kann entstehen durch:

- manipulierte Dependency
- falsche Dependency-Version
- Lockfile-/Registry-Drift
- CI, das keinen echten Code ausführt
- falschen Release-Commit

## 4. Entry Points

- Textfelder
- Creator-Formulare
- Hub-Spielernamen
- eigene Packs
- JSON-Importe
- localStorage beim Laden
- URL-/Query-Parameter
- Service-Worker-Update
- PWA-Cache
- dynamische Katalog-/Routingdaten
- Browservisibility/blur/pagehide

## 5. Threats und Gegenmaßnahmen

### TM-01 – XSS über Creator-/Nutzertexte

**Risiko:** HTML-/Scripttext wird als ausführbares Markup gerendert.

**Auswirkung:** hoch

**Gegenmaßnahmen:**

- dynamische Nutzerdaten über `textContent`
- CSP ohne `unsafe-inline`/`unsafe-eval`
- Import-/Eingabelimits
- XSS-artige Teststrings

**Rest-Risiko:** neue DOM-Stellen könnten versehentlich `innerHTML` verwenden.

**Releasegate:** automatischer Contract-/Securitytest + Codeaudit.

### TM-02 – beschädigter Backupimport

**Risiko:** falsche Datei überschreibt gültige lokale Daten.

**Auswirkung:** kritisch

**Gegenmaßnahmen v51:**

- 1,5-MB-UTF-8-Größenlimit
- JSON-Parse
- Backupformat/-version
- exakte aktuelle Key-Allowlist
- Root-Typ-Prüfung
- key-spezifische Storage-Version und minimale Pflichtwrapper
- vollständige Validierung vor Mutation
- Snapshot der managed Keys
- managed-only Restore/Rollback

**Rest-Risiko:** tiefe Fachsemantik wird weiterhin von den jeweiligen Consumern normalisiert; reale Browser-/Quota-Evidence bleibt nötig.

**Releasegate:** BK51 auf echten Browsern/PWA + Cross-Browser.

### TM-03 – Backup-Schema-Drift

**Risiko:** Registry, Runtime, Tests und Dokumentation verwenden unterschiedliche Konstanten/Regeln.

**Auswirkung:** hoch

**Status:** **CLOSED IN CODE / CI-Evidence offen.**

**Gegenmaßnahmen:**

- `backup-schema-registry.js` Version 2 als zentrale Quelle
- `party-data-tools.js` Version 6 konsumiert diesen Vertrag
- keine duplizierten Complete-Format-/Limitkonstanten in der Runtime
- `tests/backup-schema-registry.test.js`
- `scripts/backup_contract_audit.py` im normalen `npm run validate`

### TM-04 – älterer Restore besitzt unbekannte oder zukünftige Storage-Daten

**Risiko:** Ein älteres Complete Backup importiert, überschreibt oder löscht einen zukünftigen Namespace oder eine neue Storage-Version.

**Auswirkung:** kritisch

**Status:** **CLOSED IN CODE / BK51-Evidence offen.**

**Gegenmaßnahmen v51:**

- Restore besitzt exakt 16 aktuell registrierte Storage-Keys
- keine generische `secret-circle-party-*`-Wildcard
- zukünftige Versionen wie `secret-circle-party-hub-v2` sind nicht managed
- unbekannte/future Keys werden nicht importiert
- unbekannte/future lokale Keys werden beim Restore/Rollback nicht gelöscht
- `tests/e2e/backup-forward-compat.spec.js`

Die ausdrücklich bestätigte Funktion „Alle lokalen Daten löschen“ bleibt davon getrennt und darf bewusst alle `secret-circle-*`-Reste löschen.

### TM-05 – private Karte bleibt bei Appwechsel sichtbar

**Risiko:** Mitspieler sieht geheime Information.

**Auswirkung:** hoch

**Gegenmaßnahmen:**

- `privacy-guard.js` v4
- `visibilitychange`, `blur`, `pagehide`, unterstütztes Freeze
- geheime DOM-Texte werden geleert
- Fokus zurück auf sichere Reveal-Aktion

**Rest-Risiko:** OS-Screenshot/App-Switcher-Verhalten kann browserabhängig sein.

**Releasegate:** echtes Android/iPhone testen.

### TM-06 – private Advanced-/Hub-Session öffnet nach Reload offen

**Risiko:** Rollen/Fragen werden falscher Person gezeigt.

**Auswirkung:** hoch

**Gegenmaßnahmen:**

- sichere Resume-Verträge
- private Zustände rekonstruieren gedeckt
- bewusste Sessionfortsetzung
- Hub Resume Guard v2
- v50: Resume-Aktionen während asynchroner Guard-Prüfung fail-closed gesperrt

**Releasegate:** E2E + reale Übergabetests HR2.

### TM-07 – doppelte Sessioncompletion

**Risiko:** Statistik/Verlauf manipuliert oder inkonsistent.

**Auswirkung:** hoch

**Gegenmaßnahmen:**

- stabile Session-ID
- deterministische Completion-ID
- Session Ledger
- exact-once Tests

### TM-08 – Escape/Abbruch schreibt versehentlich Abschluss

**Risiko:** Nutzer verwirft Session, Statistik wird trotzdem verändert.

**Auswirkung:** mittel-hoch

**Gegenmaßnahmen:**

- getrennte Aktionen
- bestätigter Abbruch
- Escape verwendet denselben Abbruchpfad
- Abbruch ohne Ledger-Completion

### TM-09 – manipulierte URL lädt unerwarteten Code/Pfad

**Risiko:** Query-Parameter wird als Dateipfad/Scriptquelle missbraucht.

**Auswirkung:** hoch

**Gegenmaßnahmen:**

- IDs gegen Katalog/Loader validieren
- keine beliebige Script-URL aus Userinput
- CSP `self`

### TM-10 – lokaler Speicher voll

**Risiko:** Teilwrite, Datenverlust, kaputter Zustand.

**Auswirkung:** hoch

**Gegenmaßnahmen:**

- Transaktionsmuster
- alter Snapshot
- Rollback
- klare Fehlermeldung
- v51 Complete-Restore rollt nur managed Keys zurück und lässt Future-Daten unangetastet

### TM-11 – Service-Worker-Update zerstört funktionierende Offlineversion

**Risiko:** neue Version unvollständig, alter Cache schon entfernt.

**Auswirkung:** kritisch

**Gegenmaßnahmen:**

- Staging-Cache
- vollständige Vorbereitung
- explizite Aktivierung
- alter Core bleibt bis erfolgreicher Promotion
- aktive Sessions werden erkannt

**Releasegate:** mindestens zwei echte Altstände → v51/RC + Rollback real testen.

### TM-12 – bösartige/kompromittierte Dependency

**Risiko:** Build-/Testtool führt unerwünschten Code aus.

**Auswirkung:** kritisch

**Gegenmaßnahmen im Repository:**

- minimale Dependencies
- `package-lock.json` v3
- `npm ci`
- keine npm-Runtime-Dependencies
- Playwright exakt 1.54.2
- Lockfile-/Third-Party-/Lizenzverträge

**Status:** CLOSED IN CODE / echter Online-Install und finaler Vulnerability-Review offen.

### TM-13 – CI zeigt „grün“, führt aber keinen Code aus

**Risiko:** falsches Sicherheits-/Releasevertrauen.

**Auswirkung:** kritisch

**Aktueller realer Blocker:** historisch letzter vollständig untersuchter App-Lauf ist Run #2787 auf v49 mit `steps: []`.

**Gegenmaßnahme:** keine Freigabe ohne sichtbaren Checkout und echte Schritte. v50/v51 besitzen keinen Runner-PASS.

### TM-14 – fremde Fan-/Markeninhalte erzeugen Rechts-/Trustproblem

**Risiko:** nicht technischer Securitybug, aber Release-/Trust-Risiko.

**Auswirkung:** hoch

**Gegenmaßnahmen:**

- keine fremden Logos/Bilder/Audios/lange Zitate
- Content-/Rechtsaudit
- Drittanbieterhinweise

### TM-15 – Nutzer erwartet echte Geheimhaltung vor Gerätebesitzer

**Risiko:** falsche Sicherheitsannahme.

**Auswirkung:** mittel

**Gegenmaßnahme:** Sicherheitsmodell klar dokumentieren: lokale PWA schützt gegen unbeabsichtigte Offenlegung im normalen Pass-and-Play-Flow, nicht gegen den Gerätebesitzer mit DevTools/Storagezugriff.

### TM-16 – syntaktisch gültiger managed Backupwert trägt falsche Storage-Version/Pflichtstruktur

**Risiko:** Angreifer oder beschädigte Datei verwendet einen erlaubten heutigen Key, aber einen semantisch falschen Wrapper, zum Beispiel Hub v1 mit `{version:999}`.

**Auswirkung:** kritisch

**Status:** **CLOSED IN CODE / BK51-Evidence offen.**

**Gegenmaßnahmen:**

- zentrale per-Key-Store-Contracts in `backup-schema-registry.js`
- Root-Typ
- erwartete Storage-Version
- minimale Pflichtfelder
- Ablehnung vor Snapshot-/Restore-Mutation
- Unit- und Browsercontract

## 6. Abuse-/Misuse-Fälle

Version 1 besitzt kein öffentliches UGC-Netzwerk und keine Nutzer-zu-Nutzer-Kommunikation. Dadurch entfallen viele Moderations-/Spamrisiken.

Lokale Creator-Inhalte können dennoch unangemessen sein. Da sie lokal vom Nutzer erstellt werden:

- keine automatische öffentliche Verteilung
- keine Cloudmoderation erforderlich
- Import bleibt untrusted und technisch validiert

Wenn später Sharing/Community hinzukommt, wird Moderation zu neuem Pflichtbereich.

## 7. Privacy Threats

### PT-01 – geheime Inhalte im App Switcher

Echtgerätetest erforderlich; Browser/PWA-Verhalten kann nicht allein aus DOM-Events garantiert werden.

### PT-02 – Backup wird geteilt

Backup enthält lokale Daten im Klartext.

Nutzer muss vor Export/Weitergabe verstehen, dass die Sicherungsdatei nicht verschlüsselt ist.

### PT-03 – zukünftiger externer Dienst

Neue Netzwerkfunktion könnte Datenschutzversprechen verletzen.

Daher: kein neuer `connect-src`/Remote-Service ohne Product + Privacy + Threat Review.

### PT-04 – ältere Restore-Version zerstört zukünftige lokale Daten

v51 verhindert dies source-seitig durch exakte aktuelle Key-Eigentümerschaft. Reale BK51-/Upgrade-Evidence bleibt Pflicht.

## 8. Residual Risks, die wir akzeptieren können

Nur bewusst und dokumentiert:

- Gerätebesitzer kann localStorage manipulieren
- Mitspieler kann physisch über Schulter schauen
- Browser kann lokale Daten unter Speicherdruck löschen
- exportiertes Backup ist Klartext

Diese Risiken dürfen nicht dazu führen, dass manipulierte Daten Scriptcode ausführen oder die App irreparabel beschädigen.

## 9. Release-Security-Gates

- [ ] keine offenen kritischen/hohen Securitybugs
- [ ] XSS-/Creator-Input-Tests real grün
- [ ] Import/Quota/BK51-Rollback real grün
- [ ] private Reveal-/Reload-Wege real grün
- [ ] HR2 Hub Resume v2/v50 real grün
- [ ] echte Android/iPhone-Privacy-Unterbrechung geprüft
- [ ] PWA-Update/Rollback real geprüft
- [x] Lockfile + `npm ci` als Repositoryvertrag
- [ ] Online-`npm ci` auf funktionierendem Runner
- [ ] Dependency-/Lizenzprüfung auf unverändertem RC final
- [ ] CI führt echten Code aus
- [ ] Branch Protection
- [ ] Securitykontakt/Incidentprozess final
- [x] Backup-Registry-Drift im Sourcevertrag geschlossen
- [x] generischer Complete-Backup-Namespace im Sourcevertrag geschlossen
- [x] falsche interne Storage-Version/Pflichtstruktur im Sourcevertrag blockiert
- [ ] BK51 + Cross-Browser + PWA-Upgrade auf unverändertem RC bestanden

## 10. Review-Regel

Dieses Threat Model wird aktualisiert, wenn mindestens eines davon passiert:

- neue persistierte Daten oder neuer Storage-Key
- Änderung einer Storage-Version
- neue Dependency
- neuer Netzwerkzugriff
- neue Browserberechtigung
- neue private Spielmechanik
- neues Importformat
- Backend/Auth/Cloud
- öffentliche Creator-/Contentfreigabe
- Store-/Native-App

**Wichtig für v51+:** Jeder neue persistierte Key wird nicht automatisch vom heutigen Complete Restore besessen. Eine Aufnahme in die Registry benötigt expliziten Storage-Contract, Tests, Backup-Audit-Anpassung und eine Migration-/Forward-Compatibility-Entscheidung.