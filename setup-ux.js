'use strict';

(function initialiseSetupUx(root) {
  const playersField = document.querySelector('#players');
  const impostersField = document.querySelector('#imposters');
  const playersHelp = document.querySelector('#players-help');
  const impostersHelp = document.querySelector('#imposters-help');
  const startButton = document.querySelector('#start');
  const playerList = document.querySelector('#player-list');
  const addButton = document.querySelector('#add-player');
  const MAX_PLAYERS = 20;
  const AVATAR_COLORS = ['#FFB020', '#4DD9A0', '#A78BFA', '#F472B6', '#38BDF8', '#FF8A65'];
  let writingFromList = false;
  if (!playersField || !impostersField || !playersHelp || !impostersHelp) return;

  function normalizedNames() {
    return playersField.value
      .split(/\n|,/)
      .map(name => name.trim().replace(/\s+/g, ' '))
      .filter(Boolean);
  }

  function recommendedImposters(playerCount, maximum) {
    const suggested = playerCount <= 6 ? 1 : playerCount <= 10 ? 2 : playerCount <= 15 ? 3 : 4;
    return Math.max(1, Math.min(maximum, suggested));
  }

  /* Die Spielerliste zeigt jeden Namen als eigenes, direkt änderbares Feld.
     Gespeichert und geprüft wird weiter das Datenfeld #players, damit app.js unverändert bleibt. */
  function cleanName(value) {
    return value.trim().replace(/\s+/g, ' ');
  }

  function listInputs() {
    return playerList ? [...playerList.querySelectorAll('input')] : [];
  }

  function listNames() {
    return listInputs().map(input => cleanName(input.value)).filter(Boolean);
  }

  function writeFromList() {
    writingFromList = true;
    playersField.value = listNames().join('\n');
    playersField.dispatchEvent(new Event('input', { bubbles: true }));
    writingFromList = false;
  }

  function refreshRows() {
    const seen = new Set();
    listInputs().forEach((input, index) => {
      const row = input.closest('li');
      const name = cleanName(input.value);
      const key = name.toLocaleLowerCase('de-DE');
      const duplicate = Boolean(name) && seen.has(key);
      if (name) seen.add(key);
      row.classList.toggle('duplicate', duplicate);
      input.setAttribute('aria-invalid', String(duplicate));
      input.setAttribute('aria-label', `Spieler ${index + 1}`);
      const avatar = row.querySelector('.avatar');
      avatar.textContent = name ? name.charAt(0).toLocaleUpperCase('de-DE') : '?';
      avatar.style.background = AVATAR_COLORS[index % AVATAR_COLORS.length];
      row.querySelector('button').setAttribute('aria-label', `${name || `Spieler ${index + 1}`} entfernen`);
    });
    if (addButton) addButton.disabled = listInputs().length >= MAX_PLAYERS;
  }

  function makeRow(name) {
    const row = document.createElement('li');
    const avatar = document.createElement('span');
    const input = document.createElement('input');
    const remove = document.createElement('button');
    avatar.className = 'avatar';
    avatar.setAttribute('aria-hidden', 'true');
    input.value = name;
    input.maxLength = 30;
    input.autocomplete = 'off';
    input.enterKeyHint = 'next';
    input.placeholder = 'Name';
    remove.type = 'button';
    remove.textContent = '×';
    input.addEventListener('input', () => {
      writeFromList();
      refreshRows();
    });
    input.addEventListener('keydown', event => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      const next = row.nextElementSibling?.querySelector('input');
      if (next) next.focus();
      else addRow();
    });
    /* Ein leer gelassenes Feld verschwindet wieder, sobald man woanders hintippt. */
    input.addEventListener('blur', () => {
      if (cleanName(input.value) || !row.isConnected) return;
      row.remove();
      refreshRows();
    });
    remove.addEventListener('click', () => {
      const neighbour = row.nextElementSibling || row.previousElementSibling;
      row.remove();
      writeFromList();
      refreshRows();
      (neighbour?.querySelector('input') || addButton)?.focus();
    });
    row.append(avatar, input, remove);
    return row;
  }

  function renderRows(names) {
    if (!playerList) return;
    playerList.replaceChildren(...names.map(makeRow));
    refreshRows();
  }

  function addRow() {
    if (!playerList) return;
    if (listInputs().length >= MAX_PLAYERS) {
      playersHelp.textContent = `Höchstens ${MAX_PLAYERS} Spieler.`;
      return;
    }
    const empty = listInputs().find(input => !cleanName(input.value));
    if (empty) {
      empty.focus();
      return;
    }
    const row = makeRow('');
    playerList.append(row);
    refreshRows();
    row.querySelector('input').focus();
  }

  function stepperControl(stepper) {
    return stepper.querySelector('select, input');
  }

  function stepValue(control, direction) {
    if (control.tagName === 'SELECT') {
      const next = Math.max(0, Math.min(control.options.length - 1, control.selectedIndex + direction));
      if (next === control.selectedIndex) return false;
      control.selectedIndex = next;
      return true;
    }
    const minimum = Number(control.min) || 1;
    const maximum = Number(control.max) || minimum;
    const current = Number.isInteger(Number(control.value)) ? Number(control.value) : minimum;
    const next = Math.max(minimum, Math.min(maximum, current + direction));
    if (String(next) === control.value) return false;
    control.value = String(next);
    return true;
  }

  function refreshSteppers() {
    document.querySelectorAll('.stepper').forEach(stepper => {
      const control = stepperControl(stepper);
      if (!control) return;
      const [less, more] = stepper.querySelectorAll('button[data-step]');
      if (control.tagName === 'SELECT') {
        less.disabled = control.selectedIndex <= 0;
        more.disabled = control.selectedIndex >= control.options.length - 1;
      } else {
        const value = Number(control.value);
        less.disabled = !(value > (Number(control.min) || 1));
        more.disabled = !(value < (Number(control.max) || 1));
      }
    });
  }

  function update() {
    const names = normalizedNames();
    const uniqueCount = new Set(names.map(name => name.toLocaleLowerCase('de-DE'))).size;
    const duplicateCount = names.length - uniqueCount;
    const maximumImposters = Math.max(1, Math.min(6, uniqueCount - 1));

    impostersField.min = '1';
    impostersField.max = String(maximumImposters);
    if (Number(impostersField.value) > maximumImposters) {
      impostersField.value = String(maximumImposters);
      impostersField.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const imposterCount = Number(impostersField.value);
    const validPlayers = duplicateCount === 0 && uniqueCount >= 3 && uniqueCount <= 20;
    const validImposters = Number.isInteger(imposterCount) && imposterCount >= 1 && imposterCount <= maximumImposters;

    playersField.setAttribute('aria-invalid', String(!validPlayers));
    impostersField.setAttribute('aria-invalid', String(!validImposters));
    if (startButton) {
      startButton.disabled = !(validPlayers && validImposters);
      startButton.setAttribute('aria-disabled', String(startButton.disabled));
    }

    if (duplicateCount > 0) {
      playersHelp.textContent = `${uniqueCount} eindeutige Personen erkannt. ${duplicateCount} doppelter Name muss korrigiert werden.`;
    } else if (uniqueCount < 3) {
      playersHelp.textContent = `${uniqueCount} von mindestens 3 Personen erkannt.`;
    } else if (uniqueCount > 20) {
      playersHelp.textContent = `${uniqueCount} Personen erkannt. Höchstens 20 sind erlaubt.`;
    } else {
      playersHelp.textContent = `${uniqueCount} dabei`;
    }

    /* Im gültigen Bereich sorgen die Knöpfe − und + für passende Werte; ein Hinweis erscheint nur bei Fehlern. */
    impostersHelp.textContent = validImposters ? '' : `Bitte eine ganze Zahl zwischen 1 und ${maximumImposters} wählen.`;

    /* Nur neu aufbauen, wenn sich die Namen von außen geändert haben – sonst bleibt beim Tippen der Fokus erhalten. */
    if (!writingFromList && names.join('\n') !== listNames().join('\n')) renderRows(names);
    else refreshRows();
    refreshSteppers();
  }

  document.querySelectorAll('.stepper button[data-step]').forEach(button => {
    button.addEventListener('click', () => {
      const control = stepperControl(button.closest('.stepper'));
      if (!control || !stepValue(control, Number(button.dataset.step))) return;
      control.dispatchEvent(new Event('input', { bubbles: true }));
      control.dispatchEvent(new Event('change', { bubbles: true }));
      refreshSteppers();
    });
  });
  document.querySelectorAll('.stepper select').forEach(select => select.addEventListener('change', refreshSteppers));
  /* Frei getippte Werte bei Rundenzeit und Runden in den erlaubten Bereich holen. */
  document.querySelectorAll('.stepper input[type="number"]').forEach(input => {
    if (input === impostersField) return;
    input.addEventListener('change', () => {
      const minimum = Number(input.min) || 1;
      const maximum = Number(input.max) || minimum;
      const value = Math.round(Number(input.value));
      input.value = String(Number.isFinite(value) && input.value !== '' ? Math.max(minimum, Math.min(maximum, value)) : minimum);
      refreshSteppers();
    });
    input.addEventListener('input', refreshSteppers);
  });

  addButton?.addEventListener('click', addRow);
  playersField.addEventListener('input', update);
  playersField.addEventListener('change', update);
  impostersField.addEventListener('input', update);
  impostersField.addEventListener('change', update);
  root.addEventListener('pageshow', update);

  /* app.js setzt gespeicherte Einstellungen erst nach diesem Skript ein. */
  update();
  root.setTimeout(update, 0);
  root.setTimeout(update, 250);

  root.SecretCircleSetupUx = Object.freeze({ update, recommendedImposters, version: 6 });
})(window);
