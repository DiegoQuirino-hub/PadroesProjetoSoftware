// Anima o fluxo real de uma requisição de geração de senha sobre um diagrama Mermaid,
// para deixar visível — durante uma aula — o caminho que passa sempre pela MESMA
// instância de QueueService (o Singleton).

const definicao = `
flowchart LR
    ATD["🖥️ Atendente"]
    CTRL["⚙️ QueueController"]
    SVC(("🔒 QueueService<br/>«Singleton»"))
    D1["📺 Display A"]
    D2["📺 Display B"]

    ATD -->|"POST /api/fila/gerar"| CTRL
    CTRL -->|"getInstance()"| SVC
    SVC -->|"notifica"| D1
    SVC -->|"notifica"| D2
`;

let mermaidPronto = false;

async function iniciarDiagrama() {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
      fontFamily: 'IBM Plex Mono, monospace',
      primaryColor: '#26333f',
      primaryTextColor: '#f6f1e4',
      primaryBorderColor: '#d9820a',
      lineColor: '#d9820a',
      secondaryColor: '#16202b',
      tertiaryColor: '#16202b',
      background: '#16202b',
      mainBkg: '#26333f',
      nodeBorder: '#d9820a',
      clusterBkg: '#16202b',
      edgeLabelBackground: '#16202b',
      textColor: '#f6f1e4',
    },
  });
  const { svg } = await mermaid.render('grafoFluxo', definicao);
  document.getElementById('diagrama').innerHTML = svg;
  mermaidPronto = true;
}

function encontrarNodePorTexto(trecho) {
  const nodes = document.querySelectorAll('#diagrama .node');
  for (const n of nodes) {
    if (n.textContent.includes(trecho)) return n;
  }
  return null;
}

function centro(elemento) {
  const containerRect = document.getElementById('diagrama').getBoundingClientRect();
  const r = elemento.getBoundingClientRect();
  return {
    x: r.left + r.width / 2 - containerRect.left,
    y: r.top + r.height / 2 - containerRect.top,
  };
}

function pulsar(elemento, classe = 'node-ativo') {
  const forma = elemento.querySelector('rect, polygon, circle, ellipse');
  if (!forma) return;
  forma.classList.add(classe);
  setTimeout(() => forma.classList.remove(classe), 900);
}

function moverPacote(deElemento, paraElemento, duracaoMs = 700) {
  return new Promise((resolve) => {
    const wrap = document.getElementById('diagrama');
    const packet = document.createElement('div');
    packet.className = 'packet';
    wrap.appendChild(packet);

    const inicio = centro(deElemento);
    const fim = centro(paraElemento);

    packet.style.left = `${inicio.x}px`;
    packet.style.top = `${inicio.y}px`;
    packet.style.transition = `left ${duracaoMs}ms ease, top ${duracaoMs}ms ease`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        packet.style.left = `${fim.x}px`;
        packet.style.top = `${fim.y}px`;
      });
    });

    setTimeout(() => {
      pulsar(paraElemento);
      packet.remove();
      resolve();
    }, duracaoMs + 30);
  });
}

function logPasso(texto) {
  const li = document.createElement('li');
  li.textContent = texto;
  const lista = document.getElementById('logPassos');
  lista.appendChild(li);
  lista.scrollTop = lista.scrollHeight;
}

function limparLog() {
  document.getElementById('logPassos').innerHTML = '';
}

async function simularFluxo() {
  const btn = document.getElementById('btnSimular');
  btn.disabled = true;
  limparLog();

  if (!mermaidPronto) await iniciarDiagrama();

  const atd = encontrarNodePorTexto('Atendente');
  const ctrl = encontrarNodePorTexto('QueueController');
  const svc = encontrarNodePorTexto('QueueService');
  const d1 = encontrarNodePorTexto('Display A');
  const d2 = encontrarNodePorTexto('Display B');

  pulsar(atd);
  logPasso('1. Atendente dispara POST /api/fila/gerar');
  await moverPacote(atd, ctrl);

  logPasso('2. QueueController recebe a requisição e chama QueueService.getInstance()');
  await moverPacote(ctrl, svc);

  let resultado;
  try {
    const res = await fetch('/api/fila/gerar', { method: 'POST' });
    resultado = await res.json();
  } catch {
    logPasso('❌ Erro ao chamar a API. Verifique se o back-end está rodando.');
    btn.disabled = false;
    return;
  }

  logPasso(`3. getInstance() reaproveita a instância já existente — nova senha gerada: ${resultado}`);
  pulsar(svc);

  logPasso('4. QueueService (a mesma instância) propaga o novo estado para os displays');
  await Promise.all([moverPacote(svc, d1), moverPacote(svc, d2)]);

  logPasso('5. Display A e Display B mostram a mesma senha — porque leram do mesmo objeto compartilhado');

  btn.disabled = false;
}

document.getElementById('btnSimular').addEventListener('click', simularFluxo);
iniciarDiagrama();
