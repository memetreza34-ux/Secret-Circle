'use strict';

const screens = [...document.querySelectorAll('[data-screen]')];
const announcement = document.querySelector('#screen-announcement');
const contentMeta = document.querySelector('#content-meta');
const content = window.SecretCircleContent;

// requestAnimationFrame pausiert in unsichtbaren Tabs — dann würde der Fokus nie gesetzt.
const afterPaint = (callback) => (document.hidden ? setTimeout(callback, 0) : requestAnimationFrame(callback));

function labelScreen(screen) {
  const heading = screen.querySelector('h1, h2');
  if (!heading) return;
  if (!heading.id) heading.id = `${screen.id}-heading`;
  heading.tabIndex = -1;
  screen.setAttribute('aria-labelledby', heading.id);
}

function announceVisibleScreen() {
  const screen = screens.find((item) => !item.hidden);
  if (!screen) return;

  const heading = screen.querySelector('h1, h2');
  const target = heading || screen;

  const context = screen.querySelector('.eyebrow')?.textContent?.trim();

  afterPaint(() => {
    target.focus({ preventScroll: false });
    if (!announcement) return;
    announcement.textContent = [context, heading?.textContent?.trim() || 'Neue Ansicht'].filter(Boolean).join('. ');
  });
}

for (const screen of screens) labelScreen(screen);

if (contentMeta && content) {
  contentMeta.textContent = `${content.METADATA.entryCount} Begriffe · ${content.METADATA.packCount} Kategorien · ${content.VERSION}`;
  contentMeta.title = content.METADATA.notice;
}

const observer = new MutationObserver((records) => {
  let screenChanged = false;

  for (const record of records) {
    const target = record.target;
    if (record.type !== 'attributes') continue;
    if (record.attributeName === 'hidden' && target.matches?.('[data-screen]') && !target.hidden) {
      screenChanged = true;
    }
    if (record.attributeName === 'disabled' && !target.disabled && ['next-player', 'next-voter'].includes(target.id)) {
      afterPaint(() => target.focus());
    }
  }

  if (screenChanged) announceVisibleScreen();
});

observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['hidden', 'disabled'] });

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;

  for (const id of ['custom', 'history']) {
    const panel = document.querySelector(`#${id}-panel:not([hidden])`);
    if (!panel) continue;
    const toggle = document.querySelector(`#toggle-${id}`);
    panel.hidden = true;
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.focus();
    return;
  }
});

announceVisibleScreen();
