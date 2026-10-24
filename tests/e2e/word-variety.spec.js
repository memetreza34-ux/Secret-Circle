'use strict';
const { test, expect } = require('@playwright/test');

test('Word Imposter: 24 neue Partien inklusive Neustart und Kategorienwechsel ohne Wiederholung', async ({ page }) => {
  await page.goto('/word-imposter.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator('#players').fill('Alex\nSam\nMika');
  page.on('dialog', dialog => dialog.accept());
  const words = [];
  for (let round = 0; round < 24; round++) {
    if (round === 8 || round === 16) {
      await page.reload();
      await expect(page.locator('#setup-screen')).toBeVisible();
    }
    await page.locator('#category-open').click();
    const label = round < 12 ? 'Alltag' : 'Gemischt';
    await page.locator('.category-row').filter({ has: page.locator('.category-name', { hasText: new RegExp(`^${label}$`) }) }).click();
    await page.locator('#start').click();
    await expect(page.locator('#reveal-screen')).toBeVisible();
    const state = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-active-v7')));
    expect(words).not.toContain(state.word);
    words.push(state.word);
    expect(state.category).toBe(label);
    expect(state.players).toEqual(['Alex', 'Sam', 'Mika']);
    await expect(page.locator('#secret')).toBeHidden();
    if (round === 0) {
      const memoryBefore = await page.evaluate(() => localStorage.getItem('secret-circle-card-memory-v1'));
      await page.reload();
      await page.getByRole('button', { name: 'Fortsetzen', exact: true }).click();
      expect(await page.evaluate(() => localStorage.getItem('secret-circle-card-memory-v1'))).toBe(memoryBefore);
      await expect(page.locator('#secret')).toBeHidden();
    }
    await page.locator('#reveal-screen [data-new-game]').click();
  }
  const saved = await page.evaluate(() => localStorage.getItem('secret-circle-card-memory-v1'));
  for (const word of words) expect(saved).not.toContain(word);
  expect(new Set(words).size).toBe(24);
});

test('Word Imposter: lokales Zusatzpaket ist geladen, Quellen und Lizenz sind erreichbar', async ({ page, request }) => {
  await page.goto('/word-imposter.html');
  const counts = await page.evaluate(() => Object.values(window.SecretCircleContent.words).map(entries => entries.length));
  expect(counts.reduce((sum, count) => sum + count, 0)).toBe(2629);
  expect(Math.min(...counts)).toBeGreaterThanOrEqual(160);
  await page.goto('/privacy.html');
  for (const label of ['LGPL 2.1 oder neuer', 'bearbeitbare Wortauswahl', 'Quellen- und Änderungsnachweis']) {
    const href = await page.getByRole('link', { name: label, exact: true }).getAttribute('href');
    const response = await request.get('/' + href);
    expect(response.ok()).toBeTruthy();
    expect((await response.body()).length).toBeGreaterThan(1000);
  }
});
