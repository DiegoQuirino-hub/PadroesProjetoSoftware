# PainelSenhas

Sistema de painel de senhas (fila de atendimento), reescrito de **C# / ASP.NET** para **Java / Spring Boot**, usado como exercício de Padrões de Projeto de Software — com destaque para o padrão **Singleton** aplicado à fila de senhas (`QueueService`).

O front-end (HTML/CSS/JS + servidor Node/Express) vive na branch [`frontend`](../../tree/frontend) e consome a API deste back-end.

## Arquitetura

```mermaid
graph TB
    subgraph Cliente["Navegador"]
        UI["Páginas HTML/JS<br/>index · login · atendente · display"]
    end

    subgraph Front["Front-end · Node/Express (branch frontend) · :3000"]
        Static["Arquivos estáticos<br/>public/"]
        Proxy["Proxy /api/*<br/>http-proxy-middleware"]
    end

    subgraph Back["Back-end · Spring Boot · :8080"]
        Security["SecurityConfig<br/>HTTP Basic + BCrypt"]
        AuthCtrl["AuthController<br/>/api/auth/*"]
        QueueCtrl["QueueController<br/>/api/fila/*"]
        Singleton["QueueService<br/>«Singleton» getInstance()"]
        Repo["UserRepository<br/>Spring Data JPA"]
    end

    DB[("SQL Server<br/>tabela users")]

    UI -->|"HTTP"| Static
    UI -->|"fetch /api/..."| Proxy
    Proxy -->|"proxy_pass :8080"| Security
    Security --> AuthCtrl
    Security --> QueueCtrl
    AuthCtrl --> Repo
    QueueCtrl -->|"getInstance()"| Singleton
    Repo --> DB
```

## Padrão Singleton em ação

Todas as requisições — de qualquer usuário, a qualquer momento — acessam a **mesma instância** de `QueueService`, garantindo um contador de senhas e um histórico únicos e consistentes.

```mermaid
sequenceDiagram
    participant A as Atendente
    participant D as Display
    participant C as QueueController
    participant S as QueueService (Singleton)

    A->>C: POST /api/fila/gerar
    C->>S: getInstance()
    Note over S: instância única<br/>criada na 1ª chamada
    S-->>C: mesma instância sempre
    C->>S: generateTicket() + callNext()
    S-->>C: nova senha

    D->>C: GET /api/fila/atual
    C->>S: getInstance()
    S-->>C: mesma instância
    S-->>D: senha atual (compartilhada com o Atendente)
```

## Como rodar

### Pré-requisitos
- Java 21+
- Maven
- SQL Server acessível em `localhost` (usado apenas pela autenticação)
- Node.js (para o front-end, branch `frontend`)

### Back-end (Spring Boot)
```bash
mvn spring-boot:run
```
Sobe em `http://localhost:8080`. Configure a conexão em `src/main/resources/application.properties`.

### Front-end (branch `frontend`)
```bash
git checkout frontend
npm install
npm start
```
Sobe em `http://localhost:3000` e faz proxy de `/api/*` para o back-end em `:8080`.

## Endpoints principais

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| POST | `/api/auth/register` | Cadastra usuário | Pública |
| POST | `/api/auth/login` | Login (HTTP Basic) | Pública |
| GET | `/api/auth/me` | Dados do usuário logado | Requer login |
| POST | `/api/fila/gerar` | Gera nova senha | Pública |
| GET | `/api/fila/atual` | Senha atual | Pública |
| GET | `/api/fila/historico` | Histórico de senhas chamadas | Pública |
