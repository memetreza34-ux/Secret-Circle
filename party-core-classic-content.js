(function (root, factory) {
  const base = typeof module === 'object' && module.exports
    ? require('./party-core-release-catalog.js')
    : root.SecretCirclePartyCatalog;
  const api = factory(base);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCirclePartyCatalog = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createClassicCoreContent(base) {
  'use strict';
  if (!base) throw new Error('Core-Release-Katalog für klassische Inhalte fehlt.');

  const VERSION = 3;
  const additions = {
    'truth-dare': {
      Locker: {
        truth: [
          'Welche kleine Sache gönnst du dir besonders gern?',
          'Welche Aktivität macht einen normalen Tag für dich besser?',
          'Welchen Gegenstand benutzt du häufiger als gedacht?',
          'Was würdest du gern einmal richtig gut können?'
        ],
        dare: [
          'Beschreibe deinen heutigen Tag in genau fünf Wörtern.',
          'Stelle zehn Sekunden lang einen besonders stolzen Pinguin dar.',
          'Erfinde einen freundlichen Teamnamen für die Runde.',
          'Mache eine kurze Siegespose und halte sie fünf Sekunden.'
        ]
      },
      Lustig: {
        truth: [
          'Welche harmlose Sache hast du schon einmal völlig überkompliziert?',
          'Welcher Alltagsgegenstand hätte bei dir einen eigenen Spitznamen verdient?',
          'Bei welcher Kleinigkeit musst du unerwartet oft lachen?',
          'Welche völlig unnötige Fähigkeit wäre trotzdem praktisch?'
        ],
        dare: [
          'Erkläre einen Kühlschrank wie eine revolutionäre neue Erfindung.',
          'Spiele zehn Sekunden lang einen sehr verwirrten Reiseführer.',
          'Erfinde einen dramatischen Filmtitel über das Aufräumen.',
          'Mache drei übertriebene Reaktionen auf ein imaginäres Geschenk.'
        ]
      },
      Tiefer: {
        truth: [
          'Welche Gewohnheit möchtest du langfristig beibehalten?',
          'Welche Art von Unterstützung hilft dir wirklich, wenn etwas schwierig wird?',
          'Welche Eigenschaft möchtest du in den nächsten Jahren weiterentwickeln?',
          'Was bedeutet für dich ein wirklich guter freier Tag?'
        ],
        dare: [
          'Nenne eine Sache, die du an der heutigen Runde schätzt.',
          'Formuliere ein realistisches Ziel für die nächsten vier Wochen.',
          'Gib einer Person ein konkretes Kompliment zu einer Fähigkeit.',
          'Nenne eine kleine Sache, auf die du dich in nächster Zeit freust.'
        ]
      },
      Chaos: {
        truth: [
          'Welches Tier wäre der beste Chef eines völlig chaotischen Büros?',
          'Welche erfundene Sportart würdest du sofort ausprobieren?',
          'Welcher Gegenstand sollte deiner Meinung nach sprechen können?',
          'Welche absurde Erfindung wäre überraschend nützlich?'
        ],
        dare: [
          'Erfinde einen zehnsekündigen Trailer für einen Film über einen Toaster.',
          'Halte eine sehr ernste Rede über die Bedeutung von Socken.',
          'Spiele eine Wettermoderation für einen Planeten deiner Wahl.',
          'Erfinde ein neues Geräusch für eine Türklingel und führe es vor.'
        ]
      }
    },
    charades: {
      Tiere: [
        'Affe', 'Schlange', 'Pferd', 'Hund', 'Robbe', 'Flamingo', 'Bär', 'Hase', 'Schildkröte',
        'Papagei', 'Zebra', 'Fuchs', 'Hai', 'Biene', 'Spinne', 'Maus', 'Löwe', 'Otter'
      ],
      Berufe: [
        'Ärztin', 'Busfahrer', 'Elektrikerin', 'Polizist', 'Postbote', 'Zahnarzt', 'Programmiererin',
        'Architektin', 'Maler', 'Schiedsrichterin', 'Kellner', 'Journalistin', 'Tierarzt', 'Schneiderin',
        'Apotheker', 'Bibliothekarin', 'Rettungssanitäter', 'Musikerin'
      ],
      Alltag: [
        'Bett machen', 'Schuhe binden', 'Haare föhnen', 'Tür aufschließen', 'Staubsaugen', 'Wäsche aufhängen',
        'Geschirr spülen', 'Einkauf tragen', 'Brief öffnen', 'Kopfhörer aufsetzen', 'Jacke anziehen', 'Tisch decken',
        'Handy laden', 'Paket auspacken', 'Pflanze gießen', 'Sandwich machen', 'Fahrkarte suchen', 'Fotoalbum ansehen'
      ],
      Aktionen: [
        'Springen', 'Krabbeln', 'Boxen', 'Schwimmen', 'Werfen', 'Fangen', 'Gähnen', 'Lachen', 'Sägen',
        'Hämmern', 'Schrauben', 'Skifahren', 'Surfen', 'Fotografieren', 'Lesen', 'Malen', 'Kochen', 'Dehnen'
      ]
    },
    taboo: {
      Alltag: [
        { word: 'Staubsauger', banned: ['Boden', 'saugen', 'Staub'] },
        { word: 'Handtuch', banned: ['trocken', 'Bad', 'abwischen'] },
        { word: 'Schlüsselbund', banned: ['Schlüssel', 'Ring', 'Tür'] },
        { word: 'Balkon', banned: ['Wohnung', 'draußen', 'Geländer'] },
        { word: 'Kleiderschrank', banned: ['Kleidung', 'Tür', 'Schlafzimmer'] },
        { word: 'Spiegel', banned: ['sehen', 'Gesicht', 'Reflexion'] },
        { word: 'Briefkasten', banned: ['Post', 'Brief', 'Haus'] },
        { word: 'Einkaufswagen', banned: ['Supermarkt', 'schieben', 'Korb'] }
      ],
      Essen: [
        { word: 'Erdbeere', banned: ['rot', 'Obst', 'klein'] },
        { word: 'Sandwich', banned: ['Brot', 'belegen', 'Scheiben'] },
        { word: 'Müsli', banned: ['Frühstück', 'Milch', 'Schüssel'] },
        { word: 'Pfannkuchen', banned: ['Pfanne', 'Teig', 'flach'] },
        { word: 'Tomate', banned: ['rot', 'Gemüse', 'Salat'] },
        { word: 'Käsekuchen', banned: ['Kuchen', 'Quark', 'backen'] },
        { word: 'Mineralwasser', banned: ['trinken', 'Flasche', 'Sprudel'] },
        { word: 'Rührei', banned: ['Ei', 'Pfanne', 'Frühstück'] }
      ],
      Technik: [
        { word: 'Tablet', banned: ['Bildschirm', 'Touch', 'Gerät'] },
        { word: 'Powerbank', banned: ['Akku', 'laden', 'mobil'] },
        { word: 'Mikrofon', banned: ['Stimme', 'aufnehmen', 'sprechen'] },
        { word: 'Videospiel', banned: ['spielen', 'Konsole', 'Gaming'] },
        { word: 'E-Mail', banned: ['Nachricht', 'Postfach', 'senden'] },
        { word: 'Cloud', banned: ['Speicher', 'online', 'Daten'] },
        { word: 'QR-Code', banned: ['scannen', 'Kamera', 'Quadrat'] },
        { word: 'Webcam', banned: ['Kamera', 'Video', 'Computer'] }
      ]
    },
    'hot-potato': {
      Kategorien: [
        'Nenne etwas, das man im Winter braucht.',
        'Nenne etwas aus einem Büro.',
        'Nenne ein Tier mit vier Beinen.',
        'Nenne etwas, das man öffnen kann.'
      ],
      Schnellfeuer: [
        'Nenne etwas Gelbes.',
        'Nenne eine Tätigkeit am Wochenende.',
        'Nenne etwas mit Rädern.',
        'Nenne etwas, das leuchtet.'
      ],
      'Mini-Aufgaben': [
        'Nenne drei Dinge aus einer Küche und gib weiter.',
        'Mache zwei große Armkreise und gib weiter.',
        'Nenne zwei Verkehrsmittel und gib weiter.',
        'Sage die Wochentage bis Mittwoch und gib weiter.'
      ]
    }
  };

  const editorialReplacements = Object.freeze({
    'Was ist das Seltsamste in deiner Kamerarolle?': 'Welches Foto-Motiv findest du besonders lustig?',
    'Lies die letzte Nachricht auf deinem Handy wie ein Theatermonolog, ohne Namen zu nennen.': 'Lies einen selbst erfundenen Satz wie einen dramatischen Theatermonolog vor.',
    Chrome: 'Tab'
  });

  const referenceSafeGameOverrides = Object.freeze({
    'anime-guess': Object.freeze({
      title: 'Anime-Archetypen erraten',
      group: 'Anime-Quiz',
      description: 'Ein eigenständiges Anime-Archetypen-Quiz ohne konkrete Franchise-Figuren, Logos, Bilder oder Zitate.',
      instructions: Object.freeze([
        'Archetypen-Pack wählen.',
        'Gerät von der ratenden Person weg halten.',
        'Archetyp erklären, ohne die Bezeichnung zu nennen.',
        'Treffer oder Überspringen markieren.'
      ]),
      packs: Object.freeze(['Action & Abenteuer', 'Magie & Mystery', 'Fantasy & Alltag', 'Sport & Games'])
    }),
    wavelength: Object.freeze({
      title: 'Spektrum-Tipp',
      group: 'Einschätzen',
      description: 'Ein geheimer Zielwert liegt zwischen zwei Polen. Eine Person gibt einen kurzen Hinweis, die Gruppe setzt ihre Position auf dem Spektrum.',
      instructions: Object.freeze([
        'Spektrum und geheimen Zielwert ansehen.',
        'Einen kurzen passenden Hinweis geben.',
        'Ziel verbergen und die Gruppe eine Position festlegen lassen.',
        'Abstand aufdecken und Punkte vergeben.'
      ])
    })
  });

  const referenceSafeContent = Object.freeze({
    'anime-guess': Object.freeze({
      'Action & Abenteuer': Object.freeze([
        'Ehrgeiziger Kampfkunst-Schüler', 'Optimistische Abenteuerkapitänin', 'Ruhiger Schwertkämpfer',
        'Taktische Bogenschützin', 'Hitzköpfiger Feuerkämpfer', 'Blitzschnelle Rivalin',
        'Beschützender Team-Anführer', 'Hartnäckige Nachwuchsheldin', 'Gelassene Meisterin', 'Mysteriöser Einzelgänger'
      ]),
      'Magie & Mystery': Object.freeze([
        'Fluchjägerin', 'Magieschüler mit verbotener Rune', 'Dämonenforscherin', 'Zeitreisende Detektivin',
        'Geisterseher', 'Alchemistischer Tüftler', 'Mondmagierin', 'Schattenbeschwörer', 'Heilerin mit Geheimnis',
        'Bibliothekarin verbotener Magie'
      ]),
      'Fantasy & Alltag': Object.freeze([
        'Schüchterne Schulsprecherin mit Doppelleben', 'Chaotischer Café-Mitarbeiter', 'Prinzessin auf geheimer Reise',
        'Roboterpilot wider Willen', 'Tiergeist-Begleiterin', 'Koch mit legendärem Rezept', 'Reisende Apothekerin',
        'Dorfheld ohne Superkraft', 'Musikerin mit magischem Instrument', 'Erfinder mit lebendigem Gadget'
      ]),
      'Sport & Games': Object.freeze([
        'Volleyball-Springer', 'Präzise Fußballstürmerin', 'Eiskunstlauf-Talent', 'Basketball-Taktikerin',
        'E-Sport-Kapitän', 'Rennfahrerin mit Nerven aus Stahl', 'Schachgenie an der Schule',
        'Ausdauerläufer mit Rivalen', 'Bogenschützin im Turnier', 'Teammanager mit großer Strategie'
      ])
    })
  });

  function mergeNested(baseValue, extraValue, context) {
    if (Array.isArray(baseValue) && Array.isArray(extraValue)) return [...baseValue, ...extraValue];
    if (
      baseValue && extraValue
      && typeof baseValue === 'object' && !Array.isArray(baseValue)
      && typeof extraValue === 'object' && !Array.isArray(extraValue)
    ) {
      const merged = { ...baseValue };
      for (const [key, value] of Object.entries(extraValue)) {
        if (!(key in baseValue)) throw new Error(`Unbekannter verschachtelter Content-Pfad: ${context}/${key}`);
        merged[key] = mergeNested(baseValue[key], value, `${context}/${key}`);
      }
      return merged;
    }
    throw new Error(`Unvereinbare Contentstruktur: ${context}`);
  }

  function mergeContent(baseContent, extraContent) {
    const content = { ...baseContent };
    for (const [gameId, packs] of Object.entries(extraContent)) {
      const current = content[gameId];
      if (!current || typeof current !== 'object' || Array.isArray(current)) {
        throw new Error(`Classic-Content kann Spiel nicht erweitern: ${gameId}`);
      }
      const merged = { ...current };
      for (const [packName, extraPack] of Object.entries(packs)) {
        if (!(packName in current)) throw new Error(`Unbekannter Classic-Pack: ${gameId}/${packName}`);
        merged[packName] = mergeNested(current[packName], extraPack, `${gameId}/${packName}`);
      }
      content[gameId] = merged;
    }
    return content;
  }

  function replaceEditorialText(value) {
    if (typeof value === 'string') return editorialReplacements[value] || value;
    if (Array.isArray(value)) return value.map(replaceEditorialText);
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, replaceEditorialText(entry)]));
    }
    return value;
  }

  function flattenItems(value) {
    if (Array.isArray(value)) return value;
    if (!value || typeof value !== 'object') return [];
    return Object.values(value).flatMap(flattenItems);
  }

  const content = replaceEditorialText(mergeContent(base.content, additions));
  for (const [gameId, packs] of Object.entries(referenceSafeContent)) content[gameId] = packs;

  const games = Object.freeze(base.games.map(game => {
    const override = referenceSafeGameOverrides[game.id];
    return override ? Object.freeze({ ...game, ...override }) : game;
  }));

  function getGame(id) {
    return games.find(game => game.id === id) || null;
  }

  function getPackNames(id) {
    const value = content[id];
    return value && typeof value === 'object' && !Array.isArray(value) ? Object.keys(value) : [];
  }

  function getItems(id, pack) {
    const value = content[id];
    if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
    if (pack && Object.prototype.hasOwnProperty.call(value, pack)) return flattenItems(value[pack]);
    return flattenItems(value);
  }

  function itemCount(id) {
    return getItems(id).length;
  }

  return Object.freeze({
    ...base,
    games,
    content,
    getGame,
    getPackNames,
    getItems,
    itemCount,
    coreClassicContentVersion: VERSION,
    coreClassicContentGames: Object.freeze(Object.keys(additions)),
    editorialReplacementCount: Object.keys(editorialReplacements).length,
    referenceSafeGameIds: Object.freeze(Object.keys(referenceSafeGameOverrides)),
    referenceSafeRemovedConcreteNames: 40
  });
});
