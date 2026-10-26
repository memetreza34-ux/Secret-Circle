'use strict';
const { test, expect } = require('@playwright/test');
const KEY = 'secret-circle-party-mega-active-v1';
const HUB = 'secret-circle-party-hub-v1';
const PLAYERS = ['Alex', 'Sam', 'Mika', 'Lina'];
const state = page => page.evaluate(key => JSON.parse(localStorage.getItem(key)), KEY);
const action = (page, name) => page.getByRole('button', { name, exact: true }).click();
async function ready(page) {
  const pause = page.locator('#quick-pause');
  if (await pause.getAttribute('aria-pressed') === 'true') await pause.click();
  await action(page, 'Ich bin bereit');
}
async function start(page, id, count = '3') {
  await page.goto('/');
  await page.evaluate(({ key, players }) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({ version: 1, players, favorites: [], recent: [], presets: [], history: [], stats: {} }));
  }, { key: HUB, players: PLAYERS });
  await page.goto('/#spiel=' + id);
  await expect(page.locator('#start-btn')).toBeEnabled();
  await page.locator('#start-btn').click();
  await expect(page).toHaveURL(new RegExp('quick-play.html\\?game=' + id));
  await expect(page.locator('#quick-start')).toBeEnabled();
  await page.locator('#quick-rounds').selectOption(count);
  await page.locator('#quick-start').click();
  await expect(page.locator('#quick-play')).toBeVisible();
  await expect(page.locator('[data-game-engine]')).toHaveAttribute('src', 'party-classic-modes.js');
  await expect(page.locator('[data-game-engine]')).toHaveCount(1);
}
async function history(page, id, score) {
  await expect(page.locator('#quick-result')).toBeVisible();
  const entries = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).history, HUB);
  expect(entries).toHaveLength(1);
  expect(entries[0].gameId).toBe(id);
  expect(entries[0].score).toBe(score);
  expect(entries[0].players).toEqual(PLAYERS);
  expect(await state(page)).toBeNull();
  await page.reload();
  await expect(page.locator('#quick-setup')).toBeVisible();
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).history.length, HUB)).toBe(1);
}

test('Bildketten: echte Zeichnung, verdeckte Übergabe, Entwurf, Ergebnis und Wiederholen', async ({ page }, testInfo) => {
  await start(page, 'drawing-telephone');
  for (let round = 0; round < 3; round++) {
    for (let player = 0; player < PLAYERS.length; player++) {
      await ready(page);
      if (player % 2 === 0) {
        if (round === 0 && player === 0) {
          const canvas = page.locator('canvas');
          await canvas.scrollIntoViewIfNeeded();
          const box = await canvas.boundingBox();
          await page.mouse.move(box.x + box.width * .2, box.y + box.height * .3);
          await page.mouse.down();
          await page.mouse.move(box.x + box.width * .65, box.y + box.height * .7, { steps: 8 });
          await page.mouse.up();
          expect((await state(page)).current.draft[0].length).toBeGreaterThan(1);
          await page.locator('textarea').fill('Mein geheimer Zeichenentwurf');
          await page.evaluate(() => window.dispatchEvent(new Event('blur')));
          await expect(page.locator('canvas,textarea')).toHaveCount(0);
          await page.reload();
          await page.locator('#quick-resume').click();
          await ready(page);
          await expect(page.locator('textarea')).toHaveValue('Mein geheimer Zeichenentwurf');
          expect((await state(page)).current.draft[0].length).toBeGreaterThan(1);
          if (testInfo.project.name === 'chromium-desktop') {
            await page.setViewportSize({ width: 1440, height: 1000 });
            await page.locator('textarea').focus();
            await page.screenshot({ path: '.cache/classics-evidence/zeichnen-desktop.png', fullPage: true });
            await page.setViewportSize({ width: 375, height: 812 });
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
            await page.locator('textarea').focus();
            await page.screenshot({ path: '.cache/classics-evidence/zeichnen-handy.png', fullPage: true });
          }
        } else await page.locator('textarea').fill('Ein fliegender Koffer');
        await action(page, 'Zeichnung weitergeben');
      } else {
        await page.locator('textarea').fill('Ein Koffer in den Wolken');
        await action(page, 'Beschreibung weitergeben');
      }
      await expect(page.locator('textarea,canvas')).toHaveCount(0);
      await expect(page.locator('#quick-content')).not.toContainText('geheimer Zeichenentwurf');
    }
    await ready(page);
    await expect(page.locator('#quick-content .classic-step')).toHaveCount(4);
    await action(page, round === 2 ? 'Bildketten abschließen' : 'Nächste Bildkette');
  }
  await expect(page.locator('#quick-result-text')).toContainText('keinen Gewinner');
  await page.locator('#quick-replay').click();
  await expect(page.locator('#quick-play')).toBeVisible();
  expect((await state(page)).round).toBe(1);
  await ready(page);
  await action(page, 'Beenden & speichern');
  const entries = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).history, HUB);
  expect(entries).toHaveLength(2);
  expect(new Set(entries.map(entry => entry.id)).size).toBe(2);
});

test('Koffer: Gedächtnis bleibt verborgen, Gruppe prüft einmal, falscher Zug ändert Liste nicht', async ({ page }) => {
  await start(page, 'packing-suitcase');
  for (let turn = 0; turn < 3; turn++) {
    await ready(page);
    if (turn > 0) await expect(page.locator('#quick-content')).not.toContainText('Zahnbürste');
    await page.locator('textarea').fill(turn === 0 ? 'Zahnbürste' : turn === 1 ? 'Buch' : 'Regenschirm');
    await action(page, 'Zur Gruppenprüfung weitergeben');
    await expect(page.locator('#quick-content')).not.toContainText('Zahnbürste');
    await ready(page);
    const button = page.getByRole('button', { name: turn === 1 ? 'Nicht geschafft' : 'Richtig wiederholt', exact: true });
    await button.evaluate(element => { element.click(); element.click(); });
    expect((await state(page)).totalScore).toBe(turn === 2 ? 2 : 1);
    expect((await state(page)).current.list).toEqual(turn === 2 ? ['Zahnbürste', 'Regenschirm'] : ['Zahnbürste']);
    await action(page, turn === 2 ? 'Koffer-Runde abschließen' : 'Nächste Person');
  }
  await history(page, 'packing-suitcase', 2);
});

test('Begrifferaten: gleicher Stapel in drei Phasen, überspringen, Teamwechsel und genau einmal Punkte', async ({ page }) => {
  await start(page, 'three-rounds');
  const deck = (await state(page)).current.deck;
  await ready(page);
  await action(page, 'Begriff überspringen');
  expect((await state(page)).current.bag).toEqual([1, 2, 0]);
  await action(page, 'Teamzug beenden');
  expect((await state(page)).current.team).toBe(1);
  for (let phase = 1; phase <= 3; phase++) {
    await ready(page);
    expect((await state(page)).current.deck).toEqual(deck);
    for (let hit = 0; hit < 3; hit++) await action(page, 'Erraten');
    expect((await state(page)).totalScore).toBe(phase * 3);
    if (phase < 3) await action(page, 'Nächste Phase');
  }
  await action(page, 'Ergebnis speichern');
  await history(page, 'three-rounds', 9);
});

test('Timer und Geheimhaltung: Unterbrechung und Reload behalten die Restzeit und denselben Begriff', async ({ page }) => {
  await page.clock.install();
  await start(page, 'three-rounds');
  await ready(page);
  await page.clock.runFor(12500);
  const before = await state(page);
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await expect(page.locator('#quick-content .challenge-card')).toHaveCount(0);
  const paused = await state(page);
  expect(paused.current.remainingMs).toBeLessThanOrEqual(48000);
  expect(paused.current.remainingMs).toBeGreaterThan(46000);
  await page.reload();
  await page.locator('#quick-resume').click();
  await ready(page);
  const after = await state(page);
  expect(after.current.bag).toEqual(before.current.bag);
  expect(after.current.deck).toEqual(before.current.deck);
  await expect(page.locator('#quick-controls')).not.toContainText('1:00');
  await page.clock.runFor(61000);
  await expect(page.getByRole('button', { name: 'Ich bin bereit', exact: true })).toBeVisible();
  expect((await state(page)).current.team).toBe(1);
});

test('Abschlussfehler ist wiederholbar, ein neuer Start ersetzt fremde Sitzung nur nach Bestätigung', async ({ page }) => {
  await start(page, 'packing-suitcase');
  await ready(page);
  await page.evaluate(key => {
    const original = Storage.prototype.setItem;
    window.restoreStorage = () => { Storage.prototype.setItem = original; };
    Storage.prototype.setItem = function (name, value) { if (name === key) throw Error('voll'); return original.call(this, name, value); };
  }, HUB);
  await action(page, 'Beenden & speichern');
  await expect(page.locator('#quick-status')).toContainText('Verlauf konnte nicht gespeichert');
  expect(await state(page)).not.toBeNull();
  await page.evaluate(() => window.restoreStorage());
  await action(page, 'Beenden & speichern');
  await history(page, 'packing-suitcase', 0);
  await page.locator('#quick-start').click();
  const original = await state(page);
  await page.goto('/quick-play.html?game=three-rounds');
  page.once('dialog', dialog => dialog.dismiss());
  await page.locator('#quick-start').click();
  expect((await state(page)).sessionId).toBe(original.sessionId);
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#quick-start').click();
  expect((await state(page)).gameId).toBe('three-rounds');
});

test('Manipulierte private Zeichnungen werden nicht angezeigt oder fortgesetzt', async ({ page }) => {
  await start(page, 'drawing-telephone');
  await page.evaluate(key => {
    const snapshot = JSON.parse(localStorage.getItem(key));
    snapshot.current.draft = [[[1001, -1]]];
    snapshot.phase = 'card';
    localStorage.setItem(key, JSON.stringify(snapshot));
  }, KEY);
  await page.reload();
  await expect(page.locator('#quick-resume-box')).toBeHidden();
  await expect(page.locator('canvas,textarea')).toHaveCount(0);
});
