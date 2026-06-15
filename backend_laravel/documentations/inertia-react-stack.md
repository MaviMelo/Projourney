# Stack Inertia.js + Laravel + React - Documentação Técnica

## Visão Geral

Este projeto utiliza o **Inertia.js** como ponte entre o backend Laravel (API) e o frontend React para o **sistema do administrador da aplicação**, permitindo criar aplicações single-page (SPA) para o sistema do **Projourney Server** sem a complexidade de uma API REST tradicional + cliente separado, é utilizado no sistema frontend do usuário comum **Projourney**. O Inertia funciona como "o glue" que conecta controllers Laravel diretamente a componentes React.

---

## Arquitetura de Alto Nível - Sistema Admin (Inertia)

```
┌─────────────────────────────────────────────────────────────────┐
│                    LARAVEL BACKEND (Admin)                      │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────────────┐   │
│  │   Routes     │──▶│  Controllers │──▶│   Inertia::render  │   │
│  │  (web.php)   │   │  (PHP)       │   │   ('page', props)  │   │
│  └──────────────┘   └──────────────┘   └─────────┬──────────┘   │
│                                                  │              │
│                          ┌───────────────────────┘              │
│                          ▼                                      │
│              ┌────────────────────────┐                         │
│              │  HandleInertiaRequests │  (Middleware)           │
│              │  - rootView: 'app'     │                         │
│              │  - share() data        │                         │
│              └───────────┬────────────┘                         │
└──────────────────────────┼──────────────────────────────────────┘
                           │ JSON Response com { component, props, version, url }
                           ▼
┌───────────────────────────────────────────────────────────────────┐
│                    FRONTEND REACT ADMIN (Vite)                    │
│  ┌──────────────┐   ┌─────────────────┐   ┌────────────────────┐  │
│  │  app.tsx     │──▶│ createInertiaApp│──▶│  Páginas React     │  │
│  │  (entry)     │   │  (config)       │   │  (pages/*.tsx)     │  │
│  └──────────────┘   └─────────────────┘   └────────────────────┘  │
│                          │                                        │
│                          ▼                                        │
│              ┌───────────────────────┐                            │
│              │  Layouts (AppLayout,  │                            │
│              │   AuthLayout, etc)    │                            │
│              └───────────────────────┘                            │
└───────────────────────────────────────────────────────────────────┘
```

> **Nota**: O sistema frontend do usuário (Projourney App) usa `routes/api.php` com Sanctum JWT - documentação separada.

---

## Componentes Principais

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
    // Título da página
    title: (title) => (title ? `${title} - ${appName}` : appName),
    
    // Resolve componente página por nome (ex: 'dashboard' → ./pages/dashboard.tsx)
    resolve: (name) => resolvePageComponent(
        `./pages/${name}.tsx`, 
        import.meta.glob('./pages/**/*.tsx')
    ),
    
    // Seleção de layout baseada no nome da página
    layout: (name) => {
        if (name === 'welcome') return null;           // Sem layout
        if (name.startsWith('auth/')) return AuthLayout;
        if (name.startsWith('settings/')) return [AppLayout, SettingsLayout];
        return AppLayout;                               // Default
    },
    
    // Setup global (Ziggy, providers, etc)
    withApp(app) {
        if (typeof window !== 'undefined') window.Ziggy = Ziggy;
        return (
            <TooltipProvider>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: { color: '#4B5563' },  // Barra de progresso Inertia
});
```

### 3. Middleware Inertia - `app/Http/Middleware/HandleInertiaRequests.php`

Compartilha dados **globalmente** com todas as páginas React:

```php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'name' => config('app.name'),
        'auth' => ['user' => $request->user()],      // User autenticado
        'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        'flash' => ['message' => fn() => $request->session()->get('message')],
    ];
}
```

> **Disponível em qualquer página via** `usePage().props.auth.user`, `usePage().props.flash.message`, etc.

### 4. Controllers - Retornando `Inertia::render()`

Em vez de `return view()`, controllers retornam componentes React com props:

```php
// Exemplo: UserController@index
public function index()
{
    $users = User::latest()->paginate(15);
    
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

*Documentação gerada em 2026-06-13 para a equipe Projourney.*