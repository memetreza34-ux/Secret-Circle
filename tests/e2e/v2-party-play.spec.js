const { test, expect } = require('@playwright/test');

test('Hub-Spielansicht nutzt v2-Stil und bleibt auf Handy und Desktop bedienbar', async ({ page }) => {
  await page.goto('/party.html');
  await page.locator('[data-open-game="never-have"]:visible').first().click();
  await page.getByRole('button', { name: 'Jetzt spielen' }).click();

  const layer = page.locator('#play-layer');
  await expect(layer).toBeVisible();
  await expect(layer).toHaveAttribute('data-world', 'reden');
  await expect(page.locator('#play-content')).toContainText('Ich habe noch nie');

  for (const viewport of [{ width: 375, height: 812, columns: 2 }, { width: 1280, height: 800, columns: 4 }]) {
    await page.setViewportSize(viewport);
    const layout = await layer.evaluate(node => {
      const controls = node.querySelector('.hub-session-controls');
      const finish = node.querySelector('#finish-hub-game');
      const card = node.querySelector('.play-card');
      return {
        background: getComputedStyle(node).backgroundColor,
        displayFont: getComputedStyle(node.querySelector('#play-title')).fontFamily,
        columns: getComputedStyle(controls).gridTemplateColumns.split(' ').length,
        touchHeight: finish.getBoundingClientRect().height,
        cardVisible: card.getBoundingClientRect().width > 0,
        horizontalOverflow: node.scrollWidth > node.clientWidth
      };
    });
    /* Spielansichten sind einheitlich schwarz; die Spielart zeigt sich nur noch als Akzentfarbe. */
    expect(layout.background).toBe('rgb(10, 11, 15)');
    expect(layout.displayFont).toContain('Archivo Black');
    expect(layout.columns).toBe(viewport.columns);
    expect(layout.touchHeight).toBeGreaterThanOrEqual(44);
    expect(layout.cardVisible).toBe(true);
    expect(layout.horizontalOverflow).toBe(false);
  }

  await page.getByRole('button', { name: 'Nächste Karte' }).click();
  await expect(page.locator('#play-progress')).toContainText('1 Runde');
});
