'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const Memory = require('../card-memory.js');
const Engine = require('../game-engine.js');
const context = vm.createContext({});
for (const file of ['word-packs.js', 'word-packs-extra.js']) vm.runInContext(fs.readFileSync(file, 'utf8'), context);
const content = context.SecretCircleContent;
const fold = value => value.normalize('NFKD').toLocaleLowerCase('de-DE').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss').replace(/[^a-z0-9]/g, '');
const globalWords = new Set();
const prints = new Map();
let total = 0;
for (const [id, entries] of Object.entries(content.words)) {
  assert.ok(entries.length >= 160, id + ': ausreichend neue Begriffe');
  const local = new Set();
  for (const [word, hint] of entries) {
    assert.ok(word.trim() === word && hint.trim() === hint);
    assert.ok(word.length >= 2 && word.length <= 60 && hint.length >= 2 && hint.length <= 60);
    assert.ok(!/[<>]/.test(word + hint));
    assert.ok(!fold(word).includes(fold(hint)) && !fold(hint).includes(fold(word)), word + ': Hilfswort verrät den Begriff');
    const key = word.normalize('NFKC').toLocaleLowerCase('de-DE');
    assert.ok(!local.has(key), id + ': doppelt ' + word);
    local.add(key);
    globalWords.add(key);
    const print = Memory.fingerprint(key);
    assert.ok(!prints.has(print) || prints.get(print) === key, 'Wortprüfsummen kollidieren');
    prints.set(print, key);
    total++;
  }
}
assert.equal(total, 2629);
const sizes = Object.values(content.words).map(entries => entries.length);
assert.ok(globalWords.size > 2500);
assert.ok(Memory.maximumWords > globalWords.size + 50 * 200, 'auch mit maximalen eigenen Kategorien genügend Wortgedächtnis');
// Ein mehrfach geladenes Paket verdoppelt keine Wörter.
vm.runInContext(fs.readFileSync('word-packs-extra.js', 'utf8'), context);
assert.deepEqual(Object.values(content.words).map(entries => entries.length), sizes);

const values = new Map();
const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
const entries = Array.from({ length: 360 }, (_, index) => ({ word: `Begriff ${index}`, hint: `Thema ${index % 8}` }));
const options = { storage };
const available = entries.map((_, index) => index);
const picks = [];
// Drei vollständige Durchgänge; jedes Mal neue Modulinstanz wie nach App-Neustart.
for (let round = 0; round < entries.length * 3; round++) {
  delete require.cache[require.resolve('../card-memory.js')];
  const Reloaded = require('../card-memory.js');
  picks.push(Reloaded.chooseWord(entries, available, () => 0, options));
}
for (let cycle = 0; cycle < 3; cycle++) {
  assert.equal(new Set(picks.slice(cycle * entries.length, (cycle + 1) * entries.length)).size, entries.length);
}
assert.notEqual(picks[359], picks[360]);
const raw = values.get(Memory.storageKey);
assert.ok(!raw.includes('Begriff') && !raw.includes('Thema'));
// Auch viele andere gespielte Modi dürfen den Wortbereich nicht verdrängen.
for (let game = 0; game < Memory.maximumScopes + 10; game++) {
  Memory.choose({ gameId: `anderes-spiel-${game}` }, ['Testkarte'], [0], () => 0, options);
}
assert.equal(Object.keys(Memory.read(storage).scopes).length, Memory.maximumScopes);
assert.equal(Memory.read(storage).scopes['word-imposter|alle|'].seen.length, entries.length);
// Ein anderes Hilfswort / eine andere Kategorie macht dasselbe Wort nicht neu.
const repeated = entries.map(entry => [entry.word.toUpperCase(), 'Anderer Hinweis']);
const freshWords = [...repeated, ['Unbekannt', 'Neu']];
assert.equal(Memory.chooseWord(freshWords, freshWords.map((_, i) => i), () => 0, options), 360);
// Gezielte Kategorie: Auswahl überschreitet niemals den freigegebenen Vorrat.
assert.equal(Memory.chooseWord(entries, [3], () => 0, options), 3);
// Leerer, gesperrter und voller Speicher sowie manipulierte Zufallswerte bleiben spielbar.
assert.equal(Memory.chooseWord(entries, [], () => 0, options), undefined);
assert.equal(Memory.chooseWord(entries, [7, 8], () => NaN, { storage: null }), 7);
const blocked = { getItem() { throw Error('gesperrt'); }, setItem() { throw Error('voll'); } };
assert.equal(Memory.chooseWord(entries, [7, 8], () => 1, { storage: blocked }), 8);
// Die bevorzugte Themenabwechslung darf ungespielte Wörter nicht überspringen.
const varietyStore = new Map();
const varietyStorage = { getItem: k => varietyStore.get(k) ?? null, setItem: (k, v) => varietyStore.set(k, v) };
const varied = [['Apfel', 'Obst'], ['Birne', 'Obst'], ['Hammer', 'Werkzeug'], ['Boot', 'Unterwegs']];
const variedPicks = Array.from({ length: 4 }, () => Memory.chooseWord(varied, [0, 1, 2, 3], () => 0, { storage: varietyStorage }));
assert.deepEqual(variedPicks, [0, 2, 3, 1]);
// Auswahl läuft durch die echte Engine, aber Rollen, Einstellungen und zulässige Begriffe bleiben erhalten.
const gameOptions = { players: ['Alex', 'Sam', 'Mika'], entries, category: 'Test', hintLevel: 'hard', seed: 'gleich' };
const normal = Engine.createGame(gameOptions);
const selected = Engine.createGame({ ...gameOptions, chooseWordIndex: () => 17 });
assert.equal(selected.word, 'Begriff 17');
assert.equal(selected.hintLevel, 'hard');
assert.deepEqual(selected.imposters, normal.imposters);
assert.deepEqual(selected.revealOrder, normal.revealOrder);
assert.equal(Engine.createGame({ ...gameOptions, chooseWordIndex: () => 9999 }).word, normal.word);
let calls = 0;
assert.throws(() => Engine.createGame({ ...gameOptions, players: ['Alex'], chooseWordIndex: () => calls++ }));
assert.equal(calls, 0, 'Ungültige Einrichtung verbraucht kein Wort');
console.log(JSON.stringify({ ok: true, total, uniqueWords: globalWords.size, restartSafeCycles: 3, cycleSize: 360 }));
