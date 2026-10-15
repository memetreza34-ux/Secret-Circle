'use strict';

const { test, expect } = require('@playwright/test');

/* Regression for the former app entry: index.html used to be Word Imposter.
   A saved game must now be discoverable through the canonical Party Hub
   without exposing its secret while crossing routes or resuming. */
test('legacy Word Imposter round survives the new root and resumes concealed', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('/word-imposter.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.locator('#players').fill('Alex\nSam\nMika');
  await page.locator('#start').click();
  await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
  await expect(page.locator('#secret')).toBeVisible();

  const saved = await page.evaluate(() => {
    const active = JSON.parse(localStorage.getItem('secret-circle-active-v7'));
    return { seed: active.seed, word: active.word, players: active.players };
  });
  expect(saved.word).toBeTruthy();
  expect(saved.players).toEqual(['Alex', 'Sam', 'Mika']);

  // Old saved sessions still exist when the former /index.html entry becomes the Hub.
  await page.goto('/');
  await expect(page.locator('[data-screen="home"]')).toBeVisible();
  await expect(page.locator('#secret')).toHaveCount(0);
  await expect(page.locator('#resume-slot')).toBeEmpty();

  await page.getByRole('tab', { name: 'Profil' }).click();
  const resume = page.locator('#resume-slot .resume');
  await expect(resume).toHaveCount(1);
  await expect(resume).toContainText('Word Imposter');
  await expect(resume.locator('.resume-go')).toHaveAttribute('href', 'word-imposter.html');
  await expect(resume).not.toContainText(saved.word);

  await resume.locator('.resume-go').click();
  await expect(page).toHaveURL(/\/word-imposter\.html$/);
  await expect(page.locator('#resume-box')).toBeVisible();
  await expect(page.locator('#secret')).toBeHidden();

  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#reveal-screen')).toBeVisible();
  await expect(page.locator('#secret')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Geheime Karte anzeigen' })).toBeVisible();

  const restored = await page.evaluate(() => {
    const active = JSON.parse(localStorage.getItem('secret-circle-active-v7'));
    return { seed: active.seed, word: active.word, players: active.players };
  });
  expect(restored).toEqual(saved);
  expect(errors).toEqual([]);
});

/* A physical Back button can restore a page from the back/forward cache,
   without rerunning the game's initial setup. Secrets must remain concealed
   whether the browser restores the document or reloads it. */
test('browser history return keeps an exposed Word Imposter card concealed', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('/word-imposter.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator('#players').fill('Alex\\nSam\\nMika');
  await page.locator('#start').click();
  await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
  await expect(page.locator('#secret')).toBeVisible();
  await expect(page.locator('#role')).not.toBeEmpty();

  await page.locator('.back-link').click();
  await expect(page).toHaveURL(/\\/v2-hub\\.html$/);
  await expect(page.locator('[data-screen="home"]')).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\\/word-imposter\\.html$/);
  await expect(page.locator('#secret')).toBeHidden();
  await expect(page.locator('#role')).toBeEmpty();
  await expect(page.locator('#word')).toBeEmpty();
  await expect(page.locator('#hint-text')).toBeEmpty();

  // Reloads show the saved-game offer; BFCache restores may show the game.
  if (await page.locator('#resume-box').isVisible()) {
    await page.getByRole('button', { name: 'Fortsetzen' }).click();
    await expect(page.locator('#reveal-screen')).toBeVisible();
    await expect(page.locator('#secret')).toBeHidden();
  }
  expect(errors).toEqual([]);
});
