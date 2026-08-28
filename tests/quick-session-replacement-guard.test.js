'use strict';

const assert = require('node:assert/strict');
const guard = require('../quick-session-replacement-guard.js');

const catalog = {
  createdGameIds: ['custom-game-demo', 'custom-guess'],
  viralGameIds: ['viral-demo', 'know-me-best', 'guess-the-price', 'higher-lower'],
  megaGameIds: ['mega-demo', 'who-am-i', 'anime-guess', 'secret-mission'],
  quickGameIds: ['quick-demo', 'wavelength', 'draw-guess', 'sound-imitation', 'hum-song', 'forehead-guess'],
  trendingGameIds: ['trend-demo', 'other-trend-demo'],
  getGame(id) {
    const titles = {
      'custom-game-demo': 'Eigenes Spiel',
      'custom-guess': 'Eigenes Ratespiel',
      'viral-demo': 'Viral Demo',
      'mega-demo': 'Mega Demo',
      'quick-demo': 'Quick Demo',
      'trend-demo': 'Trend Demo',
      'other-trend-demo': 'Anderes Trendspiel',
      'wavelength': 'Spektrum-Tipp',
      'draw-guess': 'Zeichnen & Raten',
      'sound-imitation': 'Geräusch imitieren',
      'hum-song': 'Melodie summen',
      'forehead-guess': 'Stirn-Raten',
      'who-am-i': 'Wer bin ich?',
      'anime-guess': 'Anime-Archetypen erraten',
      'secret-mission': 'Geheime Mission',
      'know-me-best': 'Wer kennt mich?',
      'guess-the-price': 'Preis schätzen',
      'higher-lower': 'Höher oder tiefer'
    };
    if (!titles[id]) return null;
    return { id, title: titles[id], ...(id === 'custom-guess' ? { templateId: 'guess' } : {}) };
  }
};

function snapshot(gameId = 'trend-demo', extra = {}) {
  return {
    version: 1,
    gameId,
    sessionId: `session-${gameId}`,
    pack: 'Klassisch',
    targetRounds: 5,
    round: 2,
    players: ['Alex', 'Sam', 'Mika'],
    phase: 'ready',
    current: null,
    startedAt: '2026-08-26T14:00:00.000Z',
    ...extra
  };
}

function storageWith(value, key = guard.familyKeys.quick, extras = {}) {
  const values = new Map();
  if (value !== undefined) values.set(key, JSON.stringify(value));
  for (const [name, stored] of Object.entries(extras)) values.set(name, typeof stored === 'string' ? stored : JSON.stringify(stored));
  return {
    getItem(name) { return values.has(name) ? values.get(name) : null; },
    setItem(name, next) { values.set(name, String(next)); },
    removeItem(name) { values.delete(name); },
    dump(name) { return values.get(name) ?? null; }
  };
}

assert.equal(guard.version, 2);
assert.equal(guard.familyForGame(catalog, 'custom-game-demo'), 'created');
assert.equal(guard.familyForGame(catalog, 'viral-demo'), 'viral');
assert.equal(guard.familyForGame(catalog, 'mega-demo'), 'mega');
assert.equal(guard.familyForGame(catalog, 'quick-demo'), 'quick');
assert.equal(guard.familyForGame(catalog, 'trend-demo'), 'quick');
assert.equal(guard.familyForGame(catalog, 'unknown'), null);
assert.equal(guard.storageKeyForGame(catalog, 'custom-game-demo'), 'secret-circle-party-created-active-v1');
assert.equal(guard.storageKeyForGame(catalog, 'viral-demo'), 'secret-circle-party-viral-active-v1');
assert.equal(guard.storageKeyForGame(catalog, 'mega-demo'), 'secret-circle-party-mega-active-v1');
assert.equal(guard.storageKeyForGame(catalog, 'trend-demo'), 'secret-circle-party-quick-active-v1');

assert.equal(guard.plausibleSnapshot(snapshot()), true);
assert.equal(guard.plausibleSnapshot({ ...snapshot(), version: 2 }), false);
assert.equal(guard.plausibleSnapshot({ ...snapshot(), round: 6 }), false);
assert.equal(guard.plausibleSnapshot({ ...snapshot(), players: ['Alex', 'alex'] }), false);
assert.equal(guard.plausibleSnapshot({ ...snapshot(), players: [] }), false);

// v61 privacy-sensitive same-game resume integrity.
assert.equal(guard.privacySensitiveResumeValid(catalog, 'wavelength', snapshot('wavelength', {
  phase: 'guess', current: { spectrum: ['Leise', 'Laut'], target: 55, guess: 50 }
})), true);
assert.equal(guard.privacySensitiveResumeValid(catalog, 'wavelength', snapshot('wavelength', {
  phase: 'card', current: { spectrum: ['Leise', 'Laut'], target: 55, guess: 50 }
})), false, 'unknown Wavelength phase must not fall into target reveal');
assert.equal(guard.privacySensitiveResumeValid(catalog, 'draw-guess', snapshot('draw-guess', {
  phase: 'card', current: { prompt: 'Katze' }
})), true);
assert.equal(guard.privacySensitiveResumeValid(catalog, 'draw-guess', snapshot('draw-guess', {
  phase: 'result', current: { prompt: 'Katze' }
})), false, 'private Quick guess only supports ready/card');
assert.equal(guard.privacySensitiveResumeValid(catalog, 'who-am-i', snapshot('who-am-i', {
  phase: 'result', current: { identity: 'Astronaut', success: true }
})), true);
assert.equal(guard.privacySensitiveResumeValid(catalog, 'who-am-i', snapshot('who-am-i', {
  phase: 'result', current: { identity: 'Astronaut', success: null }
})), false, 'identity result requires resolved success');
assert.equal(guard.privacySensitiveResumeValid(catalog, 'secret-mission', snapshot('secret-mission', {
  phase: 'active', current: { mission: 'Sage unauffällig ein bestimmtes Wort', success: null }
})), true);
assert.equal(guard.privacySensitiveResumeValid(catalog, 'secret-mission', snapshot('secret-mission', {
  phase: 'unexpected', current: { mission: 'Geheim', success: null }
})), false);
assert.equal(guard.privacySensitiveResumeValid(catalog, 'know-me-best', snapshot('know-me-best', {
  phase: 'group', current: { question: 'Was passt?', options: ['A', 'B', 'C'], secret: 1, groupGuess: null }
})), true);
assert.equal(guard.privacySensitiveResumeValid(catalog, 'know-me-best', snapshot('know-me-best', {
  phase: 'result', current: { question: 'Was passt?', options: ['A', 'B', 'C'], secret: 1, groupGuess: null }
})), false, 'result must have a group guess before revealing secret');
assert.equal(guard.privacySensitiveResumeValid(catalog, 'guess-the-price', snapshot('guess-the-price', {
  phase: 'result', current: { label: 'Spielgegenstand', price: 75, guess: 80, points: 3 }
})), true);
assert.equal(guard.privacySensitiveResumeValid(catalog, 'higher-lower', snapshot('higher-lower', {
  phase: 'ready', current: { first: ['A', 10], second: ['B', 20], choice: 'higher', correct: true }
})), true);
assert.equal(guard.privacySensitiveResumeValid(catalog, 'higher-lower', snapshot('higher-lower', {
  phase: 'ready', current: { first: ['A', 10], second: ['B', 20], choice: 'higher', correct: false }
})), false, 'stored correctness must match the hidden values');
assert.equal(guard.privacySensitiveResumeValid(catalog, 'custom-guess', snapshot('custom-guess', {
  phase: 'result', current: 'Baum', choice: 1
})), true);
assert.equal(guard.privacySensitiveResumeValid(catalog, 'custom-guess', snapshot('custom-guess', {
  phase: 'result', current: null, choice: 1
})), false, 'Creator result may not generate and instantly reveal a new secret card');

const timerStore = {
  version: 1,
  snapshots: {
    quick: { gameId: 'draw-guess', sessionId: 'session-draw-guess', round: 2, phase: 'result', durationMs: 60000, remainingMs: 30000 },
    mega: { gameId: 'mega-demo', sessionId: 'mega-session', round: 1, phase: 'running', durationMs: 30000, remainingMs: 20000 }
  }
};
const quarantineStorage = storageWith(snapshot('draw-guess', { phase: 'result', current: { prompt: 'Geheimkarte' } }), guard.familyKeys.quick, {
  [guard.timerStoreKey]: timerStore
});
const statusNode = { textContent: '', classList: { added: [], add(name) { this.added.push(name); } } };
const quarantined = guard.quarantineInvalidSameGame(
  { localStorage: quarantineStorage },
  { querySelector(selector) { return selector === '#quick-status' ? statusNode : null; } },
  catalog,
  'draw-guess'
);
assert.equal(quarantined, true);
assert.equal(quarantineStorage.getItem(guard.familyKeys.quick), null, 'invalid same-game active snapshot is removed');
const timerAfterQuarantine = JSON.parse(quarantineStorage.getItem(guard.timerStoreKey));
assert.equal(timerAfterQuarantine.snapshots.quick, undefined, 'matching family timer is removed with quarantined active state');
assert.equal(timerAfterQuarantine.snapshots.mega.sessionId, 'mega-session', 'other family timer remains untouched');
assert.match(statusNode.textContent, /inkonsistent/);

const crossIntegrityStorage = storageWith(snapshot('other-trend-demo', { phase: 'nonsense', current: { prompt: 'Alt' } }));
assert.equal(guard.quarantineInvalidSameGame({ localStorage: crossIntegrityStorage }, null, catalog, 'trend-demo'), false);
assert.notEqual(crossIntegrityStorage.getItem(guard.familyKeys.quick), null, 'cross-game family snapshot is never quarantined by current game');

const missing = guard.authorizeStart({ localStorage: storageWith(undefined), confirm() { throw new Error('must not confirm'); } }, catalog, 'trend-demo');
assert.equal(missing.allowed, true);
assert.equal(missing.existing, null);

let sameGamePrompt = '';
const sameGame = guard.authorizeStart({
  localStorage: storageWith(snapshot('trend-demo')),
  confirm(message) { sameGamePrompt = message; return false; }
}, catalog, 'trend-demo');
assert.equal(sameGame.allowed, false);
assert.match(sameGamePrompt, /Trend Demo/);
assert.match(sameGamePrompt, /neue Session beginnen/);

let crossGamePrompt = '';
const crossGameStorage = storageWith(snapshot('other-trend-demo'));
const crossGame = guard.authorizeStart({
  localStorage: crossGameStorage,
  confirm(message) { crossGamePrompt = message; return true; }
}, catalog, 'trend-demo');
assert.equal(crossGame.allowed, true);
assert.equal(crossGame.existing.value.gameId, 'other-trend-demo');
assert.match(crossGamePrompt, /Anderes Trendspiel/);
assert.match(crossGamePrompt, /Trend Demo/);
assert.equal(JSON.parse(crossGameStorage.getItem(guard.familyKeys.quick)).gameId, 'other-trend-demo');

const malformedStorage = storageWith({ version: 1, gameId: 'trend-demo', targetRounds: 5, round: 8, players: ['Alex'] });
const malformed = guard.authorizeStart({ localStorage: malformedStorage, confirm() { throw new Error('must not confirm malformed state'); } }, catalog, 'trend-demo');
assert.equal(malformed.allowed, true);
assert.equal(malformed.existing, null);

console.log(JSON.stringify({
  quickSessionReplacementGuard: 'PASS',
  guardVersion: guard.version,
  families: ['quick', 'mega', 'viral', 'created'],
  sameGameReplacementConfirmed: true,
  crossGameFamilyReplacementConfirmed: true,
  privacySensitiveResumeQuarantine: true,
  crossGameSnapshotPreserved: true,
  matchingFamilyTimerCleared: true,
  unrelatedFamilyTimerPreserved: true,
  malformedSnapshotsDoNotBlockStart: true
}, null, 2));
