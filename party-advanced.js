(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCircleAdvancedModes = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const MODES = new Set(['two-truths', 'question-imposter', 'location-spy', 'mafia']);

  function canHandle(mode) {
    return MODES.has(mode);
  }

  function shuffle(values, randomInt) {
    const result = [...values];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swap = randomInt(index + 1);
      [result[index], result[swap]] = [result[swap], result[index]];
    }
    return result;
  }

  function button(ctx, text, handler, className = '') {
    return ctx.actionButton(text, handler, className);
  }

  function renderTwoTruths(ctx) {
    const { session, state, nodes } = ctx;
    if (!session.advanced) session.advanced = { stage: 'compose' };
    const data = session.advanced;
    const author = state.players[session.playerIndex % state.players.length];

    if (data.stage === 'compose') {
      nodes.eyebrow.textContent = `${session.pack} · private Eingabe`;
      nodes.player.textContent = `${author} erstellt drei Aussagen`;
      const inspiration = ctx.randomItem(ctx.catalog.content['two-truths'][session.pack] || []);
      const hint = ctx.makeElement('p', 'advanced-hint', `Idee: ${inspiration || 'Erlebnis, Talent oder Reise'}`);
      const form = ctx.makeElement('form', 'advanced-form');
      const inputs = [0, 1, 2].map(index => {
        const label = ctx.makeElement('label', '', `Aussage ${index + 1}`);
        const input = document.createElement('input');
        input.required = true;
        input.maxLength = 140;
        input.autocomplete = 'off';
        input.placeholder = index === 2 ? 'Eine erfundene oder echte Aussage' : 'Eine kurze persönliche Aussage';
        label.append(input);
        form.append(label);
        return input;
      });
      const lieLabel = ctx.makeElement('label', '', 'Welche Aussage ist die Lüge?');
      const lieSelect = document.createElement('select');
      [1, 2, 3].forEach(number => lieSelect.add(new Option(`Aussage ${number}`, String(number - 1))));
      lieLabel.append(lieSelect);
      const submit = button(ctx, 'Aussagen mischen und verdecken', () => {});
      submit.type = 'submit';
      form.append(lieLabel, submit);
      form.addEventListener('submit', event => {
        event.preventDefault();
        const values = inputs.map(input => input.value.trim().replace(/\s+/g, ' '));
        if (values.some(value => value.length < 3) || new Set(values.map(value => value.toLocaleLowerCase('de-DE'))).size !== 3) {
          ctx.setStatus('Bitte drei unterschiedliche Aussagen mit mindestens drei Zeichen eingeben.', true);
          return;
        }
        const lieValue = values[Number(lieSelect.value)];
        const statements = shuffle(values, ctx.randomInt);
        session.advanced = {
          stage: 'handoff',
          author,
          statements,
          lieIndex: statements.indexOf(lieValue)
        };
        ctx.render();
      });
      nodes.content.append(hint, form);
      return;
    }

    if (data.stage === 'handoff') {
      nodes.player.textContent = `${data.author} gibt das Gerät an die Gruppe`;
      nodes.content.textContent = 'Die Aussagen sind gespeichert und gemischt. Niemand darf zurückgehen oder die private Eingabe ansehen.';
      nodes.options.append(button(ctx, 'Aussagen für die Gruppe anzeigen', () => {
        data.stage = 'vote';
        ctx.render();
      }));
      return;
    }

    if (data.stage === 'vote') {
      nodes.eyebrow.textContent = 'Gruppe stimmt ab';
      nodes.player.textContent = `Welche Aussage von ${data.author} ist erfunden?`;
      const list = ctx.makeElement('div', 'statement-grid');
      data.statements.forEach((statement, index) => {
        list.append(button(ctx, `${index + 1}. ${statement}`, () => {
          data.voteIndex = index;
          data.correct = index === data.lieIndex;
          if (data.correct) session.score += 1;
          data.stage = 'result';
          ctx.render();
        }, 'statement-button'));
      });
      nodes.content.append(list);
      return;
    }

    nodes.eyebrow.textContent = data.correct ? 'Richtig erkannt' : 'Gut getäuscht';
    nodes.player.textContent = data.correct ? 'Die Gruppe erhält einen Punkt.' : `${data.author} hat die Gruppe getäuscht.`;
    nodes.content.textContent = `Die Lüge war: ${data.statements[data.lieIndex]}`;
    nodes.actions.append(button(ctx, 'Nächste Person', () => {
      session.advanced = null;
      ctx.completeRound();
    }));
  }

  function ensureQuestionRound(ctx) {
    const { session, state, catalog } = ctx;
    if (session.advanced) return session.advanced;
    const pair = ctx.pickUnused(catalog.content['question-imposter'][session.pack] || []);
    const imposter = ctx.randomItem(state.players);
    session.advanced = {
      stage: 'reveal',
      revealIndex: 0,
      pair,
      imposter,
      revealed: false
    };
    return session.advanced;
  }

  function renderQuestionImposter(ctx) {
    const { session, state, nodes } = ctx;
    const data = ensureQuestionRound(ctx);
    if (!data.pair) {
      nodes.content.textContent = 'Keine Fragen in diesem Pack verfügbar.';
      return;
    }

    if (data.stage === 'reveal') {
      const player = state.players[data.revealIndex];
      nodes.eyebrow.textContent = `Geheime Frage ${data.revealIndex + 1} von ${state.players.length}`;
      nodes.player.textContent = `${player} liest allein`;
      nodes.content.textContent = data.revealed
        ? (player === data.imposter ? data.pair.imposter : data.pair.main)
        : 'Gerät abschirmen und die eigene Frage öffnen.';
      nodes.options.append(button(ctx, data.revealed ? 'Frage verdecken und weitergeben' : 'Meine Frage anzeigen', () => {
        if (!data.revealed) {
          data.revealed = true;
        } else if (data.revealIndex + 1 < state.players.length) {
          data.revealIndex += 1;
          data.revealed = false;
        } else {
          data.stage = 'discussion';
        }
        ctx.render();
      }));
      return;
    }

    if (data.stage === 'discussion') {
      nodes.eyebrow.textContent = 'Antworten vergleichen';
      nodes.player.textContent = 'Jede Person beantwortet ihre Frage kurz.';
      nodes.content.textContent = 'Die Fragen sind fast gleich. Achtet auf Antworten, die nicht ganz zum Gespräch passen.';
      nodes.options.append(button(ctx, 'Geheime Abstimmung starten', () => {
        data.stage = 'vote';
        ctx.render();
      }));
      return;
    }

    if (data.stage === 'vote') {
      nodes.eyebrow.textContent = 'Gemeinsame Entscheidung';
      nodes.player.textContent = 'Wer hatte die andere Frage?';
      const grid = ctx.makeElement('div', 'player-vote-grid');
      state.players.forEach(player => grid.append(button(ctx, player, () => {
        data.voted = player;
        data.correct = player === data.imposter;
        if (data.correct) session.score += 2;
        data.stage = 'result';
        ctx.render();
      }, 'secondary')));
      nodes.content.append(grid);
      return;
    }

    nodes.eyebrow.textContent = data.correct ? 'Imposter gefunden' : 'Imposter entkommt';
    nodes.player.textContent = `Question Imposter: ${data.imposter}`;
    const summary = ctx.makeElement('div', 'advanced-result');
    summary.append(
      ctx.makeElement('p', '', `Hauptfrage: ${data.pair.main}`),
      ctx.makeElement('p', '', `Andere Frage: ${data.pair.imposter}`)
    );
    nodes.content.append(summary);
    nodes.actions.append(button(ctx, 'Nächste Runde', () => {
      session.advanced = null;
      ctx.completeRound();
    }));
  }

  function ensureLocationRound(ctx) {
    const { session, state, catalog } = ctx;
    if (session.advanced) return session.advanced;
    const locations = catalog.content['location-spy'][session.pack] || [];
    session.advanced = {
      stage: 'reveal',
      revealIndex: 0,
      location: ctx.pickUnused(locations),
      spy: ctx.randomItem(state.players),
      revealed: false
    };
    return session.advanced;
  }

  function renderLocationSpy(ctx) {
    const { session, state, nodes, catalog } = ctx;
    const data = ensureLocationRound(ctx);
    if (data.stage === 'reveal') {
      const player = state.players[data.revealIndex];
      nodes.eyebrow.textContent = `Geheime Karte ${data.revealIndex + 1} von ${state.players.length}`;
      nodes.player.textContent = `${player} sieht allein`;
      nodes.content.textContent = data.revealed
        ? (player === data.spy ? 'Du bist der Spion. Finde den geheimen Ort.' : `Geheimer Ort: ${data.location}`)
        : 'Gerät abschirmen und Karte öffnen.';
      nodes.options.append(button(ctx, data.revealed ? 'Karte schließen und weitergeben' : 'Karte anzeigen', () => {
        if (!data.revealed) data.revealed = true;
        else if (data.revealIndex + 1 < state.players.length) {
          data.revealIndex += 1;
          data.revealed = false;
        } else data.stage = 'discussion';
        ctx.render();
      }));
      return;
    }

    if (data.stage === 'discussion') {
      nodes.eyebrow.textContent = 'Fragerunde';
      nodes.player.textContent = 'Stellt euch reihum vorsichtige Fragen.';
      nodes.content.textContent = 'Der Ort darf nicht direkt genannt werden. Der Spion versucht mitzudenken.';
      nodes.options.append(
        button(ctx, 'Spion wählen', () => { data.stage = 'vote'; ctx.render(); }),
        button(ctx, 'Spion versucht den Ort', () => { data.stage = 'guess'; ctx.render(); }, 'secondary')
      );
      return;
    }

    if (data.stage === 'vote') {
      nodes.player.textContent = 'Wen verdächtigt die Gruppe?';
      const grid = ctx.makeElement('div', 'player-vote-grid');
      state.players.forEach(player => grid.append(button(ctx, player, () => {
        data.voted = player;
        data.correct = player === data.spy;
        if (data.correct) session.score += 2;
        data.stage = 'result';
        ctx.render();
      }, 'secondary')));
      nodes.content.append(grid);
      return;
    }

    if (data.stage === 'guess') {
      nodes.player.textContent = `${data.spy} wählt einen Ort`;
      const locations = catalog.content['location-spy'][session.pack] || [];
      const decoys = shuffle(locations.filter(location => location !== data.location), ctx.randomInt).slice(0, 5);
      const choices = shuffle([data.location, ...decoys], ctx.randomInt);
      const grid = ctx.makeElement('div', 'player-vote-grid');
      choices.forEach(location => grid.append(button(ctx, location, () => {
        data.guess = location;
        data.spyCorrect = location === data.location;
        if (data.spyCorrect) session.score += 2;
        data.stage = 'result';
        ctx.render();
      }, 'secondary')));
      nodes.content.append(grid);
      return;
    }

    const spyWon = data.spyCorrect || data.correct === false;
    nodes.eyebrow.textContent = spyWon ? 'Spion gewinnt' : 'Gruppe gewinnt';
    nodes.player.textContent = `Spion: ${data.spy}`;
    nodes.content.textContent = `Der geheime Ort war: ${data.location}`;
    nodes.actions.append(button(ctx, 'Nächster Ort', () => {
      session.advanced = null;
      ctx.completeRound();
    }));
  }

  function mafiaCountForPlayers(playerCount) {
    const count = Math.max(0, Number(playerCount) || 0);
    if (count >= 16) return 4;
    if (count >= 12) return 3;
    if (count >= 8) return 2;
    return count >= 1 ? 1 : 0;
  }

  function mafiaRoleList(playerCount, pack = 'Klassisch') {
    const count = Math.max(0, Math.floor(Number(playerCount) || 0));
    if (!count) return [];
    const roles = Array.from({ length: mafiaCountForPlayers(count) }, () => 'Mafia');
    if (roles.length < count) roles.push('Detektiv');
    if (pack !== 'Schnell' && count >= 7 && roles.length < count) roles.push('Arzt');
    if (pack === 'Erweitert' && count >= 8 && roles.length < count) roles.push('Beschützer');
    while (roles.length < count) roles.push('Dorfbewohner');
    return roles.slice(0, count);
  }

  function assignMafiaRoles(players, randomInt, pack = 'Klassisch') {
    const roles = mafiaRoleList(players.length, pack);
    return shuffle(roles, randomInt).reduce((result, role, index) => {
      result[players[index]] = role;
      return result;
    }, {});
  }

  function mafiaWinner(data) {
    const mafiaAlive = data.alive.filter(player => data.roles[player] === 'Mafia').length;
    const villageAlive = data.alive.length - mafiaAlive;
    if (mafiaAlive === 0) return 'Dorf';
    if (mafiaAlive >= villageAlive) return 'Mafia';
    return null;
  }

  function ensureMafia(ctx) {
    if (ctx.session.advanced) return ctx.session.advanced;
    ctx.session.advanced = {
      stage: 'reveal',
      revealIndex: 0,
      revealed: false,
      day: 1,
      roles: assignMafiaRoles(ctx.state.players, ctx.randomInt, ctx.session.pack),
      alive: [...ctx.state.players],
      nightTarget: null,
      saved: null,
      protected: null,
      lastProtected: null,
      inspected: null,
      nightResult: ''
    };
    return ctx.session.advanced;
  }

  function selectField(ctx, labelText, players, selected) {
    const label = ctx.makeElement('label', '', labelText);
    const select = document.createElement('select');
    players.forEach(player => select.add(new Option(player, player)));
    if (selected && players.includes(selected)) select.value = selected;
    label.append(select);
    return { label, select };
  }

  function renderMafia(ctx) {
    const { session, state, nodes } = ctx;
    const data = ensureMafia(ctx);

    if (data.stage === 'reveal') {
      const player = state.players[data.revealIndex];
      nodes.eyebrow.textContent = `Rolle ${data.revealIndex + 1} von ${state.players.length}`;
      nodes.player.textContent = `${player} sieht allein`;
      nodes.content.textContent = data.revealed ? `Deine Rolle: ${data.roles[player]}` : 'Gerät abschirmen und Rolle öffnen.';
      nodes.options.append(button(ctx, data.revealed ? 'Rolle schließen und weitergeben' : 'Meine Rolle anzeigen', () => {
        if (!data.revealed) data.revealed = true;
        else if (data.revealIndex + 1 < state.players.length) {
          data.revealIndex += 1;
          data.revealed = false;
        } else data.stage = 'moderator';
        ctx.render();
      }));
      return;
    }

    if (data.stage === 'moderator') {
      nodes.eyebrow.textContent = 'Erzähler-Modus';
      nodes.player.textContent = 'Eine neutrale Person übernimmt jetzt das Gerät.';
      nodes.content.textContent = 'Die Moderatorübersicht enthält alle Rollen. Sie darf nur vom Erzähler gesehen werden.';
      nodes.options.append(button(ctx, 'Moderatorübersicht öffnen', () => {
        if (!window.confirm('Nur die neutrale Erzählerperson darf fortfahren. Rollen wirklich anzeigen?')) return;
        data.stage = 'overview';
        ctx.render();
      }));
      return;
    }

    if (data.stage === 'overview') {
      nodes.eyebrow.textContent = `Tag ${data.day} · Moderatorübersicht`;
      nodes.player.textContent = `${data.alive.length} Personen leben`;
      const list = ctx.makeElement('div', 'role-overview');
      Object.entries(data.roles).forEach(([player, role]) => {
        const row = ctx.makeElement('div', data.alive.includes(player) ? '' : 'eliminated');
        row.append(ctx.makeElement('strong', '', player), ctx.makeElement('span', '', role));
        list.append(row);
      });
      nodes.content.append(list);
      nodes.actions.append(button(ctx, 'Nachtphase starten', () => { data.stage = 'night'; ctx.render(); }));
      return;
    }

    if (data.stage === 'night') {
      nodes.eyebrow.textContent = `Nacht ${data.day}`;
      nodes.player.textContent = 'Moderator trägt die geheimen Aktionen ein.';
      const form = ctx.makeElement('form', 'advanced-form');
      const mafiaPlayers = data.alive.filter(player => data.roles[player] === 'Mafia');
      const targets = data.alive.filter(player => !mafiaPlayers.includes(player));
      const mafia = selectField(ctx, 'Mafia-Ziel', targets, data.nightTarget);
      form.append(mafia.label);

      const doctorAlive = data.alive.find(player => data.roles[player] === 'Arzt');
      const doctor = doctorAlive ? selectField(ctx, 'Arzt schützt', data.alive, data.saved) : null;
      if (doctor) form.append(doctor.label);

      const protectorAlive = data.alive.find(player => data.roles[player] === 'Beschützer');
      let protector = null;
      if (protectorAlive) {
        const allowed = data.alive.filter(player => player !== data.lastProtected);
        protector = selectField(ctx, 'Beschützer schützt', allowed.length ? allowed : data.alive, data.protected);
        if (data.lastProtected) protector.label.append(ctx.makeElement('small', 'muted', `Nicht erneut: ${data.lastProtected}`));
        form.append(protector.label);
      }

      const detectiveAlive = data.alive.find(player => data.roles[player] === 'Detektiv');
      const detective = detectiveAlive ? selectField(ctx, 'Detektiv untersucht', data.alive.filter(player => player !== detectiveAlive), data.inspected) : null;
      if (detective) form.append(detective.label);

      const submit = button(ctx, 'Nacht auswerten', () => {});
      submit.type = 'submit';
      form.append(submit);
      form.addEventListener('submit', event => {
        event.preventDefault();
        data.nightTarget = mafia.select.value;
        data.saved = doctor?.select.value || null;
        data.protected = protector?.select.value || null;
        data.inspected = detective?.select.value || null;
        const prevented = data.nightTarget && (data.nightTarget === data.saved || data.nightTarget === data.protected);
        if (data.nightTarget && !prevented) {
          data.alive = data.alive.filter(player => player !== data.nightTarget);
          data.nightResult = `${data.nightTarget} wurde in der Nacht eliminiert.`;
        } else {
          data.nightResult = 'In dieser Nacht wurde niemand eliminiert.';
        }
        data.lastProtected = data.protected || data.lastProtected || null;
        data.stage = 'day';
        ctx.render();
      });
      nodes.content.append(form);
      return;
    }

    if (data.stage === 'day') {
      const winner = mafiaWinner(data);
      if (winner) {
        data.winner = winner;
        data.stage = 'finished';
        ctx.render();
        return;
      }
      nodes.eyebrow.textContent = `Tag ${data.day}`;
      nodes.player.textContent = data.nightResult;
      const info = ctx.makeElement('div', 'advanced-result');
      if (data.inspected) info.append(ctx.makeElement('p', '', `Detektiv-Ergebnis für Moderator: ${data.inspected} ist ${data.roles[data.inspected] === 'Mafia' ? 'Mafia' : 'nicht Mafia'}.`));
      info.append(ctx.makeElement('p', '', 'Die lebenden Personen diskutieren. Danach trägt der Moderator die Tageswahl ein.'));
      const vote = selectField(ctx, 'Durch Tageswahl eliminiert', data.alive, null);
      info.append(vote.label);
      nodes.content.append(info);
      nodes.actions.append(button(ctx, 'Tageswahl bestätigen', () => {
        const eliminated = vote.select.value;
        if (data.roles[eliminated] === 'Mafia') session.score += 3;
        data.alive = data.alive.filter(player => player !== eliminated);
        data.day += 1;
        data.nightTarget = null;
        data.saved = null;
        data.protected = null;
        data.inspected = null;
        data.stage = mafiaWinner(data) ? 'finished' : 'overview';
        data.winner = mafiaWinner(data);
        ctx.render();
      }));
      return;
    }

    nodes.eyebrow.textContent = 'Mafia beendet';
    nodes.player.textContent = `${data.winner || mafiaWinner(data)} gewinnt`;
    const surviving = data.alive.map(player => `${player} (${data.roles[player]})`).join(', ');
    nodes.content.textContent = `Überlebende: ${surviving}`;
    nodes.actions.append(
      button(ctx, 'Neue Mafia-Runde', () => { session.advanced = null; ctx.completeRound(); }),
      button(ctx, 'Session beenden', ctx.finishSession, 'secondary')
    );
  }

  function render(ctx) {
    if (!ctx || !ctx.game || !canHandle(ctx.game.mode)) return false;
    if (ctx.game.mode === 'two-truths') renderTwoTruths(ctx);
    else if (ctx.game.mode === 'question-imposter') renderQuestionImposter(ctx);
    else if (ctx.game.mode === 'location-spy') renderLocationSpy(ctx);
    else if (ctx.game.mode === 'mafia') renderMafia(ctx);
    return true;
  }

  return Object.freeze({
    version: 1,
    modes: Object.freeze([...MODES]),
    canHandle,
    render,
    mafiaCountForPlayers,
    mafiaRoleList,
    assignMafiaRoles,
    mafiaWinner
  });
});
