# Secret Circle – Beta-, Geräte- und Gruppentestplan

Stand: 26. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v51` / `secret-circle-v51-staging`**  
Core Source Hardening: **15/15 PREPARED**  
Accessibility Source Hardening: **PREPARED**  
Word-Imposter Data/Resume Hardening: **PREPARED**  
Hub Resume Guard v2 + v50-Ladequarantäne: **PREPARED**  
Complete Backup v51 Hardening: **PREPARED**

## 1. Eintrittskriterium

Finale RC-Beta erst nach demselben unveränderten Commit mit:

- sichtbaren GitHub-Actions-Steps
- Online-`npm ci`
- `npm run ci`
- Chromium E2E
- Chromium / Firefox / WebKit

Letzter vollständig untersuchter App-Actions-Lauf: **#2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`. Kein Repositorycode wurde ausgeführt. **v50 und v51 sind daher ebenfalls nicht runnerverifiziert.**

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
- Future-Key-Tests dokumentieren vorher/nachher exakt dieselben unbekannten Werte.

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
| PN1 | klein/mittel | Smart Party Night 1 |
| PN2 | mittel | Smart Party Night 2 |
| PN3 | groß | Smart Party Night 3 |

## 4. Geräte-Mindestmatrix

### Android

- aktuelles reales **Android** + Chrome
- Browser und installierte PWA
- Offline-Neustart
- Appwechsel/Sperrbildschirm bei Timer
- **TalkBack**-Smoke

### iPhone

- reales **iPhone** + Safari
- Add to Home Screen
- Safe Areas / Tastatur
- Appwechsel/Sperrbildschirm
- **VoiceOver**-Smoke

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

Auf v51-RC bestätigen, obwohl Vertrag in v48 eingeführt wurde:

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
7. **während der Guard-Ladephase: Resume-Karte `aria-busy`, Buttons deaktiviert.**
8. kein Resume-Klick möglich, bevor Validierung abgeschlossen ist.
9. nach erfolgreicher Validierung einer gültigen Session werden Buttons wieder freigegeben.
10. Guard-Ladefehler bleibt fail-closed.
11. gültige Session wird nicht mutiert.
12. dasselbe offline in installierter PWA.

## 11. BK51 – Complete Backup v51

Nur neutrale Testdaten verwenden. Vor jedem Fall Bestandswerte dokumentieren.

1. Gesamtexport enthält die aktuell vorhandenen registrierten Hub-/Word-/Creator-Daten.
2. regulärer Restore ersetzt die managed v1/v7-Bestandsdaten vollständig und lädt sauber neu.
3. vorhandener unbekannter Namespace, z. B. `secret-circle-party-future-feature-v99`, überlebt den Restore unverändert.
4. vorhandene zukünftige Version eines heute bekannten Keys, z. B. `secret-circle-party-hub-v2`, überlebt den Restore unverändert.
5. Backup, das `secret-circle-party-hub-v2` schreiben will, wird vor Mutation abgelehnt.
6. managed `secret-circle-party-hub-v1` mit syntaktisch gültigem `{ "version": 999, ... }` wird vor Mutation abgelehnt.
7. Klartext statt JSON wird vor Mutation abgelehnt.
8. primitive JSON-Wurzel wird vor Mutation abgelehnt.
9. >1,5-MB-Datei wird vor Mutation abgelehnt.
10. simulierter/quota-bedingter Schreibfehler stellt alle vorherigen managed Werte wieder her.
11. Future-/unknown Daten bleiben auch während eines Rollbacks unverändert.
12. ausdrücklich bestätigte Funktion „Alle lokalen Daten löschen“ entfernt dagegen sämtliche `secret-circle-*`-Reste.
13. Export→Restore in installierter v51-PWA online und nach Offline-Neustart prüfen.
14. nach PWA-Upgrade aus einem älteren Stand BK51 erneut durchführen.

Ein BK51-PASS erfordert **keinen** künstlich erfundenen Future-Migrationssupport; er beweist nur, dass der heutige Restore Daten neuerer/unbekannter Versionen nicht besitzt oder zerstört.

## 12. G4 – Mafia

- mehrere Gruppengrößen
- Classic/Extended Packs
- Rollenanzahl
- Moderator-/Nachtprivacy
- Arzt/Detektiv/Beschützer
- Alive-Zustand
- Dorf-/Mafia-Sieg
- manipulierte Resume-Zustände

## 13. G5 – Creator

Unerfahrene Person erstellt ohne Entwicklerhilfe ein eigenes Spiel.

Prüfen:

- Template-Radiogroup Tab + Pfeile/Home/End
- Wizard-Fokus
- Hilfe-Modal + Fokus-Trap/Rückkehr
- Packs/Inhalte
- Speichern
- im Hub finden
- Editieren/Kopieren/Löschen
- Export/Import

## 14. PN1–PN3 – Smart Party Night

- PN1 ca. 30 Minuten
- PN2 ca. 45–60 Minuten
- PN3 ca. 60–90 Minuten

Prüfen: Gruppengröße, Wiederholungen, Übergänge, Dauer, History und Abbruch.

## 15. PWA-Update-Test

**PWA-Update-Test** mit mindestens zwei echten älteren Installationen:

1. neutrale lokale Daten + aktive Session.
2. v51/RC bereitstellen.
3. Update zunächst verschieben.
4. aktive Session fortsetzen.
5. bewusst aktualisieren.
6. Offline-Neustart.
7. Daten/Guards/A11y prüfen.
8. DWI + HR2 + BK51 offline prüfen.
9. Future-Testkey vor Upgrade anlegen und nach Upgrade/Restore auf Unverändertheit prüfen.

## 16. Rollback-Test

**Rollback-Test** auf HTTPS-Staging:

- RC bereitstellen
- Fehlerstand oder isolierten Rollbackpfad nutzen
- korrigierten Stand mit neuer Cachegeneration deployen
- Daten erhalten
- Offline-Core vollständig
- BK51-Daten-/Forward-Compatibility-Grenzen erhalten
- alter funktionierender Core darf nicht durch fehlgeschlagene Promotion zerstört werden

## 17. Accessibility-Realtest

### Hub

- Skip-Link
- Bereichsüberschriften
- Detail-/Spielmodal Fokus-Trap
- Resume-Ladequarantäne darf nicht zu unverständlichem Fokus führen

### Advanced

- Modal / Hintergrund `inert`
- private Reveals

### Quick

- Fokus-Recovery nach dynamischem DOM-Austausch

### Creator

- Wizard-Fokus
- Radiogroup
- Hilfe-Modal

### Allgemein

- 200-%-Zoom / große Schrift / 320 CSS px
- VoiceOver / TalkBack
- Reduced Motion
- Touchziele
- keine kritische Information nur über Farbe

## 18. Bug-Severity

### Critical

- Datenverlust ohne Recovery
- heutiger Restore löscht unbekannte/zukünftige Daten ohne explizite Löschbestätigung
- private Informationen unerwartet offengelegt
- weitreichender Securityfehler
- Hauptzielgruppe kann App nicht nutzen

### High

- Core-Spiel nicht abschließbar
- falscher Sieger/Score
- Resume/Timer systematisch kaputt
- Import verändert Daten trotz Ablehnung
- Restore akzeptiert falsche Storage-Version eines managed Keys
- Rollback stellt managed Bestandsdaten nicht wieder her
- wichtiger Accessibilityflow blockiert
- ungültige Resume-Session kann vor Guard-Validierung gestartet werden

## 19. Testbericht

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

## 20. Beta-Freigaberegel

Vor `REAL USER / DEVICE PASS`:

- [ ] G1–G5 abgeschlossen
- [ ] DWI abgeschlossen
- [ ] HR2 inklusive v50-Ladequarantäne abgeschlossen
- [ ] BK51 vollständig abgeschlossen
- [ ] PN1–PN3 abgeschlossen
- [ ] Android / iPhone / Tablet real
- [ ] VoiceOver / TalkBack / 200-%-Zoom real
- [ ] zwei echte PWA-Upgrades auf v51/RC
- [ ] Rollback-Test bestanden
- [ ] mindestens ein realer Nachweis pro Core-Spiel
- [ ] keine offenen Critical/High Bugs
- [ ] Retests aller gefixten Critical/High-Funde

Bis dahin bleibt die **reale Durchführung offen** und der öffentliche Release **NO_GO**.

Release **NO_GO** bedeutet: vorhandene Source-Verträge sind kein Ersatz für reale Evidence.