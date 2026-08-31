(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCircleContent = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const VERSION = '2026.08-rc1';

  const LABELS = {
    alltag: 'Alltag',
    schule: 'Schule',
    technik: 'Technik',
    essen: 'Essen',
    reisen: 'Reisen',
    natur: 'Natur',
    sport: 'Sport',
    medien: 'Film & Medien'
  };

  const ICONS = {
    alltag: '🏠',
    schule: '🎒',
    technik: '⚡',
    essen: '🍕',
    reisen: '✈️',
    natur: '🌿',
    sport: '⚽',
    medien: '🎬'
  };

  const PACKS = {
    alltag: [
      ['Schlüssel', 'Gegenstand'],
      ['Regenschirm', 'Wetter'],
      ['Kissen', 'Wohnung'],
      ['Fahrstuhl', 'Gebäude'],
      ['Zahnbürste', 'Bad'],
      ['Einkaufswagen', 'Geschäft'],
      ['Wecker', 'Morgen'],
      ['Rucksack', 'Unterwegs'],
      ['Briefkasten', 'Haus'],
      ['Fernbedienung', 'Wohnzimmer']
    ],

    schule: [
      ['Tafel', 'Unterricht'],
      ['Pausenhof', 'Schule'],
      ['Hausaufgabe', 'Lernen'],
      ['Lineal', 'Material'],
      ['Zeugnis', 'Bewertung'],
      ['Turnhalle', 'Sport'],
      ['Stundenplan', 'Organisation'],
      ['Federmappe', 'Schreibzeug'],
      ['Bibliothek', 'Bücher'],
      ['Klassenfahrt', 'Reise']
    ],

    technik: [
      ['Router', 'Netzwerk'],
      ['Sensor', 'Messung'],
      ['Batterie', 'Energie'],
      ['Kabel', 'Verbindung'],
      ['Tastatur', 'Eingabe'],
      ['Satellit', 'Signal'],
      ['Mikrochip', 'Elektronik'],
      ['Lautsprecher', 'Audio'],
      ['Drohne', 'Flug'],
      ['3D-Drucker', 'Herstellung']
    ],

    essen: [
      ['Pizza', 'Gericht'],
      ['Mango', 'Obst'],
      ['Nudeln', 'Gericht'],
      ['Joghurt', 'Kühlregal'],
      ['Popcorn', 'Snack'],
      ['Zimt', 'Gewürz'],
      ['Pfannkuchen', 'Frühstück'],
      ['Avocado', 'Frucht'],
      ['Brezel', 'Gebäck'],
      ['Tomatensuppe', 'Mahlzeit']
    ],

    reisen: [
      ['Flughafen', 'Reise'],
      ['Koffer', 'Gepäck'],
      ['Hotel', 'Unterkunft'],
      ['Reisepass', 'Dokument'],
      ['Strand', 'Urlaub'],
      ['U-Bahn', 'Verkehr'],
      ['Campingplatz', 'Übernachtung'],
      ['Stadtplan', 'Orientierung'],
      ['Seilbahn', 'Berg'],
      ['Souvenir', 'Erinnerung']
    ],

    natur: [
      ['Wasserfall', 'Wasser'],
      ['Vulkan', 'Berg'],
      ['Regenbogen', 'Himmel'],
      ['Eichhörnchen', 'Tier'],
      ['Sonnenblume', 'Pflanze'],
      ['Gletscher', 'Eis'],
      ['Korallenriff', 'Meer'],
      ['Tannenzapfen', 'Wald'],
      ['Gewitter', 'Wetter'],
      ['Wüstenoase', 'Landschaft']
    ],

    sport: [
      ['Basketball', 'Ball'],
      ['Schwimmbrille', 'Wasser'],
      ['Marathon', 'Laufen'],
      ['Tischtennis', 'Schläger'],
      ['Kletterwand', 'Höhe'],
      ['Fahrradhelm', 'Schutz'],
      ['Torwart', 'Mannschaft'],
      ['Startblock', 'Rennen'],
      ['Skateboard', 'Rollen'],
      ['Medaille', 'Wettkampf']
    ],

    medien: [
      ['Kinokarte', 'Film'],
      ['Mikrofon', 'Ton'],
      ['Drehbuch', 'Geschichte'],
      ['Podcast', 'Audio'],
      ['Fernsehserie', 'Folgen'],
      ['Kamera', 'Bild'],
      ['Animationsfilm', 'Zeichnung'],
      ['Nachrichtensprecher', 'Studio'],
      ['Dokumentation', 'Wissen'],
      ['Streamingdienst', 'Internet']
    ]
  };

  const METADATA = {
    schemaVersion: 1,
    contentVersion: VERSION,
    reviewStatus: 'internal_family_friendly',
    ageGuidance: '6+',
    packCount: Object.keys(PACKS).length,
    entryCount: Object.values(PACKS).reduce((sum, entries) => sum + entries.length, 0),
    externalEditorialReview: false,
    notice: 'Intern redaktionell ausgewählte, familienfreundliche Begriffe; keine externe Alters- oder Inhaltsfreigabe.'
  };

  function validatePacks() {
    const ids = Object.keys(PACKS);
    if (ids.length < 5) throw Error('Zu wenige Wortpakete.');

    let total = 0;

    for (const id of ids) {
      if (!LABELS[id]) throw Error(`Bezeichnung fehlt: ${id}`);
      if (!ICONS[id]) throw Error(`Symbol fehlt: ${id}`);

      const entries = PACKS[id];
      if (!Array.isArray(entries) || entries.length < 6) throw Error(`Wortpaket zu klein: ${id}`);

      const seen = new Set();
      for (const entry of entries) {
        if (!Array.isArray(entry) || entry.length !== 2) throw Error(`Ungültiger Eintrag: ${id}`);

        const word = String(entry[0] || '').trim();
        const hint = String(entry[1] || '').trim();
        if (word.length < 2 || word.length > 60 || hint.length < 2 || hint.length > 60) {
          throw Error(`Ungültiger Begriff: ${id}`);
        }

        const key = word.toLocaleLowerCase('de-DE');
        if (seen.has(key)) throw Error(`Doppelter Begriff: ${word}`);
        seen.add(key);
        total++;
      }
    }

    if (total !== METADATA.entryCount) throw Error('Metadaten stimmen nicht mit den Wortpaketen überein.');
    return true;
  }

  function allEntries() {
    return Object.values(PACKS).flat();
  }

  validatePacks();

  return { VERSION, LABELS, ICONS, PACKS, METADATA, validatePacks, allEntries };
});
