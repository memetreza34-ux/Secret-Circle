const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('all built-in category packs satisfy content quality gates', async ({ page }) => {
  const audit = await page.evaluate(() => {
    const { words, labels } = window.SecretCircleContent;
    const issues = [];
    let totalTerms = 0;

    for (const [id, entries] of Object.entries(words)) {
      if (!labels[id]) issues.push(`Fehlendes Label für ${id}`);
      if (!Array.isArray(entries) || entries.length < 12) issues.push(`Zu wenige Begriffe in ${id}`);
      const seen = new Set();
      for (const entry of entries || []) {
        totalTerms += 1;
        if (!Array.isArray(entry) || entry.length !== 2) {
          issues.push(`Ungültiger Eintrag in ${id}`);
          continue;
        }
        const [word, hint] = entry.map(value => String(value).trim());
        const key = word.toLocaleLowerCase('de-DE');
        if (!word || word.length > 60) issues.push(`Ungültiger Begriff in ${id}: ${word}`);
        if (!hint || hint.length > 60) issues.push(`Ungültiger Hinweis in ${id}: ${hint}`);
        if (/[<>]/.test(word + hint)) issues.push(`Markup in ${id}: ${word}`);
        if (seen.has(key)) issues.push(`Doppelter Begriff in ${id}: ${word}`);
        seen.add(key);
      }
    }

    for (const id of Object.keys(labels)) {
      if (!words[id]) issues.push(`Label ohne Kategorie: ${id}`);
    }

    return {
      issues,
      categoryCount: Object.keys(words).length,
      labelCount: Object.keys(labels).length,
      totalTerms
    };
  });

  expect(audit.issues).toEqual([]);
  expect(audit.categoryCount).toBe(14);
  expect(audit.labelCount).toBe(14);
  expect(audit.totalTerms).toBe(168);
  await expect(page.locator('#category option')).toHaveCount(15);
});

test('every built-in category can create a valid deterministic game', async ({ page }) => {
  const results = await page.evaluate(() => {
    const output = [];
    for (const [id, entries] of Object.entries(window.SecretCircleContent.words)) {
      const first = window.SecretCircleEngine.createGame({
        players: ['Alex', 'Sam', 'Mika', 'Lina'],
        entries,
        category: window.SecretCircleContent.labels[id],
        imposterCount: 1,
        useHint: true,
        roundSeconds: 60,
        matchRounds: 1,
        seed: `content-${id}`
      });
      const second = window.SecretCircleEngine.createGame({
        players: ['Alex', 'Sam', 'Mika', 'Lina'],
        entries,
        category: window.SecretCircleContent.labels[id],
        imposterCount: 1,
        useHint: true,
        roundSeconds: 60,
        matchRounds: 1,
        seed: `content-${id}`
      });
      output.push({
        id,
        valid: first.word === second.word && first.imposters.join('|') === second.imposters.join('|'),
        word: first.word,
        hint: first.hint
      });
    }
    return output;
  });

  expect(results).toHaveLength(14);
  expect(results.every(result => result.valid && result.word && result.hint)).toBe(true);
});
