# Secret Circle – Beta-, Geräte- und Gruppentestplan

Stand: 26. August 2026  
Status: **PREPARED – reale Durchführung offen**  
Offline-Core: **`secret-circle-v55` / `secret-circle-v55-staging`**

## 1. Eintrittskriterium

Finale RC-Beta erst auf demselben unveränderten Commit mit sichtbaren GitHub-Actions-Steps, Online-`npm ci`, `npm run ci` und Chromium/Firefox/WebKit.

Letzter vollständig untersuchter App-Actions-Lauf: **#2787 auf v49**, Run ID `32871536761`, Job `97879489858`, Head `a9ad91389ff9e966af432b0a77103ddc0960709d`, `steps: null` / `steps: []`. Kein Repositorycode wurde ausgeführt. **v50–v55 sind nicht runnerverifiziert.**

## 2. Mindest-Testmatrix

| ID | Schwerpunkt |
|---|---|
| G1–G5 | reale Gruppen / Core / Advanced / Creator |
| DWI | Word-Imposter Datengrenzen und Voting-Resume |
| HR2 | Hub Resume Guard v2 + v50-Ladequarantäne |
| BK51 | Complete Backup / Forward Compatibility / Rollback |
| HR52 | sichere Hub-Current-Runden / Truth-Dare-Pools |
| PR53 | Paranoia Resume + Privacy |
| PT54 | Hot-Potato-/Word-Chain-Pre-Timer-Resume |
| **AD55** | Advanced Result-/Winner-/Resume-Integrität und Session-Ersatz |
| PN1–PN3 | Smart Party Night |

## 3. DWI / HR2 / BK51 / HR52 / PR53 / PT54

Die bestehenden Spezialgates bleiben unverändert verbindlich:

- DWI: 50/51 Kategorien, 200/201 Begriffe, 1,5 MB UTF-8, Import-Rollback, sequenzielles Voting-Resume.
- HR2: Cross-Mode-/0-ms-Timer verwerfen; Resume-Loader fail-closed.
- BK51: managed-only Restore/Rollback; Future-Daten erhalten; falsche Versionen vor Mutation ablehnen.
- HR52: Wahrheit/Pflicht/Prompt/Choice nach Reload identisch; Truth/Dare-Pools unabhängig.
- PR53: Paranoia gleiche Frage/gleiches Ergebnis ohne Auto-Reveal; Blur-Concealment.
- PT54: Hot-Potato-Aufgabe/Wortketten-Buchstabe vor Timerstart identisch; Timerstart löscht `current` und übernimmt denselben Wert in den Timer-Snapshot.

## 4. AD55 – Advanced Integrity

Mit neutralen Testdaten:

### Location Spy

- [ ] gültiger Vote-Result-State bleibt fortsetzbar.
- [ ] gültiger Guess-Result-State bleibt fortsetzbar.
- [ ] Result-State mit **Vote und Guess gleichzeitig** wird vor Resume verworfen.
- [ ] gespeicherter Active-Key ist danach entfernt und die Play-Ebene bleibt geschlossen.

### Mafia

- [ ] bei 8 Personen/Klassisch exakt 2 Mafia, 1 Detektiv, 1 Arzt, 4 Dorfbewohner.
- [ ] gültiger laufender Mafia-State bleibt fortsetzbar.
- [ ] nicht-fertiger Stage mit bereits eindeutigem Dorf-/Mafia-Sieger wird verworfen.
- [ ] `stage=finished` benötigt einen Winner, der exakt zur Alive-Verteilung passt.
- [ ] fertige Mafia-Runde direkt über „Session beenden“ speichern → genau 1 History-Runde.
- [ ] denselben Session-ID-Stand erneut anbieten/speichern → kein zweiter History-/Stats-Eintrag.

### Gespeicherte Advanced-Session ersetzen

- [ ] „Neue Session beginnen“ zeigt eine explizite Verwerfbestätigung.
- [ ] Abbrechen erhält alte Session-ID und Rundenzustand unverändert.
- [ ] Bestätigen erzeugt erst nach erfolgreichem Entfernen des Altstands eine neue Session-ID.
- [ ] simuliertes `localStorage.removeItem`-Fehlschlagen → alte Session bleibt, keine neue Session startet, Fehlermeldung sichtbar.

### Privacy / Resume

- [ ] Question Imposter / Location Spy / Mafia geöffnete Geheimkarten werden nach Reload wieder geschlossen.
- [ ] Mafia-Moderatorübersicht verlangt nach Reload erneut Bestätigung.
- [ ] Two Truths private Eingabe, Mafia-Moderatorübersicht, Nachtphase und Detektiv-Info werden bei Fokusverlust verdeckt.
- [ ] dieselben AD55-Fälle soweit anwendbar offline in installierter v55-PWA.

Source-Verträge: `advanced-resume-guard.js` v4, `party-advanced-runner.js`, `tests/advanced-resume-guard.test.js`, neun kritische Advanced-E2Es und `scripts/advanced_integrity_audit.py`.

## 5. Reale Gruppen / Geräte

- [ ] G1 3–4 Personen ≥60 min
- [ ] G2 5–8 Personen ≥90 min
- [ ] G3 9–12 Personen ≥90 min
- [ ] G4 Mafia mehrere Gruppengrößen
- [ ] G5 Creator mit unerfahrener Person
- [ ] Android / iPhone / Tablet
- [ ] VoiceOver / TalkBack / 200-%-Zoom / Tastatur / Touch
- [ ] mindestens ein realer Nachweis pro Core-Spiel
- [ ] PN1–PN3

## 6. PWA Update / Rollback

- [ ] mindestens zwei ältere installierte Versionen auf v55/RC aktualisieren
- [ ] aktive Sessions und lokale Daten erhalten
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 offline prüfen
- [ ] Rollback/Hotfix mit neuer Cachegeneration

## 7. Beta-Freigabe

Vor `REAL USER / DEVICE PASS` müssen G1–G5, DWI, HR2, BK51, HR52, PR53, PT54, **AD55**, PN1–PN3, reale Geräte/Accessibility, zwei PWA-Upgrades und Rollback abgeschlossen sein. Keine offenen Critical/High Bugs.

Bis dahin bleibt die reale Durchführung offen und der öffentliche Release **NO_GO**.