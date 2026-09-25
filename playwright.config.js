const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  /* Die CI-Runner sind deutlich langsamer als ein Entwicklungsrechner. Mit den
     lokalen Zeitlimits liefen dort vereinzelt Tests in eine Zeitüberschreitung,
     obwohl die App korrekt arbeitete. Echte Hänger fallen weiterhin auf. */
  timeout: process.env.CI ? 60_000 : 30_000,
  expect: { timeout: process.env.CI ? 10_000 : 5_000 },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['line'], ['html', { outputFolder: 'playwright-report', open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  webServer: {
    command: 'python3 -m http.server 4173 --bind 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 20_000
  },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'chromium-mobile', use: { ...devices['Pixel 7'] } },
    /* Safari/iOS teilen sich die WebKit-Engine. Ohne diese Projekte blieben
       Fehler unentdeckt, die nur dort auftreten. Die Offline-Tests laufen hier
       nicht: Der WebKit-Build von Playwright unterstützt keine Service Worker
       und bricht beim Neuladen im Offline-Modus intern ab.
       Reduzierte Bewegung: Die Seite scrollt per CSS sanft, und WebKit animiert
       dann auch das Scrollen, mit dem Playwright ein Element vor dem Klick
       sichtbar macht. Der Klick landete so gelegentlich außerhalb des Ziels.
       Das Standardverhalten deckt Chromium ab; Bewegungstests setzen die
       Einstellung ohnehin selbst. */
    { name: 'webkit-desktop', use: { ...devices['Desktop Safari'], contextOptions: { reducedMotion: 'reduce' } }, testIgnore: /offline\.spec\.js/ },
    { name: 'webkit-mobile', use: { ...devices['iPhone 14'], contextOptions: { reducedMotion: 'reduce' } }, testIgnore: /offline\.spec\.js/ }
  ]
});
