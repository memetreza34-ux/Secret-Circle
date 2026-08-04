'use strict';

(function initialiseSetupUx(root) {
  const playersField = document.querySelector('#players');
  const impostersField = document.querySelector('#imposters');
  const playersHelp = document.querySelector('#players-help');
  const impostersHelp = document.querySelector('#imposters-help');
  if (!playersField || !impostersField || !playersHelp || !impostersHelp) return;

  function normalizedNames() {
    return playersField.value
      .split(/\n|,/)
      .map(name => name.trim().replace(/\s+/g, ' '))
      .filter(Boolean);
  }

  function update() {
    const names = normalizedNames();
    const uniqueCount = new Set(names.map(name => name.toLocaleLowerCase('de-DE'))).size;
    const duplicateCount = names.length - uniqueCount;
    const maximumImposters = Math.max(1, Math.min(6, uniqueCount - 1));
    impostersField.max = String(maximumImposters);

    if (Number(impostersField.value) > maximumImposters) {
      impostersField.value = String(maximumImposters);
    }

    if (uniqueCount < 3) {
      playersHelp.textContent = `${uniqueCount} von mindestens 3 Personen erkannt.`;
    } else if (uniqueCount > 20) {
      playersHelp.textContent = `${uniqueCount} Personen erkannt. Höchstens 20 sind erlaubt.`;
    } else if (duplicateCount > 0) {
      playersHelp.textContent = `${uniqueCount} eindeutige Personen erkannt. ${duplicateCount} doppelter Name muss korrigiert werden.`;
    } else {
      playersHelp.textContent = `${uniqueCount} eindeutige Personen erkannt.`;
    }

    impostersHelp.textContent = `Für diese Gruppe sind 1 bis ${maximumImposters} Imposter möglich.`;
  }

  playersField.addEventListener('input', update);
  playersField.addEventListener('change', update);
  update();

  root.SecretCircleSetupUx = Object.freeze({
    update,
    version: 1
  });
})(window);
