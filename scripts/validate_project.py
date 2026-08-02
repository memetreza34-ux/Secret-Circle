#!/usr/bin/env python3
import re
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
required={
 'index.html':['manifest.webmanifest','game-engine.js','word-packs.js','accessibility.js','accessibility.css','screen-announcement','aria-label="Abstimmungsziele"','Nächste Runde'],
 'app.js':['secret-circle-active-v3','SecretCircleContent','C.allEntries','beginVoting','castCurrentVote','startNextRound'],
 'game-engine.js':['MAX_ROUNDS','beginVoting','castVote','finalizeVote','leaderboard','nextRoundOptions'],
 'word-packs.js':['2026.08-rc1','internal_family_friendly','externalEditorialReview:false','validatePacks','entryCount'],
 'accessibility.js':['MutationObserver','announceVisibleScreen','aria-expanded','next-player','next-voter'],
 'tests/engine.test.js':['multiround','voting','scoring','ties'],
 'tests/content.test.js':['familyFriendly','externalReview','entryCount,80'],
 'tests/accessibility.test.js':['focusManagement','screenAnnouncements','reducedMotion','forcedColors'],
 'manifest.webmanifest':['"display": "standalone"','icon.svg','Secret Circle'],
 'sw.js':['cache.addAll','self.clients.claim','secret-circle-v4','word-packs.js','accessibility.js'],
 'match.css':['.vote-grid','.score-row','.match-finished'],
 'pwa.css':['.resume','.connection.offline','.result-word'],
 'accessibility.css':[':focus-visible','prefers-reduced-motion','forced-colors','.skip-link'],
 'styles.css':['@media(max-width:560px)','card-button']
}
for relative,markers in required.items():
 path=ROOT/relative
 if not path.is_file() or path.stat().st_size<120:raise SystemExit(f'Missing or small file: {relative}')
 text=path.read_text(encoding='utf-8')
 for marker in markers:
  if marker.lower() not in text.lower():raise SystemExit(f'Missing marker {marker} in {relative}')
word_text=(ROOT/'word-packs.js').read_text(encoding='utf-8')
entry_count=len(re.findall(r"\['[^']+','[^']+'\]",word_text))
if entry_count!=80:raise SystemExit(f'Curated word catalog mismatch: {entry_count} entries')
for forbidden in ['.env','node_modules','dist','build']:
 if (ROOT/forbidden).exists():raise SystemExit(f'Forbidden generated path committed: {forbidden}')
print(f'Secret Circle accessible multi-round PWA valid: {entry_count} curated entries.')
