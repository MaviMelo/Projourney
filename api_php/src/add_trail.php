<?php
require_once __DIR__ . '/db.php';
session_start();

$trail_details = [];
$get_trail_id = $_POST['trilha_id'] ?? $_GET['trilha_id'] ?? NULL;

$fetch_trail_with_courses = $pdo->prepare("
    SELECT 
        t.id  trilha_id,
        t.nome AS trilha_nome,
        c.id AS curso_id,
        c.nome AS curso_nome
    FROM 
        trilha t
    LEFT JOIN 
        curso_trilha ct ON t.id = ct.trilha_id
    LEFT JOIN 
        curso c ON ct.curso_id = c.id
    WHERE 
        t.id = ?
    ORDER BY 
        c.nome ASC;
    ");

$fetch_trail_with_courses->execute([$get_trail_id]);
$trail_details = $fetch_trail_with_courses->fetchAll(PDO::FETCH_ASSOC);

$busca_cursos = $pdo->query("SELECT * FROM curso ORDER BY `nome` ASC;");
$cursos = $busca_cursos->fetchAll(PDO::FETCH_ASSOC);

$fetch_trail_with_courses = $pdo->query("SELECT * FROM `trilha` ORDER BY `nome` ASC;");
$trilhas = $fetch_trail_with_courses->fetchAll(PDO::FETCH_ASSOC);


if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['trilha'])) {
    $trail_name = $_POST['trilha'];

    $stm = $pdo->prepare("SELECT `nome` FROM `trilha` WHERE `nome` LIKE (?);");
    $stm->execute([$trail_name]);

    if ($stm->fetch()) {

        $message = "Trilha de mesmo nome ($trail_name) já existe!";
        $_SESSION['old_input'] = $_POST['trilha'];
        
        header("location: " . $_SERVER['PHP_SELF'] . "?status=error&message=" . urlencode($message));
        exit();
    } else {

        $stm = $pdo->prepare("INSERT `trilha` (`nome`) VALUE (?);");
        $stm->execute([$trail_name]);

        $message = "Trilha ($trail_name) criada com sucesso.";
        header("location: " . $_SERVER['PHP_SELF'] . "?status=success&message=" . urlencode($message));
        exit();
    }
} else if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['trilha_id']) && isset($_POST['curso_id'])) {

    $trail_id = $_POST['trilha_id'];
    $course_id = $_POST['curso_id'];

    $stmt_trail = $pdo->prepare("SELECT nome FROM trilha WHERE id = ?");
    $stmt_trail->execute([$trail_id]);
    $trail_name = $stmt_trail->fetchColumn();

    $stm_course_name = $pdo->prepare("SELECT `nome` FROM `curso` WHERE `id` = ?");
    $stm_course_name->execute([$course_id]);
    $course_name = $stm_course_name->fetchColumn();

    $stm = $pdo->prepare("SELECT * FROM `curso_trilha` WHERE trilha_id = ? AND curso_id = ?");
    $stm->execute([$trail_id, $course_id]);

    if ($stm->fetch()) {
        $message = " O curso \"$course_name\" já está associado à trilha \" $trail_name \". \r Confira a lista de cursos da trilha:";
        header("location: " . $_SERVER['PHP_SELF'] . "?trilha_id=" . $trail_id . "&status=error&message=" . urlencode($message));
        exit();
    } else {
        $stm = $pdo->prepare("INSERT INTO curso_trilha (trilha_id, curso_id) VALUES (?, ?)");
        $stm->execute([$trail_id, $course_id]);

        $message = "Curso \"$course_name\" associado à trilha \" $trail_name \" com sucesso. \r Confira a lista de cursos da trilha:";
        header("location: " . $_SERVER['PHP_SELF'] . "?trilha_id=" . $trail_id . "&status=success&message=" . urlencode($message));
        exit();
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR, en">

<head>
    <meta charset="UTF-8">
    <!-- Define a largura da página como a largura do dispositivo e impede o zoom manual -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> <?= $_ENV['APP_NAME'] ?? "Projourney"; ?> </title>
    <link rel="stylesheet" href="./css/styles.css">
</head>

<body>
    <header>
        <h1><?= $_ENV['APP_NAME'] ?? "PROJOURNEY"; ?></h1>

        <div class="itemCentered">
            <label for="nivel">Serviços:</label>
            <select name="nivel" id="nivel" onchange="if(this.value) window.location.href=this.value;">
                <option value="">--Selecione--</option>
                <option value="../index.php">Home</option>
                <option value="./add_class.php">Cadastrar Cursos</option>
            </select>
        </div>

    </header>
    <h2>Criar Trilhas</h2>
    <form class="form" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="POST">
        <label for="trilha">Criar Nova Trilha:</label>
        <input type="text" id="trilha" name="trilha" value="<?= htmlspecialchars($_SESSION['old_input'] ?? ''); ?>" required>

        <button type="submit">Adicionar</button>
    </form>
    <br />
    <?php
    if (isset($_GET['status']) && $_GET['status'] == 'success') {
        $message =  htmlspecialchars($_GET['message']);
        echo '<p class="messageSuccess">' . $message . '</p>';
    } else if (isset($_GET['status']) && $_GET['status'] == 'error') {
        $message =  htmlspecialchars($_GET['message']);
        echo '<p class="messageError">' . $message . '</p>';
    }
    ?>
    <ul>
        <?php foreach ($trail_details as $trail_detail): ?>
            <li><?= $trail_detail['curso_nome']; ?></li>
        <?php endforeach; ?>
    </ul>
    <br />
    <div>
        <main>
            <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="POST">
                <label for="trilha">Escolher trilha existente para adicionar o curso:</label>
                <select id="trilha" name="trilha_id" required>
                    <option value="">--Selecione--</option>
                    <?php foreach ($trilhas as $trilha): ?>
                        <option value="<?= $trilha['id']; ?>" <?= ($get_trail_id == $trilha['id']) ? 'selected' : ''; ?>><?= $trilha['nome']; ?></option>
                    <?php endforeach; ?>
                </select>
                <br>
                <div class="itemCentered">

                    <table>
                        <thead>
                            <tr>
                                <th>Curso</th>
                                <th>Nível</th>
                                <th>URL</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($cursos as $curso): ?>
                                <tr>
                                    <td><?= $curso['nome']; ?></td>
                                    <td><?= $curso['nivel']; ?></td>
                                    <td> <a href="<?= $curso['link_curso']; ?>"> <?= $curso['link_curso']; ?> </a> </td>
                                    <td><button type="submit" name="curso_id" value="<?= $curso['id']; ?>">Adicionar</button></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </form>
        </main>
    </div>



    <footer>
    </footer>

</body>

</html>