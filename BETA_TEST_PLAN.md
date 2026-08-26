# Secret Circle – Beta-, Geräte- und Gruppentestplan

Stand: 26. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v52` / `secret-circle-v52-staging`**  
Core Source Hardening: **15/15 PREPARED**  
Accessibility Source Hardening: **PREPARED**  
Word-Imposter Data/Resume Hardening: **PREPARED**  
Hub Resume Guard v2 + v50-Ladequarantäne: **PREPARED**  
Complete Backup v51 Hardening: **PREPARED**  
Hub Round Resume v52: **PREPARED**

## 1. Eintrittskriterium

Finale RC-Beta erst nach demselben unveränderten Commit mit sichtbaren GitHub-Actions-Steps, Online-`npm ci`, `npm run ci` und Chromium/Firefox/WebKit.

Letzter vollständig untersuchter App-Actions-Lauf: **#2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`. Kein Repositorycode wurde ausgeführt. **v50, v51 und v52 sind daher nicht runnerverifiziert.**

Informelle UX-Proben davor zählen nicht als finale Release-Evidence.

## 2. Testprinzipien

- Entwickler erklärt nicht jeden Button vorab.
- persönliche Inhalte bleiben freiwillig.
- neutrale Testdaten für manipulierte Resume-/Importfälle.
- keine Passwörter/private Chats/Fotos als Testmaterial.
- jedes Problem bekommt Severity und reproduzierbare Notiz.
- geheime Inhalte werden bewusst bei App-/Tab-Wechsel getestet.
- Fokus-/Tastaturprobleme gelten als funktionale Accessibility-Funde.
- Restore-/Rollbacktests verwenden ausschließlich neutrale Testdaten.

## 3. Mindest-Testmatrix

| Session | Gruppe | Schwerpunkt |
|---|---:|---|
| G1 | 3–4 | kleiner Core-Abend / Direkt-Hub |
| G2 | 5–8 | Advanced + Social |
| G3 | 9–12 | Übergaben / Multi-Imposter |
| G4 | 6 / 8 / 12 / 16+ | Mafia |
| G5 | 1 unerfahrener Host + Gruppe | Creator |
| DWI | neutral | Word-Imposter 50/51, 200/201, Backup |
| HR2 | neutral | Hub Resume Guard v2 + v50-Ladequarantäne |
| BK51 | neutral | Complete Backup v51 / Forward Compatibility / Rollback |
| HR52 | neutral + 3–4 | sichere Hub-Current-Runden / Truth-Dare Usage-Pools |
| PN1 | klein/mittel | Smart Party Night 1 |
| PN2 | mittel | Smart Party Night 2 |
| PN3 | groß | Smart Party Night 3 |

## 4. Geräte-Mindestmatrix

### Android

- aktuelles reales Android + Chrome
- Browser und installierte PWA
- Offline-Neustart
- Appwechsel/Sperrbildschirm bei Timer
- TalkBack-Smoke

### iPhone

- reales iPhone + Safari
- Add to Home Screen
- Safe Areas / Tastatur
- Appwechsel/Sperrbildschirm
- VoiceOver-Smoke

### Tablet/iPad

- reale Tabletklasse
- Hoch-/Querformat
- private Übergaben / Advanced / Quick / Creator

### Desktop

- Tastatur ohne Maus
- 200-%-Zoom
- Chromium + weiterer Browser
- Modal-/Fokuspfade

## 5. Preflight-Protokoll

```text
Test-ID:
Datum:
App-Version:
Commit:
Cachegeneration:
Gerät/OS/Browser:
Installiert oder Browser:
Online/Offline:
Gruppengröße:
Beobachter:
Bekannte P0/P1-Funde:
```

## 6. G1 – 3–4 Personen

- Word Imposter komplett
- Wahrheit oder Pflicht inklusive Skip
- **Wahrheit/Pflicht während geöffneter Karte reloaden und exakt dieselbe Karte fortsetzen**
- Scharade Pause/Resume/Appwechsel
- Reload während Session
- Hub Resume fortsetzen
- Wrong Answers erklären lassen
- Verlauf prüfen

Beobachten: Setup, Freiwilligkeit, Privacy, Timer, Resume, Exact-once, Fokus.

## 7. G2 – 5–8 Personen

- Zwei Wahrheiten/eine Lüge
- Question Imposter
- Location Spy
- optional Never Have / Would Rather
- App-/Tab-Wechsel bei privaten Mechaniken
- neutral manipulierten Advanced-Snapshot verwerfen
- Advanced-Modal per Tastatur

## 8. G3 – 9–12 Personen

### Word Imposter

- mehrere Imposter
- vollständige Reveal-Kette
- geheime Abstimmung + Stichwahl
- mindestens 20 reale Runden Fairnessprotokoll
- sequenzielles Teilvoting speichern/reloaden
- nicht-sequenziellen Voting-Snapshot verwerfen

### Hub

- Paranoia-Secret-Cover
- Scharade/Tabu Geräteweitergabe
- Hot Potato reale Dauer

## 9. DWI – Word-Imposter-Datengrenzen

Auf v52-RC bestätigen, obwohl Vertrag in v48 eingeführt wurde:

1. 50 Kategorien akzeptiert.
2. 51 Kategorien abgelehnt, keine Kürzung.
3. Bestandsdaten nach Ablehnung unverändert.
4. 200 Begriffe akzeptiert.
5. 201 Begriffe abgelehnt.
6. UI erklärt 50 und 2–200.
7. valide Backupgröße akzeptiert.
8. >1,5 MB UTF-8 abgelehnt.
9. Multibyte-Datei nach Bytes bewertet.
10. korrupter lokaler Übergrößen-State fail-safe verworfen.

## 10. HR2 – Hub Resume Guard v2 / v50

Mit neutralen Zuständen:

1. gültige normale Hub-Session → Resume bleibt.
2. gültiger laufender Scharade-Timer → Resume bleibt.
3. Truth/Dare + eingeschleuster Scharade-Timer → verworfen.
4. Scharade + Tabu-Timer → verworfen.
5. `running` + `remainingMs = 0` → verworfen.
6. bereits gerenderte Resume-Karte → verschwindet bei ungültigem Snapshot.
7. während der Guard-Ladephase: Resume-Karte `aria-busy`, Buttons deaktiviert.
8. kein Resume-Klick möglich, bevor Validierung abgeschlossen ist.
9. nach erfolgreicher Validierung werden Buttons wieder freigegeben.
10. Guard-Ladefehler bleibt fail-closed.
11. gültige Session wird nicht mutiert.
12. dasselbe offline in installierter PWA.

## 11. BK51 – Complete Backup v51

Nur neutrale Testdaten verwenden. Vor jedem Fall Bestandswerte dokumentieren.

1. Gesamtexport enthält registrierte Hub-/Word-/Creator-Daten.
2. regulärer Restore ersetzt managed Bestandsdaten vollständig.
3. unbekannter Namespace überlebt Restore unverändert.
4. zukünftige Version eines heute bekannten Keys überlebt Restore unverändert.
5. Backup mit nicht registriertem Future-Key wird vor Mutation abgelehnt.
6. managed Key mit falscher interner Storage-Version wird vor Mutation abgelehnt.
7. Klartext statt JSON wird vor Mutation abgelehnt.
8. primitive JSON-Wurzel wird vor Mutation abgelehnt.
9. >1,5-MB-Datei wird vor Mutation abgelehnt.
10. Write-/Quota-Fehler stellt managed Werte wieder her.
11. Future-/unknown Daten bleiben auch im Rollback unverändert.
12. „Alle lokalen Daten löschen“ entfernt dagegen sämtliche `secret-circle-*`-Reste.
13. Export→Restore in installierter v52-PWA online und nach Offline-Neustart prüfen.
14. nach PWA-Upgrade aus älterem Stand BK51 erneut durchführen.

## 12. HR52 – Hub Round Resume v52

Mit neutralen Karten/Spielern und anschließend real in G1:

1. Wahrheit auswählen und Karteninhalt notieren.
2. gespeicherten Active-State prüfen: `current` enthält nur eine sichere Referenz, keinen beliebigen Secret-Text.
3. Seite reloaden; Spiel darf nicht automatisch offen erscheinen, sondern über normalen Resume-Einstieg fortgesetzt werden.
4. Session fortsetzen; **dieselbe Wahrheit** muss wieder angezeigt werden.
5. Runde abschließen; `current` muss vor der nächsten Runde gelöscht sein.
6. neue Runde: Pflicht wählen und notieren.
7. Wahrheit und Pflicht dürfen denselben numerischen Kartenindex unabhängig verwenden; eine Wahrheit darf die gleich nummerierte Pflicht nicht blockieren.
8. Prompt-Core-Spiel starten, Karte öffnen, reloaden, fortsetzen → dieselbe sichere Karte.
9. Choice-Core-Spiel entsprechend prüfen.
10. manipulierte/out-of-range Current-Referenz → wird verworfen; App bleibt bedienbar.
11. Paranoia-Frage öffnen, reloaden, fortsetzen → geheime Frage darf **nicht** über den v52-Current-Pfad automatisch offen erscheinen.
12. globales Skip während sicherer Runde → alte Current-Referenz darf nicht in die nächste Runde getragen werden.
13. dieselben Fälle offline in installierter v52-PWA.

**HR52 PASS** bedeutet Kontinuität für sichere Karten, ohne die Privacy-Grenze für geheime Karten aufzuweichen.

## 13. G4 – Mafia

- mehrere Gruppengrößen
- Classic/Extended Packs
- Rollenanzahl
- Moderator-/Nachtprivacy
- Arzt/Detektiv/Beschützer
- Alive-Zustand
- Dorf-/Mafia-Sieg
- manipulierte Resume-Zustände

## 14. G5 – Creator

Unerfahrene Person erstellt ohne Entwicklerhilfe ein eigenes Spiel.

Prüfen: Template-Radiogroup, Wizard-Fokus, Hilfe-Modal, Packs/Inhalte, Speichern, Hub-Integration, Editieren/Kopieren/Löschen, Export/Import.

## 15. PN1–PN3 – Smart Party Night

- PN1 ca. 30 Minuten
- PN2 ca. 45–60 Minuten
- PN3 ca. 60–90 Minuten

Prüfen: Gruppengröße, Wiederholungen, Übergänge, Dauer, History und Abbruch.

## 16. PWA-Update-Test

Mit mindestens zwei echten älteren Installationen:

1. neutrale lokale Daten + aktive Session.
2. v52/RC bereitstellen.
3. Update zunächst verschieben.
4. aktive Session fortsetzen.
5. bewusst aktualisieren.
6. Offline-Neustart.
7. Daten/Guards/A11y prüfen.
8. DWI + HR2 + BK51 + HR52 offline prüfen.
9. Future-Testkey vor Upgrade anlegen und nach Upgrade/Restore auf Unverändertheit prüfen.

## 17. Rollback-Test

Auf HTTPS-Staging:

- RC bereitstellen
- Fehlerstand oder isolierten Rollbackpfad nutzen
- korrigierten Stand mit neuer Cachegeneration deployen
- Daten erhalten
- Offline-Core vollständig
- BK51-Daten-/Forward-Compatibility-Grenzen erhalten
- HR52 sichere Current-Runden weiter kompatibel
- alter funktionierender Core darf nicht durch fehlgeschlagene Promotion zerstört werden

## 18. Accessibility-Realtest

Hub, Advanced, Quick, Creator sowie allgemein 200-%-Zoom, 320 CSS px, VoiceOver/TalkBack, Reduced Motion, Touchziele und Fokuspfade real prüfen. Resume-Ladequarantäne und HR52-Restore dürfen keine unverständlichen Fokuszustände erzeugen.

## 19. Bug-Severity

### Critical

- Datenverlust ohne Recovery
- Restore löscht unbekannte/zukünftige Daten ohne explizite Löschbestätigung
- private Informationen unerwartet offengelegt
- weitreichender Securityfehler
- Hauptzielgruppe kann App nicht nutzen

### High

- Core-Spiel nicht abschließbar
- falscher Sieger/Score
- Resume/Timer systematisch kaputt
- geöffnete sichere Runde wird nach Reload durch eine andere Karte ersetzt
- Truth/Dare Usage-Pools blockieren sich gegenseitig
- Secret-Current wird nach Reload automatisch offengelegt
- Import verändert Daten trotz Ablehnung
- Rollback stellt Bestandsdaten nicht wieder her
- wichtiger Accessibilityflow blockiert

## 20. Testbericht

```text
Test-ID:
Datum:
Commit:
Cache:
Gerät/OS/Browser:
Teilnehmerzahl:
Spiele/Flows:
Dauer:
Ohne Entwicklerhilfe abgeschlossen: ja/nein
Critical:
High:
Medium:
Low:
Contentfunde:
Accessibilityfunde:
PWA/Resume-Funde:
Privacy-/Secret-Funde:
Data-/Import-/Restore-Funde:
Retest nötig: ja/nein
```

## 21. Beta-Freigaberegel

Vor `REAL USER / DEVICE PASS`:

- [ ] G1–G5 abgeschlossen
- [ ] DWI abgeschlossen
- [ ] HR2 inklusive v50-Ladequarantäne abgeschlossen
- [ ] BK51 vollständig abgeschlossen
- [ ] HR52 vollständig abgeschlossen
- [ ] PN1–PN3 abgeschlossen
- [ ] Android / iPhone / Tablet real
- [ ] VoiceOver / TalkBack / 200-%-Zoom real
- [ ] zwei echte PWA-Upgrades auf v52/RC
- [ ] Rollback-Test bestanden
- [ ] mindestens ein realer Nachweis pro Core-Spiel
- [ ] keine offenen Critical/High Bugs
- [ ] Retests aller gefixten Critical/High-Funde

Bis dahin bleibt die **reale Durchführung offen** und der öffentliche Release **NO_GO**.