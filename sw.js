'use strict';

const CACHE='secret-circle-v89';
const STAGING_CACHE='secret-circle-v89-staging';
const CORE=['./','./index.html','./v2-hub.html','./party.html','./advanced.html','./quick-play.html','./creator.html','./privacy.html','./v2-update.css','./v2-theme.css','./v2-party-hub.css','./v2-play.css','./v2-party-play.css','./v2-imposter.css','./v2-advanced.css','./v2-creator.css','./assets/images/word-imposter-chamaeleon.webp','./assets/images/wahrheit-oder-pflicht.webp','./assets/images/ich-habe-noch-nie.webp','./runtime-guard.js','./setup-ux.js','./privacy-guard.js','./wake-lock.js','./app.js','./game-engine.js','./role-assignment.js','./word-packs.js','./data-store.js','./word-imposter-resume-guard.js','./backup-schema-registry.js','./party-catalog.js','./party-expansion.js','./party-trending-catalog.js','./party-mega-catalog.js','./party-viral-catalog.js','./party-core-release-catalog.js','./party-core-classic-content.js','./party-routing.js','./party-wave-one-catalog.js','./party-wave-one-imposter-catalog.js','./party-wave-one-writing-catalog.js','./party-wave-one-voting-catalog.js','./party-wave-one-bluff-catalog.js','./party-wave-one-clue-catalog.js','./game-creator.js','./creator-page.js','./party-custom-packs.js','./party-hub-timers.js','./party-hub-resume-guard.js','./party-hub-round-state.js','./party-hub.js','./party-hub-plus.js','./party-hub-polish.js','./party-hub-a11y.js','./secondary-surface-a11y.js','./party-guide.js','./party-release-structure.js','./party-filter-state.js','./party-search-assist.js','./party-night.js','./party-data-tools.js','./party-advanced.js','./advanced-resume-guard.js','./party-advanced-runner.js','./advanced-privacy-guard.js','./party-advanced-preferences.js','./party-quick-modes.js','./party-mega-modes.js','./party-viral-modes.js','./party-created-modes.js','./party-wave-one-modes.js','./party-wave-one-imposter-modes.js','./party-wave-one-writing-modes.js','./party-wave-one-voting-modes.js','./party-wave-one-bluff-modes.js','./party-wave-one-clue-modes.js','./session-ledger.js','./party-session-controls.js','./quick-session-replacement-guard.js','./quick-loader.js','./v2-hub-packs.js','./v2-hub.js','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./fonts/archivo-black-latin-400.woff2','./fonts/archivo-black-latin-ext-400.woff2','./fonts/figtree-latin.woff2','./fonts/figtree-latin-ext.woff2'];

function stripSearch(value) {
  const url = new URL(typeof value === 'string' ? value : value.url);
  url.search = '';
  url.hash = '';
  return url.href;
}

async function stageCore() {
  await caches.delete(STAGING_CACHE);
  const staging = await caches.open(STAGING_CACHE);
  /* Am Browser-Cache vorbei laden: Sonst landen bei einem Update noch frische
     HTTP-Cache-Einträge der alten Version im neuen Offline-Core und bleiben dort
     bis zur nächsten Generation. */
  await staging.addAll(CORE.map(url => new Request(url, { cache: 'reload' })));
}

async function promoteStagedCore() {
  const staging = await caches.open(STAGING_CACHE);
  const requests = await staging.keys();
  if (!requests.length) throw new Error('Der vorbereitete Offline-Core ist leer.');
  const active = await caches.open(CACHE);
  const stagedUrls = new Set(requests.map(request => request.url));
  await Promise.all(requests.map(async request => {
    const response = await staging.match(request);
    if (!response) throw new Error(`Vorbereitete Ressource fehlt: ${request.url}`);
    await active.put(request, response.clone());
  }));
  const activeRequests = await active.keys();
  await Promise.all(activeRequests.filter(request => !stagedUrls.has(request.url)).map(request => active.delete(request)));
  await caches.delete(STAGING_CACHE);
  const keys = await caches.keys();
  await Promise.all(keys.filter(key => key.startsWith('secret-circle-') && key !== CACHE).map(key => caches.delete(key)));
}

self.addEventListener('install', event => { event.waitUntil(stageCore()); });
self.addEventListener('message', event => { if (event.data?.type === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(promoteStagedCore().then(() => self.clients.claim())); });

async function fetchAndCache(request, canonicalNavigation = false) {
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE);
    const cacheKey = canonicalNavigation ? stripSearch(request) : request;
    await cache.put(cacheKey, response.clone());
  }
  return response;
}

async function handleNavigation(request) {
  try { return await fetchAndCache(request, true); }
  catch {
    return await caches.match(stripSearch(request), { cacheName: CACHE })
      || await caches.match('./v2-hub.html', { cacheName: CACHE })
      || await caches.match('./party.html', { cacheName: CACHE })
      || await caches.match('./index.html', { cacheName: CACHE })
      || new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function handleAsset(request) {
  const cached = await caches.match(request, { cacheName: CACHE });
  if (cached) return cached;
  try { return await fetchAndCache(request); }
  catch { return new Response('Offline', { status: 503, statusText: 'Offline' }); }
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;
  event.respondWith(event.request.mode === 'navigate' ? handleNavigation(event.request) : handleAsset(event.request));
});
