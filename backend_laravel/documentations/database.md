
---
# Documentação das Tabelas do Baco de Dados  

Este documento descreve, com nível de detalhe adequado para desenvolvedores, as tabelas criadas pelas migrations iniciais de um projeto Laravel. Cada seção inclui:  

- **Objetivo** da tabela no ecossistema Laravel  
- **Colunas-chave** e seu significado  
- **Índices, constraints e relacionamentos** relevantes  
- **Como o Laravel utiliza** essa tabela internamente  
- **Observações de uso ou customização**  
---

## Índece 
- [Índice Principal (Home)](../README.md)
- [Tabelas Padrão do Laravel](#tabelas-padrão-do-laravel)

---
# Tabelas Padrão do Laravel

## 1. users  

### Objetivo  
Armazena o cadastro principal de pessoas que podem autenticar-se no sistema. É a entidade central para autenticação, autorização e perfil de usuário.  

### Colunas e Detalhes  

| Coluna | Tipo | Detalhes |
|--------|------|----------|
| **id** | `bigIncrements` | Chave primária autoincremental (64‑bit). Usada como referência estrangeira em várias tabelas (ex.: `sessions.user_id`, `passkeys.user_id`). |
| **name** | `string` (máx. 255) | Nome completo ou nome de exibição do usuário. Não é único; pode ser repetido. |
| **email** | `string` (máx. 255, **unique**) | Endereço de e-mail usado como login na maioria dos aplicativos. A unicidade impede contas duplicadas. |
| **email_verified_at** | `timestamp` (nullable) | Preenchido quando o usuário confirma seu e-mail (via rota de verificação do Laravel). `NULL` indica e-mail não verificado. |
| **role** | `enum('user','admin','root')` (default: `'user'`) | Controle simples de papéis. Não substitui um sistema de ACL completo (como Spatie/Laravel-Permission), mas serve para verificações básicas (`if ($user->role === 'admin')`). |
| **birth_date** | `date` (nullable) | Data de nascimento. Útil para filtros de idade ou aniversários. |
| **fone** | `string(30)` (nullable) | Telefone no formato internacional (ex.: `+55 11 99999-9999`). Tamanho 30 permite códigos de país, DDD, número e extensão. |
| **password** | `string` (máx. 255) | Hash bcrypt da senha (gerado por `Hash::make()`). Nunca armazena senha em texto puro. |
| **remember_token** | `string(100)` (nullable) | Token usado pela funcionalidade “lembrar-me” (`$request->user()->createToken()`). Se presente, permite autenticação persistente entre sessões. |
| **two_factor_secret** | `text` (nullable) | Segredo base32 usado pelo Google Authenticator ou similares (TOTP). Preenchido quando o usuário ativa 2FA. |
| **two_factor_recovery_codes** | `text` (nullable) | Lista de códigos de recuperação (geralmente 8‑10 códigos de 8 dígitos), armazenados como JSON ou string separada por vírgulas. Usados quando o usuário perde acesso ao dispositivo 2FA. |
| **two_factor_confirmed_at** | `timestamp` (nullable) | Marca quando o usuário confirmou e ativou oficialmente a 2FA (após validar o primeiro código). |
| **created_at**, **updated_at** | `timestamps` | Mantidos automaticamente pelo Laravel (`$table->timestamps()`). Úteis para auditoria e ordenação cronológica. |

### Índices e Constraints  
- **PRIMARY KEY** (`id`)  
- **UNIQUE** (`email`)  
- Nenhum índice adicional criado por padrão (além do implicado pela PK e pelo unique).  

### Como o Laravel usa  
- **Autenticação**: `Auth::attempt()` consulta esta tabela pelo `email` e compara o hash da `password`.  
- **Lembrar-me**: Quando marcada, o Laravel grava um token em `remember_token` e cria um cookie criptografado que contém o `id` do usuário e esse token.  
- **Verificação de e-mail**: Rotas como `/email/verify` atualizam `email_verified_at`.  
- **Two‑Factor**: Pacotes como `laravel/fortify` ou `laravel/ui` (com 2FA) lêem/gravam as colunas `two_factor_*`.  
- **Autorização simples**: Gates e Policies podem checar `$user->role`.  

### Customizações comuns  
- Adicionar colunas como `avatar_path`, `provider` (para login social), `status` (ativo/bloqueado).  
- Substituir o `role` por uma relação many‑to‑many com uma tabela `roles` e um pivot `role_user` quando precisar de permissões mais granulares.  
- Trocar `enum` por uma tabela separada de papéis se a lista for dinâmica.  

---  

## 2. password_reset_tokens  

### Objetivo  
Armazena tokens de uso único para redefinição de senha (funcionalidade “Esqueci minha senha”).  

### Colunas e Detalhes  

| Coluna | Tipo | Detalhes |
|--------|------|----------|
| **email** | `string` (máx. 255, **primary key**) | O e‑mail do usuário que solicitou a redefinição. Usar a coluna como PK simplifica a busca: `WHERE email = ?`. |
| **token** | `string` (máx. 255) | Token aleatório, criptograficamente seguro (gerado por `Str::random(60)` e então hasheado antes de armazenar). O token enviado ao usuário é o texto plano; o hash fica armazenado aqui. |
| **created_at** | `timestamp` (nullable) | Momento em que o token foi gerado. Usado para validar expiração (padrão: 60 minutos). |

### Índices e Constraints  
- **PRIMARY KEY** (`email`) – garante que só exista um token pendente por e‑mail (evita múltiplas solicitações simultâneas).  
- Nenhum índice adicional necessário.  

### Como o Laravel usa  
- Quando o usuário submete seu e‑mail na tela “Esqueci minha senha”, o Laravel:  
  1. Insere um registro nesta tabela com o `email` e o hash do `token`.  
  2. Envia o token puro por e‑mail.  
- Na tela de redefinição, o Laravel compara o hash do token enviado com o armazenado; se bate e o `created_at` está dentro do intervalo de validade, permite definir nova senha.  
- Após sucesso, o registro é excluído (`DB::table('password_reset_tokens')->where(['email => $email])->delete();`).  

### Customizações comuns  
- Alterar o tempo de expiração configurando `password_reset.expire` em `config/auth.php`.  
- Adicionar uma coluna `used_at` para auditoria (quando o token foi realmente consumido).  

---  

## 3. sessions  

### Objetivo  
Persistir dados de sessão HTTP quando o driver de sessão está configurado como `database` (alternativa ao `file` ou `redis`).  

### Colunas e Detalhes  

| Coluna | Tipo | Detalhes |
|--------|------|----------|
| **id** | `string` (máx. 255, **primary key**) | ID da sessão, geralmente um hash de 32‑64 caracteres (ex.: `b3d5f7a9...`). É o valor do cookie `laravel_session`. |
| **user_id** | `bigInteger` (unsigned, nullable, indexed) | FK para `users.id`. Permite associar a sessão a um usuário autenticado; `NULL` para sessões de visitantes. |
| **ip_address** | `string(45)` (nullable) | Endereço IP do cliente (IPv4 ou IPv6). Útil para auditoria de acessos suspeitos. |
| **user_agent** | `text` (nullable) | String do User-Agent do navegador ou dispositivo. Ajuda a detectar bots ou dispositivos específicos. |
| **payload** | `longText` | Dados da sessão serializados (geralmente JSON ou string PHP serialize). Contém variáveis flash, `user_id`, `_token`, etc. |
| **last_activity** | `integer` (indexed) | Timestamp Unix (segundos desde 1970‑01‑01) da última requisição que utilizou essa sessão. O Laravel usa esse campo para limpeza automática de sessões antigas (via `php artisan session:gc`). |

### Índices e Constraints  
- **PRIMARY KEY** (`id`)  
- **INDEX** (`user_id`) – acelera busca por sessões de um determinado usuário (útil para “forçar logout em todos os dispositivos”).  
- **INDEX** (`last_activity`) – usado pelo garbage collector para encontrar sessões expiradas rapidamente.  

### Como o Laravel usa  
- Quando `SESSION_DRIVER=database`, o Laravel lê/grava nessa tabela a cada requisição.  
- Ao iniciar sessão (`session_start()`), o framework tenta ler o registro pelo `id` (obtido do cookie). Se não existir, cria um novo.  
- Ao encerrar, atualiza `payload` e `last_activity`.  
- O comando `php artisan session:gc` deleta registros onde `last_activity < NOW() - lifetime`.  

### Customizações comuns  
- Mudar o driver para `redis` ou `memcached` em ambientes de alta performance (editar `config/session.php`).  
- Adicionar coluna `user_agent_hash` para facilitar agrupamento por tipo de dispositivo sem armazenar o texto completo.  

---  

## 4. cache  

### Objetivo  
Armazenar itens de cache quando o driver de cache está definido como `database` (alternativa a `file`, `redis`, `memcached`).  

### Colunas e Detalhes  

| Coluna | Tipo | Detalhes |
|--------|------|----------|
| **key** | `string` (máx. 255, **primary key**) | Chave única usada para armazenar e recuperar o valor (ex.: `views::laravel::index`). |
| **value** | `mediumText` | Conteúdo cacheado (serializado). Pode ser strings, números, arrays ou objetos JSON. |
| **expiration** | `bigInteger` (indexed) | Timestamp Unix (em segundos) quando o cache expira. O Laravel verifica esse campo ao ler; se expirado, o registro é ignorado e pode ser removido pelo GC. |

### Índices e Constraints  
- **PRIMARY KEY** (`key`) – busca O(1) por chave.  
- **INDEX** (`expiration`) – usado pelo comando `php artisan cache:clear` e pelo próprio driver para remover entradas expiradas de forma eficiente.  

### Como o Laravel usa  
- Quando `CACHE_DRIVER=database`, métodos como `Cache::put('foo', 'bar', 60)` inserem/atualizam um registro com `key = 'foo'`, `value = serialize('bar')`, `expiration = time() + 60`.  
- `Cache::get('foo')` tenta ler; se `expiration` < agora, retorna `null` e opcionalmente deleta o registro.  
- Operações de limpeza (`Cache::flush()`) executam `DELETE FROM cache`.  

### Customizações comuns  
- Em ambientes de produção, trocar para `redis` ou `memcached` para melhor desempenho e persistência opcional.  
- Adicionar coluna `tags` (texto ou JSON) se precisar de cache com etiquetagem (requer driver que suporte tags).  

---  

## 5. cache_locks  

### Objetivo  
Imprimir mecanismos de trava (lock) distribuído quando usando o driver de cache `database`. Garante que apenas um processo execute uma seção crítica de código por vez.  

### Colunas e Detalhes  

| Coluna | Tipo | Detalhes |
|--------|------|----------|
| **key** | `string` (máx. 255, **primary key**) | Identificador único da trava (ex.: `lock::send_weekly_report`). |
| **owner** | `string` (máx. 255) | String que identifica o dono da trava (geralmente o ID do processo ou um UUID). Usado para liberar a trava apenas se o mesmo dono a adquirir. |
| **expiration** | `bigInteger` (indexed) | Timestamp Unix quando a trava expira automaticamente (evita deadlock caso o processo trave). |

### Índices e Constraints  
- **PRIMARY KEY** (`key`) – garante que só exista uma trava ativa por chave.  
- **INDEX** (`expiration`) – permite limpeza rápida de travas expiradas.  

### Como o Laravel usa  
- O método `Cache::lock('foo', 10)` tenta inserir um registro nesta tabela com `key = 'foo'`, `owner = <unique_id>`, `expiration = now() + 10`.  
- Se a inserção falhar devido à violação da PK (já existe um lock com aquela chave), o método retorna `false` ou lança exceção, conforme a opção `blocking`.  
- Quando o trabalho termina, o dono chama `lock->release()`, que deleta o registro se o `owner` ainda corresponder.  
- Se o processo travar antes de liberar, a trava será removida automaticamente quando o `expiration` passar.  

### Customizações comuns  
- Em sistemas com alta concorrência, considerar drivers de lock nativos do Redis (`Redis::set` com `NX` e `PX`) ou do banco (ex.: `SELECT ... FOR UPDATE`).  
- Aumentar o tamanho da coluna `owner` se precisar armazenar informações mais detalhadas (hostname, PID, UUID).  

---  

## 6. jobs  

### Objetivo  
Fila de jobs a serem processados por workers (comando `php artisan queue:work`). Cada linha representa uma unidade de trabalho disparada por `dispatch()` ou `Queue::push()`.  

### Colunas e Detalhes  

| Coluna | Tipo | Detalhes |
|--------|------|----------|
| **id** | `bigIncrements` | Identificador único do job (auto‑increment). |
| **queue** | `string` (máx. 255, **indexed**) | Nome da fila à qual o job pertence (ex.: `default`, `emails`, `high`). Permite que workers processem apenas filas específicas (`php artisan queue:work --queue=emails`). |
| **payload** | `longText` | Conteúdo serializado do job (classe, método, argumentos). O Laravel usa `json_encode` ou `serialize` dependendo do driver de queue. |
| **attempts** | `unsignedSmallInteger` | Número de vezes que o job já foi tentado. Incrementado a cada falha; quando supera `maxTries` (definido na classe do job), o job é movido para `failed_jobs`. |
| **reserved_at** | `unsignedInteger` (nullable) | Timestamp Unix quando um worker reservou o job (o começou a processar). Se `NULL`, o job está disponível para ser pego. |
| **available_at** | `unsignedInteger` | Timestamp Unix quando o job fica disponível para consumo (útil para atraso explícito via `delay()`). |
| **created_at** | `unsignedInteger` | Timestamp Unix quando o job foi inserido na fila. |

### Índices e Constraints  
- **PRIMARY KEY** (`id`)  
- **INDEX** (`queue`) – acelera a consulta `SELECT * FROM jobs WHERE queue = ? AND available_at <= NOW() ORDER BY id ASC LIMIT 1`.  
- Não há índice explícito em `available_at`, mas muitas implementações de workers fazem uso dele em cláusulas `WHERE`.  

### Como o Laravel usa  
- **Enfileiramento**: `Job::dispatch()` grava na tabela `jobs` com `payload` contendo o nome da classe do job e seus atributos serializados.  
- **Processamento**: Workers executam um loop:  
  1. Selecionam o job mais antigo disponível (`available_at <= NOW()`)