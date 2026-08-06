'use strict';

(() => {
  const C = window.SecretCirclePartyCatalog;
  if (!C || !document.querySelector('.hub-shell')) return;

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const ONBOARDING_KEY = 'secret-circle-party-onboarding-v1';
  let lastHelpTrigger = null;

  const HELP = {
    home: {
      title: 'In weniger als einer Minute starten',
      intro: 'Secret Circle ist für spontane Gruppen gedacht. Du brauchst kein Konto und keine Vorbereitung.',
      steps: ['Spieler einmal eintragen.', 'Spiel nach Stimmung oder Suche wählen.', 'Kategorie auswählen und auf Starten tippen.']
    },
    games: {
      title: 'Schnell das passende Spiel finden',
      intro: 'Die Suche prüft Name, Beschreibung und Kategorien. Filter können kombiniert werden.',
      steps: ['Stimmung oder Spielart wählen.', 'Spielerzahl und Altersstufe prüfen.', 'Auf Spielen tippen und die kurze Regelübersicht lesen.']
    },
    players: {
      title: 'Eine gemeinsame Gruppe für alle Spiele',
      intro: 'Ein Name pro Zeile. Doppelte Namen und leere Zeilen werden automatisch entfernt.',
      steps: ['Namen eintragen.', 'Spieler speichern.', 'Häufige Gruppen optional als Preset sichern.']
    },
    favorites: {
      title: 'Lieblingsspiele schneller öffnen',
      intro: 'Der Stern auf jeder Spielkarte fügt ein Spiel zu den Favoriten hinzu.',
      steps: ['Stern antippen.', 'Favoriten öffnen.', 'Spiel direkt starten.']
    },
    stats: {
      title: 'Nur lokale Übersicht',
      intro: 'Verlauf, Punkte und Erfolge bleiben ausschließlich auf diesem Gerät.',
      steps: ['Abgeschlossene Sessions erscheinen hier.', 'Erneut öffnet dasselbe Spiel.', 'Der Verlauf kann jederzeit gelöscht werden.']
    },
    settings: {
      title: 'Daten selbst kontrollieren',
      intro: 'Eigene Spiele, Packs, Sessions und Einstellungen lassen sich lokal sichern.',
      steps: ['Gesamtsicherung exportieren.', 'Datei sicher aufbewahren.', 'Bei Bedarf importieren oder alle lokalen Daten löschen.']
    },
    creator: {
      title: 'Eigene Spiele ohne Programmieren',
      intro: 'Der Creator verwendet einfache Vorlagen und fügt dein Spiel direkt zum Party Hub hinzu.',
      steps: ['Vorlage auswählen.', 'Name, Icon und Kategorien festlegen.', 'Karten prüfen, speichern und testen.']
    }
  };

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function addCreatorEntryPoints() {
    const nav = $('.hub-nav');
    if (nav && !nav.querySelector('[data-creator-link]')) {
      const link = element('a', 'hub-nav-link');
      link.href = 'creator.html';
      link.dataset.creatorLink = 'true';
      link.innerHTML = '<span aria-hidden="true">🛠️</span><span>Erstellen</span>';
      link.setAttribute('aria-label', 'Eigenes Spiel erstellen');
      nav.insertBefore(link, nav.querySelector('[data-view-target="favorites"]'));
    }

    const actions = $('.hero-actions');
    if (actions && !actions.querySelector('[data-creator-cta]')) {
      const link = element('a', 'button-link creator-hero-link', 'Eigenes Spiel erstellen');
      link.href = 'creator.html';
      link.dataset.creatorCta = 'true';
      actions.append(link);
    }
  }

  function addHowItWorks() {
    const home = $('#view-home');
    const hero = home?.querySelector('.hero-card');
    if (!home || !hero || $('#how-it-works')) return;
    const section = element('section', 'how-it-works');
    section.id = 'how-it-works';
    section.setAttribute('aria-labelledby', 'how-it-works-title');
    const heading = element('div', 'section-title');
    const text = element('div');
    text.append(element('p', 'eyebrow', 'Sofort verständlich'), element('h2', '', 'In drei Schritten zur ersten Runde'));
    text.querySelector('h2').id = 'how-it-works-title';
    const help = helpButton('home', 'Hilfe zum Schnellstart');
    heading.append(text, help);
    const steps = element('div', 'simple-step-grid');
    [
      ['1', 'Spieler festlegen', 'Namen einmal speichern oder direkt mit der Beispielgruppe starten.', 'Spieler öffnen', 'players'],
      ['2', 'Spiel auswählen', 'Nach Stimmung filtern oder einen bekannten Namen suchen.', 'Spiele ansehen', 'games'],
      ['3', 'Kurz lesen und starten', 'Jedes Spiel zeigt Spielerzahl, Dauer und wenige klare Regeln.', 'Schnellstart', 'quick']
    ].forEach(([number, title, description, action, target]) => {
      const card = element('article', 'simple-step-card');
      card.append(element('span', 'step-number', number), element('h3', '', title), element('p', '', description));
      const button = element('button', 'secondary', action);
      button.type = 'button';
      if (target === 'quick') button.addEventListener('click', () => $('#quick-start')?.click());
      else button.addEventListener('click', () => document.querySelector(`[data-view-target="${target}"]`)?.click());
      card.append(button);
      steps.append(card);
    });
    section.append(heading, steps);
    hero.insertAdjacentElement('afterend', section);
  }

  function addCreatorCallout() {
    const home = $('#view-home');
    if (!home || $('#creator-callout')) return;
    const section = element('section', 'creator-callout');
    section.id = 'creator-callout';
    const icon = element('span', 'creator-callout-icon', '🛠️');
    icon.setAttribute('aria-hidden', 'true');
    const text = element('div');
    text.append(
      element('p', 'eyebrow', 'Deine Gruppe · deine Regeln'),
      element('h2', '', 'Eigenes Partyspiel erstellen'),
      element('p', '', 'Wähle eine Vorlage, füge eigene Fragen oder Begriffe hinzu und teste das Spiel direkt. Kein Programmieren nötig.')
    );
    const actions = element('div', 'creator-callout-actions');
    const create = element('a', 'button-link', 'Creator öffnen');
    create.href = 'creator.html';
    const help = helpButton('creator', 'Hilfe zum Spiele-Creator');
    help.textContent = 'Kurz erklärt';
    help.className = 'secondary creator-help-link';
    actions.append(create, help);
    section.append(icon, text, actions);
    home.append(section);
  }

  function helpButton(key, label) {
    const button = element('button', 'help-dot', '?');
    button.type = 'button';
    button.dataset.helpKey = key;
    button.setAttribute('aria-label', label);
    button.addEventListener('click', () => showHelp(key, button));
    return button;
  }

  function addSectionHelp() {
    const targets = [
      ['#view-games .page-heading>div', 'games', 'Hilfe zur Spielsuche'],
      ['#view-players .page-heading>div', 'players', 'Hilfe zu Spielern und Presets'],
      ['#view-favorites .page-heading>div', 'favorites', 'Hilfe zu Favoriten'],
      ['#view-stats .page-heading>div', 'stats', 'Hilfe zu Verlauf und Statistik'],
      ['#view-settings .page-heading>div', 'settings', 'Hilfe zu Daten und Einstellungen']
    ];
    for (const [selector, key, label] of targets) {
      const container = $(selector);
      if (!container || container.querySelector('[data-help-key]')) continue;
      const heading = container.querySelector('h1');
      if (!heading) continue;
      const row = element('div', 'heading-with-help');
      heading.replaceWith(row);
      row.append(heading, helpButton(key, label));
    }

    const filter = $('.filter-bar');
    if (filter && !filter.previousElementSibling?.classList.contains('filter-help')) {
      const note = element('p', 'filter-help', 'Tipp: Suche und Filter lassen sich kombinieren. Beginne mit Stimmung oder Spielname – die anderen Filter sind optional.');
      filter.insertAdjacentElement('beforebegin', note);
    }
  }

  function ensureHelpSheet() {
    if ($('#hub-help-sheet')) return;
    const sheet = element('section', 'help-sheet');
    sheet.id = 'hub-help-sheet';
    sheet.hidden = true;
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-labelledby', 'hub-help-title');
    const card = element('div', 'help-sheet-card');
    const close = element('button', 'close-button', '×');
    close.type = 'button';
    close.id = 'close-hub-help';
    close.setAttribute('aria-label', 'Hilfe schließen');
    close.addEventListener('click', closeHelp);
    const eyebrow = element('p', 'eyebrow', 'Kurz erklärt');
    const title = element('h2', '', 'Hilfe');
    title.id = 'hub-help-title';
    const intro = element('p', 'help-intro');
    intro.id = 'hub-help-intro';
    const list = element('ol', 'help-steps');
    list.id = 'hub-help-steps';
    card.append(close, eyebrow, title, intro, list);
    sheet.append(card);
    sheet.addEventListener('click', event => { if (event.target === sheet) closeHelp(); });
    document.body.append(sheet);
  }

  function showHelp(key, trigger) {
    const help = HELP[key];
    if (!help) return;
    ensureHelpSheet();
    lastHelpTrigger = trigger;
    $('#hub-help-title').textContent = help.title;
    $('#hub-help-intro').textContent = help.intro;
    const list = $('#hub-help-steps');
    list.replaceChildren();
    help.steps.forEach(step => list.append(element('li', '', step)));
    $('#hub-help-sheet').hidden = false;
    $('#close-hub-help').focus();
  }

  function closeHelp() {
    const sheet = $('#hub-help-sheet');
    if (!sheet || sheet.hidden) return;
    sheet.hidden = true;
    lastHelpTrigger?.focus();
  }

  function enhanceGameCards(root = document) {
    root.querySelectorAll('.game-card').forEach(card => {
      if (card.dataset.guideEnhanced === 'true') return;
      card.dataset.guideEnhanced = 'true';
      const game = C.getGame(card.dataset.gameId);
      if (!game) return;
      card.dataset.accent = game.accent || (game.custom ? 'violet' : game.group.toLocaleLowerCase('de-DE').replace(/[^a-z0-9]+/g, '-'));
      const top = card.querySelector('.game-card-top');
      if (top && !top.querySelector('.game-type-label')) {
        const label = element('span', 'game-type-label', game.custom ? 'Eigenes Spiel' : game.group);
        top.insertBefore(label, top.querySelector('.favorite-button'));
      }
      const open = card.querySelector('.open-game');
      if (open && game.status === 'playable') open.textContent = 'Spielen';
      if (game.custom) {
        const actions = card.querySelector('.game-card-actions');
        if (actions && !actions.querySelector('.edit-custom-game')) {
          const edit = element('a', 'edit-custom-game', 'Bearbeiten');
          edit.href = `creator.html?edit=${encodeURIComponent(game.id)}`;
          actions.append(edit);
        }
      }
    });
  }

  function enhanceDetail() {
    const modal = $('#game-detail');
    if (!modal || modal.hidden) return;
    const title = $('#detail-title')?.textContent;
    const game = C.games.find(item => item.title === title);
    if (!game) return;
    const card = modal.querySelector('.modal-card');
    let summary = card.querySelector('.detail-quick-guide');
    if (!summary) {
      summary = element('section', 'detail-quick-guide');
      summary.setAttribute('aria-labelledby', 'detail-quick-guide-title');
      const heading = element('div', 'detail-quick-guide-heading');
      const h3 = element('h3', '', 'Kurz erklärt');
      h3.id = 'detail-quick-guide-title';
      heading.append(h3, element('span', '', '30 Sekunden lesen'));
      const list = element('ol');
      summary.append(heading, list);
      const badges = $('#detail-badges');
      badges?.insertAdjacentElement('afterend', summary);
    }
    const list = summary.querySelector('ol');
    list.replaceChildren();
    const rules = game.instructions.slice(0, 3);
    rules.forEach(rule => list.append(element('li', '', rule)));
    const start = $('#start-selected-game');
    if (start && game.status === 'playable' && game.mode !== 'link') start.textContent = 'Jetzt spielen';
  }

  function addOnboarding() {
    if (localStorage.getItem(ONBOARDING_KEY) === 'done' || $('#onboarding-card')) return;
    const home = $('#view-home');
    const hero = home?.querySelector('.hero-card');
    if (!hero) return;
    const panel = element('section', 'onboarding-card');
    panel.id = 'onboarding-card';
    panel.setAttribute('aria-labelledby', 'onboarding-title');
    const text = element('div');
    text.append(element('p', 'eyebrow', 'Erster Besuch'), element('h2', '', 'In 30 Sekunden startklar'), element('p', '', 'Die Beispielgruppe ist bereits vorbereitet. Öffne ein Spiel, lies die drei kurzen Schritte und starte die Runde.'));
    text.querySelector('h2').id = 'onboarding-title';
    const actions = element('div', 'inline-actions');
    const start = element('button', '', 'Spiel empfehlen');
    start.type = 'button';
    start.addEventListener('click', () => { localStorage.setItem(ONBOARDING_KEY, 'done'); panel.remove(); $('#quick-start')?.click(); });
    const dismiss = element('button', 'secondary', 'Verstanden');
    dismiss.type = 'button';
    dismiss.addEventListener('click', () => { localStorage.setItem(ONBOARDING_KEY, 'done'); panel.remove(); });
    actions.append(start, dismiss);
    panel.append(text, actions);
    hero.insertAdjacentElement('beforebegin', panel);
  }

  function openRequestedGame() {
    const id = new URLSearchParams(location.search).get('game');
    if (!id || !C.getGame(id)) return;
    const gamesButton = document.querySelector('[data-view-target="games"]');
    gamesButton?.click();
    window.setTimeout(() => {
      const game = C.getGame(id);
      const search = $('#game-search');
      if (search) {
        search.value = game.title;
        search.dispatchEvent(new Event('input', { bubbles: true }));
      }
      window.setTimeout(() => document.querySelector(`[data-open-game="${CSS.escape(id)}"]`)?.click(), 60);
    }, 80);
  }

  function observeDynamicUi() {
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return;
          if (node.matches('.game-card')) enhanceGameCards(node.parentElement || document);
          else if (node.querySelector?.('.game-card')) enhanceGameCards(node);
        });
      }
      enhanceDetail();
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
    addEventListener('pagehide', () => observer.disconnect(), { once: true });
  }

  function initialize() {
    addCreatorEntryPoints();
    addHowItWorks();
    addCreatorCallout();
    addSectionHelp();
    ensureHelpSheet();
    addOnboarding();
    enhanceGameCards();
    observeDynamicUi();
    openRequestedGame();
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeHelp(); });
  }

  initialize();
})();
