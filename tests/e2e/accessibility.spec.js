const { test, expect } = require('@playwright/test');

async function auditDocument(page) {
  return page.evaluate(() => {
    const issues = [];
    const ids = [...document.querySelectorAll('[id]')].map(node => node.id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicates.length) issues.push(`Doppelte IDs: ${[...new Set(duplicates)].join(', ')}`);

    for (const control of document.querySelectorAll('input, select, textarea')) {
      const label = control.labels?.length || control.getAttribute('aria-label') || control.getAttribute('aria-labelledby');
      if (!label) issues.push(`Formularfeld ohne Beschriftung: #${control.id || control.name || control.type}`);
    }

    for (const image of document.querySelectorAll('img')) {
      if (!image.hasAttribute('alt')) issues.push(`Bild ohne alt-Attribut: ${image.src}`);
    }

    for (const button of document.querySelectorAll('button')) {
      const name = (button.textContent || button.getAttribute('aria-label') || '').trim();
      if (!name) issues.push('Schaltfläche ohne zugänglichen Namen.');
    }

    const headings = [...document.querySelectorAll('h1, h2, h3')].filter(node => !node.closest('[hidden]'));
    if (!headings.some(node => node.tagName === 'H1')) issues.push('Sichtbare Seite ohne H1.');

    const viewportOverflow = document.documentElement.scrollWidth - window.innerWidth;
    if (viewportOverflow > 2) issues.push(`Horizontales Überlaufen um ${viewportOverflow}px.`);

    return issues;
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('setup screen satisfies structural accessibility gates', async ({ page }) => {
  await expect(page.locator('#setup-screen')).toBeVisible();
  expect(await auditDocument(page)).toEqual([]);

  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => document.activeElement?.tagName);
  expect(focused).not.toBe('BODY');
});

test('all game phases retain focus and accessible controls', async ({ page }) => {
  const players = ['Alex', 'Sam', 'Mika'];
  await page.locator('#players').fill(players.join('\n'));
  await page.locator('#match-rounds').selectOption('1');
  await page.getByRole('button', { name: 'Spiel starten' }).click();

  await expect(page.locator('#reveal-screen')).toBeVisible();
  expect(await auditDocument(page)).toEqual([]);
  await expect(page.locator('#reveal-screen')).toBeFocused();

  for (let index = 0; index < players.length; index += 1) {
    await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
    await expect(page.locator('#next-player')).toBeFocused();
    await page.getByRole('button', { name: 'Karte schließen und weitergeben' }).click();
  }

  await expect(page.locator('#round-screen')).toBeVisible();
  expect(await auditDocument(page)).toEqual([]);
  await page.getByRole('button', { name: 'Abstimmung starten' }).click();
  await expect(page.locator('#vote-screen')).toBeVisible();
  await expect(page.locator('#vote-options button').first()).toBeFocused();
  expect(await auditDocument(page)).toEqual([]);
});

test('mobile layout has large touch targets and no horizontal overflow', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Nur für das mobile Playwright-Projekt relevant.');
  const result = await page.evaluate(() => {
    const undersized = [...document.querySelectorAll('button, a, input, select')]
      .filter(node => {
        const style = getComputedStyle(node);
        if (style.display === 'none' || style.visibility === 'hidden' || node.closest('[hidden]')) return false;
        const target = node.matches('input[type="checkbox"], input[type="radio"]') ? node.labels?.[0] || node : node;
        const rect = target.getBoundingClientRect();
        const intersectsViewport = rect.bottom > 0 && rect.right > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth;
        if (!intersectsViewport || rect.width <= 0 || rect.height <= 0) return false;
        return rect.height < 44 || rect.width < 44;
      })
      .map(node => node.id || node.textContent.trim().slice(0, 30));
    return {
      undersized,
      overflow: document.documentElement.scrollWidth - window.innerWidth
    };
  });

  expect(result.undersized).toEqual([]);
  expect(result.overflow).toBeLessThanOrEqual(2);
});

test('reduced motion preference is respected', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const values = await page.evaluate(() => {
    const style = getComputedStyle(document.querySelector('button'));
    return { animation: style.animationDuration, transition: style.transitionDuration };
  });
  expect(values.animation).toBe('0s');
  expect(values.transition).toBe('0s');
});
