(function (root, factory) {
  const base = typeof module === 'object' && module.exports
    ? require('./party-core-classic-content.js')
    : root.SecretCirclePartyCatalog;
  const api = factory(base);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCirclePartyCatalog = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createWaveOneCatalog(base) {
  'use strict';
  if (!base) throw new Error('Classic-Content-Katalog für Expansion Wave 1 fehlt.');

  const quickHref = id => `quick-play.html?game=${encodeURIComponent(id)}`;
  const gamesAdded = [
    Object.freeze({
      id: 'party-quiz', title: 'Party Quiz', icon: '🧠', group: 'Quiz & Wissen', status: 'playable', mode: 'link',
      href: quickHref('party-quiz'), minPlayers: 2, maxPlayers: 20, duration: 15,
      moods: ['clever', 'competitive', 'friendly'], age: 'all', featured: false,
      description: 'Schnelles Multiple-Choice-Quiz für Gruppen. Eine Antwort wählen, direkt auflösen und Punkte sammeln.',
      instructions: ['Kategorie und Rundenzahl wählen.', 'Frage und vier Antworten gemeinsam lesen.', 'Eine Antwort festlegen.', 'Auflösen, kurz erklären und zur nächsten Runde gehen.'],
      packs: ['Allgemeinwissen', 'Film & Serie', 'Technik']
    }),
    Object.freeze({
      id: 'fact-or-fake', title: 'Fake oder Fakt', icon: '✅', group: 'Quiz & Wissen', status: 'playable', mode: 'link',
      href: quickHref('fact-or-fake'), minPlayers: 2, maxPlayers: 20, duration: 10,
      moods: ['clever', 'friendly'], age: 'all', featured: false,
      description: 'Eine Aussage erscheint. Die Gruppe entscheidet gleichzeitig: stimmt sie oder ist sie erfunden?',
      instructions: ['Kategorie wählen.', 'Aussage ohne lange Diskussion lesen.', 'Gemeinsam oder per Handzeichen Fake/Fakt festlegen.', 'Antwort und kurze Erklärung aufdecken.'],
      packs: ['Natur', 'Film & Serie', 'Technik']
    })
  ];

  const contentAdded = Object.freeze({
    'party-quiz': Object.freeze({
      Allgemeinwissen: Object.freeze([
        Object.freeze({ question: 'Wie viele Kontinente werden im in Deutschland üblichen Schulmodell meistens gezählt?', options: ['5', '6', '7', '8'], answer: 2, explanation: 'Im verbreiteten Sieben-Kontinente-Modell sind es sieben.' }),
        Object.freeze({ question: 'Welcher Planet ist der Sonne am nächsten?', options: ['Venus', 'Merkur', 'Mars', 'Erde'], answer: 1, explanation: 'Merkur ist der innerste Planet unseres Sonnensystems.' }),
        Object.freeze({ question: 'Wie viele Minuten hat eine Stunde?', options: ['50', '60', '70', '100'], answer: 1, explanation: 'Eine Stunde besteht aus 60 Minuten.' }),
        Object.freeze({ question: 'Welches Tier ist ein Säugetier?', options: ['Hai', 'Delfin', 'Forelle', 'Krake'], answer: 1, explanation: 'Delfine sind Meeressäuger und atmen Luft.' }),
        Object.freeze({ question: 'Welche Farbe entsteht beim Mischen von Blau und Gelb im klassischen Farbmodell?', options: ['Orange', 'Violett', 'Grün', 'Rot'], answer: 2, explanation: 'Blau und Gelb ergeben im klassischen subtraktiven Mischmodell Grün.' }),
        Object.freeze({ question: 'Wie viele Seiten hat ein Würfel?', options: ['4', '6', '8', '12'], answer: 1, explanation: 'Ein gewöhnlicher Würfel besitzt sechs Flächen.' }),
        Object.freeze({ question: 'Welches Organ pumpt Blut durch den menschlichen Körper?', options: ['Lunge', 'Leber', 'Herz', 'Magen'], answer: 2, explanation: 'Das Herz erzeugt den Blutkreislauf durch seine Pumpfunktion.' }),
        Object.freeze({ question: 'Welche Einheit wird für elektrische Spannung verwendet?', options: ['Volt', 'Watt', 'Ohm', 'Ampere'], answer: 0, explanation: 'Elektrische Spannung wird in Volt angegeben.' })
      ]),
      'Film & Serie': Object.freeze([
        Object.freeze({ question: 'Was bezeichnet ein Cliffhanger?', options: ['Ein offenes spannendes Ende', 'Eine Kamerafahrt', 'Eine Filmpause', 'Eine Kostümprobe'], answer: 0, explanation: 'Ein Cliffhanger endet an einem spannenden offenen Punkt und soll zum Weiterschauen motivieren.' }),
        Object.freeze({ question: 'Wer ist hauptsächlich für die kreative Leitung der Dreharbeiten verantwortlich?', options: ['Regie', 'Catering', 'Maskenbild', 'Kinokasse'], answer: 0, explanation: 'Die Regie führt die kreative Arbeit am Set zusammen.' }),
        Object.freeze({ question: 'Was ist eine Miniserie?', options: ['Eine Serie mit begrenzter Episodenanzahl', 'Eine Serie nur für Smartphones', 'Ein Film unter 20 Minuten', 'Eine Serie ohne Dialog'], answer: 0, explanation: 'Eine Miniserie erzählt typischerweise eine begrenzte Geschichte in wenigen Episoden.' }),
        Object.freeze({ question: 'Was bedeutet „Pilotfolge“?', options: ['Erste Test-/Einführungsfolge', 'Letzte Folge', 'Folge ohne Schauspieler', 'Werbepause'], answer: 0, explanation: 'Eine Pilotfolge stellt Konzept, Figuren und Ton einer möglichen Serie vor.' }),
        Object.freeze({ question: 'Welcher Begriff beschreibt Musik, die speziell für einen Film komponiert wurde?', options: ['Score', 'Trailer', 'Casting', 'Storyboard'], answer: 0, explanation: 'Der Score ist die für einen Film oder eine Serie komponierte Begleitmusik.' }),
        Object.freeze({ question: 'Was ist ein Storyboard?', options: ['Gezeichnete Planung von Einstellungen', 'Liste der Kinopreise', 'Vertrag der Darsteller', 'Mikrofonplan'], answer: 0, explanation: 'Storyboards visualisieren geplante Einstellungen vor dem Dreh.' }),
        Object.freeze({ question: 'Was beschreibt ein Genre?', options: ['Eine inhaltliche/stilistische Kategorie', 'Die Filmlänge', 'Die Lautstärke', 'Das Aufnahmeformat'], answer: 0, explanation: 'Genres ordnen Werke nach typischen Themen, Formen und Erwartungen.' }),
        Object.freeze({ question: 'Was ist ein Spin-off?', options: ['Eigenständiges Werk aus einer bestehenden Welt', 'Ein Film ohne Ende', 'Eine Untertitelart', 'Ein Kamerafehler'], answer: 0, explanation: 'Ein Spin-off entwickelt Figuren, Orte oder Ideen aus einem bestehenden Werk weiter.' })
      ]),
      Technik: Object.freeze([
        Object.freeze({ question: 'Wie viele Bits enthält ein Byte?', options: ['4', '8', '16', '32'], answer: 1, explanation: 'Ein Byte besteht standardmäßig aus acht Bits.' }),
        Object.freeze({ question: 'Wofür steht WLAN im Alltag?', options: ['Drahtlose Netzwerkverbindung', 'Bildschirmauflösung', 'Akkutyp', 'Dateiformat'], answer: 0, explanation: 'WLAN bezeichnet ein drahtloses lokales Netzwerk.' }),
        Object.freeze({ question: 'Welche Komponente speichert Daten typischerweise dauerhaft?', options: ['SSD', 'RAM', 'CPU-Cache', 'Register'], answer: 0, explanation: 'Eine SSD ist nichtflüchtiger Massenspeicher.' }),
        Object.freeze({ question: 'Was macht ein Browser?', options: ['Webinhalte darstellen', 'Strom messen', 'Dateien löten', 'Lautsprecher verstärken'], answer: 0, explanation: 'Ein Browser lädt und stellt Webinhalte dar.' }),
        Object.freeze({ question: 'Welche Einheit beschreibt elektrische Stromstärke?', options: ['Ampere', 'Volt', 'Ohm', 'Joule'], answer: 0, explanation: 'Stromstärke wird in Ampere angegeben.' }),
        Object.freeze({ question: 'Was ist ein QR-Code?', options: ['Zweidimensionaler maschinenlesbarer Code', 'Audioformat', 'Akkustecker', 'Programmiersprache'], answer: 0, explanation: 'QR-Codes speichern maschinenlesbare Informationen in einem zweidimensionalen Muster.' }),
        Object.freeze({ question: 'Was bedeutet „offline“ bei einer App?', options: ['Kernfunktionen funktionieren ohne aktive Netzverbindung', 'Die App hat keinen Bildschirm', 'Die App löscht alle Daten', 'Die App läuft nur nachts'], answer: 0, explanation: 'Offline-Fähigkeit bedeutet, dass vorgesehene Funktionen ohne aktive Internetverbindung nutzbar bleiben.' }),
        Object.freeze({ question: 'Welches Bauteil führt die meisten allgemeinen Rechenoperationen eines Computers aus?', options: ['CPU', 'Tastatur', 'Monitor', 'Lautsprecher'], answer: 0, explanation: 'Die CPU verarbeitet Programmbefehle und Rechenoperationen.' })
      ])
    }),
    'fact-or-fake': Object.freeze({
      Natur: Object.freeze([
        Object.freeze({ statement: 'Oktopusse besitzen drei Herzen.', fact: true, explanation: 'Oktopusse haben drei Herzen: zwei für die Kiemen und eines für den Körperkreislauf.' }),
        Object.freeze({ statement: 'Spinnen haben normalerweise sechs Beine.', fact: false, explanation: 'Spinnen besitzen normalerweise acht Beine.' }),
        Object.freeze({ statement: 'Delfine müssen zum Atmen an die Wasseroberfläche.', fact: true, explanation: 'Delfine sind Säugetiere und atmen Luft über ein Blasloch.' }),
        Object.freeze({ statement: 'Pinguine leben ausschließlich am Nordpol.', fact: false, explanation: 'Pinguine kommen natürlich auf der Südhalbkugel vor, besonders rund um die Antarktis.' }),
        Object.freeze({ statement: 'Bienen besitzen zwei Flügelpaare.', fact: true, explanation: 'Bienen haben vier Flügel: je zwei Vorder- und Hinterflügel.' }),
        Object.freeze({ statement: 'Ein ausgewachsener Frosch atmet nur über die Lunge.', fact: false, explanation: 'Viele Frösche können zusätzlich über ihre feuchte Haut Gase austauschen.' }),
        Object.freeze({ statement: 'Die Erde benötigt ungefähr ein Jahr für einen Umlauf um die Sonne.', fact: true, explanation: 'Ein Erdumlauf dauert ungefähr 365,25 Tage.' }),
        Object.freeze({ statement: 'Der Mond erzeugt sein sichtbares Licht selbst.', fact: false, explanation: 'Der Mond reflektiert hauptsächlich Sonnenlicht.' })
      ]),
      'Film & Serie': Object.freeze([
        Object.freeze({ statement: 'Ein Storyboard kann Dreheinstellungen vorab als Bildfolge planen.', fact: true, explanation: 'Storyboards visualisieren geplante Einstellungen und Abläufe.' }),
        Object.freeze({ statement: 'Eine Pilotfolge ist immer die letzte Folge einer Serie.', fact: false, explanation: 'Eine Pilotfolge ist typischerweise eine frühe Test- oder Einführungsfolge.' }),
        Object.freeze({ statement: 'Ein Spin-off kann Figuren aus einem bestehenden Werk in den Mittelpunkt stellen.', fact: true, explanation: 'Spin-offs entwickeln Elemente einer bestehenden Welt eigenständig weiter.' }),
        Object.freeze({ statement: 'Ein Cliffhanger löst grundsätzlich alle offenen Fragen einer Geschichte auf.', fact: false, explanation: 'Ein Cliffhanger lässt bewusst eine spannende Situation offen.' }),
        Object.freeze({ statement: 'Der Begriff „Genre“ kann Filme nach typischen Themen und Stilmerkmalen einordnen.', fact: true, explanation: 'Genres bündeln wiederkehrende Erzähl- und Stilmerkmale.' }),
        Object.freeze({ statement: 'Untertitel und Synchronisation sind exakt dasselbe Verfahren.', fact: false, explanation: 'Untertitel zeigen Text; Synchronisation ersetzt bzw. ergänzt gesprochene Tonspuren.' }),
        Object.freeze({ statement: 'Ein Film-Score kann eigens für ein Werk komponiert werden.', fact: true, explanation: 'Scores werden häufig speziell für Film oder Serie komponiert.' }),
        Object.freeze({ statement: 'Eine Miniserie muss mindestens zehn Staffeln besitzen.', fact: false, explanation: 'Miniserien sind gerade durch eine begrenzte, meist kurze Laufzeit gekennzeichnet.' })
      ]),
      Technik: Object.freeze([
        Object.freeze({ statement: 'Ein Byte besteht üblicherweise aus acht Bits.', fact: true, explanation: 'Acht Bits bilden standardmäßig ein Byte.' }),
        Object.freeze({ statement: 'RAM ist typischerweise ein dauerhafter Speicher, der ohne Strom alle Daten behält.', fact: false, explanation: 'Arbeitsspeicher ist normalerweise flüchtig und verliert Inhalte ohne Strom.' }),
        Object.freeze({ statement: 'HTTPS verschlüsselt die Verbindung zwischen Browser und Webserver.', fact: true, explanation: 'HTTPS verwendet TLS zum Schutz der übertragenen Verbindung.' }),
        Object.freeze({ statement: 'Ein QR-Code kann nur genau eine Ziffer speichern.', fact: false, explanation: 'QR-Codes können deutlich mehr Informationen als eine einzelne Ziffer enthalten.' }),
        Object.freeze({ statement: 'Eine SSD enthält keine beweglichen Magnetscheiben.', fact: true, explanation: 'SSDs speichern Daten elektronisch in Flash-Speicher.' }),
        Object.freeze({ statement: 'Volt ist die Einheit der elektrischen Stromstärke.', fact: false, explanation: 'Volt ist die Einheit der Spannung; Stromstärke wird in Ampere gemessen.' }),
        Object.freeze({ statement: 'Ein Browser kann lokale Daten im Browser-Speicher ablegen.', fact: true, explanation: 'Webanwendungen können je nach Technik lokale Speicher wie localStorage verwenden.' }),
        Object.freeze({ statement: 'Offline-fähige PWAs benötigen für jede einzelne Aktion zwingend eine aktive Internetverbindung.', fact: false, explanation: 'Geeignet gebaute PWAs können vorgesehene Inhalte und Funktionen lokal verfügbar halten.' })
      ])
    })
  });

  const games = Object.freeze([...base.games, ...gamesAdded]);
  const content = Object.freeze({ ...base.content, ...contentAdded });
  const waveOneGameIds = Object.freeze(gamesAdded.map(game => game.id));

  function getGame(id) { return games.find(game => game.id === id) || null; }
  function getPackNames(id) { return content[id] && typeof content[id] === 'object' ? Object.keys(content[id]) : []; }
  function getItems(id, pack) {
    const gameContent = content[id];
    if (!gameContent || typeof gameContent !== 'object') return [];
    if (pack && Array.isArray(gameContent[pack])) return gameContent[pack];
    return Object.values(gameContent).flatMap(value => Array.isArray(value) ? value : []);
  }
  function itemCount(id) { return getItems(id).length; }

  return Object.freeze({
    ...base,
    version: 1,
    games,
    content,
    getGame,
    getPackNames,
    getItems,
    itemCount,
    waveOneGameIds
  });
});
