# ProJourney

---

O **ProJourney** é um projeto acadêmico desenvolvido por estudantes do curso de Tecnologia de Sistemas para a Internet - TSI - do Instituto Federal de Pernambuco, Campos Igarassu. O mesmo tem, na sua origem, como principal objetivo o redirecionamento de seus usuários para cursos onlines gratuitos com boa aprovação ou avaliação popular. Permitindo seguir uma sequencia de cursos online, denominadas como **Trilhas**, que formam o conteúdo educacional necessário para uma determinada formação profissional ou pessoal.

---

## Recursos disponíveis:

- Seguir trilhas de estudos;
- Mural de cursos divulgados por instituições de ensino.

## Recursos futuros:

- Criar trilhas personalizadas com os cursos ofertados; 
- Avaliar/comentar os cursos.

---

## Principais Dependências:

1. **Frontend:**
    - Node.js
    - npm 10.9.4

1. **Backend:**
    - PHP
        - php-mysql
    - Conposer
    - mysql-server


## Instalação:

1. **backend_laravel:**
    - Executar o comando ```composer install```;
    - Criar e configurar arquivo de variáveis de ambiente (```.env```);
    - Teste localmente: ```php -S localhost:8000```

1. **frontend_react:**
    - Executar o comando ```npm install```;
    - Criar e configurar arquivo de variáveis de ambiente (```.env```);
    - Teste localmente: ```npm rum dev```

1. **Banco de Dados:**
    - Ter instalado o SGBD MySQL;
    - Popular o banco de dados com o script feito na API: 
        - ```php artisan db:seed```

## Arquitetura do Software Para Essa Versão:
```
Projourney
.
├── api_php
│   ├── banco
│   │   ├── db_backup_projournei_php.sql
│   │   └── db_projourney_php.sql
│   ├── composer.json
│   ├── composer.lock
│   ├── css
│   │   └── styles.css
│   ├── src
│   │   ├── atualizar_progresso.php
│   │   ├── auth.php
│   │   ├── cadastrar_aluno.php
│   │   ├── cursos_da_trilha.php
│   │   ├── db.php
│   │   ├── delete_user_trail.php
│   │   ├── index.php
│   │   ├── inscrever_trilha.php
│   │   ├── listar_trilhas.php
│   │   ├── login.php
│   │   └── perfil_aluno.php
│   └── vendor
├── frontend_react
│   ├── dist
│   │   ├── teste2.js
│   │   └── teste.js
│   ├── index.html
│   ├── node_modules
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── public
│   │   └── image
│   ├── README.md
│   ├── src
│   │   ├── app.tsx
│   │   ├── assets
│   │   ├── components
│   │   ├── config
│   │   ├── lib
│   │   ├── main.tsx
│   │   ├── pages
│   │   └── types
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── tutorial.md
│   └── vite.config.ts
└── README.md

210 directories, 32 files
```

## Desenvolvedores que contribuíram e os que ainda contribuem para o projeto:

* [Matheus Langendolf](https://github.com/MLangendolf)
* [Cristiano Caldas](https://github.com/Criscgarcia)
* [Gabriel Saruba](https://github.com/gabrielsaruba)
* [Arthur Pontes](https://github.com/apmrnh)
* [Maviael Melo](https://github.com/MaviMelo)
* [Gabriel Henrique](https://github.com/crocodileBigger)
* [Victor Soares](https://github.com/VSoares27)
* [José Diego](https://github.com/Diego-jpeg-27)

## Professores orientadores ao longo do projeto:
* [Liliane](https://github.com/lilialnas)
* [Emaur Florêncio](https://github.com/)
* [Macone J. Silva](https://github.com/)


