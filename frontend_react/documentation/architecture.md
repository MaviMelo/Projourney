# Arquitetura do Frontend SPA

**Atualizado:** 2026-07-07

## Índice

- [Visão Geral](#visão-geral)
- [Dependências Principais](#dependências-principais)
- [Comandos para Desenvolvimento](#comandos-para-desenvolvimento)
- [Arquitetura de Diretórios](#arquitetura-de-diretórios)
- [Fluxo de Dados](#fluxo-de-dados)
- [Documentação Relacionada](#documentação-relacionada)

---

## Visão Geral

Este documento descreve a arquitetura técnica do frontend SPA (Single Page Application) do ProJourney, implementado com React 19, TypeScript e Vite.

---

## Dependências Principais

### Desenvolvimento (`devDependencies`)

| Pacote | Versão | Função |
|--------|--------|--------|
| `typescript` | ^5.8.3 | Superset tipado do JavaScript |
| `vite` | ^6.3.5 | Bundler e dev server |
| `@vitejs/plugin-react` | ^4.6.0 | Plugin React para Vite |
| `tailwindcss` | ^3.4.1 | Framework CSS utilitário |
| `postcss` | ^8.4.35 | Processador de CSS |
| `autoprefixer` | ^10.4.17 | Prefixos CSS automáticos |
| `@types/react` | ^19.1.8 | Types do React |
| `@types/react-dom` | ^19.1.6 | Types do React DOM |
| `@types/node` | ^22.15.17 | Types do Node.js |

### Produção (`dependencies`)

| Pacote | Versão | Função |
|--------|--------|--------|
| `react` | ^19.1.0 | Framework UI |
| `react-dom` | ^19.1.0 | DOM bindings do React |
| `react-router-dom` | ^7.6.2 | Roteamento SPA |
| `axios` | ^1.7.9 | Cliente HTTP |
| `lucide-react` | ^0.523.0 | Biblioteca de ícones |
| `tailwind-merge` | ^3.3.1 | Merge de classes Tailwind |
| `clsx` | ^2.1.1 | Utilitário de classes CSS |
| `class-variance-authority` | ^0.7.1 | Variações de componentes |

### Componentes UI (shadcn/ui + Radix)

- `@radix-ui/react-dialog` — Modais e dialogs
- `@radix-ui/react-dropdown-menu` — Menus suspensos
- `@radix-ui/react-toast` — Notificações
- `@radix-ui/react-form` — Componentes de formulário
- `recharts` — Gráficos e visualizações
- `sonner` — Toast notifications

---

## Comandos para Desenvolvimento

### frontend_react

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento (Vite)
npm run dev
# → http://localhost:5173

# Build de produção
npm run build

# Preview do build
npm run preview
```

### backend_laravel

```bash
# Instalar dependências
composer install

# Gerar chave da aplicação
php artisan key:generate

# Rodar migrações
php artisan migrate

# Popular banco (seed)
php artisan db:seed

# Rodar servidor de desenvolvimento
php artisan serve
# → http://localhost:8000

# Alternativa (PHP built-in)
php -S localhost:8000
```

### Banco de Dados

```bash
# Criar banco
mysql -u root -p
> CREATE DATABASE projourney_laravel;

# Rodar migrations
php artisan migrate

# Seed (opcional)
php artisan db:seed
```

---

## Arquitetura de Diretórios

```
frontend_react/
├── src/
│   ├── app.tsx              # Configuração de rotas + providers
│   ├── main.tsx             # Entry point da aplicação
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/              # Componentes shadcn (Button, Card, etc.)
│   │   ├── Layout.tsx       # Layout principal com navegação
│   │   └── Loading.tsx      # Spinner de loading
│   ├── pages/               # Páginas da aplicação
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── TrailsPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── ClassesPage.tsx
│   │   ├── CoursesPage.tsx
│   │   └── AboutPage.tsx
│   ├── config/              # Configurações globais
│   │   └── api.ts           # Axios instance + interceptors
│   ├── lib/                 # Utilitários
│   │   └── utils.ts         # cn() helper para Tailwind
│   └── types/               # Types TypeScript
│       └── index.ts
├── public/                  # Assets estáticos
├── index.html               # HTML entry point
├── vite.config.ts           # Configuração do Vite
├── tailwind.config.js       # Configuração do Tailwind
└── tsconfig.json            # Configuração TypeScript
```

---

## Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUXO DE DADOS SPA                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. USER ACTION (Click/Form Submit)                         │
│     │                                                       │
│     ▼                                                       │
│  2. PAGE COMPONENT (pages/*.tsx)                            │
│     │                                                       │
│     ▼                                                       │
│  3. API CLIENT (config/api.ts - Axios)                      │
│     │  • Adiciona X-XSRF-TOKEN                              │
│     │  • Envia cookies (withCredentials)                    │
│     ▼                                                       │
│  4. LARAVEL API (localhost:8000/api/v1)                     │
│     │  • Valida CSRF token                                  │
│     │  • Autentica via sessão HttpOnly                      │
│     ▼                                                       │
│  5. RESPONSE JSON                                           │
│     │                                                       │
│     ▼                                                       │
│  6. STATE UPDATE (React useState/useEffect)                 │
│     │                                                       │
│     ▼                                                       │
│  7. UI RE-RENDER                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Documentação Relacionada

| Documento | Link |
|-----------|------|
| [README Frontend](../README.md) | Visão geral do frontend SPA |
| [README Root](../../README.md) | Visão geral do projeto |
| [Backend Laravel](../backend_laravel/README.md) | Arquitetura do backend |
| [CSRF Implementation](../backend_laravel/documentations/csrf-http-only-implementation.md) | Segurança com Sanctum SPA |
| [Database Schema](../backend_laravel/documentations/database.md) | Estrutura do banco de dados |
| [Gate/Policy Authorization](../backend_laravel/documentations/gate-policy-admin-authorization.md) | Autorização baseada em roles |

---

*Documento criado em 2026-07-07.*