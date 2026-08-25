# Secret Circle – Supportvertrag

Stand: 25. August 2026  
Status: **PREPARED – echter Kontakt vor RC offen**

## 1. Zweck

Dieses Dokument definiert, wie Nutzer nach öffentlicher Veröffentlichung Hilfe erhalten und wie Supportfälle in Produkt-, Daten-, Security- oder Releaseprobleme überführt werden.

Secret Circle ist offline-first und besitzt im V1-Scope kein Benutzerkonto und keinen eigenen Spielserver. Support darf deshalb weder Fernzugriff auf lokale Daten versprechen noch Nutzer auffordern, unnötig private Inhalte zu senden.

Verbindliche zentrale Quelle für reale Kontakte und Tests: `operator-release.json`.

## 2. Öffentlicher Supportkanal

Vor Release festzulegen und in `operator-release.json` einzutragen:

- Support-E-Mail: **noch nicht festgelegt**
- Betreiber/Verantwortlicher: **noch nicht festgelegt**
- Security-/Privacy-Meldeweg: **noch nicht festgelegt**
- erwartete Sprache: Deutsch; optional Englisch später
- öffentlich sichtbare Support-/Legal-Verlinkung: **vor Production erforderlich**

**Release-Regel:** Keine Fantasieadresse, kein unbeaufsichtigtes Postfach, kein Kontakt, auf den niemand zuverlässig zugreifen kann.

`operatorGate = READY` verlangt deshalb ausdrücklich:

- gültige Supportadresse
- getestetes Supportpostfach
- Security-/Privacy-Meldeweg
- getestete Securityroute
- mindestens einen vollständig durchgespielten Probe-Supportfall

## 3. Welche Angaben ein Supportfall enthalten darf

Bevorzugt:

- App-/PWA-Version beziehungsweise sichtbare Cachegeneration
- Browser und Betriebssystem
- Gerätetyp
- betroffene Seite/Spiel-ID
- Schritte bis zum Fehler
- erwartetes Verhalten
- tatsächlich beobachtetes Verhalten
- ob die App online/offline war
- ob eine Session fortgesetzt/importiert/aktualisiert wurde

Nicht standardmäßig anfordern:

- Passwörter
- private Chats
- vollständige Browserprofile
- private Fotos
- Adressen/Telefonnummern
- komplette JSON-Backups mit persönlichen Spielernamen/Inhalten

Falls ein Backup zur Diagnose wirklich nötig ist, zuerst nach einer reproduzierbaren Testdatei ohne persönliche Inhalte fragen.

## 4. Supportkategorien

### S0 – Security/Privacy

Beispiele:

- private Rolle wird unerwartet sichtbar
- importierte Datei kann unerlaubte Daten schreiben
- Daten werden entgegen Produktversprechen übertragen
- Schwachstelle mit realem Missbrauchspotenzial

Aktion:

- nicht als normalen öffentlichen Issue-Thread behandeln
- nach `INCIDENT_RESPONSE.md` klassifizieren
- Security-Meldeweg verwenden

### S1 – Datenverlust / Startblocker

Beispiele:

- App startet nicht
- lokaler Import zerstört Daten
- Update macht bestehende Session unbrauchbar
- Creator-Bibliothek verschwindet unerwartet

Ziel:

- Reproduktion und Schutz vorhandener Daten priorisieren
- keine Löschung/Neuinstallation als ersten pauschalen Rat geben
- Export vorhandener Daten empfehlen, falls App noch bedienbar ist

### S2 – Kernspiel funktional falsch

Beispiele:

- Timer läuft während Pause weiter
- Score/Winner falsch
- Skip zählt Punkt
- Resume zeigt falsche Runde

Aktion:

- Core-Spiel und Sessiontyp dokumentieren
- Regressionsfall in Test/Acceptance-Matrix aufnehmen

### S3 – UX/Accessibility/Content

Beispiele:

- unklarer Button
- Fokus geht verloren
- Screenreadertext unverständlich
- Karte unangemessen/zu ähnlich

Aktion:

- nachvollziehbaren Nutzerkontext dokumentieren
- Accessibility-/Contentmatrix aktualisieren

### S4 – Featurewunsch

Featurewünsche sind kein Releaseincident. Neue Funktionen werden gegen Scope, Risiko und Januar-2027-Gates bewertet.

## 5. Supportfall-Vorlage

```text
Support-ID:
Datum/Uhrzeit:
App-Version/Cache:
Gerät/OS/Browser:
Installierte PWA oder Browser:
Online/Offline:
Seite/Spiel:
Schritte:
Erwartung:
Beobachtung:
Daten-/Privacy-Auswirkung:
Severity-Vorschlag:
Reproduzierbar: ja/nein
An Engineering/Incident eskaliert: ja/nein
Status:
```

Keine echten Spielernamen oder privaten Inhalte sind für diese Standardvorlage erforderlich.

## 6. Offline-/PWA-Support

Bei Update-/Offlineproblemen erfassen:

1. Browser/OS
2. installierte PWA oder Browser-Tab
3. aktuelle sichtbare Version/Cachegeneration, falls verfügbar
4. online/offline beim Auftreten
5. aktive Session vorhanden?
6. Updatebanner gesehen/bestätigt?
7. App nach Neustart weiterhin offline startbar?

Nicht pauschal „Browserdaten löschen“ empfehlen, bevor geklärt ist, ob lokale Creator-/Sessiondaten erhalten werden müssen.

## 7. Backup-/Import-Support

- Dateien bleiben unverschlüsselt
- Größe maximal 1,5 MB je registriertem Backupformat
- Complete-Import akzeptiert nur registrierte Secret-Circle-Key-Familien
- unbekannte Formatversionen werden nicht still akzeptiert
- bei Schreibfehler wird Rollback versucht

Bei Importfehlern zuerst Kopie der Datei sichern und nicht mehrfach destruktiv experimentieren.

## 8. Content-/Safety-Support

Nutzer sollen unangenehme persönliche Karten jederzeit überspringen können.

Meldungen zu Built-in-Content werden mindestens klassifiziert nach:

- Spiel
- Pack
- exakter Karte
- Alterseinstufung `all`/`teen`
- Privacy
- Safety
- Demütigung/Bloßstellung
- Rechte/Marken

Ein gemeldeter kritischer Built-in-Inhalt kann einen Hotfix unabhängig vom normalen Featureplan auslösen.

## 9. Support-SLA für V1

Vor Release wird kein unrealistisches 24/7-SLA versprochen.

Interner Zielrahmen nach öffentlichem Release:

- Security/Privacy und Datenverlust: höchste Priorität
- Kernspielblocker: zeitnah triagieren
- UX/Content: sammeln und priorisieren
- Featurewünsche: Roadmapentscheidung

Konkrete Antwortzeiten werden erst veröffentlicht, wenn personell real leistbar.

## 10. Übergabe an Engineering / Incident

Ein reproduzierbarer Bug enthält idealerweise:

- eindeutigen Titel
- Severity
- betroffene Version/Commit, falls bekannt
- Umgebung
- Reproduktionsschritte
- Ergebnis
- Erwartung
- Daten-/Privacy-Auswirkung
- Regression ja/nein
- vorgeschlagenen Testfall

S0 sowie ausgewählte S1-Fälle werden direkt nach `INCIDENT_RESPONSE.md` eskaliert.

## 11. Probe-Supportfall vor Release

Vor `SUPPORT PASS` mindestens einmal real durchführen:

1. Testnachricht an den finalen Supportkontakt senden
2. Empfang praktisch bestätigen
3. Fall als S2 oder S3 klassifizieren
4. sichere Rückfrage ohne sensible Daten formulieren
5. Engineering-Ticket/Testfall ableiten
6. Abschluss dokumentieren
7. `operator-release.json.support.sampleSupportCaseCompleted = true` erst danach setzen

## 12. Release-Gates

Vor `SUPPORT PASS`:

- [ ] echter Supportkontakt festgelegt
- [ ] Kontakt praktisch getestet
- [ ] Legal-/Privacy-Seite verlinkt Support konsistent
- [ ] Security-Meldeweg festgelegt
- [ ] Securityroute praktisch getestet
- [ ] Supportkategorien intern bekannt
- [ ] kein Prozess verlangt standardmäßig sensible Daten
- [ ] Incident-Eskalation funktioniert
- [ ] mindestens ein Probe-Supportfall vollständig durchgespielt
- [ ] `operator-release.json` enthält dieselben finalen Werte/Nachweise

Bis dahin: **SUPPORT PREPARED / RELEASE NO_GO**.
