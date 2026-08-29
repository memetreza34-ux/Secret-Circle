#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]

SHIPPED_CONTENT_SOURCES = [
    'word-packs.js',
    'party-catalog.js',
    'party-expansion.js',
    'party-trending-catalog.js',
    'party-mega-catalog.js',
    'party-viral-catalog.js',
    'party-core-release-catalog.js',
    'party-core-classic-content.js',
    'party-wave-one-catalog.js',
    'party-wave-one-imposter-catalog.js',
    'party-wave-one-writing-catalog.js',
    'party-wave-one-voting-catalog.js',
    'party-wave-one-bluff-catalog.js',
    'party-wave-one-clue-catalog.js',
]

WAVE_ONE_SOURCES = {
    'party-wave-one-catalog.js',
    'party-wave-one-imposter-catalog.js',
    'party-wave-one-writing-catalog.js',
    'party-wave-one-voting-catalog.js',
    'party-wave-one-bluff-catalog.js',
    'party-wave-one-clue-catalog.js',
}

# Concrete prompt patterns that would turn private device/account data into
# required party-game material.
BLOCKED_PROMPT_FRAGMENTS = [
    'Was ist das Seltsamste in deiner Kamerarolle?',
    'Lies die letzte Nachricht auf deinem Handy',
    'Zeig dein Passwort',
    'Zeige dein Passwort',
    'Nenne dein Passwort',
    'Sag dein Passwort',
    'Nenne deine Adresse',
    'Sag deine Adresse',
    'Zeige deine Adresse',
    'Zeig deine Adresse',
    'Lies private Chats',
    'Lies deinen privaten Chat',
    'Zeig private Chats',
    'Zeige private Chats',
    'Öffne deine privaten Nachrichten',
    'Zeige deine Kamerarolle',
    'Zeig deine Kamerarolle',
    'Durchsuche deine Kamerarolle',
    'Zeige deine privaten Fotos',
    'Zeig deine privaten Fotos',
    'Teile deinen Standort',
    'Zeige deinen Standort',
    'Zeig deinen Standort',
    'Nenne deine Telefonnummer',
    'Sag deine Telefonnummer',
    'Nenne deine Kontodaten',
    'Zeige deine Kontodaten',
]

REVIEW_REQUIRED_FRAGMENTS = [
    'letzte private Nachricht',
    'private Nachricht vorlesen',
    'private Chats vorlesen',
    'private Fotos zeigen',
    'Passwort zeigen',
    'Adresse preisgeben',
    'Telefonnummer preisgeben',
    'Kontodaten nennen',
]

required_safe_markers = {
    'party-catalog.js': [
        'Welches Foto-Motiv findest du besonders lustig?',
        'Lies einen selbst erfundenen Satz wie einen dramatischen Theatermonolog vor.',
    ],
    'party-core-classic-content.js': [
        'Welches Foto-Motiv findest du besonders lustig?',
        'Lies einen selbst erfundenen Satz wie einen dramatischen Theatermonolog vor.',
    ],
    'party-wave-one-catalog.js': [
        "id: 'party-quiz'",
        "id: 'fact-or-fake'",
    ],
    'party-wave-one-imposter-catalog.js': [
        "id: 'undercover-similar-word'",
        "id: 'no-word-imposter'",
    ],
    'party-wave-one-writing-catalog.js': [
        "id: 'fill-blank-battle'",
        "id: 'who-wrote-it'",
    ],
    'party-wave-one-voting-catalog.js': [
        "id: 'percent-guess'",
        "id: 'party-bracket'",
    ],
    'party-wave-one-bluff-catalog.js': ["id: 'bluff-trivia'"],
    'party-wave-one-clue-catalog.js': ["id: 'password-one-word'"],
}

# Classic Content retains a historical replacement dictionary as a defensive
# fallback. Its keys are not playable content; strip exactly that dictionary
# before scanning actual playable source text.
def playable_source(relative: str, source: str) -> str:
    if relative != 'party-core-classic-content.js':
        return source
    return re.sub(
        r"const editorialReplacements = Object\.freeze\(\{[\s\S]*?\n  \}\);",
        'const editorialReplacements = Object.freeze({});',
        source,
        count=1,
    )

violations = []
scanned = {}
for relative in SHIPPED_CONTENT_SOURCES:
    path = ROOT / relative
    if not path.is_file():
        violations.append(f'Missing shipped content source: {relative}')
        continue
    source = path.read_text(encoding='utf-8')
    scan_source = playable_source(relative, source)
    scanned[relative] = len(source.encode('utf-8'))
    for fragment in BLOCKED_PROMPT_FRAGMENTS:
        if fragment in scan_source:
            violations.append(f'{relative}: blocked privacy prompt remains in playable content: {fragment}')
    for fragment in REVIEW_REQUIRED_FRAGMENTS:
        if fragment in scan_source:
            violations.append(f'{relative}: privacy-sensitive action requires review: {fragment}')
    for marker in required_safe_markers.get(relative, []):
        if marker not in source:
            violations.append(f'{relative}: required privacy-safe marker missing: {marker}')

base_source = (ROOT / 'party-catalog.js').read_text(encoding='utf-8') if (ROOT / 'party-catalog.js').is_file() else ''
for fragment in (
    'Was ist das Seltsamste in deiner Kamerarolle?',
    'Lies die letzte Nachricht auf deinem Handy like ein Theatermonolog, ohne Namen zu nennen.',
):
    if fragment in base_source:
        violations.append(f'party-catalog.js: historical private-device prompt must be physically absent: {fragment}')

if 'Lies die letzte Nachricht auf deinem Handy wie ein Theatermonolog, ohne Namen zu nennen.' in base_source:
    violations.append('party-catalog.js: historical last-message prompt must be physically absent')

policy = ROOT / 'CONTENT_AGE_POLICY.md'
if not policy.is_file():
    violations.append('Missing CONTENT_AGE_POLICY.md')
else:
    policy_text = policy.read_text(encoding='utf-8')
    for marker in (
        'keine privaten Nachrichten, Fotos, Passwörter, Adressen oder Kontodaten als Spielmaterial verlangen',
        'SC-CONTENT-PRIV-001',
        'niemand muss einen Skip begründen',
        'scripts/privacy_content_audit.py',
    ):
        if marker not in policy_text:
            violations.append(f'CONTENT_AGE_POLICY.md: privacy contract marker missing: {marker}')

if violations:
    raise SystemExit('\n'.join(sorted(set(violations))))

print(json.dumps({
    'privacy_content_audit': 'PASS',
    'shipped_sources_scanned': len(scanned),
    'wave_one_catalogs_scanned': len(WAVE_ONE_SOURCES),
    'wave_one_sources_complete': WAVE_ONE_SOURCES.issubset(scanned.keys()),
    'blocked_prompt_fragments': len(BLOCKED_PROMPT_FRAGMENTS),
    'review_required_fragments': len(REVIEW_REQUIRED_FRAGMENTS),
    'sc_content_priv_001_safe_replacements_required': True,
    'base_catalog_private_device_prompts_physically_removed': True,
    'classic_replacement_dictionary_not_treated_as_playable_content': True,
    'personal_content_skip_contract_required': True,
    'source_bytes': scanned,
}, ensure_ascii=False, indent=2))
