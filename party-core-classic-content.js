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

  const VERSION = 1;
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

  function flattenItems(value) {
    if (Array.isArray(value)) return value;
    if (!value || typeof value !== 'object') return [];
    return Object.values(value).flatMap(flattenItems);
  }

  const content = mergeContent(base.content, additions);

  function getGame(id) {
    return base.games.find(game => game.id === id) || null;
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
    content,
    getGame,
    getPackNames,
    getItems,
    itemCount,
    coreClassicContentVersion: VERSION,
    coreClassicContentGames: Object.freeze(Object.keys(additions))
  });
});