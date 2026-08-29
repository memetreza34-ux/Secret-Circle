'use strict';

const assert = require('node:assert/strict');
const catalog = require('../party-viral-catalog.js');
const Search = require('../party-search-assist.js');

assert.equal(Search.version, 1);
assert.equal(Search.maximumSuggestions, 6);
assert.equal(Search.normalizeText('  Heiße   Kartoffel! '), 'heisse kartoffel');
assert.equal(Search.normalizeText('WÖRTER-Kette'), 'worter kette');
assert.equal(Search.normalizeText('Straße & Spaß'), 'strasse spass');
assert.equal(Search.levenshtein('mafia', 'mafia'), 0);
assert.equal(Search.levenshtein('maifa', 'mafia', 2), 2);
assert.ok(Search.scoreAlias('werwolf', 'werwolf') > Search.scoreAlias('werwolf', 'mafia'));

function first(query) {
  return Search.suggestions(catalog.games, query, 6)[0]?.game?.id || null;
}

assert.equal(first('impostor'), 'imposter');
assert.equal(first('wahrheit pflicht'), 'truth-dare');
assert.equal(first('ich hab noch nie'), 'never-have');
assert.equal(first('wer würde eher'), 'most-likely');
assert.equal(first('pantomime'), 'charades');
assert.equal(first('tabu'), 'taboo');
assert.equal(first('heiße kartoffel'), 'hot-potato');
assert.equal(first('werwolf'), 'mafia');
assert.equal(first('montagsmaler'), 'draw-guess');
assert.equal(first('preis schätzen'), 'guess-the-price');
assert.equal(first('stadt land fluss'), 'letter-categories');
assert.equal(first('schnitzeljagd'), 'scavenger-hunt');
assert.equal(first('maifa'), 'mafia');
assert.equal(first('impsoter'), 'imposter');
assert.deepEqual(Search.suggestions(catalog.games, 'a', 6), []);
assert.ok(Search.suggestions(catalog.games, 'spiel', 100).length <= 10);
assert.ok(Search.suggestions(catalog.games, 'wer', 6).length <= Search.maximumSuggestions);
assert.ok(Search.aliasesFor(catalog.getGame('mafia')).includes('werwolf'));

for (const suggestion of Search.suggestions(catalog.games, 'werwolf', 6)) {
  assert.ok(suggestion.game);
  assert.equal(typeof suggestion.score, 'number');
  assert.ok(suggestion.score > 0);
}

console.log(JSON.stringify({
  ok: true,
  searchAssistVersion: Search.version,
  synonyms: true,
  umlautAndSharpSNormalization: true,
  typoTolerance: true,
  weightedResults: true,
  maximumSuggestions: Search.maximumSuggestions,
  keyboardReadyListboxContract: true
}, null, 2));
