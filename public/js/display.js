// Painel de chamada — consulta a fila única a cada 2 s (não há SignalR).

var readoutEl = document.getElementById('senhaAtual');
var historicoEl = document.getElementById('historico');
var instanceEl = document.getElementById('instanceId');

var ultimaSenha = null;

async function carregarInstancia() {
  try {
    var res = await fetch('/api/fila/instancia');
    var d = await res.json();
    instanceEl.textContent = d.instanceId + ' · ' + d.createdAt;
  } catch (e) {
    instanceEl.textContent = 'indisponível';
  }
}

function renderHistorico(hist) {
  if (!hist.length) {
    historicoEl.innerHTML = '<li class="ledger-empty">Aguardando chamadas…</li>';
    return;
  }
  historicoEl.innerHTML = hist.slice().reverse().slice(0, 6).map(function (n) {
    return '<li><span class="ledger-n">' + String(n).padStart(3, '0') + '</span></li>';
  }).join('');
}

async function atualizar() {
  try {
    var [rAtual, rHist] = await Promise.all([
      fetch('/api/fila/atual'),
      fetch('/api/fila/historico')
    ]);
    var senha = await rAtual.json();
    var hist = await rHist.json();

    if (senha !== ultimaSenha) {
      renderReadout(readoutEl, senha, { minCells: 3 });
      ultimaSenha = senha;
    }
    renderHistorico(hist);
    setConnection(true);
  } catch (e) {
    setConnection(false);
  }
}

carregarInstancia();
atualizar();
setInterval(atualizar, 2000);
setInterval(carregarInstancia, 30000);
