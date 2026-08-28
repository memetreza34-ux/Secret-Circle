# Secret Circle – Umgebungen und Staging-Vertrag

Stand: 28. August 2026  
Status: **PREPARED – konkrete HTTPS-Staging-URL offen**  
Offline-Core: **`secret-circle-v60` / `secret-circle-v60-staging`**

## 1. Ziel

Secret Circle besitzt kein klassisches Backend, benötigt aber getrennte Umgebungen. `localStorage`, Service Worker, Cache Storage und installierte PWAs sind originabhängig.

**Local → CI/Test → HTTPS-Staging → Release Candidate → Production**

## 2. Local / CI

Local ist kein Releasebeweis. CI benötigt sichtbare Runner-Steps, Checkout, Online-`npm ci`, `npm run ci` und Cross-Browser auf demselben RC. `steps: []` bleibt kein Code-Test.

## 3. HTTPS-Staging

Staging ist der erste echte Hosting-/Service-Worker-/Installationsraum und muss eine getrennte Origin besitzen.

## 4. Aktueller Cachevertrag

- aktiv: `secret-circle-v60`
- staging: `secret-circle-v60-staging`

Historie: v49 Hub Resume Guard → v50 fail-closed Loader → v51 Complete Backup → v52 sichere Current-Runden → v53 Paranoia Resume/Privacy → v54 Pre-Timer Resume → v55 Advanced Integrity → v56 Quick Session Replacement → v57 Timer-Restzeit → v58 BFCache Resume → v59 Background Pause → **v60 Hidden Snapshot Durability**.

## 5. Automatisierter HTTPS-Smoke

Der HTTPS-Netzwerkvertrag wird mit **`scripts/staging_smoke.py`** geprüft; PWA-Head-Metadaten zusätzlich durch **`tests/pwa-head-metadata.test.js`**.

Staging:

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v60
```

Production:

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v60 --production
```

## 6. Manueller Staging-Smoke

Mindestens:

- Service Worker / Installation / Offline-Neustart
- Hub/Word Imposter/Advanced/Quick/Creator/Privacy + Query-Routen offline
- DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56
- QT57 Reload-Restzeit
- BF58 BFCache Matching/Stale
- BG59 App-/Tabwechsel und Screen-Lock: Auto-Pause, kein Auto-Resume
- **HS60 Hidden-only:** laufender Timer → `hidden` → Timer-Store enthält sofort Restzeit, noch bevor `pagehide` angenommen wird
- **HS60 Cold Resume:** Prozess-/Seitenneustart aus hidden-only Snapshot → gleiche Restzeit einmalig fortsetzen
- **HS60 Cleanup:** normale Same-Page-Fortsetzung/Abschluss entfernt den Visibility-Snapshot wieder
- Timer-Store bleibt promptfrei und Teil des 17-Key-Backupvertrags
- Updatebanner + aktive Session
- Accessibility-/Fokuspfade

## 7. Release Candidate / Production

Ein RC wird durch unveränderten Commit, Tag, App-Version, Cachegeneration, Staging-Origin und Freeze-Zeitpunkt definiert. Production darf nicht der erste echte Service-Worker-, Resume-, Privacy- oder Restore-Test sein.

## 8. Datenisolation

Local/Staging verwenden neutrale Testdaten. Future-Daten-Erhalt und alle Spezialgates bis HS60 werden getrennt geprüft.

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
DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 / QR56 / QT57 / BF58 / BG59 / HS60 evidence:
Rollback tested from/to:
Evidence reference:
```

## 11. Release-Gate

Vor `ENVIRONMENT / STAGING PASS`:

- [ ] getrennte HTTPS-Staging-/Production-Origin
- [ ] Provider-/Log-/Datenschutzentscheidung dokumentiert
- [ ] Staging-Smoke grün
- [ ] manueller PWA-Smoke
- [ ] Spezialgates bis **HS60** real bestätigt
- [ ] Upgrade aus mindestens zwei real installierten Altständen
- [ ] Rollbackprobe
- [ ] derselbe freigegebene RC für Production

Bis zu realer Evidence bleibt Staging **OPEN / NO_GO**.