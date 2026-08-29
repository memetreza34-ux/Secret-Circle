(function (root, factory) {
  const base = typeof module === 'object' && module.exports
    ? require('./party-wave-one-voting-catalog.js')
    : root.SecretCirclePartyCatalog;
  const api = factory(base);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCirclePartyCatalog = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createWaveOneBluffCatalog(base) {
  'use strict';
  if (!base) throw new Error('Wave-1-Katalog für Bluff Trivia fehlt.');

  const quickHref = id => `quick-play.html?game=${encodeURIComponent(id)}`;
  const game = Object.freeze({
    id: 'bluff-trivia', title: 'Bluff Trivia', icon: '🎭', group: 'Bluff & Wissen', status: 'playable', mode: 'link',
    href: quickHref('bluff-trivia'), minPlayers: 3, maxPlayers: 10, duration: 18,
    moods: ['funny', 'clever', 'competitive'], age: 'all', featured: false,
    description: 'Alle erfinden privat eine glaubwürdige falsche Antwort. Danach werden echte und erfundene Antworten anonym gemischt.',
    instructions: ['Pack und Rundenzahl wählen.', 'Jede Person schreibt privat eine falsche, aber glaubwürdige Antwort.', 'Alle Antworten werden anonym mit der richtigen Antwort gemischt.', 'Privat wählen: richtige Antwort finden und andere mit der eigenen Fake-Antwort täuschen.'],
    packs: ['Allgemeinwissen', 'Film & Serie', 'Technik']
  });
  const q = (question, answer, explanation) => Object.freeze({ question, answer, explanation });
  const contentAdded = Object.freeze({
    Allgemeinwissen: Object.freeze([
      q('Wie heißt die Hauptstadt von Kanada?', 'Ottawa', 'Ottawa ist die Hauptstadt Kanadas.'),
      q('Welcher Planet ist der größte in unserem Sonnensystem?', 'Jupiter', 'Jupiter ist der größte Planet des Sonnensystems.'),
      q('Wie viele Seiten hat ein regelmäßiges Sechseck?', '6', 'Ein Sechseck besitzt sechs Seiten.'),
      q('Welches chemische Symbol hat Gold?', 'Au', 'Das Elementsymbol von Gold ist Au.'),
      q('Wie heißt der größte Ozean der Erde?', 'Pazifischer Ozean', 'Der Pazifik ist der größte Ozean der Erde.'),
      q('Welche Sprache wird in Brasilien hauptsächlich gesprochen?', 'Portugiesisch', 'Brasilien ist das größte portugiesischsprachige Land.'),
      q('Wie viele Minuten haben zweieinhalb Stunden?', '150', '2,5 Stunden entsprechen 150 Minuten.'),
      q('Welches Tier ist das größte heute lebende Tier?', 'Blauwal', 'Der Blauwal ist das größte heute lebende Tier.')
    ]),
    'Film & Serie': Object.freeze([
      q('Wie nennt man eine Folge, mit der ein Serienkonzept häufig erstmals vorgestellt wird?', 'Pilotfolge', 'Eine Pilotfolge stellt Konzept, Ton und Figuren einer Serie vor.'),
      q('Wie nennt man ein eigenständiges Werk, das aus einer bestehenden Erzählwelt hervorgeht?', 'Spin-off', 'Ein Spin-off entwickelt Elemente einer bestehenden Welt eigenständig weiter.'),
      q('Wie heißt die gezeichnete Planung einzelner Kameraeinstellungen vor einem Dreh?', 'Storyboard', 'Ein Storyboard visualisiert geplante Einstellungen.'),
      q('Wie nennt man ein bewusst offenes, spannendes Ende?', 'Cliffhanger', 'Ein Cliffhanger beendet eine Szene oder Folge an einem spannenden offenen Punkt.'),
      q('Wie heißt die kreative Leitung einer Filmproduktion am Set?', 'Regie', 'Die Regie führt die kreative Umsetzung der Produktion.'),
      q('Wie nennt man speziell für einen Film komponierte Begleitmusik häufig?', 'Score', 'Der Score ist die komponierte Filmmusik.'),
      q('Wie heißt die Auswahl von Darstellerinnen und Darstellern für Rollen?', 'Casting', 'Casting bezeichnet den Auswahlprozess für Rollen.'),
      q('Wie nennt man eine Serie mit von Anfang an begrenzter kurzer Laufzeit?', 'Miniserie', 'Eine Miniserie erzählt eine begrenzte Geschichte in wenigen Folgen.')
    ]),
    Technik: Object.freeze([
      q('Wie viele Bits enthält ein Byte üblicherweise?', '8', 'Ein Byte besteht standardmäßig aus acht Bits.'),
      q('Wie heißt die Einheit der elektrischen Spannung?', 'Volt', 'Elektrische Spannung wird in Volt gemessen.'),
      q('Wie heißt die Einheit der elektrischen Stromstärke?', 'Ampere', 'Elektrische Stromstärke wird in Ampere gemessen.'),
      q('Wie nennt man nichtflüchtigen Flash-Massenspeicher ohne bewegliche Magnetscheiben?', 'SSD', 'Eine SSD speichert Daten elektronisch in Flash-Speicher.'),
      q('Welche Abkürzung bezeichnet eine zentrale Recheneinheit im Computer?', 'CPU', 'CPU steht für Central Processing Unit.'),
      q('Wie nennt man ein drahtloses lokales Netzwerk im Alltag meistens?', 'WLAN', 'WLAN bezeichnet ein drahtloses lokales Netzwerk.'),
      q('Wie heißt das Protokollschema für verschlüsselte Webseiten-Verbindungen?', 'HTTPS', 'HTTPS schützt die Webverbindung mithilfe von TLS.'),
      q('Wie nennt man den flüchtigen Arbeitsspeicher eines Computers üblicherweise?', 'RAM', 'RAM ist der übliche Arbeitsspeicher für aktuell benötigte Daten.')
    ])
  });

  const games = Object.freeze([...base.games, game]);
  const content = Object.freeze({ ...base.content, 'bluff-trivia': contentAdded });
  const waveOneBluffGameIds = Object.freeze(['bluff-trivia']);
  const waveOneGameIds = Object.freeze([...(base.waveOneGameIds || []), ...waveOneBluffGameIds]);
  const quickGameIds = Object.freeze([...(base.quickGameIds || []), ...waveOneBluffGameIds]);

  function getGame(id) { return games.find(entry => entry.id === id) || null; }
  function getPackNames(id) { return content[id] && typeof content[id] === 'object' ? Object.keys(content[id]) : []; }
  function getItems(id, pack) {
    const value = content[id];
    if (!value || typeof value !== 'object') return [];
    if (pack && Array.isArray(value[pack])) return value[pack];
    return Object.values(value).flatMap(items => Array.isArray(items) ? items : []);
  }
  function itemCount(id) { return getItems(id).length; }

  return Object.freeze({ ...base, version: 6, games, content, getGame, getPackNames, getItems, itemCount, waveOneBluffGameIds, waveOneGameIds, quickGameIds });
});
