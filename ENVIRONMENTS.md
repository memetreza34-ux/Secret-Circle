# Secret Circle – Umgebungen und Staging-Vertrag

Stand: 29. August 2026  
Status: **PREPARED – konkrete HTTPS-Staging-URL offen**  
Offline-Core: **`secret-circle-v63` / `secret-circle-v63-staging`**

## 1. Ziel

Secret Circle besitzt kein klassisches Backend, benötigt aber getrennte Umgebungen. `localStorage`, Service Worker, Cache Storage und installierte PWAs sind originabhängig.

**Local → CI/Test → HTTPS-Staging → Release Candidate → Production**

## 2. Local / CI

Local ist kein Releasebeweis. CI benötigt sichtbare Runner-Steps, Checkout, Online-`npm ci`, `npm run ci` und Cross-Browser auf demselben RC. `steps: []` bleibt kein Code-Test.

## 3. HTTPS-Staging

Staging ist der erste echte Hosting-/Service-Worker-/Installationsraum und muss eine getrennte Origin besitzen.

## 4. Aktueller Cachevertrag

- aktiv: `secret-circle-v63`
- staging: `secret-circle-v63-staging`

Historie: v49 Hub Resume Guard → v50 fail-closed Loader → v51 Complete Backup → v52 sichere Current-Runden → v53 Paranoia → v54 Pre-Timer → v55 Advanced Integrity → v56 Quick Replacement → v57 Timer-Restzeit → v58 BFCache → v59 Background Pause → v60 Hidden Snapshot → v61 Wave-1-Quiz → v62 Wave-1-Imposter → **v63 Wave-1-Writing**.

## 5. Automatisierter HTTPS-Smoke

Der HTTPS-Netzwerkvertrag wird mit **`scripts/staging_smoke.py`** geprüft; PWA-Head-Metadaten zusätzlich durch **`tests/pwa-head-metadata.test.js`**.

Staging:

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v63
```

Production:

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v63 --production
```

## 6. Manueller Staging-Smoke

Mindestens:

- Service Worker / Installation / Offline-Neustart
- Hub/Word Imposter/Advanced/Quick/Creator/Privacy + Query-Routen offline
- bestehende Spezialgates DWI bis HS60
- Wave-1 Quiz und Imposter weiterhin online/offline
- **Wave 1 Writing / v63:** Satzduell und Wer hat das geschrieben? sichtbar als Labs
- beide Writing-Modi starten in höchstens 2–3 Entscheidungen
- offene private Texteingabe nach Blur/App-Wechsel wieder verdeckt
- Satzduell zeigt Vote-Antworten ohne Autorennamen
- Wer hat das geschrieben? zeigt Autoren erst im Ergebnis
- Reload/Resume verändert Sieger, Guess-Fortschritt oder Punkte nicht erneut
- Cross-Game-Wechsel nutzt bestehenden Quick-Family-Replacement-Schutz
- Updatebanner + aktive Session
- Accessibility-/Fokuspfade

## 7. Release Candidate / Production

Ein RC wird durch unveränderten Commit, Tag, App-Version, Cachegeneration, Staging-Origin und Freeze-Zeitpunkt definiert. Labs erweitern den Core nicht automatisch.

## 8. Datenisolation

Local/Staging verwenden neutrale Testdaten. Future-Daten-Erhalt, Spezialgates und neue Labs werden getrennt geprüft.

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
DWI ... HS60 evidence:
Wave-1 Quiz evidence:
Wave-1 Imposter evidence:
Wave-1 Writing v63 evidence:
Rollback tested from/to:
Evidence reference:
```

## 11. Release-Gate

Vor `ENVIRONMENT / STAGING PASS`:

- [ ] getrennte HTTPS-Staging-/Production-Origin
- [ ] Provider-/Log-/Datenschutzentscheidung dokumentiert
- [ ] Staging-Smoke grün
- [ ] manueller PWA-Smoke
- [ ] bestehende Spezialgates real bestätigt
- [ ] Wave-1-Labs nur dann als releasefähig markieren, wenn deren eigene Evidence grün ist
- [ ] Upgrade aus mindestens zwei real installierten Altständen
- [ ] Rollbackprobe
- [ ] derselbe freigegebene RC für Production

Bis zu realer Evidence bleibt Staging **OPEN / NO_GO**.
