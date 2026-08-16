'use strict';

const assert = require('node:assert/strict');
const catalog = require('../party-routing.js');
const release = require('../party-release-structure.js');
const releaseContent = require('../party-core-release-catalog.js');
const classicContent = require('../party-core-classic-content.js');

delete globalThis.SecretCircleContent;
require('../word-packs.js');
const wordContent = globalThis.SecretCircleContent;

const expectedCore = [
  'imposter', 'truth-dare', 'never-have', 'most-likely', 'would-rather',
  'paranoia', 'charades', 'taboo', 'hot-potato', 'word-chain',
  'two-truths', 'question-imposter', 'location-spy', 'mafia', 'wrong-answers'
];

const expectedAges = Object.freeze({
  imposter: 'all', 'truth-dare': 'teen', 'never-have': 'teen', 'most-likely': 'all',
  'would-rather': 'all', paranoia: 'teen', charades: 'all', taboo: 'all',
  'hot-potato': 'all', 'word-chain': 'all', 'two-truths': 'all',
  'question-imposter': 'all', 'location-spy': 'all', mafia: 'teen', 'wrong-answers': 'all'
});

const hardMinimums = Object.freeze({
  'truth-dare': 24, 'never-have': 24, 'most-likely': 24, 'would-rather': 24,
  paranoia: 20, charades: 30, taboo: 24, 'hot-potato': 20, 'word-chain': 10,
  'two-truths': 16, 'question-imposter': 16, 'location-spy': 16, mafia: 3,
  'wrong-answers': 24
});
const editorialTargets = Object.freeze({ ...hardMinimums });

function normalizeText(value) {
  return String(value ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ');
}
function canonicalText(value) {
  return normalizeText(value).toLocaleLowerCase('de-DE');
}
function collectStrings(value, output = []) {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach(item => collectStrings(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach(item => collectStrings(item, output));
  return output;
}
function canonicalItem(value) {
  if (typeof value === 'string') return canonicalText(value);
  if (Array.isArray(value)) return `[${value.map(canonicalItem).join('|')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${key}:${canonicalItem(value[key])}`).join('|')}}`;
  return String(value);
}
function assertSafeText(value, context, { minimum = 1, maximum = 240 } = {}) {
  assert.equal(typeof value, 'string', `${context} must be text.`);
  const text = normalizeText(value);
  assert.ok(text.length >= minimum, `${context} is too short.`);
  assert.ok(text.length <= maximum, `${context} is too long (${text.length}).`);
  assert.doesNotMatch(text, /<\s*\/?\s*(script|style|iframe|object|embed|svg|img|video|audio|link|meta|form)\b/i, `${context} contains HTML/script markup.`);
  assert.doesNotMatch(text, /\bon\w+\s*=/i, `${context} contains an inline event-handler pattern.`);
}
function assertUniqueItems(items, context) {
  const canonical = items.map(canonicalItem);
  assert.equal(new Set(canonical).size, canonical.length, `${context} contains exact normalized duplicates.`);
}

assert.deepEqual([...release.coreIds], expectedCore);
assert.equal(Object.keys(expectedAges).length, 15);
assert.equal(releaseContent.coreReleaseContentVersion, 1);
assert.deepEqual(new Set(releaseContent.coreReleaseContentGames), new Set(['never-have', 'most-likely', 'would-rather', 'paranoia', 'wrong-answers']));
assert.equal(classicContent.coreClassicContentVersion, 1);
assert.deepEqual(new Set(classicContent.coreClassicContentGames), new Set(['truth-dare', 'charades', 'taboo', 'hot-potato']));
assert.equal(classicContent.editorialReplacementCount, 2);

const editorialShortfalls = [];
let routedCoreItems = 0;
for (const id of expectedCore) {
  const game = catalog.getGame(id);
  assert.ok(game, `Missing core game: ${id}`);
  assert.equal(game.age, expectedAges[id], `Unexpected age level: ${id}`);
  if (id === 'imposter') continue;
  const packNames = catalog.getPackNames(id);
  assert.deepEqual(packNames, game.packs, `Pack metadata/content drift: ${id}`);
  for (const pack of packNames) {
    const raw = catalog.content[id][pack];
    const items = catalog.getItems(id, pack);
    assert.ok(items.length >= hardMinimums[id], `Core pack fell below release content minimum: ${id}/${pack} (${items.length} < ${hardMinimums[id]}).`);
    assertUniqueItems(items, `${id}/${pack}`);
    routedCoreItems += items.length;
    for (const [index, text] of collectStrings(raw).entries()) {
      const minimum = id === 'word-chain' ? 1 : 2;
      assertSafeText(text, `${id}/${pack} text ${index + 1}`, { minimum });
    }
    const target = editorialTargets[id];
    if (target && items.length < target) editorialShortfalls.push({ id, pack, count: items.length, target });
  }
}
assert.deepEqual(editorialShortfalls, [], 'All quantitative core content targets must now be met.');

for (const pack of catalog.getPackNames('truth-dare')) {
  const raw = catalog.content['truth-dare'][pack];
  assert.ok(raw && typeof raw === 'object' && !Array.isArray(raw), `Truth/Dare pack must stay structured: ${pack}`);
  assert.deepEqual(Object.keys(raw), ['truth', 'dare']);
  assert.ok(Array.isArray(raw.truth) && raw.truth.length >= 12, `Truth release list too small: ${pack}`);
  assert.ok(Array.isArray(raw.dare) && raw.dare.length >= 12, `Dare release list too small: ${pack}`);
  assertUniqueItems([...raw.truth, ...raw.dare], `truth-dare/${pack}`);
  assert.equal(catalog.getItems('truth-dare', pack).length, raw.truth.length + raw.dare.length);
}
assert.equal(catalog.itemCount('truth-dare'), 96);

const finalCoreText = collectStrings(Object.fromEntries(expectedCore.filter(id => id !== 'imposter').map(id => [id, catalog.content[id]]))).map(canonicalText);
assert.ok(!finalCoreText.includes(canonicalText('Was ist das Seltsamste in deiner Kamerarolle?')), 'Core content must not prompt users to inspect private camera-roll material.');
assert.ok(!finalCoreText.includes(canonicalText('Lies die letzte Nachricht auf deinem Handy wie ein Theatermonolog, ohne Namen zu nennen.')), 'Core content must not expose private third-party messages.');
assert.ok(finalCoreText.includes(canonicalText('Welches Foto-Motiv findest du besonders lustig?')));
assert.ok(finalCoreText.includes(canonicalText('Lies einen selbst erfundenen Satz wie einen dramatischen Theatermonolog vor.')));

for (const pack of catalog.getPackNames('would-rather')) {
  for (const [index, pair] of catalog.content['would-rather'][pack].entries()) {
    assert.ok(Array.isArray(pair) && pair.length === 2, `Would Rather pair malformed: ${pack} #${index + 1}`);
    pair.forEach((value, option) => assertSafeText(value, `would-rather/${pack} #${index + 1} option ${option + 1}`, { minimum: 2, maximum: 120 }));
    assert.notEqual(canonicalText(pair[0]), canonicalText(pair[1]), `Would Rather options must differ: ${pack} #${index + 1}`);
  }
}

for (const pack of catalog.getPackNames('taboo')) {
  for (const [index, card] of catalog.content.taboo[pack].entries()) {
    assert.ok(card && typeof card === 'object' && !Array.isArray(card), `Taboo card malformed: ${pack} #${index + 1}`);
    assertSafeText(card.word, `taboo/${pack} #${index + 1} target`, { minimum: 2, maximum: 60 });
    assert.ok(Array.isArray(card.banned) && card.banned.length === 3, `Taboo card needs exactly three banned words: ${pack} #${index + 1}`);
    card.banned.forEach((value, bannedIndex) => assertSafeText(value, `taboo/${pack} #${index + 1} banned ${bannedIndex + 1}`, { minimum: 2, maximum: 50 }));
    const banned = card.banned.map(canonicalText);
    assert.equal(new Set(banned).size, 3, `Taboo banned words must be distinct: ${pack} #${index + 1}`);
    assert.ok(!banned.includes(canonicalText(card.word)), `Taboo target may not also be banned: ${pack} #${index + 1}`);
  }
}

for (const pack of catalog.getPackNames('question-imposter')) {
  for (const [index, pair] of catalog.content['question-imposter'][pack].entries()) {
    assert.ok(pair && typeof pair === 'object' && !Array.isArray(pair), `Question Imposter pair malformed: ${pack} #${index + 1}`);
    assertSafeText(pair.main, `question-imposter/${pack} #${index + 1} main`, { minimum: 8, maximum: 180 });
    assertSafeText(pair.imposter, `question-imposter/${pack} #${index + 1} imposter`, { minimum: 8, maximum: 180 });
    assert.notEqual(canonicalText(pair.main), canonicalText(pair.imposter), `Question Imposter questions must differ: ${pack} #${index + 1}`);
  }
}

for (const pack of catalog.getPackNames('location-spy')) assertUniqueItems(catalog.content['location-spy'][pack], `location-spy/${pack}`);
for (const pack of catalog.getPackNames('mafia')) assertUniqueItems(catalog.content.mafia[pack], `mafia/${pack}`);
assert.deepEqual(catalog.content.mafia.Schnell, ['Mafia', 'Detektiv', 'Dorfbewohner']);
assert.deepEqual(catalog.content.mafia.Klassisch, ['Mafia', 'Detektiv', 'Arzt', 'Dorfbewohner']);
assert.deepEqual(catalog.content.mafia.Erweitert, ['Mafia', 'Detektiv', 'Arzt', 'Beschützer', 'Dorfbewohner']);

for (const pack of catalog.getPackNames('word-chain')) {
  assert.ok(catalog.content['word-chain'][pack].length >= 10, `Word Chain release pack too small: ${pack}`);
  for (const letter of catalog.content['word-chain'][pack]) assert.match(letter, /^\p{L}$/u, `Word Chain start must be one letter: ${pack}/${letter}`);
}

assert.ok(wordContent && wordContent.categories, 'Word Imposter content runtime missing.');
const wordCategories = Object.entries(wordContent.categories);
assert.equal(wordCategories.length, 14);
let wordImposterWords = 0;
const wordImposterTerms = [];
for (const [categoryId, category] of wordCategories) {
  assertSafeText(category.label, `Word Imposter category label ${categoryId}`, { minimum: 2, maximum: 60 });
  assert.ok(Array.isArray(category.entries) && category.entries.length === 12, `Word Imposter category must contain 12 entries: ${categoryId}`);
  const words = [];
  for (const [index, entry] of category.entries.entries()) {
    assert.ok(Array.isArray(entry) && entry.length === 2, `Word Imposter entry malformed: ${categoryId} #${index + 1}`);
    assertSafeText(entry[0], `Word Imposter ${categoryId} word ${index + 1}`, { minimum: 2, maximum: 60 });
    assertSafeText(entry[1], `Word Imposter ${categoryId} context ${index + 1}`, { minimum: 2, maximum: 60 });
    words.push(entry[0]);
    wordImposterTerms.push(canonicalText(entry[0]));
    wordImposterWords += 1;
  }
  assertUniqueItems(words, `Word Imposter/${categoryId}`);
}
assert.equal(wordImposterWords, 168);
for (const removed of ['Bluetooth', 'Oscar', 'Formel 1']) {
  assert.ok(!wordImposterTerms.includes(canonicalText(removed)), `Unnecessary concrete reference returned to Word Imposter core: ${removed}`);
}
for (const generic of ['Funkverbindung', 'Filmpreis', 'Motorsport']) {
  assert.ok(wordImposterTerms.includes(canonicalText(generic)), `Generic Word Imposter replacement missing: ${generic}`);
}

console.log(JSON.stringify({
  coreContentQuality: 'PASS', coreGames: expectedCore.length, ageContract: expectedAges,
  hardMinimums, quantitativeTargetsMet: true, privateDevicePromptsRemoved: true,
  unnecessaryCoreReferenceTermsRemoved: true,
  coreReleaseContentVersion: releaseContent.coreReleaseContentVersion,
  coreReleaseContentGames: releaseContent.coreReleaseContentGames,
  coreClassicContentVersion: classicContent.coreClassicContentVersion,
  coreClassicContentGames: classicContent.coreClassicContentGames,
  editorialReplacementCount: classicContent.editorialReplacementCount,
  wordImposterCategories: wordCategories.length, wordImposterWords,
  routedCoreItemsExcludingWordImposter: routedCoreItems, truthDareCards: 96,
  structuredContentValidated: ['truth-dare', 'would-rather', 'taboo', 'question-imposter', 'location-spy', 'mafia', 'word-chain'],
  markupRejected: true, exactNormalizedDuplicatesRejected: true, editorialDepthShortfalls
}, null, 2));
