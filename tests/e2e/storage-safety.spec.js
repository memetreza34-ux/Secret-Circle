const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
});

test('malformed local JSON is discarded without breaking startup', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('secret-circle-custom-v7', '{not-json');
    localStorage.setItem('secret-circle-history-v7', 'null');
    localStorage.setItem('secret-circle-settings-v7', '[]');
    localStorage.setItem('secret-circle-active-v7', '{broken');
  });
  await page.reload();

  await expect(page.locator('#setup-screen')).toBeVisible();
  await expect(page.locator('#start')).toBeEnabled();
  await expect(page.locator('#resume-box')).toBeHidden();
});

test('stored custom categories from older versions are neither offered nor rendered', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('secret-circle-custom-v7', JSON.stringify([{
      id: 'unsafe-category',
      name: '<img src=x onerror=window.__xss=true>',
      entries: [
        { word: '<svg onload=window.__xss=true>', hint: 'Hinweis' },
        { word: 'Sicher', hint: 'Test' }
      ]
    }]));
    localStorage.setItem('secret-circle-settings-v7', JSON.stringify({ category: 'custom:unsafe-category' }));
  });
  await page.reload();

  await expect(page.locator('#setup-screen')).toBeVisible();
  await expect(page.locator('#category')).toHaveValue('all');
  await expect(page.locator('#category option[value^="custom:"]')).toHaveCount(0);
  await expect(page.locator('#setup-screen img, #setup-screen svg, #setup-screen script')).toHaveCount(0);
  expect(await page.evaluate(() => window.__xss)).toBeUndefined();
});
