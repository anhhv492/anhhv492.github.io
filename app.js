/* Traychemy landing page: the DOM layer of the playable demo. Rules live in demo-engine.js. */
(function () {
  'use strict';

  var D = window.TraychemyDemo;
  var I = window.TraychemyI18n;
  var boardEl = document.getElementById('board');
  var trayEl = document.getElementById('tray');
  var statusEl = document.getElementById('status');
  var leftEl = document.getElementById('left');
  var resultEl = document.getElementById('result');
  var resultTitle = document.getElementById('result-title');
  var resultText = document.getElementById('result-text');
  var comboEl = document.getElementById('combo');
  var confettiEl = document.getElementById('confetti');
  var againBtn = document.getElementById('again');
  var restartBtn = document.getElementById('restart');
  var hintBtn = document.getElementById('hint');
  if (!boardEl || !trayEl) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var game = D.createGame(D.CAPACITY);
  var tiles = {};     // uid -> board button
  var slots = [];     // tray slot elements
  var busy = false;
  var queued = null;
  var epoch = 0;      // bumps on restart so stale animations stop touching the DOM
  var covers = {};
  var shown = [];      // ids drawn in the tray right now
  var statusSay = null; // rebuilds the status line, so it can follow a language change
  var resultKind = null;

  function sleep(ms) {
    var e = epoch;
    return new Promise(function (res) { setTimeout(function () { res(e === epoch); }, reduced ? 0 : ms); });
  }

  function tileMarkup(id, label) {
    return '<span class="face"></span><svg class="art" aria-hidden="true" focusable="false"><use href="#i-' + id + '"></use></svg>';
  }

  function trayTile(id) {
    var el = document.createElement('span');
    el.className = 'tile t-' + id;
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', I.name(id));
    el.innerHTML = tileMarkup(id);
    return el;
  }

  function say(build) { statusSay = build; statusEl.textContent = build(); }
  function setStatus(key) {
    var ids = Array.prototype.slice.call(arguments, 1);
    say(function () { return I.t.apply(null, [key].concat(ids.map(I.name))); });
  }

  function buildBoard() {
    boardEl.innerHTML = '';
    tiles = {};
    covers = {};
    D.LAYOUT.forEach(function (t) { t.by.forEach(function (b) { covers[b] = true; }); });
    D.LAYOUT.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tile t-' + t.id;
      b.dataset.id = t.id;
      b.style.left = t.x + '%';
      b.style.top = (t.y / D.BOARD_H * 100) + '%';
      b.style.zIndex = covers[t.id] ? 2 : 1;
      b.setAttribute('aria-label', I.name(t.id));
      b.innerHTML = tileMarkup(t.id);
      b.addEventListener('click', function () { onTap(t.id); });
      boardEl.appendChild(b);
      tiles[t.id] = b;
    });
  }

  function buildTray() {
    trayEl.innerHTML = '';
    slots = [];
    for (var i = 0; i < game.capacity; i++) {
      var s = document.createElement('div');
      s.className = 'slot';
      trayEl.appendChild(s);
      slots.push(s);
    }
  }

  function labelTray() {
    trayEl.setAttribute('aria-label', I.t('tray', shown.map(I.name)));
  }

  function renderTray(list, spawnLast) {
    shown = list.slice();
    slots.forEach(function (s, i) {
      s.innerHTML = '';
      if (i < list.length) {
        var t = trayTile(list[i]);
        if (spawnLast && i === list.length - 1) t.classList.add('is-spawn');
        s.appendChild(t);
      }
    });
    labelTray();
  }

  function refreshBoard() {
    D.LAYOUT.forEach(function (t) {
      var el = tiles[t.id];
      if (!el || !el.isConnected) return;
      var open = game.isAccessible(t.id);
      el.classList.toggle('is-covered', !open);
      el.setAttribute('aria-disabled', open ? 'false' : 'true');
    });
    leftEl.textContent = I.t('left', game.remaining());
  }

  function clearHint() {
    Object.keys(tiles).forEach(function (id) { tiles[id].classList.remove('is-hint'); });
  }

  function showHint(id) {
    clearHint();
    if (id && tiles[id] && tiles[id].isConnected) tiles[id].classList.add('is-hint');
  }

  function fly(el, slot) {
    return new Promise(function (resolve) {
      if (reduced) { resolve(); return; }
      var a = el.getBoundingClientRect();
      var b = slot.getBoundingClientRect();
      var dx = (b.left + b.width / 2) - (a.left + a.width / 2);
      var dy = (b.top + b.height / 2) - (a.top + a.height / 2);
      var sc = (b.width * 0.86) / a.width;
      el.classList.add('is-flying');
      el.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + sc + ')';
      setTimeout(resolve, 250);
    });
  }

  function sayReaction(step) {
    if (step.out) setStatus('merged', step.consumed[0], step.consumed[1], step.out);
    else setStatus('cleared', step.consumed[0], step.consumed[1]);
  }

  function showCombo(n) {
    comboEl.textContent = I.t('combo', n);
    comboEl.classList.remove('is-on');
    void comboEl.offsetWidth;
    comboEl.classList.add('is-on');
  }

  function confetti() {
    if (reduced) return;
    var colors = ['#FF8A5B', '#5FD08A', '#4FB8C9', '#F5C542', '#E86FA8', '#4A9BE8'];
    confettiEl.innerHTML = '';
    for (var i = 0; i < 30; i++) {
      var p = document.createElement('i');
      p.style.left = (Math.random() * 100) + '%';
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = (Math.random() * 0.5) + 's';
      p.style.animationDuration = (1.5 + Math.random() * 0.9) + 's';
      confettiEl.appendChild(p);
    }
    setTimeout(function () { confettiEl.innerHTML = ''; }, 3200);
  }

  function writeResult() {
    if (!resultKind) return;
    resultTitle.textContent = I.t(resultKind + 'Title');
    resultText.textContent = I.t(resultKind + 'Text');
  }

  function showResult(kind) {
    resultKind = kind;
    resultEl.className = 'result is-' + kind;
    writeResult();
    if (kind === 'win') confetti();
    resultEl.hidden = false;
    boardEl.inert = true;
    trayEl.inert = true;
    againBtn.focus();
  }

  async function play(events) {
    var e0 = epoch;
    var reactions = 0;
    for (var n = 0; n < events.length; n++) {
      var ev = events[n];
      if (e0 !== epoch) return;
      if (ev.type === 'pick') {
        var el = tiles[ev.uid];
        setStatus('picked', ev.uid);
        await fly(el, slots[ev.slot]);
        if (e0 !== epoch) return;
        el.remove();
        renderTray(ev.tray, false);
        refreshBoard();
        if (events.length > 1 && events[1].type !== 'win' && events[1].type !== 'lose') await sleep(160);
      } else if (ev.type === 'clear' || ev.type === 'transform') {
        reactions++;
        sayReaction(ev);
        if (reactions >= 2) showCombo(reactions);
        ev.slots.forEach(function (i) {
          var t = slots[i] && slots[i].firstChild;
          if (t) t.classList.add('is-pop');
        });
        if (!(await sleep(270))) return;
        renderTray(ev.trayAfter, !!ev.out);
        if (!(await sleep(ev.out ? 260 : 110))) return;
      } else if (ev.type === 'win' || ev.type === 'lose') {
        setStatus(ev.type + 'Status');
        if (!(await sleep(420))) return;
        showResult(ev.type);
      }
    }
  }

  async function onTap(uid) {
    if (resultEl.hidden === false) return;
    if (busy) { queued = uid; return; }
    var el = tiles[uid];
    if (!el || !el.isConnected) return;
    clearHint();
    var res = game.tap(uid);
    if (!res.ok) {
      if (res.reason === 'covered') {
        setStatus('covered');
        el.classList.remove('is-shake');
        void el.offsetWidth;
        el.classList.add('is-shake');
      }
      return;
    }
    busy = true;
    var e0 = epoch;
    try { await play(res.events); } finally { if (e0 === epoch) busy = false; }
    if (e0 !== epoch) return;
    if (queued && !game.over) { var q = queued; queued = null; onTap(q); }
    else queued = null;
  }

  function restart() {
    epoch++;
    busy = false;
    queued = null;
    game.reset();
    resultEl.hidden = true;
    resultKind = null;
    boardEl.inert = false;
    trayEl.inert = false;
    confettiEl.innerHTML = '';
    comboEl.classList.remove('is-on');
    comboEl.textContent = '';
    buildBoard();
    buildTray();
    renderTray([], false);
    refreshBoard();
    showHint('dog');
    setStatus('start');
  }

  restartBtn.addEventListener('click', function () {
    restart();
    if (tiles.dog) tiles.dog.focus({ preventScroll: true });
  });
  againBtn.addEventListener('click', function () {
    restart();
    if (tiles.dog) tiles.dog.focus({ preventScroll: true });
  });
  hintBtn.addEventListener('click', function () {
    if (busy || game.over) return;
    var id = game.hint();
    if (id) {
      showHint(id);
      setStatus('tryPick', id);
    } else {
      setStatus('deadEnd');
    }
  });

  // The page text is swapped by i18n.js; the demo redraws its own strings without restarting.
  I.onChange(function () {
    Object.keys(tiles).forEach(function (id) { tiles[id].setAttribute('aria-label', I.name(id)); });
    slots.forEach(function (s, i) { if (s.firstChild && shown[i]) s.firstChild.setAttribute('aria-label', I.name(shown[i])); });
    labelTray();
    leftEl.textContent = I.t('left', game.remaining());
    if (statusSay) statusEl.textContent = statusSay();
    writeResult();
  });

  restart();
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !resultEl.hidden) againBtn.focus();
  });
})();
