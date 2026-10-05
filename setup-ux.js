'use strict';

(function initialiseSetupUx(root) {
  const playersField = document.querySelector('#players');
  const impostersField = document.querySelector('#imposters');
  const playersHelp = document.querySelector('#players-help');
  const impostersHelp = document.querySelector('#imposters-help');
  const startButton = document.querySelector('#start');
  const chipList = document.querySelector('#player-chips');
  const addForm = document.querySelector('#player-add');
  const nameInput = document.querySelector('#player-new-name');
  const MAX_PLAYERS = 20;
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

  /* Die Namens-Chips sind die sichtbare Spielerliste. Gespeichert und geprüft
     wird weiter das Datenfeld #players, damit app.js unverändert bleibt. */
  function writeNames(names) {
    playersField.value = names.join('\n');
    playersField.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function renderChips(names) {
    if (!chipList) return;
    const seen = new Set();
    chipList.replaceChildren(...names.map((name, index) => {
      const key = name.toLocaleLowerCase('de-DE');
      const item = document.createElement('li');
      const label = document.createElement('span');
      const remove = document.createElement('button');
      if (seen.has(key)) item.className = 'duplicate';
      seen.add(key);
      label.textContent = name;
      remove.type = 'button';
      remove.textContent = '×';
      remove.setAttribute('aria-label', `${name} entfernen`);
      remove.addEventListener('click', () => {
        writeNames(normalizedNames().filter((_, position) => position !== index));
        nameInput?.focus();
      });
      item.append(label, remove);
      return item;
    }));
  }

  function addPlayer(event) {
    event.preventDefault();
    const name = nameInput.value.trim().replace(/\s+/g, ' ');
    if (!name) {
      nameInput.focus();
      return;
    }
    const names = normalizedNames();
    if (names.some(existing => existing.toLocaleLowerCase('de-DE') === name.toLocaleLowerCase('de-DE'))) {
      playersHelp.textContent = `${name} ist schon dabei.`;
      nameInput.select();
      return;
    }
    if (names.length >= MAX_PLAYERS) {
      playersHelp.textContent = `Höchstens ${MAX_PLAYERS} Spieler.`;
      return;
    }
    nameInput.value = '';
    writeNames([...names, name]);
    nameInput.focus();
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

    renderChips(names);
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

  addForm?.addEventListener('submit', addPlayer);
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
