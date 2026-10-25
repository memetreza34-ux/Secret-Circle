(function (root, factory) {
  const api = Object.freeze(factory());
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCircleClassicModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const IDS = ['drawing-telephone', 'three-rounds', 'packing-suitcase'];
  const clean = value => String(value ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').slice(0, 180);
  const record = value => value && typeof value === 'object' && !Array.isArray(value);
  const integer = (v, min, max) => Number.isInteger(v) && v >= min && v <= max;
  const text = value => typeof value === 'string' && value === clean(value) && value.length >= 1;
  const key = value => clean(value).toLocaleLowerCase('de-DE');
  function shuffle(items, randomInt) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const n = randomInt(i + 1); const j = integer(n, 0, i) ? n : 0;
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function create(id, items, size = 5, randomInt = () => 0) {
    if (!IDS.includes(id) || !Array.isArray(items) || !items.length) throw Error('Spielinhalt fehlt.');
    if (id === 'drawing-telephone') return { kind: id, seed: clean(items[0]), steps: [], draft: [], draftText: '', stage: 'play' };
    if (id === 'packing-suitcase') return { kind: id, list: [], pending: '', correct: null, stage: 'recall' };
    const deck = shuffle([...new Set(items.map(clean).filter(Boolean))], randomInt).slice(0, Math.max(3, Math.min(20, size)));
    return { kind: id, deck, bag: deck.map((_, index) => index), phase: 1, team: 0, teamScores: [0, 0], turn: 0, remainingMs: 60000, stage: 'turn' };
  }
  function validDrawing(strokes) {
    return Array.isArray(strokes) && strokes.length <= 100 && strokes.reduce((sum, stroke) => sum + (Array.isArray(stroke) ? stroke.length : 1000), 0) <= 600
      && strokes.every(stroke => Array.isArray(stroke) && stroke.length >= 1 && stroke.every(point => Array.isArray(point) && point.length === 2 && point.every(v => integer(v, 0, 1000))));
  }
  function valid(id, state, players = [], items = []) {
    if (!record(state) || state.kind !== id) return false;
    if (id === 'drawing-telephone') {
      if (!text(state.seed) || !items.includes(state.seed) || !['play', 'review'].includes(state.stage) || !textOrEmpty(state.draftText) || !validDrawing(state.draft)) return false;
      if (!Array.isArray(state.steps) || state.steps.length > players.length || (state.stage === 'review') !== (state.steps.length === players.length)) return false;
      return state.steps.every((step, i) => record(step) && (i % 2 === 0 ? (step.type === 'drawing' && validDrawing(step.strokes) && (step.strokes.length > 0 || text(step.text)) && textOrEmpty(step.text)) : (step.type === 'text' && text(step.text))));
    }
    if (id === 'packing-suitcase') {
      return Array.isArray(state.list) && state.list.length <= 20 && state.list.every(text) && new Set(state.list.map(key)).size === state.list.length
        && textOrEmpty(state.pending) && (state.stage === 'result' ? typeof state.correct === 'boolean' : state.correct === null) && ['recall', 'check', 'result'].includes(state.stage) && (state.stage === 'recall' || Boolean(state.pending));
    }
    if (id !== 'three-rounds' || !Array.isArray(state.deck) || state.deck.length < 3 || state.deck.length > 20 || !state.deck.every(word => text(word) && items.includes(word)) || new Set(state.deck.map(key)).size !== state.deck.length) return false;
    return Array.isArray(state.bag) && state.bag.length <= state.deck.length && new Set(state.bag).size === state.bag.length && state.bag.every(index => integer(index, 0, state.deck.length - 1))
      && integer(state.phase, 1, 3) && integer(state.team, 0, 1) && integer(state.turn, 0, 500) && integer(state.remainingMs, 1, 60000)
      && Array.isArray(state.teamScores) && state.teamScores.length === 2 && state.teamScores.every(score => integer(score, 0, 60))
      && ['turn', 'phaseEnd', 'done'].includes(state.stage) && (state.stage === 'turn' ? state.bag.length > 0 : state.bag.length === 0)
      && (state.stage !== 'done' || state.phase === 3) && state.teamScores.reduce((a, b) => a + b, 0) === ((state.phase - 1) * state.deck.length + state.deck.length - state.bag.length);
  }
  function textOrEmpty(value) { return typeof value === 'string' && value === clean(value); }
  function submitDrawing(state, strokes, description = '') {
    if (state.stage !== 'play' || state.steps.length % 2 !== 0 || !validDrawing(strokes) || (!strokes.length && !clean(description))) throw Error('Zeichne etwas oder beschreibe es kurz.');
    state.steps.push({ type: 'drawing', strokes: JSON.parse(JSON.stringify(strokes)), text: clean(description) });
    state.draft = []; state.draftText = '';
  }
  function submitGuess(state, guess) {
    if (state.stage !== 'play' || state.steps.length % 2 !== 1 || !clean(guess)) throw Error('Beschreibe das Bild mit einem kurzen Satz.');
    state.steps.push({ type: 'text', text: clean(guess) }); state.draftText = '';
  }
  function propose(state, value) {
    const word = clean(value);
    if (state.stage !== 'recall' || !word) throw Error('Ergänze einen Gegenstand.');
    if (state.list.some(item => key(item) === key(word))) throw Error('Dieser Gegenstand ist schon im Koffer.');
    state.pending = word; state.correct = null; state.stage = 'check';
  }
  function judge(state, correct) {
    if (state.stage !== 'check' || typeof correct !== 'boolean') throw Error('Die Gruppe muss den Zug prüfen.');
    if (correct) state.list.push(state.pending);
    state.correct = correct; state.stage = 'result'; return correct ? 1 : 0;
  }
  function hit(state) {
    if (state.stage !== 'turn' || !state.bag.length) throw Error('Gerade ist kein Begriff offen.');
    state.bag.shift(); state.teamScores[state.team]++;
    if (!state.bag.length) state.stage = state.phase === 3 ? 'done' : 'phaseEnd';
  }
  function skip(state) {
    if (state.stage !== 'turn' || !state.bag.length) return;
    state.bag.push(state.bag.shift());
  }
  function endTurn(state) {
    if (state.stage !== 'turn') return;
    if (state.turn >= 500) throw Error('Zu viele Teamzüge. Beendet diese Partie und startet einen neuen Stapel.');
    state.turn++; state.team = 1 - state.team; state.remainingMs = 60000;
  }
  function nextPhase(state, randomInt = () => 0) {
    if (state.stage !== 'phaseEnd' || state.phase >= 3 || state.turn >= 500) throw Error('Die nächste Phase ist noch nicht bereit.');
    state.phase++; state.bag = shuffle(state.deck.map((_, index) => index), randomInt); state.remainingMs = 60000; state.stage = 'turn'; state.team = 1 - state.team; state.turn++;
  }
  return { ids: Object.freeze(IDS), clean, create, valid, validDrawing, submitDrawing, submitGuess, propose, judge, hit, skip, endTurn, nextPhase };
});
