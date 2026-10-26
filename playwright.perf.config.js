const { defineConfig, devices } = require('@playwright/test');

/* Opt-in-Ladezeitmessung (tests/perf). Nicht Teil der Pflicht-Checks und nicht
   von npm run test:e2e erfasst. Anleitung: docs/PERF_MOBILE_CARDPACKS.md. */
module.exports = defineConfig({
  testDir: './tests/perf',
  testMatch: /\.perf\.spec\.js$/,
  outputDir: 'test-results/perf-artifacts',
  timeout: 600_000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4190',
    trace: 'off',
    screenshot: 'off',
    video: 'off'
  },
  webServer: process.env.PERF_TARGETS ? undefined : {
    command: 'node tests/perf/static-server.js . 4190',
    url: 'http://127.0.0.1:4190/index.html',
    reuseExistingServer: true,
    timeout: 20_000
  },
  projects: [
    { name: 'chromium-mobile', use: { ...devices['Pixel 7'] } },
    { name: 'chromium-mobile-slow4g', use: { ...devices['Pixel 7'] }, metadata: { throttle: true } },
    /* Playwright-WebKit hat keine Service Worker: „warm“ heißt hier
       HTTP-Cache mit Revalidierung, nicht Offline-Cache. */
    { name: 'webkit-mobile', use: { ...devices['iPhone 14'], contextOptions: { reducedMotion: 'reduce' } } }
  ]
});
