// Equivalente ao Atendente.razor
// Agora com emissão de senhas por tipo (Factory Method: Normal/Preferencial/VIP)

async function carregarEstadoInicial() {
  try {
    await carregarAtual();
    await carregarHistorico();
    await carregarEspera();
    await carregarInstancia();
  } catch {
    mostrarAlerta('Não foi possível conectar à API. Verifique se o servidor Java está rodando.', 'error');
  }
}

async function carregarAtual() {
  const res = await fetch('/api/fila/atual');
  if (res.status === 204) {
    document.getElementById('senhaAtual').textContent = '—';
    return;
  }
  const senha = await res.json();
  document.getElementById('senhaAtual').textContent = senha.codigo;
}

async function carregarInstancia() {
  try {
    const res = await fetch('/api/fila/instancia');
    const { instanceId, createdAt } = await res.json();
    document.getElementById('instanceId').textContent = `#${instanceId} (criada às ${createdAt})`;
  } catch {
    document.getElementById('instanceId').textContent = 'indisponível';
  }
}

async function gerarNovaSenha() {
  const tipo = document.getElementById('tipoSenha').value;
  const btn = document.getElementById('btnGerar');
  const textoOriginal = btn.innerHTML;
  btn.disabled = true;
  btn.textContent = 'Gerando...';

  try {
    const res = await fetch(`/api/fila/gerar/${tipo}`, { method: 'POST' });

    if (!res.ok) throw new Error('Erro na API');

    const senha = await res.json();
    mostrarAlerta(`Senha ${senha.codigo} (${senha.tipo}) emitida com sucesso!`, 'success');
    await carregarHistorico();
    await carregarEspera();
  } catch {
    mostrarAlerta('Erro ao gerar senha. Tente novamente.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = textoOriginal;
  }
}

async function chamarProxima() {
  const btn = document.getElementById('btnChamar');
  const textoOriginal = btn.innerHTML;
  btn.disabled = true;
  btn.textContent = 'Chamando...';

  try {
    const res = await fetch('/api/fila/chamar-proximo', { method: 'POST' });

    if (res.status === 204) {
      mostrarAlerta('Não há senhas aguardando na fila.', 'error');
      return;
    }
    if (!res.ok) throw new Error('Erro na API');

    const senha = await res.json();
    document.getElementById('senhaAtual').textContent = senha.codigo;
    mostrarAlerta(`Chamando senha ${senha.codigo} (${senha.tipo})`, 'success');
    await carregarHistorico();
    await carregarEspera();
  } catch {
    mostrarAlerta('Erro ao chamar próxima senha.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = textoOriginal;
  }
}

async function carregarHistorico() {
  const res = await fetch('/api/fila/historico');
  const lista = await res.json();
  const ul = document.getElementById('historico');

  if (lista.length === 0) {
    ul.innerHTML = '<li style="background:none;border:none;color:var(--ink-soft)">Nenhuma senha chamada ainda.</li>';
    return;
  }

  ul.innerHTML = [...lista].reverse()
    .map(s => `<li>🎫 ${s.codigo} <small>(${s.tipo})</small></li>`)
    .join('');
}

async function carregarEspera() {
  try {
    const res = await fetch('/api/fila/espera');
    const espera = await res.json();
    const el = document.getElementById('filaEspera');
    if (el) {
      el.textContent = `Aguardando — VIP: ${espera.VIP ?? 0} | Preferencial: ${espera.PREFERENCIAL ?? 0} | Normal: ${espera.NORMAL ?? 0}`;
    }
  } catch {
    // silencioso — não é crítico para o funcionamento da tela
  }
}

function mostrarAlerta(msg, tipo) {
  const el = document.getElementById('alert');
  el.textContent = msg;
  el.className = `alert alert-${tipo} show`;
  setTimeout(() => { el.className = 'alert'; }, 3000);
}

// Inicializa ao carregar a página
carregarEstadoInicial();
