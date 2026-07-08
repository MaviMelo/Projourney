# SPA React - Frontend do ProJourney

**Atualizado:** 2026-07-07 | **Stack:** React 19 + TypeScript + Vite + Tailwind + shadcn/ui

## Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura-do-frontend)
- [Fluxo de Autenticação](#fluxo-de-autenticação-spa)
- [Configuração da API](#configuração-da-api)
- [Páginas](#estrutura-de-páginas)
- [Dependências](#dependências-principais)
- [Segurança](#segurança)
- [Documentação Relacionada](#documentação-relacionada)

---

## Visão Geral

Este diretório contém o frontend SPA (Single Page Application) do ProJourney, que se comunica com a API Laravel backend através de requisições HTTP com autenticação baseada em cookies HttpOnly + CSRF token.

## Arquitetura do Frontend

```
┌──────────────────────────────────────────────────────────────────┐
│                    FRONTEND SPA (React 19)                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                      src/                                  │  │
│  │                                                            │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │  │
│  │  │  pages/     │  │ components/ │  │ config/             │ │  │
│  │  │             │  │             │  │                     │ │  │
│  │  │ HomePage    │  │ Layout      │  │ api.ts (Axios)      │ │  │
│  │  │ LoginPage   │  │ Button      │  │ BASE_URL            │ │  │
│  │  │ Register    │  │ Input       │  │ interceptors        │ │  │
│  │  │ TrailsPage  │  │ Card        │  │                     │ │  │
│  │  │ ProfilePage │  │ shadcn/ui   │  │                     │ │  │
│  │  │ ClassesPage │  │             │  │                     │ │  │
│  │  │ CoursesPage │  │             │  │                     │ │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘ │  │
│  │                                                            │  │
│  │  ┌─────────────────────────────────────────────────────┐   │  │
│  │  │  app.tsx (Rotas + Providers)                        │   │  │
│  │  │                                                     │   │  │
│  │  │  React Router v7:                                   │   │  │
│  │  │  • / → HomePage                                     │   │  │
│  │  │  • /login → LoginPage                               │   │  │
│  │  │  • /cadastrar → RegisterPage                        │   │  │
│  │  │  • /trilhas → TrailsPage (auth required)            │   │  │
│  │  │  • /perfil → ProfilePage (auth required)            │   │  │
│  │  │  • /aulas/:trilhaId → ClassesPage (auth required)   │   │  │
│  │  │  • /cursos → CoursesPage                            │   │  │
│  │  │  • /sobre → AboutPage                               │   │  │
│  │  └─────────────────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Fluxo de Autenticação SPA

### 1. Primeira Visita (Página Pública)

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────┐
│   React SPA     │         │   Laravel API    │         │   MySQL     │
│   localhost:5174│         │   localhost:8000 │         │             │
│                 │  GET    │                  │  QUERY  │             │
│                 │────────►│  GET /api/v1/    │────────►│  SELECT *   │
│                 │         │  trails          │         │  FROM trails│
│                 │         │                  │         │             │
│                 │◄────────│  200 OK + JSON   │         │             │
│                 │         │  { id, name }    │         │             │
│  Renderiza      │         │                  │         │             │
│  HomePage       │         │                  │         │             │
└─────────────────┘         └──────────────────┘         └─────────────┘
```

### 2. Login (POST /api/v1/login)

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────┐
│   React SPA     │         │   Laravel API    │         │   MySQL     │
│                 │         │                  │         │             │
│  {email,        │  POST   │  AuthController  │  QUERY  │             │
│   password}     │────────►│  login()         │────────►│  SELECT *   │
│                 │         │                  │         │  FROM users │
│                 │         │  1. Auth::       │         │  WHERE email│
│                 │         │     attempt()    │         │             │
│                 │         │  2. Gera session │         │             │
│                 │         │  3. XSRF-TOKEN   │         │             │
│  HttpOnly       │◄────────│  204 No Content  │         │             │
│  Cookie:        │         │  Set-Cookie:     │         │             │
│  laravel_       │         │  laravel_session │         │             │
│  session        │         │  XSRF-TOKEN      │         │             │
│                 │         │                  │         │             │
│  Armazena no    │         │                  │         │             │
│  estado React   │         │                  │         │             │
└─────────────────┘         └──────────────────┘         └─────────────┘
```

### 3. Requisições Autenticadas

```
┌─────────────────┐         ┌──────────────────┐
│   React SPA     │         │   Laravel API    │
│                 │         │                  │
│  GET /api/v1/   │  GET    │  auth:sanctum    │
│  profile        │────────►│  middleware      │
│                 │         │                  │
│  Headers:       │         │  1. Lê cookie    │
│  Cookie:        │         │     laravel_     │
│  laravel_       │         │     session      │
│  X-XSRF-TOKEN:  │         │  2. Valida       │
│  <token>        │         │     XSRF-TOKEN   │
│                 │         │  3. Retorna JSON │
│                 │◄────────│  {user, trails}  │
│  Atualiza UI    │         │                  │
└─────────────────┘         └──────────────────┘
```

## Configuração da API

### `src/config/api.ts`

```typescript
import axios from 'axios';

export const BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Envia cookies automaticamente
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para adicionar X-XSRF-TOKEN
api.interceptors.request.use(config => {
  const xsrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];
  
  if (xsrfToken) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
  }
  
  return config;
});

export default api;
```

## Estrutura de Páginas

| Path | Página | Autenticação | Descrição |
|------|--------|--------------|-----------|
| `/` | HomePage | Pública | Landing page com hero section |
| `/cadastrar` | RegisterPage | Pública | Cadastro de novos usuários |
| `/login` | LoginPage | Pública | Login com email/senha |
| `/cursos` | CoursesPage | Pública | Lista de cursos (mock) |
| `/cursos/:id` | CourseDetailPage | Pública | Detalhes do curso |
| `/trilhas` | TrailsPage | **Requer login** | Lista de trilhas do usuário |
| `/perfil` | ProfilePage | **Requer login** | Perfil + trilhas inscritas |
| `/aulas/:trilhaId` | ClassesPage | **Requer login** | Cursos de uma trilha |
| `/sobre` | AboutPage | Pública | Sobre o projeto |

## Dependências Principais

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "axios": "^1.7.9",
    "@radix-ui/*": "Componentes de UI",
    "class-variance-authority": "Variações de classes",
    "clsx": "Utilitário de classes",
    "lucide-react": "Ícones",
    "tailwind-merge": "Merge de classes Tailwind"
  }
}
```

## Segurança

### CSRF Protection

O frontend implementa protection CSRF seguindo o padrão Laravel Sanctum SPA:

1. **Cookie HttpOnly**: `laravel_session` - não acessível via JavaScript
2. **XSRF-TOKEN**: Cookie em plain-text, lido pelo frontend e enviado como header `X-XSRF-TOKEN`
3. **Interceptor Axios**: Adiciona automaticamente o token em requisições mutating (POST, PUT, DELETE)

### Por que essa abordagem?

- **HttpOnly**: Protege contra XSS roubar session ID
- **XSRF-TOKEN**: Protege contra CSRF attacks de outros domínios
- **withCredentials: true**: Permite envio automático de cookies cross-origin

## Documentação Relacionada

| Documento | Link |
|-----------|------|
| [README Root](../../README.md) | Visão geral do projeto |
| [Backend Laravel](../backend_laravel/README.md) | Arquitetura do backend |
| [Architecture](./documentation/architecture.md) | Arquitetura técnica detalhada |
| [CSRF + HttpOnly](../backend_laravel/documentations/csrf-http-only-implementation.md) | Implementação de segurança |
| [Inertia React Stack](../backend_laravel/documentations/inertia-react-stack.md) | Arquitetura Inertia.js (admin) |
| [Database Schema](../backend_laravel/documentations/database.md) | Estrutura do banco de dados |

---

*README atualizado em 2026-07-07.*