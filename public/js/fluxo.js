// Anima o caminho real de uma emissão de senha sobre um diagrama Mermaid,
// deixando visível que a requisição passa sempre pela MESMA instância de
// QueueService (o Singleton).

var definicao = [
  'flowchart LR',
  'flowchart LR',
  '  ATD["Atendente"]',
  '  CTRL["QueueController"]',
  '  SVC(("QueueService<br/>«Singleton»"))',
  '  D1["Display A"]',
  '  D2["Display B"]',
  '  ATD -->|"POST /api/fila/gerar"| CTRL',
  '  CTRL -->|"getInstance()"| SVC',
  '  SVC -->|"estado"| D1',
  '  SVC -->|"estado"| D2'
].join('\n');

var mermaidPronto = false;

async function iniciarDiagrama() {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
      fontFamily: 'IBM Plex Mono, monospace',
      primaryColor: '#16262A',
      primaryTextColor: '#EAF0EE',
      primaryBorderColor: '#E86A17',
      lineColor: '#8CA3A0',
      secondaryColor: '#0E1719',
      tertiaryColor: '#0E1719',
      background: '#0E1719',
      mainBkg: '#16262A',
      nodeBorder: '#E86A17',
      clusterBkg: '#0E1719',
      edgeLabelBackground: '#0E1719',
      textColor: '#EAF0EE'
    }
  });
  var out = await mermaid.render('grafoFluxo', definicao);
  document.getElementById('diagrama').innerHTML = out.svg;
  mermaidPronto = true;
}

function acharNode(trecho) {
  var nodes = document.querySelectorAll('#diagrama .node');
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].textContent.indexOf(trecho) !== -1) return nodes[i];
  }
  return null;
}

function centro(el) {
  var box = document.getElementById('diagrama').getBoundingClientRect();
  var r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
}

function pulsar(el) {
  var forma = el.querySelector('rect, polygon, circle, ellipse');
  if (!forma) return;
  forma.classList.add('node-active');
  setTimeout(function () { forma.classList.remove('node-active'); }, 900);
}

function moverPacote(de, para, ms) {
  ms = ms || 700;
  return new Promise(function (resolve) {
    var wrap = document.getElementById('diagrama');
    var packet = document.createElement('div');
    packet.className = 'packet';
    wrap.appendChild(packet);

    var ini = centro(de), fim = centro(para);
    packet.style.left = ini.x + 'px';
    packet.style.top = ini.y + 'px';
    packet.style.transition = 'left ' + ms + 'ms ease, top ' + ms + 'ms ease';

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        packet.style.left = fim.x + 'px';
        packet.style.top = fim.y + 'px';
      });
    });
    setTimeout(function () { pulsar(para); packet.remove(); resolve(); }, ms + 30);
  });
}

function logPasso(texto, erro) {
  var li = document.createElement('li');
  li.textContent = texto;
  if (erro) li.className = 'is-error';
  var lista = document.getElementById('logPassos');
  lista.appendChild(li);
  lista.scrollTop = lista.scrollHeight;
}

async function simularFluxo() {
  var btn = document.getElementById('btnSimular');
  btn.disabled = true;
  document.getElementById('logPassos').innerHTML = '';

  if (!mermaidPronto) await iniciarDiagrama();

  var atd = acharNode('Atendente');
  var ctrl = acharNode('QueueController');
  var svc = acharNode('QueueService');
  var d1 = acharNode('Display A');
  var d2 = acharNode('Display B');

  pulsar(atd);
  logPasso('Atendente dispara POST /api/fila/gerar');
  await moverPacote(atd, ctrl);

  logPasso('QueueController recebe a requisição e chama QueueService.getInstance()');
  await moverPacote(ctrl, svc);

  var resultado;
  try {
    var res = await fetch('/api/fila/gerar', { method: 'POST' });
    resultado = await res.json();
  } catch (e) {
    logPasso('Erro ao chamar a API. Verifique se o back-end está no ar.', true);
    btn.disabled = false;
    return;
  }

  logPasso('getInstance() reaproveita a instância existente — nova senha: ' + resultado);
  pulsar(svc);

  logPasso('A mesma instância propaga o novo estado para os displays');
  await Promise.all([moverPacote(svc, d1), moverPacote(svc, d2)]);

  logPasso('Display A e Display B mostram a mesma senha — leram do mesmo objeto');
  btn.disabled = false;
}

document.getElementById('btnSimular').addEventListener('click', simularFluxo);
iniciarDiagrama();
