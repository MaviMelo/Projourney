<?php
require_once('db.php');

$teste = 'Servidor PHP funcionando!';
var_dump($teste);
echo "\n";

$busca = $pdo->query("SELECT * FROM curso");
$cursos = $busca->fetchAll(PDO::FETCH_ASSOC);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nome = $_POST['curso'];
    $nivel = $_POST['nivel'];
    $link_curso = $_POST['link_url'];

    $stm = $pdo->prepare("SELECT * FROM curso WHERE nome = ?");
    $stm->execute([$nome]);

    if ($stm->fetch()) {
        echo "<script> alert('Curso de mesmo nome já existe!')</script>";
    } else {
        $stm = $pdo->prepare("INSERT INTO curso (nome, nivel, link_curso) VALUES (?, ?, ?)");
        if ($stm->execute([$nome, $nivel, $link_curso])) {
            header("location: " . $_SERVER['PHP_SELF'] . "?status=success");
            echo "Curso $nome cadastrado com sucesso";
            exit();
        } else {
            echo "falha ao registrar o curso.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <!-- Define a largura da página como a largura do dispositivo e impede o zoom manual -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="./css/styles.css">
</head>

<body>
    <header>
        <h1>Cadastro de Cursos</h1>
    </header>

    <main>
        <?php
        if (isset($_GET['status']) && $_GET['status'] == 'success') {
            echo '<p style="color: green;">Curso cadastrado com sucesso!</p>';
        }
        ?>
        <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="POST">
            <label for="curso">Nome do curso:</label>
            <input type="text" id="curso" name="curso" required>
            <label for="nivel">Nivel do curso:</label>
            <select name="nivel" id="nivel" required>
                <option value="">--Selecione--</option>
                <option value="Basico">Básico</option>
                <option value="Intermediario">Intermediário</option>
                <option value="Avançado">Avançado</option>
            </select>
            <br>
            <label for="link_url">link do curso:</label>
            <input type="text" id="link_url" name="link_url" required>
            <button type="submit">Adicionar Curso</button>
        </form>
    </main>

    <table>
        <thead>
            <tr>
                <th>Curso</th>
                <th>Nível</th>
                <th>URL</th>
            </tr>
        </thead>
        <tbody>
        <?php foreach ($cursos as $curso): ?>
            <tr>
                <td><?= $curso['nome'] ?></td>
                <td><?= $curso['nivel'] ?></td>
                <td> <a href="<?= $curso['link_curso'] ?>"> <?= $curso['link_curso'] ?> </a> </td>
            </tr>
<?php endforeach; ?>
        </tbody>
    </table>


    <footer>
    </footer>

    <!-- link JavaScript
     <script src="js/scripts.js" defer></script>
    -->
</body>

</html>
<?php 
    // phpinfo();