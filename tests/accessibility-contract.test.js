'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = relative => fs.readFileSync(path.resolve(__dirname, '..', relative), 'utf8');

const pages = {
  'index.html': read('index.html'),
  'party.html': read('party.html'),
  'advanced.html': read('advanced.html'),
  'quick-play.html': read('quick-play.html'),
  'creator.html': read('creator.html')
};

for (const [name, source] of Object.entries(pages)) {
  assert.match(source, /<html lang="de">/, `${name} must declare German language.`);
  assert.match(source, /<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">/, `${name} must use responsive safe-area viewport.`);
  assert.match(source, /class="skip-link"/, `${name} must provide a skip link.`);
  assert.match(source, /<main\b/, `${name} must provide a main landmark.`);
  assert.doesNotMatch(source, /<(?:audio|video)[^>]*\bautoplay\b/i, `${name} must not autoplay media.`);
}

const party = pages['party.html'];
assert.match(party, /role="status" aria-live="polite"/);
assert.match(party, /id="game-detail"[^>]*aria-modal="true"[^>]*role="dialog"/);
assert.match(party, /id="play-layer"[^>]*aria-labelledby="play-title"[^>]*aria-modal="true"[^>]*role="dialog"/);
assert.match(party, /Persönliche Inhalte sind freiwillig/);
assert.match(party, /Überspringen ist jederzeit erlaubt/);
assert.match(party, /id="pause-hub-game"[^>]*aria-pressed="false"/);

const advanced = pages['advanced.html'];
assert.match(advanced, /Persönliche Aussagen und Antworten sind freiwillig/);
assert.match(advanced, /aria-live="polite"/);

const quick = pages['quick-play.html'];
assert.match(quick, /id="quick-pause"[^>]*aria-pressed="false"/);
assert.match(quick, /id="quick-pause-overlay"[^>]*role="status"[^>]*aria-live="polite"/);

const creator = pages['creator.html'];
assert.match(creator, /role="radiogroup"/);
assert.match(creator, /aria-label="Spielvorlage auswählen"/);
assert.match(creator, /role="status" aria-live="polite"/);

const partyCss = read('party.css');
const extraCss = read('party-extra.css');
const creatorCss = read('creator.css');
const searchSource = read('party-search-assist.js');
const polishSource = read('party-hub-polish.js');
const hubA11y = read('party-hub-a11y.js');

assert.match(partyCss, /:focus-visible/);
assert.match(partyCss, /outline:3px solid var\(--accent\)/);
assert.match(partyCss, /button\{min-height:46px/);
assert.match(partyCss, /\.hub-nav button\{min-height:44px/);
assert.match(partyCss, /@media \(prefers-reduced-motion:reduce\)/);
assert.match(extraCss, /@media\(prefers-reduced-motion:reduce\)/);
assert.match(creatorCss, /@media\(prefers-reduced-motion:reduce\)/);

for (const marker of ['aria-autocomplete', 'listbox', 'ArrowDown', 'ArrowUp', 'Enter', 'Escape']) {
  assert.match(searchSource, new RegExp(marker), `Search accessibility marker missing: ${marker}`);
}

assert.match(extraCss, /\.hub-session-controls \.ghost-button\{min-height:44px/);
assert.match(extraCss, /\.favorite-button[^}]*min-height:44px/);
assert.match(extraCss, /\.close-button[^}]*min-height:44px/);

assert.match(polishSource, /party-hub-a11y\.js/);
assert.match(polishSource, /loadHubA11y/);
assert.match(hubA11y, /version: 2/);
assert.match(hubA11y, /node\.inert = Boolean\(overlay\)/);
assert.match(hubA11y, /heading\.setAttribute\('tabindex', '-1'\)/);
assert.match(hubA11y, /document\.addEventListener\('keydown', trapOverlayFocus, true\)/);
assert.match(hubA11y, /event\.key !== 'Tab'/);
assert.match(hubA11y, /last\.focus\(\)/);
assert.match(hubA11y, /first\.focus\(\)/);

console.log(JSON.stringify({
  accessibilityContract: 'PASS',
  languageAndViewport: true,
  skipLinks: true,
  mainLandmarks: true,
  visibleFocusContract: true,
  hubViewHeadingFocusContract: true,
  modalBackgroundIsolation: true,
  modalFocusTrapContract: true,
  activeGameDialogSemantics: true,
  reducedMotionContract: true,
  minimumCriticalTouchTarget: 44,
  searchKeyboardContract: true,
  consentAndSkipCopyVisible: true,
  autoplayMediaRejected: true,
  manual200PercentZoomStillRequired: true,
  manualScreenReaderStillRequired: true,
  realDeviceAccessibilityStillRequired: true
}, null, 2));
