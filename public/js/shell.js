// Comportamento comum às telas: relógio, item de menu ativo, lâmpada de conexão
// e o componente de leitura em células de dígito (renderReadout).

(function () {
  // ---- Relógio ----
  var clocks = document.querySelectorAll('[data-clock]');
  function tick() {
    var s = new Date().toLocaleTimeString('pt-BR', { hour12: false });
    clocks.forEach(function (el) { el.textContent = s; });
  }
  if (clocks.length) { tick(); setInterval(tick, 1000); }

  // ---- Menu ativo ----
  var path = location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav a').forEach(function (a) {
    var href = a.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === path) a.setAttribute('aria-current', 'page');
  });

  // ---- Lâmpada de conexão ----
  window.setConnection = function (ok) {
    document.querySelectorAll('.status').forEach(function (el) {
      el.dataset.status = ok ? 'on' : 'off';
    });
    var banner = document.getElementById('offlineBanner');
    if (banner) banner.hidden = ok;
  };

  // ---- Componente de células de dígito ----
  // renderReadout(el, valor, { minCells })
  window.renderReadout = function (el, value, opts) {
    opts = opts || {};
    var min = opts.minCells || 3;
    var target;
    var empty = value == null || value === '' || Number(value) <= 0;

    if (empty) {
      target = Array(min + 1).join('–'); // en dashes
      el.classList.add('is-empty');
    } else {
      target = String(value);
      while (target.length < min) target = '0' + target;
      el.classList.remove('is-empty');
    }

    var prev = el.dataset.value || '';
    var rebuild = el.children.length !== target.length;

    if (rebuild) {
      el.textContent = '';
      for (var i = 0; i < target.length; i++) {
        el.appendChild(makeCell(target[i], !empty && prev !== ''));
      }
    } else {
      for (var j = 0; j < target.length; j++) {
        var cell = el.children[j];
        var inner = cell.firstChild;
        if (inner.textContent !== target[j]) {
          inner.textContent = target[j];
          if (!empty) flash(cell);
        }
      }
    }
    el.dataset.value = empty ? '' : target;
  };

  function makeCell(ch, animate) {
    var cell = document.createElement('span');
    cell.className = 'cell';
    var inner = document.createElement('span');
    inner.className = 'cell-inner';
    inner.textContent = ch;
    cell.appendChild(inner);
    if (animate) flash(cell);
    return cell;
  }

  function flash(cell) {
    cell.classList.remove('is-changing');
    void cell.offsetWidth;
    cell.classList.add('is-changing');
    setTimeout(function () { cell.classList.remove('is-changing'); }, 560);
  }
})();
