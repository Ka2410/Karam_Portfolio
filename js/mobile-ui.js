(function () {
  var $ = window.jQuery;
  var body = document.body;
  function setMode(light) {
    body.classList.toggle('light', light);
    var d = document.getElementById('mode-dark'), l = document.getElementById('mode-light');
    if (d && l) { d.classList.toggle('active', !light); l.classList.toggle('active', light); }
    try { localStorage.setItem('mode', light ? 'light' : 'dark'); } catch (e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem('mode'); } catch (e) {}
  setMode(saved === 'light');
  document.getElementById('mode-dark').addEventListener('click', function () { setMode(false); });
  document.getElementById('mode-light').addEventListener('click', function () { setMode(true); });

  var sw = document.getElementById('switcher');
  var btn = document.getElementById('mobile-theme-btn');
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    if ($(sw).is(':visible')) { $(sw).stop(true, true).hide(); btn.classList.remove('open'); }
    else { $(sw).stop(true, true).css({ 'margin-left': 0 }).fadeIn(150); btn.classList.add('open'); }
  });
  document.getElementById('hideSwitcher').addEventListener('click', function () { btn.classList.remove('open'); });
  document.addEventListener('click', function (e) {
    if (window.innerWidth < 992 && $(sw).is(':visible') && !sw.contains(e.target) && !btn.contains(e.target)) {
      $(sw).hide(); btn.classList.remove('open');
    }
  });

  var cta = document.getElementById('mh-cta');
  if (cta) cta.addEventListener('click', function (e) {
    e.preventDefault();
    var items = document.querySelectorAll('.mobile-nav-element');
    if (items[3]) items[3].click();
  });
})();

/* tab bar: wave notch + floating puck that glides to the active tab */
(function () {
  var bar = document.getElementById('inputmobile'), ul = document.getElementById('mobile-nav');
  if (!bar || !ul) return;
  var NS = 'http://www.w3.org/2000/svg';
  var R = 20, D = 57, HW = 78, PUCK = 66;
  var svg = document.createElementNS(NS, 'svg'), fill = document.createElementNS(NS, 'path'), line = document.createElementNS(NS, 'path');
  svg.setAttribute('class', 'tb-bg'); svg.setAttribute('aria-hidden', 'true'); fill.setAttribute('class', 'tb-fill'); line.setAttribute('class', 'tb-line'); svg.appendChild(fill); svg.appendChild(line);
  var puck = document.createElement('span'); puck.className = 'tb-puck';
  bar.insertBefore(svg, ul); bar.insertBefore(puck, ul);
  var cx = null, raf = 0;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function draw(x) {
    var W = bar.clientWidth, hw = HW;
    if (x - hw < 2) hw = x - 2;
    if (W - x - hw < 2) hw = W - x - 2;
    var H = bar.clientHeight;
    var top = 'H' + (x - hw) +
      ' C' + (x - hw * 0.45) + ',0 ' + (x - hw * 0.7) + ',' + D + ' ' + x + ',' + D +
      ' C' + (x + hw * 0.7) + ',' + D + ' ' + (x + hw * 0.45) + ',0 ' + (x + hw) + ',0 H' + W;
    /* fill bleeds past the screen edges so there is no seam; the line is only the top contour */
    fill.setAttribute('d', 'M-4,' + (H + 4) + ' V0 ' + top + ' H' + (W + 4) + ' V' + (H + 4) + ' Z');
    line.setAttribute('d', 'M0,0 ' + top);
    puck.style.transform = 'translateX(' + (x - PUCK / 2) + 'px)';
  }
  function targetX() {
    var li = ul.querySelector('.mobile-nav-element.active');
    if (!li || !bar.clientWidth) return null;
    var r = li.getBoundingClientRect(), b = bar.getBoundingClientRect();
    return r.left - b.left + r.width / 2;
  }
  function go(instant) {
    var t = targetX(); if (t === null) return;
    cancelAnimationFrame(raf);
    if (cx === null || instant || reduce) { cx = t; draw(cx); return; }
    var from = cx, t0 = performance.now(), dur = 420;
    (function step(now) {
      var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      cx = from + (t - from) * e; draw(cx);
      if (k < 1) raf = requestAnimationFrame(step);
    })(t0);
  }
  new MutationObserver(function () { go(false); }).observe(ul, { attributes: true, attributeFilter: ['class'], subtree: true });
  window.addEventListener('resize', function () { go(true); });
  window.addEventListener('load', function () { go(true); });
  go(true);
})();
