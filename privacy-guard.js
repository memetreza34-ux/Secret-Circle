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

  function focusShowButton() {
    root.requestAnimationFrame(() => document.querySelector('#show-card')?.focus());
  }

  function clearSecretText() {
    document.querySelector('#role')?.replaceChildren();
    document.querySelector('#word')?.replaceChildren();
    document.querySelector('#hint-text')?.replaceChildren();
    try { root.getSelection?.()?.removeAllRanges(); } catch {}
  }

  function concealSecret() {
    if (!revealScreenIsActive() || !secretIsVisible()) return false;
    const secret = document.querySelector('#secret');
    const showButton = document.querySelector('#show-card');
    const nextButton = document.querySelector('#next-player');
    const note = document.querySelector('#handoff-note');

    secret.hidden = true;
    clearSecretText();
    if (showButton) showButton.hidden = false;
    if (nextButton) nextButton.hidden = true;
    if (note) note.textContent = 'Die Karte wurde automatisch verdeckt. Nur die aktuelle Person darf sie erneut öffnen.';
    concealedWhileAway = true;
    document.dispatchEvent(new CustomEvent('secretcircle:card-concealed'));
    return true;
  }

  function restoreFocusAfterReturn() {
    if (!concealedWhileAway) return;
    concealedWhileAway = false;
    focusShowButton();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) concealSecret();
    else restoreFocusAfterReturn();
  });

  root.addEventListener('blur', concealSecret);
  root.addEventListener('focus', restoreFocusAfterReturn);
  root.addEventListener('pagehide', concealSecret);
  document.addEventListener('freeze', concealSecret);

  document.querySelector('#next-player')?.addEventListener('click', event => {
    if (!secretIsVisible()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      focusShowButton();
    }
  }, true);

  root.SecretCirclePrivacyGuard = Object.freeze({
    concealSecret,
    version: 3
  });
})(window);
