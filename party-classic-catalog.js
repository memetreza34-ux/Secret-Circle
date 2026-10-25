(function (root, factory) {
  const base = typeof module === 'object' && module.exports ? require('./party-wave-one-bluff-catalog.js') : root.SecretCirclePartyCatalog;
  const api = factory(base);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCirclePartyCatalog = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (base) {
  'use strict';
  const words = {
    Alltag: ['Regenschirm', 'Zahnbürste', 'Kühlschrank', 'Schlüssel', 'Rucksack', 'Fahrrad', 'Wecker', 'Staubsauger', 'Taschenlampe', 'Wäschekorb', 'Gießkanne', 'Fernbedienung', 'Kopfhörer', 'Briefkasten', 'Schaukel', 'Leiter', 'Spiegel', 'Kissen', 'Bügeleisen', 'Teppich'],
    Tiere: ['Pinguin', 'Elefant', 'Giraffe', 'Krokodil', 'Eichhörnchen', 'Delfin', 'Känguru', 'Flamingo', 'Schildkröte', 'Igel', 'Schmetterling', 'Krake', 'Schnecke', 'Papagei', 'Nilpferd', 'Kamel', 'Ameise', 'Biber', 'Seehund', 'Pfau'],
    Berufe: ['Feuerwehrmann', 'Köchin', 'Astronaut', 'Gärtnerin', 'Zahnarzt', 'Bäckerin', 'Detektiv', 'Friseurin', 'Zauberer', 'Briefträgerin', 'Pilot', 'Lehrerin', 'Schornsteinfeger', 'Fotografin', 'Schiedsrichter', 'Dirigentin', 'Taucher', 'Tierärztin', 'Busfahrer', 'Tischlerin'],
    Unterwegs: ['Leuchtturm', 'Heißluftballon', 'Campingzelt', 'Wasserfall', 'Sandburg', 'Riesenrad', 'Segelboot', 'Bergbahn', 'Hängebrücke', 'Schlitten', 'Karussell', 'U-Boot', 'Wohnmobil', 'Rolltreppe', 'Schloss', 'Windmühle', 'Baumhaus', 'Hängematte', 'Rakete', 'Achterbahn']
  };
  const drawings = {
    Alltag: ['Ein Regenschirm im Sturm', 'Eine Katze im Wäschekorb', 'Ein Roboter beim Abwasch', 'Ein Fahrrad mit plattem Reifen', 'Ein Hund mit Sonnenbrille', 'Ein Kühlschrank voller Schuhe', 'Ein schlafender Wecker', 'Ein tanzender Staubsauger', 'Ein Rucksack mit Flügeln', 'Ein Bett auf Rädern', 'Eine Gießkanne im Regen', 'Ein Briefkasten mit Zähnen'],
    Tiere: ['Ein Pinguin auf Rollschuhen', 'Ein Elefant auf einem Fahrrad', 'Eine Giraffe unter einem Schirm', 'Ein Igel mit Luftballon', 'Ein Krokodil beim Zähneputzen', 'Ein Frosch auf einem Trampolin', 'Ein Papagei als Koch', 'Eine Schnecke mit Anhänger', 'Eine Schildkröte beim Wettrennen', 'Ein Bär mit einer Eistüte', 'Ein Wal in einer Badewanne', 'Ein Oktopus mit acht Handschuhen'],
    Berufe: ['Ein Astronaut beim Gärtnern', 'Eine Köchin im Weltraum', 'Ein Detektiv mit Lupe', 'Ein Zauberer mit leerem Hut', 'Eine Feuerwehrfrau auf einer Leiter', 'Ein Friseur schneidet einen Baum', 'Eine Pilotin im Papierflieger', 'Ein Bäcker mit Riesentorte', 'Eine Taucherin im Swimmingpool', 'Ein Fotograf auf einem Kamel', 'Ein Maler malt einen Regenbogen', 'Eine Ärztin untersucht einen Teddybären'],
    Unterwegs: ['Ein Boot auf einem Berg', 'Eine Rakete mit Fahrradklingel', 'Ein Leuchtturm im Wald', 'Ein Zelt auf einer Wolke', 'Eine Sandburg mit Zugbrücke', 'Ein Schlitten am Strand', 'Eine Achterbahn aus Nudeln', 'Ein Koffer mit Beinen', 'Eine Brücke zwischen zwei Bäumen', 'Ein Heißluftballon als Teekanne', 'Ein Baumhaus unter Wasser', 'Ein Auto auf einer Hängematte']
  };
  const luggage = {
    Urlaub: ['Sonnencreme', 'Badehose', 'Reisepass', 'Handtuch', 'Buch', 'Sonnenbrille', 'Kamera', 'Zahnbürste'],
    Picknick: ['Decke', 'Brot', 'Apfel', 'Wasserflasche', 'Korb', 'Serviette', 'Becher', 'Frisbee'],
    Weltall: ['Raumanzug', 'Funkgerät', 'Sternenkarte', 'Werkzeug', 'Proviant', 'Helm', 'Sauerstoff', 'Taschenlampe'],
    Alltag: ['Schlüssel', 'Geldbeutel', 'Regenschirm', 'Notizbuch', 'Kugelschreiber', 'Brotdose', 'Ladekabel', 'Kopfhörer']
  };
  const definitions = [
    ['drawing-telephone', 'Stille Post mit Zeichnungen', '✏️', 3, 'Aus einem Satz wird ein Bild, daraus wieder ein Satz. Am Ende seht ihr, wie sich die Idee verändert hat.', ['Kategorie und Anzahl der Bildketten wählen.', 'Handy einzeln weitergeben und die Vorlage nur privat ansehen.', 'Abwechselnd zeichnen und das letzte Bild beschreiben.', 'Die fertige Kette gemeinsam aufdecken. Es gibt keine Gewinner.'], drawings],
    ['three-rounds', 'Drei-Runden-Begrifferaten', '🎭', 4, 'Zwei Teams erraten denselben Stapel dreimal: frei erklären, mit genau einem Wort und schließlich nur pantomimisch.', ['Begriffe pro Stapel wählen; Namen werden abwechselnd Team A und B zugeteilt.', 'Pro Teamzug 60 Sekunden: Nur die erklärende Person sieht die Karte.', 'Alle Begriffe zuerst frei erklären, dann mit einem Wort, zuletzt ohne Sprache darstellen.', 'Jeder Treffer zählt einen Teampunkt. Übersprungene Wörter bleiben im Stapel.'], words],
    ['packing-suitcase', 'Ich packe meinen Koffer', '🧳', 2, 'Merkt euch eine immer längere Liste. Wiederhole alles in der richtigen Reihenfolge und ergänze einen eigenen Gegenstand.', ['Thema und Anzahl der Spielzüge wählen.', 'Aktive Person wiederholt die Liste laut aus dem Gedächtnis und ergänzt etwas.', 'Gerät zur Gruppe geben, erst dann die Liste zur Prüfung aufdecken.', 'Die Gruppe bestätigt die Reihenfolge. Nur ein korrekter Zug verlängert die Liste und zählt einen Punkt.'], luggage]
  ];
  const added = definitions.map(([id, title, icon, minPlayers, description, instructions, packs]) => Object.freeze({
    id, title, icon, minPlayers, maxPlayers: 20, duration: id === 'three-rounds' ? 20 : 15,
    group: 'Social & Klassiker', moods: ['funny', 'friendly', 'competitive'], age: 'all', status: 'playable', mode: 'link',
    href: `quick-play.html?game=${id}`, description, instructions: Object.freeze(instructions), packs: Object.freeze(Object.keys(packs)), featured: false
  }));
  const classicGameIds = Object.freeze(added.map(game => game.id));
  const games = Object.freeze([...base.games, ...added]);
  const content = Object.freeze({ ...base.content, ...Object.fromEntries(definitions.map(([id, , , , , , packs]) => [id, packs])) });
  const getGame = id => games.find(game => game.id === id) || null;
  const getPackNames = id => content[id] ? Object.keys(content[id]) : [];
  const getItems = (id, pack) => pack && Array.isArray(content[id]?.[pack]) ? content[id][pack] : Object.values(content[id] || {}).flat();
  return Object.freeze({ ...base, games, content, getGame, getPackNames, getItems, itemCount: id => getItems(id).length,
    classicGameIds, megaGameIds: Object.freeze([...(base.megaGameIds || []), ...classicGameIds]), quickGameIds: Object.freeze([...(base.quickGameIds || []), ...classicGameIds]) });
});
