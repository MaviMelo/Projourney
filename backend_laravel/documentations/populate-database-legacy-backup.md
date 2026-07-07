# Popular Banco de Dados com Backup Legado (PHP Vanilla)

## Visão Geral

Este documento descreve o procedimento para popular o banco de dados atual (Laravel, tabelas em inglês) com os dados do backup do sistema antigo em PHP Vanilla (`api_php database/db_backup_projourney_php.sql`).

## Mapeamento de Tabelas

| Tabela Legacy (PT) | Tabela Laravel (EN) | Colunas |
|---|---|---|
| `trilha` | `trails` | `id`, `nome` → `name` |
| `curso` | `courses` | `id`, `nome` → `name`, `nivel` → `level`, `link_curso` → `link_course` |
| `curso_trilha` | `trail_courses` | `trilha_id` → `trail_id`, `curso_id` → `course_id` |

## Dados Importados

### Trilhas (8 registros)
- Desenvolvimento Frontend
- Desenvolvimento Backend
- Desenvolvimento Mobile
- Desenvolvimento Full Stack
- Ciência de Dados
- DevOps e Cloud
- Inteligência Artificial
- Segurança da Informação

### Cursos (19 registros)
Python, JavaScript, Java, C#, C++, PHP, TypeScript, Go, Rust, Swift, Ruby, C, Lua, HTML/CSS, SQL, Git/GitHub, Docker, Bash, PowerShell.

### Relações (50 registros)
Mapeamento N:N entre trilhas e cursos via tabela `trail_courses`.

## Procedimento de Importação

### 1. Via Tinker (Recomendado)

```bash
cd /home/adm1/repositories_git/Projourney/backend_laravel

# Importar trilhas
php artisan tinker --execute="
DB::table('trails')->insert([
    ['id' => 2, 'name' => 'Desenvolvimento Frontend', 'created_at' => now(), 'updated_at' => now()],
    ['id' => 3, 'name' => 'Desenvolvimento Backend', 'created_at' => now(), 'updated_at' => now()],
    ['id' => 4, 'name' => 'Desenvolvimento Mobile', 'created_at' => now(), 'updated_at' => now()],
    ['id' => 5, 'name' => 'Desenvolvimento Full Stack', 'created_at' => now(), 'updated_at' => now()],
    ['id' => 6, 'name' => 'Ciência de Dados', 'created_at' => now(), 'updated_at' => now()],
    ['id' => 7, 'name' => 'DevOps e Cloud', 'created_at' => now(), 'updated_at' => now()],
    ['id' => 8, 'name' => 'Inteligência Artificial', 'created_at' => now(), 'updated_at' => now()],
    ['id' => 9, 'name' => 'Segurança da Informação', 'created_at' => now(), 'updated_at' => now()],
]);
"

# Importar cursos (19 registros)
php artisan tinker --execute="
DB::table('courses')->insert([
    ['id' => 5, 'name' => 'Python', 'level' => 'básico', 'link_course' => 'https://www.ev.org.br/cursos/linguagem-de-programacao-python-basico', 'created_at' => now(), 'updated_at' => now()],
    // ... (demais cursos)
]);
"

# Importar relações pivot (50 registros)
php artisan tinker --execute="
\$relations = [[6,2],[11,2],[18,2],[20,2],[5,3],[6,3],[7,3],[8,3],[10,3],[12,3],[15,3],[19,3],[20,3],[21,3],[22,3],[23,3],[6,4],[7,4],[8,4],[14,4],[20,4],[5,5],[6,5],[11,5],[18,5],[19,5],[20,5],[21,5],[22,5],[23,5],[5,6],[19,6],[20,6],[5,7],[12,7],[20,7],[21,7],[22,7],[23,7],[5,8],[7,8],[9,8],[17,8],[5,9],[6,9],[9,9],[16,9],[19,9],[22,9],[23,9]];
foreach(\$relations as \$rel) {
    DB::table('trail_courses')->insert([
        'trail_id' => \$rel[1],
        'course_id' => \$rel[0],
        'created_at' => now(),
        'updated_at' => now()
    ]);
}
"
```

### 2. Backup do Banco Populado

```bash
# Criar backup com mysqldump
mkdir -p database/backups
mysqldump --host=127.0.0.1 --user=root --password=r00t projourney_laravel > database/backups/projourney_laravel_$(date +%Y%m%d_%H%M%S).sql
```

## Validação

```bash
# Verificar quantidade de registros
php artisan tinker --execute="
echo 'Trilhas: ' . DB::table('trails')->count() . PHP_EOL;
echo 'Cursos: ' . DB::table('courses')->count() . PHP_EOL;
echo 'Relações: ' . DB::table('trail_courses')->count() . PHP_EOL;
"
```

## Rollback (se necessário)

```bash
# Restaurar backup anterior

# flag --host=<ip> para SGBD remoto
mysql --host=127.0.0.1 --user=<usuário> --password=<senha> projourney_laravel < caminho/para-o-arquivo/backup_anterior.sql 
        # ou
mysql -u <usuário> -p projourney_laravel < backend_laravel/database/backups/projourney_laravel_mysql-mariadb.sql # digitar senha em seguida. 

# ___COMANDOS ÚTEIS E CONFIGURAÇÕES:____________________________________________________
#
# mysqldump -u <usuário> -p projourney_laravel > projourney_laravel_mysql-mariadb.sql  # fazer dump/backup
#
# CREATE USER '<userName>'@'localhost' IDENTIFIED WITH mysql_native_password BY '<password>';
#
# ALTER USER '<userName>'@'localhost' IDENTIFIED WITH mysql_native_password BY '<password>'; 
#
# DROP DATABASE IF EXISTS projourney_laravel;
# 
# CREATE DATABASE projourney_laravel;
# USE projourney_laravel;

```

---

*Documentação criada em 2026-07-07. Importação realizada com sucesso.*