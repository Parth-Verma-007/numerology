(function () {
  'use strict';

  var container = document.getElementById('tossDeck');
  var stackEl = document.getElementById('tossStack');
  if (!container || !stackEl) return;

  var FEEDBACK = [
    { src: 'images/feedback/1.png', caption: '@deepu5_pulavarthi' },
    { src: 'images/feedback/2.png', caption: '@sahanasahukar' },
    { src: 'images/feedback/3.png', caption: '@lifegoesonin' },
    { src: 'images/feedback/4.png', caption: '@passion_butterfly' },
    { src: 'images/feedback/5.png', caption: '@deeksha.zx' },
    { src: 'images/feedback/6.png', caption: 'Instagram DM' },
    { src: 'images/feedback/7.jpeg', caption: '@sidjyoti95' },
    { src: 'images/feedback/8.jpeg', caption: '@aman_saini_12' },
    { src: 'images/feedback/9.jpeg', caption: '@taabi_khan204' },
    { src: 'images/feedback/10.jpeg', caption: '@ridhikasoni_' },
    { src: 'images/feedback/11.jpeg', caption: 'WhatsApp message' }
  ];

  var STACK = 4;
  var TOSS_DISTANCE = 100;
  var TOSS_VELOCITY = 500;
  var AUTO_INTERVAL = 2800;
  var EXIT_MS = 420;

  var items = [];
  var nextIdx = 0;
  var autoTimer = null;
  var autoCount = 0;
  var paused = false;

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function tiltOf(i) { return ((i * 37) % 9) - 4; }
  function zFor(p) { return STACK - p; }

  function positionFor(p, idx) {
    return {
      x: idx % 2 === 0 ? 4 : -4,
      y: -p * 12,
      scale: 1 - p * 0.05,
      rotate: p === 0 ? tiltOf(idx) / 2 : tiltOf(idx)
    };
  }

  function applyTransform(el, pos, opacity, z) {
    el.style.transform = 'translate(' + pos.x + 'px,' + pos.y + 'px) scale(' + pos.scale + ') rotate(' + pos.rotate + 'deg)';
    el.style.opacity = String(opacity);
    el.style.zIndex = String(z);
  }

  function createCard(idx) {
    var photo = FEEDBACK[idx % FEEDBACK.length];
    var el = document.createElement('div');
    el.className = 'toss-card';
    el.innerHTML =
      '<div class="toss-card-photo"><img src="' + photo.src + '" alt="Client feedback screenshot, ' + escapeHtml(photo.caption) + '" draggable="false"></div>' +
      '<p class="toss-card-caption">' + escapeHtml(photo.caption) + '</p>';
    return el;
  }

  function reflow() {
    items.forEach(function (item, p) {
      item.p = p;
      applyTransform(item.el, positionFor(p, item.idx), 1, zFor(p));
    });
    refreshTopBinding();
  }

  function refreshTopBinding() {
    items.forEach(function (item, i) {
      var isTop = i === 0;
      item.el.classList.toggle('toss-card--top', isTop);
      if (isTop) bindDrag(item); else unbindDrag(item);
    });
  }

  function toss(dir) {
    if (!items.length) return;
    var top = items.shift();
    unbindDrag(top);
    top.el.classList.remove('toss-card--dragging');
    top.el.classList.add('toss-card--exit');
    requestAnimationFrame(function () {
      top.el.style.transform = 'translate(' + (dir * 600) + 'px,-80px) rotate(' + (dir * 32) + 'deg)';
      top.el.style.opacity = '0';
    });
    setTimeout(function () {
      if (top.el.parentNode) top.el.parentNode.removeChild(top.el);
    }, EXIT_MS);

    var idx = nextIdx++;
    var el = createCard(idx);
    var initialPos = { x: idx % 2 === 0 ? 4 : -4, y: -STACK * 12 - 20, scale: 1 - STACK * 0.05, rotate: tiltOf(idx) };
    el.style.transition = 'none';
    applyTransform(el, initialPos, 0, zFor(STACK - 1));
    stackEl.appendChild(el);
    void el.offsetWidth;
    el.style.transition = '';

    items.push({ idx: idx, el: el, p: STACK - 1, bound: false });
    reflow();
  }

  function bindDrag(item) {
    if (item.bound) return;
    item.bound = true;
    var el = item.el;
    var startX = 0, lastX = 0, lastT = 0, vx = 0, dragging = false, basePos = null;

    function onDown(e) {
      if (items[0] !== item || e.button === 2) return;
      dragging = true;
      paused = true;
      basePos = positionFor(0, item.idx);
      startX = e.clientX;
      lastX = e.clientX;
      lastT = performance.now();
      vx = 0;
      el.classList.add('toss-card--dragging');
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
    }

    function onMove(e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      var now = performance.now();
      var dt = now - lastT;
      if (dt > 0) {
        vx = ((e.clientX - lastX) / dt) * 1000;
        lastX = e.clientX;
        lastT = now;
      }
      el.style.transform = 'translate(' + (basePos.x + dx) + 'px,' + basePos.y + 'px) scale(1.04) rotate(' + basePos.rotate + 'deg)';
    }

    function onUp(e) {
      if (!dragging) return;
      dragging = false;
      paused = false;
      el.classList.remove('toss-card--dragging');
      var dx = e.clientX - startX;
      var flung = Math.abs(dx) > TOSS_DISTANCE || Math.abs(vx) > TOSS_VELOCITY;
      if (flung) {
        toss((dx + vx) > 0 ? 1 : -1);
      } else {
        requestAnimationFrame(function () {
          applyTransform(el, positionFor(0, item.idx), 1, zFor(0));
        });
      }
    }

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    item._handlers = { onDown: onDown, onMove: onMove, onUp: onUp };
  }

  function unbindDrag(item) {
    if (!item.bound) return;
    item.bound = false;
    var h = item._handlers;
    if (!h) return;
    item.el.removeEventListener('pointerdown', h.onDown);
    item.el.removeEventListener('pointermove', h.onMove);
    item.el.removeEventListener('pointerup', h.onUp);
    item.el.removeEventListener('pointercancel', h.onUp);
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(function () {
      if (paused) return;
      autoCount++;
      toss(autoCount % 2 === 0 ? 1 : -1);
    }, AUTO_INTERVAL);
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  function init() {
    var count = Math.min(STACK, FEEDBACK.length * 10);
    for (var p = 0; p < count; p++) {
      var idx = nextIdx++;
      var el = createCard(idx);
      el.style.transition = 'none';
      applyTransform(el, positionFor(p, idx), 1, zFor(p));
      stackEl.appendChild(el);
      items.push({ idx: idx, el: el, p: p, bound: false });
    }
    void stackEl.offsetWidth;
    items.forEach(function (item) { item.el.style.transition = ''; });
    refreshTopBinding();
    startAuto();
  }

  container.addEventListener('pointerenter', function () { paused = true; });
  container.addEventListener('pointerleave', function () { paused = false; });

  if (FEEDBACK.length) init();
})();
