const { test, expect } = require('@playwright/test');
const { snapshot, startServer } = require('../helpers/release-server.js');

test('nur das Veröffentlichungspaket startet Hub und Engines mit Sicherheitsheadern, ohne interne Dateien', async ({ page, request }) => {
  const data = snapshot('HEAD');
  const server = await startServer(data);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    const response = await page.goto(server.origin + '/#spiele');
    expect(response.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(response.headers()['x-content-type-options']).toBe('nosniff');
    await expect(page.locator('#grid .gcard')).toHaveCount(55);
    for (const route of ['operator-release.json', 'release-meta.json', 'package.json', 'AGENTS.md', 'scripts/package_release.py']) {
      expect((await request.get(server.origin + '/' + route)).status()).toBe(404);
    }
    const manifest = await (await request.get(server.origin + '/release-build.json')).json();
    expect(manifest.commit).toBe(data.manifest.commit);
    expect(manifest.cache).toBe(data.manifest.cache);
    for (const [route, title] of [['word-imposter.html', 'Word Imposter'], ['quick-play.html?game=wavelength', 'Spektrum-Tipp'], ['advanced.html?game=question-imposter', 'Question Imposter']]) {
      await page.goto(server.origin + '/' + route);
      await expect(page.getByRole('heading', { name: title, level: 1 })).toBeVisible();
    }
    expect(errors).toEqual([]);
  } finally { await server.close(); }
});
