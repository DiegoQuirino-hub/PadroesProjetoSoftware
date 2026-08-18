// Equivalente ao Display.razor
// Como não há SignalR, usa polling a cada 2 segundos (simula tempo real)

let ultimaSenha = null;

async function carregarInstancia() {
  try {
    const res = await fetch('/api/fila/instancia');
    const { instanceId, createdAt } = await res.json();
    document.getElementById('instanceId').textContent = `#${instanceId} (criada às ${createdAt})`;
  } catch {
    document.getElementById('instanceId').textContent = 'indisponível';
  }
}

async function atualizar() {
  try {
    const [resAtual, resHistorico] = await Promise.all([
      fetch('/api/fila/atual'),
      fetch('/api/fila/historico')
    ]);

    const senha = await resAtual.json();
    const historico = await resHistorico.json();

    // Animação ao mudar a senha
    if (senha !== ultimaSenha && senha > 0) {
      const el = document.getElementById('senhaAtual');
      el.style.transition = 'transform 0.3s, opacity 0.3s';
      el.style.opacity = '0';
      el.style.transform = 'scale(0.8)';
      setTimeout(() => {
        el.textContent = senha;
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
      }, 300);
      ultimaSenha = senha;
    } else if (senha === 0) {
      document.getElementById('senhaAtual').textContent = '—';
    }

    // Historico
    const ul = document.getElementById('historico');
    if (historico.length === 0) {
      ul.innerHTML = '<li style="background:none;border:none;color:var(--ink-soft)">Aguardando chamadas...</li>';
    } else {
      ul.innerHTML = [...historico].reverse()
        .map(s => `<li>🎫 ${s}</li>`)
        .join('');
    }
  } catch {
    // Sem alert para não poluir o display em produção
    console.warn('Falha ao buscar dados da API');
  }
}

// Polling a cada 2 segundos
carregarInstancia();
atualizar();
setInterval(atualizar, 2000);
