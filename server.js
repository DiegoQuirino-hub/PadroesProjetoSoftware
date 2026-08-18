const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000;
const API_URL = 'http://localhost:8080'; // Spring Boot

// Serve arquivos estáticos da pasta public/
app.use(express.static('public'));

// Proxy: redireciona /api/* para o Spring Boot (evita problemas de CORS)
// pathRewrite recoloca o prefixo /api, que o Express remove por padrão
// ao montar o middleware em app.use('/api', ...).
app.use('/api', createProxyMiddleware({
  target: API_URL,
  changeOrigin: true,
  pathRewrite: (path) => `/api${path}`,
}));

// Rotas das páginas
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.get('/atendente', (req, res) => res.sendFile(__dirname + '/public/atendente.html'));
app.get('/display', (req, res) => res.sendFile(__dirname + '/public/display.html'));
app.get('/login', (req, res) => res.sendFile(__dirname + '/public/login.html'));
app.get('/fluxo', (req, res) => res.sendFile(__dirname + '/public/fluxo.html'));

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`API Spring Boot esperada em ${API_URL}`);
});
