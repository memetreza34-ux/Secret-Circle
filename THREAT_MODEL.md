# Secret Circle – Threat Model

Stand: 16. August 2026

## 1. Scope

Dieses Threat Model gilt für den Januar-2027-Release der statischen offline-first PWA.

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
- HTML-/Scripttext
- widersprüchliche Sessiondaten

### D. Supply-Chain-/Buildproblem

Kann entstehen durch:

- manipulierte Dependency
- falsche Dependency-Version
- fehlendes Lockfile
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

**Gegenmaßnahmen:**

- Größenlimit
- JSON-Parse
- Format-/Versionsprüfung
- Strukturprüfung
- Snapshot vor Schreiben
- Rollback bei Schreibfehler

**Rest-Risiko:** Complete Backup validiert aktuell primär generische Storage-Einträge; semantische Consumer-Validierung bleibt wichtig.

### TM-03 – Backup-Schema-Drift

**Risiko:** Registry und konkreter Importpfad verwenden unterschiedliche Konstanten/Regeln.

**Auswirkung:** hoch

**Beobachtung:** `backup-schema-registry.js` ist zentral vorhanden; `party-data-tools.js` dupliziert derzeit Format-/Versions-/Limitwerte.

**Maßnahme:** Registry-Nutzung oder verbindlicher Drift-Contract.

### TM-04 – beliebige `secret-circle-*` Keys im Komplettimport

**Risiko:** manipulierte Sicherung führt neue/unerwartete Namespaces ein.

**Auswirkung:** mittel-hoch

**Gegenmaßnahmen aktuell:** Prefix, Länge, Count, Value-Byte-Limit, JSON-Syntax.

**Entscheidung offen:** bekannte Namespace-Allowlist vs. bewusst generische Zukunftskompatibilität + strikte Consumer-Validierung.

### TM-05 – private Karte bleibt bei Appwechsel sichtbar

**Risiko:** Mitspieler sieht geheime Information.

**Auswirkung:** hoch

**Gegenmaßnahmen:**

- `privacy-guard.js`
- `visibilitychange`
- `blur`
- `pagehide`
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

**Releasegate:** E2E + reale Übergabetests.

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

### TM-11 – Service-Worker-Update zerstört funktionierende Offlineversion

**Risiko:** neue Version unvollständig, alter Cache schon entfernt.

**Auswirkung:** kritisch

**Gegenmaßnahmen:**

- Staging-Cache
- vollständige Vorbereitung
- explizite Aktivierung
- alter Core bleibt bis erfolgreicher Promotion
- aktive Sessions werden erkannt

**Releasegate:** alte→neue Versionen + fehlgeschlagene Promotion real testen.

### TM-12 – bösartige/kompromittierte Dependency

**Risiko:** Build-/Testtool führt unerwünschten Code aus.

**Auswirkung:** kritisch

**Gegenmaßnahmen geplant:**

- minimale Dependencies
- `package-lock.json`
- `npm ci`
- keine unnötigen Install-Skripte
- Dependency-/Lizenzprüfung

**Aktueller Status:** Lockfile-Gate offen.

### TM-13 – CI zeigt „grün“, führt aber keinen Code aus

**Risiko:** falsches Sicherheits-/Releasevertrauen.

**Auswirkung:** kritisch

**Aktueller realer Blocker:** Jobs wurden mit `runner_id: 0` und `steps: []` beobachtet.

**Gegenmaßnahme:** keine Freigabe ohne sichtbaren Checkout und echte Schritte.

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

Nutzer muss vor Export/Weitergabe verstehen, dass Sicherungsdatei nicht verschlüsselt ist.

### PT-03 – zukünftiger externer Dienst

Neue Netzwerkfunktion könnte Datenschutzversprechen verletzen.

Daher: kein neuer `connect-src`/Remote-Service ohne Product + Privacy + Threat Review.

## 8. Residual Risks, die wir akzeptieren können

Nur bewusst und dokumentiert:

- Gerätebesitzer kann localStorage manipulieren
- Mitspieler kann physisch über Schulter schauen
- Browser kann lokale Daten unter Speicherdruck löschen
- exportiertes Backup ist Klartext

Diese Risiken dürfen nicht dazu führen, dass manipulierte Daten Scriptcode ausführen oder die App irreparabel beschädigen.

## 9. Release-Security-Gates

- [ ] keine offenen kritischen/hohen Securitybugs
- [ ] XSS-/Creator-Input-Tests grün
- [ ] Import/Quota/Rollback grün
- [ ] private Reveal-/Reload-Wege grün
- [ ] echte Android/iPhone-Privacy-Unterbrechung geprüft
- [ ] PWA-Update/Rollback real geprüft
- [ ] Lockfile + `npm ci`
- [ ] Dependency-/Lizenzprüfung
- [ ] CI führt echten Code aus
- [ ] Branch Protection
- [ ] Securitykontakt/Incidentprozess final
- [ ] Backup-Registry-Driftentscheidung geschlossen
- [ ] Complete-Backup-Namespaceentscheidung geschlossen oder bewusst akzeptiert

## 10. Review-Regel

Dieses Threat Model wird aktualisiert, wenn mindestens eines davon passiert:

- neue persistierte Daten
- neue Dependency
- neuer Netzwerkzugriff
- neue Browserberechtigung
- neue private Spielmechanik
- neues Importformat
- Backend/Auth/Cloud
- öffentliche Creator-/Contentfreigabe
- Store-/Native-App
