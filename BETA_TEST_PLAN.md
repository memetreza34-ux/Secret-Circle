# Secret Circle – Beta-, Geräte- und Gruppentestplan

Stand: 26. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v53` / `secret-circle-v53-staging`**

## 1. Eintrittskriterium

Finale RC-Beta erst auf demselben unveränderten Commit mit sichtbaren GitHub-Actions-Steps, Online-`npm ci`, `npm run ci` und Chromium/Firefox/WebKit.

Letzter vollständig untersuchter App-Actions-Lauf: **#2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`. Kein Repositorycode wurde ausgeführt. **v50–v53 sind nicht runnerverifiziert.**

Vorhandener Code oder vorhandene Tests sind kein realer PASS.

## 2. Testprinzipien

- neutrale Testdaten für manipulierte Resume-/Importfälle
- keine Passwörter, privaten Chats, Fotos oder unnötig personenbezogenen Daten als Testmaterial
- private Inhalte bewusst bei App-/Tab-Wechsel und Reload testen
- jedes Problem mit Severity und reproduzierbaren Schritten dokumentieren
- Fokus-/Tastaturprobleme als funktionale Accessibility-Funde behandeln
- Restore-/Rollbacktests nur mit neutralen Testdaten

## 3. Mindest-Testmatrix

| ID | Gruppe | Schwerpunkt |
|---|---:|---|
| G1 | 3–4 | kleiner Core-Abend / Direkt-Hub |
| G2 | 5–8 | Advanced + Social |
| G3 | 9–12 | Übergaben / Multi-Imposter |
| G4 | 6 / 8 / 12 / 16+ | Mafia |
| G5 | 1 unerfahrener Host + Gruppe | Creator |
| DWI | neutral | Word-Imposter Datengrenzen |
| HR2 | neutral | Hub Resume Guard v2 + v50-Ladequarantäne |
| BK51 | neutral | Complete Backup / Forward Compatibility / Rollback |
| HR52 | neutral + G1 | sichere Hub-Current-Runden / Truth-Dare-Pools |
| PR53 | neutral + G1 | Paranoia Resume + Privacy nach Frage/Münzwurf |
| PN1–PN3 | klein bis groß | Smart Party Night |

## 4. Geräte-Mindestmatrix

- Android + Chrome: Browser und installierte PWA, Offline-Neustart, Appwechsel/Sperrbildschirm, TalkBack-Smoke
- iPhone + Safari: Add to Home Screen, Safe Areas, Offline-Neustart, VoiceOver-Smoke
- Tablet/iPad: Hoch-/Querformat, private Übergaben, Advanced/Quick/Creator
- Desktop: Tastatur ohne Maus, 200-%-Zoom, Chromium + weiterer Browser

## 5. Core-Gruppentests

### G1 – 3–4 Personen

- Word Imposter komplett
- Wahrheit oder Pflicht inklusive Skip und HR52-Reload
- Paranoia inklusive PR53
- Scharade Pause/Resume/Appwechsel
- Wrong Answers erklären lassen
- Verlauf/Statistik prüfen

### G2 – 5–8 Personen

- Zwei Wahrheiten/eine Lüge
- Question Imposter
- Location Spy
- Never Have / Would Rather
- Advanced-Snapshot-Manipulation verwerfen
- Advanced-Modal per Tastatur

### G3 – 9–12 Personen

- Multi-Imposter inklusive Teilvoting/Resume
- Paranoia Secret Cover
- Scharade/Tabu Geräteweitergabe
- Hot Potato reale Dauer 10–25 s

### G4 / G5

- Mafia mit mehreren Gruppengrößen und Rollenpacks
- Creator komplett durch unerfahrene Person ohne Entwicklerhilfe

## 6. DWI – Word-Imposter-Datengrenzen

Auf dem aktuellen RC prüfen:

1. 50 Kategorien akzeptiert / 51 abgelehnt ohne Kürzung.
2. 200 Begriffe akzeptiert / 201 abgelehnt.
3. Ablehnung verändert Bestandsdaten nicht.
4. 1,5 MB UTF-8 nach Bytes, inklusive Multibyte-Datei.
5. korrupter lokaler Übergrößen-State wird fail-safe verworfen.
6. partielles Voting setzt beim nächsten tatsächlich offenen Wähler fort.
7. manipuliertes nicht-sequenzielles Voting wird verworfen.

## 7. HR2 – Hub Resume Guard v2 / v50

1. gültige normale Hub-Session bleibt fortsetzbar.
2. gültiger laufender Scharade-Timer bleibt fortsetzbar.
3. Cross-Mode-Timer und `running + remainingMs=0` werden verworfen.
4. stale Resume-Karte verschwindet bei ungültigem Snapshot.
5. während Guard-Prüfung: `aria-busy`, Resume-/Discard-Aktionen deaktiviert.
6. erst nach erfolgreicher Prüfung wieder bedienbar.
7. Guard-Ladefehler bleibt fail-closed.
8. dieselben Fälle offline in installierter PWA.

## 8. BK51 – Complete Backup

1. regulärer Export→Restore ersetzt nur managed aktuelle Daten.
2. unbekannter Future-Namespace bleibt unverändert.
3. zukünftige bekannte Version wie `secret-circle-party-hub-v2` bleibt unverändert.
4. Backup mit nicht registriertem Future-Key wird vor Mutation abgelehnt.
5. falsche interne Storage-Version, Klartext und primitive JSON-Wurzel werden vor Mutation abgelehnt.
6. >1,5 MB UTF-8 wird vor Mutation abgelehnt.
7. Write-/Quota-Fehler stellt managed Snapshot wieder her.
8. Future-/unknown Daten bleiben auch im Rollback unverändert.
9. explizite Komplettlöschung entfernt dagegen alle `secret-circle-*`-Reste.
10. nach Upgrade aus älterer installierter PWA erneut prüfen.

## 9. HR52 – sichere direkte Hub-Runden

1. Wahrheit öffnen → Reload → Resume → exakt dieselbe Karte.
2. Pflicht entsprechend.
3. Wahrheit und Pflicht dürfen denselben numerischen Index unabhängig verwenden.
4. Prompt-/Choice-Runde behält denselben sicheren Current-Inhalt.
5. ungültiger/out-of-range Current wird verworfen.
6. `next` und globales Skip löschen alten Current.
7. Secret-Modi werden nicht automatisch offen dargestellt.
8. offline in installierter v53-PWA wiederholen.

## 10. PR53 – Paranoia Resume / Privacy

1. Paranoia-Frage öffnen und Text notieren.
2. Active-State darf nur validierte Referenz/Phase enthalten, keinen frei eingebetteten Geheimtext.
3. Reload → Resume: Geheimfrage bleibt zunächst **verdeckt**.
4. bewusste Aktion „Geheime Frage anzeigen“ → **exakt dieselbe Frage**.
5. Münzwurf einmal ausführen und Ergebnis notieren.
6. Reload → Resume: Ergebnis bleibt zunächst verdeckt.
7. bewusste Ergebnisanzeige → **identisches vorheriges Münzwurf-Ergebnis**, kein neuer Zufallswurf.
8. Fokus-/Appverlust bei offener Frage verdeckt Inhalt automatisch.
9. Fokus-/Appverlust **nach Münzwurf/Auflösung** verdeckt Inhalt ebenfalls automatisch.
10. ungültige/out-of-range Paranoia-Referenz wird verworfen statt gerendert.
11. nächste Person / Skip löscht den privaten Rundenstatus.
12. dieselben Fälle offline in installierter v53-PWA.

**PR53 PASS** bedeutet Kontinuität ohne Auto-Reveal und ohne erneutes Randomisieren eines bereits entschiedenen Ergebnisses.

## 11. PWA-Update / Rollback

Mit mindestens zwei älteren real installierten Versionen:

1. neutrale lokale Daten + aktive Session anlegen.
2. v53/RC bereitstellen; Update zunächst verschieben.
3. aktive Session fortsetzen.
4. bewusst aktualisieren und offline neu starten.
5. DWI + HR2 + BK51 + HR52 + PR53 offline prüfen.
6. Rollback/Hotfix stets mit neuer Cachegeneration; lokale Daten erhalten.

## 12. Accessibility-Realtest

Hub, Advanced, Quick und Creator mit Tastatur, 200-%-Zoom/320 CSS px, VoiceOver, TalkBack, Reduced Motion und Touch testen. Private Reveal-/Resume-Zustände dürfen assistiver Technik keine verdeckten Secrets unerwartet exponieren.

## 13. Bug-Severity

**Critical:** Datenverlust ohne Recovery, unerwartete Offenlegung privater Inhalte, weitreichender Securityfehler, App für Hauptzielgruppe unbenutzbar.

**High:** Core-Spiel nicht abschließbar, falscher Sieger/Score, systematisch kaputtes Resume/Timer-Verhalten, sichere Karte nach Reload ersetzt, bereits gefällter Paranoia-Münzwurf neu randomisiert, Secret nach Reload/Fokusverlust unerwartet offen, Import verändert Daten trotz Ablehnung, Rollback scheitert, wichtiger Accessibilityflow blockiert.

## 14. Beta-Freigaberegel

Vor `REAL USER / DEVICE PASS`:

- [ ] G1–G5 abgeschlossen
- [ ] DWI abgeschlossen
- [ ] HR2 abgeschlossen
- [ ] BK51 abgeschlossen
- [ ] HR52 abgeschlossen
- [ ] PR53 abgeschlossen
- [ ] PN1–PN3 abgeschlossen
- [ ] Android / iPhone / Tablet real
- [ ] VoiceOver / TalkBack / 200-%-Zoom real
- [ ] zwei echte PWA-Upgrades auf v53/RC
- [ ] Rollback-Test bestanden
- [ ] mindestens ein realer Nachweis pro Core-Spiel
- [ ] keine offenen Critical/High Bugs
- [ ] Retests aller gefixten Critical/High-Funde

Bis dahin bleibt die reale Durchführung offen und der öffentliche Release **NO_GO**.