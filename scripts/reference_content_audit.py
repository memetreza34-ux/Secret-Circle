#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]

SHIPPED_CONTENT_SOURCES = [
    'word-packs.js', 'party-catalog.js', 'party-expansion.js', 'party-trending-catalog.js',
    'party-mega-catalog.js', 'party-viral-catalog.js', 'party-core-release-catalog.js',
    'party-core-classic-content.js', 'party-wave-one-catalog.js', 'party-wave-one-imposter-catalog.js',
    'party-wave-one-writing-catalog.js', 'party-wave-one-voting-catalog.js',
    'party-wave-one-bluff-catalog.js', 'party-wave-one-clue-catalog.js',
]

BLOCKED_LITERALS = [
    'Bluetooth', 'Oscar', 'Formel 1', 'Chrome', 'Wellenlänge', 'Löwenkönig',
    'Ringe im olympischen Symbol', 'Bahnen eines olympischen 400-Meter-Stadions häufig',
    'Sätze zum Sieg im Herren-Grand-Slam-Tennis', 'Son Goku', 'Naruto Uzumaki',
    'Monkey D. Ruffy', 'Ichigo Kurosaki', 'Edward Elric', 'Gon Freecss', 'Killua Zoldyck',
    'Kenshin Himura', 'Natsu Dragneel', 'Yusuke Urameshi', 'Tanjiro Kamado', 'Nezuko Kamado',
    'Satoru Gojo', 'Yuji Itadori', 'Denji', "'Power'", 'Eren Jäger', 'Mikasa Ackerman',
    'Izuku Midoriya', 'Shoto Todoroki', 'Sailor Moon', 'Light Yagami', 'Spike Spiegel',
    'Inuyasha', 'Kagome Higurashi', 'Frieren', 'Anya Forger', 'Loid Forger', 'Totoro',
    'Ash Ketchum', 'Pikachu', 'Hinata Shoyo', 'Kageyama Tobio', 'Yoichi Isagi',
    'Meguru Bachira', 'Tsubasa Ozora', 'Kirito', 'Asuna', 'Subaru Natsuki',
]

REVIEW_REQUIRED_LITERALS = [
    'TikTok', 'Instagram', 'YouTube', 'Netflix', 'Spotify', 'Disney', 'Marvel',
    'Minecraft', 'Fortnite', 'PlayStation', 'Nintendo', 'Coca-Cola', "McDonald's",
]

required_markers = {
    'word-packs.js': ['Funkverbindung', 'Filmpreis', 'Motorsport'],
    'party-expansion.js': ["id: 'wavelength', title: 'Spektrum-Tipp'", "banned: ['Webseite', 'Internet', 'Tab']"],
    'party-mega-catalog.js': ["id: 'anime-guess', title: 'Anime-Archetypen erraten'", "'Action & Abenteuer'", "'Magie & Mystery'", "'Fantasy & Alltag'", 'Ehrgeiziger Kampfkunst-Schüler', 'Fluchjägerin'],
    'party-viral-catalog.js': ['Ecken eines Fünfecks', 'Bahnen einer typischen 400-Meter-Leichtathletikanlage', 'Gewinnsätze in einem Best-of-five-Tennismatch'],
    'party-core-classic-content.js': ['const VERSION = 4;', "title: 'Spektrum-Tipp'"],
    'party-wave-one-catalog.js': ["id: 'party-quiz'", "id: 'undercover-similar-word'"],
    'party-wave-one-writing-catalog.js': ["id: 'fill-blank-battle'", "id: 'who-wrote-it'"],
    'party-wave-one-voting-catalog.js': ["id: 'percent-guess'", "id: 'party-bracket'"],
    'party-wave-one-bluff-catalog.js': ["id: 'bluff-trivia'"],
    'party-wave-one-clue-catalog.js': ["id: 'password-one-word'"],
}

violations=[]; scanned={}
for relative in SHIPPED_CONTENT_SOURCES:
    path=ROOT/relative
    if not path.is_file(): violations.append(f'Missing shipped content source: {relative}'); continue
    source=path.read_text(encoding='utf-8'); scanned[relative]=len(source.encode('utf-8'))
    for literal in BLOCKED_LITERALS:
        if literal in source: violations.append(f'{relative}: blocked concrete reference remains: {literal}')
    for literal in REVIEW_REQUIRED_LITERALS:
        if literal in source: violations.append(f'{relative}: unreviewed platform/franchise reference requires decision: {literal}')
    for marker in required_markers.get(relative,[]):
        if marker not in source: violations.append(f'{relative}: required reference-safe marker missing: {marker}')

if violations: raise SystemExit('\n'.join(sorted(set(violations))))
print(json.dumps({
    'reference_content_audit':'PASS','shipped_sources_scanned':len(scanned),
    'wave_one_catalogs_scanned':6,'blocked_literals':len(BLOCKED_LITERALS),
    'review_required_literals':len(REVIEW_REQUIRED_LITERALS),'stable_internal_id_wavelength_allowed':True,
    'physical_source_cleanup_required':True,'source_bytes':scanned
},ensure_ascii=False,indent=2))
