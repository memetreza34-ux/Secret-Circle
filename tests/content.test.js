'use strict';
const assert = require('node:assert/strict');

const previous = globalThis.SecretCircleContent;
delete globalThis.SecretCircleContent;
require('../word-packs.js');
const content = globalThis.SecretCircleContent;
if (previous !== undefined) globalThis.SecretCircleContent = previous;
else delete globalThis.SecretCircleContent;

assert.ok(content && typeof content === 'object');
assert.equal(content.version, 1);
assert.equal(Object.isFrozen(content), true);

const categoryIds = Object.keys(content.categories);
assert.equal(categoryIds.length, 14);
assert.equal(new Set(categoryIds).size, categoryIds.length);
assert.deepEqual(Object.keys(content.words), categoryIds);
assert.deepEqual(Object.keys(content.labels), categoryIds);

let totalTerms = 0;
const globalOccurrences = new Map();
for (const id of categoryIds) {
  const category = content.categories[id];
  const label = content.labels[id];
  const entries = content.words[id];

  assert.equal(category.label, label);
  assert.equal(category.entries, entries);
  assert.ok(typeof label === 'string' && label.trim().length >= 2 && label.length <= 40);
  assert.ok(Array.isArray(entries));
  assert.equal(entries.length, 12, `${label} should contain exactly 12 terms.`);

  const localTerms = new Set();
  for (const entry of entries) {
    assert.ok(Array.isArray(entry) && entry.length === 2);
    const [word, hint] = entry;
    assert.equal(typeof word, 'string');
    assert.equal(typeof hint, 'string');
    assert.equal(word, word.trim());
    assert.equal(hint, hint.trim());
    assert.ok(word.length >= 2 && word.length <= 60, `Invalid word length: ${word}`);
    assert.ok(hint.length >= 2 && hint.length <= 60, `Invalid hint length: ${hint}`);
    assert.ok(!/[<>]/.test(word), `Markup-like character in word: ${word}`);
    assert.ok(!/[<>]/.test(hint), `Markup-like character in hint: ${hint}`);
    assert.notEqual(word.toLocaleLowerCase('de-DE'), hint.toLocaleLowerCase('de-DE'), `Hint repeats word: ${word}`);

    const key = word.toLocaleLowerCase('de-DE');
    assert.ok(!localTerms.has(key), `Duplicate term in ${label}: ${word}`);
    localTerms.add(key);
    globalOccurrences.set(key, [...(globalOccurrences.get(key) || []), id]);
    totalTerms += 1;
  }
}

assert.equal(totalTerms, 168);
const crossCategoryDuplicates = [...globalOccurrences.entries()]
  .filter(([, ids]) => ids.length > 1)
  .map(([word, ids]) => ({ word, categories: ids }));
for (const duplicate of crossCategoryDuplicates) {
  assert.ok(duplicate.categories.length <= 2, `Term appears in too many categories: ${duplicate.word}`);
}

for (const required of ['alltag', 'schule', 'technik', 'essen', 'reisen', 'filme', 'sport', 'musik', 'gaming', 'anime', 'orte', 'berufe', 'tiere', 'internet']) {
  assert.ok(categoryIds.includes(required), `Required category missing: ${required}`);
}

console.log(JSON.stringify({
  ok: true,
  contentVersion: content.version,
  categories: categoryIds.length,
  totalTerms,
  termsPerCategory: 12,
  uniqueWithinCategories: true,
  safeTextOnlyContent: true,
  exactWordHintDuplicates: 0,
  crossCategoryDuplicates
}, null, 2));
