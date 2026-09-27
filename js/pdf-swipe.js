(function () {
  'use strict';

  var swipe = document.getElementById('pdfSwipe');
  var track = document.getElementById('pdfSwipeTrack');
  var dotsEl = document.getElementById('pdfDots');
  var countEl = document.getElementById('pdfCount');
  var prevBtn = document.getElementById('pdfPrev');
  var nextBtn = document.getElementById('pdfNext');
  if (!swipe || !track) return;

  var PAGE_COUNT = 6;
  var PAGES = [];
  for (var i = 1; i <= PAGE_COUNT; i++) {
    PAGES.push('assets/guide-pages/page-' + i + '.jpg');
  }

  var current = 0;

  function buildTrack() {
    track.innerHTML = PAGES.map(function (src, i) {
      return (
        '<div class="pdf-swipe-page">' +
          '<img src="' + src + '" alt="Free student numerology guide — page ' + (i + 1) + ' of ' + PAGE_COUNT + '"' +
            ' loading="' + (i === 0 ? 'eager' : 'lazy') + '" width="1075" height="1521" />' +
        '</div>'
      );
    }).join('');
  }

  function buildDots() {
    dotsEl.innerHTML = PAGES.map(function (_, i) {
      return '<button class="pdf-swipe-dot' + (i === 0 ? ' active' : '') + '" data-page="' + i + '" aria-label="Go to page ' + (i + 1) + '"></button>';
    }).join('');
  }

  function updateUI(index) {
    current = index;
    var dots = dotsEl.querySelectorAll('.pdf-swipe-dot');
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === index);
    });
    countEl.textContent = (index + 1) + ' / ' + PAGE_COUNT;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === PAGE_COUNT - 1;
  }

  function goTo(index, smooth) {
    index = Math.max(0, Math.min(PAGE_COUNT - 1, index));
    var pageEl = track.children[index];
    if (!pageEl) return;
    track.scrollTo({ left: pageEl.offsetLeft, behavior: smooth === false ? 'auto' : 'smooth' });
  }

  var scrollTimer = null;
  function onScroll() {
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () {
      var width = track.clientWidth || 1;
      var index = Math.round(track.scrollLeft / width);
      index = Math.max(0, Math.min(PAGE_COUNT - 1, index));
      if (index !== current) updateUI(index);
    }, 80);
  }

  buildTrack();
  buildDots();
  updateUI(0);

  prevBtn.addEventListener('click', function () { goTo(current - 1); });
  nextBtn.addEventListener('click', function () { goTo(current + 1); });
  dotsEl.addEventListener('click', function (e) {
    var dot = e.target.closest('[data-page]');
    if (dot) goTo(parseInt(dot.getAttribute('data-page'), 10));
  });
  track.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { goTo(current, false); });
})();
