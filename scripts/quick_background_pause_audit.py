#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda p: (ROOT / p).read_text(encoding='utf-8')
violations = []
required = ['party-session-controls.js','tests/party-session-controls.test.js','tests/e2e/quick-background-pause.spec.js','package.json','sw.js','tests/service-worker.test.js']
for relative in required:
    if not (ROOT / relative).is_file(): violations.append(f'Missing BG59 contract file: {relative}')
if violations: raise SystemExit('\n'.join(sorted(set(violations))))

controls = read('party-session-controls.js'); unit = read('tests/party-session-controls.test.js')
e2e = read('tests/e2e/quick-background-pause.spec.js'); package = json.loads(read('package.json'))
sw = read('sw.js'); sw_test = read('tests/service-worker.test.js')

for marker in (
    'const VERSION = 5;','function handleVisibilityChange()',
    'if (!documentRef?.hidden) return false;',
    'if (!sessionActive || !timerNode || !timerEnd || timerFinished || timerDurationMs <= 0) return false;',
    'setPaused(true);',"documentRef?.addEventListener?.('visibilitychange', handleVisibilityChange);",'handleVisibilityChange,'
):
    if marker not in controls: violations.append(f'BG59 controller marker missing: {marker}')
for forbidden in ("if (!documentRef?.hidden) setPaused(false)","if (documentRef?.hidden) setPaused(true); else setPaused(false)"):
    if forbidden in controls: violations.append('BG59 must never auto-resume when visibility returns.')
for marker in (
    'Controls.version, 5','backgroundVisibilityAutoPause: true','visibleRequiresExplicitResume: true',
    'background time must not reduce the timer','returning visible must require explicit resume','timer continues only after explicit resume'
):
    if marker not in unit: violations.append(f'BG59 unit marker missing: {marker}')
for marker in (
    'BG59/HS60 hidden Quick timer auto-pauses, persists immediately and requires explicit resume',
    "Object.defineProperty(document, 'hidden'", "document.dispatchEvent(new Event('visibilitychange'))",
    "toHaveText('Fortsetzen')", 'expect(secondsFromClock(await timer.textContent())).toBe(pausedAt)',
    "page.locator('#quick-pause').click()", 'toBeLessThan(pausedAt)'
):
    if marker not in e2e: violations.append(f'BG59 browser marker missing: {marker}')

scripts = package.get('scripts', {})
if 'node tests/party-session-controls.test.js' not in scripts.get('test',''): violations.append('BG59 unit missing from npm test.')
if 'node --check tests/e2e/quick-background-pause.spec.js' not in scripts.get('check',''): violations.append('BG59 browser spec missing from syntax preflight.')
if 'scripts/quick_background_pause_audit.py' not in scripts.get('validate',''): violations.append('BG59 audit missing from npm validate.')
if scripts.get('test:e2e') != 'playwright test': violations.append('BG59 browser contract missing from full Playwright gate.')
cache = re.search(r"const CACHE='secret-circle-v(\d+)'", sw)
if not cache or int(cache.group(1)) < 59: violations.append('BG59 requires cache v59 or newer.')
if cache and f"secret-circle-v{cache.group(1)}" not in sw_test: violations.append('BG59 SW test cache drift.')

if violations: raise SystemExit('\n'.join(sorted(set(violations))))
print(json.dumps({
  'quick_background_pause_audit':'PASS','session_controls_version':5,'hidden_auto_pause':True,
  'background_elapsed_time_excluded':True,'visible_requires_explicit_resume':True,
  'browser_visibility_contract':True,'pwa_cache':f"secret-circle-v{cache.group(1)}"
}, ensure_ascii=False, indent=2))
