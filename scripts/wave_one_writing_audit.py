#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')
violations = []

required = [
    'GAME_LIBRARY_BACKLOG.json', 'party-wave-one-writing-catalog.js', 'party-wave-one-writing-modes.js',
    'quick-loader.js', 'party-release-structure.js', 'party.html', 'quick-play.html', 'sw.js', 'package.json',
    'tests/party-wave-one-writing-catalog.test.js', 'tests/quick-loader.test.js',
    'tests/party-release-structure.test.js', 'tests/e2e/wave-one-writing.spec.js'
]
for relative in required:
    if not (ROOT / relative).is_file(): violations.append(f'Missing Wave 1 writing contract file: {relative}')
if violations: raise SystemExit('\n'.join(sorted(set(violations))))

backlog = json.loads(read('GAME_LIBRARY_BACKLOG.json'))
catalog = read('party-wave-one-writing-catalog.js')
runner = read('party-wave-one-writing-modes.js')
loader = read('quick-loader.js')
release = read('party-release-structure.js')
party = read('party.html')
quick = read('quick-play.html')
sw = read('sw.js')
package = json.loads(read('package.json'))
unit = read('tests/party-wave-one-writing-catalog.test.js')
e2e = read('tests/e2e/wave-one-writing.spec.js')
loader_test = read('tests/quick-loader.test.js')
release_test = read('tests/party-release-structure.test.js')

wave_ids = [item.get('id') for item in backlog.get('wave1', [])]
for game_id in ('fill-blank-battle', 'who-wrote-it'):
    if game_id not in wave_ids: violations.append(f'Wave 1 backlog missing writing game: {game_id}')

for marker in (
    'version: 4', "id: 'fill-blank-battle'", "id: 'who-wrote-it'", 'waveOneWritingGameIds',
    "packs: ['Alltag', 'Gaming', 'Fantasie']", "packs: ['Freundschaft', 'Icebreaker', 'Alltag']"
):
    if marker not in catalog: violations.append(f'Wave 1 writing catalog marker missing: {marker}')

for marker in (
    "ACTIVE_KEY = 'secret-circle-party-quick-active-v1'", "const ALLOWED = new Set(C.waveOneWritingGameIds || []);",
    'function concealEntry()', "addEventListener('blur', concealEntry)", "document.addEventListener('visibilitychange'",
    'function normalizeAnswers(', 'function normalizeGuesses(', 'function chooseWinner(', 'function submitAuthorGuess(',
    "L.completionId('wave1-writing', game.id, active.sessionId)", 'input.maxLength = 140'
):
    if marker not in runner: violations.append(f'Wave 1 writing runner marker missing: {marker}')

for marker in (
    "WAVE_ONE_WRITING_SOURCE = 'party-wave-one-writing-modes.js'",
    'catalog.waveOneWritingGameIds?.includes(gameId)', 'waveOneWritingSource: WAVE_ONE_WRITING_SOURCE', 'version: 10'
):
    if marker not in loader: violations.append(f'Wave 1 writing loader marker missing: {marker}')

for game_id in ('fill-blank-battle', 'who-wrote-it'):
    if f"'{game_id}'" not in release: violations.append(f'Wave 1 writing game not classified as Labs: {game_id}')

for page_name, source in (('party.html', party), ('quick-play.html', quick)):
    base_pos = source.find('party-wave-one-catalog.js')
    writing_pos = source.find('party-wave-one-writing-catalog.js')
    if writing_pos < 0: violations.append(f'{page_name} missing Wave 1 writing catalog')
    if base_pos < 0 or writing_pos < base_pos: violations.append(f'{page_name} writing catalog must load after base Wave 1 catalog')

for asset in ('./party-wave-one-writing-catalog.js', './party-wave-one-writing-modes.js'):
    if asset not in sw: violations.append(f'Wave 1 writing offline core missing: {asset}')
cache = re.search(r"const CACHE='secret-circle-v(\d+)'", sw)
if not cache or int(cache.group(1)) < 63: violations.append('Wave 1 writing integration requires offline cache generation v63 or newer')

scripts = package.get('scripts', {})
if 'node tests/party-wave-one-writing-catalog.test.js' not in scripts.get('test', ''):
    violations.append('Wave 1 writing catalog test missing from npm test')
for relative in ('party-wave-one-writing-catalog.js', 'party-wave-one-writing-modes.js', 'tests/party-wave-one-writing-catalog.test.js', 'tests/e2e/wave-one-writing.spec.js'):
    if f'node --check {relative}' not in scripts.get('check', ''): violations.append(f'Wave 1 writing syntax gate missing: {relative}')
if 'scripts/wave_one_writing_audit.py' not in scripts.get('validate', ''):
    violations.append('Wave 1 writing audit missing from npm run validate')

for marker in ('totalBuiltInGames: catalog.games.length', 'waveOneWritingGames: catalog.waveOneWritingGameIds.length', 'adultContent: false'):
    if marker not in unit: violations.append(f'Wave 1 writing unit marker missing: {marker}')
for marker in (
    'Wave 1 writing private entry conceals on blur without losing the stored round',
    'Satzduell keeps anonymous result and score exact-once through reload/resume',
    'Wer hat das geschrieben reveals authors only after all guesses and resumes the result'
):
    if marker not in e2e: violations.append(f'Wave 1 writing browser marker missing: {marker}')
for marker in ('waveOneWritingEngineRoutedBeforeWaveFallback: true', 'loaderVersion: loader.version'):
    if marker not in loader_test: violations.append(f'Wave 1 writing loader-test marker missing: {marker}')
for marker in ('catalog.games.length, 51', 'labs: 23'):
    if marker not in release_test: violations.append(f'Wave 1 writing release-count marker missing: {marker}')

if violations: raise SystemExit('\n'.join(sorted(set(violations))))
print(json.dumps({
    'wave_one_writing_audit': 'PASS',
    'implemented_labs': ['fill-blank-battle', 'who-wrote-it'],
    'shared_writing_runner': True,
    'private_entry_concealment': True,
    'anonymous_vote_and_guess': True,
    'answer_max_length': 140,
    'quick_family_resume_and_replacement': True,
    'adult_content': False,
    'pwa_cache': f"secret-circle-v{cache.group(1)}"
}, ensure_ascii=False, indent=2))
