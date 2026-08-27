# Secret Circle – Umgebungen und Staging-Vertrag

Stand: 27. August 2026  
Status: **PREPARED – konkrete HTTPS-Staging-URL offen**  
Offline-Core: **`secret-circle-v59` / `secret-circle-v59-staging`**

## 1. Ziel

Secret Circle besitzt kein klassisches Backend, benötigt aber getrennte Umgebungen. `localStorage`, Service Worker, Cache Storage und installierte PWAs sind originabhängig.

**Local → CI/Test → HTTPS-Staging → Release Candidate → Production**

## 2. Local / CI

Local ist kein Releasebeweis. CI benötigt sichtbare Runner-Steps, Checkout, Online-`npm ci`, `npm run ci` und Cross-Browser auf demselben RC. `steps: []` bleibt kein Code-Test.

## 3. HTTPS-Staging

Staging ist der erste echte Hosting-/Service-Worker-/Installationsraum und muss eine getrennte Origin besitzen.

## 4. Aktueller Cachevertrag

- aktiv: `secret-circle-v59`
- staging: `secret-circle-v59-staging`

Historie: v49 Hub Resume Guard → v50 fail-closed Loader → v51 Complete Backup → v52 sichere Current-Runden → v53 Paranoia Resume/Privacy → v54 Pre-Timer Resume → v55 Advanced Integrity → v56 Quick Session Replacement → v57 Quick-Family Timer-Restzeit-Resume → v58 BFCache Timer Resume → **v59 Background Timer Pause**.

## 5. Automatisierter HTTPS-Smoke

Der HTTPS-Netzwerkvertrag wird mit **`scripts/staging_smoke.py`** geprüft; die lokalen/deployten PWA-Head-Metadaten werden zusätzlich durch **`tests/pwa-head-metadata.test.js`** geschützt.

Staging:

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v59
```

Production:

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v59 --production
```

Der Netzwerk-Smoke beweist nicht Installation, Offline-Neustart, Update, Resume, Privacy oder reale Gerätefunktion.

## 6. Manueller Staging-Smoke

Mindestens:

- Service Worker / Installation / Offline-Neustart
- Hub/Word Imposter/Advanced/Quick/Creator/Privacy + Query-Routen offline
- DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56
- **QT57 Reload:** laufender Quick-Family-Timer → Reload → Resume → Restzeit statt voller Dauer
- **BF58 BFCache:** History/BFCache-Rückkehr führt einen passenden Timer kontrolliert in den normalen Resume-Pfad
- **BG59 Hidden:** laufender Quick-Family-Timer → App/Tab in Hintergrund → Pause-UI erscheint und Restzeit bleibt stehen
- **BG59 Visible:** Rückkehr zur sichtbaren App startet den Timer nicht selbst; erst „Fortsetzen“ lässt die Zeit weiterlaufen
- **BG59 Screen Lock:** reales iOS-/Android-Gerät sperren/entsperren; keine unsichtbar verbrauchte Timerzeit
- QT57/BF58/BG59 repräsentativ in Quick/Mega/Viral/Creator prüfen
- Timer-Store `secret-circle-party-quick-timers-v1` bleibt promptfrei und Teil des 17-Key-Backupvertrags
- QR56 Same-/Cross-Game Replacement weiter prüfen
- `quick-loader.js` v7 lädt Replacement Guard vor der jeweiligen Engine
- Advanced Secret Resume + Moderator-/Nachtprivacy
- Updatebanner + aktive Session
- Accessibility-/Fokuspfade

## 7. Release Candidate / Production

Ein RC wird durch unveränderten Commit, Tag, App-Version, Cachegeneration, Staging-Origin und Freeze-Zeitpunkt definiert. Production darf nicht der erste echte Service-Worker-, Resume-, Privacy-, Timer-Lifecycle- oder Restore-Test sein.

## 8. Datenisolation

Local/Staging verwenden neutrale Testdaten. Future-Daten-Erhalt, sichere Hub-Current-/Pre-Timer-Werte, Advanced-v55-Integrität, v56-Quick-Replacement, v57-Timer-Restzeit, v58-BFCache und v59-Background-Pause werden getrennt geprüft.

## 9. Rollbackprobe

Version A installieren → neutrale Daten/aktive Session → RC B aktivieren → Rollback/Hotfix C mit neuer Cachegeneration → Daten erhalten → Offline-Neustart + HTTP-Smoke → Evidence dokumentieren.

## 10. Environment-Nachweis

```text
CI run URL/id:
Staging URL/commit/cache:
Staging smoke result:
RC commit/cache:
Production URL/commit/cache:
Production smoke result:
DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57 / BF58 / BG59 evidence:
Rollback tested from/to:
Evidence reference:
```

## 11. Release-Gate

Vor `ENVIRONMENT / STAGING PASS`:

- [ ] getrennte HTTPS-Staging-/Production-Origin
- [ ] Provider-/Log-/Datenschutzentscheidung dokumentiert
- [ ] Staging-Smoke grün
- [ ] manueller PWA-Smoke
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57 / BF58 / **BG59** real bestätigt
- [ ] Upgrade aus mindestens zwei real installierten Altständen
- [ ] Rollbackprobe
- [ ] derselbe freigegebene RC für Production

Bis zu realer Evidence bleibt Staging **OPEN / NO_GO**.