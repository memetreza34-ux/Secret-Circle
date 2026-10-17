'use strict';

const assert = require('node:assert/strict');
const Memory = require('../card-memory.js');

function storage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: key => (values.has(key) ? values.get(key) : null),
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
    raw: key => values.get(key) ?? null
  };
}

const sequence = (...values) => { let index = 0; return () => values[index++ % values.length]; };
const all = items => items.map((_, index) => index);
const items = ['Pinguin', 'Kaffeetasse', 'Regenschirm', 'Fahrrad', 'Leuchtturm', 'Zahnbürste'];
const scope = { gameId: 'draw-guess', pack: 'Alltag' };

assert.equal(Memory.version, 1);
assert.equal(Memory.storageKey, 'secret-circle-card-memory-v1');
assert.equal(Memory.scopeKey(scope), 'draw-guess|Alltag|');
assert.equal(Memory.scopeKey({}), '');
assert.equal(Memory.fingerprint('Pinguin'), Memory.fingerprint('Pinguin'));
assert.notEqual(Memory.fingerprint('Pinguin'), Memory.fingerprint('Pinguine'));

// Session 1 zieht drei Karten; Session 2 bekommt zuerst die drei anderen.
const store = storage();
const first = [];
let used = [];
for (let round = 0; round < 3; round += 1) {
  const index = Memory.choose(scope, items, all(items).filter(i => !used.includes(i)), () => 0, { storage: store });
  used.push(index);
  first.push(index);
}
used = [];
const second = [];
for (let round = 0; round < 3; round += 1) {
  const index = Memory.choose(scope, items, all(items).filter(i => !used.includes(i)), () => 0, { storage: store });
  used.push(index);
  second.push(index);
}
assert.equal(new Set([...first, ...second]).size, 6, 'die zweite Session beginnt mit den noch nicht gesehenen Karten');

// Sind alle gesehen, kommt eine aus der älter gesehenen Hälfte, nie die zuletzt gezogene.
const oldestHalf = new Set(first);
for (let attempt = 0; attempt < 3; attempt += 1) {
  const copy = storage({ [Memory.storageKey]: store.raw(Memory.storageKey) });
  const pick = Memory.choose(scope, items, all(items), sequence(attempt), { storage: copy });
  assert.ok(oldestHalf.has(pick), `Rotation wählt aus der älteren Hälfte, nicht ${items[pick]}`);
}

// Gespeichert werden nur Prüfsummen, keine Kartentexte.
const saved = store.raw(Memory.storageKey);
for (const text of items) assert.ok(!saved.includes(text), `Kartentext ${text} darf nicht gespeichert werden`);
const parsed = JSON.parse(saved);
assert.equal(parsed.version, 1);
assert.deepEqual(Object.keys(parsed.scopes), ['draw-guess|Alltag|']);
assert.equal(parsed.scopes['draw-guess|Alltag|'].seen.length, 6);

// Kategorien und Pools sind getrennt.
const other = Memory.choose({ gameId: 'draw-guess', pack: 'Tiere' }, items, all(items), () => 0, { storage: store });
assert.equal(other, 0, 'eine andere Kategorie hat ein eigenes, leeres Gedächtnis');
assert.equal(Memory.scopeKey({ gameId: 'truth-dare', pack: 'Locker', pool: 'dare' }), 'truth-dare|Locker|dare');

// Nur Indizes aus `available` sind erlaubt.
assert.equal(Memory.choose(scope, items, [4], () => 0, { storage: storage() }), 4);
assert.equal(Memory.choose(scope, items, [], () => 0, { storage: storage() }), undefined);
assert.equal(Memory.choose(scope, items, [99, -1, 'x'], () => 0, { storage: storage() }), undefined);

// Kaputter oder fehlender Speicher: zufällige Wahl, kein Fehler.
for (const broken of ['nicht json', '{"version":2,"scopes":{}}', '{"version":1,"scopes":[]}', '{"version":1,"scopes":{"a|b|":{"seen":"x"}}}']) {
  const pick = Memory.choose(scope, items, all(items), () => 2, { storage: storage({ [Memory.storageKey]: broken }) });
  assert.equal(pick, 2, `kaputter Speicher wird ignoriert: ${broken}`);
}
const throwing = { getItem() { throw new Error('blockiert'); }, setItem() { throw new Error('voll'); } };
assert.equal(Memory.choose(scope, items, all(items), () => 1, { storage: throwing }), 1);
assert.equal(Memory.choose(scope, items, all(items), () => 3, { storage: null }), 3);

// Speicher bleibt begrenzt: höchstens maximumScopes Bereiche, die neuesten bleiben.
const crowded = storage();
let clock = 0;
for (let game = 0; game < Memory.maximumScopes + 10; game += 1) {
  Memory.choose({ gameId: `spiel-${game}`, pack: 'P' }, items, all(items), () => 0, { storage: crowded, now: () => ++clock });
}
const scopes = Object.keys(JSON.parse(crowded.raw(Memory.storageKey)).scopes);
assert.equal(scopes.length, Memory.maximumScopes);
assert.ok(scopes.includes(`spiel-${Memory.maximumScopes + 9}|P|`));
assert.ok(!scopes.includes('spiel-0|P|'));

console.log(JSON.stringify({
  ok: true,
  memoryVersion: Memory.version,
  secondSessionStartsFresh: true,
  rotationPrefersOlderHalf: true,
  storesFingerprintsOnly: true,
  scopesSeparatedByGamePackPool: true,
  brokenStorageFallsBackToRandom: true,
  boundedScopes: Memory.maximumScopes
}, null, 2));
