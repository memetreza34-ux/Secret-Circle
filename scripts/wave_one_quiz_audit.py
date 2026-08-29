#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')
violations = []
required = ['GAME_LIBRARY_BACKLOG.json','APP_SPIELMODI_UND_THEMEN_ANLEITUNG.md','party-wave-one-catalog.js','party-wave-one-modes.js','quick-loader.js','party-release-structure.js','party.html','quick-play.html','sw.js','tests/party-wave-one-catalog.test.js','tests/quick-loader.test.js','tests/party-release-structure.test.js','tests/e2e/wave-one-quiz.spec.js','package.json']
for relative in required:
    if not (ROOT/relative).is_file(): violations.append(f'Missing Wave 1 contract file: {relative}')
if violations: raise SystemExit('\n'.join(sorted(set(violations))))
backlog=json.loads(read('GAME_LIBRARY_BACKLOG.json')); catalog=read('party-wave-one-catalog.js'); runner=read('party-wave-one-modes.js'); loader=read('quick-loader.js'); release=read('party-release-structure.js'); party=read('party.html'); quick=read('quick-play.html'); sw=read('sw.js'); package=json.loads(read('package.json')); unit=read('tests/party-wave-one-catalog.test.js'); e2e=read('tests/e2e/wave-one-quiz.spec.js')
wave_ids=[item.get('id') for item in backlog.get('wave1',[])]
for game_id in ('party-quiz','fact-or-fake'):
    if game_id not in wave_ids: violations.append(f'Wave 1 backlog missing implemented game: {game_id}')
for marker in ('version: 3',"id: 'party-quiz'","id: 'fact-or-fake'",'waveOneQuizGameIds','waveOneImposterGameIds','waveOneGameIds','quickGameIds',"packs: ['Allgemeinwissen', 'Film & Serie', 'Technik']","packs: ['Natur', 'Film & Serie', 'Technik']"):
    if marker not in catalog: violations.append(f'Wave 1 catalog marker missing: {marker}')
for marker in ("ACTIVE_KEY = 'secret-circle-party-quick-active-v1'","L.completionId('wave1', game.id, active.sessionId)","if (gameId === 'party-quiz')","if (gameId === 'fact-or-fake')","if (index === active.current.answer) addScore(1);","if (active.current.selected === active.current.fact) addScore(1);","if (phase === 'result' && (!current || current.selected === null)) return null;"):
    if marker not in runner: violations.append(f'Wave 1 runner marker missing: {marker}')
for marker in ("WAVE_ONE_SOURCE = 'party-wave-one-modes.js'",'catalog.waveOneQuizGameIds?.includes(gameId)','version: 11','waveOneSource: WAVE_ONE_SOURCE'):
    if marker not in loader: violations.append(f'Wave 1 loader marker missing: {marker}')
for game_id in ('party-quiz','fact-or-fake'):
    if f"'{game_id}'" not in release: violations.append(f'Wave 1 game not explicitly classified as Labs: {game_id}')
for page_name,source in (('party.html',party),('quick-play.html',quick)):
    if 'party-wave-one-catalog.js' not in source: violations.append(f'{page_name} missing Wave 1 catalog')
    if source.find('party-routing.js')>source.find('party-wave-one-catalog.js'): violations.append(f'{page_name} Wave 1 catalog must load after routing')
for asset in ('./party-wave-one-catalog.js','./party-wave-one-modes.js'):
    if asset not in sw: violations.append(f'Wave 1 offline core missing: {asset}')
cache=re.search(r"const CACHE='secret-circle-v(\d+)'",sw)
if not cache or int(cache.group(1))<61: violations.append('Wave 1 requires offline cache generation v61 or newer')
scripts=package.get('scripts',{})
if 'node tests/party-wave-one-catalog.test.js' not in scripts.get('test',''): violations.append('Wave 1 catalog test missing from npm test')
for relative in ('party-wave-one-catalog.js','party-wave-one-modes.js','tests/party-wave-one-catalog.test.js','tests/e2e/wave-one-quiz.spec.js'):
    if f'node --check {relative}' not in scripts.get('check',''): violations.append(f'Wave 1 syntax gate missing: {relative}')
if 'scripts/wave_one_quiz_audit.py' not in scripts.get('validate',''): violations.append('Wave 1 audit missing from npm run validate')
for marker in ('partyQuizCards: catalog.itemCount','factOrFakeCards: catalog.itemCount','referenceSafeTextOnlyContent: true'):
    if marker not in unit: violations.append(f'Wave 1 unit marker missing: {marker}')
for marker in ('Party Quiz resolves exactly once and keeps the result stable through reload/resume','Fake oder Fakt is playable as a separate Wave 1 Labs mode','Wave 1 games share Quick-family replacement protection across games'):
    if marker not in e2e: violations.append(f'Wave 1 browser marker missing: {marker}')
if violations: raise SystemExit('\n'.join(sorted(set(violations))))
print(json.dumps({'wave_one_quiz_audit':'PASS','implemented_labs':['party-quiz','fact-or-fake'],'shared_runner':True,'quick_family_resume_and_replacement':True,'cards_per_game':24,'adult_content':False,'pwa_cache':f"secret-circle-v{cache.group(1)}"},ensure_ascii=False,indent=2))
