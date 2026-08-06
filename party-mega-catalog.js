(function (root, factory) {
  const base = typeof module === 'object' && module.exports
    ? require('./party-trending-catalog.js')
    : root.SecretCirclePartyCatalog;
  const api = factory(base);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCirclePartyCatalog = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (base) {
  'use strict';
  if (!base) throw new Error('Trend-Katalog für die Mega-Erweiterung fehlt.');

  const quickHref = id => `quick-play.html?game=${encodeURIComponent(id)}`;
  const newGames = [
    {
      id: 'who-am-i', title: 'Wer bin ich?', icon: '❓', group: 'Raten', status: 'playable', mode: 'link',
      href: quickHref('who-am-i'), minPlayers: 2, maxPlayers: 20, duration: 15,
      moods: ['funny', 'clever'], age: 'all', featured: true,
      description: 'Die Gruppe kennt deine geheime Identität. Du stellst nur Ja-Nein-Fragen, bis du herausfindest, wer oder was du bist.',
      instructions: ['Kategorie und Rundenzahl wählen.', 'Identität nur der Gruppe zeigen.', 'Bildschirm verbergen und Ja-Nein-Fragen stellen.', 'Treffer oder Zeitablauf markieren.'],
      packs: ['Anime-Archetypen', 'Gaming & Internet', 'Märchen & Mythen', 'Berufe', 'Tiere', 'Geschichte', 'Sport', 'Musik & Bühne']
    },
    {
      id: 'anime-guess', title: 'Anime-Figuren erraten', icon: '✨', group: 'Fan-Quiz', status: 'playable', mode: 'link',
      href: quickHref('anime-guess'), minPlayers: 2, maxPlayers: 20, duration: 15,
      moods: ['competitive', 'clever'], age: 'teen', featured: true,
      description: 'Inoffizielles Namensquiz ohne Bilder, Logos oder Zitate. Die Gruppe erklärt eine bekannte Anime- oder Mangafigur.',
      instructions: ['Fan-Pack wählen.', 'Gerät von der ratenden Person weg halten.', 'Figur erklären, ohne den Namen zu nennen.', 'Treffer oder Überspringen markieren.'],
      packs: ['Shōnen-Klassiker', 'Neuere Hits', 'Kult & Fantasy', 'Sport & Games']
    },
    {
      id: 'money-challenge', title: 'Geld-Challenge', icon: '💶', group: 'Entscheidung', status: 'playable', mode: 'link',
      href: quickHref('money-challenge'), minPlayers: 2, maxPlayers: 20, duration: 15,
      moods: ['funny', 'deep'], age: 'teen',
      description: 'Hypothetische Geldfragen und sichere Herausforderungen. Es muss niemals wirklich Geld gezahlt werden.',
      instructions: ['Pack wählen.', 'Betrag und Situation vorlesen.', 'Aktive Person entscheidet ehrlich.', 'Entscheidung speichern und weitergeben.'],
      packs: ['Für 10 Euro', 'Für 50 Euro', 'Für 100 Euro', 'Für 500 Euro', 'Wer zahlt?']
    },
    {
      id: 'blind-ranking', title: 'Blind Ranking', icon: '🙈', group: 'Ranking', status: 'playable', mode: 'link',
      href: quickHref('blind-ranking'), minPlayers: 2, maxPlayers: 20, duration: 15,
      moods: ['funny', 'competitive'], age: 'all', featured: true,
      description: 'Fünf Begriffe erscheinen nacheinander. Jeder muss sofort auf einen freien Rang gesetzt werden, ohne die nächsten Begriffe zu kennen.',
      instructions: ['Thema wählen.', 'Ersten Begriff auf Rang 1 bis 5 setzen.', 'Belegte Ränge können nicht geändert werden.', 'Am Ende die überraschende Liste aufdecken.'],
      packs: ['Essen', 'Freizeit', 'Technik', 'Reisen', 'Superkräfte', 'Party']
    },
    {
      id: 'emoji-quiz', title: 'Emoji Quiz', icon: '🧩', group: 'Quiz', status: 'playable', mode: 'link',
      href: quickHref('emoji-quiz'), minPlayers: 2, maxPlayers: 20, duration: 15,
      moods: ['clever', 'friendly'], age: 'all',
      description: 'Eine Emoji-Kombination stellt ein Tier, Essen, einen Beruf, Ort oder Alltagsbegriff dar.',
      instructions: ['Kategorie wählen.', 'Emoji-Hinweis gemeinsam ansehen.', 'Antwort nennen und aufdecken.', 'Richtig oder falsch markieren.'],
      packs: ['Tiere', 'Essen', 'Berufe', 'Orte', 'Sprichwörter', 'Alltag']
    },
    {
      id: 'pass-the-phone', title: 'Pass das Handy', icon: '📱', group: 'Social', status: 'playable', mode: 'link',
      href: quickHref('pass-the-phone'), minPlayers: 3, maxPlayers: 20, duration: 15,
      moods: ['funny', 'friendly'], age: 'teen',
      description: 'Die Karte beschreibt, an welche Person das Handy weitergegeben wird. Locker, direkt und ohne geheime Datensammlung.',
      instructions: ['Prompt laut vorlesen.', 'Passende Person auswählen.', 'Handy direkt an diese Person geben.', 'Nächsten Prompt öffnen.'],
      packs: ['Freundschaft', 'Komplimente', 'Chaos', 'Team', 'Entscheidungen']
    },
    {
      id: 'red-green-flag', title: 'Red Flag oder Green Flag', icon: '🚩', group: 'Abstimmen', status: 'playable', mode: 'link',
      href: quickHref('red-green-flag'), minPlayers: 2, maxPlayers: 20, duration: 15,
      moods: ['deep', 'funny'], age: 'teen',
      description: 'Die Gruppe bewertet Situationen als Warnsignal oder positives Zeichen und diskutiert kurz die Gründe.',
      instructions: ['Situation vorlesen.', 'Ohne lange Absprache abstimmen.', 'Red oder Green Flag festlegen.', 'Begründungen vergleichen.'],
      packs: ['Freundschaft', 'Dating', 'Alltag', 'Schule & Arbeit', 'Internet']
    },
    {
      id: 'secret-mission', title: 'Geheime Mission', icon: '🕵️', group: 'Challenge', status: 'playable', mode: 'link',
      href: quickHref('secret-mission'), minPlayers: 3, maxPlayers: 20, duration: 20,
      moods: ['chaotic', 'funny'], age: 'all',
      description: 'Jede Person erhält eine sichere geheime Aufgabe und versucht sie unauffällig während der Runde zu erfüllen.',
      instructions: ['Mission privat ansehen.', 'Mission merken und Bildschirm verbergen.', 'Unauffällig erfüllen.', 'Erfolg oder Misserfolg markieren.'],
      packs: ['Unauffällig', 'Gespräch', 'Bewegung', 'Team', 'Chaos']
    },
    {
      id: 'tier-list', title: 'Tier List Battle', icon: '📊', group: 'Ranking', status: 'playable', mode: 'link',
      href: quickHref('tier-list'), minPlayers: 2, maxPlayers: 20, duration: 20,
      moods: ['competitive', 'deep'], age: 'all',
      description: 'Ein Begriff wird gemeinsam in S, A, B, C oder D eingeordnet. Unterschiedliche Meinungen sorgen für die Diskussion.',
      instructions: ['Thema wählen.', 'Begriff ansehen.', 'Gemeinsamen Tier festlegen.', 'Entscheidung kurz begründen und weitergehen.'],
      packs: ['Snacks', 'Apps', 'Schulfächer', 'Hobbys', 'Reiseziele', 'Party-Situationen']
    }
  ].map(Object.freeze);

  const megaContent = {
    'who-am-i': {
      'Anime-Archetypen': [
        'Ninja-Schüler mit geheimem Spezialangriff', 'Piratenkapitän mit riesigem Traum', 'Dämonenjäger mit besonderer Klinge',
        'Magieschüler mit verbotener Kraft', 'Ruhiger Schwertkämpfer mit dunkler Vergangenheit', 'Überstarker Lehrer mit Augenbinde',
        'Kleiner Held mit gewaltiger Energie', 'Prinzessin mit Mondkräften', 'Roboterpilot wider Willen', 'Detektiv mit übernatürlichem Notizbuch'
      ],
      'Gaming & Internet': ['Speedrunner', 'E-Sport-Profi', 'Livestreamer', 'Indie-Entwickler', 'Meme-Administrator', 'Cosplayer', 'Moderator im Gruppenchat', 'Retro-Gamer', 'Virtual-Reality-Fan', 'Podcast-Host'],
      'Märchen & Mythen': ['Drache', 'Meerjungfrau', 'Phönix', 'Riese', 'Vampir', 'Werwolf', 'Hexe', 'König Arthur', 'Robin Hood', 'Medusa'],
      Berufe: ['Elektroniker', 'Feuerwehrkraft', 'Pilot', 'Koch', 'Arzt', 'Lehrkraft', 'Fotograf', 'Programmierer', 'Mechaniker', 'Architekt'],
      Tiere: ['Pinguin', 'Delfin', 'Giraffe', 'Oktopus', 'Adler', 'Faultier', 'Känguru', 'Chamäleon', 'Wolf', 'Panda'],
      Geschichte: ['Kleopatra', 'Leonardo da Vinci', 'Marie Curie', 'Albert Einstein', 'Johannes Gutenberg', 'Amelia Earhart', 'Ludwig van Beethoven', 'Galileo Galilei', 'Jeanne d’Arc', 'Alexander von Humboldt'],
      Sport: ['Torwart', 'Sprinter', 'Boxer', 'Skispringer', 'Tennisspieler', 'Schwimmer', 'Formel-Rennfahrer', 'Basketball-Profi', 'Kletterer', 'Schiedsrichter'],
      'Musik & Bühne': ['DJ', 'Opernsängerin', 'Schlagzeuger', 'Rapper', 'Dirigent', 'Tänzerin', 'Stand-up-Comedian', 'Zauberkünstler', 'Theaterschauspieler', 'Straßenmusiker']
    },
    'anime-guess': {
      'Shōnen-Klassiker': ['Son Goku', 'Naruto Uzumaki', 'Monkey D. Ruffy', 'Ichigo Kurosaki', 'Edward Elric', 'Gon Freecss', 'Killua Zoldyck', 'Kenshin Himura', 'Natsu Dragneel', 'Yusuke Urameshi'],
      'Neuere Hits': ['Tanjiro Kamado', 'Nezuko Kamado', 'Satoru Gojo', 'Yuji Itadori', 'Denji', 'Power', 'Eren Jäger', 'Mikasa Ackerman', 'Izuku Midoriya', 'Shoto Todoroki'],
      'Kult & Fantasy': ['Sailor Moon', 'Light Yagami', 'L', 'Spike Spiegel', 'Inuyasha', 'Kagome Higurashi', 'Frieren', 'Anya Forger', 'Loid Forger', 'Totoro'],
      'Sport & Games': ['Ash Ketchum', 'Pikachu', 'Hinata Shoyo', 'Kageyama Tobio', 'Yoichi Isagi', 'Meguru Bachira', 'Tsubasa Ozora', 'Kirito', 'Asuna', 'Subaru Natsuki']
    },
    'money-challenge': {
      'Für 10 Euro': [
        ['Einen ganzen Tag nur flüstern', '10 €'], ['Eine Woche auf Süßigkeiten verzichten', '10 €'], ['Im Gruppenchat ein altes Profilbild nutzen', '10 €'],
        ['Beim nächsten Spiel freiwillig als Erste Person starten', '10 €'], ['Einen Tag nur Treppen benutzen', '10 €'], ['Eine Stunde ohne Handy verbringen', '10 €'],
        ['Ein ungewöhnliches Sandwich probieren', '10 €'], ['Der Gruppe ein ehrliches Kompliment machen', '10 €']
      ],
      'Für 50 Euro': [
        ['Eine Woche jeden Morgen früh aufstehen', '50 €'], ['Einen Monat keine Liefer-App benutzen', '50 €'], ['Bei Karaoke als erste Person auftreten', '50 €'],
        ['Einen Tag lang jede Entscheidung per Münzwurf treffen', '50 €'], ['Eine Woche nur selbst gekochtes Mittagessen essen', '50 €'], ['Ein Wochenende auf Social Media verzichten', '50 €'],
        ['Ein neues Hobby vier Wochen testen', '50 €'], ['Einen Tag lang ein sehr auffälliges Accessoire tragen', '50 €']
      ],
      'Für 100 Euro': [
        ['Einen Monat keine Softdrinks trinken', '100 €'], ['Eine Woche ohne Streamingdienste leben', '100 €'], ['Bei einer Feier eine kurze Rede halten', '100 €'],
        ['Einen Monat jeden Einkauf vorher aufschreiben', '100 €'], ['Einen Tag lang nur öffentliche Verkehrsmittel nutzen', '100 €'], ['Vier Wochen dreimal pro Woche Sport machen', '100 €'],
        ['Ein Zimmer komplett neu organisieren', '100 €'], ['Eine Woche lang jeden Abend das Handy früh weglegen', '100 €']
      ],
      'Für 500 Euro': [
        ['Einen Monat auf alle Fast-Food-Bestellungen verzichten', '500 €'], ['Vier Wochen um 6 Uhr aufstehen', '500 €'], ['Einen Monat keine Kurzvideos ansehen', '500 €'],
        ['Einen Halbmarathon strukturiert vorbereiten', '500 €'], ['Einen Monat nur mit festem Wochenbudget einkaufen', '500 €'], ['Eine Woche ohne privaten Internetzugang verbringen', '500 €'],
        ['Eine neue Sprache 30 Tage täglich lernen', '500 €'], ['Alle unnötigen Abos prüfen und kündigen', '500 €']
      ],
      'Wer zahlt?': [
        ['Wer zuletzt angekommen ist, würde freiwillig die nächste Snackrunde übernehmen.', 'Nur hypothetisch'], ['Wer heute am meisten gelacht hat, würde freiwillig Getränke holen.', 'Nur hypothetisch'],
        ['Wer sein Handy zuerst entsperrt hat, würde freiwillig den Nachtisch übernehmen.', 'Nur hypothetisch'], ['Wer die meisten Apps geöffnet hat, würde freiwillig Kaffee ausgeben.', 'Nur hypothetisch'],
        ['Wer die längste Anreise hatte, wird heute von den anderen eingeladen.', 'Nur hypothetisch'], ['Wer beim nächsten Spiel gewinnt, darf bestimmen, was bestellt wird.', 'Nur hypothetisch'],
        ['Wer die beste Playlist beigesteuert hat, zahlt heute ausdrücklich nichts.', 'Nur hypothetisch'], ['Alle teilen fair, unabhängig davon, wer was bestellt hat.', 'Nur hypothetisch']
      ]
    },
    'blind-ranking': {
      Essen: ['Pizza', 'Sushi', 'Döner', 'Pasta', 'Burger', 'Pfannkuchen', 'Curry', 'Salat', 'Tacos', 'Kartoffelgerichte'],
      Freizeit: ['Kino', 'Schwimmen', 'Gaming', 'Wandern', 'Kochen', 'Konzert', 'Bowling', 'Lesen', 'Fahrradtour', 'Museum'],
      Technik: ['Smartphone', 'Kopfhörer', 'Smartwatch', 'Tablet', 'Laptop', 'Spielekonsole', 'E-Reader', 'Saugroboter', 'Kamera', '3D-Drucker'],
      Reisen: ['Strandurlaub', 'Städtetrip', 'Camping', 'Bahnreise', 'Roadtrip', 'Berghütte', 'Kreuzfahrt', 'Festivalreise', 'Wellnesshotel', 'Abenteuerurlaub'],
      Superkräfte: ['Fliegen', 'Unsichtbarkeit', 'Teleportation', 'Zeit anhalten', 'Gedanken lesen', 'Unter Wasser atmen', 'Superschnelligkeit', 'Gestaltwandlung', 'Heilkräfte', 'Mit Tieren sprechen'],
      Party: ['Karaoke', 'Quiz', 'Tanzen', 'Mafia', 'Scharade', 'Fotoecke', 'Snackbuffet', 'Playlist', 'Mitternachtsspaziergang', 'Brettspielrunde']
    },
    'emoji-quiz': {
      Tiere: [['🦁👑', 'Löwenkönig'], ['🐧❄️', 'Pinguin'], ['🐝🍯', 'Biene'], ['🦉🌙', 'Eule'], ['🐢🏁', 'Schildkröte'], ['🐬🌊', 'Delfin'], ['🦘🇦🇺', 'Känguru'], ['🐫🏜️', 'Kamel']],
      Essen: [['🍎🥧', 'Apfelkuchen'], ['🍅🧀🍕', 'Pizza'], ['🥔🔥', 'Ofenkartoffel'], ['🍓🥛', 'Erdbeermilch'], ['🌽🍿', 'Popcorn'], ['🍌🥞', 'Bananenpfannkuchen'], ['🥚🍳', 'Spiegelei'], ['🍋🧊', 'Zitronenlimonade']],
      Berufe: [['🔥🚒', 'Feuerwehrkraft'], ['📷🎞️', 'Fotograf'], ['🔧⚡', 'Elektroniker'], ['🍳👨‍🍳', 'Koch'], ['✈️🧑‍✈️', 'Pilot'], ['📚🏫', 'Lehrkraft'], ['💻🧑‍💻', 'Programmierer'], ['🩺🏥', 'Arzt']],
      Orte: [['🗼🥐', 'Paris'], ['🏛️🍕', 'Rom'], ['🚇🌧️', 'London'], ['🌉🚋', 'San Francisco'], ['🏖️🌴', 'Tropeninsel'], ['🏔️🚠', 'Bergstation'], ['🎡🏙️', 'Freizeitpark'], ['📚🤫', 'Bibliothek']],
      Sprichwörter: [['⏰💰', 'Zeit ist Geld'], ['🍎🌳', 'Der Apfel fällt nicht weit vom Stamm'], ['👀❤️', 'Aus den Augen, aus dem Sinn'], ['🐦✋', 'Lieber den Spatz in der Hand'], ['🌧️☀️', 'Nach Regen folgt Sonnenschein'], ['🧹🚪', 'Vor der eigenen Tür kehren'], ['🐘🏺', 'Wie ein Elefant im Porzellanladen'], ['🗣️🥈🤫🥇', 'Reden ist Silber, Schweigen ist Gold']],
      Alltag: [['⏰😴', 'Verschlafen'], ['🔑❓', 'Schlüssel suchen'], ['📱🔋0️⃣', 'Handyakku leer'], ['🚌🏃', 'Bus verpassen'], ['☕💻', 'Arbeiten mit Kaffee'], ['🧺👕', 'Wäsche waschen'], ['🛒🥦', 'Einkaufen'], ['🌧️☂️', 'Regenschirm benutzen']]
    },
    'pass-the-phone': {
      Freundschaft: ['Gib das Handy an die Person, die am zuverlässigsten antwortet.', 'Gib das Handy an die Person, mit der du spontan verreisen würdest.', 'Gib das Handy an die Person, die am besten zuhören kann.', 'Gib das Handy an die Person, die sich an die meisten Geburtstage erinnert.', 'Gib das Handy an die Person, die eine Krise ruhig lösen würde.', 'Gib das Handy an die Person, die dich am längsten kennt.', 'Gib das Handy an die Person, die immer Snacks teilt.', 'Gib das Handy an die Person, die am ehrlichsten berät.'],
      Komplimente: ['Gib das Handy an die Person mit der ansteckendsten guten Laune.', 'Gib das Handy an die Person mit dem kreativsten Stil.', 'Gib das Handy an die Person, die heute besonders aufmerksam war.', 'Gib das Handy an die Person mit dem besten Humor.', 'Gib das Handy an die Person, die Gruppen zusammenhält.', 'Gib das Handy an die Person, die am mutigsten Neues ausprobiert.', 'Gib das Handy an die Person mit der besten Energie.', 'Gib das Handy an die Person, die gerade ein Kompliment verdient.'],
      Chaos: ['Gib das Handy an die Person, die am ehesten ihren Schlüssel sucht.', 'Gib das Handy an die Person, die beim Kochen improvisiert.', 'Gib das Handy an die Person mit den meisten offenen Tabs.', 'Gib das Handy an die Person, die eine Reise ohne Plan starten würde.', 'Gib das Handy an die Person, die am ehesten zu spät merkt, dass der Akku leer ist.', 'Gib das Handy an die Person, die beim Spielen die Regeln neu erfindet.', 'Gib das Handy an die Person, die immer eine unerwartete Geschichte hat.', 'Gib das Handy an die Person, die das größte Chaos überlebt.'],
      Team: ['Gib das Handy an die Person, die heute Kapitän sein sollte.', 'Gib das Handy an die Person, die am besten erklären kann.', 'Gib das Handy an die Person, die bei einem Quiz den Joker wäre.', 'Gib das Handy an die Person, die einen Streit schlichten würde.', 'Gib das Handy an die Person, die den besten Plan B hat.', 'Gib das Handy an die Person, die eine Gruppe motivieren kann.', 'Gib das Handy an die Person, die unter Zeitdruck ruhig bleibt.', 'Gib das Handy an die Person, die alle sicher nach Hause bringt.'],
      Entscheidungen: ['Gib das Handy an die Person, die das nächste Spiel wählen darf.', 'Gib das Handy an die Person, die die nächste Kategorie auswählt.', 'Gib das Handy an die Person, die die Playlist bestimmen darf.', 'Gib das Handy an die Person, die den nächsten Snack auswählt.', 'Gib das Handy an die Person, die eine Gruppen-Challenge erfindet.', 'Gib das Handy an die Person, die den nächsten Teamnamen bestimmt.', 'Gib das Handy an die Person, die den Timer starten darf.', 'Gib das Handy an die Person, die als Nächstes beginnt.']
    },
    'red-green-flag': {
      Freundschaft: ['Die Person meldet sich nur, wenn sie etwas braucht.', 'Die Person erinnert sich an kleine Details aus Gesprächen.', 'Die Person macht vor anderen ständig abwertende Witze über dich.', 'Die Person respektiert ein Nein ohne Diskussion.', 'Die Person freut sich ehrlich über deinen Erfolg.', 'Die Person erzählt private Dinge ungefragt weiter.', 'Die Person entschuldigt sich konkret und ändert ihr Verhalten.', 'Die Person erwartet immer sofortige Antworten.'],
      Dating: ['Die Person behandelt Servicepersonal respektvoll.', 'Die Person kontrolliert ständig deinen Standort.', 'Die Person kann über eigene Fehler lachen.', 'Die Person vergleicht dich ständig mit früheren Beziehungen.', 'Die Person respektiert deine Zeit und Grenzen.', 'Die Person macht aus jeder Kleinigkeit einen Test.', 'Die Person kommuniziert klar statt absichtlich zu verschwinden.', 'Die Person unterstützt deine eigenen Freundschaften.'],
      Alltag: ['Jemand räumt gemeinsam genutzte Dinge direkt weg.', 'Jemand hört Videos ohne Kopfhörer in voller Lautstärke.', 'Jemand kommt meistens fünf Minuten früher.', 'Jemand verspricht viel und sagt immer kurzfristig ab.', 'Jemand fragt nach, bevor etwas ausgeliehen wird.', 'Jemand übernimmt Verantwortung, wenn etwas schiefgeht.', 'Jemand unterbricht jede Geschichte mit einer eigenen.', 'Jemand kann seine Meinung ändern, wenn Fakten dagegen sprechen.'],
      'Schule & Arbeit': ['Eine Person teilt Wissen mit neuen Teammitgliedern.', 'Eine Person schreibt fremde Arbeit als eigene Leistung aus.', 'Eine Person gibt früh Bescheid, wenn eine Frist nicht klappt.', 'Eine Person macht nur dann Fehler sichtbar, wenn andere schuld sind.', 'Eine Person fragt nach, statt Unsicherheit zu verstecken.', 'Eine Person respektiert Feierabend und Pausen.', 'Eine Person hält wichtige Informationen absichtlich zurück.', 'Eine Person gibt hilfreiches und konkretes Feedback.'],
      Internet: ['Die Person prüft Quellen, bevor sie etwas weiterleitet.', 'Die Person veröffentlicht private Chats ohne Zustimmung.', 'Die Person kann online respektvoll widersprechen.', 'Die Person löscht Kommentare nur wegen anderer Meinungen.', 'Die Person kennzeichnet Werbung klar.', 'Die Person glaubt jeder dramatischen Überschrift sofort.', 'Die Person schützt private Daten und Passwörter.', 'Die Person entschuldigt sich öffentlich für falsche Behauptungen.']
    },
    'secret-mission': {
      Unauffällig: ['Bringe jemanden dazu, das Wort „wirklich“ zu sagen.', 'Stelle eine Frage, auf die mindestens zwei Personen gleichzeitig antworten.', 'Sorge dafür, dass jemand auf die Uhr schaut.', 'Benutze in einem Satz unauffällig das Wort „Kartoffel“.', 'Lass dir von jemandem einen Gegenstand reichen.', 'Bringe jemanden dazu, seine Sitzposition zu ändern.', 'Erhalte ein High Five, ohne direkt danach zu fragen.', 'Sorge dafür, dass jemand dein Getränk kommentiert.'],
      Gespräch: ['Starte ein kurzes Gespräch über das beste Frühstück.', 'Frage nach einer unerwarteten Reiseempfehlung.', 'Bringe die Gruppe dazu, über ein altes Hobby zu sprechen.', 'Erfahre von jemandem ein neues Lieblingswort.', 'Lass zwei Personen dieselbe Frage unterschiedlich beantworten.', 'Sorge für eine Mini-Diskussion über süß oder salzig.', 'Frage nach einer unterschätzten App.', 'Bringe jemanden dazu, eine kurze Geschichte zu erzählen.'],
      Bewegung: ['Wechsle unauffällig einmal den Sitzplatz.', 'Bringe zwei Personen zu einem High Five.', 'Stehe kurz auf, ohne dass jemand nach dem Grund fragt.', 'Lass die Gruppe einmal gemeinsam klatschen.', 'Bringe jemanden dazu, etwas zu zeigen statt nur zu erklären.', 'Sorge dafür, dass jemand eine Handbewegung nachmacht.', 'Gehe drei Schritte und setze dich wieder.', 'Bringe jemanden dazu, auf einen Gegenstand zu zeigen.'],
      Team: ['Hilf jemandem bei einer Aufgabe, ohne die Mission zu verraten.', 'Sorge dafür, dass die Gruppe eine Entscheidung einstimmig trifft.', 'Bringe zwei Personen dazu, gemeinsam eine Antwort zu geben.', 'Erfinde mit einer Person einen Teamnamen.', 'Lass jemand anderen freiwillig die Zeit stoppen.', 'Bringe die Gruppe dazu, jemandem ein Kompliment zu machen.', 'Sorge für eine gemeinsame kurze Abstimmung.', 'Lass jemanden deine Idee verbessern.'],
      Chaos: ['Benutze dreimal unauffällig dasselbe ungewöhnliche Wort.', 'Stelle eine völlig ernste Frage über ein absurdes Thema.', 'Bringe jemanden dazu, ein Geräusch nachzumachen.', 'Sorge dafür, dass zwei Personen gleichzeitig lachen.', 'Behaupte kurz, eine Zimmerpflanze habe einen Namen.', 'Erfinde einen unnötig dramatischen Titel für den Abend.', 'Bringe die Gruppe dazu, einen Gegenstand zu bewerten.', 'Sorge dafür, dass jemand „Das zählt nicht“ sagt.']
    },
    'tier-list': {
      Snacks: ['Chips', 'Popcorn', 'Gummibärchen', 'Schokolade', 'Nüsse', 'Nachos', 'Obstteller', 'Kekse', 'Salzstangen', 'Eis'],
      Apps: ['Messenger', 'Navigation', 'Musikstreaming', 'Kurzvideo-App', 'Notizen', 'Kalender', 'Fotobearbeitung', 'Liefer-App', 'Lern-App', 'Fitness-App'],
      Schulfächer: ['Mathematik', 'Deutsch', 'Englisch', 'Sport', 'Kunst', 'Musik', 'Physik', 'Geschichte', 'Biologie', 'Informatik'],
      Hobbys: ['Gaming', 'Lesen', 'Kochen', 'Schwimmen', 'Fotografie', 'Zeichnen', 'Wandern', 'Musik machen', '3D-Druck', 'Gärtnern'],
      Reiseziele: ['Großstadt', 'Berge', 'Meer', 'Waldhütte', 'Freizeitpark', 'Historische Altstadt', 'Festival', 'Wellnesshotel', 'Campingplatz', 'Kleine Insel'],
      'Party-Situationen': ['Karaoke startet', 'Jemand bringt ein Quiz mit', 'Die Playlist fällt aus', 'Es gibt zu viele Snacks', 'Ein spontanes Turnier entsteht', 'Alle erzählen alte Geschichten', 'Das WLAN fällt aus', 'Niemand will zuerst spielen', 'Eine geheime Mission läuft', 'Die Party endet mit einem Spaziergang']
    }
  };

  const expandedForehead = {
    ...(base.content['forehead-guess'] || {}),
    'Anime-Archetypen': megaContent['who-am-i']['Anime-Archetypen'],
    'Gaming & Internet': megaContent['who-am-i']['Gaming & Internet'],
    'Märchen & Mythen': megaContent['who-am-i']['Märchen & Mythen'],
    Geschichte: megaContent['who-am-i'].Geschichte,
    Sport: megaContent['who-am-i'].Sport,
    'Musik & Bühne': megaContent['who-am-i']['Musik & Bühne']
  };

  const games = Object.freeze([...base.games, ...newGames]);
  const content = Object.assign({}, base.content, { 'forehead-guess': expandedForehead }, megaContent);
  const megaGameIds = Object.freeze(newGames.map(game => game.id));
  const quickGameIds = Object.freeze([...(base.quickGameIds || base.trendingGameIds || []), ...megaGameIds]);

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
    version: 4,
    games,
    content,
    getGame,
    getPackNames,
    getItems,
    itemCount,
    megaGameIds,
    quickGameIds
  });
});
