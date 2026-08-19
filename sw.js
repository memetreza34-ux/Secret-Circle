'use strict';

const CACHE='secret-circle-v42';
const STAGING_CACHE='secret-circle-v42-staging';
const CORE=['./','./index.html','./party.html','./advanced.html','./quick-play.html','./creator.html','./privacy.html','./styles.css','./pwa.css','./pwa-update.css','./party.css','./party-extra.css','./party-night.css','./party-quick.css','./party-guide.css','./party-release.css','./party-search.css','./creator.css','./runtime-guard.js','./setup-ux.js','./privacy-guard.js','./wake-lock.js','./app.js','./game-engine.js','./role-assignment.js','./word-packs.js','./data-store.js','./backup-schema-registry.js','./party-catalog.js','./party-expansion.js','./party-trending-catalog.js','./party-mega-catalog.js','./party-viral-catalog.js','./party-core-release-catalog.js','./party-core-classic-content.js','./party-routing.js','./game-creator.js','./creator-page.js','./party-custom-packs.js','./party-hub-timers.js','./party-hub.js','./party-hub-plus.js','./party-hub-polish.js','./party-guide.js','./party-release-structure.js','./party-filter-state.js','./party-search-assist.js','./party-night.js','./party-data-tools.js','./party-advanced.js','./party-advanced-runner.js','./party-advanced-preferences.js','./party-quick-modes.js','./party-mega-modes.js','./party-viral-modes.js','./party-created-modes.js','./session-ledger.js','./party-session-controls.js','./quick-loader.js','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png'];

function stripSearch(value) {
  const url = new URL(typeof value === 'string' ? value : value.url);
  url.search = '';
  url.hash = '';
  return url.href;
}

async function stageCore() {
  await caches.delete(STAGING_CACHE);
  const staging = await caches.open(STAGING_CACHE);
  await staging.addAll(CORE);
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
    await active.put(request, response);
  }));

  const activeRequests = await active.keys();
  await Promise.all(activeRequests
    .filter(request => !stagedUrls.has(request.url))
    .map(request => active.delete(request)));
  await caches.delete(STAGING_CACHE);

  const keys = await caches.keys();
  await Promise.all(keys
    .filter(key => key.startsWith('secret-circle-') && key !== CACHE)
    .map(key => caches.delete(key)));
}

self.addEventListener('install', event => {
  event.waitUntil(stageCore());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(promoteStagedCore().then(() => self.clients.claim()));
});

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
  try {
    return await fetchAndCache(request, true);
  } catch {
    return await caches.match(stripSearch(request), { cacheName: CACHE })
      || await caches.match('./party.html', { cacheName: CACHE })
      || await caches.match('./index.html', { cacheName: CACHE })
      || new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function handleAsset(request) {
  const cached = await caches.match(request, { cacheName: CACHE });
  if (cached) return cached;
  try {
    return await fetchAndCache(request);
  } catch {
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;
  event.respondWith(event.request.mode === 'navigate'
    ? handleNavigation(event.request)
    : handleAsset(event.request));
});