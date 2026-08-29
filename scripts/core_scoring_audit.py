#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')

required = [
    'CORE_SCORING_RULES.md', 'tests/core-scoring-contract.test.js',
    'game-engine.js', 'party-hub.js', 'party-hub-timers.js', 'party-advanced.js',
    'package.json'
]
for relative in required:
    if not (ROOT / relative).is_file():
        raise SystemExit(f'Core scoring audit missing file: {relative}')

doc = read('CORE_SCORING_RULES.md')
test = read('tests/core-scoring-contract.test.js')
engine = read('game-engine.js')
hub = read('party-hub.js')
timers = read('party-hub-timers.js')
advanced = read('party-advanced.js')
package = json.loads(read('package.json'))

core_titles = [
    'Word Imposter', 'Wahrheit oder Pflicht', 'Ich habe noch nie', 'Wer würde eher?',
    'Entweder oder', 'Paranoia', 'Scharade', 'Nicht sagen! / Tabu', 'Heiße Kartoffel',
    'Wortkette', 'Zwei Wahrheiten, eine Lüge', 'Question Imposter', 'Location Spy',
    'Mafia', 'Nur falsche Antworten'
]

checks = {
    'all_15_documented': all(f'| {title}' in doc for title in core_titles),
    'score_not_winner_contract': all(marker in doc for marker in (
        'Ein Zähler ist nicht automatisch ein Siegerpunktestand.',
        'Score und Sieger dürfen nicht vermischt werden',
        'Keine erfundene Teamwertung',
        'nur innerhalb desselben Spiels',
    )),
    'word_imposter_individual_scores': all(marker in engine for marker in (
        'scores: Object.fromEntries(players.map(name => [name, 0]))',
        'game.scores[name] += 2', 'game.scores[name] += 1',
        "game.winner = 'imposters'", "game.winner = 'innocents'",
        'function leaderboard(game)',
    )),
    'direct_hub_no_hidden_scoring': 'session.score +=' not in hub,
    'hub_skip_no_point': 'Runde übersprungen. Dafür wurde kein Punkt vergeben.' in hub,
    'timed_counter_count': timers.count('current.score += 1;') == 3,
    'hot_potato_scoreless': 'Wer das Gerät jetzt hält, verliert diese Runde.' in timers,
    'advanced_plus_one_count': len(re.findall(r'session\.score \+= 1;', advanced)) == 1,
    'advanced_plus_two_count': len(re.findall(r'session\.score \+= 2;', advanced)) == 3,
    'advanced_plus_three_count': len(re.findall(r'session\.score \+= 3;', advanced)) == 1,
    'location_spy_winner_separate': all(marker in advanced for marker in (
        'const spyWon = data.spyCorrect || data.correct === false;',
        "nodes.eyebrow.textContent = spyWon ? 'Spion gewinnt' : 'Gruppe gewinnt';",
    )),
    'mafia_winner_role_based': all(marker in advanced for marker in (
        "if (mafiaAlive === 0) return 'Dorf';",
        "if (mafiaAlive >= villageAlive) return 'Mafia';",
    )),
    'contract_test_in_unit_gate': 'tests/core-scoring-contract.test.js' in package.get('scripts', {}).get('test', ''),
    'contract_test_in_syntax_gate': 'tests/core-scoring-contract.test.js' in package.get('scripts', {}).get('check', ''),
    'contract_test_has_15': 'assert.equal(expectedIds.length, 15);' in test,
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit(f'Core scoring audit failed: {", ".join(failed)}')

print(json.dumps({
    'core_scoring_audit': 'PASS',
    'core_games': 15,
    'individual_match_score_games': ['imposter'],
    'direct_counter_games': ['charades', 'taboo', 'word-chain'],
    'scoreless_direct_games': [
        'truth-dare', 'never-have', 'most-likely', 'would-rather',
        'paranoia', 'hot-potato', 'wrong-answers'
    ],
    'advanced_round_outcome_games': [
        'two-truths', 'question-imposter', 'location-spy', 'mafia'
    ],
    'score_is_not_universal_winner': True,
    'checks': checks,
}, ensure_ascii=False, indent=2))
