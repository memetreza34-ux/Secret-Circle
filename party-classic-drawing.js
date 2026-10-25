(function (root) {
  'use strict';
  function mount(host, initial = [], onChange = () => {}, readOnly = false, label = 'Deine Zeichnung') {
    let strokes = JSON.parse(JSON.stringify(initial));
    let current = null;
    const canvas = document.createElement('canvas');
    canvas.width = 1000; canvas.height = 600; canvas.className = 'classic-canvas';
    canvas.setAttribute('aria-label', label); canvas.setAttribute('role', 'img');
    const context = canvas.getContext('2d');
    function paint() {
      context.fillStyle = '#fffaf0'; context.fillRect(0, 0, 1000, 600);
      context.strokeStyle = '#17243b'; context.lineWidth = 6; context.lineCap = 'round'; context.lineJoin = 'round';
      for (const stroke of strokes) {
        context.beginPath(); context.moveTo(stroke[0][0], stroke[0][1] * 0.6);
        if (stroke.length === 1) context.lineTo(stroke[0][0] + 1, stroke[0][1] * 0.6 + 1);
        else for (const [x, y] of stroke.slice(1)) context.lineTo(x, y * 0.6);
        context.stroke();
      }
    }
    const point = event => {
      const rect = canvas.getBoundingClientRect();
      return [Math.round(Math.max(0, Math.min(1000, (event.clientX - rect.left) / rect.width * 1000))), Math.round(Math.max(0, Math.min(1000, (event.clientY - rect.top) / rect.height * 1000)))];
    };
    const count = () => strokes.reduce((sum, stroke) => sum + stroke.length, 0);
    const notice = document.createElement('p'); notice.className = 'field-note'; notice.setAttribute('aria-live', 'polite');
    const changed = () => { notice.textContent = `${count()} von 600 Zeichenpunkten`; onChange(JSON.parse(JSON.stringify(strokes))); };
    if (!readOnly) {
      canvas.addEventListener('pointerdown', event => {
        if (!event.isPrimary || event.button !== 0) return;
        event.preventDefault();
        if (count() >= 600 || strokes.length >= 100) { notice.textContent = 'Zeichnung voll. Nutze Rückgängig oder ergänze eine kurze Beschreibung.'; return; }
        canvas.setPointerCapture(event.pointerId); current = [point(event)]; strokes.push(current); paint();
      });
      canvas.addEventListener('pointermove', event => {
        if (!current || !event.isPrimary || count() >= 600) return;
        const next = point(event), last = current[current.length - 1];
        if (Math.hypot(next[0] - last[0], next[1] - last[1]) < 4) return;
        current.push(next); paint();
      });
      for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) canvas.addEventListener(name, () => { if (current) { current = null; changed(); } });
    }
    host.append(canvas);
    if (!readOnly) {
      const tools = document.createElement('div'); tools.className = 'inline-actions';
      for (const [title, action] of [['Letzten Strich zurücknehmen', () => strokes.pop()], ['Zeichnung löschen', () => { strokes = []; }]]) {
        const button = document.createElement('button'); button.type = 'button'; button.className = 'pill pill-quiet'; button.textContent = title;
        button.addEventListener('click', () => { current = null; action(); paint(); changed(); }); tools.append(button);
      }
      host.append(tools, notice);
    }
    paint();
    return { value: () => JSON.parse(JSON.stringify(strokes)), dispose: () => { current = null; canvas.width = 0; canvas.height = 0; } };
  }
  root.SecretCircleClassicDrawing = Object.freeze({ mount });
})(typeof globalThis !== 'undefined' ? globalThis : this);
