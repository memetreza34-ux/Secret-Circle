'use strict';

const assert = require('node:assert/strict');
const catalog = require('../party-wave-one-clue-catalog.js');
const release = require('../party-release-structure.js');

const allowedAges = new Set(['all', 'teen', 'adult']);
const contentlessModes = new Set(['utility', 'random-player']);
const disclosurePrompts = [
  /lies\s+(?:deine\s+)?letzte\s+(?:private\s+)?nachricht/i,
  /zeig(?:e)?\s+(?:deine\s+)?kamerarolle/i,
  /öffne\s+(?:deine\s+)?(?:privaten?\s+)?chats?/i,
  /zeig(?:e)?\s+(?:dein\s+)?passwort/i,
  /nenne\s+(?:deine\s+)?(?:private\s+)?adresse/i,
  /öffne\s+(?:deine\s+)?fotos/i
];
const waveOneLabs = [
  'bluff-trivia', 'party-quiz', 'fact-or-fake', 'percent-guess',
  'fill-blank-battle', 'who-wrote-it', 'party-bracket',
  'undercover-similar-word', 'no-word-imposter', 'password-one-word'
];

function normalizeText(value) {
  return String(value ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ');
}

function canonical(value) {
  if (typeof value === 'string') return normalizeText(value).toLocaleLowerCase('de-DE');
  if (Array.isArray(value)) return `[${value.map(canonical).join('|')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${key}:${canonical(value[key])}`).join('|')}}`;
  }
  return String(value);
}

function collectStrings(value, output = []) {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach(item => collectStrings(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach(item => collectStrings(item, output));
  return output;
}

function assertSafeText(value, context) {
  const text = normalizeText(value);
  assert.ok(text.length >= 1, `${context} contains empty text.`);
  assert.ok(text.length <= 280, `${context} is unexpectedly long (${text.length}).`);
  assert.doesNotMatch(text, /<\s*\/?\s*(script|style|iframe|object|embed|svg|img|video|audio|link|meta|form)\b/i, `${context} contains HTML/script markup.`);
  assert.doesNotMatch(text, /\bon\w+\s*=/i, `${context} contains an inline event-handler pattern.`);
  for (const pattern of disclosurePrompts) {
    assert.doesNotMatch(text, pattern, `${context} requests private-device disclosure: ${pattern}`);
  }
}

function flattenItems(value) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap(flattenItems);
}

const tierCounts = release.counts(catalog.games);
assert.deepEqual(tierCounts, { core: 15, extended: 13, labs: 27 });
assert.equal(catalog.games.length, 55);
assert.equal(new Set(catalog.games.map(game => game.id)).size, 55);
assert.equal(catalog.waveOneGameIds.length, 10);
assert.deepEqual(new Set(catalog.waveOneGameIds), new Set(waveOneLabs));

const nonCoreGames = catalog.games.filter(game => release.tierFor(game) !== 'core');
const extendedGames = nonCoreGames.filter(game => release.tierFor(game) === 'extended');
const labGames = nonCoreGames.filter(game => release.tierFor(game) === 'labs');
assert.equal(nonCoreGames.length, 40);
assert.equal(extendedGames.length, 13);
assert.equal(labGames.length, 27);
assert.deepEqual(new Set(labGames.map(game => game.id)), new Set(release.labIds));
for (const id of waveOneLabs) {
  assert.equal(release.tierFor(catalog.getGame(id)), 'labs', `${id} must remain Labs before real promotion evidence.`);
}

const contentDriven = [];
const contentless = [];
let packsChecked = 0;
let itemsChecked = 0;
let stringsChecked = 0;

for (const game of nonCoreGames) {
  const tier = release.tierFor(game);
  assert.ok(game && typeof game === 'object', `Invalid ${tier} game object.`);
  assert.equal(typeof game.id, 'string', `${tier} game id must be text.`);
  assert.ok(game.id.length >= 2, `${game.id} has invalid id.`);
  assertSafeText(game.title, `${game.id} title`);
  assertSafeText(game.description, `${game.id} description`);
  assert.ok(game.description.length >= 20, `${game.id} description is too shallow.`);
  assert.ok(Array.isArray(game.instructions) && game.instructions.length >= 3 && game.instructions.length <= 5, `${game.id} must have 3–5 instructions.`);
  game.instructions.forEach((instruction, index) => assertSafeText(instruction, `${game.id} instruction ${index + 1}`));
  assert.ok(allowedAges.has(game.age), `${game.id} has unsupported age level: ${game.age}`);
  assert.ok(Number.isInteger(game.minPlayers) && game.minPlayers >= 1, `${game.id} minPlayers invalid.`);
  assert.ok(Number.isInteger(game.maxPlayers) && game.maxPlayers >= game.minPlayers, `${game.id} maxPlayers invalid.`);
  assert.ok(Number.isFinite(game.duration) && game.duration > 0 && game.duration <= 180, `${game.id} duration invalid.`);
  assert.equal(game.status, 'playable', `${game.id} is in release catalog but is not technically playable.`);

  if (game.mode === 'link') {
    assert.equal(typeof game.href, 'string', `${game.id} link mode needs href.`);
    assert.match(game.href, /^(?:index|advanced|quick-play)\.html(?:\?game=[a-z0-9-]+)?$/i, `${game.id} must route to a local app page.`);
    assert.doesNotMatch(game.href, /^https?:/i, `${game.id} may not route to an external runtime URL.`);
  }

  const packNames = catalog.getPackNames(game.id);
  if (contentlessModes.has(game.mode)) {
    contentless.push(game.id);
    continue;
  }

  contentDriven.push(game.id);
  assert.ok(Array.isArray(game.packs) && game.packs.length >= 1, `${game.id} needs pack metadata.`);
  assert.deepEqual(packNames, game.packs, `${game.id} pack metadata/content drift.`);
  assert.ok(packNames.length >= 1, `${game.id} needs at least one content pack.`);

  for (const pack of packNames) {
    const raw = catalog.content?.[game.id]?.[pack];
    assert.notEqual(raw, undefined, `${game.id}/${pack} content missing.`);
    const items = catalog.getItems(game.id, pack);
    assert.ok(Array.isArray(items), `${game.id}/${pack} must resolve to an item list.`);
    assert.ok(items.length >= 6, `${game.id}/${pack} is too small for a release candidate (${items.length} < 6).`);
    const normalizedItems = items.map(canonical);
    assert.equal(new Set(normalizedItems).size, normalizedItems.length, `${game.id}/${pack} contains exact normalized duplicates.`);
    packsChecked += 1;
    itemsChecked += items.length;

    const strings = collectStrings(raw);
    assert.ok(strings.length >= items.length, `${game.id}/${pack} yielded unexpectedly little text.`);
    strings.forEach((text, index) => assertSafeText(text, `${game.id}/${pack} text ${index + 1}`));
    stringsChecked += strings.length;
  }
}

assert.deepEqual(new Set(contentless), new Set(['spin-bottle', 'dice-coin']));
assert.equal(contentDriven.length, 38);
assert.ok(packsChecked >= 90, `Expected broad non-core pack coverage, got ${packsChecked}.`);
assert.ok(itemsChecked >= 600, `Expected broad non-core item coverage, got ${itemsChecked}.`);

console.log(JSON.stringify({
  extendedLabsContentQuality: 'PASS',
  releaseTiers: tierCounts,
  totalBuiltIns: catalog.games.length,
  nonCoreGames: nonCoreGames.length,
  extendedIds: extendedGames.map(game => game.id),
  labIds: labGames.map(game => game.id),
  waveOneLabs,
  waveOneCovered: catalog.waveOneGameIds.length,
  contentDrivenGames: contentDriven.length,
  contentlessUtilityGames: contentless,
  packsChecked,
  itemsChecked,
  stringsChecked,
  duplicateGate: true,
  privateDisclosurePromptGate: true,
  markupGate: true,
  internalRoutingGate: true
}, null, 2));
