<?php
require_once __DIR__ . '/vendor/autoload.php';

// Carregar variáveis de ambiente
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
?>

<!DOCTYPE html>
<html lang="pt-BR, en">

<head>
    <meta charset="UTF-8">
    <!-- Define a largura da página como a largura do dispositivo e impede o zoom manual -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> <?= $_ENV['APP_NAME'] ?? "Projourney"; ?> </title>
    <link rel="stylesheet" href="./src/css/indexPage.css">
</head>

<body>

    <div class="">
        <header>
            <h1><?= $_ENV['APP_NAME'] ?? "PROJOURNEY" ?></h1>
            <h2>
                Sistama de Gerenciamento
            </h2>
        </header>

        <main>
            <label for="nivel">Serviços:</label>
            <select name="nivel" id="nivel" onchange="if(this.value) window.location.href=this.value;">
                <option value="">--Selecione--</option>
                <option value="src/add_class.php">Cadastrar Cursos</option>
                <option value="src/add_trail.php">Criar Trilha</option>
            </select>
        </main>
    </div>
    <?php phpinfo(); ?>

</body>

<footer>

</footer>

</html>