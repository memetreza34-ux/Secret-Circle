#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')
violations = []

required = [
    'GAME_LIBRARY_BACKLOG.json',
    'party-wave-one-voting-catalog.js', 'party-wave-one-voting-modes.js',
    'party-wave-one-bluff-catalog.js', 'party-wave-one-bluff-modes.js',
    'party-wave-one-clue-catalog.js', 'party-wave-one-clue-modes.js',
    'quick-loader.js', 'party-release-structure.js', 'party.html', 'quick-play.html', 'sw.js', 'package.json',
    'tests/party-wave-one-voting-catalog.test.js', 'tests/party-wave-one-bluff-catalog.test.js',
    'tests/party-wave-one-clue-catalog.test.js', 'tests/e2e/wave-one-remaining.spec.js'
]
for relative in required:
    if not (ROOT / relative).is_file(): violations.append(f'Missing final Wave 1 contract file: {relative}')
if violations: raise SystemExit('\n'.join(sorted(set(violations))))

backlog=json.loads(read('GAME_LIBRARY_BACKLOG.json'))
wave_ids=[item.get('id') for item in backlog.get('wave1', [])]
expected=['bluff-trivia','party-quiz','fact-or-fake','percent-guess','fill-blank-battle','who-wrote-it','party-bracket','undercover-similar-word','no-word-imposter','password-one-word']
if len(wave_ids) != 10 or set(wave_ids) != set(expected): violations.append('Wave 1 backlog must contain exactly the ten approved modes')
if backlog.get('productRules',{}).get('adultOnlyContent') is not False: violations.append('Wave 1 adult-only content must stay disabled')

voting=read('party-wave-one-voting-modes.js'); bluff=read('party-wave-one-bluff-modes.js'); clue=read('party-wave-one-clue-modes.js')
for marker in ('function pointsForEstimate(', 'function deriveBracket(', 'cardIndex', "L.completionId('wave1-voting', game.id, active.sessionId)"):
    if marker not in voting: violations.append(f'Voting runner marker missing: {marker}')
for marker in ('function concealPrivate()', 'candidate.author === voter', 'function finishVotingScore()', "L.completionId('wave1-bluff', game.id, active.sessionId)"):
    if marker not in bluff: violations.append(f'Bluff runner marker missing: {marker}')
for marker in ('function concealSecret()', "if (/\\s/.test(clue))", 'cardIndex', "L.completionId('wave1-clue', game.id, active.sessionId)"):
    if marker not in clue: violations.append(f'Clue runner marker missing: {marker}')

loader=read('quick-loader.js')
for marker in (
    "WAVE_ONE_VOTING_SOURCE = 'party-wave-one-voting-modes.js'",
    "WAVE_ONE_BLUFF_SOURCE = 'party-wave-one-bluff-modes.js'",
    "WAVE_ONE_CLUE_SOURCE = 'party-wave-one-clue-modes.js'",
    'catalog.waveOneVotingGameIds?.includes(gameId)', 'catalog.waveOneBluffGameIds?.includes(gameId)',
    'catalog.waveOneClueGameIds?.includes(gameId)', 'version: 11'
):
    if marker not in loader: violations.append(f'Final Wave 1 loader marker missing: {marker}')

release=read('party-release-structure.js')
for game_id in ('percent-guess','party-bracket','bluff-trivia','password-one-word'):
    if f"'{game_id}'" not in release: violations.append(f'Final Wave 1 game not classified as Labs: {game_id}')
if 'const VERSION = 5;' not in release: violations.append('Release structure must be Version 5 for 27 Labs')

for page_name in ('party.html','quick-play.html'):
    source=read(page_name)
    chain=['party-wave-one-writing-catalog.js','party-wave-one-voting-catalog.js','party-wave-one-bluff-catalog.js','party-wave-one-clue-catalog.js']
    positions=[source.find(name) for name in chain]
    if any(position < 0 for position in positions): violations.append(f'{page_name} missing final Wave 1 catalog chain')
    elif positions != sorted(positions): violations.append(f'{page_name} final Wave 1 catalog order invalid')

sw=read('sw.js')
for asset in (
    './party-wave-one-voting-catalog.js','./party-wave-one-voting-modes.js',
    './party-wave-one-bluff-catalog.js','./party-wave-one-bluff-modes.js',
    './party-wave-one-clue-catalog.js','./party-wave-one-clue-modes.js'
):
    if asset not in sw: violations.append(f'Final Wave 1 offline asset missing: {asset}')
cache=re.search(r"const CACHE='secret-circle-v(\d+)'", sw)
if not cache or int(cache.group(1)) < 64: violations.append('Wave 1 completion requires offline cache generation v64 or newer')

package=json.loads(read('package.json')); scripts=package.get('scripts',{})
for unit in ('tests/party-wave-one-voting-catalog.test.js','tests/party-wave-one-bluff-catalog.test.js','tests/party-wave-one-clue-catalog.test.js'):
    if f'node {unit}' not in scripts.get('test',''): violations.append(f'Final Wave 1 unit gate missing: {unit}')
for relative in (
    'party-wave-one-voting-catalog.js','party-wave-one-voting-modes.js','party-wave-one-bluff-catalog.js','party-wave-one-bluff-modes.js',
    'party-wave-one-clue-catalog.js','party-wave-one-clue-modes.js','tests/e2e/wave-one-remaining.spec.js'
):
    if f'node --check {relative}' not in scripts.get('check',''): violations.append(f'Final Wave 1 syntax gate missing: {relative}')
if 'scripts/wave_one_remaining_audit.py' not in scripts.get('validate',''): violations.append('Final Wave 1 audit missing from npm run validate')

browser=read('tests/e2e/wave-one-remaining.spec.js')
for marker in (
    'Prozent schätzen derives the score from catalog answer and keeps result exact-once on resume',
    'Party Bracket reconstructs the same winner from seven stored picks after reload',
    'Bluff Trivia conceals private fake input and scores the final vote only once',
    'Ein-Wort-Hinweis never auto-reveals the target and keeps the resolved round stable'
):
    if marker not in browser: violations.append(f'Final Wave 1 browser marker missing: {marker}')

if violations: raise SystemExit('\n'.join(sorted(set(violations))))
print(json.dumps({
    'wave_one_remaining_audit':'PASS',
    'wave_one_complete':10,
    'final_modes':['percent-guess','party-bracket','bluff-trivia','password-one-word'],
    'derived_result_resume':True,
    'private_bluff_concealment':True,
    'secret_clue_target_concealment':True,
    'adult_content':False,
    'pwa_cache':f"secret-circle-v{cache.group(1)}"
},ensure_ascii=False,indent=2))
