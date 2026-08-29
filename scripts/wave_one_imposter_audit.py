#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')
violations = []

required = [
    'GAME_LIBRARY_BACKLOG.json', 'party-wave-one-catalog.js', 'party-wave-one-imposter-catalog.js',
    'party-wave-one-imposter-modes.js', 'quick-loader.js', 'party-release-structure.js',
    'party.html', 'quick-play.html', 'sw.js', 'package.json',
    'tests/party-wave-one-imposter-catalog.test.js', 'tests/quick-loader.test.js',
    'tests/party-release-structure.test.js', 'tests/e2e/wave-one-imposter.spec.js'
]
for relative in required:
    if not (ROOT / relative).is_file(): violations.append(f'Missing Wave 1 Imposter contract file: {relative}')
if violations: raise SystemExit('\n'.join(sorted(set(violations))))

backlog = json.loads(read('GAME_LIBRARY_BACKLOG.json'))
catalog = read('party-wave-one-imposter-catalog.js')
runner = read('party-wave-one-imposter-modes.js')
loader = read('quick-loader.js')
release = read('party-release-structure.js')
party = read('party.html')
quick = read('quick-play.html')
sw = read('sw.js')
package = json.loads(read('package.json'))
unit = read('tests/party-wave-one-imposter-catalog.test.js')
e2e = read('tests/e2e/wave-one-imposter.spec.js')

wave_ids = [item.get('id') for item in backlog.get('wave1', [])]
for game_id in ('undercover-similar-word', 'no-word-imposter'):
    if game_id not in wave_ids: violations.append(f'Wave 1 backlog missing Imposter game: {game_id}')

for marker in (
    'version: 3', "id: 'undercover-similar-word'", "id: 'no-word-imposter'",
    'waveOneImposterGameIds', 'waveOneQuizGameIds', 'waveOneGameIds', 'quickGameIds',
    "packs: ['Alltag', 'Essen', 'Gaming']", "packs: ['Alltag', 'Essen', 'Orte']"
):
    if marker not in catalog: violations.append(f'Wave 1 Imposter catalog marker missing: {marker}')

for marker in (
    "ACTIVE_KEY = 'secret-circle-party-quick-active-v1'", "const ALLOWED = new Set(C.waveOneImposterGameIds || []);",
    "if (gameId === 'undercover-similar-word')", "if (gameId === 'no-word-imposter')",
    'function concealPrivate()', "addEventListener('blur', concealPrivate)",
    "document.addEventListener('visibilitychange'", 'function resolveVotes()', 'function submitGuess()',
    "L.completionId('wave1-imposter', game.id, active.sessionId)"
):
    if marker not in runner: violations.append(f'Wave 1 Imposter runner marker missing: {marker}')

for marker in (
    "WAVE_ONE_IMPOSTER_SOURCE = 'party-wave-one-imposter-modes.js'",
    'catalog.waveOneImposterGameIds?.includes(gameId)', 'waveOneImposterSource: WAVE_ONE_IMPOSTER_SOURCE', 'version: 9'
):
    if marker not in loader: violations.append(f'Wave 1 Imposter loader marker missing: {marker}')

for game_id in ('undercover-similar-word', 'no-word-imposter'):
    if f"'{game_id}'" not in release: violations.append(f'Wave 1 Imposter game not classified as Labs: {game_id}')

for page_name, source in (('party.html', party), ('quick-play.html', quick)):
    quiz_pos = source.find('party-wave-one-catalog.js')
    imposter_pos = source.find('party-wave-one-imposter-catalog.js')
    if imposter_pos < 0: violations.append(f'{page_name} missing Wave 1 Imposter catalog')
    if quiz_pos < 0 or imposter_pos < quiz_pos: violations.append(f'{page_name} Imposter catalog must load after Wave 1 quiz catalog')

for asset in ('./party-wave-one-imposter-catalog.js', './party-wave-one-imposter-modes.js'):
    if asset not in sw: violations.append(f'Wave 1 Imposter offline core missing: {asset}')
cache = re.search(r"const CACHE='secret-circle-v(\d+)'", sw)
if not cache or int(cache.group(1)) < 62: violations.append('Wave 1 Imposter integration requires offline cache generation v62 or newer')

scripts = package.get('scripts', {})
if 'node tests/party-wave-one-imposter-catalog.test.js' not in scripts.get('test', ''):
    violations.append('Wave 1 Imposter catalog test missing from npm test')
for relative in ('party-wave-one-imposter-catalog.js', 'party-wave-one-imposter-modes.js', 'tests/party-wave-one-imposter-catalog.test.js', 'tests/e2e/wave-one-imposter.spec.js'):
    if f'node --check {relative}' not in scripts.get('check', ''): violations.append(f'Wave 1 Imposter syntax gate missing: {relative}')
if 'scripts/wave_one_imposter_audit.py' not in scripts.get('validate', ''):
    violations.append('Wave 1 Imposter audit missing from npm run validate')

for marker in ('totalBuiltInGames: catalog.games.length', 'waveOneImposterGames: catalog.waveOneImposterGameIds.length', 'adultContent: false'):
    if marker not in unit: violations.append(f'Wave 1 Imposter unit marker missing: {marker}')
for marker in (
    'Undercover similar-word uses private handoff, blur concealment and exact-once result resume',
    'No-word Imposter gets exactly one last guess after being caught',
    'Wave 1 Imposter games use the same Quick-family replacement protection'
):
    if marker not in e2e: violations.append(f'Wave 1 Imposter browser marker missing: {marker}')

if violations: raise SystemExit('\n'.join(sorted(set(violations))))
print(json.dumps({
    'wave_one_imposter_audit': 'PASS',
    'implemented_labs': ['undercover-similar-word', 'no-word-imposter'],
    'shared_imposter_runner': True,
    'private_handoff_concealment': True,
    'secret_vote_flow': True,
    'no_word_last_guess': True,
    'quick_family_resume_and_replacement': True,
    'adult_content': False,
    'pwa_cache': f"secret-circle-v{cache.group(1)}"
}, ensure_ascii=False, indent=2))
