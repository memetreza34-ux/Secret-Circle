'use strict';

/* Hält docs/QA_55_SPIELE_MATRIX.json ehrlich: genau die 58 spielbaren
   Built-ins aus dem Laufzeitkatalog, Engine und Stufe aus dem Code
   abgeleitet, und ein PASS nur mit einer Spec-Datei, die das Spiel
   tatsächlich abdeckt. */

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const catalog = require('../party-wave-one-clue-catalog.js');
const structure = require('../party-release-structure.js');
const matrix = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/QA_55_SPIELE_MATRIX.json'), 'utf8'));

const STATUS = new Set(['NOT_RUN', 'PASS', 'FAIL', 'BLOCKED_REAL_DEVICE']);
const ADVANCED = new Set(['two-truths', 'question-imposter', 'location-spy', 'mafia']);
const ENGINE_LISTS = {
  classic: 'classicGameIds',
  quick: 'trendingGameIds',
  mega: 'megaGameIds',
  viral: 'viralGameIds',
  'wave-one-quiz': 'waveOneQuizGameIds',
  'wave-one-imposter': 'waveOneImposterGameIds',
  'wave-one-writing': 'waveOneWritingGameIds',
  'wave-one-voting': 'waveOneVotingGameIds',
  'wave-one-bluff': 'waveOneBluffGameIds',
  'wave-one-clue': 'waveOneClueGameIds'
};

function engineFor(game) {
  if (game.id === 'imposter') return 'word-imposter';
  if (ADVANCED.has(game.id)) return 'advanced';
  for (const [engine, list] of Object.entries(ENGINE_LISTS)) if (catalog[list].includes(game.id)) return engine;
  return 'hub';
}

const playable = catalog.games.filter(game => game.status === 'playable');
assert.equal(playable.length, 58);
assert.equal(matrix.schemaVersion, 1);
assert.deepEqual(matrix.statusValues, [...STATUS]);
assert.equal(matrix.games.length, 58);
assert.deepEqual(new Set(matrix.games.map(entry => entry.id)), new Set(playable.map(game => game.id)));
assert.equal(new Set(matrix.games.map(entry => entry.id)).size, 58, 'keine doppelten Spiele');

const passCoverage = new Map();
for (const entry of matrix.games) {
  const game = catalog.getGame(entry.id);
  assert.equal(entry.title, game.title, `${entry.id}: Titel`);
  assert.equal(entry.engine, engineFor(game), `${entry.id}: Engine`);
  assert.equal(entry.tier, structure.tierFor(game), `${entry.id}: Stufe`);
  for (const key of ['launchSweep', 'realDeviceAndGroup']) assert.ok(STATUS.has(entry[key]), `${entry.id}: ${key}`);
  assert.ok(STATUS.has(entry.endReplay?.status), `${entry.id}: endReplay.status`);
  /* Reale Geräte und Gruppen kann kein automatischer Test belegen. */
  assert.notEqual(entry.realDeviceAndGroup, 'PASS', `${entry.id}: realer Test braucht eigenen Nachweis`);

  if (entry.endReplay.status === 'PASS') {
    const spec = entry.endReplay.spec;
    assert.match(spec, /^tests\/e2e\/[a-z0-9-]+\.spec\.js$/, `${entry.id}: Spec-Pfad`);
    const source = fs.readFileSync(path.join(ROOT, spec), 'utf8');
    const coverage = entry.endReplay.coverage;
    if (coverage) {
      const list = coverage.replace(/^catalog\./, '');
      assert.ok(Array.isArray(catalog[list]) && catalog[list].includes(entry.id), `${entry.id}: nicht in ${coverage}`);
      assert.ok(source.includes(`for (const gameId of ${coverage})`), `${entry.id}: ${spec} iteriert nicht über ${coverage}`);
    } else {
      assert.ok(source.includes(`'${entry.id}'`), `${entry.id}: ${spec} nennt das Spiel nicht`);
    }
    passCoverage.set(entry.engine, (passCoverage.get(entry.engine) || 0) + 1);
  } else {
    assert.equal(entry.endReplay.spec, null, `${entry.id}: Spec nur bei PASS`);
  }
}

const count = key => matrix.games.reduce((acc, entry) => {
  const value = key === 'endReplay' ? entry.endReplay.status : entry[key];
  acc[value] = (acc[value] || 0) + 1;
  return acc;
}, {});

console.log(JSON.stringify({
  ok: true,
  games: matrix.games.length,
  tiers: count('tier'),
  engines: count('engine'),
  launchSweep: count('launchSweep'),
  endReplay: count('endReplay'),
  endReplayPassByEngine: Object.fromEntries(passCoverage),
  realDeviceAndGroup: count('realDeviceAndGroup')
}, null, 2));
