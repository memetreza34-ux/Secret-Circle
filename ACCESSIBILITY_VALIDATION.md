# Validierungsstand

Stand: 2026-08-30

## Behobene Fehler dieser Runde

**Imposter waren vorhersagbar.** Die Imposter wurden als die ersten Einträge der Kartenreihenfolge gezogen
(`imposters = revealOrder.slice(0, imposterCount)`). Da die Reihenfolge für alle im Raum sichtbar ist, war die
Rolle ablesbar: In 200 von 200 simulierten Spielen war die Person mit der ersten Karte der Imposter.
Rollen, Kartenreihenfolge, Abstimmungsreihenfolge und Begriffswahl ziehen jetzt aus getrennten Zufallsströmen.

Gegenprobe mit wiederhergestelltem Fehler:

```
AssertionError: Imposter zu oft auf Kartenposition 1: 4000 statt ~800
```

**Start ohne Secure Context war unmöglich.** `crypto.randomUUID()` existiert nur unter HTTPS oder auf
localhost. Beim Aufruf über die Netzwerk-IP brach der Start mit `crypto.randomUUID is not a function` ab.
`E.createSeed()` fällt jetzt auf `getRandomValues` und zuletzt auf `Date.now()` zurück.

**Punkte gingen bei jedem Rundenende verloren.** `finalizeVoting()` löschte den aktiven Spielstand. Ein Reload
auf dem Ergebnisbildschirm beendete das Match samt Punktestand. Der Stand wird jetzt weitergeschrieben.

**Begriffe wiederholten sich.** Ohne Merkliste kam in einem Zehn-Runden-Match innerhalb einer Kategorie mit
100 % Wahrscheinlichkeit ein Begriff doppelt vor. `usedWords` schließt verbrauchte Begriffe für das laufende
Match aus.

**Fokus wurde in unsichtbaren Tabs nie gesetzt.** Die Fokusübergabe hing allein an `requestAnimationFrame`,
das in versteckten Tabs pausiert. `afterPaint()` fällt auf `setTimeout` zurück.

## Ausgeführte Prüfungen

```bash
node tests/engine.test.js
node tests/content.test.js
node tests/dom-contract.test.js
python3 scripts/validate_project.py
```

```json
{
  "ok": true,
  "deterministic": true,
  "multiround": true,
  "voting": true,
  "scoring": true,
  "ties": true,
  "persistence": true,
  "fairRoles": true,
  "noWordRepeats": true
}
```

`tests/dom-contract.test.js` löst jede in `app.js` und `accessibility.js` verwendete ID gegen das Markup auf,
prüft alle `aria-controls`/`aria-labelledby`/`for`-Verweise, die Existenz aller im Service Worker gecachten
Dateien und der lokalen Schriftdateien. Das ersetzt die frühere Marker-Suche, die nur nach Zeichenketten
gesucht hat, ohne Verhalten zu prüfen.

## Im Browser bestätigt

Durchgespielt mit 4 und mit 12 Personen, jeweils Kartenverteilung, Diskussion, Abstimmung und Auswertung:

- Rollenverteilung nicht mehr aus der Reihenfolge ablesbar
- Reload auf dem Ergebnisbildschirm setzt das Match mit erhaltenen Punkten fort
- Fokus wandert beim Screenwechsel auf die Überschrift, Ansage lautet z. B.
  `Runde 2/3 · Karte 1 von 12. Jonas`
- Karte klappt auf und zu, Inhalt wird beim Schließen aus dem DOM entfernt
- Abstimmung zeigt nach der Stimmabgabe keine Namen mehr

## Grenzen

Diese Prüfungen ersetzen keine Tests mit realen Screenreadern, Switch Control, Sprachsteuerung oder auf
mehreren Mobilgeräten. Keine vollständige WCAG-Prüfung. Die Wortpakete haben keine externe Alters- oder
Inhaltsfreigabe.

Gate: `LOCAL_ACCESSIBLE_PARTY_PWA_GO / PUBLIC_RELEASE_NO_GO`.
