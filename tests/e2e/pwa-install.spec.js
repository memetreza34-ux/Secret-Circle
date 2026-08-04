const { test, expect } = require('@playwright/test');

test('manifest opens the Party Hub and exposes installable mobile metadata with valid PNG icons', async ({ page }) => {
  await page.goto('/party.html');

  const result = await page.evaluate(async () => {
    const manifestLink = document.querySelector('link[rel="manifest"]');
    const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
    const meta = name => document.querySelector(`meta[name="${name}"]`)?.content || null;
    if (!manifestLink) throw new Error('Manifest link is missing.');

    const response = await fetch(manifestLink.href);
    if (!response.ok) throw new Error(`Manifest request failed: ${response.status}`);
    const manifest = await response.json();
    const pngIcons = manifest.icons.filter(icon => icon.type === 'image/png');
    const dimensions = {};

    for (const icon of pngIcons) {
      const iconResponse = await fetch(new URL(icon.src, manifestLink.href));
      if (!iconResponse.ok) throw new Error(`Icon request failed: ${icon.src}`);
      const bitmap = await createImageBitmap(await iconResponse.blob());
      dimensions[icon.src] = `${bitmap.width}x${bitmap.height}`;
      bitmap.close();
    }

    return {
      manifest,
      dimensions,
      appleTouchIcon: appleTouchIcon?.getAttribute('href') || null,
      mobileCapable: meta('mobile-web-app-capable'),
      appleCapable: meta('apple-mobile-web-app-capable'),
      appleTitle: meta('apple-mobile-web-app-title'),
      themeColor: meta('theme-color'),
      csp: document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.content || ''
    };
  });

  expect(result.manifest.id).toBe('./');
  expect(result.manifest.name).toBe('Secret Circle – Party Hub');
  expect(result.manifest.start_url).toBe('./party.html');
  expect(result.manifest.scope).toBe('./');
  expect(result.manifest.display).toBe('standalone');
  expect(result.manifest.lang).toBe('de');
  expect(result.dimensions['icon-192.png']).toBe('192x192');
  expect(result.dimensions['icon-512.png']).toBe('512x512');
  expect(result.appleTouchIcon).toBe('icon-192.png');
  expect(result.mobileCapable).toBe('yes');
  expect(result.appleCapable).toBe('yes');
  expect(result.appleTitle).toBe('Secret Circle');
  expect(result.themeColor).toBe('#0f172a');
  expect(result.csp).toContain("default-src 'self'");
  expect(result.csp).toContain("object-src 'none'");
});
