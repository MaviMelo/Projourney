# Migração do Backend para Laravel

## Índice

- [Recursos Instalados no Laravel](#recursos-instalados-no-laravel)
- [Backlog](documentations/backlog.md)
- [Documentação das Tabelas do Baco de Dados](documentations/database.md)

## Relatório Projourney (PHP Vanila)

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

  3. Branch atual: migration/api-laravel-2

  Em processo de migração do backend PHP puro para Laravel.

  ---

  ---

  🏗 Stack

  |    Camada    |                     Tecnologia                      |
  |--------------|-----------------------------------------------------|
  | Backend      | PHP 8+ (puro, sem framework) + MySQL 8              |
  | Frontend     | React 19 + TypeScript + Vite + Tailwind + shadcn/ui |
  | Autenticação | JWT (firebase/php-jwt, HS256)                       |
  | Senhas       | Argon2ID                                            |

  📁 Estrutura
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


