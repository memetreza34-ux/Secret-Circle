const { test, expect } = require('@playwright/test');

const sizes = [
  [320, 568], [375, 812], [430, 932], [600, 960],
  [768, 1024], [1024, 768], [844, 390], [1280, 900]
];

async function expectWholeImages(images) {
  await expect(images.first()).toBeAttached();
  await images.evaluateAll(nodes => nodes.forEach(img => { img.loading = 'eager'; }));
  await expect.poll(() => images.evaluateAll(nodes => nodes.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
  const problems = await images.evaluateAll(nodes => nodes.flatMap(img => {
    const rect = img.getBoundingClientRect();
    const style = getComputedStyle(img);
    const scale = style.objectFit === 'contain'
      ? Math.min(rect.width / img.naturalWidth, rect.height / img.naturalHeight)
      : Math.max(rect.width / img.naturalWidth, rect.height / img.naturalHeight);
    const frame = img.parentElement.getBoundingClientRect();
    const cropped = img.naturalWidth * scale > rect.width + 1 || img.naturalHeight * scale > rect.height + 1;
    const outside = rect.left < frame.left - 1 || rect.right > frame.right + 1
      || rect.top < frame.top - 1 || rect.bottom > frame.bottom + 1;
    return cropped || outside ? [{ source: img.getAttribute('src'), cropped, outside }] : [];
  }));
  expect(problems, 'Die gesamte Bildfläche muss innerhalb ihres Rahmens liegen').toEqual([]);
}

for (const [width, height] of sizes) {
  test(`whole artwork and titles at ${width}x${height}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height });
    await page.goto('/#spiele');
    const cards = page.locator('#grid .gcard');
    await expect(cards).toHaveCount(55);
    const images = cards.locator('img');
    await images.evaluateAll(nodes => nodes.forEach(img => { img.loading = 'eager'; }));
    await expectWholeImages(images);
    const clippedTitles = await cards.evaluateAll(nodes => nodes.flatMap(card => {
      const title = card.querySelector('b');
      const bounds = card.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(title);
      return Array.from(range.getClientRects()).some(rect => rect.left < bounds.left || rect.right > bounds.right
        || rect.top < bounds.top || rect.bottom > bounds.bottom) ? [title.textContent] : [];
    }));
    expect(clippedTitles).toEqual([]);
    expect(await page.locator('#grid').evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    if (testInfo.project.name === 'chromium-desktop' && [375, 768].includes(width)) {
      await page.screenshot({ path: testInfo.outputPath(`katalog-${width}.png`) });
    }

    await page.goto('/');
    await expectWholeImages(page.locator('#hero-art img'));
    await expectWholeImages(page.locator('#sections .gcard img'));
  });
}

for (const id of ['pass-the-phone', 'password-one-word', 'spin-bottle', 'fill-blank-battle', 'taboo']) {
  test(`whole detail artwork for ${id} at every viewport`, async ({ page }) => {
    await page.goto('/#spiel=' + id);
    for (const [width, height] of sizes) {
      await page.setViewportSize({ width, height });
      await expectWholeImages(page.locator('#mode-emblem img'));
      await expect.poll(() => page.locator('[data-screen="mode"] .body').evaluate(el => el.scrollWidth <= el.clientWidth + 1), {
        message: `${id}: kein horizontaler Überlauf nach Wechsel auf ${width}x${height}`
      }).toBe(true);
    }
  });
}

test('artwork remains complete with doubled text size', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/#spiele');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const images = page.locator('#grid .gcard img');
  await images.evaluateAll(nodes => nodes.forEach(img => { img.loading = 'eager'; }));
  await expectWholeImages(images);
  expect(await page.locator('#grid').evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
});
