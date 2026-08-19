#!/usr/bin/env python3
from pathlib import Path
import json
import subprocess

ROOT = Path(__file__).resolve().parents[1]
TEST = ROOT / 'tests' / 'extended-labs-content-quality.test.js'
REVIEW = ROOT / 'EXTENDED_LABS_CONTENT_REVIEW.md'

for path in (TEST, REVIEW):
    if not path.is_file():
        raise SystemExit(f'Extended/Labs audit missing required file: {path.relative_to(ROOT)}')

review = REVIEW.read_text(encoding='utf-8')
for marker in (
    '13 Extended', '17 Labs', '30 Nicht-Core-Spiele',
    'MANUAL SIGN-OFF OPEN', 'extended-labs-content-quality.test.js'
):
    if marker not in review:
        raise SystemExit(f'Extended/Labs review marker missing: {marker}')

result = subprocess.run(
    ['node', str(TEST.relative_to(ROOT))],
    cwd=ROOT,
    text=True,
    capture_output=True,
    check=False,
)
if result.returncode != 0:
    if result.stdout:
        print(result.stdout, end='')
    if result.stderr:
        print(result.stderr, end='')
    raise SystemExit(f'Extended/Labs Node contract failed with exit code {result.returncode}.')

try:
    node_payload = json.loads(result.stdout)
except json.JSONDecodeError as exc:
    raise SystemExit(f'Extended/Labs Node contract returned invalid JSON: {exc}')

if node_payload.get('extendedLabsContentQuality') != 'PASS':
    raise SystemExit('Extended/Labs Node contract did not report PASS.')
if node_payload.get('releaseTiers') != {'core': 15, 'extended': 13, 'labs': 17}:
    raise SystemExit('Extended/Labs release tier counts drifted.')
if node_payload.get('contentDrivenGames') != 28:
    raise SystemExit('Unexpected number of content-driven non-core games.')
if sorted(node_payload.get('contentlessUtilityGames', [])) != ['dice-coin', 'spin-bottle']:
    raise SystemExit('Unexpected contentless utility game set.')

print(json.dumps({
    'extended_labs_content_audit': 'PASS',
    'release_tiers': node_payload['releaseTiers'],
    'extended_games': len(node_payload.get('extendedIds', [])),
    'lab_games': len(node_payload.get('labIds', [])),
    'content_driven_games': node_payload['contentDrivenGames'],
    'contentless_utility_games': node_payload['contentlessUtilityGames'],
    'packs_checked': node_payload.get('packsChecked'),
    'items_checked': node_payload.get('itemsChecked'),
    'strings_checked': node_payload.get('stringsChecked'),
    'duplicate_gate': node_payload.get('duplicateGate'),
    'private_disclosure_prompt_gate': node_payload.get('privateDisclosurePromptGate'),
    'markup_gate': node_payload.get('markupGate'),
    'internal_routing_gate': node_payload.get('internalRoutingGate'),
    'manual_signoff': 'OPEN',
}, ensure_ascii=False, indent=2))
