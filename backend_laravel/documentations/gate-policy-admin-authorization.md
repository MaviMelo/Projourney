# Autorização com Gate/Policy para Admin

## Índice

- [Visão Geral](#visão-geral)
- [Níveis de Acesso](#níveis-de-acesso)
- [Componentes](#componentes)
- [Configuração do Gate](#configuração-do-gate)
- [Middleware Admin](#middleware-admin)
- [Uso em Controllers](#uso-em-controllers)
- [Documentação Principal](../README.md)

---

## Visão Geral

Este documento descreve como o Laravel Gates é usado para restringir operações sensíveis de gerenciamento de usuários apenas para usuários com role `root`.

## Arquitetura de Autorização

### Níveis de Acesso

| Role | Acesso |
|------|--------|
| `user` | Apenas operações de usuário comum (perfil, settings pessoais) |
| `adm` | Painel admin + visualização de usuários/colaboradores |
| `root` | Todos os privilégios de `adm` + criar/editar/excluir usuários |

### Componentes

| Componente | Função | Local |
|------------|--------|-------|
| **Gate `manage-users`** | Verifica se usuário é `root` | `AppServiceProvider.php` |
| **Gate `access-admin-panel`** | Verifica se usuário é `adm` ou `root` | `AppServiceProvider.php` (futuro) |
| **Middleware `EnsureUserIsAdmin`** | Protege rotas admin | `app/Http/Middleware/` |

---

## Configuração do Gate

### Definição no `AppServiceProvider.php`

```php
use App\Models\User;
use Illuminate\Support\Facades\Gate;

protected function configureGates(): void
{
    // Gate para operações sensíveis - APENAS ROOT
    Gate::define('manage-users', function (User $user) {
        return $user->role === 'root';
    });
}
```

**Como funciona:**
- O Laravel injeta automaticamente o usuário autenticado na closure
- Retorna `true` se `role === 'root'`, `false` caso contrário
- O Gate é registrado no container de serviços durante o bootstrap

---

## Uso nos Controllers

### Exemplo: `UserController`

```php
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // Apenas visualização - qualquer admin pode
    public function index()
    {
        $users = User::where('role', 'user')->latest()->paginate(25);
        return Inertia::render('dashboard', ['users' => $users]);
    }

    // Listar colaboradores - APENAS ROOT
    public function indexCollaborators()
    {
        Gate::authorize('manage-users'); // aborta 403 se não for root
        
        $users = User::whereIn('role', ['root', 'admin'])->latest()->paginate(15);
        return Inertia::render('dashboard', ['users' => $users]);
    }

    // Editar usuário - APENAS ROOT
    public function edit(string $id)
    {
        Gate::authorize('manage-users');
        
        $user = User::findOrFail($id);
        return Inertia::render('user/edit', ['user' => $user]);
    }

    // Atualizar usuário - APENAS ROOT
    public function update(Request $request, string $id)
    {
        Gate::authorize('manage-users');
        
        $user = User::findOrFail($id);
        $user->fill($request->validate([...']));
        $user->save();
        
        return redirect()->back();
    }

    // Excluir usuário - APENAS ROOT
    public function destroy(string $id)
    {
        Gate::authorize('manage-users');
        
        $user = User::findOrFail($id);
        $user->delete();
        
        return redirect()->back();
    }
}
```

### Métodos do Gate

| Método | Comportamento |
|--------|---------------|
| `Gate::authorize('name')` | Lança `AuthorizationException` (403) se negado |
| `Gate::allows('name')` | Retorna `bool` (true/false) |
| `Gate::denies('name')` | Retorna `bool` (inverso de allows) |
| `@can('name')` no Blade | Renderiza conteúdo se permitido |

---

## Middleware de Proteção de Rotas

### `EnsureUserIsAdmin.php`

```php
public function handle(Request $request, Closure $next): Response
{
    if (!auth()->check() || 
        (auth()->user()->role !== 'adm' && auth()->user()->role !== 'root')) {
        abort(403, 'Acesso não autorizado.');
    }
    return $next($request);
}
```

### Registro no `bootstrap/app.php`

```php
$middleware->alias([
    'admin' => EnsureUserIsAdmin::class,
]);
```

### Aplicação nas Rotas (`routes/web.php`)

```php
Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::inertia('/register', 'register')->name('register');
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resources([
        'user' => UserController::class,
        'course' => CourseController::class,
        'trail' => TrailController::class,
    ]);
    
    // Settings também protegido
    require __DIR__ . '/settings.php';
});
```

---

## Comparação: Gate vs Policy

| Situação | Use | Exemplo |
|----------|-----|---------|
| "Quem pode acessar /admin?" | **Gate** ou **Middleware** | `Gate::define('access-admin')` |
| "Quem pode editar ESTE usuário?" | **Policy** | `UserPolicy@update` |
| "Quem pode deletar qualquer curso?" | **Gate** | `Gate::define('delete-courses')` |
| "Quem pode aprovar ESTE comentário?" | **Policy** | `CommentPolicy@approve` |

### Exemplo de Policy (futuro)

```bash
php artisan make:policy UserPolicy --model=User
```

```php
// app/Policies/UserPolicy.php
public function update(User $authUser, User $user): bool
{
    return $authUser->role === 'root' || $authUser->id === $user->id;
}

// No controller:
$this->authorize('update', $user);
```

---

## Validação e Debug

### Verificar se Gate está registrado

```bash
php artisan tinker
>>> Illuminate\Support\Facades\Gate::abilities()
// Deve retornar: ['manage-users' => Closure, ...]
```

### Testar permissão de um usuário

```bash
php artisan tinker
>>> $user = App\Models\User::where('email', 'root@email.com')->first();
>>> Illuminate\Support\Facades\Gate::forUser($user)->allows('manage-users')
// Deve retornar: true (se role === 'root')
```

### Mensagens de erro comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `403 Unauthorized` mesmo sendo root | Gate definido com erro de digitação (ex: `$user->relo`) | Verifique o nome da propriedade no `AppServiceProvider` |
| `Target class [EnsureUserIsAdmin] does not exist` | Middleware não registrado ou namespace errado | Adicione `use App\Http\Middleware\EnsureUserIsAdmin;` no `bootstrap/app.php` |
| Gate não funciona após alteração | Cache de config/opcache | `php artisan config:clear && php artisan cache:clear` |

---

## Referências

- [Laravel 13 Authorization Docs](https://laravel.com/docs/13.x/authorization)
- [Laravel Gates](https://laravel.com/docs/13.x/authorization#gates)
- [Laravel Policies](https://laravel.com/docs/13.x/authorization#policies)

---

## Navegação na Documentação

| Documento | Link |
|-----------|------|
| [README.md (Principal)](../README.md) | Visão geral do projeto |
| [inertia-react-stack.md](./inertia-react-stack.md) | Arquitetura frontend com Inertia |
| [database.md](./database.md) | Schema do banco de dados |
| [backlog.md](./backlog.md) | Histórico de tarefas |
| [csrf-http-only-implementation.md](./csrf-http-only-implementation.md) | Segurança com Sanctum SPA |
| [populate-database-legacy-backup.md](./populate-database-legacy-backup.md) | Importação de dados do legado |

---

*Documentação criada em 2026-07-07. Implementação concluída com Gate `manage-users` para operações root-only.*