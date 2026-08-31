'use strict';

// Prüft, dass Skripte und Markup zusammenpassen: jede referenzierte ID muss es
// wirklich geben. Fängt Tippfehler in Selektoren, die im Browser still scheitern.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const file = (name) => fs.readFileSync(path.join(root, name), 'utf8');

const html = file('index.html');
const app = file('app.js');
const controller = file('accessibility.js');
const sw = file('sw.js');
const css = file('styles.css');

const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));

/* ── Jede ID, die JavaScript anspricht, existiert im Markup ── */

for (const source of [
  { name: 'app.js', text: app },
  { name: 'accessibility.js', text: controller }
]) {
  for (const match of source.text.matchAll(/[$(]\s*'#([a-z0-9-]+)'/gi)) {
    assert.ok(ids.has(match[1]), `${source.name} greift auf #${match[1]} zu, das Markup kennt die ID nicht`);
  }
}

/* ── ARIA-Verweise zeigen auf vorhandene Elemente ── */

for (const attribute of ['aria-controls', 'aria-labelledby', 'aria-describedby']) {
  for (const match of html.matchAll(new RegExp(`${attribute}="([^"]+)"`, 'g'))) {
    for (const target of match[1].split(/\s+/)) {
      assert.ok(ids.has(target), `${attribute}="${target}" zeigt ins Leere`);
    }
  }
}

for (const match of html.matchAll(/<label[^>]*\sfor="([^"]+)"/g)) {
  assert.ok(ids.has(match[1]), `<label for="${match[1]}"> hat kein Ziel`);
}

/* ── Jede Datei im Offline-Cache liegt wirklich im Repo ── */

for (const match of sw.matchAll(/'\.\/([^']+)'/g)) {
  assert.ok(fs.existsSync(path.join(root, match[1])), `Service Worker cacht fehlende Datei: ${match[1]}`);
}

/* ── Grundgerüst für Tastatur und Screenreader ── */

const screenIds = [...html.matchAll(/id="([^"]+)"[^>]*\sdata-screen/g)].map((match) => match[1]);
assert.ok(screenIds.length >= 7, `Zu wenige Screens: ${screenIds.length}`);

// Jeder screen('...')-Aufruf und jedes data-back muss auf einen echten Screen zeigen.
for (const match of app.matchAll(/screen\('([a-z-]+)'\)/g)) {
  assert.ok(screenIds.includes(match[1]), `app.js wechselt zu unbekanntem Screen: ${match[1]}`);
}
for (const match of html.matchAll(/data-back="([^"]+)"/g)) {
  assert.ok(screenIds.includes(match[1]), `data-back zeigt auf unbekannten Screen: ${match[1]}`);
}
assert.ok(html.includes('class="skip-link"'), 'Sprunglink fehlt');
assert.ok(html.includes('id="screen-announcement"'), 'Live-Region für Screenwechsel fehlt');
assert.ok(html.includes('rel="apple-touch-icon"'), 'apple-touch-icon fehlt — iOS zeigt sonst kein Icon');

for (const marker of [':focus-visible', 'prefers-reduced-motion', 'forced-colors', '.sr-only']) {
  assert.ok(css.includes(marker), `CSS fehlt: ${marker}`);
}

for (const marker of ['MutationObserver', 'announceVisibleScreen', 'Escape']) {
  assert.ok(controller.includes(marker), `accessibility.js fehlt: ${marker}`);
}

/* ── Schriften liegen lokal vor, damit die App offline gleich aussieht ── */

for (const match of css.matchAll(/url\('([^']+\.woff2)'\)/g)) {
  const target = path.join(root, match[1]);
  assert.ok(fs.existsSync(target), `Schriftdatei fehlt: ${match[1]}`);
  assert.ok(fs.statSync(target).size > 1000, `Schriftdatei ist leer: ${match[1]}`);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      ids: ids.size,
      screens: screenIds.length,
      selectorsResolved: true,
      offlineAssets: true,
      localFonts: true
    },
    null,
    2
  )
);
