# Backlog da Migração para Laravel (com Fortify + Sanctum)

[Índice Principal (home)](../README.md)

## Visão Geral
Este backlog descreve a implementação bottom-up da API do Projourney utilizando Laravel 13, reaproveitando o **Fortify já instalado** para lógica de autenticação e adicionando o **Laravel Sanctum** para emissão de tokens de API.

## Decisão de Autenticação
O projeto já possui o Laravel Fortify configurado. Embora o Fortify por si só não gere tokens de API, ele pode ser combinado com o Sanctum para que as ações de login/registro **retornem um token Bearer** compatível com o frontend React. Dessa forma, mantemos o Fortify para gerenciar a autenticação (validação, hash, eventos) e usamos o Sanctum apenas para criar e revogar tokens.

## Pré-requisitos
- PHP 8.2+
- Composer 2.6+
- Node.js 18+
- MySQL 8.0+

## Tarefas do Backlog

| **Padrões de Macação de Status**       |
|---------------------------------       |
| [ ] : pendente                         |
| [*] : em andamento                     |
| [x] : concluído                        |
| [?] : não definido                     |
| [-] : descartado/desnecessário/suprido pelo framework  |

### 1️⃣ Configuração de Ambiente e Segurança
| Tarefa | Descrição | Status |
|--------|-----------|--------|
| Copiar `.env.example` → `.env` | Configurar credenciais do banco compatíveis com o existente `api_php/.env` | [x] |
| Gerar chave da aplicação | `php artisan key:generate` | [x] |
| Instalar CORS | `composer require fruitcake/laravel-cors` | [-] |
| Instalar Laravel Sanctum | `composer require laravel/sanctum` | [x] |
| Publicar configuração Sanctum | `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"` | [x] |
| Executar migrações Sanctum | `php artisan migrate` (cria tabela `personal_access_tokens`) | [x] |
| Configurar modelo User | Adicionar `use Laravel\Sanctum\HasApiTokens;` ao modelo `User` | [x] |
| Configurar CORS | Permitir origem do frontend (ex: http://localhost:5173) em `config/cors.php` | [-] |
| Verificar instalação | `php artisan serve` sem erros | [x] |

### 2️⃣ Customização do Fortify para Tokens
| Tarefa | Descrição | Status |
|--------|-----------|--------|
| Publicar configurações do Fortify | `php artisan vendor:publish --provider="Laravel\Fortify\FortifyServiceProvider"` | [x] |
| Publicar actions do Fortify | `php artisan vendor:publish --tag=fortify-actions` (se necessário) | [-] |
| Modificar `FortifyServiceProvider` | Adicionar lógica para retornar token Sanctum após login/registro | [-] |
| Customizar `RegisterResponse` | Criar resposta personalizada que retorna `{ status, token, user }` | [-] |
| Customizar `LoginResponse` | Idem para login | [-] |
| Remover redirecionamentos | Garantir que rotas de API (prefixo `/api`) nunca redirecionem, apenas retornem JSON | [-] |
| Testar fluxo | Fazer requisição POST para `/api/login` e `/api/register` e receber token | [*] |

### 3️⃣ Migrações de Banco de Dados
| Tarefa | Descrição | Status |
|--------|-----------|--------|
| Analisar esquema existente | Revisar `api_php/banco/db_projourney_php.sql` para estruturas de tabelas | [*] |
| Criar migração users | `php artisan make:migration create_users_table` | [x] |
| Criar migração trilhas | `php artisan make:migration create_trails_table` | [ ] |
| Criar migração cursos | `php artisan make:migration create_courses_table` | [ ] |
| Criar migração experiencias | `php artisan make:migration create_experiences_table` | [-] |
| Criar migração pivot trail_user | `php artisan make:migration create_trail_user_table` | [ ] |
| Criar migração pivot user_experiencia | `php artisan make:migration create_user_experience_table` | [-] |
| Criar migração pivot curso_trilha (se necessário) | `php artisan make:migration create_course_trail_table` | [ ] |
| Definir colunas e restrições | Corresponder tipos de dados, comprimentos, padrões, restrições únicas, timestamps | [ ] |
| Adicionar chaves estrangeiras | Apropriadas ações `onUpdate`/`onDelete` | [ ] |
| Executar migrações | `php artisan migrate` e verificar criação das tabelas | [ ] |
| Seeders opcionais | Criar seeders para dados de consulta (experiencias, níveis de curso) | [-] |

### 4️⃣ Modelos Eloquent
| Tarefa | Descrição | Status |
|--------|-----------|--------|
| Gerar modelo User | `php artisan make:model User` | [x] |
| Gerar modelo Trail | `php artisan make:model Trail` | [ ] |
| Gerar modelo Course | `php artisan make:model Course` | [ ] |
| Gerar modelo Experience | `php artisan make:model Experience` | [-] |
| Gerar modelo TrailUser | `php artisan make:model TrailUser` | [ ] |
| Gerar modelo UserExperience | `php artisan make:model UserExperience` | [-] |
| Configurar nomes de tabelas | Definir `$table` onde necessário (trails, experiences, trail_user, user_experience) | [ ] |
| Definir fillable/guarded | Especificar atributos de atribuição em massa | [ ] |
| Implementar relacionamentos | <ul><li>Usuário ↔ Trilha (muitos-para-muitos via trail_user com progresso)</li><li>Usuário ↔ Experiencia (muitos-para-muitos via user_experience)</li><li>Trilha ↔ Curso (muitos-para-muitos via curso_trilha)</li></ul> | [ ] |
| Adicionar accessors/mutators | Hash de senhas, formatação de datas se necessário | [ ] |
| Testar modelos | Verificar relacionamentos em `php artisan tinker` | [ ] |

### 5️⃣ Controladores da API
| Tarefa | Descrição | Status |
|--------|-----------|--------|
| Criar pasta de controladores | `mkdir -p app/Http/Controllers/Api/V1` | [x] |
| Gerar TrailController | `php artisan make:controller Api/V1/TrailController` | [ ] |
| Gerar CourseController | `php artisan make:controller Api/V1/CourseController` | [ ] |
| Gerar UserController | `php artisan make:controller Api/V1/UserController` | [ ] |
| Gerar ProgressController | `php artisan make:controller Api/V1/ProgressController` | [ ] |
| Implementar TrailController | index, store (admin), show com cursos | [ ] |
| Implementar CourseController | index, store (admin) | [ ] |
| Implementar UserController | profile (usuário autenticado) | [x] |
| Implementar Progress/TrailUser | enroll, updateProgress, remove | [ ] |
| Validação | Form Requests opcionais | [x] |
| Compatibilidade JSON | Respostas adaptadas ao backend PHP antigo | [x] |
| Middleware Sanctum | Proteger todas as rotas exceto login/register com `auth:sanctum` | [x] |

### 6️⃣ Rotas da API
| Tarefa | Descrição | Status |
|--------|-----------|--------|
| Editar `routes/api.php` | Definir rotas de autenticação em `AuthController` (register/login/logout) | [*] |
| Incluir rotas de autenticação | `Route::post('/login', ...)` e `Route::post('/register', ...)` apontando para closures ou controllers simples que invocam autenticação com Fortify | [ ] |
| Grupo protegido | Aplicar `middleware('auth:sanctum')` | [X] |
| Endpoints de recurso | Trilhas, cursos, perfil, progresso | [ ] |
| Compatibilidade de URL | Corresponder ao frontend | [x] |
| Verificar rotas | `php artisan route:list` | [*] |

### 7️⃣ Autenticação e Middleware
| Tarefa | Descrição | Status |
|--------|-----------|--------|
| Middleware personalizado (apenas na UI do Laravel/serrvidor) | Verificações de papel admin | [ ] |
| Configuração do Kernel | Garantir que o middleware Sanctum esteja no grupo de API | [-] |
| Validação de token | Verificar erros 401 JSON para tokens expirados/inválidos | [ ] |
| Teste de login | Confirmar recebimento do token com credenciais conhecidas | [-] |
| Teste de rota protegida | Validar uso do cabeçalho Authorization | [?] |
| Teste de logout | Verificar que `POST /logout` remove o token | [x] |

### 8️⃣ CORS e Compatibilidade com Frontend
| Tarefa | Descrição | Status |
|--------|-----------|--------|
| Verificar configuração CORS | Inspecionar `config/cors.php` | [?] |
| Origens permitidas | Definir para URL de desenvolvimento do frontend (ex: http://localhost:5173) | [-] |
| Testar conexão frontend | Executar `npm run dev` em frontend_react/ | [x] |
| Ajustar BASE_URL se necessário | Atualizar `VITE_API_URL` no .env do frontend | [x] |
| Validar formatos JSON | Confirmar estruturas de resposta idênticas | [x] |
| Testes ponta a ponta | Verificar que todas as páginas funcionam sem erros CORS | [*] |

### 9️⃣ (Opcional) Kit Inicial para Painel Admin
| Tarefa | Descrição | Status |
|--------|-----------|--------|
| Escolher stack admin | Selecionar Breeze, Jetstream ou Filament | [X] |
| Instalar Jetstream (se escolhido) | `composer require laravel/jetstream` | [-] |
| Instalar com Inertia + React | `php artisan jetstream:install inertia --teams` | [x] |
| Instalar dependências frontend | `npm install && npm run dev` | [x] |
| Executar migrações | `php artisan migrate` | [*] |
| Publicar componentes | Personalizar para gerenciamento de Trilha/Curso/Usuário | [ ] |
| Proteger rotas admin | Middleware verificando `$user->role === 'admin'` | [ ] |
| Alternativa: Filament | Instalar e configurar se preferido | [?] |

### 🔟 Testes e Validação
| Tarefa | Descrição | Status |
|--------|-----------|--------|
| Criar coleção Postman | Testar todos os endpoints: login, registro, trilhas, cursos, matrícula, progresso | [*] |
| Comparar respostas | Corresponder à estrutura JSON do antigo backend PHP | [-] |
| Tratamento de erros | Verificar códigos de status e formato JSON de erro | [*] |
| Executar testes Laravel | `php artisan test` (se escritos) | [?] |
| Reversibilidade de migrações | Testar `migrate:rollback` → `migrate` | [ ] |
| Teste de carga | Verificação básica de desempenho | [ ] |

### 11 Preparação para Corte Final
| Tarefa | Descrição | Status |
|--------|-----------|--------|
| Atualizar configuração do frontend | Apontar `VITE_API_URL` para a API Laravel | [x] |
| Walkthrough end-to-end | Registrar → login → navegar → matricular → verificar progresso → visualizar perfil | [*] |
| Documentar variáveis de ambiente | APP_KEY, credenciais do banco, etc. | [ ] |
| Criar commit de migração | Marcar como `laravel-api-mvp` | [?] |
| Preparar pull request | Fazer merge de `backend_laravel` na branch alvo | [ ] |


## Observações sobre Autenticação com Fortify + Sanctum
O fluxo final será idêntico ao do Sanctum puro:
1. POST `/api/register` → valida, cria usuário (via Fortify), gera token Sanctum, retorna token + user.
2. POST `/api/login` → autentica (via Fortify), gera token Sanctum, retorna token + user.
3. As demais requisições usam `Authorization: Bearer <token>`, validado pelo middleware `auth:sanctum`.

O Fortify não é exposto diretamente; a API apenas invoca suas ações internas.

## Próximos Passos
Inicie pela **Seção 1** (instalação do Sanctum e preparação do modelo User) e depois siga para a **Seção 2** (customização do Fortify). A Seção 2 é a mais crítica e será detalhada no guia passo a passo abaixo.

---
> Podemos teste a API com ferramentas como Postman ou via teminal com o curl ou similares: 

```bash

# Cadastrar novo usuário:

curl -X POST http://localhost:8000/api/register \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-d '{
"name":"Nome do Usuário", 
"email":"exemplo@email.com", 
"password":"minha-senha-segura",
"password_confirmation":"minha-senha-segura",
"fone":"(11) 99999-9999",
"birth_date":"1990-01-30"
}'

# Logar usuário cadastrado:

curl -X POST http://localhost:8000/api/login \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-d '{
"email":"exemplo@email.com", 
"password":"minha-senha-segura",
}'

# Realizar Logout no dispositivo silicitante da requisição:

curl -X POST http://localhost:8000/api/logout \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-H "Authorization: Bearer 19|MAFGgQvc0wW3vY43IlZcjBRAoIqQMiwRqMPQmF**********" 
-d '{"id": 7}'

    # Exemplo de retorno: 
    {"status":"success","message":"Logout realizado com sucesso.","user":null}


```