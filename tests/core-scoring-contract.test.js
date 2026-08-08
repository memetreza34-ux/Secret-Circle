'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const catalog = require(path.join(root, 'party-catalog.js'));
const engine = read('game-engine.js');
const hub = read('party-hub.js');
const timers = read('party-hub-timers.js');
const advanced = read('party-advanced.js');
const rulesDoc = read('CORE_SCORING_RULES.md');

const CORE = Object.freeze({
  imposter: { score: 'individual-match', winner: 'round-side+leaderboard' },
  'truth-dare': { score: 'none', winner: 'none' },
  'never-have': { score: 'none', winner: 'none' },
  'most-likely': { score: 'none', winner: 'none' },
  'would-rather': { score: 'none', winner: 'none' },
  paranoia: { score: 'none', winner: 'none' },
  charades: { score: 'hit-counter', winner: 'none' },
  taboo: { score: 'hit-counter', winner: 'none' },
  'hot-potato': { score: 'none', winner: 'manual-round-loser' },
  'word-chain': { score: 'completed-round-counter', winner: 'none' },
  'two-truths': { score: 'success-counter', winner: 'round-outcome' },
  'question-imposter': { score: 'success-counter', winner: 'round-outcome' },
  'location-spy': { score: 'success-counter', winner: 'round-outcome' },
  mafia: { score: 'success-counter', winner: 'role-side' },
  'wrong-answers': { score: 'none', winner: 'manual-round-loser' }
});

const expectedIds = Object.keys(CORE).sort();
for (const id of expectedIds) {
  assert.ok(catalog.getGame(id), `Core game missing from catalog: ${id}`);
  assert.ok(rulesDoc.includes(`| ${catalog.getGame(id).title}`) || rulesDoc.includes(`| Nicht sagen! / Tabu`), `Scoring documentation missing: ${id}`);
}
assert.equal(expectedIds.length, 15);

// Word Imposter is the only core game with an individual persistent match scoreboard.
assert.match(engine, /scores: Object\.fromEntries\(players\.map\(name => \[name, 0\]\)\)/);
assert.match(engine, /for \(const name of game\.imposters\) game\.scores\[name\] \+= 2/);
assert.match(engine, /for \(const name of innocents\) game\.scores\[name\] \+= 1/);
assert.match(engine, /game\.winner = 'imposters'/);
assert.match(engine, /game\.winner = 'innocents'/);
assert.match(engine, /function leaderboard\(game\)/);
assert.match(engine, /sort\(\(a, b\) => b\.score - a\.score/);

// Non-timed direct Hub core games do not award hidden score in party-hub.js.
assert.doesNotMatch(hub, /session\.score \+=/);
assert.match(hub, /Runde übersprungen\. Dafür wurde kein Punkt vergeben\./);
assert.match(hub, /function abortSession\(\)/);

// Timed Hub scoring is deliberately a session counter, not a player/team scoreboard.
assert.equal((timers.match(/current\.score \+= 1;/g) || []).length, 3, 'Only Charades, Taboo and Word Chain may increment direct Hub score.');
assert.match(timers, /function startCharades\([\s\S]*?current\.score \+= 1;/);
assert.match(timers, /function startTaboo\([\s\S]*?current\.score \+= 1;/);
assert.match(timers, /function startWordChain\([\s\S]*?current\.score \+= 1;/);
const hotPotatoBlock = timers.match(/function startHotPotato\([\s\S]*?\n    function renderWordChainStart/);
assert.ok(hotPotatoBlock, 'Hot Potato runtime block missing.');
assert.doesNotMatch(hotPotatoBlock[0], /score \+=/);
assert.match(timers, /Wer das Gerät jetzt hält, verliert diese Runde\./);

// Advanced score is a global success counter; winner/outcome remains a separate concept.
assert.equal((advanced.match(/session\.score \+= 1;/g) || []).length, 1, 'Two Truths should add exactly one success point on a correct group vote.');
assert.equal((advanced.match(/session\.score \+= 2;/g) || []).length, 3, 'Question Imposter and both Location Spy success paths define the current +2 contract.');
assert.equal((advanced.match(/session\.score \+= 3;/g) || []).length, 1, 'Mafia day elimination of a Mafia role defines the current +3 contract.');
assert.match(advanced, /data\.correct = index === data\.lieIndex;[\s\S]*?if \(data\.correct\) session\.score \+= 1/);
assert.match(advanced, /data\.correct = player === data\.imposter;[\s\S]*?if \(data\.correct\) session\.score \+= 2/);
assert.match(advanced, /data\.correct = player === data\.spy;[\s\S]*?if \(data\.correct\) session\.score \+= 2/);
assert.match(advanced, /data\.spyCorrect = location === data\.location;[\s\S]*?if \(data\.spyCorrect\) session\.score \+= 2/);
assert.match(advanced, /const spyWon = data\.spyCorrect \|\| data\.correct === false/);
assert.match(advanced, /nodes\.eyebrow\.textContent = spyWon \? 'Spion gewinnt' : 'Gruppe gewinnt'/);
assert.match(advanced, /if \(data\.roles\[eliminated\] === 'Mafia'\) session\.score \+= 3/);
assert.match(advanced, /if \(mafiaAlive === 0\) return 'Dorf'/);
assert.match(advanced, /if \(mafiaAlive >= villageAlive\) return 'Mafia'/);

// The human-readable contract must explicitly prevent interpreting generic scores as universal winners.
for (const marker of [
  'Ein Zähler ist nicht automatisch ein Siegerpunktestand.',
  'Score und Sieger dürfen nicht vermischt werden',
  'Keine erfundene Teamwertung',
  'nur innerhalb desselben Spiels',
  'Location Spy verwendet derzeit denselben globalen Session-Zähler'
]) {
  assert.ok(rulesDoc.includes(marker), `Scoring contract marker missing: ${marker}`);
}

console.log(JSON.stringify({
  coreScoringContract: 'PASS',
  coreGames: expectedIds.length,
  individualMatchScoring: ['imposter'],
  scorelessCoreGames: expectedIds.filter(id => CORE[id].score === 'none'),
  counterOnlyCoreGames: ['charades', 'taboo', 'word-chain'],
  advancedOutcomeGames: ['two-truths', 'question-imposter', 'location-spy', 'mafia'],
  scoringIsNotUniversalWinner: true
}, null, 2));
