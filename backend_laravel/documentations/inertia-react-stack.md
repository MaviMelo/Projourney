# Stack Inertia.js + Laravel + React - Documentação Técnica

**Atualizado:** 2026-07-07 | **Status:** Implementação Concluída

## Índice

- [Visão Geral](#visão-geral)
- [Arquitetura do Sistema](#arquitetura-de-alto-nível)
- [Fluxo Detalhado](#fluxo-detalhado-primeira-visita-vs-navegação-spa)
- [Template Root](#1-root-template---resourcesviewsappbladephp)
- [Entry Point React](#2-entry-point-react---resourcesjsapptsx)
- [Middleware Inertia](#3-middleware-inertia---apphttpmiddlewarehandleinertiarequestsphp)
- [Controllers](#4-controllers---retornando-inertiarender)
- [Fluxo de Requisição](#fluxo-de-requisição)
- [Rotas](#rotas---routeswebphp-sistema-admin)
- [Ziggy](#ziggy---rotas-laravel-no-react)
- [Layouts](#layouts-e-estrutura-de-páginas)
- [Dados Compartilhados](#dados-compartilhados-global-props)
- [Flash Messages](#flash-messages)
- [Validação](#validação-de-formulários)
- [Asset Versioning](#asset-versioning-cache-busting)
- [Scripts](#scripts-de-desenvolvimento)
- [Checklist Nova Página](#checklist-para-nova-página)
- [Problemas Comuns](#problemas-comuns-gotchas)
- [Referências](#referências-úteis)

---

## Visão Geral

Este projeto utiliza o **Inertia.js** como ponte entre o backend Laravel e o frontend React para o **sistema administrativo do Projourney**, permitindo criar aplicações single-page (SPA) sem a complexidade de uma API REST tradicional + cliente separado.

O frontend do **usuário comum (Projourney App)** usa `routes/api.php` com Sanctum (HttpOnly cookie + CSRF) — documentação separada em [csrf-http-only-implementation.md](./csrf-http-only-implementation.md).

---

## Arquitetura de Alto Nível

### Contexto Geral do Sistema

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ARQUITETURA COMPLETA ProJourney                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────┐      ┌──────────────────────────────┐   │
│  │   SPA React (User)     │      │   Inertia (Admin Panel)      │   │
│  │   localhost:5174       │      │   localhost:8000             │   │
│  │                        │      │                              │   │
│  │   • Axios + CORS       │      │   • Inertia.js Adapter       │   │
│  │   • X-XSRF-TOKEN       │      │   • SSR na 1ª visita         │   │
│  │   • Cookie HttpOnly    │      │   • JSON nas navegações      │   │
│  │   • /api/v1/*          │      │   • web.php routes           │   │
│  └───────────┬────────────┘      └─────────────┬────────────────┘   │
│              │                                 │                    │
│              │         ┌───────────────────────┘                    │
│              │         │                                            │
│              ▼         ▼                                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                LARAVEL 13 (localhost:8000)                   │   │
│  │                                                              │   │
│  │  ┌──────────────────┐  ┌─────────────────────────────────┐   │   │
│  │  │  routes/api.php  │  │  routes/web.php                 │   │   │
│  │  │                  │  │                                 │   │   │
│  │  │  /api/v1/login   │  │  /dashboard  (Inertia)          │   │   │
│  │  │  /api/v1/profile │  │  /user/*     (Inertia)          │   │   │
│  │  │  /api/v1/trails  │  │  /course/*   (Inertia)          │   │   │
│  │  │  /api/v1/...     │  │  /settings/* (Inertia)          │   │   │
│  │  │                  │  │                                 │   │   │
│  │  │  Middleware:     │  │  Middleware:                    │   │   │
│  │  │  • auth:sanctum  │  │  • auth (Sanctum SPA)           │   │   │
│  │  │  • CORS          │  │  • admin (EnsureUserIsAdmin)    │   │   │
│  │  │  • XSRF check    │  │  • XSRF check                   │   │   │
│  │  └──────────────────┘  └─────────────────────────────────┘   │   │
│  │                                                              │   │
│  │  ┌──────────────────────────────────────────────────────┐    │   │
│  │  │  Controllers                                         │    │   │
│  │  │                                                      │    │   │
│  │  │  AuthController  → login, register, logout           │    │   │
│  │  │  UserController  → CRUD users (root via Gate)        │    │   │
│  │  │  TrailController → CRUD trails (admin)               │    │   │
│  │  │  CourseController→ CRUD courses (admin)              │    │   │
│  │  │  ProfileController → user profile data               │    │   │
│  │  └──────────────────────────────────────────────────────┘    │   │
│  │                                                              │   │
│  │  ┌──────────────────────────────────────────────────────┐    │   │
│  │  │  Models + Relations                                  │    │   │
│  │  │                                                      │    │   │
│  │  │  User ──< sessions >── Trail >───< courses           │    │   │
│  │  │       role: user/adm/root         level              │    │   │
│  │  │                                 link_course          │    │   │
│  │  └──────────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                          │                                          │
│                          ▼                                          │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              MySQL (projourney_laravel)                      │   │
│  │                                                              │   │
│  │  users | trails | courses | trail_courses | sessions | ...   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

[[← Voltar ao README.md](../README.md)]

---

## Fluxo Detalhado (Primeira Visita vs Navegação SPA)

### 1. Root Template - `resources/views/app.blade.php`

O template raiz carregado na **primeira visita** (full page load). Responsável por:

- **Inicializar o tema** (dark/light mode) via script inline antes do React hidratar
- **Carregar assets** via Vite (`@vite`, `@viteReactRefresh`)
- **Injetar rotas Ziggy** (`@routes`) para uso do `route()` no React
- **Renderizar `<x-inertia::head>`** para `<title>` e meta tags dinâmicas
- **Montar o app Inertia** com `<x-inertia::app />`

```blade
<!-- Pontos chave -->
@vite(['resources/css/app.css', 'resources/js/app.tsx'])  <!-- Assets Vite -->
@routes                                                    <!-- Ziggy routes -->
<x-inertia::head>                                          <!-- Head dinâmico -->
    <title>{{ config('app.name', 'Laravel') }}</title>
</x-inertia::head>
<x-inertia::app />                                         <!-- Root Inertia -->
```

### 2. Entry Point React - `resources/js/app.tsx`

Configuração principal do lado cliente:

```tsx
createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    
    resolve: (name) => resolvePageComponent(
        `./pages/${name}.tsx`, 
        import.meta.glob('./pages/**/*.tsx')
    ),
    
    layout: (name) => {
        if (name === 'welcome') return null;           // Sem layout
        if (name.startsWith('auth/')) return AuthLayout;
        if (name.startsWith('settings/')) return [AppLayout, SettingsLayout];
        return AppLayout;                               // Default
    },
    
    withApp(app) {
        if (typeof window !== 'undefined') window.Ziggy = Ziggy;
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: { color: '#4B5563' },
    strictMode: true,
});
```

**Layouts por página:**

| Página | Layout |
|--------|--------|
| `welcome` | null (página pública landing) |
| `auth/*` | `AuthLayout` (card centralizado) |
| `settings/*` | `[AppLayout, SettingsLayout]` (nested) |
| Demais | `AppLayout` (sidebar + header) |

### 3. Middleware Inertia - `app/Http/Middleware/HandleInertiaRequests.php`

Compartilha dados **globalmente** com todas as páginas React:

```php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'name' => config('app.name'),
        'auth' => ['user' => $request->user()],
        'sidebarOpen' => ! $request->hasCookie('sidebar_state') 
            || $request->cookie('sidebar_state') === 'true',
        'flash' => [
            'dbData' => fn() => $request->session()->get('dbData'),
            'message' => fn() => $request->session()->get('message'),
        ],
    ];
}
```

> **Disponível em qualquer página via** `usePage().props.auth.user`, `usePage().props.flash.message`, etc.

### 4. Controllers - Retornando `Inertia::render()`

Em vez de `return view()`, controllers retornam componentes React com props:

```php
// UserController@index (apenas listagem - qualquer admin)
public function index()
{
    $users = User::where('role', 'user')->latest()->paginate(25);

    return Inertia::render('dashboard', [
        'users' => $users,
        'activeView' => 'users',
        'stats' => [
            'total_users' => User::where('role', 'user')->count(),
            'total_collaborators' => User::whereIn('role', ['admin', 'root'])->count(),
        ],
    ]);
}

// UserController@edit (apenas root - Gate: manage-users)
public function edit(string $id)
{
    Gate::authorize('manage-users'); // aborta 403 se não for root
    
    $user = User::findOrFail($id);
    return Inertia::render('user/edit', ['user' => $user]);
}
```
    
    return Inertia::render('dashboard', [
        'users' => $users,                    // Collection/Lazy loading
        'stats' => [
            'total_users' => User::where('role', 'user')->count(),
            'total_collaborators' => User::whereIn('role', ['admin', 'root'])->count(),
        ],
    ]);
}
```

> **Importante**: O primeiro argumento (`'dashboard'`) deve corresponder a `resources/js/pages/dashboard.tsx`.

---

## Fluxo de Requisição

### Primeira Carga (Full Page Load)

```
1. Browser GET /dashboard
2. Laravel Route → UserController@index
3. Controller → Inertia::render('dashboard', [...props])
4. Middleware HandleInertiaRequests.share() adiciona dados globais
5. Inertia Response (HTML) → app.blade.php com:
   - <div id="app" data-page="{component:'dashboard', props:{...}, version:'...', url:'/dashboard'}">
6. Browser carrega HTML + assets Vite (JS/CSS)
7. React hidrata em #app → createInertiaApp → resolve('dashboard') → render
```

### Navegação SPA (Client-side)

```
1. User clica <Link href={route('user.show', id)}> ou router.visit()
2. Inertia intercepta → fetch XHR para /user/{id} (headers: X-Inertia: true)
3. Laravel processa normalmente → Inertia::render('users/show', [...])
4. Resposta JSON: { component: 'users/show', props: {...}, version, url }
5. React atualiza componente (sem reload) + history.pushState
6. Props novas disponíveis via usePage().props
```

---

## Rotas - `routes/web.php` (Sistema Admin)

Dois padrões usados:

```php
// 1. Página estática (sem controller) - Inertia direto na rota
Route::inertia('/', 'welcome')->name('home');
Route::inertia('/register', 'register')->name('register');

// 2. Com Controller (dados dinâmicos)
Route::get('/dashboard', [UserController::class, 'index'])->name('dashboard');
Route::resources([
    'user' => UserController::class,
    'course' => CourseController::class,
]);
```

> **Dica**: `Route::inertia()` é atalho para páginas que não precisam lógica de backend.
>
> **Importante**: As rotas da API para o frontend do usuário estão em `routes/api.php` com prefixo `/api/v1` (ex: `/api/v1/login`, `/api/v1/trails`, `/api/v1/enrollments`).

---

## Ziggy - Rotas Laravel no React

Arquivo gerado: `resources/js/ziggy.js` (via `@routes` no Blade)

Uso no React:
```tsx
import { route } from 'ziggy-js';
import { router } from '@inertiajs/react';

// Link declarativo (prefetch automático)
<Link href={route('user.show', user.id)}>Ver</Link>

// Navegação programática
router.get(route('user.show', user.id));
router.post(route('user.store'), formData);
router.delete(route('user.destroy', id));
```

---

## Layouts e Estrutura de Páginas

### Sistema de Layouts (em `app.tsx`)

| Página | Layout Aplicado |
|--------|-----------------|
| `welcome` | `null` (sem layout, página pública) |
| `auth/*` | `AuthLayout` (centralizado, card) |
| `settings/*` | `[AppLayout, SettingsLayout]` (nested) |
| Demais | `AppLayout` (sidebar + header) |

### AppLayout - `resources/js/layouts/app-layout.tsx`

Wrapper que usa `AppSidebarLayout` (sidebar + conteúdo):

```tsx
export default function AppLayout({ breadcrumbs = [], children }) {
    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            {children}
        </AppSidebarLayout>
    );
}
```

### Página Dashboard - `resources/js/pages/dashboard.tsx`

Recebe props do controller via `Inertia::render()`:

```tsx
export default function Dashboard({ 
    users = { data: [], links: [] }, 
    courses = [], 
    trails = [], 
    stats = { total_users: 0, total_collaborators: 0 } 
}) {
    const { flash } = usePage().props as any;  // Flash messages
    
    // Acessa user autenticado (do middleware share)
    const { auth } = usePage().props;
    
    return (
        <>
            <Head title="Dashboard" />
            <MessageReturned message={flash.message} />
            {/* Renderiza dados... */}
        </>
    );
}
```

---

## Dados Compartilhados (Global Props)

Disponíveis em **qualquer página** via `usePage().props`:

| Prop | Origem | Uso |
|------|--------|-----|
| `auth.user` | `HandleInertiaRequests.share()` | User logado, roles, permissions |
| `flash.message` | Session flash data | Toast notifications |
| `name` | Config `app.name` | Título da aplicação |
| `sidebarOpen` | Cookie `sidebar_state` | Estado persistente do sidebar |
| `errors` | Inertia padrão | Validation errors (formulários) |

---

## Flash Messages

**Backend (Controller):**
```php
return redirect()->route('dashboard')->with('message', 'Usuário criado com sucesso!');
```

**Frontend (Componente):**
```tsx
import { usePage } from '@inertiajs/react';

const { flash } = usePage().props;
// flash.message contém a string
<MessageReturned message={flash.message} />
```

---

## Validação de Formulários

Inertia trata erros de validação automaticamente:

```php
// Controller
$request->validate([
    'name' => 'required|string|max:255',
    'email' => 'required|email|unique:users',
]);
```

```tsx
// React - erros disponíveis em usePage().props.errors
const { errors } = usePage().props;

<input 
    name="email" 
    className={errors.email ? 'border-red-500' : ''} 
/>
{errors.email && <p className="text-red-500">{errors.email}</p>}
```

---

## Asset Versioning (Cache Busting)

Configurado no `HandleInertiaRequests`:

```php
public function version(Request $request): ?string
{
    return parent::version($request);  // Usa mix-manifest.json / vite manifest
}
```

Força reload completo quando assets mudam (deploy).

---

## Scripts de Desenvolvimento

```json
// package.json
"dev": "vite",                    // Vite dev server (HMR)
"build": "vite build",            // Produção
"build:ssr": "vite build && vite build --ssr",  // SSR (se necessário)
```

```bash
# Composer script (roda tudo)
composer dev
# → php artisan serve + queue:listen + pail + npm run dev (concurrently)
```

---

## Checklist para Nova Página

1. **Criar componente** em `resources/js/pages/nova-pagina.tsx`
2. **Adicionar rota** em `routes/web.php`:
   - Simples: `Route::inertia('/nova', 'nova-pagina')`
   - Com dados: `Route::get('/nova', [Controller::class, 'method'])`
3. **Controller** retorna `Inertia::render('nova-pagina', [...props])`
4. **Layout** automático via `app.tsx` (ou customizar no `layout()`)
5. **Testar** navegação via `<Link href={route('nome')}>`

---

## Problemas Comuns / Gotchas

| Problema | Causa | Solução |
|----------|-------|---------|
| Página em branco / erro 404 | Nome do componente não bate com arquivo | Verificar `resolve()` em `app.tsx` e nome do arquivo |
| Props `undefined` | Controller não passou a prop | Verificar `Inertia::render('page', ['prop' => $value])` |
| Layout errado | Logic no `layout()` do `createInertiaApp` | Ajustar `switch` em `app.tsx` |
| Flash message não aparece | Middleware `share()` não inclui | Verificar `HandleInertiaRequests.share()` |
| Ziggy `route()` undefined | `@routes` não renderizado no Blade | Verificar `app.blade.php` tem `@routes` |
| HMR não funciona | Vite não rodando / porta errada | `npm run dev` + verificar `vite.config.ts` server config |

---

## Referências Úteis

- [Inertia.js Docs (React)](https://inertiajs.com/react)
- [Laravel Inertia Adapter](https://inertiajs.com/laravel)
- [Ziggy Docs](https://github.com/tighten/ziggy)
- [Laravel Vite Plugin](https://laravel.com/docs/vite)
- Projeto base: `laravel/react-starter-kit` (composer.json)

---

## Navegação na Documentação

| Documento | Link |
|-----------|------|
| [README.md (Principal)](../README.md) | Visão geral do projeto |
| [database.md](./database.md) | Schema do banco de dados |
| [backlog.md](./backlog.md) | Histórico de tarefas |
| [csrf-http-only-implementation.md](./csrf-http-only-implementation.md) | Segurança com Sanctum SPA |
| [gate-policy-admin-authorization.md](./gate-policy-admin-authorization.md) | Autorização baseada em roles |
| [populate-database-legacy-backup.md](./populate-database-legacy-backup.md) | Importação de dados do legado |

---

*Documentação atualizada em 2026-07-07 para a equipe Projourney.*