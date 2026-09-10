// Console do atendente — emite senhas na fila única (QueueService no servidor).

var readoutEl = document.getElementById('senhaAtual');
var btn = document.getElementById('btnGerar');
var toastEl = document.getElementById('toast');
var historicoEl = document.getElementById('historico');
var totalEl = document.getElementById('totalEmitidas');
var instanceEl = document.getElementById('instanceId');

var emissoes = []; // { n, hora } — hora só para as emitidas nesta sessão

function agora() {
  return new Date().toLocaleTimeString('pt-BR', { hour12: false });
}

function toast(msg, tipo) {
  toastEl.textContent = msg;
  toastEl.className = 'toast show ' + (tipo ? 'is-' + tipo : '');
  clearTimeout(toast._t);
  toast._t = setTimeout(function () { toastEl.className = 'toast'; }, 3200);
}

function renderHistorico() {
  if (emissoes.length === 0) {
    historicoEl.innerHTML = '<li class="ledger-empty">Nenhuma senha emitida ainda.</li>';
  } else {
    historicoEl.innerHTML = emissoes.map(function (e) {
      return '<li><span class="ledger-n">' + String(e.n).padStart(3, '0') + '</span>' +
             '<span class="ledger-t">' + (e.hora || 'sessão anterior') + '</span></li>';
    }).join('');
  }
  totalEl.textContent = emissoes.length + (emissoes.length === 1 ? ' hoje' : ' hoje');
}

async function carregarInstancia() {
  try {
    var res = await fetch('/api/fila/instancia');
    var d = await res.json();
    instanceEl.textContent = d.instanceId + ' · no ar desde ' + d.createdAt;
  } catch (e) {
    instanceEl.textContent = 'indisponível';
  }
}

async function carregarEstado() {
  try {
    var [rAtual, rHist] = await Promise.all([
      fetch('/api/fila/atual'),
      fetch('/api/fila/historico')
    ]);
    var atual = await rAtual.json();
    var hist = await rHist.json();

    renderReadout(readoutEl, atual, { minCells: 3 });
    emissoes = hist.slice().reverse().map(function (n) { return { n: n, hora: null }; });
    renderHistorico();
    setConnection(true);
    carregarInstancia();
  } catch (e) {
    setConnection(false);
    toast('Sem conexão com o servidor. Verifique se o back-end está no ar.', 'error');
  }
}

async function emitirSenha() {
  btn.disabled = true;
  try {
    var res = await fetch('/api/fila/gerar', { method: 'POST' });
    if (!res.ok) throw new Error('http ' + res.status);
    var nova = await res.json();

    renderReadout(readoutEl, nova, { minCells: 3 });
    emissoes.unshift({ n: nova, hora: agora() });
    renderHistorico();
    toast('Senha ' + String(nova).padStart(3, '0') + ' emitida.', 'success');
    setConnection(true);
  } catch (e) {
    setConnection(false);
    toast('Não foi possível emitir a senha. Tente novamente.', 'error');
  } finally {
    btn.disabled = false;
  }
}

btn.addEventListener('click', emitirSenha);

document.addEventListener('keydown', function (e) {
  if ((e.code === 'Space' || e.key === 'Enter') &&
      !/^(INPUT|TEXTAREA|BUTTON)$/.test(document.activeElement.tagName)) {
    e.preventDefault();
    emitirSenha();
  }
});

carregarEstado();
