'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.webmanifest'), 'utf8'));
const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');

function pngDimensions(relative) {
  const buffer = fs.readFileSync(path.join(ROOT, relative));
  assert.ok(buffer.length >= 24, `${relative} is too small to be a PNG.`);
  assert.deepEqual([...buffer.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], `${relative} has invalid PNG signature.`);
  assert.equal(buffer.subarray(12, 16).toString('ascii'), 'IHDR', `${relative} has no IHDR chunk.`);
  return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
}

const expected = Object.freeze({
  'icon-192.png': Object.freeze({ sizes: '192x192', type: 'image/png', dimensions: [192, 192] }),
  'icon-512.png': Object.freeze({ sizes: '512x512', type: 'image/png', dimensions: [512, 512] }),
  'icon.svg': Object.freeze({ sizes: 'any', type: 'image/svg+xml' })
});

assert.ok(Array.isArray(manifest.icons), 'manifest.icons must be an array.');
const iconsBySrc = new Map(manifest.icons.map(icon => [icon.src, icon]));

for (const [src, contract] of Object.entries(expected)) {
  const file = path.join(ROOT, src);
  assert.ok(fs.existsSync(file), `PWA icon file is missing: ${src}`);
  assert.ok(fs.statSync(file).isFile(), `PWA icon path must be a file: ${src}`);
  const entry = iconsBySrc.get(src);
  assert.ok(entry, `PWA manifest is missing icon entry: ${src}`);
  assert.equal(entry.sizes, contract.sizes, `Manifest size drift: ${src}`);
  assert.equal(entry.type, contract.type, `Manifest MIME drift: ${src}`);
  assert.match(sw, new RegExp(`'\\./${src.replaceAll('.', '\\.')}'`), `Offline core is missing icon: ${src}`);
  if (contract.dimensions) assert.deepEqual(pngDimensions(src), contract.dimensions, `PNG dimensions drift: ${src}`);
}

const svg = fs.readFileSync(path.join(ROOT, 'icon.svg'), 'utf8');
assert.match(svg, /<svg\b/i, 'icon.svg must contain an SVG root element.');
assert.match(svg, /viewBox=["']0 0 512 512["']/i, 'icon.svg must preserve the 512x512 design coordinate system.');

const rasterSources = manifest.icons.filter(icon => icon?.type === 'image/png').map(icon => icon.src).sort();
assert.deepEqual(rasterSources, ['icon-192.png', 'icon-512.png']);

console.log(JSON.stringify({
  manifestIcons: 'PASS',
  rasterDimensions: { 'icon-192.png': '192x192', 'icon-512.png': '512x512' },
  svgManifestContract: true,
  offlineIconContract: true
}, null, 2));
