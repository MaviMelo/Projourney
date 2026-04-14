<?php
require_once "db.php";

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // POST para atualizar
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit();
}

// 1. Receber e decodificar os dados JSON
$dados = json_decode(file_get_contents("php://input"));

// 2. Validação dos dados recebidos
$statusPermitidos = ['Inscrito', 'Cursando', 'Suspenso', 'Concluido'];
if (
    !isset($dados->alunoId) || !is_numeric($dados->alunoId) ||
    !isset($dados->trilhaId) || !is_numeric($dados->trilhaId) ||
    !isset($dados->progresso) || !in_array($dados->progresso, $statusPermitidos)
) {
    http_response_code(400 );
    echo json_encode(["status" => "erro", "mensagem" => "Dados inválidos para atualização."]);
    exit();
}

$alunoId = $dados->alunoId;
$trilhaId = $dados->trilhaId;
$progresso = $dados->progresso;

// 3. Preparar e executar o comando UPDATE
$sql = "UPDATE trilha_aluno SET progresso = ? WHERE aluno_id = ? AND trilha_id = ?";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$progresso, $alunoId, $trilhaId]);

    // Verifica se alguma linha foi realmente alterada
    if ($stmt->rowCount() > 0) {
        http_response_code(200 );
        echo json_encode(["status" => "sucesso", "mensagem" => "Progresso atualizado com sucesso!"]);
    } else {
        // Isso pode acontecer se o registro não existir ou o status já for o mesmo
        http_response_code(404 );
        echo json_encode(["status" => "erro", "mensagem" => "Nenhum registro encontrado para atualizar."]);
    }

} catch (PDOException $e) {
    http_response_code(500 );
    echo json_encode(["status" => "erro", "mensagem" => "Erro no servidor ao atualizar o progresso."]);
}
?>
