'use strict';

(function initialiseSetupUx(root) {
  const playersField = document.querySelector('#players');
  const impostersField = document.querySelector('#imposters');
  const playersHelp = document.querySelector('#players-help');
  const impostersHelp = document.querySelector('#imposters-help');
  const startButton = document.querySelector('#start');
  if (!playersField || !impostersField || !playersHelp || !impostersHelp) return;

  function addQuickGuide() {
    const title = document.querySelector('#setup-title');
    if (!title || document.querySelector('#imposter-quick-guide')) return;
    const guide = document.createElement('ol');
    guide.id = 'imposter-quick-guide';
    guide.className = 'rules setup-quick-guide';
    guide.setAttribute('aria-label', 'Word Imposter kurz erklärt');
    ['Namen und Kategorie festlegen.', 'Jede Person sieht ihre Karte allein.', 'Hinweise geben, geheim abstimmen und Punkte sammeln.'].forEach(text => {
      const item = document.createElement('li');
      item.textContent = text;
      guide.append(item);
    });
    title.insertAdjacentElement('afterend', guide);
  }

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
    const recommended = recommendedImposters(uniqueCount, maximumImposters);

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
      playersHelp.textContent = `${uniqueCount} eindeutige Personen erkannt. Bereit zum Spielen.`;
    }

    if (!validImposters) {
      impostersHelp.textContent = `Bitte eine ganze Zahl zwischen 1 und ${maximumImposters} wählen.`;
    } else {
      impostersHelp.textContent = `1 bis ${maximumImposters} möglich · Empfehlung für ${uniqueCount} Personen: ${recommended}.`;
    }
  }

  function refreshAfterAsyncAction() {
    root.setTimeout(update, 0);
    root.setTimeout(update, 250);
  }

  playersField.addEventListener('input', update);
  playersField.addEventListener('change', update);
  impostersField.addEventListener('input', update);
  impostersField.addEventListener('change', update);
  document.querySelector('#clear-all-data')?.addEventListener('click', refreshAfterAsyncAction);
  document.querySelector('#import-data')?.addEventListener('change', refreshAfterAsyncAction);
  root.addEventListener('pageshow', update);

  addQuickGuide();
  update();
  refreshAfterAsyncAction();

  root.SecretCircleSetupUx = Object.freeze({ update, addQuickGuide, recommendedImposters, version: 5 });
})(window);
