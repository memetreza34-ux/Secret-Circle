#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
PROVENANCE = ROOT / 'assets' / 'manifests' / 'asset-provenance.json'

MEDIA_SUFFIXES = {
    '.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif', '.svg', '.ico',
    '.mp3', '.wav', '.ogg', '.m4a', '.flac', '.mp4', '.webm', '.mov'
}
IGNORED_DIRS = {
    '.git', 'node_modules', 'playwright-report', 'test-results', 'coverage', '.cache'
}
EXPECTED_CURRENT_MEDIA = {
    'docs/screenshots/bildwelt55-kategorie-schnell.webp',
    'docs/screenshots/bildwelt55-kategorie-wissen.webp',
    'docs/screenshots/bildwelt55-kategorie-kreativ.webp',
    'docs/screenshots/bildwelt55-kategorie-raten.webp',
    'docs/screenshots/bildwelt55-kategorie-reden.webp',
    'docs/screenshots/bildwelt55-kategorie-taeuschung.webp',
    'docs/screenshots/bildwelt55-handy-375x812.webp',
    'docs/screenshots/bildwelt55-desktop-1280.webp',
    'assets/images/party-quiz.webp',
    'assets/images/no-word-imposter.webp',
    'assets/images/hot-seat.webp',
    'assets/images/secret-mission.webp',
    'assets/images/scavenger-hunt.webp',
    'assets/images/dont-laugh.webp',
    'assets/images/letter-categories.webp',
    'assets/images/dice-coin.webp',
    'assets/images/spin-bottle.webp',
    'assets/images/party-bracket.webp',
    'assets/images/percent-guess.webp',
    'assets/images/fact-or-fake.webp',
    'assets/images/guess-the-price.webp',
    'assets/images/emoji-quiz.webp',
    'assets/images/who-wrote-it.webp',
    'assets/images/fill-blank-battle.webp',
    'assets/images/finish-the-sentence.webp',
    'assets/images/story-chain.webp',
    'assets/images/caption-battle.webp',
    'assets/images/draw-guess.webp',
    'assets/images/password-one-word.webp',
    'assets/images/hum-song.webp',
    'assets/images/sound-imitation.webp',
    'assets/images/know-me-best.webp',
    'assets/images/pass-the-phone.webp',
    'assets/images/hear-me-out.webp',
    'assets/images/tier-list.webp',
    'assets/images/red-green-flag.webp',
    'assets/images/money-challenge.webp',
    'assets/images/hot-takes.webp',
    'assets/images/bluff-trivia.webp',
    'assets/images/undercover-similar-word.webp',
    'assets/images/higher-lower.webp',
    'assets/images/put-a-finger-down.webp',
    'assets/images/blind-ranking.webp',
    'assets/images/anime-guess.webp',
    'assets/images/who-am-i.webp',
    'assets/images/forehead-guess.webp',
    'assets/images/rapid-fire.webp',
    'assets/images/wavelength.webp',
    'assets/images/wrong-answers.webp',
    'assets/images/paranoia.webp',
    'assets/images/would-rather.webp',
    'assets/images/most-likely.webp',
    'assets/images/location-spy.webp',
    'assets/images/question-imposter.webp',
    'assets/images/never-have.webp',
    'docs/screenshots/imposter-stilkorrektur-handy-375x812.webp',
    'docs/screenshots/imposter-stilkorrektur-desktop-1280x900.webp',
    'docs/screenshots/two-truths-handy-375x812.webp',
    'docs/screenshots/two-truths-desktop-1280x900.webp',
    'assets/images/two-truths.webp',
    'docs/screenshots/word-chain-handy-375x812.webp',
    'docs/screenshots/word-chain-desktop-1280x900.webp',
    'assets/images/word-chain.webp',
    'assets/images/hot-potato.webp',
    'docs/screenshots/hot-potato-handy-375x812.webp',
    'docs/screenshots/hot-potato-desktop-1280x900.webp',
    'assets/images/taboo.webp',
    'docs/screenshots/taboo-handy-375x812.webp',
    'docs/screenshots/taboo-desktop-1280x900.webp',
    'assets/images/charades.webp',
    'docs/bildwelt/vorlage-2026-10-30.webp',
    'docs/bildwelt/ausgangsreferenz-imposter-2026-10-30.webp',
    'docs/screenshots/scharade-handy-375x812.webp',
    'docs/screenshots/scharade-desktop-1280x900.webp',

    'icon.svg', 'icon-192.png', 'icon-512.png',
    'assets/images/imposter.webp',
    'assets/images/truth-dare.webp',
    'assets/images/mafia.webp',
    'docs/screenshots/bildvorschau-mafia-desktop-1280x800.webp',
    'docs/screenshots/bildvorschau-mafia-handy-375x812.webp',
    'docs/screenshots/bildvorschau-start-desktop-1280x800.webp',
    'docs/screenshots/bildvorschau-start-handy-375x812.webp',
    'docs/screenshots/v2-party-spiel-handy-375x812.webp',
    'docs/screenshots/v2-party-spiel-desktop-1280x800.webp',
}

if not PROVENANCE.is_file():
    raise SystemExit('Media inventory cannot run without asset-provenance.json.')

payload = json.loads(PROVENANCE.read_text(encoding='utf-8'))
assets = payload.get('assets') if isinstance(payload.get('assets'), list) else []
provenance_paths = {
    entry.get('path') for entry in assets
    if isinstance(entry, dict) and isinstance(entry.get('path'), str)
}

media_paths = set()
for path in ROOT.rglob('*'):
    if not path.is_file():
        continue
    relative = path.relative_to(ROOT)
    if any(part in IGNORED_DIRS for part in relative.parts):
        continue
    if path.suffix.lower() in MEDIA_SUFFIXES:
        media_paths.add(relative.as_posix())

missing_from_provenance = sorted(media_paths - provenance_paths)
stale_provenance_media = sorted(
    path for path in provenance_paths
    if Path(path).suffix.lower() in MEDIA_SUFFIXES and path not in media_paths
)

if missing_from_provenance:
    raise SystemExit('Bundled media missing from provenance manifest: ' + ', '.join(missing_from_provenance))
if stale_provenance_media:
    raise SystemExit('Media provenance points to missing files: ' + ', '.join(stale_provenance_media))
if media_paths != EXPECTED_CURRENT_MEDIA:
    raise SystemExit(
        'Bundled media inventory changed; review and update explicit release contract: '
        + ', '.join(sorted(media_paths))
    )

print(json.dumps({
    'media_inventory_audit': 'PASS',
    'media_extensions_scanned': sorted(MEDIA_SUFFIXES),
    'ignored_directories': sorted(IGNORED_DIRS),
    'bundled_media': sorted(path for path in media_paths if not path.startswith('docs/screenshots/')),
    'bundled_media_count': len([path for path in media_paths if not path.startswith('docs/screenshots/')]),
    'documentation_screenshots': sorted(path for path in media_paths if path.startswith('docs/screenshots/')),
    'all_media_in_provenance_manifest': True,
    'current_release_media_contract': sorted(EXPECTED_CURRENT_MEDIA),
    'audio_files': [],
    'video_files': [],
    'other_raster_files': sorted(path for path in media_paths if path.endswith('.webp')),
}, ensure_ascii=False, indent=2))
