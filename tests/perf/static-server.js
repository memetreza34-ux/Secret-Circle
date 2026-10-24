'use strict';

/* Statischer Server nur für die Ladezeitmessung (tests/perf). Er liefert wie
   ein Static-Host gzip-komprimiert, mit HTTP/1.1 Keep-alive, ETag und
   „max-age=0, must-revalidate“. python3 -m http.server komprimiert nicht und
   schließt jede Verbindung; unter Netzdrosselung wären die Zahlen damit zu
   pessimistisch.
   Aufruf: node tests/perf/static-server.js <Verzeichnis> <Port> */

const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = path.resolve(process.argv[2] || '.');
const port = Number(process.argv[3] || 4185);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};
const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.webmanifest', '.svg']);
const gzipCache = new Map();
const totals = { responses: 0, bodyBytes: 0 };

function send(res, status, headers, body) {
  headers['Content-Length'] = Buffer.byteLength(body);
  totals.responses += 1;
  totals.bodyBytes += Buffer.byteLength(body);
  res.writeHead(status, headers);
  res.end(body);
}

http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { send(res, 400, {}, ''); return; }
  if (pathname === '/__perf_stats__') {
    const body = JSON.stringify(totals);
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Content-Length': Buffer.byteLength(body) });
    res.end(body);
    return;
  }
  if (pathname.endsWith('/')) pathname += 'index.html';
  const file = path.join(root, pathname);
  if (!file.startsWith(root + path.sep)) { send(res, 403, {}, ''); return; }

  fs.stat(file, (statError, stat) => {
    if (statError || !stat.isFile()) { send(res, 404, { 'Content-Type': 'text/plain' }, 'Not found'); return; }
    const ext = path.extname(file).toLowerCase();
    const gzip = COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] || '');
    const etag = `"${stat.size.toString(36)}-${Math.floor(stat.mtimeMs).toString(36)}${gzip ? '-gz' : ''}"`;
    const headers = {
      'Content-Type': TYPES[ext] || 'application/octet-stream',
      'Cache-Control': path.basename(file) === 'sw.js' ? 'no-cache' : 'public, max-age=0, must-revalidate',
      ETag: etag,
      Vary: 'Accept-Encoding'
    };
    if (req.headers['if-none-match'] === etag) { send(res, 304, headers, ''); return; }

    fs.readFile(file, (readError, body) => {
      if (readError) { send(res, 500, {}, ''); return; }
      if (!gzip) { send(res, 200, headers, req.method === 'HEAD' ? '' : body); return; }
      let compressed = gzipCache.get(file + etag);
      if (!compressed) {
        compressed = zlib.gzipSync(body, { level: 6 });
        gzipCache.set(file + etag, compressed);
      }
      headers['Content-Encoding'] = 'gzip';
      send(res, 200, headers, req.method === 'HEAD' ? '' : compressed);
    });
  });
}).listen(port, '127.0.0.1', () => {
  process.stdout.write(`perf static server: ${root} on http://127.0.0.1:${port}\n`);
});
