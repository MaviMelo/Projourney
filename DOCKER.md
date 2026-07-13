# Dockerização do Projourney

## Índice

- [Arquitetura](#arquitetura)
- [Serviços (containers)](#serviços-containers)
- [Separação de rotas](#separação-de-rotas)
- [Histórico de implementação](#histórico-de-implementação)
- [Problema Ziggy/CORS (Etapa 4+)](#problema-ziggycors-etapa-4)
- [Diagnóstico](#diagnóstico)
- [Solução aplicada](#solução-aplicada)
- [Arquivos modificados (commit `637aad9`)](#arquivos-modificados-commit-637aad9)
- [Comandos de operação](#comandos-de-operação)
- [Validação de sintaxe Nginx](#validação-de-sintaxe-nginx)
- [Justificativas arquiteturais](#justificativas-arquiteturais)
- [Referências](#referências)

---

## Arquitetura

O Projourney é dockerizado com **4 containers** e um **proxy reverso Nginx** na porta `8080` do host:

```
Navegador (http://localhost:8080)
         │
         ▼
    ┌─────────────┐
    │   proxy     │  Nginx reverso (porta 8080) — roteia /spa/*, /api/*, /*
    └──────┬──────┘
           │
    ┌──────┴──────────────────┐
    │                         │
    ▼                         ▼
 (/spa/*)                (/api/*, /*)
┌──────────┐           ┌──────────────┐
│ frontend │           │   backend    │
│ Nginx    │           │ Laravel 13   │
│ :80      │           │ Octane/PHP   │
│ dist/    │           │ :8000        │
└──────────┘           └──────┬───────┘
                              │
                              ▼
                       ┌──────────────┐
                       │     db       │
                       │ MariaDB 11   │
                       │ :3306        │
                       └──────────────┘
```

**Porta externa única:** `8080` — escolhida para evitar conflito com Apache/Nginx locais (porta `80`) e com `php artisan serve` (porta `8000`).

---

## Serviços (containers)

| Serviço | Imagem base | Porta interna | Função |
|---------|-------------|---------------|--------|
| `proxy` | `nginx:1.25-alpine` | `80` (8080 no host) | Proxy reverso — roteamento por location |
| `frontend` | `node:lts-alpine` → `nginx:1.25-alpine` (multi-stage) | `80` | Serve SPA React (`/spa/*`) — arquivos estáticos `dist/` |
| `backend` | `php:8.3-fpm-alpine` + extensões | `8000` | Laravel 13 (API `/api/*` + UI Inertia `/*`) |
| `db` | `mariadb:11` | `3306` | Banco de dados |

---

## Separação de rotas

| Prefixo | Encaminhado para | Finalidade |
|---------|------------------|------------|
| `/spa/*` | `frontend:80` | SPA React (pública) — cursos, trilhas |
| `/api/*` | `backend:8000` | API JSON (Sanctum autenticação) |
| `/*` | `backend:8000` | Laravel + Inertia (UI administrativa) |

A rota `/` (raiz) serve o **Dashboard Inertia** renderizado pelo Laravel (`web.php`). As decisões de arquitetura estão documentadas em [Justificativas arquiteturais](#justificativas-arquiteturais).

---

## Histórico de implementação

| Commit | Data | Descrição |
|--------|------|-----------|
| `b5d47c5` | 2026-07-11 | `feat: starts implementation of containerization` — Dockerfiles, docker-compose.yml, frontend nginx.conf |
| `58a090d` | 2026-07-12 | `feat: contenues implementation of containerization with reverse proxy` — proxy/nginx.conf inicial, deleção componentes shadcn/ui, fix api.ts, remoção BrowserRouter duplicado |
| `637aad9` | 2026-07-12 | `feat: finish implementation of containerization with reverse proxy` — nginx saneado, `<base href>` no blade, forceRootUrl no AppServiceProvider, ziggy.js regenerado com porta 8080 |

---

## Problema Ziggy/CORS (Etapa 4+)

**Sintoma:** Ao acessar `http://localhost:8080/` (Dashboard Inertia) e clicar em links como "Create Course" ou "Create User", o navegador reportava:

```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading
the remote resource at http://localhost/course/create.
(Reason: CORS header 'Access-Control-Allow-Origin' missing).
```

A requisição era feita para `http://localhost/course/create` (**porta 80 implícita, sem `:8080`**), vinda de uma página carregada em `http://localhost:8080/`. Portas diferentes → origens diferentes → bloqueio CORS.

---

## Diagnóstico

1. **Assets JS apontavam corretamente para `:8080`.** Os bundles compilados pelo Vite (`dist-*.js`, `app-*.js`) já tinham `base: 'http://localhost:8080'` e o HTML do Laravel gerava `<script src="http://localhost:8080/build/assets/...">`. O proxy Nginx também estava correto.

2. **A raiz do problema era o `@routes` do Ziggy.** Em runtime, o Ziggy injeta um objeto `Ziggy = { url: "...", port: ... }` no HTML via a diretiva Blade `@routes`. Esse objeto é usado por `route('course.create')` dentro do JavaScript Inertia.

3. **`Ziggy.url` estava `"http://localhost"` (sem porta).** O pacote `tightenco/ziggy` usa `url('/')` → `request()->root()` para montar a URL base. Atrás da cadeia de proxies:
   - Proxy externo (8080) → nginx backend (80) → PHP-FPM
   
   O `TrustProxies` não conseguia inferir a porta externa `8080` apenas com os headers `X-Forwarded-*`. O `request()->root()` retornava `http://localhost` (porta 80 implícita).

4. **Consequência:** `route('course.create')` gerava a URL absoluta `http://localhost/course/create` (sem `:8080`). O navegador tratava isso como cross-origin em relação a `http://localhost:8080` e bloqueava.

---

## Solução aplicada

Foram aplicadas **4 correções complementares**, cada uma cobrindo uma camada:

### 1. `AppServiceProvider.php` — `URL::forceRootUrl()` (fix principal)

```php
// app/Providers/AppServiceProvider.php
protected function configureAppUrl(): void
{
    if (config('app.url')) {
        URL::forceRootUrl(config('app.url'));
        URL::forceScheme(parse_url(config('app.url'), PHP_URL_SCHEME) ?? 'http');
    }
}
```

**Por que é o fix principal:** Força **todos** os helpers de URL do Laravel (`url()`, `URL::to()`, `route()`, e consequentemente o `Ziggy`) a usarem `APP_URL=http://localhost:8080` como base, independentemente dos headers da request atual. É a abordagem oficial do Laravel para ambientes atrás de proxy reverso quando o `TrustProxies` não consegue inferir a porta externa sozinho.

### 2. `vite.config.ts` — `base: 'http://localhost:8080'`

```ts
export default defineConfig({
    base: 'http://localhost:8080',
    // ...
});
```

Garante que os assets compilados pelo Vite (JS, CSS, fontes) apontem para a porta correta já em build-time, no `manifest.json` e nos bundles.

### 3. `app.blade.php` — `<base href>`

```blade
<head>
    <base href="{{ rtrim(config('app.url'), '/') }}/">
    ...
```

Força o navegador a resolver **qualquer URL relativa** no documento (form actions, fetch paths) contra `http://localhost:8080/`, eliminando ambiguidade de origem. Camada extra de segurança caso algum componente React emita path relativo sem prefixo.

### 4. `proxy/nginx.conf` — saneamento + `X-Real-IP`

- **Bloco único** `server { listen 80; server_name _; }` (antes havia duplicata quebrada)
- **3 locations** (`/spa/`, `/api/`, `/`) com headers forward padronizados
- **`X-Real-IP`** adicionado em todas as locations — para `request()->ip()` retornar o IP real do cliente
- Validado com `nginx -t` dentro do container (`syntax is ok`)

---

## Arquivos modificados (commit `637aad9`)

| Arquivo | Alteração |
|---------|-----------|
| `proxy/nginx.conf` | Saneado: bloco único, 3 locations, headers padronizados, `X-Real-IP` em todas |
| `backend_laravel/vite.config.ts` | Adicionado `base: 'http://localhost:8080'` + `build.manifest: true` |
| `backend_laravel/resources/js/ziggy.js` | Regenerado com `port: 8080` (via `php artisan ziggy:generate`) |
| `backend_laravel/resources/views/app.blade.php` | Adicionado `<base href="{{ rtrim(config('app.url'), '/') }}/">` no `<head>` |
| `backend_laravel/app/Providers/AppServiceProvider.php` | Adicionado `configureAppUrl()` com `URL::forceRootUrl()` + `URL::forceScheme()` |
| `backend_laravel/resources/js/pages/welcome.tsx` | Ajuste menor (1 linha) |

---

## Comandos de operação

### Primeiro start (build + setup + migrations + seed)

```bash
# 1. Build das imagens (sem cache — primeira vez)
docker compose build --no-cache

# 2. Iniciar containers
docker compose up -d

# 3. Configurar backend Laravel (dentro do container)
docker exec -it projourney-backend sh

# Dentro do container:
composer install --no-interaction --prefer-dist
php artisan key:generate
php artisan storage:link
php artisan migrate --seed

 # ou seeders separados/específicos: 
php artisan db:seed --class=UserSeeder
php artisan db:seed --class=CourseSeeder
php artisan db:seed --class=TrailSeeder

php artisan config:clear
php artisan view:clear
php artisan cache:clear
exit

# 4. Configurar frontend React (dentro do container)
docker exec -it projourney-frontend sh
# Dentro do container:
npm install
exit

# 5. Se precisar limpar cache Docker entre builds:
docker compose down
docker system prune -af
docker compose build --no-cache
docker compose up -d
```

### Start diário

```bash
docker compose up -d
```

### Parada

```bash
docker compose down          # preserva volumes (banco de dados)
docker compose down -v       # remove volumes também (reset total)
```

### Rebuild completo (após alterações de código)

```bash
docker compose down
docker system prune -af      # limpa cache BuildKit + imagens dangling
docker compose build --no-cache
docker compose up -d
```

### Acesso

- **SPA React:** `http://localhost:8080/spa/`
- **Dashboard Inertia:** `http://localhost:8080/`
- **API:** `http://localhost:8080/api/`

### Modo local (sem Docker)

```bash
# Backend
cd backend_laravel && php artisan serve   # → http://localhost:8000

# Frontend
cd frontend_react && npm run dev          # → http://localhost:5173
```

---

## Validação de sintaxe Nginx

Sempre que modificar `proxy/nginx.conf`, validar antes de recriar o container:

```bash
docker compose exec proxy nginx -t
# Expected: nginx: configuration file /etc/nginx/nginx.conf syntax is ok
#           nginx: configuration file /etc/nginx/nginx.conf test is successful
```

---

## Problema: Vite Manifest não encontrado (Erro 500 no Dashboard Inertia)

**Sintoma:** Ao acessar `http://localhost:8080/` (Dashboard Laravel + Inertia), retorna **HTTP 500** com erro no log:

```
Illuminate\Foundation\ViteException: Vite manifest not found at: /var/www/html/public/build/manifest.json
```

**Causa:** O Laravel (via Inertia) procura o manifest em `public/build/manifest.json`, mas o Vite do backend gera o arquivo em `public/build/.vite/manifest.json` (subdiretório `.vite/`).

---

### Diagnóstico

1. O `vite.config.ts` do backend configura `build.manifest: true` mas não define `outDir` explícito.
2. O Vite padrão cria o manifest em `public/build/.vite/manifest.json`.
3. O helper `@vite()` do Blade (Laravel) procura em `public/build/manifest.json` (sem o `.vite/`).
4. No Docker, o `npm run build` não era executado automaticamente no build da imagem.

---

### Solução aplicada (commit permanente no Dockerfile)

**Arquivo:** `backend_laravel/Dockerfile`

```dockerfile
# Copia o restante do código-fonte do Laravel
COPY . .

# Instala dependências do frontend e faz build do Vite (para Inertia/manifest.json)
RUN npm ci && npm run build && cp public/build/.vite/manifest.json public/build/manifest.json 2>/dev/null || true

# Ajusta as permissões das pastas de cache e storage para o usuário do PHP-FPM (www-data)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
```

**O que faz:**
- `npm ci` → instala dependências do `package-lock.json` (reprodutível)
- `npm run build` → compila assets Vite (gera `public/build/.vite/manifest.json`)
- `cp public/build/.vite/manifest.json public/build/manifest.json` → copia para onde o Laravel espera
- `2>/dev/null || true` → não falha o build se o arquivo não existir (ex: primeira vez)

---

### Alternativa (configuração no Vite)

Se preferir corrigir na configuração do Vite em vez do Dockerfile, ajuste `backend_laravel/vite.config.ts`:

```ts
export default defineConfig({
    // ...
    build: {
        outDir: 'public/build',        // saída direta em public/build/
        manifest: true,                // gera manifest.json na raiz de outDir
        emptyOutDir: true,
    },
});
```

Com isso, o Vite gera direto em `public/build/manifest.json` e a cópia no Dockerfile se torna desnecessária.

---

## Justificativas arquiteturais

### Por que o SPA React tem seu próprio container Nginx?

1. **Navegador não transpila React** — precisa de um servidor HTTP servindo HTML/CSS/JS.
2. **SPA routing exige `try_files`** — sem `try_files $uri $uri/ /index.html;`, deep links (`/spa/cursos`) dão 404 em refresh.
3. **Separação de papéis** — app React é estático, servidor web é processo. Não se deve servir do Laravel (quebra separação) nem do proxy (proxy não tem acesso ao filesystem do frontend).

### Por que dois Nginx não conflitam?

O `frontend_react/Dockerfile` (Nginx interno, serve `dist/`) e o `proxy/Dockerfile` (Nginx externo, roteamento HTTP) são independentes. Cada um usa o `context` isolado do seu serviço no `docker-compose.yml`. O proxy externo é ortogonal à configuração interna do SPA React do frontend. Ambos podem ser executados simultane.

### Por que porta 8080?

Evita conflito com serviços locais comuns (Apache/Nginx na `80`, `php artisan serve` na `8000`, Vite dev na `5173`).

### Por que MariaDB 11 e não MySQL?

- Licença GPL puro (vs Oracle MySQL)
- Footprint ~400MB (menor que MySQL 8)
- Padrão em distribuições Linux modernas
- Compatível com Laravel via `pdo_mysql` (driver idêntico)

---

## Referências

- [Inertia React Stack Documentation](backend_laravel/documentations/inertia-react-stack.md)
- [CSRF HttpOnly Implementation](backend_laravel/documentations/csrf-http-only-implementation.md)
- [Gate/Policy Admin Authorization](backend_laravel/documentations/gate-policy-admin-authorization.md)
- [Database Seeding from Legacy Backup](backend_laravel/documentations/populate-database-legacy-backup.md)
- [docker-compose.yml](../docker-compose.yml)
- [proxy/nginx.conf](proxy/nginx.conf)
- [frontend_react/nginx.conf](../frontend_react/nginx.conf)