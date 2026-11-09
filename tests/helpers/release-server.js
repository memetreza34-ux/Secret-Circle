const { execFileSync } = require('node:child_process');
const http = require('node:http');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '../..');
const types = { '.js': 'application/javascript', '.json': 'application/json', '.html': 'text/html', '.css': 'text/css', '.webmanifest': 'application/manifest+json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.md': 'text/plain' };
const snapshots = new Map();

function snapshot(ref = 'HEAD') {
  if (!snapshots.has(ref)) {
    const data = JSON.parse(execFileSync(process.execPath, ['scripts/run_python.cjs', 'tests/helpers/release-snapshot.py', ref], { cwd: ROOT, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }));
    data.files = new Map(Object.entries(data.files).map(([name, value]) => [name, Buffer.from(value, 'base64')]));
    snapshots.set(ref, data);
  }
  return snapshots.get(ref);
}

function headersFor(files, name) {
  const headers = {};
  let pattern = '';
  for (const line of files.get('_headers').toString().split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (!/^\s/.test(line)) { pattern = line.trim(); continue; }
    if (pattern !== '/*' && pattern !== '/' + name) continue;
    const colon = line.indexOf(':');
    if (colon < 0) throw new Error('Ungültige Headerregel im lokalen Release-Testserver.');
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    headers[key] = headers[key] ? headers[key] + ', ' + value : value;
  }
  return headers;
}

async function startServer(initial) {
  let current = initial;
  let blocked = null;
  const server = http.createServer((request, response) => {
    let name;
    try { name = decodeURIComponent(new URL(request.url, 'http://localhost').pathname.slice(1)) || 'index.html'; }
    catch { response.writeHead(400); response.end(); return; }
    const body = name !== '_headers' && name !== blocked ? current.files.get(name) : null;
    response.writeHead(body ? 200 : 404, { 'Cache-Control': 'no-store', ...headersFor(current.files, name), 'Content-Type': types[path.extname(name)] || 'application/octet-stream' });
    response.end(body || 'Nicht gefunden');
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return {
    origin: 'http://127.0.0.1:' + server.address().port,
    use(next) { current = next; },
    block(name) { blocked = name; },
    close() { server.closeAllConnections?.(); return new Promise(resolve => server.close(resolve)); }
  };
}

module.exports = { snapshot, startServer };
