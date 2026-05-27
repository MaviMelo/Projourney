# Migração do Backend para Laravel

## Índice

- [Recursos Instalados no Laravel](#recursos-instalados-no-laravel)
- [Backlog](#backlog)

## Relatório Projourney (PHP Vanila)

  ---
  Projourney — Plataforma de Trilhas de Cursos Online Gratuitos

  📌 O que é?

  Projeto acadêmico do curso TSI do IFPE Campus Igarassu. Uma plataforma web que redireciona usuários
  para cursos online gratuitos organizados em Trilhas de conhecimento.

  🏗 Arquitetura

  1. Backend — api_php/ (PHP puro)

  - Database: MySQL com as tabelas:
    - users — alunos (id, nome, email, senha com hash Argon2ID, tipo, data_nascimento, telefone)
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



--------------------------------------------------------------------------------
## Backlog
--------------------------------------------------------------------------------

                                                     
● Here’s a bottom‑up backlog for building the new Laravel API (backend_laravel/).
  Each item is a self‑contained task that can to be tackle one by one, following Laravel conventions and
  keeping code in English.                                                                
  After completing a task, verify it works (e.g., via tinker, Postman, or automated tests) before moving
   to the next.                                                                                         
   
  ---                                                                                                   
  1️⃣  Environment & Security Foundations

  - Copy .env.example → .env and fill in DB credentials (match the existing api_php/.env).
  - Run php artisan key:generate.
  - Install Laravel CORS: composer require fruitcake/laravel-cors.
  - Install JWT: composer require tymon/jwt-auth.
  - Publish JWT config: php artisan vendor:publish
  --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider".
  - Generate JWT secret: php artisan jwt:secret.
  - Configure auth.php to use jwt guard for API.
  - Update config/cors.php to allow your frontend origin (e.g., http://localhost:5173).
  - Run php artisan serve and verify the server starts without errors.

  2️⃣  Database Migrations (schema → migrations)

  - Inspect the current SQL (api_php/banco/db_projourney_php.sql) and note all tables/columns.
  - Create a migration for each table:
    - [x]  php artisan make:migration create_users_table   // Note: already created by framework, only edit.
    - [ ]  php artisan make:migration create_trilhas_table
    - [ ]  php artisan make:migration create_cursos_table
    - [ ]  php artisan make:migration create_experiencias_table
    - [ ]  php artisan make:migration create_pivot_trilha_aluno_table
    - [ ]  php artisan make:migration create_pivot_aluno_experiencia_table
    - [ ]  php artisan make:migration create_pivot_curso_trilha_table (if needed)

  - In each migration file, define columns exactly as in the SQL (data types, lengths, nullable,
  defaults, unique constraints, timestamps).
  - Add foreign‑key constraints with proper onUpdate/onDelete actions.
  - Run php artisan migrate and verify tables appear in the database.
  - (Optional) Create a seeder for any lookup data (e.g., experiencias, níveis de curso) and run php
  artisan db:seed.

  3️⃣  Eloquent Models

  - Generate a model for each table (use -m flag if you want a migration stub, but we already have
  migrations):
    - [X] php artisan make:model User   // Note: already created by framework, only edit.
    - [ ] php artisan make:model Trail (note: table name is trilha)
    - [ ] php artisan make:model Course (curso)
    - [ ] php artisan make:model Experience (experiencia)
    - [ ] php artisan make:model TrailUser (pivot model for trilha_aluno)
    - [ ] php artisan make:model UserExperience (pivot model for aluno_experiencia)

  - In each model:
    - Set $table if it doesn’t follow Laravel’s snake_case plural convention.
    - Define $fillable or $guarded attributes.
    - Add relationships:
        - User → belongsToMany(Trail::class, 'trilha_aluno') with pivot columns progresso and
  timestamps.
      - User → belongsToMany(Experience::class, 'aluno_experiencia').
      - Trail → belongsToMany(Course::class, 'curso_trilha') (if you create that pivot).
      - Course → belongsToMany(Trail::class, 'curso_trilha').

    - Add accessors/mutators only if needed (e.g., to hash passwords).

  - Test each model in php artisan tinker to ensure relationships work.

  4️⃣  API Controllers (CRUD + custom actions)

  - Create a controller folder: mkdir -p app/Http/Controllers/Api/V1.
  - For each resource, make a controller:
    - php artisan make:controller Api/V1/AuthController
    - php artisan make:controller Api/V1/TrailController
    - php artisan make:controller Api/V1/CourseController
    - php artisan make:controller Api/V1/UserController
    - php artisan make:controller Api/V1/ProgressController (or handle via TrailUser)

  - Implement methods, strictly mirroring the existing PHP endpoints:
    - AuthController
        - login(Request $request) – validate credentials, return JWT (response()->json(['token' =>
  $token, 'user' => $user])).
      - register(Request $request) – hash password, create user, return same shape as login.
      - profile(Request $request) – return authenticated user.

    - TrailController
        - index() – return Trail::with('courses')->get();
      - store(Request $request) – admin only, validate, create.
      - show($id) – return trail with its courses.

    - CourseController
        - index() – return Course::all();
      - store(Request $request) – admin only.

    - ProgressController / TrailUserController
        - enroll(Request $request) – attach user to trail (auth()->user()->trails()->attach($trailId,
  ['progresso' => 'Inscrito'])).
      - updateProgress(Request $request, $id) – update pivot progresso.
      - remove($trailId) – detach.

  - Use Form Requests (php artisan make:request StoreTrailRequest) for validation if desired.
  - Return JSON responses with the exact same structure as the old endpoints (same field names, same
  nesting).
  - Apply the auth:jwt middleware to all routes except login/register.
  - Test each controller method in isolation (e.g., via routes or tinker).

  5️⃣  API Routes

  - Open routes/api.php.
  - Define all endpoints under a version prefix (optional but good practice):
  Route::prefix('v1')->group(function () {
      Route::post('login', [AuthController::class, 'login']);
      Route::post('register', [AuthController::class, 'register']);
      Route::middleware('auth:jwt')->group(function () {
          Route::get('profile', [UserController::class, 'profile']);
          Route::apiResource('trails', TrailController::class)->except(['update', 'destroy']);
          Route::apiResource('courses', CourseController::class)->except(['update', 'destroy']);
          Route::post('trails/{trail}/enroll', [TrailUserController::class, 'enroll']);
          Route::put('trail-users/{id}/progress', [ProgressController::class, 'updateProgress']);
          Route::delete('trail-users/{trail}', [ProgressController::class, 'remove']);
      });
  });
  - Ensure URLs match what the frontend expects (/api/v1/login, etc.).
  - If you prefer to keep the exact same URLs as before (no /v1), omit the prefix and adjust frontend
  config if needed.
  - Run php artisan route:list to verify routes are bound correctly.

  6️⃣  Authentication & Middleware Details

  - Create a custom middleware if you need to add extra checks (e.g., role‑based admin).
  - In app/Http/Kernel.php, ensure \Tymon\JWTAuth\Middleware\GetUserFromToken::class is in the API
  middleware group.
  - Verify that expired/invalid tokens return 401 with a JSON error (Laravel JWT does this by default).

  - Test login with a known user from the database and confirm you receive a token.
  - Test a protected route with the token in the Authorization: Bearer <token> header.

  7️⃣  CORS & Frontend Compatibility

  - Double-check that config/cors.php has:
  'paths' => ['api/*', 'sanctum/csrf-cookie'],
  'allowed_methods' => ['*'],
  'allowed_origins' => ['http://localhost:5173'], // adjust to your dev URL
  'allowed_headers' => ['*'],
  'exposed_headers' => [],
  'max_age' => 0,
  'supports_credentials' => false,
  ];
  - Run the frontend (npm run dev in frontend_react/) and confirm it can reach the Laravel API without
  CORS errors.
  - If the frontend uses BASE_URL pointing to http://localhost:8000/src, either:
    - Change the .env variable VITE_API_URL to http://localhost:8000/api (or whatever your Laravel base
  is), or
    - Add a route prefix in Laravel to match /src (not recommended; better to update frontend config).

  - Verify that each page (login, register, trails list, etc.) receives the same JSON shape it did from
  the old PHP backend.

  8️⃣  (Optional) Admin Panel Starter Kit

  - Decide on the admin stack: Laravel Breeze (Blade), Jetstream (Livewire/Inertia), or Filament.
  - If you want an admin UI inside Laravel that shares the same auth:
    - Install Jetstream with Inertia + React:
    composer require laravel/jetstream
  php artisan jetstream:install inertia --teams
  npm install && npm run dev
  php artisan migrate
    - Publish Jetstream components and adapt them to manage Trails, Courses, Users.
    - Protect admin routes with middleware that checks $user->tipo === 'admin'.

  - If you prefer a separate admin panel (e.g., Filament), install it similarly and hook into the same
  models/tables.
  - This step can be deferred until the core API is stable and tested.

  9️⃣  Testing & Validation

  - Write a small Postman collection (or use HTTPie) that hits each endpoint: login, register, get
  trails, enroll, update progress, etc.
  - Compare the JSON responses side‑by‑side with the old PHP backend (you can run the old backend
  locally on a different port to diff).
  - Check that error cases (validation failures, missing tokens) return the same HTTP status codes and a
   consumable JSON structure.
  - Run Laravel’s own tests: php artisan test (if you write any).
  - Ensure migrations are reversible: php artisan migrate:rollback then migrate again.

  🔟 Final Cut‑over Preparation

  - Once all endpoints behave identically, update the frontend’s VITE_API_URL to point to the Laravel
  API (if you haven’t already).
  - Do a full end‑to‑end walkthrough: register a new user, log in, browse trails, enroll, check
  progress, view profile.
  - Document any environment variables needed for production (APP_KEY, DB credentials, JWT secret,
  etc.).
  - Tag a commit (e.g., laravel-api-mvp) and create a pull request to merge backend_laravel into your
  target branch.

  ---
  Next immediate action:
  Start with Task 1 (environment & security). After each group of tasks, run a quick sanity check
  (server starts, migrations run, models load) before proceeding.                                
                                                                 
  ---
> Segir o padrão do ___backlog___ !