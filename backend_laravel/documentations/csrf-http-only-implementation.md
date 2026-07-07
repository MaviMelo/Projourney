# Implementação de HttpOnly + X‑XSRF‑TOKEN

## Visão Geral

Esta documentação descreve como o Laravel implementa a proteção contra CSRF usando:

- **HttpOnly cookie** para a sessão de autenticação (`projourney-server-session`);
- **X‑XSRF‑TOKEN** como token CSRF enviado no header das requisições.

A combinação garante que:
- O token CSRF esteja disponível para o frontend (JavaScript) ler e enviar;
- A sessão de usuário permaneça protegida contra acesso via JavaScript (HttpOnly);
- O servidor valide o token CSRF sem depender de decodificação complexa.

## Componentes Envolvidos

| Componente | Função | Local |
|------------|--------|-------|
| **Session Cookie (`projourney-server-session`)** | Contém o identificador da sessão e dados do usuário. | Configuração de sessão (`config/session.php`) |
| **X‑XSRF‑TOKEN** | Token CSRF em texto plano, usado para validar a origem da requisição. | Cookie `XSRF-TOKEN` (não HttpOnly) |
| **Middleware `EncryptCookiesExceptCsrf`** | Garante que o cookie de sessão seja criptografado, mas exclui o `XSRF-TOKEN` da criptografia. | `app/Http/Middleware/EncryptCookiesExceptCsrf.php` |
| **Middleware `VerifyCsrfTokenPlain`** | Valida o token CSRF comparando o valor da sessão com o token enviado no header `X-XSRF-TOKEN` (ou campo `_token`). | `app/Http/Middleware/VerifyCsrfTokenPlain.php` |
| **Middleware `EnsureFrontendRequestsAreStateful`** | Habilita o middleware de sessão para requisições da SPA (Inertia/React). | `config/sanctum.php` + `bootstrap/app.php` |

## Configuração de Cookies

### Sessão (HttpOnly)

```php
// config/session.php
'session' => [
    // ...
    'http_only' => env('SESSION_HTTP_ONLY', true), // garante que o cookie não é acessível via JS
    'same_site' => env('SESSION_SAME_SITE', 'lax'), // protege contra CSRF cross-site
],
```

### XSRF Token (não HttpOnly)

```php
// config/session.php
'except' => [
    'XSRF-TOKEN', // cookie XSRF-TOKEN não é criptografado
],
```

### Middleware de Criptografia de Cookies

```php
// app/Http/Middleware/EncryptCookiesExceptCsrf.php
protected $except = [
    'appearance',
    'sidebar_state',
    'XSRF-TOKEN', // token CSRF permanece legível
];
```

## Fluxo de Autenticação e CSRF

1. **Login/Registro**  
   - O `AuthController` cria a sessão e define o cookie `projourney-server-session` (HttpOnly) e o cookie `XSRF-TOKEN` (texto plano).  
   - O `Auth::login($user)` garante que a sessão seja iniciada.

2. **Requisição da SPA**  
   - O frontend (React) lê o valor do cookie `XSRF-TOKEN` via `document.cookie`.  
   - Em cada requisição `fetch`/`axios`, o token é incluído no header `X-XSRF-TOKEN`.

3. **Validação no Backend**  
   - O middleware `VerifyCsrfTokenPlain` (extendendo `PreventRequestForgery`) compara:  
     - **Token da sessão** (`$request->session()->token()`)  
     - **Token enviado no header** (`$request->header('X-XSRF-TOKEN')`)  
   - A comparação é feita com `hash_equals` para evitar ataques de timing.

4. **Falha de Validação**  
   - Se os tokens não coincidirem, lança‑se `TokenMismatchException`, abortando a requisição.

## Segurança e Considerações

- **HttpOnly** impede que JavaScript leia o cookie de sessão, mitigando XSS que tenta roubar a sessão.
- **XSRF‑TOKEN** em texto plano permite que o frontend inclua o token em requisições customizadas (headers ou parâmetros), essencial para APIs SPA.
- **SameSite=Lax** impede que requisições cross‑site (ex.: formulário de outro domínio) enviem o cookie de sessão, reduzindo vetores de CSRF.
- **Exclusão do XSRF‑TOKEN da criptografia** garante que o token seja sempre legível, sem sobrecarga de criptografia.
- **HTTPS obrigatório** (configuração `SESSION_SECURE_COOKIE`) assegura que ambos os cookies só sejam enviados via conexão segura.

## Referências nos Arquivos do Projeto

- **config/session.php** – define `http_only`, `same_site` e a lista de cookies a serem excluídos da criptografia.
- **app/Http/Middleware/EncryptCookiesExceptCsrf.php** – exclui `XSRF-TOKEN` da criptografia.
- **app/Http/Middleware/VerifyCsrfTokenPlain.php** – implementa a verificação de CSRF baseada em token em texto plano.
- **bootstrap/app.php** – registra o middleware `EnsureFrontendRequestsAreStateful` para que a sessão seja mantida nas requisições da SPA.

---

*Documentação criada em 2026‑07‑07, baseada na implementação atual do Laravel 13 e nas especificações de segurança adotadas no projeto Projourney.*