'use strict';

(() => {
  const Creator = window.SecretCircleGameCreator;
  if (!Creator) throw new Error('Game-Creator konnte nicht geladen werden.');

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const store = Creator.createStore(localStorage);
  const HELP = {
    template: {
      title: 'Welche Vorlage passt?',
      items: [
        'Fragen, Challenges, Storys und Debatten zeigen jeweils eine Textkarte.',
        'Entweder-oder zeigt zwei Optionen gleichzeitig.',
        'Erraten & Darstellen nutzt eine 60-Sekunden-Runde mit Treffer- und Überspringen-Taste.',
        'Die Vorlage kann später nicht unbemerkt die Regeln eines gespeicherten Spiels verändern.'
      ]
    },
    details: {
      title: 'Kurze Details funktionieren besser',
      items: [
        'Der Name sollte sofort verständlich sein.',
        'Die Erklärung beschreibt in einem Satz, was die Gruppe macht.',
        'Kategorie, Icon und Akzent helfen später bei Suche, Bildern und Animationen.',
        'Spielerzahl und Dauer erscheinen direkt auf der Spielkarte.'
      ]
    },
    content: {
      title: 'Gute Karten schreiben',
      items: [
        'Eine klare Idee pro Zeile.',
        'Mindestens drei unterschiedliche Karten je Kategorie.',
        'Keine Aufgaben, die gefährlich, erniedrigend oder unfreiwillig sind.',
        'Keine kopierten Bilder, Liedtexte, langen Zitate oder vollständigen fremden Kartensammlungen.'
      ]
    },
    review: {
      title: 'Vor dem Speichern',
      items: [
        'Prüfe, ob neue Personen das Spiel ohne zusätzliche Erklärung verstehen.',
        'Teste mindestens drei Karten direkt im Party Hub.',
        'Eigene Spiele bleiben lokal und können als JSON exportiert werden.',
        'Später können gespeicherte Icons und Akzente durch passende Illustrationen und Animationen erweitert werden.'
      ]
    }
  };

  let step = 1;
  let editingId = null;
  let selectedTemplate = 'prompt';
  let selectedIcon = '🎉';
  let selectedAccent = 'violet';
  let packCounter = 0;
  let lastHelpTrigger = null;

  function setStatus(message, error = false) {
    const status = $('#creator-status');
    status.textContent = message || '';
    status.classList.toggle('error', error);
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function clean(value, maximum = 180) {
    return Creator.cleanText(value, maximum);
  }

  function template() {
    return Creator.templates[selectedTemplate] || Creator.templates.prompt;
  }

  function renderTemplates() {
    const grid = $('#template-grid');
    grid.replaceChildren();
    for (const item of Object.values(Creator.templates)) {
      const card = element('button', 'template-card');
      card.type = 'button';
      card.dataset.templateId = item.id;
      card.setAttribute('role', 'radio');
      card.setAttribute('aria-checked', item.id === selectedTemplate ? 'true' : 'false');
      const icon = element('span', 'template-icon', item.icon);
      icon.setAttribute('aria-hidden', 'true');
      const text = element('span');
      text.append(element('strong', '', item.title), element('small', '', item.description));
      const check = element('span', 'template-check', '✓');
      check.setAttribute('aria-hidden', 'true');
      card.append(icon, text, check);
      card.addEventListener('click', () => selectTemplate(item.id, true));
      grid.append(card);
    }
  }

  function selectTemplate(id, seedContent = false) {
    if (!Creator.templates[id]) return;
    selectedTemplate = id;
    $$('.template-card').forEach(card => card.setAttribute('aria-checked', card.dataset.templateId === id ? 'true' : 'false'));
    $('#content-instruction').textContent = `${template().instruction} Mindestens drei unterschiedliche Karten je Kategorie.`;
    if (seedContent) {
      const description = $('#creator-description');
      if (!description.value.trim()) description.value = template().description;
      const firstTextarea = $('#pack-editor textarea');
      if (firstTextarea && !firstTextarea.value.trim()) firstTextarea.value = template().example;
      updatePackCounts();
    }
    updatePreview();
  }

  function renderIconPicker() {
    const picker = $('#icon-picker');
    picker.replaceChildren();
    for (const icon of Creator.icons) {
      const button = element('button', 'icon-choice', icon);
      button.type = 'button';
      button.dataset.icon = icon;
      button.setAttribute('aria-label', `Icon ${icon} wählen`);
      button.setAttribute('aria-pressed', icon === selectedIcon ? 'true' : 'false');
      button.addEventListener('click', () => {
        selectedIcon = icon;
        $$('.icon-choice').forEach(item => item.setAttribute('aria-pressed', item.dataset.icon === icon ? 'true' : 'false'));
        updatePreview();
      });
      picker.append(button);
    }
  }

  function renderAccentPicker() {
    const picker = $('#accent-picker');
    picker.replaceChildren();
    for (const accent of Creator.accents) {
      const button = element('button', `accent-choice accent-${accent}`);
      button.type = 'button';
      button.dataset.accent = accent;
      button.setAttribute('aria-label', `Akzent ${accent} wählen`);
      button.setAttribute('aria-pressed', accent === selectedAccent ? 'true' : 'false');
      button.addEventListener('click', () => {
        selectedAccent = accent;
        $$('.accent-choice').forEach(item => item.setAttribute('aria-pressed', item.dataset.accent === accent ? 'true' : 'false'));
        updatePreview();
      });
      picker.append(button);
    }
  }

  function addPack(pack = null) {
    const index = packCounter++;
    const block = element('section', 'pack-block');
    block.dataset.packIndex = String(index);
    const head = element('div', 'pack-head');
    head.append(element('strong', '', `Kategorie ${$('#pack-editor').children.length + 1}`));
    const remove = element('button', 'secondary', 'Entfernen');
    remove.type = 'button';
    remove.hidden = $('#pack-editor').children.length === 0;
    remove.addEventListener('click', () => {
      block.remove();
      renumberPacks();
      updateReview();
    });
    head.append(remove);

    const nameLabel = element('label');
    nameLabel.htmlFor = `pack-name-${index}`;
    nameLabel.append(document.createTextNode('Kategoriename '), element('span', '', 'z. B. Anime, Freunde, Schule'));
    const name = document.createElement('input');
    name.id = `pack-name-${index}`;
    name.className = 'pack-name';
    name.maxLength = 40;
    name.required = true;
    name.placeholder = 'Standard';
    name.value = pack?.name || ($('#pack-editor').children.length ? `Kategorie ${$('#pack-editor').children.length + 1}` : 'Standard');
    nameLabel.append(name);

    const cardsLabel = element('label');
    cardsLabel.htmlFor = `pack-items-${index}`;
    cardsLabel.append(document.createTextNode('Karten '), element('span', '', template().instruction));
    const textarea = document.createElement('textarea');
    textarea.id = `pack-items-${index}`;
    textarea.className = 'pack-items';
    textarea.rows = 8;
    textarea.maxLength = 36000;
    textarea.required = true;
    textarea.placeholder = template().example;
    textarea.value = pack ? serializeItems(pack.items) : ($('#pack-editor').children.length ? '' : template().example);
    cardsLabel.append(textarea);

    const count = element('p', 'pack-count', '0 gültige Karten');
    [name, textarea].forEach(control => control.addEventListener('input', () => {
      updatePackCount(block);
      updatePreview();
    }));

    block.append(head, nameLabel, cardsLabel, count);
    $('#pack-editor').append(block);
    renumberPacks();
    updatePackCount(block);
  }

  function serializeItems(items) {
    if (!Array.isArray(items)) return '';
    return items.map(item => Array.isArray(item) ? `${item[0]} | ${item[1]}` : item).join('\n');
  }

  function renumberPacks() {
    $$('#pack-editor .pack-block').forEach((block, index) => {
      block.querySelector('.pack-head strong').textContent = `Kategorie ${index + 1}`;
      block.querySelector('.pack-head button').hidden = index === 0 && $('#pack-editor').children.length === 1;
    });
    $('#add-pack').disabled = $('#pack-editor').children.length >= Creator.maxPacks;
  }

  function updatePackCount(block) {
    const items = Creator.parseCards(block.querySelector('.pack-items').value, selectedTemplate);
    block.querySelector('.pack-count').textContent = `${items.length} gültige Karten${items.length < 3 ? ' · mindestens 3 erforderlich' : ''}`;
  }

  function updatePackCounts() {
    $$('#pack-editor .pack-block').forEach(updatePackCount);
  }

  function readPacks() {
    return $$('#pack-editor .pack-block').map(block => ({
      name: clean(block.querySelector('.pack-name').value, 40),
      items: Creator.parseCards(block.querySelector('.pack-items').value, selectedTemplate)
    }));
  }

  function readDraft() {
    return {
      id: editingId || undefined,
      title: $('#creator-title').value,
      description: $('#creator-description').value,
      group: $('#creator-group').value,
      templateId: selectedTemplate,
      icon: selectedIcon,
      accent: selectedAccent,
      minPlayers: $('#creator-min-players').value,
      maxPlayers: $('#creator-max-players').value,
      duration: $('#creator-duration').value,
      age: $('#creator-age').value,
      packs: readPacks()
    };
  }

  function validateCurrentStep() {
    setStatus('');
    if (step === 1 && !Creator.templates[selectedTemplate]) {
      setStatus('Wähle zuerst eine Spielvorlage.', true);
      return false;
    }
    if (step === 2) {
      const title = clean($('#creator-title').value, 50);
      const description = clean($('#creator-description').value, 180);
      const min = Number($('#creator-min-players').value);
      const max = Number($('#creator-max-players').value);
      if (title.length < 2) return invalid('Gib dem Spiel einen Namen mit mindestens zwei Zeichen.', $('#creator-title'));
      if (description.length < 10) return invalid('Erkläre das Spiel in mindestens zehn Zeichen.', $('#creator-description'));
      if (!Number.isInteger(min) || !Number.isInteger(max) || min < 1 || max > 20 || min > max) return invalid('Prüfe die Spielerzahl: mindestens 1, höchstens 20 und Minimum nicht größer als Maximum.', $('#creator-min-players'));
    }
    if (step === 3) {
      const packs = readPacks();
      if (!packs.length) return invalid('Erstelle mindestens eine Kategorie.', $('#add-pack'));
      const names = new Set();
      for (const [index, pack] of packs.entries()) {
        const key = pack.name.toLocaleLowerCase('de-DE');
        if (pack.name.length < 2) return invalid(`Kategorie ${index + 1} braucht einen Namen.`, $$('#pack-editor .pack-name')[index]);
        if (names.has(key)) return invalid('Kategorienamen dürfen nicht doppelt vorkommen.', $$('#pack-editor .pack-name')[index]);
        names.add(key);
        if (pack.items.length < 3) return invalid(`Kategorie „${pack.name}“ braucht mindestens drei gültige Karten.`, $$('#pack-editor .pack-items')[index]);
      }
    }
    return true;
  }

  function invalid(message, control) {
    setStatus(message, true);
    control?.focus();
    return false;
  }

  function setStep(nextStep) {
    step = Math.max(1, Math.min(4, nextStep));
    $$('.wizard-step').forEach(section => { section.hidden = Number(section.dataset.step) !== step; });
    $('#wizard-progress-text').textContent = `Schritt ${step} von 4`;
    $('#wizard-progress-bar').style.width = `${step * 25}%`;
    $('#wizard-back').hidden = step === 1;
    $('#wizard-next').hidden = step === 4;
    $('#wizard-next').textContent = step === 1 ? 'Weiter zu Details' : step === 2 ? 'Weiter zu Inhalten' : 'Weiter zur Prüfung';
    if (step === 4) updateReview();
    document.querySelector(`.wizard-step[data-step="${step}"] h3`)?.focus?.();
    window.scrollTo({ top: Math.max(0, $('.creator-wizard').offsetTop - 18), behavior: 'smooth' });
  }

  function updatePreview() {
    const title = clean($('#creator-title')?.value, 50) || 'Dein Spielname';
    const description = clean($('#creator-description')?.value, 180) || 'Eine kurze Erklärung zeigt der Gruppe sofort, was sie tun soll.';
    const group = clean($('#creator-group')?.value, 30) || 'Eigene Spiele';
    const min = Math.max(1, Math.min(20, Number($('#creator-min-players')?.value) || 2));
    const max = Math.max(min, Math.min(20, Number($('#creator-max-players')?.value) || 20));
    const duration = Math.max(3, Math.min(90, Number($('#creator-duration')?.value) || 15));
    $('#preview-icon').textContent = selectedIcon;
    $('#preview-group').textContent = group;
    $('#preview-name').textContent = title;
    $('#preview-description').textContent = description;
    $('#preview-players').textContent = `${min}–${max} Personen`;
    $('#preview-duration').textContent = `ca. ${duration} Min.`;
    $('#creator-preview-card').className = `creator-preview-card accent-${selectedAccent}`;
  }

  function updateReview() {
    const draft = readDraft();
    const packs = draft.packs;
    const total = packs.reduce((sum, pack) => sum + pack.items.length, 0);
    const rows = [
      ['Vorlage', template().title],
      ['Spielname', clean(draft.title, 50) || 'Fehlt'],
      ['Kategorie', clean(draft.group, 30) || 'Eigene Spiele'],
      ['Gruppe', `${draft.minPlayers}–${draft.maxPlayers} Personen`],
      ['Dauer', `ca. ${draft.duration} Minuten`],
      ['Inhalte', `${packs.length} Kategorien · ${total} Karten`],
      ['Altersstufe', draft.age === 'teen' ? 'Ab 12 empfohlen' : 'Familienfreundlich']
    ];
    const summary = $('#review-summary');
    summary.replaceChildren();
    for (const [label, value] of rows) {
      const row = element('div', 'review-row');
      row.append(element('strong', '', label), element('span', '', String(value)));
      summary.append(row);
    }
  }

  function resetForm() {
    editingId = null;
    selectedTemplate = 'prompt';
    selectedIcon = '🎉';
    selectedAccent = 'violet';
    $('#creator-form').reset();
    $('#creator-group').value = 'Eigene Spiele';
    $('#creator-min-players').value = '2';
    $('#creator-max-players').value = '20';
    $('#creator-duration').value = '15';
    $('#creator-age').value = 'all';
    $('#creator-safe-confirm').checked = false;
    $('#pack-editor').replaceChildren();
    packCounter = 0;
    addPack({ name: 'Standard', items: Creator.parseCards(Creator.templates.prompt.example, 'prompt') });
    renderTemplates();
    renderIconPicker();
    renderAccentPicker();
    selectTemplate('prompt');
    setStep(1);
    updatePreview();
    history.replaceState(null, '', 'creator.html');
    setStatus('Neues Spiel vorbereitet. Wähle zuerst eine Vorlage.');
  }

  function loadGame(id) {
    const game = store.get(id);
    if (!game) return setStatus('Das eigene Spiel wurde nicht gefunden.', true);
    editingId = game.id;
    selectedTemplate = game.templateId;
    selectedIcon = game.icon;
    selectedAccent = game.accent;
    $('#creator-title').value = game.title;
    $('#creator-description').value = game.description;
    $('#creator-group').value = game.group;
    $('#creator-min-players').value = String(game.minPlayers);
    $('#creator-max-players').value = String(game.maxPlayers);
    $('#creator-duration').value = String(game.duration);
    $('#creator-age').value = game.age;
    $('#creator-safe-confirm').checked = false;
    $('#pack-editor').replaceChildren();
    packCounter = 0;
    game.packs.forEach(addPack);
    renderTemplates();
    renderIconPicker();
    renderAccentPicker();
    selectTemplate(game.templateId);
    setStep(2);
    updatePreview();
    setStatus(`„${game.title}“ wird bearbeitet.`);
    history.replaceState(null, '', `creator.html?edit=${encodeURIComponent(game.id)}`);
  }

  function saveGame(event) {
    event.preventDefault();
    if (!validateCurrentStep()) return;
    if (!$('#creator-safe-confirm').checked) return invalid('Bestätige vor dem Speichern die Inhaltsprüfung.', $('#creator-safe-confirm'));
    try {
      const game = store.save(readDraft());
      editingId = game.id;
      renderLibrary();
      setStatus(`„${game.title}“ wurde lokal gespeichert und ist jetzt im Party Hub spielbar.`);
      history.replaceState(null, '', `creator.html?edit=${encodeURIComponent(game.id)}`);
      const actions = $('#review-summary');
      const success = element('div', 'creator-save-success');
      success.append(
        element('strong', '', 'Spiel gespeichert'),
        element('p', '', 'Teste es direkt mit deiner aktuellen Spielergruppe.'),
        createLink(`party.html?game=${encodeURIComponent(game.id)}`, 'Im Party Hub testen')
      );
      actions.prepend(success);
    } catch (error) {
      setStatus(error.message || 'Das eigene Spiel konnte nicht gespeichert werden.', true);
    }
  }

  function createLink(href, text) {
    const link = element('a', 'button-link', text);
    link.href = href;
    return link;
  }

  function renderLibrary() {
    const games = store.list();
    const list = $('#created-games-list');
    list.replaceChildren();
    if (!games.length) {
      list.className = 'created-games-list empty-state';
      list.textContent = 'Noch kein eigenes Spiel gespeichert. Erstelle oben dein erstes Spiel.';
      return;
    }
    list.className = 'created-games-list';
    for (const game of games) {
      const card = element('article', `created-game-card accent-${game.accent}`);
      const top = element('div', 'created-game-top');
      top.append(element('span', 'created-game-icon', game.icon), element('span', 'badge', Creator.templates[game.templateId]?.title || 'Eigenes Spiel'));
      card.append(top, element('h3', '', game.title), element('p', '', game.description));
      const count = game.packs.reduce((sum, pack) => sum + pack.items.length, 0);
      const meta = element('div', 'created-game-meta');
      meta.append(element('span', '', `${game.minPlayers}–${game.maxPlayers} Personen`), element('span', '', `${game.packs.length} Kategorien`), element('span', '', `${count} Karten`));
      card.append(meta);
      const actions = element('div', 'created-game-actions');
      actions.append(
        createLink(`party.html?game=${encodeURIComponent(game.id)}`, 'Testen'),
        creatorAction('Bearbeiten', () => loadGame(game.id)),
        creatorAction('Kopieren', () => duplicateGame(game.id), 'secondary'),
        creatorAction('Löschen', () => deleteGame(game.id), 'secondary')
      );
      card.append(actions);
      list.append(card);
    }
  }

  function creatorAction(text, handler, className = '') {
    const button = element('button', className, text);
    button.type = 'button';
    button.addEventListener('click', handler);
    return button;
  }

  function duplicateGame(id) {
    try {
      const copy = store.duplicate(id);
      renderLibrary();
      loadGame(copy.id);
      setStatus(`Kopie „${copy.title}“ erstellt.`);
    } catch (error) {
      setStatus(error.message || 'Spiel konnte nicht kopiert werden.', true);
    }
  }

  function deleteGame(id) {
    const game = store.get(id);
    if (!game || !confirm(`Eigenes Spiel „${game.title}“ wirklich löschen?`)) return;
    try {
      store.remove(id);
      if (editingId === id) resetForm();
      renderLibrary();
      setStatus(`„${game.title}“ wurde gelöscht.`);
    } catch (error) {
      setStatus(error.message || 'Spiel konnte nicht gelöscht werden.', true);
    }
  }

  function exportLibrary() {
    if (!store.list().length) return setStatus('Es gibt noch keine eigenen Spiele zum Exportieren.', true);
    const blob = new Blob([store.exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `secret-circle-eigene-spiele-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus('Eigene Spiele wurden als JSON exportiert.');
  }

  async function importLibrary(file) {
    if (!file) return;
    if (file.size > 1_500_000) return setStatus('Die Importdatei ist zu groß.', true);
    try {
      const text = await file.text();
      store.importData(text);
      renderLibrary();
      setStatus('Eigene Spiele wurden geprüft und importiert.');
    } catch (error) {
      setStatus(error.message || 'Import fehlgeschlagen.', true);
    } finally {
      $('#import-created-games').value = '';
    }
  }

  function showHelp(key, trigger) {
    const help = HELP[key];
    if (!help) return;
    lastHelpTrigger = trigger;
    $('#creator-help-title').textContent = help.title;
    const content = $('#creator-help-content');
    content.replaceChildren();
    const list = element('ul');
    help.items.forEach(item => list.append(element('li', '', item)));
    content.append(list);
    $('#creator-help').hidden = false;
    $('#close-creator-help').focus();
  }

  function closeHelp() {
    $('#creator-help').hidden = true;
    lastHelpTrigger?.focus();
  }

  function bindEvents() {
    $('#wizard-next').addEventListener('click', () => { if (validateCurrentStep()) setStep(step + 1); });
    $('#wizard-back').addEventListener('click', () => setStep(step - 1));
    $('#add-pack').addEventListener('click', () => addPack());
    $('#creator-form').addEventListener('submit', saveGame);
    $('#new-game').addEventListener('click', () => { if (!editingId || confirm('Aktuelle Eingaben verwerfen und ein neues Spiel beginnen?')) resetForm(); });
    $('#export-created-games').addEventListener('click', exportLibrary);
    $('#import-created-games-trigger').addEventListener('click', () => $('#import-created-games').click());
    $('#import-created-games').addEventListener('change', event => importLibrary(event.target.files?.[0]));
    $$('[data-creator-help]').forEach(button => button.addEventListener('click', () => showHelp(button.dataset.creatorHelp, button)));
    $('#close-creator-help').addEventListener('click', closeHelp);
    $('#creator-help').addEventListener('click', event => { if (event.target === $('#creator-help')) closeHelp(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && !$('#creator-help').hidden) closeHelp(); });
    ['creator-title', 'creator-description', 'creator-group', 'creator-min-players', 'creator-max-players', 'creator-duration'].forEach(id => $(`#${id}`).addEventListener('input', updatePreview));
  }

  function initialize() {
    renderTemplates();
    renderIconPicker();
    renderAccentPicker();
    addPack({ name: 'Standard', items: Creator.parseCards(Creator.templates.prompt.example, 'prompt') });
    bindEvents();
    renderLibrary();
    selectTemplate('prompt');
    updatePreview();
    const editId = new URLSearchParams(location.search).get('edit');
    if (editId) loadGame(editId);
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => setStatus('Offline-Modus konnte nicht aktiviert werden.', true));
  }

  initialize();
})();
