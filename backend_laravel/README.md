# Migração do Backend para Laravel

## Status: MIGRAÇÃO CONCLUÍDA

Backend migration completed as of 2026-07-07. All CRUD operations, authentication, and authorization implemented.

## Índice

- [Arquitetura Atual](#arquitetura-atual)
- [Dependências](#dependências)
- [Comandos](#comandos-para-desenvolvimento)
- [Recursos Implementados](#recursos-implementados)
- [Autorização](#configuração-de-autorização)
- [Rotas Protegidas](#rotas-protegidas)
- [Documentação](#documentação)
- [Histórico: PHP Vanilla](#histórico-relatório-php-vanilla)

---

## Arquitetura Atual (Laravel 13)

### Stack

| Camada | Tecnologia |
|--------|------------|
| Backend | Laravel 13 + PHP 8.2 + MySQL/MariaDB |
| Frontend Admin | Inertia.js + React 19 + TypeScript + Vite |
| Frontend SPA | React 19 + TypeScript + Vite + Tailwind |
| Autenticação (SPA) | Laravel Sanctum (HttpOnly cookie + CSRF token) |
| Autorização | Gates + Policies (roles: user, adm, root) |
| Senhas | Argon2ID (via Laravel Hash) |

### Diagrama de Arquitetura

```
┌──────────────────────────────────────────────────────────────────┐
│                    ARQUITETURA DO BACKEND LARAVEL - ProJourney   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                   ROTAS (routes/)                        │    │
│  │                                                          │    │
│  │  ┌─────────────────────┐  ┌────────────────────────────┐ │    │
│  │  │  web.php (Inertia)  │  │  api.php (SPA Backend)     │ │    │
│  │  │  /dashboard         │  │  /api/v1/login             │ │    │
│  │  │  /user              │  │  /api/v1/profile           │ │    │
│  │  │  /settings          │  │  /api/v1/trails            │ │    │
│  │  │  /courses           │  │  /api/v1/enrollments       │ │    │
│  │  │  /trails            │  │                            │ │    │
│  │  └─────────────────────┘  └────────────────────────────┘ │    │
│  └──────────────────────────────────────────────────────────┘    │
│            │                                  │                  │
│            ▼                                  ▼                  │
│  ┌─────────────────────┐            ┌─────────────────────┐      │
│  │  MIDDLEWARES        │            │  CONTROLLERS        │      │
│  │                     │            │                     │      │
│  │  • auth (Sanctum)   │            │  UserController     │      │
│  │  • verified         │            │  TrailController    │      │
│  │  • admin            │            │  CourseController   │      │
│  │  • EnsureCsrfToken  │            │  AuthController     │      │
│  └─────────────────────┘            └─────────────────────┘      │
│            │                                  │                  │
│            └─────────────┬────────────────────┘                  │
│                          ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                   MODELS (app/Models/)                   │    │
│  │                                                          │    │
│  │  User ──<sessions>── Trail >───< courses                 │    │
│  │         └── role: user/adm/root ──┘   └── level          │    │
│  │                                      └── link_course     │    │
│  └──────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │           MYSQL (projourney_laravel)                     │    │
│  │  users | trails | courses | trail_courses | sessions     │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Fluxo Inertia (Admin) vs API (SPA)

```
INERTIA (Admin Panel - routes/web.php)
─────────────────────────────────────
Browser GET /dashboard ──► Route (web.php + middleware)
                         ──► UserController@index
                         ──► Inertia::render('dashboard', $props)
                         ──► Response: HTML (1ª visita) ou JSON (SPA nav)
                         ──► React component renderiza

API (SPA - routes/api.php)
─────────────────────────────────────
POST /api/v1/login ──► Route (api.php)
                     ──► AuthController@login
                     ──► Auth::attempt() → Session + XSRF-TOKEN
                     ──► Response: 204 No Content + Cookies
                     
GET /api/v1/profile ──► Route (api.php + auth:sanctum)
                      ──► ProfileController
                      ──► Response: JSON { user, trails }
```

---

## Dependências

### Requisitos do Sistema

| Dependência | Versão | Função |
|-------------|--------|--------|
| PHP | ^8.3 | Linguagem do backend |
| Composer | - | Gerenciador de pacotes PHP |
| MySQL/MariaDB | - | Banco de dados |
| php-mysql | - | Extensão PHP para MySQL |

### Pacotes Laravel Principais

| Pacote | Versão | Função |
|--------|--------|--------|
| `laravel/framework` | ^13.7 | Framework Laravel |
| `inertiajs/inertia-laravel` | ^3.0 | Ponte Laravel + React (admin) |
| `laravel/sanctum` | ^4.3 | Autenticação SPA (HttpOnly + CSRF) |
| `laravel/fortify` | ^1.37.2 | Autenticação backend |
| `tightenco/ziggy` | * | Rotas Laravel no React |
| `laravel/boost` | ^2.2 | Ferramentas de desenvolvimento |

### Dependências de Desenvolvimento

| Pacote | Função |
|--------|--------|
| `fakerphp/faker` | Geração de dados falsos |
| `laravel/pail` | Log viewer em tempo real |
| `laravel/pint` | Code formatter |
| `laravel/sail` | Docker development |
| `pestphp/pest` | Testing framework |
| `mockery/mockery` | Mock objects para testes |

---

## Comandos para Desenvolvimento

### Instalação

```bash
# Entrar no diretório
cd backend_laravel

# Instalar dependências PHP
composer install

# Copiar arquivo de ambiente
cp .env.example .env

# Gerar chave da aplicação
php artisan key:generate

# Configurar banco de dados no .env
# DB_DATABASE=projourney_laravel
# DB_USERNAME=seu_usuario
# DB_PASSWORD=sua_senha
```

### Banco de Dados

```bash
# Rodar migrações
php artisan migrate

# Popular banco com dados seed
php artisan db:seed

# Criar backup do banco
mysqldump -u root -p projourney_laravel > backup.sql
```

### Servidor de Desenvolvimento

```bash
# Iniciar servidor artisan
php artisan serve
# → http://localhost:8000

# Alternativa (PHP built-in)
php -S localhost:8000 -t public

# Logs em tempo real
php artisan pail
```

### Comandos Úteis

```bash
# Limpar caches
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Otimizar produção
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Gerar IDE helper (opcional)
composer require --dev barryvdh/laravel-ide-helper
php artisan ide-helper:generate
```

---

### Recursos Implementados

| Módulo | Status | Detalhes |
|--------|--------|----------|
| Autenticação | ✅ | Login/registro com sessão HttpOnly + CSRF (Sanctum SPA mode) |
| Token Rotation | ✅ | Refresh automático de tokens com validade de 24h |
| Gates/Policies | ✅ | Autorização baseada em roles (`user`, `adm`, `root`) |
| CRUD Usuários | ✅ | Gerenciamento apenas por usuários `root` |
| CRUD Trilhas | ✅ | Admins (`adm` + `root`) podem gerenciar |
| CRUD Cursos | ✅ | Admins (`adm` + `root`) podem gerenciar |
| Relacionamento N:N | ✅ | Tabela pivô `trail_courses` populada |
| Seed de Dados | ✅ | 8 trilhas, 19 cursos, 50+ relações importadas do legado |

### Configuração de Autorização

| Role | Permissões |
|------|------------|
| `user` | Operações de usuário comum (perfil, settings pessoais) |
| `adm` | Painel admin + visualização de usuários/cursos/trilhas |
| `root` | Todos privilégios de `adm` + criar/editar/excluir usuários |

### Rotas Protegidas

```php
// Middleware: ['auth', 'verified', 'admin']
- GET  /settings          → Settings page (apenas admins)
- GET  /dashboard         → Dashboard com listagem de usuários
- GET  /user              → Listar usuários comuns
- GET  /user/create       → Form创建 usuário
- POST /user              → Store usuário
- GET  /user/{id}/edit    → Editar usuário (apenas root via Gate)
- PUT  /user/{id}         → Update usuário (apenas root via Gate)
- DELETE /user/{id}       → Delete usuário (apenas root via Gate)
- Resource: trails, courses → CRUD completo para admins
```

---

## Histórico: Relatório PHP Vanilla

  ---
  Projourney — Plataforma de Trilhas de Cursos Online Gratuitos

  📌 O que é?

  Projeto acadêmico do curso TSI do IFPE Campus Igarassu. Uma plataforma web que redireciona usuários
  para cursos online gratuitos organizados em Trilhas de conhecimento.

  🏗 Arquitetura

  1. Backend — api_php/ (PHP puro)

  - Database: MySQL com as tabelas:
    - users — alunos (id, nome, email, senha com hash Argon2ID, tipo, data_nascimento, Telefone)
    - trilha — trilhas de estudo (id, nome)
    - curso — cursos (id, nome, nível, link_curso)
    - trilha_aluno — relação N:N aluno-trilha com campo progresso (Inscrito/Cursando/Suspenso/Concluido)
    - curso_trilha — relação N:N curso-trilha
    - experiencia / aluno_experiencia — (aparentemente não usado no frontend atual)
  - Endpoints (API REST JSON): no diretório src/

  | Endpoint                         | Método   | Autenticação | Função                      |
  |----------------------------------|----------|--------------|-----------------------------|
  | cadastrar_aluno.php              | POST     | Não          | Cadastro com hash Argon2ID  |
  | login.php                        | POST     | Não          | Login retorna JWT (24h)     |
  | listar_trilhas.php               | GET      | Não          | Lista todas as trilhas      |
  | cursos_da_trilha.php?trilhaId=N  | GET      | Não          | Cursos de uma trilha        |
  | inscrever_trilha.php             | POST     | Não          | Inscrever aluno em trilha   |
  | perfil_aluno.php                 | GET      | Bearer JWT   | Perfil + trilhas do aluno   |
  | atualizar_progresso.php          | POST     | Não          | Atualiza progresso          |
  | delete_user_trail.php?trilhaId=N | DELETE   | Bearer JWT   | Remove inscrição            |
  | add_class.php / add_trail.php    | GET/POST | Não          | Páginas HTML admin (mistas) |

  - Autenticação: JWT com firebase/php-jwt, secret via .env
  - Dependências: vlucas/phpdotenv, firebase/php-jwt

  2. Frontend — frontend_react/ (React 19 + Vite + TypeScript + Tailwind)

  - Rotas (react-router-dom v7):

  | Path             | Página           | Autenticação             |
  |------------------|------------------|--------------------------|
  | /                | HomePage         | Pública                  |
  | /cadastrar       | RegisterPage     | Pública                  |
  | /login           | LoginPage        | Pública                  |
  | /cursos          | CoursesPage      | Pública (dados mockados) |
  | /cursos/:id      | CourseDetailPage | Pública (dados mockados) |
  | /trilhas         | TrailsPage       | Requer login             |
  | /perfil          | ProfilePage      | Requer login + JWT       |
  | /aulas/:trilhaId | ClassesPage      | Requer login             |
  | /sobre           | AboutPage        | Pública                  |

  - API config: src/config/api.ts → BASE_URL = http://localhost:8000/src
  - Estado: localStorage (token JWT + dados do usuário)
  - UI: shadcn/ui + Radix + Lucide icons + Tailwind

  ## Documentação

| Documento | Descrição |
|-----------|-----------|
| [Database Schema](documentations/database.md) | Estrutura das tabelas do banco de dados |
| [Backlog](documentations/backlog.md) | Histórico de tarefas da migração |
| [Inertia + React Stack](documentations/inertia-react-stack.md) | Arquitetura frontend com Inertia.js |
| [CSRF + HttpOnly Implementation](documentations/csrf-http-only-implementation.md) | Implementação de segurança com Sanctum SPA |
| [Gate/Policy Authorization](documentations/gate-policy-admin-authorization.md) | Sistema de autorização baseado em roles |
| [Database Seeding (Legacy)](documentations/populate-database-legacy-backup.md) | Importação de dados do PHP Vanilla |

---

## Histórico: Backend PHP Vanilla (Legado)
```bash
  Projourney/
  ├── api_php/                  # Backend PHP puro
  │   ├── index.php             # Landing page admin (com phpinfo!)
  │   ├── .env                  # Config (DB, JWT)
  │   ├── banco/                # Schema SQL + dump
  │   └── src/
  │       ├── db.php            # Conexão PDO MySQL
  │       ├── auth.php          # Verificação JWT
  │       ├── login.php         # POST → login + JWT
  │       ├── cadastrar_aluno.php  # POST → registro
  │       ├── listar_trilhas.php   # GET → lista trilhas
  │       ├── cursos_da_trilha.php # GET → cursos por trilha
  │       ├── inscrever_trilha.php # POST → inscrever
  │       ├── perfil_aluno.php     # GET → perfil + trilhas (auth)
  │       ├── atualizar_progresso.php # POST → atualizar (auth quebrada)
  │       ├── delete_user_trail.php   # DELETE → remover (auth)
  │       ├── add_class.php       # HTML → cadastrar curso (admin)
  │       └── add_trail.php       # HTML → criar trilha (admin)
  │
  └── frontend_react/           # Frontend React SPA
      └── src/
          ├── app.tsx           # Rotas (React Router)
          ├── config/api.ts     # BASE_URL
          ├── pages/            # 8 páginas (home, login, cadastro,
          │                     #   cursos, trilhas, perfil, aulas, sobre)
          └── components/       # UI (shadcn) + layout + efeitos
```

  🗄 Banco de Dados (6 tabelas)

  - users — alunos (id, nome, email, senha Argon2ID, tipo admin/user)
  - trilha — trilhas de estudo (9 seed: Frontend, Backend, Mobile, etc.)
  - curso — cursos (19 seed, com nível e link)
  - curso_trilha — relação N:N curso ↔ trilha (71 relações seed)
  - trilha_aluno — inscrição aluno ↔ trilha com progresso
  - experiencia / aluno_experiencia — não implementado no código

  🔐 Endpoints da API

  |         Endpoint          |        Auth        |                Status                 |
  |---------------------------|--------------------|---------------------------------------| 
  | POST /login               | ❌                 | ✅ OK                                 |
  | POST /cadastrar_aluno     | ❌                 | ✅ OK                                 |
  | GET /listar_trilhas       | ❌                 | ✅ OK                                 |
  | GET /cursos_da_trilha     | ❌                 | ✅ OK                                 |
  | POST /inscrever_trilha    | ❌                 | ⚠️  Sem auth (confia no body)         |
  | GET /perfil_aluno         | ✅ JWT             | ✅ OK                                 |
  | POST /atualizar_progresso | ✅ JWT (declarado) | 🐛 Bug: tokenVerify() nunca é chamado |
  | DELETE /delete_user_trail | ✅ JWT             | ✅ OK                                 |

  ⚠️  Problemas Conhecidos

  1. atualizar_progresso.php — inclui auth.php mas nunca chama tokenVerify()
  2. Páginas admin sem autenticação — add_class.php e add_trail.php são públicos
  3. index.php expõe phpinfo() — vaza configuração do servidor
  4. Componente ParticleBackground duplicado — renderizado tanto pelo Layout quanto pelas páginas filhas
  5. CoursesPage usa dados mockados — não consome a API real


-----------------------------------------------------------------
## Recursos Instalados no Laravel
-----------------------------------------------------------------


```bash
Projourney$ laravel new backend_laravel

 ██╗       █████╗  ██████╗   █████╗  ██╗   ██╗ ███████╗ ██╗
 ██║      ██╔══██╗ ██╔══██╗ ██╔══██╗ ██║   ██║ ██╔════╝ ██║
 ██║      ███████║ ██████╔╝ ███████║ ██║   ██║ █████╗   ██║
 ██║      ██╔══██║ ██╔══██╗ ██╔══██║ ╚██╗ ██╔╝ ██╔══╝   ██║
 ███████╗ ██║  ██║ ██║  ██║ ██║  ██║  ╚████╔╝  ███████╗ ███████╗
 ╚══════╝ ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═╝  ╚═╝   ╚═══╝   ╚══════╝ ╚══════╝

 ┌ Which starter kit would you like to install? ────────────────┐
 │ React                                                        │
 └──────────────────────────────────────────────────────────────┘

 ┌ Which authentication provider do you prefer? ────────────────┐
 │ Laravel's built-in authentication                            │
 └──────────────────────────────────────────────────────────────┘

 ┌ Would you like to add teams support to your application? ────┐
 │ No                                                           │
 └──────────────────────────────────────────────────────────────┘

 ┌ Which testing framework do you prefer? ──────────────────────┐
 │ Pest                                                         │
 └──────────────────────────────────────────────────────────────┘

 ┌ Do you want to install Laravel Boost to improve AI assisted coding? ┐
 │ Yes                                                                 │
 └─────────────────────────────────────────────────────────────────────┘

 • Creating Laravel application
   ✔ Application installed
   ✔ Application initialized


 ┌ Which authentication features would you like to enable? ─────┐
 │ Email verification                                           │
 │ Registration                                                 │
 │ Two-factor authentication                                    │
 │ Passkeys                                                     │
 │ Password confirmation                                        │
 └──────────────────────────────────────────────────────────────┘

 • Composer Lint
   ✔ composer lint

 • Generate Wayfinder Resources
   ✔ php artisan wayfinder:generate --with-form --no-interaction

 • Setting up Pest
   ✔ Pest installed
   ✔ Pest initialized

 ┌ Would you like to run npm install --ignore-scripts and npm run bui… ┐
 │ Yes                                                                               │
 └───────────────────────────────────────────────────────────────────────────────────┘



 • Setting up frontend dependencies with npm
   ✔ Packages installed
   ✔ Assets built



 • Setting up Laravel Boost
   ✔ Boost installed
   ✔ Boost initialized



 Application ready in [backend_laravel]. You can start your local development using:

 ➜ cd backend_laravel
 ➜ composer run dev

 New to Laravel? Check out our documentation. Build something amazing!
 
```

---

## Documentação do Projeto

| Documento | Descrição |
|-----------|-----------|
| [📄 Database Schema](documentations/database.md) | Estrutura das tabelas do banco de dados |
| [📋 Backlog](documentations/backlog.md) | Histórico de tarefas da migração (concluída) |
| [⚛️ Inertia + React Stack](documentations/inertia-react-stack.md) | Arquitetura frontend com Inertia.js |
| [🔐 CSRF + HttpOnly](documentations/csrf-http-only-implementation.md) | Implementação de segurança com Sanctum SPA |
| [👥 Gate/Policy Authorization](documentations/gate-policy-admin-authorization.md) | Sistema de autorização baseado em roles |
| [📦 Database Seeding](documentations/populate-database-legacy-backup.md) | Importação de dados do PHP Vanilla |

---

*README atualizado em 2026-07-07 — Migração concluída.*


