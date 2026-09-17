# PainelSenhas

Sistema de painel de senhas (fila de atendimento), reescrito de **C# / ASP.NET** para **Java / Spring Boot**, usado como exercício de Padrões de Projeto de Software — com destaque para o padrão **Singleton** aplicado à fila de senhas (`QueueService`) e o padrão **Factory Method** aplicado à emissão de senhas de tipos diferentes (`TicketFactory`).

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

    DB[("SQLite<br/>painelsenhas.db")]

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

## Padrão Factory Method em ação

`QueueController` nunca instancia `NormalTicketFactory`, `PreferencialTicketFactory` ou `VipTicketFactory` diretamente — ele pede uma senha do tipo informado, e `TicketFactoryProvider` escolhe a Factory concreta correspondente. Cada Factory decide o prefixo e a prioridade da senha (`Ticket`) que ela cria.

```mermaid
classDiagram
    class TicketFactory {
        <<abstract>>
        +criarSenha(numero) Ticket
        +emitirSenha(numero) Ticket
    }
    class NormalTicketFactory
    class PreferencialTicketFactory
    class VipTicketFactory
    class TicketFactoryProvider {
        +getFactory(TicketType) TicketFactory
    }
    class QueueService {
        +generateTicket(TicketType) Ticket
        +callNext() Ticket
    }

    TicketFactory <|-- NormalTicketFactory
    TicketFactory <|-- PreferencialTicketFactory
    TicketFactory <|-- VipTicketFactory
    TicketFactoryProvider --> TicketFactory : cria
    QueueService --> TicketFactoryProvider : usa
```

A prioridade atribuída por cada Factory concreta (Normal = 1, Preferencial = 2, VIP = 3) é o que muda o comportamento real do `callNext()`: a fila VIP é sempre esvaziada antes da Preferencial, que é esvaziada antes da Normal.

## Como rodar

### Pré-requisitos
- Java 21+
- Maven
- Nenhum servidor de banco necessário — usa **SQLite** (arquivo local `painelsenhas.db`, criado automaticamente na primeira execução)
- Node.js (opcional — só se quiser rodar o front-end separado pela branch `frontend`; o Spring Boot já serve `public/` sozinho em `:8080`)

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
| POST | `/api/fila/gerar/{tipo}` | Emite nova senha (`tipo` = `normal`, `preferencial` ou `vip`) | Pública |
| POST | `/api/fila/chamar-proximo` | Chama a próxima senha (prioridade: VIP > Preferencial > Normal) | Pública |
| GET | `/api/fila/atual` | Última senha chamada | Pública |
| GET | `/api/fila/historico` | Histórico de senhas chamadas | Pública |
| GET | `/api/fila/espera` | Quantidade de senhas aguardando, por tipo | Pública |
| GET | `/api/fila/instancia` | Prova do Singleton (id + horário de criação) | Pública |
