// Equivalente às páginas de Identity do ASP.NET (Register / Login)

function showTab(tab) {
  document.getElementById('form-login').style.display    = tab === 'login'    ? 'block' : 'none';
  document.getElementById('form-register').style.display = tab === 'register' ? 'block' : 'none';
  document.getElementById('tab-login').className    = 'tab-btn' + (tab === 'login'    ? ' active' : '');
  document.getElementById('tab-register').className = 'tab-btn' + (tab === 'register' ? ' active' : '');
}

async function fazerLogin() {
  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-senha').value;

  if (!email || !senha) {
    mostrarAlerta('login', 'Preencha e-mail e senha.', 'error');
    return;
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${email}:${senha}`)
      }
    });

    if (res.ok) {
      // Guarda credenciais em memória (sessionStorage) para requisições futuras
      sessionStorage.setItem('credentials', btoa(`${email}:${senha}`));
      mostrarAlerta('login', 'Login realizado com sucesso! Redirecionando...', 'success');
      setTimeout(() => window.location.href = '/', 1500);
    } else {
      mostrarAlerta('login', 'E-mail ou senha incorretos.', 'error');
    }
  } catch {
    mostrarAlerta('login', 'Erro de conexão com o servidor.', 'error');
  }
}

async function fazerRegistro() {
  const email = document.getElementById('reg-email').value.trim();
  const senha = document.getElementById('reg-senha').value;

  if (!email || !senha) {
    mostrarAlerta('register', 'Preencha e-mail e senha.', 'error');
    return;
  }

  if (senha.length < 6) {
    mostrarAlerta('register', 'A senha deve ter pelo menos 6 caracteres.', 'error');
    return;
  }

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: senha })
    });

    const msg = await res.text();

    if (res.ok) {
      mostrarAlerta('register', msg + ' Faça login para continuar.', 'success');
      setTimeout(() => showTab('login'), 2000);
    } else {
      mostrarAlerta('register', msg, 'error');
    }
  } catch {
    mostrarAlerta('register', 'Erro de conexão com o servidor.', 'error');
  }
}

function mostrarAlerta(form, msg, tipo) {
  const el = document.getElementById(`alert-${form}`);
  el.textContent = msg;
  el.className = `alert alert-${tipo} show`;
  setTimeout(() => { el.className = 'alert'; }, 4000);
}
