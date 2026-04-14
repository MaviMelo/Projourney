<?php
require_once __DIR__.'/db.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit();
}

// 1. Validação do id do aluno (recebido via parâmetro GET na URL)
if (!isset($_GET['alunoId']) || !is_numeric($_GET['alunoId'])) {
    http_response_code(400 );
    echo json_encode(["status" => "erro", "mensagem" => "ID do aluno é obrigatório."]);
    exit();
}

$alunoId = intval($_GET['alunoId']);
$resposta = [];

try {
    // 2. Buscar os dados básicos do aluno
    $stmtAluno = $pdo->prepare("SELECT id, nome, email FROM aluno WHERE id = ?");
    $stmtAluno->execute([$alunoId]);
    $aluno = $stmtAluno->fetch(PDO::FETCH_ASSOC);

    if (!$aluno) {
        http_response_code(404 ); // Not Found
        echo json_encode(["status" => "erro", "mensagem" => "Aluno não encontrado."]);
        exit();
    }
    $resposta['aluno'] = $aluno;

    // 3. Buscar as trilhas do aluno com o progresso
    $sqlTrilhas = "
        SELECT 
            t.id, 
            t.nome, 
            ta.progresso 
        FROM 
            trilha_aluno ta
        JOIN 
            trilha t ON ta.trilha_id = t.id
        WHERE 
            ta.aluno_id = ?
        ORDER BY 
            t.nome ASC
    ";
    
    $stmtTrilhas = $pdo->prepare($sqlTrilhas);
    $stmtTrilhas->execute([$alunoId]);
    $trilhas = $stmtTrilhas->fetchAll(PDO::FETCH_ASSOC);

    $resposta['trilhas'] = $trilhas;

    // 4. Retornar a resposta completa
    http_response_code(200 );
    echo json_encode($resposta);

} catch (PDOException $e) {
    http_response_code(500 );
    echo json_encode(["status" => "erro", "mensagem" => "Erro no servidor ao buscar dados do perfil."]);
}
?>