# Secret Circle – Umgebungen und Staging-Vertrag

Stand: 29. August 2026  
Status: **PREPARED – konkrete HTTPS-Staging-URL offen**  
Offline-Core: **`secret-circle-v62` / `secret-circle-v62-staging`**

## 1. Ziel

Secret Circle besitzt kein klassisches Backend, benötigt aber getrennte Umgebungen. `localStorage`, Service Worker, Cache Storage und installierte PWAs sind originabhängig.

**Local → CI/Test → HTTPS-Staging → Release Candidate → Production**

## 2. Local / CI

Local ist kein Releasebeweis. CI benötigt sichtbare Runner-Steps, Checkout, Online-`npm ci`, `npm run ci` und Cross-Browser auf demselben RC. `steps: []` bleibt kein Code-Test.

## 3. HTTPS-Staging

Staging ist der erste echte Hosting-/Service-Worker-/Installationsraum und muss eine getrennte Origin besitzen.

## 4. Aktueller Cachevertrag

- aktiv: `secret-circle-v62`
- staging: `secret-circle-v62-staging`

Historie: v49 Hub Resume Guard → v50 fail-closed Loader → v51 Complete Backup → v52 sichere Current-Runden → v53 Paranoia → v54 Pre-Timer → v55 Advanced Integrity → v56 Quick Replacement → v57 Timer-Restzeit → v58 BFCache → v59 Background Pause → v60 Hidden Snapshot → v61 Wave-1-Quiz → **v62 Wave-1-Imposter**.

## 5. Automatisierter HTTPS-Smoke

Der HTTPS-Netzwerkvertrag wird mit **`scripts/staging_smoke.py`** geprüft; PWA-Head-Metadaten zusätzlich durch **`tests/pwa-head-metadata.test.js`**.

Staging:

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v62
```

Production:

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v62 --production
```

## 6. Manueller Staging-Smoke

Mindestens:

- Service Worker / Installation / Offline-Neustart
- Hub/Word Imposter/Advanced/Quick/Creator/Privacy + Query-Routen offline
- bestehende Spezialgates DWI bis HS60
- **Wave 1 / v61:** Party Quiz und Fake oder Fakt sichtbar als Labs; Result-Resume exact-once
- **Wave 1 Imposter / v62:** Undercover – ähnliches Wort und Imposter ohne Wort sichtbar als Labs
- beide neuen Imposter-Modi starten in höchstens 2–3 Entscheidungen
- private Handoff-Karte nach Blur/App-Wechsel wieder verdeckt
- geheime Abstimmung pro Spieler ohne Auto-Reveal
- No-Word: korrekte Enttarnung → genau ein letzter Wort-Guess
- Reload/Resume verändert Gewinner/Score nicht erneut
- Cross-Game-Wechsel nutzt bestehenden Quick-Family-Replacement-Schutz
- Quiz- und Imposter-Runner funktionieren online und offline
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
Wave-1 Imposter v62 evidence:
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
