'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const catalog = require(path.join(root, 'party-routing.js'));
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
assert.equal(expectedIds.length, 15);
assert.equal(Object.keys(catalog.coreRules).length, 15);
for (const id of expectedIds) {
  const game = catalog.getGame(id);
  assert.ok(game, `Core game missing from catalog: ${id}`);
  assert.ok(game.competition, `Machine-readable competition contract missing: ${id}`);
  assert.equal(game.competition.scoreMode, CORE[id].score, `Score mode drift: ${id}`);
  assert.equal(game.competition.winnerMode, CORE[id].winner, `Winner mode drift: ${id}`);
  assert.equal(typeof game.competition.scoreRule, 'string');
  assert.ok(game.competition.scoreRule.length >= 6);
  assert.equal(typeof game.competition.winnerRule, 'string');
  assert.ok(game.competition.winnerRule.length >= 6);
  if (game.competition.scoreMode === 'none') assert.equal(game.competition.scoreLabel, '');
  else assert.ok(game.competition.scoreLabel.length >= 3);
  assert.ok(rulesDoc.includes(`| ${game.title}`) || rulesDoc.includes('| Nicht sagen! / Tabu'), `Scoring documentation missing: ${id}`);
}

assert.deepEqual(catalog.getGame('charades').instructions, [
  'Aktive Person festlegen und Pack auswählen.',
  '60-Sekunden-Runde starten.',
  'Treffer bestätigen oder einzelne Begriffe überspringen.',
  'Nach Ablauf zur nächsten Person wechseln.'
]);
assert.deepEqual(catalog.getGame('taboo').instructions, [
  'Aktive Person und Pack festlegen.',
  '60-Sekunden-Runde starten.',
  'Zielwort erklären, ohne die verbotenen Wörter zu sagen.',
  'Treffer bestätigen oder Begriff überspringen; danach Person wechseln.'
]);
assert.equal(catalog.getGame('hot-potato').instructions.at(-1), 'Wer das Gerät bei STOPP hält, verliert die Runde.');

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
  machineReadableCatalogRules: true,
  correctedRuleCopy: ['charades', 'taboo', 'hot-potato'],
  individualMatchScoring: ['imposter'],
  scorelessCoreGames: expectedIds.filter(id => CORE[id].score === 'none'),
  counterOnlyCoreGames: ['charades', 'taboo', 'word-chain'],
  advancedOutcomeGames: ['two-truths', 'question-imposter', 'location-spy', 'mafia'],
  scoringIsNotUniversalWinner: true
}, null, 2));
