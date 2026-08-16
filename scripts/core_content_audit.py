#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')

required = [
    'CONTENT_AGE_POLICY.md', 'tests/core-content-quality.test.js',
    'party-routing.js', 'party-expansion.js', 'party-core-release-catalog.js',
    'party-core-classic-content.js', 'word-packs.js', 'sw.js', 'package.json'
]
for relative in required:
    if not (ROOT / relative).is_file():
        raise SystemExit(f'Core content audit missing file: {relative}')

policy = read('CONTENT_AGE_POLICY.md')
test = read('tests/core-content-quality.test.js')
routing = read('party-routing.js')
release_content = read('party-core-release-catalog.js')
classic_content = read('party-core-classic-content.js')
sw = read('sw.js')
package = json.loads(read('package.json'))

checks = {
    'policy_has_quantity_contract': 'Quantitative Release-Gates' in policy and 'alle 15 Kernspiele ihre definierten quantitativen Releaseziele erreicht' in policy,
    'policy_has_privacy_contract': 'SC-CONTENT-PRIV-001' in policy and 'private Chats oder Nachrichten' in policy,
    'final_routing_uses_classic_content': "require('./party-core-classic-content.js')" in routing,
    'release_content_module_contract': all(marker in release_content for marker in ('coreReleaseContentVersion', 'coreReleaseContentGames', 'function mergeContent')),
    'classic_content_module_contract': all(marker in classic_content for marker in ('coreClassicContentVersion', 'coreClassicContentGames', 'function mergeNested', 'editorialReplacementCount')),
    'privacy_replacements_defined': all(marker in classic_content for marker in (
        'Was ist das Seltsamste in deiner Kamerarolle?',
        'Lies die letzte Nachricht auf deinem Handy wie ein Theatermonolog, ohne Namen zu nennen.',
        'Welches Foto-Motiv findest du besonders lustig?',
        'Lies einen selbst erfundenen Satz wie einen dramatischen Theatermonolog vor.'
    )),
    'privacy_regression_test': all(marker in test for marker in (
        'privateDevicePromptsRemoved: true', 'editorialReplacementCount, 2',
        'Core content must not expose private third-party messages',
        'Core content must not prompt users to inspect private camera-roll material'
    )),
    'all_quantitative_targets_required': 'assert.deepEqual(editorialShortfalls, []' in test and 'quantitativeTargetsMet: true' in test,
    'truth_dare_12_plus_12': 'raw.truth.length >= 12' in test and 'raw.dare.length >= 12' in test,
    'word_imposter_14x12': 'wordCategories.length, 14' in test and 'entries.length === 12' in test and 'wordImposterWords, 168' in test,
    'content_modules_offline': all(f"'./{asset}'" in sw for asset in ('party-core-release-catalog.js', 'party-core-classic-content.js')),
    'content_modules_in_syntax_gate': all(marker in package.get('scripts', {}).get('check', '') for marker in ('node --check party-core-release-catalog.js', 'node --check party-core-classic-content.js')),
    'content_test_in_unit_gate': 'tests/core-content-quality.test.js' in package.get('scripts', {}).get('test', ''),
    'audit_in_validate_gate': 'scripts/core_content_audit.py' in package.get('scripts', {}).get('validate', ''),
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit(f'Core content audit failed: {", ".join(failed)}')

print(json.dumps({
    'core_content_audit': 'PASS',
    'quantitative_targets': 'IMPLEMENTED_NOT_RUNNER_VERIFIED',
    'privacy_findings_closed': ['SC-CONTENT-PRIV-001'],
    'manual_semantic_review': 'IN_PROGRESS',
    'checks': checks,
}, ensure_ascii=False, indent=2))
