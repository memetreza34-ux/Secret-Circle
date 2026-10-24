'use strict';

/* Opt-in-Ladezeitmessung auf Handy-Profilen. Kein Pflicht-Check: läuft nur über
   playwright.perf.config.js (npm run test:perf) und prüft keine Grenzwerte,
   sondern schreibt Messwerte nach .cache/perf-mobile/.
   Vergleich zweier Stände: PERF_TARGETS="main=http://127.0.0.1:4191,branch=http://127.0.0.1:4190".
   Ohne PERF_TARGETS wird nur der eigene Stand (baseURL) gemessen. */

const fs = require('fs');
const http = require('http');
const path = require('path');
const { test } = require('@playwright/test');

const RUNS = Math.max(1, Number(process.env.PERF_RUNS || 5));
const OUT_DIR = path.resolve(process.env.PERF_OUT || '.cache/perf-mobile');

/* Lighthouse „Slow 4G“ (150 ms RTT, 1,6 Mbit/s runter, 750 kbit/s hoch, CPU 4x)
   mit den Lighthouse-Korrekturfaktoren für Drosselung pro Anfrage
   (Latenz x3,75, Durchsatz x0,9), siehe Lighthouse docs/throttling.md. */
const SLOW_4G = {
  offline: false,
  latency: 150 * 3.75,
  downloadThroughput: (1.6 * 1024 * 0.9 * 1024) / 8,
  uploadThroughput: (750 * 0.9 * 1024) / 8
};
const CPU_SLOWDOWN = 4;

const PAGES = [
  { name: 'index.html', path: '/index.html', ready: 'hub' },
  { name: 'v2-hub.html', path: '/v2-hub.html', ready: 'hub' },
  { name: 'party.html', path: '/party.html', ready: 'party' },
  { name: 'quick-play.html', path: '/quick-play.html?game=wavelength', ready: 'quick' }
];

function targetsFrom(baseURL) {
  const raw = process.env.PERF_TARGETS;
  if (!raw) return [{ label: 'current', url: baseURL }];
  return raw.split(',').map(entry => {
    const [label, url] = entry.split('=');
    return { label: label.trim(), url: url.trim().replace(/\/$/, '') };
  });
}

function median(values) {
  const list = values.filter(value => typeof value === 'number' && Number.isFinite(value)).sort((a, b) => a - b);
  if (!list.length) return null;
  const middle = Math.floor(list.length / 2);
  return list.length % 2 ? list[middle] : (list[middle - 1] + list[middle]) / 2;
}

/* Läuft vor allen Seitenskripten und merkt sich das erste Frame, in dem die
   Hauptoberfläche sichtbar und gefüllt ist. */
function readyProbe(kind) {
  const visible = element => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && getComputedStyle(element).visibility !== 'hidden';
  };
  const checks = {
    hub: () => {
      const title = document.getElementById('hero-title');
      return visible(title) && title.textContent.trim().length > 0;
    },
    party: () => {
      const grid = document.getElementById('featured-grid');
      return visible(grid) && grid.childElementCount > 0;
    },
    quick: () => {
      const start = document.getElementById('quick-start');
      return Boolean(document.querySelector('script[data-game-engine]')) && visible(start) && !start.disabled;
    }
  };
  const tick = () => {
    if (checks[kind]()) { window.__perfUiVisible = performance.now(); return; }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function cardFilesOf(html) {
  return [...new Set(html.match(/party-cards-[a-z0-9-]+\.js/g) || [])];
}

function summarizeTrace(buffer) {
  const events = JSON.parse(buffer.toString('utf8')).traceEvents || [];
  const fileOf = url => (url.split('?')[0].split('/').pop() || '');
  const evaluateByScript = {};
  let cardEvaluateMs = 0;
  let cardBackgroundParseMs = 0;
  for (const event of events) {
    if (event.ph !== 'X') continue;
    const file = fileOf(event.args?.data?.url || '');
    if (!file) continue;
    const ms = (event.dur || 0) / 1000;
    if (event.name === 'EvaluateScript') {
      evaluateByScript[file] = (evaluateByScript[file] || 0) + ms;
      if (file.startsWith('party-cards-')) cardEvaluateMs += ms;
    }
    /* Große Skripte parst Chrome im Hintergrund (Streaming). Das blockiert den
       Hauptthread nicht, zählt aber zur Gesamtarbeit. */
    if (event.name === 'v8.parseOnBackground' && file.startsWith('party-cards-')) cardBackgroundParseMs += ms;
  }
  return {
    cardEvaluateMs,
    cardBackgroundParseMs,
    classicContentEvaluateMs: evaluateByScript['party-core-classic-content.js'] || 0,
    clueCatalogEvaluateMs: evaluateByScript['party-wave-one-clue-catalog.js'] || 0,
    allScriptsEvaluateMs: Object.values(evaluateByScript).reduce((total, ms) => total + ms, 0),
    evaluateByScript
  };
}

/* page.waitForFunction wertet intern Strings aus; die CSP der Seiten
   (script-src 'self') verbietet das. page.evaluate ist davon nicht betroffen. */
async function pollUntil(page, predicate, timeout = 120_000) {
  const started = Date.now();
  while (!(await page.evaluate(predicate))) {
    if (Date.now() - started > timeout) throw new Error(`Zeitüberschreitung beim Warten auf ${page.url()}`);
    await new Promise(resolve => setTimeout(resolve, 25));
  }
}

async function applyThrottling(context, page, throttle) {
  if (!throttle) return;
  const cdp = await context.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU_SLOWDOWN });
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', SLOW_4G);
}

async function measureLoad({ browser, browserName, context, url, ready, throttle }) {
  const serverBefore = await readServerStats(url);
  const page = await context.newPage();
  await page.addInitScript(readyProbe, ready);
  await applyThrottling(context, page, throttle);

  const transfers = [];
  page.on('requestfinished', request => {
    transfers.push((async () => {
      const response = await request.response();
      const sizes = await request.sizes().catch(() => null);
      return {
        url: request.url(),
        navigation: request.isNavigationRequest(),
        fromServiceWorker: Boolean(response?.fromServiceWorker()),
        bytes: sizes ? sizes.responseBodySize + sizes.responseHeadersSize : 0
      };
    })());
  });

  const tracing = browserName === 'chromium';
  if (tracing) await browser.startTracing(page, { categories: ['devtools.timeline', 'v8'] });

  await page.goto(url, { waitUntil: 'load', timeout: 120_000 });
  await pollUntil(page, () => window.__perfUiVisible !== undefined
    && (performance.getEntriesByType('navigation')[0]?.loadEventEnd || 0) > 0);
  const timing = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    return {
      htmlResponseEndMs: nav.responseEnd,
      dclMs: nav.domContentLoadedEventEnd,
      loadMs: nav.loadEventEnd,
      uiVisibleMs: window.__perfUiVisible,
      controlled: Boolean(navigator.serviceWorker?.controller)
    };
  });
  const trace = tracing ? summarizeTrace(await browser.stopTracing()) : null;
  const list = await Promise.all(transfers);
  await page.close();
  const serverAfter = await readServerStats(url);

  /* Browserseitige Werte erfassen Worker-interne Downloads nicht vollständig.
     Dafür zählt serverBodyBytes zusätzlich die lokalen Serverantworten. */
  const network = list.filter(entry => !entry.fromServiceWorker || entry.navigation);
  const sum = entries => entries.reduce((total, entry) => total + entry.bytes, 0);
  return {
    ...timing,
    ...(trace || {}),
    requests: list.length,
    servedByServiceWorker: list.filter(entry => entry.fromServiceWorker).length,
    networkBytes: sum(network),
    serverBodyBytes: serverAfter.bodyBytes - serverBefore.bodyBytes,
    serverRequests: serverAfter.responses - serverBefore.responses,
    cardRequests: list.filter(entry => /party-cards-/.test(entry.url)).length,
    cardNetworkBytes: sum(network.filter(entry => /party-cards-/.test(entry.url)))
  };
}

function readServerStats(url) {
  return new Promise((resolve, reject) => {
    http.get(new URL('/__perf_stats__', url), response => {
      let text = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { text += chunk; });
      response.on('end', () => {
        try { resolve(JSON.parse(text)); } catch (error) { reject(error); }
      });
    }).on('error', reject);
  });
}

/* Einmaliger Download des Offline-Kerns (CORE in sw.js), den der Service Worker
   beim ersten Besuch zusätzlich zur Seite lädt (cache: 'reload'). Gezählt wird
   der gzip-Body, wie er über die Leitung geht. */
function gzipLength(url) {
  return new Promise((resolve, reject) => {
    http.get(url, { headers: { 'Accept-Encoding': 'gzip' } }, response => {
      let length = 0;
      response.on('data', chunk => { length += chunk.length; });
      response.on('end', () => resolve(length));
    }).on('error', reject);
  });
}

async function measureOfflineCore(baseUrl) {
  const source = await new Promise((resolve, reject) => {
    http.get(`${baseUrl}/sw.js`, response => {
      let text = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { text += chunk; });
      response.on('end', () => resolve(text));
    }).on('error', reject);
  });
  const core = JSON.parse(source.match(/const CORE=(\[[^\]]*\])/)[1].replace(/'/g, '"'));
  let bytes = 0;
  let cardBytes = 0;
  for (const entry of core) {
    const length = await gzipLength(new URL(entry, `${baseUrl}/`).href);
    bytes += length;
    if (/party-cards-/.test(entry)) cardBytes += length;
  }
  return { files: core.length, bytes, cardBytes };
}

/* Erster Besuch ohne Messung: Service Worker registrieren und warten, bis er
   den Offline-Kern geladen hat und aktiv ist. */
async function primeServiceWorker(context, url, browserName) {
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'load' });
  const ready = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return false;
    const registration = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise(resolve => setTimeout(() => resolve(null), 60_000))
    ]);
    if (!registration?.active) return false;
    const started = Date.now();
    while (registration.active.state !== 'activated' && Date.now() - started < 30_000) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return registration.active.state === 'activated';
  });
  await page.close();
  return ready;
}

/* Parse- und Ausführungszeit der Kartendateien allein: Texte vorab laden, dann
   jede Datei als Inline-Skript einhängen. Inline-Skripte laufen beim Einhängen
   synchron, die Zeitspanne ist also Kompilieren plus Ausführen (ohne Code-Cache,
   also ein Kalt-Wert). Funktioniert auch in WebKit, wo es kein Tracing gibt. */
async function measureCardParse({ browser, contextOptions, baseUrl, throttle }) {
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  await applyThrottling(context, page, throttle);
  const html = await (await context.request.get(`${baseUrl}/index.html`)).text();
  const files = cardFilesOf(html);
  if (!files.length) { await context.close(); return { files: 0, totalMs: null, perFile: {} }; }
  await page.route(`${baseUrl}/__perf_harness__.html`, route => route.fulfill({
    contentType: 'text/html; charset=utf-8',
    body: '<!doctype html><meta charset="utf-8"><title>perf</title>'
  }));
  await page.goto(`${baseUrl}/__perf_harness__.html`);
  const result = await page.evaluate(async names => {
    const texts = await Promise.all(names.map(name => fetch(name).then(response => response.text())));
    const perFile = {};
    const started = performance.now();
    texts.forEach((text, index) => {
      const script = document.createElement('script');
      script.textContent = text;
      const before = performance.now();
      document.head.appendChild(script);
      perFile[names[index]] = performance.now() - before;
    });
    return { totalMs: performance.now() - started, perFile, registered: (window.SecretCircleCardPacks || []).length };
  }, files);
  await context.close();
  if (result.registered !== files.length) throw new Error(`Nur ${result.registered} von ${files.length} Kartendateien ausgeführt.`);
  return { files: files.length, totalMs: result.totalMs, perFile: result.perFile };
}

function contextOptionsFrom(use) {
  const { viewport, userAgent, deviceScaleFactor, isMobile, hasTouch, contextOptions } = use;
  return { viewport, userAgent, deviceScaleFactor, isMobile, hasTouch, ...(contextOptions || {}) };
}

for (const pageSpec of PAGES) {
  test(pageSpec.name, async ({ browser, browserName, baseURL }, testInfo) => {
    const targets = targetsFrom(baseURL);
    const throttle = Boolean(testInfo.project.metadata?.throttle) && browserName === 'chromium';
    test.setTimeout(RUNS * targets.length * (throttle ? 240_000 : 90_000) + 120_000);
    const contextOptions = contextOptionsFrom(testInfo.project.use);
    const runs = Object.fromEntries(targets.map(target => [target.label, []]));
    const offlineCore = {};
    if (pageSpec === PAGES[0]) {
      for (const target of targets) offlineCore[target.label] = await measureOfflineCore(target.url);
    }

    for (let run = 0; run < RUNS; run += 1) {
      /* Reihenfolge abwechseln, damit kein Stand dauerhaft Vorteile durch
         warme Systemcaches oder CPU-Takt hat. */
      const ordered = run % 2 ? [...targets].reverse() : targets;
      for (const target of ordered) {
        const url = `${target.url}${pageSpec.path}`;
        /* Kalt: leerer Cache, Service Worker blockiert. Sonst übernimmt er die
           Seite teils schon während des Ladens (clients.claim) und liefert den
           Rest aus seinem frisch gefüllten Cache – das Ergebnis hinge vom Zufall
           ab, und unter Drosselung lädt er sogar ungedrosselt. */
        const coldContext = await browser.newContext({ ...contextOptions, serviceWorkers: 'block' });
        const cold = await measureLoad({ browser, browserName, context: coldContext, url, ready: pageSpec.ready, throttle });
        await coldContext.close();
        /* Warm: Wiederholungsbesuch, Skripte und Stile aus dem Offline-Cache. */
        const warmContext = await browser.newContext(contextOptions);
        const serviceWorker = await primeServiceWorker(warmContext, url, browserName);
        const warm = await measureLoad({ browser, browserName, context: warmContext, url, ready: pageSpec.ready, throttle });
        await warmContext.close();
        const cardParse = pageSpec === PAGES[0]
          ? await measureCardParse({ browser, contextOptions, baseUrl: target.url, throttle })
          : null;
        runs[target.label].push({ cold, warm, serviceWorker, cardParse });
      }
    }

    const metrics = ['htmlResponseEndMs', 'dclMs', 'loadMs', 'uiVisibleMs', 'cardEvaluateMs', 'cardBackgroundParseMs',
      'classicContentEvaluateMs', 'clueCatalogEvaluateMs', 'allScriptsEvaluateMs', 'requests', 'servedByServiceWorker',
      'networkBytes', 'serverBodyBytes', 'serverRequests', 'cardRequests', 'cardNetworkBytes'];
    const summary = {};
    for (const target of targets) {
      const list = runs[target.label];
      summary[target.label] = {
        cold: Object.fromEntries(metrics.map(key => [key, median(list.map(entry => entry.cold[key]))])),
        warm: Object.fromEntries(metrics.map(key => [key, median(list.map(entry => entry.warm[key]))])),
        warmControlledByServiceWorker: list.every(entry => entry.warm.controlled),
        cardParseMs: median(list.map(entry => entry.cardParse?.totalMs)),
        cardParseFiles: list[0]?.cardParse?.files ?? null,
        offlineCore: offlineCore[target.label] || null
      };
    }

    const record = {
      project: testInfo.project.name,
      browser: browserName,
      browserVersion: browser.version(),
      throttled: throttle,
      warmCacheMode: 'service worker activation awaited; actual control recorded in summary',
      page: pageSpec.name,
      runs: RUNS,
      measuredAt: new Date().toISOString(),
      targets,
      summary,
      raw: runs
    };
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(path.join(OUT_DIR, `${testInfo.project.name}--${pageSpec.name}.json`), JSON.stringify(record, null, 2));
    await testInfo.attach('perf.json', { body: JSON.stringify(summary, null, 2), contentType: 'application/json' });
    const ms = value => (value === null ? '–' : Math.round(value));
    for (const target of targets) {
      const { cold, warm } = summary[target.label];
      console.log(`[perf] ${testInfo.project.name} ${pageSpec.name} ${target.label}: ` +
        `kalt DCL ${ms(cold.dclMs)} / load ${ms(cold.loadMs)} / UI ${ms(cold.uiVisibleMs)} ms, ` +
        `warm DCL ${ms(warm.dclMs)} / load ${ms(warm.loadMs)} / UI ${ms(warm.uiVisibleMs)} ms, ` +
        `kalt ${Math.round(cold.serverBodyBytes / 1024)} KiB, warm ${Math.round(warm.serverBodyBytes / 1024)} KiB`);
    }
  });
}
