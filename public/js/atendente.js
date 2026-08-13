// Equivalente ao Atendente.razor

async function carregarEstadoInicial() {
  try {
    const res = await fetch('/api/fila/atual');
    const senha = await res.json();
    if (senha > 0) document.getElementById('senhaAtual').textContent = senha;
    await carregarHistorico();
  } catch {
    mostrarAlerta('Não foi possível conectar à API. Verifique se o servidor Java está rodando.', 'error');
  }
}

async function gerarNovaSenha() {
  const btn = document.getElementById('btnGerar');
  btn.disabled = true;
  btn.textContent = 'Gerando...';

  try {
    const res = await fetch('/api/fila/gerar', { method: 'POST' });

    if (!res.ok) throw new Error('Erro na API');

    const novaSenha = await res.json();
    document.getElementById('senhaAtual').textContent = novaSenha;
    mostrarAlerta(`Senha ${novaSenha} gerada com sucesso!`, 'success');
    await carregarHistorico();
  } catch {
    mostrarAlerta('Erro ao gerar senha. Tente novamente.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '➕ Gerar Nova Senha';
  }
}

async function carregarHistorico() {
  const res = await fetch('/api/fila/historico');
  const lista = await res.json();
  const ul = document.getElementById('historico');

  if (lista.length === 0) {
    ul.innerHTML = '<li style="background:none;border:none;color:var(--text-muted)">Nenhuma senha gerada ainda.</li>';
    return;
  }

  ul.innerHTML = [...lista].reverse()
    .map(s => `<li>🎫 ${s}</li>`)
    .join('');
}

function mostrarAlerta(msg, tipo) {
  const el = document.getElementById('alert');
  el.textContent = msg;
  el.className = `alert alert-${tipo} show`;
  setTimeout(() => { el.className = 'alert'; }, 3000);
}

// Inicializa ao carregar a página
carregarEstadoInicial();
