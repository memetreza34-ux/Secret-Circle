#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
read = lambda relative: (ROOT / relative).read_text(encoding='utf-8')

required = [
    'CONTENT_AGE_POLICY.md', 'CORE_CONTENT_REVIEW.md', 'FAN_CONTENT_REVIEW.md',
    'tests/core-content-quality.test.js', 'tests/party-mega-catalog.test.js',
    'party-routing.js', 'party-expansion.js', 'party-mega-catalog.js',
    'party-core-release-catalog.js', 'party-core-classic-content.js',
    'word-packs.js', 'sw.js', 'package.json', 'scripts/reference_content_audit.py'
]
for relative in required:
    if not (ROOT / relative).is_file():
        raise SystemExit(f'Core content audit missing file: {relative}')

policy = read('CONTENT_AGE_POLICY.md')
review = read('CORE_CONTENT_REVIEW.md')
fan_review = read('FAN_CONTENT_REVIEW.md')
test = read('tests/core-content-quality.test.js')
mega_test = read('tests/party-mega-catalog.test.js')
routing = read('party-routing.js')
expansion = read('party-expansion.js')
mega_content = read('party-mega-catalog.js')
release_content = read('party-core-release-catalog.js')
classic_content = read('party-core-classic-content.js')
word_packs = read('word-packs.js')
sw = read('sw.js')
reference_audit = read('scripts/reference_content_audit.py')
package = json.loads(read('package.json'))

checks = {
    'policy_has_quantity_contract': 'Quantitative Release-Gates' in policy and 'alle 15 Kernspiele ihre definierten quantitativen Releaseziele erreicht' in policy,
    'policy_has_privacy_contract': 'SC-CONTENT-PRIV-001' in policy and 'private Chats oder Nachrichten' in policy,
    'core_source_review_15_of_15': '15/15 Core-Quellpass' in review and review.count('| PREPARED |') >= 15,
    'final_routing_uses_classic_content': "require('./party-core-classic-content.js')" in routing,
    'release_content_module_contract': all(marker in release_content for marker in ('coreReleaseContentVersion', 'coreReleaseContentGames', 'function mergeContent')),
    'classic_content_module_contract': all(marker in classic_content for marker in (
        'coreClassicContentVersion', 'coreClassicContentGames', 'function mergeNested', 'editorialReplacementCount',
        'referenceSafeGameOverrides', 'referenceSafeContent', 'referenceSafeRemovedConcreteNames'
    )),
    'classic_content_version_4': 'const VERSION = 4;' in classic_content,
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
    'generic_core_reference_replacements': all(marker in word_packs for marker in ('Funkverbindung', 'Filmpreis', 'Motorsport')) and all(marker not in word_packs for marker in ("['Bluetooth'", "['Oscar'", "['Formel 1'")),
    'generic_core_reference_regression_test': 'unnecessaryCoreReferenceTermsRemoved: true' in test and all(marker in test for marker in ('Bluetooth', 'Oscar', 'Formel 1', 'Funkverbindung', 'Filmpreis', 'Motorsport')),
    'anime_runtime_is_reference_safe': all(marker in classic_content for marker in (
        'Anime-Archetypen erraten', 'Action & Abenteuer', 'Magie & Mystery', 'Fantasy & Alltag',
        'referenceSafeRemovedConcreteNames: 40'
    )),
    'anime_source_is_reference_safe': all(marker in mega_content for marker in (
        "id: 'anime-guess', title: 'Anime-Archetypen erraten'", 'Ehrgeiziger Kampfkunst-Schüler', 'Fluchjägerin'
    )) and all(marker not in mega_content for marker in ('Son Goku', 'Naruto Uzumaki', 'Pikachu', 'Subaru Natsuki')),
    'anime_source_regression_test': 'animeSourceReferenceSafe: true' in mega_test and 'concreteAnimeReferencesRemovedFromShippedSource' in mega_test,
    'browser_brand_removed_upstream': "banned: ['Webseite', 'Internet', 'Tab']" in expansion and 'Chrome' not in expansion and 'chromeReferenceRemoved: true' in test,
    'spectrum_branding_removed_upstream': "id: 'wavelength', title: 'Spektrum-Tipp'" in expansion and 'Wellenlänge' not in expansion and 'wavelengthBrandingRemoved: true' in test,
    'franchise_like_lion_removed': 'Löwenkönig' not in mega_content and "['🦁🌾', 'Löwe']" in mega_content and 'franchiseLikeLionReferenceRemoved: true' in mega_test,
    'reference_safe_ids_cover_anime_and_spectrum': "new Set(['anime-guess', 'wavelength'])" in test,
    'all_quantitative_targets_required': 'assert.deepEqual(editorialShortfalls, []' in test and 'quantitativeTargetsMet: true' in test,
    'truth_dare_12_plus_12': 'raw.truth.length >= 12' in test and 'raw.dare.length >= 12' in test,
    'word_imposter_14x12': 'wordCategories.length, 14' in test and 'entries.length === 12' in test and 'wordImposterWords, 168' in test,
    'content_modules_offline': all(f"'./{asset}'" in sw for asset in ('party-expansion.js', 'party-mega-catalog.js', 'party-core-release-catalog.js', 'party-core-classic-content.js')),
    'content_modules_in_syntax_gate': all(marker in package.get('scripts', {}).get('check', '') for marker in ('node --check party-expansion.js', 'node --check party-mega-catalog.js', 'node --check party-core-release-catalog.js', 'node --check party-core-classic-content.js')),
    'content_tests_in_unit_gate': all(marker in package.get('scripts', {}).get('test', '') for marker in ('tests/core-content-quality.test.js', 'tests/party-mega-catalog.test.js')),
    'reference_audit_contract': all(marker in reference_audit for marker in ('SHIPPED_CONTENT_SOURCES', 'BLOCKED_LITERALS', 'REVIEW_REQUIRED_LITERALS', 'physical_source_cleanup_required')),
    'audits_in_validate_gate': all(marker in package.get('scripts', {}).get('validate', '') for marker in ('scripts/core_content_audit.py', 'scripts/reference_content_audit.py')),
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit(f'Core content audit failed: {", ".join(failed)}')

print(json.dumps({
    'core_content_audit': 'PASS',
    'quantitative_targets': 'IMPLEMENTED_NOT_RUNNER_VERIFIED',
    'core_source_review': '15_OF_15_PREPARED_REAL_GROUPS_OPEN',
    'privacy_findings_closed': ['SC-CONTENT-PRIV-001'],
    'generic_core_reference_terms': 'IMPLEMENTED_NOT_RUNNER_VERIFIED',
    'anime_reference_safe_runtime_and_source': 'IMPLEMENTED_NOT_RUNNER_VERIFIED',
    'chrome_reference_cleanup_upstream': 'IMPLEMENTED_NOT_RUNNER_VERIFIED',
    'spectrum_branding_cleanup_upstream': 'IMPLEMENTED_NOT_RUNNER_VERIFIED',
    'franchise_like_lion_cleanup': 'IMPLEMENTED_NOT_RUNNER_VERIFIED',
    'classic_content_version': 4,
    'fan_content_review': 'FINAL_EXTENDED_LABS_SCAN_IN_PROGRESS',
    'checks': checks,
}, ensure_ascii=False, indent=2))
