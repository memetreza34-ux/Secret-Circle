#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_FILES = [
    'index.html', 'party.html', 'advanced.html', 'quick-play.html', 'creator.html',
    'privacy.html', 'manifest.webmanifest'
]

patterns = {
    'TBD': re.compile(r'\bTBD\b', re.IGNORECASE),
    'TODO': re.compile(r'\bTODO\b', re.IGNORECASE),
    'REPLACE_ME': re.compile(r'REPLACE[_ -]?ME', re.IGNORECASE),
    'example-domain': re.compile(r'(?:example\.com|example\.org|example\.net|example\.invalid)', re.IGNORECASE),
    'dummy-email': re.compile(r'(?:your|name|test|support)@example\.(?:com|org|net)', re.IGNORECASE),
    'placeholder-email': re.compile(r'(?:email|mail)@(?:domain|placeholder)\.', re.IGNORECASE),
    'placeholder-token': re.compile(r'\{\{[^}]+\}\}|<INSERT[_ -][^>]+>', re.IGNORECASE),
}

findings = []
for relative in PUBLIC_FILES:
    path = ROOT / relative
    if not path.is_file():
        raise SystemExit(f'Public release surface missing: {relative}')
    source = path.read_text(encoding='utf-8')
    for name, pattern in patterns.items():
        match = pattern.search(source)
        if match:
            findings.append({'file': relative, 'pattern': name, 'sample': match.group(0)[:80]})

if findings:
    raise SystemExit('Public placeholder leak detected: ' + json.dumps(findings, ensure_ascii=False))

print(json.dumps({
    'public_release_placeholder_audit': 'PASS',
    'public_files_checked': PUBLIC_FILES,
    'blocked_placeholder_classes': sorted(patterns),
    'note': 'This only proves that known placeholder tokens are absent from public runtime files; final operator/support/legal completeness remains a separate release gate.'
}, ensure_ascii=False, indent=2))
