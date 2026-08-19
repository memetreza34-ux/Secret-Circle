(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCirclePartyCatalog = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const games = [
    {
      id: 'imposter',
      title: 'Word Imposter',
      icon: '🕵️',
      group: 'Täuschung',
      status: 'playable',
      mode: 'link',
      href: 'index.html',
      minPlayers: 3,
      maxPlayers: 20,
      duration: 15,
      moods: ['clever', 'competitive'],
      age: 'all',
      featured: true,
      description: 'Alle kennen denselben Begriff – außer den Impostern. Hinweise, Diskussion, geheime Wahl und Punkte.',
      instructions: ['Spieler und Kategorie wählen.', 'Geheime Karten nacheinander ansehen.', 'Hinweise geben und diskutieren.', 'Geheim abstimmen und den Begriff auflösen.'],
      packs: ['14 Kategorien', '168 Begriffe', 'Eigene Packs']
    },
    {
      id: 'truth-dare',
      title: 'Wahrheit oder Pflicht',
      icon: '🎭',
      group: 'Klassiker',
      status: 'playable',
      mode: 'truth-dare',
      minPlayers: 2,
      maxPlayers: 20,
      duration: 20,
      moods: ['funny', 'deep', 'wild'],
      age: 'teen',
      featured: true,
      description: 'Abwechselnd ehrliche Fragen beantworten oder eine harmlose Herausforderung erfüllen.',
      instructions: ['Spieler speichern.', 'Pack auswählen.', 'Wahrheit oder Pflicht wählen.', 'Aufgabe erfüllen und weitergeben.'],
      packs: ['Locker', 'Lustig', 'Tiefer', 'Chaos']
    },
    {
      id: 'never-have',
      title: 'Ich habe noch nie',
      icon: '🙈',
      group: 'Klassiker',
      status: 'playable',
      mode: 'prompt',
      minPlayers: 2,
      maxPlayers: 20,
      duration: 15,
      moods: ['funny', 'deep'],
      age: 'teen',
      featured: true,
      description: 'Wer die Aussage schon erlebt hat, zeigt es. Perfekt für neue Geschichten und überraschende Gemeinsamkeiten.',
      instructions: ['Pack auswählen.', 'Aussage laut vorlesen.', 'Betroffene zeigen gleichzeitig auf.', 'Kurz erzählen oder direkt weitermachen.'],
      packs: ['Alltag', 'Unterwegs', 'Digital', 'Peinlich']
    },
    {
      id: 'most-likely',
      title: 'Wer würde eher?',
      icon: '👉',
      group: 'Abstimmen',
      status: 'playable',
      mode: 'prompt',
      minPlayers: 3,
      maxPlayers: 20,
      duration: 15,
      moods: ['funny', 'friendly'],
      age: 'all',
      description: 'Alle zeigen gleichzeitig auf die Person, die am besten zur Aussage passt.',
      instructions: ['Frage vorlesen.', 'Bis drei zählen.', 'Alle zeigen gleichzeitig auf eine Person.', 'Ergebnis diskutieren und nächste Karte öffnen.'],
      packs: ['Freundschaft', 'Lustig', 'Zukunft', 'Chaos']
    },
    {
      id: 'would-rather',
      title: 'Entweder oder',
      icon: '⚖️',
      group: 'Abstimmen',
      status: 'playable',
      mode: 'choice',
      minPlayers: 2,
      maxPlayers: 20,
      duration: 15,
      moods: ['funny', 'deep'],
      age: 'all',
      description: 'Zwei Möglichkeiten, eine Entscheidung. Danach erklärt jeder kurz seine Wahl.',
      instructions: ['Beide Optionen vorlesen.', 'Alle entscheiden gleichzeitig.', 'Seiten im Raum oder Handzeichen nutzen.', 'Begründungen vergleichen.'],
      packs: ['Alltag', 'Extrem', 'Essen', 'Fantasie']
    },
    {
      id: 'hot-takes',
      title: 'Hot Takes',
      icon: '🔥',
      group: 'Diskussion',
      status: 'playable',
      mode: 'prompt',
      minPlayers: 3,
      maxPlayers: 20,
      duration: 20,
      moods: ['deep', 'competitive'],
      age: 'teen',
      description: 'Provokante, aber sichere Meinungen bringen die Gruppe ins Diskutieren.',
      instructions: ['Aussage vorlesen.', 'Zustimmung von 1 bis 5 zeigen.', 'Zwei unterschiedliche Positionen erklären.', 'Nächste Aussage öffnen.'],
      packs: ['Alltag', 'Popkultur', 'Freundschaft', 'Zukunft']
    },
    {
      id: 'wrong-answers',
      title: 'Nur falsche Antworten',
      icon: '🤪',
      group: 'Kreativ',
      status: 'playable',
      mode: 'prompt',
      minPlayers: 2,
      maxPlayers: 20,
      duration: 10,
      moods: ['funny', 'chaotic'],
      age: 'all',
      description: 'Auf einfache Fragen dürfen nur absichtlich falsche und möglichst kreative Antworten gegeben werden.',
      instructions: ['Frage vorlesen.', 'Reihum sofort falsch antworten.', 'Wer richtig antwortet oder zu lange braucht, verliert die Runde.', 'Neue Frage starten.'],
      packs: ['Alltag', 'Schule', 'Seltsam']
    },
    {
      id: 'paranoia',
      title: 'Paranoia',
      icon: '🤫',
      group: 'Abstimmen',
      status: 'playable',
      mode: 'paranoia',
      minPlayers: 4,
      maxPlayers: 20,
      duration: 20,
      moods: ['funny', 'deep'],
      age: 'teen',
      description: 'Eine Frage wird nur einer Person gezeigt. Sie nennt einen Namen – danach entscheidet der Zufall, ob die Frage offenbart wird.',
      instructions: ['Nur die aktive Person liest die Frage.', 'Sie nennt eine Person aus der Gruppe.', 'Münzwurf entscheidet über die Auflösung.', 'Gerät weitergeben.'],
      packs: ['Locker', 'Lustig', 'Tiefer']
    },
    {
      id: 'charades',
      title: 'Scharade',
      icon: '🎬',
      group: 'Darstellen',
      status: 'playable',
      mode: 'charades',
      minPlayers: 2,
      maxPlayers: 20,
      duration: 15,
      moods: ['funny', 'competitive'],
      age: 'all',
      description: 'Begriffe ohne Worte darstellen. In 60 Sekunden möglichst viele Karten lösen.',
      instructions: ['Teams oder Einzelspieler festlegen.', 'Pack auswählen.', '60-Sekunden-Runde starten.', 'Treffer und Überspringen zählen.'],
      packs: ['Tiere', 'Berufe', 'Alltag', 'Aktionen']
    },
    {
      id: 'taboo',
      title: 'Nicht sagen!',
      icon: '🚫',
      group: 'Erklären',
      status: 'playable',
      mode: 'taboo',
      minPlayers: 4,
      maxPlayers: 20,
      duration: 20,
      moods: ['competitive', 'funny'],
      age: 'all',
      description: 'Einen Begriff erklären, ohne die naheliegenden verbotenen Wörter zu benutzen.',
      instructions: ['Zwei Teams bilden.', 'Karte nur der erklärenden Person zeigen.', 'Zielwort ohne verbotene Wörter erklären.', 'Treffer zählen und Team wechseln.'],
      packs: ['Alltag', 'Essen', 'Technik']
    },
    {
      id: 'hot-potato',
      title: 'Heiße Kartoffel',
      icon: '💣',
      group: 'Schnell',
      status: 'playable',
      mode: 'hot-potato',
      minPlayers: 3,
      maxPlayers: 20,
      duration: 10,
      moods: ['chaotic', 'competitive'],
      age: 'all',
      description: 'Reihum passende Begriffe nennen und das Gerät weitergeben, bevor der zufällige Timer endet.',
      instructions: ['Kategorie öffnen.', 'Timer starten.', 'Passenden Begriff nennen und weitergeben.', 'Wer das Gerät beim Ablauf hält, erhält die Aufgabe.'],
      packs: ['Kategorien', 'Schnellfeuer', 'Mini-Aufgaben']
    },
    {
      id: 'word-chain',
      title: 'Wortkette',
      icon: '🔗',
      group: 'Schnell',
      status: 'playable',
      mode: 'word-chain',
      minPlayers: 2,
      maxPlayers: 20,
      duration: 10,
      moods: ['competitive', 'clever'],
      age: 'all',
      description: 'Ein Wort muss mit dem letzten Buchstaben des vorherigen Wortes beginnen und zur Kategorie passen.',
      instructions: ['Kategorie und Startbuchstaben öffnen.', 'Reihum ein gültiges Wort nennen.', 'Keine Wiederholungen.', 'Bei Fehler oder Zeitüberschreitung endet die Runde.'],
      packs: ['Tiere', 'Essen', 'Orte', 'Gegenstände']
    },
    {
      id: 'spin-bottle',
      title: 'Flaschendrehen',
      icon: '🧭',
      group: 'Werkzeuge',
      status: 'playable',
      mode: 'random-player',
      minPlayers: 2,
      maxPlayers: 20,
      duration: 5,
      moods: ['friendly', 'funny'],
      age: 'all',
      description: 'Wählt zufällig eine Person aus der gespeicherten Gruppe – ohne echte Flasche.',
      instructions: ['Spieler speichern.', 'Drehen drücken.', 'Die ausgewählte Person übernimmt die nächste Aufgabe.'],
      packs: ['Zufallsauswahl']
    },
    {
      id: 'dice-coin',
      title: 'Würfel & Münze',
      icon: '🎲',
      group: 'Werkzeuge',
      status: 'playable',
      mode: 'utility',
      minPlayers: 1,
      maxPlayers: 20,
      duration: 5,
      moods: ['friendly'],
      age: 'all',
      description: 'Schneller digitaler Würfel, Münzwurf und Zufallszahl für jede Spielrunde.',
      instructions: ['Werkzeug wählen.', 'Ergebnis erzeugen.', 'Bei Bedarf wiederholen.'],
      packs: ['Münze', 'W6', 'W20', 'Zufallszahl']
    },
    {
      id: 'two-truths',
      title: 'Zwei Wahrheiten, eine Lüge',
      icon: '🧩',
      group: 'Täuschung',
      status: 'planned',
      mode: 'planned',
      minPlayers: 3,
      maxPlayers: 20,
      duration: 20,
      moods: ['clever', 'friendly'],
      age: 'all',
      description: 'Jede Person trägt drei Aussagen ein. Die Gruppe muss die erfundene Aussage finden.',
      instructions: ['Drei Aussagen eingeben.', 'Aussagen mischen.', 'Gruppe stimmt ab.', 'Lüge auflösen und Punkte vergeben.'],
      packs: ['Persönlich', 'Reise', 'Schule & Arbeit']
    },
    {
      id: 'question-imposter',
      title: 'Question Imposter',
      icon: '❓',
      group: 'Täuschung',
      status: 'planned',
      mode: 'planned',
      minPlayers: 4,
      maxPlayers: 20,
      duration: 15,
      moods: ['clever', 'funny'],
      age: 'all',
      description: 'Fast alle beantworten dieselbe Frage. Eine Person bekommt eine ähnliche, aber andere Frage.',
      instructions: ['Fragen geheim verteilen.', 'Antworten nacheinander nennen.', 'Unstimmigkeiten diskutieren.', 'Imposter wählen.'],
      packs: ['Alltag', 'Meinungen', 'Schätzfragen']
    },
    {
      id: 'location-spy',
      title: 'Location Spy',
      icon: '📍',
      group: 'Täuschung',
      status: 'planned',
      mode: 'planned',
      minPlayers: 4,
      maxPlayers: 20,
      duration: 15,
      moods: ['clever', 'competitive'],
      age: 'all',
      description: 'Alle kennen einen Ort, nur der Spion nicht. Fragen müssen helfen, ohne den Ort zu verraten.',
      instructions: ['Ort und Spion geheim verteilen.', 'Gezielte Fragen stellen.', 'Spion oder Ort erraten.', 'Punkte vergeben.'],
      packs: ['Reise', 'Alltag', 'Fantasieorte']
    },
    {
      id: 'mafia',
      title: 'Mafia',
      icon: '🌙',
      group: 'Täuschung',
      status: 'planned',
      mode: 'planned',
      minPlayers: 6,
      maxPlayers: 20,
      duration: 30,
      moods: ['competitive', 'deep'],
      age: 'teen',
      description: 'Nachtrollen, geheime Aktionen und Tagesabstimmungen mit Erzähler-Unterstützung.',
      instructions: ['Rollen verteilen.', 'Nachtphase moderieren.', 'Tag diskutieren und abstimmen.', 'Siegbedingung prüfen.'],
      packs: ['Klassisch', 'Detektiv', 'Arzt', 'Erweiterte Rollen']
    }
  ];

  const content = {
    'truth-dare': {
      Locker: {
        truth: ['Welches Essen könntest du eine Woche lang jeden Tag essen?', 'Welche kleine Gewohnheit macht deinen Alltag sofort besser?', 'Was war dein lustigster Versprecher?', 'Welche App öffnest du viel zu oft?', 'Was ist dein nutzlosestes Talent?', 'Welche Serie würdest du gern noch einmal zum ersten Mal sehen?', 'Welche Sache hast du zuletzt gelernt?', 'Was ist dein ungewöhnlichster Lieblingsgeruch?'],
        dare: ['Imitiere zehn Sekunden lang einen Nachrichtensprecher.', 'Erfinde einen Werbeslogan für die Person links von dir.', 'Sprich bis zur nächsten Runde besonders langsam.', 'Stelle ein Tier dar, bis es jemand errät.', 'Gib jedem im Raum einen freundlichen Spitznamen.', 'Mache eine dramatische Dankesrede für einen Alltagsgegenstand.', 'Erkläre Zähneputzen wie einen Actionfilm.', 'Tausche für eine Runde deinen Sitzplatz.']
      },
      Lustig: {
        truth: ['Welche Ausrede von dir war so schlecht, dass niemand sie geglaubt hat?', 'Was war dein peinlichster Autokorrektur-Fehler?', 'Welche Modephase würdest du heute niemals wiederholen?', 'Wann hast du zuletzt so getan, als hättest du etwas verstanden?', 'Welcher Song bringt dich sofort zum Mitsingen?', 'Welche harmlose Sache macht dich irrational nervös?', 'Welches Foto-Motiv findest du besonders lustig?', 'Welche Figur würdest du in einem Film über dein Leben spielen?'],
        dare: ['Halte eine Motivationsrede an eine Zimmerpflanze.', 'Erfinde einen Tanz mit genau drei Bewegungen.', 'Lies einen selbst erfundenen Satz wie einen dramatischen Theatermonolog vor.', 'Verkaufe einen Löffel als Luxusprodukt.', 'Sprich eine Runde lang wie ein Roboter.', 'Mache fünf verschiedene überraschte Gesichter.', 'Erfinde einen kurzen Jingle für die Gruppe.', 'Stelle eine berühmte Alltagssituation in Zeitlupe dar.']
      },
      Tiefer: {
        truth: ['Welche Entscheidung hat dich stärker verändert als erwartet?', 'Welche Eigenschaft schätzt du an guten Freunden am meisten?', 'Wofür möchtest du dir in diesem Jahr mehr Zeit nehmen?', 'Welche Lektion hast du auf die harte Tour gelernt?', 'Wann fühlst du dich am meisten wie du selbst?', 'Was würdest du deinem jüngeren Ich gern sagen?', 'Welche Art von Kompliment bleibt dir lange im Gedächtnis?', 'Welche Grenze möchtest du künftig klarer setzen?'],
        dare: ['Nenne jeder Person eine konkrete Stärke.', 'Beschreibe deinen perfekten freien Tag in drei Sätzen.', 'Teile ein Ziel, bei dem dich die Gruppe unterstützen darf.', 'Bedanke dich bei einer Person für etwas Konkretes.', 'Formuliere einen Satz, den du öfter zu dir selbst sagen solltest.', 'Erzähle von einem kleinen Erfolg, auf den du stolz bist.', 'Nenne etwas, das du in den nächsten sieben Tagen ausprobieren willst.', 'Gib der Gruppe eine ehrliche positive Rückmeldung.']
      },
      Chaos: {
        truth: ['Welcher Gegenstand würde dich in einer Gameshow am besten vertreten?', 'Welche drei Dinge würdest du auf eine völlig nutzlose Mission mitnehmen?', 'Welche Regel würdest du für einen Tag weltweit einführen?', 'Welches Tier wäre der schlimmste Mitbewohner?', 'Welche harmlose Verschwörung könntest du überzeugend erfinden?', 'Welche Superkraft wäre im Alltag überraschend unpraktisch?', 'Welcher Beruf wäre in einer Welt ohne Strom am wichtigsten?', 'Welche Sache würdest du als Weltmeisterschaft austragen?'],
        dare: ['Kommentiere 20 Sekunden lang den Raum wie ein Sportreporter.', 'Führe ein ernstes Interview mit deinem Schuh.', 'Erfinde eine neue Begrüßung und bringe sie allen bei.', 'Stelle einen schlechten Zaubertrick vor.', 'Sprich rückwärts klingende Fantasiewörter mit voller Überzeugung.', 'Mache eine Wettervorhersage für die Stimmung im Raum.', 'Erfinde eine Nationalhymne für Snacks.', 'Spiele eine dramatische Szene, in der dein Handy der Bösewicht ist.']
      }
    },
    'never-have': {
      Alltag: ['Ich habe noch nie meinen Schlüssel gesucht, obwohl ich ihn in der Hand hatte.', 'Ich habe noch nie einen Termin fast vergessen.', 'Ich habe noch nie Essen bestellt, obwohl genug zu Hause war.', 'Ich habe noch nie einen Raum betreten und vergessen, warum.', 'Ich habe noch nie einen Wecker ausgeschaltet und weitergeschlafen.', 'Ich habe noch nie beim Kochen eine Zutat improvisiert.', 'Ich habe noch nie ein Paket mehrmals am Tag verfolgt.', 'Ich habe noch nie einen ganzen Tag im Schlafanzug verbracht.'],
      Unterwegs: ['Ich habe noch nie den falschen Zug oder Bus genommen.', 'Ich habe noch nie meinen Koffer zu schwer gepackt.', 'Ich habe noch nie im Urlaub etwas Wichtiges vergessen.', 'Ich habe noch nie eine Reise spontan verlängert.', 'Ich habe noch nie nach dem Weg gefragt, obwohl mein Handy eine Karte hatte.', 'Ich habe noch nie einen Sonnenaufgang auf Reisen gesehen.', 'Ich habe noch nie an einem Flughafen geschlafen.', 'Ich habe noch nie ein Gericht bestellt, ohne zu wissen, was es ist.'],
      Digital: ['Ich habe noch nie eine Nachricht geschrieben und nicht abgeschickt.', 'Ich habe noch nie aus Versehen den falschen Chat geöffnet.', 'Ich habe noch nie länger als eine Stunde am Stück gescrollt.', 'Ich habe noch nie mein Passwort direkt nach dem Ändern vergessen.', 'Ich habe noch nie einen Screenshot gemacht, um ihn später zu vergessen.', 'Ich habe noch nie eine Sprachnachricht mehrfach neu aufgenommen.', 'Ich habe noch nie eine Serie nur wegen eines Clips begonnen.', 'Ich habe noch nie mein Handy gesucht, während es in meiner Tasche war.'],
      Peinlich: ['Ich habe noch nie jemandem zurückgewinkt, der gar nicht mich meinte.', 'Ich habe noch nie einen Namen direkt nach der Vorstellung vergessen.', 'Ich habe noch nie an einer Tür in die falsche Richtung gezogen.', 'Ich habe noch nie laut gelacht, obwohl ich den Witz nicht verstanden habe.', 'Ich habe noch nie eine Nachricht mit einem falschen Namen begonnen.', 'Ich habe noch nie einen Songtext jahrelang falsch gesungen.', 'Ich habe noch nie so getan, als würde ich telefonieren.', 'Ich habe noch nie beim Stolpern so getan, als wäre nichts passiert.']
    },
    'most-likely': {
      Freundschaft: ['Wer würde eher eine Überraschungsparty perfekt organisieren?', 'Wer würde eher mitten in der Nacht helfen kommen?', 'Wer würde eher einen Gruppenausflug planen?', 'Wer würde eher ein jahrelanges Versprechen behalten?', 'Wer würde eher die beste Geschenkidee haben?', 'Wer würde eher einen Streit als Erstes klären?', 'Wer würde eher alle Geburtstage kennen?', 'Wer würde eher neue Leute in die Gruppe integrieren?'],
      Lustig: ['Wer würde eher in einer Gameshow gewinnen?', 'Wer würde eher über den eigenen Witz am lautesten lachen?', 'Wer würde eher einen völlig unnötigen Kauf verteidigen?', 'Wer würde eher mit einem Tier ein Gespräch führen?', 'Wer würde eher einen Tag lang berühmt werden?', 'Wer würde eher aus Versehen viral gehen?', 'Wer würde eher einen Spitznamen erfinden, der bleibt?', 'Wer würde eher bei Karaoke alles geben?'],
      Zukunft: ['Wer würde eher ein eigenes Unternehmen gründen?', 'Wer würde eher in ein anderes Land ziehen?', 'Wer würde eher ein Buch schreiben?', 'Wer würde eher eine neue Sprache lernen?', 'Wer würde eher ein ungewöhnliches Hobby meistern?', 'Wer würde eher einen Marathon schaffen?', 'Wer würde eher eine Erfindung patentieren?', 'Wer würde eher im Fernsehen interviewt werden?'],
      Chaos: ['Wer würde eher eine Woche ohne Plan verreisen?', 'Wer würde eher eine geheime Tür im Haus entdecken?', 'Wer würde eher eine Zombie-Apokalypse überstehen?', 'Wer würde eher einen Roboter als Haustier kaufen?', 'Wer würde eher eine spontane Rede halten?', 'Wer würde eher eine verrückte Wette gewinnen?', 'Wer würde eher auf einer einsamen Insel die Regeln bestimmen?', 'Wer würde eher einen Escape Room allein lösen?']
    },
    'would-rather': {
      Alltag: [['Immer zehn Minuten zu früh sein', 'Immer zehn Minuten zu spät sein'], ['Nur noch Sprachnachrichten senden', 'Nur noch telefonieren'], ['Ein Jahr ohne Süßigkeiten', 'Ein Jahr ohne Streaming'], ['Jeden Tag dasselbe Frühstück', 'Jeden Tag ein unbekanntes Frühstück'], ['Immer den perfekten Parkplatz finden', 'Nie mehr in einer Schlange warten'], ['Vier Tage arbeiten und länger', 'Fünf Tage arbeiten und kürzer'], ['Immer genug Akku haben', 'Immer schnelles Internet haben'], ['Nur bar zahlen', 'Nur digital zahlen']],
      Extrem: [['Einen Monat im Gebirge leben', 'Einen Monat auf einem Schiff leben'], ['Eine Stunde fliegen können', 'Eine Stunde unsichtbar sein'], ['Eine Woche ohne Handy', 'Eine Woche ohne Musik'], ['In die Tiefsee reisen', 'Ins Weltall reisen'], ['Jeden Tag 5 Uhr aufstehen', 'Jeden Tag erst nach Mitternacht schlafen'], ['Ein Jahr lang jeden Tag Sport', 'Ein Jahr lang jeden Tag lernen'], ['Immer die Wahrheit hören', 'Immer überzeugend lügen können'], ['Die Zukunft sehen', 'Die Vergangenheit besuchen']],
      Essen: [['Nur noch süß frühstücken', 'Nur noch herzhaft frühstücken'], ['Pizza ohne Käse', 'Burger ohne Sauce'], ['Nie wieder Pommes', 'Nie wieder Schokolade'], ['Scharfes Essen', 'Sehr saures Essen'], ['Selbst kochen', 'Jeden Tag bestellen'], ['Nur warme Getränke', 'Nur kalte Getränke'], ['Obst als Dessert', 'Kuchen als Frühstück'], ['Ein riesiges Menü teilen', 'Jeder bestellt allein']],
      Fantasie: [['Mit Tieren sprechen', 'Alle Sprachen verstehen'], ['Ein Drache als Haustier', 'Ein Roboter als bester Freund'], ['In einer Unterwasserstadt leben', 'In einer Wolkenstadt leben'], ['Teleportieren', 'Zeit anhalten'], ['Jeden Traum erinnern', 'Nie wieder Albträume haben'], ['Ein magisches Buch besitzen', 'Eine magische Karte besitzen'], ['Eine Fantasiewelt besuchen', 'Eine Zukunftsstadt besuchen'], ['Gedanken lesen', 'Erinnerungen als Film sehen']]
    },
    'hot-takes': {
      Alltag: ['Früh aufstehen ist besser als lange ausschlafen.', 'Sprachnachrichten sollten kürzer als eine Minute sein.', 'Ein leerer Kalender ist Luxus.', 'Ordnung spart mehr Zeit, als sie kostet.', 'Kleine Wohnungen können angenehmer sein als große.', 'Bargeld sollte im Alltag bleiben.', 'Jeder sollte mindestens ein Gericht sehr gut kochen können.', 'Sonntag ist der beste Tag der Woche.'],
      Popkultur: ['Serien sind heute oft zu lang.', 'Remakes sind meistens unnötig.', 'Ein gutes Ende ist wichtiger als eine gute erste Folge.', 'Live-Konzerte sind besser als perfekte Studioaufnahmen.', 'Kurze Videos machen es schwerer, lange Filme zu genießen.', 'Spoiler verderben eine Geschichte weniger als schlechte Figuren.', 'Alte Spiele sind nicht automatisch besser.', 'Fan-Theorien sind manchmal interessanter als die echte Handlung.'],
      Freundschaft: ['Gute Freunde müssen nicht täglich schreiben.', 'Direkte Ehrlichkeit ist besser als höfliches Schweigen.', 'Gemeinsame Erlebnisse sind bessere Geschenke als Gegenstände.', 'Freundschaften dürfen sich ohne Streit auseinanderentwickeln.', 'Gruppenchats verursachen mehr Stress als Nutzen.', 'Ein kleiner Freundeskreis ist meistens besser.', 'Freunde sollten Pläne früh verbindlich bestätigen.', 'Man kann sehr gute Freunde sein und völlig andere Interessen haben.'],
      Zukunft: ['Vier-Tage-Wochen werden normal werden.', 'KI wird persönliche Lernpläne selbstverständlich machen.', 'Innenstädte werden deutlich weniger Autos haben.', 'Digitale Identitäten werden wichtiger als Papierdokumente.', 'Virtuelle Treffen werden echte Treffen nie ersetzen.', 'Berufe werden sich schneller ändern als Ausbildungen.', 'Lokale Gemeinschaften werden wieder wichtiger.', 'Datenschutz wird zu einem Premiummerkmal.']
    },
    'wrong-answers': {
      Alltag: ['Wofür benutzt man einen Kühlschrank?', 'Warum trägt man Schuhe?', 'Was macht ein Wecker?', 'Wozu braucht man eine Zahnbürste?', 'Warum gibt es Ampeln?', 'Was macht man mit einem Regenschirm?', 'Wozu dient ein Schlüssel?', 'Warum hat ein Fahrrad Bremsen?'],
      Schule: ['Was ist zwei plus zwei?', 'Warum schreibt man Prüfungen?', 'Wozu braucht man ein Lineal?', 'Was macht ein Lehrer?', 'Warum gibt es Pausen?', 'Was ist ein Wörterbuch?', 'Wozu dient ein Stundenplan?', 'Warum liest man Bücher?'],
      Seltsam: ['Warum schlafen Wolken nie im Bett?', 'Was bestellt ein Roboter im Café?', 'Warum tragen Pinguine keine Rucksäcke?', 'Womit bezahlt ein Drache im Supermarkt?', 'Warum hat der Mond keine Klingel?', 'Was macht ein Kaktus im Fitnessstudio?', 'Warum fährt ein Geist nicht Bus?', 'Was sammelt ein außerirdischer Tourist?']
    },
    paranoia: {
      Locker: ['Wer würde am ehesten einen freien Tag spontan gut nutzen?', 'Wer hat wahrscheinlich die beste Playlist?', 'Wen würdest du bei einer Quizshow ins Team nehmen?', 'Wer kann am besten Ruhe bewahren?', 'Wer würde ein neues Hobby am schnellsten lernen?', 'Wer plant vermutlich die beste Reise?', 'Wer würde am ehesten ein verlorenes Handy zurückgeben?', 'Wer ist wahrscheinlich am pünktlichsten?'],
      Lustig: ['Wer würde am ehesten mit einem Papagei diskutieren?', 'Wer könnte eine schlechte Ausrede überzeugend verkaufen?', 'Wer würde bei einer Talentshow überraschen?', 'Wer würde am ehesten im falschen Raum landen und bleiben?', 'Wer könnte am besten einen Roboter imitieren?', 'Wer würde eine Woche lang denselben Song hören?', 'Wer würde am ehesten einen erfundenen Feiertag feiern?', 'Wer könnte eine Werbeanzeige für Wasser gewinnen?'],
      Tiefer: ['Wem würdest du ein wichtiges Geheimnis anvertrauen?', 'Wer hört wahrscheinlich am aufmerksamsten zu?', 'Wer motiviert andere, ohne es zu merken?', 'Wer würde in einer schwierigen Situation fair entscheiden?', 'Von wem könntest du etwas Wichtiges lernen?', 'Wer bleibt sich vermutlich auch unter Druck treu?', 'Wer erkennt am schnellsten, wenn jemand Hilfe braucht?', 'Wer gibt wahrscheinlich den ehrlichsten Rat?']
    },
    charades: {
      Tiere: ['Pinguin', 'Giraffe', 'Känguru', 'Krabbe', 'Eule', 'Delfin', 'Katze', 'Faultier', 'Frosch', 'Elefant', 'Huhn', 'Krokodil'],
      Berufe: ['Feuerwehr', 'Koch', 'Fotografin', 'Pilot', 'Friseur', 'Gärtnerin', 'Mechaniker', 'Lehrerin', 'Dirigent', 'Bäckerin', 'Detektiv', 'Astronautin'],
      Alltag: ['Zähne putzen', 'Bus verpassen', 'Koffer packen', 'Fenster putzen', 'Geschenk öffnen', 'Pizza bestellen', 'Schlüssel suchen', 'Selfie machen', 'Wecker ausschalten', 'Regenschirm öffnen', 'Einkaufswagen schieben', 'Kaffee verschütten'],
      Aktionen: ['Jonglieren', 'Tauchen', 'Schleichen', 'Klettern', 'Rudern', 'Tanzen', 'Niesen', 'Balancieren', 'Tippen', 'Pfeifen', 'Winken', 'Zaubern']
    },
    taboo: {
      Alltag: [
        { word: 'Kühlschrank', banned: ['kalt', 'Essen', 'Küche'] }, { word: 'Regenschirm', banned: ['Regen', 'nass', 'aufspannen'] }, { word: 'Wecker', banned: ['Uhr', 'morgens', 'klingeln'] }, { word: 'Rucksack', banned: ['tragen', 'Schule', 'Tasche'] }, { word: 'Aufzug', banned: ['Etage', 'hoch', 'Knopf'] }, { word: 'Fernbedienung', banned: ['Fernseher', 'Knopf', 'Kanal'] }, { word: 'Zahnbürste', banned: ['Zähne', 'putzen', 'Bad'] }, { word: 'Fahrrad', banned: ['Rad', 'Pedal', 'fahren'] }
      ],
      Essen: [
        { word: 'Pizza', banned: ['Käse', 'Italien', 'Ofen'] }, { word: 'Schokolade', banned: ['süß', 'Kakao', 'Tafel'] }, { word: 'Spaghetti', banned: ['Nudeln', 'Italien', 'Sauce'] }, { word: 'Popcorn', banned: ['Kino', 'Mais', 'knusprig'] }, { word: 'Banane', banned: ['gelb', 'Obst', 'Schale'] }, { word: 'Suppe', banned: ['Löffel', 'warm', 'Schüssel'] }, { word: 'Burger', banned: ['Brötchen', 'Fleisch', 'Fast Food'] }, { word: 'Eis', banned: ['kalt', 'Sommer', 'Kugel'] }
      ],
      Technik: [
        { word: 'Smartphone', banned: ['Handy', 'App', 'telefonieren'] }, { word: 'Kopfhörer', banned: ['Musik', 'Ohren', 'hören'] }, { word: 'Passwort', banned: ['Login', 'geheim', 'Zeichen'] }, { word: 'Drucker', banned: ['Papier', 'Tinte', 'drucken'] }, { word: 'Router', banned: ['Internet', 'WLAN', 'Netzwerk'] }, { word: 'Tastatur', banned: ['tippen', 'Computer', 'Tasten'] }, { word: 'Kamera', banned: ['Foto', 'Bild', 'Objektiv'] }, { word: 'Ladekabel', banned: ['Akku', 'Strom', 'Stecker'] }
      ]
    },
    'hot-potato': {
      Kategorien: ['Nenne eine Stadt.', 'Nenne ein Tier.', 'Nenne ein Getränk.', 'Nenne einen Beruf.', 'Nenne etwas Rundes.', 'Nenne etwas, das man im Urlaub braucht.', 'Nenne ein Wort mit S.', 'Nenne etwas aus einer Küche.'],
      Schnellfeuer: ['Nenne etwas Blaues.', 'Nenne ein Land.', 'Nenne eine Sportart.', 'Nenne eine App.', 'Nenne ein Musikinstrument.', 'Nenne etwas, das Geräusche macht.', 'Nenne ein Kleidungsstück.', 'Nenne etwas, das man sammelt.'],
      'Mini-Aufgaben': ['Klatsche zweimal und gib weiter.', 'Nenne zwei Tiere und gib weiter.', 'Mache ein überraschtes Gesicht und gib weiter.', 'Sage das Alphabet bis E und gib weiter.', 'Nenne die Person links von dir und gib weiter.', 'Mache ein Tiergeräusch und gib weiter.', 'Zähle rückwärts von fünf und gib weiter.', 'Nenne drei Farben und gib weiter.']
    },
    'word-chain': {
      Tiere: ['A', 'B', 'K', 'M', 'S'],
      Essen: ['A', 'K', 'P', 'S', 'T'],
      Orte: ['B', 'H', 'M', 'S', 'W'],
      Gegenstände: ['B', 'F', 'K', 'L', 'T']
    }
  };

  function getGame(id) {
    return games.find(game => game.id === id) || null;
  }

  function getPackNames(id) {
    const gameContent = content[id];
    return gameContent ? Object.keys(gameContent) : [];
  }

  function getItems(id, pack) {
    const gameContent = content[id];
    if (!gameContent) return [];
    if (pack && gameContent[pack]) return gameContent[pack];
    return Object.values(gameContent).flatMap(value => {
      if (Array.isArray(value)) return value;
      if (value && typeof value === 'object') return Object.values(value).flat();
      return [];
    });
  }

  function itemCount(id) {
    const gameContent = content[id];
    if (!gameContent) return 0;
    return Object.values(gameContent).reduce((total, value) => {
      if (Array.isArray(value)) return total + value.length;
      if (value && typeof value === 'object') return total + Object.values(value).reduce((sum, list) => sum + list.length, 0);
      return total;
    }, 0);
  }

  return Object.freeze({
    version: 1,
    games: Object.freeze(games.map(game => Object.freeze({ ...game }))),
    content,
    getGame,
    getPackNames,
    getItems,
    itemCount
  });
});
