#!/usr/bin/env python3
"""Baut das lokale Zusatzpaket aus der offenliegenden, redaktionellen Auswahl."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'assets/words/word-imposter-extra.tsv'
TARGET = ROOT / 'word-packs-extra.js'


def render():
    groups = []
    for line in SOURCE.read_text().splitlines():
        if not line or line.startswith('#'):
            continue
        category, hint, words = line.split('\t')
        groups.append([category, hint, words.split('|')])
    data = json.dumps(groups, ensure_ascii=False, separators=(',', ':'))
    return '''/* OpenThesaurus / Daniel Naber und Mitwirkende; Auswahl, Ergänzungen und Hilfswörter: Secret Circle / Codex.
 * LGPL-2.1-or-later. Quelle, Änderungen und Lizenz: assets/words/word-imposter-source.json,
 * assets/words/word-imposter-extra.tsv, assets/licenses/openthesaurus-LGPL-2.1.txt.
 * Erzeugt mit python3 scripts/build_word_pack.py. */
(function (root) {
  'use strict';
  const content = root.SecretCircleContent;
  if (!content?.categories || content.extendedWords === 1) return;
  const groups = ''' + data + ''';
  for (const [id, hint, words] of groups) {
    const entries = content.words[id];
    if (!entries) throw Error('Unbekannte Wortkategorie: ' + id);
    const seen = new Set(entries.map(entry => entry[0].normalize('NFKC').toLocaleLowerCase('de-DE')));
    for (const word of words) {
      const key = word.normalize('NFKC').toLocaleLowerCase('de-DE');
      if (seen.has(key)) continue;
      entries.push([word, hint]);
      seen.add(key);
    }
  }
  root.SecretCircleContent = Object.freeze({ ...content, extendedWords: 1 });
})(typeof globalThis !== 'undefined' ? globalThis : this);
'''


if __name__ == '__main__':
    import sys
    output = render()
    if '--check' in sys.argv:
        if not TARGET.is_file() or TARGET.read_text() != output:
            raise SystemExit('word-packs-extra.js stimmt nicht mit der TSV-Auswahl überein.')
    else:
        TARGET.write_text(output)
