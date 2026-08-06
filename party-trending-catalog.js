(function (root, factory) {
  const base = typeof module === 'object' && module.exports
    ? require('./party-expansion.js')
    : root.SecretCirclePartyCatalog;
  const api = factory(base);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCirclePartyCatalog = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (base) {
  'use strict';
  if (!base) throw new Error('Party-Erweiterung für Trendmodi fehlt.');

  const quickHref = id => `quick-play.html?game=${encodeURIComponent(id)}`;
  const promoted = new Set(['wavelength', 'draw-guess', 'rapid-fire', 'sound-imitation']);

  const promotedGames = base.games.map(game => promoted.has(game.id)
    ? Object.freeze({
        ...game,
        status: 'playable',
        mode: 'link',
        href: quickHref(game.id),
        featured: game.id === 'wavelength' || game.id === 'rapid-fire'
      })
    : game
  );

  const newGames = [
    {
      id: 'forehead-guess', title: 'Stirn-Raten', icon: '🤳', group: 'Erklären', status: 'playable', mode: 'link',
      href: quickHref('forehead-guess'), minPlayers: 2, maxPlayers: 20, duration: 15,
      moods: ['funny', 'competitive'], age: 'all', featured: true,
      description: 'Eine Person sieht den Begriff nicht. Die Gruppe erklärt, spielt oder umschreibt, bis geraten oder übersprungen wird.',
      instructions: ['Pack und Rundenzahl wählen.', 'Gerät vom ratenden Spieler weg halten.', 'Gruppe erklärt ohne das Wort zu nennen.', 'Treffer oder Überspringen markieren.'],
      packs: ['Alltag', 'Tiere', 'Berufe', 'Popkultur']
    },
    {
      id: 'letter-categories', title: 'Buchstaben-Kategorien', icon: '🔤', group: 'Schnell', status: 'playable', mode: 'link',
      href: quickHref('letter-categories'), minPlayers: 2, maxPlayers: 20, duration: 15,
      moods: ['clever', 'competitive'], age: 'all',
      description: 'Ein Buchstabe und mehrere Kategorien erscheinen. Unter Zeitdruck werden passende, möglichst einzigartige Antworten gesammelt.',
      instructions: ['Runde und Zeit starten.', 'Antworten auf Papier oder im Kopf sammeln.', 'Nach Ablauf Antworten vergleichen.', 'Gültige einzigartige Antworten als Punkte eintragen.'],
      packs: ['Klassisch', 'Alltag', 'Kreativ']
    },
    {
      id: 'dont-laugh', title: 'Nicht lachen!', icon: '😐', group: 'Challenge', status: 'playable', mode: 'link',
      href: quickHref('dont-laugh'), minPlayers: 2, maxPlayers: 20, duration: 10,
      moods: ['funny', 'chaotic'], age: 'all',
      description: 'Eine Person versucht mit einer sicheren Aufgabe die anderen zum Lachen zu bringen. Wer ernst bleibt, punktet.',
      instructions: ['Aktive Person und Aufgabe anzeigen.', '30 Sekunden lang nicht lachen.', 'Erfolg oder Lacher markieren.', 'Nächste Person übernimmt.'],
      packs: ['Gesichter', 'Stimmen', 'Mini-Szenen']
    },
    {
      id: 'hum-song', title: 'Melodie summen', icon: '🎵', group: 'Audio', status: 'playable', mode: 'link',
      href: quickHref('hum-song'), minPlayers: 2, maxPlayers: 20, duration: 15,
      moods: ['funny', 'friendly'], age: 'all',
      description: 'Eine Person summt eine passende Melodie, ohne Wörter zu benutzen. Die Gruppe errät Titel, Stil oder Anlass.',
      instructions: ['Hinweis nur der aktiven Person zeigen.', 'Ohne Text summen oder pfeifen.', 'Treffer oder Überspringen markieren.', 'Gerät weitergeben.'],
      packs: ['Anlässe', 'Genres', 'Film & Serie']
    },
    {
      id: 'scavenger-hunt', title: 'Gegenstandsjagd', icon: '🔎', group: 'Bewegung', status: 'playable', mode: 'link',
      href: quickHref('scavenger-hunt'), minPlayers: 2, maxPlayers: 20, duration: 15,
      moods: ['chaotic', 'competitive'], age: 'all',
      description: 'Die App nennt eine sichere Eigenschaft. Wer zuerst einen passenden Gegenstand findet und zurückbringt, erhält den Punkt.',
      instructions: ['Sicheren Spielbereich festlegen.', 'Aufgabe öffnen und Timer starten.', 'Passenden Gegenstand finden.', 'Fund bestätigen und nächste Runde starten.'],
      packs: ['Wohnung', 'Farben', 'Eigenschaften']
    },
    {
      id: 'caption-battle', title: 'Caption Battle', icon: '💬', group: 'Kreativ', status: 'playable', mode: 'link',
      href: quickHref('caption-battle'), minPlayers: 3, maxPlayers: 20, duration: 20,
      moods: ['funny', 'competitive'], age: 'teen',
      description: 'Zu einer absurden Situation erfindet jeder spontan eine Bildunterschrift. Die Gruppe wählt den stärksten Beitrag.',
      instructions: ['Situation vorlesen.', 'Alle denken sich eine kurze Caption aus.', 'Beiträge nacheinander vortragen.', 'Gewinner per Handzeichen wählen.'],
      packs: ['Alltag', 'Internet', 'Fantasie']
    }
  ].map(Object.freeze);

  const quickContent = {
    wavelength: {
      Alltag: [
        ['Unnötig', 'Unverzichtbar'], ['Entspannend', 'Stressig'], ['Altmodisch', 'Zukunft'], ['Billig', 'Luxuriös'],
        ['Leicht zu lernen', 'Sehr schwer'], ['Peinlich', 'Beeindruckend'], ['Leise', 'Laut'], ['Planbar', 'Chaotisch']
      ],
      Gefühle: [
        ['Beruhigend', 'Aufregend'], ['Vertrauenswürdig', 'Verdächtig'], ['Harmlos', 'Mutig'], ['Oberflächlich', 'Tiefgründig'],
        ['Unpersönlich', 'Sehr persönlich'], ['Enttäuschend', 'Überraschend'], ['Kalt', 'Herzlich'], ['Langweilig', 'Fesselnd']
      ],
      Popkultur: [
        ['Nische', 'Mainstream'], ['Vergessen', 'Zeitlos'], ['Realistisch', 'Völlig absurd'], ['Schlechter Trend', 'Dauerhafter Klassiker'],
        ['Nebenfigur', 'Hauptfigur'], ['Einmal ansehen', 'Immer wieder ansehen'], ['Unterschätzt', 'Überschätzt'], ['Ruhig', 'Spektakulär']
      ]
    },
    'draw-guess': {
      Alltag: ['Einkaufswagen', 'Regenschirm', 'Wäschekorb', 'Staubsauger', 'Kaffeetasse', 'Fahrradschloss', 'Fernbedienung', 'Zahnbürste', 'Kühlschrank', 'Rucksack'],
      Tiere: ['Pinguin', 'Giraffe', 'Krabbe', 'Eule', 'Känguru', 'Schildkröte', 'Seepferdchen', 'Chamäleon', 'Oktopus', 'Pfau'],
      Situationen: ['Bus verpassen', 'Kuchen backen', 'Im Regen rennen', 'Etwas suchen', 'Zu spät aufwachen', 'Ein Geschenk öffnen', 'Im Stau stehen', 'Ein Selfie machen', 'Zelten', 'Schneemann bauen']
    },
    'rapid-fire': {
      '3 in 5 Sekunden': [
        ['Nenne drei rote Dinge', 3, 5], ['Nenne drei Tiere mit vier Beinen', 3, 5], ['Nenne drei Apps', 3, 5],
        ['Nenne drei Frühstückssachen', 3, 5], ['Nenne drei Länder', 3, 5], ['Nenne drei Berufe', 3, 5],
        ['Nenne drei Dinge im Badezimmer', 3, 5], ['Nenne drei Wörter mit S', 3, 5]
      ],
      '5 in 10 Sekunden': [
        ['Nenne fünf Getränke', 5, 10], ['Nenne fünf Filmgenres', 5, 10], ['Nenne fünf Städte', 5, 10],
        ['Nenne fünf Dinge mit Bildschirm', 5, 10], ['Nenne fünf Sportarten', 5, 10], ['Nenne fünf Dinge für eine Reise', 5, 10],
        ['Nenne fünf Lebensmittel im Kühlschrank', 5, 10], ['Nenne fünf Geräusche im Alltag', 5, 10]
      ],
      Extrem: [
        ['Nenne sieben Wörter ohne den Buchstaben E', 7, 15], ['Nenne sechs Dinge, die rollen', 6, 12],
        ['Nenne sechs berühmte Erfindungen', 6, 12], ['Nenne sieben Dinge, die man sammeln kann', 7, 15],
        ['Nenne sechs Begriffe zum Thema Strom', 6, 12], ['Nenne sieben Dinge, die leuchten', 7, 15]
      ]
    },
    'sound-imitation': {
      Tiere: ['Katze', 'Hund', 'Esel', 'Möwe', 'Frosch', 'Wolf', 'Huhn', 'Elefant', 'Affe', 'Biene'],
      Haushalt: ['Staubsauger', 'Wasserkocher', 'Türklingel', 'Waschmaschine', 'Mixer', 'Mikrowelle', 'Wecker', 'Föhn', 'Drucker', 'Duschkopf'],
      Situationen: ['Gewitter', 'Fußballstadion', 'Baustelle', 'Bahnhof', 'Videospiel', 'Achterbahn', 'Kino', 'Feuerwerk', 'Schulhof', 'Verkehrsstau']
    },
    'forehead-guess': {
      Alltag: ['Toaster', 'Sonnenbrille', 'Kopfhörer', 'Schlüsselbund', 'Kissen', 'Trinkflasche', 'Paketbote', 'Ampel', 'Aufzug', 'Supermarkt'],
      Tiere: ['Panda', 'Delfin', 'Igel', 'Papagei', 'Krokodil', 'Fledermaus', 'Flamingo', 'Hamster', 'Hai', 'Pferd'],
      Berufe: ['Elektroniker', 'Feuerwehrkraft', 'Fotograf', 'Koch', 'Pilot', 'Lehrkraft', 'Mechaniker', 'Arzt', 'Designer', 'Bäcker'],
      Popkultur: ['Superheld', 'Detektiv', 'Roboter', 'Zauberer', 'Rennfahrer', 'Weltraumkapitän', 'Game-Streamer', 'Filmstar', 'Drachenreiter', 'Zeitreisender']
    },
    'letter-categories': {
      Klassisch: [
        ['Stadt', 'Land', 'Tier', 'Beruf', 'Essen'], ['Vorname', 'Ort', 'Gegenstand', 'Pflanze', 'Marke'],
        ['Film oder Serie', 'Sport', 'Getränk', 'Kleidungsstück', 'Fahrzeug']
      ],
      Alltag: [
        ['Im Haushalt', 'Im Supermarkt', 'In der Schule', 'In der Stadt', 'Auf Reisen'],
        ['App', 'Elektrogerät', 'Möbelstück', 'Werkzeug', 'Hobby'],
        ['Frühstück', 'Geschenk', 'Geräusch', 'Gewohnheit', 'Wochenendaktivität']
      ],
      Kreativ: [
        ['Superkraft', 'Fantasieort', 'Bandname', 'Erfindung', 'Bösewicht'],
        ['Ausrede', 'Podcastname', 'Robotername', 'Festival', 'Geheimversteck'],
        ['Traumberuf', 'Filmfigur', 'Produktidee', 'Teamname', 'Abenteuer']
      ]
    },
    'dont-laugh': {
      Gesichter: ['Ernst bleiben und nur mit den Augen überrascht wirken.', 'Eine extrem langsame Grimasse machen.', 'So tun, als würdest du gegen einen Nieser kämpfen.', 'Ein unsichtbares saures Bonbon essen.', 'Mit völlig ernstem Gesicht wie ein verwirrter Roboter schauen.', 'Eine dramatische Augenbrauen-Unterhaltung spielen.'],
      Stimmen: ['Eine Wettervorhersage für den Kühlschrank sprechen.', 'Wie ein Nachrichtensprecher über eine verlorene Socke berichten.', 'Ein Kochrezept wie einen Actionfilm ankündigen.', 'Mit Roboterstimme ein Geburtstagslied ohne Melodie sprechen.', 'Eine Durchsage für einen verspäteten Aufzug machen.', 'Einen Staubsauger als Luxusprodukt bewerben.'],
      'Mini-Szenen': ['Versuche eine unsichtbare Tür zu öffnen, die immer wieder klemmt.', 'Führe ein ernstes Interview mit einem Kissen.', 'Spiele eine dramatische Suche nach deiner eigenen Hand.', 'Begrüße einen imaginären Prominenten völlig übertrieben.', 'Tu so, als wäre der Boden plötzlich sehr langsam.', 'Führe einen Streit mit einer leeren Wasserflasche.']
    },
    'hum-song': {
      Anlässe: ['Geburtstagslied', 'Stadiongesang', 'Schlaflied', 'Feierlied', 'Weihnachtsmelodie', 'Hochzeitsmusik', 'Reiselied', 'Kinderlied'],
      Genres: ['Rock-Refrain', 'Rap-Beat', 'Elektro-Melodie', 'Jazz-Thema', 'Klassische Melodie', 'Pop-Refrain', 'Western-Musik', 'Videospiel-Musik'],
      'Film & Serie': ['Spannende Verfolgung', 'Romantische Szene', 'Superhelden-Auftritt', 'Mysteriöser Vorspann', 'Komödiantischer Moment', 'Finaler Sieg', 'Weltraumreise', 'Trauriger Abschied']
    },
    'scavenger-hunt': {
      Wohnung: ['Etwas, das wärmer als deine Hand ist', 'Etwas mit einem Knopf', 'Etwas, das Geräusche machen kann', 'Etwas, das in eine Tasche passt', 'Etwas mit einer Zahl darauf', 'Etwas, das man täglich benutzt', 'Etwas Weiches', 'Etwas, das Licht reflektiert'],
      Farben: ['Etwas vollständig Blaues', 'Etwas mit mindestens drei Farben', 'Etwas Schwarzes und Rundes', 'Etwas Grünes, das kein Essen ist', 'Etwas Rotes, das nicht aus Papier ist', 'Etwas Weißes mit Schrift', 'Etwas Gelbes', 'Etwas Durchsichtiges'],
      Eigenschaften: ['Etwas überraschend Schweres', 'Etwas sehr Leichtes', 'Etwas Älteres als ein Jahr', 'Etwas mit einer interessanten Oberfläche', 'Etwas, das sich öffnen lässt', 'Etwas mit einem Kabel', 'Etwas, das rollen kann', 'Etwas, das man stapeln kann']
    },
    'caption-battle': {
      Alltag: ['Du öffnest den Kühlschrank zum fünften Mal und erwartest neue Inhalte.', 'Der Bus fährt genau in dem Moment ab, in dem du ankommst.', 'Jemand sagt: Das dauert nur fünf Minuten.', 'Der Wecker klingelt, aber dein Körper stimmt dagegen.', 'Du suchst dein Handy, während du es in der Hand hältst.', 'Die letzte Pommes liegt in der Mitte des Tisches.'],
      Internet: ['Das WLAN funktioniert erst wieder, nachdem niemand mehr hinschaut.', 'Der Gruppenchat wird plötzlich um drei Uhr morgens aktiv.', 'Ein Update verspricht kleine Verbesserungen und braucht eine Stunde.', 'Du öffnest eine App und vergisst sofort warum.', 'Autokorrektur entscheidet sich gegen deinen Ruf.', 'Ein Video lädt bei 99 Prozent nicht weiter.'],
      Fantasie: ['Ein Drache muss beim Bürgeramt eine Nummer ziehen.', 'Ein Roboter entdeckt seinen ersten Montag.', 'Ein Zauberer hat sein Passwort vergessen.', 'Aliens versuchen einen Toaster zu verstehen.', 'Ein Ritter bestellt Essen per App.', 'Eine Zeitmaschine landet fünf Minuten zu spät.']
    }
  };

  const games = Object.freeze([...promotedGames, ...newGames]);
  const content = Object.assign({}, base.content, quickContent);

  function getGame(id) {
    return games.find(game => game.id === id) || null;
  }

  function getPackNames(id) {
    return content[id] ? Object.keys(content[id]) : [];
  }

  function getItems(id, pack) {
    const gameContent = content[id];
    if (!gameContent) return [];
    if (pack && gameContent[pack]) return gameContent[pack];
    return Object.values(gameContent).flatMap(value => Array.isArray(value) ? value : []);
  }

  function itemCount(id) {
    return getItems(id).length;
  }

  return Object.freeze({
    ...base,
    version: 3,
    games,
    content,
    getGame,
    getPackNames,
    getItems,
    itemCount,
    trendingGameIds: Object.freeze([
      'wavelength', 'draw-guess', 'rapid-fire', 'sound-imitation', 'forehead-guess',
      'letter-categories', 'dont-laugh', 'hum-song', 'scavenger-hunt', 'caption-battle'
    ])
  });
});
