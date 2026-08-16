#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')

required = [
    'CONTENT_AGE_POLICY.md',
    'tests/core-content-quality.test.js',
    'party-routing.js',
    'party-expansion.js',
    'word-packs.js',
    'package.json',
]
for relative in required:
    if not (ROOT / relative).is_file():
        raise SystemExit(f'Core content audit missing file: {relative}')

policy = read('CONTENT_AGE_POLICY.md')
test = read('tests/core-content-quality.test.js')
routing = read('party-routing.js')
expansion = read('party-expansion.js')
word_packs = read('word-packs.js')
package = json.loads(read('package.json'))

core_ids = [
    'imposter', 'truth-dare', 'never-have', 'most-likely', 'would-rather',
    'paranoia', 'charades', 'taboo', 'hot-potato', 'word-chain',
    'two-truths', 'question-imposter', 'location-spy', 'mafia', 'wrong-answers'
]

checks = {
    'policy_has_15_core_ids': all(f'`{game_id}`' in policy for game_id in core_ids),
    'policy_distinguishes_internal_age_from_store_rating': 'kein gesetzliche Altersfreigabe' in policy or 'keine gesetzliche Altersfreigabe' in policy,
    'policy_has_hard_minimums': 'Qualitätsbudgets – harte Mindestwerte' in policy,
    'policy_has_higher_editorial_targets': 'Redaktionelle Releaseziele' in policy and '20–24' in policy,
    'policy_requires_skip_for_sensitive_content': 'Skip jederzeit ermöglichen' in policy,
    'test_uses_final_routing': "require('../party-routing.js')" in test,
    'test_has_15_age_contracts': "assert.equal(Object.keys(expectedAges).length, 15);" in test,
    'test_checks_duplicates': 'assertUniqueItems' in test and 'exactNormalizedDuplicatesRejected' in test,
    'test_checks_markup': 'contains HTML/script markup' in test and 'markupRejected' in test,
    'test_checks_truth_dare_structure': "catalog.content['truth-dare']" in test and "['truth', 'dare']" in test,
    'test_checks_would_rather_structure': "catalog.content['would-rather']" in test and 'pair.length === 2' in test,
    'test_checks_taboo_structure': 'card.banned.length === 3' in test,
    'test_checks_question_imposter_structure': "catalog.content['question-imposter']" in test and 'pair.main' in test and 'pair.imposter' in test,
    'test_checks_location_uniqueness': "location-spy/${pack}" in test,
    'test_checks_mafia_roles': "catalog.content.mafia.Schnell" in test and "catalog.content.mafia.Erweitert" in test,
    'test_checks_word_chain_letters': "Word Chain start must be one letter" in test,
    'test_checks_word_imposter_14x12': 'wordCategories.length, 14' in test and 'entries.length === 12' in test and 'wordImposterWords, 168' in test,
    'routing_recursively_flattens_structured_packs': 'function flattenItems(value)' in routing and 'Object.values(value).flatMap(flattenItems)' in routing,
    'advanced_pack_names_aligned': all(marker in expansion for marker in (
        "'two-truths': Object.freeze(['Locker', 'Reise', 'Schule & Arbeit'])",
        "'question-imposter': Object.freeze(['Alltag', 'Meinungen', 'Schätzfragen'])",
        "mafia: Object.freeze(['Schnell', 'Klassisch', 'Erweitert'])",
        'Schätzfragen: [',
    )),
    'word_imposter_has_14_category_definitions': word_packs.count("label:") == 14,
    'contract_in_unit_gate': 'tests/core-content-quality.test.js' in package.get('scripts', {}).get('test', ''),
    'contract_in_syntax_gate': 'tests/core-content-quality.test.js' in package.get('scripts', {}).get('check', ''),
    'audit_in_validate_gate': 'scripts/core_content_audit.py' in package.get('scripts', {}).get('validate', ''),
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit(f'Core content audit failed: {", ".join(failed)}')

print(json.dumps({
    'core_content_audit': 'PASS',
    'core_games': len(core_ids),
    'age_levels': ['all', 'teen'],
    'structured_games_checked': [
        'truth-dare', 'would-rather', 'taboo', 'question-imposter',
        'location-spy', 'mafia', 'word-chain', 'imposter'
    ],
    'hard_minimums_are_regression_gates': True,
    'higher_editorial_targets_remain_manual_release_work': True,
    'checks': checks,
}, ensure_ascii=False, indent=2))
