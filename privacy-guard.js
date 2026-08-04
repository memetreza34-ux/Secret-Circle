'use strict';

(function initialisePrivacyGuard(root) {
  let concealedWhileAway = false;

  function revealScreenIsActive() {
    const screen = document.querySelector('#reveal-screen');
    return Boolean(screen && !screen.hidden);
  }

  function secretIsVisible() {
    const secret = document.querySelector('#secret');
    return Boolean(secret && !secret.hidden);
  }

  function concealSecret() {
    if (!revealScreenIsActive() || !secretIsVisible()) return false;
    const secret = document.querySelector('#secret');
    const showButton = document.querySelector('#show-card');
    const nextButton = document.querySelector('#next-player');
    const note = document.querySelector('#handoff-note');

    secret.hidden = true;
    if (showButton) showButton.hidden = false;
    if (nextButton) nextButton.hidden = true;
    if (note) note.textContent = 'Die Karte wurde automatisch verdeckt. Nur die aktuelle Person darf sie erneut öffnen.';
    concealedWhileAway = true;
    return true;
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      concealSecret();
      return;
    }
    if (concealedWhileAway) {
      concealedWhileAway = false;
      root.requestAnimationFrame(() => document.querySelector('#show-card')?.focus());
    }
  });

  root.addEventListener('blur', concealSecret);
  root.addEventListener('pagehide', concealSecret);

  root.SecretCirclePrivacyGuard = Object.freeze({
    concealSecret,
    version: 1
  });
})(window);
