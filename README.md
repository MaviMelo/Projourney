# ProJourney

## Índice

- [Documentação](#documentação)
- [Sobre o Projeto](#sobre-o-projeto)
- [Recursos](#recursos-disponíveis)
- [Dependências](#principais-dependências)
- [Instalação](#instalação)
- [Arquitetura](#arquitetura-do-sistema)
- [Contribuidores](#desenvolvedores-que-contribuíram-e-os-que-ainda-contribuem-para-o-projeto)

---

O **ProJourney** é um projeto acadêmico desenvolvido por estudantes do curso de Tecnologia de Sistemas para a Internet - TSI - do Instituto Federal de Pernambuco, Campos Igarassu. O mesmo tem, na sua origem, como principal objetivo o redirecionamento de seus usuários para cursos onlines gratuitos com boa aprovação ou avaliação popular. Permitindo seguir uma sequencia de cursos online, denominadas como **Trilhas**, que formam o conteúdo educacional necessário para uma determinada formação profissional ou pessoal.

---

## Recursos disponíveis:

- Seguir trilhas de estudos;
- Mural de cursos divulgados por instituições de ensino.

## Recursos futuros:

- Criar trilhas personalizadas com os cursos ofertados; 
- Avaliar/comentar os cursos.

---

## Principais Dependências

### Backend

| Dependência | Versão | Função |
|-------------|--------|--------|
| PHP | ^8.3 | Linguagem do backend |
| Laravel | ^13.7 | Framework PHP |
| Composer | - | Gerenciador de pacotes PHP |
| MySQL | - | Banco de dados |
| php-mysql | - | Extensão PHP para MySQL |

### Backend - Pacotes Laravel

| Pacote | Versão | Função |
|--------|--------|--------|
| `inertiajs/inertia-laravel` | ^3.0 | Ponte Laravel + React (admin) |
| `laravel/sanctum` | ^4.3 | Autenticação SPA (HttpOnly + CSRF) |
| `laravel/fortify` | ^1.37.2 | Autenticação backend |
| `tightenco/ziggy` | * | Rotas Laravel no frontend |

### Frontend

| Dependência | Versão | Função |
|-------------|--------|--------|
| Node.js | LTS | Runtime JavaScript |
| npm | 10.9.4 | Gerenciador de pacotes |
| React | ^19.1.0 | Framework UI |
| TypeScript | ^5.8.3 | Superset tipado |
| Vite | ^6.3.5 | Bundler e dev server |

### Frontend - Principais Pacotes

| Pacote | Versão | Função |
|--------|--------|--------|
| `react-router-dom` | ^7.6.2 | Roteamento SPA |
| `axios` | ^1.7.9 | Cliente HTTP |
| `tailwindcss` | ^3.4.1 | Framework CSS |
| `@radix-ui/*` | latest | Componentes de UI |
| `lucide-react` | ^0.523.0 | Ícones |
| `shadcn/ui` | - | Componentes UI |


---

## Instalação e Comandos

### 1. backend_laravel

```bash
# Entrar no diretório
cd backend_laravel

# Instalar dependências PHP
composer install

# Copiar e configurar .env
cp .env.example .env

# Gerar chave da aplicação
php artisan key:generate

# Rodar migrações do banco
php artisan migrate

# Popular banco com dados (opcional)
php artisan db:seed

# Rodar servidor de desenvolvimento
php artisan serve
# Ou alternativamente:
php -S localhost:8000
# Ou
composer run dev # para Laravel (PHP) e VITE (NodeJS)
```

### 2. frontend_react

```bash
# Entrar no diretório
cd frontend_react

# Instalar dependências npm
npm install

# Copiar e configurar .env
cp .env.example .env

# Rodar em desenvolvimento
npm run dev
# → http://localhost:5173 ou outra porta próxima.
```

### 3. Banco de Dados

```bash
# Criar banco MySQL
mysql -u root -p
> CREATE DATABASE projourney_laravel;

# Ou rodar migrations diretamente
php artisan migrate

# Seed (opcional - importa dados do legado)
php artisan db:seed
```

---

### Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                         ProJourney                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐         ┌─────────────────────────┐   │
│  │   Frontend SPA       │         │   Backend Laravel 13    │   │
│  │   (React 19 + TS)    │◄───────►│   (API + Inertia)       │   │
│  │   localhost:5174     │  CORS   │   localhost:8000        │   │
│  │                      │         │                         │   │
│  │  • Pages (8)         │         │  • Web Routes (Inertia) │   │
│  │  • Components        │         │  • API Routes (/api/v1) │   │
│  │  • shadcn/ui         │         │  • Controllers          │   │
│  │  • Tailwind CSS      │         │  • Models + Relations   │   │
│  └──────────────────────┘         └─────────────────────────┘   │
│                                                │                │
│                     ┌──────────────────────────┘                │
│                     │                                           │
│                     ▼                                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           MySQL Database (projourney_laravel)            │   │
│  │                                                          │   │
│  │  • users (id, name, email, password, role, ...)          │   │
│  │  • trails (id, name)                                     │   │
│  │  • courses (id, name, level, link_course)                │   │
│  │  • trail_courses (pivot: trail_id, course_id)            │   │
│  │  • sessions (Laravel session driver)                     │   │
│  │  • cache, jobs, failed_jobs (Laravel infrastructure)     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Fluxo de Autenticação (SPA → API)

```
1. LOGIN (POST /api/v1/login)
   ┌──────────────┐         ┌─────────────────┐         ┌─────────┐
   │   React SPA  │         │  Laravel API    │         │  MySQL  │
   │              │  POST   │                 │  QUERY  │         │
   │  {email,     │────────►│  AuthController │────────►│  users  │
   │   password}  │         │  login()        │         │         │
   │              │         │                 │         │         │
   │              │◄────────│  200 OK +       │         │         │
   │              │         │  Set-Cookie:    │         │         │
   │              │         │  laravel_session│         │         │
   │              │         │  XSRF-TOKEN     │         │         │
   └──────────────┘         └─────────────────┘         └─────────┘

2. REQUIS SUBSEQUENTES (X-XSRF-TOKEN + Cookie HttpOnly)
   ┌──────────────┐         ┌─────────────────┐
   │   React SPA  │         │  Laravel API    │
   │              │  GET    │  auth:sanctum   │
   │  /api/v1/    │────────►│  middleware     │
   │  profile     │         │                 │
   │  Headers:    │         │                 │
   │  Cookie:     │         │                 │
   │  X-XSRF-     │         │                 │
   │  TOKEN:      │         │                 │
   └──────────────┘         └─────────────────┘
```

## Documentação

| Documento | Link |
|-----------|------|
| [Backend Laravel](backend_laravel/README.md) | Arquitetura do backend Laravel + Inertia |
| [Frontend React](frontend_react/README.md) | Arquitetura da SPA React |
| [Database Schema](backend_laravel/documentations/database.md) | Estrutura do banco de dados |
| [CSRF + HttpOnly](backend_laravel/documentations/csrf-http-only-implementation.md) | Segurança com Sanctum SPA |
| [Gate/Policy Authorization](backend_laravel/documentations/gate-policy-admin-authorization.md) | Autorização baseada em roles |
| [Dockerização](DOCKER.md) | Containerização com proxy reverso (4 containers, porta 8080) |

---

## Desenvolvedores que contribuíram e os que ainda contribuem para o projeto:

* [Matheus Langendolf](https://github.com/MLangendolf)
* [Cristiano Caldas](https://github.com/Criscgarcia)
* [Gabriel Saruba](https://github.com/gabrielsaruba)
* [Arthur Pontes](https://github.com/apmrnh)
* [Maviael Melo](https://github.com/MaviMelo)
* [Gabriel Henrique](https://github.com/crocodileBigger)
* [Victor Soares](https://github.com/VSoares27)
* [José Diego](https://github.com/Diego-jpeg-27)

## Professores orientadores ao longo do projeto:
* [Liliane](https://github.com/lilialnas)
* [Emaur Florêncio](https://github.com/)
* [Macone J. Silva](https://github.com/)