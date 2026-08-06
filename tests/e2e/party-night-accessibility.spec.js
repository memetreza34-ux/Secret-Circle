const { test, expect } = require('@playwright/test');

async function plannerIssues(page) {
  return page.evaluate(() => {
    const issues = [];
    const planner = document.querySelector('#party-night-planner');
    if (!planner) return ['Party-Night-Planer fehlt.'];
    const ids = [...planner.querySelectorAll('[id]')].map(node => node.id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicates.length) issues.push(`Doppelte IDs: ${[...new Set(duplicates)].join(', ')}`);
    for (const control of planner.querySelectorAll('input, select, textarea')) {
      if (!(control.labels?.length || control.getAttribute('aria-label') || control.getAttribute('aria-labelledby'))) {
        issues.push(`Unbeschriftetes Feld: ${control.id}`);
      }
    }
    for (const button of planner.querySelectorAll('button')) {
      if (!(button.textContent || button.getAttribute('aria-label') || '').trim()) issues.push('Unbenannte Schaltfläche.');
    }
    const overflow = document.documentElement.scrollWidth - window.innerWidth;
    if (overflow > 2) issues.push(`Horizontaler Überlauf: ${overflow}px`);
    return issues;
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/party.html');
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika', 'Lina'],
      favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
  });
  await page.reload();
});

test('Party Night planner has labelled controls keyboard focus and a single current step', async ({ page }) => {
  expect(await plannerIssues(page)).toEqual([]);
  await page.locator('#party-night-duration').focus();
  await expect(page.locator('#party-night-duration')).toBeFocused();
  await page.locator('#party-night-duration').selectOption('30');
  await page.getByRole('button', { name: 'Plan erstellen' }).focus();
  await page.keyboard.press('Enter');

  await expect(page.locator('.party-night-step')).toHaveCount(2);
  await expect(page.locator('[aria-current="step"]')).toHaveCount(1);
  expect(await plannerIssues(page)).toEqual([]);
  const firstOpen = page.locator('.party-night-step').first().getByRole('button', { name: 'Öffnen' });
  await firstOpen.focus();
  await expect(firstOpen).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#game-detail')).toBeVisible();
});

test('Party Night controls remain at least 44 pixels on mobile without overflow', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Nur für mobile Playwright-Projekte relevant.');
  await page.locator('#party-night-duration').selectOption('30');
  await page.getByRole('button', { name: 'Plan erstellen' }).click();
  const audit = await page.evaluate(() => {
    const nodes = [...document.querySelectorAll('#party-night-planner button, #party-night-planner select')];
    const undersized = nodes.filter(node => {
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
    }).map(node => node.id || node.textContent.trim());
    return {
      undersized,
      overflow: document.documentElement.scrollWidth - window.innerWidth
    };
  });
  expect(audit.undersized).toEqual([]);
  expect(audit.overflow).toBeLessThanOrEqual(2);
});

test('Party Night disables planner motion when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.locator('#party-night-duration').selectOption('30');
  await page.getByRole('button', { name: 'Plan erstellen' }).click();
  const durations = await page.evaluate(() => {
    const progress = getComputedStyle(document.querySelector('.party-night-progress span'));
    const card = getComputedStyle(document.querySelector('.game-card'));
    return [progress.transitionDuration, card.transitionDuration];
  });
  expect(durations.every(value => value === '0s' || value === '0ms')).toBe(true);
});
