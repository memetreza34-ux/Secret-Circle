# Accessibility- und Wortpaket-Validierung

Stand: 2026-08-02

## Wortpakete

Ausgeführt:

```bash
node --check word-packs.js
node tests/content.test.js
```

Ergebnis:

```json
{
  "ok": true,
  "version": "2026.08-rc1",
  "packs": 8,
  "entries": 80,
  "familyFriendly": true,
  "externalReview": false
}
```

Bestätigt wurden acht Pakete mit jeweils zehn eindeutigen Begriffen, vollständige Hilfswörter und konsistente Metadaten.

## Accessibility und Offline-Shell

Ausgeführt:

```bash
node --check accessibility.js
node --check sw.js
node tests/accessibility.test.js
```

Ergebnis:

```json
{
  "ok": true,
  "focusManagement": true,
  "screenAnnouncements": true,
  "keyboardFocus": true,
  "reducedMotion": true,
  "forcedColors": true,
  "offlineShell": true
}
```

Bestätigt wurden Sprunglink, fünf fokussierbare Spielphasen, Live-Ansagen, Fokusübergaben, semantische Abstimmungsgruppe, Timer-Rolle, starke Tastaturfokusse, reduzierte Bewegung, erzwungene Systemfarben und der Offline-Cache für die neuen Dateien.

## Bestehende Engine

Die Spielengine wurde nicht geändert. Ihr bestehender Test deckt deterministische Verteilung, Mehr-Runden-Modus, Abstimmung, Punkte, Gleichstand, Persistenz und Manipulationsprüfung ab.

## Grenzen

Die statischen und logischen Tests ersetzen keine Prüfung mit realen Screenreadern, Tastaturnutzenden, Switch-Control, Sprachsteuerung oder mehreren Mobilgeräten. Die Wortpakete besitzen keine externe Alters- oder Inhaltsfreigabe.

Gate: `LOCAL_ACCESSIBLE_PARTY_PWA_GO / PUBLIC_RELEASE_NO_GO`.
