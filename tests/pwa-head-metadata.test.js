'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const pages = ['party.html', 'index.html', 'creator.html', 'advanced.html', 'quick-play.html'];

for (const page of pages) {
  const source = fs.readFileSync(path.join(ROOT, page), 'utf8');

  assert.match(source, /<meta name="viewport" content="[^"]*viewport-fit=cover[^"]*">/, `${page}: viewport-fit=cover fehlt`);
  assert.match(source, /<meta name="theme-color" content="#[0-9a-fA-F]{6}">/, `${page}: theme-color fehlt`);
  assert.match(source, /<meta name="referrer" content="no-referrer">/, `${page}: no-referrer fehlt`);
  assert.match(source, /<meta name="mobile-web-app-capable" content="yes">/, `${page}: mobile-web-app-capable fehlt`);
  assert.match(source, /<meta name="apple-mobile-web-app-capable" content="yes">/, `${page}: apple-mobile-web-app-capable fehlt`);
  assert.match(source, /<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">/, `${page}: iOS status bar style fehlt`);
  assert.match(source, /<meta name="apple-mobile-web-app-title" content="Secret Circle">/, `${page}: iOS App-Titel fehlt`);
  assert.match(source, /manifest-src 'self'/, `${page}: CSP manifest-src fehlt`);
  assert.match(source, /<link rel="manifest" href="manifest\.webmanifest">/, `${page}: Manifest-Link fehlt`);
  assert.match(source, /<link rel="icon" href="icon\.svg" type="image\/svg\+xml">/, `${page}: SVG-Icon fehlt`);
  assert.match(source, /<link rel="icon" href="icon-192\.png" type="image\/png" sizes="192x192">/, `${page}: 192er PNG-Favicon fehlt`);
  assert.match(source, /<link rel="apple-touch-icon" href="icon-192\.png">/, `${page}: apple-touch-icon fehlt`);
}

console.log(JSON.stringify({
  ok: true,
  pwaHeadMetadataContract: true,
  interactiveEntryPages: pages,
  sharedInstallMetadata: true,
  iosHomeScreenMetadata: true,
  rasterAndVectorIconsLinked: true
}, null, 2));
