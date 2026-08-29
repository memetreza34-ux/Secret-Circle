(function (root, factory) {
  const base = typeof module === 'object' && module.exports
    ? require('./party-wave-one-bluff-catalog.js')
    : root.SecretCirclePartyCatalog;
  const api = factory(base);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCirclePartyCatalog = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createWaveOneClueCatalog(base) {
  'use strict';
  if (!base) throw new Error('Wave-1-Katalog für Ein-Wort-Hinweis fehlt.');

  const game = Object.freeze({
    id: 'password-one-word', title: 'Ein-Wort-Hinweis', icon: '🔑', group: 'Raten & Hinweise', status: 'playable', mode: 'link',
    href: 'quick-play.html?game=password-one-word', minPlayers: 3, maxPlayers: 20, duration: 12,
    moods: ['clever', 'friendly', 'competitive'], age: 'all', featured: false,
    description: 'Eine Person sieht geheim ein Zielwort und darf genau ein Hinweiswort geben. Die Gruppe versucht das Ziel zu erraten.',
    instructions: ['Pack und Rundenzahl wählen.', 'Gerät an die aktive Person geben und Zielwort privat ansehen.', 'Genau ein Hinweiswort eingeben – nicht das Zielwort selbst.', 'Gruppe rät gemeinsam und markiert Erfolg oder Fehlversuch.'],
    packs: ['Alltag', 'Natur', 'Gaming & Freizeit']
  });
  const contentAdded = Object.freeze({
    Alltag: Object.freeze(['Regenschirm', 'Fahrrad', 'Kühlschrank', 'Rucksack', 'Schlüssel', 'Kissen', 'Aufzug', 'Kalender', 'Zahnbürste', 'Fenster', 'Lampe', 'Kopfhörer', 'Wasserflasche', 'Schreibtisch', 'Jacke', 'Wecker']),
    Natur: Object.freeze(['Vulkan', 'Delfin', 'Wüste', 'Regenbogen', 'Pinguin', 'Gewitter', 'Gletscher', 'Kaktus', 'Ozean', 'Adler', 'Wasserfall', 'Bambus', 'Koralle', 'Fuchs', 'Stern', 'Insel']),
    'Gaming & Freizeit': Object.freeze(['Controller', 'Checkpoint', 'Puzzle', 'Bowling', 'Camping', 'Level', 'Minigolf', 'Inventar', 'Radtour', 'Quest', 'Brettspiel', 'Schwimmbad', 'Team', 'Joystick', 'Picknick', 'Turnier'])
  });

  const games = Object.freeze([...base.games, game]);
  const content = Object.freeze({ ...base.content, 'password-one-word': contentAdded });
  const waveOneClueGameIds = Object.freeze(['password-one-word']);
  const waveOneGameIds = Object.freeze([...(base.waveOneGameIds || []), ...waveOneClueGameIds]);
  const quickGameIds = Object.freeze([...(base.quickGameIds || []), ...waveOneClueGameIds]);

  function getGame(id) { return games.find(entry => entry.id === id) || null; }
  function getPackNames(id) { return content[id] && typeof content[id] === 'object' ? Object.keys(content[id]) : []; }
  function getItems(id, pack) {
    const value = content[id];
    if (!value || typeof value !== 'object') return [];
    if (pack && Array.isArray(value[pack])) return value[pack];
    return Object.values(value).flatMap(items => Array.isArray(items) ? items : []);
  }
  function itemCount(id) { return getItems(id).length; }

  return Object.freeze({ ...base, version: 7, games, content, getGame, getPackNames, getItems, itemCount, waveOneClueGameIds, waveOneGameIds, quickGameIds });
});
