# Secret Circle – Umgebungen und Staging-Vertrag

Stand: 26. August 2026  
Status: **PREPARED – konkrete HTTPS-Staging-URL offen**  
Offline-Core: **`secret-circle-v55` / `secret-circle-v55-staging`**

## 1. Ziel

Secret Circle besitzt kein klassisches Backend, benötigt aber getrennte Umgebungen. `localStorage`, Service Worker, Cache Storage und installierte PWAs sind originabhängig.

**Local → CI/Test → HTTPS-Staging → Release Candidate → Production**

## 2. Local / CI

Local ist kein Releasebeweis. CI benötigt sichtbare Runner-Steps, Checkout, Online-`npm ci`, `npm run ci` und Cross-Browser auf demselben RC. `steps: []` bleibt kein Code-Test.

## 3. HTTPS-Staging

Staging ist der erste echte Hosting-/Service-Worker-/Installationsraum und muss eine getrennte Origin besitzen.

## 4. Aktueller Cachevertrag

- aktiv: `secret-circle-v55`
- staging: `secret-circle-v55-staging`

Historie: v49 Hub Resume Guard → v50 fail-closed Loader → v51 Complete Backup → v52 sichere Current-Runden → v53 Paranoia Resume/Privacy → v54 Pre-Timer Resume → **v55 Advanced Resume-/Winner-/Result-Integrität und bestätigter Session-Ersatz**.

## 5. Automatisierter HTTPS-Smoke

Staging:

```bash
npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v55
```

Production:

```bash
npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v55 --production
```

Der Netzwerk-Smoke beweist nicht Installation, Offline-Neustart, Update, Resume, Privacy oder reale Gerätefunktion.

## 6. Manueller Staging-Smoke

Mindestens:

- Service Worker / Installation / Offline-Neustart
- Hub/Word Imposter/Advanced/Quick/Creator/Privacy + Query-Routen offline
- DWI / HR2 / BK51 / HR52 / PR53 / PT54
- **AD55 Location Spy:** Vote- und Guess-Result dürfen nicht gleichzeitig fortgesetzt werden
- **AD55 Mafia:** nicht-fertiger Stage mit bereits eindeutiger Winner-Verteilung wird verworfen
- **AD55 Mafia Exact-once:** `stage=finished` direkt speichern zählt die fertige Runde genau einmal
- **AD55 New Session:** Cancel erhält die alte Session; Confirm ersetzt sie; Remove-Fehler startet keine neue
- Advanced Secret Resume + Moderator-/Nachtprivacy
- Updatebanner + aktive Session
- Accessibility-/Fokuspfade

## 7. Release Candidate / Production

Ein RC wird durch unveränderten Commit, Tag, App-Version, Cachegeneration, Staging-Origin und Freeze-Zeitpunkt definiert. Production darf nicht der erste echte Service-Worker-, Resume-, Privacy- oder Restore-Test sein.

## 8. Datenisolation

Local/Staging verwenden neutrale Testdaten. Future-Daten-Erhalt, sichere Hub-Current-/Pre-Timer-Werte und Advanced-v55-Resume-Integrität werden getrennt geprüft.

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
DWI / HR2 / BK51 / HR52 / PR53 / PT54 / AD55 evidence:
Rollback tested from/to:
Evidence reference:
```

## 11. Release-Gate

Vor `ENVIRONMENT / STAGING PASS`:

- [ ] getrennte HTTPS-Staging-/Production-Origin
- [ ] Provider-/Log-/Datenschutzentscheidung dokumentiert
- [ ] Staging-Smoke grün
- [ ] manueller PWA-Smoke
- [ ] DWI / HR2 / BK51 / HR52 / PR53 / PT54 / **AD55** real bestätigt
- [ ] Upgrade aus mindestens zwei real installierten Altständen
- [ ] Rollbackprobe
- [ ] derselbe freigegebene RC für Production

Bis zu realer Evidence bleibt Staging **OPEN / NO_GO**.