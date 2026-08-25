# Secret Circle – Hosting-Entscheidungsvertrag

Stand: 25. August 2026  
Status: **PREPARED – Provider und Domains offen**

Secret Circle ist eine statische Offline-first-PWA ohne eigenes Backend. Trotzdem verarbeitet der Hostinganbieter technisch unvermeidbar HTTP-Verbindungen und möglicherweise Access-/Securitylogs. Deshalb wird Hosting als eigenes Release-Gate behandelt.

## 1. Mindestanforderungen

Der Production-Host muss mindestens bieten:

- HTTPS auf eigener Production-Origin
- getrennte HTTPS-Staging-Origin
- zuverlässige Auslieferung statischer HTML/CSS/JS/PNG/SVG/Manifest-Dateien
- korrekte Service-Worker-Auslieferung ohne unerwartete Cachemanipulation
- kontrollierbare Deployments eines unveränderten Git-Commits
- nachvollziehbare Rollbackmöglichkeit
- dokumentierte Log-/Datenschutzbedingungen
- erreichbaren Abuse-/Security-Kontakt

## 2. Entscheidungsmatrix

Vor Auswahl pro Kandidat dokumentieren:

| Kriterium | Kandidat A | Kandidat B | Final |
|---|---|---|---|
| HTTPS / Custom Domain |  |  |  |
| getrennte Staging-Origin |  |  |  |
| statische PWA geeignet |  |  |  |
| Service Worker ohne Sonderregeln |  |  |  |
| EU/EWR-Region bzw. Datenweg dokumentiert |  |  |  |
| Accesslogs dokumentiert |  |  |  |
| Logaufbewahrung dokumentiert |  |  |  |
| AV-/Processor-Rolle geprüft |  |  |  |
| Drittlandtransfer geprüft |  |  |  |
| Rollback einfach und reproduzierbar |  |  |  |
| Abuse-/Security-Kontakt |  |  |  |
| Kosten für V1 akzeptabel |  |  |  |

## 3. Finale Hostingakte

```text
Provider:
Produkt/Tarif:
Staging-Origin:
Production-Origin:
Region/Standort:
Accesslogs:
Aufbewahrung/Löschkriterien:
Datenschutz-/Processor-Rolle:
DPA/AVV geprüft:
Drittlandtransfer:
HTTPS bestätigt:
Abuse-/Security-Kontakt:
Deploymentquelle:
Rollbackverfahren:
Prüfdatum:
Reviewer:
```

## 4. Staging-Regel

Staging und Production müssen getrennte Origins besitzen. Dadurch bleiben insbesondere `localStorage`, Service-Worker-Registrierungen, Cache Storage und installierte PWA-Zustände getrennt.

Nicht zulässig als finale Trennung: nur Queryparameter auf derselben Origin.

## 5. Technische Abnahme

Nach Auswahl des Hosts:

1. unveränderten RC auf Staging deployen
2. `npm run staging:smoke -- https://STAGING-ORIGIN/ --expected-cache secret-circle-v47`
3. manuellen Browser-/PWA-Staging-Smoke durchführen
4. PWA installieren und offline neu starten
5. Upgrade von mindestens zwei real installierten Altständen prüfen
6. v47-A11y-Pfade für Hub, Advanced, Quick und Creator offline prüfen
7. Rollback-/Hotfix-Version mit neuer Cachegeneration testen
8. erst danach denselben freigegebenen statischen RC nach Production promoten
9. `npm run staging:smoke -- https://PRODUCTION-ORIGIN/ --expected-cache secret-circle-v47 --production`
10. manuellen Production-Smoke durchführen

Der erwartete Cache muss stets dem aktuellen `CACHE` aus `sw.js` entsprechen; eine neue Offline-Core-Änderung erzeugt eine neue Generation.

## 6. Datenschutzabgleich

`privacy.html` darf erst final freigegeben werden, wenn mindestens bekannt ist:

- wer hostet
- welche technischen Verbindungs-/Logdaten anfallen
- zu welchen Zwecken diese verarbeitet werden
- wie lange beziehungsweise nach welchen Kriterien Logs gespeichert werden
- ob Auftragsverarbeitung oder Drittlandbezug relevant ist

Die Aussage „Spieldaten bleiben lokal“ darf bestehen, soweit das technisch weiterhin stimmt. Sie darf aber nicht mit „es findet überhaupt keine personenbezogene Verarbeitung statt“ verwechselt werden.

## 7. Release-Gate

Vor `HOSTING / ENVIRONMENT PASS`:

- [ ] Provider final ausgewählt
- [ ] Staging-Origin final
- [ ] Production-Origin final
- [ ] Log-/Privacybedingungen dokumentiert
- [ ] Datenschutzrolle/Drittlandbezug geprüft
- [ ] HTTPS bestätigt
- [ ] Staging-Smoke grün
- [ ] realer PWA-Smoke grün
- [ ] v47 Hub-/Advanced-/Quick-/Creator-A11y offline real geprüft
- [ ] Upgrade-/Rollbackpfad grün
- [ ] Production-Smoke grün

Bis dahin bleibt Hosting **PREPARED / NO_GO**.
