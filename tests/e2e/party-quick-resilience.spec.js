const { test, expect } = require('@playwright/test');

async function seedPlayers(page, players = ['Alex', 'Sam', 'Mika', 'Lina']) {
  await page.goto('/party.html');
  await page.evaluate(value => {
    localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
      version: 1,
      players: value,
      favorites: [],
      recent: [],
      presets: [],
      history: [],
      stats: {}
    }));
    localStorage.removeItem('secret-circle-party-quick-active-v1');
  }, players);
}

test('corrupted Quick Mode snapshots are ignored without breaking setup', async ({ page }) => {
  await seedPlayers(page);
  await page.evaluate(() => {
    localStorage.setItem('secret-circle-party-quick-active-v1', JSON.stringify({
      version: 1,
      gameId: 'wavelength',
      targetRounds: 999,
      round: -4,
      players: ['Alex', 'Alex'],
      totalScore: -100
    }));
  });
  await page.goto('/quick-play.html?game=wavelength');
  await expect(page.locator('#quick-setup')).toBeVisible();
  await expect(page.locator('#quick-resume-box')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Spiel starten' })).toBeEnabled();
});

test('malicious-looking player names stay text in Quick Mode results', async ({ page }) => {
  const malicious = '<img src=x onerror=window.__quickInjected=1>';
  await seedPlayers(page, [malicious, 'Sam', 'Mika']);
  await page.goto('/quick-play.html?game=caption-battle');
  await page.locator('#quick-rounds').selectOption('3');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  for (let round = 0; round < 3; round += 1) {
    await page.getByRole('button', { name: 'Captions sind bereit' }).click();
    await page.locator('#quick-controls select').selectOption(malicious);
    await page.getByRole('button', { name: 'Gewinner bestätigen' }).click();
  }
  await expect(page.locator('#quick-result')).toBeVisible();
  await expect(page.locator('#quick-result img')).toHaveCount(0);
  await expect(page.locator('#quick-result script')).toHaveCount(0);
  await expect(page.locator('#quick-result-text')).toContainText(malicious);
  expect(await page.evaluate(() => window.__quickInjected)).toBeUndefined();
});

test('Quick Mode setup and active round retain accessible labels and keyboard focus', async ({ page }) => {
  await seedPlayers(page);
  await page.goto('/quick-play.html?game=wavelength');
  const setupIssues = await page.evaluate(() => [...document.querySelectorAll('input, select, textarea')]
    .filter(control => !(control.labels?.length || control.getAttribute('aria-label') || control.getAttribute('aria-labelledby')))
    .map(control => control.id || control.type));
  expect(setupIssues).toEqual([]);

  await page.getByRole('button', { name: 'Spiel starten' }).focus();
  await expect(page.getByRole('button', { name: 'Spiel starten' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#quick-play')).toBeVisible();
  await page.getByRole('button', { name: 'Ziel verbergen und Gerät weitergeben' }).focus();
  await expect(page.getByRole('button', { name: 'Ziel verbergen und Gerät weitergeben' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('input[type="range"]')).toHaveAttribute('aria-label', /Teamposition/);
});

test('mobile Quick Mode controls meet touch and overflow gates', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Nur für mobile Projekte relevant.');
  await seedPlayers(page);
  await page.goto('/quick-play.html?game=rapid-fire');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  const audit = await page.evaluate(() => {
    const undersized = [...document.querySelectorAll('button, a, input, select, summary')]
      .filter(node => {
        if (node.closest('[hidden]')) return false;
        const style = getComputedStyle(node);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        const rect = node.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return false;
        return rect.width < 44 || rect.height < 44;
      })
      .map(node => node.id || node.textContent.trim().slice(0, 30));
    return {
      undersized,
      overflow: document.documentElement.scrollWidth - window.innerWidth
    };
  });
  expect(audit.undersized).toEqual([]);
  expect(audit.overflow).toBeLessThanOrEqual(2);
});

test('reduced motion disables Quick Mode transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await seedPlayers(page);
  await page.goto('/quick-play.html?game=wavelength');
  const durations = await page.evaluate(() => {
    const style = getComputedStyle(document.querySelector('#quick-progress-bar'));
    const seconds = value => value.split(',').map(part => {
      const item = part.trim();
      return item.endsWith('ms') ? Number.parseFloat(item) / 1000 : Number.parseFloat(item) || 0;
    });
    return {
      animation: seconds(style.animationDuration),
      transition: seconds(style.transitionDuration)
    };
  });
  expect(Math.max(...durations.animation)).toBeLessThanOrEqual(0.00002);
  expect(Math.max(...durations.transition)).toBeLessThanOrEqual(0.00002);
});
