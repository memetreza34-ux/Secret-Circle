'use strict';
const { spawnSync } = require('node:child_process');
const candidates = process.platform === 'win32' ? ['python', 'python3'] : ['python3', 'python'];
const python = candidates.find(command => spawnSync(command, ['-c', 'import sys; sys.exit(0 if sys.version_info >= (3, 9) else 1)'], { stdio: 'ignore' }).status === 0);
if (!python) {
  process.stderr.write('Python 3.9 oder neuer fehlt.\n');
  process.exit(1);
}
const result = spawnSync(python, process.argv.slice(2), { stdio: 'inherit' });
if (result.error) process.stderr.write(result.error.message + '\n');
process.exit(result.status ?? 1);
