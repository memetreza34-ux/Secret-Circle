# Secret Circle – Sicherheitsrichtlinie

Stand: 16. August 2026

## Unterstützte Versionen

Während der Beta wird ausschließlich der neueste Commit des aktiven Release-Branches gepflegt. Frühere Entwicklungsstände erhalten keine separaten Sicherheitskorrekturen.

## Sicherheitsproblem melden

Sicherheitsprobleme sollten nicht öffentlich mit vollständigen Ausnutzungsdetails veröffentlicht werden.

Bevorzugter Weg:

1. Repository auf GitHub öffnen.
2. Tab `Security` öffnen.
3. `Report a vulnerability` beziehungsweise eine private Security Advisory verwenden, sofern aktiviert.
4. Problem, betroffene Version, Reproduktionsschritte, erwartetes Verhalten und mögliche Auswirkungen angeben.

Falls keine private Meldefunktion verfügbar ist, muss vor öffentlichem Release eine verantwortliche Kontaktmöglichkeit ergänzt werden.

## Hilfreiche Angaben

- App-Version und Commit
- Gerät, Betriebssystem und Browser
- installierte PWA oder Browser-Tab
- Online- oder Offline-Zustand
- betroffene lokale Daten, Party-Night-Plan oder Sicherungsdatei
- minimale reproduzierbare Schritte
- Screenshot oder Video ohne fremde geheime Spielinhalte
- mögliche Auswirkungen: Datenverlust, Rollenenthüllung, Skriptausführung, unbemerkte Datenmischung oder Spielblockade

## Sicherheitsmodell

Secret Circle ist für Januar 2027 eine statische lokale Pass-and-Play-PWA:

- kein Benutzerkonto
- keine eigene Server-API
- keine Cloud-Datenbank
- keine Analyse-, Werbe- oder Tracking-Dienste
- keine Zahlungen
- Spieldaten und Party-Night-Pläne im lokalen Browser-Speicher
- Sicherungsexport und -import lokal
- restriktive Content Security Policy
- dynamische Namen, Kategorien, Packtexte und Ergebnisse werden als Text ausgegeben
- Service Worker verarbeitet lokale Appressourcen

Das vollständige Bedrohungsmodell steht in `THREAT_MODEL.md`.

## Security Engineering Baseline

Für jedes neue Feature gelten ab Entwurf:

- Nutzereingaben grundsätzlich nicht vertrauen
- persistierte Daten versionieren und validieren
- keine Secrets im Repository oder ausgelieferten Client
- keine neuen Netzwerkziele ohne Produkt-, Datenschutz- und Threat-Review
- keine unnötigen Browserberechtigungen
- keine unkontrollierten `innerHTML`-Pfade für Nutzerdaten
- kritische Schreibvorgänge rollbackfähig gestalten
- neue Dependencies begründen und prüfen

## Schutz lokaler Transaktionen

### Party Night

- nur bekannte spielbare Katalog-IDs
- doppelte/unbekannte IDs beim Laden verwerfen
- Planlänge begrenzen
- Statuswerte normalisieren
- ungültige Konfigurationen nicht ausführen
- Speicherfehler sichtbar behandeln
- Plantexte erzeugen keine HTML-/Skriptausführung

### Komplexe Sessions

- eindeutige Session-ID
- stabiler Spieler-Snapshot
- Verlauf/Statistik vor Entfernen des Active-Markers sicher speichern
- bei Schreibfehler Session aktiv halten
- eindeutige Completion-/Historien-IDs verhindern doppelte Abschlüsse

### Eigene Hub-Packs und Creator

- Texte normalisieren/validieren
- Mengen-/Längenlimits
- Duplikate bereinigen, wo vorgesehen
- sichere Textdarstellung
- Speicher-/Löschfehler stellen vorherigen Zustand wieder her

### Gesamtsicherung und Löschung

- 1,5-MB-Grenze basiert auf tatsächlichen UTF-8-Bytes
- Mehrbyte-Zeichen umgehen die Grenze nicht
- Import und vollständige Löschung arbeiten transaktional
- bei Fehlern wird der vorherige Zustand wiederhergestellt
- fehlgeschlagener Rollback erzeugt gesonderte kritische Meldung

Diese Maßnahmen reduzieren unbeabsichtigten lokalen Datenverlust. Sie ersetzen keine verschlüsselte Datenbank und keinen Schutz vor einer Person, die das eigene Gerät und den Browser-Speicher bewusst manipuliert.

## Private Rollen und Reveal-Sicherheit

Secret Circle schützt primär gegen **unbeabsichtigte Offenlegung im normalen Pass-and-Play-Flow**.

### Bestehende Maßnahmen

- Word-Imposter-Geheimnis wird bei `visibilitychange`, `blur` und `pagehide` verdeckt
- Fokus kehrt nach automatischem Verdecken zur sicheren Reveal-Aktion zurück
- direkte Hub- und Advanced-Private-States öffnen nach Reload nicht automatisch offen
- Mafia-Moderatorübersicht verlangt nach Reload erneute Bestätigung

### Nicht garantiert

- Schutz vor Gerätebesitzer mit DevTools/localStorage-Zugriff
- Schutz vor physischem Über-die-Schulter-Schauen
- vollständige Kontrolle darüber, was ein Betriebssystem im App-Switcher snapshotten kann

Daher bleiben echte Android-/iPhone-Privacy-Tests Releasepflicht.

## Import- und Backup-Sicherheit

### Unterstützte globale Grenzen

- maximal 1.500.000 UTF-8-Bytes je unterstützter Sicherungsdatei
- Complete Backup: begrenzte Eintragszahl und Einzelwertgröße
- Creator: begrenzte Spiele/Packs/Karten
- Format-/Versionsprüfung

### Importreihenfolge

1. Dateigröße prüfen
2. vollständig lesen
3. JSON parsen
4. Format/Version prüfen
5. Struktur validieren
6. erst danach schreiben
7. bei Fehler alten Zustand wiederherstellen

### Offener Hardening-Fund SEC-F01 – Schema-Drift

`backup-schema-registry.js` ist als zentrales Registry vorhanden. `party-data-tools.js` dupliziert aktuell jedoch Format-, Versions- und Limitkonstanten des Complete-Backups.

**Risiko:** Registry und tatsächlicher Importpfad könnten später auseinanderlaufen.

**Maßnahme:** direkten Registry-Vertrag oder zusätzlichen Drift-Test einführen.

### Offener Hardening-Fund SEC-F02 – generischer Complete-Backup-Namespace

Complete Backup akzeptiert generisch `secret-circle-*`-Keys innerhalb seiner Grenzen.

**Vorteil:** zukunftskompatible vollständige Sicherung.

**Risiko:** größere importierbare Zustandsfläche.

Vor Release wird bewusst entschieden zwischen:

- versionierter Namespace-Allowlist oder
- generischer Sicherung + strikt validierenden Consumern + Contract-Test.

## localStorage

- localStorage ist kein sicherer Geheimnisspeicher gegen Gerätebesitzer
- keine Passwörter/Tokens speichern
- private Zustände nur soweit nötig persistieren
- Resume rekonstruiert private Inhalte gedeckt
- Appdaten bleiben über `secret-circle-` inventarisierbar

## URL- und Routing-Sicherheit

Query-Parameter gelten als untrusted input.

- IDs gegen Katalog/Loader prüfen
- unbekannte IDs sicher behandeln
- keine beliebigen Script-/Dateipfade aus Nutzerinput ableiten
- keine privaten Inhalte in URLs schreiben

## Content Security Policy

Kernseiten verwenden eine restriktive CSP mit `self` und ohne `unsafe-inline`/`unsafe-eval` für Skripte.

Neue externe Quellen oder Lockerungen der CSP benötigen explizites Security-Review.

## Browser-Berechtigungen

Version 1 benötigt keine:

- Kamera
- Mikrofon
- Kontakte
- Standort
- Push-Benachrichtigungen

Wake Lock bleibt Komfortfunktion und darf keine notwendige Sicherheits-/Spiellogik besitzen.

## Service Worker / PWA

Sicherheits-/Integritätsregeln:

- erwartete lokale Ressourcen cachen
- neue Version zuerst vollständig vorbereiten
- alten funktionierenden Core nicht vor erfolgreicher Promotion zerstören
- aktive Sessions berücksichtigen
- keine stille Aktivierung mitten in laufender Session
- Rollback hält Daten kompatibel

## Supply Chain

### Releaseanforderungen

- Abhängigkeiten minimieren
- reproduzierbares `package-lock.json`
- CI mit `npm ci`
- keine unnötigen Install-Skripte
- bekannte Sicherheitslücken prüfen
- Lizenzen/Drittanbieter dokumentieren
- wichtige Toolversionen pinnen

Aktuell bleibt `package-lock.json` / `npm ci` ein offenes P1-Releasegate.

## Repository-Sicherheit

Vor Release:

- Branch Protection
- Required Checks
- keine Secrets in Historie
- keine unbekannten Binärartefakte
- kein Force-Push auf stabile Releasebasis
- unveränderlicher Release-Commit/Tag

Ein CI-Lauf ist nur dann ein Sicherheitsnachweis, wenn ein Runner tatsächlich Checkout und Prüfungen ausführt. `runner_id: 0` / `steps: []` ist ausdrücklich **kein** grüner Sicherheitsnachweis.

## Logging und Telemetrie

Version 1 besitzt keine externe Analytics-/Trackingplattform.

Falls später Crash-/Error-Reporting eingeführt wird:

- keine privaten Karten/Rollen senden
- Redaction definieren
- Datensparsamkeit
- Datenschutz aktualisieren
- CSP/Netzwerkreview

## Nicht als Sicherheitslücke eingestuft

- Personen derselben Runde besitzen physischen Zugriff auf dasselbe Gerät
- Nutzer können eigene Browserdaten/Sicherungsdateien absichtlich verändern
- Browser/OS kann lokalen Speicher unter Speicherdruck entfernen
- absichtlich weitergegebene Sicherungsdatei enthält lokale Daten im Klartext
- absichtliches Beobachten des Displays kann technisch nicht verhindert werden
- Gerätebesitzer kann DevTools nutzen

Manipulierte lokale Daten dürfen jedoch keine Skriptausführung, fremde Netzwerkzugriffe oder einen nicht behebbaren App-Zustand verursachen.

## Besonders relevante Testfälle

Vor Sicherheitsfreigabe mindestens:

- HTML-/Skripttexte in Namen/Creator/Packs
- beschädigte/ungültige Sessiondaten
- unbekannte/doppelte Katalog-IDs
- ungültige/übergroße Sicherungsdateien
- Mehrbyte-Datei über Byte-Grenze
- Quota-/Rollbackfehler
- Import-/Löschfehler
- doppelte Completion
- private Blur-/Visibility-/Reload-Wege
- unbekannte Query-IDs
- CSP ohne `unsafe-inline`/`unsafe-eval`
- Offline-Start ohne externe Runtime-Ressourcen
- fehlgeschlagene PWA-Promotion

## Bearbeitung einer Meldung

1. Eingang bestätigen
2. Schweregrad/Reproduzierbarkeit prüfen
3. Fix auf separatem Branch
4. Engine-/Speicher-/Security-/Browserprüfungen
5. Cache-Version erhöhen, wenn Offline-Dateien betroffen
6. `CHANGELOG.md` aktualisieren
7. betroffene Version ersetzen/zurückziehen
8. Root Cause und Prävention dokumentieren

Eine öffentliche Produktionsfreigabe ist blockiert, solange ein bestätigter kritischer oder hoher Sicherheitsfehler offen ist.

## Security Definition of Done

- [ ] `THREAT_MODEL.md` aktuell
- [ ] keine offenen kritischen/hohen Securitybugs
- [ ] XSS-/Creator-Input-Tests grün
- [ ] Import/Quota/Rollback grün
- [ ] private Reveal-/Reload-/Blur-Wege grün
- [ ] echte Android/iPhone-Privacy-Unterbrechung geprüft
- [ ] PWA-Update/Rollback real geprüft
- [ ] Lockfile + `npm ci`
- [ ] Dependency-/Lizenzprüfung
- [ ] Branch Protection
- [ ] CI führt echten Code aus
- [ ] Security-/Incidentkontakt final
- [ ] SEC-F01 geschlossen
- [ ] SEC-F02 geschlossen oder bewusst akzeptiert
