// Acesso restrito — login e registro (equivalente ao Identity do ASP.NET).

function switchView(view) {
  document.getElementById('view-login').hidden = view !== 'login';
  document.getElementById('view-register').hidden = view !== 'register';
  document.getElementById('seg-login').classList.toggle('is-active', view === 'login');
  document.getElementById('seg-register').classList.toggle('is-active', view === 'register');
}

document.querySelectorAll('[data-goto]').forEach(function (el) {
  el.addEventListener('click', function () { switchView(el.dataset.goto); });
});

function alerta(form, msg, tipo) {
  var el = document.getElementById('alert-' + form);
  el.textContent = msg;
  el.className = 'toast show ' + (tipo ? 'is-' + tipo : '');
  clearTimeout(el._t);
  el._t = setTimeout(function () { el.className = 'toast'; }, 4000);
}

async function fazerLogin() {
  var email = document.getElementById('login-email').value.trim();
  var senha = document.getElementById('login-senha').value;
  if (!email || !senha) { alerta('login', 'Informe e-mail e senha.', 'error'); return; }

  try {
    var res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Authorization': 'Basic ' + btoa(email + ':' + senha) }
    });
    if (res.ok) {
      sessionStorage.setItem('credentials', btoa(email + ':' + senha));
      alerta('login', 'Acesso liberado. Redirecionando…', 'success');
      setTimeout(function () { window.location.href = '/'; }, 1200);
    } else {
      alerta('login', 'E-mail ou senha incorretos.', 'error');
    }
  } catch (e) {
    alerta('login', 'Sem conexão com o servidor.', 'error');
  }
}

async function fazerRegistro() {
  var email = document.getElementById('reg-email').value.trim();
  var senha = document.getElementById('reg-senha').value;
  if (!email || !senha) { alerta('register', 'Informe e-mail e senha.', 'error'); return; }
  if (senha.length < 6) { alerta('register', 'A senha precisa ter ao menos 6 caracteres.', 'error'); return; }

  try {
    var res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: senha })
    });
    var msg = await res.text();
    if (res.ok) {
      alerta('register', 'Conta criada. Faça login para continuar.', 'success');
      setTimeout(function () { switchView('login'); }, 1600);
    } else {
      alerta('register', msg, 'error');
    }
  } catch (e) {
    alerta('register', 'Sem conexão com o servidor.', 'error');
  }
}

document.getElementById('btnLogin').addEventListener('click', fazerLogin);
document.getElementById('btnRegister').addEventListener('click', fazerRegistro);

document.querySelectorAll('.field input').forEach(function (input) {
  input.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    if (document.getElementById('view-login').hidden) fazerRegistro();
    else fazerLogin();
  });
});
