# Secret Circle – Sicherheitsrichtlinie

Stand: 26. August 2026

## Unterstützte Versionen

Während der Beta wird ausschließlich der neueste Commit des aktiven Release-Branches gepflegt. Frühere Entwicklungsstände erhalten keine separaten Sicherheitskorrekturen.

Aktueller Source-/Offline-Core: **`secret-circle-v51` / `secret-circle-v51-staging`**. Ein Source-Vertrag ist kein Sicherheits-PASS ohne echte Runner-/Browser-/Geräte-Evidence.

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

### Gesamtsicherung und Löschung – v51

- 1,5-MB-Grenze basiert auf tatsächlichen UTF-8-Bytes
- Mehrbyte-Zeichen umgehen die Grenze nicht
- `backup-schema-registry.js` Version 2 ist die zentrale Complete-Backup-Quelle
- `party-data-tools.js` Version 6 konsumiert die Registry statt Format-/Limitwerte zu duplizieren
- Complete Restore besitzt ausschließlich **16 explizit registrierte aktuelle Storage-Keys**
- unbekannte/future Namespaces und zukünftige Storage-Versionen sind kein heutiges Restore-Eigentum
- managed Werte benötigen gültiges JSON, erwarteten Root-Typ, aktuelle Storage-Version und minimale Pflichtwrapper
- alle Entries werden vor der ersten Mutation geprüft
- Restore snapshotet, ersetzt und rollt nur managed Keys zurück
- unbekannte/future Daten bleiben auch bei einem Restore-Rollback unangetastet
- ausdrücklich bestätigte Komplettlöschung bleibt bewusst prefixweit und entfernt alle `secret-circle-*`-Daten
- fehlgeschlagener Rollback erzeugt eine gesonderte kritische Meldung

Diese Maßnahmen reduzieren unbeabsichtigten lokalen Datenverlust. Sie ersetzen keine verschlüsselte Datenbank und keinen Schutz vor einer Person, die das eigene Gerät und den Browser-Speicher bewusst manipuliert.

## Private Rollen und Reveal-Sicherheit

Secret Circle schützt primär gegen **unbeabsichtigte Offenlegung im normalen Pass-and-Play-Flow**.

### Bestehende Maßnahmen

- Word-Imposter-Geheimnisse werden bei `visibilitychange`, `blur`, `pagehide` und unterstütztem Freeze verdeckt und aus dem Secret-DOM entfernt
- Fokus kehrt nach automatischem Verdecken zur sicheren Reveal-Aktion zurück
- direkte Hub- und Advanced-Private-States öffnen nach Reload nicht automatisch offen
- Hub-Resume-Aktionen sind seit v50 während der asynchronen Guard-Prüfung fail-closed gesperrt
- Mafia-Moderatorübersicht verlangt nach Reload erneute Bestätigung

### Nicht garantiert

- Schutz vor Gerätebesitzer mit DevTools/localStorage-Zugriff
- Schutz vor physischem Über-die-Schulter-Schauen
- vollständige Kontrolle darüber, was ein Betriebssystem im App-Switcher snapshotten kann

Daher bleiben echte Android-/iPhone-Privacy-Tests Releasepflicht.

## Import- und Backup-Sicherheit

### Unterstützte globale Grenzen

- maximal 1.500.000 UTF-8-Bytes je unterstützter Sicherungsdatei
- Complete Backup: maximal 100 Einträge und 1.000.000 Bytes je Wert
- Creator: begrenzte Spiele/Packs/Karten
- Format-/Versionsprüfung
- exakte Complete-Key-Allowlist
- key-spezifische Root-/Storage-Version-/Wrapper-Prüfung

### Importreihenfolge Complete Backup

1. Dateigröße prüfen
2. vollständig lesen
3. JSON parsen
4. Backupformat/-version prüfen
5. exakte Storage-Key-Allowlist prüfen
6. Wertgröße und JSON-Root prüfen
7. key-spezifische Storage-Version/Pflichtstruktur prüfen
8. managed Snapshot erstellen
9. erst danach managed Keys ersetzen
10. bei Fehler managed Zustand rollbacken
11. unbekannte/future Namespaces unangetastet lassen

### SEC-F01 – Schema-Drift

**Status: CLOSED IN CODE / CI-Evidence offen.**

`backup-schema-registry.js` ist die zentrale Quelle. `party-data-tools.js` leitet Complete-Backup-Format und Limits aus der Registry ab. `tests/backup-schema-registry.test.js` und `scripts/backup_contract_audit.py` schützen gegen erneute Duplikation/Drift.

### SEC-F02 – generischer Complete-Backup-Namespace

**Status: CLOSED IN CODE / BK51-Evidence offen.**

Die frühere offene Entscheidung ist getroffen: **keine generische `secret-circle-party-*`-Restore-Wildcard**. Die Registry verwaltet nur die aktuell bekannten exakten Keys. Zukünftige Namespaces oder Storage-Versionen werden von einer heutigen Sicherung nicht importiert und bei Restore nicht gelöscht.

### SEC-F03 – syntaktisch gültige, semantisch falsche Storage-Wrapper

**Status: CLOSED IN CODE / BK51-Evidence offen.**

Ein gültiges JSON allein reicht nicht. Die Registry prüft pro managed Key Root-Typ, aktuelle Storage-Version und minimale Pflichtwrapper. Ein Hub-v1-Wert mit `{ "version": 999, ... }` wird vor Mutation abgelehnt.

Source-/Browser-Verträge:

- `tests/backup-schema-registry.test.js`
- `tests/e2e/party-data.spec.js`
- `tests/e2e/backup-forward-compat.spec.js`
- `scripts/backup_contract_audit.py`

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

Aktueller Sourcevertrag: **v51**. Reale Upgrade-/Rollback-Evidence bleibt offen.

## Supply Chain

### Repositoryvertrag

- `package-lock.json` v3 vorhanden
- CI und Cross-Browser verwenden `npm ci`
- Playwright 1.54.2 exakt gepinnt
- keine npm-Runtime-Dependencies
- Lockfile-/Lizenz-/Third-Party-Verträge vorhanden

**Status:** CLOSED IN CODE / ONLINE VERIFICATION OPEN. Ein echter Online-`npm ci`-PASS fehlt weiterhin, weil GitHub Actions vor Step 1 endet.

## Repository-Sicherheit

Vor Release:

- Branch Protection
- Required Checks
- keine Secrets in Historie
- keine unbekannten Binärartefakte
- kein Force-Push auf stabile Releasebasis
- unveränderlicher Release-Commit/Tag

Ein CI-Lauf ist nur dann ein Sicherheitsnachweis, wenn ein Runner tatsächlich Checkout und Prüfungen ausführt. `steps: []` ist ausdrücklich **kein** grüner Sicherheitsnachweis.

Historisch letzter vollständig untersuchter App-Lauf: Run #2787 auf v49. v50/v51 besitzen keinen Runner-PASS.

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
- unbekannter Future-Namespace bleibt bei Restore erhalten
- Future-Version eines bekannten Storage-Keys bleibt bei Restore erhalten
- Backup mit Future-Key wird vor Mutation abgelehnt
- falsche interne Storage-Version eines managed Keys wird vor Mutation abgelehnt
- Quota-/Write-Rollbackfehler
- Import-/Löschfehler
- doppelte Completion
- private Blur-/Visibility-/Reload-Wege
- Hub-Resume-Guard-Ladephase fail-closed
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
- [ ] XSS-/Creator-Input-Tests real grün
- [ ] Import/Quota/BK51-Rollback real grün
- [ ] private Reveal-/Reload-/Blur-Wege real grün
- [ ] Hub Resume v2/v50-Ladephase real grün
- [ ] echte Android/iPhone-Privacy-Unterbrechung geprüft
- [ ] PWA-Update/Rollback real geprüft
- [x] Lockfile + `npm ci` im Repositoryvertrag
- [ ] Online-`npm ci` auf funktionierendem Runner
- [ ] Dependency-/Lizenzprüfung auf unverändertem RC final
- [ ] Branch Protection
- [ ] CI führt echten Code aus
- [ ] Security-/Incidentkontakt final
- [x] SEC-F01 im Sourcevertrag geschlossen
- [x] SEC-F02 im Sourcevertrag geschlossen
- [x] SEC-F03 im Sourcevertrag geschlossen
- [ ] BK51/Cross-Browser-Evidence auf dem unveränderten RC
