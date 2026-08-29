(function (root, factory) {
  const base = typeof module === 'object' && module.exports
    ? require('./party-viral-catalog.js')
    : root.SecretCirclePartyCatalog;
  const api = factory(base);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCirclePartyCatalog = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createCoreReleaseCatalog(base) {
  'use strict';
  if (!base) throw new Error('Party-Katalog für Release-Inhalte fehlt.');

  const VERSION = 1;
  const additions = {
    'never-have': {
      Alltag: [
        'Ich habe noch nie meinen Kaffee oder Tee irgendwo stehen lassen und später kalt wiedergefunden.',
        'Ich habe noch nie etwas in den Kühlschrank gestellt, das dort eigentlich nicht hingehört.',
        'Ich habe noch nie einen Einkaufszettel geschrieben und ihn dann zu Hause vergessen.',
        'Ich habe noch nie denselben Raum zweimal aufgeräumt, weil ich beim ersten Mal abgelenkt war.',
        'Ich habe noch nie einen Gegenstand gesucht, der direkt vor mir lag.',
        'Ich habe noch nie einen freien Tag komplett anders verbracht als geplant.',
        'Ich habe noch nie einen Snack gegessen, obwohl ich eigentlich gerade gekocht habe.',
        'Ich habe noch nie eine Pflanze beinahe vergessen zu gießen.',
        'Ich habe noch nie eine Aufgabe auf später verschoben und sie dann überraschend schnell erledigt.',
        'Ich habe noch nie beim Aufräumen etwas wiedergefunden, das ich längst aufgegeben hatte.',
        'Ich habe noch nie ein Kleidungsstück zweimal hintereinander getragen, weil es bequem war.',
        'Ich habe noch nie eine Einkaufstasche zu voll gepackt.',
        'Ich habe noch nie einen Film angefangen und nach wenigen Minuten eingeschlafen.',
        'Ich habe noch nie beim Kochen zuerst die Anleitung gelesen, nachdem etwas schiefging.',
        'Ich habe noch nie einen Raum verlassen und direkt wieder zurückgemusst.',
        'Ich habe noch nie einen Wecker gestellt, obwohl ich am nächsten Tag gar nicht früh aufstehen musste.'
      ],
      Unterwegs: [
        'Ich habe noch nie an der falschen Haltestelle gewartet.',
        'Ich habe noch nie einen Sitzplatz gewählt und ihn kurz danach wieder gewechselt.',
        'Ich habe noch nie unterwegs festgestellt, dass ich etwas Wichtiges zu Hause vergessen habe.',
        'Ich habe noch nie einen Umweg genommen, weil ich einer falschen Abzweigung gefolgt bin.',
        'Ich habe noch nie einen besonders schweren Rucksack bereut.',
        'Ich habe noch nie auf einer Reise mehr Fotos gemacht als nötig.',
        'Ich habe noch nie im Zug oder Bus beinahe meine Station verpasst.',
        'Ich habe noch nie spontan einen anderen Weg genommen und dabei etwas Neues entdeckt.',
        'Ich habe noch nie länger auf ein Verkehrsmittel gewartet als die eigentliche Fahrt gedauert hat.',
        'Ich habe noch nie eine Jacke mitgenommen und sie den ganzen Tag nicht gebraucht.',
        'Ich habe noch nie unterwegs einen Snack gekauft, den ich vorher nicht geplant hatte.',
        'Ich habe noch nie eine Adresse mehrfach geprüft, obwohl ich schon richtig war.',
        'Ich habe noch nie mein Gepäck kurz aus den Augen verloren und sofort Panik bekommen.',
        'Ich habe noch nie an einem Aussichtspunkt länger geblieben als geplant.',
        'Ich habe noch nie auf Reisen etwas gekauft, nur weil es dort typisch war.',
        'Ich habe noch nie einen Tagesausflug erst am selben Morgen geplant.'
      ],
      Digital: [
        'Ich habe noch nie einen Tab geöffnet und später vergessen, warum.',
        'Ich habe noch nie eine Benachrichtigung weggewischt und danach gesucht, was darin stand.',
        'Ich habe noch nie eine App installiert und am selben Tag wieder gelöscht.',
        'Ich habe noch nie einen Link an mich selbst geschickt, um ihn nicht zu vergessen.',
        'Ich habe noch nie einen Entwurf gespeichert und ihn nie abgeschickt.',
        'Ich habe noch nie mein Handy entsperrt und sofort vergessen, was ich machen wollte.',
        'Ich habe noch nie einen Download gestartet und später vergessen, wo die Datei liegt.',
        'Ich habe noch nie eine Playlist erstellt und sie danach kaum benutzt.',
        'Ich habe noch nie ein Update länger aufgeschoben als nötig.',
        'Ich habe noch nie denselben Suchbegriff mehrmals hintereinander eingegeben.',
        'Ich habe noch nie einen Screenshot nur als Erinnerung gemacht.',
        'Ich habe noch nie einen Gruppenchat stummgeschaltet.',
        'Ich habe noch nie ein Video bis zum Ende angesehen, obwohl ich eigentlich nur kurz schauen wollte.',
        'Ich habe noch nie meine Bildschirmzeit gesehen und mich über die Zahl gewundert.',
        'Ich habe noch nie eine Datei umbenannt, damit ich sie später wiederfinde.',
        'Ich habe noch nie mehrere Apps geöffnet, um dieselbe Information zu vergleichen.'
      ],
      Peinlich: [
        'Ich habe noch nie gegen eine Glasscheibe gedrückt, obwohl daneben eine Tür war.',
        'Ich habe noch nie beim Verabschieden gleichzeitig in dieselbe Richtung wie die andere Person ausgewichen.',
        'Ich habe noch nie zu früh gelacht, weil ich dachte, die Geschichte sei schon vorbei.',
        'Ich habe noch nie jemanden begrüßt und erst danach gemerkt, dass ich die Person verwechselt habe.',
        'Ich habe noch nie beim Reden ein Wort komplett falsch ausgesprochen.',
        'Ich habe noch nie einen Raum betreten, obwohl dort offensichtlich eine andere Veranstaltung lief.',
        'Ich habe noch nie eine automatische Tür erwartet, die gar nicht automatisch war.',
        'Ich habe noch nie einen Kopfhörer getragen und trotzdem laut gesprochen.',
        'Ich habe noch nie eine Frage beantwortet, die gar nicht an mich gerichtet war.',
        'Ich habe noch nie meinen eigenen Namen in einem Formular falsch geschrieben.',
        'Ich habe noch nie etwas fallen lassen und so getan, als hätte es niemand gesehen.',
        'Ich habe noch nie einen Witz erklärt und ihn dadurch noch schlechter gemacht.',
        'Ich habe noch nie eine Nachricht zu schnell gelesen und völlig falsch verstanden.',
        'Ich habe noch nie an einer Kasse in der falschen Schlange gestanden.',
        'Ich habe noch nie versucht, eine Tür mit dem falschen Schlüssel zu öffnen.',
        'Ich habe noch nie mitten im Satz vergessen, was ich eigentlich sagen wollte.'
      ]
    },
    'most-likely': {
      Freundschaft: [
        'Wer würde eher spontan einen gemeinsamen Abend retten, wenn der Plan ausfällt?',
        'Wer würde eher merken, dass jemand in der Gruppe stiller als sonst ist?',
        'Wer würde eher eine lange Freundschaft über große Entfernung halten?',
        'Wer würde eher eine verlorene Sache für jemand anderen suchen helfen?',
        'Wer würde eher einen schwierigen Tag mit einem guten Gespräch verbessern?',
        'Wer würde eher einen Gruppentermin finden, der wirklich für alle passt?',
        'Wer würde eher ein persönliches Geschenk selbst machen?',
        'Wer würde eher nach Monaten noch wissen, was jemand nebenbei erzählt hat?',
        'Wer würde eher einen neuen Menschen sofort willkommen heißen?',
        'Wer würde eher bei einem Umzug freiwillig helfen?',
        'Wer würde eher einen Konflikt ruhig ansprechen statt ihn zu ignorieren?',
        'Wer würde eher eine Tradition für die Freundesgruppe erfinden?',
        'Wer würde eher ein gemeinsames Fotoalbum organisieren?',
        'Wer würde eher jemanden zum Lachen bringen, wenn die Stimmung schlecht ist?',
        'Wer würde eher eine lange Sprachnachricht wirklich komplett anhören?',
        'Wer würde eher ein Versprechen auch nach langer Zeit noch einhalten?'
      ],
      Lustig: [
        'Wer würde eher aus Versehen mit zwei verschiedenen Socken das Haus verlassen?',
        'Wer würde eher eine völlig normale Situation unnötig dramatisch erzählen?',
        'Wer würde eher einem Haushaltsgerät einen Namen geben?',
        'Wer würde eher einen Insiderwitz jahrelang weiterverwenden?',
        'Wer würde eher beim Kochen ein eigenes Rezept erfinden und es sofort feiern?',
        'Wer würde eher bei einem Brettspiel die Regeln zu ernst nehmen?',
        'Wer würde eher im Supermarkt etwas kaufen, nur weil die Verpackung lustig ist?',
        'Wer würde eher eine peinliche Situation in eine gute Geschichte verwandeln?',
        'Wer würde eher einen Satz falsch verstehen und daraus einen neuen Witz machen?',
        'Wer würde eher mit vollem Einsatz Luftgitarre spielen?',
        'Wer würde eher einen spontanen Wettbewerb aus einer Alltagssache machen?',
        'Wer würde eher ein Tier auf der Straße zuerst begrüßen?',
        'Wer würde eher einen völlig unnötigen Gegenstand sehr überzeugend empfehlen?',
        'Wer würde eher beim Fotografieren aus Versehen die Frontkamera öffnen?',
        'Wer würde eher einen lustigen Gruppennamen erfinden?',
        'Wer würde eher in einer stillen Situation ausgerechnet anfangen zu lachen?'
      ],
      Zukunft: [
        'Wer würde eher irgendwann für ein Jahr im Ausland leben?',
        'Wer würde eher ein neues Berufsfeld komplett von vorne lernen?',
        'Wer würde eher ein eigenes kreatives Projekt veröffentlichen?',
        'Wer würde eher später in einem sehr ungewöhnlichen Haus wohnen?',
        'Wer würde eher eine Idee in ein echtes Produkt verwandeln?',
        'Wer würde eher in Zukunft mehrere Sprachen sprechen?',
        'Wer würde eher einmal eine längere Reise ohne festen Plan machen?',
        'Wer würde eher ein Hobby zum Nebenberuf machen?',
        'Wer würde eher eine Weiterbildung nur aus Neugier beginnen?',
        'Wer würde eher irgendwann einen Vortrag vor sehr vielen Menschen halten?',
        'Wer würde eher früh neue Technik ausprobieren?',
        'Wer würde eher einen Verein oder eine Community gründen?',
        'Wer würde eher in zehn Jahren noch denselben Lieblingssong hören?',
        'Wer würde eher eine neue Sportart ernsthaft lernen?',
        'Wer würde eher eine große persönliche Herausforderung durchziehen?',
        'Wer würde eher später einmal andere Menschen ausbilden oder unterrichten?'
      ],
      Chaos: [
        'Wer würde eher bei einer Schatzsuche aus Versehen den besten Hinweis übersehen?',
        'Wer würde eher in einer Fantasiewelt sofort eine eigene Regel erfinden?',
        'Wer würde eher bei einem Stromausfall spontan ein Spiel organisieren?',
        'Wer würde eher bei einer Raumfahrtmission für die Snacks verantwortlich sein?',
        'Wer würde eher einen geheimen Tunnel entdecken und sofort hineingehen?',
        'Wer würde eher in einer verrückten Gameshow freiwillig die erste Aufgabe übernehmen?',
        'Wer würde eher einen Tag lang nur in Reimen sprechen?',
        'Wer würde eher einen völlig absurden Plan trotzdem ausprobieren?',
        'Wer würde eher in einer fremden Stadt ohne Karte den richtigen Weg finden?',
        'Wer würde eher ein Baumhaus zum Hauptquartier erklären?',
        'Wer würde eher bei einer Alien-Begegnung zuerst eine Frage stellen?',
        'Wer würde eher eine spontane Expedition in den Keller starten?',
        'Wer würde eher eine eigene Flagge für die Gruppe entwerfen?',
        'Wer würde eher in einem Escape Room den seltsamsten Lösungsweg finden?',
        'Wer würde eher ein altes Gerät auseinanderbauen, nur um zu sehen, wie es funktioniert?',
        'Wer würde eher aus fünf zufälligen Gegenständen ein Spiel erfinden?'
      ]
    },
    'would-rather': {
      Alltag: [
        ['Immer sofort einen freien Sitzplatz finden', 'Immer sofort einen freien Parkplatz finden'],
        ['Nie mehr Wäsche falten', 'Nie mehr Geschirr spülen'],
        ['Jeden Morgen eine Stunde mehr Zeit haben', 'Jeden Abend eine Stunde mehr Zeit haben'],
        ['Immer genau wissen, wo deine Schlüssel sind', 'Immer genau wissen, wie voll dein Akku ist'],
        ['Nur noch Treppen benutzen', 'Nur noch Aufzüge benutzen'],
        ['Immer selbst kochen', 'Immer jemand anderen für dich kochen lassen'],
        ['Eine sehr kurze Mittagspause', 'Einen sehr frühen Feierabend'],
        ['Immer ein perfekt aufgeräumtes Zimmer', 'Immer einen perfekt organisierten Kalender'],
        ['Nie mehr auf Pakete warten', 'Nie mehr auf öffentliche Verkehrsmittel warten'],
        ['Immer das richtige Wetter für deine Pläne', 'Immer die richtige Kleidung für das Wetter'],
        ['Nur noch mit Listen planen', 'Nur noch spontan entscheiden'],
        ['Immer einen Platz am Fenster', 'Immer einen Platz am Gang'],
        ['Jede Woche etwas Neues kochen', 'Jede Woche einen neuen Ort besuchen'],
        ['Nie mehr Werbung sehen', 'Nie mehr Warteschleifen hören'],
        ['Immer fünf Minuten früher fertig sein', 'Immer fünf Minuten länger schlafen können'],
        ['Einen Tag komplett ohne Termine', 'Einen Tag mit perfekt geplanten Terminen']
      ],
      Extrem: [
        ['Eine Woche nur zu Fuß unterwegs sein', 'Eine Woche nur mit dem Fahrrad unterwegs sein'],
        ['Eine Nacht in der Wüste', 'Eine Nacht im Eis verbringen'],
        ['Einen Monat ohne Aufzug', 'Einen Monat ohne Auto oder Taxi'],
        ['Auf einen sehr hohen Berg steigen', 'In eine sehr tiefe Höhle steigen'],
        ['Einen Tag lang nur flüstern', 'Einen Tag lang nur sehr langsam sprechen'],
        ['Eine Woche jeden Morgen um vier Uhr aufstehen', 'Eine Woche jeden Abend bis zwei Uhr wach bleiben'],
        ['Einen langen Weg ohne Karte finden', 'Eine schwierige Aufgabe ohne Anleitung lösen'],
        ['Einen Monat auf einer kleinen Insel', 'Einen Monat in einer Berghütte leben'],
        ['Eine Stunde schwerelos sein', 'Eine Stunde unter Wasser atmen können'],
        ['Einen Tag ohne Uhr', 'Einen Tag ohne Spiegel verbringen'],
        ['Eine Woche nur kaltes Essen', 'Eine Woche nur lauwarme Getränke'],
        ['Eine sehr lange Zugreise', 'Eine sehr lange Schiffsreise'],
        ['Einen Tag lang jede Frage beantworten müssen', 'Einen Tag lang keine Frage stellen dürfen'],
        ['Ein Jahr jeden Tag dieselbe Strecke gehen', 'Ein Jahr jeden Tag eine andere Strecke suchen'],
        ['Bei starkem Regen wandern', 'Bei starkem Wind Fahrrad fahren'],
        ['Eine Woche komplett allein planen', 'Eine Woche jede Entscheidung mit der Gruppe treffen']
      ],
      Essen: [
        ['Frühstück zum Abendessen', 'Abendessen zum Frühstück'],
        ['Nur noch knuspriges Essen', 'Nur noch weiches Essen'],
        ['Jeden Tag Suppe', 'Jeden Tag Sandwiches'],
        ['Eine Woche ohne Salz', 'Eine Woche ohne Zucker'],
        ['Immer sehr kleine Portionen mit vielen Gängen', 'Immer eine große Portion mit einem Gericht'],
        ['Nur noch selbst gebackenes Brot', 'Nur noch selbst gemachte Pasta'],
        ['Nie wieder Ketchup', 'Nie wieder Mayonnaise'],
        ['Jeden Monat ein neues Restaurant', 'Jeden Monat ein neues Rezept zu Hause'],
        ['Nur noch Wasser zum Essen', 'Nur noch Tee zum Essen'],
        ['Immer Vorspeise', 'Immer Dessert'],
        ['Süßes Popcorn', 'Salziges Popcorn'],
        ['Kartoffeln für immer', 'Reis für immer'],
        ['Nur noch regionale Gerichte', 'Nur noch internationale Gerichte'],
        ['Ein perfektes Lieblingsgericht einmal pro Woche', 'Jeden Tag ein überraschendes Gericht'],
        ['Obst direkt aus dem Kühlschrank', 'Obst bei Zimmertemperatur'],
        ['Immer gemeinsam kochen', 'Immer gemeinsam bestellen']
      ],
      Fantasie: [
        ['Durch Wände gehen', 'Auf Wasser laufen'],
        ['Ein fliegendes Fahrrad', 'Ein selbstfahrendes Sofa besitzen'],
        ['Mit Pflanzen sprechen', 'Mit Maschinen sprechen'],
        ['Eine Tür zu jedem Ort öffnen können', 'Eine Karte zu jedem geheimen Ort besitzen'],
        ['Ein Haus unter Wasser', 'Ein Haus in den Baumwipfeln'],
        ['Eine Woche in der Zukunft', 'Eine Woche in einer Fantasiewelt verbringen'],
        ['Jeden Morgen eine neue Superkraft', 'Eine Superkraft für immer behalten'],
        ['Einen Mini-Drachen', 'Einen Mini-Roboter als Begleiter'],
        ['Unsichtbare Treppen sehen können', 'Geheime Türen erkennen können'],
        ['Eine Bibliothek mit allen Büchern', 'Ein Kino mit allen Filmen besitzen'],
        ['Mit einem Raumschiff zum Mond', 'Mit einem U-Boot in die Tiefsee reisen'],
        ['Ein magischer Rucksack mit unendlich Platz', 'Eine Jacke mit perfekter Temperatur'],
        ['Einmal pro Tag teleportieren', 'Einmal pro Tag die Zeit zehn Minuten anhalten'],
        ['In Träumen bewusst reisen', 'Erinnerungen wie Fotos öffnen können'],
        ['Ein persönlicher kleiner Wetterzauber', 'Ein persönlicher kleiner Lichtzauber'],
        ['Eine Stadt in den Wolken besuchen', 'Eine Stadt tief unter der Erde besuchen']
      ]
    },
    paranoia: {
      Locker: [
        'Wer würde wahrscheinlich am besten einen spontanen Spieleabend organisieren?',
        'Wer hat vermutlich die geduldigste Art, etwas zu erklären?',
        'Wer würde am ehesten einen neuen Ort in der Stadt entdecken?',
        'Wer könnte wahrscheinlich am besten ein kleines Team koordinieren?',
        'Wer würde am ehesten eine Woche lang früh aufstehen durchziehen?',
        'Wer findet wahrscheinlich am schnellsten einen verlorenen Gegenstand?',
        'Wer würde am ehesten ein gutes Rezept ohne Anleitung hinbekommen?',
        'Wer könnte wahrscheinlich am längsten ohne Social Media auskommen?',
        'Wer würde am ehesten eine neue Person zuerst ansprechen?',
        'Wer könnte wahrscheinlich am besten einen langen Reisetag planen?',
        'Wer würde am ehesten ein neues Brettspiel schnell verstehen?',
        'Wer könnte wahrscheinlich am besten einen ruhigen Sonntag genießen?'
      ],
      Lustig: [
        'Wer würde am ehesten einem Staubsauger eine Persönlichkeit geben?',
        'Wer könnte wahrscheinlich einen völlig erfundenen Beruf überzeugend erklären?',
        'Wer würde am ehesten aus Versehen einen Insiderwitz vor Fremden benutzen?',
        'Wer könnte wahrscheinlich eine Minute lang ernst bleiben, während alle anderen lachen?',
        'Wer würde am ehesten einen Snack nur wegen seines Namens kaufen?',
        'Wer könnte wahrscheinlich eine schlechte Filmhandlung besonders spannend erzählen?',
        'Wer würde am ehesten eine spontane Tanzbewegung nach sich selbst benennen?',
        'Wer könnte wahrscheinlich ein Tiergeräusch so gut machen, dass alle es erkennen?',
        'Wer würde am ehesten einen völlig normalen Spaziergang zur Expedition erklären?',
        'Wer könnte wahrscheinlich eine Werbekampagne für einen Stein erfinden?',
        'Wer würde am ehesten bei einem Foto genau im falschen Moment blinzeln?',
        'Wer könnte wahrscheinlich eine Minute über ein leeres Glas improvisieren?'
      ],
      Tiefer: [
        'Wem würdest du zutrauen, in einer stressigen Situation zuerst einen klaren Kopf zu bekommen?',
        'Wer würde wahrscheinlich eine schwierige Meinung respektvoll anhören?',
        'Wen würdest du bei einer wichtigen Entscheidung gern um eine zweite Perspektive bitten?',
        'Wer könnte wahrscheinlich am besten ein ehrliches, aber freundliches Feedback geben?',
        'Wer würde am ehesten merken, wenn jemand eine Pause braucht?',
        'Wem würdest du zutrauen, auch bei Gruppendruck bei der eigenen Meinung zu bleiben?',
        'Wer würde wahrscheinlich am zuverlässigsten Verantwortung für einen Fehler übernehmen?',
        'Von wem würdest du am ehesten einen wirklich durchdachten Rat erwarten?',
        'Wer könnte wahrscheinlich gut zwischen zwei unterschiedlichen Positionen vermitteln?',
        'Wer würde am ehesten jemand anderem Raum geben, ohne sofort nachzufragen?',
        'Wem würdest du zutrauen, ein langfristiges Ziel geduldig zu verfolgen?',
        'Wer würde wahrscheinlich am ehesten eine faire Lösung suchen, wenn mehrere Interessen kollidieren?'
      ]
    },
    'wrong-answers': {
      Alltag: [
        'Warum hat eine Wohnung Fenster?', 'Wofür braucht man einen Tisch?', 'Warum klingelt eine Haustür?', 'Was macht man mit einem Handtuch?',
        'Wozu dient eine Lampe?', 'Warum hat ein Kühlschrank eine Tür?', 'Wofür braucht man einen Kalender?', 'Was macht man mit einem Einkaufswagen?',
        'Warum hat ein Rucksack Träger?', 'Wozu dient ein Sofa?', 'Was macht man mit einer Fernbedienung?', 'Warum gibt es Mülleimer?',
        'Wofür braucht man einen Spiegel?', 'Warum hat eine Treppe Stufen?', 'Was macht man mit einem Kissen?', 'Wozu dient ein Briefkasten?'
      ],
      Schule: [
        'Warum gibt es Tafeln oder Whiteboards?', 'Wofür braucht man einen Taschenrechner?', 'Was macht man in einer Bibliothek?', 'Warum hat ein Heft Seiten?',
        'Wozu dient ein Radiergummi?', 'Warum gibt es Gruppenarbeiten?', 'Was macht man mit einem Textmarker?', 'Wofür braucht man einen Ordner?',
        'Warum gibt es Stundenpläne?', 'Was macht man in einer Sporthalle?', 'Wozu dient ein Bleistift?', 'Warum gibt es Klassenräume?',
        'Was macht man mit einem Taschenrechner?', 'Wofür braucht man Notizen?', 'Warum gibt es Hausaufgaben?', 'Was macht man bei einer Präsentation?'
      ],
      Seltsam: [
        'Warum besitzt ein Vulkan keinen Wasserhahn?', 'Was macht ein Pinguin in einer Bäckerei?', 'Warum braucht ein Roboter keinen Regenschirm?', 'Was bestellt ein Drache beim Friseur?',
        'Warum steht ein U-Boot nicht im Parkhaus?', 'Was macht eine Wolke im Wartezimmer?', 'Warum trägt ein Kaktus keine Handschuhe?', 'Was sucht ein Geist in einer Bibliothek?',
        'Warum hat ein Raumschiff keinen Fahrradständer?', 'Was macht ein Dinosaurier im Copyshop?', 'Warum braucht der Mond keine Sonnenbrille?', 'Was kauft ein Alien im Baumarkt?',
        'Warum fährt ein Zauberer keinen Linienbus?', 'Was macht ein Schneemann im Fitnessstudio?', 'Warum hat eine Meerjungfrau keinen Regenschirm?', 'Was bestellt ein Roboter in einer Eisdiele?'
      ]
    }
  };

  function mergeContent(baseContent, extraContent) {
    const content = { ...baseContent };
    for (const [gameId, packs] of Object.entries(extraContent)) {
      const current = content[gameId];
      if (!current || typeof current !== 'object' || Array.isArray(current)) {
        throw new Error(`Release-Content kann Spiel nicht erweitern: ${gameId}`);
      }
      const merged = { ...current };
      for (const [packName, extraItems] of Object.entries(packs)) {
        if (!Array.isArray(current[packName]) || !Array.isArray(extraItems)) {
          throw new Error(`Release-Content erwartet Array-Pack: ${gameId}/${packName}`);
        }
        merged[packName] = [...current[packName], ...extraItems];
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
    coreReleaseContentVersion: VERSION,
    coreReleaseContentGames: Object.freeze(Object.keys(additions))
  });
});