(function (root, factory) {
  const base = typeof module === 'object' && module.exports
    ? require('./party-wave-one-imposter-catalog.js')
    : root.SecretCirclePartyCatalog;
  const api = factory(base);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCirclePartyCatalog = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createWaveOneWritingCatalog(base) {
  'use strict';
  if (!base) throw new Error('Wave-1-Katalog für Schreibspiele fehlt.');

  const quickHref = id => `quick-play.html?game=${encodeURIComponent(id)}`;
  const gamesAdded = [
    Object.freeze({
      id: 'fill-blank-battle', title: 'Satzduell', icon: '✍️', group: 'Schreiben & Kreativ', status: 'playable', mode: 'link',
      href: quickHref('fill-blank-battle'), minPlayers: 3, maxPlayers: 12, duration: 15,
      moods: ['funny', 'creative', 'friendly'], age: 'all', featured: false,
      description: 'Alle vervollständigen denselben harmlosen Satz privat. Danach werden die Antworten anonym gemischt und die Gruppe wählt den Favoriten.',
      instructions: ['Pack und Rundenzahl wählen.', 'Gerät nacheinander weitergeben und privat eine kurze Antwort eingeben.', 'Alle Antworten anonym anzeigen.', 'Favorit wählen, Autor aufdecken und nächste Runde starten.'],
      packs: ['Alltag', 'Gaming', 'Fantasie']
    }),
    Object.freeze({
      id: 'who-wrote-it', title: 'Wer hat das geschrieben?', icon: '📝', group: 'Schreiben & Kreativ', status: 'playable', mode: 'link',
      href: quickHref('who-wrote-it'), minPlayers: 3, maxPlayers: 12, duration: 15,
      moods: ['funny', 'friendly', 'clever'], age: 'all', featured: false,
      description: 'Alle beantworten dieselbe harmlose Frage privat. Danach versucht die Gruppe, die anonymen Antworten den Personen zuzuordnen.',
      instructions: ['Pack und Rundenzahl wählen.', 'Jede Person schreibt privat eine kurze Antwort.', 'Antworten erscheinen einzeln ohne Namen.', 'Gruppe errät den Autor; danach wird aufgelöst.'],
      packs: ['Freundschaft', 'Icebreaker', 'Alltag']
    })
  ].map(Object.freeze);

  const contentAdded = Object.freeze({
    'fill-blank-battle': Object.freeze({
      Alltag: Object.freeze([
        'Mein unnötigstes Talent wäre perfekt für …', 'Ein neuer Feiertag sollte heißen …',
        'Die schlechteste Ausrede für fünf Minuten Verspätung ist …', 'Ein Kühlschrank mit eigener Meinung würde sagen …',
        'Die unnötigste Erfindung für den Alltag wäre …', 'Wenn mein Wecker sprechen könnte, würde er morgens sagen …',
        'Der seltsamste Name für ein Café wäre …', 'Eine neue Regel für Wochenenden sollte lauten …'
      ]),
      Gaming: Object.freeze([
        'Der nutzloseste Gegenstand in einem Videospiel wäre …', 'Ein Bosskampf gegen meinen Alltag hieße …',
        'Die merkwürdigste Nebenquest wäre …', 'Ein Spiel über unsere Gruppe müsste heißen …',
        'Die schlechteste Superkraft für einen Game-Charakter wäre …', 'Ein Tutorial sollte niemals erklären müssen, wie man …',
        'Der ungewöhnlichste Name für ein E-Sport-Team wäre …', 'Ein geheimer Bonuslevel spielt in …'
      ]),
      Fantasie: Object.freeze([
        'Ein Drache mit einem Bürojob wäre zuständig für …', 'Die unnötigste Zauberformel wäre …',
        'Ein Alien würde auf der Erde zuerst fragen …', 'Eine Zeitmaschine mit nur einer Funktion könnte …',
        'Der seltsamste Name für ein Königreich wäre …', 'Ein Roboterheld hätte Angst vor …',
        'Eine Schule für Superkräfte braucht unbedingt das Fach …', 'Der geheime Eingang zu einer Fantasiewelt liegt hinter …'
      ])
    }),
    'who-wrote-it': Object.freeze({
      Freundschaft: Object.freeze([
        'Welche kleine Sache macht einen guten Spieleabend besser?', 'Welches Essen würdest du der Gruppe sofort empfehlen?',
        'Welche Fähigkeit ist in einer Freundesgruppe überraschend nützlich?', 'Was wäre ein gutes gemeinsames Wochenendziel?',
        'Welcher harmlose Insider könnte als Teamname funktionieren?', 'Welche Aktivität würdest du spontan mit der Gruppe machen?',
        'Was sollte bei einem Roadtrip niemals fehlen?', 'Welches Kompliment freut dich meistens am meisten?'
      ]),
      Icebreaker: Object.freeze([
        'Welches Hobby würdest du gern einmal testen?', 'Welches Tier passt am ehesten zu deinem Alltag?',
        'Welche Jahreszeit würdest du verlängern?', 'Welche einfache Sache kannst du besonders gut?',
        'Welchen Ort würdest du gern für einen Tag besuchen?', 'Welche App-Kategorie nutzt du wahrscheinlich am häufigsten?',
        'Welche Mahlzeit könntest du oft essen?', 'Welche Fähigkeit würdest du gern sofort lernen?'
      ]),
      Alltag: Object.freeze([
        'Was vergisst man deiner Meinung nach am leichtesten zu Hause?', 'Welche kleine Erfindung würde deinen Morgen verbessern?',
        'Was ist die beste Beschäftigung bei schlechtem Wetter?', 'Welcher Gegenstand wird im Alltag unterschätzt?',
        'Was ist ein guter spontaner Snack?', 'Welche Aufgabe schiebst du am ehesten auf?',
        'Welche Tageszeit fühlt sich am kürzesten an?', 'Was macht eine lange Fahrt angenehmer?'
      ])
    })
  });

  const games = Object.freeze([...base.games, ...gamesAdded]);
  const content = Object.freeze({ ...base.content, ...contentAdded });
  const waveOneWritingGameIds = Object.freeze(gamesAdded.map(game => game.id));
  const waveOneGameIds = Object.freeze([...(base.waveOneGameIds || []), ...waveOneWritingGameIds]);
  const quickGameIds = Object.freeze([...(base.quickGameIds || []), ...waveOneWritingGameIds]);

  function getGame(id) { return games.find(game => game.id === id) || null; }
  function getPackNames(id) { return content[id] && typeof content[id] === 'object' ? Object.keys(content[id]) : []; }
  function getItems(id, pack) {
    const value = content[id];
    if (!value || typeof value !== 'object') return [];
    if (pack && Array.isArray(value[pack])) return value[pack];
    return Object.values(value).flatMap(items => Array.isArray(items) ? items : []);
  }
  function itemCount(id) { return getItems(id).length; }

  return Object.freeze({
    ...base,
    version: 4,
    games,
    content,
    getGame,
    getPackNames,
    getItems,
    itemCount,
    waveOneWritingGameIds,
    waveOneGameIds,
    quickGameIds
  });
});
