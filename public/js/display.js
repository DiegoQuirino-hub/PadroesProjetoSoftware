// Equivalente ao Display.razor
// Como não há SignalR, usa polling a cada 2 segundos (simula tempo real)
// Agora exibindo o código da senha (ex: V001) e a fila de espera por tipo

let ultimoCodigo = null;

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
    const [resAtual, resHistorico, resEspera] = await Promise.all([
      fetch('/api/fila/atual'),
      fetch('/api/fila/historico'),
      fetch('/api/fila/espera')
    ]);

    const senha = resAtual.status === 204 ? null : await resAtual.json();
    const historico = await resHistorico.json();
    const espera = await resEspera.json();

    // Animação ao mudar a senha
    if (senha && senha.codigo !== ultimoCodigo) {
      const el = document.getElementById('senhaAtual');
      el.style.transition = 'transform 0.3s, opacity 0.3s';
      el.style.opacity = '0';
      el.style.transform = 'scale(0.8)';
      setTimeout(() => {
        el.textContent = senha.codigo;
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
      }, 300);
      ultimoCodigo = senha.codigo;
    } else if (!senha) {
      document.getElementById('senhaAtual').textContent = '—';
    }

    // Histórico
    const ul = document.getElementById('historico');
    if (historico.length === 0) {
      ul.innerHTML = '<li style="background:none;border:none;color:var(--ink-soft)">Aguardando chamadas...</li>';
    } else {
      ul.innerHTML = [...historico].reverse()
        .map(s => `<li>🎫 ${s.codigo} <small>(${s.tipo})</small></li>`)
        .join('');
    }

    // Fila de espera por tipo
    const elEspera = document.getElementById('filaEspera');
    if (elEspera) {
      elEspera.textContent = `Aguardando — VIP: ${espera.VIP ?? 0} | Preferencial: ${espera.PREFERENCIAL ?? 0} | Normal: ${espera.NORMAL ?? 0}`;
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
