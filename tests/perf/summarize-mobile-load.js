'use strict';

/* Fasst die JSON-Ergebnisse von mobile-load.perf.spec.js als Markdown-Tabellen
   zusammen (Mediane). Aufruf: node tests/perf/summarize-mobile-load.js [Ordner] */

const fs = require('fs');
const path = require('path');

const dir = path.resolve(process.argv[2] || '.cache/perf-mobile');
const records = fs.readdirSync(dir)
  .filter(name => name.endsWith('.json'))
  .map(name => JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8')));
if (!records.length) throw new Error(`Keine Messdaten in ${dir}`);

const PAGE_ORDER = ['index.html', 'v2-hub.html', 'party.html', 'quick-play.html'];
const PROJECT_ORDER = ['chromium-mobile', 'webkit-mobile', 'chromium-mobile-slow4g'];
records.sort((a, b) => PROJECT_ORDER.indexOf(a.project) - PROJECT_ORDER.indexOf(b.project)
  || PAGE_ORDER.indexOf(a.page) - PAGE_ORDER.indexOf(b.page));

const labels = records[0].targets.map(target => target.label);
const [base, next] = labels;
const ms = value => (value === null || value === undefined ? '–' : String(Math.round(value)));
const ms1 = value => (value === null || value === undefined ? '–' : value.toFixed(1));
const kb = value => (value === null || value === undefined ? '–' : (value / 1024).toFixed(0));
const pair = (format, a, b) => {
  if (next === undefined) return format(a);
  const delta = (a === null || b === null || a === undefined || b === undefined) ? '' : ` (${b - a >= 0 ? '+' : ''}${format(b - a)})`;
  return `${format(a)} → ${format(b)}${delta}`;
};

const lines = [];
lines.push(`Stände: ${labels.join(' → ')} · Läufe je Messpunkt: ${records[0].runs} · Werte: Median`);
lines.push('');
for (const project of PROJECT_ORDER) {
  const group = records.filter(record => record.project === project);
  if (!group.length) continue;
  lines.push(`#### ${project} (${group[0].browser} ${group[0].browserVersion}${group[0].throttled ? ', Slow 4G + CPU 4x' : ''})`);
  lines.push('');
  lines.push('| Seite | Fall | DOMContentLoaded ms | load ms | UI sichtbar ms | Netzbody KiB |');
  lines.push('|---|---|---|---|---|---|');
  for (const record of group) {
    for (const scenario of ['cold', 'warm']) {
      const a = record.summary[base][scenario];
      const b = next !== undefined ? record.summary[next][scenario] : {};
      lines.push(`| ${record.page} | ${scenario === 'cold' ? 'kalt' : 'warm'} | ${pair(ms, a.dclMs, b.dclMs)} | ` +
        `${pair(ms, a.loadMs, b.loadMs)} | ${pair(ms, a.uiVisibleMs, b.uiVisibleMs)} | ${pair(kb, a.serverBodyBytes, b.serverBodyBytes)} |`);
    }
  }
  lines.push('');
}

lines.push('#### Skriptkosten der Kartendateien');
lines.push('');
lines.push('| Profil | Seite | Fall | Karten-Skripte Hauptthread ms | party-core-classic-content.js ms | alle Skripte ms |');
lines.push('|---|---|---|---|---|---|');
for (const record of records.filter(entry => entry.browser === 'chromium')) {
  for (const scenario of ['cold', 'warm']) {
    const a = record.summary[base][scenario];
    const b = next !== undefined ? record.summary[next][scenario] : {};
    lines.push(`| ${record.project} | ${record.page} | ${scenario === 'cold' ? 'kalt' : 'warm'} | ` +
      `${pair(ms1, a.cardEvaluateMs, b.cardEvaluateMs)} | ${pair(ms1, a.classicContentEvaluateMs, b.classicContentEvaluateMs)} | ` +
      `${pair(ms1, a.allScriptsEvaluateMs, b.allScriptsEvaluateMs)} |`);
  }
}
lines.push('');
lines.push('| Profil | Kartendateien isoliert parsen + ausführen ms (ohne Code-Cache) |');
lines.push('|---|---|');
for (const record of records.filter(entry => entry.page === PAGE_ORDER[0])) {
  const values = labels.map(label => `${label}: ${ms1(record.summary[label].cardParseMs)} (${record.summary[label].cardParseFiles ?? 0} Dateien)`);
  lines.push(`| ${record.project} | ${values.join(' · ')} |`);
}
lines.push('');
const core = records.find(record => record.page === PAGE_ORDER[0]);
if (core) {
  lines.push('| Offline-Kern (einmalig, gzip) | Dateien | KB | davon Kartendateien KB |');
  lines.push('|---|---|---|---|');
  for (const label of labels) {
    const entry = core.summary[label].offlineCore;
    if (entry) lines.push(`| ${label} | ${entry.files} | ${kb(entry.bytes)} | ${kb(entry.cardBytes)} |`);
  }
}

process.stdout.write(`${lines.join('\n')}\n`);
