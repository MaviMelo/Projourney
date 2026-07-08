# Backlog da Migração para Laravel — CONCLUÍDO

**Status:** Migração concluída em 2026-07-07

## Índice

- [Resumo da Implementação](#resumo-da-implementação)
- [Documentação Criada](#documentação-criada)
- [Tarefas Originais](#histórico-tarefas-originais-do-backlog)
- [README Principal](../README.md)

---

## Resumo da Implementação

Todas as funcionalidades do backend PHP Vanilla foram migradas para Laravel 13:

| Módulo | Status | PR/Commit |
|--------|--------|-----------|
| Configuração de Ambiente | ✅ | `c644c98f` |
| Autenticação (HttpOnly + CSRF) | ✅ | `d2fc58b7` |
| Gates/Policies (Autorização) | ✅ | `285e3e4d` |
| Migrations (tabelas em inglês) | ✅ | `f22032fe` |
| Models + Relacionamentos | ✅ | `ffa94b1e` |
| CRUD Usuários | ✅ | `6df5df03` |
| CRUD Trilhas | ✅ | `ffa94b1e` |
| CRUD Cursos | ✅ | `ffa94b1e` |
| Seed de Dados (legado) | ✅ | `18f78699` |
| Middleware Admin | ✅ | `285e3e4d` |

## Documentação Criada

| Documento | Descrição |
|-----------|-----------|
| [database.md](./database.md) | Schema do banco de dados |
| [inertia-react-stack.md](./inertia-react-stack.md) | Arquitetura frontend |
| [csrf-http-only-implementation.md](./csrf-http-only-implementation.md) | Segurança com Sanctum SPA |
| [gate-policy-admin-authorization.md](./gate-policy-admin-authorization.md) | Autorização baseada em roles |
| [populate-database-legacy-backup.md](./populate-database-legacy-backup.md) | Importação de dados do legado |

## Histórico: Tarefas Originais do Backlog

Abaixo está o backlog original para referência histórica. Todas as tarefas relevantes foram concluídas ou descartadas por serem supridas pelo framework.

### 1️⃣ Configuração de Ambiente e Segurança — ✅
- [x] `.env` configurado
- [x] `php artisan key:generate`
- [x] Sanctum instalado e configurado
- [x] CORS configurado (`config/cors.php`)

### 2️⃣ Autenticação — ✅
- [x] HttpOnly cookie session (`projourney-server-session`)
- [x] XSRF-TOKEN em plain-text para frontend
- [x] Token rotation com refresh automático (24h)
- [x] Middleware `EncryptCookiesExceptCsrf`
- [x] Middleware `VerifyCsrfTokenPlain`

### 3️⃣ Gates/Policies — ✅
- [x] Gate `manage-users` (apenas root)
- [x] Gate `access-admin-panel` (adm + root)
- [x] Middleware `EnsureUserIsAdmin`
- [x] UserController: edit/update/destroy protegidos

### 4️⃣ Migrations — ✅
- [x] `users` (id, name, email, password, role, birth_date, phone, timestamps)
- [x] `trails` (id, name, timestamps)
- [x] `courses` (id, name, level, link_course, timestamps)
- [x] `trail_courses` (pivot: trail_id, course_id)
- [-] `experiences` (não utilizado no frontend)

### 5️⃣ Models — ✅
- [x] `User` com `HasApiTokens`
- [x] `Trail` com relacionamento `courses()`
- [x] `Course` com relacionamento `trails()`
- [x] Relacionamentos N:N via `trail_courses`

### 6️⃣ Controllers — ✅
- [x] `UserController` (CRUD completo, Gate para root)
- [x] `TrailController` (CRUD para admins)
- [x] `CourseController` (CRUD para admins)
- [x] `AuthController` (login, registro, logout)

### 7️⃣ Rotas — ✅
- [x] `routes/web.php` com middleware `['auth', 'verified', 'admin']`
- [x] `routes/settings.php` protegido
- [x] Resources: `user`, `trail`, `course`

### 8️⃣ Dados — ✅
- [x] 8 trilhas importadas
- [x] 19 cursos importados
- [x] 50+ relações em `trail_courses`
- [x] Backup: `database/backups/projourney_laravel_*.sql`

---
---

*Backlog atualizado em 2026-07-07. Migração MVP concluída.*

---

## Navegação na Documentação

| Documento | Link |
|-----------|------|
| [README.md (Principal)](../README.md) | Visão geral do projeto |
| [inertia-react-stack.md](./inertia-react-stack.md) | Arquitetura frontend com Inertia |
| [gate-policy-admin-authorization.md](./gate-policy-admin-authorization.md) | Autorização baseada em roles |
| [csrf-http-only-implementation.md](./csrf-http-only-implementation.md) | Segurança com Sanctum SPA |
| [database.md](./database.md) | Schema do banco de dados |
| [populate-database-legacy-backup.md](./populate-database-legacy-backup.md) | Importação de dados do legado |